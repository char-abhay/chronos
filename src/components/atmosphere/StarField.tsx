"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { starCount, useDeviceTier } from "@/lib/performance/useDeviceTier";

/**
 * Canvas 2D, not WebGL. On purpose.
 *
 * This delivers the depth and drift that make the site feel like it has
 * air in it, for about 1KB of code and no three.js on the recruiter
 * path. Adding WebGL here would roughly triple the JavaScript on every
 * page to buy an effect nobody would consciously notice.
 *
 * Everything expensive is guarded:
 *   - the loop stops when the tab is hidden
 *   - reduced motion renders ONE frame and never starts a loop
 *   - device tier sets the star count
 *   - devicePixelRatio is capped at 2 (the single largest mobile win)
 *   - pointer parallax is desktop-only and tiny
 */

type Star = {
  x: number;
  y: number;
  z: number; // 0 = far, 1 = near. Drives size, opacity and parallax.
  drift: number;
};

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const tier = useDeviceTier();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const count = starCount[tier];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let raf = 0;
    let running = true;

    // Pointer parallax target, in pixels. Deliberately small.
    let targetX = 0;
    let targetY = 0;
    let panX = 0;
    let panY = 0;

    function seed() {
      stars = Array.from({ length: count }, () => {
        const z = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          drift: (0.006 + z * 0.014) * (Math.random() > 0.5 ? 1 : -1),
        };
      });
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      for (const star of stars) {
        const depth = 0.35 + star.z * 0.65;
        const radius = 0.35 + star.z * 1.0;
        const alpha = 0.12 + star.z * 0.4;

        const x = star.x + panX * depth;
        const y = star.y + panY * depth;

        ctx!.beginPath();
        ctx!.arc(x, y, radius, 0, Math.PI * 2);
        // Warm-neutral, matching --text-primary rather than pure white:
        // pure white stars read as blue against this ground.
        ctx!.fillStyle = "rgba(242, 240, 236, " + alpha.toFixed(3) + ")";
        ctx!.fill();
      }
    }

    function step() {
      if (!running) return;
      for (const star of stars) {
        star.x += star.drift;
        if (star.x < -2) star.x = width + 2;
        if (star.x > width + 2) star.x = -2;
      }
      // Ease toward the pointer target. No spring, no overshoot.
      panX += (targetX - panX) * 0.04;
      panY += (targetY - panY) * 0.04;
      draw();
      raf = requestAnimationFrame(step);
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      targetX = nx * -12;
      targetY = ny * -8;
    }

    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduced) {
        running = true;
        raf = requestAnimationFrame(step);
      }
    }

    resize();

    if (reduced) {
      // A designed still frame, not a paused animation.
      draw();
    } else {
      raf = requestAnimationFrame(step);
      if (tier === "high") {
        window.addEventListener("pointermove", onPointerMove, {
          passive: true,
        });
      }
    }

    const observer = new ResizeObserver(() => {
      resize();
      if (reduced) draw();
    });
    observer.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [reduced, tier]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
