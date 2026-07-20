# SPLNTR Web

Production codebase for **[splntr-microtools.com](https://splntr-microtools.com)** — the marketing and product site for SPLNTR's audio and visual micro tools.

**Live:** https://splntr-microtools.com
**Hosting:** Vercel (auto-deploys from `main`)
**Plan:** see `SPLNTR-WEB-DEVELOPMENT-PLAN.md` for the phased roadmap

---

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS 3.4** — brand tokens in `tailwind.config.ts` (`void`, `panel`, `line`, `volt`, `volt-ice`, `haze`)
- **Three.js + @react-three/fiber** — GLSL wireframe terrain hero (desktop/tablet)
- **Supabase** — waitlist storage (Postgres + RLS)
- **React 18** — matches the BlendCraft Studio stack

> **Dependency policy:** never run `npm audit fix --force`. It upgrades Next.js across a major version and breaks the build. A deliberate Next 15 + React 19 + r3f 9 upgrade sprint is planned post-launch.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build check
```

Node 20 recommended (via `nvm`). If `npx next --version` doesn't report `14.2.x`, reinstall from a clean `package.json`.

## Project structure

```
src/
  app/
    layout.tsx              # fonts, metadata, icons, OG defaults, nav/footer shell
    page.tsx                # home: terrain hero, product grid, pillars, carousel, waitlist
    products/page.tsx       # Micro Tools index
    products/[slug]/        # per-product page (gallery, audio, features, specs, FAQ, waitlist)
    shop/page.tsx           # Shop — merch, sample packs, FX packs, free downloads
    about/  contact/        # brand + contact
    legal/[slug]/           # privacy, terms, eula, refunds
    api/waitlist/route.ts   # waitlist endpoint -> Supabase
    sitemap.ts  robots.ts   # auto-generated from product + legal data
  components/
    TerrainHero.tsx         # WebGL terrain (desktop/tablet)
    MobileTerrain.tsx       # CSS terrain (phones) — see performance notes
    MediaCarousel.tsx       # home marquee strip
    ProductGallery.tsx      # product image/video carousel
    AudioPreviewPlayer.tsx  # playable audio snippets w/ live spectrum
    ProductCard.tsx         # card + StatusChip (color-coded status system)
    TiltCard.tsx            # cursor-reactive 3D tilt wrapper
    SiteNav.tsx  SiteFooter.tsx  SplntrLogo.tsx  WaitlistForm.tsx
  lib/
    products.ts             # SINGLE SOURCE OF TRUTH for the product catalog
    site.ts                 # site constants + legal document content
    supabase.ts             # server-only Supabase client
public/
  media/<product-slug>/     # product screenshots, clips, audio
  og-default.png  favicon.*  icon-*.png  manifest.webmanifest
```

## Common tasks

### Add a product image or video clip

1. Drop the file in `public/media/<product-slug>/` (WebP for stills, MP4/WebM for motion)
2. Add an entry to that product's `gallery` array in `src/lib/products.ts`:

```ts
gallery: [
  { src: "/media/slicer-pro/ui-full.webp", alt: "...", caption: "..." },
  { src: "/media/slicer-pro/slice-demo.mp4", alt: "...", caption: "...", video: true },
]
```

The first entry loads by default and doubles as the page's OG share image. Prefer MP4 over GIF for motion — same look, a fraction of the weight.

### Add an audio preview

1. Drop MP3s (128–192 kbps) in `public/media/<product-slug>/audio/`
2. Add entries to that product's `audio` array:

```ts
audio: [
  { src: "/media/slicer-pro/audio/braam-slice.mp3", title: "Deep Braam — 16 slices", note: "Full to sliced, FWD mode" },
]
```

An empty array (`audio: []`) renders the "coming soon" state. Omitting the field entirely hides the section — correct for visual/design tools.

### Add a product

Append to `PRODUCTS` in `src/lib/products.ts`. Page, route, sitemap entry, and card all generate from that array. Order in the array = display order.

### Change a status chip

`ProductStatus` in `products.ts` supports `closed-beta` (volt blue), `dev-stage` (purple), `coming-soon` / `released` (green). Colors are mapped in `ProductCard.tsx`.

## Supabase waitlist

Schema lives in `supabase/schema.sql`. Env vars (locally in `.env.local`, and in Vercel → Settings → Environment Variables):

```
NEXT_PUBLIC_SITE_URL=https://splntr-microtools.com
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<server-only secret>
```

The service-role key is **server-only** — `src/lib/supabase.ts` imports `server-only`, so any accidental client import becomes a build error. The `waitlist` table has RLS enabled with an explicit deny-all policy for anon/authenticated roles; inserts happen only through the API route.

Without env vars configured, the form still works and logs signups to the server console instead of failing.

## Performance notes

- The WebGL hero is the only WebGL surface on the site. Keep it that way.
- Terrain caps DPR at 1.75, reduces mesh density under 768px, honors `prefers-reduced-motion`.
- **Phones get `MobileTerrain` (CSS) instead of WebGL** — a deliberate split, not a fallback. WebGL animation proved unreliable across mobile browsers; the CSS version matches the desktop look, skips shader compile, and saves battery. Breakpoint is `max-width: 767px`, so tablets get the WebGL version.
- The home carousel animates one GPU-composited transform and sits behind `content-visibility: auto`, so it costs nothing while offscreen. Spacing lives on each tile (`mr-5`) rather than a container `gap` — this keeps the duplicated track exactly 2x one set so the `-50%` loop is seamless.
- Every video ships with a poster and lazy-loads.

## Parked / future developments

- **Audio-reactive hero terrain (mic-driven)** — removed after causing WebGL render failures on real hardware that couldn't be reproduced headlessly. Rule for revisiting: ship a diagnostics build first (log context creation, shader compile status, errors), confirm root cause from real browser console output, *then* reintroduce.
- Branded email (`info@`) — parked to Phase 5, alongside Resend for waitlist announcements
- Community page (Discord or embedded forum)
- Press kit page (logo pack, screenshots, boilerplate)
- Beta-tester quotes / social proof
- Per-product "built with our tools" proof strips

## Before first paid sale

- Legal review of the **EULA** and **Refund Policy** in `src/lib/site.ts` (drafted for this specific business model, but not lawyer-reviewed)
- Apple Developer Program ($99/yr) → code-signing + notarization for macOS plugin builds
- Merchant-of-Record checkout + license delivery (see Phase 5 of the development plan)
