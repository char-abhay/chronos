"use client";

import { useEffect } from "react";

/**
 * Escape closes every overlay in CHRONOS. No exceptions.
 * Listens on the document so it works regardless of where focus sits.
 */
export function useEscapeKey(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    function handle(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onEscape();
      }
    }
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [active, onEscape]);
}
