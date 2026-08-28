import { requestCamera } from "@/lib/scene/cameraBus";

/**
 * Start the camera moving the instant a navigation begins.
 *
 * Next 16 calls this at the very start of a client-side route change --
 * before the destination route renders, and therefore before any
 * component could possibly react to it. Publishing the request here is
 * what makes a region change feel like travel rather than a cut: the
 * camera is already underway while the new page's HTML is still being
 * assembled.
 *
 * This file runs after HTML load but BEFORE hydration, so only
 * synchronous top-level work is guaranteed to complete. It does nothing
 * but register a function, which is well inside that budget.
 */
export function onRouterTransitionStart(url: string) {
  try {
    requestCamera(new URL(url, window.location.origin).pathname, true);
  } catch {
    // A malformed or cross-origin URL is not this layer's problem; the
    // CameraRig's pathname effect is the backstop.
  }
}
