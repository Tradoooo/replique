// Assemble the 5 self-contained V2 planches into dist/ (inline CSS/JS/SVG/PNG, zero network).
// Usage: node build.mjs [n]   (n = build only page n, for quick iteration)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { meta, pages } from './src/data.js';
import { top, tab, srcTable, foot } from './src/ui.js';

const here = fileURLToPath(new URL('.', import.meta.url));
const read = f => readFileSync(here + f, 'utf8');
const css = read('src/theme.css') + read('src/base.css');
const tpl = read('src/tpl.html');
const relief = read('src/relief.js');
const engine = read('src/engine.js');
// Real tool outputs, verbatim; only the shared marker id is namespaced so ids stay unique.
const svg = (f, ns) => read(`src/assets/${f}`).replace(/id="arrow"/g, `id="arrow-${ns}"`).replace(/url\(#arrow\)/g, `url(#arrow-${ns})`);
const assets = {
  deadlock: svg('deadlock.svg', 'dl'),
  prio: svg('prio-inversion.svg', 'pi'),
  vga: 'data:image/png;base64,' + readFileSync(here + 'src/assets/invite-qnx800.png').toString('base64'),
};

const only = Number(process.argv[2]) || 0;
mkdirSync(here + 'dist', { recursive: true });
for (const [i, p] of pages.entries()) {
  if (only && only !== i + 1) continue;
  const file = here + `src/scenes/p0${i + 1}.js`;
  if (!existsSync(file)) { console.log(`skip ${p.slug} (no scene yet)`); continue; }
  const s = await import(pathToFileURL(file).href);
  const content = s.content({ assets, meta });
  const html = tpl
    .replace('{{TITLE}}', s.title).replace('{{PAGE}}', p.slug)
    .replace('{{CSS}}', () => css + s.css)
    .replace('{{TOP}}', () => top(i)).replace('{{TAB}}', () => tab(i))
    .replace('{{CONTENT}}', () => content)
    .replace('{{SRC}}', () => srcTable(s.srcIds, s.srcExtra, s.note || ''))
    .replace('{{FOOT}}', () => foot(i))
    .replace('{{RELIEF}}', () => (content.includes('data-relief') ? relief : ''))
    .replace('{{ENGINE}}', () => engine);
  writeFileSync(here + `dist/${p.slug}.html`, html);
  console.log(`built dist/${p.slug}.html  ${(html.length / 1024).toFixed(1)} KB`);
}
