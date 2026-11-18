// P4 — The product: real screens, verbatim, on white plates lit from the left.
// Choice = real screen (not architecture): Réplique's value is the moment a trace becomes a readable diagnosis.
import { fig } from '../ui.js';

export const title = 'Réplique — the product: the screen is the diagnosis';
export const css = `
.p4-hero { min-height: 100vh; min-height: 100svh; display: grid; grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); gap: clamp(28px, 5vw, 96px); align-items: end; padding: 120px var(--gut) clamp(40px, 7vh, 80px); position: relative; }
.p4-shot { background: #fff; border-radius: 24px; box-shadow: var(--shadow); padding: 18px; transform: perspective(1400px) rotateY(-9deg) rotateX(3deg); align-self: center; }
.p4-shot svg { display: block; width: 100%; height: auto; }
.cap { font: 400 16px/1.4 var(--f-mono); color: var(--grey); margin: 12px 4px 0; }
.p4-report h3 { font: 600 clamp(28px, 2.4vw, 40px)/1 var(--f-display); letter-spacing: -.04em; margin: 0 0 8px; }
.p4-report h4 { font: 400 16px/1 var(--f-mono); color: var(--red); margin: 26px 0 8px; }
.p4-report p, .p4-report li { color: var(--ink); margin: 4px 0; font-size: 17px; }
.p4-report ul { padding-left: 20px; margin: 0; }
.p4-report code { font: 400 16px/1.4 var(--f-mono); overflow-wrap: anywhere; }
.p4-two { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: clamp(24px, 4vw, 64px); align-items: start; margin-top: 56px; }
.p4-two .plate svg { display: block; width: 100%; height: auto; }
.whatif { margin-top: 48px; }
.whatif button { font: 600 16px/1 var(--f-mono); background: var(--ink); color: var(--wall); border: 0; border-radius: 999px; padding: 16px 22px; cursor: pointer; }
.whatif button[aria-pressed="true"] { background: var(--red); }
.whatif .term { margin-top: 22px; }
.whatif .fork { color: var(--red); }
.vga { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: clamp(24px, 4vw, 64px); align-items: center; margin-top: 56px; }
.vga img { width: 100%; height: auto; display: block; border-radius: 16px; box-shadow: var(--shadow); image-rendering: pixelated; }
@media (max-width: 1000px) { .p4-hero, .p4-two, .vga { grid-template-columns: 1fr; } .p4-shot { transform: none; } }
`;

const report = () => `<article class="plate p4-report rv" aria-label="Real one-page report, rendered">
  <p class="cap" style="margin:0 0 18px">markdown_report.render() — real output, French as shipped</p>
  <h3>Rapport Réplique — interblocage</h3>
  <p class="body" style="font-size:16px">SHA-256 <code>e7850a8ba23d72a2…1261b59107</code> · 20 événements · SYNTHETIC</p>
  <h4>Chaîne de blocage</h4>
  <ul><li>tid 101 (prio 50) attend la ressource 32 (MUTEX), tenue par tid 102 ;</li><li>tid 102 (prio 60) attend la ressource 16 (MUTEX), tenue par tid 101.</li></ul>
  <h4>Coupable</h4><p><b>tid 102</b> — <code>holds-resource-32-at-prio-60</code></p>
  <h4>Rejeu</h4><p>FNV-1a 64 : ${fig('hashDl', 'code')} — 3 décisions · conforme</p>
  <h4>Recommandation</h4><p>Casser le cycle ; imposer un ordre global d'acquisition des verrous.</p>
</article>`;

export function content({ assets }) {
  return `<section class="p4-hero">
  <div><h1 class="mega" style="font-size:clamp(56px,8.4vw,150px)">The screen<span class="g"><span class="r">is</span> the diagnosis.</span></h1>
  <p class="lead">Not a mock-up: the self-contained SVG that <span class="mono">replique.cli view</span> writes for the deadlock fixture — <b>no font, no script, no network.</b></p></div>
  <figure class="p4-shot" style="margin:0" data-real-svg>${assets.deadlock}<figcaption class="cap">host/replique/view.py → fixtures/deadlock.rkv1</figcaption></figure>
  <span class="cue" aria-hidden="true">Scroll down</span>
</section>
<section class="sec"><div class="wrap">
  <div class="split"><h2 class="h2 rv">One page.<span class="g">Not a dashboard.</span></h2>
  <p class="lead rv">We show the real product screen rather than an architecture: the value is the moment a raw trace becomes <b>a cycle, a culprit and a replay hash</b> a reviewer can read.</p></div>
  <div class="p4-two">${report()}
    <figure class="plate rv" style="margin:0">${assets.prio}<figcaption class="cap">view.py → fixtures/prio-inversion.rkv1, shown as-is: the graph draws the three threads but no inversion edge. The inversion lives in the verdict line: vd|code=PRIO_INVERSION chain=201,203,202.</figcaption></figure>
  </div>
</div></section>
<section class="sec"><div class="wrap">
  <div class="split"><h2 class="h2 rv">Same film.<span class="g">One priority changed.</span></h2>
  <p class="lead rv">Real <span class="mono">dec|</span> lines for <span class="mono">fixtures/race.rkv1</span>. Pull the what-if and the second decision <b>forks</b> — so the hash changes.</p></div>
  <div class="whatif plate rv">
    <button type="button" data-whatif-btn aria-pressed="false">Pull the what-if: tid 402 → prio 20</button>
    <pre class="term" data-run="base" aria-live="polite">dec|ts=1100|tid=401|reason=INITIAL
dec|ts=1500|tid=402|reason=TIMER
dec|ts=1700|tid=401|reason=TERMINATE
hash=${fig('hashRace', 'span')}  <span class="m">baseline</span></pre>
    <pre class="term" data-run="whatif" hidden>dec|ts=1100|tid=401|reason=INITIAL
<span class="fork">dec|ts=1400|tid=402|reason=WHATIF   ← forked</span>
dec|ts=1700|tid=401|reason=TERMINATE
<span class="fork">hash=${fig('hashWhat', 'span')}</span>  <span class="m">what-if 402=20</span></pre>
  </div>
</div></section>
<section class="sec"><div class="wrap">
  <div class="split"><h2 class="h2 rv">Real QNX 8.0<span class="g">guest, live.</span></h2>
  <p class="lead rv">From the repo: the guest boots, <span class="mono">bug-deadlock</span> locks up, <span class="mono">slay</span> ends it, and <b>Déclic freezes the trace</b> and writes the archive.</p></div>
  <div class="vga">
    <img class="rv" src="${assets.vga}" width="720" height="400" alt="QNX 8.0 guest console: threads 101 and 102 of bug-deadlock block on mutexes 32 and 16; Déclic observes termination, freezes the trace and writes a 13,721-byte archive with sections trace, pidin, slog2, core, manifest.">
    <p class="body rv">This capture shows the earlier <b style="color:var(--ink)">five-section</b> archive (13,721 B). The current six-section archive, with the <span class="mono">rkv1</span> section converted on the target, weighs ${fig('archive', 'b')}.<br><span class="mono">docs/screenshots/invite-qnx800.png</span></p>
  </div>
</div></section>`;
}

export const srcIds = ['hashDl', 'hashRace', 'hashWhat', 'archive'];
export const srcExtra = [
  ['SVG', 'verbatim output of replique.cli view — deadlock and prio-inversion fixtures', 'host/replique/view.py · fixtures/*.rkv1'],
  ['report', 'markdown_report.render() on the deadlock fixture, abridged (SHA shortened)', 'host/replique/markdown_report.py · docs/REPORT-TEMPLATE.md'],
  ['dec| lines', 'replique.cli replay fixtures/race.rkv1 [--whatif 402=20], run 2026-11-16 @ df35def', 'host/replique/cli.py · docs/PREUVE.md (X4)'],
  ['13,721 B', 'five-section archive in the guest screenshot', 'docs/PREUVE.md · docs/screenshots/invite-qnx800.png'],
];
