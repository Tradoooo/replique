// P1 — Understand in 5 seconds. Relief: two plaster rings locked into each other, one red = a frozen deadlock.
import { meta } from '../data.js';
import { hero, dash, fig } from '../ui.js';

export const title = 'Réplique — freeze the crash, explain the wait, replay the schedule';
export const css = `
.p1-acts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(20px, 3vw, 48px); margin-top: clamp(56px, 8vw, 120px); }
.p1-acts h3 { font: 600 clamp(56px, 6.4vw, 112px)/.86 var(--f-display); letter-spacing: -.065em; margin: 0 0 22px; }
.p1-acts h3 small { display: block; font: 400 16px/1 var(--f-mono); letter-spacing: 0; color: var(--grey); margin-bottom: 18px; }
.p1-acts p { color: var(--grey); margin: 0; }
.p1-who { display: flex; flex-wrap: wrap; gap: 10px 32px; margin-top: 56px; padding-top: 22px; border-top: 1px solid var(--line); color: var(--grey); font-size: 17px; }
.p1-who b { color: var(--ink); font-weight: 600; }
@media (max-width: 900px) { .p1-acts { grid-template-columns: 1fr; } }
`;

const fallback = `<svg viewBox="0 0 400 260" width="60%" aria-hidden="true"><circle cx="160" cy="130" r="80" fill="none" stroke="#f7f6f3" stroke-width="34"/><circle cx="240" cy="130" r="80" fill="none" stroke="#c62828" stroke-width="34"/></svg>`;

export function content() {
  return `${hero({
    scene: 'links', label: 'Two rings locked into each other, one red: thread 101 waits for 102, which waits for 101 — a deadlock, frozen.', fallback,
    title: `<h1 class="mega">Réplique<span class="g">time machine<br>for QNX 8.0<span class="r">.</span></span></h1>`,
    dash: dash(meta.tagline, ' data-slogan aria-label="Working tagline"'),
    key: `<div class="key">${fig('diff')}<span>C↔Python comparisons · divergences — same bytes, every time.</span></div>`,
  })}
<section class="sec"><div class="wrap">
  <div class="split">
    <h2 class="h2 rv">One rare crash.<span class="g">One artefact.</span></h2>
    <p class="lead rv">A concurrency bug that happens once in a thousand runs on target becomes something you can <b>freeze</b>, <b>explain</b> and <b>replay</b> at will — on a PC.</p>
  </div>
  <div class="p1-acts">
    <article class="rv"><h3><small>01 — Déclic · on target</small>Freeze</h3><p>When the process dies, Déclic stops <span class="mono">tracelogger</span> and archives trace, <span class="mono">pidin</span>, <span class="mono">slog2</span> and core into one RDA1 file.</p></article>
    <article class="rv"><h3><small>02 — Autopsie · on host</small>Explain</h3><p>The C11 core rebuilds the wait-for graph and the blocking chain, and names the culprit with a frozen rule — on one page.</p></article>
    <article class="rv"><h3><small>03 — Réplique · on host</small>Replay</h3><p>A scheduler model replays the trace deterministically, hash for hash, and answers “what if this thread had priority 20?”.</p></article>
  </div>
  <div class="p1-who rv" aria-label="Who it is for"><span><b>QNX developer</b> — intermittent crash</span><span><b>Certified integrator</b> — ISO 26262 · IEC 62304 · EN 50128</span><span><b>Safety engineer</b> — blocking chain</span><span><b>CI team</b> — overwritten buffer</span></div>
</div></section>`;
}

export const srcIds = ['diff'];
export const srcExtra = [
  ['tagline', 'working tagline synthesised from “figé, expliqué et rejouable à volonté” — not verbatim in the repo', 'README.md (La promesse)'],
  ['time machine', '“machine à remonter le temps pour QNX 8.0”', 'README.md (title)'],
  ['101 ⇄ 102', 'deadlock cycle, culprit tid 102 (the red ring)', 'scenarios/deadlock.json'],
  ['4 roles', 'who has the problem', 'REPLIQUE-cahier-des-charges.md §1.1'],
];
