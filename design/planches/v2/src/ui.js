// Shared components V2. Scenes compose; base.css styles.
import { meta, figures, pages } from './data.js';

export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Traced figure: verify.mjs checks data-src exists and the value matches data.js (which is checked against the repo).
export function fig(id, tag = 'strong') {
  const f = figures[id];
  if (!f) throw new Error(`unknown figure ${id}`);
  return `<${tag} data-proof="${id}" data-src="${f.file}">${esc(f.v)}</${tag}>`;
}

export function top(i) {
  return `<header class="top"><a class="mark" href="01-comprendre.html">Réplique<i>0${i + 1} / 05</i></a>
  <p class="badge" data-badge>${esc(meta.badge)}</p></header>`;
}

export function tab(i) {
  const n = pages[(i + 1) % pages.length];
  return `<a class="tab" href="${n.slug}.html">${i === pages.length - 1 ? 'Back to start ↑' : `Next — ${n.short} →`}</a>`;
}

// Hero with relief canvas (or none) + text block at the bottom.
export function hero({ scene, title, dash = '', key = '', label, fallback = '' }) {
  const cv = scene ? `<canvas data-relief="${scene}" role="img" aria-label="${esc(label)}"></canvas><div class="fallback" aria-hidden="true">${fallback}</div>` : '';
  return `<section class="hero">${cv}<span class="cue" aria-hidden="true">Scroll down</span>
  <div class="hero-text"><div>${title}${dash}</div>${key}</div></section>`;
}

export function dash(items, attr = '') {
  return `<ul class="dash"${attr}>${items.map(x => `<li>${x}</li>`).join('')}</ul>`;
}

export function srcTable(ids, extra = [], note = '') {
  const row = (v, w, f) => `<tr><td>${esc(v)}</td><td>${esc(w)}</td><td>${esc(f)}</td></tr>`;
  return `<section class="src"><div class="wrap"><h2>SRC — every figure → its file · ${esc(meta.repo)} @ ${meta.commit}</h2>
  <table><thead><tr><th>Value</th><th>What</th><th>Source file</th></tr></thead><tbody>
  ${ids.map(id => row(figures[id].v, figures[id].label, figures[id].file)).join('')}${extra.map(r => row(...r)).join('')}
  </tbody></table>${note ? `<p class="note">${note}</p>` : ''}</div></section>`;
}

export function foot(i) {
  const links = pages.map((p, k) => `<a href="${p.slug}.html"${k === i ? ' aria-current="page"' : ''}><i>0${k + 1}</i>${esc(p.short)}</a>`).join('');
  return `<footer class="wrap"><nav class="index" aria-label="Planches">${links}</nav>
  <div class="colophon"><span>Réplique · ${esc(meta.license)} · ${esc(meta.repo)}</span><span>Design V2 · 2026-11-18 · self-contained, no network</span></div></footer>`;
}
