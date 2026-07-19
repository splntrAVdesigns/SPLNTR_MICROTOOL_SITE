export const SITE = {
  name: "SPLNTR",
  title: "SPLNTR — Audio & Visual Micro Tools",
  description:
    "Forge. Reshape. Multiply. Audio and visual micro tools for creative minds — GPU-powered design engines, audio-reactive visuals, and performance plugins.",
  /**
   * Canonical site URL, used for metadataBase / OG image resolution.
   * Priority: explicit env var -> Vercel-provided deployment URL -> localhost.
   * Set NEXT_PUBLIC_SITE_URL in Vercel once your custom domain is connected.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3000"),
  email: "hello@splntr.com", // TODO: replace with branded address
  socials: [
    { label: "Instagram", href: "https://instagram.com/" }, // TODO: real links
    { label: "YouTube", href: "https://youtube.com/" },
    { label: "Facebook", href: "https://facebook.com/" },
  ],
};

export interface LegalDoc {
  slug: string;
  title: string;
  updated: string;
  sections: { heading: string; body: string }[];
}

/**
 * PLACEHOLDER legal content — replace with reviewed documents before selling
 * software. Use a generator (Termly, GetTerms, iubenda) as a base, then have
 * the EULA reviewed since it governs your software licenses.
 */
export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    updated: "July 2026",
    sections: [
      { heading: "What we collect", body: "When you join a waitlist or contact us, we collect the information you provide — typically your email address and anything you include in your message. Our tools run locally in your browser or on your machine; we do not collect the media or projects you create with them." },
      { heading: "How we use it", body: "We use your email to send beta invites, release announcements, and development updates for the products you signed up for. We do not sell your data." },
      { heading: "Your choices", body: "Every email includes an unsubscribe link, and you can request deletion of your data at any time by contacting us." },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Service",
    updated: "July 2026",
    sections: [
      { heading: "Using this site", body: "By using this website you agree to these terms. The site and its content are provided as-is for information about SPLNTR products, beta programs, and releases." },
      { heading: "Beta software", body: "Beta builds are pre-release software provided for testing. They may contain bugs, change without notice, or be discontinued. Do not rely on beta builds for critical production work." },
      { heading: "Intellectual property", body: "SPLNTR branding, product names, software, and site content are the property of SPLNTR. You may not redistribute builds, license keys, or beta access." },
    ],
  },
  {
    slug: "eula",
    title: "End User License Agreement",
    updated: "July 2026",
    sections: [
      { heading: "License grant", body: "Purchased SPLNTR software is licensed, not sold. A license grants one person the right to install and use the software on machines they own and operate, up to the activation limit shown at purchase." },
      { heading: "Your content", body: "Everything you create with SPLNTR tools is yours, including commercial work. We claim no rights over your exports, projects, or performances." },
      { heading: "Restrictions", body: "You may not redistribute, resell, sublicense, reverse engineer, or share license keys. Licenses for beta software are personal and non-transferable." },
    ],
  },
  {
    slug: "refunds",
    title: "Refund Policy",
    updated: "July 2026",
    sections: [
      { heading: "Try before you buy", body: "Wherever possible we provide fully functional trials so you can test our software in your own workflow before purchasing." },
      { heading: "Refund window", body: "If a purchase doesn't work out, contact us within 14 days of purchase and we'll make it right. Refunds are processed through the original payment provider." },
      { heading: "Beta programs", body: "Beta access is free and carries no purchase, so no refunds apply to beta participation." },
    ],
  },
];

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return LEGAL_DOCS.find((d) => d.slug === slug);
}
