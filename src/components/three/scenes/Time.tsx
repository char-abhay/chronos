"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  LineBasicMaterial,
  Object3D,
  PointsMaterial,
} from "three";
import { AXIS_WIDTH, monthToX, time } from "@/lib/physics/layout";
import { AXIS_MONTHS } from "@/lib/format/timeline";
import { getSceneProgress } from "@/lib/scene/progress";
import { readToken } from "@/lib/scene/tokens";

/**
 * THREE YEARS, IN ORDER.
 *
 * The same forty-eight months and the same seven tracks the scrubber
 * draws on /time, read through the same toMonthIndex -- including its
 * rule that a year-only date ends in December. So the degree is one long
 * bar and every build is clustered into the final stretch of it, which is
 * the shape the flagship interaction exists to reveal. The world does not
 * get a different version of the timeline from the page.
 *
 * Scrolling sweeps the playhead across the axis. That is the one place in
 * the world where scroll does something specific rather than atmospheric,
 * and it is here because on this page time IS the interface.
 */

const TICK_Y = -8;

export function Time() {
  const ticks = useMemo(() => {
    const positions = new Float32Array(AXIS_MONTHS * 3);
    for (let i = 0; i < AXIS_MONTHS; i += 1) {
      positions[i * 3] = monthToX(i);
      positions[i * 3 + 1] = TICK_Y;
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    return geometry;
  }, []);

  /** January of each year, brighter -- the axis labels of the 2D version. */
  const yearTicks = useMemo(() => {
    const count = Math.ceil(AXIS_MONTHS / 12);
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = monthToX(i * 12);
      positions[i * 3 + 1] = TICK_Y;
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    return geometry;
  }, []);

  const bars = useMemo(() => {
    const positions = new Float32Array(time.length * 6);
    const colors = new Float32Array(time.length * 6);

    // Two colours, exactly as the scrubber: the degree is a measurement,
    // everything else is work.
    const study = new Color(readToken("--data", "#8fb8c4"));
    const work = new Color(readToken("--signal", "#e3a857"));

    time.forEach((track, i) => {
      positions[i * 6] = track.fromX;
      positions[i * 6 + 1] = track.y;
      positions[i * 6 + 3] = track.toX;
      positions[i * 6 + 4] = track.y;

      const color = track.kind === "education" ? study : work;
      for (let end = 0; end < 2; end += 1) {
        colors[i * 6 + end * 3] = color.r;
        colors[i * 6 + end * 3 + 1] = color.g;
        colors[i * 6 + end * 3 + 2] = color.b;
      }
    });

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("color", new BufferAttribute(colors, 3));
    return geometry;
  }, []);

  const playhead = useMemo(() => {
    const positions = new Float32Array([0, TICK_Y - 0.8, 0, 0, -TICK_Y, 0]);
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    return geometry;
  }, []);

  const tickMaterial = useMemo(
    () =>
      new PointsMaterial({
        color: new Color(readToken("--text-faint", "#5a5750")),
        size: 0.22,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
      }),
    []
  );
  const yearMaterial = useMemo(
    () =>
      new PointsMaterial({
        color: new Color(readToken("--text-secondary", "#b8b4ac")),
        size: 0.5,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
      }),
    []
  );
  const barMaterial = useMemo(
    () => new LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.85 }),
    []
  );
  const playheadMaterial = useMemo(
    () =>
      new LineBasicMaterial({
        color: new Color(readToken("--signal", "#e3a857")),
        transparent: true,
        opacity: 0.32,
      }),
    []
  );

  useEffect(() => () => ticks.dispose(), [ticks]);
  useEffect(() => () => yearTicks.dispose(), [yearTicks]);
  useEffect(() => () => bars.dispose(), [bars]);
  useEffect(() => () => playhead.dispose(), [playhead]);
  useEffect(() => () => tickMaterial.dispose(), [tickMaterial]);
  useEffect(() => () => yearMaterial.dispose(), [yearMaterial]);
  useEffect(() => () => barMaterial.dispose(), [barMaterial]);
  useEffect(() => () => playheadMaterial.dispose(), [playheadMaterial]);

  const head = useRef<Object3D>(null);
  const scroll = useRef(0);

  useFrame(() => {
    if (!head.current) return;
    scroll.current += (getSceneProgress() - scroll.current) * 0.06;
    head.current.position.x = (scroll.current - 0.5) * AXIS_WIDTH;
  });

  return (
    <group rotation={[0.12, 0, 0]}>
      <points geometry={ticks} material={tickMaterial} />
      <points geometry={yearTicks} material={yearMaterial} />
      <lineSegments geometry={bars} material={barMaterial} />
      <lineSegments ref={head} geometry={playhead} material={playheadMaterial} />
    </group>
  );
}
