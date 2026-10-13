---
name: verify-live
description: Verify the deployed GitHub Pages site serves what the repo claims - prerendered content, canonical, sitemap, robots, Search Console token and og:image.
disable-model-invocation: true
---

# verify-live

Checks the deployed site, not the build. Run after a deploy finishes, or
whenever you want to know whether what crawlers see still matches the repo.

## Run it

```bash
node .claude/skills/verify-live/check.mjs
```

The base URL comes from `<link rel="canonical">` in `index.html`, so this
follows the site if the placeholder domain is ever replaced. To check
somewhere else — a preview, a staging copy — pass the URL:

```bash
node .claude/skills/verify-live/check.mjs http://localhost:4173/deepak-gond-portfolio/
```

It prints one PASS/FAIL line per check and exits non-zero if any failed.

## What each failure means

| Failure | Where to look |
|---|---|
| home page serves 200 | Pages deploy failed, or `base` in `vite.config.js` no longer matches the repo's Pages subpath |
| not prerendered / `#root` empty | `scripts/prerender.mjs` did not run or threw during `npm run build` |
| canonical mismatch | `dist/` is stale — the live page was built before the `index.html` change |
| sitemap `<loc>` mismatch | `public/sitemap.xml` and the canonical have drifted apart |
| lastmod not stamped | `scripts/stamp-sitemap.mjs` did not run, or CI checked out with no git history for it to read |
| Search Console token 404 | the token file left `public/`, or the property was re-verified with a new one |
| og:image 404 | `npm run og` was never run, or `public/og.png` is not being published |

## Known non-issue

`robots.txt` is served at `/deepak-gond-portfolio/robots.txt`. Crawlers only
read it at the host root, so on a project Pages site it is ignored — the
check confirms it serves and is internally consistent, nothing more. The
sitemap is submitted directly in Search Console instead.
