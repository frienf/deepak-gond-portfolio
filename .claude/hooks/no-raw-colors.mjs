// CLAUDE.md rule 3: tokens.css is the only file with raw colour values.
// A literal in components.css or base.css silently breaks the light theme,
// so this refuses the edit instead of waiting for someone to eyeball it.
import { readFileSync } from 'node:fs';

const GUARDED = /src[\/]styles[\/](components|base)\.css$/;
const COLOR = /oklch\(|\boklab\(|\brgba?\(|\bhsla?\(|\blab\(|\blch\(|#[0-9a-fA-F]{3,8}\b/;

const input = JSON.parse(readFileSync(0, 'utf8'));
const file = input?.tool_input?.file_path ?? input?.tool_response?.filePath;
if (!file || !GUARDED.test(file)) process.exit(0);

let src;
try {
  src = readFileSync(file, 'utf8');
} catch {
  // Fail open, but say so - a silent skip looks identical to a clean file.
  console.error(`no-raw-colors: could not read ${file}; colour check skipped.`);
  process.exit(0);
}

// url(#gradient) is an SVG reference, not a colour.
const offenders = src
  .split('\n')
  .map((line, i) => [i + 1, line.replace(/url\([^)]*\)/g, '')])
  .filter(([, line]) => COLOR.test(line));

if (offenders.length === 0) process.exit(0);

console.error(
  `CLAUDE.md rule 3: raw colour value(s) in ${file}.\n` +
    offenders.map(([n, line]) => `  ${n}: ${line.trim()}`).join('\n') +
    `\nDefine the colour as a custom property in src/styles/tokens.css (both themes, AAA 7:1) and reference var(--...) here.`
);
process.exit(2);
