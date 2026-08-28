"use client";

import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { Vector3, type PerspectiveCamera } from "three";
import type { DestinationId } from "@/content/schema";
import { MAX_TRAVERSAL, anchors, distance, poses } from "@/lib/physics/space";
import { onCameraRequest } from "@/lib/scene/cameraBus";
import { getSceneProgress } from "@/lib/scene/progress";
import { destinationIdForPath } from "@/lib/scene/route";

/**
 * The camera is the navigation.
 *
 * Regions are not separate scenes; they are places in one coordinate
 * space (lib/physics/space.ts). So a route change is a move, not a
 * remount, and that continuity is what makes eight pages read as one
 * universe rather than eight demos.
 *
 * Two things drive it:
 *   - `usePathname`, which is correct but only updates once the new
 *     route renders
 *   - the camera bus, which `instrumentation-client.ts` publishes to the
 *     moment a navigation STARTS, before the destination DOM exists
 *
 * The bus is what makes the move feel instant. The pathname effect is
 * the backstop for a direct load or a history navigation the bus missed.
 */

/** Mutable tween target. GSAP writes it; useFrame reads it. */
type Rig = {
  px: number; py: number; pz: number;
  tx: number; ty: number; tz: number;
  fov: number;
};

function rigFor(id: DestinationId): Rig {
  const pose = poses[id];
  return {
    px: pose.position[0], py: pose.position[1], pz: pose.position[2],
    tx: pose.target[0], ty: pose.target[1], tz: pose.target[2],
    fov: pose.fov,
  };
}

export function CameraRig({ parallax }: { parallax: boolean }) {
  const camera = useThree((state) => state.camera) as PerspectiveCamera;
  const pathname = usePathname();

  // Start already parked at the initial region: arriving should never
  // begin with a flight the visitor did not ask for. useRef only reads
  // its argument on the first render, so this is the initial region.
  const initial = destinationIdForPath(pathname);
  const rig = useRef<Rig>(rigFor(initial));
  const current = useRef<DestinationId>(initial);

  const lookAt = useRef(new Vector3());
  const pointer = useRef({ x: 0, y: 0, ax: 0, ay: 0 });

  // Damped copy of the scroll position. Lenis already smooths scrolling,
  // but this value is also reset to 0 the instant a route changes, and
  // easing toward it turns what would be a visible snap into part of the
  // traversal.
  const scroll = useRef(0);

  const flyTo = useCallback((id: DestinationId) => {
    if (current.current === id) return;

    // A hop to the next region should not take as long as a jump to the
    // far end of the world. --dur-traversal (900ms) is the baseline for
    // a typical move; the longest one stretches to roughly double.
    const span = distance(anchors[current.current], anchors[id]);
    const duration = 0.62 + 1.15 * Math.min(span / MAX_TRAVERSAL, 1);

    current.current = id;
    const next = rigFor(id);

    gsap.killTweensOf(rig.current);
    gsap.to(rig.current, {
      ...next,
      duration,
      // Gravity, not bounce -- no overshoot anywhere, per the motion
      // rules in styles/tokens.css.
      ease: "power3.out",
      overwrite: true,
    });
  }, []);

  // The bus fires first; this catches direct loads and back/forward.
  useEffect(() => {
    flyTo(destinationIdForPath(pathname));
  }, [pathname, flyTo]);

  useEffect(
    () => onCameraRequest((request) => flyTo(destinationIdForPath(request.pathname))),
    [flyTo]
  );

  useEffect(() => {
    if (!parallax) return;
    function onPointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      pointer.current.x = event.clientX / window.innerWidth - 0.5;
      pointer.current.y = event.clientY / window.innerHeight - 0.5;
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [parallax]);

  useFrame(() => {
    const state = rig.current;
    const p = pointer.current;

    // Ease toward the pointer rather than tracking it: an unsmoothed
    // parallax reads as jitter, and the offset stays small enough that
    // it never competes with an actual traversal.
    p.ax += (p.x - p.ax) * 0.045;
    p.ay += (p.y - p.ay) * 0.045;

    // Reading down a region draws the camera toward what it is framing.
    // A fraction of the way only -- arriving at the subject would leave
    // nowhere to go, and the approach is the part that reads as motion.
    scroll.current += (getSceneProgress() - scroll.current) * 0.06;
    const advance = scroll.current * 0.22;

    camera.position.set(
      state.px + (state.tx - state.px) * advance + p.ax * -2.6,
      state.py + (state.ty - state.py) * advance + p.ay * -1.8,
      state.pz + (state.tz - state.pz) * advance
    );
    lookAt.current.set(state.tx, state.ty, state.tz);
    camera.lookAt(lookAt.current);

    if (camera.fov !== state.fov) {
      camera.fov = state.fov;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
