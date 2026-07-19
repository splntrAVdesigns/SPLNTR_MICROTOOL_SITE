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
    <header className="sticky top-0 z-50 border-b border-line/70 bg-void/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2.5" aria-label="SPLNTR home">
          <SplntrBolt className="h-5 w-5 text-volt" />
          <SplntrWordmark />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
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

        <button
          type="button"
          className="md:hidden text-haze"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
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
