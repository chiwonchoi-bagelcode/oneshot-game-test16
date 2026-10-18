// Auto players. Used for level verification, balance simulation, the title-screen demo and
// trailer capture. Profiles model players of different skill: reaction delay and timing noise.
import { forecastLanding, makeGhost, ghostStep } from './run.js';
import { makeRng } from './rng.js';

export const BOT_PROFILES = {
  expert: { delay: 0.03, lead: 0.05, noise: 0.0, holdUpChance: 0.0, earlyRelease: 0.0, airSmart: 1.0, plan: true },
  good: { delay: 0.08, lead: 0.05, noise: 0.04, holdUpChance: 0.05, earlyRelease: 0.05, airSmart: 0.85 },
  average: { delay: 0.14, lead: 0.04, noise: 0.08, holdUpChance: 0.15, earlyRelease: 0.12, airSmart: 0.6 },
  novice: { delay: 0.22, lead: 0.02, noise: 0.14, holdUpChance: 0.35, earlyRelease: 0.25, airSmart: 0.25 },
};

const tmp = [0, 0, 0];

export function makeBot(profileName = 'good', seed = 1) {
  const prof = typeof profileName === 'string' ? BOT_PROFILES[profileName] : profileName;
  const rng = makeRng(seed);
  const queue = []; // [time, press] decisions waiting for the reaction delay
  let current = false;
  let hillMistake = 0; // >0: hold too long on this upslope; <0: release early on this downslope
  let lastGroundSign = 0;
  let airDecision = null;
  let airTimer = 0;

  // Model-predictive choice: try a few input patterns ~1s ahead and keep the best.
  const PLANS = [[1, 1, 30], [0, 0, 30], [1, 0, 30], [0, 1, 30], [1, 0, 70], [0, 1, 70]];
  let planHold = 0, planPress = false;
  function plan(sim) {
    planHold -= 1 / 120;
    if (planHold > 0) return planPress;
    planHold = 0.08;
    let best = -1e18, bestPress = false;
    for (const [a, b, sw] of PLANS) {
      const g = makeGhost(sim);
      let bonks = 0, perfect = 0;
      const n = 200;
      for (let i = 0; i < n; i++) {
        const pr = (i < sw ? a : b) === 1;
        const wasAir = !g.p.ground;
        ghostStep(g, 1 / 120, pr);
        if (wasAir && g.p.ground && g.p.lastLand === 'bonk') bonks++;
        if (wasAir && g.p.ground && g.p.lastLand === 'perfect') perfect++;
      }
      const sp = g.p.ground ? g.p.s : Math.hypot(g.p.vx, g.p.vy);
      let score = g.p.x + sp * 0.7 - bonks * 1500 + perfect * 300;
      if (!g.p.ground) {
        const f = forecastLanding(g, false, 2.5);
        if (f.bonk) score -= 1200; else if (f.perfect) score += 250;
      }
      if (score > best) { best = score; bestPress = a === 1; }
    }
    planPress = bestPress;
    return planPress;
  }

  function desired(sim) {
    const p = sim.p;
    if (sim.state !== 'run') return false;
    if (prof.plan) return plan(sim);
    if (p.ground) {
      airDecision = null;
      const lead = Math.max(0, prof.lead + (rng.next() - 0.5) * prof.noise);
      sim.island.sample(p.x + p.s * lead, tmp);
      const slopeAhead = tmp[1];
      const sign = slopeAhead < -0.015 ? -1 : 1;
      if (sign !== lastGroundSign) {
        lastGroundSign = sign;
        hillMistake = 0;
        if (sign > 0 && rng.chance(prof.holdUpChance)) hillMistake = rng.range(0.1, 0.45);
        if (sign < 0 && rng.chance(prof.earlyRelease)) hillMistake = -rng.range(0.1, 0.35);
      }
      if (sign < 0) {
        if (hillMistake < 0) {
          sim.island.sample(p.x, tmp);
          // release early: let go while still on the downslope
          if (tmp[1] > -0.35 + hillMistake) return false;
        }
        return true;
      }
      if (hillMistake > 0) { hillMistake -= 1 / 120; return true; }
      return false;
    }
    // airborne: decide whether diving gives a better landing
    airTimer -= 1 / 120;
    if (airDecision === null || airTimer <= 0) {
      airTimer = 0.1;
      if (rng.next() > prof.airSmart) {
        airDecision = p.vy < -200 && rng.chance(0.5);
      } else {
        const free = forecastLanding(sim, false);
        const dive = forecastLanding(sim, true);
        const score = (f) => (f.past ? 3 : f.none ? 0.5 : f.perfect ? 2.5 : f.bonk ? -2 : (f.slope < 0 ? 1 : 0));
        const sf = score(free), sd = score(dive);
        airDecision = sd > sf + 0.01;
      }
    }
    return airDecision;
  }

  return function control(sim) {
    const want = desired(sim);
    queue.push([sim.time + prof.delay, want]);
    while (queue.length && queue[0][0] <= sim.time) current = queue.shift()[1];
    return current;
  };
}

// Drive a sim until it ends. Returns a summary.
export function playRun(sim, control, maxTime = 600, onStep = null) {
  const dt = 1 / 120;
  let presses = 0, last = false;
  while (sim.state !== 'caught' && sim.time < maxTime) {
    const press = control(sim);
    if (press && !last) presses++;
    last = press;
    sim.step(dt, press);
    if (onStep) onStep(sim, press);
  }
  return {
    time: sim.time,
    distance: sim.distanceMeters,
    islandsCleared: sim.islandsCleared,
    island: sim.island.index,
    presses,
    ...sim.stats,
  };
}
