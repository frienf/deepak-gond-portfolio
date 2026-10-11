/**
 * Stage glyphs for "How I work".
 *
 * One per step, each showing the *shape of the operation* rather than an
 * object: scattered marks converging, a ragged row evening out, a fork
 * where one branch is taken. Stroke-only on a 64x64 grid so the draw-on
 * hook can reveal each line as a single continuous stroke.
 *
 * Colour carries one rule: everything is signal teal except the single
 * element that represents the outcome of that step, which is amber.
 * Decorative - the step name and body text carry the meaning.
 */

import { useDrawOn } from '../hooks/useDrawOn.js';

const signal = 'var(--signal)';
const insight = 'var(--insight)';

const stroke = {
  fill: 'none',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

/** Scattered sources funnelling into one channel. */
function Collect() {
  return (
    <>
      <path {...stroke} style={{ stroke: signal }} opacity="0.85"
        d="M8 12 34 29 M10 23 34 31 M9 41 34 33 M13 52 34 35 M20 7 34 30" />
      <path {...stroke} style={{ stroke: insight }} d="M36 32h20" />
      <circle cx="56" cy="32" r="2.2" style={{ fill: insight }} />
    </>
  );
}

/** A ragged series evening out. */
function Clean() {
  return (
    <>
      <path {...stroke} style={{ stroke: signal }} opacity="0.85"
        d="M9 24 17 15 25 28 33 13 41 25 55 17" />
      <path {...stroke} style={{ stroke: signal }} opacity="0.5" d="M32 34v8" />
      <path {...stroke} style={{ stroke: signal }} opacity="0.5" d="M28 38 32 43 36 38" />
      <path {...stroke} style={{ stroke: insight }} d="M9 52h46" />
    </>
  );
}

/** One arrangement mapped onto another. */
function Transform() {
  return (
    <>
      <path {...stroke} style={{ stroke: signal }} opacity="0.85"
        d="M8 20h18v24H8z M8 32h18 M17 20v24" />
      <path {...stroke} style={{ stroke: signal }} opacity="0.55"
        d="M28 26c6 0 7-7 13-7" />
      <path {...stroke} style={{ stroke: signal }} opacity="0.55"
        d="M28 38c6 0 7 7 13 7" />
      <path {...stroke} style={{ stroke: insight }}
        d="M43 14h13v36H43z M43 23h13 M43 32h13 M43 41h13" />
    </>
  );
}

/** Loose observations resolving onto a fitted line. */
function Model() {
  return (
    <>
      <path {...stroke} style={{ stroke: 'var(--line-strong)' }} d="M12 54V10 M12 54h44" />
      <path {...stroke} style={{ stroke: signal }} opacity="0.5"
        d="M20 40v-5 M30 33v6 M40 28v-6 M48 21v5" />
      <path {...stroke} style={{ stroke: insight }} d="M15 47 53 17" />
      <g style={{ fill: signal }}>
        <circle cx="20" cy="35" r="2" /><circle cx="30" cy="39" r="2" />
        <circle cx="40" cy="22" r="2" /><circle cx="48" cy="26" r="2" />
      </g>
    </>
  );
}

/** A field of observations with one region singled out. */
function Analyze() {
  return (
    <>
      <path {...stroke} style={{ stroke: 'var(--line-strong)' }} d="M12 54V10 M12 54h44" />
      <g style={{ fill: signal }} opacity="0.75">
        <circle cx="19" cy="44" r="1.9" /><circle cx="26" cy="33" r="1.9" />
        <circle cx="24" cy="48" r="1.9" /><circle cx="46" cy="40" r="1.9" />
        <circle cx="52" cy="28" r="1.9" />
      </g>
      <g style={{ fill: insight }}>
        <circle cx="34" cy="22" r="2.1" /><circle cx="40" cy="27" r="2.1" />
        <circle cx="37" cy="31" r="2.1" />
      </g>
      <path {...stroke} style={{ stroke: insight }}
        d="M29 16h-3v4 M46 16h3v4 M29 37h-3v-4 M46 37h3v-4" />
    </>
  );
}

/** Raw readings resolving into a plotted line. */
function Visualize() {
  return (
    <>
      <path {...stroke} style={{ stroke: 'var(--line-strong)' }} d="M10 52h46" />
      <path {...stroke} style={{ stroke: signal }} opacity="0.7"
        d="M15 52v-9 M22 52v-16 M29 52v-7" />
      <path {...stroke} style={{ stroke: insight }} d="M15 43c7 0 7-25 14-25s7 18 14 18 7-11 13-11" />
      <circle cx="56" cy="25" r="2.2" style={{ fill: insight }} />
    </>
  );
}

/** A fork: one branch taken, one left. */
function Decide() {
  return (
    <>
      <path {...stroke} style={{ stroke: signal }} d="M8 32h16" />
      <path {...stroke} style={{ stroke: insight }} d="M24 32c10 0 10-14 20-14h8" />
      <path {...stroke} style={{ stroke: insight }} d="M48 14 52 18 48 22" />
      {/* Dashed on purpose: the branch not taken. The draw-on hook leaves
          authored dash patterns alone and fades them in instead. */}
      <path {...stroke} style={{ stroke: signal }} strokeDasharray="2 3" opacity="0.45"
        d="M24 32c10 0 10 14 20 14h4" />
      <circle cx="24" cy="32" r="2.4" style={{ fill: signal }} />
    </>
  );
}

const GLYPHS = {
  collect: Collect,
  clean: Clean,
  transform: Transform,
  model: Model,
  analyze: Analyze,
  visualize: Visualize,
  decide: Decide,
};

export function StageGlyph({ step }) {
  const ref = useDrawOn({ duration: 650, stagger: 45 });
  const Shape = GLYPHS[step];
  if (!Shape) return null;

  return (
    <svg
      ref={ref}
      className="workflow__panel-glyph"
      viewBox="0 0 64 64"
      focusable="false"
      aria-hidden="true"
    >
      <Shape />
    </svg>
  );
}
