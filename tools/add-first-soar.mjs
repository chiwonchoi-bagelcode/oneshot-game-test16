// Adds (or refreshes) the "first soar" fish line on every island file in src/data/levels/.
// Existing fish too close to the new line are left alone and the new fish skip them.
// node tools/add-first-soar.mjs [--check]   (--check only reports how many players catch them)
import fs from 'node:fs';
import { firstSoarFish, applySoarFish } from './fish-lines.mjs';
import { RunSim } from '../src/core/run.js';
import { makeBot } from '../src/core/bot.js';

const balance = JSON.parse(fs.readFileSync(new URL('../src/data/balance.json', import.meta.url)));
const dir = new URL('../src/data/levels/', import.meta.url);
const files = fs.readdirSync(dir).filter((f) => /^island\d+\.json$/.test(f)).sort();
const levels = files.map((f) => JSON.parse(fs.readFileSync(new URL(f, dir))));
const check = process.argv.includes('--check');

function caught(levelsAll, i, prof, seed) {
  const lv = levelsAll[i];
  const sim = new RunSim({ levels: levelsAll.slice(0, i + 1), balance, upgrades: (lv.expect && lv.expect.upgrades) || {}, startIndex: i });
  sim.blizzardHold = 1e9;
  const soar = sim.island.fish.filter((f) => f.soar);
  const bot = makeBot(prof, seed);
  for (let k = 0; k < 120 * 12 && sim.state === 'run'; k++) sim.step(1 / 120, bot(sim));
  return [soar.filter((f) => f.taken).length, soar.length];
}

for (let i = 0; i < levels.length; i++) {
  const lv = levels[i];
  if (!check) {
    const ups = (lv.expect && lv.expect.upgrades) || {};
    applySoarFish(lv, firstSoarFish({ ...lv, fish: lv.fish.filter((f) => !f.soar) }, levels.slice(0, i), balance, ups));
    fs.writeFileSync(new URL(files[i], dir), JSON.stringify(lv, null, 1) + '\n');
  }
  const res = {};
  for (const prof of ['good', 'average', 'novice']) {
    let got = 0, three = 0;
    for (let s = 1; s <= 12; s++) { const [g] = caught(levels, i, prof, s); got += g; if (g >= 3) three++; }
    res[prof] = `avg ${(got / 12).toFixed(1)}, ${three}/12 got 3+`;
  }
  console.log(files[i], 'soar fish', lv.fish.filter((f) => f.soar).length, JSON.stringify(res));
}
