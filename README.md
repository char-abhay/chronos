# CHRONOS

The personal portfolio of **Abhay P** — BCA graduate, Cloud Computing
specialisation, Bangalore.

It is built as a universe of eight regions. That framing is not decoration over a
CV: every object in the world is a piece of the actual record. The bodies in the
Solar System are the things that got built. The clusters in the Galaxy are the
skill groups, wired to the projects that use them. The accretion disk in Black
Holes is made of the problems that did not solve themselves.

**The portfolio is the content. CHRONOS is the presentation.**

## The eight regions

| # | Region | What it holds |
|---|---|---|
| 01 | Home | Name, credential, current status — the facts, immediately |
| 02 | Time | A scrubbable timeline: the degree, the internship and every build, on one axis |
| 03 | Earth | Kasaragod → Bangalore, the degree, and what each major subject became |
| 04 | Solar System | Every build, in full |
| 05 | Galaxy | The skill clusters, and what connects to what |
| 06 | Black Holes | The hard parts — technical problems, written up honestly |
| 07 | Future | Deliberately the sparsest page on the site |
| 08 | My Story | The whole arc, in one line |

## Non-negotiables

These are enforced, not aspirational.

- **The recruiter guarantee.** Name, credential and current role are in
  server-rendered HTML, above the fold, before any scroll, animation or
  JavaScript. Nothing cinematic is allowed to cost that.
- **It works with JavaScript off.** Two mechanisms, because there are two ways
  to lose content. Scroll reveals render hidden and are unhidden by script, so a
  `<noscript>` rule in the root layout forces them visible. Disclosures are
  native `<details>`, so their content is in the document from the first byte and
  the browser opens them. `tests/served-html.test.ts` reads the prerendered HTML
  and fails if either stops being true — this bullet was aspirational for
  months before that test existed.
- **Reduced motion is a rendering mode, not a fallback.** Components render a
  designed still state rather than a paused animation. Handled at four
  independent layers, down to the WebGL scene never being downloaded at all.
- **Contrast has a computed floor.** Every text token in `src/styles/tokens.css`
  carries its measured ratio, and `tests/tokens.test.ts` recomputes all of them
  from the hexes rather than trusting the comments. Everything that carries
  meaning clears WCAG AA on all three background levels — `--text-muted` is the
  floor at 5.5:1 on the page base and 5.2:1 on raised plates. `--text-faint` is
  decorative only, and there is a test asserting it stays below AA so it cannot
  quietly become load-bearing.
- **Structural accessibility is checked, not assumed.**
  `tests/a11y.test.ts` walks every prerendered route: one `<h1>` each, no
  skipped heading level, a `lang` and a `<main>`, unique ids, no positive
  `tabindex`, an accessible name on every link, button, summary and form
  control, and every `aria-labelledby`/`describedby`/`controls` pointing at an
  element that exists. What it cannot judge — whether the focus order reads
  well, whether the writing is clear — is left to a person, and the components
  carry their own notes on it.
- **No invented facts.** See below.

## The content layer

`src/content/` is pure typed data — it imports no React, no CSS and no three.js.
Every fact traces to a source.

Where a fact is genuinely unknown it is encoded as a branded `UNKNOWN` symbol
rather than an empty string or a plausible guess, so a gap is a type-level state
instead of something that quietly becomes invented text:

```
npm run gaps          # list every remaining gap, with file and line
npm run gaps -- --ci  # exit 1 if any remain — the pre-launch gate
```

## Architecture

```
src/
  content/      typed data: profile, education, experience, skills,
                projects, destinations, story. No React, no styling.
  styles/       tokens.css — the single source of truth for every
                colour, size, duration and easing
  components/
    atmosphere/ the CSS + Canvas 2D layer. Persistent, never unmounts
    three/      the WebGL world. Loaded only where it can run
    interactive/ TimeScrubber, SkillConstellation, SubjectTrace, Reveal
    ui/         design-system primitives
  lib/
    physics/    world geometry and camera poses — pure functions
    scene/      route ↔ region resolution, the camera bus
    motion/ a11y/ performance/  reduced motion, focus traps, device tier
```

**The WebGL layer is tiered and optional.** `useSceneTier` composes device
capability, a WebGL probe and the reduced-motion preference into one decision:

| Tier | Result |
|---|---|
| `full` | Full instance counts, dpr 2, pointer parallax on the camera |
| `lean` | The same world at about a third of the counts, dpr 1.5, camera still |
| `off` | The scene module is **never fetched**. three.js does not reach the device. |

Because the eight regions are places in one coordinate space rather than eight
separate scenes, a route change is a camera move and the world never unmounts.
`instrumentation-client.ts` starts that move the moment navigation begins, before
the destination route has rendered.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript, strict ·
Tailwind CSS v4 · three.js + React Three Fiber · GSAP · Lenis

No CMS, no database, no UI kit. Fonts are Instrument Sans, Inter and JetBrains
Mono via `next/font`.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

Quality gates:

```bash
npm run lint
npm run typecheck
npm run build
npm test        # pure modules, plus the non-negotiables read off the build
npm run gaps    # reports the standing gaps; --ci exits 1 on any
```

`npm test` needs `npm run build` to have run first: the served-HTML guard reads
`.next/server/app` rather than starting a server. CI runs `gaps` unflagged on
purpose — the remaining gaps are waiting on facts only Abhay has, and a red tick
that never goes green is a red tick everyone learns to ignore.

`/styleguide` renders the full design system — every token, primitive and
interaction state. It is noindexed and excluded from the sitemap.

## Status

Built in numbered phases; the history reads in order.

Phases 0–6 delivered the content layer, design system, navigation shell and every
region complete with zero 3D — the site was finished before any of it moved.
Phase 7 added the WebGL foundation: the persistent canvas, the camera rig and the
tiering that decides whether any of it loads. Phase 8 brought the scroll engine,
Phase 9 the eight per-region scenes, and Phase 10 shipped it — public URL,
social preview, contrast floor and CI.

Everything since has been correction rather than construction, and the commit
subjects say what each one was for. Three of them removed the same class of bug:
a fact typed by hand into a component that the content layer already knew, which
never throws and only ever makes the page quietly disagree with the record. One
gave the WebGL layer an error boundary, so a failure in the decoration can no
longer take the résumé down with it. The last put the disclosure content back in
the served HTML and added the tests that hold all of it in place.

Still open, and only Abhay can close them: the content gaps `npm run gaps`
lists.
