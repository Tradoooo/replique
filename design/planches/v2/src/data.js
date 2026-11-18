// Réplique V1 — every value shown on a planche lives here, with its repo source.
// Repo read: https://github.com/Tradoooo/replique @ df35def (2026-11-13), read-only clone.
// `needle` = literal string verify.mjs must find in the source file (proof check).
export const meta = {
  brand: 'Réplique',
  repo: 'github.com/Tradoooo/replique',
  commit: 'df35def',
  badge: 'QNX Global Hackathon 2026 · Developer Tooling & Host Tools',
  // Working tagline: synthesis of README.md "figé, expliqué et rejouable". NOT verbatim from the repo.
  tagline: ['Freeze the crash.', 'Explain the wait.', 'Replay the schedule.'],
  promise: 'A concurrency bug that happens once in a thousand runs on target becomes an artefact you can freeze, explain and replay at will on a PC.',
  license: 'MIT',
};

export const figures = {
  diff:      { v: '40 · 0', label: 'C↔Python comparisons · divergences', file: 'docs/PREUVE.md', needle: '40 comparaisons, 0 écart' },
  replays:   { v: '5 → 5', label: 'replays → identical hashes, C == Python, 6 fixtures', file: 'docs/PREUVE.md', needle: '5 rejeux → 5 hachages identiques' },
  diverged:  { v: '0', label: 'REPLAY_DIVERGED verdicts on the fixtures', file: 'docs/PREUVE.md', needle: '`REPLAY_DIVERGED` sur les fixtures' },
  archive:   { v: '16,137 B', label: 'RDA1 archive frozen on the QNX 8.0 target, 6 sections', file: 'docs/PREUVE.md', needle: 'archive 16 137 octets' },
  tplines:   { v: '324', label: 'kernel-event lines decoded by the official traceprinter', file: 'docs/PREUVE.md', needle: '324 lignes' },
  kev:       { v: '7,484 B', label: 'real QNX 8.0.0 .kev trace (fast mode)', file: 'docs/PREUVE.md', needle: '7 484 octets' },
  wide:      { v: '823,365 B', label: 'wide trace that contains the faulty process', file: 'docs/PREUVE.md', needle: '823 365 octets' },
  realev:    { v: '13,294', label: 'RKV1 events read by the C core on the real trace', file: 'docs/PREUVE.md', needle: '13 294 événements' },
  realdec:   { v: '4,418', label: 'replayed scheduling decisions on the real trace', file: 'docs/PREUVE.md', needle: '4 418 décisions' },
  realdiff:  { v: '3 · 0', label: 'C↔Python comparisons on the real trace · divergences', file: 'docs/PREUVE.md', needle: '3 comparaisons, 0 écart' },
  thstate:   { v: '10,989', label: 'thread-state events field-identical to traceprinter', file: 'docs/PREUVE.md', needle: '10 989' },
  prio:      { v: '68', label: 'priority changes seen on the real trace (inheritance visible)', file: 'docs/PREUVE.md', needle: '68 changements de priorité' },
  ci:        { v: '52 s', label: 'real ci run on the self-hosted runner', file: 'docs/PREUVE.md', needle: 'run `ci` réel : 52 s' },
  cibudget:  { v: '40 s', label: "ci-budget run", file: 'docs/PREUVE.md', needle: '`ci-budget` **vert** (40 s)' },
  guard:     { v: '49 · 113', label: 'files under 500 lines · C functions under 50 lines', file: 'docs/PREUVE.md', needle: '49 fichiers, tous < 500 lignes, 113 fonctions C' },
  fixtures:  { v: '9', label: 'frozen .rkv1 reference traces', file: 'docs/PREUVE.md', needle: '9 traces `.rkv1`' },
  codelab:   { v: '4', label: 'codelab chapters (freeze · explain · replay · further)', file: 'README.md', needle: '4 chapitres' },
  hashDl:    { v: '17104745365914896697', label: 'FNV-1a 64 replay hash, deadlock fixture', file: 'scenarios/deadlock.json', needle: '17104745365914896697' },
  hashRace:  { v: '6824083847162224150', label: 'replay hash, race fixture (baseline)', file: 'scenarios/race.json', needle: '6824083847162224150' },
  hashWhat:  { v: '1804713759432153825', label: 'replay hash, race fixture with --whatif 402=20 (CLI run 2026-11-16 @ df35def)', file: 'docs/PREUVE.md', needle: '--whatif 402=20' },
  hashReal:  { v: '3463212668984122407', label: 'replay hash on the real QNX trace, C == Python', file: 'docs/preuves/analyse-trace-reelle.vd', needle: '3463212668984122407' },
};

// Sections of the RDA1 archive built ON the target (docs/PREUVE.md, r630 table).
export const sections = [
  ['trace', 7484], ['pidin', 5278], ['rkv1', 2336], ['slog2', 355], ['manifest', 114], ['core', 58],
];

// P3 — the real pipeline, 10 named steps (files exist in the repo @ df35def).
export const steps = [
  { n: '01', act: 'Freeze', name: 'Capture', where: 'QNX target', files: ['tracelogger -d1 -E -r -S 16M'], say: 'Kernel trace runs into a circular buffer.' },
  { n: '02', act: 'Freeze', name: 'Trigger', where: 'QNX target', files: ['target/hook/ham_hook.c', 'target/hook/dumper_hook.c', 'declic_watch.c'], say: 'Process termination detected (/proc scan, 50 ms).' },
  { n: '03', act: 'Freeze', name: 'Déclic', where: 'QNX target', files: ['target/declic/declic_qnx.c', 'declic_portable.c', 'sha256_portable.c'], say: 'Stops the trace, fingerprints it, writes the manifest.' },
  { n: '04', act: 'Freeze', name: 'Convert', where: 'QNX target', files: ['target/declic/kev_rkv1.c'], say: '.kev → RKV1 inside the guest, byte-identical to Python.' },
  { n: '05', act: 'Freeze', name: 'Archive RDA1', where: 'QNX target', files: ['trace + pidin + slog2 + core + manifest + rkv1'], say: 'Six correlated sections, one file.' },
  { n: '06', act: 'Explain', name: 'Read', where: 'Host', files: ['host/replique/kev_reader.py', 'kev2rkv1.py', 'tests/differential_traceprinter.sh'], say: 'Decodes and checks against the official traceprinter.' },
  { n: '07', act: 'Explain', name: 'Events', where: 'Host · C11 core', files: ['core/src/kev.c', 'core/src/event.c'], say: 'Normalised REPLIQUE_EV_* events.' },
  { n: '08', act: 'Explain', name: 'Autopsy', where: 'Host · C11 core', files: ['deadlock.c', 'culprit.c', 'inversion.c'], say: 'Wait-for graph, blocking chain, frozen culprit rule.' },
  { n: '09', act: 'Replay', name: 'Replay', where: 'Host · C11 core', files: ['core/src/sched.c', 'core/src/replay.c'], say: 'Deterministic scheduler model, FNV-1a 64 hash, --whatif TID=PRIO.' },
  { n: '10', act: 'Replay', name: 'Verdict & render', where: 'Host', files: ['verdict.c', 'report.c', 'markdown_report.py', 'view.py'], say: 'Canonical lines, one-page report, self-contained SVG.' },
];

// P5 — trials, statuses exactly as written in docs/PREUVE.md §3 table.
export const trials = [
  { id: 'E1', q: '.kev format documented', st: 'Verified', tone: 'ok', note: 'sys/trace.h + traceprinter oracle' },
  { id: 'E2', q: 'tracelogger freezes cleanly, pre-crash history kept', st: 'Not verified', tone: 'red', note: 'table says so; r630 notes report a freeze — repo inconsistent' },
  { id: 'E3', q: 'process termination observable in real time', st: 'Not verified', tone: 'red', note: 'HAM gone in QNX 8 → /proc polling' },
  { id: 'E4', q: 'scheduler model faithful to QNX', st: 'Partial', tone: 'amber', note: 'P2 holds on fixtures; model is a subset' },
  { id: 'E5', q: 'dumper core holds thread states', st: 'Not verified', tone: 'red', note: 'CORRELATION_OK never emitted yet' },
];

export const limits = [
  'No wait-for graph on the REAL trace: QNX 8.0 does not expose the sync-object id (the mutex goes through a MsgSend whose body is not traced). No DEADLOCK_FOUND is claimed there.',
  'SCHED_SPORADIC and adaptive partitions are not modelled — replay reports sporadic-not-modelled, never a wrong replay.',
  'The demo guest records in "fast" mode: the faulty process is only captured by the separate "wide" trace.',
  'R1–R5 are absence claims about public QNX docs, to re-check page by page (docs/GAP.md).',
  'No GitHub Pages site for the repo; no demo-video URL found in the repo (unknown).',
];

export const verdicts = ['OK', 'PARSE_ERROR', 'TRACE_INCOMPLETE', 'DEADLOCK_FOUND', 'CULPRIT', 'PRIO_INVERSION', 'REPLAY_DETERMINISTIC', 'REPLAY_DIVERGED', 'WHATIF', 'CORRELATION_OK'];

export const pages = [
  { slug: '01-comprendre', short: 'Overview' },
  { slug: '02-probleme', short: 'Problem' },
  { slug: '03-pipeline', short: 'Pipeline' },
  { slug: '04-produit', short: 'Product' },
  { slug: '05-preuves', short: 'Proof' },
];
