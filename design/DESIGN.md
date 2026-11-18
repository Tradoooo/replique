# DESIGN — Réplique (QNX Global Hackathon 2026 · Developer Tooling & Host Tools)

## V1 — 2026-11-16 (Claude, Opus 5.5)

**Intention** : un site produit en 5 planches qui rend lisibles les 3 gestes de Réplique (figer, expliquer, rejouer) avant toute lecture.

**Options proposées** : A *Brass Chronograph* (graphite + laiton, accent unique rouge cycle) · B *Forensic Paper* (papier clair, éditorial) · C *Oscilloscope* (noir phosphore). **Choix : A**, parce que la matière porte la métaphore et que le rouge vient du produit (`view.py C_CYCLE_STROKE`). C est rejetée (trop proche d'une imagerie « jeu/hacker »).

**Références** : Flow Computing, Dominic Burt, Teko, Noon (fixes) ; Awwwards 9 listings / 17 sites, cf. `planches/v1/REFS.md`.

**Planches** : `planches/v1/dist/01-comprendre … 05-preuves.html` (autonomes, 0 requête réseau, SVG/CSS 3D, pas de three.js).

**Vérification** : `build.mjs` + `verify.mjs` exécutés. 5/5 OK, 21/21 chiffres retrouvés dans le dépôt (cf. STATUS.md).

**Relectures des captures** :
- R1 : P1 accent « É » contre le kicker, nom cassé « RÉPLI/QUE », point rouge orphelin, libellés du rail sur le chariot et le cachet, halo à bord dur, pignon flottant → corrigés. P3 chemins coupés en milieu de mot → noms de fichiers seuls. P4 loupe = disque blanc → retirée. P5 backticks littéraux → retirés. Bandes vides en bas de P3/P5 → ligne hôte/cible + repère de scroll.
- R2 : mobile, kicker collé au badge sur 2 lignes → padding 136 px ; micro-textes SVG illisibles à 390 → masqués sur mobile ; « CULPRIT » débordait du cachet → cachet agrandi. **P4 : la légende du SVG prio-inversion promettait une arête d'inversion orange que `view.py` ne dessine pas** → légende rendue factuelle.

**Défauts ouverts** :
1. Polices : Space Grotesk / Inter / JetBrains Mono non vendorisées. Repli sur Bahnschrift / Segoe UI / Cascadia, donc rendu Windows-dépendant.
2. Produit (à signaler au code, pas modifié) : le SVG `view.py` affiche « CUPABLE » (coquille pour COUPABLE), il n'a pas d'arête d'inversion, et ses libellés sont en français alors que la soumission est en EN.
3. Le dépôt se contredit : README (E1–E5 « non tranché ») vs PREUVE (E1 vérifié) ; section rkv1 2 336 o vs 3 360 o ; README coupable « ressource 16 » vs scénario 32. Affiché tel quel en pied de P5.
4. Slogan EN = formulation de travail, non présente mot pour mot dans le dépôt.
5. 5 sites Awwwards n'ont été capturés que sur leur loader.

**Changelog** : création (aucune version antérieure).

## V2 — 2026-11-18 (Claude, Opus 5.5)

**Retour Gaia sur V1** : « aucune » (rien à garder) → repartir de zéro en s'appuyant sur `REFERENCES-DESIGN.md`.

**Intention** : un site clair et silencieux où un seul objet en relief porte le concept, sans menu.

**Options** : A *Relief blanc* (Flow Computing, Dominic Burt, LogoPoint, Teko) · B *Horizon noir* (Teko, Noon, D.FY) · C *Salle blanche* (Gapsy). **Choix : A**, à l'opposé de V1 (clair au lieu de sombre, plâtre au lieu de laiton, un accent au lieu de deux).

**Choix visuels** : mur `#ECEBE7` ; titres linéaires géants à `-0.065em`, noirs puis gris ; un seul mot rouge `#C62828` par titre ; vraie 3D WebGL (raymarching maison, 0 dépendance, 0 réseau) sur P1 (maillons enlacés = interblocage) et P2 (tampon circulaire qui écrase le crash), lumière à gauche et ombre à droite ; pas de 3D en P3–P5 ; onglet noir vertical = seule action ; navigation en pied de page.

**Références** : 11 fiches ouvertes le 2026-11-18 (`planches/v2/REFS.md`, `captures/refs/`).

**Vérification** : `build.mjs` + `verify.mjs` → 5/5 OK, 21/21 chiffres trouvés dans le dépôt, WebGL rendu et figé en reduced-motion, AA, tout texte ≥ 16 px.

**Relectures** :
- R1 : P1 objet trop gros sous le titre, bords crénelés, « Scroll down » contre le titre, couture canvas/page, anneau rouge coupé → caméra recadrée (droite en paysage, bloc au-dessus du texte en mobile), résolution 1280, mur rendu à la couleur exacte de la page, repère de scroll en bas au centre. Liens d'index à 4,1:1 → gris AA.
- R2 : P2 fentes noires et segment rouge coupé en deux (fente taillée au centre du segment au lieu de sa frontière) → joint corrigé, occlusion bornée, anneau réduit et décalé. Mobile : la pastille fixe masquait le texte → retirée sur mobile (navigation en pied). P1 : la légende du chiffre clé tombait sur l'ombre → plaque mur translucide.

**Défauts ouverts** :
1. Les sites live des 11 refs n'ont pas été rouverts (le bouton « visiter » n'est pas un lien) : lecture faite sur les fiches.
2. Le rendu WebGL dépend du GPU : vérifié en SwiftShader (headless), pas sur une vraie carte graphique ni sur un mobile physique.
3. Polices système (Segoe UI Variable) : rendu Windows-dépendant ; aucune police embarquée.
4. Inchangés depuis V1 (produit / dépôt) : « CUPABLE », pas d'arête d'inversion dans `view.py`, libellés FR ; contradictions README/PREUVE ; slogan de travail.

**Changelog vs V1** : tout est refait. Fond graphite → mur clair ; laiton → plâtre blanc ; machine SVG 2,5D → vraie 3D WebGL ; accent rouge + orange → rouge seul ; titres condensés Bahnschrift → linéale géante serrée ; index des 5 pages en haut → onglet unique + index en pied ; cartes sombres → lignes et plaques claires. Conservés : les données tracées (`data.js`), les sorties réelles de l'outil, la méthode de vérification.
