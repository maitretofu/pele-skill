# Proposal

## Why

Le dépôt n'a pas encore de description GitHub — elle apparaît dans les résultats de recherche, les partages et la page du profil. Le README vient d'être anglicisé (`english-readme-mit-license`) : c'est le moment de fixer le one-liner officiel, dérivé de sa première phrase descriptive.

## What Changes

- Adopter la description de dépôt GitHub suivante (plain text, 149 caractères) :

  > A global OpenCode skill that renders Mermaid into verified, themed SVG/PNG diagrams with Pele — headless, with a parse-error correction loop.

- Aligner la première ligne descriptive du `README.md` exactement sur ce texte (la version actuelle diffère légèrement : « for creating verified diagrams » vs « that renders … into verified, themed … »).
- Enregistrer la commande prête à coller pour appliquer la description au moment de la création du dépôt :

  ```bash
  gh repo create pele --public --description "A global OpenCode skill that renders Mermaid into verified, themed SVG/PNG diagrams with Pele — headless, with a parse-error correction loop."
  ```

  Le dépôt GitHub n'existe pas encore et ce change ne le crée pas (périmètre confirmé par l'utilisateur) : la commande est livrée telle quelle, la visibilité `--public` étant modifiable en `--private`.

## Capabilities

### New Capabilities

<!-- Aucune : métadonnées de dépôt uniquement. -->

### Modified Capabilities

<!-- Aucune : le comportement du skill (spec `pele-skill`) est inchangé. -->

Ce change déclare volontairement **aucune capability** et active `skip_specs: true` : une description de dépôt n'altère aucun comportement observable du système.

## Impact

- Fichier modifié : `README.md` (une phrase alignée sur la description retenue).
- Hors dépôt : la description GitHub à appliquer lors de la création du dépôt (commande `gh` ci-dessus, compte `maitretofu`).
- Aucune dépendance, aucune spec affectée.
