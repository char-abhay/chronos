import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { ContentPlate } from "@/components/layout/ContentPlate";
import { Section } from "@/components/layout/Section";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Disclosure } from "@/components/ui/Disclosure";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Field } from "@/components/ui/Field";
import { Stamp } from "@/components/ui/Stamp";
import { Timeline, TimelineItem } from "@/components/ui/Timeline";
import { Tooltip } from "@/components/ui/Tooltip";
import { PanelDemo } from "./PanelDemo";

/* Private development route. Never indexed, never in the sitemap. */
export const metadata: Metadata = {
  title: "Style guide",
  robots: { index: false, follow: false },
};

const backgrounds = [
  ["--ground", "#08090b", "Page base"],
  ["--ground-raised", "#101216", "Plates, cards"],
  ["--ground-inset", "#050608", "Wells, inputs"],
];

const textLevels = [
  ["--text-primary", "text-primary", "17.50:1", "Headings, key facts"],
  ["--text-secondary", "text-secondary", "9.64:1", "Body prose"],
  ["--text-muted", "text-muted", "5.49:1", "Supporting — HARD FLOOR"],
  ["--text-faint", "text-faint", "2.76:1", "Decorative only"],
];

export default function StyleGuide() {
  return (
    <div className="py-16">
      <Container>
        <Stamp>CHRONOS · design system · phase 2</Stamp>
        <h1 className="mt-6 font-display text-display-lg leading-display tracking-display text-primary">
          Style guide
        </h1>
        <p className="mt-4 max-w-reading text-secondary">
          Every primitive, with all five interaction states. Test this page
          with the keyboard alone, then again with reduced motion enabled.
          If something is unreachable by Tab, it is broken.
        </p>

        {/* ---------------- COLOUR ---------------- */}
        <Section id="colour" title="Colour">
          <p className="max-w-reading text-secondary">
            Two accents, strictly separated by function. Warm means you can
            act on it. Cold means it is a measurement. Colour is a category
            here, not decoration — which makes it an affordance rather than
            a style choice.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {backgrounds.map(([token, hex, use]) => (
              <div
                key={token}
                className="rounded-[2px] border border-hairline p-4"
                style={{ backgroundColor: "var(" + token + ")" }}
              >
                <p className="font-mono text-label text-primary">{token}</p>
                <p className="mt-1 font-mono text-label text-muted">{hex}</p>
                <p className="mt-3 text-body-sm text-muted">{use}</p>
              </div>
            ))}
          </div>

          <table className="mt-8 w-full border-collapse text-start">
            <caption className="mb-3 text-start text-body-sm text-muted">
              Text hierarchy and measured contrast against --ground. Computed, not estimated.
            </caption>
            <thead>
              <tr className="border-b border-hairline">
                <th scope="col" className="py-2 text-start font-mono text-label uppercase tracking-label text-muted">
                  Token
                </th>
                <th scope="col" className="py-2 text-start font-mono text-label uppercase tracking-label text-muted">
                  Sample
                </th>
                <th scope="col" className="py-2 text-start font-mono text-label uppercase tracking-label text-muted">
                  Ratio
                </th>
                <th scope="col" className="py-2 text-start font-mono text-label uppercase tracking-label text-muted">
                  Use
                </th>
              </tr>
            </thead>
            <tbody>
              {textLevels.map(([token, cls, ratio, use]) => (
                <tr key={token} className="border-b border-hairline">
                  <td className="py-3 font-mono text-label text-muted">{token}</td>
                  <td className={"py-3 " + cls}>The quick brown fox</td>
                  <td className="py-3 font-mono text-label text-data tabular">{ratio}</td>
                  <td className="py-3 text-body-sm text-muted">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-8 flex flex-wrap gap-6">
            <p className="text-signal">--signal · interactive</p>
            <p className="text-data font-mono">--data · measurement · τ Δt γ c ∞</p>
            <p style={{ color: "var(--status-warn)" }}>--status-warn</p>
            <p style={{ color: "var(--status-error)" }}>--status-error</p>
            <p style={{ color: "var(--status-ok)" }}>--status-ok</p>
          </div>
        </Section>

        {/* ---------------- TYPE ---------------- */}
        <Section id="type" title="Typography">
          <p className="font-display text-display-xl leading-display tracking-display text-primary">
            Display XL
          </p>
          <p className="mt-4 font-display text-display-md leading-display tracking-display text-primary">
            Display MD
          </p>
          <p className="mt-6 max-w-reading text-body-lg text-secondary">
            Body large. Measure is capped so lines stay readable — the
            prose column never exceeds roughly 68 characters regardless of
            how wide the window gets.
          </p>
          <p className="mt-4 max-w-reading text-secondary">
            Body. Sixteen pixels minimum on mobile, non-negotiable. Body
            size steps at breakpoints rather than scaling fluidly, because
            fluid body text produces awkward intermediate values.
          </p>
          <p className="mt-4 font-mono text-body-sm text-data tabular">
            Mono · 1234567890 · γ = 1 / √(1 − v²/c²)
          </p>
        </Section>

        {/* ---------------- BUTTONS ---------------- */}
        <Section id="buttons" title="Buttons">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
            <ButtonLink href="/" variant="secondary">
              Link as button
            </ButtonLink>
          </div>
          <p className="mt-6 max-w-reading text-body-sm text-muted">
            Tab through these. The focus ring is a 2px signal outline with a
            2px offset, visible on every background level. It is designed
            first — hover is derived from it, not the other way round.
          </p>
        </Section>

        {/* ---------------- CARDS ---------------- */}
        <Section id="cards" title="Cards">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card href="/styleguide">
              <Stamp>Academic · March 2026</Stamp>
              <h3 className="mt-3 font-display text-body-lg text-primary">
                Card with a link
              </h3>
              <p className="mt-2 text-body-sm text-secondary">
                The whole card is the target. Border warms on hover and on
                focus, and it lifts nothing — depth comes from the
                background hierarchy, not shadows.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Chip>Arduino Uno</Chip>
                <Chip>Ultrasonic sensor</Chip>
              </div>
            </Card>

            <Card>
              <Stamp>No repository</Stamp>
              <h3 className="mt-3 font-display text-body-lg text-primary">
                Card without a link
              </h3>
              <p className="mt-2 text-body-sm text-secondary">
                No ghost button, no disabled state, no “private repo” badge.
                Height is driven by content, so absence leaves no visible
                hole — which is the whole point.
              </p>
            </Card>
          </div>
        </Section>

        {/* ---------------- DISCLOSURE + TOOLTIP ---------------- */}
        <Section id="disclosure" title="Progressive disclosure">
          <p className="max-w-reading text-secondary">
            Science content runs L1 → L2 → L3. The headline is always
            visible; depth is opt-in. Inline terms use a{" "}
            <Tooltip label="tooltip">
              Not hover-only. This is a real button that toggles a popover,
              so it works with tap, click, Enter, Space and Escape.
            </Tooltip>{" "}
            rather than a hover target.
          </p>

          <div className="mt-8 max-w-reading">
            <Disclosure summary="Level 2 — accessible explanation">
              <p>
                Built on native details/summary. Zero JavaScript, correct
                keyboard behaviour for free, and it cannot break if a script
                fails to load.
              </p>
            </Disclosure>
            <Disclosure summary="Level 3 — deeper detail">
              <p>
                The Lorentz factor γ = 1 / √(1 − v²/c²) relates time
                measured in your frame to the proper time experienced by a
                moving object.
              </p>
            </Disclosure>
          </div>
        </Section>

        {/* ---------------- TIMELINE ---------------- */}
        <Section id="timeline" title="Timeline">
          <Timeline>
            <TimelineItem marker="June 2025 – August 2025" title="Timeline item">
              <p>
                Renders an ordered list, because it is one. Screen readers
                announce “list, N items” and users can navigate it as a
                structure rather than as decorated text.
              </p>
            </TimelineItem>
            <TimelineItem marker="March 2026" title="Second item" />
          </Timeline>
        </Section>

        {/* ---------------- FORM ---------------- */}
        <Section id="form" title="Form fields">
          <div className="grid max-w-reading gap-6">
            <Field id="sg-name" label="Name" autoComplete="name" required />
            <Field
              id="sg-email"
              label="Email"
              type="email"
              autoComplete="email"
              required
              error="Enter an email address so a reply can reach you."
            />
            <Field id="sg-message" label="Message" multiline />
          </div>
          <p className="mt-6 max-w-reading text-body-sm text-muted">
            Labels are visible and persistent. Placeholder-as-label is
            banned — it vanishes exactly when it is most needed. Errors
            carry text and an icon, never colour alone.
          </p>
        </Section>

        {/* ---------------- PANEL ---------------- */}
        <Section id="panel" title="Panel">
          <p className="max-w-reading text-secondary">
            The overlay used by PROFILE and MAP. Focus moves in, Tab is
            trapped, Escape closes, and focus returns to the trigger.
          </p>
          <div className="mt-6">
            <PanelDemo />
          </div>
        </Section>

        {/* ---------------- PLATE ---------------- */}
        <Section id="plate" title="Content plate">
          <ContentPlate className="max-w-reading">
            <p className="text-secondary">
              The mandatory backdrop for text sitting over an animated
              layer. This component exists so the rule is enforceable
              rather than remembered: body text never sits directly on
              moving atmosphere.
            </p>
          </ContentPlate>
        </Section>

        <Section id="links" title="External links">
          <ExternalLink href="https://github.com/char-abhay">
            github.com/char-abhay
          </ExternalLink>
          <p className="mt-4 max-w-reading text-body-sm text-muted">
            The arrow is the visual marker. Screen readers get “opens in a
            new tab” as real text.
          </p>
        </Section>
      </Container>
    </div>
  );
}
