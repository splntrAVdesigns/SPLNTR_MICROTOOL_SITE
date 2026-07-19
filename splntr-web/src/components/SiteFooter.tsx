import Link from "next/link";
import { SITE, LEGAL_DOCS } from "@/lib/site";
import { SplntrBolt } from "./SplntrLogo";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line/70 bg-panel/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-volt">
            <SplntrBolt className="h-5 w-5" />
            <span className="font-display italic tracking-widest">SPLNTR</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-haze">
            Audio &amp; visual micro tools for modern experimentation and application.
          </p>
        </div>

        <div>
          <h2 className="font-mono text-[0.68rem] uppercase tracking-[0.25em] text-volt-ice">Micro Tools</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-haze">
            <li><Link className="hover:text-volt-ice" href="/products/blendcraft-studio">BlendCraft Studio</Link></li>
            <li><Link className="hover:text-volt-ice" href="/products/orbital-visualizer">Orbital Visualizer</Link></li>
            <li><Link className="hover:text-volt-ice" href="/products/harmony-compass">Harmony Compass</Link></li>
            <li><Link className="hover:text-volt-ice" href="/products/slicer-pro">SPLNTR Slicer Pro</Link></li>
            <li><Link className="hover:text-volt-ice" href="/shop">Shop</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="font-mono text-[0.68rem] uppercase tracking-[0.25em] text-volt-ice">Legal</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-haze">
            {LEGAL_DOCS.map((d) => (
              <li key={d.slug}>
                <Link className="hover:text-volt-ice" href={`/legal/${d.slug}`}>{d.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-mono text-[0.68rem] uppercase tracking-[0.25em] text-volt-ice">Connect</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-haze">
            {SITE.socials.map((s) => (
              <li key={s.label}>
                <a className="hover:text-volt-ice" href={s.href} target="_blank" rel="noreferrer">{s.label}</a>
              </li>
            ))}
            <li><a className="hover:text-volt-ice" href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line/50 py-5 text-center font-mono text-[0.65rem] uppercase tracking-[0.25em] text-haze/70">
        © {new Date().getFullYear()} SPLNTR · Forge. Reshape. Multiply.
      </div>
    </footer>
  );
}
