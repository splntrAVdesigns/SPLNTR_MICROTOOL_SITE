import Link from "next/link";
import type { Product, ProductStatus } from "@/lib/products";

const STATUS_LABEL: Record<ProductStatus, string> = {
  "closed-beta": "Closed beta",
  "coming-soon": "Coming Fall 2026",
  released: "Available now",
};

export function StatusChip({ status }: { status: ProductStatus }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-volt/40 bg-volt/10 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-volt">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-volt opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-volt" />
      </span>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col rounded-lg border border-line bg-panel/60 p-6 transition hover:border-volt/50 hover:shadow-volt"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.25em] text-haze">{product.kind}</span>
        <StatusChip status={product.status} />
      </div>
      <h3 className="mt-4 font-display text-xl uppercase tracking-wide text-white group-hover:text-volt-ice">
        {product.name}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-haze">{product.tagline}</p>
      <span className="mt-5 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-volt">
        View tool <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}
