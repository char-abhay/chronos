"use client";

import dynamic from "next/dynamic";
import { SceneBoundary } from "@/components/three/SceneBoundary";
import { useSceneTier } from "@/lib/performance/useSceneTier";

/**
 * The only place three.js is allowed to enter the app.
 *
 * `ssr: false` is illegal in a Server Component in Next 16 -- that is
 * precisely why this thin client wrapper exists. It keeps the whole
 * WebGL world in its own chunk, requested only once a device has been
 * judged able to run it.
 *
 * When the tier is "off" the import is never even reached, so nothing
 * downloads a single byte of three.js: a reduced-motion visitor, a
 * browser without WebGL, and a phone weak enough to be drowned by it.
 * A capable phone is not in that list and does get the world, on the
 * lean budget -- see useDeviceTier for why that distinction is drawn
 * from cores rather than from a memory API half the browsers lack.
 * What the excluded get instead is the CSS atmosphere, which has been
 * the designed still frame since Phase 4.
 *
 * SceneBoundary is the other half of the same promise: the sky is
 * allowed to be absent, and it is allowed to fail, but it is never
 * allowed to take the page with it.
 */
const Scene = dynamic(
  () => import("@/components/three/Scene").then((mod) => mod.Scene),
  { ssr: false, loading: () => null }
);

export function SceneRoot() {
  const tier = useSceneTier();
  if (tier === "off") return null;
  return (
    <SceneBoundary>
      <Scene tier={tier} />
    </SceneBoundary>
  );
}
