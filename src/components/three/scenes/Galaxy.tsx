"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  LineBasicMaterial,
  PointsMaterial,
} from "three";
import { galaxy } from "@/lib/physics/layout";
import { seeded } from "@/lib/physics/random";
import { getSceneProgress } from "@/lib/scene/progress";
import { readToken } from "@/lib/scene/tokens";

/**
 * WHAT CONNECTS TO WHAT.
 *
 * Six clusters on an outer ring, the five builds on an inner one, and a
 * line for every link the content actually authorises -- six of them,
 * running from exactly two clusters.
 *
 * The other four clusters float unconnected, and that is the point.
 * skills.ts allows an edge only where a project's own technology list
 * supports it, so Programming Languages, Database, Cloud Computing and
 * Operating Systems have nothing running inward. Drawing lines there to
 * balance the picture would be inventing evidence. An unconnected cluster
 * is still fully lit, exactly as in the 2D constellation, where the
 * default state is everything lit and nothing is ever labelled "0".
 */

function pointsGeometry(positions: Float32Array): BufferGeometry {
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  return geometry;
}

export function Galaxy({ dust }: { dust: number }) {
  /** One bright point per skill, scattered inside its own cluster. */
  const skills = useMemo(() => {
    const random = seeded(0x534b494c); // "SKIL"
    const total = galaxy.clusters.reduce((sum, c) => sum + c.skills, 0);
    const positions = new Float32Array(total * 3);
    let i = 0;
    for (const cluster of galaxy.clusters) {
      const [cx, cy, cz] = cluster.position;
      for (let n = 0; n < cluster.skills; n += 1) {
        positions[i * 3] = cx + (random() - 0.5) * cluster.spread * 2;
        positions[i * 3 + 1] = cy + (random() - 0.5) * cluster.spread * 1.4;
        positions[i * 3 + 2] = cz + (random() - 0.5) * cluster.spread * 2;
        i += 1;
      }
    }
    return pointsGeometry(positions);
  }, []);

  /** Generated haze. The only thing here the tier is allowed to thin. */
  const haze = useMemo(() => {
    const random = seeded(0x48415a45); // "HAZE"
    const totalSkills = galaxy.clusters.reduce((sum, c) => sum + c.skills, 0);
    const positions = new Float32Array(dust * 3);
    let i = 0;
    for (const cluster of galaxy.clusters) {
      const share = Math.round((cluster.skills / totalSkills) * dust);
      const [cx, cy, cz] = cluster.position;
      for (let n = 0; n < share && i < dust; n += 1) {
        const spread = cluster.spread * 2.6;
        positions[i * 3] = cx + (random() - 0.5) * spread * 2;
        positions[i * 3 + 1] = cy + (random() - 0.5) * spread;
        positions[i * 3 + 2] = cz + (random() - 0.5) * spread * 2;
        i += 1;
      }
    }
    // Any remainder from rounding stays at the origin and would read as a
    // clump, so the buffer is trimmed to what was actually written.
    return pointsGeometry(positions.slice(0, i * 3));
  }, [dust]);

  const builds = useMemo(() => {
    const plain = galaxy.projects.filter((p) => !p.featured);
    const positions = new Float32Array(plain.length * 3);
    plain.forEach((project, i) => {
      positions[i * 3] = project.position[0];
      positions[i * 3 + 1] = project.position[1];
      positions[i * 3 + 2] = project.position[2];
    });
    return pointsGeometry(positions);
  }, []);

  const featured = useMemo(() => {
    const project = galaxy.projects.find((p) => p.featured);
    const positions = new Float32Array(3);
    if (project) {
      positions[0] = project.position[0];
      positions[1] = project.position[1];
      positions[2] = project.position[2];
    }
    return pointsGeometry(positions);
  }, []);

  const links = useMemo(() => {
    const positions = new Float32Array(galaxy.edges.length * 6);
    galaxy.edges.forEach((edge, i) => {
      positions[i * 6] = edge.from[0];
      positions[i * 6 + 1] = edge.from[1];
      positions[i * 6 + 2] = edge.from[2];
      positions[i * 6 + 3] = edge.to[0];
      positions[i * 6 + 4] = edge.to[1];
      positions[i * 6 + 5] = edge.to[2];
    });
    return pointsGeometry(positions);
  }, []);

  const skillMaterial = useMemo(
    () =>
      new PointsMaterial({
        color: new Color(readToken("--text-primary", "#f2f0ec")),
        size: 0.62,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      }),
    []
  );
  const hazeMaterial = useMemo(
    () =>
      new PointsMaterial({
        color: new Color(readToken("--scene-galaxy", "#a096b2")),
        size: 0.3,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.34,
        depthWrite: false,
      }),
    []
  );
  const buildMaterial = useMemo(
    () =>
      new PointsMaterial({
        color: new Color(readToken("--signal", "#e3a857")),
        size: 0.85,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      }),
    []
  );
  const featuredMaterial = useMemo(
    () =>
      new PointsMaterial({
        color: new Color(readToken("--signal", "#e3a857")),
        size: 1.5,
        sizeAttenuation: true,
        transparent: true,
        opacity: 1,
        depthWrite: false,
      }),
    []
  );
  // Cold, because an edge is a measurement: it records where a cluster
  // has actually been used, it is not something to act on.
  const linkMaterial = useMemo(
    () =>
      new LineBasicMaterial({
        color: new Color(readToken("--data", "#8fb8c4")),
        transparent: true,
        opacity: 0.4,
      }),
    []
  );

  useEffect(() => () => skills.dispose(), [skills]);
  useEffect(() => () => haze.dispose(), [haze]);
  useEffect(() => () => builds.dispose(), [builds]);
  useEffect(() => () => featured.dispose(), [featured]);
  useEffect(() => () => links.dispose(), [links]);
  useEffect(() => () => skillMaterial.dispose(), [skillMaterial]);
  useEffect(() => () => hazeMaterial.dispose(), [hazeMaterial]);
  useEffect(() => () => buildMaterial.dispose(), [buildMaterial]);
  useEffect(() => () => featuredMaterial.dispose(), [featuredMaterial]);
  useEffect(() => () => linkMaterial.dispose(), [linkMaterial]);

  const root = useRef<Group>(null);
  const scroll = useRef(0);

  useFrame((state) => {
    if (!root.current) return;
    scroll.current += (getSceneProgress() - scroll.current) * 0.06;
    root.current.rotation.y = state.clock.elapsedTime * 0.012 + scroll.current * 0.5;
  });

  return (
    <group ref={root} rotation={[0.28, 0, 0.1]}>
      <points geometry={haze} material={hazeMaterial} />
      <points geometry={skills} material={skillMaterial} />
      <lineSegments geometry={links} material={linkMaterial} />
      <points geometry={builds} material={buildMaterial} />
      <points geometry={featured} material={featuredMaterial} />
    </group>
  );
}
