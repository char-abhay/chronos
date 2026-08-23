"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { destinations } from "@/content/destinations";

/**
 * Sets data-destination on <html> so the per-region atmospheric hue
 * tokens apply (see styles/tokens.css).
 *
 * It lives on the root element because the atmosphere layers are fixed
 * and sit outside any page's DOM. Only the atmosphere hue changes --
 * every text and contrast token stays identical across regions, so a
 * region can never quietly become less readable than another.
 */
export function DestinationTheme() {
  const pathname = usePathname();

  useEffect(() => {
    const match = destinations.find((d) => d.href === pathname);
    const root = document.documentElement;
    if (match) {
      root.dataset.destination = match.id;
    } else {
      delete root.dataset.destination;
    }
  }, [pathname]);

  return null;
}
