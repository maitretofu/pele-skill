# Tasks

## 1. Description du dépôt

- [ ] 1.1 Aligner la première ligne descriptive du `README.md` sur le texte retenu (« A global OpenCode skill that renders Mermaid into verified, themed SVG/PNG diagrams with Pele — headless, with a parse-error correction loop. ») en conservant les liens `[OpenCode](https://opencode.ai)` et `[Pele](https://pele.run)` autour des noms ; vérifier par lecture du README que la phrase correspond mot pour mot (hors liens Markdown)
- [ ] 1.2 Vérifier que la version plain text de la description tient dans la limite GitHub : `printf '%s' "A global OpenCode skill that renders Mermaid into verified, themed SVG/PNG diagrams with Pele — headless, with a parse-error correction loop." | wc -c` retourne ≤ 350
- [ ] 1.3 Vérifier la cohérence d'ensemble : `openspec validate github-repo-description` passe et la commande `gh repo create` du proposal s'exécute en `--dry-run` absent — au minimum, la recopier sans erreur de citation (guillemets droit/échappement) lors d'un `echo` de contrôle

## Workflow follow-up

- Archiver le change après revue (`/openspec-archive-change`) ; aucun spec à synchroniser (skip_specs).
- À la création du dépôt GitHub : coller la commande `gh repo create` du proposal (ajuster `--public`/`--private`), puis `git remote add origin` et pousser.
