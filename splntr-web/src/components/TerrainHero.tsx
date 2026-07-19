"use client";

/**
 * TerrainHero — SPLNTR signature visual, now AUDIO-REACTIVE.
 *
 * A GLSL wireframe terrain glowing electric blue. In idle mode it drifts
 * calmly. Click "React to sound" and (with mic permission) live audio drives
 * the terrain: bass energy raises ridge amplitude and line glow — Orbital
 * Visualizer's premise, demonstrated on the homepage.
 *
 * Architecture:
 *  - Audio analysis runs outside React state: an AnalyserNode feeds a shared
 *    mutable ref, read per-frame in useFrame → zero re-renders on the hot path
 *  - Bass (low-bin) energy with asymmetric smoothing: fast attack, slow release
 *  - Full cleanup on stop/unmount: tracks stopped, AudioContext closed
 *
 * Performance rules baked in:
 *  - DPR capped at 1.75; reduced segment count on small screens
 *  - Honors prefers-reduced-motion (static frame, mic button hidden)
 *  - deltaTime clamped to avoid jump-cuts after tab switches
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uAudio;      // smoothed 0..1 bass energy
  varying float vElev;
  varying float vDist;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  void main() {
    vec3 pos = position;
    vec2 p = vec2(pos.x * 0.14, pos.y * 0.14 + uTime * 0.06);
    float e = noise(p) * 0.75 + noise(p * 2.3 + 7.0) * 0.25;
    float corridor = smoothstep(0.6, 5.5, abs(pos.x));
    // Audio raises ridge amplitude (up to ~2.4x at full energy)
    float amp = mix(0.35, 2.6, corridor) * (1.0 + uAudio * 1.4);
    pos.z += e * amp;

    vElev = e * (1.0 + uAudio * 0.6);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uAudio;
  varying float vElev;
  varying float vDist;

  void main() {
    float glow = 0.35 + vElev * 0.9 + uAudio * 0.35;
    float fade = 1.0 - smoothstep(6.0, 26.0, vDist);
    vec3 col = uColor * glow;
    gl_FragColor = vec4(col, fade * 0.9);
  }
`;

/** Shared mutable audio level — written by the analyser loop, read per-frame. */
interface AudioLevelRef {
  current: number;
}

function TerrainMesh({
  animate,
  segments,
  audioLevel,
}: {
  animate: boolean;
  segments: number;
  audioLevel: AudioLevelRef;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAudio: { value: 0 },
      uColor: { value: new THREE.Color("#26A8FF") },
    }),
    []
  );

  useFrame((_, delta) => {
    const mat = matRef.current;
    if (!mat) return;
    const dt = Math.min(delta, 1 / 30); // clamp: no jump-cuts after tab switch
    if (animate) {
      // Audio also nudges scroll speed slightly for a "driving" feel
      mat.uniforms.uTime.value += dt * (1.0 + audioLevel.current * 0.6);
    }
    mat.uniforms.uAudio.value = audioLevel.current;
  });

  return (
    <mesh rotation={[-Math.PI / 2.35, 0, 0]} position={[0, -1.1, -6]}>
      <planeGeometry args={[44, 30, segments, Math.round(segments * 0.68)]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        wireframe
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

type MicState = "idle" | "requesting" | "live" | "denied" | "unsupported";

export default function TerrainHero() {
  const [ready, setReady] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [segments, setSegments] = useState(150);
  const [mic, setMic] = useState<MicState>("idle");

  // Shared audio level (0..1), smoothed. Mutable ref — no React state on the hot path.
  const audioLevel = useRef(0);
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;
    setAnimate(!reduced);
    setSegments(small ? 90 : 150);
    setReady(true);
    return () => stopMic(); // full cleanup on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopMic = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    audioLevel.current = 0;
    setMic("idle");
  }, []);

  const startMic = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMic("unsupported");
      return;
    }
    setMic("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;
      source.connect(analyser);
      const bins = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteFrequencyData(bins);
        // Bass energy: average of the lowest ~8 bins (roughly < 700 Hz at 44.1k)
        let sum = 0;
        for (let i = 0; i < 8; i++) sum += bins[i];
        const target = Math.min(1, sum / (8 * 255) * 1.6);
        // Asymmetric smoothing: fast attack, slower release → punchy but stable
        const prev = audioLevel.current;
        audioLevel.current = target > prev ? prev + (target - prev) * 0.5 : prev + (target - prev) * 0.08;
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
      setMic("live");
    } catch {
      setMic("denied");
    }
  }, []);

  const showMicButton = animate; // hidden under prefers-reduced-motion

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0" aria-hidden="true">
        {ready && (
          <Canvas
            dpr={[1, 1.75]}
            camera={{ position: [0, 1.4, 4.5], fov: 60 }}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            frameloop={animate ? "always" : "demand"}
            className="opacity-90"
          >
            <TerrainMesh animate={animate} segments={segments} audioLevel={audioLevel} />
          </Canvas>
        )}
        {/* Vignette + horizon glow so text stays readable over the grid */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#0A0C10_92%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-volt/40 to-transparent" />
      </div>

      {/* Mic control — the Orbital demo moment */}
      {showMicButton && (
        <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
          {mic === "live" ? (
            <button
              type="button"
              onClick={stopMic}
              className="flex items-center gap-2.5 rounded-full border border-volt/60 bg-volt/15 px-5 py-2.5 font-mono text-[0.62rem] uppercase tracking-[0.25em] text-volt shadow-volt transition hover:bg-volt/25"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-volt opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-volt" />
              </span>
              Live — reacting to sound · stop
            </button>
          ) : (
            <button
              type="button"
              onClick={startMic}
              disabled={mic === "requesting"}
              className="flex items-center gap-2.5 rounded-full border border-line bg-void/70 px-5 py-2.5 font-mono text-[0.62rem] uppercase tracking-[0.25em] text-haze backdrop-blur transition hover:border-volt/50 hover:text-volt disabled:opacity-60"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="9" y="3" width="6" height="11" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
              </svg>
              {mic === "requesting" ? "Requesting mic…" : "React to sound"}
            </button>
          )}
          {mic === "denied" && (
            <p className="mt-2 text-center font-mono text-[0.6rem] uppercase tracking-[0.2em] text-haze/70">
              Mic blocked — enable it in your browser settings to try this
            </p>
          )}
          {mic === "unsupported" && (
            <p className="mt-2 text-center font-mono text-[0.6rem] uppercase tracking-[0.2em] text-haze/70">
              Audio input isn&apos;t supported in this browser
            </p>
          )}
        </div>
      )}
    </div>
  );
}
