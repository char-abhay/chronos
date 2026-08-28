"use client";

import { useSyncExternalStore } from "react";

/**
 * Is the WebGL scene actually live?
 *
 * The CSS atmosphere is the permanent floor: gradients, hue and horizon
 * render on every device and never unmount. Only the Canvas 2D star
 * field steps aside when the 3D world is running, so the two never draw
 * stars on top of each other.
 *
 * A module-level store rather than context: SceneRoot sets this from
 * outside the tree that reads it, and the value must survive the
 * dynamic import boundary.
 */
let active = false;
const listeners = new Set<() => void>();

export function setSceneActive(value: boolean) {
  if (active === value) return;
  active = value;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** The server never has a scene, so it always renders the 2D floor. */
export function useSceneActive(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => active,
    () => false
  );
}
