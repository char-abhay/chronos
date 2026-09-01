"use client";

/**
 * The last resort: a throw in the root layout itself.
 *
 * This replaces the layout rather than rendering inside it, so it owns
 * <html> and <body> and none of the app's chrome exists here. That also
 * means globals.css -- imported by layout.tsx, the thing that just
 * failed -- is not applied, and neither are the font variables. So the
 * colours are literal hex copied from src/styles/tokens.css and the
 * type falls back to a system stack, for the same reason
 * opengraph-image.tsx does it: this renders in a context where the
 * token layer cannot be relied on to exist.
 *
 * Kept deliberately small. Every line here is a line that could itself
 * throw, and there is nothing below this to catch it.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "#08090b",
          color: "#f2f0ec",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          lineHeight: 1.6,
        }}
      >
        <main style={{ maxWidth: "34rem" }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#8a867e",
            }}
          >
            Total signal loss
          </p>
          <h1 style={{ margin: "1rem 0 0", fontSize: "2rem", fontWeight: 600 }}>
            The site failed to load.
          </h1>
          <p style={{ margin: "1rem 0 0", color: "#b8b4ac" }}>
            This one is not your fault and not your browser. Reloading is
            worth a try.
          </p>
          {error.digest ? (
            <p
              style={{
                margin: "1.5rem 0 0",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: "0.75rem",
                color: "#8a867e",
              }}
            >
              {error.digest}
            </p>
          ) : null}
          <p style={{ margin: "2rem 0 0", display: "flex", gap: "1rem" }}>
            <button
              onClick={reset}
              style={{
                minHeight: "2.75rem",
                padding: "0 1.25rem",
                borderRadius: 2,
                border: "1px solid #e3a857",
                background: "transparent",
                color: "#e3a857",
                font: "inherit",
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            {/* A plain <a>, not next/link, and the rule is wrong here
                rather than being worked around. Link does a client-side
                navigation through the router -- the router lives in the
                React root that has just failed. A full document load is
                the only navigation that can be trusted from this page,
                and it is also the one most likely to fix things. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: "2.75rem",
                padding: "0 1.25rem",
                borderRadius: 2,
                border: "1px solid rgba(242,240,236,0.08)",
                color: "#b8b4ac",
                fontSize: "0.875rem",
                textDecoration: "none",
              }}
            >
              Back to start
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
