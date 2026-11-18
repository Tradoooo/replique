# Rapport Réplique — interblocage

Produit le 2026-11-16 14:31:11 UTC par Réplique (hôte).

- Archive : RKV1 v1 — 672 octets
- Empreinte SHA-256 : `e7850a8ba23d72a2c98d992bbaca2f2f842647a68490862d88842d1261b59107`
- Événements : 20 — drapeaux : SYNTHETIC

## Chaîne de blocage

Cycle fermé : 101 → 102 (ressource du dernier blocage : 16).

- tid 101 (prio 50) attend la ressource 32 (MUTEX), tenue par tid 102 ;
- tid 102 (prio 60) attend la ressource 16 (MUTEX), tenue par tid 101 ;

## Coupable

**tid 102** — `holds-resource-32-at-prio-60` : dans le cycle, ce thread détient la ressource acquise le plus anciennement et a la priorité de base la plus basse (règle gelée CONTRACT.md §3.3).

## Inversion de priorité

Aucune inversion de priorité détectée.

## Rejeu

- Hachage FNV-1a 64 : 17104745365914896697 — 3 décisions
- Fidélité : conforme (rejeu comparé aux événements SCHED de la trace)

## Recommandation

Casser le cycle : le thread 102 détient la ressource 32 — lui faire relâcher le verrou (libération ordonnée) ou lui accorder une priorité plus élevée pour qu'il termine. En prévention, imposer un ordre global d'acquisition des verrous et des acquisitions temporisées avec abandon.

## Verdicts

| Code | Sévérité | ts | tid | a | b | Chaîne | Détail |
|---|---|---|---|---|---|---|---|
| DEADLOCK_FOUND | error | 1700 | 0 | 0 | 16 | 101,102 | `cycle-detected` |
| CULPRIT | error | 1700 | 102 | 0 | 32 | 101,102 | `holds-resource-32-at-prio-60` |
| OK | info | 0 | 0 | 20 | 0 | — | `parse-ok` |
| REPLAY_DETERMINISTIC | info | 0 | 0 | 0 | 0 | — | `decisions-3` |

