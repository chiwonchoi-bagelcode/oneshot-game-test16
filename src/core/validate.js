// Level validation shared by tools/verify-levels.mjs and the level editor.
// 1) structure checks  2) clearability with bots using the island's expected upgrades.
import { RunSim } from './run.js';
import { makeBot, playRun } from './bot.js';

export function checkStructure(level) {
  const errors = [], warnings = [];
  const pts = level.points || [];
  if (pts.length < 4) errors.push('points: need at least 4 keypoints');
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i - 1][0];
    if (dx <= 0) errors.push(`points[${i}]: x must increase (${pts[i - 1][0]} -> ${pts[i][0]})`);
    else if (dx < 140) warnings.push(`points[${i}]: segment very short (${dx})`);
    const slope = Math.PI / 2 * Math.abs(pts[i][1] - pts[i - 1][1]) / Math.max(1, dx);
    if (slope > 2.4) warnings.push(`points[${i}]: very steep (max slope ${slope.toFixed(2)})`);
  }
  const len = pts.length ? pts[pts.length - 1][0] : 0;
  if (pts.length > 2 && pts[pts.length - 1][1] < pts[pts.length - 2][1] + 300) warnings.push('end ramp: last keypoint should be a tall crest (launch ramp)');
  for (const [a, b] of level.ice || []) if (!(a < b) || a < 0 || b > len) errors.push(`ice [${a},${b}] out of range`);
  for (const w of level.wind || []) if (w.x < 0 || w.x + w.w > len) errors.push(`wind at ${w.x} out of range`);
  for (const g of level.geysers || []) if (g.x < 0 || g.x > len) errors.push(`geyser at ${g.x} out of range`);
  for (const f of level.fish || []) {
    if (f.x < 0 || f.x > len) errors.push(`fish at ${f.x} out of range`);
  }
  if (!level.blizzard || !(level.blizzard.speed > 0)) errors.push('blizzard.speed missing');
  if (!level.name || !level.name.ko || !level.name.en) errors.push('name.ko / name.en missing');
  return { errors, warnings };
}

// Runs bots on one island. levels = full ordered level list, index = island to test.
export function checkClearable(levels, index, balance, { seeds = 6, profiles = ['expert', 'good', 'average', 'novice'], upgrades = null } = {}) {
  const lv = levels[index];
  const ups = upgrades || (lv.expect && lv.expect.upgrades) || {};
  const result = { id: lv.id, index, upgrades: ups, profiles: {} };
  for (const prof of profiles) {
    let clears = 0, time = 0, fish = 0, prog = 0, perfect = 0, bonk = 0, height = 0;
    for (let s = 1; s <= seeds; s++) {
      const sim = new RunSim({ levels: levels.slice(0, index + 1), balance, upgrades: ups, startIndex: index });
      const isl = sim.island;
      const r = playRun(sim, makeBot(prof, s * 31 + index), 400);
      const cleared = r.islandsCleared > 0 || sim.p.x >= isl.endX - 5;
      if (cleared) clears++;
      time += r.time; fish += r.fishValue; perfect += r.perfect; bonk += r.bonk; height += r.maxHeight;
      prog += Math.min(1, (sim.p.x - isl.startX) / isl.length);
    }
    result.profiles[prof] = {
      clearRate: clears / seeds,
      avgTime: time / seeds,
      avgFish: fish / seeds,
      avgProgress: prog / seeds,
      avgPerfect: perfect / seeds,
      avgBonk: bonk / seeds,
      avgMaxHeightM: height / seeds / balance.display.unitsPerMeter,
    };
  }
  const sim = new RunSim({ levels: levels.slice(0, index + 1), balance, startIndex: index });
  result.fishAvailable = sim.island.fishTotal;
  result.lengthM = Math.round(sim.island.length / balance.display.unitsPerMeter);
  const P = result.profiles;
  result.pass = (P.good ? P.good.clearRate >= 0.8 : true) && (P.expert ? P.expert.clearRate >= 1 : true);
  result.notes = [];
  if (P.good && P.good.clearRate < 0.8) result.notes.push('too hard: good player with expected upgrades clears < 80%');
  if (P.average && P.average.clearRate > 0.95 && index > 0) result.notes.push('maybe too easy: average player always clears');
  if (P.average && P.average.clearRate < 0.2) result.notes.push('steep: average player rarely clears (upgrades or practice needed)');
  return result;
}
