"use client";

/**
 * TerrainHero — SPLNTR signature visual with optional audio reactivity.
 *
 * DEFAULT (always): the wireframe terrain renders and drifts on load.
 * LIVE (opt-in): mic bass energy raises ridge amplitude and glow.
 *
 * v3 — reliability + performance pass:
 *  - Wrapped in TerrainErrorBoundary: any WebGL failure degrades to a
 *    always-visible CSS fallback grid instead of a blank hero, and logs the
 *    real error to console for diagnosis.
 *  - Removed `powerPreference: "high-performance"` — this can cause context
 *    creation to fail outright on some integrated/mobile GPUs; default is
 *    the safer, more broadly compatible choice.
 *  - IntersectionObserver pauses the render loop entirely once the hero
 *    scrolls out of view, cutting GPU/main-thread cost during scroll (this
 *    targets the "heavy while scrolling" report directly).
 *  - Single render loop for audio analysis (unchanged from last pass) —
 *    still only one requestAnimationFrame source, driven by r3f.
 *  - Mic control now ships as two variants: a compact floating icon fixed
 *    to the viewport on mobile (independent of hero scroll, no overlap with
 *    hero CTAs), and the original pill inside the hero on desktop.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import TerrainErrorBoundary from "./TerrainErrorBoundary";

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uAudio;
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
    pos.z += e * mix(0.35, 2.6, corridor) * (1.0 + uAudio * 1.4);

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
    gl_FragColor = vec4(uColor * glow, fade * 0.9);
  }
`;

interface AudioPipe {
  analyser: AnalyserNode | null;
  bins: Uint8Array | null;
  level: number;
}

function TerrainMesh({
  animate,
  segments,
  audio,
}: {
  animate: boolean;
  segments: number;
  audio: React.MutableRefObject<AudioPipe>;
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
    const dt = Math.min(delta, 1 / 30);

    const a = audio.current;
    if (a.analyser && a.bins) {
      a.analyser.getByteFrequencyData(a.bins as Uint8Array<ArrayBuffer>);
      let sum = 0;
      for (let i = 0; i < 6; i++) sum += a.bins[i];
      const target = Math.min(1, (sum / (6 * 255)) * 1.6);
      a.level += (target - a.level) * (target > a.level ? 0.5 : 0.08);
    } else if (a.level > 0.001) {
      a.level *= 0.92;
    } else {
      a.level = 0;
    }

    if (animate) mat.uniforms.uTime.value += dt * (1.0 + a.level * 0.6);
    mat.uniforms.uAudio.value = a.level;
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

const FALLBACK_GRID = (
  <div
    aria-hidden="true"
    className="absolute inset-0 opacity-60"
    style={{
      background:
        "repeating-linear-gradient(90deg, rgba(38,168,255,0.22) 0 1.5px, transparent 1.5px 44px), repeating-linear-gradient(0deg, rgba(38,168,255,0.22) 0 1.5px, transparent 1.5px 44px)",
      transform: "perspective(600px) rotateX(55deg) scale(2.2)",
      transformOrigin: "center 85%",
      maskImage: "linear-gradient(180deg, transparent 0%, black 40%)",
      WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 40%)",
    }}
  />
);

type MicState = "idle" | "requesting" | "live" | "denied" | "unsupported";

export default function TerrainHero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [glReady, setGlReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [animate, setAnimate] = useState(true);
  const [segments, setSegments] = useState(150);
  const [mic, setMic] = useState<MicState>("idle");

  const audio = useRef<AudioPipe>({ analyser: null, bins: null, level: 0 });
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);

  const stopMic = useCallback(() => {
    audio.current.analyser = null;
    audio.current.bins = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    setMic("idle");
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setAnimate(!reduced);
    setSegments(window.innerWidth < 768 ? 90 : 150);
    setReady(true);
    return () => stopMic();
  }, [stopMic]);

  // Pause the render loop entirely once the hero scrolls out of view —
  // directly cuts GPU/main-thread cost while scrolling the rest of the page.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.01,
    });
    io.observe(el);
    return () => io.disconnect();
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
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.5;
      ctx.createMediaStreamSource(stream).connect(analyser);
      audio.current.bins = new Uint8Array(analyser.frequencyBinCount);
      audio.current.analyser = analyser;
      setMic("live");
    } catch (err) {
      console.warn("[TerrainHero] mic unavailable:", err);
      setMic("denied");
    }
  }, []);

  const micActive = animate; // hidden entirely under prefers-reduced-motion

  return (
    <div ref={rootRef} className="absolute inset-0">
      {FALLBACK_GRID}

      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: glReady ? 1 : 0 }}
        aria-hidden="true"
      >
        <TerrainErrorBoundary fallback={<></>}>
          {ready && (
            <Canvas
              dpr={[1, 1.75]}
              camera={{ position: [0, 1.4, 4.5], fov: 60 }}
              gl={{ antialias: true, alpha: true }}
              frameloop={animate && inView ? "always" : "demand"}
              className="opacity-90"
              onCreated={({ gl }) => {
                setGlReady(true);
                gl.domElement.addEventListener("webglcontextlost", (e) => {
                  console.error("[TerrainHero] WebGL context lost", e);
                  setGlReady(false);
                });
              }}
            >
              <TerrainMesh animate={animate} segments={segments} audio={audio} />
            </Canvas>
          )}
        </TerrainErrorBoundary>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#0A0C10_92%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-volt/40 to-transparent" />
      </div>

      {/* Desktop: pill control inside the hero (unchanged position) */}
      {micActive && (
        <div className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 sm:block">
          <MicButton mic={mic} onStart={startMic} onStop={stopMic} variant="pill" />
        </div>
      )}

      {/* Mobile: compact icon fixed to the viewport, independent of hero
          scroll — sits mid-right, never overlaps hero CTAs. */}
      {micActive && (
        <div className="fixed right-4 top-1/2 z-40 -translate-y-1/2 sm:hidden">
          <MicButton mic={mic} onStart={startMic} onStop={stopMic} variant="icon" />
        </div>
      )}
    </div>
  );
}

function MicButton({
  mic,
  onStart,
  onStop,
  variant,
}: {
  mic: MicState;
  onStart: () => void;
  onStop: () => void;
  variant: "pill" | "icon";
}) {
  const live = mic === "live";

  if (variant === "icon") {
    return (
      <div className="flex flex-col items-end gap-1.5">
        <button
          type="button"
          onClick={live ? onStop : onStart}
          disabled={mic === "requesting"}
          aria-label={live ? "Stop reacting to sound" : "React to sound"}
          className={`relative flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur transition disabled:opacity-60 ${
            live
              ? "border-volt/60 bg-volt/15 text-volt shadow-volt"
              : "border-line bg-void/70 text-haze hover:border-volt/50 hover:text-volt"
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
          </svg>
          {live && (
            <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-volt opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-volt" />
            </span>
          )}
        </button>
        {mic === "denied" && (
          <p className="max-w-[7rem] text-right font-mono text-[0.55rem] uppercase leading-tight tracking-[0.15em] text-haze/70">
            Mic blocked
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      {live ? (
        <button
          type="button"
          onClick={onStop}
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
          onClick={onStart}
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
    </>
  );
}
