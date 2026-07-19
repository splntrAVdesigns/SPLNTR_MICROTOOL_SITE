import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "SPLNTR builds audio and visual micro tools — small, sharp instruments for creative minds who make sound and motion.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-volt">About</p>
      <h1 className="mt-3 font-display text-3xl uppercase tracking-wide text-white sm:text-4xl">
        Forge. Reshape. Multiply.
      </h1>
      <div className="mt-8 space-y-6 leading-relaxed text-haze">
        <p>
          SPLNTR is an independent studio building audio and visual micro tools —
          small, sharp instruments designed for high impact and quick results.
          Sound design plus visual art equals expression, and every tool we ship
          serves that equation.
        </p>
        <p>
          We build with custom integrations and precise algorithms: GPU-powered
          design engines, audio-reactive shader systems, and performance plugins
          made for modern producers, designers, DJs, and creators. Efficiency and
          creative experimentation aren&apos;t opposites here — they&apos;re the
          whole point.
        </p>
        <p>
          Everything in the lineup is currently in closed beta. We test obsessively
          and release when it&apos;s right. If you want in early, join the waitlist —
          beta testers get a direct line to shape what we build next.
        </p>
      </div>
    </div>
  );
}
