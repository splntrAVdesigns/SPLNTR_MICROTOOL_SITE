import type { Metadata } from "next";
import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import WaitlistForm from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "Micro Tools",
  description:
    "The SPLNTR lineup — SPLNTR Slicer Pro, BlendCraft Studio, Orbital Visualizer, and Harmony Compass. Audio and visual micro tools in closed beta.",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-20">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-volt">The lineup</p>
      <h1 className="mt-3 font-display text-3xl uppercase tracking-wide text-white sm:text-4xl">
        Micro Tools
      </h1>
      <p className="mt-4 max-w-2xl text-haze">
        Small, sharp instruments for sound and motion. Each tool does one job with
        precision — and they&apos;re built to work the way you actually create.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      <section id="waitlist" className="mt-20 scroll-mt-24">
        <h2 className="font-display text-xl uppercase tracking-wide text-white">Join the beta</h2>
        <p className="mt-2 max-w-lg text-sm text-haze">
          One list covers the whole lineup — tell us what you make and we&apos;ll match
          you to the right beta wave.
        </p>
        <div className="mt-6">
          <WaitlistForm />
        </div>
      </section>
    </div>
  );
}
