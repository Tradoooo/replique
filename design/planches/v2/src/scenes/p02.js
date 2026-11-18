// P2 — The problem, embodied. Relief: the circular trace buffer; the write head sweeps; the red crash segment
// turns white when the head runs over it — the evidence is overwritten.
import { hero, fig } from '../ui.js';

export const title = 'Réplique — the problem: the evidence is overwritten';
export const css = `
.p2-ba { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(24px, 4vw, 72px); margin-top: clamp(56px, 7vw, 110px); }
.p2-ba h3 { font: 600 clamp(36px, 3.6vw, 60px)/.9 var(--f-display); letter-spacing: -.055em; margin: 0 0 26px; }
.p2-ba h3 small { display: block; font: 400 16px/1 var(--f-mono); letter-spacing: 0; color: var(--grey); margin-bottom: 16px; }
.p2-ba ol { list-style: none; margin: 0; padding: 0; counter-reset: s; }
.p2-ba li { counter-increment: s; display: grid; grid-template-columns: 48px minmax(0, 1fr); padding: 18px 0; border-top: 1px solid var(--line); color: var(--grey); }
.p2-ba li::before { content: "0" counter(s); font: 400 16px/1.6 var(--f-mono); color: var(--ink); }
.p2-ba li b { color: var(--ink); font-weight: 600; }
.p2-ba .after { border-left: 1.5px solid var(--ink); padding-left: clamp(20px, 3vw, 48px); }
.p2-people { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(24px, 4vw, 72px); }
.p2-people q { display: block; font: 600 clamp(30px, 3vw, 50px)/1 var(--f-display); letter-spacing: -.05em; quotes: "“" "”"; margin: 0 0 20px; }
.p2-pain { font: 600 clamp(56px, 9vw, 168px)/.86 var(--f-display); letter-spacing: -.07em; margin: 0; }
.p2-pain .g { color: var(--grey-l); display: block; }
.p2-pain .r { color: var(--red); }
.h2 s { text-decoration-color: var(--red); text-decoration-thickness: .06em; }
@media (max-width: 900px) { .p2-ba, .p2-people { grid-template-columns: 1fr; } .p2-ba .after { border-left: 0; padding-left: 0; border-top: 1.5px solid var(--ink); padding-top: 28px; } }
`;

const fallback = `<svg viewBox="0 0 300 300" width="40%" aria-hidden="true"><circle cx="150" cy="150" r="110" fill="none" stroke="#f7f6f3" stroke-width="40"/><path d="M150 40a110 110 0 0 1 60 18" fill="none" stroke="#c62828" stroke-width="40"/></svg>`;

export function content() {
  return `${hero({
    scene: 'ring', label: 'A circular trace buffer in white relief. A write head sweeps around it; the red segment where the crash was recorded is overwritten when the head passes.', fallback,
    title: `<h1 class="mega" style="font-size:clamp(60px,9.4vw,168px)">Once in a<span class="g">thousand <span class="r">runs.</span></span></h1>`,
    dash: `<p class="lead" style="margin-top:22px">The kernel trace that saw the crash lives in a circular buffer — <b>and it keeps writing.</b></p>`,
    key: `<div class="key"><strong>1 / 1000</strong><span>“qu’une fois sur mille sur la cible” — README.md</span></div>`,
  })}
<section class="sec"><div class="wrap">
  <p class="no rv">02 — Who loses the evidence</p>
  <div class="p2-people">
    <article class="rv"><q>It never crashes when I watch.</q><p class="body"><b style="color:var(--ink)">QNX developer.</b> Re-reads multi-MB raw <span class="mono">traceprinter</span> output by hand, with no causality, hoping the deadlock comes back.</p></article>
    <article class="rv"><q>Prove the root cause.</q><p class="body"><b style="color:var(--ink)">Certified integrator.</b> Must turn the failure into an ISO 26262 / IEC 62304 / EN 50128 root-cause argument — today with prose and screenshots.</p></article>
  </div>
  <p class="body rv" style="margin-top:40px">Roles as written in the specification (§1.1) — the repo names no individual. Hours or cost lost per incident: <b style="color:var(--red)">unknown</b> (not measured in the repo).</p>
</div></section>
<section class="sec"><div class="wrap">
  <h2 class="h2 rv">Replay it<span class="g"><s>by luck</s> at will.</span></h2>
  <div class="p2-ba">
    <div class="rv"><h3><small>Before — by hand</small>Hope it happens again.</h3><ol>
      <li><span>The circular buffer is <b>overwritten</b> before anyone looks.</span></li>
      <li><span>Frozen <span class="mono">pidin</span> plus intuition — <b>no wait-for graph</b>.</span></li>
      <li><span>Wait for the one-in-a-thousand run. <b>Again.</b></span></li></ol></div>
    <div class="after rv"><h3><small>After — Réplique</small>Keep it forever.</h3><ol>
      <li><span><b>Déclic</b> freezes the trace at termination: one ${fig('archive', 'b')} RDA1 archive, on the real QNX 8.0 target.</span></li>
      <li><span><b>Autopsie</b> draws the cycle and names the culprit.</span></li>
      <li><span><b>Réplique</b> replays it on a PC — ${fig('replays', 'b')} identical hashes.</span></li></ol></div>
  </div>
</div></section>
<section class="sec"><div class="wrap">
  <p class="p2-pain rv">The bug is not rare.<span class="g">The <span class="r">evidence</span> is.</span></p>
  <p class="body rv" style="margin-top:36px">Linux has post-mortem and deterministic-replay tools (perf, rr). The specification states QNX has no equivalent — an absence claim the repo itself asks to re-check page by page (docs/GAP.md).</p>
</div></section>`;
}

export const srcIds = ['archive', 'replays'];
export const srcExtra = [
  ['1 / 1000', '“qu’une fois sur mille sur la cible”', 'README.md (La promesse)'],
  ['roles', 'QNX developer, certified integrator (+ safety engineer, CI team, trainer)', 'REPLIQUE-cahier-des-charges.md §1.1'],
  ['perf, rr', 'Linux comparison — absence claim to re-check', 'REPLIQUE-cahier-des-charges.md §1.2 · docs/GAP.md'],
  ['unknown', 'cost / hours per incident', 'not in repo'],
];
