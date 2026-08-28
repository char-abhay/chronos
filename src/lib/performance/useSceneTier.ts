"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { useDeviceTier } from "@/lib/performance/useDeviceTier";

/**
 * What the WebGL layer is allowed to do on this device.
 *
 *   full  -- everything: postprocessing, pointer parallax, full counts
 *   lean  -- geometry only: no postprocessing, reduced instance counts
 *   off   -- no WebGL at all; the Scene chunk is never even imported
 *
 * "off" is a real, designed rendering mode, not a failure state. The CSS
 * atmosphere already carries hue, depth and horizon on its own, so a
 * device that lands here sees the site exactly as it shipped in Phase 6.
 */
export type SceneTier = "full" | "lean" | "off";

let probed: boolean | null = null;

/**
 * Does this browser actually give us a WebGL context?
 *
 * `supportsWebGL` is not the same question as "is the GPU any good" --
 * that is what the device tier is for. This only catches the cases where
 * a context cannot be created at all: WebGL disabled by policy, a
 * blocklisted driver, or a headless/older browser.
 */
function supportsWebGL(): boolean {
  if (probed !== null) return probed;
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    probed = Boolean(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl")
    );
  } catch {
    probed = false;
  }
  return probed;
}

/** Fixed for the session, like the device tier it builds on. */
function subscribe() {
  return () => {};
}

function useWebGL(): boolean {
  return useSyncExternalStore(
    subscribe,
    supportsWebGL,
    () => false
  );
}

export function useSceneTier(): SceneTier {
  const reduced = useReducedMotion();
  const tier = useDeviceTier();
  const webgl = useWebGL();

  // Reduced motion is answered by the still CSS atmosphere, which is
  // already a designed frame. A motionless WebGL scene would cost a
  // megabyte to render something the CSS layer draws for free.
  if (reduced) return "off";
  if (!webgl) return "off";
  if (tier === "low") return "off";
  return tier === "high" ? "full" : "lean";
}

/**
 * Instance budgets per tier. Same intent as `starCount` in
 * useDeviceTier: smooth interaction beats maximum fidelity.
 */
export const sceneBudget: Record<Exclude<SceneTier, "off">, { stars: number; dpr: number }> = {
  full: { stars: 6000, dpr: 2 },
  lean: { stars: 2200, dpr: 1.5 },
};
