# CLAUDE.md

Operating notes for working in this repo. Visual system lives in
[DESIGN.md](DESIGN.md); this file is about how the code is organised and
which mistakes are easy to make.

## What this is

A single-page portfolio for **Deepak Jaygopal Gond** — Data Analyst / Data
Engineering. One route, no backend, no CMS. The argument the page makes is
"I turn operational data into measurable decisions", and every section
exists to support that.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # -> dist/
npm run preview    # http://localhost:4173, serves the build
```

## Stack

React 19 + Vite, Three.js for the hero, GSAP + ScrollTrigger for scroll.
Plain CSS with custom properties — **no Tailwind, no CSS-in-JS, no UI kit,
no state library.**

`@vitejs/plugin-react` is pinned to `^5.2.0`: v6 requires Vite 8 and this
project is on Vite 7. Don't "fix" it by upgrading one without the other.

## Where things live

```
index.html              Shell: SEO + JSON-LD, icon sprite, theme bootstrap, #root
src/
  data/profile.js       EVERY factual claim on the site
  components/           One per region, plus Icon / Tag / SectionHead / Sparkline
  hooks/                Behaviour: theme, reveals, counters, scroll, 3D mount
  three/pipeline.js     The hero scene (imperative, not R3F)
  styles/
    fonts.css           @font-face for three self-hosted families
    tokens.css          Both themes. The only file with raw colour values.
    base.css            Reset, type, layout primitives, focus
    components.css      One block per region + the interaction layer
docs/svg-prompts.md     Briefs for SVGs still to be made
```

## Rules that actually matter

1. **Content lives in `src/data/profile.js`.** Never hard-code copy inside a
   component. Components map over data.
2. **Nothing is invented.** The resume is the source of truth for every
   metric, date, employer and link. The only URLs used are ones that appear
   on it (`linkedin.com/in/deepak-gond`, `github.com/frienf`,
   `leetcode.com/u/dgond`). No fabricated repo links.
3. **No raw colours outside `tokens.css`.** `components.css` and `base.css`
   contain zero `oklch(...)` literals, and it must stay that way or the
   light theme silently breaks.
4. **AAA (7:1) is the floor, in both themes.** Measure, don't eyeball. The
   light accents are solved values, not taste.
5. **Don't add a second animation library.** GSAP covers scroll, CSS covers
   state, the scene owns its own loop.
6. **Reduced motion must keep all content.** Every motion path has a branch
   that resolves to the final state.

## The hero scene

`src/three/pipeline.js` — five node clusters, RAW DATA → INSIGHT. Node count
falls and size rises left to right; packets ride precomputed paths.

It is deliberately **imperative, not React Three Fiber**: it consumes zero
React state, so R3F would add ~50 kB and reconciliation for no gain.

Public API is `createPipelineScene(canvas, { reducedMotion, theme })`
returning `{ camera, root, render, dispose }` or `null` when WebGL is
unavailable. Keep that shape — the GSAP camera scrub depends on it.

Budgets: 4 draw calls desktop / 3 mobile, ~1324 / ~353 vertices. Quality
tiers, one-way adaptive DPR, off-screen and hidden-tab pause, full dispose.

## Traps — each of these has already bitten once

- **`dispose()` ends with `forceContextLoss()`.** That retires the canvas's
  WebGL context permanently, so a rebuilt scene cannot get a new one from
  the same element. `HeroCanvas` keys the `<canvas>` on `theme` for exactly
  this reason. Don't remove the key.
- **Never dash-animate an authored `stroke-dasharray`.** `useDrawOn` checks
  for one and fades those elements instead. The dashed stroke in the
  MathSketch motif and the "branch not taken" in the Decide glyph are
  meaning, not decoration.
- **`svg { display: block }` outranks the UA rule for `[hidden]`.** There is
  an explicit `[hidden] { display: none !important }` in `base.css`; without
  it the inline icon sprite renders as 150px of empty space.
- **GLSL `smoothstep` is undefined when `edge0 > edge1`.** The depth fade
  uses the inverted form on purpose.
- **Per-frame lerps must use `delta`.** A fixed per-frame factor made the
  cursor parallax 5× faster on 144Hz than on 30fps.
- **`linear-gradient(... in oklch, ...)` needs a plain fallback above it**,
  or older browsers drop the whole declaration and render no background.
- **CSS source order beats cleverness.** `.project` is defined after the
  projects media query; a `display: grid` override placed earlier loses at
  equal specificity.

## Before launch

1. `index.html` still uses the placeholder domain `https://deepakgond.dev/`
   in `canonical`, `og:url` and the JSON-LD — all marked `TODO`.
2. Decide the deploy target. GitHub Pages from
   `frienf/deepak-gond-portfolio` serves at a subpath, which needs
   `base: '/deepak-gond-portfolio/'` in `vite.config.js`, unless the repo is
   renamed `frienf.github.io`.
