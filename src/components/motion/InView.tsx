"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Scroll-triggered entrance. IntersectionObserver plus two CSS
 * properties -- no animation library, no scroll listener, no layout
 * thrash. Only opacity and transform are animated, both compositor-only.
 *
 * Fires once and then disconnects: re-animating every time something
 * scrolls past is what makes a site feel restless.
 *
 * Under reduced motion the global CSS rule neutralises the transition,
 * so content simply appears at its final state.
 */
export function InView({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      // Marks this as JS-driven so the <noscript> rule in the root
      // layout can force it visible. Without that, disabling JavaScript
      // leaves every revealed element permanently at opacity 0 -- the
      // server renders the hidden state and nothing ever unhides it.
      data-reveal=""
      style={{
        transitionDelay: delay + "ms",
        transitionDuration: "var(--dur-ui)",
        transitionTimingFunction: "var(--ease-out)",
        transitionProperty: "opacity, transform",
      }}
      className={cn(
        shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}
