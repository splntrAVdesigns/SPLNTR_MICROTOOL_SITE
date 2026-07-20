import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PRODUCTS, getProduct } from "@/lib/products";
import { StatusChip } from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import AudioPreviewPlayer from "@/components/AudioPreviewPlayer";
import WaitlistForm from "@/components/WaitlistForm";
import { SITE } from "@/lib/site";

interface Params {
  params: { slug: string };
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const product = getProduct(params.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.tagline,
    openGraph: {
      title: `${product.name} · SPLNTR`,
      description: product.tagline,
      images: [{ url: product.gallery?.[0]?.src ?? "/og-default.png" }],
    },
  };
}

export default function ProductPage({ params }: Params) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.tagline,
    applicationCategory: product.kind === "Audio Plugin" ? "MusicApplication" : "DesignApplication",
    operatingSystem: product.specs.find((s) => s.label === "Platform")?.value ?? "Web",
    url: `${SITE.url}/products/${product.slug}`,
    author: { "@type": "Organization", name: "SPLNTR" },
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <div className="flex flex-col items-start gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.25em] text-haze">{product.kind}</span>
          <StatusChip status={product.status} />
        </div>

        {product.logo ? (
          <>
            <Image
              src={product.logo}
              alt={product.name}
              width={1200}
              height={168}
              priority
              className="h-auto w-full max-w-lg"
            />
            <h1 className="sr-only">{product.name}</h1>
          </>
        ) : (
          <h1 className="font-display text-3xl uppercase tracking-wide text-white sm:text-5xl">
            {product.name}
          </h1>
        )}

        <p className="max-w-2xl text-lg leading-relaxed text-volt-ice">{product.tagline}</p>
        <p className="max-w-2xl leading-relaxed text-haze">{product.description}</p>
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-volt">{product.release}</p>
      </div>

      {/* Gallery — screenshots and looping clips. Add entries in products.ts. */}
      {product.gallery?.length ? (
        <section className="mt-10">
          <ProductGallery items={product.gallery} />
        </section>
      ) : (
        <div className="mt-10 flex aspect-video w-full items-center justify-center rounded-lg border border-line bg-panel/60">
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.25em] text-haze/60">
            Product media coming soon
          </span>
        </div>
      )}

      {/* Hear it — audio tools only (Slicer Pro, Harmony Compass) */}
      {product.audio && (
        <section className="mt-20">
          <h2 className="font-display text-xl uppercase tracking-wide text-white">Hear it</h2>
          <p className="mt-2 max-w-2xl text-sm text-haze">
            Sound-check {product.name} in the browser — no install required.
          </p>
          <div className="mt-6">
            <AudioPreviewPlayer tracks={product.audio} />
          </div>
        </section>
      )}

      {/* Features */}
      <section className="mt-20">
        <h2 className="font-display text-xl uppercase tracking-wide text-white">Features</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {product.features.map((f) => (
            <div key={f.title} className="rounded-lg border border-line bg-panel/50 p-5 transition hover:border-volt/40">
              <h3 className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-volt">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-haze">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Specs */}
      <section className="mt-20">
        <h2 className="font-display text-xl uppercase tracking-wide text-white">Specs</h2>
        <dl className="mt-6 divide-y divide-line/60 rounded-lg border border-line bg-panel/40">
          {product.specs.map((s) => (
            <div key={s.label} className="grid gap-1 px-5 py-4 sm:grid-cols-[200px_1fr]">
              <dt className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-haze">{s.label}</dt>
              <dd className="text-sm text-volt-ice">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* FAQ */}
      <section className="mt-20">
        <h2 className="font-display text-xl uppercase tracking-wide text-white">FAQ</h2>
        <div className="mt-6 space-y-4">
          {product.faq.map((f) => (
            <details key={f.q} className="group rounded-lg border border-line bg-panel/40 px-5 py-4">
              <summary className="cursor-pointer list-none text-sm font-medium text-white">
                <span className="mr-2 inline-block font-mono text-volt transition-transform group-open:rotate-90">›</span>
                {f.q}
              </summary>
              <p className="mt-3 pl-5 text-sm leading-relaxed text-haze">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="mt-20 scroll-mt-24">
        <h2 className="font-display text-xl uppercase tracking-wide text-white">
          Get {product.name} early
        </h2>
        <p className="mt-2 max-w-lg text-sm text-haze">
          Join the {product.name} waitlist for beta invites and launch news.
        </p>
        <div className="mt-6">
          <WaitlistForm product={product.slug} />
        </div>
      </section>
    </div>
  );
}
