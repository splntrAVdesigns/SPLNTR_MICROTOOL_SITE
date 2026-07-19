# SPLNTR Web — Next.js App

The production codebase for **splntr.com**: marketing, product pages, and (later)
accounts, licensing, and downloads. The Framer landing page remains a marketing
surface; this repo is the primary build going forward.

## Stack

- **Next.js 14 (App Router)** + TypeScript
- **Tailwind CSS 3.4** — brand tokens in `tailwind.config.ts` (`void`, `panel`, `volt`, etc.)
- **Three.js + @react-three/fiber** — signature GLSL wireframe terrain hero
- **React 18** — matches the BlendCraft Studio stack

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build check
```

## Recommended workflow (important)

This project does **not** run inside Figma / Figma Make — Figma Make is a Vite
SPA sandbox with no Next.js runtime, routing, or API routes. Instead:

1. Push this repo to **GitHub**.
2. Connect it to **Vercel** (free tier). Every push gets a live preview URL —
   that's your test/review surface, and production hosting.
3. Iterate with **Claude Code** against this repo (same sprint/patch loop as
   BlendCraft, but with real git history).

The visual components (`TerrainHero`, cards) are self-contained plain
React + three, so individual components *can* be pasted into Figma Make for
visual prototyping if ever useful — but the app lives here.

## Structure

```
src/
  app/
    layout.tsx            # fonts, metadata, nav/footer shell
    page.tsx              # home: terrain hero, product grid, waitlist
    products/page.tsx     # lineup index
    products/[slug]/      # per-product pages (features/specs/FAQ/waitlist + JSON-LD)
    about/  contact/      # brand + contact pages
    legal/[slug]/         # privacy, terms, eula, refunds (placeholder content)
    api/waitlist/route.ts # waitlist endpoint (logs now, Supabase later)
  components/             # TerrainHero, SiteNav, SiteFooter, ProductCard, WaitlistForm, SplntrLogo
  lib/
    products.ts           # single source of truth for the product catalog
    site.ts               # site constants + placeholder legal docs
```

## Before deploy — replace the TODOs

- `src/lib/site.ts`: real domain, branded email, real social links
- `src/components/SplntrLogo.tsx`: swap placeholder bolt for the real logo SVG paths
- `src/lib/site.ts` legal docs: replace with reviewed legal text (generator + review)
- Product pages: add real demo videos where the placeholder frames sit

## Supabase waitlist setup (one-time, ~5 min)

1. Create a free project at https://supabase.com (any name, e.g. `splntr`).
2. In the dashboard: **SQL Editor → New query**, paste the contents of
   `supabase/schema.sql`, and Run. This creates the locked-down `waitlist` table.
3. **Project Settings → API**: copy the Project URL and the `service_role` key.
4. Locally: copy `.env.local.example` to `.env.local` and fill both values,
   then restart `npm run dev`.
5. On Vercel: Project → Settings → Environment Variables → add the same two
   vars, then redeploy.
6. Test: submit the waitlist form, then check **Table Editor → waitlist** in
   Supabase — your row should appear.

Until env vars are set, the form still works and logs signups server-side.

## Parked for later ("future developments")

- Community page (Discord link-out or embedded forum)
- Beta tester quotes / social proof strip
- Press kit page (logo pack + screenshots) — expected by reviewers at launch
- "Built with our tools" proof strips per product page

## Roadmap (matches the strategy report)

- **Phase 2** — content depth: demo videos, changelog data per product, blog
  (MDX or Supabase-backed), per-product OG images.
- **Phase 3** — commerce (timed to Slicer Pro, Fall 2026):
  - Supabase: `waitlist` table DONE — next: Auth, then `licenses` +
    `downloads` with signed URLs from Storage
  - Merchant of Record: Lemon Squeezy checkout overlay + webhook → license row
  - Account area: `/account` (login, licenses, downloads)
  - macOS: Apple Developer ID signing + notarization for Slicer Pro installers

## Performance rules

The terrain hero caps DPR at 1.75, drops mesh density on mobile, honors
`prefers-reduced-motion`, and sits behind a dynamic import so it never blocks
first paint. Keep future WebGL sections on the same pattern: client-only,
capped DPR, static fallback.
