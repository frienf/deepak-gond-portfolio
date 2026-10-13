import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  /* Pages serves this repo at frienf.github.io/deepak-gond-portfolio/, not at
     a root. Without this every emitted asset URL is /assets/... and 404s.
     Drop it only if the repo is ever renamed frienf.github.io, which would
     move the site to the root. */
  base: '/deepak-gond-portfolio/',
  plugins: [react()],

  /* Split the two big dependencies out of the app chunk. This does not make
     the download smaller - the bytes are the same - it makes them cacheable
     separately, so shipping a copy change no longer re-downloads 336 KB of
     React and GSAP along with it.

     GSAP is deliberately NOT lazy-loaded despite being 114 KB of critical
     path. `.js .js-reveal` hides content the moment the inline script adds
     the `js` class, and GSAP is what reveals it again - defer GSAP and
     every section below the fold stays blank until its chunk lands, which
     is the exact problem the reveal thresholds were just widened to fix. */
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'vendor-three';
          if (id.includes('node_modules/gsap')) return 'vendor-gsap';
          // Without this, Motion lands in the app chunk and ships on the
          // critical path, re-downloaded on every content change. Matched
          // before react, since motion/react resolves inside node_modules/motion.
          if (id.includes('node_modules/motion')) return 'vendor-motion';
          if (id.includes('node_modules/react')) return 'vendor-react';
          return undefined;
        },
      },
    },
  },
});
