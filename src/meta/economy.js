// Meta rules: fish income and sinks, upgrades, village growth, records, island goals, feature
// unlocks and the gentle assist when a player is stuck. Pure functions over the save state.
import balance from '../data/balance.json';
import village from '../data/village.json';
import daily from '../data/daily.json';
import { now, dayKey, daysBetween } from './save.js';

export const UPGRADE_KEYS = ['flap', 'slide', 'magnet', 'glide', 'scarf'];
const UPM = balance.display.unitsPerMeter;

const round5 = (v) => (v < 50 ? Math.round(v) : Math.round(v / 5) * 5);

export function upgradeCost(key, level) {
  const u = balance.upgrades[key];
  return round5(u.baseCost * Math.pow(u.costGrowth, level));
}

export function upgradeUnlocked(state, key) {
  const u = balance.upgrades[key].unlock;
  if (u.runs !== undefined && state.runs < u.runs) return false;
  if (u.island !== undefined && state.bestIsland < u.island - 1) return false;
  return true;
}

export function upgradeUnlockText(key) {
  const u = balance.upgrades[key].unlock;
  if (u.island !== undefined) return ['up.unlock.island', { n: u.island }];
  return ['up.unlock.runs', { n: u.runs }];
}

// what the player sees: value shown in the card (percent or meters or count)
export function upgradeDisplay(key, level) {
  const v = balance.upgrades[key].values[Math.min(level, balance.upgrades[key].maxLevel)];
  if (key === 'magnet') return Math.round(v / UPM);
  if (key === 'scarf') return v;
  return Math.round(v * 100);
}

export function canAfford(state, cost) { return state.fish >= cost; }

export function buyUpgrade(state, key) {
  const lv = state.upgrades[key] || 0;
  const u = balance.upgrades[key];
  if (lv >= u.maxLevel || !upgradeUnlocked(state, key)) return null;
  const cost = upgradeCost(key, lv);
  if (state.fish < cost) return null;
  state.fish -= cost;
  state.spent += cost;
  state.upgrades[key] = lv + 1;
  bumpMission(state, 'upgrade', 1);
  return { key, level: lv + 1, cost };
}

export function anyUpgradeAffordable(state) {
  return UPGRADE_KEYS.some((k) => upgradeUnlocked(state, k) && (state.upgrades[k] || 0) < balance.upgrades[k].maxLevel && state.fish >= upgradeCost(k, state.upgrades[k] || 0));
}

export function cheapestUpgradeCost(state) {
  let best = Infinity;
  for (const k of UPGRADE_KEYS) {
    if (!upgradeUnlocked(state, k) || (state.upgrades[k] || 0) >= balance.upgrades[k].maxLevel) continue;
    best = Math.min(best, upgradeCost(k, state.upgrades[k] || 0));
  }
  return best;
}

// ---------------------------------------------------------------- village
export const BUILDINGS = village.buildings;
export const BUILDING = Object.fromEntries(BUILDINGS.map((b) => [b.id, b]));

export function isBuilt(state, id) { return !!state.village.built[id]; }

export function availableBuildings(state) {
  return BUILDINGS.filter((b) => !isBuilt(state, b.id) && (!b.after || isBuilt(state, b.after)))
    .sort((a, b) => a.cost - b.cost);
}

export function buildingKey(b) {
  // i18n key root and description vars
  const type = b.type;
  const vars = {};
  if (type === 'fishrack' || type === 'rack2') vars.n = b.effect.rackPerHour;
  return { name: `b.${type}.name`, desc: `b.${type}.desc`, vars };
}

export function build(state, id) {
  const b = BUILDING[id];
  if (!b || isBuilt(state, id) || (b.after && !isBuilt(state, b.after)) || state.fish < b.cost) return null;
  state.fish -= b.cost;
  state.spent += b.cost;
  state.village.built[id] = now(state);
  const events = [];
  if (b.effect.family) {
    state.village.eggs.push({ id: id + '_egg', laidRun: state.runs, at: now(state) });
    events.push('family');
  }
  if (b.effect.rackPerHour && !state.village.rackAt) state.village.rackAt = now(state);
  bumpMission(state, 'build', 1);
  return { id, cost: b.cost, events };
}

export function cheapestBuildCost(state) {
  const a = availableBuildings(state);
  return a.length ? a[0].cost : Infinity;
}

export function anyBuildAffordable(state) {
  return availableBuildings(state).some((b) => state.fish >= b.cost);
}

export function iglooCount(state) {
  return BUILDINGS.filter((b) => b.effect.family && isBuilt(state, b.id)).length;
}

export function babies(state) { return state.village.babies; }

// growth stage of a hatched baby from the days since it hatched
export function babyStage(state, baby) {
  const d = daysBetween(baby.day, dayKey(now(state)));
  if (d >= 3) return 'adult';
  if (d >= 1) return 'juv';
  return 'baby';
}

export function population(state) {
  return iglooCount(state) * 2 + state.village.babies.length;
}

export function villagePct(state) {
  let p = Math.round(population(state) * balance.economy.populationBonusPerPenguin * 100);
  for (const b of BUILDINGS) if (isBuilt(state, b.id) && b.effect.fishPct) p += b.effect.fishPct;
  return p;
}

export function villageStage(state) {
  const n = Object.keys(state.village.built).length;
  let s = 0;
  village.stages.forEach((th, i) => { if (n >= th) s = i; });
  return s;
}

export function rackRate(state) {
  let r = 0;
  for (const b of BUILDINGS) if (isBuilt(state, b.id) && b.effect.rackPerHour) r = Math.max(r, b.effect.rackPerHour);
  return r;
}

export function rackAmount(state) {
  const r = rackRate(state);
  if (!r || !state.village.rackAt) return 0;
  const hours = Math.min(daily.rack.capHours, Math.max(0, (now(state) - state.village.rackAt) / 3600000));
  return Math.floor(hours * r);
}

export function collectRack(state) {
  const n = rackAmount(state);
  if (n <= 0) return 0;
  state.fish += n;
  state.earned += n;
  state.village.rackAt = now(state);
  return n;
}

// eggs laid before the last run hatch now
export function hatchEggs(state) {
  const hatched = [];
  const kinds = ['va', 'vb', 'vc', 'vd'];
  state.village.eggs = state.village.eggs.filter((e) => {
    if (state.runs > e.laidRun) {
      const b = { id: e.id, day: dayKey(now(state)), kind: kinds[(state.village.babies.length) % kinds.length] };
      state.village.babies.push(b);
      hatched.push(b);
      return false;
    }
    return true;
  });
  return hatched;
}

// ---------------------------------------------------------------- run results
export function hasEffect(state, key) {
  return BUILDINGS.some((b) => isBuilt(state, b.id) && b.effect[key]);
}

export function isWeekend(state) {
  const d = new Date(now(state)).getDay();
  return d === 0 || d === 6;
}

export function festivalOn(state) { return hasEffect(state, 'festival') && isWeekend(state); }

export function runRewards(state, res) {
  const E = balance.economy;
  const lines = [];
  const collected = res.stats.fishValue;
  lines.push({ key: 'res.fishCollected', v: collected });
  const traveled = Math.max(0, res.traveledM);
  const dist = Math.floor(traveled * E.distanceFishPerMeter);
  if (dist > 0) lines.push({ key: 'res.fishDistance', v: dist });
  const height = res.stats.milestoneFish;
  if (height > 0) lines.push({ key: 'res.fishHeight', v: height });
  let island = 0;
  for (const idx of res.newIslands) island += E.islandFirstBonus[Math.min(idx + 1, E.islandFirstBonus.length - 1)] || 0;
  if (island > 0) lines.push({ key: 'res.fishIsland', v: island });
  let sub = collected + dist + height + island;
  const pct = villagePct(state);
  if (pct > 0) {
    const add = Math.round(sub * pct / 100);
    if (add > 0) lines.push({ key: 'res.fishVillage', vars: { p: pct }, v: add });
    sub += add;
  }
  if (hasEffect(state, 'firstRunDouble') && state.daily.firstRunDay !== dayKey(now(state)) && sub > 0) {
    lines.push({ key: 'res.fishHotspring', v: Math.round(sub * (daily.hotspringMul - 1)) });
    sub = Math.round(sub * daily.hotspringMul);
  }
  if (festivalOn(state) && sub > 0) {
    lines.push({ key: 'res.fishFestival', v: Math.round(sub * (daily.festivalMul - 1)) });
    sub = Math.round(sub * daily.festivalMul);
  }
  return { lines, total: Math.round(sub) };
}

export function assistLevel(state, startIndex) {
  const f = state.fails;
  const A = daily.assist;
  if (f.island < 0 || f.count < A.afterFails) return 0;
  return Math.min(A.max, (f.count - A.afterFails + 1) * A.step);
}

// Applies a finished run to the save. Returns what the results screen needs to celebrate.
export function applyRun(state, res, levels, mode = 'main') {
  const out = { newBest: false, prevBestM: Math.floor(state.bestUnits / UPM), newIslands: [], unlocks: [], hatched: [], goals: [] };
  const today = dayKey(now(state));
  state.runs++;
  out.firstRunToday = state.daily.firstRunDay !== today;
  if (mode === 'main') {
    // islands reached during this run
    for (let i = res.startIndex; i <= res.islandIndex; i++) {
      const rec = state.islands[i] || (state.islands[i] = { reached: false, cleared: false, best: 0, goals: {} });
      if (!rec.reached) { rec.reached = true; if (i > 0) out.newIslands.push(i); }
      if (i < res.islandIndex) rec.cleared = true;
    }
    const cur = state.islands[res.islandIndex];
    cur.best = Math.max(cur.best || 0, res.progress);
    if (res.islandIndex > state.bestIsland) state.bestIsland = res.islandIndex;
    if (res.distanceUnits > state.bestUnits) { out.newBest = state.bestUnits > 0; state.bestUnits = res.distanceUnits; }
    // stuck tracking -> assist
    if (res.islandsCleared === 0 && res.islandIndex === state.bestIsland) {
      if (state.fails.island === res.islandIndex) state.fails.count++; else { state.fails.island = res.islandIndex; state.fails.count = 1; }
    } else if (res.islandsCleared > 0) {
      state.fails = { island: -1, count: 0 };
    }
    // island goals (per-island stats from the run)
    for (const [idxStr, st] of Object.entries(res.islandStats || {})) {
      const idx = +idxStr;
      const lv = levels[idx];
      if (!lv || !lv.goals) continue;
      const rec = state.islands[idx];
      if (!rec) continue;
      lv.goals.forEach((g, gi) => {
        if (rec.goals[gi]) return;
        let ok = false;
        if (g.type === 'fish') ok = st.fishValue >= g.n;
        if (g.type === 'perfect') ok = st.perfect >= g.n;
        if (g.type === 'height') ok = st.maxHeight / UPM >= g.n;
        if (g.type === 'gold') ok = st.gold >= g.n;
        if (g.type === 'fever') ok = st.fevers >= g.n;
        if (g.type === 'rings') ok = st.rings >= g.n;
        if (ok) {
          rec.goals[gi] = true;
          const reward = goalReward(idx);
          out.goals.push({ island: idx, goal: g, reward });
        }
      });
    }
  }
  const rw = runRewards(state, { ...res, newIslands: out.newIslands });
  for (const g of out.goals) rw.total += g.reward;
  out.rewards = rw;
  state.fish += rw.total;
  state.earned += rw.total;
  state.daily.firstRunDay = today;
  // lifetime stats
  state.stats.perfects += res.stats.perfect;
  state.stats.fevers += res.stats.fevers;
  state.stats.maxHeightM = Math.max(state.stats.maxHeightM, Math.floor(res.stats.maxHeight / UPM));
  state.stats.distanceM += Math.floor(res.traveledM);
  // daily missions
  bumpMission(state, 'fish', res.stats.fishValue);
  bumpMission(state, 'perfect', res.stats.perfect);
  bumpMission(state, 'runs', 1);
  bumpMission(state, 'fever', res.stats.fevers);
  bumpMission(state, 'gold', res.stats.gold);
  maxMission(state, 'height', Math.floor(res.stats.maxHeight / UPM));
  maxMission(state, 'distance', Math.floor(res.traveledM));
  maxMission(state, 'island', res.islandIndex + 1);
  // eggs hatch after a run
  out.hatched = hatchEggs(state);
  out.unlocks = checkUnlocks(state);
  return out;
}

export function goalReward(islandIndex) { return 30 + islandIndex * 25; }

// ---------------------------------------------------------------- unlocks
export const FEATURES = {
  upgrades: (s) => s.runs >= 1,
  village: (s) => s.runs >= 1,
  missions: (s) => s.runs >= daily.missions.unlockRuns,
  map: (s) => s.bestIsland >= 1 || isBuilt(s, 'lighthouse'),
  today: (s) => s.bestIsland >= daily.today.unlockIsland - 1 || s.daily.days >= daily.today.unlockDay,
  streak: (s) => s.daily.days >= 2,
  slide: (s) => upgradeUnlocked(s, 'slide'),
  magnet: (s) => upgradeUnlocked(s, 'magnet'),
  glide: (s) => upgradeUnlocked(s, 'glide'),
  scarf: (s) => upgradeUnlocked(s, 'scarf'),
};

export function checkUnlocks(state) {
  const fresh = [];
  for (const [k, fn] of Object.entries(FEATURES)) {
    if (!state.unlocked[k] && fn(state)) { state.unlocked[k] = now(state); fresh.push(k); }
  }
  return fresh;
}

export function featureOn(state, k) { return !!state.unlocked[k]; }

// ---------------------------------------------------------------- missions helpers
export function bumpMission(state, type, n) {
  const m = state.daily.missions;
  if (!m || !m.list) return;
  for (const it of m.list) if (it.type === type && !it.single) it.progress = Math.min(it.target, it.progress + n);
}

export function maxMission(state, type, v) {
  const m = state.daily.missions;
  if (!m || !m.list) return;
  for (const it of m.list) if (it.type === type) it.progress = Math.min(it.target, Math.max(it.progress, v));
}

export function startPushOn(state) { return hasEffect(state, 'startPush'); }
