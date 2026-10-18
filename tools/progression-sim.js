// Simulates a new player over many runs with the real sim + real meta rules:
// skill grows with practice (novice -> good), fish are spent greedily on upgrades and buildings.
// Bundled by tools/run-sim.mjs (esbuild) because src uses JSON imports.
import balance from '../src/data/balance.json';
import { LEVELS } from '../src/data/levels.js';
import { RunSim } from '../src/core/run.js';
import { makeBot, playRun } from '../src/core/bot.js';
import { freshState } from '../src/meta/save.js';
import * as E from '../src/meta/economy.js';
import { onNewDayCheck } from '../src/meta/daily.js';
import { endlessGenerator } from '../src/core/endless.js';
import pacing from '../src/data/pacing.json';

const UPM = balance.display.unitsPerMeter;
const P = { novice: { delay: 0.22, lead: 0.02, noise: 0.14, holdUpChance: 0.35, earlyRelease: 0.25, airSmart: 0.25 }, good: { delay: 0.08, lead: 0.05, noise: 0.04, holdUpChance: 0.05, earlyRelease: 0.05, airSmart: 0.85 } };
function skill(k) {
  const o = {};
  for (const key of Object.keys(P.novice)) o[key] = P.novice[key] + (P.good[key] - P.novice[key]) * k;
  return o;
}

export function simulate({ runs = 60, seed = 1, learnRuns = 25, skillMax = 0.75, minutesPerDay = 30, verbose = false, startPolicy = 'best', stopAtIsland = null, levels = null } = {}) {
  const LV = levels || LEVELS;
  const s = freshState();
  s.playerId = 'sim' + seed;
  onNewDayCheck(s);
  const rows = [];
  let minutes = 0, day = 1;
  for (let r = 1; r <= runs; r++) {
    const k = pacing.skillMax * (1 - Math.exp(-(r - 1) / pacing.learnTau));
    const prof = skill(k);
    const lighthouse = E.isBuilt(s, 'lighthouse');
    const startIndex = lighthouse && startPolicy === 'best' ? Math.min(s.bestIsland, LV.length - 1) : 0;
    const sim = new RunSim({
      levels: LV, balance, upgrades: { ...s.upgrades }, startIndex, tutorial: r === 1,
      assist: E.assistLevel(s, startIndex), modifiers: E.startPushOn(s) ? { startSpeedMul: 3.4 } : {}, generator: endlessGenerator(LV),
    });
    const res0 = playRun(sim, makeBot(prof, seed * 1000 + r), 900);
    let startX = 0;
    for (let i = 0; i < startIndex; i++) startX += LV[i].points[LV[i].points.length - 1][0] + 1500;
    const res = {
      distance: sim.distanceMeters, distanceUnits: sim.p.x, stats: sim.stats, islandIndex: sim.island.index, islandsCleared: sim.islandsCleared,
      startIndex, progress: Math.max(0, Math.min(1, (sim.p.x - sim.island.startX) / sim.island.length)), island: sim.island, time: sim.time,
      traveledM: (sim.p.x - startX) / UPM, islandStats: sim.islandStats,
    };
    const fishBefore = s.fish;
    const applied = E.applyRun(s, res, LV, 'main');
    // spend: upgrades first (cheapest unlocked), then buildings, until nothing is affordable
    const bought = [];
    for (let guard = 0; guard < 40; guard++) {
      const up = E.UPGRADE_KEYS.filter((key) => E.upgradeUnlocked(s, key) && s.upgrades[key] < balance.upgrades[key].maxLevel)
        .map((key) => [key, E.upgradeCost(key, s.upgrades[key])]).sort((a, b) => a[1] - b[1])[0];
      const bd = E.availableBuildings(s)[0];
      const choice = up && (!bd || up[1] <= bd.cost * 1.3) ? 'up' : bd ? 'bd' : null;
      if (choice === 'up' && s.fish >= up[1]) { E.buyUpgrade(s, up[0]); bought.push(up[0]); continue; }
      if (choice === 'bd' && s.fish >= bd.cost) { E.build(s, bd.id); bought.push(bd.id); continue; }
      if (bd && s.fish >= bd.cost) { E.build(s, bd.id); bought.push(bd.id); continue; }
      if (up && s.fish >= up[1]) { E.buyUpgrade(s, up[0]); bought.push(up[0]); continue; }
      break;
    }
    minutes += res.time / 60 + 0.35; // + results/meta screens
    if (minutes > day * minutesPerDay) { day++; s.dayOffset = day - 1; onNewDayCheck(s); }
    rows.push({
      run: r, day, min: Math.round(minutes), skill: +k.toFixed(2), start: startIndex + 1, island: res.islandIndex + 1, prog: Math.round(res.progress * 100),
      dist: res.distance, time: Math.round(res.time), earned: s.fish - fishBefore + 0, total: applied.rewards.total, ups: { ...s.upgrades },
      built: Object.keys(s.village.built).length, pop: E.population(s), bought: bought.join(','), assist: E.assistLevel(s, 0),
    });
    if (stopAtIsland !== null && s.bestIsland >= stopAtIsland) break;
  }
  return { rows, state: s };
}
