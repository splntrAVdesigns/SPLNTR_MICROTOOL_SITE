"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface AudioTrack {
  src: string;
  title: string;
  note: string;
}

/**
 * Module-level singleton: guarantees only one snippet plays at a time across
 * every player instance on the page. Each player registers a "stop me"
 * callback; starting playback stops whoever held the slot before.
 */
let activeStop: (() => void) | null = null;

function formatTime(sec: number) {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function TrackRow({ track }: { track: AudioTrack }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const binsRef = useRef<Uint8Array | null>(null);

  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  /** Draw a volt-blue bar spectrum; falls back to a flat idle line when paused. */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    const bins = binsRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    const bars = 48;
    const barW = width / bars;

    if (analyser && bins) {
      analyser.getByteFrequencyData(bins as Uint8Array<ArrayBuffer>);
      for (let i = 0; i < bars; i++) {
        const v = bins[Math.floor((i / bars) * bins.length)] / 255;
        const h = Math.max(2, v * height * 0.9);
        ctx.fillStyle = `rgba(38,168,255,${0.35 + v * 0.65})`;
        ctx.fillRect(i * barW + barW * 0.2, (height - h) / 2, barW * 0.6, h);
      }
    } else {
      ctx.fillStyle = "rgba(38,168,255,0.25)";
      for (let i = 0; i < bars; i++) {
        ctx.fillRect(i * barW + barW * 0.2, height / 2 - 1, barW * 0.6, 2);
      }
    }
    rafRef.current = requestAnimationFrame(draw);
  }, []);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
    cancelAnimationFrame(rafRef.current);
  }, []);

  const start = useCallback(async () => {
    const el = audioRef.current;
    if (!el) return;

    // Enforce the single-playback rule before we start.
    if (activeStop && activeStop !== stop) activeStop();
    activeStop = stop;

    // Lazily build the analyser graph on first play (AudioContext must be
    // created from a user gesture to satisfy browser autoplay policies).
    if (!ctxRef.current) {
      try {
        const ctx = new AudioContext();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.7;
        ctx.createMediaElementSource(el).connect(analyser);
        analyser.connect(ctx.destination);
        ctxRef.current = ctx;
        analyserRef.current = analyser;
        binsRef.current = new Uint8Array(analyser.frequencyBinCount);
      } catch {
        // No Web Audio available — playback still works, just without the
        // live spectrum. Deliberately non-fatal.
      }
    }
    await ctxRef.current?.resume().catch(() => {});
    await el.play().catch(() => {});
    setPlaying(true);
    cancelAnimationFrame(rafRef.current);
    draw();
  }, [draw, stop]);

  useEffect(() => {
    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (activeStop === stop) activeStop = null;
      ctxRef.current?.close().catch(() => {});
    };
  }, [draw, stop]);

  return (
    <div className="rounded-lg border border-line bg-panel/50 p-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={playing ? stop : start}
          aria-label={playing ? `Pause ${track.title}` : `Play ${track.title}`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-volt/50 bg-volt/10 text-volt transition hover:bg-volt/20 hover:shadow-volt"
        >
          {playing ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <rect x="7" y="5" width="3.5" height="14" rx="1" />
              <rect x="13.5" y="5" width="3.5" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="currentColor">
              <path d="M8 5.5v13l11-6.5-11-6.5Z" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{track.title}</p>
          <p className="truncate text-xs text-haze">{track.note}</p>
        </div>

        <span className="shrink-0 font-mono text-[0.65rem] tracking-wider text-haze">
          {formatTime(time)} / {formatTime(duration)}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={600}
        height={48}
        className="mt-3 h-10 w-full rounded bg-void/50"
        aria-hidden="true"
      />

      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.01}
        value={time}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (audioRef.current) audioRef.current.currentTime = v;
          setTime(v);
        }}
        aria-label={`Seek ${track.title}`}
        className="mt-2 h-1 w-full cursor-pointer appearance-none rounded bg-line accent-volt"
      />

      <audio
        ref={audioRef}
        src={track.src}
        preload="metadata"
        crossOrigin="anonymous"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onEnded={stop}
      />
    </div>
  );
}

export default function AudioPreviewPlayer({
  tracks,
  emptyLabel = "Audio previews coming soon",
}: {
  tracks: AudioTrack[];
  emptyLabel?: string;
}) {
  if (!tracks.length) {
    return (
      <div className="flex items-center gap-4 rounded-lg border border-dashed border-line bg-panel/30 px-5 py-8">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-haze/60">
          <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="currentColor">
            <path d="M8 5.5v13l11-6.5-11-6.5Z" />
          </svg>
        </span>
        <div>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-haze">{emptyLabel}</p>
          <p className="mt-1 text-sm text-haze/70">
            Sound-check real slices and presets here before release.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tracks.map((t) => (
        <TrackRow key={t.src} track={t} />
      ))}
    </div>
  );
}
