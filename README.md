<img src="assets/icon.svg" width="64" height="64" alt="">

# Pele

Created in [T3 Code](https://t3.codes).

A global [OpenCode](https://opencode.ai) skill for creating verified diagrams with [Pele](https://pele.run) — headless Mermaid → SVG → PNG rendering, with a correction loop on parse errors.

## Contents

```
skill/pele/
├── SKILL.md            # workflow, supported types, compatibility gotchas, palettes
└── scripts/
    ├── render.mjs      # Mermaid source → SVG (JSON, line/column errors)
    └── to-png.mjs      # SVG → PNG (sharp)
```

## Installation (global, via symlink)

```bash
ln -sfn "$(pwd)/skill/pele" ~/.config/opencode/skills/pele
```

OpenCode automatically discovers `~/.config/opencode/skills`: the `pele` skill becomes available in **every session**, and any edit made here takes effect immediately (no copying).

After moving or cloning this repository elsewhere, run the command again from the new location.

## License

[MIT](LICENSE)
