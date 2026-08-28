"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { setSceneProgress } from "@/lib/scene/progress";

/**
 * Smooth scrolling and the scroll-to-scene link.
 *
 * Lenis smooths the wheel; ScrollTrigger converts document scroll into a
 * normalised 0-1 that the camera reads. Renders nothing.
 *
 * Three deliberate constraints:
 *
 * 1. Under reduced motion this does nothing at all -- native scroll, no
 *    library, and the modules are never even fetched. Hijacking scroll
 *    from someone who asked for less motion is the exact opposite of
 *    what the preference means.
 * 2. Both libraries are dynamically imported, so they stay out of the
 *    initial bundle and off the recruiter path, the same bargain the
 *    WebGL layer makes.
 * 3. Touch scrolling is left native (Lenis `syncTouch` defaults off).
 *    Smoothing touch costs battery and fights the platform's own
 *    physics, which phones already do better than we would.
 */
export function ScrollProvider() {
  const reduced = useReducedMotion();
  const pathname = usePathname();

  // Held so the route-change effect can refresh measurements without
  // tearing down and rebuilding the scroll engine on every navigation.
  const refresh = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (reduced) {
      setSceneProgress(0);
      return;
    }

    let cancelled = false;
    let teardown: (() => void) | null = null;

    (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      // The import resolved after the component went away, or after the
      // motion preference flipped. Do not attach to a dead tree.
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({ smoothWheel: true });
      const root = document.documentElement;
      root.classList.add("lenis", "lenis-smooth");

      // Lenis drives ScrollTrigger, and GSAP's ticker drives Lenis --
      // one clock for both, rather than two rAF loops fighting over the
      // same frame. lagSmoothing(0) stops GSAP from silently skipping
      // time after a stall, which would desync the camera from the page.
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const trigger = ScrollTrigger.create({
        start: 0,
        end: () => Math.max(1, ScrollTrigger.maxScroll(window)),
        onUpdate: (self) => setSceneProgress(self.progress),
      });

      refresh.current = () => ScrollTrigger.refresh();

      teardown = () => {
        refresh.current = null;
        trigger.kill();
        gsap.ticker.remove(tick);
        lenis.destroy();
        root.classList.remove("lenis", "lenis-smooth");
        setSceneProgress(0);
      };
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [reduced]);

  // A new region is a new document height, and the reader starts at its
  // top. Reset first so the camera does not briefly hold the previous
  // page's scroll depth while ScrollTrigger re-measures.
  useEffect(() => {
    setSceneProgress(0);
    refresh.current?.();
  }, [pathname]);

  return null;
}
