// Event trace of one bot run: node tools/trace.mjs <profile> '<upgrades json>' <startIndex>
import fs from 'node:fs';
import { RunSim } from '../src/core/run.js';
import { makeBot } from '../src/core/bot.js';
const balance = JSON.parse(fs.readFileSync(new URL('../src/data/balance.json', import.meta.url)));
const dir = new URL('../src/data/levels/', import.meta.url);
const levels = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort().map(f => JSON.parse(fs.readFileSync(new URL(f, dir))));
const prof = process.argv[2] || 'expert';
const ups = process.argv[3] ? JSON.parse(process.argv[3]) : {};
const sim = new RunSim({ levels, balance, upgrades: ups, startIndex: +(process.argv[4] || 0) });
const bot = makeBot(prof, 1);
while (sim.state !== 'caught' && sim.time < 300) {
  const pr = bot(sim);
  sim.step(1 / 120, pr);
  for (const e of sim.drainEvents()) {
    const p = sim.p;
    console.log(e.t.toFixed(2), e.type.padEnd(11), 'x', p.x.toFixed(0).padStart(6), 'y', p.y.toFixed(0).padStart(5),
      's', (p.ground ? p.s : Math.hypot(p.vx, p.vy)).toFixed(0).padStart(5), 'gap', sim.gap.toFixed(0).padStart(5), ' ',
      Object.entries(e).filter(([k]) => !['t', 'type'].includes(k)).map(([k, v]) => k + '=' + (typeof v === 'number' ? v.toFixed(2) : v)).join(' '));
  }
}
