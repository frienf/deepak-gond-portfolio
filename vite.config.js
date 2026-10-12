import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  /* Pages serves this repo at frienf.github.io/deepak-gond-portfolio/, not at
     a root. Without this every emitted asset URL is /assets/... and 404s.
     Drop it only if the repo is ever renamed frienf.github.io, which would
     move the site to the root. */
  base: '/deepak-gond-portfolio/',
  plugins: [react()],
});
