// World = islands laid out left to right with a sea gap between them.
// Each island's terrain is a chain of keypoints joined by cosine curves (zero slope at keypoints),
// which gives the soft Tiny-Wings-like hills. Everything here is pure data + math so the same code
// runs in the game, the level editor, and the node verification tools.
import { makeRng } from './rng.js';

export const SEA_GAP = 1500;
export const SEA_LEVEL = -520;

function expandFish(level, island, ox) {
  const out = [];
  const add = (x, y, gold = false, soar = false) => out.push({ x: ox + x, y, gold, soar, taken: false, pull: 0 });
  for (const f of level.fish || []) {
    const n = Math.max(1, f.n | 0);
    if (f.type === 'arc') {
      for (let i = 0; i < n; i++) {
        const t = n === 1 ? 0.5 : i / (n - 1);
        const x = f.x + f.w * t;
        const y = f.y + f.h * 4 * t * (1 - t);
        add(x, y, !!f.gold && (f.goldAt == null ? i === Math.floor(n / 2) : i === f.goldAt));
      }
    } else if (f.type === 'line') {
      for (let i = 0; i < n; i++) {
        const t = n === 1 ? 0 : i / (n - 1);
        add(f.x + (f.x2 - f.x) * t, f.y + (f.y2 - f.y) * t, !!f.gold && i === n - 1);
      }
    } else if (f.type === 'ground') {
      const sp = f.spacing || 60;
      for (let i = 0; i < n; i++) {
        const lx = f.x + i * sp;
        add(lx, island.localHeight(lx) + (f.off || 46), false);
      }
    } else {
      add(f.x, f.y, !!f.gold, !!f.soar);
    }
  }
  return out;
}

export class Island {
  constructor(level, index, startX) {
    this.level = level;
    this.index = index; // 0-based order in the run
    this.id = level.id;
    this.biome = level.biome || 'dawn';
    this.surface = level.surface || 'snow';
    this.startX = startX;
    const pts = level.points;
    this.xs = new Float64Array(pts.length);
    this.ys = new Float64Array(pts.length);
    for (let i = 0; i < pts.length; i++) {
      this.xs[i] = startX + pts[i][0];
      this.ys[i] = pts[i][1];
    }
    this.endX = this.xs[pts.length - 1];
    this.rampX = this.xs[pts.length - 2]; // valley before the final crest
    this.length = this.endX - startX;
    this.nextStartX = this.endX + SEA_GAP;
    this.ice = (level.ice || []).map(([a, b]) => [startX + a, startX + b]).sort((p, q) => p[0] - q[0]);
    this.wind = (level.wind || []).map((w) => ({ x: startX + w.x, w: w.w, h: w.h, power: w.power || 1 }));
    this.geysers = (level.geysers || []).map((g) => ({ x: startX + g.x, used: false, t: 0 }));
    this.rings = (level.rings || []).map((r) => ({ x: startX + r.x, y: r.y, r: r.r || 90, used: false }));
    this.decor = (level.decor || []).map((d) => ({ ...d, x: startX + d.x }));
    this.blizzard = Object.assign({ speed: 700, accel: 6 }, level.blizzard || {});
    this.fish = expandFish(level, this, startX).sort((a, b) => a.x - b.x);
    this.fishTotal = this.fish.reduce((s, f) => s + (f.gold ? 10 : 1), 0);
    this._seg = 0;
  }

  localHeight(lx) {
    return this.heightAt(this.startX + lx);
  }

  _segment(x) {
    const xs = this.xs;
    let i = this._seg;
    if (i >= xs.length - 1) i = xs.length - 2;
    if (x >= xs[i] && x <= xs[i + 1]) return i;
    // binary search
    let lo = 0, hi = xs.length - 2;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (xs[mid] <= x) lo = mid; else hi = mid - 1;
    }
    this._seg = lo;
    return lo;
  }

  // returns [y, dy/dx, d2y/dx2]
  sample(x, out) {
    const xs = this.xs, ys = this.ys;
    if (x <= xs[0]) { out[0] = ys[0]; out[1] = 0; out[2] = 0; return out; }
    if (x >= this.endX) { out[0] = ys[ys.length - 1]; out[1] = 0; out[2] = 0; return out; }
    const i = this._segment(x);
    const x0 = xs[i], x1 = xs[i + 1], y0 = ys[i], y1 = ys[i + 1];
    const w = x1 - x0;
    const t = (x - x0) / w;
    const a = Math.PI * t;
    const dy = y1 - y0;
    out[0] = y0 + dy * (1 - Math.cos(a)) * 0.5;
    out[1] = dy * Math.PI * 0.5 * Math.sin(a) / w;
    out[2] = dy * Math.PI * Math.PI * 0.5 * Math.cos(a) / (w * w);
    return out;
  }

  heightAt(x) {
    return this.sample(x, _tmp)[0];
  }

  isIce(x) {
    for (const [a, b] of this.ice) {
      if (x < a) return false;
      if (x <= b) return true;
    }
    return false;
  }
}

const _tmp = [0, 0, 0];

export class World {
  // levels: ordered list of level json. generator(index) supplies extra levels for endless mode.
  constructor(levels, { startIndex = 0, generator = null } = {}) {
    this.levels = levels;
    this.generator = generator;
    this.islands = [];
    this.originIndex = startIndex;
    let x = 0;
    // Islands before the start index still exist logically (for distance numbering) but are not built.
    this.baseX = 0;
    for (let i = 0; i < startIndex && i < levels.length; i++) {
      x += levels[i].points[levels[i].points.length - 1][0] + SEA_GAP;
    }
    this.baseX = x;
    this._nextBuildIndex = startIndex;
    this._nextBuildX = x;
    this.ensureIslands(2);
    this._last = this.islands[0];
  }

  levelFor(index) {
    if (index < this.levels.length) return this.levels[index];
    if (this.generator) return this.generator(index);
    return null;
  }

  ensureIslands(count) {
    while (this.islands.length < count) {
      const lv = this.levelFor(this._nextBuildIndex);
      if (!lv) return false;
      const isl = new Island(lv, this._nextBuildIndex, this._nextBuildX);
      this.islands.push(isl);
      this._nextBuildX = isl.nextStartX;
      this._nextBuildIndex++;
    }
    return true;
  }

  // Island whose span [startX, nextStartX) contains x.
  islandAt(x) {
    const l = this._last;
    if (l && x >= l.startX && x < l.nextStartX) return l;
    for (const isl of this.islands) {
      if (x >= isl.startX && x < isl.nextStartX) { this._last = isl; return isl; }
    }
    if (this.islands.length && x < this.islands[0].startX) return this.islands[0];
    return this.islands[this.islands.length - 1];
  }

  inGap(x) {
    const isl = this.islandAt(x);
    return x > isl.endX;
  }

  sample(x, out = [0, 0, 0]) {
    const isl = this.islandAt(x);
    if (x > isl.endX) {
      out[0] = SEA_LEVEL; out[1] = 0; out[2] = 0;
      return out;
    }
    return isl.sample(x, out);
  }

  heightAt(x) {
    return this.sample(x, _tmp)[0];
  }

  // Height used for drawing: islands fall off into the sea with a cliff curve.
  drawHeightAt(x) {
    const isl = this.islandAt(x);
    if (x <= isl.endX) {
      if (x < isl.startX) return this._cliffIn(isl, x);
      return isl.heightAt(x);
    }
    const next = this.islands[this.islands.indexOf(isl) + 1];
    const d = x - isl.endX;
    const yEnd = isl.ys[isl.ys.length - 1];
    const outDrop = Math.min(1, d / 260);
    const yOut = yEnd + (SEA_LEVEL - 200 - yEnd) * (outDrop * outDrop * (3 - 2 * outDrop));
    if (!next) return yOut;
    const din = next.startX - x;
    if (din < 260) return Math.max(yOut, this._cliffIn(next, x));
    return yOut;
  }

  _cliffIn(isl, x) {
    const d = isl.startX - x;
    const y0 = isl.ys[0];
    const t = Math.min(1, Math.max(0, d / 260));
    return y0 + (SEA_LEVEL - 200 - y0) * (t * t * (3 - 2 * t));
  }
}

// Procedural island for endless mode and daily islands.
export function generateLevel(seed, opts = {}) {
  const rng = makeRng(seed);
  const hills = opts.hills || rng.int(14, 20);
  const pts = [[0, 420]];
  let x = 0;
  let base = 0;
  const amp = opts.amp || 1;
  for (let i = 0; i < hills; i++) {
    const style = rng.next();
    let w, h;
    if (style < 0.2) { w = rng.range(260, 340); h = rng.range(120, 200); } // choppy
    else if (style < 0.7) { w = rng.range(380, 560); h = rng.range(220, 380); } // regular
    else { w = rng.range(600, 820); h = rng.range(380, 560); } // big
    h *= amp;
    x += w;
    pts.push([Math.round(x), Math.round(base - h * 0.5)]);
    x += w * rng.range(0.85, 1.1);
    base = rng.range(-60, 60);
    pts.push([Math.round(x), Math.round(base + h * 0.5)]);
  }
  // ramp
  x += 520; pts.push([Math.round(x), -160]);
  x += 640; pts.push([Math.round(x), 380]);
  const fish = [];
  for (let i = 1; i < pts.length - 2; i += 2) {
    if (rng.chance(0.65)) {
      const peak = pts[i + 1];
      const hi = rng.chance(0.35);
      fish.push({ type: 'arc', x: peak[0] - 120, y: peak[1] + (hi ? 380 : 140), w: hi ? 520 : 300, h: hi ? 220 : 90, n: hi ? 9 : 6, gold: hi && rng.chance(0.5) });
    }
  }
  const ice = [];
  const wind = [];
  const geysers = [];
  const rings = [];
  if (opts.features) {
    for (let i = 1; i < pts.length - 2; i += 2) {
      const a = pts[i - 1], b = pts[i];
      const r = rng.next();
      if (opts.features.includes('ice') && r < 0.25) ice.push([a[0] + 40, b[0] - 20]);
      else if (opts.features.includes('wind') && r < 0.4) wind.push({ x: b[0] + 100, w: 260, h: 900, power: 1 });
      else if (opts.features.includes('geyser') && r < 0.5) geysers.push({ x: Math.round((a[0] + b[0]) / 2 + (b[0] - a[0]) * 0.4) });
      else if (opts.features.includes('ring') && r < 0.6) rings.push({ x: b[0] + 500, y: b[1] + 650, r: 95 });
    }
  }
  return {
    id: opts.id || 'gen_' + seed,
    generated: true,
    biome: opts.biome || 'sky',
    surface: opts.surface || 'snow',
    name: opts.name || { ko: '끝없는 하늘', en: 'Endless Sky' },
    points: pts,
    fish, ice, wind, geysers, rings,
    decor: [],
    blizzard: Object.assign({ speed: 1150, accel: 8 }, opts.blizzard || {}),
  };
}
