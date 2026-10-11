# DESIGN.md

The visual system. Code rules are in [CLAUDE.md](CLAUDE.md).

## Direction

An editorial technical journal, not a SaaS landing page. The page should
read as something considered and measured — the same qualities the work
itself claims. Three gestures carry it:

- **A serif that never goes bold.** Display type is locked at weight 400;
  stroke contrast and tight tracking do the work instead of weight.
- **Monospace for everything functional.** Labels, metrics, nav, tags, meta.
  The serif announces, the mono instructs, and numbers read as data.
- **A warm ground.** Neither theme uses a neutral grey. Dark is warm
  charcoal, light is warm parchment. This is most of why it feels
  approachable rather than clinical.

Pill-and-soft-rect geometry throughout: nothing sharp, buttons fully
rounded, cards at 40px. Elevation comes from hairline borders and surface
steps, not drop shadows.

## Themes

Dark is the default; `[data-theme="light"]` on `<html>` swaps the ramp. An
inline script in `index.html` applies the stored choice before first paint.

| Role | Dark | Light |
| --- | --- | --- |
| `--bg` | `oklch(16% 0.014 70)` | `oklch(97% 0.009 80)` |
| `--surface` | `oklch(23% 0.015 70)` | `oklch(99.4% 0.004 80)` |
| `--surface-raised` | `oklch(27% 0.016 70)` | `oklch(100% 0 0)` |
| `--text` | `oklch(95% 0.009 70)` | `oklch(34% 0.018 70)` |
| `--text-muted` | `oklch(76% 0.013 70)` | `oklch(41% 0.019 70)` |
| `--text-faint` | `oklch(71% 0.013 70)` | `oklch(44.5% 0.019 70)` |
| `--heading` | `oklch(99% 0.005 70)` | `oklch(23% 0.023 70)` |
| `--signal` (teal) | `oklch(80% 0.125 195)` | `oklch(41.5% 0.115 195)` |
| `--insight` (apricot) | `oklch(80% 0.145 52)` | `oklch(45.5% 0.145 52)` |
| `--on-signal` | `oklch(18% 0.02 70)` | `oklch(99% 0.003 80)` |

Neutrals sit at hue 70 (dark) and 80 (light) — warm, never blue-grey.
`--on-signal` exists because the accent is light on dark and dark on light,
so text filled over it has to invert.

### Two accents, two jobs

- **Teal — `--signal`.** Measurement. Links, metrics, current state, the
  raw end of the pipeline.
- **Apricot — `--insight`.** Outcome. The result of a step, the figure that
  moved, the single node at the end of the lattice.

If a colour isn't saying "measured" or "result", it shouldn't be coloured.

### Contrast floor

**AAA (7:1) for normal text, in both themes.** Measured against the page
background, not assumed:

| | text | muted | faint | heading | link | insight | button |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Dark | 16.83 | 9.07 | 7.53 | 18.87 | 10.91 | 9.74 | 7.49 |
| Light | 10.88 | 8.12 | 7.02 | 15.56 | 7.06 | 7.06 | 7.49 |

The light accents are *solved* values. Teal at L41.5 and apricot at L45.5
are the lightest versions that still clear 7:1 on parchment — they are not
aesthetic picks and shouldn't be lightened without re-measuring. Light
`--text-muted` is pushed darker than it would otherwise be so a visible gap
survives above `--text-faint` once faint is dragged down to clear the floor.

## Type

| Family | Used for |
| --- | --- |
| **Instrument Serif** 400 | Display only: hero, section titles, the About lead, contact title |
| **Inter** 400/500/600 | Prose and UI labels |
| **JetBrains Mono** 400/500 | Metrics, eyebrows, tags, nav, dates, all meta |

Self-hosted latin subsets in `public/fonts` — the page makes **zero
third-party requests**. Inter and JetBrains Mono are single variable files.

Scale is fluid `clamp()` from `--fs-micro` to `--fs-3xl`; metrics use
`--fs-metric` with `tabular-nums`. Display tracking is −0.02em at every
size. Prose is capped at `--measure` (62ch).

Body copy stays in Inter deliberately. Monospace for continuous prose
measurably slows reading, and the About section runs three paragraphs.

## Space, shape, motion

- Base rhythm: fluid `--space-*` scale, `--card-pad` clamping 20px → 40px.
- Radii: `--radius-sm` 10px, `--radius` 20px, `--radius-lg` 40px, buttons
  fully rounded. Nothing sharp.
- Durations: 140 / 240 / 480ms. Easing `cubic-bezier(0.33, 1, 0.68, 1)`.
- **No overshoot anywhere.** 240ms out-cubic behaves like a critically
  damped spring (mass 1, tension 170, friction 26 → ~307ms settle, no
  bounce). A UI that boings undercuts a brand built on measurement.

### Interaction

Hover states are **tinted with the accent**, never washed with white. A 3%
white veil is invisible; a tinted one says both "this responds" and "this
belongs to the signal family". `--hover-surface`, `--hover-border`,
`--press-surface` carry it.

Static labels — tags, metric notes — deliberately do **not** react. Making
an inert label respond is a false affordance, not friendliness.

### Reduced motion

`prefers-reduced-motion` is honoured in both CSS and JS. Reveals resolve to
their final state, counters show the real figure, sparklines and SVG art
render drawn, and the hero renders a single static frame. Nothing is
motion-dependent for comprehension.

## The hero scene

Five node clusters on one axis: **RAW DATA → TRANSFORM → ANALYZE →
VISUALIZE → INSIGHT**. Node count falls and node size rises left to right,
so the composition says "many raw records refined into one decision".
Packets ride precomputed paths with short trails, so the movement reads as
throughput rather than decoration.

The same five stages are named in text in the hero legend — the 3D never
carries meaning on its own, and the section works with WebGL unavailable.

Light mode is not a recolour. Additive blending adds light to what's behind
it, so it vanishes on parchment; light switches to normal blending with
denser colour (`#005d5f`, `#913600`) and more opacity. It reads as an ink
drawing rather than a glow.

## Generated artwork

No photography, no stock illustration. Every graphic is drawn from data or
from geometry:

- **Sparklines** from each metric's own series.
- **Project motifs** — abstract sketches of what each project does, never
  fake screenshots.
- **Stage glyphs** — seven marks showing the *shape of each operation*, with
  amber reserved for that step's outcome.

All of it is stroke-based so it can draw itself on arrival (`useDrawOn`),
and all of it is `aria-hidden`.

## Do / don't

**Do**
- Keep display type at weight 400 at every size.
- Use mono for anything functional or numeric.
- Reach for a token; if one doesn't exist, add it to `tokens.css`.
- Let hairlines and surface steps carry elevation.
- Measure contrast after any colour change.

**Don't**
- Put a raw colour in a component stylesheet.
- Set headings bold, or use radii below 10px.
- Add a third accent — the palette is two accents plus warm neutrals.
- Animate something just because it can be animated.
- Give a non-interactive element a hover state.
