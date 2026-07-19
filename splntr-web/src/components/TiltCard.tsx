"use client";

import { useRef, useCallback, type ReactNode } from "react";

/**
 * TiltCard — cursor-reactive 3D tilt + spotlight glow.
 *
 * Wraps any card content. As the cursor moves, the card tilts toward it in
 * perspective and a soft volt-blue spotlight follows the pointer.
 *
 * Performance & accessibility:
 *  - Direct style writes (no React state) — zero re-renders during movement
 *  - Auto-disabled for touch devices (pointer: coarse) and reduced motion
 *  - GPU-composited transform only; resets smoothly on leave
 */
export default function TiltCard({
  children,
  className = "",
  maxTilt = 6,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const isFine = useCallback(() => {
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el || !isFine()) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width; // 0..1
      const py = (e.clientY - r.top) / r.height;
      const rx = (0.5 - py) * maxTilt; // tilt toward cursor
      const ry = (px - 0.5) * maxTilt;
      el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(0)`;
      el.style.setProperty("--spot-x", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--spot-y", `${(py * 100).toFixed(1)}%`);
      el.style.setProperty("--spot-o", "1");
    },
    [isFine, maxTilt]
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    el.style.setProperty("--spot-o", "0");
  }, []);

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`group/tilt relative transition-transform duration-300 ease-out will-change-transform ${className}`}
      style={{ transform: "perspective(900px)" }}
    >
      {/* Spotlight overlay following the cursor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 rounded-lg transition-opacity duration-300"
        style={{
          opacity: "var(--spot-o, 0)" as unknown as number,
          background:
            "radial-gradient(240px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(38,168,255,0.14), transparent 65%)",
        }}
      />
      {children}
    </div>
  );
}
