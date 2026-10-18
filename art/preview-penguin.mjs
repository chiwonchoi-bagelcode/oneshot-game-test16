// Quick visual check of the penguin rig: node art/preview-penguin.mjs <outPng>
import { penguinSVG, penguinFrames, villagerFrames } from './penguin.mjs';
import { renderSVGs, contactSheet } from './render.mjs';
import os from 'node:os';
import path from 'node:path';
const out = process.argv[2] || 'penguin_sheet.png';
const tmp = path.join(path.dirname(out), 'pengtmp');
const frames = { ...penguinFrames(), ...(process.argv[3] ? villagerFrames() : {}) };
const items = Object.entries(frames).map(([name, pose]) => ({ name, svg: penguinSVG(pose), w: 384, h: 384 }));
await renderSVGs(items, tmp);
await contactSheet(tmp, items.map((i) => i.name), out, { cols: 6, cell: 220 });
console.log('wrote', out);
