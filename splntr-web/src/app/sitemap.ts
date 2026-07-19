import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";
import { LEGAL_DOCS, SITE } from "@/lib/site";

/**
 * Auto-generated sitemap at /sitemap.xml — stays in sync automatically as
 * products and legal docs are added to their data files.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/products", "/shop", "/about", "/contact"];

  return [
    ...staticRoutes.map((path) => ({
      url: `${SITE.url}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...PRODUCTS.map((p) => ({
      url: `${SITE.url}/products/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...LEGAL_DOCS.map((d) => ({
      url: `${SITE.url}/legal/${d.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
