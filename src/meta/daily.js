// Day-based systems: daily gift streak, today's tasks, Island of the Day. A new day is detected
// at boot and whenever the app comes back to the foreground.
import daily from '../data/daily.json';
import { now, dayKey, daysBetween } from './save.js';
import { makeRng, hashString } from '../core/rng.js';
import { generateLevel } from '../core/world.js';

export function onNewDayCheck(state) {
  const today = dayKey(now(state));
  const d = state.daily;
  const events = [];
  if (d.lastDay !== today) {
    const gap = d.lastDay ? daysBetween(d.lastDay, today) : 0;
    if (!d.lastDay) { d.streak = 1; }
    else if (gap === 1) d.streak += 1;
    else if (gap > 1) { d.streak = 1; d.cycle = 0; }
    d.lastDay = today;
    d.days = (d.days || 0) + 1;
    events.push({ type: 'newDay', gap });
    genMissions(state, today);
    d.today = { day: today, best: 0, cleared: false, claimed: false };
  }
  if (!d.missions || d.missions.day !== today) genMissions(state, today);
  if (!d.today || d.today.day !== today) d.today = { day: today, best: 0, cleared: false, claimed: false };
  return events;
}

// gift is available once per day from the second play day on
export function streakClaimable(state) {
  return state.daily.days >= 2 && state.daily.claimedDay !== dayKey(now(state));
}

export function streakRewards() { return daily.streak; }

export function claimStreak(state) {
  if (!streakClaimable(state)) return 0;
  const idx = state.daily.cycle % daily.streak.length;
  const v = daily.streak[idx];
  state.fish += v;
  state.earned += v;
  state.daily.cycle++;
  state.daily.claimedDay = dayKey(now(state));
  return { amount: v, index: idx };
}

function tierOf(state) { return Math.min(8, state.bestIsland || 0); }

export function genMissions(state, today) {
  const rng = makeRng(hashString('m' + today + (state.playerId || '')));
  const pool = daily.missions.pool.slice();
  const tier = tierOf(state);
  const list = [];
  // prefer play missions; at most one meta mission (build/upgrade)
  let meta = 0;
  while (list.length < daily.missions.perDay && pool.length) {
    const i = Math.floor(rng.next() * pool.length);
    const m = pool.splice(i, 1)[0];
    const isMeta = m.type === 'build' || m.type === 'upgrade';
    if (isMeta && meta >= 1) continue;
    if (isMeta) meta++;
    let target = Math.round(m.base + m.perTier * tier);
    if (m.type === 'distance') target = Math.round(target / 100) * 100;
    if (m.type === 'fish' || m.type === 'height') target = Math.round(target / 10) * 10;
    list.push({ type: m.type, target, progress: 0, reward: Math.round(m.reward * (1 + tier * 0.25) / 5) * 5, claimed: false, single: !!m.single });
  }
  state.daily.missions = { day: today, list, bonusClaimed: false };
}

export function missionsClaimable(state) {
  const m = state.daily.missions;
  if (!m) return 0;
  let n = m.list.filter((x) => x.progress >= x.target && !x.claimed).length;
  if (!m.bonusClaimed && m.list.every((x) => x.claimed)) n++;
  return n;
}

export function claimMission(state, i) {
  const m = state.daily.missions;
  const it = m && m.list[i];
  if (!it || it.claimed || it.progress < it.target) return 0;
  it.claimed = true;
  state.fish += it.reward;
  state.earned += it.reward;
  return it.reward;
}

export function claimMissionBonus(state) {
  const m = state.daily.missions;
  if (!m || m.bonusClaimed || !m.list.every((x) => x.claimed)) return 0;
  m.bonusClaimed = true;
  state.fish += daily.missions.allDoneBonus;
  state.earned += daily.missions.allDoneBonus;
  return daily.missions.allDoneBonus;
}

// ---------------------------------------------------------------- Island of the Day
export function todayInfo(state) {
  const today = dayKey(now(state));
  const seed = hashString('island' + today);
  const rng = makeRng(seed);
  const mod = daily.today.mods[Math.floor(rng.next() * daily.today.mods.length)];
  const tier = tierOf(state);
  const biomes = ['dawn', 'pine', 'lake', 'wind', 'sunset', 'geyser', 'aurora', 'cloud', 'stars'];
  const biome = biomes[Math.floor(rng.next() * Math.min(biomes.length, tier + 3))];
  const reward = daily.today.rewardBase + daily.today.rewardPerTier * tier;
  return { seed, mod, tier, biome, reward, day: today };
}

export function todayLevel(state) {
  const info = todayInfo(state);
  const features = info.mod === 'ice' ? ['ice', 'ice'] : info.mod === 'wind' ? ['wind'] : info.tier >= 3 ? ['ice', 'wind'] : [];
  const lv = generateLevel(info.seed, {
    id: 'today_' + info.day,
    biome: info.biome,
    surface: info.biome === 'cloud' ? 'cloud' : 'snow',
    hills: 16 + Math.min(8, info.tier),
    amp: info.mod === 'big' ? 1.3 : info.mod === 'choppy' ? 0.7 : 1,
    features,
    name: { ko: '오늘의 섬', en: 'Island of the Day' },
    blizzard: { startGap: 1300, speed: 520 + info.tier * 75, accel: 6 },
  });
  if (info.mod === 'gold') for (const f of lv.fish) if (f.type === 'arc') f.gold = true;
  return { level: lv, info };
}
