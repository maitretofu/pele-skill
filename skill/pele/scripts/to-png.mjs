#!/usr/bin/env node
// to-png.mjs — rastérise un SVG (déjà résolu des var(), cf. render.mjs) en PNG.
//
// Usage:
//   node to-png.mjs <diagram.svg> --out diagram.png [--width 1200] [--background "#fffcf0"]
//
// Sortie stdout (JSON unique) :
//   { ok: true, pngPath, width, height }
//
// --width   largeur cible en pixels (défaut : 2x la largeur naturelle du SVG,
//           borné entre 640 et 2400). Le PNG reste net : la densité de
//           rastérisation est calculée avant rendu, jamais redimensionné après.
// --background  couleur du fond (le SVG de Pele n'a pas de rectangle de fond ;
//           reprendre le champ "background" du JSON de render.mjs).

import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

function readArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--out') args.out = argv[++i];
    else if (argv[i] === '--width') args.width = parseInt(argv[++i], 10);
    else if (argv[i] === '--background') args.background = argv[++i];
    else if (argv[i] === '--help' || argv[i] === '-h') args.help = true;
    else args.file = argv[i];
  }
  return args;
}

const args = readArgs(process.argv.slice(2));
if (args.help || !args.file || !args.out) {
  console.log(readFileSync(new URL(import.meta.url)).toString().match(/\/\*[\s\S]*?\*\//)[0]);
  process.exit(!args.file || !args.out ? 1 : 0);
}

function fail(message) {
  process.stdout.write(JSON.stringify({ ok: false, message }, null, 2));
  process.exit(1);
}

try {
  const svg = readFileSync(args.file);
  const natural = parseInt(svg.toString().match(/width="(\d+(?:\.\d+)?)"/)?.[1] ?? '0', 10);
  const target = args.width ?? Math.min(2400, Math.max(640, natural * 2));
  const density = Math.round(72 * (target / natural || 1));

  const png = await sharp(svg, { density })
    .flatten({ background: args.background ?? '#ffffff' })
    .png()
    .toBuffer();

  const meta = await sharp(png).metadata();
  writeFileSync(args.out, png);
  process.stdout.write(JSON.stringify({
    ok: true, pngPath: args.out, width: meta.width, height: meta.height,
  }, null, 2));
} catch (error) {
  fail(String(error));
}
