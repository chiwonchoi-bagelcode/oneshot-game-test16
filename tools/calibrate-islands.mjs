// Sets each island's blizzard speed so that a player with the designed upgrade state for that
// island (island-specs expect.upgrades) and the skill expected at that point (pacing.json) clears
// it on roughly `target` of attempts. Writes island-specs.json; then run make-levels.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { checkClearable } from '../src/core/validate.js';
import { BOT_PROFILES } from '../src/core/bot.js';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const balance = JSON.parse(fs.readFileSync(path.join(root, 'src/data/balance.json')));
const pacing = JSON.parse(fs.readFileSync(path.join(root, 'src/data/pacing.json')));
const specP = path.join(root, 'src/data/island-specs.json');
const spec = JSON.parse(fs.readFileSync(specP));
const dir = path.join(root, 'src/data/levels');
const files = fs.readdirSync(dir).filter((f) => /^island\d+\.json$/.test(f)).sort();
const levels = files.map((f) => JSON.parse(fs.readFileSync(path.join(dir, f))));
const N = BOT_PROFILES.novice, G = BOT_PROFILES.good;
const seeds = +(process.argv[2] || 12);
for (let i = 0; i < levels.length; i++) {
  const run = pacing.firstReachRun[i];
  const k = pacing.skillMax * (1 - Math.exp(-(run - 1) / pacing.learnTau));
  const prof = {}; for (const key of Object.keys(N)) prof[key] = N[key] + (G[key] - N[key]) * k;
  BOT_PROFILES['p' + i] = prof;
  const ups = spec.islands[i].expect.upgrades;
  const target = pacing.clearTarget[i];
  let lo = 300, hi = 2600, best = null;
  for (let it = 0; it < 10; it++) {
    const mid = Math.round((lo + hi) / 2);
    levels[i].blizzard.speed = mid;
    const r = checkClearable(levels, i, balance, { seeds, profiles: ['p' + i], upgrades: ups });
    const c = r.profiles['p' + i].clearRate;
    if (!best || Math.abs(c - target) < Math.abs(best[1] - target)) best = [mid, c];
    if (c > target) lo = mid; else hi = mid;
  }
  spec.islands[i].blizzard.speed = best[0];
  console.log(`island ${i + 1} skill ${k.toFixed(2)} ups ${JSON.stringify(ups)} -> speed ${best[0]} (clear ${Math.round(best[1] * 100)}%, target ${Math.round(target * 100)}%)`);
}
fs.writeFileSync(specP, JSON.stringify(spec, null, 1));
