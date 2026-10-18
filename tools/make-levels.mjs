// Level authoring assistant. Builds the base island files from section specs, then places fish
// along (and above) trajectories that a reference bot actually flies, so every fish line is
// reachable by real play and the "high road" fish need a better launch or stronger wings.
// Run: node tools/make-levels.mjs  (overwrites src/data/levels/island*.json)
// Hand edits made later in the level editor should be saved over these files; re-running this tool
// regenerates from the specs below.
import fs from 'node:fs';
import { makeRng } from '../src/core/rng.js';
import { RunSim } from '../src/core/run.js';
import { makeBot } from '../src/core/bot.js';

const balance = JSON.parse(fs.readFileSync(new URL('../src/data/balance.json', import.meta.url)));
const SPECS = JSON.parse(fs.readFileSync(new URL('../src/data/island-specs.json', import.meta.url)));

const SECTIONS = {
  gentle: { w: [560, 620], h: [360, 420] },
  regular: { w: [580, 680], h: [440, 540] },
  tall: { w: [640, 720], h: [560, 660] },
  big: { w: [860, 960], h: [720, 820] },
  choppy: { w: [300, 360], h: [170, 230] },
  long: { w: [1250, 1400], h: [880, 980] },
  stairs: { w: [520, 600], h: [300, 380] },
  cloud: { w: [700, 820], h: [380, 480] },
};

function buildPoints(spec, rng) {
  const pts = [[0, spec.startY ?? 520]];
  let x = 0;
  let base = 0;
  const hillRanges = []; // [xValleyStart(crest), xValley, xCrest, type]
  for (const [type, count] of spec.sections) {
    const S = SECTIONS[type];
    for (let i = 0; i < count; i++) {
      const w = rng.range(S.w[0], S.w[1]);
      let h = rng.range(S.h[0], S.h[1]) * (spec.amp || 1);
      const crestPrev = pts[pts.length - 1];
      if (type === 'stairs') {
        // rising crests, shallow valleys
        const vY = crestPrev[1] - h * 0.55;
        x += w * 0.8; pts.push([Math.round(x), Math.round(vY)]);
        x += w * 0.8; pts.push([Math.round(x), Math.round(crestPrev[1] + 110)]);
      } else {
        base += rng.range(-40, 40);
        base = Math.max(-120, Math.min(120, base));
        const vY = base - h * 0.5;
        x += w; pts.push([Math.round(x), Math.round(vY)]);
        x += w * rng.range(0.9, 1.08);
        pts.push([Math.round(x), Math.round(base + h * 0.5)]);
      }
      hillRanges.push({ crest: crestPrev[0], valley: pts[pts.length - 2][0], next: pts[pts.length - 1][0], type });
    }
  }
  // end ramp: drop then a long rise to a tall crest
  x += 640; pts.push([Math.round(x), -200]);
  x += 820; pts.push([Math.round(x), 700]);
  return { pts, hillRanges };
}

function referenceTrails(level, levelsBefore, ups, seeds = 4) {
  const trails = [];
  for (let s = 1; s <= seeds; s++) {
    const sim = new RunSim({ levels: [...levelsBefore, level], balance, upgrades: ups, startIndex: levelsBefore.length });
    sim.blizzardHold = 1e9; // ignore blizzard while sampling paths
    const bot = makeBot('good', s * 7);
    const pts = [];
    let t = 0;
    while (sim.state === 'run' && t < 200) {
      sim.step(1 / 120, bot(sim));
      t += 1 / 120;
      if (!sim.p.ground && ((t * 120) | 0) % 6 === 0) pts.push([sim.p.x - sim.island.startX, sim.p.y, sim.p.y - sim.island.heightAt(sim.p.x)]);
    }
    trails.push(pts);
  }
  return trails;
}

function placeFish(level, spec, trails, hillRanges, rng, strong) {
  const fish = [];
  const islLen = level.points[level.points.length - 1][0];
  // 1) trail fish: along a reference flight, short arcs of 5-7 where the flight is clearly airborne.
  //    Alternate between the expected-strength trail and a stronger one (the reason to upgrade).
  const tr = trails[0];
  trailFish(fish, tr, spec, islLen, 400, spec.trailGap || 900);
  if (strong) trailFish(fish, strong, spec, islLen, 400 + (spec.trailGap || 900) / 2, (spec.trailGap || 900) * 1.6, 60);
  return finishFish(fish, level, spec, hillRanges, rng);
}

function trailFish(fish, tr, spec, islLen, startX, gap, minH = 120) {
  let lastX = startX;
  for (let i = 0; i < tr.length; i++) {
    const [x, y, h] = tr[i];
    if (x < lastX + gap || h < minH || x > islLen - 900) continue;
    // keep away from fish already placed
    if (fish.some((f) => f.type === 'single' && Math.abs(f.x - x) < 260)) continue;
    const seg = [];
    for (let j = i; j < tr.length && seg.length < 7; j++) {
      if (tr[j][2] < 80) break;
      if (!seg.length || tr[j][0] - seg[seg.length - 1][0] >= 70) seg.push(tr[j]);
    }
    if (seg.length >= 4) {
      for (const [fx, fy] of seg) fish.push({ type: 'single', x: Math.round(fx), y: Math.round(fy) });
      lastX = seg[seg.length - 1][0];
      i += 6;
    }
  }
}

function finishFish(fish, level, spec, hillRanges, rng) {
  // 2) ground fish on some downslopes (rewarding a held slide)
  for (const hr of hillRanges) {
    if (rng.chance(spec.groundFish ?? 0.35) && hr.valley - hr.crest > 450) {
      const n = Math.floor((hr.valley - hr.crest) / 120);
      fish.push({ type: 'ground', x: Math.round(hr.crest + 120), n: Math.min(6, n), spacing: 90, off: 52 });
    }
  }
  // 3) high road: arcs well above typical flights, golden fish at the apex
  const highs = spec.highArcs || 0;
  const cands = hillRanges.filter((h) => h.type === 'big' || h.type === 'tall' || h.type === 'long');
  for (let k = 0; k < highs && cands.length; k++) {
    const hr = cands.splice(rng.int(0, cands.length - 1), 1)[0];
    const crestY = level.points.find((p) => p[0] === hr.next)?.[1] ?? 300;
    const lift = spec.highLift || 620;
    fish.push({ type: 'arc', x: Math.round(hr.next + 80), y: Math.round(crestY + lift), w: 760, h: 260, n: 9, gold: true });
  }
  return fish;
}

function placeFeatures(level, spec, hillRanges, trails, rng) {
  const f = spec.features || {};
  level.ice = []; level.wind = []; level.geysers = []; level.rings = [];
  const startAt = spec.featureStart || 2;
  hillRanges.forEach((hr, i) => {
    if (i < startAt) return;
    if (f.ice && rng.chance(f.ice)) level.ice.push([Math.round(hr.crest + 60), Math.round(hr.valley + 40)]);
    if (f.wind && rng.chance(f.wind)) level.wind.push({ x: Math.round(hr.valley - 160), w: 320, h: 1500, power: 1 });
    if (f.geyser && rng.chance(f.geyser)) level.geysers.push({ x: Math.round(hr.crest + (hr.valley - hr.crest) * 0.72) });
  });
  if (f.ring) {
    const tr = trails[1] || trails[0];
    let last = 1200;
    for (const [x, y, h] of tr) {
      if (x > last + 1700 && h > 260 && rng.chance(f.ring)) {
        level.rings.push({ x: Math.round(x + 220), y: Math.round(y + 220), r: 100 });
        last = x;
      }
    }
  }
}

function placeDecor(level, spec, rng) {
  const decor = [];
  const len = level.points[level.points.length - 1][0];
  decor.push({ type: 'sign', x: 200 });
  const kinds = spec.decor || ['rock'];
  for (let x = 500; x < len - 600; x += rng.range(260, 620)) {
    decor.push({ type: rng.pick(kinds), x: Math.round(x), s: +rng.range(0.8, 1.2).toFixed(2), v: rng.int(0, 2) });
  }
  decor.push({ type: 'flag', x: len - 40 });
  return decor;
}

const out = [];
const outDir = new URL('../src/data/levels/', import.meta.url);
for (const [idx, spec] of SPECS.islands.entries()) {
  const rng = makeRng(spec.seed || (1000 + idx * 77));
  const { pts, hillRanges } = buildPoints(spec, rng);
  const level = {
    id: spec.id,
    name: spec.name,
    biome: spec.biome,
    surface: spec.surface || 'snow',
    intro: spec.intro || null,
    points: pts,
    fish: [],
    blizzard: spec.blizzard,
    expect: spec.expect,
    goals: spec.goals,
  };
  // features first (they change flights), then sample trails, then fish
  let trails = referenceTrails(level, out, spec.expect.upgrades, 2);
  placeFeatures(level, spec, hillRanges, trails, rng);
  trails = referenceTrails(level, out, spec.expect.upgrades, 2);
  // a second, stronger trail (a few upgrades later) so the high road also has fish
  const stronger = {};
  for (const k of ['flap', 'slide', 'glide']) stronger[k] = ((spec.expect.upgrades || {})[k] || 0) + 2;
  const strongTrails = referenceTrails(level, out, stronger, 1);
  level.fish = placeFish(level, spec, trails, hillRanges, rng, strongTrails[0]);
  level.decor = placeDecor(level, spec, rng);
  out.push(level);
  const file = `island${String(idx + 1).padStart(2, '0')}.json`;
  fs.writeFileSync(new URL(file, outDir), JSON.stringify(level, null, 1) + '\n');
  const len = pts[pts.length - 1][0];
  console.log(file, spec.id, 'hills', hillRanges.length, 'len', len, 'fish entries', level.fish.length,
    'ice', level.ice.length, 'wind', level.wind.length, 'geyser', level.geysers.length, 'rings', level.rings.length);
}
