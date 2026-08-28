"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  LineBasicMaterial,
  MeshBasicMaterial,
  SphereGeometry,
} from "three";
import { solarSystem } from "@/lib/physics/layout";
import { getSceneProgress } from "@/lib/scene/progress";
import { readToken } from "@/lib/scene/tokens";

/**
 * FIVE BUILDS, STILL IN ORBIT.
 *
 * One body per project. Nothing here is placed by hand: distance from the
 * centre is when it was built, size is how much there is to say about it,
 * and orbital speed is how long it took. dVoting ends up the largest and
 * among the slowest because its own technology and functionality lists
 * are the longest -- the geometry is not flattering it, it is measuring it.
 *
 * The scene carries no information that is not already in the DOM at
 * /solar-system. It is atmosphere with a source.
 */

/** A unit circle in the XZ plane, scaled per orbit. */
function orbitPath(segments: number): BufferGeometry {
  const positions = new Float32Array(segments * 3);
  for (let i = 0; i < segments; i += 1) {
    const angle = (i / segments) * Math.PI * 2;
    positions[i * 3] = Math.cos(angle);
    positions[i * 3 + 1] = 0;
    positions[i * 3 + 2] = Math.sin(angle);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  return geometry;
}

export function SolarSystem() {
  // One sphere and one path, reused by every body. Five meshes, two
  // geometries: the whole region costs less than the star field.
  const sphere = useMemo(() => new SphereGeometry(1, 20, 14), []);
  const path = useMemo(() => orbitPath(96), []);

  const featuredMaterial = useMemo(
    () => new MeshBasicMaterial({ color: new Color(readToken("--signal", "#e3a857")) }),
    []
  );
  const bodyMaterial = useMemo(
    () =>
      new MeshBasicMaterial({
        color: new Color(readToken("--text-secondary", "#b8b4ac")),
      }),
    []
  );
  const coreMaterial = useMemo(
    () =>
      new MeshBasicMaterial({
        color: new Color(readToken("--scene-solar-system", "#ce9a58")),
      }),
    []
  );
  const pathMaterial = useMemo(
    () =>
      new LineBasicMaterial({
        color: new Color(readToken("--text-faint", "#5a5750")),
        transparent: true,
        opacity: 0.5,
      }),
    []
  );

  useEffect(() => () => sphere.dispose(), [sphere]);
  useEffect(() => () => path.dispose(), [path]);
  useEffect(() => () => featuredMaterial.dispose(), [featuredMaterial]);
  useEffect(() => () => bodyMaterial.dispose(), [bodyMaterial]);
  useEffect(() => () => coreMaterial.dispose(), [coreMaterial]);
  useEffect(() => () => pathMaterial.dispose(), [pathMaterial]);

  const spins = useRef<(Group | null)[]>([]);
  const root = useRef<Group>(null);
  const scroll = useRef(0);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    for (let i = 0; i < solarSystem.length; i += 1) {
      const arm = spins.current[i];
      if (arm) arm.rotation.y = solarSystem[i].phase + time * solarSystem[i].speed;
    }

    // Reading down the page turns the system a little, so scrolling has
    // a consequence out here too. Damped the same way the camera is, so
    // the reset to 0 on a route change reads as motion, not a snap.
    if (root.current) {
      scroll.current += (getSceneProgress() - scroll.current) * 0.06;
      root.current.rotation.y = scroll.current * 0.4;
    }
  });

  return (
    <group ref={root}>
      {/* The centre is not a project, so it is not a body -- just the
          light everything else is measured against. */}
      <mesh geometry={sphere} material={coreMaterial} scale={1.35} />

      {solarSystem.map((body, i) => (
        <group key={body.slug} rotation={[0, 0, body.tilt]}>
          {/* The path stays still; only the body moves along it. */}
          <lineLoop geometry={path} material={pathMaterial} scale={body.radius} />

          <group
            ref={(element) => {
              spins.current[i] = element;
            }}
          >
            <mesh
              geometry={sphere}
              material={body.featured ? featuredMaterial : bodyMaterial}
              position={[body.radius, 0, 0]}
              scale={body.size}
            />
          </group>
        </group>
      ))}
    </group>
  );
}
