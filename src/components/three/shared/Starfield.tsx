"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  PointsMaterial,
  type Points,
} from "three";
import { seeded } from "@/lib/physics/random";
import { readToken } from "@/lib/scene/tokens";

/**
 * The deep field the whole world sits inside.
 *
 * Stars are static in space -- all the parallax comes from the camera
 * actually moving through them, which is both physically right and free.
 * The only animation is a barely-perceptible drift so a stationary
 * camera does not feel frozen.
 *
 * Distribution is a slab, not a sphere: the eight regions run outward
 * along -Z (lib/physics/space.ts), so stars are stretched along that
 * axis and there is nothing rendered behind the origin that no camera
 * pose will ever look at.
 */
export function Starfield({ count }: { count: number }) {
  const ref = useRef<Points>(null);

  const geometry = useMemo(() => {
    const random = seeded(0x43484e53); // "CHNS"
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (random() - 0.5) * 1400;
      positions[i * 3 + 1] = (random() - 0.5) * 900;
      // Bias toward the corridor the camera travels, with a little
      // ahead of Home so the origin is not the edge of the world.
      positions[i * 3 + 2] = 180 - random() * 1500;
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  const material = useMemo(() => {
    // Warm-neutral, matching --text-primary: pure white stars read as
    // blue against this ground. Same finding as the Canvas 2D field.
    return new PointsMaterial({
      color: new Color(readToken("--text-primary", "#f2f0ec")),
      size: 1.15,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
  }, []);

  // three allocates GPU buffers outside React's knowledge, so they have
  // to be released by hand or a route change leaks them.
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.0035;
  });

  return <points ref={ref} geometry={geometry} material={material} />;
}
