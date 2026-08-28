/**
 * A one-slot channel for "the camera should be heading to this route".
 *
 * Deliberately plain module state with no React import: the publisher is
 * `instrumentation-client.ts`, which runs after HTML load but BEFORE
 * hydration, so it cannot call a hook. Publishing there rather than from
 * a component means the camera starts moving the instant a navigation
 * begins, not after the destination route's DOM exists.
 */
export type CameraRequest = {
  pathname: string;
  /** True when the request came from a route change rather than mount. */
  traversal: boolean;
};

let current: CameraRequest | null = null;
const listeners = new Set<(request: CameraRequest) => void>();

export function requestCamera(pathname: string, traversal: boolean) {
  current = { pathname, traversal };
  for (const listener of listeners) listener(current);
}

export function getCameraRequest(): CameraRequest | null {
  return current;
}

export function onCameraRequest(listener: (request: CameraRequest) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
