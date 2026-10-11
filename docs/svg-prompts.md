# SVG briefs

One prompt per SVG we want to make. Each is written to be handed to a
designer, an image model, or back to Claude, and to come back as line art
that drops straight into this codebase.

## House rules — apply to every brief below

Repeat these in any prompt you send; they are what make the output usable
rather than something that has to be redrawn.

**Palette** — only these, always via CSS custom properties so the art
re-themes with the site. Never hard-code hex.

| Role | Token | Use |
| --- | --- | --- |
| Signal teal | `var(--signal)` | inputs, raw material, structure |
| Insight amber | `var(--insight)` | the result, the answer, the one outcome |
| Hairline | `var(--line-strong)` | grids, axes, tick marks, frames |

**Geometry**
- Stroke-based, not filled shapes, wherever the form allows.
- Stroke widths 0.5–1.1 on a 192×108 grid. Nothing heavier; it reads as
  clip-art above ~1.2.
- `stroke-linecap="round"`, `fill="none"` on strokes.
- No gradients, no filters, no drop shadows, no blur, no raster embeds.
- Keep the 16-unit background grid pattern used by the project motifs so a
  new piece reads as the same family.

**It must survive the draw-on animation** (`src/hooks/useDrawOn.js`)
- Strokes are revealed by animating `stroke-dashoffset`, so every drawn line
  should be one continuous path — a shape chopped into 20 fragments
  animates like 20 twitches.
- Anything carrying an authored `stroke-dasharray` is deliberately **not**
  drawn; it fades in instead. Use a dash pattern only when "sketched /
  provisional / not yet solved" is the actual meaning.
- Fills, and all `<text>`, fade in behind the strokes. Keep both sparse.
- Order elements back-to-front in the markup: they animate in document
  order, so structure first (axes, grid), subject second, label last.

**Accessibility and fit**
- Decorative. The container is `aria-hidden`; meaning must never live only
  in the drawing.
- Any text is a short mono label (≤ 8 characters, uppercase, letter-spaced),
  never a sentence.
- Must stay legible from 320 px wide to 700 px wide.
- Must read on a near-black background: `#060c13`.

---

## P1 — worth building

### 1. "How I Work" stage glyphs (×7)

The strongest gap on the page: that section is seven steps of prose with no
picture of the process. One small glyph per step, swapped with the tab.

> Draw seven small line-art glyphs on a 64×64 grid, one per stage of a data
> pipeline: **Collect, Clean, Transform, Model, Analyze, Visualize, Decide.**
> Each glyph shows the *shape of the operation*, not an object:
> Collect — several scattered marks converging into one channel.
> Clean — a ragged row becoming an even row.
> Transform — one arrangement of cells mapping to a different arrangement.
> Model — loose points resolving onto a fitted structure.
> Analyze — a field of points with one region bracketed.
> Visualize — raw ticks resolving into a plotted line.
> Decide — a fork where one branch is taken and the other is not.
> Stroke-only, `var(--signal)` throughout except the single element that
> represents the outcome, which is `var(--insight)`. Stroke width 1.1 on the
> 64-unit grid. 6–10 strokes per glyph, each one continuous. No text, no
> frame, no background grid. They must read as one set: same optical weight,
> same margin, same rhythm.

Renders at ~40 px beside `.workflow__panel-title`. Pass `{ duration: 650,
stagger: 45 }` to `useDrawOn` and key the hook on the active step so it
redraws on each tab change.

### 2. `og.png` — the one blocking asset

Not new art: `public/og.svg` already exists and is correct. It needs
rasterising, because LinkedIn, X and Slack do not render SVG previews, and
`index.html` already points `og:image` at a `/og.png` that is missing.

```bash
npx --yes sharp-cli --input public/og.svg --output public/og.png resize 1200 630
```

Check afterwards that the three fonts rendered as intended — the SVG
references Instrument Serif, Inter and JetBrains Mono by family name, so
whatever rasterises it must have them available or it will substitute.

---

## P2 — build when the page is otherwise done

### 3. 404 page — "broken pipeline"

Only worth drawing once the site is actually deployed and can serve a 404.

> Reuse the hero's pipeline lattice composition on a 192×108 grid, but
> broken: node clusters on the left in `var(--line-strong)`, the connecting
> edges running right and then stopping at a clean gap about two-thirds
> across. No insight node at the end — just the empty space where it should
> be, and one `var(--insight)` marker hanging at the break. Stroke width 0.8.
> Mono label `NO ROUTE` bottom left.

The joke should land in half a second and never be explained in copy.

### 4. `apple-touch-icon.png` + maskable icon

> Take `public/favicon.svg` — the rising line with a teal node and an amber
> endpoint — and reissue it at 180×180 for `apple-touch-icon.png` with the
> artwork inset to 70% of the canvas, on a solid `#12161f` background with
> no rounded corners (iOS applies its own mask). Produce a second 512×512
> version with the artwork inset to 60% for the Android maskable icon.

Purely practical: without these, iOS home-screen saves render a blurry
screenshot instead of the mark.

---

## P3 — only if the page feels thin, which it currently does not

These are decoration, and the brief for this site explicitly warns against
decoration for its own sake. Listed so the decision is deliberate.

### 5. About — data provenance sketch

> A small 192×108 line sketch reading left to right: three mismatched source
> marks, a reconciliation point where they align, one clean output line.
> `var(--signal)` for sources, `var(--insight)` for the output. Stroke width
> 0.8, no text.

Earns its place only if it says something the paragraphs do not.

### 6. Section divider glyph

> A 48×8 hairline rule in `var(--line-strong)` with three evenly spaced tick
> marks rising from it, the centre tick taller and `var(--signal)`. Stroke
> width 0.5.

A plot axis fragment between sections. The current fading hairline rules
already do this job; swap only if the page needs more rhythm.

---

## Not doing

- **Illustrations of people, desks or devices.** Instantly reads as stock,
  and the site's whole argument is that the work is measurable.
- **Logos for Voraco or Outlier.ai.** They are not ours to draw.
- **Animated glyphs inside the 39 icon instances.** Thirty-nine things
  drawing themselves is noise, not polish.
