// One run (판) of Penguin Slide. Pure simulation: no rendering, no DOM, deterministic for a given
// input sequence. The game, the bots, the level editor and the node tools all drive this class.
import { World, SEA_GAP } from './world.js';

export const STEP = 1 / 120;

const tmp = [0, 0, 0];

export function upgradeValue(balance, key, level) {
  const u = balance.upgrades[key];
  if (!u) return 0;
  const lv = Math.max(0, Math.min(u.maxLevel, level | 0));
  return u.values[lv];
}

export class RunSim {
  constructor({ levels, balance, upgrades = {}, startIndex = 0, tutorial = false, assist = 0, generator = null, modifiers = {} }) {
    this.balance = balance;
    this.P = balance.physics;
    this.world = new World(levels, { startIndex, generator });
    this.modifiers = modifiers;
    this.up = {
      flap: upgradeValue(balance, 'flap', upgrades.flap),
      slide: upgradeValue(balance, 'slide', upgrades.slide),
      magnet: upgradeValue(balance, 'magnet', upgrades.magnet),
      glide: upgradeValue(balance, 'glide', upgrades.glide),
      scarf: upgradeValue(balance, 'scarf', upgrades.scarf),
    };
    const sl = Math.max(0, Math.min(5, upgrades.scarf | 0));
    this.scarfPush = (balance.upgrades.scarf.pushback || [])[sl] || 800;
    this.scarfCharges = this.up.scarf;
    this.assist = assist;
    this.tutorial = tutorial;
    this.time = 0;
    this.state = 'run'; // run | crossing | caught
    this.events = [];
    this.island = this.world.islands[0];
    this.islandTime = 0;
    this.islandsCleared = 0;
    this.startIndex = startIndex;

    const isl = this.island;
    // starting deeper in the journey: the village gives you a running start
    const startMul = Math.max(modifiers.startSpeedMul || 1, startIndex > 0 ? 2.6 : 1);
    // with a running start, begin partway down the first slope (past the crest's curve) so the
    // first thing that happens is a slide, not an accidental hop
    const fast = startMul > 1.5;
    const sx0 = fast ? isl.startX + (isl.xs[1] - isl.xs[0]) * 0.56 : isl.startX + 4;
    const p = {
      x: sx0, y: 0, vx: 0, vy: 0, s: this.P.startSpeed * startMul,
      ground: true, press: false, stun: 0, air: 0, fever: 0, chain: 0,
      flightMax: 0, milestone: 0, lastLand: null, angle: 0, slope: 0, ice: false,
    };
    p.y = isl.heightAt(p.x);
    isl.sample(p.x, tmp);
    p.slope = tmp[1];
    this.p = p;
    this.blizzardX = p.x - this.startGapFor(isl);
    this.blizzardV = 0;
    this.blizzardHold = tutorial ? balance.blizzard.tutorialDelay : balance.blizzard.startHold;
    this.crossing = null;
    this.fishIndex = 0;
    this.pulling = [];
    this.stats = {
      fish: 0, gold: 0, fishValue: 0, perfect: 0, good: 0, bonk: 0, fevers: 0, maxHeight: 0,
      maxSpeed: 0, airTime: 0, groundTime: 0, pressUp: 0, pressDown: 0, releaseDown: 0, releaseUp: 0,
      milestoneFish: 0, rings: 0, geysers: 0, secondWinds: 0, closeCalls: 0, minGap: 1e9,
      hills: 0,
    };
    this._wasDanger = false;
    this.islandStats = {};
    this.istat = this._istat(this.island.index);
  }

  _istat(i) {
    return this.islandStats[i] || (this.islandStats[i] = { fishValue: 0, gold: 0, perfect: 0, fevers: 0, rings: 0, maxHeight: 0 });
  }

  // The chase is measured in time, not distance: the same seconds of breathing room on every
  // island, whether the blizzard moves at 500 or 1600 units/s.
  blizzardBase(isl = this.island) { return Math.max(300, isl.blizzard.speed * (1 - this.assist) * (this.modifiers.blizzardMul || 1)); }
  maxGap(isl = this.island) { return this.balance.blizzard.maxGapSec * this.blizzardBase(isl); }
  dangerGap(isl = this.island) { return this.balance.blizzard.dangerSec * this.blizzardBase(isl); }
  startGapFor(isl) { return (isl.blizzard.startGapSec || this.balance.blizzard.startGapSec) * this.blizzardBase(isl); }

  get distanceUnits() { return this.p.x; }
  get distanceMeters() { return Math.max(0, Math.floor(this.p.x / this.balance.display.unitsPerMeter)); }
  get gap() { return this.p.x - this.blizzardX; }
  get heightAboveGround() { return this.p.ground ? 0 : this.p.y - this.world.heightAt(this.p.x); }

  emit(type, data = {}) {
    this.events.push({ type, t: this.time, ...data });
  }

  drainEvents() {
    const e = this.events;
    this.events = [];
    return e;
  }

  maxSpeed() {
    const P = this.P;
    return P.maxSpeed * (1 + this.up.slide * 0.6) * (this.p.fever > 0 ? P.feverSpeedMul : 1);
  }

  step(dt, press) {
    this.time += dt;
    const p = this.p;
    p.press = press;
    if (this.state === 'caught') return;
    if (this.state === 'crossing') { this._stepCrossing(dt); return; }
    this.islandTime += dt;
    if (p.stun > 0) p.stun -= dt;
    if (p.fever > 0) {
      p.fever -= dt;
      if (p.fever <= 0) { p.fever = 0; this.emit('feverEnd'); }
    }
    if (p.ground) this._stepGround(dt, press); else this._stepAir(dt, press);
    this._collect();
    this._objects(dt);
    this._blizzard(dt);
    const sp = Math.hypot(p.vx, p.vy);
    if (sp > this.stats.maxSpeed) this.stats.maxSpeed = sp;
    if (p.x >= this.island.endX && this.state === 'run') this._startCrossing();
  }

  _stepGround(dt, press) {
    const P = this.P, p = this.p, isl = this.island;
    isl.sample(p.x, tmp);
    let d = tmp[1];
    const dd = tmp[2];
    const cos = 1 / Math.sqrt(1 + d * d);
    const sin = d * cos;
    const ice = isl.isIce(p.x) || this.modifiers.allIce;
    p.ice = ice;
    const cloud = isl.surface === 'cloud';
    const effPress = press && p.stun <= 0;
    let g = P.gravity;
    if (effPress) {
      g *= P.pressGravityMul;
      if (d < 0) g *= 1 + this.up.slide;
      if (d < 0 && ice) g *= P.iceAccelMul;
    }
    let fr = P.groundFriction * (ice ? P.iceFrictionMul : 1) * (cloud ? 1.4 : 1);
    let a = -g * sin - fr - P.groundDrag * (1 - this.up.slide) * p.s * p.s;
    // launch ramp at the island's end: a boost lane that always carries you over the sea
    if (p.x > isl.rampX && d > 0) {
      a = Math.max(a, 900);
      if (p.s < 1500) p.s = Math.min(1500, p.s + 3000 * dt);
      p.onRamp = true;
    }
    p.s += a * dt;
    const ms = this.maxSpeed();
    if (p.s > ms) p.s = ms - (p.s - ms) * 0.5;
    if (p.s < P.minSpeed) p.s = P.minSpeed;
    // statistics for the post-run tip
    this.stats.groundTime += dt;
    if (d > 0.08) { if (press) this.stats.pressUp += dt; else this.stats.releaseUp += dt; }
    else if (d < -0.08) { if (press) this.stats.pressDown += dt; else this.stats.releaseDown += dt; }
    // leave the ground when the hill curves away faster than gravity can hold us
    const kappa = -dd / Math.pow(1 + d * d, 1.5);
    const normal = g * cos - p.s * p.s * kappa;
    if (normal < 0) {
      this._takeoff(cos, sin);
      return;
    }
    p.x += p.s * cos * dt;
    isl.sample(p.x, tmp);
    p.y = tmp[0];
    p.slope = tmp[1];
    p.vx = p.s * cos;
    p.vy = p.s * sin;
  }

  _takeoff(cos, sin) {
    const p = this.p;
    p.ground = false;
    p.vx = p.s * cos;
    p.vy = p.s * sin;
    let flapV = 0;
    if (this.up.flap > 0 && sin > -0.05) {
      // a wing flap at the lip: mostly up, a little forward. Scales with launch speed, so a
      // badly timed (slow) launch gets little out of it.
      flapV = this.up.flap * p.s * Math.max(0.15, sin + 0.25);
      p.vy += flapV;
      p.vx += this.up.flap * p.s * 0.3;
    }
    p.air = 0;
    p.flightMax = 0;
    p.milestone = 0;
    p.takeoffX = p.x;
    p.takeoffY = p.y;
    p.flapV = flapV;
    p.launchSpeed = p.s;
    p.announced = false;
  }

  _stepAir(dt, press) {
    const P = this.P, p = this.p, isl = this.island;
    let g = P.gravity;
    if (press) g *= P.airPressGravityMul;
    else if (p.vy < 0 && this.up.glide > 0) g *= 1 - this.up.glide;
    p.y += p.vy * dt - 0.5 * g * dt * dt;
    p.vy -= g * dt;
    // wind columns lift a released penguin
    if (!press) {
      for (const w of isl.wind) {
        if (p.x >= w.x && p.x <= w.x + w.w) {
          const gy = isl.heightAt(p.x);
          if (p.y < gy + w.h) {
            p.vy += P.windAccel * w.power * dt;
            if (p.vy > 1500) p.vy = 1500;
            if (!w._inside && !this.ghost) { w._inside = true; this.emit('wind', { x: p.x }); }
          }
        } else if (!this.ghost) w._inside = false;
      }
    }
    const sp = Math.hypot(p.vx, p.vy);
    const drag = 1 - P.airDrag * (1 - this.up.glide) * sp * dt;
    p.vx *= drag; p.vy *= drag;
    if (p.vx < P.minSpeed * 0.6) p.vx = P.minSpeed * 0.6;
    p.x += p.vx * dt;
    p.air += dt;
    this.stats.airTime += dt;
    const gy = this.world.heightAt(p.x);
    const h = p.y - gy;
    if (!p.announced && p.air > 0.07 && h > 6) {
      p.announced = true;
      this.stats.hills++;
      this.emit('takeoff', { speed: p.launchSpeed, angle: Math.atan2(p.vy, p.vx), flap: p.flapV || 0 });
    }
    if (h > p.flightMax) {
      p.flightMax = h;
      if (h > this.stats.maxHeight) this.stats.maxHeight = h;
      if (!this.ghost && h > this.istat.maxHeight) this.istat.maxHeight = h;
      const ms = P.heightMilestones;
      const upm = this.balance.display.unitsPerMeter;
      while (p.milestone < ms.length && h >= ms[p.milestone] * upm) {
        const bonus = P.heightMilestoneFish[p.milestone];
        this.stats.milestoneFish += bonus;
        this.emit('height', { meters: ms[p.milestone], bonus, level: p.milestone });
        p.milestone++;
      }
    }
    // rings
    for (const r of isl.rings) {
      if (r.used || (this.ghost && this._ghostRings.has(r))) continue;
      const dx = p.x - r.x, dy = p.y - r.y;
      if (dx * dx + dy * dy < r.r * r.r) {
        if (this.ghost) this._ghostRings.add(r); else r.used = true;
        p.vx *= P.ringBoost; p.vy = Math.max(p.vy, 0) * P.ringBoost + 200;
        this.stats.rings++;
        if (!this.ghost) this.istat.rings++;
        this.emit('ring', { x: r.x, y: r.y });
      }
    }
    if (p.y <= gy && p.x <= isl.endX) this._land(gy);
  }

  _land(gy) {
    const P = this.P, p = this.p, isl = this.island;
    isl.sample(p.x, tmp);
    const d = tmp[1];
    const speed = Math.hypot(p.vx, p.vy);
    const angV = Math.atan2(p.vy, p.vx);
    const angT = Math.atan(d);
    const alpha = Math.abs(angV - angT);
    const along = speed * Math.cos(Math.min(alpha, Math.PI / 2));
    const cloud = isl.surface === 'cloud';
    p.ground = true;
    p.y = gy;
    const airT = p.air;
    let kind;
    // skims over a crest are not flights: no rating, no Snow Rush progress (and nothing lost)
    if (!p.announced || airT < P.ratedMinAir || p.flightMax < P.ratedMinHeight) {
      kind = 'touch';
      p.s = Math.max(along, P.minSpeed);
    } else if (alpha < P.perfectAngle * (cloud ? 1.4 : 1) && d < -P.perfectMinDownSlope) {
      kind = 'perfect';
      p.s = along * P.perfectBoost;
      p.chain++;
      this.stats.perfect++;
      if (!this.ghost) this.istat.perfect++;
    } else if (alpha > P.bonkAngle && !cloud && p.fever <= 0) {
      kind = 'bonk';
      p.s = Math.max(along * P.bonkKeep, speed * P.bonkFloor);
      p.stun = P.bonkStun;
      p.chain = 0;
      this.stats.bonk++;
    } else {
      kind = 'good';
      p.s = along * P.landKeep;
      if (cloud) p.s *= 1.03;
      p.chain = 0;
      this.stats.good++;
    }
    if (p.s < P.minSpeed) p.s = P.minSpeed;
    const ms = this.maxSpeed();
    if (p.s > ms) p.s = ms;
    p.lastLand = kind;
    if (kind !== 'touch') {
      this.emit('land', { kind, alpha, speed: p.s, air: airT, height: p.flightMax, chain: p.chain });
      if (kind === 'perfect' && p.chain >= P.feverChain && p.fever <= 0) {
        p.fever = P.feverTime;
        this.stats.fevers++;
        if (!this.ghost) this.istat.fevers++;
        this.blizzardX = Math.max(this.blizzardX - this.balance.blizzard.feverPushSec * this.blizzardBase(), p.x - this.maxGap());
        this.emit('fever');
      } else if (kind === 'perfect' && p.fever > 0) {
        p.fever = Math.max(p.fever, P.feverTime * 0.6);
      }
    }
  }

  _collect() {
    const p = this.p, isl = this.island;
    const fish = isl.fish;
    const pickR = this.P.radius + 30;
    const magR = this.up.magnet;
    // fish on an island's first big flight swim toward you a little even without the magnet
    const soarR = this.P.soarFishPull;
    const reach = Math.max(pickR, magR, soarR) + 40;
    while (this.fishIndex < fish.length && fish[this.fishIndex].x < p.x - reach - 200) this.fishIndex++;
    for (let i = this.fishIndex; i < fish.length; i++) {
      const f = fish[i];
      if (f.x > p.x + reach) break;
      if (f.taken) continue;
      const dx = f.x - p.x, dy = f.y - p.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < pickR * pickR) this._take(f);
      else if (!f.pull && ((magR > 0 && d2 < magR * magR) || (f.soar && d2 < soarR * soarR))) { f.pull = 1; this.pulling.push(f); }
    }
    // magnet pulled fish fly toward the penguin
    if (this.pulling.length) {
      for (let i = this.pulling.length - 1; i >= 0; i--) {
        const f = this.pulling[i];
        if (f.taken) { this.pulling.splice(i, 1); continue; }
        const dx = p.x - f.x, dy = p.y - f.y;
        const d = Math.hypot(dx, dy) || 1;
        const v = (2400 + Math.hypot(p.vx, p.vy)) * STEP;
        if (d < v + pickR) { this._take(f); this.pulling.splice(i, 1); }
        else { f.x += dx / d * v; f.y += dy / d * v; }
      }
    }
  }

  _take(f) {
    f.taken = true;
    const E = this.balance.economy;
    const mul = this.p.fever > 0 ? 2 : 1;
    const v = (f.gold ? E.goldFishValue : E.fishValue) * mul;
    this.stats.fishValue += v;
    this.istat.fishValue += v;
    if (f.gold) { this.stats.gold++; this.istat.gold++; } else this.stats.fish++;
    this.emit('fish', { gold: f.gold, value: v, x: f.x, y: f.y });
  }

  _objects(dt) {
    const p = this.p, isl = this.island, P = this.P;
    if (p.ground) {
      for (const g of isl.geysers) {
        if (!g.used && Math.abs(p.x - g.x) < 46) {
          g.used = true;
          isl.sample(p.x, tmp);
          const cos = 1 / Math.sqrt(1 + tmp[1] * tmp[1]);
          p.ground = false;
          p.vx = Math.max(p.s * cos, 700);
          p.vy = P.geyserImpulse + Math.max(0, p.s * tmp[1] * cos);
          p.air = 0; p.flightMax = 0; p.milestone = 0;
          this.stats.geysers++;
          this.emit('geyser', { x: g.x });
        }
      }
    }
  }

  _blizzard(dt) {
    const B = this.balance.blizzard;
    const isl = this.island;
    const gap = this.gap;
    // warm-up: the blizzard starts each island at 65% speed and reaches full speed after 10 s,
    // so a fresh start (or a new island) never ends in a few seconds
    // (only on the island where the run started; a crossed island keeps the chase going)
    const warm = this.islandsCleared > 0 ? 1 : 0.65 + 0.35 * Math.min(1, this.islandTime / B.warmup);
    let v = (isl.blizzard.speed * warm + isl.blizzard.accel * this.islandTime) * (1 - this.assist);
    if (this.modifiers.blizzardMul) v *= this.modifiers.blizzardMul;
    const maxGap = this.maxGap();
    if (gap > maxGap) v += (gap - maxGap) * B.rubberBandMul;
    if (this.blizzardHold > 0) {
      this.blizzardHold -= dt;
      if (gap <= maxGap) v = 0;
    }
    this.blizzardV = v;
    this.blizzardX += v * dt;
    const g2 = this.gap;
    if (g2 < this.stats.minGap) this.stats.minGap = g2;
    const dg = this.dangerGap();
    const danger = g2 < dg;
    if (danger && !this._wasDanger) this.emit('danger');
    if (!danger && this._wasDanger && g2 > dg * 1.4) { this.stats.closeCalls++; this.emit('escape'); this._wasDanger = false; }
    if (danger) this._wasDanger = true;
    if (g2 <= 0) {
      if (this.scarfCharges > 0) {
        this.scarfCharges--;
        this.stats.secondWinds++;
        this.blizzardX = this.p.x - this.scarfPush * this.blizzardBase() / 1000;
        const p = this.p;
        if (p.ground) p.s = Math.min(this.maxSpeed(), p.s * 1.25 + 300);
        else p.vx += 300;
        this.emit('secondWind');
      } else {
        this.state = 'caught';
        this.emit('caught', { x: this.p.x });
      }
    }
  }

  _startCrossing() {
    const p = this.p, from = this.island;
    this.world.ensureIslands(this.world.islands.indexOf(from) + 2);
    const next = this.world.islands[this.world.islands.indexOf(from) + 1];
    if (!next) { this.state = 'caught'; this.emit('caught', { x: p.x, end: true }); return; }
    const lx = next.xs[0] + (next.xs[1] - next.xs[0]) * 0.42;
    const ly = next.heightAt(lx);
    const apex = Math.max(p.y, ly) + 900;
    this.crossing = {
      t: 0, T: 2.6, x0: p.x, y0: p.y, x1: lx, y1: ly, H: apex - (p.y + ly) / 2, from, next,
      speed: Math.max(p.ground ? p.s : Math.hypot(p.vx, p.vy), 900),
    };
    this.state = 'crossing';
    p.ground = false;
    this.islandsCleared++;
    this.emit('islandClear', { index: from.index });
  }

  _stepCrossing(dt) {
    const c = this.crossing, p = this.p;
    c.t += dt;
    const u = Math.min(1, c.t / c.T);
    const e = u; // linear in x keeps horizontal motion steady
    const nx = c.x0 + (c.x1 - c.x0) * e;
    const ny = c.y0 + (c.y1 - c.y0) * e + 4 * c.H * e * (1 - e);
    p.vx = (nx - p.x) / dt;
    p.vy = (ny - p.y) / dt;
    p.x = nx; p.y = ny;
    this.blizzardX = p.x - 4000;
    if (u >= 1) {
      const next = c.next;
      this.island = next;
      this.istat = this._istat(next.index);
      this.islandTime = 0;
      this.fishIndex = 0;
      next.sample(p.x, tmp);
      const cos = 1 / Math.sqrt(1 + tmp[1] * tmp[1]);
      p.ground = true;
      p.y = tmp[0];
      p.s = Math.min(this.maxSpeed(), Math.max(c.speed * 0.9, 1100));
      p.vx = p.s * cos; p.vy = p.s * tmp[1] * cos;
      p.chain = 0;
      this.blizzardX = p.x - this.startGapFor(next);
      this.blizzardHold = 1.2;
      this.state = 'run';
      this.crossing = null;
      // drop islands far behind to keep memory flat in endless mode
      while (this.world.islands.length > 3 && this.world.islands[0] !== next && this.world.islands[1] !== next) this.world.islands.shift();
      this.world.ensureIslands(this.world.islands.indexOf(next) + 2);
      this.emit('islandReach', { index: next.index });
    }
  }
}

// A throwaway copy that shares read-only level data and steps only the penguin physics.
// Used by the planning bot to try "hold" vs "let go" a second into the future.
export function makeGhost(sim) {
  const g = Object.create(RunSim.prototype);
  g.ghost = true;
  g.balance = sim.balance; g.P = sim.P; g.up = sim.up; g.world = sim.world; g.modifiers = sim.modifiers;
  g.island = sim.island;
  g.p = { ...sim.p };
  g.stats = { ...sim.stats };
  g.events = [];
  g.emit = () => {};
  g.blizzardX = sim.blizzardX;
  g._ghostRings = new Set();
  g.time = sim.time;
  return g;
}

export function ghostStep(g, dt, press) {
  const p = g.p;
  p.press = press;
  if (p.stun > 0) p.stun -= dt;
  if (p.fever > 0) p.fever -= dt;
  if (p.ground) g._stepGround(dt, press); else g._stepAir(dt, press);
  if (p.ground) {
    for (const gz of g.island.geysers) {
      if (!gz.used && Math.abs(p.x - gz.x) < 46) { p.ground = false; p.vx = Math.max(p.s, 700); p.vy = g.P.geyserImpulse; p.air = 0; }
    }
  }
}

// Ballistic forecast used by the bots and the "where will I land" assist.
export function forecastLanding(sim, press, maxT = 3) {
  const P = sim.P, isl = sim.island, up = sim.up;
  let x = sim.p.x, y = sim.p.y, vx = sim.p.vx, vy = sim.p.vy;
  const dt = 1 / 60;
  for (let t = 0; t < maxT; t += dt) {
    let g = P.gravity;
    if (press) g *= P.airPressGravityMul;
    else if (vy < 0 && up.glide > 0) g *= 1 - up.glide;
    vy -= g * dt;
    x += vx * dt; y += vy * dt;
    if (x > isl.endX) return { x, y, t, past: true };
    isl.sample(x, tmp);
    if (y <= tmp[0]) {
      const d = tmp[1];
      const alpha = Math.abs(Math.atan2(vy, vx) - Math.atan(d));
      return { x, y: tmp[0], t, slope: d, alpha, perfect: alpha < P.perfectAngle && d < -P.perfectMinDownSlope, bonk: alpha > P.bonkAngle };
    }
  }
  return { x, y, t: maxT, none: true };
}
