import { useEffect, useState } from 'react';

/**
 * Id of the section currently occupying the middle of the viewport.
 * @param {string[]} ids
 */
export function useActiveSection(ids) {
  const [active, setActive] = useState('');

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return undefined;

    const ratios = new Map();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      let best = '';
      let bestRatio = 0;
      ratios.forEach((ratio, id) => {
        if (ratio > bestRatio) { bestRatio = ratio; best = id; }
      });
      setActive(bestRatio > 0 ? best : '');
    }, {
      // Reading band: the middle of the viewport
      rootMargin: '-25% 0px -45% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
