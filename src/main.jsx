/**
 * Entry point. Styles load here so the token layer is first in the cascade;
 * Three.js is imported lazily from the hero so the headline paints first.
 */

import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';

import App from './App.jsx';

const container = document.getElementById('root');
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

/* The production build pre-renders this tree into #root
   (scripts/prerender.mjs), so attach to that markup rather than discarding
   it. `vite dev` serves the bare index.html with an empty #root, and
   hydrating nothing makes React report a mismatch and fall back - so branch
   on what is actually in the container instead. */
if (container.firstElementChild) hydrateRoot(container, app);
else createRoot(container).render(app);
