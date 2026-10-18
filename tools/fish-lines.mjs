// "First soar" fish line: the first big flight on every island (right after the start) gets a line
// of fish along the trajectory most players actually fly, so the first wow moment of a run is also
// a reward. Trajectories come from the same RunSim + human-like bot used everywhere else.
import { RunSim } from '../src/core/run.js';
import { makeBot } from '../src/core/bot.js';

function firstFlight(level, levelsBefore, balance, ups, seed, prof = 'good') {
  const sim = new RunSim({ levels: [...levelsBefore, level], balance, upgrades: ups, startIndex: levelsBefore.length });
  sim.blizzardHold = 1e9;
  const bot = makeBot(prof, seed);
  let pts = null;
  for (let i = 0; i < 120 * 30 && sim.state === 'run'; i++) {
    sim.step(1 / 120, bot(sim));
    const p = sim.p;
    if (!p.ground) {
      if (!pts) pts = [];
      if (i % 3 === 0) pts.push([p.x - sim.island.startX, p.y, p.y - sim.island.heightAt(p.x)]);
    } else if (pts) {
      if (Math.max(...pts.map((q) => q[2])) >= 250) return pts;
      pts = null;
    }
  }
  return null;
}

function lineAlong(path, max) {
  const fish = [];
  let rising = true, prevY = -1e9;
  for (const [x, y, h] of path) {
    if (y < prevY) rising = false;
    prevY = y;
    if (h < (rising ? 70 : 110)) { if (!rising) break; continue; }
    if (fish.length && Math.hypot(x - fish[fish.length - 1].x, y - fish[fish.length - 1].y) < 95) continue;
    fish.push({ type: 'single', x: Math.round(x), y: Math.round(y), soar: 1 });
    if (fish.length >= max) break;
  }
  return fish;
}

// how many of these fish a flight passes within pick-up range of
function catches(fish, flight, r = 66) {
  let n = 0;
  for (const f of fish) if (flight.some((q) => (q[0] - f.x) ** 2 + (q[1] - f.y) ** 2 < r * r)) n++;
  return n;
}

export function firstSoarFish(level, levelsBefore, balance, ups, { seeds = 10, max = 14 } = {}) {
  const flights = [];
  for (const [prof, n] of [['good', seeds], ['average', seeds], ['novice', Math.ceil(seeds / 2)]]) {
    for (let s = 1; s <= n; s++) {
      const f = firstFlight(level, levelsBefore, balance, ups, s * 13, prof);
      if (f) flights.push({ f, x0: f[0][0] });
    }
  }
  if (!flights.length) return [];
  // the most common first flight (same takeoff hill as most players)
  const byHill = {};
  for (const fl of flights) (byHill[Math.round(fl.x0 / 400)] ||= []).push(fl);
  const group = Object.values(byHill).sort((a, b) => b.length - a.length)[0];
  // Paths share the takeoff and then fan out by speed. Lay a line along three representative
  // paths (slow, typical, fast launch): everyone flies close to one of them, and the high path,
  // being longer, carries more fish ("higher = more fish").
  group.sort((p, q) => Math.max(...p.f.map((w) => w[2])) - Math.max(...q.f.map((w) => w[2])));
  const fish = [];
  for (const qt of [0.5, 0.9]) {
    const ref = group[Math.min(group.length - 1, Math.floor(qt * group.length))].f;
    let rising = true, prevY = -1e9, last = null;
    for (const [x, y, h] of ref) {
      if (y < prevY) rising = false;
      prevY = y;
      if (h < (rising ? 70 : 110)) { if (!rising) break; continue; }
      if (last && Math.hypot(x - last[0], y - last[1]) < 105) continue;
      last = [x, y];
      if (fish.some((f) => Math.hypot(f.x - x, f.y - y) < 120)) continue;
      fish.push({ type: 'single', x: Math.round(x), y: Math.round(y), soar: 1 });
      if (fish.length >= max) break;
    }
  }
  return fish.sort((a, b) => a.x - b.x);
}

// put the soar line into a level: loose single fish in the same stretch of sky are removed so the
// two lines read clearly (ground fish and the golden high-road arcs stay)
export function applySoarFish(level, line) {
  level.fish = level.fish.filter((f) => !f.soar);
  if (line.length) {
    const x0 = Math.min(...line.map((f) => f.x)) - 80, x1 = Math.max(...line.map((f) => f.x)) + 80;
    level.fish = level.fish.filter((f) => f.type !== 'single' || f.x < x0 || f.x > x1);
  }
  level.fish.push(...line);
  level.fish.sort((a, b) => a.x - b.x);
}
