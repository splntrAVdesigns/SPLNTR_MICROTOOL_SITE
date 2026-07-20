"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  /** Set for short looping clips (mp4/webm). Falls back to <Image> when absent. */
  video?: boolean;
}

/**
 * ProductGallery — carousel for product screenshots and short looping clips.
 *
 * Handles both stills and video in the same track: set `video: true` on an
 * item and drop an .mp4/.webm at that path. GIFs work too but are far heavier
 * than an equivalent muted mp4, so prefer video for motion.
 *
 * Behavior:
 *  - arrows + clickable thumbnails + left/right keyboard nav
 *  - first image gets priority loading, the rest lazy-load
 *  - single-item galleries render as a plain figure (no chrome)
 */
export default function ProductGallery({ items }: { items: GalleryItem[] }) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + items.length) % items.length),
    [items.length]
  );

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [go]);

  if (!items.length) return null;

  const current = items[index];
  const single = items.length === 1;

  return (
    <div
      ref={trackRef}
      tabIndex={0}
      className="w-full outline-none"
      aria-roledescription="carousel"
      aria-label="Product images"
    >
      <figure className="relative overflow-hidden rounded-lg border border-line bg-panel/40">
        <div className="relative aspect-[16/10] w-full">
          {current.video ? (
            <video
              key={current.src}
              src={current.src}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              fill
              priority={index === 0}
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          )}
        </div>

        {!single && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-void/75 text-haze backdrop-blur transition hover:border-volt/50 hover:text-volt"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-void/75 text-haze backdrop-blur transition hover:border-volt/50 hover:text-volt"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <span className="absolute right-3 top-3 rounded-full border border-line bg-void/75 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-haze backdrop-blur">
              {index + 1} / {items.length}
            </span>
          </>
        )}

        <figcaption className="border-t border-line/60 px-5 py-3 text-sm text-haze">
          {current.caption}
        </figcaption>
      </figure>

      {!single && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {items.map((it, i) => (
            <button
              key={it.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              className={`relative h-16 w-28 shrink-0 overflow-hidden rounded border transition ${
                i === index ? "border-volt shadow-volt" : "border-line opacity-60 hover:opacity-100"
              }`}
            >
              {it.video ? (
                <video src={it.src} muted playsInline className="h-full w-full object-cover" />
              ) : (
                <Image src={it.src} alt="" fill sizes="112px" className="object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
