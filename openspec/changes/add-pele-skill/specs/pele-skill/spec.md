# Spec Delta

## Purpose

Fournir à toute session d'agent un skill global `pele` qui transforme une demande de diagramme en une image vérifiée : source Mermaid générée puis validée par le rendu headless de Pele, thématisée selon le projet hôte, livrée en PNG dans la conversation et en SVG pour le projet.

## ADDED Requirements

### Requirement: Activation sur demande de diagramme

Le skill SHALL s'activer dès qu'une session demande la création ou la modification d'un diagramme, que la demande soit formulée en français ou en anglais, et couvrir les vocabulaires courants : diagram/diagramme, schéma, flowchart, mermaid, diagramme de séquence, mindmap, gantt, ERD, timeline, gitgraph, pie, kanban, et équivalents anglais.

#### Scenario: Demande en français

- **WHEN** l'utilisateur demande « fais-moi un schéma d'architecture » ou « un diagramme de séquence de ce flux »
- **THEN** le skill s'active et produit le diagramme via son workflow Pele

#### Scenario: Demande en anglais

- **WHEN** l'utilisateur demande « draw a flowchart of the auth flow »
- **THEN** le skill s'active et produit le diagramme via son workflow Pele

#### Scenario: Hors périmètre

- **WHEN** l'utilisateur demande une image ou un graphique qui n'est pas un diagramme (photo, chart de données hors types Pele)
- **THEN** le skill ne s'impose pas comme seul recours et peut être ignoré au profit d'un outil plus adapté

### Requirement: Génération validée par rendu headless

Le skill MUST produire toute source Mermaid via une boucle de vérification machine : la source est rendue avec `render()` de Pele en Node headless avant toute livraison ; en cas de `PeleError`, la position (ligne, colonne, snippet) et le code d'erreur sont utilisés pour corriger la source et relancer le rendu jusqu'à un SVG valide.

#### Scenario: Source valide du premier coup

- **WHEN** la source Mermaid est rendue sans erreur
- **THEN** le SVG produit et ses dimensions sont retenus pour la suite du workflow

#### Scenario: Erreur de syntaxe

- **WHEN** `render()` lève une `PeleError` de code `syntax` avec ligne et colonne
- **THEN** la source est corrigée à la position indiquée puis le rendu est relancé, sans livrer de diagramme invalide

#### Scenario: Type non supporté

- **WHEN** le rendu échoue avec le code `unsupported-diagram`
- **THEN** le skill reformule le diagramme dans un type supporté par Pele au lieu de livrer une erreur

### Requirement: Couverture des types de diagrammes

Le skill MUST couvrir tous les types de diagrammes supportés par Pele — types intégrés de Mermaid 12.1.0 et types beta, tels que documentés sur pele.run/compatibility — et MUST éviter les constructions incompatibles avec Pele : labels HTML arbitraires, `themeVariables`, callbacks JavaScript sur `click`, plugins externes Mermaid (ZenUML).

#### Scenario: Type standard

- **WHEN** l'utilisateur demande un diagramme de séquence ou un ERD
- **THEN** la source produite utilise la syntaxe du type correspondant et le rendu aboutit

#### Scenario: Type beta

- **WHEN** l'utilisateur demande un Wardley map ou un diagramme d'Ishikawa
- **THEN** la source produite utilise le mot-clé beta correspondant et le rendu aboutit

#### Scenario: Construction incompatible demandée

- **WHEN** la source envisagée utilise une construction incompatible (label HTML, `themeVariables`, callback `click`)
- **THEN** le skill la remplace par l'équivalent supporté (label texte, variables CSS `--pele-*`, lien simple)

### Requirement: Thématisation adaptée au projet

Le skill MUST déterminer le thème du rendu en détectant l'ambiance du projet hôte (indicateurs de mode sombre dans le code ou la configuration), et utiliser un thème clair par défaut en l'absence d'indicateur. Les variables CSS `--pele-*` MUST être résolues en valeurs concrètes dans le SVG avant toute rasterisation.

#### Scenario: Projet en mode sombre

- **WHEN** le projet hôte présente des indicateurs de mode sombre
- **THEN** le diagramme est rendu avec un thème sombre cohérent

#### Scenario: Projet sans indicateur

- **WHEN** aucun indicateur de thème n'est trouvé
- **THEN** le diagramme est rendu avec le thème clair par défaut

### Requirement: Livraison d'une image vérifiée dans la conversation

Le skill MUST livrer le diagramme fini sous forme de PNG référencé par un chemin de fichier absolu, affichable directement dans la réponse de l'agent, et conserver le SVG à un chemin stable du projet pour réutilisation.

#### Scenario: Diagramme livré

- **WHEN** le rendu et la rasterisation aboutissent
- **THEN** la réponse intègre l'image PNG via un chemin absolu et le SVG est disponible dans le projet

#### Scenario: Échec de rasterisation

- **WHEN** la rasterisation PNG échoue alors que le SVG est valide
- **THEN** le skill livre le SVG avec une explication et signale l'échec de l'étape image au lieu d'échouer silencieusement

### Requirement: Installation globale par lien symbolique

Le skill MUST résider dans ce dépôt (sources et scripts versionnés) et être exposé globalement aux sessions via un lien symbolique depuis le dossier global des skills OpenCode vers le dossier du skill dans ce dépôt, sans copie ni script d'installation ; toute édition dans le dépôt est immédiatement effective dans toutes les sessions.

#### Scenario: Skill disponible dans une session quelconque

- **WHEN** une session démarre dans un projet quelconque de la machine
- **THEN** le skill `pele` est découvrable et invoquable depuis ce dossier global

#### Scenario: Édition du skill

- **WHEN** un fichier du skill est modifié dans ce dépôt
- **THEN** la modification est effective dans toutes les sessions sans étape d'installation supplémentaire
