import type { MetadataRoute } from "next";
import { destinations } from "@/content/destinations";
import { projects } from "@/content/projects";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/* Only routes that actually exist. /styleguide is deliberately absent. */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    ...destinations.map((d) => d.href),
    "/projects",
    ...projects.map((p) => "/projects/" + p.slug),
    "/profile",
    "/resume",
    "/contact",
  ];

  return routes.map((route) => ({
    url: siteUrl + route,
    changeFrequency: "monthly" as const,
    priority: route === "/" ? 1 : route.startsWith("/projects") ? 0.8 : 0.7,
  }));
}
