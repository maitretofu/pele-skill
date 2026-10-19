# Tasks

## 1. README en anglais

- [x] 1.1 Réécrire `README.md` en anglais : conserver l'icône, le badge « Created in T3 Code », la description du skill, l'arborescence `skill/pele/`, la section d'installation par symlink et la note de re-création après déplacement ; vérifier qu'aucune phrase française ne subsiste (`grep -iE 'schéma|diagramme|dépôt|lien symbolique' README.md` ne retourne rien hors extraits de code)
- [x] 1.2 Ajouter au README une ligne de licence renvoyant vers le fichier LICENSE ; vérifier que le lien/chemin cité correspond au nom de fichier créé en 2.1

## 2. Licence MIT

- [x] 2.1 Créer `LICENSE` à la racine avec le texte standard MIT (MIT License, « Pele contributors », 2026) ; vérifier le texte contre https://opensource.org/license/mit (mêmes paragraphes, mêmes majuscules d'en-tête)
- [x] 2.2 Vérifier la cohérence d'ensemble : `ls LICENSE README.md` présentent les deux fichiers à la racine et `openspec validate english-readme-mit-license` passe

## Workflow follow-up

- Archiver le change après revue (`/openspec-archive-change`) ; aucun spec à synchroniser (skip_specs).
