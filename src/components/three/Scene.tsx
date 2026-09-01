"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { BlackHoles } from "@/components/three/scenes/BlackHoles";
import { Earth } from "@/components/three/scenes/Earth";
import { Future } from "@/components/three/scenes/Future";
import { Galaxy } from "@/components/three/scenes/Galaxy";
import { Home } from "@/components/three/scenes/Home";
import { SolarSystem } from "@/components/three/scenes/SolarSystem";
import { Story } from "@/components/three/scenes/Story";
import { Time } from "@/components/three/scenes/Time";
import { CameraRig } from "@/components/three/shared/CameraRig";
import { Region } from "@/components/three/shared/Region";
import { Starfield } from "@/components/three/shared/Starfield";
import { sceneBudget, type SceneTier } from "@/lib/performance/useSceneTier";
import { setSceneActive } from "@/lib/scene/sceneState";
import { poses } from "@/lib/physics/space";

/**
 * The WebGL world. Mounted once, never unmounted.
 *
 * This module is only ever reached through SceneRoot's dynamic import,
 * so three.js stays out of the initial bundle and off the recruiter
 * path entirely. Never import it statically.
 *
 * The canvas is decorative in the strictest sense: aria-hidden, not
 * focusable, no pointer events, and it carries no information that is
 * not also in the DOM above it. Turning it off costs a visitor nothing
 * but atmosphere.
 */
export function Scene({ tier }: { tier: Exclude<SceneTier, "off"> }) {
  const budget = sceneBudget[tier];

  // Tell the Canvas 2D field to stand down, but only once this actually
  // mounts -- otherwise the sky goes empty while the chunk downloads.
  useEffect(() => {
    setSceneActive(true);
    return () => setSceneActive(false);
  }, []);

  /**
   * Next 16 can hide a route with React <Activity> (display: none)
   * instead of unmounting it, and a hidden canvas keeps its RAF loop.
   * Parking frameloop on "never" is the documented equivalent of the
   * pause-on-visibilitychange guard the 2D field already uses.
   */
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");
  useEffect(() => {
    function onVisibility() {
      setFrameloop(document.hidden ? "never" : "always");
    }
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  /**
   * Losing the GL context is routine, not exceptional: a backgrounded
   * tab, memory pressure or a GPU process restart will do it, and on a
   * mid-range phone all three are ordinary events.
   *
   * Nothing unmounts when it happens, so the effect above never runs its
   * cleanup and `sceneActive` stays true. The canvas becomes a dead
   * transparent rectangle AND the 2D star field that exists to cover
   * exactly this case keeps standing down, because it reads that flag.
   * The result is an empty sky for the rest of the session, surviving a
   * soft reload. sceneState already describes the intent -- "tearing the
   * 3D scene down brings it straight back with no flash of empty sky" --
   * it was simply never wired to the loss event.
   *
   * preventDefault() is not optional: without it the browser will not
   * fire webglcontextrestored at all, and the loss becomes permanent by
   * choice rather than by circumstance.
   *
   * The element is taken from onCreated and handled here rather than
   * inline, because onCreated offers no cleanup hook and these listeners
   * have to come off on unmount.
   */
  const [glCanvas, setGlCanvas] = useState<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!glCanvas) return;

    function onLost(event: Event) {
      event.preventDefault();
      setSceneActive(false);
      setFrameloop("never");
    }
    function onRestored() {
      setSceneActive(true);
      setFrameloop(document.hidden ? "never" : "always");
    }

    glCanvas.addEventListener("webglcontextlost", onLost);
    glCanvas.addEventListener("webglcontextrestored", onRestored);
    return () => {
      glCanvas.removeEventListener("webglcontextlost", onLost);
      glCanvas.removeEventListener("webglcontextrestored", onRestored);
    };
  }, [glCanvas]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      data-scene="webgl"
    >
      <Canvas
        frameloop={frameloop}
        onCreated={({ gl }) => setGlCanvas(gl.domElement)}
        dpr={[1, budget.dpr]}
        gl={{
          antialias: tier === "full",
          powerPreference: "high-performance",
          alpha: true,
        }}
        camera={{
          position: [...poses.home.position],
          fov: poses.home.fov,
          near: 0.1,
          far: 3000,
        }}
      >
        <CameraRig parallax={tier === "full"} />
        <Starfield count={budget.stars} />

        {/* Eight regions, in the order the site travels through them.
            Every anchor now holds the record rather than a marker, which
            is what let the Phase 7 scaffold go. */}
        <Region id="home">
          <Home />
        </Region>
        <Region id="time">
          <Time />
        </Region>
        <Region id="earth">
          <Earth />
        </Region>
        <Region id="solar-system">
          <SolarSystem />
        </Region>
        <Region id="galaxy">
          <Galaxy dust={budget.dust} />
        </Region>
        <Region id="black-holes">
          <BlackHoles disk={budget.disk} />
        </Region>
        <Region id="future">
          <Future />
        </Region>
        <Region id="story">
          <Story />
        </Region>
      </Canvas>
    </div>
  );
}
