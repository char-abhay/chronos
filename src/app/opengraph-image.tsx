import { ImageResponse } from "next/og";
import { destinations } from "@/content/destinations";
import { education, profile } from "@/content";

/**
 * WHAT A PASTED LINK LOOKS LIKE.
 *
 * Generated at build time, so it costs a visitor nothing and there is no
 * binary to keep in sync with the design system.
 *
 * COLOURS ARE LITERAL HEX HERE, AND ONLY HERE. Every component in this
 * repo is forbidden from writing a raw colour -- but ImageResponse renders
 * through satori in an isolated context with no document, no stylesheet
 * and therefore no CSS custom properties, so `readToken()` has nothing to
 * read. These values are copied from src/styles/tokens.css and must be
 * updated with it.
 *
 * No custom font on purpose. ImageResponse can only use a font read off
 * disk as a .ttf, and next/font/google's output is not reachable from
 * here. Committing a font binary to serve one image is a bad trade, so
 * identity comes from layout, the CH mark and the signal rule instead.
 */

export const alt =
  `CHRONOS — ${profile.name}, ${profile.credential} specialising in ` +
  education.specialisation;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GROUND = "#08090b";
const RAISED = "#101216";
const PRIMARY = "#f2f0ec";
const SECONDARY = "#b8b4ac";
const MUTED = "#8a867e";
const SIGNAL = "#e3a857";
const HAIRLINE = "rgba(242, 240, 236, 0.08)";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: GROUND,
          padding: "72px 80px",
        }}
      >
        {/* The mark, and what this is. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              background: RAISED,
              border: `1px solid ${HAIRLINE}`,
              color: SIGNAL,
              fontSize: 22,
              letterSpacing: 2,
            }}
          >
            CH
          </div>
          <div style={{ color: MUTED, fontSize: 20, letterSpacing: 6 }}>
            CHRONOS
          </div>
        </div>

        {/* The only thing that has to survive being seen at thumbnail size. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: PRIMARY,
              fontSize: 104,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            {profile.name}
          </div>
          <div
            style={{
              marginTop: 24,
              width: 96,
              height: 2,
              background: SIGNAL,
              display: "flex",
            }}
          />
          <div
            style={{
              marginTop: 28,
              color: SECONDARY,
              fontSize: 34,
              lineHeight: 1.3,
            }}
          >
            {profile.credential + ", " + education.specialisation}
          </div>
          <div style={{ marginTop: 12, color: MUTED, fontSize: 26 }}>
            A journey through space and time that happens to be a portfolio.
          </div>
        </div>

        {/* The eight destinations, in travel order -- the site's own spine. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            borderTop: `1px solid ${HAIRLINE}`,
            paddingTop: 28,
          }}
        >
          {destinations.map((destination) => (
            <div
              key={destination.id}
              style={{
                display: "flex",
                color: destination.id === "home" ? SIGNAL : MUTED,
                fontSize: 22,
                letterSpacing: 1,
              }}
            >
              {destination.index}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
