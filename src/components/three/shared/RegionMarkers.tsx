"use client";

import { useEffect, useMemo } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  PointsMaterial,
} from "three";
import { anchors } from "@/lib/physics/space";
import { readToken } from "@/lib/scene/tokens";

/**
 * A faint light at each region anchor.
 *
 * PHASE 7 SCAFFOLD. This exists so the world has landmarks while the
 * camera system is being built -- it is what proves a route change is
 * moving through space rather than cutting. Phase 9 replaces it with the
 * real per-region geometry (the five builds, the six skill clusters, the
 * accretion disk), at which point this component goes away.
 */
export function RegionMarkers() {
  const geometry = useMemo(() => {
    const points = Object.values(anchors);
    const positions = new Float32Array(points.length * 3);
    points.forEach((anchor, i) => {
      positions[i * 3] = anchor[0];
      positions[i * 3 + 1] = anchor[1];
      positions[i * 3 + 2] = anchor[2];
    });
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(positions, 3));
    return geo;
  }, []);

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
