/**
 * Stamp <lastmod> in dist/sitemap.xml at build time.
 *
 * The date comes from the last commit, not from "now". A rebuild that
 * changes nothing - a re-run of the deploy workflow, a dependency bump -
 * should not tell Google the page changed, and a lastmod that moves on
 * every fetch is one crawlers learn to ignore. The commit date moves only
 * when the site actually does.
 *
 * Runs after `vite build` has copied public/sitemap.xml into dist/.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const PAGE = 'dist/sitemap.xml';
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function lastCommitDate() {
  try {
    // %cs is the committer date as YYYY-MM-DD, already the format we need.
    const date = execFileSync('git', ['log', '-1', '--format=%cs'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return ISO_DATE.test(date) ? date : null;
  } catch {
    // No git in the environment, or a checkout with no history.
    return null;
  }
}

const committed = lastCommitDate();
const date = committed ?? new Date().toISOString().slice(0, 10);

const xml = readFileSync(PAGE, 'utf8');
if (!/<lastmod>[^<]*<\/lastmod>/.test(xml)) {
  throw new Error(`${PAGE} has no <lastmod> to stamp.`);
}

writeFileSync(PAGE, xml.replace(/<lastmod>[^<]*<\/lastmod>/g, `<lastmod>${date}</lastmod>`));

console.log(`[sitemap] lastmod ${date}  (${committed ? 'last commit' : 'build date - git unavailable'})`);
