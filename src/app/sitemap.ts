import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/* Destinations are added here as each route ships (plan Phase 6).
   Only routes that actually exist are listed — no placeholders. */
const routes = ["/"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: "monthly" as const,
    priority: route === "/" ? 1 : 0.7,
  }));
}
