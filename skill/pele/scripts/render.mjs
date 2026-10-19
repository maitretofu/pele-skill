#!/usr/bin/env node
// render.mjs — rend une source Mermaid en SVG via Pele (headless, synchrone).
//
// Usage:
//   node render.mjs <source.mmd> [--out diagram.svg] [--theme light|dark]
//   echo "flowchart LR\n A --> B" | node render.mjs --out diagram.svg
//   node render.mjs --source "flowchart LR\n  A --> B" --out diagram.svg --theme dark
//
// Sortie stdout (JSON unique) :
//   { ok: true,  svgPath, background, width, height, type }
//   { ok: false, code, line, column, snippet, message }   // PeleError
//     code: "syntax" | "semantic" | "unsupported-diagram" | "limit"
//
// Le SVG écrit est autonome : toutes les references var(--pele-*) sont
// remplacees par des valeurs concretes de la palette (voir design.md, D3).
// Rien n'est affiche hors du JSON : pipe la sortie sans bruit.

import { render, PeleError } from 'pele';
import { readFileSync, writeFileSync } from 'node:fs';

// Palettes officielles pele.run/theming (exemple du site, clair par defaut).
const PALETTES = {
  light: {
    '--pele-bg': '#fffcf0', '--pele-fg': '#100f0f', '--pele-muted': '#6f6e69',
    '--pele-line': '#100f0f', '--pele-surface': '#f2f0e5',
    '--pele-surface-alt': '#e6e4d9', '--pele-border': '#cecdc3',
    '--pele-accent': '#205ea6', '--pele-critical': '#af3029',
    '--pele-error': '#af3029',
  },
  dark: {
    '--pele-bg': '#100f0f', '--pele-fg': '#cecdc3', '--pele-muted': '#878580',
    '--pele-line': '#cecdc3', '--pele-surface': '#1c1b1a',
    '--pele-surface-alt': '#282726', '--pele-border': '#403e3c',
    '--pele-accent': '#4385be', '--pele-critical': '#d14d41',
    '--pele-error': '#d14d41',
  },
};

// Remplace var(--pele-x, fb) par la palette (ou le fallback), puis resout
// les alias internes (--_x: valeur) jusqu'a disparition de tout var().
export function resolveVars(svg, palette) {
  let out = svg.replace(/var\((--pele-[a-z-]+)(?:\s*,\s*([^()]*))?\)/g,
    (_, name, fb) => palette[name] ?? fb ?? 'inherit');
  const aliases = {};
  out = out.replace(/(--[a-z_-]+)\s*:\s*([^;"}]+)(?=[;"}])/g, (m, name, value) => {
    if (!value.includes('var(')) aliases[name] = value;
    return m;
  });
  for (let i = 0; i < 3 && /var\(/.test(out); i++) {
    out = out.replace(/var\((--[a-z_-]+)(?:\s*,\s*([^()]*))?\)/g,
      (_, name, fb) => aliases[name] ?? fb ?? 'inherit');
  }
  return out;
}

function readArgs(argv) {
  const args = { theme: 'light', out: null, source: null, file: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--theme') args.theme = argv[++i];
    else if (argv[i] === '--out') args.out = argv[++i];
    else if (argv[i] === '--source') args.source = argv[++i];
    else if (argv[i] === '--help' || argv[i] === '-h') args.help = true;
    else args.file = argv[i];
  }
  return args;
}

const args = readArgs(process.argv.slice(2));
if (args.help || (!args.file && !args.source && process.stdin.isTTY)) {
  console.log(readFileSync(new URL(import.meta.url)).toString().match(/\/\*[\s\S]*?\*\//)[0]);
  process.exit(args.help ? 0 : 1);
}

function fail(error) {
  const payload = error instanceof PeleError
    ? { ok: false, code: error.code, line: error.line, column: error.column,
        snippet: error.snippet, message: error.message }
    : { ok: false, code: 'internal', line: 0, column: 0, snippet: '', message: String(error) };
  process.stdout.write(JSON.stringify(payload, null, 2));
  process.exit(1);
}

let source = args.source ?? '';
try {
  if (!source) source = args.file
    ? readFileSync(args.file, 'utf8')
    : readFileSync(0, 'utf8'); // stdin
  const palette = PALETTES[args.theme] ?? PALETTES.light;
  const result = render(source);
  const svg = resolveVars(result.svg, palette);
  let svgPath = args.out;
  if (svgPath) writeFileSync(svgPath, svg);
  process.stdout.write(JSON.stringify({
    ok: true, svgPath, background: palette['--pele-bg'],
    width: result.width, height: result.height, type: result.type,
  }, null, 2));
} catch (error) {
  fail(error);
}
