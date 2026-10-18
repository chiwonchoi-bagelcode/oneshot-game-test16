// Finds, per island, the blizzard base speed at which bots of each profile start failing.
// node tools/calibrate.mjs [seeds]
import fs from 'node:fs';
import { checkClearable } from '../src/core/validate.js';
const balance = JSON.parse(fs.readFileSync(new URL('../src/data/balance.json', import.meta.url)));
const dir = new URL('../src/data/levels/', import.meta.url);
const files = fs.readdirSync(dir).filter((f) => /^island\d+\.json$/.test(f)).sort();
const levels = files.map((f) => JSON.parse(fs.readFileSync(new URL(f, dir))));
const seeds = +(process.argv[2] || 6);
for (let i = 0; i < levels.length; i++) {
  const lv = levels[i];
  const orig = lv.blizzard.speed;
  const out = {};
  for (const prof of (process.argv[3] ? process.argv[3].split(',') : ['good', 'average', 'novice'])) {
    // highest speed with clear rate >= 0.5 for this profile
    let lo = 200, hi = 2500;
    for (let it = 0; it < 12; it++) {
      const mid = (lo + hi) / 2;
      lv.blizzard.speed = mid;
      const r = checkClearable(levels, i, balance, { seeds, profiles: [prof] });
      if (r.profiles[prof].clearRate >= 0.5) lo = mid; else hi = mid;
    }
    out[prof] = Math.round(lo);
  }
  lv.blizzard.speed = orig;
  console.log(files[i], lv.name.en.padEnd(16), 'v50:', JSON.stringify(out), 'current', orig, 'accel', lv.blizzard.accel);
}
