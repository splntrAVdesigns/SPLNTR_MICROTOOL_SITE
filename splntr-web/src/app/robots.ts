import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * /robots.txt — allows crawling and points search engines at the sitemap.
 * The waitlist API route is excluded since it's a POST endpoint, not a page.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
