// node art/sheet.mjs <sheetDir> <out.png> [cols] [cell] [bg]
import fs from 'node:fs';
import path from 'node:path';
import { contactSheet } from './render.mjs';
const [dir, out, cols = 8, cell = 160, bg = '#9fc7ee'] = process.argv.slice(2);
const names = fs.readdirSync(dir).filter((f) => f.endsWith('.png')).map((f) => f.slice(0, -4)).sort();
await contactSheet(dir, names, out, { cols: +cols, cell: +cell, bg });
