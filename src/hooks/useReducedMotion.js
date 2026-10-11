import { useSyncExternalStore } from 'react';

const query = () => window.matchMedia('(prefers-reduced-motion: reduce)');

function subscribe(callback) {
  const mql = query();
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

/**
 * Tracks the OS motion preference and re-renders if it changes mid-session.
 * @returns {boolean} true when the visitor asked for less motion.
 */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => query().matches,
    () => false, // server/prerender default: assume motion is fine
  );
}
