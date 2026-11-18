// P5 — Proof, guarantees, stated limits, next. Giant traced numbers; red only for "not verified".
import { figures, trials, limits, verdicts, sections } from '../data.js';
import { esc, fig } from '../ui.js';

export const title = 'Réplique — proof, guarantees and stated limits';
export const css = `
.p5-hero { min-height: 100vh; min-height: 100svh; display: grid; align-content: end; padding: 120px var(--gut) clamp(40px, 7vh, 80px); position: relative; }
.p5-giant { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(24px, 4vw, 72px); margin-top: clamp(32px, 6vh, 72px); border-top: 1.5px solid var(--ink); }
.p5-giant div { padding-top: 22px; }
.p5-giant strong { display: block; font: 600 clamp(80px, 11vw, 200px)/.82 var(--f-display); letter-spacing: -.07em; }
.p5-giant span { display: block; color: var(--grey); margin-top: 14px; font-size: 18px; max-width: 34ch; }
.stats { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-top: 1.5px solid var(--ink); }
.stats li { padding: 26px 20px 30px 0; border-bottom: 1px solid var(--line); min-width: 0; }
.stats strong { display: block; font: 600 clamp(34px, 3.2vw, 54px)/1 var(--f-display); letter-spacing: -.05em; overflow-wrap: anywhere; }
.stats span { display: block; color: var(--grey); font-size: 16px; margin-top: 10px; }
.bar { display: flex; height: 64px; border-radius: 14px; overflow: hidden; box-shadow: var(--shadow); margin-top: 28px; }
.bar div { display: grid; place-items: center; font: 400 16px/1 var(--f-mono); color: var(--ink); min-width: 0; overflow: hidden; border-right: 1px solid var(--wall); }
.barlegend { display: flex; flex-wrap: wrap; gap: 8px 24px; margin-top: 16px; font: 400 16px/1.3 var(--f-mono); color: var(--grey); }
.trials { width: 100%; border-collapse: collapse; border-top: 1.5px solid var(--ink); font-size: 17px; }
.trials td, .trials th { text-align: left; padding: 18px 16px 18px 0; border-bottom: 1px solid var(--line); vertical-align: top; }
.trials th { color: var(--grey); font-weight: 400; }
.trials td:first-child { font: 600 28px/1 var(--f-display); letter-spacing: -.04em; }
.vlist { display: flex; flex-wrap: wrap; gap: 8px 22px; list-style: none; padding: 0; margin: 32px 0 0; font: 400 16px/1.4 var(--f-mono); color: var(--grey); }
.limits { list-style: none; padding: 0; margin: 36px 0 0; counter-reset: l; }
.limits li { counter-increment: l; display: grid; grid-template-columns: 64px minmax(0, 1fr); padding: 20px 0; border-top: 1px solid var(--line); color: var(--grey); }
.limits li::before { content: "L" counter(l); font: 600 26px/1 var(--f-display); color: var(--ink); }
@media (max-width: 1000px) { .stats { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 640px) { .p5-giant { grid-template-columns: 1fr; } .trials thead { display: none; } .trials tr, .trials td { display: block; } .trials td { border: 0; padding: 4px 0; } .trials tr { padding: 14px 0; border-bottom: 1px solid var(--line); } .bar div { font-size: 0; } }
`;

const stat = id => `<li class="rv">${fig(id)}<span>${esc(figures[id].label)}</span></li>`;
const tone = { ok: 'ok', red: 'no-ok', amber: 'part' };

function bar() {
  const tot = sections.reduce((a, [, b]) => a + b, 0);
  const fill = { trace: '#ffffff', pidin: '#f2f1ee', rkv1: '#c62828', slog2: '#d3d1cb', manifest: '#bdbbb5', core: '#a8a6a0' };
  const cells = sections.map(([n, b]) => `<div style="flex:${b};background:${fill[n]}${n === 'rkv1' ? ';color:#fff' : ''}">${b / tot > .12 ? n : ''}</div>`).join('');
  return `<div class="bar rv" role="img" aria-label="RDA1 archive sections by size">${cells}</div>
  <div class="barlegend">${sections.map(([n, b]) => `<span>${n} ${b.toLocaleString('en-US')} B</span>`).join('')}</div>`;
}

export function content() {
  return `<section class="p5-hero">
  <h1 class="mega" style="font-size:clamp(60px,10vw,176px)">Same bytes.<span class="g">Same <span class="r">hash.</span></span></h1>
  <div class="p5-giant"><div>${fig('diff')}<span>${esc(figures.diff.label)} — 9 fixtures × 4 surfaces + what-if + missing file.</span></div>
  <div>${fig('replays')}<span>${esc(figures.replays.label)}.</span></div></div>
  <span class="cue" aria-hidden="true">Scroll down</span>
</section>
<section class="sec"><div class="wrap">
  <div class="split"><h2 class="h2 rv">Captured on target.<span class="g">Read on a PC.</span></h2>
  <p class="lead rv">A real QNX 8.0 guest under QEMU (SDP 8.0, 12–13/11/2026). <b>qcc compiles Déclic and the three bug generators</b> with -Werror.</p></div>
  <ul class="stats" style="margin-top:56px">${['diverged', 'archive', 'tplines', 'kev', 'wide', 'realev', 'realdec', 'realdiff', 'thstate', 'prio', 'ci', 'guard'].map(stat).join('')}</ul>
  <p class="no" style="margin-top:56px">RDA1 archive — six sections, built on the target · rkv1 = converted in the guest, byte-identical to Python</p>${bar()}
  <p class="body rv" style="margin-top:28px">Replay hash on the real trace, C == Python: ${fig('hashReal', 'b')}.</p>
</div></section>
<section class="sec"><div class="wrap">
  <div class="split"><h2 class="h2 rv">Frozen<span class="g">contract.</span></h2>
  <p class="lead rv">CONTRACT.md freezes the RKV1 container, events, verdicts, canonical outputs, the scheduler model and determinism. <b>Changing any of it is an explicit PR.</b></p></div>
  <ol class="rows" style="margin-top:56px">
    <li class="rv"><span class="n">C11</span><span class="t">Pure core</span><span class="d">core/ has no fopen, clock, socket, allocation or QNX header — buffers come from the caller.</span></li>
    <li class="rv"><span class="n">Py</span><span class="t">Independent twin</span><span class="d">host/ is stdlib-only Python. Freezing a scenario refuses to write if C and Python disagree.</span></li>
    <li class="rv"><span class="n">≠</span><span class="t">No wrong replay</span><span class="d">Unmodelled policies are reported (sporadic-not-modelled), never replayed wrong.</span></li>
  </ol>
  <ul class="vlist rv" aria-label="Frozen verdicts">${verdicts.map(v => `<li>REPLIQUE_${v}</li>`).join('')}</ul>
</div></section>
<section class="sec"><div class="wrap">
  <div class="split"><h2 class="h2 rv">What is<span class="g">not proven.</span></h2>
  <p class="lead rv">Shown exactly as the repo writes it. <b>The limits are part of the product.</b></p></div>
  <table class="trials rv" style="margin-top:56px"><thead><tr><th>Trial</th><th>Question</th><th>Status — PREUVE.md §3</th><th>Note</th></tr></thead>
  <tbody>${trials.map(t => `<tr><td>${t.id}</td><td>${esc(t.q)}</td><td><span class="flag ${tone[t.tone]}">${esc(t.st)}</span></td><td class="body">${esc(t.note)}</td></tr>`).join('')}</tbody></table>
  <ol class="limits rv">${limits.map(l => `<li><span>${esc(l)}</span></li>`).join('')}</ol>
</div></section>
<section class="sec"><div class="wrap">
  <p class="h2 rv">Next: the wait-for graph<span class="g">on message <span class="r">channels.</span></span></p>
  <p class="lead rv">The real trace exposes each send's <span class="mono">rcvid</span> channel and its owner pid — rebuilding the graph on channels instead of mutexes is <b>the natural next step</b> (docs/PREUVE.md). Codelab: 4 chapters — freeze, explain, replay, go further.</p>
</div></section>`;
}

export const srcIds = ['diff', 'replays', 'diverged', 'archive', 'tplines', 'kev', 'wide', 'realev', 'realdec', 'realdiff', 'thstate', 'prio', 'ci', 'guard', 'hashReal'];
export const srcExtra = [
  ['sections', 'trace=7484 rkv1=2336 pidin=5278 slog2=355 core=58 manifest=114', 'docs/PREUVE.md (r630 table) · docs/preuves/trace-qnx800.rkv1 = 2,336 B'],
  ['E1–E5', 'trial statuses', 'docs/PREUVE.md §3 · README.md (older table: all “non tranché”)'],
  ['verdicts', 'REPLIQUE_* codes', 'CONTRACT.md'],
];
export const note = 'Repo inconsistencies shown, not fixed: (1) README.md still lists E1–E5 as “non tranché” while docs/PREUVE.md marks E1 verified; (2) PREUVE.md gives the rkv1 section as 2,336 B in one table and 3,360 B in another — the file is 2,336 B; (3) README’s example CULPRIT says resource 16, the frozen scenario says 32.';
