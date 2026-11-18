// P3 — How it works, end to end. No 3D here (it would not help): the type carries the ten steps.
import { steps } from '../data.js';
import { esc, fig } from '../ui.js';

export const title = 'Réplique — how it works: ten steps from target to verdict';
export const css = `
.p3-hero { min-height: 100vh; min-height: 100svh; display: grid; align-content: end; padding: 120px var(--gut) clamp(40px, 7vh, 80px); position: relative; }
.p3-line { display: grid; grid-template-columns: repeat(10, minmax(0, 1fr)); margin-top: clamp(40px, 6vh, 72px); border-top: 1.5px solid var(--ink); }
.p3-line li { list-style: none; padding: 16px 10px 0 0; border-right: 1px solid var(--line); min-height: 120px; }
.p3-line li:last-child { border-right: 0; }
.p3-line b { display: block; font: 600 clamp(28px, 2.6vw, 44px)/1 var(--f-display); letter-spacing: -.05em; }
.p3-line span { display: block; font: 600 16px/1.2 var(--f-display); margin-top: 10px; }
.p3-line li[data-act="Explain"] b { color: var(--red); }
.p3-acts { display: grid; grid-template-columns: 5fr 3fr 2fr; margin-top: 10px; font: 400 16px/1 var(--f-mono); color: var(--grey); }
.p3-acts span { padding-top: 10px; }
.p3-group { font: 400 16px/1 var(--f-mono); color: var(--grey); margin: 56px 0 14px; }
.ribbon { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px; margin-top: 48px; }
.ribbon h3 { font: 600 clamp(36px, 3.4vw, 56px)/1 var(--f-display); letter-spacing: -.05em; margin: 0 0 14px; }
@media (max-width: 1000px) { .p3-line { grid-template-columns: repeat(5, minmax(0, 1fr)); } .p3-line li { min-height: 96px; border-bottom: 1px solid var(--line); } .p3-acts { display: none; } .ribbon { grid-template-columns: 1fr; } }
@media (max-width: 640px) { .p3-line { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
`;

const row = s => `<li class="rv" data-row="${s.n}"><span class="n">${s.n}</span><span class="t">${esc(s.name)}</span><span class="d">${esc(s.say)}<br><code>${s.files.map(esc).join(' · ')}</code></span></li>`;
const group = act => steps.filter(s => s.act === act).map(row).join('');

export function content() {
  return `<section class="p3-hero">
  <h1 class="mega" style="font-size:clamp(60px,10vw,176px)">Target<span class="g">to verdict<span class="r">.</span></span></h1>
  <ol class="p3-line" aria-label="The ten pipeline steps" style="padding:0">${steps.map(s => `<li data-step="${s.n}" data-act="${s.act}"><b>${s.n}</b><span>${esc(s.name)}</span></li>`).join('')}</ol>
  <div class="p3-acts" aria-hidden="true"><span>Freeze — QNX 8.0 target</span><span>Explain — host</span><span>Replay — host</span></div>
  <span class="cue" aria-hidden="true">Scroll down</span>
</section>
<section class="sec"><div class="wrap">
  <div class="split"><h2 class="h2 rv">File<span class="g">by file.</span></h2>
  <p class="lead rv">Every name below is a real file or command in the repo. The C11 core has <b>no file I/O, no clock, no socket, no allocation</b>; the Python twin is stdlib-only and must produce the same bytes.</p></div>
  <p class="p3-group">Freeze — on the QNX 8.0 target</p><ol class="rows">${group('Freeze')}</ol>
  <p class="p3-group">Explain — on the host</p><ol class="rows">${group('Explain')}</ol>
  <p class="p3-group">Replay — on the host</p><ol class="rows">${group('Replay')}</ol>
  <p class="body rv" style="margin-top:40px">Target: QNX 8.0 guest under QEMU, built with <span class="mono">qcc</span> (SDP 8.0). Host: any PC with gcc C11, Python 3.10 and make — <span class="mono">make test</span> needs no QNX, no target, no licence.</p>
</div></section>
<section class="sec"><div class="wrap">
  <div class="split"><h2 class="h2 rv">ev — vd<span class="g">— hash.</span></h2>
  <p class="lead rv">Real output of <span class="mono">replique.cli</span> on <span class="mono">fixtures/deadlock.rkv1</span>. C drivers and Python agree byte for byte: ${fig('diff', 'b')}.</p></div>
  <div class="ribbon">
    <div class="plate rv"><h3>ev|</h3><pre class="term">ev|ts=1000|pid=10|tid=102|class=THREAD_CREATE|sub=0|a=60|b=0|c=0
ev|ts=1200|pid=10|tid=102|class=MUTEX_LOCK|sub=0|a=32|b=102|c=0
ev|ts=1300|pid=10|tid=102|class=THREAD_STATE|sub=3|a=4|b=7|c=0</pre></div>
    <div class="plate rv"><h3>vd|</h3><pre class="term"><span class="r">vd|code=DEADLOCK_FOUND</span>|sev=error|ts=1700|pid=0|tid=0|a=0|b=16|c=0|hash=0|chain=101,102|detail=cycle-detected
<span class="r">vd|code=CULPRIT</span>|sev=error|ts=1700|pid=0|tid=102|a=0|b=32|c=0|hash=0|chain=101,102|detail=holds-resource-32-at-prio-60</pre></div>
    <div class="plate rv"><h3>hash</h3><pre class="term">vd|code=REPLAY_DETERMINISTIC|sev=info|ts=0|pid=0|tid=0|a=0|b=0|c=0|hash=17104745365914896697|chain=|detail=decisions-3
<span class="m">$ replique.cli replay deadlock.rkv1 --hash</span>
hash=${fig('hashDl', 'span')}</pre></div>
  </div>
</div></section>`;
}

export const srcIds = ['diff', 'hashDl'];
export const srcExtra = [
  ['10 steps', 'files under target/hook, target/declic, host/replique, core/src', 'README.md · docs/DESIGN.md · repo tree @ df35def'],
  ['tracelogger flags', '-d1 -E -r -f <file> -S 16M -s 0', 'docs/PREUVE.md (r630 table)'],
  ['/proc, 50 ms', 'HAM gone in QNX 8 — termination via /proc polling', 'docs/PREUVE.md'],
  ['ev| / vd| lines', 'CLI run on fixtures/deadlock.rkv1, 3 of 20 ev| lines shown verbatim', 'scenarios/deadlock.json · host/replique/cli.py'],
];
