"use client";

/**
 * MediaCarousel — right-to-left rolling strip of media tiles.
 *
 * SWAP-IN CONTRACT (locked): each tile is driven by the TILES array below.
 * To replace a generative placeholder with a real app/plugin video, drop the
 * file into /public/media/ and set `videoSrc` on that tile — nothing else
 * changes. Tiles with `videoSrc` render a muted looping <video>; tiles
 * without one render their generative animation.
 *
 * Performance: pure CSS/SVG animations (no WebGL — the terrain hero owns the
 * GPU), marquee pauses on hover, honors prefers-reduced-motion via the
 * global reduced-motion override in globals.css.
 */

interface Tile {
  id: string;
  label: string;
  videoSrc?: string; // e.g. "/media/blendcraft-loop.mp4"
  poster?: string;
}

const TILES: Tile[] = [
  { id: "waveform", label: "Sample slicing" },
  { id: "gradient", label: "Motion gradients" },
  { id: "signal", label: "Signal flow" },
  { id: "spectrum", label: "Audio analysis" },
  { id: "code", label: "Precise algorithms" },
  { id: "orbital", label: "Reactive visuals" },
  { id: "patch", label: "Sound design" },
  { id: "grid", label: "Visual FX" },
];

function TileVisual({ id }: { id: string }) {
  switch (id) {
    case "waveform":
      return (
        <svg viewBox="0 0 200 120" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
          {Array.from({ length: 40 }).map((_, i) => {
            const hgts = [12, 30, 52, 38, 70, 44, 88, 60, 34, 76];
            const h = hgts[(i * 7) % 10];
            return (
              <rect
                key={i}
                x={i * 5 + 1}
                y={60 - h / 2}
                width={3}
                height={h}
                rx={1.5}
                className="fill-volt/70"
                style={{ animation: `tilePulse 1.6s ease-in-out ${i * 0.07}s infinite` }}
              />
            );
          })}
          <line x1="92" y1="6" x2="92" y2="114" className="stroke-volt-ice" strokeWidth="1.5" style={{ animation: "tileSweep 3.5s linear infinite" }} />
        </svg>
      );
    case "gradient":
      return (
        <div className="h-full w-full" style={{ background: "conic-gradient(from 0deg at 50% 50%, #26A8FF, #7C4DFF, #FF4D9E, #26A8FF)", animation: "tileHue 8s linear infinite", filter: "blur(18px) saturate(1.2)", transform: "scale(1.4)" }} />
      );
    case "signal":
      return (
        <svg viewBox="0 0 200 120" className="h-full w-full" aria-hidden="true">
          <path id="sig" d="M10 90 C 50 90, 50 30, 100 30 S 150 90, 190 90" fill="none" className="stroke-line" strokeWidth="2" />
          <path d="M10 90 C 50 90, 50 30, 100 30 S 150 90, 190 90" fill="none" className="stroke-volt" strokeWidth="2" strokeDasharray="18 300" style={{ animation: "tileDash 2.4s linear infinite" }} />
          {[
            [10, 90],
            [100, 30],
            [190, 90],
          ].map(([x, y]) => (
            <circle key={`${x}`} cx={x} cy={y} r="5" className="fill-panel stroke-volt" strokeWidth="1.5" />
          ))}
        </svg>
      );
    case "spectrum":
      return (
        <div className="flex h-full w-full items-end justify-center gap-1.5 px-6 pb-6">
          {[38, 62, 84, 52, 96, 70, 44, 78, 58, 30].map((h, i) => (
            <div key={i} className="w-2.5 rounded-t bg-gradient-to-t from-volt-dim to-volt" style={{ height: `${h}%`, animation: `tileEq 1.1s ease-in-out ${i * 0.09}s infinite alternate`, transformOrigin: "bottom" }} />
          ))}
        </div>
      );
    case "code":
      return (
        <div className="flex h-full w-full flex-col justify-center gap-2 px-6 font-mono text-[0.55rem] text-volt/80">
          {["uniform float uTime;", "float e = noise(p);", "pos.z += e * ridge;", "gl_FragColor = glow;"].map((l, i) => (
            <div key={l} className="overflow-hidden whitespace-nowrap border-r border-volt/60" style={{ animation: `tileType 4s steps(24) ${i * 0.9}s infinite`, width: "0%" }}>
              {l}
            </div>
          ))}
        </div>
      );
    case "orbital":
      return (
        <div className="relative flex h-full w-full items-center justify-center">
          <div className="absolute h-20 w-20 rounded-full border-2 border-volt/70" style={{ animation: "tileRing 2.2s ease-out infinite" }} />
          <div className="absolute h-20 w-20 rounded-full border border-volt/40" style={{ animation: "tileRing 2.2s ease-out 1.1s infinite" }} />
          <div className="h-14 w-14 rounded-full border-2 border-dashed border-volt-ice/80" style={{ animation: "tileSpin 6s linear infinite" }} />
        </div>
      );
    case "patch":
      return (
        <svg viewBox="0 0 200 120" className="h-full w-full" aria-hidden="true">
          {[
            ["M20 20 C 80 20, 60 100, 180 95", "0s"],
            ["M20 60 C 90 55, 90 25, 180 30", "0.8s"],
            ["M20 100 C 70 100, 110 60, 180 62", "1.6s"],
          ].map(([d, delay]) => (
            <g key={d as string}>
              <path d={d as string} fill="none" className="stroke-line" strokeWidth="2" />
              <path d={d as string} fill="none" className="stroke-volt" strokeWidth="2" strokeDasharray="10 240" style={{ animation: `tileDash 3s linear ${delay} infinite` }} />
            </g>
          ))}
          {[20, 60, 100].map((y) => (
            <circle key={y} cx="20" cy={y} r="4.5" className="fill-void stroke-volt-ice" strokeWidth="1.5" />
          ))}
        </svg>
      );
    case "grid":
    default:
      return (
        <div className="relative h-full w-full overflow-hidden" style={{ background: "repeating-linear-gradient(90deg, rgba(38,168,255,0.18) 0 1px, transparent 1px 20px), repeating-linear-gradient(0deg, rgba(38,168,255,0.18) 0 1px, transparent 1px 20px)", transform: "perspective(160px) rotateX(45deg) scale(1.6)", transformOrigin: "center 80%" }}>
          <div className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-volt/30 to-transparent" style={{ animation: "tileScan 3s linear infinite" }} />
        </div>
      );
  }
}

function CarouselTile({ tile }: { tile: Tile }) {
  return (
    <figure className="relative h-40 w-64 shrink-0 overflow-hidden rounded-lg border border-line bg-panel/70 sm:h-44 sm:w-72">
      {tile.videoSrc ? (
        <video src={tile.videoSrc} poster={tile.poster} autoPlay muted loop playsInline className="h-full w-full object-cover" />
      ) : (
        <TileVisual id={tile.id} />
      )}
      <figcaption className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-void/90 to-transparent px-4 py-2.5 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-volt-ice">
        {tile.label}
      </figcaption>
    </figure>
  );
}

export default function MediaCarousel() {
  return (
    <div className="group relative overflow-hidden py-2" aria-label="SPLNTR visual showcase">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-void to-transparent" />
      {/* duplicated track for seamless loop; pauses on hover */}
      <div className="flex w-max gap-5 group-hover:[animation-play-state:paused]" style={{ animation: "marquee 40s linear infinite" }}>
        {[...TILES, ...TILES].map((t, i) => (
          <CarouselTile key={`${t.id}-${i}`} tile={t} />
        ))}
      </div>
    </div>
  );
}
