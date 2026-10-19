# Proposal

## Why

Le README est actuellement en français alors que l'écosystème OpenCode/Pele et le public potentiel du dépôt sont anglophones ; et le dépôt n'a aucune licence, ce qui empêche juridiquement toute réutilisation du skill. Publier le projet (README anglais + LICENSE MIT) le rend partageable et réutilisable.

## What Changes

- Traduire intégralement `README.md` en anglais, en conservant tout le contenu actuel : description du skill, arborescence, installation par lien symbolique, note de re-création après déplacement. La version française n'est pas conservée dans le dépôt (le git history reste accessible).
- Ajouter un fichier `LICENSE` à la racine contenant le texte standard MIT.
- Rappel de licence dans le README (une ligne renvoyant vers LICENSE).

## Capabilities

### New Capabilities

<!-- Aucune : changement de documentation uniquement. -->

### Modified Capabilities

<!-- Aucune : le comportement du skill (spec `pele-skill`) est inchangé. -->

Ce change déclare volontairement **aucune capability** et active `skip_specs: true` dans son `.openspec.yaml` : docs/licence n'altèrent aucun comportement observable du système.

## Impact

- Fichiers modifiés : `README.md` (réécrit en anglais).
- Fichier ajouté : `LICENSE` (MIT).
- Aucun code, aucune dépendance, aucune spec affectée.
- Hypothèses enregistrées : détenteur du copyright = « Pele contributors », année 2026 — à ajuster au nom légal souhaité lors de la revue ; le badge « Created in T3 Code » reste dans le README.
