// V2 verification: headless Chrome (SwiftShader WebGL), assertions, captures, review index.
// Usage: node verify.mjs [path-to-replique-clone]   — exits 1 on any broken contract.
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { figures, pages, steps } from './src/data.js';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_CORE || 'playwright-core');

const here = fileURLToPath(new URL('.', import.meta.url));
const REPO = process.argv[2] || process.env.REPLIQUE_REPO || fileURLToPath(new URL('../../../', import.meta.url));
const out = here + 'captures/';
const SCENES = { 0: 'links', 1: 'ring' };
const norm = s => s.replace(/[\u00a0\u202f\u2009]/g, ' ');
const url = f => pathToFileURL(here + 'dist/' + f).href;

function traceFigures() {
  if (!existsSync(REPO)) throw new Error(`repo clone not found: ${REPO}`);
  const bad = Object.entries(figures).filter(([, f]) => !norm(readFileSync(`${REPO}/${f.file}`, 'utf8')).includes(norm(f.needle)));
  if (bad.length) throw new Error('figures not found in repo: ' + bad.map(([k]) => k).join(', '));
}

const lum = c => { const [r, g, b] = c.match(/[\d.]+/g).slice(0, 3).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * r + .7152 * g + .0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };

function probe() {
  const parse = s => (s.match(/[\d.]+/g) || []).map(Number);
  const bgOf = e => {
    const tints = [];
    for (let n = e; n; n = n.parentElement) {
      const [r, g, b, a = 1] = parse(getComputedStyle(n).backgroundColor);
      if (a >= 1) { let c = [r, g, b]; for (const [tr, tg, tb, ta] of tints.reverse()) c = [c[0] + (tr - c[0]) * ta, c[1] + (tg - c[1]) * ta, c[2] + (tb - c[2]) * ta]; return `rgb(${c.map(Math.round).join(', ')})`; }
      if (a > 0) tints.push([r, g, b, a]);
    }
    return 'rgb(236, 235, 231)';
  };
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !e.closest('svg,.sr,[aria-hidden="true"],[hidden]'); };
  const body = [...document.querySelectorAll('main p, main li, main td, .src td, .term, .lead')].filter(vis);
  const leaves = [...document.querySelectorAll('body *')].filter(e => vis(e) && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()));
  return {
    brand: /réplique/i.test(document.querySelector('.mark')?.innerText || ''),
    badge: document.querySelector('[data-badge]')?.innerText || '',
    slogan: !!document.querySelector('[data-slogan]'),
    figs: [...document.querySelectorAll('[data-proof]')].map(e => ({ k: e.dataset.proof, src: e.dataset.src, v: e.textContent.trim() })),
    steps: [...document.querySelectorAll('[data-step]')].map(e => e.innerText),
    rows: document.querySelectorAll('[data-row]').length,
    bodySmall: body.filter(e => parseFloat(getComputedStyle(e).fontSize) < 16).map(e => e.className || e.tagName).slice(0, 5),
    tiny: leaves.filter(e => parseFloat(getComputedStyle(e).fontSize) < 16).map(e => e.className || e.tagName).slice(0, 5),
    pairs: leaves.map(e => [getComputedStyle(e).color, bgOf(e), parseFloat(getComputedStyle(e).fontSize), getComputedStyle(e).fontWeight, (e.className || e.tagName) + ''].join('|')),
    overflowX: document.documentElement.scrollWidth - innerWidth,
    clipped: [...document.querySelectorAll('.plate,.term,.rows li,h1,.lead,.stats li,.p4-shot,.key')].filter(e => { const r = e.getBoundingClientRect(); return r.width && (r.right > innerWidth + 1 || r.left < -1); }).length,
    p1boxes: [...document.querySelectorAll('.hero-text h1, .hero-text .dash, .hero-text .key, .top .mark, .top .badge')].map(e => { const r = e.getBoundingClientRect(); return [r.x, r.y, r.right, r.bottom]; }),
    relief: window.__relief || null,
    canvasVaried: (() => { const c = document.querySelector('canvas[data-relief]'); if (!c) return null; const g = c.getContext('webgl'); const px = new Uint8Array(4 * 64); const seen = new Set(); for (let i = 0; i < 16; i++) { g.readPixels(Math.floor(c.width * (i % 4 + .5) / 4), Math.floor(c.height * (Math.floor(i / 4) + .5) / 4), 1, 1, g.RGBA, g.UNSIGNED_BYTE, px); seen.add(px.slice(0, 3).join(',')); } return seen.size; })(),
    imgs: [...document.images].filter(i => !i.src.startsWith('data:')).length,
  };
}

const lowContrast = pairs => pairs.map(s => s.split('|')).filter(([c, bg, size, w]) => ratio(c, bg) < ((size >= 24 || (size >= 18.66 && +w >= 700)) ? 3 : 4.5)).map(p => p[4]);
const overlaps = b => b.some((a, x) => b.some((c, y) => x < y && a[0] < c[2] - 1 && a[2] > c[0] + 1 && a[1] < c[3] - 1 && a[3] > c[1] + 1));

async function checkPage(browser, p, i) {
  const file = `${p.slug}.html`, errors = [], external = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('request', r => { if (!/^(file|data):/.test(r.url())) external.push(r.url()); });
  await page.goto(url(file), { waitUntil: 'load' });
  await page.waitForTimeout(2600);
  const d = await page.evaluate(probe);
  await page.screenshot({ path: `${out}${p.slug}-1440.png` });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(900);
  const m = await page.evaluate(probe);
  await page.screenshot({ path: `${out}${p.slug}-390.png` });
  await page.close();
  const rm = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await rm.goto(url(file), { waitUntil: 'load' });
  await rm.waitForTimeout(800);
  const still = await rm.evaluate(() => ({ css: document.getAnimations().filter(a => a.playState === 'running').length, gl: !!(window.__relief && window.__relief.running) }));
  await rm.screenshot({ path: `${out}full/${p.slug}-full.png`, fullPage: true });
  await rm.close();

  const fail = [];
  if (errors.length) fail.push(`JS errors: ${errors.join(' / ')}`);
  if (external.length) fail.push(`external requests: ${external.length}`);
  if (!d.brand || !/QNX Global Hackathon 2026 · Developer Tooling & Host Tools/.test(d.badge.replace(/\s+/g, ' '))) fail.push('brand/badge missing');
  if (i === 0 && !d.slogan) fail.push('slogan missing');
  if (i === 0 && (overlaps(d.p1boxes) || overlaps(m.p1boxes))) fail.push('P1 overlap');
  if (SCENES[i] && !(d.relief && d.relief.ok && d.canvasVaried > 2)) fail.push(`relief scene not rendered (${JSON.stringify(d.relief)}, ${d.canvasVaried})`);
  if (i === 2 && (d.steps.length !== 10 || d.rows !== 10 || steps.some((s, k) => !d.steps[k]?.includes(s.n)))) fail.push(`P3 steps ${d.steps.length}/10 rows ${d.rows}/10`);
  if (d.figs.some(f => !f.src || !figures[f.k] || figures[f.k].v !== f.v)) fail.push('figure without source / mismatch');
  if (still.css || still.gl) fail.push(`reduced-motion: css ${still.css}, webgl loop ${still.gl}`);
  if (d.overflowX > 0 || m.overflowX > 0) fail.push(`horizontal overflow ${d.overflowX}/${m.overflowX}`);
  if (d.clipped || m.clipped) fail.push(`clipped boxes ${d.clipped}/${m.clipped}`);
  if (d.bodySmall.length || m.bodySmall.length) fail.push(`body text < 16px: ${[...d.bodySmall, ...m.bodySmall].join(',')}`);
  if (d.tiny.length) fail.push(`text < 16px: ${d.tiny.join(',')}`);
  const lc = [...new Set([...lowContrast(d.pairs), ...lowContrast(m.pairs)])];
  if (lc.length) fail.push(`contrast < AA: ${lc.slice(0, 6).join(',')}`);
  if (d.imgs) fail.push('non-inline image');
  const nfig = new Set(d.figs.map(f => f.k)).size;
  const scene = SCENES[i] ? `relief 3D « ${SCENES[i]} » rendue` : 'sans 3D';
  return { file, fail, line: `${fail.length ? 'FAIL' : 'OK'} ${file} | 1440x900 + 390x844 | ${errors.length} erreur JS | ${external.length} requête externe | marque+${i === 0 ? 'slogan+' : ''}badge | ${scene} | ${i === 2 ? `${d.steps.length} étapes` : '— étapes'} | ${nfig} chiffres tracés${fail.length ? ' | ' + fail.join(' · ') : ''}` };
}

async function contactSheet(browser) {
  const imgs = pages.map(p => `<figure><img src="${p.slug}-1440.png"><figcaption>${p.slug}</figcaption></figure>`).join('');
  writeFileSync(out + 'contact.html', `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#d9d7d1;color:#111;font:16px Consolas;display:grid;grid-template-columns:repeat(5,1fr);gap:14px;padding:20px}img{width:100%;display:block;box-shadow:6px 8px 18px rgba(0,0,0,.15)}figure{margin:0}figcaption{padding-top:8px}</style>${imgs}`);
  const c = await browser.newPage({ viewport: { width: 2400, height: 320 } });
  await c.goto(pathToFileURL(out + 'contact.html').href);
  await c.screenshot({ path: out + 'planche-contact.jpg', type: 'jpeg', quality: 88, fullPage: true });
  await c.close();
}

function reviewIndex(results) {
  const cards = results.map((r, i) => `<a class="c" href="dist/${r.file}"><img src="captures/${pages[i].slug}-1440.png" alt="${r.file} 1440"><img src="captures/${pages[i].slug}-390.png" alt="${r.file} 390"><b>${r.file}</b><span class="${r.fail.length ? 'ko' : 'ok'}">${r.fail.length ? '✕ ' + r.fail.join(' · ') : '✓ vérifiée'}</span></a>`).join('');
  writeFileSync(here + 'index.html', `<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Réplique V2 — revue</title>
<style>body{margin:0;background:#ecebe7;color:#111214;font:17px/1.5 "Segoe UI",system-ui;padding:40px clamp(16px,4vw,64px)}h1{font:600 clamp(48px,7vw,110px)/.86 "Segoe UI Variable Display","Segoe UI",sans-serif;letter-spacing:-.06em;margin:0 0 16px}p{color:#5b5f64;max-width:70ch}.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:24px;margin-top:32px}.c{display:grid;grid-template-columns:1fr 96px;gap:10px;text-decoration:none;color:inherit;background:#f7f6f3;border-radius:18px;padding:14px;box-shadow:12px 16px 34px rgba(60,52,40,.14)}.c img{width:100%;border-radius:8px}.c b,.c span{grid-column:1/-1}.ok{color:#1d6b2c}.ko{color:#c62828}pre{background:#f7f6f3;padding:18px;border-radius:14px;white-space:pre-wrap;font:15px/1.5 Consolas,monospace}</style>
<h1>Réplique<br>planches V2</h1><p>QNX Global Hackathon 2026 · Developer Tooling &amp; Host Tools — direction « Relief blanc ». 5 pages autonomes vérifiées le ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC. <a href="captures/planche-contact.jpg">Planche-contact</a> · <a href="REFS.md">REFS</a> · <a href="PLAN.md">PLAN</a> · V1 archivée : <a href="../v1/index.html">../v1</a></p>
<div class="g">${cards}</div><h2>Sortie verify.mjs</h2><pre>${results.map(r => r.line).join('\n')}</pre></html>`);
}

traceFigures();
mkdirSync(out + 'full', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const results = [];
for (const [i, p] of pages.entries()) results.push(await checkPage(browser, p, i));
await contactSheet(browser);
await browser.close();
reviewIndex(results);
writeFileSync(out + 'verify.json', JSON.stringify(results, null, 1));
console.log(`Figures: ${Object.keys(figures).length}/${Object.keys(figures).length} retrouvés dans le dépôt (replique @ df35def)`);
results.forEach(r => console.log(r.line));
if (results.some(r => r.fail.length)) process.exit(1);
console.log('Contrôles : 0 erreur JS · 0 requête externe · WebGL rendu + figé en reduced-motion · aucun débordement 1440/390 · tout texte ≥ 16 px · contraste AA.');
