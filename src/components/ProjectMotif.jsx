/**
 * Generated geometric sketch of what each project does - deliberately
 * abstract rather than a fake screenshot. The artwork sits inset inside a
 * plotting grid so it reads as a detail in a frame. Decorative only.
 */

import { useDrawOn } from '../hooks/useDrawOn.js';

const signal = 'var(--signal)';
const insight = 'var(--insight)';
const faint = 'var(--line-strong)';

/** Shared plotting grid. The pattern id is per-card: three copies of one id
 *  in a document would be invalid. */
function Frame({ id }) {
  return (
    <>
      <defs>
        <pattern id={id} width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M16 0H0v16" fill="none" style={{ stroke: faint }} strokeWidth="0.5" opacity="0.45" />
        </pattern>
      </defs>
      <rect width="192" height="108" fill={`url(#${id})`} />
    </>
  );
}

/** MathSketch: a sketched stroke on the left resolving into a plot. */
function Equation() {
  return (
    <>
      <g style={{ stroke: faint }} strokeWidth="0.8" opacity="0.9" fill="none">
        <path d="M22 86V26M22 86h148" />
        <path d="M44 86v3M66 86v3M88 86v3M110 86v3M132 86v3M154 86v3" />
      </g>
      <path
        d="M30 74c10 0 12-32 22-32s11 20 21 20"
        fill="none" style={{ stroke: signal }} strokeWidth="1"
        strokeLinecap="round" strokeDasharray="2 3" opacity="0.75"
      />
      <path
        d="M86 68c12 0 10-30 24-30s14 18 26 18 14-12 24-12"
        fill="none" style={{ stroke: insight }} strokeWidth="1.1" strokeLinecap="round"
      />
      <g style={{ fill: signal }}>
        <circle cx="52" cy="42" r="1.5" /><circle cx="73" cy="62" r="1.5" /><circle cx="86" cy="68" r="1.5" />
      </g>
      <g style={{ fill: insight }}>
        <circle cx="110" cy="38" r="1.8" /><circle cx="136" cy="56" r="1.8" /><circle cx="160" cy="44" r="1.8" />
      </g>
      <text x="30" y="24" style={{ fill: signal }} fontFamily="monospace" fontSize="7" opacity="0.8" letterSpacing="1">SKETCH</text>
      <text x="122" y="24" style={{ fill: insight }} fontFamily="monospace" fontSize="7" opacity="0.8" letterSpacing="1">f(x) = ?</text>
    </>
  );
}

/** Sudoku: a detected 9x9 grid with recognised cells lit up. */
function Grid() {
  return (
    <>
      <g transform="translate(69 21)">
        <rect width="54" height="63" fill="none" style={{ stroke: signal }} strokeWidth="0.9" rx="1" />
        <g style={{ stroke: faint }} strokeWidth="0.5" opacity="0.9">
          <path d="M18 0v63M36 0v63M0 21h54M0 42h54" />
        </g>
        <g style={{ stroke: faint }} strokeWidth="0.3" opacity="0.5">
          <path d="M6 0v63M12 0v63M24 0v63M30 0v63M42 0v63M48 0v63M0 7h54M0 14h54M0 28h54M0 35h54M0 49h54M0 56h54" />
        </g>
        <g style={{ fill: signal }} opacity="0.3">
          <rect x="0.5" y="0.5" width="17" height="20" /><rect x="36.5" y="21.5" width="17" height="20" /><rect x="18.5" y="42.5" width="17" height="20" />
        </g>
        <g style={{ fill: insight }} opacity="0.6">
          <rect x="18.5" y="0.5" width="17" height="20" /><rect x="0.5" y="42.5" width="17" height="20" />
        </g>
      </g>
      <g style={{ stroke: insight }} strokeWidth="0.9" fill="none" strokeLinecap="round">
        <path d="M62 27h-7v-5M130 27h7v-5M62 78h-7v5M130 78h7v5" />
      </g>
      <text x="24" y="20" style={{ fill: signal }} fontFamily="monospace" fontSize="7" opacity="0.8" letterSpacing="1">DETECT</text>
      <text x="24" y="86" style={{ fill: insight }} fontFamily="monospace" fontSize="7" opacity="0.8" letterSpacing="1">SOLVE</text>
    </>
  );
}

/** Sign language: hand landmarks and the skeleton connecting them. */
function Gesture() {
  return (
    <>
      <g transform="translate(74 24)">
        <g style={{ stroke: signal }} strokeWidth="0.8" fill="none" opacity="0.7" strokeLinecap="round">
          <path d="M22 58 13 38 10 21M22 58 21 35 21 15M22 58 30 35 33 14M22 58 37 36 42 20M22 58 9 49 3 41" />
        </g>
        <g style={{ fill: signal }}>
          <circle cx="13" cy="38" r="1.5" /><circle cx="21" cy="35" r="1.5" /><circle cx="30" cy="35" r="1.5" />
          <circle cx="37" cy="36" r="1.5" /><circle cx="9" cy="49" r="1.5" />
        </g>
        <g style={{ fill: insight }}>
          <circle cx="10" cy="21" r="2" /><circle cx="21" cy="15" r="2" /><circle cx="33" cy="14" r="2" />
          <circle cx="42" cy="20" r="2" /><circle cx="3" cy="41" r="2" />
        </g>
        <circle cx="22" cy="58" r="2.4" style={{ fill: signal }} />
      </g>
      <g style={{ stroke: faint }} strokeWidth="0.6" fill="none" opacity="0.8">
        <path d="M62 18h-8v8M130 18h8v8M62 94h-8v-8M130 94h8v-8" />
      </g>
      <text x="24" y="20" style={{ fill: signal }} fontFamily="monospace" fontSize="7" opacity="0.8" letterSpacing="1">CAPTURE</text>
      <text x="118" y="86" style={{ fill: insight }} fontFamily="monospace" fontSize="7" opacity="0.8" letterSpacing="1">A-Z 1-9</text>
    </>
  );
}

const MOTIFS = { equation: Equation, grid: Grid, gesture: Gesture };

export function ProjectMotif({ motif }) {
  // Slower and looser than a sparkline: this is a sketch being made, not a
  // measurement landing.
  const ref = useDrawOn({ duration: 1100, stagger: 55 });
  const Shape = MOTIFS[motif];
  if (!Shape) return null;

  // Drawn on a 192x108 grid, presented on 384x216: the sketch keeps its
  // proportions without ballooning when a card goes full width.
  return (
    <svg ref={ref} viewBox="0 0 384 216" preserveAspectRatio="xMidYMid slice" focusable="false">
      <g transform="scale(2)">
        <Frame id={`motif-grid-${motif}`} />
        <Shape />
      </g>
    </svg>
  );
}
