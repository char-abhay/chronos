"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  MeshBasicMaterial,
  Object3D,
  PointsMaterial,
  SphereGeometry,
} from "three";
import { blackHoles, VOID_RADIUS } from "@/lib/physics/layout";
import { seeded } from "@/lib/physics/random";
import { readToken } from "@/lib/scene/tokens";

/**
 * THE PROBLEMS THAT DID NOT SOLVE THEMSELVES.
 *
 * Four bands, one per challenge recorded against dVoting -- the only
 * project in the dataset with challenges written down. A band is as wide
 * as its problem is long to describe, and the bands closest to the centre
 * turn fastest, which is the one piece of real orbital mechanics in the
 * world because here it is legible.
 *
 * The centre is a hole, not an object: an opaque sphere that writes depth
 * and so genuinely occludes the star field behind it. Everything else in
 * this scene is additive and weightless; this is the only thing that
 * takes something away.
 */

function band(inner: number, outer: number, count: number, seed: number) {
  const random = seeded(seed);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const angle = random() * Math.PI * 2;
    // sqrt keeps the ring evenly dense instead of crowding the inner edge.
    const radius = Math.sqrt(
      inner * inner + random() * (outer * outer - inner * inner)
    );
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (random() - 0.5) * 0.34;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  return geometry;
}

export function BlackHoles({ disk }: { disk: number }) {
  const bands = useMemo(
    () =>
      blackHoles.map((entry, i) =>
        band(
          entry.inner,
          entry.outer,
          Math.max(60, Math.round(entry.density * disk)),
          0x44534b00 + i // "DSK" + band index
        )
      ),
    [disk]
  );

  const voidGeometry = useMemo(() => new SphereGeometry(VOID_RADIUS, 32, 24), []);

  const voidMaterial = useMemo(
    () =>
      // Opaque and depth-writing, unlike everything else in the world.
      // That is what makes it read as absence rather than as a dark ball.
      new MeshBasicMaterial({ color: new Color(readToken("--ground", "#08090b")) }),
    []
  );

  const diskMaterial = useMemo(
    () =>
      new PointsMaterial({
        color: new Color(readToken("--scene-black-holes", "#ff8a3c")),
        size: 0.16,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.62,
        depthWrite: false,
      }),
    []
  );

  useEffect(() => {
    return () => {
      for (const geometry of bands) geometry.dispose();
    };
  }, [bands]);
  useEffect(() => () => voidGeometry.dispose(), [voidGeometry]);
  useEffect(() => () => voidMaterial.dispose(), [voidMaterial]);
  useEffect(() => () => diskMaterial.dispose(), [diskMaterial]);

  const rings = useRef<(Object3D | null)[]>([]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    for (let i = 0; i < blackHoles.length; i += 1) {
      const ring = rings.current[i];
      if (ring) ring.rotation.y = time * blackHoles[i].speed;
    }
  });

  return (
    <group rotation={[0.42, 0, 0.16]}>
      <mesh geometry={voidGeometry} material={voidMaterial} />

      {blackHoles.map((entry, i) => (
        <points
          key={entry.title}
          ref={(element) => {
            rings.current[i] = element;
          }}
          geometry={bands[i]}
          material={diskMaterial}
        />
      ))}
    </group>
  );
}
