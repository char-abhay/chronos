"use client";

import dynamic from "next/dynamic";
import { useSceneTier } from "@/lib/performance/useSceneTier";

/**
 * The only place three.js is allowed to enter the app.
 *
 * `ssr: false` is illegal in a Server Component in Next 16 -- that is
 * precisely why this thin client wrapper exists. It keeps the whole
 * WebGL world in its own chunk, requested only once a device has been
 * judged able to run it.
 *
 * When the tier is "off" the import is never even reached, so a phone,
 * a reduced-motion visitor or a browser without WebGL downloads not one
 * byte of three.js. What they get instead is the CSS atmosphere, which
 * has been the designed still frame since Phase 4.
 */
const Scene = dynamic(
  () => import("@/components/three/Scene").then((mod) => mod.Scene),
  { ssr: false, loading: () => null }
);

export function SceneRoot() {
  const tier = useSceneTier();
  if (tier === "off") return null;
  return <Scene tier={tier} />;
}
