// Island opening slope: a longer first downhill so the first hold lasts ~1 s and the first launch
// is a real soar for every kind of player (see plan.md v0.6). Shared by make-levels and the
// one-off migration below.
// node tools/opening.mjs  -> applies spec.opening to existing island files
import fs from 'node:fs';

export function applyOpening(level, opening) {
  if (!opening) return level;
  const p = level.points;
  const oldW = p[1][0], newW = opening.w, shift = newW - oldW;
  const mapX = (x) => (x < oldW ? Math.round((x * newW) / oldW) : x + shift);
  p[0] = [0, opening.y];
  for (let i = 1; i < p.length; i++) p[i] = [mapX(p[i][0]), p[i][1]];
  for (const f of level.fish || []) { f.x = mapX(f.x); if (f.x2 != null) f.x2 = mapX(f.x2); }
  for (const d of level.decor || []) if (d.type !== 'sign') d.x = mapX(d.x);
  level.ice = (level.ice || []).map(([a, b]) => [mapX(a), mapX(b)]);
  for (const k of ['wind', 'geysers', 'rings']) for (const o of level[k] || []) o.x = mapX(o.x);
  level.mapX = mapX;
  return level;
}

if (process.argv[1] && process.argv[1].endsWith('opening.mjs')) {
  const specs = JSON.parse(fs.readFileSync(new URL('../src/data/island-specs.json', import.meta.url)));
  specs.islands.forEach((spec, i) => {
    if (!spec.opening) return;
    const file = new URL(`../src/data/levels/island${String(i + 1).padStart(2, '0')}.json`, import.meta.url);
    const lv = JSON.parse(fs.readFileSync(file));
    if (lv.points[0][1] === spec.opening.y && lv.points[1][0] === spec.opening.w) { console.log(spec.id, 'already applied'); return; }
    applyOpening(lv, spec.opening);
    fs.writeFileSync(file, JSON.stringify(lv, null, 1) + '\n');
    console.log(spec.id, 'opening applied', JSON.stringify(lv.points.slice(0, 3)));
  });
}
