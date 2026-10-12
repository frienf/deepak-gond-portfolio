/**
 * Server entry, used only at build time by scripts/prerender.mjs.
 *
 * Vite bundles this with `--ssr`, which is what makes the CSS imports in
 * the component tree survive: in an SSR build Vite strips them rather than
 * handing Node a .css file it cannot parse. That is the whole reason this
 * goes through Vite instead of being imported straight into the script.
 *
 * Three.js is never pulled in here - usePipelineScene imports it inside an
 * effect, and effects do not run during renderToString.
 */

import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';

/** @returns {string} the app's markup, for injection into #root */
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
