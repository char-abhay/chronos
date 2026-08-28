"use client";

import { useEffect, useMemo } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  LineBasicMaterial,
  MeshBasicMaterial,
  SphereGeometry,
} from "three";
import { home } from "@/lib/physics/layout";
import { readToken } from "@/lib/scene/tokens";

/**
 * START HERE.
 *
 * Seven threads leaving the origin, one per region, each pointing at the
 * true bearing of that region's anchor. The thread aimed at Future really
 * is aimed at Future, 862 units away in the dark.
 *
 * This is the home page's own claim rendered rather than restated:
 * everything is reachable from anywhere, nothing is locked, and no order
 * is required. Each thread fades out a few units along, because pointing
 * is the whole gesture -- drawing the full line would turn an invitation
 * into a diagram.
 */
export function Home() {
  const threads = useMemo(() => {
    const positions = new Float32Array(home.length * 6);
    const colors = new Float32Array(home.length * 6);

    // Bright at the origin, fading into the page ground at the tip. A
    // gradient is the only honest way to end a line in empty space.
    const near = new Color(readToken("--signal", "#e3a857"));
    const far = new Color(readToken("--ground", "#08090b"));

    home.forEach((bearing, i) => {
      positions[i * 6 + 3] = bearing.direction[0] * bearing.reach;
      positions[i * 6 + 4] = bearing.direction[1] * bearing.reach;
      positions[i * 6 + 5] = bearing.direction[2] * bearing.reach;

      colors[i * 6] = near.r;
      colors[i * 6 + 1] = near.g;
      colors[i * 6 + 2] = near.b;
      colors[i * 6 + 3] = far.r;
      colors[i * 6 + 4] = far.g;
      colors[i * 6 + 5] = far.b;
    });

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("color", new BufferAttribute(colors, 3));
    return geometry;
  }, []);

  const threadMaterial = useMemo(
    () => new LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.7 }),
    []
  );

  const core = useMemo(() => new SphereGeometry(0.42, 18, 12), []);
  const coreMaterial = useMemo(
    () => new MeshBasicMaterial({ color: new Color(readToken("--signal", "#e3a857")) }),
    []
  );

  useEffect(() => () => threads.dispose(), [threads]);
  useEffect(() => () => threadMaterial.dispose(), [threadMaterial]);
  useEffect(() => () => core.dispose(), [core]);
  useEffect(() => () => coreMaterial.dispose(), [coreMaterial]);

  return (
    <group>
      <mesh geometry={core} material={coreMaterial} />
      <lineSegments geometry={threads} material={threadMaterial} />
    </group>
  );
}
