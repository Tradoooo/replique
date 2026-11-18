# Réplique V2 — plan des 5 planches

Direction **A · Relief blanc**, recommandée parmi : A Relief blanc (Flow, Dominic Burt, LogoPoint, Teko) · B Horizon noir (Teko, Noon, D.FY) · C Salle blanche (Gapsy).
Langue : anglais. Dépôt lu : `Tradoooo/replique` @ `df35def`, en lecture seule. V1 archivée, intacte.

| # | Fichier | Fait comprendre | Visuel dominant | Données |
|---|---|---|---|---|
| P1 | `dist/01-comprendre.html` | Réplique = machine à remonter le temps qui fige, explique et rejoue | **WebGL `links`** : deux maillons de plâtre enlacés, l'un rouge (101 attend 102 qui attend 101) ; « Réplique / time machine for QNX 8.0. » ; tiret long Freeze —— Explain —— Replay | `40 · 0` (PREUVE §1), cycle (scenarios/deadlock.json) |
| P2 | `dist/02-probleme.html` | la preuve est écrasée avant qu'on la lise | **WebGL `ring`** : tampon circulaire de 24 segments, la tête d'écriture tourne, le segment rouge (le crash) blanchit quand elle repasse | 1/1000 (README), rôles §1.1, coût = **unknown** |
| P3 | `dist/03-pipeline.html` | les 10 étapes réelles, de la cible à l'hôte | **pas de 3D** (elle n'aiderait pas) : ligne typographique des 10 étapes (les 3 d'Explain en rouge), puis les fichiers étape par étape, puis `ev│ vd│ hash` sur plaques | sortie CLI réelle, fixture deadlock |
| P4 | `dist/04-produit.html` | **choix : l'écran réel**, parce que la valeur est le diagnostic lisible | SVG `view.py` verbatim sur une plaque inclinée, rapport Markdown, bascule what-if (bouton clavier), capture de l'invité QNX | hachages réels, archive 16 137 o |
| P5 | `dist/05-preuves.html` | ce qui est prouvé, garanti, et pas encore | `40 · 0` et `5 → 5` géants, grille de 12 chiffres, barre RDA1 (rkv1 en rouge), E1–E5 avec glyphes ✓ ✕ ◐, L1–L5, suite | 21 chiffres tracés et vérifiés |

Système : `src/theme.css` · `src/base.css` · `src/ui.js` · `src/relief.js` (raymarching WebGL maison, environ 100 lignes, 0 dépendance) · `src/engine.js` · `src/scenes/p01–p05.js`.
