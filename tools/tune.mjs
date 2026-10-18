// Quick physics tuning harness: node tools/tune.mjs
import fs from 'node:fs';
import { RunSim } from '../src/core/run.js';
import { makeBot, playRun } from '../src/core/bot.js';
const balance = JSON.parse(fs.readFileSync(new URL('../src/data/balance.json', import.meta.url)));
const dir = new URL('../src/data/levels/', import.meta.url);
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort();
const levels = files.map(f => JSON.parse(fs.readFileSync(new URL(f, dir))));
const args = process.argv.slice(2);
const ups = args[0] ? JSON.parse(args[0]) : {};
const start = +(args[1] || 0);
for (const prof of ['expert', 'good', 'average', 'novice']) {
  const res = [];
  for (let seed = 1; seed <= 6; seed++) {
    const sim = new RunSim({ levels, balance, upgrades: ups, startIndex: start, tutorial: false });
    const r = playRun(sim, makeBot(prof, seed), 400);
    res.push(r);
  }
  const avg = k => (res.reduce((s, r) => s + r[k], 0) / res.length);
  console.log(prof.padEnd(8), 'dist', avg('distance').toFixed(0).padStart(5), 'time', avg('time').toFixed(1).padStart(5),
    'isl', avg('islandsCleared').toFixed(1), 'maxH', avg('maxHeight').toFixed(0).padStart(5), 'maxV', avg('maxSpeed').toFixed(0),
    'perf', avg('perfect').toFixed(1), 'good', avg('good').toFixed(1), 'bonk', avg('bonk').toFixed(1), 'fish', avg('fishValue').toFixed(0),
    'fev', avg('fevers').toFixed(1), 'minGap', avg('minGap').toFixed(0), 'v', (avg('distance')*10/avg('time')).toFixed(0));
}
