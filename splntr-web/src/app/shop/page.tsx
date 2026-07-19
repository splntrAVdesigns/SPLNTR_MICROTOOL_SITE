import type { Metadata } from "next";
import WaitlistForm from "@/components/WaitlistForm";
import TiltCard from "@/components/TiltCard";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "The SPLNTR shop — merch drops, custom audio sample packs, visual FX packs, and free downloadable content for producers and designers.",
};

interface ShopCategory {
  id: string;
  name: string;
  blurb: string;
  status: "coming-soon" | "live";
  tag: string;
}

/**
 * Categories are data-driven so real products slot in later: when commerce
 * lands (Phase 3), each category becomes a collection backed by the store
 * (Lemon Squeezy products / Supabase rows) and these cards link into it.
 */
const CATEGORIES: ShopCategory[] = [
  {
    id: "merch",
    name: "Merch",
    blurb: "SPLNTR wearables and studio goods. Limited drops in the brand's electric-blue-on-void style.",
    status: "coming-soon",
    tag: "Drops",
  },
  {
    id: "sample-packs",
    name: "Audio Sample Packs",
    blurb: "Custom-designed one-shots, loops, and slice-ready material — built with our own tools, cleared for your releases.",
    status: "coming-soon",
    tag: "Audio",
  },
  {
    id: "fx-packs",
    name: "Visual FX Packs",
    blurb: "Motion backgrounds, gradient loops, and HUD graphics rendered in BlendCraft Studio. Drag straight into your edits.",
    status: "coming-soon",
    tag: "Visual",
  },
  {
    id: "free",
    name: "Free Downloads",
    blurb: "Free content between releases — starter packs, presets, and experiments. Our way of keeping the lab door open.",
    status: "coming-soon",
    tag: "Free",
  },
];

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-20">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-volt">Shop</p>
      <h1 className="mt-3 font-display text-3xl uppercase tracking-wide text-white sm:text-4xl">
        Sounds, visuals &amp; drops
      </h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-haze">
        Merch, custom audio sample packs, visual FX packs, and free downloads —
        all made with the same tools we build. The shop opens alongside our first
        public releases.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {CATEGORIES.map((c) => (
          <TiltCard key={c.id}>
          <div
            className="group relative flex flex-col rounded-lg border border-line bg-panel/60 p-6 transition hover:border-volt/50 hover:shadow-volt"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.25em] text-haze">{c.tag}</span>
              <span className="rounded-full border border-volt/40 bg-volt/10 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-volt">
                {c.status === "live" ? "Live" : "Coming soon"}
              </span>
            </div>
            <h2 className="mt-4 font-display text-xl uppercase tracking-wide text-white group-hover:text-volt-ice">
              {c.name}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-haze">{c.blurb}</p>
          </div>
          </TiltCard>
        ))}
      </div>

      <section id="notify" className="mt-20 scroll-mt-24 max-w-2xl">
        <h2 className="font-display text-xl uppercase tracking-wide text-white">Get first access</h2>
        <p className="mt-2 text-sm text-haze">
          Join the list and we&apos;ll let you know when drops, packs, and free
          downloads go live.
        </p>
        <div className="mt-6">
          <WaitlistForm product="shop" />
        </div>
      </section>
    </div>
  );
}
