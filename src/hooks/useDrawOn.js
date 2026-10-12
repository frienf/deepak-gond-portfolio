import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion.js';
import { isDrawable } from './drawOnRule.js';

/**
 * Draws SVG line art on as it scrolls into view.
 *
 * Strokes are revealed with the dash-offset technique; anything that cannot
 * be "drawn" - fills, text, and strokes that already carry a dash pattern -
 * fades in just behind them instead.
 *
 * That last case matters: the sketch stroke in the MathSketch motif and the
 * baseline in each sparkline are dashed on purpose, and animating their
 * offset would overwrite the pattern and destroy the look.
 */

const SHAPES = 'path, line, polyline, polygon, circle, rect, ellipse';

/** Can this element be drawn, or does it have to fade? */
function canDraw(el) {
  const style = getComputedStyle(el);
  return isDrawable({
    tagName: el.tagName,
    stroke: style.stroke,
    strokeWidth: style.strokeWidth,
    strokeDasharray: style.strokeDasharray,
    measurable: typeof el.getTotalLength === 'function',
  });
}

/**
 * @param {{duration?: number, stagger?: number, fade?: number}} [options]
 * @returns {React.RefObject} ref for the element wrapping the SVG
 */
export function useDrawOn(options = {}) {
  const { duration = 900, stagger = 40, fade = 420 } = options;
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  const reduced = useReducedMotion();
  const planRef = useRef([]);

  /* Measure and hide before the browser paints, so the art never flashes in
     fully drawn. All reads happen before all writes - mixing them would
     thrash layout once per shape. */
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || reduced) return undefined;

    const elements = [...root.querySelectorAll(SHAPES), ...root.querySelectorAll('text')];
    const plan = elements.map((el) => {
      const draw = canDraw(el);
      return { el, draw, length: draw ? el.getTotalLength() : 0 };
    });

    plan.forEach(({ el, draw, length }) => {
      if (draw && length > 0) {
        el.style.strokeDasharray = String(length);
        el.style.strokeDashoffset = String(length);
      } else {
        el.style.opacity = '0';
      }
    });

    planRef.current = plan;

    return () => {
      // Hand every element back exactly as it was authored
      plan.forEach(({ el }) => {
        el.style.strokeDasharray = '';
        el.style.strokeDashoffset = '';
        el.style.opacity = '';
        el.style.transition = '';
      });
      planRef.current = [];
    };
  }, [reduced]);

  useEffect(() => {
    const root = ref.current;
    if (!root || reduced || seen) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      setSeen(true);

      planRef.current.forEach(({ el, draw, length }, i) => {
        const delay = i * stagger;
        if (draw && length > 0) {
          el.style.transition = `stroke-dashoffset ${duration}ms var(--ease) ${delay}ms`;
          el.style.strokeDashoffset = '0';
        } else {
          el.style.transition = `opacity ${fade}ms var(--ease) ${delay + 120}ms`;
          el.style.opacity = '';
        }
      });
    }, { rootMargin: '0px 0px -12% 0px' });

    observer.observe(root);
    return () => observer.disconnect();
  }, [reduced, seen, duration, stagger, fade]);

  return ref;
}
