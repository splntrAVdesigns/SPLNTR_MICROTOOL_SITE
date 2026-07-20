export const SITE = {
  name: "SPLNTR",
  title: "SPLNTR — Audio & Visual Micro Tools",
  description:
    "Forge. Reshape. Multiply. Audio and visual micro tools for creative minds — GPU-powered design engines, audio-reactive visuals, and performance plugins.",
  /**
   * Canonical site URL, used for metadataBase / OG image resolution.
   * Priority: explicit env var -> Vercel deployment URL -> production domain.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "https://www.splntr-microtools.com"),
  email: "info@splntr-microtools.com",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/splntr_av_tools" },
    { label: "YouTube", href: "https://youtube.com/@splntrdesigns" },
    { label: "Facebook", href: "https://www.facebook.com/share/17wfR78WuK/" },
    // TikTok: add href when the account is live
    { label: "TikTok", href: "" },
  ].filter((s) => s.href !== "" || false),
};

export interface LegalDoc {
  slug: string;
  title: string;
  updated: string;
  intro?: string;
  sections: { heading: string; body: string }[];
}

/**
 * Legal documents — written for SPLNTR's actual business model (browser-based
 * creative tools + downloadable audio plugins, beta programs, digital goods).
 *
 * NOTE: These are drafted in plain, specific language rather than generic
 * boilerplate, but they are NOT a substitute for review by a lawyer. Have the
 * EULA and Refund Policy reviewed before the first paid sale — those two
 * govern money and license rights.
 */
export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    updated: "July 2026",
    intro:
      "SPLNTR builds creative tools, not advertising products. We collect the minimum needed to run beta programs, deliver software, and answer your questions — nothing else.",
    sections: [
      {
        heading: "What we collect",
        body: "When you join a waitlist we collect your email address and, optionally, the role you select (producer, designer, DJ, creator). When you email us we receive whatever you send. If you purchase software in the future, our payment provider processes your payment and shares order and license details with us — we never see or store your full card number.",
      },
      {
        heading: "What we don't collect",
        body: "Our tools do their work on your machine or in your browser. We do not collect, upload, or analyze the audio, images, video, projects, or exports you create with SPLNTR software. Your creative work stays yours and stays local.",
      },
      {
        heading: "How we use it",
        body: "We use your email to send beta invites, release announcements, and development updates for the products you signed up for. We use aggregate, anonymous analytics to understand which pages people visit so we can improve the site. We do not sell, rent, or trade your personal information to anyone.",
      },
      {
        heading: "Who else touches your data",
        body: "We rely on a small set of service providers to operate: Vercel (website hosting), Supabase (database storing waitlist signups and, later, accounts), and — once commerce launches — a payment processor and email delivery service. Each processes data only to provide their service to us.",
      },
      {
        heading: "Your choices",
        body: "Every email we send includes an unsubscribe link. You can request a copy of your data or ask us to delete it entirely by emailing us — we'll action deletion requests promptly and confirm when it's done.",
      },
      {
        heading: "Children",
        body: "SPLNTR products are intended for general audiences and are not directed at children under 13. We do not knowingly collect information from children under 13.",
      },
      {
        heading: "Changes and contact",
        body: "If this policy changes materially, we'll update the date at the top and note it in our dev log. Questions about privacy or your data can go to the contact address listed on our Contact page.",
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Service",
    updated: "July 2026",
    intro:
      "These terms cover your use of the SPLNTR website and beta programs. Purchased software is governed separately by our End User License Agreement.",
    sections: [
      {
        heading: "Using this site",
        body: "By using splntr-microtools.com you agree to these terms. The site and its content are provided for information about SPLNTR products, beta programs, and releases. We may update, change, or discontinue any part of the site at any time.",
      },
      {
        heading: "Beta programs",
        body: "Beta builds are pre-release software provided for testing. They may contain bugs, behave unpredictably, change without notice, or be discontinued entirely. Do not rely on beta builds for critical or deadline-bound production work, and keep backups of any project you open with them. Beta access is personal to you and cannot be shared, resold, or transferred.",
      },
      {
        heading: "Beta feedback",
        body: "If you send us feedback, bug reports, or feature suggestions, we may use them to improve our products without obligation or compensation to you. You keep ownership of anything you create; we simply gain the freedom to act on ideas you volunteer.",
      },
      {
        heading: "Intellectual property",
        body: "SPLNTR branding, logos, product names, software, shaders, and site content are our property. You may not copy, redistribute, reverse engineer, or create derivative works from them, and you may not redistribute builds, installers, or license keys.",
      },
      {
        heading: "Acceptable use",
        body: "Don't attempt to breach, overload, or probe the security of this site, and don't use it to distribute malware or unlawful content. We may suspend access for anyone who does.",
      },
      {
        heading: "Disclaimers and liability",
        body: "The site and beta software are provided \"as is\" without warranties of any kind. To the maximum extent permitted by law, SPLNTR is not liable for indirect, incidental, or consequential damages, including lost work or lost profits, arising from your use of the site or beta software.",
      },
    ],
  },
  {
    slug: "eula",
    title: "End User License Agreement",
    updated: "July 2026",
    intro:
      "This agreement governs SPLNTR software you purchase or download — including plugins such as SPLNTR Slicer Pro, browser-based tools, and any content packs we distribute.",
    sections: [
      {
        heading: "License grant",
        body: "SPLNTR software is licensed, not sold. When you purchase a license, we grant you a personal, non-exclusive, non-transferable right to install and use the software on machines that you own and operate, up to the activation limit shown at the time of purchase. A license covers one person; studios or teams needing multiple seats should contact us.",
      },
      {
        heading: "Your creative work is yours",
        body: "Everything you create with SPLNTR tools — audio, visuals, exports, renders, presets, performances — belongs entirely to you. You may use it commercially, release it, license it, and monetize it with no royalty, credit, or additional payment owed to us. This includes material made with our sample packs and FX packs.",
      },
      {
        heading: "What you may not do",
        body: "You may not redistribute, resell, sublicense, rent, lend, or share the software or its installers. You may not share, publish, or resell license keys. You may not reverse engineer, decompile, or attempt to circumvent licensing or activation, except where such restriction is prohibited by law. You may not redistribute our sample or preset content as a competing sample library or sound pack.",
      },
      {
        heading: "Activations and transfers",
        body: "Licenses may be deactivated and moved between your own machines. If you change or replace hardware and run out of activations, contact us and we'll reset them. Licenses are not transferable to another person.",
      },
      {
        heading: "Updates and support",
        body: "Bug-fix and maintenance updates within a major version are included with your license. Major new versions may be offered as paid upgrades, typically at a discount for existing owners. We aim to support current operating systems and plugin formats, but cannot guarantee indefinite compatibility with future OS releases.",
      },
      {
        heading: "Beta software",
        body: "Licenses for beta builds are free, temporary, non-transferable, and may expire or be revoked when the beta period ends. Beta builds carry no warranty of any kind.",
      },
      {
        heading: "Warranty and liability",
        body: "The software is provided \"as is.\" To the maximum extent permitted by law, SPLNTR disclaims all implied warranties and is not liable for lost work, lost profits, or indirect or consequential damages. Our total liability is limited to the amount you paid for the license.",
      },
      {
        heading: "Termination",
        body: "This license ends if you materially breach it — for example by redistributing the software or sharing keys. On termination you must stop using and delete the software. Work you already created with it remains yours.",
      },
    ],
  },
  {
    slug: "refunds",
    title: "Refund Policy",
    updated: "July 2026",
    intro:
      "Digital software can't be returned like a physical product, so we do two things instead: let you try before you buy, and stand behind the purchase if something genuinely doesn't work.",
    sections: [
      {
        heading: "Try before you buy",
        body: "Wherever possible we provide a fully functional trial so you can test SPLNTR software in your own DAW, on your own machine, with your own projects before spending anything. We strongly recommend running the trial and confirming compatibility with your system and host before purchasing.",
      },
      {
        heading: "Refund window",
        body: "If a purchase doesn't work out, contact us within 14 days of purchase and we'll make it right. Tell us what happened — a technical problem we can't resolve, an accidental duplicate purchase, or software that doesn't do what our product page said it does are all valid reasons.",
      },
      {
        heading: "What we may ask first",
        body: "For technical issues, we'll usually try to solve the problem before refunding — most issues turn out to be quick fixes, and we'd rather you end up with working software. If we can't resolve it, we refund.",
      },
      {
        heading: "Limits",
        body: "We may decline refunds where a license has been shared or redistributed, where refunds are being requested repeatedly across purchases, or outside the 14-day window. Refunded licenses are deactivated and the software must be removed from your systems.",
      },
      {
        heading: "How refunds are processed",
        body: "Refunds go back through the original payment method via our payment provider. Timing depends on your bank or card issuer, typically within a few business days of approval.",
      },
      {
        heading: "Free content and betas",
        body: "Free downloads and beta access involve no purchase, so no refunds apply. Statutory consumer rights that apply in your country are unaffected by this policy.",
      },
    ],
  },
];

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return LEGAL_DOCS.find((d) => d.slug === slug);
}
