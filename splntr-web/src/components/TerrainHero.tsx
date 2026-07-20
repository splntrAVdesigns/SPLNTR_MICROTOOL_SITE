"use client";

/**
 * TerrainHero — SPLNTR signature visual.
 *
 * A GLSL wireframe terrain: animated noise-displaced grid glowing electric
 * blue, fading into the void toward the horizon. Motion runs automatically
 * on load. This is the original, proven-stable version of this component.
 *
 * (Audio-reactive mode is parked — see README "future developments". Any
 * future attempt starts with console diagnostics, not feature code.)
 *
 * Performance rules baked in:
 *  - DPR capped at 1.75
 *  - Reduced segment count on small screens
 *  - Honors prefers-reduced-motion (renders a static frame)
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const VERT = /* glsl */ `
  uniform float uTime;
  varying float vElev;
  varying float vDist;

  // Cheap value noise — good enough for terrain, cheap on mobile GPUs.
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
    // Scroll the noise field toward the camera; two octaves for ridge detail.
    vec2 p = vec2(pos.x * 0.14, pos.y * 0.14 + uTime * 0.06);
    float e = noise(p) * 0.75 + noise(p * 2.3 + 7.0) * 0.25;
    // Flatten a corridor down the middle so the horizon reads clean.
    float corridor = smoothstep(0.6, 5.5, abs(pos.x));
    pos.z += e * mix(0.35, 2.6, corridor);

    vElev = e;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  varying float vElev;
  varying float vDist;

  void main() {
    // Brighter on ridges, fading with distance into the void.
    float glow = 0.35 + vElev * 0.9;
    float fade = 1.0 - smoothstep(6.0, 26.0, vDist);
    vec3 col = uColor * glow;
    gl_FragColor = vec4(col, fade * 0.9);
  }
`;

function TerrainMesh({ animate, segments }: { animate: boolean; segments: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#26A8FF") },
    }),
    []
  );

  useFrame((state) => {
    // Read absolute elapsed time rather than accumulating per-frame deltas:
    // accumulation can stall permanently if a device reports a zero/NaN
    // delta (throttled rAF on mobile), which freezes the terrain.
    if (animate && matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
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

export default function TerrainHero() {
  const [ready, setReady] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [segments, setSegments] = useState(150);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;
    setAnimate(!reduced);
    setSegments(small ? 90 : 150);
    setReady(true);
  }, []);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {ready && (
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, 1.4, 4.5], fov: 60 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          frameloop={animate ? "always" : "demand"}
          className="opacity-90"
        >
          <TerrainMesh animate={animate} segments={segments} />
        </Canvas>
      )}
      {/* Vignette + horizon glow so text stays readable over the grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#0A0C10_92%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-volt/40 to-transparent" />
    </div>
  );
}
