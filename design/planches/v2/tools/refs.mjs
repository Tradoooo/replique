// Open the 11 fixed references (REFERENCES-DESIGN.md) in real Chrome: fiche + live site.
// Usage: node tools/refs.mjs → captures/refs/*.jpg + refs.json
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_CORE || 'playwright-core');
const OUT = fileURLToPath(new URL('../captures/refs/', import.meta.url));
const REFS = [
  ['logopoint', 'https://www.webdesign-inspiration.com/fr/webdesign/logopoint-co'],
  ['igloo', 'https://www.webdesign-inspiration.com/fr/webdesign/iglooinc'],
  ['flow', 'https://www.webdesign-inspiration.com/fr/webdesign/flow-computingcom'],
  ['dominicburt', 'https://www.webdesign-inspiration.com/fr/webdesign/dominicburtcom'],
  ['teko', 'https://www.webdesign-inspiration.com/fr/webdesign/tekocomau'],
  ['nexusgpt', 'https://www.webdesign-inspiration.com/fr/webdesign/gptnexus'],
  ['noon', 'https://www.webdesign-inspiration.com/fr/webdesign/noonai'],
  ['raben', 'https://www.webdesign-inspiration.com/fr/webdesign/rabenrifaiecom'],
  ['gapsy', 'https://www.webdesign-inspiration.com/fr/webdesign/gapsystudiocom-2'],
  ['concept', 'https://www.webdesign-inspiration.com/fr/webdesign/conceptstudio-am-28330'],
  ['dfy', 'https://www.webdesign-inspiration.com/fr/webdesign/dfy-co-kr-18655'],
];
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36' });
const res = [];
for (const [id, url] of REFS) {
  const p = await ctx.newPage();
  const row = { id, fiche: url };
  try {
    const r = await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 40000 });
    await p.waitForTimeout(2500);
    for (const t of ['Refuser', 'Tout refuser', 'Continuer sans accepter', 'Reject', 'Accepter']) {
      const b = p.getByRole('button', { name: new RegExp(t, 'i') }).first();
      if (await b.isVisible().catch(() => false)) { await b.click().catch(() => {}); await p.waitForTimeout(800); break; }
    }
    row.status = r && r.status();
    row.title = await p.title();
    row.live = await p.$$eval('a[href^="http"]', as => {
      const x = as.map(a => ({ h: a.href, t: a.textContent.trim() })).filter(x => !/webdesign-inspiration|sirdata|facebook|twitter|x\.com|pinterest|instagram|linkedin|google|youtube|tiktok/.test(x.h));
      return (x.find(a => /visit|voir|site/i.test(a.t)) || x[0] || {}).h || null;
    });
    await p.screenshot({ path: `${OUT}${id}-fiche.jpg`, type: 'jpeg', quality: 50 });
    if (row.live) {
      const r2 = await p.goto(row.live, { waitUntil: 'domcontentloaded', timeout: 40000 });
      await p.waitForTimeout(5000);
      row.liveStatus = r2 && r2.status();
      row.live2 = p.url();
      await p.screenshot({ path: `${OUT}${id}-live.jpg`, type: 'jpeg', quality: 55 });
    }
  } catch (e) { row.error = String(e).slice(0, 140); }
  res.push(row);
  await p.close();
}
writeFileSync(OUT + 'refs.json', JSON.stringify({ date: new Date().toISOString(), res }, null, 1));
await browser.close();
res.forEach(r => console.log(`${r.status || 'ERR'} ${r.id} → ${r.liveStatus || '-'} ${r.live2 || r.live || ''} ${r.error || ''}`));
