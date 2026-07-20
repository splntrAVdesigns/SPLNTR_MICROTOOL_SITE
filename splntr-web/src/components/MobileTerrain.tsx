"use client";

/**
 * MobileTerrain — CSS-only wireframe terrain for small screens.
 *
 * Why this exists: the WebGL hero animates reliably on desktop but proved
 * unreliable across mobile browsers (see README "future developments").
 * Rather than ship a frozen canvas, mobile gets a purpose-built hero that
 * matches the desktop look — same volt-blue wireframe grid receding to a
 * horizon — using only compositor-friendly CSS transforms.
 *
 * Cost: no WebGL context, no shader compile, no per-frame JS. The animation
 * is a single GPU-composited translate3d loop, which is effectively free on
 * battery compared to a canvas render loop.
 *
 * Design match to desktop:
 *  - identical volt (#26A8FF) line color and low opacity
 *  - perspective grid receding to a horizon line at the same vertical anchor
 *  - same radial vignette + horizon glow overlays as the WebGL version
 */

export default function MobileTerrain() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Ground plane: perspective grid scrolling toward the viewer.
          The grid is drawn twice the visible height and translated by exactly
          one tile so the loop is seamless. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[70%]"
        style={{
          perspective: "220px",
          perspectiveOrigin: "50% 0%",
          maskImage: "linear-gradient(180deg, transparent 0%, black 22%, black 100%)",
          WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 22%, black 100%)",
        }}
      >
        <div
          className="absolute inset-x-[-50%] top-0 h-[300%] motion-safe:animate-[terrainScroll_6s_linear_infinite]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(38,168,255,0.55) 0 1px, transparent 1px 44px)," +
              "repeating-linear-gradient(0deg, rgba(38,168,255,0.55) 0 1px, transparent 1px 44px)",
            transform: "rotateX(78deg)",
            transformOrigin: "50% 0%",
            willChange: "transform",
          }}
        />
      </div>

      {/* Distant ridge silhouette — echoes the noise peaks of the WebGL terrain
          so the mobile hero reads as the same landscape, not a flat floor. */}
      <div
        className="absolute inset-x-0 top-[26%] h-24 opacity-40"
        style={{
          background:
            "radial-gradient(120% 100% at 20% 100%, rgba(38,168,255,0.35), transparent 60%)," +
            "radial-gradient(90% 100% at 62% 100%, rgba(38,168,255,0.28), transparent 60%)," +
            "radial-gradient(80% 100% at 88% 100%, rgba(38,168,255,0.22), transparent 60%)",
          filter: "blur(2px)",
        }}
      />

      {/* Same overlays as the desktop hero, so both versions sit on identical
          lighting and keep hero text equally readable. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#0A0C10_92%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-volt/40 to-transparent" />
    </div>
  );
}
