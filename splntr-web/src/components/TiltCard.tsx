"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

/**
 * TiltCard — cursor-reactive 3D tilt + spotlight glow.
 *
 * SCROLL-PERFORMANCE NOTE (v2):
 * The first version called getBoundingClientRect() inside onPointerMove.
 * That forces a synchronous layout on every pointer event, and browsers fire
 * pointermove continuously while scrolling — so with 4-8 cards on a page the
 * main thread was doing repeated forced reflows mid-scroll. That is the
 * "tug"/lag felt when scrolling on desktop.
 *
 * Fixes here:
 *  - rect is measured once on pointerenter and cached (invalidated on leave)
 *  - style writes are batched into a single requestAnimationFrame
 *  - effects disable themselves while the user is actively scrolling
 *
 * Net effect: zero layout reads during scroll, at most one style write per
 * frame while hovering.
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
  const rectRef = useRef<DOMRect | null>(null);
  const frameRef = useRef<number>(0);
  const pendingRef = useRef<{ px: number; py: number } | null>(null);
  const scrollingRef = useRef(false);
  const enabledRef = useRef(false);

  useEffect(() => {
    enabledRef.current =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Suppress tilt while scrolling; re-enable shortly after it stops.
    let t: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      scrollingRef.current = true;
      rectRef.current = null; // position changed — cached rect is stale
      clearTimeout(t);
      t = setTimeout(() => {
        scrollingRef.current = false;
      }, 120);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(t);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const flush = useCallback(() => {
    frameRef.current = 0;
    const el = ref.current;
    const p = pendingRef.current;
    if (!el || !p) return;
    const rx = (0.5 - p.py) * maxTilt;
    const ry = (p.px - 0.5) * maxTilt;
    el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    el.style.setProperty("--spot-x", `${(p.px * 100).toFixed(1)}%`);
    el.style.setProperty("--spot-y", `${(p.py * 100).toFixed(1)}%`);
    el.style.setProperty("--spot-o", "1");
  }, [maxTilt]);

  const onEnter = useCallback(() => {
    if (!enabledRef.current) return;
    // Single layout read per hover, not per move.
    rectRef.current = ref.current?.getBoundingClientRect() ?? null;
  }, []);

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!enabledRef.current || scrollingRef.current) return;
      const r = rectRef.current;
      if (!r) return;
      pendingRef.current = {
        px: (e.clientX - r.left) / r.width,
        py: (e.clientY - r.top) / r.height,
      };
      if (!frameRef.current) frameRef.current = requestAnimationFrame(flush);
    },
    [flush]
  );

  const onLeave = useCallback(() => {
    rectRef.current = null;
    pendingRef.current = null;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    el.style.setProperty("--spot-o", "0");
  }, []);

  return (
    <div
      ref={ref}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`group/tilt relative transition-transform duration-300 ease-out ${className}`}
      style={{ transform: "perspective(900px)" }}
    >
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
