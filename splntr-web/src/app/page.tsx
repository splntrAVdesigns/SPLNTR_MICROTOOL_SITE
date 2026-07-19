import Link from "next/link";
import dynamic from "next/dynamic";
import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import WaitlistForm from "@/components/WaitlistForm";
import MediaCarousel from "@/components/MediaCarousel";

// WebGL hero is client-only; a static gradient stands in while it loads.
const TerrainHero = dynamic(() => import("@/components/TerrainHero"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-volt-fade" aria-hidden="true" />,
});

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden border-b border-line/60">
        <TerrainHero />
        <div className="relative z-10 mx-auto max-w-4xl px-5 py-24 text-center">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.35em] text-volt">
            Audio &amp; visual micro tools
          </p>
          <h1 className="mt-6 font-display text-4xl font-bold uppercase leading-tight tracking-[0.06em] text-white sm:text-6xl">
            Forge<span className="text-volt">.</span> Reshape<span className="text-volt">.</span>
            <br />
            Multiply<span className="text-volt">.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-haze sm:text-lg">
            Digital tools to fast-track your projects, spark creativity, and enhance
            experimentation — built for creative minds who make sound and motion.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              className="rounded border border-volt/60 bg-volt/15 px-7 py-3.5 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-volt transition hover:bg-volt/25 hover:shadow-volt"
            >
              Explore the tools
            </Link>
            <Link
              href="#waitlist"
              className="rounded border border-line px-7 py-3.5 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-haze transition hover:border-volt/40 hover:text-volt-ice"
            >
              Join the beta
            </Link>
          </div>
        </div>
      </section>

      {/* ── Product grid ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-volt">Micro tools</p>
            <h2 className="mt-3 font-display text-2xl uppercase tracking-wide text-white sm:text-3xl">
              Built for efficiency &amp; creative experimentation
            </h2>
          </div>
          <Link href="/products" className="hidden shrink-0 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-haze hover:text-volt-ice sm:block">
            All tools →
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* ── Brand focus: what we build ───────────────────────────────── */}
      <section className="border-t border-line/60 bg-panel/30">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-volt">What we build</p>
          <h2 className="mt-3 max-w-2xl font-display text-2xl uppercase tracking-wide text-white sm:text-3xl">
            Audio, visual &amp; design — one lab
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                k: "01 / Audio",
                title: "Plugins & sound tools",
                body: "Performance samplers, slicing engines, and web audio platforms — AU, VST3, and browser-native instruments built for producers who play their tools live.",
              },
              {
                k: "02 / Visual",
                title: "Motion & reactive graphics",
                body: "GPU design engines and audio-reactive shader systems. Motion gradients, generative backgrounds, and live visuals that export at pro quality.",
              },
              {
                k: "03 / Design",
                title: "Creative applications",
                body: "Small, sharp apps that remove friction between idea and output — smart automation, precise algorithms, and workflows that keep you in flow.",
              },
            ].map((f) => (
              <div key={f.k} className="rounded-lg border border-line bg-panel/50 p-6 transition hover:border-volt/40">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.25em] text-volt">{f.k}</p>
                <h3 className="mt-3 font-display text-lg uppercase tracking-wide text-white">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-haze">{f.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rolling media strip — tiles swap to real app/plugin videos later */}
        <div className="pb-20">
          <MediaCarousel />
        </div>
      </section>

      {/* ── Manifesto strip ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-y border-line/60 bg-panel/40">
        <div className="scanlines relative mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2">
          <h2 className="font-display text-2xl uppercase leading-snug tracking-wide text-white sm:text-3xl">
            Custom integrations<br />&amp; precise algorithms<span className="text-volt">.</span>
          </h2>
          <div className="space-y-5 text-haze">
            <p className="leading-relaxed">
              Sound design plus visual art equals expression. Every SPLNTR tool is a small,
              sharp instrument — smart automation designed for high impact and quick results,
              whether you&apos;re slicing samples on stage or rendering motion graphics for a brand.
            </p>
            <p className="leading-relaxed">
              Built independently. Tested obsessively. Released when they&apos;re right.
            </p>
          </div>
        </div>
      </section>

      {/* ── Waitlist ─────────────────────────────────────────────────── */}
      <section id="waitlist" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-24 text-center">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-volt">Closed beta</p>
        <h2 className="mt-3 font-display text-2xl uppercase tracking-wide text-white sm:text-3xl">
          Get early access
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-haze">
          Every SPLNTR tool is currently in closed beta testing. Join the waitlist for
          invites, launch discounts, and a direct line to shape what we build.
        </p>
        <div className="mt-8 text-left">
          <WaitlistForm />
        </div>
      </section>
    </>
  );
}
