// node tools/run-sim.mjs [runs] [seeds]  -> progression table (bundles tools/progression-sim.js with esbuild)
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const outFile = path.join(root, 'node_modules/.cache/progression-sim.mjs');
fs.mkdirSync(path.dirname(outFile), { recursive: true });
await esbuild.build({ entryPoints: [path.join(root, 'tools/progression-sim.js')], bundle: true, platform: 'node', format: 'esm', outfile: outFile, loader: { '.json': 'json' }, define: { __DEV__: 'false' }, logLevel: 'error' });
const { simulate } = await import(outFile + '?' + Date.now());
const runs = +(process.argv[2] || 60), seeds = +(process.argv[3] || 3);
const all = [];
for (let sd = 1; sd <= seeds; sd++) all.push(simulate({ runs, seed: sd }).rows);
if (process.argv.includes('--table')) {
  for (const r of all[0]) console.log(`#${String(r.run).padStart(2)} d${r.day} ${String(r.min).padStart(3)}min sk${r.skill.toFixed(2)} start${r.start} -> isl${r.island} ${String(r.prog).padStart(3)}% ${String(r.dist).padStart(5)}m ${String(r.time).padStart(3)}s +${String(r.total).padStart(4)} ups f${r.ups.flap} s${r.ups.slide} m${r.ups.magnet} g${r.ups.glide} c${r.ups.scarf} built${r.built} pop${r.pop} [${r.bought}]`);
}
// summary: runs and minutes to first reach each island (median over seeds)
const firstReach = {};
for (const rows of all) {
  const seen = {};
  for (const r of rows) for (let i = 1; i <= r.island; i++) if (!seen[i]) { seen[i] = r; (firstReach[i] = firstReach[i] || []).push([r.run, r.min]); }
}
const med = (a) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];
console.log('island  first-reach run (median)  minutes (median)  reached by seeds');
for (const [i, v] of Object.entries(firstReach)) console.log(`  ${String(i).padStart(2)}      ${String(med(v.map((x) => x[0]))).padStart(4)}                    ${String(med(v.map((x) => x[1]))).padStart(4)}             ${v.length}/${seeds}`);
const last = all.map((rows) => rows[rows.length - 1]);
console.log('after', runs, 'runs: minutes', last.map((r) => r.min).join(','), '| buildings', last.map((r) => r.built).join(','), '| ups', last.map((r) => JSON.stringify(r.ups)).join(' '));
