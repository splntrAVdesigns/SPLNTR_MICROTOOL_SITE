import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with SPLNTR — beta questions, support, press, and partnerships.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-volt">Contact</p>
      <h1 className="mt-3 font-display text-3xl uppercase tracking-wide text-white sm:text-4xl">
        Reach out
      </h1>
      <p className="mt-6 max-w-xl leading-relaxed text-haze">
        Beta questions, bug reports, press, or partnerships — email us and a human
        will reply.
      </p>
      <a
        href={`mailto:${SITE.email}`}
        className="mt-8 inline-block rounded border border-volt/60 bg-volt/15 px-7 py-3.5 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-volt transition hover:bg-volt/25 hover:shadow-volt"
      >
        {SITE.email}
      </a>
      <div className="mt-12 rounded-lg border border-line bg-panel/40 p-6 text-sm text-haze">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-volt-ice">Beta testers</p>
        <p className="mt-3 leading-relaxed">
          Already in a beta program? Reply directly to your invite email so your
          feedback lands with the right build thread.
        </p>
      </div>
    </div>
  );
}
