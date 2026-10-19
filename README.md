<img src="assets/icon.svg" width="64" height="64" alt="">

# Pele

Created in [T3 Code](https://t3.codes).

Skill global [OpenCode](https://opencode.ai) pour créer des diagrammes vérifiés avec [Pele](https://pele.run) — rendu Mermaid → SVG → PNG headless, avec boucle de correction sur les erreurs de parsing.

## Contenu

```
skill/pele/
├── SKILL.md            # workflow, types supportés, pièges de compatibilité, palettes
└── scripts/
    ├── render.mjs      # source Mermaid → SVG (JSON, erreurs ligne/colonne)
    └── to-png.mjs      # SVG → PNG (sharp)
```

## Installation (globale, par lien symbolique)

```bash
ln -sfn "$(pwd)/skill/pele" ~/.config/opencode/skills/pele
```

Le dossier `~/.config/opencode/skills` est découvert automatiquement par OpenCode : le skill `pele` devient disponible dans **toutes les sessions**, et toute édition ici est immédiatement active (aucune copie).

Après avoir déplacé ou cloné ce dépôt ailleurs, relancer la commande depuis le nouvel emplacement.
