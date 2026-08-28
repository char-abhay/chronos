"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { Color, MeshBasicMaterial, SphereGeometry } from "three";
import { FUTURE_MARKER_RADIUS } from "@/lib/physics/layout";
import { readToken } from "@/lib/scene/tokens";

/**
 * WHERE THIS GOES.
 *
 * One point, and a great deal of nothing around it.
 *
 * /future is the sparsest page on the site by design -- "This page is
 * intentionally unfinished", with whitespace doing the work, because the
 * section is about something that has not happened yet. Filling this
 * region with geometry would contradict the only thing it is trying to
 * say. So the world is empty here too, and the single marker never quite
 * settles: it breathes slowly instead of holding still, which is the
 * difference between unresolved and finished.
 */
export function Future() {
  const geometry = useMemo(
    () => new SphereGeometry(FUTURE_MARKER_RADIUS, 20, 14),
    []
  );
  const material = useMemo(
    () =>
      new MeshBasicMaterial({
        color: new Color(readToken("--text-secondary", "#b8b4ac")),
        transparent: true,
        opacity: 0.5,
      }),
    []
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame((state) => {
    material.opacity = 0.34 + Math.sin(state.clock.elapsedTime * 0.6) * 0.16;
  });

  return <mesh geometry={geometry} material={material} />;
}
