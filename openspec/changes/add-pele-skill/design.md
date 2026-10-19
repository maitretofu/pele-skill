# Design

## Context

Voir proposal.md — Why. État du repo : README + icône, aucune implémentation. Pele (`pele@1.6.0` sur npm, par Obsidian/kepano) expose `render()` synchrone qui utilise « une table de largeur intégrée quand canvas n'est pas disponible » — le rendu headless en Node est donc probable mais non prouvé : c'est l'objet du spike (tâche 1). L'agent hôte est OpenCode (skills dans `.opencode/skills/<nom>/SKILL.md` côté projet, dossier global pour toutes les sessions) et T3 Code affiche les images en Markdown via chemin de fichier absolu.

## Goals / Non-Goals

**Goals:**

- Boucle de vérification machine : Mermaid → `render()` Node → `PeleError` (ligne/colonne/snippet) → correction → SVG valide.
- Livraison finale en PNG affiché dans la conversation, SVG conservé pour le projet.
- Thème : détection du projet hôte, sinon clair ; variables `--pele-*` résolues avant rasterisation.
- Installation globale par lien symbolique, zéro copie.
- Connaissance complète : types Mermaid 12.1 + betas, API, pièges de compatibilité.

**Non-Goals:**

- Support des plugins Mermaid externes (ZenUML) — Pele ne les supporte pas.
- Édition interactive de diagrammes (le playground pele.run reste l'outil manuel).
- Intégration dans une app web (`mount()`, zoom) — le skill produit des artefacts, pas du code d'app. Pourra être une capability plus tard.
- Multi-moteurs (Mermaid.js en secours) — hors périmètre.

## Decisions

### D1 — Nom `pele`, déclencheurs bilingues

La `description` du SKILL.md liste explicitement les vocabulaires FR et EN (diagram/diagramme, schéma, flowchart, mermaid, séquence, mindmap, gantt, ERD…) : c'est le texte que l'agent hôte utilise pour décider de l'activation. *Alternative écartée* : un nom générique « diagrams » — moins mémorable et masquerait le moteur.

### D2 — Layout du repo : `skill/pele/`

```
pele/                      (ce repo)
  skill/pele/
    SKILL.md               (frontmatter + knowledge + workflow)
    scripts/
      render.mjs           (source -> SVG | PeleError JSON, Node headless)
      to-png.mjs           (SVG + theme -> PNG)
  openspec/…               (ce change)
```

Le lien symbolique global pointe vers `skill/pele/`. *Alternatives écartées* : skill à la racine du repo (mélange planning/implémentation) ; dossier `.opencode/skills/` du repo (limiterait au projet).

### D3 — Spike tranché : `sharp`, substitution des `var()`, Pele headless confirmé

Le spike (tâches 1.1–1.3) a confirmé : `render()` tourne en Node pur sans DOM (sortie `{ type, width, height, svg }` correcte), `PeleError` expose `code`/`line`/`column`/`snippet` exploitables, et `unsupported-diagram` se déclenche comme documenté (ex. ZenUML).

Rasteriseur : **`sharp` (librsvg)**. `@resvg/resvg-js` disqualié — sur le fontconfig de cette machine il sélectionne une police bitmap cassée pour certains textes (glyphes `.notdef` avec codes hex), produisant des labels illisibles alors que le même SVG passe parfaitement sous librsvg. `sharp` s'installe en binaire précompilé, sans dépendance système.

Variables CSS : **aucun** moteur ne résout `var(--pele-*)` nativement dans ce contexte (resvg ignore même un `<style>` injecté). Le SVG de Pele enchaîne deux niveaux d'indirection (`--_fg:var(--pele-fg,#fff)` puis `fill="var(--_fg)"`). Solution retenue : passe de substitution textuelle — `var(--pele-x,fb)` remplacé par la valeur de la palette sinon son fallback, puis alias `--_x` résolus de même. Le SVG résultant ne contient plus aucun `var()` : il est autonome et moteur-indépendant.

### D4 — Thème : détection par heuristiques, clair par défaut

Ordre de détection dans le projet hôte : `prefers-color-scheme: dark` dans les CSS, classe/config `dark` (Tailwind, etc.), thèmes éditeur (`.editorconfig` non significatif, ignoré), sinon **clair**. Les valeurs concrètes du thème (les `--pele-*` du site : `--pele-bg`, `--pele-fg`, `--pele-muted`, `--pele-line`, `--pele-surface`, `--pele-surface-alt`, `--pele-border`, `--pele-error`) sont embarquées dans le skill en deux palettes (clair/sombre) et injectées en `<style>` dans le SVG avant rasterisation. Dans une conversation, la demande « thème sombre » de l'utilisateur prime sur la détection.

### D5 — Le SKILL.md porte la connaissance, les scripts portent la mécanique

SKILL.md : quand s'activer, workflow de la boucle, table des types + mots-clés (33 types), pièges de compat (labels HTML interdits, `themeVariables` ignorés, callbacks `click` ignorés, layout propre à Pele, limites de taille), palette de quand utiliser quel type. Scripts : `render.mjs` (sortie JSON : `{ ok, svg, width, height, type }` ou `{ ok: false, code, line, column, snippet, message }`) et `to-png.mjs`. L'agent n'a jamais à deviner l'API Pele : il lit SKILL.md.

### D6 — Installation : lien symbolique

`ln -s <repo>/skill/pele ~/.config/opencode/skill/pele` (chemin exact à confirmer au moment de l'implémentation). Zéro copie, éditions immédiatement actives. La commande est documentée dans le README du repo — une ligne, pas un script.

## Risks / Trade-offs

- [`render()` exige un DOM malgré la doc] → Spike en tâche 1 ; plan B : `TextMeasurer` custom ; plan C : rendu via navigateur headless du T3 Code.
- [`var()` non résolu par le rasteriseur] → Injection systématique d'un `<style>` de valeurs concrètes : le SVG reste autonome (lisible tel quel dans un navigateur) et le PNG fidèle.
- [Le lien symbolique casse si le repo déménage] → Chemin documenté dans le README ; recréation = une commande.
- [Types beta instables (`-beta`)] → Le SKILL.md les signale comme tels ; version de `pele` épinglée en `1.x` dans les exemples.
- [Faux positifs d'activation (le mot « diagramme » dans un autre contexte)] → La description précise « créer/modifier un diagramme » ; l'agent hôte garde le jugement.

## Migration Plan

Création pure, rien à migrer. Rollback : supprimer le lien symbolique global — le repo reste intègre.

## Open Questions

- Chemin exact du dossier global des skills OpenCode (confirmé à l'implémentation, D6).
- Résolution de `var()` par resvg-js (répondu par le spike, D3).
