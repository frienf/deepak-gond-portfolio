import { useEffect, useRef, useState } from 'react';

/**
 * Fires once, the first time the element is near the viewport.
 * @param {string} rootMargin
 * @returns {[React.RefObject, boolean]}
 */
export function useInView(rootMargin = '0px 0px -15% 0px') {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || seen) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setSeen(true);
      observer.disconnect();
    }, { rootMargin });

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, seen]);

  return [ref, seen];
}
