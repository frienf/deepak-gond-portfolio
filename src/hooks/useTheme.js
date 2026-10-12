import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Dark by default, light on request, remembered between visits.
 *
 * An inline script in index.html has already applied the stored choice to
 * <html> before first paint, so this hook never decides the theme on load -
 * it reads back what is already there and then owns changes from the toggle.
 *
 * The initial state is a hard-coded 'dark' rather than a read of the DOM,
 * because the page is pre-rendered: the server has no <html> to read, and
 * if the two renders disagreed React would throw a hydration mismatch. Both
 * sides start dark and the real value is picked up in a layout effect,
 * before paint and before the effect that builds the WebGL scene - so a
 * light visitor neither sees a dark frame nor pays for a canvas rebuild.
 */

const KEY = 'portfolio-theme';

// useLayoutEffect warns when it runs under renderToString; there is no
// layout to measure on the server, so fall back to the no-op effect there.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const readTheme = () => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

export function useTheme() {
  const [theme, setTheme] = useState('dark');
  const hydrated = useRef(false);

  useIsomorphicLayoutEffect(() => {
    hydrated.current = true;
    setTheme(readTheme());
  }, []);

  useEffect(() => {
    // Skip until the layout effect above has reconciled with the DOM,
    // otherwise the placeholder 'dark' would wipe the inline script's work.
    if (!hydrated.current) return;

    const root = document.documentElement;
    if (readTheme() === theme) return; // already applied before paint

    if (theme === 'light') root.dataset.theme = 'light';
    else delete root.dataset.theme;

    // Private mode and blocked storage both throw; the theme still works
    try { localStorage.setItem(KEY, theme); } catch { /* not important enough to break on */ }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, toggle };
}
