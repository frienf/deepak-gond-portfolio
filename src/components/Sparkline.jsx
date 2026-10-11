import { useEffect, useRef } from 'react';
import { useInView } from '../hooks/useInView.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

const W = 100;
const H = 40;
const PAD = 3;

function toPoints(series) {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const stepX = W / (series.length - 1);
  return series.map((value, i) => [
    i * stepX,
    H - PAD - ((value - min) / span) * (H - PAD * 2),
  ]);
}

/**
 * The tile's own series, drawn. Decorative: the figure and label are text,
 * and this is aria-hidden. Draws itself on as the tile arrives.
 */
export function Sparkline({ series }) {
  const [inViewRef, inView] = useInView();
  const pathRef = useRef(null);
  const dotRef = useRef(null);
  const reduced = useReducedMotion();

  const points = toPoints(series);
  const line = points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const area = `${line} L${W} ${H} L0 ${H} Z`;
  const [lastX, lastY] = points[points.length - 1];
  const baselineY = points[0][1].toFixed(1);

  useEffect(() => {
    const path = pathRef.current;
    const dot = dotRef.current;
    if (!path || reduced) return;

    if (!inView) {
      const length = path.getTotalLength();
      path.style.strokeDasharray = String(length);
      path.style.strokeDashoffset = String(length);
      if (dot) dot.style.opacity = '0';
      return;
    }

    path.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.33, 1, 0.68, 1)';
    path.style.strokeDashoffset = '0';
    if (dot) {
      dot.style.transition = 'opacity 0.4s ease 1.1s';
      dot.style.opacity = '1';
    }
  }, [inView, reduced]);

  return (
    <div className="metric__chart" ref={inViewRef} aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" focusable="false">
        <path className="metric__spark-area" d={area} />
        <line
          className="metric__spark-base"
          x1="0" y1={baselineY} x2={W} y2={baselineY}
          vectorEffect="non-scaling-stroke"
        />
        <path className="metric__spark-line" ref={pathRef} d={line} vectorEffect="non-scaling-stroke" />
        <circle className="metric__spark-dot" ref={dotRef} cx={lastX.toFixed(1)} cy={lastY.toFixed(1)} r="2.2" />
      </svg>
    </div>
  );
}
