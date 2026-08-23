"use client";

import { useSyncExternalStore } from "react";

/**
 * Reduced motion is a first-class rendering mode in CHRONOS, not a
 * stripped fallback -- components use this to render a designed still
 * state rather than a paused animation.
 *
 * useSyncExternalStore is the correct primitive for subscribing to
 * something outside React like matchMedia. The earlier useState +
 * useEffect version worked but set state during an effect, which React
 * flags and which causes an avoidable extra render on every mount.
 */
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/** The server cannot know the preference; the client corrects on mount. */
function getServerSnapshot(): boolean {
  return false;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
