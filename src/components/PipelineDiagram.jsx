/**
 * The pipeline, drawn literally.
 *
 * The hero scene says this abstractly; this says it with names on it.
 * Sources converge through a transform core and branch into the reporting
 * surfaces, ending at one insight.
 *
 * Every node is a system that appears in the resume - ERPNext, Google
 * Sheets, REST APIs, SQL, Power BI, Looker Studio, FMS. Nothing here is a
 * stand-in or a generic data-source name.
 *
 * Decorative: aria-hidden, with an sr-only summary. Nothing is named here
 * that is not also written in the workflow panels below.
 */

import { useDrawOn } from '../hooks/useDrawOn.js';

const SOURCES = ['ERPNEXT', 'SALES ORDERS', 'INVENTORY', 'PAYMENTS', 'GOOGLE SHEETS', 'SQL DATABASES'];
const DESTINATIONS = ['POWER BI', 'LOOKER STUDIO', 'FMS TRACKERS'];
const CORE = ['COLLECT', 'CLEAN', 'TRANSFORM', 'MODEL'];

const SOURCE_Y = [52, 116, 180, 244, 308, 372];
const DEST_Y = [132, 212, 292];

const line = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
const label = { fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' };

function Pill({ x, y, w, text, tone = 'var(--line-strong)' }) {
  return (
    <>
      <rect
        x={x} y={y - 16} width={w} height="32" rx="16"
        {...line} style={{ stroke: tone }} strokeWidth="1.1"
      />
      <text
        x={x + 16} y={y + 4} fontSize="13"
        style={{ ...label, fill: 'var(--text-muted)' }}
      >
        {text}
      </text>
    </>
  );
}

export function PipelineDiagram() {
  const ref = useDrawOn({ duration: 800, stagger: 24 });

  return (
    <figure className="pipeline-diagram" aria-hidden="true">
      <svg ref={ref} viewBox="0 0 1120 424" role="img" focusable="false">
        <defs>
          <radialGradient id="core-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="var(--signal)" stopOpacity="0.22" />
            <stop offset="1" stopColor="var(--signal)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sources, and their run into the core */}
        {SOURCE_Y.map((y, i) => (
          <g key={SOURCES[i]}>
            <path
              d={`M198 ${y} C 290 ${y} 350 212 442 212`}
              {...line} style={{ stroke: 'var(--signal)' }}
              strokeWidth="1" opacity="0.45"
            />
            <Pill x={30} y={y} w={168} text={SOURCES[i]} />
          </g>
        ))}

        {/* Two transport tags, rather than one on every line */}
        {[['API', 132], ['SQL', 292]].map(([tag, y]) => (
          <g key={tag}>
            <rect x="294" y={y - 10} width="52" height="20" rx="10"
              {...line} style={{ stroke: 'var(--line)', fill: 'var(--bg)' }} strokeWidth="1" />
            <text x="320" y={y + 3.5} fontSize="9" textAnchor="middle"
              style={{ ...label, fill: 'var(--text-faint)' }}>{tag}</text>
          </g>
        ))}

        {/* Core: a diamond around a dotted circle, softly lit */}
        <circle cx="560" cy="212" r="150" fill="url(#core-glow)" />
        <path d="M560 94 678 212 560 330 442 212Z"
          {...line} style={{ stroke: 'var(--signal)' }} strokeWidth="1.2" />
        <circle cx="560" cy="212" r="30"
          {...line} style={{ stroke: 'var(--signal)' }} strokeWidth="1"
          strokeDasharray="2 5" opacity="0.8" />
        <text x="560" y="158" fontSize="12" textAnchor="middle" style={{ ...label, fill: 'var(--signal)' }}>{CORE[0]}</text>
        <text x="620" y="216" fontSize="12" textAnchor="middle" style={{ ...label, fill: 'var(--signal)' }}>{CORE[1]}</text>
        <text x="560" y="282" fontSize="12" textAnchor="middle" style={{ ...label, fill: 'var(--signal)' }}>{CORE[2]}</text>
        <text x="500" y="216" fontSize="12" textAnchor="middle" style={{ ...label, fill: 'var(--signal)' }}>{CORE[3]}</text>

        {/* Destinations branch out, then resolve to one result */}
        {DEST_Y.map((y, i) => (
          <g key={DESTINATIONS[i]}>
            <path d={`M678 212 C 720 212 740 ${y} 790 ${y}`}
              {...line} style={{ stroke: 'var(--signal)' }} strokeWidth="1" opacity="0.45" />
            <Pill x={790} y={y} w={150} text={DESTINATIONS[i]} />
            <path d={`M940 ${y} C 965 ${y} 975 212 996 212`}
              {...line} style={{ stroke: 'var(--insight)' }} strokeWidth="1" opacity="0.5" />
          </g>
        ))}

        <circle cx="1012" cy="212" r="30" style={{ fill: 'var(--insight)' }} opacity="0.12" />
        <circle cx="1012" cy="212" r="15" style={{ fill: 'var(--insight)' }} />
        <text x="1040" y="217" fontSize="14" style={{ ...label, fill: 'var(--insight)' }}>INSIGHT</text>
      </svg>
      <figcaption className="sr-only">
        Operational systems feed one pipeline: ERPNext, sales orders, inventory,
        payments, Google Sheets and SQL databases are collected, cleaned,
        transformed and modelled, then published to Power BI, Looker Studio and
        FMS trackers so a decision can be made.
      </figcaption>
    </figure>
  );
}
