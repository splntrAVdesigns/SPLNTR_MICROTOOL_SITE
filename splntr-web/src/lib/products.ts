export type ProductStatus = "closed-beta" | "dev-stage" | "coming-soon" | "released";

export interface Product {
  slug: string;
  name: string;
  kind: "Web App" | "Audio Plugin";
  tagline: string;
  description: string;
  status: ProductStatus;
  release: string;
  /** Product logo (transparent WebP) shown on the product page hero. */
  logo?: string;
  /**
   * Screenshot gallery / carousel. Add entries here to populate the product
   * page carousel. Set `video: true` for short looping .mp4/.webm clips.
   */
  gallery?: { src: string; alt: string; caption: string; video?: boolean }[];
  features: { title: string; body: string }[];
  specs: { label: string; value: string }[];
  faq: { q: string; a: string }[];
}

export const PRODUCTS: Product[] = [
  {
    slug: "slicer-pro",
    name: "SPLNTR Slicer Pro",
    kind: "Audio Plugin",
    tagline: "Slice. Perform. Transform. An advanced sample slicing and performance plugin for modern producers.",
    description:
      "Slicer Pro is a performance sampler built for producers, sound designers, DJs, and live performers. Intelligent slicing, creative loop modes, OSC/LFO modulation, and a dual filter + macro system — wrapped in a super intuitive slicing engine.",
    status: "coming-soon",
    release: "Fall 2026 · AU / VST3 / Standalone · macOS first (Windows coming)",
    logo: "/media/slicer-pro/logo.webp",
    gallery: [
      {
        src: "/media/slicer-pro/ui-full.webp",
        alt: "SPLNTR Sample Slicer Pro full interface showing waveform editor, oscillators, LFOs, filters and macro controls",
        caption: "The full interface — waveform editor, dual oscillators, LFOs, filters, and six assignable macros.",
      },
      {
        src: "/media/slicer-pro/ui-daw.webp",
        alt: "SPLNTR Sample Slicer Pro running as a plugin inside a DAW",
        caption: "Running in-session as an AU/VST3 plugin, with host sync and live slice playback.",
      },
    ],
    features: [
      { title: "Intelligent sample slicing", body: "Fast, musical slice detection with a workflow built for performance, not menu-diving." },
      { title: "Performance playback engine", body: "Trigger, retrigger, and remix slices live. Built for hands-on playing." },
      { title: "Creative loop modes", body: "Loop, reverse, and transform slices into new material on the fly." },
      { title: "Advanced waveform editor", body: "Precision editing with visual analysis so you always see what you hear." },
      { title: "OSC / LFO modulation", body: "Modulate anything. Dual filters and a macro system keep it playable." },
      { title: "Sound sculpting FX", body: "Shape slices into finished sounds without leaving the plugin." },
    ],
    specs: [
      { label: "Formats", value: "AU, VST3, Standalone" },
      { label: "Platform", value: "macOS (Windows coming)" },
      { label: "Release", value: "Fall 2026" },
      { label: "Status", value: "Closed beta testing" },
    ],
    faq: [
      { q: "When does Slicer Pro release?", a: "Fall 2026, macOS first with AU, VST3, and Standalone builds. A Windows version follows." },
      { q: "Will there be a demo?", a: "Yes — a fully functional trial is planned at launch, so you can test it in your own sessions before buying." },
      { q: "How do I join the beta?", a: "Join the waitlist and tell us about your setup. Beta invites go out in waves." },
    ],
  },
  {
    slug: "blendcraft-studio",
    name: "BlendCraft Studio",
    kind: "Web App",
    tagline: "Motion gradients, generative backgrounds, and branded visuals — rendered on the GPU, exported in minutes.",
    description:
      "BlendCraft Studio is a WebGL design engine for professional motion graphics. Layer animated gradients, masks, textures, and uploaded media, then export high-quality images and video straight from the browser.",
    status: "closed-beta",
    release: "In closed beta",
    features: [
      { title: "GPU gradient engine", body: "Layered gradient types with real-time shader rendering. No plugins, no render farm — your GPU does the work." },
      { title: "Mask & texture layers", body: "Shape patterns, spackle, grunge, and custom image masks. Stack them, blend them, animate them." },
      { title: "Media layers", body: "Upload images and video, apply tone controls and gradient LUTs, and composite them with your gradient stack." },
      { title: "Smooth motion FX", body: "Per-layer animation with precision easing. Motion is the product — it stays smooth at export resolution." },
      { title: "Pro export pipeline", body: "MP4 and WebM video via WebCodecs, plus high-resolution stills. What you preview is what you ship." },
      { title: "Built for brand work", body: "Palettes, presets, and repeatable looks — designed for HUD graphics, backdrops, and branded content." },
    ],
    specs: [
      { label: "Platform", value: "Browser (WebGL 2 capable)" },
      { label: "Engine", value: "WebGL / GLSL, GPU accelerated" },
      { label: "Export", value: "MP4, WebM, PNG" },
      { label: "Recommended", value: "Desktop Chrome or Edge, dedicated GPU" },
    ],
    faq: [
      { q: "Do I need to install anything?", a: "No. BlendCraft Studio runs entirely in the browser. A WebGL 2 capable machine is all it takes." },
      { q: "Can I use exports commercially?", a: "Yes — everything you create and export is yours to use in client and commercial work." },
      { q: "How do I get access?", a: "BlendCraft Studio is in closed beta. Join the waitlist and we'll invite testers in waves." },
    ],
  },
  {
    slug: "orbital-visualizer",
    name: "Orbital Visualizer",
    kind: "Web App",
    tagline: "Real-time audio-reactive visuals for live events, DJs, streamers, and content creators.",
    description:
      "Orbital Visualizer turns audio into motion. A WebGL shader engine listens to your sound and drives reactive rings, waves, and particle fields you can style, brand, and perform with live.",
    status: "closed-beta",
    release: "In closed beta",
    features: [
      { title: "Audio-reactive core", body: "Live frequency analysis drives every visual parameter. The visuals move because the music does." },
      { title: "Shader visual engine", body: "GPU-rendered scenes built for projection, capture, and streaming overlays." },
      { title: "Performance-ready", body: "Low-latency response tuned for live sets and long sessions." },
      { title: "Brandable looks", body: "Colors, logos, and presets so your visuals match your identity, not a stock template." },
    ],
    specs: [
      { label: "Platform", value: "Browser (WebGL 2 capable)" },
      { label: "Input", value: "Live audio / system audio capture" },
      { label: "Use cases", value: "Live events, DJ sets, streams, content" },
    ],
    faq: [
      { q: "Does it work with any audio source?", a: "Orbital listens to live or system audio, so it works alongside your DAW, DJ software, or stream setup." },
      { q: "How do I get access?", a: "Orbital Visualizer is in closed beta. Join the waitlist for an invite." },
    ],
  },
  {
    slug: "harmony-compass",
    name: "Harmony Compass",
    kind: "Web App",
    tagline: "A modern music theory and sound design platform — learn, analyze, and create faster.",
    description:
      "Harmony Compass is a web-based audio engine for producers who want theory to work for them. Explore harmony, analyze ideas, and turn understanding into sound without leaving the browser.",
    status: "dev-stage",
    release: "In development",
    features: [
      { title: "Theory that plays", body: "Hear every concept as sound. Scales, chords, and progressions are playable, not just diagrams." },
      { title: "Analysis tools", body: "Break down ideas and understand why they work — then reuse the pattern in your own music." },
      { title: "Web-based audio engine", body: "Instant sound in the browser. No installs, no routing, no setup friction." },
    ],
    specs: [
      { label: "Platform", value: "Browser" },
      { label: "Engine", value: "Web Audio" },
      { label: "Audience", value: "Producers, sound designers, students" },
    ],
    faq: [
      { q: "Is this a course?", a: "No — it's a tool. Harmony Compass is built for exploring and applying theory while you work, at your own pace." },
      { q: "How do I get access?", a: "Harmony Compass is in closed beta. Join the waitlist for an invite." },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
