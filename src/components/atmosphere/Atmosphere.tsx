import { DestinationTheme } from "@/components/atmosphere/DestinationTheme";
import { StarField } from "@/components/atmosphere/StarField";

/**
 * The persistent atmospheric layer.
 *
 * It lives in the root layout and never unmounts, so moving between
 * regions does not flash black -- only the hue shifts. That continuity
 * is the actual mechanism behind "one universe"; the imagery is
 * secondary.
 *
 * Everything here is decorative and aria-hidden. No information is
 * carried by any of it.
 */
export function Atmosphere() {
  return (
    <>
      <DestinationTheme />

      {/* Depth gradients. Pure CSS, no repaint cost, and they carry the
          per-destination hue shift. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-20"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, var(--atmo-near), transparent 60%)," +
            "radial-gradient(90% 60% at 15% 100%, var(--atmo-mid), transparent 55%)," +
            "radial-gradient(70% 50% at 85% 75%, var(--atmo-far), transparent 60%)",
          transition: "background var(--dur-traversal) var(--ease-out)",
        }}
      />

      <StarField />

      {/* A faint horizon: the one piece of geometry in the atmosphere. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-[62vh] -z-10 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--hairline-strong) 30%, var(--hairline-strong) 70%, transparent)",
        }}
      />
    </>
  );
}
