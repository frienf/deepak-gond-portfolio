import { useCallback, useEffect, useState } from 'react';

/**
 * Dark by default, light on request, remembered between visits.
 *
 * The initial value is read from the <html> element rather than from
 * storage, because an inline script in index.html has already applied the
 * stored choice before first paint. Reading it again here would risk the
 * two disagreeing.
 */

const KEY = 'portfolio-theme';

export function useTheme() {
  const [theme, setTheme] = useState(
    () => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'),
  );

  useEffect(() => {
    const root = document.documentElement;
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
