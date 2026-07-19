"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SplntrBolt, SplntrWordmark } from "./SplntrLogo";

const LINKS = [
  { href: "/products", label: "Micro Tools" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-void/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        {/* Left: wordmark only â€” icon mark now lives beside the nav links */}
        <Link href="/" aria-label="SPLNTR home">
          <SplntrWordmark className="h-[16px] w-auto text-volt" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          <SplntrBolt className="h-4 w-4 shrink-0 text-volt" />
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-mono text-[0.72rem] uppercase tracking-[0.22em] transition-colors ${
                pathname.startsWith(l.href) ? "text-volt" : "text-haze hover:text-volt-ice"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/products#waitlist"
            className="rounded border border-volt/50 bg-volt/10 px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-volt transition hover:bg-volt/20 hover:shadow-volt"
          >
            Join the beta
          </Link>
        </nav>

        {/* Mobile: tap the SPLNTR icon mark to open the menu */}
        <button
          type="button"
          className={`md:hidden transition-colors ${open ? "text-volt" : "text-haze"}`}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <SplntrBolt className="h-6 w-6" />
        </button>
      </div>

      {open && (
        <nav className="border-t border-line/70 bg-void px-5 py-4 md:hidden" aria-label="Mobile">
          <ul className="flex flex-col gap-4">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-mono text-xs uppercase tracking-[0.22em] text-haze"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/products#waitlist"
                onClick={() => setOpen(false)}
                className="font-mono text-xs uppercase tracking-[0.22em] text-volt"
              >
                Join the beta
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
