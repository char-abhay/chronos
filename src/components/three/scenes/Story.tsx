"use client";

import { useEffect, useMemo } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  LineBasicMaterial,
  PointsMaterial,
} from "three";
import { story } from "@/lib/physics/layout";
import { readToken } from "@/lib/scene/tokens";

/**
 * ALL OF IT, IN ONE LINE.
 *
 * Seven segments as seven vertebrae, top to bottom, mirroring the 2D
 * timeline on /story -- and the Challenges vertebra is missing, because
 * its body is UNKNOWN.
 *
 * The spine has a real gap there: no point, and no line reaching across
 * it. That is the same decision the page makes when it returns null for
 * that segment. A placeholder saying "coming soon" would be worse than
 * the honest absence, and inventing a struggle would be the single worst
 * thing this site could do. The gap closes when Abhay writes it.
 */
export function Story() {
  /** One point per written segment. The unwritten one contributes none. */
  const vertebrae = useMemo(() => {
    const written = story.filter((v) => v.written);
    const positions = new Float32Array(written.length * 3);
    written.forEach((vertebra, i) => {
      positions[i * 3 + 1] = vertebra.y;
    });
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    return geometry;
  }, []);

  /**
   * The spine, drawn only between neighbours that both exist. The
   * unwritten segment therefore leaves a visible break rather than being
   * quietly bridged over.
   */
  const spine = useMemo(() => {
    const segments: number[] = [];
    for (let i = 0; i < story.length - 1; i += 1) {
      if (!story[i].written || !story[i + 1].written) continue;
      segments.push(0, story[i].y, 0, 0, story[i + 1].y, 0);
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(segments), 3)
    );
    return geometry;
  }, []);

  /** The five builds named by the Experiments segment, branching off it. */
  const branches = useMemo(() => {
    const rows: number[] = [];
    for (const vertebra of story) {
      for (let n = 0; n < vertebra.projects; n += 1) {
        const angle = (n / Math.max(1, vertebra.projects)) * Math.PI * 2;
        rows.push(Math.cos(angle) * 3.4, vertebra.y, Math.sin(angle) * 3.4);
      }
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(rows), 3)
    );
    return geometry;
  }, []);

  const spineMaterial = useMemo(
    () =>
      new LineBasicMaterial({
        color: new Color(readToken("--text-faint", "#5a5750")),
        transparent: true,
        opacity: 0.75,
      }),
    []
  );
  const vertebraMaterial = useMemo(
    () =>
      new PointsMaterial({
        color: new Color(readToken("--text-primary", "#f2f0ec")),
        size: 0.85,
        sizeAttenuation: true,
        transparent: true,
        depthWrite: false,
      }),
    []
  );
  const branchMaterial = useMemo(
    () =>
      new PointsMaterial({
        color: new Color(readToken("--signal", "#e3a857")),
        size: 0.5,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
      }),
    []
  );

  useEffect(() => () => vertebrae.dispose(), [vertebrae]);
  useEffect(() => () => spine.dispose(), [spine]);
  useEffect(() => () => branches.dispose(), [branches]);
  useEffect(() => () => spineMaterial.dispose(), [spineMaterial]);
  useEffect(() => () => vertebraMaterial.dispose(), [vertebraMaterial]);
  useEffect(() => () => branchMaterial.dispose(), [branchMaterial]);

  return (
    <group>
      <lineSegments geometry={spine} material={spineMaterial} />
      <points geometry={vertebrae} material={vertebraMaterial} />
      <points geometry={branches} material={branchMaterial} />
    </group>
  );
}
