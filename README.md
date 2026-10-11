# Deepak Gond — Data Analyst | Data Engineering

Personal portfolio: a single page that argues one thing — *this person turns
operational data into decisions* — with a Three.js data-pipeline hero, a
dashboard-style impact section, and resume-backed content throughout.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # -> dist/
npm run preview    # serve the production build
```

## Stack

| Concern | Choice | Why |
| --- | --- | --- |
| Build | Vite + @vitejs/plugin-react | Fast Refresh, code splitting out of the box |
| UI | React 19 | Components + one data file; no state library, no backend |
| 3D | three | The hero scene, lazily imported so text paints first |
| Scroll motion | gsap + ScrollTrigger | Scrubbed camera + batched reveals, native scroll untouched |
| Type | Self-hosted woff2 | Latin subsets in `public/fonts`; the page makes zero third-party requests |

Pinned `@vitejs/plugin-react@^5.2.0`: v6 requires Vite 8, this project is on
Vite 7.

The Three.js scene stays imperative and is mounted through a hook rather than
being rewritten in React Three Fiber. It owns its own render loop, visibility
gating and disposal, none of which gain anything from passing through React's
reconciler sixty times a second. R3F would be the right call if the scene
needed to react to component state.

React Three Fiber was considered and skipped: there is no React here, and for a
scroll-driven marketing page the Three.js + GSAP pairing is the lighter fit.

## How it is organised

```
index.html              Shell: SEO + JSON-LD, icon sprite, #root, <noscript>
public/                 favicon.svg, og.svg, fonts/
src/
  main.jsx              Entry point - styles, StrictMode, root
  App.jsx               Page composition; owns the 3D scene handle
  data/profile.js       Every factual claim on the site, in one place
  components/           One per region, plus Icon / Tag / SectionHead / Sparkline
  hooks/
    useReducedMotion    Motion preference, live via useSyncExternalStore
    useInView           Fires once when an element nears the viewport
    useCountUp          Metric counters
    useStickyHeader     Header state from a sentinel, not a scroll handler
    useActiveSection    Current section for the nav
    usePipelineScene    Lazy-imports and mounts the Three.js scene
    useScrollAnimations All GSAP / ScrollTrigger choreography, in a gsap.context
  three/pipeline.js     The hero scene (imperative, unchanged by the port)
  styles/               fonts, tokens, base, components - unchanged by the port
```

Content lives in `data/profile.js`, behaviour in hooks, values in tokens. No
copy is written inside a component.

**Trade-off from the React port:** the page is now client-rendered. Crawlers
that do not execute JavaScript see only the shell and the `<noscript>` block.
All SEO metadata and the Person JSON-LD stay in `index.html`, so link previews
and structured data are unaffected, but restoring full crawlability would mean
adding prerendering or SSG.

## The hero scene

Five node clusters along one axis — RAW DATA, TRANSFORM, ANALYZE, VISUALIZE,
INSIGHT. Node count falls and node size rises left to right: many raw records
refined into one decision. Packets ride precomputed paths across all five
stages, so the movement reads as throughput.

Budgets and guards:

- node and packet counts drop ~55% on small or low-core devices; DPR capped at 2 (1.5 on mobile)
- rendering stops when the canvas leaves the viewport and when the tab is hidden
- `prefers-reduced-motion` renders a single static frame — composition kept, motion dropped
- no WebGL context means the CSS fallback stays on screen; nothing else changes
- all geometries, materials, textures and the renderer are disposed in `dispose()`

The five stages are also written out in the hero legend, so the visual never
carries information the text does not.

## Measured

Production build (`npm run preview`), measured in-browser:

| | |
| --- | --- |
| TTFB | 9-35 ms |
| DOMContentLoaded | 91 ms |
| Long tasks (> 50 ms) | none |
| Transfer | 175 kB over 6 requests |
| Third-party requests | 0 |
| JS | 128 kB gzip up front + 122 kB for the 3D chunk, loaded after |

The React port moved the up-front JS from 50 kB to 128 kB gzip: React, React
DOM and all page copy now ship as JavaScript rather than as HTML.

Inter and JetBrains Mono are single variable files; Instrument Serif and Inter
are preloaded because the first screen needs them. LCP, FCP and CLS still need
a run in a visible browser window - they are paint-based, and the tooling used
here rendered the page in a background tab where those metrics are not reported.

## Accessibility

- Contrast measured against the page background: body text 7.9:1, headings 19:1,
  small mono labels 7.1:1 — AAA for normal text throughout
- Full keyboard path: skip link, visible focus rings, arrow-key tablist with
  roving tabindex, native `<details>` for progressive disclosure
- Semantic landmarks and an unbroken heading order (one `h1`)
- `prefers-reduced-motion` honoured in both CSS and JS; no content is motion-dependent
- All 39 interactive elements measured at 44px or larger; no horizontal scrolling at any width

## Social card

`public/og.png` (1200x630) is generated from `public/og.svg`:

```bash
npm run og
```

Edit the SVG, never the PNG. The rasteriser needs the brand fonts as TTF,
which `.cache/fonts` holds; regenerate them with `pip install fonttools
brotli` and the one-liner in the header of `scripts/make-og.mjs`. Without
them the script still runs but substitutes system fonts.

## Before launch

`index.html` still uses the placeholder domain `https://deepakgond.dev/` in
`canonical`, `og:url` and the JSON-LD - each marked `TODO`. Set those to the
real domain, and pick a deploy target: GitHub Pages from
`frienf/deepak-gond-portfolio` serves at a subpath, which needs
`base: '/deepak-gond-portfolio/'` in `vite.config.js` unless the repo is
renamed `frienf.github.io`.
