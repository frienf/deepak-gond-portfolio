/**
 * Rasterise public/og.svg -> public/og.png (1200x630).
 *
 * LinkedIn, X and Slack will not render an SVG preview, so the social card
 * has to ship as a PNG. This keeps og.svg as the source of truth: edit the
 * SVG, re-run `npm run og`.
 *
 * Fonts: resvg cannot read woff2, so it wants TTFs. Generate them once with
 *
 *   python -c "from fontTools.ttLib import TTFont; import pathlib; [ (lambda f: (setattr(f,'flavor',None), f.save('.cache/fonts/'+p.stem+'.ttf')))(TTFont(str(p))) for p in pathlib.Path('public/fonts').glob('*.woff2') ]"
 *
 * (needs `pip install fonttools brotli`). Without them this still runs, but
 * falls back to system fonts and the serif will not match the site.
 */

import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'public/og.svg';
const OUT = 'public/og.png';
const FONT_DIR = '.cache/fonts';
const WIDTH = 1200;

const fontFiles = existsSync(FONT_DIR)
  ? readdirSync(FONT_DIR).filter((f) => /\.(ttf|otf)$/i.test(f)).map((f) => join(FONT_DIR, f))
  : [];

if (fontFiles.length === 0) {
  console.warn('[og] No TTFs in .cache/fonts - falling back to system fonts.');
  console.warn('[og] The headline serif will not match the site. See the header of this file.');
}

const resvg = new Resvg(readFileSync(SRC, 'utf8'), {
  fitTo: { mode: 'width', value: WIDTH },
  font: {
    fontFiles,
    loadSystemFonts: fontFiles.length === 0,
    defaultFontFamily: 'Inter',
  },
});

const png = resvg.render().asPng();
writeFileSync(OUT, png);

console.log(`[og] ${OUT}  ${resvg.width}x${resvg.height}  ${(png.length / 1024).toFixed(1)} KB`);
console.log(`[og] fonts: ${fontFiles.length ? fontFiles.map((f) => f.split(/[\/]/).pop()).join(', ') : 'system'}`);
