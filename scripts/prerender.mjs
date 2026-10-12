/**
 * Inject the app's markup into dist/index.html so the page is readable
 * without JavaScript, and so crawlers see the real sections instead of an
 * empty <div id="root">.
 *
 * Runs after both Vite builds:
 *   vite build                                 -> dist/
 *   vite build --ssr src/entry-server.jsx      -> dist-ssr/
 *   node scripts/prerender.mjs                 -> rewrites dist/index.html
 *
 * The client then hydrates this markup rather than rebuilding it, which is
 * why the two renders have to agree - see the note in useTheme.js.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const PAGE = 'dist/index.html';
const SSR_ENTRY = 'dist-ssr/entry-server.js';
const MOUNT = '<div id="root"></div>';

if (!existsSync(SSR_ENTRY)) {
  throw new Error(`${SSR_ENTRY} is missing - run \`vite build --ssr src/entry-server.jsx --outDir dist-ssr\` first.`);
}

const html = readFileSync(PAGE, 'utf8');
if (!html.includes(MOUNT)) {
  throw new Error(`${PAGE} does not contain ${MOUNT} - the mount point moved, or this already ran.`);
}

const { render } = await import(pathToFileURL(SSR_ENTRY).href);
const markup = render();

const out = html.replace(MOUNT, `<div id="root">${markup}</div>`);

/* Guard the actual goal. If a refactor ever makes the tree bail out to a
   client-only render, the build should fail here rather than quietly ship
   an empty shell again.
   These count the finished page, not just the injected markup - a second
   <h1> elsewhere in index.html is still a second <h1> to a crawler, and
   checking only the markup is how one slipped through once already. */
// Count elements, not prose: index.html has comments that mention tags by
// name, and matching those made this throw on its own documentation.
const countable = out.replace(/<!--[\s\S]*?-->/g, '');
const count = (re) => (countable.match(re) || []).length;
const sections = count(/<section\b/g);
const h1s = count(/<h1\b/g);
const h2s = count(/<h2\b/g);

if (sections < 8) throw new Error(`expected at least 8 <section> elements, page has ${sections}.`);
if (h1s !== 1) throw new Error(`expected exactly one <h1> in the page, found ${h1s}.`);
if (h2s < 8) throw new Error(`expected at least 8 <h2> elements, page has ${h2s}.`);

writeFileSync(PAGE, out);

const kb = (s) => `${(Buffer.byteLength(s) / 1024).toFixed(1)} KB`;
console.log(`[prerender] ${PAGE}  ${kb(html)} -> ${kb(out)}`);
console.log(`[prerender] ${sections} sections, ${h1s} h1, ${h2s} h2`);
