/**
 * System diagrams - one per project, in their own section.
 *
 * Each shows how the thing is actually wired: inputs left, processing
 * through the middle, the single result right. Teal carries every
 * processing stage; apricot is reserved for the finished output, as it is
 * everywhere else on the site.
 *
 * Drawn on a 520x293 grid (16:9) with `meet`, so a labelled node is never
 * cropped - letterboxing against the section background is the cheaper
 * failure. Below 64rem the diagram stands down (its 9px type would render
 * near 6px) and the step list beside it carries the same information as
 * text. That list is the diagram's accessible equivalent at every size.
 */

import { useEffect, useRef, useState } from 'react';
import { useDrawOn } from '../hooks/useDrawOn.js';
import { systems } from '../data/profile.js';
import { SectionHead } from './SectionHead.jsx';

const teal = 'var(--signal)';
const apricot = 'var(--insight)';
const hair = 'var(--line-strong)';

const stroke = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
const mono = { fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' };

/** Rounded node holding one or two short lines. */
function Node({ x, cy, w, h = 40, lines, tone = teal, size = 9 }) {
  const y = cy - h / 2;
  const first = lines.length === 1 ? cy + size / 2 - 1 : cy - 2;
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={Math.min(16, h / 2)}
        {...stroke} style={{ stroke: tone }} strokeWidth="1.1" />
      {lines.map((text, i) => (
        <text key={text} x={x + w / 2} y={first + i * (size + 3)} fontSize={size}
          textAnchor="middle" style={{ ...mono, fill: 'var(--text-muted)' }}>{text}</text>
      ))}
    </>
  );
}

/** Hairline connector with a small chevron head. */
function Arrow({ x1, x2, y, tone = teal }) {
  return (
    <>
      <path className="flow" d={`M${x1} ${y}H${x2 - 4}`} {...stroke} style={{ stroke: tone }} strokeWidth="1" opacity="0.6" />
      <path d={`M${x2 - 8} ${y - 3.5}L${x2 - 3} ${y}L${x2 - 8} ${y + 3.5}`}
        {...stroke} style={{ stroke: tone }} strokeWidth="1" opacity="0.6" />
    </>
  );
}

/** The one apricot node, with its soft halo. */
function Result({ x, cy, w, lines }) {
  return (
    <>
      <circle cx={x + w / 2} cy={cy} r="42" style={{ fill: apricot }} opacity="0.10" />
      <Node x={x} cy={cy} w={w} h={46} lines={lines} tone={apricot} />
    </>
  );
}

/** MathSketch: a sketch becomes an image, is read, and comes back solved. */
function Equation() {
  return (
    <>
      <Node x={22} cy={146} w={78} lines={['CANVAS', 'SKETCH']} tone={hair} />
      <Arrow x1={100} x2={116} y={146} />
      <Node x={116} cy={146} w={78} lines={['BASE64', 'IMAGE']} tone={hair} />
      <Arrow x1={194} x2={210} y={146} />

      <path d="M252 104 294 146 252 188 210 146Z" {...stroke} style={{ stroke: teal }} strokeWidth="1.2" />
      <text x="252" y="143" fontSize="9" textAnchor="middle" style={{ ...mono, fill: teal }}>FASTAPI</text>
      <text x="252" y="156" fontSize="8" textAnchor="middle" style={{ ...mono, fill: 'var(--text-faint)' }}>PRE-PROC</text>

      <path className="flow" d="M252 104 C 252 80 280 78 310 78" {...stroke} style={{ stroke: teal }} strokeWidth="1" opacity="0.6" />
      <path className="flow" d="M252 188 C 252 212 280 214 310 214" {...stroke} style={{ stroke: teal }} strokeWidth="1" opacity="0.6" />
      <Node x={310} cy={78} w={92} lines={['OPENROUTER', 'VISION']} />
      <Node x={310} cy={214} w={92} lines={['MATHJAX', 'RENDER']} />

      <path className="flow" d="M402 78 C 420 78 424 118 430 134" {...stroke} style={{ stroke: apricot }} strokeWidth="1" opacity="0.55" />
      <path className="flow" d="M402 214 C 420 214 424 174 430 158" {...stroke} style={{ stroke: apricot }} strokeWidth="1" opacity="0.55" />
      <Result x={430} cy={146} w={76} lines={['LATEX +', 'SOLUTION']} />
    </>
  );
}

/** Sudoku: a photo is read by OpenCV, classified, solved. */
function Grid() {
  const subs = [['GRID DETECT', 126], ['CELL EXTRACT', 154], ['WARP', 182]];
  return (
    <>
      <Node x={20} cy={146} w={78} lines={['PUZZLE', 'PHOTO']} tone={hair} />
      <Arrow x1={98} x2={112} y={146} />

      <rect x="112" y="86" width="124" height="120" rx="16"
        {...stroke} style={{ stroke: teal }} strokeWidth="1.2" />
      <text x="174" y="104" fontSize="9" textAnchor="middle" style={{ ...mono, fill: teal }}>OPENCV</text>
      {subs.map(([text, cy]) => (
        <g key={text}>
          <rect x="122" y={cy - 11} width="104" height="22" rx="11"
            {...stroke} style={{ stroke: hair }} strokeWidth="1" />
          <text x="174" y={cy + 3} fontSize="8" textAnchor="middle"
            style={{ ...mono, fill: 'var(--text-faint)' }}>{text}</text>
        </g>
      ))}

      <Arrow x1={236} x2={250} y={146} />
      <Node x={250} cy={146} w={80} lines={['TENSORFLOW', 'CLASSIFIER']} />
      <Arrow x1={330} x2={344} y={146} />
      <Node x={344} cy={146} w={76} lines={['BACKTRACK', 'SOLVER']} />
      <Arrow x1={420} x2={432} y={146} tone={apricot} />
      <Result x={432} cy={146} w={74} lines={['SOLVED GRID', 'STREAMLIT']} />
    </>
  );
}

/** Sign language: a frame is cleaned, classified, captioned live. */
function Gesture() {
  return (
    <>
      <Node x={24} cy={146} w={78} lines={['WEBCAM', 'FRAME']} tone={hair} />
      <Arrow x1={102} x2={118} y={146} />
      <Node x={118} cy={146} w={92} lines={['OPENCV', 'PRE-PROCESS']} />
      <text x="164" y="196" fontSize="8" textAnchor="middle"
        style={{ ...mono, fill: 'var(--text-faint)' }}>SKIN + CONTOUR</text>

      <Arrow x1={210} x2={226} y={146} />
      <rect x="226" y="120" width="110" height="52" rx="16"
        {...stroke} style={{ stroke: teal }} strokeWidth="1.2" />
      <text x="281" y="142" fontSize="9" textAnchor="middle" style={{ ...mono, fill: 'var(--text-muted)' }}>CUSTOM CNN</text>
      <text x="281" y="156" fontSize="8" textAnchor="middle" style={{ ...mono, fill: teal }}>35 GESTURES</text>

      <Arrow x1={336} x2={350} y={146} />
      <Node x={350} cy={146} w={84} lines={['REAL-TIME', 'INFERENCE']} />
      <Arrow x1={434} x2={446} y={146} tone={apricot} />
      <Result x={446} cy={146} w={62} lines={['LIVE TEXT', 'CAPTION']} />
    </>
  );
}

const DIAGRAMS = { equation: Equation, grid: Grid, gesture: Gesture };

function Diagram({ motif }) {
  const ref = useDrawOn({ duration: 900, stagger: 28 });
  const Shape = DIAGRAMS[motif];
  if (!Shape) return null;

  return (
    <svg ref={ref} viewBox="0 0 520 293" preserveAspectRatio="xMidYMid meet"
      className="system__svg" aria-hidden="true" focusable="false">
      <Shape />
    </svg>
  );
}

export function SystemDiagrams() {
  /* The connector flow is a continuous loop, so it is gated on visibility.
     useInView is deliberately one-shot, which is wrong here - it would
     latch on and the loop would never pause again. This observer stays
     subscribed and reports both directions. */
  const liveRef = useRef(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const node = liveRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(([entry]) => setLive(entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section" id="systems" aria-labelledby="systems-title">
      <div className="container">
        <SectionHead
          index="05"
          eyebrow="Systems"
          title="How each one is wired."
          titleId="systems-title"
          lede="The same three projects, as architecture rather than outcome — what goes in, what processes it, and what comes out."
        />

        <div className={`systems${live ? ' is-live' : ''}`} ref={liveRef}>
          {systems.map((system) => (
            <article className="system js-reveal" key={system.id}>
              <div className="system__head">
                <h3 className="system__title">{system.title}</h3>
                <p className="system__summary">{system.summary}</p>
              </div>
              <Diagram motif={system.motif} />
              <ol className="system__steps">
                {system.steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
