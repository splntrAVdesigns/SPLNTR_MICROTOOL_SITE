import Link from "next/link";
import type { Product, ProductStatus } from "@/lib/products";
import TiltCard from "./TiltCard";

/**
 * Status system — each state has its own color identity:
 *   closed-beta  -> volt blue      dev-stage -> purple
 *   coming-soon  -> green          released  -> green
 */
const STATUS_STYLE: Record<ProductStatus, { label: string; chip: string; dot: string }> = {
  "closed-beta": {
    label: "Closed beta",
    chip: "border-volt/40 bg-volt/10 text-volt",
    dot: "bg-volt",
  },
  "dev-stage": {
    label: "Dev stage",
    chip: "border-violet-400/40 bg-violet-400/10 text-violet-300",
    dot: "bg-violet-400",
  },
  "coming-soon": {
    label: "Coming Fall 2026",
    chip: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
    dot: "bg-emerald-400",
  },
  released: {
    label: "Available now",
    chip: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
    dot: "bg-emerald-400",
  },
};

export function StatusChip({ status }: { status: ProductStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.2em] ${s.chip}`}>
      <span className="relative flex h-1.5 w-1.5">
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 motion-reduce:hidden ${s.dot}`} />
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${s.dot}`} />
      </span>
      {s.label}
    </span>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <TiltCard>
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
    </TiltCard>
  );
}
