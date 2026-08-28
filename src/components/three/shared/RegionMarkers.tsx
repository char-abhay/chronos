"use client";

import { useEffect, useMemo } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  PointsMaterial,
} from "three";
import type { DestinationId } from "@/content/schema";
import { anchors, type Vec3 } from "@/lib/physics/space";
import { readToken } from "@/lib/scene/tokens";

/**
 * A faint light at each region anchor that has no scene yet.
 *
 * PHASE 7 SCAFFOLD, now retreating. It existed so the world had landmarks
 * while the camera system was being built -- it is what proved a route
 * change moves through space rather than cutting. Phase 9A replaced three
 * of the eight anchors with real geometry (the five builds, the six skill
 * clusters, the accretion disk) and passes those three in `skip`, so the
 * remaining five keep a landmark and the world stays navigable. When
 * Phase 9B builds the last five, this component goes away entirely.
 */
export function RegionMarkers({ skip = [] }: { skip?: DestinationId[] }) {
  const geometry = useMemo(() => {
    const points = (Object.entries(anchors) as [DestinationId, Vec3][])
      .filter(([id]) => !skip.includes(id))
      .map(([, anchor]) => anchor);
    const positions = new Float32Array(points.length * 3);
    points.forEach((anchor, i) => {
      positions[i * 3] = anchor[0];
      positions[i * 3 + 1] = anchor[1];
      positions[i * 3 + 2] = anchor[2];
    });
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(positions, 3));
    return geo;
    // `skip` is a literal in Scene.tsx and never changes at runtime, but
    // the field is rebuilt if it ever does.
  }, [skip]);

  const material = useMemo(
    () =>
      new PointsMaterial({
        // Warm accent: --signal means "there is something here".
        color: new Color(readToken("--signal", "#e3a857")),
        size: 5,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    []
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  return <points geometry={geometry} material={material} />;
}
