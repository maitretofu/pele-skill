# Proposal

## Why

Créer des diagrammes (flowchart, séquence, mindmap…) dans une session d'agent repose aujourd'hui sur du Mermaid « à l'aveugle » : l'agent écrit la syntaxe sans pouvoir valider le rendu, et Mermaid.js est lourd et lent. Le skill [Pele](https://pele.run/) rend le Mermaid en SVG — zéro dépendance, rendu synchrone, erreurs positionnées (ligne/colonne) — ce qui permet une boucle de vérification machine et une livraison en image, directement dans la conversation.

## What Changes

- Création d'un skill OpenCode **global** nommé `pele`, disponible dans toutes les sessions.
- Activation automatique dès qu'un diagramme est demandé (mots-déclencheurs FR et EN : diagram/diagramme, schéma, flowchart, mermaid, séquence, mindmap, gantt, ERD…).
- Connaissance embarquée : tous les types de diagrammes supportés par Pele (Mermaid 12.1.0 + types beta), l'API `render()`, les variables CSS `--pele-*`, et les pièges de compatibilité avec Mermaid (pas de labels HTML, `themeVariables` ignorés, callbacks `click` ignorés…).
- Boucle de vérification : script Node headless qui rend la source Mermaid via `render()`, retourne `PeleError` (ligne, colonne, snippet) en cas d'erreur, et permet à l'agent de corriger jusqu'à un rendu valide.
- Livraison visuelle : thème adapté au projet hôte (sinon clair), variables CSS résolues, rasterisation PNG, affichage de l'image dans la réponse via chemin de fichier absolu ; le SVG est conservé pour le projet.
- Installation « la plus légère » : les fichiers vivent dans ce repo, un lien symbolique du dossier global des skills OpenCode vers ce repo (zéro copie, zéro script d'install).

## Capabilities

### New Capabilities

- `pele-skill`: Comportement durable du skill `pele` — déclenchement sur demande de diagramme, génération et correction de source Mermaid via le rendu headless Pele, thématisation adaptée au projet, livraison d'un PNG vérifié dans la conversation et d'un SVG pour le projet, installation par lien symbolique.

### Modified Capabilities

<!-- Aucune capability existante n'est modifiée : le projet n'a pas encore de specs. -->

## Impact

- **Nouveaux fichiers** : skill dans ce repo (`skill/pele/SKILL.md` + `skill/pele/scripts/`), specs sous `openspec/specs/pele-skill/`.
- **Hors repo** : un lien symbolique dans le dossier global des skills OpenCode (`~/.config/opencode/`) pointant vers le skill.
- **Dépendance runtime** : package npm `pele@1.x` (zéro dépendance transitives), utilisé par le script de rendu ; rasteriseur PNG à départager lors du spike (resvg-js, sharp, ou capture navigateur).
- **Pas d'impact** sur le code existant du repo (README + assets seulement).
