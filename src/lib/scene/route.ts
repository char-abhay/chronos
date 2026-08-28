import { destinations } from "@/content/destinations";
import type { DestinationId } from "@/content/schema";
import { DEFAULT_DESTINATION } from "@/lib/physics/space";

/**
 * Which region a URL belongs to.
 *
 * Pure and React-free so `instrumentation-client.ts` can call it before
 * hydration, and so the camera and the CSS hue always agree on where we
 * are rather than each deciding for itself.
 *
 * Routes that are not regions -- /projects, /contact, /styleguide --
 * resolve to Home. They are reference material rather than places, and
 * parking the camera at the origin is the honest framing for that.
 */
export function destinationIdForPath(pathname: string): DestinationId {
  const match = destinations.find((d) => d.href === pathname);
  if (match) return match.id;

  // A build page belongs to the region that catalogues the builds.
  if (pathname.startsWith("/projects")) return "solar-system";

  return DEFAULT_DESTINATION;
}
