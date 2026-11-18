# design/ — product-site planches (design only, no code change)

Five self-contained HTML pages presenting Réplique for the QNX Global Hackathon 2026 (Developer Tooling & Host Tools).
Direction V2 « Relief blanc ». Round log and changelog: [DESIGN.md](DESIGN.md).

- Open `planches/v2/dist/01-comprendre.html` … `05-preuves.html` directly (double-click). Zero network request; WebGL relief on pages 1–2, frozen when `prefers-reduced-motion` is set.
- Review page: `planches/v2/index.html` · contact sheet: `planches/v2/captures/planche-contact.jpg`.
- Every figure shown lives in `planches/v2/src/data.js` with its source file and a literal needle; `verify.mjs` checks each needle against this repo.

Rebuild and verify (Node ≥ 20, Chrome, `playwright-core`):

```sh
cd design/planches/v2
node build.mjs
PLAYWRIGHT_CORE=/path/to/node_modules/playwright-core CHROME_PATH=/path/to/chrome node verify.mjs
```

Nothing under `core/`, `host/`, `target/`, `tests/` or `.github/` is touched. The size/purity guards only scan code extensions (`.c .h .py .sh .yml`), so this folder does not affect CI.
