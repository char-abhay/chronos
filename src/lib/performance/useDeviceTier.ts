"use client";

import { useSyncExternalStore } from "react";

export type Tier = "high" | "medium" | "low";

/**
 * Resolved once from what the browser will tell us. Deliberately crude:
 * the point is to avoid drowning a weak device, not to profile it.
 *
 * Never upgrades mid-session -- oscillating quality is worse than
 * picking a slightly conservative tier and staying there.
 */
function resolve(): Tier {
  if (typeof window === "undefined") return "medium";

  const cores = navigator.hardwareConcurrency ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 640;

  /**
   * navigator.deviceMemory is Chromium-only. Safari and Firefox do not
   * implement it, so a `?? 4` default read every one of them as the
   * weakest supported device: every iPhone and iPad resolved to "low"
   * and never downloaded the scene at all, while an 8-core Android
   * phone escaped that branch and got the whole world. The nicest
   * phones were served the plainest site, by accident of an API rather
   * than by any decision.
   *
   * Absence is unknown, not weak. Only an actual reported value is
   * allowed to demote anything; where the browser stays silent, the
   * core count decides.
   */
  const reported = (navigator as { deviceMemory?: number }).deviceMemory;
  const weakMemory = reported !== undefined && reported <= 4;

  if (coarse && (cores <= 4 || weakMemory)) return "low";
  if (small || cores <= 4 || weakMemory) return "medium";
  return "high";
}

let cached: Tier | null = null;

function getSnapshot(): Tier {
  if (cached === null) cached = resolve();
  return cached;
}

/** Nothing to subscribe to: the tier is fixed for the session. */
function subscribe() {
  return () => {};
}

export function useDeviceTier(): Tier {
  return useSyncExternalStore(subscribe, getSnapshot, () => "medium" as Tier);
}

/** Star counts per tier. Smooth interaction beats maximum fidelity. */
export const starCount: Record<Tier, number> = {
  high: 420,
  medium: 220,
  low: 90,
};
