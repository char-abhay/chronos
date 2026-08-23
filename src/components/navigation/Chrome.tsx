"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MapOverlay } from "@/components/navigation/MapOverlay";
import { Panel } from "@/components/ui/Panel";
import { destinations } from "@/content/destinations";
import { cn } from "@/lib/cn";

/**
 * The persistent chrome: nav rail on desktop, bottom bar on mobile, and
 * the two overlays.
 *
 * `profileContent` is passed in as a rendered node from the server
 * layout rather than imported here. That keeps the profile content out
 * of the client bundle while still letting a client component own the
 * open/closed state.
 *
 * Metaphor rule (plan Section C.2): metaphor the rooms, not the
 * doorknobs. Destinations get thematic names; every control is labelled
 * in plain language. A recruiter must never decode a control to use it.
 */
export function Chrome({ profileContent }: { profileContent: React.ReactNode }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close everything on navigation, or overlays linger over the new page.
  //
  // Adjusting state during render rather than in an effect: this is the
  // documented React pattern for "reset state when a prop changes", and
  // it avoids the extra render pass an effect would cause -- which here
  // would briefly paint the old overlay over the new page.
  const [renderedAt, setRenderedAt] = useState(pathname);
  if (renderedAt !== pathname) {
    setRenderedAt(pathname);
    setProfileOpen(false);
    setMapOpen(false);
    setMenuOpen(false);
  }

  const controlClass = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-[2px]",
    "border border-hairline px-3 text-body-sm text-secondary",
    "transition-colors dur-micro hover:border-signal hover:text-primary"
  );

  return (
    <>
      {/* ---------------- DESKTOP RAIL ---------------- */}
      <div className="fixed inset-y-0 start-0 z-40 hidden w-[var(--rail-width)] flex-col items-center gap-6 border-e border-hairline bg-ground py-6 lg:flex">
        <Link
          href="/"
          className="font-mono text-label uppercase tracking-label text-signal"
        >
          <span aria-hidden="true">CH</span>
          <span className="sr-only">CHRONOS — home</span>
        </Link>

        <nav aria-label="Destinations" className="flex-1">
          <ol className="flex flex-col gap-1">
            {destinations.map((d) => {
              const active = pathname === d.href;
              return (
                <li key={d.id}>
                  <Link
                    href={d.href}
                    aria-current={active ? "page" : undefined}
                    title={d.name}
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-[2px]",
                      "font-mono text-label tabular transition-colors dur-micro",
                      active
                        ? "bg-ground-raised text-signal"
                        : "text-faint hover:text-primary"
                    )}
                  >
                    <span aria-hidden="true">{d.index}</span>
                    <span className="sr-only">{d.name}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setMapOpen(true)}
            className={cn(controlClass, "h-11 w-11 px-0")}
          >
            <span aria-hidden="true">&#9678;</span>
            <span className="sr-only">Open map of all destinations</span>
          </button>
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className={cn(controlClass, "h-11 w-11 px-0 border-signal text-signal")}
          >
            <span aria-hidden="true">&#9679;</span>
            <span className="sr-only">Open profile</span>
          </button>
        </div>
      </div>

      {/* ---------------- MOBILE BOTTOM BAR ---------------- */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-ground lg:hidden">
        <div className="flex items-stretch justify-around gap-2 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className={cn(controlClass, "flex-1")}
          >
            Menu
          </button>
          <button
            type="button"
            onClick={() => setMapOpen(true)}
            className={cn(controlClass, "flex-1")}
          >
            Map
          </button>
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className={cn(controlClass, "flex-1 border-signal text-signal")}
          >
            Profile
          </button>
        </div>
      </div>

      {/* ---------------- OVERLAYS ---------------- */}
      <Panel
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title="Destinations"
      >
        <nav aria-label="Destinations">
          <ol className="flex flex-col gap-1">
            {destinations.map((d) => {
              const active = pathname === d.href;
              return (
                <li key={d.id}>
                  <Link
                    href={d.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-baseline gap-4 rounded-[2px] px-3 py-2",
                      "transition-colors dur-micro hover:bg-ground-raised",
                      active && "bg-ground-raised"
                    )}
                  >
                    <span
                      className={cn(
                        "font-mono text-label tabular",
                        active ? "text-signal" : "text-faint"
                      )}
                    >
                      {d.index}
                    </span>
                    <span
                      className={cn(
                        "font-display",
                        active ? "text-signal" : "text-primary"
                      )}
                    >
                      {d.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>
      </Panel>

      <Panel open={mapOpen} onClose={() => setMapOpen(false)} title="Map">
        <MapOverlay onNavigate={() => setMapOpen(false)} />
      </Panel>

      <Panel
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        title="Profile"
      >
        {profileContent}
      </Panel>
    </>
  );
}
