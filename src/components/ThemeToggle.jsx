import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Icon } from './Icon.jsx';

/**
 * One button, two states. The label says what will happen, not what is
 * currently true, which is what a screen reader user needs to decide
 * whether to press it.
 *
 * Motion pilot, interactive case. The sun/moon swap was instant: the two
 * glyphs are separate sprite symbols, so a CSS transition has nothing to
 * interpolate between. Keying the wrapper on the icon name remounts it, and
 * Motion settles the new glyph in. `.theme-toggle` transitions only `color`
 * and `border-color`, so nothing else writes opacity or rotate here.
 */
export function ThemeToggle({ theme, onToggle }) {
  const toLight = theme === 'dark';
  const reduced = useReducedMotion();
  const name = toLight ? 'sun' : 'moon';
  const label = toLight ? 'Switch to light theme' : 'Switch to dark theme';

  // Motion renders `initial` into the SSR markup, so passing one here would
  // ship style="opacity:0" in the prerendered HTML and leave the glyph
  // invisible with JavaScript off. `initial={false}` on the first render
  // starts at the animate state instead; later theme changes remount this
  // span via its key, by which point entering from hidden is safe.
  const swapped = useRef(false);
  useEffect(() => {
    swapped.current = true;
  }, []);
  const enter = reduced ? { opacity: 0 } : { opacity: 0, rotate: -75 };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-pressed={!toLight}
      title={label}
    >
      <motion.span
        key={name}
        className="theme-toggle__glyph"
        initial={swapped.current ? enter : false}
        animate={reduced ? { opacity: 1 } : { opacity: 1, rotate: 0 }}
        // 140ms / --dur-fast, the token for a state change. Explicit easing:
        // Motion would otherwise spring `rotate` and overshoot the glyph.
        transition={{ duration: 0.14, ease: [0.33, 1, 0.68, 1] }}
      >
        <Icon name={name} size={18} />
      </motion.span>
      <span className="sr-only">{label}</span>
    </button>
  );
}
