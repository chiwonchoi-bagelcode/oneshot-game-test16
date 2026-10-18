// How much do upgrades change average speed / height for each bot profile on a given island?
import fs from 'node:fs';
import { RunSim } from '../src/core/run.js';
import { makeBot, playRun } from '../src/core/bot.js';
const balance = JSON.parse(fs.readFileSync(new URL('../src/data/balance.json', import.meta.url)));
const dir = new URL('../src/data/levels/', import.meta.url);
const levels = fs.readdirSync(dir).filter((f) => /^island\d+\.json$/.test(f)).sort().map((f) => JSON.parse(fs.readFileSync(new URL(f, dir))));
const isl = +(process.argv[2] || 0);
const sets = [{}, { flap: 1 }, { flap: 2 }, { flap: 2, slide: 1 }, { flap: 3, slide: 2, glide: 1 }, { flap: 5, slide: 4, glide: 2 }, { flap: 7, slide: 6, glide: 4 }, { flap: 10, slide: 10, glide: 8 }];
for (const prof of process.argv[3] ? [process.argv[3]] : ['good', 'average', 'novice']) {
  for (const ups of sets) {
    let v = 0, h = 0, t = 0, f = 0, n = 6, perf = 0, bonk = 0;
    for (let s = 1; s <= n; s++) {
      const sim = new RunSim({ levels: levels.slice(0, isl + 1), balance, upgrades: ups, startIndex: isl });
      sim.blizzardHold = 1e9;
      const r = playRun(sim, makeBot(prof, s), 300);
      v += (sim.p.x - sim.world.islands[0].startX) / r.time; h += r.maxHeight; t += r.time; f += r.fishValue; perf += r.perfect; bonk += r.bonk;
    }
    console.log(prof.padEnd(8), JSON.stringify(ups).padEnd(36), 'avgV', (v / n).toFixed(0).padStart(5), 'maxH', (h / n / 10).toFixed(0).padStart(4) + 'm', 'time', (t / n).toFixed(1), 'fish', (f / n).toFixed(0), 'perf', (perf/n).toFixed(1), 'bonk', (bonk/n).toFixed(1));
  }
}
