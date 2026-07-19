import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LEGAL_DOCS, getLegalDoc } from "@/lib/site";

interface Params {
  params: { slug: string };
}

export function generateStaticParams() {
  return LEGAL_DOCS.map((d) => ({ slug: d.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const doc = getLegalDoc(params.slug);
  if (!doc) return {};
  return { title: doc.title };
}

export default function LegalPage({ params }: Params) {
  const doc = getLegalDoc(params.slug);
  if (!doc) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-volt">Legal</p>
      <h1 className="mt-3 font-display text-3xl uppercase tracking-wide text-white">{doc.title}</h1>
      <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-haze">
        Last updated {doc.updated}
      </p>
      <div className="mt-10 space-y-8">
        {doc.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-lg font-medium text-white">{s.heading}</h2>
            <p className="mt-3 leading-relaxed text-haze">{s.body}</p>
          </section>
        ))}
      </div>
      <p className="mt-12 rounded border border-line bg-panel/40 p-4 text-xs text-haze/70">
        Placeholder document — replace with reviewed legal text before launch.
      </p>
    </div>
  );
}
