# CHRONOS

The personal portfolio of **Abhay P** — BCA graduate, Cloud Computing
specialisation, Bangalore.

It is built as a universe of eight regions. That framing is not decoration over a
CV: every object in the world is a piece of the actual record. The five bodies in
the Solar System are the five things that got built. The six clusters in the
Galaxy are the six skill groups, wired to the projects that use them. The
accretion disk in Black Holes is made of the problems that did not solve
themselves.

**The portfolio is the content. CHRONOS is the presentation.**

## The eight regions

| # | Region | What it holds |
|---|---|---|
| 01 | Home | Name, credential, current status — the facts, immediately |
| 02 | Time | A scrubbable timeline across 2023–2026: degree, internship, five builds |
| 03 | Earth | Kasaragod → Bangalore, the degree, and what each major subject became |
| 04 | Solar System | The five builds, in full |
| 05 | Galaxy | Six skill clusters, and what connects to what |
| 06 | Black Holes | The hard parts — technical problems, written up honestly |
| 07 | Future | Deliberately the sparsest page on the site |
| 08 | My Story | The whole arc, in one line |

## Non-negotiables

These are enforced, not aspirational.

- **The recruiter guarantee.** Name, credential and current role are in
  server-rendered HTML, above the fold, before any scroll, animation or
  JavaScript. Nothing cinematic is allowed to cost that.
- **It works with JavaScript off.** Scroll reveals render hidden and are unhidden
  by script; a `<noscript>` rule in the root layout forces them visible, so the
  content never depends on the animation layer.
- **Reduced motion is a rendering mode, not a fallback.** Components render a
  designed still state rather than a paused animation. Handled at four
  independent layers, down to the WebGL scene never being downloaded at all.
- **Contrast has a documented floor.** Every text token in `src/styles/tokens.css`
  carries its measured ratio. `--text-muted` at 5.4:1 is the hard floor for
  anything meaningful; `--text-faint` is decorative only and never load-bearing.
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
| `full` | Complete scene, postprocessing, pointer parallax |
| `lean` | Geometry only — no postprocessing, reduced instance counts |
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
npm run gaps -- --ci
npm run build
```

`/styleguide` renders the full design system — every token, primitive and
interaction state. It is noindexed and excluded from the sitemap.

## Status

Built in numbered phases; the history reads in order.

Phases 0–6 delivered the content layer, design system, navigation shell and every
region complete with zero 3D. Phase 7 added the WebGL foundation: the persistent
canvas, the camera rig and the tiering that decides whether any of it loads.

In progress: the scroll engine (Phase 8) and the per-region scenes (Phase 9).
Until Phase 9 lands, the world is a star field with a light at each region anchor.
