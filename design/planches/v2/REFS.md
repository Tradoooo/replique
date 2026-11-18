# Réplique V2 — références et principes

Date : 2026-11-18. Retour de Gaia sur V1 : **« aucune » (rien à garder) — repartir de zéro et s'appuyer sur les refs design.**
Direction retenue : **A · Relief blanc**.

## 1. Les 11 références fixes, réellement ouvertes

`tools/refs.mjs` a ouvert les 11 fiches webdesign-inspiration dans Chrome headless le 2026-11-18 (11 × HTTP 200 ; captures `captures/refs/*-fiche.jpg`, planche `captures/refs/montage.jpg`, journal `refs.json`).
Limite : le bouton « Visiter ce site » n'est pas un lien `<a>` lisible par le script. Un premier passage a suivi par erreur le lien du bandeau de consentement (sirdata) ; ces captures ont été supprimées. **Les sites live n'ont donc pas été rouverts** : la lecture ci-dessous repose sur les fiches (capture du site + métadonnées).

| # | Réf | Ce que la fiche montre | Pris pour Réplique V2 | Refusé |
|---|---|---|---|---|
| 3 | **Flow Computing** | un relief blanc et doux sur fond blanc, éclairé par la gauche ; un onglet noir vertical sur le bord droit | **le cœur de V2** : objets en plâtre blanc rendus en WebGL, lumière à gauche, ombre portée à droite, mur = couleur de la page ; **onglet noir vertical** = la seule action à l'écran (« Next — … ») | la forme en dôme, le blanc pur |
| 4 | **Dominic Burt** | « Dominic Burt—Product Designer » en grande linéale serrée sur une forme crème en relief ; le tiret long comme motif | titres 150–196 px à `-0.065em`, noirs puis gris ; **le tiret long** devient la liaison « Freeze the crash —— Explain the wait —— Replay the schedule » ; « Scroll down » | la forme organique, la signature |
| 1 | **LogoPoint** | blanc, des objets qui flottent, un mot barré (« Not weeks ») | **le mot barré** : « Replay it ~~by luck~~ at will » (P2) | les icônes colorées |
| 5 | **Teko** | page sombre, un seul mot en couleur (« digital ») | **un seul mot rouge par titre** : *runs.*, *is*, *hash.*, *evidence*, *channels.* | la page noire, la courbe magenta |
| 6 | **NexusGPT** | noir et blanc strict, produit lisible au centre | P4 : **l'écran réel** du produit sur une plaque blanche, sans décor | le layout SaaS |
| 2 | **Igloo** | un objet 3D réaliste porte tout le premier écran | premier écran porté par **un objet 3D unique**, sans menu | le réalisme photo, la neige |
| 9 | Gapsy | lettres rouges en relief dans une salle blanche | non retenu (c'était l'option C) | — |
| 7 / 8 / 10 / 11 | Noon / Raben Rifaie / Concept Studio / D.FY | orange sur noir · pièce beige · scooter jaune · Galaxy sur noir | non retenus : palettes et sujets incompatibles avec un accent rouge unique sur fond clair | — |

Ancrage (≥ 2 exigés) : **Flow Computing + Dominic Burt** (structure), **LogoPoint + Teko** (gestes typographiques), NexusGPT et Igloo en appui.

## 2. Awwwards

Le parcours de V1 reste valable comme matière : 9 listings et 17 sites ouverts le 2026-11-16, journal dans `../v1/captures/research/`. Il n'a pas été refait pour V2, la consigne étant de s'appuyer sur les refs fixes. Principes repris de ce parcours : SANTAL et Brik.Space (titre géant à tracking négatif), CHEESE DESIGN (objet réel unique au centre), Altnota (geste manuscrit sur un mot clé).

## 3. Les 5 principes de V2

1. **Une seule couleur d'accent**, celle du produit : `#C62828` (`C_CYCLE_STROKE` de `view.py`). Pas d'orange en V2 : le what-if s'exprime en noir et en texte.
2. **La typographie comme image** : linéale géante et serrée, noire puis grise, un seul mot rouge.
3. **Le premier écran raconte sans menu** : un objet en relief (maillons enlacés = interblocage ; anneau segmenté = tampon circulaire). La navigation vit dans le pied de page ; une seule action à l'écran, l'onglet.
4. **Le scroll comme narration** : « Scroll down », sections au rythme lent, beaucoup de vide.
5. **Matière et lumière** : plâtre blanc, lumière à gauche, ombre douce à droite ; les plaques (rapport, SVG réel) reçoivent la même lumière.
