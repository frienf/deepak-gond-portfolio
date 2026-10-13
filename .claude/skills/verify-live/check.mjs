// Asserts the deployed site actually serves what the repo claims it does.
// The expected URL is read from index.html's canonical rather than hard-coded,
// so this keeps working when the placeholder domain is finally replaced.
//
// Usage: node .claude/skills/verify-live/check.mjs [baseUrl]
import { readFileSync, readdirSync } from 'node:fs';

const root = new URL('../../../', import.meta.url);
const indexHtml = readFileSync(new URL('index.html', root), 'utf8');

const canonical = indexHtml.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
if (!canonical) {
  console.error('FAIL  no <link rel="canonical"> in index.html - nothing to verify against.');
  process.exit(1);
}

const base = (process.argv[2] ?? canonical).replace(/\/?$/, '/');
// Search Console drops a token file at the site root; find it rather than
// pinning the name, which changes if the property is re-verified.
const gscToken = readdirSync(new URL('public/', root)).find((f) => /^google[0-9a-f]+\.html$/.test(f));

const results = [];
const check = (name, fn) => results.push({ name, fn });
const get = async (path) => {
  const res = await fetch(new URL(path, base), { redirect: 'follow' });
  return { status: res.status, body: await res.text() };
};

check('home page serves 200', async () => {
  const { status } = await get('.');
  if (status !== 200) throw new Error(`got ${status}`);
});

check('home page is prerendered (crawlers see content, not an empty root)', async () => {
  const { body } = await get('.');
  const h1 = body.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1];
  if (!h1) throw new Error('no <h1> in the served HTML');
  const text = h1.replace(/<[^>]+>/g, '').trim();
  if (text.length < 10) throw new Error(`<h1> is thin: ${JSON.stringify(text)}`);
  if (/<div id="root">\s*<\/div>/.test(body)) throw new Error('#root is empty - prerender did not run');
  return `"${text}"`;
});

check('canonical on the live page matches index.html', async () => {
  const { body } = await get('.');
  const live = body.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (live !== canonical) throw new Error(`live says ${live}, repo says ${canonical}`);
  return canonical;
});

check('sitemap.xml serves and points at the canonical URL', async () => {
  const { status, body } = await get('sitemap.xml');
  if (status !== 200) throw new Error(`got ${status}`);
  const loc = body.match(/<loc>([^<]+)<\/loc>/)?.[1];
  if (loc !== canonical) throw new Error(`<loc> is ${loc}, canonical is ${canonical}`);
  return loc;
});

check('sitemap lastmod was stamped with a real date', async () => {
  const { body } = await get('sitemap.xml');
  const lastmod = body.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
  if (!lastmod) throw new Error('no <lastmod>');
  const when = new Date(lastmod);
  if (Number.isNaN(when.valueOf())) throw new Error(`not a date: ${lastmod}`);
  if (when > new Date()) throw new Error(`in the future: ${lastmod}`);
  return lastmod;
});

check('robots.txt serves and declares the sitemap', async () => {
  const { status, body } = await get('robots.txt');
  if (status !== 200) throw new Error(`got ${status}`);
  const sitemap = body.match(/^Sitemap:\s*(\S+)/m)?.[1];
  if (!sitemap) throw new Error('no Sitemap: directive');
  if (!sitemap.startsWith(canonical)) throw new Error(`Sitemap: points outside the site: ${sitemap}`);
  return sitemap;
});

if (gscToken) {
  check('Search Console token still serves', async () => {
    const { status } = await get(gscToken);
    if (status !== 200) throw new Error(`${gscToken} got ${status}`);
    return gscToken;
  });
}

check('og:image is not a 404', async () => {
  const og = indexHtml.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  if (!og) throw new Error('no og:image in index.html');
  const res = await fetch(og, { method: 'GET', redirect: 'follow' });
  if (res.status !== 200) throw new Error(`${og} got ${res.status}`);
  return og;
});

console.log(`Verifying ${base}\n`);
let failed = 0;
for (const { name, fn } of results) {
  try {
    const detail = await fn();
    console.log(`PASS  ${name}${detail ? `  -> ${detail}` : ''}`);
  } catch (err) {
    failed += 1;
    console.log(`FAIL  ${name}\n        ${err.message}`);
  }
}
console.log(`\n${results.length - failed}/${results.length} checks passed.`);
process.exit(failed === 0 ? 0 : 1);
