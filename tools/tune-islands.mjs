// Closed-loop pacing tuner: for each island in order, find the blizzard base speed at which a
// simulated new player (learning + spending fish) first reaches the NEXT island near the target run.
// node tools/tune-islands.mjs [seeds]   (writes speeds into src/data/levels/*.json and island-specs.json)
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const outFile = path.join(root, 'node_modules/.cache/progression-sim.mjs');
await esbuild.build({ entryPoints: [path.join(root, 'tools/progression-sim.js')], bundle: true, platform: 'node', format: 'esm', outfile: outFile, loader: { '.json': 'json' }, define: { __DEV__: 'false' }, logLevel: 'error' });
const { simulate } = await import(outFile + '?' + Date.now());
const dir = path.join(root, 'src/data/levels');
const files = fs.readdirSync(dir).filter((f) => /^island\d+\.json$/.test(f)).sort();
const levels = files.map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
// run number at which island i (1-based) should first be reached
const TARGET = JSON.parse(fs.readFileSync(path.join(root, 'src/data/pacing.json'), 'utf8')).firstReachRun;
const seeds = +(process.argv[2] || 3);
const only = process.argv[3] ? +process.argv[3] : null;
const med = (a) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];
function reachRun(i) { // median run when island index i+1 is first reached (cap = limit)
  const limit = TARGET[i + 1] + 25;
  const out = [];
  for (let sd = 1; sd <= seeds; sd++) {
    const { rows } = simulate({ runs: limit, seed: sd, stopAtIsland: i + 1, levels });
    const r = rows.find((x) => x.island >= i + 2);
    out.push(r ? r.run : limit + 10);
  }
  return med(out);
}
for (let i = 0; i < levels.length - 1; i++) {
  if (only !== null && i !== only) continue;
  const want = TARGET[i + 1];
  let lo = 450, hi = 1800;
  let best = null;
  for (let it = 0; it < 9; it++) {
    const mid = Math.round((lo + hi) / 2);
    levels[i].blizzard.speed = mid;
    const got = reachRun(i);
    if (!best || Math.abs(got - want) < Math.abs(best[1] - want)) best = [mid, got];
    if (got < want) lo = mid; else hi = mid;
    if (Math.abs(got - want) <= 1) break;
  }
  levels[i].blizzard.speed = best[0];
  fs.writeFileSync(path.join(dir, files[i]), JSON.stringify(levels[i], null, 1) + '\n');
  console.log(`island ${i + 1} ${levels[i].name.en.padEnd(16)} speed ${best[0]} -> next island reached at run ${best[1]} (target ${want})`);
}
// keep the specs in sync so make-levels.mjs reproduces the tuned speeds
const specP = path.join(root, 'src/data/island-specs.json');
const spec = JSON.parse(fs.readFileSync(specP, 'utf8'));
spec.islands.forEach((s, i) => { if (levels[i]) s.blizzard.speed = levels[i].blizzard.speed; });
fs.writeFileSync(specP, JSON.stringify(spec, null, 1));
