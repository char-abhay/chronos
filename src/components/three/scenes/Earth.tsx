"use client";

import { useEffect, useMemo } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  LineBasicMaterial,
  PointsMaterial,
} from "three";
import { earth, move } from "@/lib/physics/layout";
import { seeded } from "@/lib/physics/random";
import { readToken } from "@/lib/scene/tokens";

/**
 * WHERE THIS STARTED.
 *
 * One line for the move -- Kasaragod to Bangalore, warm at the end it
 * arrived at -- and three subjects above it.
 *
 * Cloud Computing is the degree specialisation and has the most study
 * around it and nothing built. Blockchain and AI have one build each. The
 * page states that asymmetry plainly ("Two of them became something you
 * can open") and refuses to invent a third project to even it out, so the
 * world shows the same lopsided shape: the specialisation is the subject
 * with nothing orbiting it.
 */
export function Earth() {
  const journey = useMemo(() => {
    const positions = new Float32Array([...move.from, ...move.to]);
    const colors = new Float32Array(6);
    const departed = new Color(readToken("--text-secondary", "#b8b4ac"));
    const arrived = new Color(readToken("--signal", "#e3a857"));
    colors.set([departed.r, departed.g, departed.b], 0);
    colors.set([arrived.r, arrived.g, arrived.b], 3);
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("color", new BufferAttribute(colors, 3));
    return geometry;
  }, []);

  const endpoints = useMemo(() => {
    const positions = new Float32Array([...move.from, ...move.to]);
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    return geometry;
  }, []);

  /** The subject nodes themselves -- three, always three. */
  const subjects = useMemo(() => {
    const positions = new Float32Array(earth.length * 3);
    earth.forEach((subject, i) => {
      positions[i * 3] = subject.position[0];
      positions[i * 3 + 1] = subject.position[1];
      positions[i * 3 + 2] = subject.position[2];
    });
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    return geometry;
  }, []);

  /** What was studied: cold, because it is coursework, not a build. */
  const studied = useMemo(() => {
    const random = seeded(0x53554244); // "SUBD"
    const total = earth.reduce((sum, s) => sum + s.studies, 0);
    const positions = new Float32Array(total * 3);
    let i = 0;
    for (const subject of earth) {
      for (let n = 0; n < subject.studies; n += 1) {
        const angle = (n / Math.max(1, subject.studies)) * Math.PI * 2;
        positions[i * 3] = subject.position[0] + Math.cos(angle) * 1.9;
        positions[i * 3 + 1] = subject.position[1] + (random() - 0.5) * 1.2;
        positions[i * 3 + 2] = subject.position[2] + Math.sin(angle) * 1.9;
        i += 1;
      }
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    return geometry;
  }, []);

  /** What was built. Cloud contributes nothing here, on purpose. */
  const built = useMemo(() => {
    const total = earth.reduce((sum, s) => sum + s.builds, 0);
    const positions = new Float32Array(total * 3);
    let i = 0;
    for (const subject of earth) {
      for (let n = 0; n < subject.builds; n += 1) {
        positions[i * 3] = subject.position[0];
        positions[i * 3 + 1] = subject.position[1] - 3.2;
        positions[i * 3 + 2] = subject.position[2];
        i += 1;
      }
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    return geometry;
  }, []);

  const journeyMaterial = useMemo(
    () => new LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.8 }),
    []
  );
  const endpointMaterial = useMemo(
    () =>
      new PointsMaterial({
        color: new Color(readToken("--text-secondary", "#b8b4ac")),
        size: 0.7,
        sizeAttenuation: true,
        transparent: true,
        depthWrite: false,
      }),
    []
  );
  const subjectMaterial = useMemo(
    () =>
      new PointsMaterial({
        color: new Color(readToken("--text-primary", "#f2f0ec")),
        size: 0.95,
        sizeAttenuation: true,
        transparent: true,
        depthWrite: false,
      }),
    []
  );
  const studyMaterial = useMemo(
    () =>
      new PointsMaterial({
        color: new Color(readToken("--data", "#8fb8c4")),
        size: 0.42,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      }),
    []
  );
  const buildMaterial = useMemo(
    () =>
      new PointsMaterial({
        color: new Color(readToken("--signal", "#e3a857")),
        size: 0.8,
        sizeAttenuation: true,
        transparent: true,
        depthWrite: false,
      }),
    []
  );

  useEffect(() => () => journey.dispose(), [journey]);
  useEffect(() => () => endpoints.dispose(), [endpoints]);
  useEffect(() => () => subjects.dispose(), [subjects]);
  useEffect(() => () => studied.dispose(), [studied]);
  useEffect(() => () => built.dispose(), [built]);
  useEffect(() => () => journeyMaterial.dispose(), [journeyMaterial]);
  useEffect(() => () => endpointMaterial.dispose(), [endpointMaterial]);
  useEffect(() => () => subjectMaterial.dispose(), [subjectMaterial]);
  useEffect(() => () => studyMaterial.dispose(), [studyMaterial]);
  useEffect(() => () => buildMaterial.dispose(), [buildMaterial]);

  return (
    <group>
      <lineSegments geometry={journey} material={journeyMaterial} />
      <points geometry={endpoints} material={endpointMaterial} />
      <points geometry={subjects} material={subjectMaterial} />
      <points geometry={studied} material={studyMaterial} />
      <points geometry={built} material={buildMaterial} />
    </group>
  );
}
