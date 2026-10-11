import { useEffect, useState } from 'react';

/**
 * True once the page has scrolled off the very top. Uses a sentinel element
 * and IntersectionObserver rather than a scroll handler, so nothing runs on
 * every scroll frame.
 */
export function useStickyHeader() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;';
    document.body.prepend(sentinel);

    const observer = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting));
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, []);

  return stuck;
}
