/**
 * WHERE THIS SITE LIVES.
 *
 * One fact, one place. `metadataBase`, robots.txt and the sitemap all need
 * an absolute origin, and all three used to declare it themselves -- three
 * copies of the same string, free to drift.
 *
 * The chain deliberately never invents a hostname:
 *
 *   1. NEXT_PUBLIC_SITE_URL   -- set this the day a custom domain exists.
 *   2. VERCEL_PROJECT_PRODUCTION_URL -- injected by Vercel, so a fresh
 *      deploy describes itself correctly with no configuration at all.
 *   3. localhost              -- the only honest answer when neither is set.
 *
 * Step 2 is server-side only, which is fine: every consumer of this value
 * (generateMetadata, robots.ts, sitemap.ts, the OG image) runs on the
 * server. Do not read this in a client component and expect step 2 to work.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
