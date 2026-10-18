// Verifies every island: structure + clearable by bots with the expected upgrades.
// node tools/verify-levels.mjs [--seeds N] [--json out.json]
import fs from 'node:fs';
import { checkStructure, checkClearable } from '../src/core/validate.js';

const balance = JSON.parse(fs.readFileSync(new URL('../src/data/balance.json', import.meta.url)));
const dir = new URL('../src/data/levels/', import.meta.url);
const files = fs.readdirSync(dir).filter((f) => /^island\d+\.json$/.test(f)).sort();
const levels = files.map((f) => JSON.parse(fs.readFileSync(new URL(f, dir))));
const argv = process.argv.slice(2);
const seeds = argv.includes('--seeds') ? +argv[argv.indexOf('--seeds') + 1] : 6;
const jsonOut = argv.includes('--json') ? argv[argv.indexOf('--json') + 1] : null;
const only = argv.includes('--only') ? +argv[argv.indexOf('--only') + 1] : null;

let failed = 0;
const report = [];
for (let i = 0; i < levels.length; i++) {
  if (only !== null && i !== only) continue;
  const lv = levels[i];
  const st = checkStructure(lv);
  const cl = checkClearable(levels, i, balance, { seeds });
  const ok = st.errors.length === 0 && cl.pass;
  if (!ok) failed++;
  report.push({ file: files[i], structure: st, clear: cl, ok });
  const P = cl.profiles;
  const fmt = (p) => p ? `${Math.round(p.clearRate * 100)}% ${p.avgTime.toFixed(0)}s prog${Math.round(p.avgProgress * 100)} f${p.avgFish.toFixed(0)}` : '-';
  console.log(`${ok ? 'PASS' : 'FAIL'} ${files[i]} ${lv.name.en.padEnd(16)} ${String(cl.lengthM).padStart(5)}m fish${String(cl.fishAvailable).padStart(4)} | expert ${fmt(P.expert)} | good ${fmt(P.good)} | avg ${fmt(P.average)} | novice ${fmt(P.novice)}`);
  for (const e of st.errors) console.log('   error:', e);
  for (const w of st.warnings) console.log('   warn :', w);
  for (const n of cl.notes) console.log('   note :', n);
}
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(report, null, 1));
console.log(failed ? `${failed} island(s) failed` : 'all islands clearable');
process.exit(failed ? 1 : 0);
