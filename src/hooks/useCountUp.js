import { useEffect, useState } from 'react';
import { useInView } from './useInView.js';
import { useReducedMotion } from './useReducedMotion.js';

const DURATION = 1400;
/** easeOutExpo - fast start, long settle, reads as a value "landing". */
const ease = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -9 * t));

/**
 * Counts up to `target` the first time it scrolls into view. The caller
 * renders the real number whenever this returns null, so the correct value
 * is on screen before and without any animation.
 *
 * @param {number} target
 * @returns {[React.RefObject, number|null]} ref to attach, and the live value
 */
export function useCountUp(target) {
  const [ref, inView] = useInView();
  const reduced = useReducedMotion();
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (!inView || reduced) return undefined;

    let raf = 0;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / DURATION, 1);
      setValue(Math.round(ease(progress) * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    setValue(0);
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, target]);

  return [ref, value];
}
