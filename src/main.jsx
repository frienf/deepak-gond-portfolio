/**
 * Entry point. Styles load here so the token layer is first in the cascade;
 * Three.js is imported lazily from the hero so the headline paints first.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
