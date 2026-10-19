# Tasks

## 1. Spike — rendu headless et rasterisation

- [x] 1.1 Installer `pele@1.x` localement (`npm install pele@1`) et prouver `render()` en Node pur sans DOM : rendre un `flowchart LR A --> B` et vérifier que la sortie contient un `<svg>` avec `width`/`height`/`type` (script jetable, vérifié par exécution)
- [x] 1.2 Vérifier `PeleError` headless : rendre une source invalide et confirmer que `code`, `line`, `column`, `snippet` sont exploitables (vérifié par exécution du même script)
- [x] 1.3 Départager le rasteriseur : rendre le SVG de 1.1 en PNG avec `@resvg/resvg-js` (plan B `sharp`, plan C capture navigateur), en testant si `var()` survit sans injection de `<style>` (vérifié par existence et lisibilité du PNG produit)

## 2. Scripts du skill

- [x] 2.1 Créer `skill/pele/scripts/render.mjs` : source Mermaid (fichier ou stdin) → JSON `{ ok, svg, width, height, type }` ou `{ ok: false, code, line, column, snippet, message }`, avec injection du `<style>` de thème selon la décision D3 ; vérifier par les deux cas (valide et invalide) sur la ligne de commande
- [x] 2.2 Créer `skill/pele/scripts/to-png.mjs` : SVG + palette (clair/sombre/détection) → PNG au chemin demandé ; vérifier en produisant un PNG lisible depuis le SVG de 2.1
- [x] 2.3 Documenter l'usage des deux scripts en tête de chacun (arguments, sortie JSON, codes d'erreur) et vérifier que les exemples documentés s'exécutent tels quels

## 3. SKILL.md — connaissance et workflow

- [x] 3.1 Créer `skill/pele/SKILL.md` avec frontmatter (`name: pele`) et description bilingue couvrant les déclencheurs FR/EN de la spec (diagram/diagramme, schéma, flowchart, mermaid, séquence, mindmap, gantt, ERD…) ; vérifier que le frontmatter suit le format des skills OpenCode existants (comparer avec `.opencode/skills/*/SKILL.md`)
- [x] 3.2 Rédiger le workflow de la boucle de vérification (écrire la source → `render.mjs` → corriger d'après `PeleError` → `to-png.mjs` → livrer PNG en chemin absolu + SVG) avec un exemple complet de bout en bout ; vérifier en suivant l'exemple à la main
- [x] 3.3 Rédiger la table des types supportés (33 types Mermaid 12.1 + beta avec leurs mots-clés) et la section « quand utiliser quel type » ; vérifier la liste contre https://pele.run/compatibility
- [x] 3.4 Rédiger la section pièges de compatibilité (labels HTML interdits, `themeVariables` ignorés, callbacks `click` ignorés, pas de ZenUML, layout propre à Pele, limites de taille et `autoDirection`) avec pour chacun l'équivalent supporté ; vérifier contre https://pele.run/compatibility
- [x] 3.5 Embarquer les deux palettes de thème (clair par défaut, sombre) sous forme de variables `--pele-*` concrètes ; vérifier que chaque variable du site (bg, fg, muted, line, surface, surface-alt, border, error) est couverte

## 4. Installation globale

- [x] 4.1 Confirmer le chemin exact du dossier global des skills OpenCode et créer le lien symbolique `~/.config/opencode/<skills>/pele -> <repo>/skill/pele` ; vérifier avec `ls -L` que la cible se résout
- [x] 4.2 Documenter l'installation dans le README du repo (une commande `ln -s`, où trouver le skill, comment le recréer après un déménagement) ; vérifier que la commande documentée est celle réellement exécutée en 4.1

## 5. Vérification de bout en bout

- [x] 5.1 Test d'intégration : depuis une demande en langage naturel (« un diagramme de séquence de… »), suivre le skill complet jusqu'à un PNG affiché en chemin absolu et un SVG conservé, en passant par une correction `PeleError` volontaire ; vérifier les deux artefacts produits
- [x] 5.2 Vérifier la détection de thème : rejouer 5.1 avec des indicateurs sombres dans un projet factice et confirmer la palette sombre, puis sans indicateur et confirmer la palette claire
- [x] 5.3 Lancer `openspec validate` et corriger tout écart signalé

## Workflow follow-up

- Archiver le change une fois les exigences de revue satisfaites (`/openspec-archive-change`).
- Vérifier le résultat archivé (spec `pele-skill` présente dans `openspec/specs/`).
