---
name: pele
description: Create verified diagrams with Pele (pele.run) — renders Mermaid to SVG/PNG headlessly. Use when the user wants to create, draw or modify any diagram: diagram, diagramme, schéma, flowchart, logigramme, mermaid, diagramme de séquence / sequence diagram, state machine, mindmap, gantt, ERD / mcd, class diagram, timeline, gitgraph, pie chart, kanban, wardley, ishikawa, C4, architecture diagram, or asks to "draw"/"dessine"/"visualise" a process or structure. Also for "openspec pele" or pele.run questions. Not for photos, generic image editing, or data charts outside Pele's supported types.
metadata:
  author: pele-project
  version: "1.0"
compatibility: Node.js 20+; dependencies resolve from this skill's own node_modules (pele, sharp).
---

# Pele — diagrammes vérifiés en SVG/PNG

Pele (https://pele.run) rend la syntaxe Mermaid 12.1 en SVG — zéro dépendance, synchrone, erreurs positionnées ligne/colonne. Ce skill produit des diagrammes **validés par rendu machine** avant livraison, puis les livre en **PNG affichable** dans la conversation et en **SVG** conservé pour le projet.

## Workflow (toujours dans cet ordre)

### 1. Choisir le type (voir table plus bas)

Écrire la source Mermaid dans un fichier du projet cible, ex. `diagrams/<nom>.mmd`. Rester en syntaxe Mermaid standard — voir « Pièges de compatibilité » pour ce qu'il ne faut PAS utiliser.

### 2. Détecter le thème du projet hôte

Chercher des indicateurs de mode sombre, dans l'ordre :

- `prefers-color-scheme: dark` dans les CSS du projet
- `darkMode` (tailwind.config), classe `.dark`, thème sombre déclaré dans la config de l'app
- thème sombre actif de l'éditeur/outil hôte (ex. `appearance`/`theme` dans obsidian.json, VS Code settings)

Indicateur trouvé → `--theme dark`. Sinon → `--theme light` (défaut). **Une demande explicite de l'utilisateur prime toujours** (« en sombre », « dark version »).

### 3. Rendre et corriger en boucle

```bash
node <chemin-du-skill>/scripts/render.mjs diagrams/<nom>.mmd --out diagrams/<nom>.svg --theme dark
```

- `ok: true` → JSON avec `svgPath`, `background`, `width`, `height`, `type`. Passer à l'étape 4.
- `ok: false` → `code`, `line`, `column`, `snippet`, `message`. Corriger la source **à la position indiquée**, relancer. Ne jamais livrer un diagramme non rendu.
  - `syntax` : erreur de parsing à la position donnée.
  - `unsupported-diagram` : type inconnu ou plugin externe (ZenUML…) → reformuler dans un type supporté.
  - `semantic` : parsé mais invalide (ex. référence inexistante) → corriger la logique.
  - `limit` : source trop longue (> 50k chars), trop d'arêtes (> 5000) ou sortie > 4 Mo → simplifier/découper.

Le script remplace toutes les références `var(--pele-*)` par les valeurs concrètes de la palette : le SVG écrit est autonome, lisible tel quel dans tout contexte.

### 4. Rastériser en PNG

```bash
node <chemin-du-skill>/scripts/to-png.mjs diagrams/<nom>.svg --out diagrams/<nom>.png --background "#fffcf0" --width 1200
```

Reprendre `background` du JSON de l'étape 3 (l'hex de la palette du thème choisi). `--width` optionnel (défaut : 2× la largeur naturelle, borné 640–2400).

### 5. Livrer

- **Dans la conversation** : intégrer le PNG par chemin absolu — `![<nom>](/chemin/absolu/diagrams/<nom>.png)`.
- **Pour le projet** : donner les chemins du SVG (source vectorielle) et du `.mmd` (source éditable).
- Si la rastérisation échoue alors que le SVG est valide : livrer le SVG, signaler l'échec de l'étape image, ne pas échouer silencieusement.

## Types supportés (Mermaid 12.1.0 + beta)

| Besoin | Type | Mot-clé |
| --- | --- | --- |
| Processus, décision, architecture logique | Flowchart | `flowchart`, `graph` |
| Flux parallèles par acteurs/rôles | Swimlane | `swimlane-beta` |
| Interactions ordonnées entre composants | Sequence | `sequenceDiagram` |
| Structure de classes (OO) | Class | `classDiagram` |
| Machine à états | State | `stateDiagram-v2` |
| Modèle de données, entités/relations | ER | `erDiagram` |
| Planning, dépendances temporelles | Gantt | `gantt` |
| Historique de branches | Git graph | `gitGraph` |
| Répartition simple | Pie | `pie` |
| Idéation, hiérarchie libre | Mindmap | `mindmap` |
| Tableau de tâches | Kanban | `kanban` |
| Chronologie d'événements | Timeline | `timeline` |
| Parcours utilisateur | Journey | `journey` |
| Positionnement 2 axes (urgent/important…) | Quadrant | `quadrantChart` |
| Données x/y, barres, lignes | XY chart | `xychart-beta` |
| Exigences et traçabilité | Requirement | `requirementDiagram` |
| Flux de volumétrie | Sankey | `sankey-beta` |
| Infrastructure, composants déployés | Architecture | `architecture-beta` |
| Architecture logicielle C4 | C4 | `C4Context`, `C4Container`, `C4Component`, `C4Dynamic`, `C4Deployment` |
| Mise en page libre par blocs | Block | `block-beta` |
| Workflow d'agent IA | Agentflow | `agentflow-beta` |
| Grammaire (EBNF, ABNF, PEG) | Railroad | `railroad-beta`, `railroad-ebnf-beta`, `railroad-abnf-beta`, `railroad-peg-beta` |
| Arborescence | Tree view | `treeView-beta` |
| Cadre de Cynefin | Cynefin | `cynefin-beta` |
| Carte stratégique de Wardley | Wardley | `wardley-beta` |
| Event storming / modeling | Event modeling | `eventmodeling` |
| Cas d'usage | Use case | `usecase-beta` |
| Ensembles, recouvrements | Venn | `venn-beta` |
| Causes racines (Ishikawa/fishbone) | Ishikawa | `ishikawa-beta` |
| Trame réseau | Packet | `packet-beta` |
| Comparaison multi-axes | Radar | `radar-beta` |
| Hiérarchie + proportions | Treemap | `treemap-beta` |
| Méta-informations | Info | `info` |

Les types `-beta` le sont côté Pele : privilégier un type stable quand le besoin est équivalent.

## Pièges de compatibilité (Mermaid → Pele)

| Construction Mermaid | Statut dans Pele | À faire à la place |
| --- | --- | --- |
| Labels HTML (`A["<b>x</b>"]`) | Non supportés | Label texte simple ; gras/italique via `**x**`/`*x*` supportés dans les labels |
| `%%{init: {"theme": ...}}%%`, `themeVariables` | Couleurs ignorées | Thème via palettes du skill (`--theme`) ; `%%{init}%%` pour le reste, support variable par type |
| `click X callback "tooltip"` (JS) | Callbacks ignorés | `click X "https://..."` (lien simple, supporté) |
| Plugins externes (ZenUML…) | Non supportés | `sequenceDiagram` standard |
| Rendu identique à Mermaid.js | Layout propre à Pele | Ne pas promettre le pixel-perfect Mermaid ; positions/espacements differents |
| Largeurs étroites (`maxWidth`) | `flowchart LR` peut basculer vertical sous 640 px | Le PNG est livré à largeur fixe : direction source conservée |

Frontmatter, directives `%%{init}%%`, commentaires `%%`, titres/ descriptions d'accessibilité : supportés.

## Palettes officielles (pele.run/theming)

Incluses dans `scripts/render.mjs`. Variables couvertes : `--pele-bg`, `--pele-fg`, `--pele-muted`, `--pele-line`, `--pele-surface`, `--pele-surface-alt`, `--pele-border`, `--pele-accent`, `--pele-critical`, `--pele-error`.

| Variable | Clair | Sombre |
| --- | --- | --- |
| `--pele-bg` | `#fffcf0` | `#100f0f` |
| `--pele-fg` | `#100f0f` | `#cecdc3` |
| `--pele-muted` | `#6f6e69` | `#878580` |
| `--pele-line` | `#100f0f` | `#cecdc3` |
| `--pele-surface` | `#f2f0e5` | `#1c1b1a` |
| `--pele-surface-alt` | `#e6e4d9` | `#282726` |
| `--pele-border` | `#cecdc3` | `#403e3c` |
| `--pele-accent` | `#205ea6` | `#4385be` |
| `--pele-critical` | `#af3029` | `#d14d41` |
| `--pele-error` | `#af3029` | `#d14d41` |

Couleurs de séries (pie, gitGraph, xychart…) : défauts Pele `--pele-series-1..8` inchangés — lisibles sur les deux thèmes. Rayon des angles : `4px` par défaut.

Polices : `render()` mesure avec `sans-serif`/`monospace` par défaut en Node — ne pas passer de police exotique, la mesure et le rendu doivent rester cohérents.

## Exemple de bout en bout

Source `diagrams/auth-flow.mmd` :

```
sequenceDiagram
  actor U as Utilisateur
  participant S as Serveur
  U->>S: LOGIN bob / ***
  S-->>U: Token JWT
```

```bash
node <chemin-du-skill>/scripts/render.mjs diagrams/auth-flow.mmd --out diagrams/auth-flow.svg --theme light
# → { ok: true, background: "#fffcf0", ... }
node <chemin-du-skill>/scripts/to-png.mjs diagrams/auth-flow.svg --out diagrams/auth-flow.png --background "#fffcf0"
# → { ok: true, pngPath: "...", width: ..., height: ... }
```

Puis livrer : `![Auth flow](/chemin/absolu/diagrams/auth-flow.png)`.
