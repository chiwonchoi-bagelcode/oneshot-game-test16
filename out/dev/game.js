(() => {
  // src/data/balance.json
  var balance_default = {
    _comment: "All tunable numbers live here. Physics units: world units (~px at zoom 1), seconds. 1 m shown to the player = metersPerUnit.",
    display: {
      unitsPerMeter: 10
    },
    physics: {
      gravity: 1500,
      pressGravityMul: 1.9,
      airPressGravityMul: 3,
      groundFriction: 30,
      airDrag: 4e-5,
      groundDrag: 1e-4,
      minSpeed: 260,
      maxSpeed: 3e3,
      startSpeed: 420,
      radius: 40,
      perfectAngle: 0.36,
      perfectMinDownSlope: 0.12,
      perfectBoost: 1.08,
      bonkAngle: 0.95,
      bonkKeep: 0.62,
      bonkStun: 0.35,
      landKeep: 0.97,
      feverChain: 3,
      feverTime: 6,
      feverSpeedMul: 1.18,
      feverBlizzardPush: 700,
      iceAccelMul: 1.35,
      iceFrictionMul: 0.15,
      cloudBounce: 0.35,
      windAccel: 2600,
      geyserImpulse: 1700,
      ringBoost: 1.22,
      heightMilestones: [
        40,
        80,
        150,
        250,
        400,
        600
      ],
      heightMilestoneFish: [
        2,
        4,
        6,
        10,
        15,
        25
      ]
    },
    upgrades: {
      flap: {
        order: 1,
        maxLevel: 10,
        baseCost: 20,
        costGrowth: 1.52,
        values: [
          0,
          0.1,
          0.18,
          0.25,
          0.31,
          0.37,
          0.42,
          0.47,
          0.52,
          0.56,
          0.6
        ],
        unlock: {
          runs: 1
        }
      },
      slide: {
        order: 2,
        maxLevel: 10,
        baseCost: 35,
        costGrowth: 1.52,
        values: [
          0,
          0.06,
          0.11,
          0.16,
          0.2,
          0.24,
          0.28,
          0.32,
          0.35,
          0.38,
          0.41
        ],
        unlock: {
          runs: 2
        }
      },
      magnet: {
        order: 3,
        maxLevel: 8,
        baseCost: 60,
        costGrowth: 1.55,
        values: [
          0,
          70,
          100,
          130,
          160,
          190,
          220,
          250,
          280
        ],
        unlock: {
          island: 2
        }
      },
      glide: {
        order: 4,
        maxLevel: 8,
        baseCost: 110,
        costGrowth: 1.55,
        values: [
          0,
          0.08,
          0.14,
          0.19,
          0.24,
          0.28,
          0.32,
          0.35,
          0.38
        ],
        unlock: {
          island: 3
        }
      },
      scarf: {
        order: 5,
        maxLevel: 5,
        baseCost: 250,
        costGrowth: 1.8,
        values: [
          0,
          1,
          1,
          2,
          2,
          3
        ],
        pushback: [
          0,
          600,
          900,
          900,
          1200,
          1200
        ],
        unlock: {
          island: 4
        }
      }
    },
    blizzard: {
      maxGap: 1500,
      dangerGap: 520,
      rubberBandMul: 2.2,
      tutorialDelay: 9
    },
    economy: {
      fishValue: 1,
      goldFishValue: 10,
      distanceFishPerMeter: 0.04,
      islandFirstBonus: [
        0,
        0,
        60,
        120,
        200,
        300,
        420,
        560,
        720,
        900,
        1100
      ],
      islandRepeatBonus: 0.15,
      populationBonusPerPenguin: 0.01
    }
  };

  // src/data/levels/island01.json
  var island01_default = {
    id: "island01",
    name: { ko: "\uCCAB \uB208\uBC2D", en: "First Snow" },
    biome: "dawn",
    points: [[0, 380], [520, 0], [1050, 300], [1600, -20], [2150, 330], [2750, -40], [3300, 360], [3900, -60], [4500, 380], [5100, -40], [5700, 420], [6300, -60], [6900, 400], [7500, -80], [8200, 520]],
    fish: [],
    blizzard: { startGap: 1100, speed: 600, accel: 6 }
  };

  // src/data/levels.js
  var LEVELS = [island01_default];

  // src/core/rng.js
  function makeRng(seed) {
    let a = seed >>> 0;
    const next = () => {
      a = a + 1831565813 >>> 0;
      let t = a;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
    return {
      next,
      range: (lo, hi) => lo + (hi - lo) * next(),
      int: (lo, hi) => Math.floor(lo + (hi - lo + 1) * next()),
      pick: (arr) => arr[Math.floor(next() * arr.length)],
      chance: (p) => next() < p
    };
  }

  // src/core/world.js
  var SEA_GAP = 1500;
  var SEA_LEVEL = -520;
  function expandFish(level, island, ox) {
    const out = [];
    const add = (x, y, gold = false) => out.push({ x: ox + x, y, gold, taken: false, pull: 0 });
    for (const f of level.fish || []) {
      const n = Math.max(1, f.n | 0);
      if (f.type === "arc") {
        for (let i = 0; i < n; i++) {
          const t = n === 1 ? 0.5 : i / (n - 1);
          const x = f.x + f.w * t;
          const y = f.y + f.h * 4 * t * (1 - t);
          add(x, y, !!f.gold && (f.goldAt == null ? i === Math.floor(n / 2) : i === f.goldAt));
        }
      } else if (f.type === "line") {
        for (let i = 0; i < n; i++) {
          const t = n === 1 ? 0 : i / (n - 1);
          add(f.x + (f.x2 - f.x) * t, f.y + (f.y2 - f.y) * t, !!f.gold && i === n - 1);
        }
      } else if (f.type === "ground") {
        const sp = f.spacing || 60;
        for (let i = 0; i < n; i++) {
          const lx = f.x + i * sp;
          add(lx, island.localHeight(lx) + (f.off || 46), false);
        }
      } else {
        add(f.x, f.y, !!f.gold);
      }
    }
    return out;
  }
  var Island = class {
    constructor(level, index, startX) {
      this.level = level;
      this.index = index;
      this.id = level.id;
      this.biome = level.biome || "dawn";
      this.surface = level.surface || "snow";
      this.startX = startX;
      const pts = level.points;
      this.xs = new Float64Array(pts.length);
      this.ys = new Float64Array(pts.length);
      for (let i = 0; i < pts.length; i++) {
        this.xs[i] = startX + pts[i][0];
        this.ys[i] = pts[i][1];
      }
      this.endX = this.xs[pts.length - 1];
      this.length = this.endX - startX;
      this.nextStartX = this.endX + SEA_GAP;
      this.ice = (level.ice || []).map(([a, b]) => [startX + a, startX + b]).sort((p, q) => p[0] - q[0]);
      this.wind = (level.wind || []).map((w) => ({ x: startX + w.x, w: w.w, h: w.h, power: w.power || 1 }));
      this.geysers = (level.geysers || []).map((g) => ({ x: startX + g.x, used: false, t: 0 }));
      this.rings = (level.rings || []).map((r) => ({ x: startX + r.x, y: r.y, r: r.r || 90, used: false }));
      this.decor = (level.decor || []).map((d) => ({ ...d, x: startX + d.x }));
      this.blizzard = Object.assign({ startGap: 1100, speed: 700, accel: 6 }, level.blizzard || {});
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
      let lo = 0, hi = xs.length - 2;
      while (lo < hi) {
        const mid = lo + hi + 1 >> 1;
        if (xs[mid] <= x) lo = mid;
        else hi = mid - 1;
      }
      this._seg = lo;
      return lo;
    }
    // returns [y, dy/dx, d2y/dx2]
    sample(x, out) {
      const xs = this.xs, ys = this.ys;
      if (x <= xs[0]) {
        out[0] = ys[0];
        out[1] = 0;
        out[2] = 0;
        return out;
      }
      if (x >= this.endX) {
        out[0] = ys[ys.length - 1];
        out[1] = 0;
        out[2] = 0;
        return out;
      }
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
  };
  var _tmp = [0, 0, 0];
  var World = class {
    // levels: ordered list of level json. generator(index) supplies extra levels for endless mode.
    constructor(levels, { startIndex = 0, generator = null } = {}) {
      this.levels = levels;
      this.generator = generator;
      this.islands = [];
      this.originIndex = startIndex;
      let x = 0;
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
        if (x >= isl.startX && x < isl.nextStartX) {
          this._last = isl;
          return isl;
        }
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
        out[0] = SEA_LEVEL;
        out[1] = 0;
        out[2] = 0;
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
  };

  // src/core/run.js
  var STEP = 1 / 120;
  var tmp = [0, 0, 0];
  function upgradeValue(balance, key, level) {
    const u = balance.upgrades[key];
    if (!u) return 0;
    const lv = Math.max(0, Math.min(u.maxLevel, level | 0));
    return u.values[lv];
  }
  var RunSim = class {
    constructor({ levels, balance, upgrades = {}, startIndex = 0, tutorial = false, assist = 0, generator = null, modifiers = {} }) {
      this.balance = balance;
      this.P = balance.physics;
      this.world = new World(levels, { startIndex, generator });
      this.modifiers = modifiers;
      this.up = {
        flap: upgradeValue(balance, "flap", upgrades.flap),
        slide: upgradeValue(balance, "slide", upgrades.slide),
        magnet: upgradeValue(balance, "magnet", upgrades.magnet),
        glide: upgradeValue(balance, "glide", upgrades.glide),
        scarf: upgradeValue(balance, "scarf", upgrades.scarf)
      };
      const sl = Math.max(0, Math.min(5, upgrades.scarf | 0));
      this.scarfPush = (balance.upgrades.scarf.pushback || [])[sl] || 800;
      this.scarfCharges = this.up.scarf;
      this.assist = assist;
      this.tutorial = tutorial;
      this.time = 0;
      this.state = "run";
      this.events = [];
      this.island = this.world.islands[0];
      this.islandTime = 0;
      this.islandsCleared = 0;
      this.startIndex = startIndex;
      const isl = this.island;
      const p = {
        x: isl.startX + 4,
        y: 0,
        vx: 0,
        vy: 0,
        s: this.P.startSpeed * (modifiers.startSpeedMul || 1),
        ground: true,
        press: false,
        stun: 0,
        air: 0,
        fever: 0,
        chain: 0,
        flightMax: 0,
        milestone: 0,
        lastLand: null,
        angle: 0,
        slope: 0,
        ice: false
      };
      p.y = isl.heightAt(p.x);
      this.p = p;
      this.blizzardX = p.x - isl.blizzard.startGap;
      this.blizzardV = 0;
      this.blizzardHold = tutorial ? balance.blizzard.tutorialDelay : 0.8;
      this.crossing = null;
      this.fishIndex = 0;
      this.pulling = [];
      this.stats = {
        fish: 0,
        gold: 0,
        fishValue: 0,
        perfect: 0,
        good: 0,
        bonk: 0,
        fevers: 0,
        maxHeight: 0,
        maxSpeed: 0,
        airTime: 0,
        groundTime: 0,
        pressUp: 0,
        pressDown: 0,
        releaseDown: 0,
        releaseUp: 0,
        milestoneFish: 0,
        rings: 0,
        geysers: 0,
        secondWinds: 0,
        closeCalls: 0,
        minGap: 1e9,
        hills: 0
      };
      this._wasDanger = false;
    }
    get distanceUnits() {
      return this.p.x;
    }
    get distanceMeters() {
      return Math.max(0, Math.floor(this.p.x / this.balance.display.unitsPerMeter));
    }
    get gap() {
      return this.p.x - this.blizzardX;
    }
    get heightAboveGround() {
      return this.p.ground ? 0 : this.p.y - this.world.heightAt(this.p.x);
    }
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
      return P.maxSpeed * (1 + this.up.slide * 0.5) * (this.p.fever > 0 ? P.feverSpeedMul : 1);
    }
    step(dt, press) {
      this.time += dt;
      const p = this.p;
      p.press = press;
      if (this.state === "caught") return;
      if (this.state === "crossing") {
        this._stepCrossing(dt);
        return;
      }
      this.islandTime += dt;
      if (p.stun > 0) p.stun -= dt;
      if (p.fever > 0) {
        p.fever -= dt;
        if (p.fever <= 0) {
          p.fever = 0;
          this.emit("feverEnd");
        }
      }
      if (p.ground) this._stepGround(dt, press);
      else this._stepAir(dt, press);
      this._collect();
      this._objects(dt);
      this._blizzard(dt);
      const sp = Math.hypot(p.vx, p.vy);
      if (sp > this.stats.maxSpeed) this.stats.maxSpeed = sp;
      if (p.x >= this.island.endX && this.state === "run") this._startCrossing();
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
      const cloud = isl.surface === "cloud";
      const effPress = press && p.stun <= 0;
      let g = P.gravity;
      if (effPress) {
        g *= P.pressGravityMul;
        if (d < 0) g *= 1 + this.up.slide;
        if (d < 0 && ice) g *= P.iceAccelMul;
      }
      let fr = P.groundFriction * (ice ? P.iceFrictionMul : 1) * (cloud ? 1.4 : 1);
      let a = -g * sin - fr - P.groundDrag * p.s * p.s;
      p.s += a * dt;
      const ms = this.maxSpeed();
      if (p.s > ms) p.s = ms - (p.s - ms) * 0.5;
      if (p.s < P.minSpeed) p.s = P.minSpeed;
      this.stats.groundTime += dt;
      if (d > 0.08) {
        if (press) this.stats.pressUp += dt;
        else this.stats.releaseUp += dt;
      } else if (d < -0.08) {
        if (press) this.stats.pressDown += dt;
        else this.stats.releaseDown += dt;
      }
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
        flapV = this.up.flap * p.s * Math.max(0.15, sin + 0.25);
        p.vy += flapV;
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
      if (!press) {
        for (const w of isl.wind) {
          if (p.x >= w.x && p.x <= w.x + w.w) {
            const gy2 = isl.heightAt(p.x);
            if (p.y < gy2 + w.h) {
              p.vy += P.windAccel * w.power * dt;
              if (p.vy > 1500) p.vy = 1500;
              if (!w._inside) {
                w._inside = true;
                this.emit("wind", { x: p.x });
              }
            }
          } else w._inside = false;
        }
      }
      const sp = Math.hypot(p.vx, p.vy);
      const drag = 1 - P.airDrag * sp * dt;
      p.vx *= drag;
      p.vy *= drag;
      if (p.vx < P.minSpeed * 0.6) p.vx = P.minSpeed * 0.6;
      p.x += p.vx * dt;
      p.air += dt;
      this.stats.airTime += dt;
      const gy = this.world.heightAt(p.x);
      const h = p.y - gy;
      if (!p.announced && p.air > 0.07 && h > 6) {
        p.announced = true;
        this.stats.hills++;
        this.emit("takeoff", { speed: p.launchSpeed, angle: Math.atan2(p.vy, p.vx), flap: p.flapV || 0 });
      }
      if (h > p.flightMax) {
        p.flightMax = h;
        if (h > this.stats.maxHeight) this.stats.maxHeight = h;
        const ms = P.heightMilestones;
        const upm = this.balance.display.unitsPerMeter;
        while (p.milestone < ms.length && h >= ms[p.milestone] * upm) {
          const bonus = P.heightMilestoneFish[p.milestone];
          this.stats.milestoneFish += bonus;
          this.emit("height", { meters: ms[p.milestone], bonus, level: p.milestone });
          p.milestone++;
        }
      }
      for (const r of isl.rings) {
        if (r.used) continue;
        const dx = p.x - r.x, dy = p.y - r.y;
        if (dx * dx + dy * dy < r.r * r.r) {
          r.used = true;
          p.vx *= P.ringBoost;
          p.vy = Math.max(p.vy, 0) * P.ringBoost + 200;
          this.stats.rings++;
          this.emit("ring", { x: r.x, y: r.y });
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
      const cloud = isl.surface === "cloud";
      p.ground = true;
      p.y = gy;
      const airT = p.air;
      let kind;
      if (!p.announced || airT < 0.28 && p.flightMax < 70) {
        kind = "touch";
        p.s = Math.max(along, P.minSpeed);
      } else if (alpha < P.perfectAngle * (cloud ? 1.4 : 1) && d < -P.perfectMinDownSlope) {
        kind = "perfect";
        p.s = along * P.perfectBoost;
        p.chain++;
        this.stats.perfect++;
      } else if (alpha > P.bonkAngle && !cloud && p.fever <= 0) {
        kind = "bonk";
        p.s = along * P.bonkKeep;
        p.stun = P.bonkStun;
        p.chain = 0;
        this.stats.bonk++;
      } else {
        kind = "good";
        p.s = along * P.landKeep;
        if (cloud) p.s *= 1.03;
        p.chain = 0;
        this.stats.good++;
      }
      if (p.s < P.minSpeed) p.s = P.minSpeed;
      const ms = this.maxSpeed();
      if (p.s > ms) p.s = ms;
      p.lastLand = kind;
      if (kind !== "touch") {
        this.emit("land", { kind, alpha, speed: p.s, air: airT, height: p.flightMax, chain: p.chain });
        if (kind === "perfect" && p.chain >= P.feverChain && p.fever <= 0) {
          p.fever = P.feverTime;
          this.stats.fevers++;
          this.blizzardX = Math.max(this.blizzardX - P.feverBlizzardPush, p.x - this.balance.blizzard.maxGap);
          this.emit("fever");
        } else if (kind === "perfect" && p.fever > 0) {
          p.fever = Math.max(p.fever, P.feverTime * 0.6);
        }
      }
    }
    _collect() {
      const p = this.p, isl = this.island;
      const fish = isl.fish;
      const pickR = this.P.radius + 30;
      const magR = this.up.magnet;
      const reach = Math.max(pickR, magR) + 40;
      while (this.fishIndex < fish.length && fish[this.fishIndex].x < p.x - reach - 200) this.fishIndex++;
      for (let i = this.fishIndex; i < fish.length; i++) {
        const f = fish[i];
        if (f.x > p.x + reach) break;
        if (f.taken) continue;
        const dx = f.x - p.x, dy = f.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < pickR * pickR) this._take(f);
        else if (magR > 0 && d2 < magR * magR && !f.pull) {
          f.pull = 1;
          this.pulling.push(f);
        }
      }
      if (this.pulling.length) {
        for (let i = this.pulling.length - 1; i >= 0; i--) {
          const f = this.pulling[i];
          if (f.taken) {
            this.pulling.splice(i, 1);
            continue;
          }
          const dx = p.x - f.x, dy = p.y - f.y;
          const d = Math.hypot(dx, dy) || 1;
          const v = (2400 + Math.hypot(p.vx, p.vy)) * STEP;
          if (d < v + pickR) {
            this._take(f);
            this.pulling.splice(i, 1);
          } else {
            f.x += dx / d * v;
            f.y += dy / d * v;
          }
        }
      }
    }
    _take(f) {
      f.taken = true;
      const E = this.balance.economy;
      const mul = this.p.fever > 0 ? 2 : 1;
      const v = (f.gold ? E.goldFishValue : E.fishValue) * mul;
      this.stats.fishValue += v;
      if (f.gold) this.stats.gold++;
      else this.stats.fish++;
      this.emit("fish", { gold: f.gold, value: v, x: f.x, y: f.y });
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
            p.air = 0;
            p.flightMax = 0;
            p.milestone = 0;
            this.stats.geysers++;
            this.emit("geyser", { x: g.x });
          }
        }
      }
    }
    _blizzard(dt) {
      const B = this.balance.blizzard;
      const isl = this.island;
      const gap = this.gap;
      let v = (isl.blizzard.speed + isl.blizzard.accel * this.islandTime) * (1 - this.assist);
      if (this.modifiers.blizzardMul) v *= this.modifiers.blizzardMul;
      if (gap > B.maxGap) v += (gap - B.maxGap) * B.rubberBandMul;
      if (this.blizzardHold > 0) {
        this.blizzardHold -= dt;
        if (gap <= B.maxGap) v = 0;
      }
      this.blizzardV = v;
      this.blizzardX += v * dt;
      const g2 = this.gap;
      if (g2 < this.stats.minGap) this.stats.minGap = g2;
      const danger = g2 < B.dangerGap;
      if (danger && !this._wasDanger) this.emit("danger");
      if (!danger && this._wasDanger && g2 > B.dangerGap * 1.4) {
        this.stats.closeCalls++;
        this.emit("escape");
        this._wasDanger = false;
      }
      if (danger) this._wasDanger = true;
      if (g2 <= 0) {
        if (this.scarfCharges > 0) {
          this.scarfCharges--;
          this.stats.secondWinds++;
          this.blizzardX = this.p.x - this.scarfPush;
          const p = this.p;
          if (p.ground) p.s = Math.min(this.maxSpeed(), p.s * 1.25 + 300);
          else p.vx += 300;
          this.emit("secondWind");
        } else {
          this.state = "caught";
          this.emit("caught", { x: this.p.x });
        }
      }
    }
    _startCrossing() {
      const p = this.p, from = this.island;
      this.world.ensureIslands(this.world.islands.indexOf(from) + 2);
      const next = this.world.islands[this.world.islands.indexOf(from) + 1];
      if (!next) {
        this.state = "caught";
        this.emit("caught", { x: p.x, end: true });
        return;
      }
      const lx = next.xs[0] + (next.xs[1] - next.xs[0]) * 0.42;
      const ly = next.heightAt(lx);
      const apex = Math.max(p.y, ly) + 900;
      this.crossing = {
        t: 0,
        T: 2.6,
        x0: p.x,
        y0: p.y,
        x1: lx,
        y1: ly,
        H: apex - (p.y + ly) / 2,
        from,
        next,
        speed: Math.max(p.ground ? p.s : Math.hypot(p.vx, p.vy), 900)
      };
      this.state = "crossing";
      p.ground = false;
      this.islandsCleared++;
      this.emit("islandClear", { index: from.index });
    }
    _stepCrossing(dt) {
      const c = this.crossing, p = this.p;
      c.t += dt;
      const u = Math.min(1, c.t / c.T);
      const e = u;
      const nx = c.x0 + (c.x1 - c.x0) * e;
      const ny = c.y0 + (c.y1 - c.y0) * e + 4 * c.H * e * (1 - e);
      p.vx = (nx - p.x) / dt;
      p.vy = (ny - p.y) / dt;
      p.x = nx;
      p.y = ny;
      this.blizzardX = p.x - 4e3;
      if (u >= 1) {
        const next = c.next;
        this.island = next;
        this.islandTime = 0;
        this.fishIndex = 0;
        next.sample(p.x, tmp);
        const cos = 1 / Math.sqrt(1 + tmp[1] * tmp[1]);
        p.ground = true;
        p.y = tmp[0];
        p.s = Math.min(this.maxSpeed(), Math.max(c.speed * 0.9, 1100));
        p.vx = p.s * cos;
        p.vy = p.s * tmp[1] * cos;
        p.chain = 0;
        this.blizzardX = p.x - next.blizzard.startGap;
        this.blizzardHold = 1.2;
        this.state = "run";
        this.crossing = null;
        while (this.world.islands.length > 3 && this.world.islands[0] !== next && this.world.islands[1] !== next) this.world.islands.shift();
        this.world.ensureIslands(this.world.islands.indexOf(next) + 2);
        this.emit("islandReach", { index: next.index });
      }
    }
  };
  function forecastLanding(sim2, press, maxT = 3) {
    const P = sim2.P, isl = sim2.island, up = sim2.up;
    let x = sim2.p.x, y = sim2.p.y, vx = sim2.p.vx, vy = sim2.p.vy;
    const dt = 1 / 60;
    for (let t = 0; t < maxT; t += dt) {
      let g = P.gravity;
      if (press) g *= P.airPressGravityMul;
      else if (vy < 0 && up.glide > 0) g *= 1 - up.glide;
      vy -= g * dt;
      x += vx * dt;
      y += vy * dt;
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

  // src/core/bot.js
  var BOT_PROFILES = {
    expert: { delay: 0.03, lead: 0.05, noise: 0, holdUpChance: 0, earlyRelease: 0, airSmart: 1 },
    good: { delay: 0.08, lead: 0.05, noise: 0.04, holdUpChance: 0.05, earlyRelease: 0.05, airSmart: 0.85 },
    average: { delay: 0.14, lead: 0.04, noise: 0.08, holdUpChance: 0.15, earlyRelease: 0.12, airSmart: 0.6 },
    novice: { delay: 0.22, lead: 0.02, noise: 0.14, holdUpChance: 0.35, earlyRelease: 0.25, airSmart: 0.25 }
  };
  var tmp2 = [0, 0, 0];
  function makeBot(profileName = "good", seed = 1) {
    const prof = typeof profileName === "string" ? BOT_PROFILES[profileName] : profileName;
    const rng = makeRng(seed);
    const queue = [];
    let current = false;
    let hillMistake = 0;
    let lastGroundSign = 0;
    let airDecision = null;
    let airTimer = 0;
    function desired(sim2) {
      const p = sim2.p;
      if (sim2.state !== "run") return false;
      if (p.ground) {
        airDecision = null;
        const lead = Math.max(0, prof.lead + (rng.next() - 0.5) * prof.noise);
        sim2.island.sample(p.x + p.s * lead, tmp2);
        const slopeAhead = tmp2[1];
        const sign = slopeAhead < -0.015 ? -1 : 1;
        if (sign !== lastGroundSign) {
          lastGroundSign = sign;
          hillMistake = 0;
          if (sign > 0 && rng.chance(prof.holdUpChance)) hillMistake = rng.range(0.1, 0.45);
          if (sign < 0 && rng.chance(prof.earlyRelease)) hillMistake = -rng.range(0.1, 0.35);
        }
        if (sign < 0) {
          if (hillMistake < 0) {
            sim2.island.sample(p.x, tmp2);
            if (tmp2[1] > -0.35 + hillMistake) return false;
          }
          return true;
        }
        if (hillMistake > 0) {
          hillMistake -= 1 / 120;
          return true;
        }
        return false;
      }
      airTimer -= 1 / 120;
      if (airDecision === null || airTimer <= 0) {
        airTimer = 0.1;
        if (rng.next() > prof.airSmart) {
          airDecision = p.vy < -200 && rng.chance(0.5);
        } else {
          const free = forecastLanding(sim2, false);
          const dive = forecastLanding(sim2, true);
          const score = (f) => f.past ? 3 : f.none ? 0.5 : f.perfect ? 2.5 : f.bonk ? -2 : f.slope < 0 ? 1 : 0;
          const sf = score(free), sd = score(dive);
          airDecision = sd > sf + 0.01;
        }
      }
      return airDecision;
    }
    return function control(sim2) {
      const want = desired(sim2);
      queue.push([sim2.time + prof.delay, want]);
      while (queue.length && queue[0][0] <= sim2.time) current = queue.shift()[1];
      return current;
    };
  }

  // src/game/camera.js
  var Camera = class {
    constructor() {
      this.x = 0;
      this.y = 0;
      this.z = 0.35;
      this.W = 390;
      this.H = 844;
      this.anchor = 0.3;
      this.shakeT = 0;
      this.shakeA = 0;
      this.sx = 0;
      this.sy = 0;
      this.punch = 0;
      this.lowY = 0;
      this.override = null;
    }
    resize(W2, H2) {
      this.W = W2;
      this.H = H2;
    }
    baseZoom(viewWidth) {
      const z = this.W / viewWidth;
      return Math.min(z, this.H / (viewWidth * 1.45));
    }
    snap(sim2) {
      this.update(sim2, 1, true);
    }
    update(sim2, dt, snap = false) {
      var _a;
      const p = sim2.p;
      const world = sim2.world;
      const speed = p.ground ? p.s : Math.hypot(p.vx, p.vy);
      const sn = Math.min(1, Math.max(0, (speed - 500) / 1700));
      const viewW = 1180 + 520 * sn;
      let zt = this.baseZoom(viewW);
      const ground = world.heightAt(p.x);
      const alt = Math.max(0, p.y - ground);
      const altN = Math.min(1, alt / 1400);
      const crossing = sim2.state === "crossing";
      const anchorT = 0.3 + 0.1 * altN + (crossing ? 0.08 : 0);
      const span = this.W / zt;
      let low = Infinity;
      const x0 = p.x - span * anchorT, x1 = p.x + span * (1 - anchorT);
      for (let i = 0; i <= 12; i++) {
        const y = world.heightAt(x0 + (x1 - x0) * i / 12);
        if (y < low) low = y;
      }
      if (crossing) low = Math.min(low, sim2.crossing.y1 - 200);
      low = Math.max(low, -700);
      const topMargin = this.H * 0.2, bottom = this.H * 0.8;
      const need = p.y - low + 60;
      const zFit = (bottom - topMargin) / Math.max(need, 1);
      if (zFit < zt) zt = zFit;
      if (crossing) zt = Math.min(zt, this.baseZoom(2600));
      zt = Math.max(zt, this.baseZoom(5200));
      if (snap) {
        this.z = zt;
        this.anchor = anchorT;
        this.lowY = low;
      } else {
        const kz = zt < this.z ? 4.5 : 1.6;
        this.z += (zt - this.z) * Math.min(1, kz * dt);
        this.anchor += (anchorT - this.anchor) * Math.min(1, 2 * dt);
        const kl = low < this.lowY ? 5 : 2.2;
        this.lowY += (low - this.lowY) * Math.min(1, kl * dt);
      }
      this.x = p.x;
      this.y = this.lowY;
      const py = this.toScreenY(p.y);
      if (py < topMargin) this.y -= (topMargin - py) / this.z;
      if (this.override) {
        const o = this.override;
        this.x = o.x;
        this.y = o.y;
        this.z = o.z;
        this.anchor = (_a = o.anchor) != null ? _a : this.anchor;
      }
      if (this.shakeT > 0) {
        this.shakeT -= dt;
        const a = this.shakeA * Math.max(0, this.shakeT) * 4;
        this.sx = (Math.random() - 0.5) * a;
        this.sy = (Math.random() - 0.5) * a;
      } else {
        this.sx = this.sy = 0;
      }
    }
    shake(amount, time = 0.25) {
      this.shakeA = Math.max(this.shakeA * (this.shakeT > 0 ? 1 : 0), amount);
      this.shakeT = Math.max(this.shakeT, time);
    }
    toScreenX(wx) {
      return (wx - this.x) * this.z + this.W * this.anchor + this.sx;
    }
    toScreenY(wy) {
      return this.H * 0.8 - (wy - this.y) * this.z + this.sy;
    }
    toWorldX(sx) {
      return (sx - this.W * this.anchor - this.sx) / this.z + this.x;
    }
    toWorldY(sy) {
      return (this.H * 0.8 - sy + this.sy) / this.z + this.y;
    }
    get left() {
      return this.toWorldX(0);
    }
    get right() {
      return this.toWorldX(this.W);
    }
  };

  // src/main.js
  var canvas = document.getElementById("game");
  var ctx = canvas.getContext("2d");
  var W = 0;
  var H = 0;
  var dpr = 1;
  var cam = new Camera();
  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    cam.resize(W, H);
  }
  window.addEventListener("resize", resize);
  resize();
  document.getElementById("boot").classList.add("hide");
  var params = new URLSearchParams(location.search);
  var ups = params.get("ups") ? JSON.parse(params.get("ups")) : {};
  var sim = new RunSim({ levels: LEVELS, balance: balance_default, upgrades: ups, tutorial: false });
  var bot = params.get("bot") ? makeBot(params.get("bot"), 1) : null;
  var pressing = false;
  canvas.addEventListener("pointerdown", () => {
    pressing = true;
  });
  window.addEventListener("pointerup", () => {
    pressing = false;
  });
  cam.snap(sim);
  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#5fb6ee");
    g.addColorStop(0.7, "#cdeefe");
    g.addColorStop(1, "#ffe9d6");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    const w = sim.world;
    ctx.beginPath();
    const x0 = cam.left - 20, x1 = cam.right + 20;
    const step = 6 / cam.z;
    ctx.moveTo(cam.toScreenX(x0), H + 10);
    for (let x = x0; x <= x1; x += step) ctx.lineTo(cam.toScreenX(x), cam.toScreenY(w.drawHeightAt(x)));
    ctx.lineTo(cam.toScreenX(x1), H + 10);
    ctx.closePath();
    ctx.fillStyle = "#eaf4ff";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#2a3570";
    ctx.stroke();
    for (const isl of w.islands) for (const f of isl.fish) {
      if (f.taken) continue;
      const sx = cam.toScreenX(f.x), sy = cam.toScreenY(f.y);
      if (sx < -20 || sx > W + 20) continue;
      ctx.fillStyle = f.gold ? "#ffc833" : "#5aa0e8";
      ctx.beginPath();
      ctx.ellipse(sx, sy, 16 * cam.z / 0.33, 9 * cam.z / 0.33, 0, 0, 7);
      ctx.fill();
    }
    const p = sim.p;
    const ang = p.ground ? Math.atan(p.slope || 0) : Math.atan2(p.vy, p.vx);
    ctx.save();
    ctx.translate(cam.toScreenX(p.x), cam.toScreenY(p.y));
    ctx.rotate(-ang);
    const s = cam.z;
    ctx.fillStyle = pressing ? "#1b2340" : "#2b3a78";
    ctx.beginPath();
    ctx.ellipse(0, -40 * s, 70 * s, 40 * s, 0, 0, 7);
    ctx.fill();
    ctx.fillStyle = "#e8423f";
    ctx.fillRect(20 * s, -70 * s, 20 * s, 40 * s);
    ctx.restore();
    const bx = cam.toScreenX(sim.blizzardX);
    ctx.fillStyle = "rgba(230,240,255,0.9)";
    ctx.fillRect(0, 0, Math.max(0, bx), H);
    ctx.fillStyle = "#23306b";
    ctx.font = "16px sans-serif";
    ctx.fillText(`${sim.distanceMeters}m  v${(p.ground ? p.s : Math.hypot(p.vx, p.vy)).toFixed(0)}  gap ${sim.gap.toFixed(0)}  z ${cam.z.toFixed(2)}`, 12, 30);
  }
  var acc = 0;
  var last = performance.now();
  window.__sim = () => sim;
  window.__advance = (sec, pressFn) => {
    const n = Math.round(sec / STEP);
    for (let i = 0; i < n; i++) {
      const pr = pressFn ? pressFn(sim) : bot ? bot(sim) : pressing;
      pressing = pr;
      sim.step(STEP, pr);
      if (i % 2 === 0) cam.update(sim, STEP * 2);
    }
    sim.drainEvents();
    draw();
  };
  function frame(now) {
    if (window.__manual) return;
    const dt = Math.min(0.05, (now - last) / 1e3);
    last = now;
    acc += dt;
    while (acc >= STEP) {
      const pr = bot ? bot(sim) : pressing;
      sim.step(STEP, pr);
      acc -= STEP;
    }
    sim.drainEvents();
    if (sim.state === "caught") {
      sim = new RunSim({ levels: LEVELS, balance: balance_default, upgrades: ups });
      cam.snap(sim);
    }
    cam.update(sim, dt);
    draw();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL2RhdGEvYmFsYW5jZS5qc29uIiwgIi4uLy4uL3NyYy9kYXRhL2xldmVscy9pc2xhbmQwMS5qc29uIiwgIi4uLy4uL3NyYy9kYXRhL2xldmVscy5qcyIsICIuLi8uLi9zcmMvY29yZS9ybmcuanMiLCAiLi4vLi4vc3JjL2NvcmUvd29ybGQuanMiLCAiLi4vLi4vc3JjL2NvcmUvcnVuLmpzIiwgIi4uLy4uL3NyYy9jb3JlL2JvdC5qcyIsICIuLi8uLi9zcmMvZ2FtZS9jYW1lcmEuanMiLCAiLi4vLi4vc3JjL21haW4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIntcbiAgXCJfY29tbWVudFwiOiBcIkFsbCB0dW5hYmxlIG51bWJlcnMgbGl2ZSBoZXJlLiBQaHlzaWNzIHVuaXRzOiB3b3JsZCB1bml0cyAofnB4IGF0IHpvb20gMSksIHNlY29uZHMuIDEgbSBzaG93biB0byB0aGUgcGxheWVyID0gbWV0ZXJzUGVyVW5pdC5cIixcbiAgXCJkaXNwbGF5XCI6IHtcbiAgICBcInVuaXRzUGVyTWV0ZXJcIjogMTBcbiAgfSxcbiAgXCJwaHlzaWNzXCI6IHtcbiAgICBcImdyYXZpdHlcIjogMTUwMCxcbiAgICBcInByZXNzR3Jhdml0eU11bFwiOiAxLjksXG4gICAgXCJhaXJQcmVzc0dyYXZpdHlNdWxcIjogMy4wLFxuICAgIFwiZ3JvdW5kRnJpY3Rpb25cIjogMzAsXG4gICAgXCJhaXJEcmFnXCI6IDRlLTA1LFxuICAgIFwiZ3JvdW5kRHJhZ1wiOiAwLjAwMDEsXG4gICAgXCJtaW5TcGVlZFwiOiAyNjAsXG4gICAgXCJtYXhTcGVlZFwiOiAzMDAwLFxuICAgIFwic3RhcnRTcGVlZFwiOiA0MjAsXG4gICAgXCJyYWRpdXNcIjogNDAsXG4gICAgXCJwZXJmZWN0QW5nbGVcIjogMC4zNixcbiAgICBcInBlcmZlY3RNaW5Eb3duU2xvcGVcIjogMC4xMixcbiAgICBcInBlcmZlY3RCb29zdFwiOiAxLjA4LFxuICAgIFwiYm9ua0FuZ2xlXCI6IDAuOTUsXG4gICAgXCJib25rS2VlcFwiOiAwLjYyLFxuICAgIFwiYm9ua1N0dW5cIjogMC4zNSxcbiAgICBcImxhbmRLZWVwXCI6IDAuOTcsXG4gICAgXCJmZXZlckNoYWluXCI6IDMsXG4gICAgXCJmZXZlclRpbWVcIjogNi4wLFxuICAgIFwiZmV2ZXJTcGVlZE11bFwiOiAxLjE4LFxuICAgIFwiZmV2ZXJCbGl6emFyZFB1c2hcIjogNzAwLFxuICAgIFwiaWNlQWNjZWxNdWxcIjogMS4zNSxcbiAgICBcImljZUZyaWN0aW9uTXVsXCI6IDAuMTUsXG4gICAgXCJjbG91ZEJvdW5jZVwiOiAwLjM1LFxuICAgIFwid2luZEFjY2VsXCI6IDI2MDAsXG4gICAgXCJnZXlzZXJJbXB1bHNlXCI6IDE3MDAsXG4gICAgXCJyaW5nQm9vc3RcIjogMS4yMixcbiAgICBcImhlaWdodE1pbGVzdG9uZXNcIjogW1xuICAgICAgNDAsXG4gICAgICA4MCxcbiAgICAgIDE1MCxcbiAgICAgIDI1MCxcbiAgICAgIDQwMCxcbiAgICAgIDYwMFxuICAgIF0sXG4gICAgXCJoZWlnaHRNaWxlc3RvbmVGaXNoXCI6IFtcbiAgICAgIDIsXG4gICAgICA0LFxuICAgICAgNixcbiAgICAgIDEwLFxuICAgICAgMTUsXG4gICAgICAyNVxuICAgIF1cbiAgfSxcbiAgXCJ1cGdyYWRlc1wiOiB7XG4gICAgXCJmbGFwXCI6IHtcbiAgICAgIFwib3JkZXJcIjogMSxcbiAgICAgIFwibWF4TGV2ZWxcIjogMTAsXG4gICAgICBcImJhc2VDb3N0XCI6IDIwLFxuICAgICAgXCJjb3N0R3Jvd3RoXCI6IDEuNTIsXG4gICAgICBcInZhbHVlc1wiOiBbXG4gICAgICAgIDAsXG4gICAgICAgIDAuMSxcbiAgICAgICAgMC4xOCxcbiAgICAgICAgMC4yNSxcbiAgICAgICAgMC4zMSxcbiAgICAgICAgMC4zNyxcbiAgICAgICAgMC40MixcbiAgICAgICAgMC40NyxcbiAgICAgICAgMC41MixcbiAgICAgICAgMC41NixcbiAgICAgICAgMC42XG4gICAgICBdLFxuICAgICAgXCJ1bmxvY2tcIjoge1xuICAgICAgICBcInJ1bnNcIjogMVxuICAgICAgfVxuICAgIH0sXG4gICAgXCJzbGlkZVwiOiB7XG4gICAgICBcIm9yZGVyXCI6IDIsXG4gICAgICBcIm1heExldmVsXCI6IDEwLFxuICAgICAgXCJiYXNlQ29zdFwiOiAzNSxcbiAgICAgIFwiY29zdEdyb3d0aFwiOiAxLjUyLFxuICAgICAgXCJ2YWx1ZXNcIjogW1xuICAgICAgICAwLFxuICAgICAgICAwLjA2LFxuICAgICAgICAwLjExLFxuICAgICAgICAwLjE2LFxuICAgICAgICAwLjIsXG4gICAgICAgIDAuMjQsXG4gICAgICAgIDAuMjgsXG4gICAgICAgIDAuMzIsXG4gICAgICAgIDAuMzUsXG4gICAgICAgIDAuMzgsXG4gICAgICAgIDAuNDFcbiAgICAgIF0sXG4gICAgICBcInVubG9ja1wiOiB7XG4gICAgICAgIFwicnVuc1wiOiAyXG4gICAgICB9XG4gICAgfSxcbiAgICBcIm1hZ25ldFwiOiB7XG4gICAgICBcIm9yZGVyXCI6IDMsXG4gICAgICBcIm1heExldmVsXCI6IDgsXG4gICAgICBcImJhc2VDb3N0XCI6IDYwLFxuICAgICAgXCJjb3N0R3Jvd3RoXCI6IDEuNTUsXG4gICAgICBcInZhbHVlc1wiOiBbXG4gICAgICAgIDAsXG4gICAgICAgIDcwLFxuICAgICAgICAxMDAsXG4gICAgICAgIDEzMCxcbiAgICAgICAgMTYwLFxuICAgICAgICAxOTAsXG4gICAgICAgIDIyMCxcbiAgICAgICAgMjUwLFxuICAgICAgICAyODBcbiAgICAgIF0sXG4gICAgICBcInVubG9ja1wiOiB7XG4gICAgICAgIFwiaXNsYW5kXCI6IDJcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiZ2xpZGVcIjoge1xuICAgICAgXCJvcmRlclwiOiA0LFxuICAgICAgXCJtYXhMZXZlbFwiOiA4LFxuICAgICAgXCJiYXNlQ29zdFwiOiAxMTAsXG4gICAgICBcImNvc3RHcm93dGhcIjogMS41NSxcbiAgICAgIFwidmFsdWVzXCI6IFtcbiAgICAgICAgMCxcbiAgICAgICAgMC4wOCxcbiAgICAgICAgMC4xNCxcbiAgICAgICAgMC4xOSxcbiAgICAgICAgMC4yNCxcbiAgICAgICAgMC4yOCxcbiAgICAgICAgMC4zMixcbiAgICAgICAgMC4zNSxcbiAgICAgICAgMC4zOFxuICAgICAgXSxcbiAgICAgIFwidW5sb2NrXCI6IHtcbiAgICAgICAgXCJpc2xhbmRcIjogM1xuICAgICAgfVxuICAgIH0sXG4gICAgXCJzY2FyZlwiOiB7XG4gICAgICBcIm9yZGVyXCI6IDUsXG4gICAgICBcIm1heExldmVsXCI6IDUsXG4gICAgICBcImJhc2VDb3N0XCI6IDI1MCxcbiAgICAgIFwiY29zdEdyb3d0aFwiOiAxLjgsXG4gICAgICBcInZhbHVlc1wiOiBbXG4gICAgICAgIDAsXG4gICAgICAgIDEsXG4gICAgICAgIDEsXG4gICAgICAgIDIsXG4gICAgICAgIDIsXG4gICAgICAgIDNcbiAgICAgIF0sXG4gICAgICBcInB1c2hiYWNrXCI6IFtcbiAgICAgICAgMCxcbiAgICAgICAgNjAwLFxuICAgICAgICA5MDAsXG4gICAgICAgIDkwMCxcbiAgICAgICAgMTIwMCxcbiAgICAgICAgMTIwMFxuICAgICAgXSxcbiAgICAgIFwidW5sb2NrXCI6IHtcbiAgICAgICAgXCJpc2xhbmRcIjogNFxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgXCJibGl6emFyZFwiOiB7XG4gICAgXCJtYXhHYXBcIjogMTUwMCxcbiAgICBcImRhbmdlckdhcFwiOiA1MjAsXG4gICAgXCJydWJiZXJCYW5kTXVsXCI6IDIuMixcbiAgICBcInR1dG9yaWFsRGVsYXlcIjogOS4wXG4gIH0sXG4gIFwiZWNvbm9teVwiOiB7XG4gICAgXCJmaXNoVmFsdWVcIjogMSxcbiAgICBcImdvbGRGaXNoVmFsdWVcIjogMTAsXG4gICAgXCJkaXN0YW5jZUZpc2hQZXJNZXRlclwiOiAwLjA0LFxuICAgIFwiaXNsYW5kRmlyc3RCb251c1wiOiBbXG4gICAgICAwLFxuICAgICAgMCxcbiAgICAgIDYwLFxuICAgICAgMTIwLFxuICAgICAgMjAwLFxuICAgICAgMzAwLFxuICAgICAgNDIwLFxuICAgICAgNTYwLFxuICAgICAgNzIwLFxuICAgICAgOTAwLFxuICAgICAgMTEwMFxuICAgIF0sXG4gICAgXCJpc2xhbmRSZXBlYXRCb251c1wiOiAwLjE1LFxuICAgIFwicG9wdWxhdGlvbkJvbnVzUGVyUGVuZ3VpblwiOiAwLjAxXG4gIH1cbn0iLCAie1xuICBcImlkXCI6IFwiaXNsYW5kMDFcIixcbiAgXCJuYW1lXCI6IHsgXCJrb1wiOiBcIlx1Q0NBQiBcdUIyMDhcdUJDMkRcIiwgXCJlblwiOiBcIkZpcnN0IFNub3dcIiB9LFxuICBcImJpb21lXCI6IFwiZGF3blwiLFxuICBcInBvaW50c1wiOiBbWzAsMzgwXSxbNTIwLDBdLFsxMDUwLDMwMF0sWzE2MDAsLTIwXSxbMjE1MCwzMzBdLFsyNzUwLC00MF0sWzMzMDAsMzYwXSxbMzkwMCwtNjBdLFs0NTAwLDM4MF0sWzUxMDAsLTQwXSxbNTcwMCw0MjBdLFs2MzAwLC02MF0sWzY5MDAsNDAwXSxbNzUwMCwtODBdLFs4MjAwLDUyMF1dLFxuICBcImZpc2hcIjogW10sXG4gIFwiYmxpenphcmRcIjogeyBcInN0YXJ0R2FwXCI6IDExMDAsIFwic3BlZWRcIjogNjAwLCBcImFjY2VsXCI6IDYgfVxufVxuIiwgIi8vIEdlbmVyYXRlZCBieSB0b29scy9idWlsZC5tanMgZnJvbSBzcmMvZGF0YS9sZXZlbHMvKi5qc29uLiBEbyBub3QgZWRpdCBieSBoYW5kLlxuaW1wb3J0IEwwIGZyb20gJy4vbGV2ZWxzL2lzbGFuZDAxLmpzb24nO1xuZXhwb3J0IGNvbnN0IExFVkVMUyA9IFtMMF07XG4iLCAiLy8gU21hbGwgZGV0ZXJtaW5pc3RpYyBSTkcgKG11bGJlcnJ5MzIpIHNvIGxldmVscywgZGFpbHkgaXNsYW5kcyBhbmQgYm90cyBhcmUgcmVwcm9kdWNpYmxlLlxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VSbmcoc2VlZCkge1xuICBsZXQgYSA9IHNlZWQgPj4+IDA7XG4gIGNvbnN0IG5leHQgPSAoKSA9PiB7XG4gICAgYSA9IChhICsgMHg2ZDJiNzlmNSkgPj4+IDA7XG4gICAgbGV0IHQgPSBhO1xuICAgIHQgPSBNYXRoLmltdWwodCBeICh0ID4+PiAxNSksIHQgfCAxKTtcbiAgICB0IF49IHQgKyBNYXRoLmltdWwodCBeICh0ID4+PiA3KSwgdCB8IDYxKTtcbiAgICByZXR1cm4gKCh0IF4gKHQgPj4+IDE0KSkgPj4+IDApIC8gNDI5NDk2NzI5NjtcbiAgfTtcbiAgcmV0dXJuIHtcbiAgICBuZXh0LFxuICAgIHJhbmdlOiAobG8sIGhpKSA9PiBsbyArIChoaSAtIGxvKSAqIG5leHQoKSxcbiAgICBpbnQ6IChsbywgaGkpID0+IE1hdGguZmxvb3IobG8gKyAoaGkgLSBsbyArIDEpICogbmV4dCgpKSxcbiAgICBwaWNrOiAoYXJyKSA9PiBhcnJbTWF0aC5mbG9vcihuZXh0KCkgKiBhcnIubGVuZ3RoKV0sXG4gICAgY2hhbmNlOiAocCkgPT4gbmV4dCgpIDwgcCxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc2hTdHJpbmcoc3RyKSB7XG4gIGxldCBoID0gMjE2NjEzNjI2MSA+Pj4gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBoIF49IHN0ci5jaGFyQ29kZUF0KGkpO1xuICAgIGggPSBNYXRoLmltdWwoaCwgMTY3Nzc2MTkpID4+PiAwO1xuICB9XG4gIHJldHVybiBoO1xufVxuIiwgIi8vIFdvcmxkID0gaXNsYW5kcyBsYWlkIG91dCBsZWZ0IHRvIHJpZ2h0IHdpdGggYSBzZWEgZ2FwIGJldHdlZW4gdGhlbS5cbi8vIEVhY2ggaXNsYW5kJ3MgdGVycmFpbiBpcyBhIGNoYWluIG9mIGtleXBvaW50cyBqb2luZWQgYnkgY29zaW5lIGN1cnZlcyAoemVybyBzbG9wZSBhdCBrZXlwb2ludHMpLFxuLy8gd2hpY2ggZ2l2ZXMgdGhlIHNvZnQgVGlueS1XaW5ncy1saWtlIGhpbGxzLiBFdmVyeXRoaW5nIGhlcmUgaXMgcHVyZSBkYXRhICsgbWF0aCBzbyB0aGUgc2FtZSBjb2RlXG4vLyBydW5zIGluIHRoZSBnYW1lLCB0aGUgbGV2ZWwgZWRpdG9yLCBhbmQgdGhlIG5vZGUgdmVyaWZpY2F0aW9uIHRvb2xzLlxuaW1wb3J0IHsgbWFrZVJuZyB9IGZyb20gJy4vcm5nLmpzJztcblxuZXhwb3J0IGNvbnN0IFNFQV9HQVAgPSAxNTAwO1xuZXhwb3J0IGNvbnN0IFNFQV9MRVZFTCA9IC01MjA7XG5cbmZ1bmN0aW9uIGV4cGFuZEZpc2gobGV2ZWwsIGlzbGFuZCwgb3gpIHtcbiAgY29uc3Qgb3V0ID0gW107XG4gIGNvbnN0IGFkZCA9ICh4LCB5LCBnb2xkID0gZmFsc2UpID0+IG91dC5wdXNoKHsgeDogb3ggKyB4LCB5LCBnb2xkLCB0YWtlbjogZmFsc2UsIHB1bGw6IDAgfSk7XG4gIGZvciAoY29uc3QgZiBvZiBsZXZlbC5maXNoIHx8IFtdKSB7XG4gICAgY29uc3QgbiA9IE1hdGgubWF4KDEsIGYubiB8IDApO1xuICAgIGlmIChmLnR5cGUgPT09ICdhcmMnKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgICBjb25zdCB0ID0gbiA9PT0gMSA/IDAuNSA6IGkgLyAobiAtIDEpO1xuICAgICAgICBjb25zdCB4ID0gZi54ICsgZi53ICogdDtcbiAgICAgICAgY29uc3QgeSA9IGYueSArIGYuaCAqIDQgKiB0ICogKDEgLSB0KTtcbiAgICAgICAgYWRkKHgsIHksICEhZi5nb2xkICYmIChmLmdvbGRBdCA9PSBudWxsID8gaSA9PT0gTWF0aC5mbG9vcihuIC8gMikgOiBpID09PSBmLmdvbGRBdCkpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZi50eXBlID09PSAnbGluZScpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHQgPSBuID09PSAxID8gMCA6IGkgLyAobiAtIDEpO1xuICAgICAgICBhZGQoZi54ICsgKGYueDIgLSBmLngpICogdCwgZi55ICsgKGYueTIgLSBmLnkpICogdCwgISFmLmdvbGQgJiYgaSA9PT0gbiAtIDEpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZi50eXBlID09PSAnZ3JvdW5kJykge1xuICAgICAgY29uc3Qgc3AgPSBmLnNwYWNpbmcgfHwgNjA7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgICBjb25zdCBseCA9IGYueCArIGkgKiBzcDtcbiAgICAgICAgYWRkKGx4LCBpc2xhbmQubG9jYWxIZWlnaHQobHgpICsgKGYub2ZmIHx8IDQ2KSwgZmFsc2UpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBhZGQoZi54LCBmLnksICEhZi5nb2xkKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuZXhwb3J0IGNsYXNzIElzbGFuZCB7XG4gIGNvbnN0cnVjdG9yKGxldmVsLCBpbmRleCwgc3RhcnRYKSB7XG4gICAgdGhpcy5sZXZlbCA9IGxldmVsO1xuICAgIHRoaXMuaW5kZXggPSBpbmRleDsgLy8gMC1iYXNlZCBvcmRlciBpbiB0aGUgcnVuXG4gICAgdGhpcy5pZCA9IGxldmVsLmlkO1xuICAgIHRoaXMuYmlvbWUgPSBsZXZlbC5iaW9tZSB8fCAnZGF3bic7XG4gICAgdGhpcy5zdXJmYWNlID0gbGV2ZWwuc3VyZmFjZSB8fCAnc25vdyc7XG4gICAgdGhpcy5zdGFydFggPSBzdGFydFg7XG4gICAgY29uc3QgcHRzID0gbGV2ZWwucG9pbnRzO1xuICAgIHRoaXMueHMgPSBuZXcgRmxvYXQ2NEFycmF5KHB0cy5sZW5ndGgpO1xuICAgIHRoaXMueXMgPSBuZXcgRmxvYXQ2NEFycmF5KHB0cy5sZW5ndGgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLnhzW2ldID0gc3RhcnRYICsgcHRzW2ldWzBdO1xuICAgICAgdGhpcy55c1tpXSA9IHB0c1tpXVsxXTtcbiAgICB9XG4gICAgdGhpcy5lbmRYID0gdGhpcy54c1twdHMubGVuZ3RoIC0gMV07XG4gICAgdGhpcy5sZW5ndGggPSB0aGlzLmVuZFggLSBzdGFydFg7XG4gICAgdGhpcy5uZXh0U3RhcnRYID0gdGhpcy5lbmRYICsgU0VBX0dBUDtcbiAgICB0aGlzLmljZSA9IChsZXZlbC5pY2UgfHwgW10pLm1hcCgoW2EsIGJdKSA9PiBbc3RhcnRYICsgYSwgc3RhcnRYICsgYl0pLnNvcnQoKHAsIHEpID0+IHBbMF0gLSBxWzBdKTtcbiAgICB0aGlzLndpbmQgPSAobGV2ZWwud2luZCB8fCBbXSkubWFwKCh3KSA9PiAoeyB4OiBzdGFydFggKyB3LngsIHc6IHcudywgaDogdy5oLCBwb3dlcjogdy5wb3dlciB8fCAxIH0pKTtcbiAgICB0aGlzLmdleXNlcnMgPSAobGV2ZWwuZ2V5c2VycyB8fCBbXSkubWFwKChnKSA9PiAoeyB4OiBzdGFydFggKyBnLngsIHVzZWQ6IGZhbHNlLCB0OiAwIH0pKTtcbiAgICB0aGlzLnJpbmdzID0gKGxldmVsLnJpbmdzIHx8IFtdKS5tYXAoKHIpID0+ICh7IHg6IHN0YXJ0WCArIHIueCwgeTogci55LCByOiByLnIgfHwgOTAsIHVzZWQ6IGZhbHNlIH0pKTtcbiAgICB0aGlzLmRlY29yID0gKGxldmVsLmRlY29yIHx8IFtdKS5tYXAoKGQpID0+ICh7IC4uLmQsIHg6IHN0YXJ0WCArIGQueCB9KSk7XG4gICAgdGhpcy5ibGl6emFyZCA9IE9iamVjdC5hc3NpZ24oeyBzdGFydEdhcDogMTEwMCwgc3BlZWQ6IDcwMCwgYWNjZWw6IDYgfSwgbGV2ZWwuYmxpenphcmQgfHwge30pO1xuICAgIHRoaXMuZmlzaCA9IGV4cGFuZEZpc2gobGV2ZWwsIHRoaXMsIHN0YXJ0WCkuc29ydCgoYSwgYikgPT4gYS54IC0gYi54KTtcbiAgICB0aGlzLmZpc2hUb3RhbCA9IHRoaXMuZmlzaC5yZWR1Y2UoKHMsIGYpID0+IHMgKyAoZi5nb2xkID8gMTAgOiAxKSwgMCk7XG4gICAgdGhpcy5fc2VnID0gMDtcbiAgfVxuXG4gIGxvY2FsSGVpZ2h0KGx4KSB7XG4gICAgcmV0dXJuIHRoaXMuaGVpZ2h0QXQodGhpcy5zdGFydFggKyBseCk7XG4gIH1cblxuICBfc2VnbWVudCh4KSB7XG4gICAgY29uc3QgeHMgPSB0aGlzLnhzO1xuICAgIGxldCBpID0gdGhpcy5fc2VnO1xuICAgIGlmIChpID49IHhzLmxlbmd0aCAtIDEpIGkgPSB4cy5sZW5ndGggLSAyO1xuICAgIGlmICh4ID49IHhzW2ldICYmIHggPD0geHNbaSArIDFdKSByZXR1cm4gaTtcbiAgICAvLyBiaW5hcnkgc2VhcmNoXG4gICAgbGV0IGxvID0gMCwgaGkgPSB4cy5sZW5ndGggLSAyO1xuICAgIHdoaWxlIChsbyA8IGhpKSB7XG4gICAgICBjb25zdCBtaWQgPSAobG8gKyBoaSArIDEpID4+IDE7XG4gICAgICBpZiAoeHNbbWlkXSA8PSB4KSBsbyA9IG1pZDsgZWxzZSBoaSA9IG1pZCAtIDE7XG4gICAgfVxuICAgIHRoaXMuX3NlZyA9IGxvO1xuICAgIHJldHVybiBsbztcbiAgfVxuXG4gIC8vIHJldHVybnMgW3ksIGR5L2R4LCBkMnkvZHgyXVxuICBzYW1wbGUoeCwgb3V0KSB7XG4gICAgY29uc3QgeHMgPSB0aGlzLnhzLCB5cyA9IHRoaXMueXM7XG4gICAgaWYgKHggPD0geHNbMF0pIHsgb3V0WzBdID0geXNbMF07IG91dFsxXSA9IDA7IG91dFsyXSA9IDA7IHJldHVybiBvdXQ7IH1cbiAgICBpZiAoeCA+PSB0aGlzLmVuZFgpIHsgb3V0WzBdID0geXNbeXMubGVuZ3RoIC0gMV07IG91dFsxXSA9IDA7IG91dFsyXSA9IDA7IHJldHVybiBvdXQ7IH1cbiAgICBjb25zdCBpID0gdGhpcy5fc2VnbWVudCh4KTtcbiAgICBjb25zdCB4MCA9IHhzW2ldLCB4MSA9IHhzW2kgKyAxXSwgeTAgPSB5c1tpXSwgeTEgPSB5c1tpICsgMV07XG4gICAgY29uc3QgdyA9IHgxIC0geDA7XG4gICAgY29uc3QgdCA9ICh4IC0geDApIC8gdztcbiAgICBjb25zdCBhID0gTWF0aC5QSSAqIHQ7XG4gICAgY29uc3QgZHkgPSB5MSAtIHkwO1xuICAgIG91dFswXSA9IHkwICsgZHkgKiAoMSAtIE1hdGguY29zKGEpKSAqIDAuNTtcbiAgICBvdXRbMV0gPSBkeSAqIE1hdGguUEkgKiAwLjUgKiBNYXRoLnNpbihhKSAvIHc7XG4gICAgb3V0WzJdID0gZHkgKiBNYXRoLlBJICogTWF0aC5QSSAqIDAuNSAqIE1hdGguY29zKGEpIC8gKHcgKiB3KTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgaGVpZ2h0QXQoeCkge1xuICAgIHJldHVybiB0aGlzLnNhbXBsZSh4LCBfdG1wKVswXTtcbiAgfVxuXG4gIGlzSWNlKHgpIHtcbiAgICBmb3IgKGNvbnN0IFthLCBiXSBvZiB0aGlzLmljZSkge1xuICAgICAgaWYgKHggPCBhKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAoeCA8PSBiKSByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmNvbnN0IF90bXAgPSBbMCwgMCwgMF07XG5cbmV4cG9ydCBjbGFzcyBXb3JsZCB7XG4gIC8vIGxldmVsczogb3JkZXJlZCBsaXN0IG9mIGxldmVsIGpzb24uIGdlbmVyYXRvcihpbmRleCkgc3VwcGxpZXMgZXh0cmEgbGV2ZWxzIGZvciBlbmRsZXNzIG1vZGUuXG4gIGNvbnN0cnVjdG9yKGxldmVscywgeyBzdGFydEluZGV4ID0gMCwgZ2VuZXJhdG9yID0gbnVsbCB9ID0ge30pIHtcbiAgICB0aGlzLmxldmVscyA9IGxldmVscztcbiAgICB0aGlzLmdlbmVyYXRvciA9IGdlbmVyYXRvcjtcbiAgICB0aGlzLmlzbGFuZHMgPSBbXTtcbiAgICB0aGlzLm9yaWdpbkluZGV4ID0gc3RhcnRJbmRleDtcbiAgICBsZXQgeCA9IDA7XG4gICAgLy8gSXNsYW5kcyBiZWZvcmUgdGhlIHN0YXJ0IGluZGV4IHN0aWxsIGV4aXN0IGxvZ2ljYWxseSAoZm9yIGRpc3RhbmNlIG51bWJlcmluZykgYnV0IGFyZSBub3QgYnVpbHQuXG4gICAgdGhpcy5iYXNlWCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFydEluZGV4ICYmIGkgPCBsZXZlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHggKz0gbGV2ZWxzW2ldLnBvaW50c1tsZXZlbHNbaV0ucG9pbnRzLmxlbmd0aCAtIDFdWzBdICsgU0VBX0dBUDtcbiAgICB9XG4gICAgdGhpcy5iYXNlWCA9IHg7XG4gICAgdGhpcy5fbmV4dEJ1aWxkSW5kZXggPSBzdGFydEluZGV4O1xuICAgIHRoaXMuX25leHRCdWlsZFggPSB4O1xuICAgIHRoaXMuZW5zdXJlSXNsYW5kcygyKTtcbiAgICB0aGlzLl9sYXN0ID0gdGhpcy5pc2xhbmRzWzBdO1xuICB9XG5cbiAgbGV2ZWxGb3IoaW5kZXgpIHtcbiAgICBpZiAoaW5kZXggPCB0aGlzLmxldmVscy5sZW5ndGgpIHJldHVybiB0aGlzLmxldmVsc1tpbmRleF07XG4gICAgaWYgKHRoaXMuZ2VuZXJhdG9yKSByZXR1cm4gdGhpcy5nZW5lcmF0b3IoaW5kZXgpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZW5zdXJlSXNsYW5kcyhjb3VudCkge1xuICAgIHdoaWxlICh0aGlzLmlzbGFuZHMubGVuZ3RoIDwgY291bnQpIHtcbiAgICAgIGNvbnN0IGx2ID0gdGhpcy5sZXZlbEZvcih0aGlzLl9uZXh0QnVpbGRJbmRleCk7XG4gICAgICBpZiAoIWx2KSByZXR1cm4gZmFsc2U7XG4gICAgICBjb25zdCBpc2wgPSBuZXcgSXNsYW5kKGx2LCB0aGlzLl9uZXh0QnVpbGRJbmRleCwgdGhpcy5fbmV4dEJ1aWxkWCk7XG4gICAgICB0aGlzLmlzbGFuZHMucHVzaChpc2wpO1xuICAgICAgdGhpcy5fbmV4dEJ1aWxkWCA9IGlzbC5uZXh0U3RhcnRYO1xuICAgICAgdGhpcy5fbmV4dEJ1aWxkSW5kZXgrKztcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBJc2xhbmQgd2hvc2Ugc3BhbiBbc3RhcnRYLCBuZXh0U3RhcnRYKSBjb250YWlucyB4LlxuICBpc2xhbmRBdCh4KSB7XG4gICAgY29uc3QgbCA9IHRoaXMuX2xhc3Q7XG4gICAgaWYgKGwgJiYgeCA+PSBsLnN0YXJ0WCAmJiB4IDwgbC5uZXh0U3RhcnRYKSByZXR1cm4gbDtcbiAgICBmb3IgKGNvbnN0IGlzbCBvZiB0aGlzLmlzbGFuZHMpIHtcbiAgICAgIGlmICh4ID49IGlzbC5zdGFydFggJiYgeCA8IGlzbC5uZXh0U3RhcnRYKSB7IHRoaXMuX2xhc3QgPSBpc2w7IHJldHVybiBpc2w7IH1cbiAgICB9XG4gICAgaWYgKHRoaXMuaXNsYW5kcy5sZW5ndGggJiYgeCA8IHRoaXMuaXNsYW5kc1swXS5zdGFydFgpIHJldHVybiB0aGlzLmlzbGFuZHNbMF07XG4gICAgcmV0dXJuIHRoaXMuaXNsYW5kc1t0aGlzLmlzbGFuZHMubGVuZ3RoIC0gMV07XG4gIH1cblxuICBpbkdhcCh4KSB7XG4gICAgY29uc3QgaXNsID0gdGhpcy5pc2xhbmRBdCh4KTtcbiAgICByZXR1cm4geCA+IGlzbC5lbmRYO1xuICB9XG5cbiAgc2FtcGxlKHgsIG91dCA9IFswLCAwLCAwXSkge1xuICAgIGNvbnN0IGlzbCA9IHRoaXMuaXNsYW5kQXQoeCk7XG4gICAgaWYgKHggPiBpc2wuZW5kWCkge1xuICAgICAgb3V0WzBdID0gU0VBX0xFVkVMOyBvdXRbMV0gPSAwOyBvdXRbMl0gPSAwO1xuICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG4gICAgcmV0dXJuIGlzbC5zYW1wbGUoeCwgb3V0KTtcbiAgfVxuXG4gIGhlaWdodEF0KHgpIHtcbiAgICByZXR1cm4gdGhpcy5zYW1wbGUoeCwgX3RtcClbMF07XG4gIH1cblxuICAvLyBIZWlnaHQgdXNlZCBmb3IgZHJhd2luZzogaXNsYW5kcyBmYWxsIG9mZiBpbnRvIHRoZSBzZWEgd2l0aCBhIGNsaWZmIGN1cnZlLlxuICBkcmF3SGVpZ2h0QXQoeCkge1xuICAgIGNvbnN0IGlzbCA9IHRoaXMuaXNsYW5kQXQoeCk7XG4gICAgaWYgKHggPD0gaXNsLmVuZFgpIHtcbiAgICAgIGlmICh4IDwgaXNsLnN0YXJ0WCkgcmV0dXJuIHRoaXMuX2NsaWZmSW4oaXNsLCB4KTtcbiAgICAgIHJldHVybiBpc2wuaGVpZ2h0QXQoeCk7XG4gICAgfVxuICAgIGNvbnN0IG5leHQgPSB0aGlzLmlzbGFuZHNbdGhpcy5pc2xhbmRzLmluZGV4T2YoaXNsKSArIDFdO1xuICAgIGNvbnN0IGQgPSB4IC0gaXNsLmVuZFg7XG4gICAgY29uc3QgeUVuZCA9IGlzbC55c1tpc2wueXMubGVuZ3RoIC0gMV07XG4gICAgY29uc3Qgb3V0RHJvcCA9IE1hdGgubWluKDEsIGQgLyAyNjApO1xuICAgIGNvbnN0IHlPdXQgPSB5RW5kICsgKFNFQV9MRVZFTCAtIDIwMCAtIHlFbmQpICogKG91dERyb3AgKiBvdXREcm9wICogKDMgLSAyICogb3V0RHJvcCkpO1xuICAgIGlmICghbmV4dCkgcmV0dXJuIHlPdXQ7XG4gICAgY29uc3QgZGluID0gbmV4dC5zdGFydFggLSB4O1xuICAgIGlmIChkaW4gPCAyNjApIHJldHVybiBNYXRoLm1heCh5T3V0LCB0aGlzLl9jbGlmZkluKG5leHQsIHgpKTtcbiAgICByZXR1cm4geU91dDtcbiAgfVxuXG4gIF9jbGlmZkluKGlzbCwgeCkge1xuICAgIGNvbnN0IGQgPSBpc2wuc3RhcnRYIC0geDtcbiAgICBjb25zdCB5MCA9IGlzbC55c1swXTtcbiAgICBjb25zdCB0ID0gTWF0aC5taW4oMSwgTWF0aC5tYXgoMCwgZCAvIDI2MCkpO1xuICAgIHJldHVybiB5MCArIChTRUFfTEVWRUwgLSAyMDAgLSB5MCkgKiAodCAqIHQgKiAoMyAtIDIgKiB0KSk7XG4gIH1cbn1cblxuLy8gUHJvY2VkdXJhbCBpc2xhbmQgZm9yIGVuZGxlc3MgbW9kZSBhbmQgZGFpbHkgaXNsYW5kcy5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUxldmVsKHNlZWQsIG9wdHMgPSB7fSkge1xuICBjb25zdCBybmcgPSBtYWtlUm5nKHNlZWQpO1xuICBjb25zdCBoaWxscyA9IG9wdHMuaGlsbHMgfHwgcm5nLmludCgxNCwgMjApO1xuICBjb25zdCBwdHMgPSBbWzAsIDQyMF1dO1xuICBsZXQgeCA9IDA7XG4gIGxldCBiYXNlID0gMDtcbiAgY29uc3QgYW1wID0gb3B0cy5hbXAgfHwgMTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBoaWxsczsgaSsrKSB7XG4gICAgY29uc3Qgc3R5bGUgPSBybmcubmV4dCgpO1xuICAgIGxldCB3LCBoO1xuICAgIGlmIChzdHlsZSA8IDAuMikgeyB3ID0gcm5nLnJhbmdlKDI2MCwgMzQwKTsgaCA9IHJuZy5yYW5nZSgxMjAsIDIwMCk7IH0gLy8gY2hvcHB5XG4gICAgZWxzZSBpZiAoc3R5bGUgPCAwLjcpIHsgdyA9IHJuZy5yYW5nZSgzODAsIDU2MCk7IGggPSBybmcucmFuZ2UoMjIwLCAzODApOyB9IC8vIHJlZ3VsYXJcbiAgICBlbHNlIHsgdyA9IHJuZy5yYW5nZSg2MDAsIDgyMCk7IGggPSBybmcucmFuZ2UoMzgwLCA1NjApOyB9IC8vIGJpZ1xuICAgIGggKj0gYW1wO1xuICAgIHggKz0gdztcbiAgICBwdHMucHVzaChbTWF0aC5yb3VuZCh4KSwgTWF0aC5yb3VuZChiYXNlIC0gaCAqIDAuNSldKTtcbiAgICB4ICs9IHcgKiBybmcucmFuZ2UoMC44NSwgMS4xKTtcbiAgICBiYXNlID0gcm5nLnJhbmdlKC02MCwgNjApO1xuICAgIHB0cy5wdXNoKFtNYXRoLnJvdW5kKHgpLCBNYXRoLnJvdW5kKGJhc2UgKyBoICogMC41KV0pO1xuICB9XG4gIC8vIHJhbXBcbiAgeCArPSA1MjA7IHB0cy5wdXNoKFtNYXRoLnJvdW5kKHgpLCAtMTYwXSk7XG4gIHggKz0gNjQwOyBwdHMucHVzaChbTWF0aC5yb3VuZCh4KSwgMzgwXSk7XG4gIGNvbnN0IGZpc2ggPSBbXTtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBwdHMubGVuZ3RoIC0gMjsgaSArPSAyKSB7XG4gICAgaWYgKHJuZy5jaGFuY2UoMC42NSkpIHtcbiAgICAgIGNvbnN0IHBlYWsgPSBwdHNbaSArIDFdO1xuICAgICAgY29uc3QgaGkgPSBybmcuY2hhbmNlKDAuMzUpO1xuICAgICAgZmlzaC5wdXNoKHsgdHlwZTogJ2FyYycsIHg6IHBlYWtbMF0gLSAxMjAsIHk6IHBlYWtbMV0gKyAoaGkgPyAzODAgOiAxNDApLCB3OiBoaSA/IDUyMCA6IDMwMCwgaDogaGkgPyAyMjAgOiA5MCwgbjogaGkgPyA5IDogNiwgZ29sZDogaGkgJiYgcm5nLmNoYW5jZSgwLjUpIH0pO1xuICAgIH1cbiAgfVxuICBjb25zdCBpY2UgPSBbXTtcbiAgY29uc3Qgd2luZCA9IFtdO1xuICBjb25zdCBnZXlzZXJzID0gW107XG4gIGNvbnN0IHJpbmdzID0gW107XG4gIGlmIChvcHRzLmZlYXR1cmVzKSB7XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwdHMubGVuZ3RoIC0gMjsgaSArPSAyKSB7XG4gICAgICBjb25zdCBhID0gcHRzW2kgLSAxXSwgYiA9IHB0c1tpXTtcbiAgICAgIGNvbnN0IHIgPSBybmcubmV4dCgpO1xuICAgICAgaWYgKG9wdHMuZmVhdHVyZXMuaW5jbHVkZXMoJ2ljZScpICYmIHIgPCAwLjI1KSBpY2UucHVzaChbYVswXSArIDQwLCBiWzBdIC0gMjBdKTtcbiAgICAgIGVsc2UgaWYgKG9wdHMuZmVhdHVyZXMuaW5jbHVkZXMoJ3dpbmQnKSAmJiByIDwgMC40KSB3aW5kLnB1c2goeyB4OiBiWzBdICsgMTAwLCB3OiAyNjAsIGg6IDkwMCwgcG93ZXI6IDEgfSk7XG4gICAgICBlbHNlIGlmIChvcHRzLmZlYXR1cmVzLmluY2x1ZGVzKCdnZXlzZXInKSAmJiByIDwgMC41KSBnZXlzZXJzLnB1c2goeyB4OiBNYXRoLnJvdW5kKChhWzBdICsgYlswXSkgLyAyICsgKGJbMF0gLSBhWzBdKSAqIDAuNCkgfSk7XG4gICAgICBlbHNlIGlmIChvcHRzLmZlYXR1cmVzLmluY2x1ZGVzKCdyaW5nJykgJiYgciA8IDAuNikgcmluZ3MucHVzaCh7IHg6IGJbMF0gKyA1MDAsIHk6IGJbMV0gKyA2NTAsIHI6IDk1IH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgIGlkOiBvcHRzLmlkIHx8ICdnZW5fJyArIHNlZWQsXG4gICAgZ2VuZXJhdGVkOiB0cnVlLFxuICAgIGJpb21lOiBvcHRzLmJpb21lIHx8ICdza3knLFxuICAgIHN1cmZhY2U6IG9wdHMuc3VyZmFjZSB8fCAnc25vdycsXG4gICAgbmFtZTogb3B0cy5uYW1lIHx8IHsga286ICdcdUIwNURcdUM1QzZcdUIyOTQgXHVENTU4XHVCMjk4JywgZW46ICdFbmRsZXNzIFNreScgfSxcbiAgICBwb2ludHM6IHB0cyxcbiAgICBmaXNoLCBpY2UsIHdpbmQsIGdleXNlcnMsIHJpbmdzLFxuICAgIGRlY29yOiBbXSxcbiAgICBibGl6emFyZDogT2JqZWN0LmFzc2lnbih7IHN0YXJ0R2FwOiAxMjAwLCBzcGVlZDogMTE1MCwgYWNjZWw6IDggfSwgb3B0cy5ibGl6emFyZCB8fCB7fSksXG4gIH07XG59XG4iLCAiLy8gT25lIHJ1biAoXHVEMzEwKSBvZiBQZW5ndWluIFNsaWRlLiBQdXJlIHNpbXVsYXRpb246IG5vIHJlbmRlcmluZywgbm8gRE9NLCBkZXRlcm1pbmlzdGljIGZvciBhIGdpdmVuXG4vLyBpbnB1dCBzZXF1ZW5jZS4gVGhlIGdhbWUsIHRoZSBib3RzLCB0aGUgbGV2ZWwgZWRpdG9yIGFuZCB0aGUgbm9kZSB0b29scyBhbGwgZHJpdmUgdGhpcyBjbGFzcy5cbmltcG9ydCB7IFdvcmxkLCBTRUFfR0FQIH0gZnJvbSAnLi93b3JsZC5qcyc7XG5cbmV4cG9ydCBjb25zdCBTVEVQID0gMSAvIDEyMDtcblxuY29uc3QgdG1wID0gWzAsIDAsIDBdO1xuXG5leHBvcnQgZnVuY3Rpb24gdXBncmFkZVZhbHVlKGJhbGFuY2UsIGtleSwgbGV2ZWwpIHtcbiAgY29uc3QgdSA9IGJhbGFuY2UudXBncmFkZXNba2V5XTtcbiAgaWYgKCF1KSByZXR1cm4gMDtcbiAgY29uc3QgbHYgPSBNYXRoLm1heCgwLCBNYXRoLm1pbih1Lm1heExldmVsLCBsZXZlbCB8IDApKTtcbiAgcmV0dXJuIHUudmFsdWVzW2x2XTtcbn1cblxuZXhwb3J0IGNsYXNzIFJ1blNpbSB7XG4gIGNvbnN0cnVjdG9yKHsgbGV2ZWxzLCBiYWxhbmNlLCB1cGdyYWRlcyA9IHt9LCBzdGFydEluZGV4ID0gMCwgdHV0b3JpYWwgPSBmYWxzZSwgYXNzaXN0ID0gMCwgZ2VuZXJhdG9yID0gbnVsbCwgbW9kaWZpZXJzID0ge30gfSkge1xuICAgIHRoaXMuYmFsYW5jZSA9IGJhbGFuY2U7XG4gICAgdGhpcy5QID0gYmFsYW5jZS5waHlzaWNzO1xuICAgIHRoaXMud29ybGQgPSBuZXcgV29ybGQobGV2ZWxzLCB7IHN0YXJ0SW5kZXgsIGdlbmVyYXRvciB9KTtcbiAgICB0aGlzLm1vZGlmaWVycyA9IG1vZGlmaWVycztcbiAgICB0aGlzLnVwID0ge1xuICAgICAgZmxhcDogdXBncmFkZVZhbHVlKGJhbGFuY2UsICdmbGFwJywgdXBncmFkZXMuZmxhcCksXG4gICAgICBzbGlkZTogdXBncmFkZVZhbHVlKGJhbGFuY2UsICdzbGlkZScsIHVwZ3JhZGVzLnNsaWRlKSxcbiAgICAgIG1hZ25ldDogdXBncmFkZVZhbHVlKGJhbGFuY2UsICdtYWduZXQnLCB1cGdyYWRlcy5tYWduZXQpLFxuICAgICAgZ2xpZGU6IHVwZ3JhZGVWYWx1ZShiYWxhbmNlLCAnZ2xpZGUnLCB1cGdyYWRlcy5nbGlkZSksXG4gICAgICBzY2FyZjogdXBncmFkZVZhbHVlKGJhbGFuY2UsICdzY2FyZicsIHVwZ3JhZGVzLnNjYXJmKSxcbiAgICB9O1xuICAgIGNvbnN0IHNsID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oNSwgdXBncmFkZXMuc2NhcmYgfCAwKSk7XG4gICAgdGhpcy5zY2FyZlB1c2ggPSAoYmFsYW5jZS51cGdyYWRlcy5zY2FyZi5wdXNoYmFjayB8fCBbXSlbc2xdIHx8IDgwMDtcbiAgICB0aGlzLnNjYXJmQ2hhcmdlcyA9IHRoaXMudXAuc2NhcmY7XG4gICAgdGhpcy5hc3Npc3QgPSBhc3Npc3Q7XG4gICAgdGhpcy50dXRvcmlhbCA9IHR1dG9yaWFsO1xuICAgIHRoaXMudGltZSA9IDA7XG4gICAgdGhpcy5zdGF0ZSA9ICdydW4nOyAvLyBydW4gfCBjcm9zc2luZyB8IGNhdWdodFxuICAgIHRoaXMuZXZlbnRzID0gW107XG4gICAgdGhpcy5pc2xhbmQgPSB0aGlzLndvcmxkLmlzbGFuZHNbMF07XG4gICAgdGhpcy5pc2xhbmRUaW1lID0gMDtcbiAgICB0aGlzLmlzbGFuZHNDbGVhcmVkID0gMDtcbiAgICB0aGlzLnN0YXJ0SW5kZXggPSBzdGFydEluZGV4O1xuXG4gICAgY29uc3QgaXNsID0gdGhpcy5pc2xhbmQ7XG4gICAgY29uc3QgcCA9IHtcbiAgICAgIHg6IGlzbC5zdGFydFggKyA0LCB5OiAwLCB2eDogMCwgdnk6IDAsIHM6IHRoaXMuUC5zdGFydFNwZWVkICogKG1vZGlmaWVycy5zdGFydFNwZWVkTXVsIHx8IDEpLFxuICAgICAgZ3JvdW5kOiB0cnVlLCBwcmVzczogZmFsc2UsIHN0dW46IDAsIGFpcjogMCwgZmV2ZXI6IDAsIGNoYWluOiAwLFxuICAgICAgZmxpZ2h0TWF4OiAwLCBtaWxlc3RvbmU6IDAsIGxhc3RMYW5kOiBudWxsLCBhbmdsZTogMCwgc2xvcGU6IDAsIGljZTogZmFsc2UsXG4gICAgfTtcbiAgICBwLnkgPSBpc2wuaGVpZ2h0QXQocC54KTtcbiAgICB0aGlzLnAgPSBwO1xuICAgIHRoaXMuYmxpenphcmRYID0gcC54IC0gaXNsLmJsaXp6YXJkLnN0YXJ0R2FwO1xuICAgIHRoaXMuYmxpenphcmRWID0gMDtcbiAgICB0aGlzLmJsaXp6YXJkSG9sZCA9IHR1dG9yaWFsID8gYmFsYW5jZS5ibGl6emFyZC50dXRvcmlhbERlbGF5IDogMC44O1xuICAgIHRoaXMuY3Jvc3NpbmcgPSBudWxsO1xuICAgIHRoaXMuZmlzaEluZGV4ID0gMDtcbiAgICB0aGlzLnB1bGxpbmcgPSBbXTtcbiAgICB0aGlzLnN0YXRzID0ge1xuICAgICAgZmlzaDogMCwgZ29sZDogMCwgZmlzaFZhbHVlOiAwLCBwZXJmZWN0OiAwLCBnb29kOiAwLCBib25rOiAwLCBmZXZlcnM6IDAsIG1heEhlaWdodDogMCxcbiAgICAgIG1heFNwZWVkOiAwLCBhaXJUaW1lOiAwLCBncm91bmRUaW1lOiAwLCBwcmVzc1VwOiAwLCBwcmVzc0Rvd246IDAsIHJlbGVhc2VEb3duOiAwLCByZWxlYXNlVXA6IDAsXG4gICAgICBtaWxlc3RvbmVGaXNoOiAwLCByaW5nczogMCwgZ2V5c2VyczogMCwgc2Vjb25kV2luZHM6IDAsIGNsb3NlQ2FsbHM6IDAsIG1pbkdhcDogMWU5LFxuICAgICAgaGlsbHM6IDAsXG4gICAgfTtcbiAgICB0aGlzLl93YXNEYW5nZXIgPSBmYWxzZTtcbiAgfVxuXG4gIGdldCBkaXN0YW5jZVVuaXRzKCkgeyByZXR1cm4gdGhpcy5wLng7IH1cbiAgZ2V0IGRpc3RhbmNlTWV0ZXJzKCkgeyByZXR1cm4gTWF0aC5tYXgoMCwgTWF0aC5mbG9vcih0aGlzLnAueCAvIHRoaXMuYmFsYW5jZS5kaXNwbGF5LnVuaXRzUGVyTWV0ZXIpKTsgfVxuICBnZXQgZ2FwKCkgeyByZXR1cm4gdGhpcy5wLnggLSB0aGlzLmJsaXp6YXJkWDsgfVxuICBnZXQgaGVpZ2h0QWJvdmVHcm91bmQoKSB7IHJldHVybiB0aGlzLnAuZ3JvdW5kID8gMCA6IHRoaXMucC55IC0gdGhpcy53b3JsZC5oZWlnaHRBdCh0aGlzLnAueCk7IH1cblxuICBlbWl0KHR5cGUsIGRhdGEgPSB7fSkge1xuICAgIHRoaXMuZXZlbnRzLnB1c2goeyB0eXBlLCB0OiB0aGlzLnRpbWUsIC4uLmRhdGEgfSk7XG4gIH1cblxuICBkcmFpbkV2ZW50cygpIHtcbiAgICBjb25zdCBlID0gdGhpcy5ldmVudHM7XG4gICAgdGhpcy5ldmVudHMgPSBbXTtcbiAgICByZXR1cm4gZTtcbiAgfVxuXG4gIG1heFNwZWVkKCkge1xuICAgIGNvbnN0IFAgPSB0aGlzLlA7XG4gICAgcmV0dXJuIFAubWF4U3BlZWQgKiAoMSArIHRoaXMudXAuc2xpZGUgKiAwLjUpICogKHRoaXMucC5mZXZlciA+IDAgPyBQLmZldmVyU3BlZWRNdWwgOiAxKTtcbiAgfVxuXG4gIHN0ZXAoZHQsIHByZXNzKSB7XG4gICAgdGhpcy50aW1lICs9IGR0O1xuICAgIGNvbnN0IHAgPSB0aGlzLnA7XG4gICAgcC5wcmVzcyA9IHByZXNzO1xuICAgIGlmICh0aGlzLnN0YXRlID09PSAnY2F1Z2h0JykgcmV0dXJuO1xuICAgIGlmICh0aGlzLnN0YXRlID09PSAnY3Jvc3NpbmcnKSB7IHRoaXMuX3N0ZXBDcm9zc2luZyhkdCk7IHJldHVybjsgfVxuICAgIHRoaXMuaXNsYW5kVGltZSArPSBkdDtcbiAgICBpZiAocC5zdHVuID4gMCkgcC5zdHVuIC09IGR0O1xuICAgIGlmIChwLmZldmVyID4gMCkge1xuICAgICAgcC5mZXZlciAtPSBkdDtcbiAgICAgIGlmIChwLmZldmVyIDw9IDApIHsgcC5mZXZlciA9IDA7IHRoaXMuZW1pdCgnZmV2ZXJFbmQnKTsgfVxuICAgIH1cbiAgICBpZiAocC5ncm91bmQpIHRoaXMuX3N0ZXBHcm91bmQoZHQsIHByZXNzKTsgZWxzZSB0aGlzLl9zdGVwQWlyKGR0LCBwcmVzcyk7XG4gICAgdGhpcy5fY29sbGVjdCgpO1xuICAgIHRoaXMuX29iamVjdHMoZHQpO1xuICAgIHRoaXMuX2JsaXp6YXJkKGR0KTtcbiAgICBjb25zdCBzcCA9IE1hdGguaHlwb3QocC52eCwgcC52eSk7XG4gICAgaWYgKHNwID4gdGhpcy5zdGF0cy5tYXhTcGVlZCkgdGhpcy5zdGF0cy5tYXhTcGVlZCA9IHNwO1xuICAgIGlmIChwLnggPj0gdGhpcy5pc2xhbmQuZW5kWCAmJiB0aGlzLnN0YXRlID09PSAncnVuJykgdGhpcy5fc3RhcnRDcm9zc2luZygpO1xuICB9XG5cbiAgX3N0ZXBHcm91bmQoZHQsIHByZXNzKSB7XG4gICAgY29uc3QgUCA9IHRoaXMuUCwgcCA9IHRoaXMucCwgaXNsID0gdGhpcy5pc2xhbmQ7XG4gICAgaXNsLnNhbXBsZShwLngsIHRtcCk7XG4gICAgbGV0IGQgPSB0bXBbMV07XG4gICAgY29uc3QgZGQgPSB0bXBbMl07XG4gICAgY29uc3QgY29zID0gMSAvIE1hdGguc3FydCgxICsgZCAqIGQpO1xuICAgIGNvbnN0IHNpbiA9IGQgKiBjb3M7XG4gICAgY29uc3QgaWNlID0gaXNsLmlzSWNlKHAueCkgfHwgdGhpcy5tb2RpZmllcnMuYWxsSWNlO1xuICAgIHAuaWNlID0gaWNlO1xuICAgIGNvbnN0IGNsb3VkID0gaXNsLnN1cmZhY2UgPT09ICdjbG91ZCc7XG4gICAgY29uc3QgZWZmUHJlc3MgPSBwcmVzcyAmJiBwLnN0dW4gPD0gMDtcbiAgICBsZXQgZyA9IFAuZ3Jhdml0eTtcbiAgICBpZiAoZWZmUHJlc3MpIHtcbiAgICAgIGcgKj0gUC5wcmVzc0dyYXZpdHlNdWw7XG4gICAgICBpZiAoZCA8IDApIGcgKj0gMSArIHRoaXMudXAuc2xpZGU7XG4gICAgICBpZiAoZCA8IDAgJiYgaWNlKSBnICo9IFAuaWNlQWNjZWxNdWw7XG4gICAgfVxuICAgIGxldCBmciA9IFAuZ3JvdW5kRnJpY3Rpb24gKiAoaWNlID8gUC5pY2VGcmljdGlvbk11bCA6IDEpICogKGNsb3VkID8gMS40IDogMSk7XG4gICAgbGV0IGEgPSAtZyAqIHNpbiAtIGZyIC0gUC5ncm91bmREcmFnICogcC5zICogcC5zO1xuICAgIHAucyArPSBhICogZHQ7XG4gICAgY29uc3QgbXMgPSB0aGlzLm1heFNwZWVkKCk7XG4gICAgaWYgKHAucyA+IG1zKSBwLnMgPSBtcyAtIChwLnMgLSBtcykgKiAwLjU7XG4gICAgaWYgKHAucyA8IFAubWluU3BlZWQpIHAucyA9IFAubWluU3BlZWQ7XG4gICAgLy8gc3RhdGlzdGljcyBmb3IgdGhlIHBvc3QtcnVuIHRpcFxuICAgIHRoaXMuc3RhdHMuZ3JvdW5kVGltZSArPSBkdDtcbiAgICBpZiAoZCA+IDAuMDgpIHsgaWYgKHByZXNzKSB0aGlzLnN0YXRzLnByZXNzVXAgKz0gZHQ7IGVsc2UgdGhpcy5zdGF0cy5yZWxlYXNlVXAgKz0gZHQ7IH1cbiAgICBlbHNlIGlmIChkIDwgLTAuMDgpIHsgaWYgKHByZXNzKSB0aGlzLnN0YXRzLnByZXNzRG93biArPSBkdDsgZWxzZSB0aGlzLnN0YXRzLnJlbGVhc2VEb3duICs9IGR0OyB9XG4gICAgLy8gbGVhdmUgdGhlIGdyb3VuZCB3aGVuIHRoZSBoaWxsIGN1cnZlcyBhd2F5IGZhc3RlciB0aGFuIGdyYXZpdHkgY2FuIGhvbGQgdXNcbiAgICBjb25zdCBrYXBwYSA9IC1kZCAvIE1hdGgucG93KDEgKyBkICogZCwgMS41KTtcbiAgICBjb25zdCBub3JtYWwgPSBnICogY29zIC0gcC5zICogcC5zICoga2FwcGE7XG4gICAgaWYgKG5vcm1hbCA8IDApIHtcbiAgICAgIHRoaXMuX3Rha2VvZmYoY29zLCBzaW4pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBwLnggKz0gcC5zICogY29zICogZHQ7XG4gICAgaXNsLnNhbXBsZShwLngsIHRtcCk7XG4gICAgcC55ID0gdG1wWzBdO1xuICAgIHAuc2xvcGUgPSB0bXBbMV07XG4gICAgcC52eCA9IHAucyAqIGNvcztcbiAgICBwLnZ5ID0gcC5zICogc2luO1xuICB9XG5cbiAgX3Rha2VvZmYoY29zLCBzaW4pIHtcbiAgICBjb25zdCBwID0gdGhpcy5wO1xuICAgIHAuZ3JvdW5kID0gZmFsc2U7XG4gICAgcC52eCA9IHAucyAqIGNvcztcbiAgICBwLnZ5ID0gcC5zICogc2luO1xuICAgIGxldCBmbGFwViA9IDA7XG4gICAgaWYgKHRoaXMudXAuZmxhcCA+IDAgJiYgc2luID4gLTAuMDUpIHtcbiAgICAgIGZsYXBWID0gdGhpcy51cC5mbGFwICogcC5zICogTWF0aC5tYXgoMC4xNSwgc2luICsgMC4yNSk7XG4gICAgICBwLnZ5ICs9IGZsYXBWO1xuICAgIH1cbiAgICBwLmFpciA9IDA7XG4gICAgcC5mbGlnaHRNYXggPSAwO1xuICAgIHAubWlsZXN0b25lID0gMDtcbiAgICBwLnRha2VvZmZYID0gcC54O1xuICAgIHAudGFrZW9mZlkgPSBwLnk7XG4gICAgcC5mbGFwViA9IGZsYXBWO1xuICAgIHAubGF1bmNoU3BlZWQgPSBwLnM7XG4gICAgcC5hbm5vdW5jZWQgPSBmYWxzZTtcbiAgfVxuXG4gIF9zdGVwQWlyKGR0LCBwcmVzcykge1xuICAgIGNvbnN0IFAgPSB0aGlzLlAsIHAgPSB0aGlzLnAsIGlzbCA9IHRoaXMuaXNsYW5kO1xuICAgIGxldCBnID0gUC5ncmF2aXR5O1xuICAgIGlmIChwcmVzcykgZyAqPSBQLmFpclByZXNzR3Jhdml0eU11bDtcbiAgICBlbHNlIGlmIChwLnZ5IDwgMCAmJiB0aGlzLnVwLmdsaWRlID4gMCkgZyAqPSAxIC0gdGhpcy51cC5nbGlkZTtcbiAgICBwLnkgKz0gcC52eSAqIGR0IC0gMC41ICogZyAqIGR0ICogZHQ7XG4gICAgcC52eSAtPSBnICogZHQ7XG4gICAgLy8gd2luZCBjb2x1bW5zIGxpZnQgYSByZWxlYXNlZCBwZW5ndWluXG4gICAgaWYgKCFwcmVzcykge1xuICAgICAgZm9yIChjb25zdCB3IG9mIGlzbC53aW5kKSB7XG4gICAgICAgIGlmIChwLnggPj0gdy54ICYmIHAueCA8PSB3LnggKyB3LncpIHtcbiAgICAgICAgICBjb25zdCBneSA9IGlzbC5oZWlnaHRBdChwLngpO1xuICAgICAgICAgIGlmIChwLnkgPCBneSArIHcuaCkge1xuICAgICAgICAgICAgcC52eSArPSBQLndpbmRBY2NlbCAqIHcucG93ZXIgKiBkdDtcbiAgICAgICAgICAgIGlmIChwLnZ5ID4gMTUwMCkgcC52eSA9IDE1MDA7XG4gICAgICAgICAgICBpZiAoIXcuX2luc2lkZSkgeyB3Ll9pbnNpZGUgPSB0cnVlOyB0aGlzLmVtaXQoJ3dpbmQnLCB7IHg6IHAueCB9KTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHcuX2luc2lkZSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBzcCA9IE1hdGguaHlwb3QocC52eCwgcC52eSk7XG4gICAgY29uc3QgZHJhZyA9IDEgLSBQLmFpckRyYWcgKiBzcCAqIGR0O1xuICAgIHAudnggKj0gZHJhZzsgcC52eSAqPSBkcmFnO1xuICAgIGlmIChwLnZ4IDwgUC5taW5TcGVlZCAqIDAuNikgcC52eCA9IFAubWluU3BlZWQgKiAwLjY7XG4gICAgcC54ICs9IHAudnggKiBkdDtcbiAgICBwLmFpciArPSBkdDtcbiAgICB0aGlzLnN0YXRzLmFpclRpbWUgKz0gZHQ7XG4gICAgY29uc3QgZ3kgPSB0aGlzLndvcmxkLmhlaWdodEF0KHAueCk7XG4gICAgY29uc3QgaCA9IHAueSAtIGd5O1xuICAgIGlmICghcC5hbm5vdW5jZWQgJiYgcC5haXIgPiAwLjA3ICYmIGggPiA2KSB7XG4gICAgICBwLmFubm91bmNlZCA9IHRydWU7XG4gICAgICB0aGlzLnN0YXRzLmhpbGxzKys7XG4gICAgICB0aGlzLmVtaXQoJ3Rha2VvZmYnLCB7IHNwZWVkOiBwLmxhdW5jaFNwZWVkLCBhbmdsZTogTWF0aC5hdGFuMihwLnZ5LCBwLnZ4KSwgZmxhcDogcC5mbGFwViB8fCAwIH0pO1xuICAgIH1cbiAgICBpZiAoaCA+IHAuZmxpZ2h0TWF4KSB7XG4gICAgICBwLmZsaWdodE1heCA9IGg7XG4gICAgICBpZiAoaCA+IHRoaXMuc3RhdHMubWF4SGVpZ2h0KSB0aGlzLnN0YXRzLm1heEhlaWdodCA9IGg7XG4gICAgICBjb25zdCBtcyA9IFAuaGVpZ2h0TWlsZXN0b25lcztcbiAgICAgIGNvbnN0IHVwbSA9IHRoaXMuYmFsYW5jZS5kaXNwbGF5LnVuaXRzUGVyTWV0ZXI7XG4gICAgICB3aGlsZSAocC5taWxlc3RvbmUgPCBtcy5sZW5ndGggJiYgaCA+PSBtc1twLm1pbGVzdG9uZV0gKiB1cG0pIHtcbiAgICAgICAgY29uc3QgYm9udXMgPSBQLmhlaWdodE1pbGVzdG9uZUZpc2hbcC5taWxlc3RvbmVdO1xuICAgICAgICB0aGlzLnN0YXRzLm1pbGVzdG9uZUZpc2ggKz0gYm9udXM7XG4gICAgICAgIHRoaXMuZW1pdCgnaGVpZ2h0JywgeyBtZXRlcnM6IG1zW3AubWlsZXN0b25lXSwgYm9udXMsIGxldmVsOiBwLm1pbGVzdG9uZSB9KTtcbiAgICAgICAgcC5taWxlc3RvbmUrKztcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gcmluZ3NcbiAgICBmb3IgKGNvbnN0IHIgb2YgaXNsLnJpbmdzKSB7XG4gICAgICBpZiAoci51c2VkKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IGR4ID0gcC54IC0gci54LCBkeSA9IHAueSAtIHIueTtcbiAgICAgIGlmIChkeCAqIGR4ICsgZHkgKiBkeSA8IHIuciAqIHIucikge1xuICAgICAgICByLnVzZWQgPSB0cnVlO1xuICAgICAgICBwLnZ4ICo9IFAucmluZ0Jvb3N0OyBwLnZ5ID0gTWF0aC5tYXgocC52eSwgMCkgKiBQLnJpbmdCb29zdCArIDIwMDtcbiAgICAgICAgdGhpcy5zdGF0cy5yaW5ncysrO1xuICAgICAgICB0aGlzLmVtaXQoJ3JpbmcnLCB7IHg6IHIueCwgeTogci55IH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocC55IDw9IGd5ICYmIHAueCA8PSBpc2wuZW5kWCkgdGhpcy5fbGFuZChneSk7XG4gIH1cblxuICBfbGFuZChneSkge1xuICAgIGNvbnN0IFAgPSB0aGlzLlAsIHAgPSB0aGlzLnAsIGlzbCA9IHRoaXMuaXNsYW5kO1xuICAgIGlzbC5zYW1wbGUocC54LCB0bXApO1xuICAgIGNvbnN0IGQgPSB0bXBbMV07XG4gICAgY29uc3Qgc3BlZWQgPSBNYXRoLmh5cG90KHAudngsIHAudnkpO1xuICAgIGNvbnN0IGFuZ1YgPSBNYXRoLmF0YW4yKHAudnksIHAudngpO1xuICAgIGNvbnN0IGFuZ1QgPSBNYXRoLmF0YW4oZCk7XG4gICAgY29uc3QgYWxwaGEgPSBNYXRoLmFicyhhbmdWIC0gYW5nVCk7XG4gICAgY29uc3QgYWxvbmcgPSBzcGVlZCAqIE1hdGguY29zKE1hdGgubWluKGFscGhhLCBNYXRoLlBJIC8gMikpO1xuICAgIGNvbnN0IGNsb3VkID0gaXNsLnN1cmZhY2UgPT09ICdjbG91ZCc7XG4gICAgcC5ncm91bmQgPSB0cnVlO1xuICAgIHAueSA9IGd5O1xuICAgIGNvbnN0IGFpclQgPSBwLmFpcjtcbiAgICBsZXQga2luZDtcbiAgICBpZiAoIXAuYW5ub3VuY2VkIHx8IChhaXJUIDwgMC4yOCAmJiBwLmZsaWdodE1heCA8IDcwKSkge1xuICAgICAga2luZCA9ICd0b3VjaCc7XG4gICAgICBwLnMgPSBNYXRoLm1heChhbG9uZywgUC5taW5TcGVlZCk7XG4gICAgfSBlbHNlIGlmIChhbHBoYSA8IFAucGVyZmVjdEFuZ2xlICogKGNsb3VkID8gMS40IDogMSkgJiYgZCA8IC1QLnBlcmZlY3RNaW5Eb3duU2xvcGUpIHtcbiAgICAgIGtpbmQgPSAncGVyZmVjdCc7XG4gICAgICBwLnMgPSBhbG9uZyAqIFAucGVyZmVjdEJvb3N0O1xuICAgICAgcC5jaGFpbisrO1xuICAgICAgdGhpcy5zdGF0cy5wZXJmZWN0Kys7XG4gICAgfSBlbHNlIGlmIChhbHBoYSA+IFAuYm9ua0FuZ2xlICYmICFjbG91ZCAmJiBwLmZldmVyIDw9IDApIHtcbiAgICAgIGtpbmQgPSAnYm9uayc7XG4gICAgICBwLnMgPSBhbG9uZyAqIFAuYm9ua0tlZXA7XG4gICAgICBwLnN0dW4gPSBQLmJvbmtTdHVuO1xuICAgICAgcC5jaGFpbiA9IDA7XG4gICAgICB0aGlzLnN0YXRzLmJvbmsrKztcbiAgICB9IGVsc2Uge1xuICAgICAga2luZCA9ICdnb29kJztcbiAgICAgIHAucyA9IGFsb25nICogUC5sYW5kS2VlcDtcbiAgICAgIGlmIChjbG91ZCkgcC5zICo9IDEuMDM7XG4gICAgICBwLmNoYWluID0gMDtcbiAgICAgIHRoaXMuc3RhdHMuZ29vZCsrO1xuICAgIH1cbiAgICBpZiAocC5zIDwgUC5taW5TcGVlZCkgcC5zID0gUC5taW5TcGVlZDtcbiAgICBjb25zdCBtcyA9IHRoaXMubWF4U3BlZWQoKTtcbiAgICBpZiAocC5zID4gbXMpIHAucyA9IG1zO1xuICAgIHAubGFzdExhbmQgPSBraW5kO1xuICAgIGlmIChraW5kICE9PSAndG91Y2gnKSB7XG4gICAgICB0aGlzLmVtaXQoJ2xhbmQnLCB7IGtpbmQsIGFscGhhLCBzcGVlZDogcC5zLCBhaXI6IGFpclQsIGhlaWdodDogcC5mbGlnaHRNYXgsIGNoYWluOiBwLmNoYWluIH0pO1xuICAgICAgaWYgKGtpbmQgPT09ICdwZXJmZWN0JyAmJiBwLmNoYWluID49IFAuZmV2ZXJDaGFpbiAmJiBwLmZldmVyIDw9IDApIHtcbiAgICAgICAgcC5mZXZlciA9IFAuZmV2ZXJUaW1lO1xuICAgICAgICB0aGlzLnN0YXRzLmZldmVycysrO1xuICAgICAgICB0aGlzLmJsaXp6YXJkWCA9IE1hdGgubWF4KHRoaXMuYmxpenphcmRYIC0gUC5mZXZlckJsaXp6YXJkUHVzaCwgcC54IC0gdGhpcy5iYWxhbmNlLmJsaXp6YXJkLm1heEdhcCk7XG4gICAgICAgIHRoaXMuZW1pdCgnZmV2ZXInKTtcbiAgICAgIH0gZWxzZSBpZiAoa2luZCA9PT0gJ3BlcmZlY3QnICYmIHAuZmV2ZXIgPiAwKSB7XG4gICAgICAgIHAuZmV2ZXIgPSBNYXRoLm1heChwLmZldmVyLCBQLmZldmVyVGltZSAqIDAuNik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX2NvbGxlY3QoKSB7XG4gICAgY29uc3QgcCA9IHRoaXMucCwgaXNsID0gdGhpcy5pc2xhbmQ7XG4gICAgY29uc3QgZmlzaCA9IGlzbC5maXNoO1xuICAgIGNvbnN0IHBpY2tSID0gdGhpcy5QLnJhZGl1cyArIDMwO1xuICAgIGNvbnN0IG1hZ1IgPSB0aGlzLnVwLm1hZ25ldDtcbiAgICBjb25zdCByZWFjaCA9IE1hdGgubWF4KHBpY2tSLCBtYWdSKSArIDQwO1xuICAgIHdoaWxlICh0aGlzLmZpc2hJbmRleCA8IGZpc2gubGVuZ3RoICYmIGZpc2hbdGhpcy5maXNoSW5kZXhdLnggPCBwLnggLSByZWFjaCAtIDIwMCkgdGhpcy5maXNoSW5kZXgrKztcbiAgICBmb3IgKGxldCBpID0gdGhpcy5maXNoSW5kZXg7IGkgPCBmaXNoLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBmID0gZmlzaFtpXTtcbiAgICAgIGlmIChmLnggPiBwLnggKyByZWFjaCkgYnJlYWs7XG4gICAgICBpZiAoZi50YWtlbikgY29udGludWU7XG4gICAgICBjb25zdCBkeCA9IGYueCAtIHAueCwgZHkgPSBmLnkgLSBwLnk7XG4gICAgICBjb25zdCBkMiA9IGR4ICogZHggKyBkeSAqIGR5O1xuICAgICAgaWYgKGQyIDwgcGlja1IgKiBwaWNrUikgdGhpcy5fdGFrZShmKTtcbiAgICAgIGVsc2UgaWYgKG1hZ1IgPiAwICYmIGQyIDwgbWFnUiAqIG1hZ1IgJiYgIWYucHVsbCkgeyBmLnB1bGwgPSAxOyB0aGlzLnB1bGxpbmcucHVzaChmKTsgfVxuICAgIH1cbiAgICAvLyBtYWduZXQgcHVsbGVkIGZpc2ggZmx5IHRvd2FyZCB0aGUgcGVuZ3VpblxuICAgIGlmICh0aGlzLnB1bGxpbmcubGVuZ3RoKSB7XG4gICAgICBmb3IgKGxldCBpID0gdGhpcy5wdWxsaW5nLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGNvbnN0IGYgPSB0aGlzLnB1bGxpbmdbaV07XG4gICAgICAgIGlmIChmLnRha2VuKSB7IHRoaXMucHVsbGluZy5zcGxpY2UoaSwgMSk7IGNvbnRpbnVlOyB9XG4gICAgICAgIGNvbnN0IGR4ID0gcC54IC0gZi54LCBkeSA9IHAueSAtIGYueTtcbiAgICAgICAgY29uc3QgZCA9IE1hdGguaHlwb3QoZHgsIGR5KSB8fCAxO1xuICAgICAgICBjb25zdCB2ID0gKDI0MDAgKyBNYXRoLmh5cG90KHAudngsIHAudnkpKSAqIFNURVA7XG4gICAgICAgIGlmIChkIDwgdiArIHBpY2tSKSB7IHRoaXMuX3Rha2UoZik7IHRoaXMucHVsbGluZy5zcGxpY2UoaSwgMSk7IH1cbiAgICAgICAgZWxzZSB7IGYueCArPSBkeCAvIGQgKiB2OyBmLnkgKz0gZHkgLyBkICogdjsgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF90YWtlKGYpIHtcbiAgICBmLnRha2VuID0gdHJ1ZTtcbiAgICBjb25zdCBFID0gdGhpcy5iYWxhbmNlLmVjb25vbXk7XG4gICAgY29uc3QgbXVsID0gdGhpcy5wLmZldmVyID4gMCA/IDIgOiAxO1xuICAgIGNvbnN0IHYgPSAoZi5nb2xkID8gRS5nb2xkRmlzaFZhbHVlIDogRS5maXNoVmFsdWUpICogbXVsO1xuICAgIHRoaXMuc3RhdHMuZmlzaFZhbHVlICs9IHY7XG4gICAgaWYgKGYuZ29sZCkgdGhpcy5zdGF0cy5nb2xkKys7IGVsc2UgdGhpcy5zdGF0cy5maXNoKys7XG4gICAgdGhpcy5lbWl0KCdmaXNoJywgeyBnb2xkOiBmLmdvbGQsIHZhbHVlOiB2LCB4OiBmLngsIHk6IGYueSB9KTtcbiAgfVxuXG4gIF9vYmplY3RzKGR0KSB7XG4gICAgY29uc3QgcCA9IHRoaXMucCwgaXNsID0gdGhpcy5pc2xhbmQsIFAgPSB0aGlzLlA7XG4gICAgaWYgKHAuZ3JvdW5kKSB7XG4gICAgICBmb3IgKGNvbnN0IGcgb2YgaXNsLmdleXNlcnMpIHtcbiAgICAgICAgaWYgKCFnLnVzZWQgJiYgTWF0aC5hYnMocC54IC0gZy54KSA8IDQ2KSB7XG4gICAgICAgICAgZy51c2VkID0gdHJ1ZTtcbiAgICAgICAgICBpc2wuc2FtcGxlKHAueCwgdG1wKTtcbiAgICAgICAgICBjb25zdCBjb3MgPSAxIC8gTWF0aC5zcXJ0KDEgKyB0bXBbMV0gKiB0bXBbMV0pO1xuICAgICAgICAgIHAuZ3JvdW5kID0gZmFsc2U7XG4gICAgICAgICAgcC52eCA9IE1hdGgubWF4KHAucyAqIGNvcywgNzAwKTtcbiAgICAgICAgICBwLnZ5ID0gUC5nZXlzZXJJbXB1bHNlICsgTWF0aC5tYXgoMCwgcC5zICogdG1wWzFdICogY29zKTtcbiAgICAgICAgICBwLmFpciA9IDA7IHAuZmxpZ2h0TWF4ID0gMDsgcC5taWxlc3RvbmUgPSAwO1xuICAgICAgICAgIHRoaXMuc3RhdHMuZ2V5c2VycysrO1xuICAgICAgICAgIHRoaXMuZW1pdCgnZ2V5c2VyJywgeyB4OiBnLnggfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfYmxpenphcmQoZHQpIHtcbiAgICBjb25zdCBCID0gdGhpcy5iYWxhbmNlLmJsaXp6YXJkO1xuICAgIGNvbnN0IGlzbCA9IHRoaXMuaXNsYW5kO1xuICAgIGNvbnN0IGdhcCA9IHRoaXMuZ2FwO1xuICAgIGxldCB2ID0gKGlzbC5ibGl6emFyZC5zcGVlZCArIGlzbC5ibGl6emFyZC5hY2NlbCAqIHRoaXMuaXNsYW5kVGltZSkgKiAoMSAtIHRoaXMuYXNzaXN0KTtcbiAgICBpZiAodGhpcy5tb2RpZmllcnMuYmxpenphcmRNdWwpIHYgKj0gdGhpcy5tb2RpZmllcnMuYmxpenphcmRNdWw7XG4gICAgaWYgKGdhcCA+IEIubWF4R2FwKSB2ICs9IChnYXAgLSBCLm1heEdhcCkgKiBCLnJ1YmJlckJhbmRNdWw7XG4gICAgaWYgKHRoaXMuYmxpenphcmRIb2xkID4gMCkge1xuICAgICAgdGhpcy5ibGl6emFyZEhvbGQgLT0gZHQ7XG4gICAgICBpZiAoZ2FwIDw9IEIubWF4R2FwKSB2ID0gMDtcbiAgICB9XG4gICAgdGhpcy5ibGl6emFyZFYgPSB2O1xuICAgIHRoaXMuYmxpenphcmRYICs9IHYgKiBkdDtcbiAgICBjb25zdCBnMiA9IHRoaXMuZ2FwO1xuICAgIGlmIChnMiA8IHRoaXMuc3RhdHMubWluR2FwKSB0aGlzLnN0YXRzLm1pbkdhcCA9IGcyO1xuICAgIGNvbnN0IGRhbmdlciA9IGcyIDwgQi5kYW5nZXJHYXA7XG4gICAgaWYgKGRhbmdlciAmJiAhdGhpcy5fd2FzRGFuZ2VyKSB0aGlzLmVtaXQoJ2RhbmdlcicpO1xuICAgIGlmICghZGFuZ2VyICYmIHRoaXMuX3dhc0RhbmdlciAmJiBnMiA+IEIuZGFuZ2VyR2FwICogMS40KSB7IHRoaXMuc3RhdHMuY2xvc2VDYWxscysrOyB0aGlzLmVtaXQoJ2VzY2FwZScpOyB0aGlzLl93YXNEYW5nZXIgPSBmYWxzZTsgfVxuICAgIGlmIChkYW5nZXIpIHRoaXMuX3dhc0RhbmdlciA9IHRydWU7XG4gICAgaWYgKGcyIDw9IDApIHtcbiAgICAgIGlmICh0aGlzLnNjYXJmQ2hhcmdlcyA+IDApIHtcbiAgICAgICAgdGhpcy5zY2FyZkNoYXJnZXMtLTtcbiAgICAgICAgdGhpcy5zdGF0cy5zZWNvbmRXaW5kcysrO1xuICAgICAgICB0aGlzLmJsaXp6YXJkWCA9IHRoaXMucC54IC0gdGhpcy5zY2FyZlB1c2g7XG4gICAgICAgIGNvbnN0IHAgPSB0aGlzLnA7XG4gICAgICAgIGlmIChwLmdyb3VuZCkgcC5zID0gTWF0aC5taW4odGhpcy5tYXhTcGVlZCgpLCBwLnMgKiAxLjI1ICsgMzAwKTtcbiAgICAgICAgZWxzZSBwLnZ4ICs9IDMwMDtcbiAgICAgICAgdGhpcy5lbWl0KCdzZWNvbmRXaW5kJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXRlID0gJ2NhdWdodCc7XG4gICAgICAgIHRoaXMuZW1pdCgnY2F1Z2h0JywgeyB4OiB0aGlzLnAueCB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfc3RhcnRDcm9zc2luZygpIHtcbiAgICBjb25zdCBwID0gdGhpcy5wLCBmcm9tID0gdGhpcy5pc2xhbmQ7XG4gICAgdGhpcy53b3JsZC5lbnN1cmVJc2xhbmRzKHRoaXMud29ybGQuaXNsYW5kcy5pbmRleE9mKGZyb20pICsgMik7XG4gICAgY29uc3QgbmV4dCA9IHRoaXMud29ybGQuaXNsYW5kc1t0aGlzLndvcmxkLmlzbGFuZHMuaW5kZXhPZihmcm9tKSArIDFdO1xuICAgIGlmICghbmV4dCkgeyB0aGlzLnN0YXRlID0gJ2NhdWdodCc7IHRoaXMuZW1pdCgnY2F1Z2h0JywgeyB4OiBwLngsIGVuZDogdHJ1ZSB9KTsgcmV0dXJuOyB9XG4gICAgY29uc3QgbHggPSBuZXh0LnhzWzBdICsgKG5leHQueHNbMV0gLSBuZXh0LnhzWzBdKSAqIDAuNDI7XG4gICAgY29uc3QgbHkgPSBuZXh0LmhlaWdodEF0KGx4KTtcbiAgICBjb25zdCBhcGV4ID0gTWF0aC5tYXgocC55LCBseSkgKyA5MDA7XG4gICAgdGhpcy5jcm9zc2luZyA9IHtcbiAgICAgIHQ6IDAsIFQ6IDIuNiwgeDA6IHAueCwgeTA6IHAueSwgeDE6IGx4LCB5MTogbHksIEg6IGFwZXggLSAocC55ICsgbHkpIC8gMiwgZnJvbSwgbmV4dCxcbiAgICAgIHNwZWVkOiBNYXRoLm1heChwLmdyb3VuZCA/IHAucyA6IE1hdGguaHlwb3QocC52eCwgcC52eSksIDkwMCksXG4gICAgfTtcbiAgICB0aGlzLnN0YXRlID0gJ2Nyb3NzaW5nJztcbiAgICBwLmdyb3VuZCA9IGZhbHNlO1xuICAgIHRoaXMuaXNsYW5kc0NsZWFyZWQrKztcbiAgICB0aGlzLmVtaXQoJ2lzbGFuZENsZWFyJywgeyBpbmRleDogZnJvbS5pbmRleCB9KTtcbiAgfVxuXG4gIF9zdGVwQ3Jvc3NpbmcoZHQpIHtcbiAgICBjb25zdCBjID0gdGhpcy5jcm9zc2luZywgcCA9IHRoaXMucDtcbiAgICBjLnQgKz0gZHQ7XG4gICAgY29uc3QgdSA9IE1hdGgubWluKDEsIGMudCAvIGMuVCk7XG4gICAgY29uc3QgZSA9IHU7IC8vIGxpbmVhciBpbiB4IGtlZXBzIGhvcml6b250YWwgbW90aW9uIHN0ZWFkeVxuICAgIGNvbnN0IG54ID0gYy54MCArIChjLngxIC0gYy54MCkgKiBlO1xuICAgIGNvbnN0IG55ID0gYy55MCArIChjLnkxIC0gYy55MCkgKiBlICsgNCAqIGMuSCAqIGUgKiAoMSAtIGUpO1xuICAgIHAudnggPSAobnggLSBwLngpIC8gZHQ7XG4gICAgcC52eSA9IChueSAtIHAueSkgLyBkdDtcbiAgICBwLnggPSBueDsgcC55ID0gbnk7XG4gICAgdGhpcy5ibGl6emFyZFggPSBwLnggLSA0MDAwO1xuICAgIGlmICh1ID49IDEpIHtcbiAgICAgIGNvbnN0IG5leHQgPSBjLm5leHQ7XG4gICAgICB0aGlzLmlzbGFuZCA9IG5leHQ7XG4gICAgICB0aGlzLmlzbGFuZFRpbWUgPSAwO1xuICAgICAgdGhpcy5maXNoSW5kZXggPSAwO1xuICAgICAgbmV4dC5zYW1wbGUocC54LCB0bXApO1xuICAgICAgY29uc3QgY29zID0gMSAvIE1hdGguc3FydCgxICsgdG1wWzFdICogdG1wWzFdKTtcbiAgICAgIHAuZ3JvdW5kID0gdHJ1ZTtcbiAgICAgIHAueSA9IHRtcFswXTtcbiAgICAgIHAucyA9IE1hdGgubWluKHRoaXMubWF4U3BlZWQoKSwgTWF0aC5tYXgoYy5zcGVlZCAqIDAuOSwgMTEwMCkpO1xuICAgICAgcC52eCA9IHAucyAqIGNvczsgcC52eSA9IHAucyAqIHRtcFsxXSAqIGNvcztcbiAgICAgIHAuY2hhaW4gPSAwO1xuICAgICAgdGhpcy5ibGl6emFyZFggPSBwLnggLSBuZXh0LmJsaXp6YXJkLnN0YXJ0R2FwO1xuICAgICAgdGhpcy5ibGl6emFyZEhvbGQgPSAxLjI7XG4gICAgICB0aGlzLnN0YXRlID0gJ3J1bic7XG4gICAgICB0aGlzLmNyb3NzaW5nID0gbnVsbDtcbiAgICAgIC8vIGRyb3AgaXNsYW5kcyBmYXIgYmVoaW5kIHRvIGtlZXAgbWVtb3J5IGZsYXQgaW4gZW5kbGVzcyBtb2RlXG4gICAgICB3aGlsZSAodGhpcy53b3JsZC5pc2xhbmRzLmxlbmd0aCA+IDMgJiYgdGhpcy53b3JsZC5pc2xhbmRzWzBdICE9PSBuZXh0ICYmIHRoaXMud29ybGQuaXNsYW5kc1sxXSAhPT0gbmV4dCkgdGhpcy53b3JsZC5pc2xhbmRzLnNoaWZ0KCk7XG4gICAgICB0aGlzLndvcmxkLmVuc3VyZUlzbGFuZHModGhpcy53b3JsZC5pc2xhbmRzLmluZGV4T2YobmV4dCkgKyAyKTtcbiAgICAgIHRoaXMuZW1pdCgnaXNsYW5kUmVhY2gnLCB7IGluZGV4OiBuZXh0LmluZGV4IH0pO1xuICAgIH1cbiAgfVxufVxuXG4vLyBCYWxsaXN0aWMgZm9yZWNhc3QgdXNlZCBieSB0aGUgYm90cyBhbmQgdGhlIFwid2hlcmUgd2lsbCBJIGxhbmRcIiBhc3Npc3QuXG5leHBvcnQgZnVuY3Rpb24gZm9yZWNhc3RMYW5kaW5nKHNpbSwgcHJlc3MsIG1heFQgPSAzKSB7XG4gIGNvbnN0IFAgPSBzaW0uUCwgaXNsID0gc2ltLmlzbGFuZCwgdXAgPSBzaW0udXA7XG4gIGxldCB4ID0gc2ltLnAueCwgeSA9IHNpbS5wLnksIHZ4ID0gc2ltLnAudngsIHZ5ID0gc2ltLnAudnk7XG4gIGNvbnN0IGR0ID0gMSAvIDYwO1xuICBmb3IgKGxldCB0ID0gMDsgdCA8IG1heFQ7IHQgKz0gZHQpIHtcbiAgICBsZXQgZyA9IFAuZ3Jhdml0eTtcbiAgICBpZiAocHJlc3MpIGcgKj0gUC5haXJQcmVzc0dyYXZpdHlNdWw7XG4gICAgZWxzZSBpZiAodnkgPCAwICYmIHVwLmdsaWRlID4gMCkgZyAqPSAxIC0gdXAuZ2xpZGU7XG4gICAgdnkgLT0gZyAqIGR0O1xuICAgIHggKz0gdnggKiBkdDsgeSArPSB2eSAqIGR0O1xuICAgIGlmICh4ID4gaXNsLmVuZFgpIHJldHVybiB7IHgsIHksIHQsIHBhc3Q6IHRydWUgfTtcbiAgICBpc2wuc2FtcGxlKHgsIHRtcCk7XG4gICAgaWYgKHkgPD0gdG1wWzBdKSB7XG4gICAgICBjb25zdCBkID0gdG1wWzFdO1xuICAgICAgY29uc3QgYWxwaGEgPSBNYXRoLmFicyhNYXRoLmF0YW4yKHZ5LCB2eCkgLSBNYXRoLmF0YW4oZCkpO1xuICAgICAgcmV0dXJuIHsgeCwgeTogdG1wWzBdLCB0LCBzbG9wZTogZCwgYWxwaGEsIHBlcmZlY3Q6IGFscGhhIDwgUC5wZXJmZWN0QW5nbGUgJiYgZCA8IC1QLnBlcmZlY3RNaW5Eb3duU2xvcGUsIGJvbms6IGFscGhhID4gUC5ib25rQW5nbGUgfTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHsgeCwgeSwgdDogbWF4VCwgbm9uZTogdHJ1ZSB9O1xufVxuIiwgIi8vIEF1dG8gcGxheWVycy4gVXNlZCBmb3IgbGV2ZWwgdmVyaWZpY2F0aW9uLCBiYWxhbmNlIHNpbXVsYXRpb24sIHRoZSB0aXRsZS1zY3JlZW4gZGVtbyBhbmRcbi8vIHRyYWlsZXIgY2FwdHVyZS4gUHJvZmlsZXMgbW9kZWwgcGxheWVycyBvZiBkaWZmZXJlbnQgc2tpbGw6IHJlYWN0aW9uIGRlbGF5IGFuZCB0aW1pbmcgbm9pc2UuXG5pbXBvcnQgeyBmb3JlY2FzdExhbmRpbmcgfSBmcm9tICcuL3J1bi5qcyc7XG5pbXBvcnQgeyBtYWtlUm5nIH0gZnJvbSAnLi9ybmcuanMnO1xuXG5leHBvcnQgY29uc3QgQk9UX1BST0ZJTEVTID0ge1xuICBleHBlcnQ6IHsgZGVsYXk6IDAuMDMsIGxlYWQ6IDAuMDUsIG5vaXNlOiAwLjAsIGhvbGRVcENoYW5jZTogMC4wLCBlYXJseVJlbGVhc2U6IDAuMCwgYWlyU21hcnQ6IDEuMCB9LFxuICBnb29kOiB7IGRlbGF5OiAwLjA4LCBsZWFkOiAwLjA1LCBub2lzZTogMC4wNCwgaG9sZFVwQ2hhbmNlOiAwLjA1LCBlYXJseVJlbGVhc2U6IDAuMDUsIGFpclNtYXJ0OiAwLjg1IH0sXG4gIGF2ZXJhZ2U6IHsgZGVsYXk6IDAuMTQsIGxlYWQ6IDAuMDQsIG5vaXNlOiAwLjA4LCBob2xkVXBDaGFuY2U6IDAuMTUsIGVhcmx5UmVsZWFzZTogMC4xMiwgYWlyU21hcnQ6IDAuNiB9LFxuICBub3ZpY2U6IHsgZGVsYXk6IDAuMjIsIGxlYWQ6IDAuMDIsIG5vaXNlOiAwLjE0LCBob2xkVXBDaGFuY2U6IDAuMzUsIGVhcmx5UmVsZWFzZTogMC4yNSwgYWlyU21hcnQ6IDAuMjUgfSxcbn07XG5cbmNvbnN0IHRtcCA9IFswLCAwLCAwXTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VCb3QocHJvZmlsZU5hbWUgPSAnZ29vZCcsIHNlZWQgPSAxKSB7XG4gIGNvbnN0IHByb2YgPSB0eXBlb2YgcHJvZmlsZU5hbWUgPT09ICdzdHJpbmcnID8gQk9UX1BST0ZJTEVTW3Byb2ZpbGVOYW1lXSA6IHByb2ZpbGVOYW1lO1xuICBjb25zdCBybmcgPSBtYWtlUm5nKHNlZWQpO1xuICBjb25zdCBxdWV1ZSA9IFtdOyAvLyBbdGltZSwgcHJlc3NdIGRlY2lzaW9ucyB3YWl0aW5nIGZvciB0aGUgcmVhY3Rpb24gZGVsYXlcbiAgbGV0IGN1cnJlbnQgPSBmYWxzZTtcbiAgbGV0IGhpbGxNaXN0YWtlID0gMDsgLy8gPjA6IGhvbGQgdG9vIGxvbmcgb24gdGhpcyB1cHNsb3BlOyA8MDogcmVsZWFzZSBlYXJseSBvbiB0aGlzIGRvd25zbG9wZVxuICBsZXQgbGFzdEdyb3VuZFNpZ24gPSAwO1xuICBsZXQgYWlyRGVjaXNpb24gPSBudWxsO1xuICBsZXQgYWlyVGltZXIgPSAwO1xuXG4gIGZ1bmN0aW9uIGRlc2lyZWQoc2ltKSB7XG4gICAgY29uc3QgcCA9IHNpbS5wO1xuICAgIGlmIChzaW0uc3RhdGUgIT09ICdydW4nKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKHAuZ3JvdW5kKSB7XG4gICAgICBhaXJEZWNpc2lvbiA9IG51bGw7XG4gICAgICBjb25zdCBsZWFkID0gTWF0aC5tYXgoMCwgcHJvZi5sZWFkICsgKHJuZy5uZXh0KCkgLSAwLjUpICogcHJvZi5ub2lzZSk7XG4gICAgICBzaW0uaXNsYW5kLnNhbXBsZShwLnggKyBwLnMgKiBsZWFkLCB0bXApO1xuICAgICAgY29uc3Qgc2xvcGVBaGVhZCA9IHRtcFsxXTtcbiAgICAgIGNvbnN0IHNpZ24gPSBzbG9wZUFoZWFkIDwgLTAuMDE1ID8gLTEgOiAxO1xuICAgICAgaWYgKHNpZ24gIT09IGxhc3RHcm91bmRTaWduKSB7XG4gICAgICAgIGxhc3RHcm91bmRTaWduID0gc2lnbjtcbiAgICAgICAgaGlsbE1pc3Rha2UgPSAwO1xuICAgICAgICBpZiAoc2lnbiA+IDAgJiYgcm5nLmNoYW5jZShwcm9mLmhvbGRVcENoYW5jZSkpIGhpbGxNaXN0YWtlID0gcm5nLnJhbmdlKDAuMSwgMC40NSk7XG4gICAgICAgIGlmIChzaWduIDwgMCAmJiBybmcuY2hhbmNlKHByb2YuZWFybHlSZWxlYXNlKSkgaGlsbE1pc3Rha2UgPSAtcm5nLnJhbmdlKDAuMSwgMC4zNSk7XG4gICAgICB9XG4gICAgICBpZiAoc2lnbiA8IDApIHtcbiAgICAgICAgaWYgKGhpbGxNaXN0YWtlIDwgMCkge1xuICAgICAgICAgIHNpbS5pc2xhbmQuc2FtcGxlKHAueCwgdG1wKTtcbiAgICAgICAgICAvLyByZWxlYXNlIGVhcmx5OiBsZXQgZ28gd2hpbGUgc3RpbGwgb24gdGhlIGRvd25zbG9wZVxuICAgICAgICAgIGlmICh0bXBbMV0gPiAtMC4zNSArIGhpbGxNaXN0YWtlKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoaGlsbE1pc3Rha2UgPiAwKSB7IGhpbGxNaXN0YWtlIC09IDEgLyAxMjA7IHJldHVybiB0cnVlOyB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIGFpcmJvcm5lOiBkZWNpZGUgd2hldGhlciBkaXZpbmcgZ2l2ZXMgYSBiZXR0ZXIgbGFuZGluZ1xuICAgIGFpclRpbWVyIC09IDEgLyAxMjA7XG4gICAgaWYgKGFpckRlY2lzaW9uID09PSBudWxsIHx8IGFpclRpbWVyIDw9IDApIHtcbiAgICAgIGFpclRpbWVyID0gMC4xO1xuICAgICAgaWYgKHJuZy5uZXh0KCkgPiBwcm9mLmFpclNtYXJ0KSB7XG4gICAgICAgIGFpckRlY2lzaW9uID0gcC52eSA8IC0yMDAgJiYgcm5nLmNoYW5jZSgwLjUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZnJlZSA9IGZvcmVjYXN0TGFuZGluZyhzaW0sIGZhbHNlKTtcbiAgICAgICAgY29uc3QgZGl2ZSA9IGZvcmVjYXN0TGFuZGluZyhzaW0sIHRydWUpO1xuICAgICAgICBjb25zdCBzY29yZSA9IChmKSA9PiAoZi5wYXN0ID8gMyA6IGYubm9uZSA/IDAuNSA6IGYucGVyZmVjdCA/IDIuNSA6IGYuYm9uayA/IC0yIDogKGYuc2xvcGUgPCAwID8gMSA6IDApKTtcbiAgICAgICAgY29uc3Qgc2YgPSBzY29yZShmcmVlKSwgc2QgPSBzY29yZShkaXZlKTtcbiAgICAgICAgYWlyRGVjaXNpb24gPSBzZCA+IHNmICsgMC4wMTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFpckRlY2lzaW9uO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGNvbnRyb2woc2ltKSB7XG4gICAgY29uc3Qgd2FudCA9IGRlc2lyZWQoc2ltKTtcbiAgICBxdWV1ZS5wdXNoKFtzaW0udGltZSArIHByb2YuZGVsYXksIHdhbnRdKTtcbiAgICB3aGlsZSAocXVldWUubGVuZ3RoICYmIHF1ZXVlWzBdWzBdIDw9IHNpbS50aW1lKSBjdXJyZW50ID0gcXVldWUuc2hpZnQoKVsxXTtcbiAgICByZXR1cm4gY3VycmVudDtcbiAgfTtcbn1cblxuLy8gRHJpdmUgYSBzaW0gdW50aWwgaXQgZW5kcy4gUmV0dXJucyBhIHN1bW1hcnkuXG5leHBvcnQgZnVuY3Rpb24gcGxheVJ1bihzaW0sIGNvbnRyb2wsIG1heFRpbWUgPSA2MDAsIG9uU3RlcCA9IG51bGwpIHtcbiAgY29uc3QgZHQgPSAxIC8gMTIwO1xuICBsZXQgcHJlc3NlcyA9IDAsIGxhc3QgPSBmYWxzZTtcbiAgd2hpbGUgKHNpbS5zdGF0ZSAhPT0gJ2NhdWdodCcgJiYgc2ltLnRpbWUgPCBtYXhUaW1lKSB7XG4gICAgY29uc3QgcHJlc3MgPSBjb250cm9sKHNpbSk7XG4gICAgaWYgKHByZXNzICYmICFsYXN0KSBwcmVzc2VzKys7XG4gICAgbGFzdCA9IHByZXNzO1xuICAgIHNpbS5zdGVwKGR0LCBwcmVzcyk7XG4gICAgaWYgKG9uU3RlcCkgb25TdGVwKHNpbSwgcHJlc3MpO1xuICB9XG4gIHJldHVybiB7XG4gICAgdGltZTogc2ltLnRpbWUsXG4gICAgZGlzdGFuY2U6IHNpbS5kaXN0YW5jZU1ldGVycyxcbiAgICBpc2xhbmRzQ2xlYXJlZDogc2ltLmlzbGFuZHNDbGVhcmVkLFxuICAgIGlzbGFuZDogc2ltLmlzbGFuZC5pbmRleCxcbiAgICBwcmVzc2VzLFxuICAgIC4uLnNpbS5zdGF0cyxcbiAgfTtcbn1cbiIsICIvLyBTaWRlLXZpZXcgY2FtZXJhIGZvciBhIHBvcnRyYWl0IHNjcmVlbi4gWm9vbXMgb3V0IHdpdGggc3BlZWQgYW5kIGFsdGl0dWRlIHNvIGEgYmlnIGxhdW5jaCBzaG93c1xuLy8gdGhlIGhpbGxzIGJlaGluZCBhbmQgdGhlIG5leHQgaXNsYW5kIGFoZWFkOyB6b29tcyBiYWNrIGluIG9uIHRoZSBncm91bmQgZm9yIHRpbWluZyBwcmVjaXNpb24uXG5leHBvcnQgY2xhc3MgQ2FtZXJhIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy54ID0gMDsgdGhpcy55ID0gMDsgdGhpcy56ID0gMC4zNTtcbiAgICB0aGlzLlcgPSAzOTA7IHRoaXMuSCA9IDg0NDtcbiAgICB0aGlzLmFuY2hvciA9IDAuMztcbiAgICB0aGlzLnNoYWtlVCA9IDA7IHRoaXMuc2hha2VBID0gMDtcbiAgICB0aGlzLnN4ID0gMDsgdGhpcy5zeSA9IDA7XG4gICAgdGhpcy5wdW5jaCA9IDA7XG4gICAgdGhpcy5sb3dZID0gMDtcbiAgICB0aGlzLm92ZXJyaWRlID0gbnVsbDsgLy8gY2luZW1hdGljIGNvbnRyb2wge3gseSx6fVxuICB9XG5cbiAgcmVzaXplKFcsIEgpIHsgdGhpcy5XID0gVzsgdGhpcy5IID0gSDsgfVxuXG4gIGJhc2Vab29tKHZpZXdXaWR0aCkge1xuICAgIC8vIGtlZXAgdGhlIHNhbWUgd29ybGQgd2lkdGggdmlzaWJsZSBvbiBldmVyeSBwaG9uZTsgY2FwIGZvciB2ZXJ5IHRhbGwvdGhpbiBvciB3aWRlIHNjcmVlbnNcbiAgICBjb25zdCB6ID0gdGhpcy5XIC8gdmlld1dpZHRoO1xuICAgIHJldHVybiBNYXRoLm1pbih6LCB0aGlzLkggLyAodmlld1dpZHRoICogMS40NSkpO1xuICB9XG5cbiAgc25hcChzaW0pIHsgdGhpcy51cGRhdGUoc2ltLCAxLCB0cnVlKTsgfVxuXG4gIHVwZGF0ZShzaW0sIGR0LCBzbmFwID0gZmFsc2UpIHtcbiAgICBjb25zdCBwID0gc2ltLnA7XG4gICAgY29uc3Qgd29ybGQgPSBzaW0ud29ybGQ7XG4gICAgY29uc3Qgc3BlZWQgPSBwLmdyb3VuZCA/IHAucyA6IE1hdGguaHlwb3QocC52eCwgcC52eSk7XG4gICAgY29uc3Qgc24gPSBNYXRoLm1pbigxLCBNYXRoLm1heCgwLCAoc3BlZWQgLSA1MDApIC8gMTcwMCkpO1xuICAgIGNvbnN0IHZpZXdXID0gMTE4MCArIDUyMCAqIHNuO1xuICAgIGxldCB6dCA9IHRoaXMuYmFzZVpvb20odmlld1cpO1xuICAgIC8vIGxvb2stYWhlYWQvYmVoaW5kOiBhdCBoZWlnaHQgc2hpZnQgdGhlIHBlbmd1aW4gdG93YXJkIGNlbnRlciB0byByZXZlYWwgdGhlIHRyYWlsIGJlaGluZFxuICAgIGNvbnN0IGdyb3VuZCA9IHdvcmxkLmhlaWdodEF0KHAueCk7XG4gICAgY29uc3QgYWx0ID0gTWF0aC5tYXgoMCwgcC55IC0gZ3JvdW5kKTtcbiAgICBjb25zdCBhbHROID0gTWF0aC5taW4oMSwgYWx0IC8gMTQwMCk7XG4gICAgY29uc3QgY3Jvc3NpbmcgPSBzaW0uc3RhdGUgPT09ICdjcm9zc2luZyc7XG4gICAgY29uc3QgYW5jaG9yVCA9IDAuMyArIDAuMSAqIGFsdE4gKyAoY3Jvc3NpbmcgPyAwLjA4IDogMCk7XG4gICAgLy8gbG93ZXN0IHRlcnJhaW4gaW4gdmlldyAoc2FtcGxlZCkgc28gdmFsbGV5cyBzdGF5IG9uIHNjcmVlblxuICAgIGNvbnN0IHNwYW4gPSB0aGlzLlcgLyB6dDtcbiAgICBsZXQgbG93ID0gSW5maW5pdHk7XG4gICAgY29uc3QgeDAgPSBwLnggLSBzcGFuICogYW5jaG9yVCwgeDEgPSBwLnggKyBzcGFuICogKDEgLSBhbmNob3JUKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8PSAxMjsgaSsrKSB7XG4gICAgICBjb25zdCB5ID0gd29ybGQuaGVpZ2h0QXQoeDAgKyAoeDEgLSB4MCkgKiBpIC8gMTIpO1xuICAgICAgaWYgKHkgPCBsb3cpIGxvdyA9IHk7XG4gICAgfVxuICAgIGlmIChjcm9zc2luZykgbG93ID0gTWF0aC5taW4obG93LCBzaW0uY3Jvc3NpbmcueTEgLSAyMDApO1xuICAgIGxvdyA9IE1hdGgubWF4KGxvdywgLTcwMCk7XG4gICAgY29uc3QgdG9wTWFyZ2luID0gdGhpcy5IICogMC4yLCBib3R0b20gPSB0aGlzLkggKiAwLjg7XG4gICAgY29uc3QgbmVlZCA9IChwLnkgLSBsb3cpICsgNjA7XG4gICAgY29uc3QgekZpdCA9IChib3R0b20gLSB0b3BNYXJnaW4pIC8gTWF0aC5tYXgobmVlZCwgMSk7XG4gICAgaWYgKHpGaXQgPCB6dCkgenQgPSB6Rml0O1xuICAgIGlmIChjcm9zc2luZykgenQgPSBNYXRoLm1pbih6dCwgdGhpcy5iYXNlWm9vbSgyNjAwKSk7XG4gICAgenQgPSBNYXRoLm1heCh6dCwgdGhpcy5iYXNlWm9vbSg1MjAwKSk7XG4gICAgaWYgKHNuYXApIHtcbiAgICAgIHRoaXMueiA9IHp0OyB0aGlzLmFuY2hvciA9IGFuY2hvclQ7IHRoaXMubG93WSA9IGxvdztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gem9vbSBvdXQgcXVpY2tseSAoa2VlcCB0aGUgcGVuZ3VpbiB2aXNpYmxlKSwgem9vbSBpbiBnZW50bHlcbiAgICAgIGNvbnN0IGt6ID0genQgPCB0aGlzLnogPyA0LjUgOiAxLjY7XG4gICAgICB0aGlzLnogKz0gKHp0IC0gdGhpcy56KSAqIE1hdGgubWluKDEsIGt6ICogZHQpO1xuICAgICAgdGhpcy5hbmNob3IgKz0gKGFuY2hvclQgLSB0aGlzLmFuY2hvcikgKiBNYXRoLm1pbigxLCAyICogZHQpO1xuICAgICAgY29uc3Qga2wgPSBsb3cgPCB0aGlzLmxvd1kgPyA1IDogMi4yO1xuICAgICAgdGhpcy5sb3dZICs9IChsb3cgLSB0aGlzLmxvd1kpICogTWF0aC5taW4oMSwga2wgKiBkdCk7XG4gICAgfVxuICAgIHRoaXMueCA9IHAueDtcbiAgICAvLyBjYW1lcmEgeTogd29ybGQgeSBzaG93biBhdCBzY3JlZW4geSA9IEgqMC44IGlzIGxvd1lcbiAgICB0aGlzLnkgPSB0aGlzLmxvd1k7XG4gICAgLy8ga2VlcCB0aGUgcGVuZ3VpbiB1bmRlciB0aGUgdG9wIG1hcmdpbiBldmVuIG1pZC16b29tXG4gICAgY29uc3QgcHkgPSB0aGlzLnRvU2NyZWVuWShwLnkpO1xuICAgIGlmIChweSA8IHRvcE1hcmdpbikgdGhpcy55IC09ICh0b3BNYXJnaW4gLSBweSkgLyB0aGlzLno7XG4gICAgaWYgKHRoaXMub3ZlcnJpZGUpIHtcbiAgICAgIGNvbnN0IG8gPSB0aGlzLm92ZXJyaWRlO1xuICAgICAgdGhpcy54ID0gby54OyB0aGlzLnkgPSBvLnk7IHRoaXMueiA9IG8uejsgdGhpcy5hbmNob3IgPSBvLmFuY2hvciA/PyB0aGlzLmFuY2hvcjtcbiAgICB9XG4gICAgLy8gc2hha2VcbiAgICBpZiAodGhpcy5zaGFrZVQgPiAwKSB7XG4gICAgICB0aGlzLnNoYWtlVCAtPSBkdDtcbiAgICAgIGNvbnN0IGEgPSB0aGlzLnNoYWtlQSAqIE1hdGgubWF4KDAsIHRoaXMuc2hha2VUKSAqIDQ7XG4gICAgICB0aGlzLnN4ID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogYTsgdGhpcy5zeSA9IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIGE7XG4gICAgfSBlbHNlIHsgdGhpcy5zeCA9IHRoaXMuc3kgPSAwOyB9XG4gIH1cblxuICBzaGFrZShhbW91bnQsIHRpbWUgPSAwLjI1KSB7XG4gICAgdGhpcy5zaGFrZUEgPSBNYXRoLm1heCh0aGlzLnNoYWtlQSAqICh0aGlzLnNoYWtlVCA+IDAgPyAxIDogMCksIGFtb3VudCk7XG4gICAgdGhpcy5zaGFrZVQgPSBNYXRoLm1heCh0aGlzLnNoYWtlVCwgdGltZSk7XG4gIH1cblxuICB0b1NjcmVlblgod3gpIHsgcmV0dXJuICh3eCAtIHRoaXMueCkgKiB0aGlzLnogKyB0aGlzLlcgKiB0aGlzLmFuY2hvciArIHRoaXMuc3g7IH1cbiAgdG9TY3JlZW5ZKHd5KSB7IHJldHVybiB0aGlzLkggKiAwLjggLSAod3kgLSB0aGlzLnkpICogdGhpcy56ICsgdGhpcy5zeTsgfVxuICB0b1dvcmxkWChzeCkgeyByZXR1cm4gKHN4IC0gdGhpcy5XICogdGhpcy5hbmNob3IgLSB0aGlzLnN4KSAvIHRoaXMueiArIHRoaXMueDsgfVxuICB0b1dvcmxkWShzeSkgeyByZXR1cm4gKHRoaXMuSCAqIDAuOCAtIHN5ICsgdGhpcy5zeSkgLyB0aGlzLnogKyB0aGlzLnk7IH1cbiAgZ2V0IGxlZnQoKSB7IHJldHVybiB0aGlzLnRvV29ybGRYKDApOyB9XG4gIGdldCByaWdodCgpIHsgcmV0dXJuIHRoaXMudG9Xb3JsZFgodGhpcy5XKTsgfVxufVxuIiwgIi8vIFByb3RvdHlwZSBlbnRyeSAocmVwbGFjZWQgYnkgdGhlIGZ1bGwgYXBwIGFzIHN5c3RlbXMgY29tZSBvbmxpbmUpLlxuaW1wb3J0IGJhbGFuY2UgZnJvbSAnLi9kYXRhL2JhbGFuY2UuanNvbic7XG5pbXBvcnQgeyBMRVZFTFMgfSBmcm9tICcuL2RhdGEvbGV2ZWxzLmpzJztcbmltcG9ydCB7IFJ1blNpbSwgU1RFUCB9IGZyb20gJy4vY29yZS9ydW4uanMnO1xuaW1wb3J0IHsgbWFrZUJvdCB9IGZyb20gJy4vY29yZS9ib3QuanMnO1xuaW1wb3J0IHsgQ2FtZXJhIH0gZnJvbSAnLi9nYW1lL2NhbWVyYS5qcyc7XG5cbmNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lJyk7XG5jb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbmxldCBXID0gMCwgSCA9IDAsIGRwciA9IDE7XG5jb25zdCBjYW0gPSBuZXcgQ2FtZXJhKCk7XG5mdW5jdGlvbiByZXNpemUoKSB7XG4gIGRwciA9IE1hdGgubWluKDIsIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEpO1xuICBXID0gd2luZG93LmlubmVyV2lkdGg7IEggPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNhbnZhcy53aWR0aCA9IE1hdGgucm91bmQoVyAqIGRwcik7IGNhbnZhcy5oZWlnaHQgPSBNYXRoLnJvdW5kKEggKiBkcHIpO1xuICBjYW0ucmVzaXplKFcsIEgpO1xufVxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZSk7XG5yZXNpemUoKTtcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib290JykuY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuXG5jb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGxvY2F0aW9uLnNlYXJjaCk7XG5jb25zdCB1cHMgPSBwYXJhbXMuZ2V0KCd1cHMnKSA/IEpTT04ucGFyc2UocGFyYW1zLmdldCgndXBzJykpIDoge307XG5sZXQgc2ltID0gbmV3IFJ1blNpbSh7IGxldmVsczogTEVWRUxTLCBiYWxhbmNlLCB1cGdyYWRlczogdXBzLCB0dXRvcmlhbDogZmFsc2UgfSk7XG5jb25zdCBib3QgPSBwYXJhbXMuZ2V0KCdib3QnKSA/IG1ha2VCb3QocGFyYW1zLmdldCgnYm90JyksIDEpIDogbnVsbDtcbmxldCBwcmVzc2luZyA9IGZhbHNlO1xuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgKCkgPT4geyBwcmVzc2luZyA9IHRydWU7IH0pO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsICgpID0+IHsgcHJlc3NpbmcgPSBmYWxzZTsgfSk7XG5jYW0uc25hcChzaW0pO1xuXG5mdW5jdGlvbiBkcmF3KCkge1xuICBjdHguc2V0VHJhbnNmb3JtKGRwciwgMCwgMCwgZHByLCAwLCAwKTtcbiAgY29uc3QgZyA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAwLCBIKTtcbiAgZy5hZGRDb2xvclN0b3AoMCwgJyM1ZmI2ZWUnKTsgZy5hZGRDb2xvclN0b3AoMC43LCAnI2NkZWVmZScpOyBnLmFkZENvbG9yU3RvcCgxLCAnI2ZmZTlkNicpO1xuICBjdHguZmlsbFN0eWxlID0gZzsgY3R4LmZpbGxSZWN0KDAsIDAsIFcsIEgpO1xuICBjb25zdCB3ID0gc2ltLndvcmxkO1xuICBjdHguYmVnaW5QYXRoKCk7XG4gIGNvbnN0IHgwID0gY2FtLmxlZnQgLSAyMCwgeDEgPSBjYW0ucmlnaHQgKyAyMDtcbiAgY29uc3Qgc3RlcCA9IDYgLyBjYW0uejtcbiAgY3R4Lm1vdmVUbyhjYW0udG9TY3JlZW5YKHgwKSwgSCArIDEwKTtcbiAgZm9yIChsZXQgeCA9IHgwOyB4IDw9IHgxOyB4ICs9IHN0ZXApIGN0eC5saW5lVG8oY2FtLnRvU2NyZWVuWCh4KSwgY2FtLnRvU2NyZWVuWSh3LmRyYXdIZWlnaHRBdCh4KSkpO1xuICBjdHgubGluZVRvKGNhbS50b1NjcmVlblgoeDEpLCBIICsgMTApO1xuICBjdHguY2xvc2VQYXRoKCk7XG4gIGN0eC5maWxsU3R5bGUgPSAnI2VhZjRmZic7IGN0eC5maWxsKCk7XG4gIGN0eC5saW5lV2lkdGggPSAzOyBjdHguc3Ryb2tlU3R5bGUgPSAnIzJhMzU3MCc7IGN0eC5zdHJva2UoKTtcbiAgLy8gZmlzaFxuICBmb3IgKGNvbnN0IGlzbCBvZiB3LmlzbGFuZHMpIGZvciAoY29uc3QgZiBvZiBpc2wuZmlzaCkge1xuICAgIGlmIChmLnRha2VuKSBjb250aW51ZTtcbiAgICBjb25zdCBzeCA9IGNhbS50b1NjcmVlblgoZi54KSwgc3kgPSBjYW0udG9TY3JlZW5ZKGYueSk7XG4gICAgaWYgKHN4IDwgLTIwIHx8IHN4ID4gVyArIDIwKSBjb250aW51ZTtcbiAgICBjdHguZmlsbFN0eWxlID0gZi5nb2xkID8gJyNmZmM4MzMnIDogJyM1YWEwZTgnO1xuICAgIGN0eC5iZWdpblBhdGgoKTsgY3R4LmVsbGlwc2Uoc3gsIHN5LCAxNiAqIGNhbS56IC8gMC4zMywgOSAqIGNhbS56IC8gMC4zMywgMCwgMCwgNyk7IGN0eC5maWxsKCk7XG4gIH1cbiAgLy8gcGVuZ3VpblxuICBjb25zdCBwID0gc2ltLnA7XG4gIGNvbnN0IGFuZyA9IHAuZ3JvdW5kID8gTWF0aC5hdGFuKHAuc2xvcGUgfHwgMCkgOiBNYXRoLmF0YW4yKHAudnksIHAudngpO1xuICBjdHguc2F2ZSgpO1xuICBjdHgudHJhbnNsYXRlKGNhbS50b1NjcmVlblgocC54KSwgY2FtLnRvU2NyZWVuWShwLnkpKTtcbiAgY3R4LnJvdGF0ZSgtYW5nKTtcbiAgY29uc3QgcyA9IGNhbS56O1xuICBjdHguZmlsbFN0eWxlID0gcHJlc3NpbmcgPyAnIzFiMjM0MCcgOiAnIzJiM2E3OCc7XG4gIGN0eC5iZWdpblBhdGgoKTsgY3R4LmVsbGlwc2UoMCwgLTQwICogcywgNzAgKiBzLCA0MCAqIHMsIDAsIDAsIDcpOyBjdHguZmlsbCgpO1xuICBjdHguZmlsbFN0eWxlID0gJyNlODQyM2YnOyBjdHguZmlsbFJlY3QoMjAgKiBzLCAtNzAgKiBzLCAyMCAqIHMsIDQwICogcyk7XG4gIGN0eC5yZXN0b3JlKCk7XG4gIC8vIGJsaXp6YXJkXG4gIGNvbnN0IGJ4ID0gY2FtLnRvU2NyZWVuWChzaW0uYmxpenphcmRYKTtcbiAgY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDIzMCwyNDAsMjU1LDAuOSknO1xuICBjdHguZmlsbFJlY3QoMCwgMCwgTWF0aC5tYXgoMCwgYngpLCBIKTtcbiAgY3R4LmZpbGxTdHlsZSA9ICcjMjMzMDZiJzsgY3R4LmZvbnQgPSAnMTZweCBzYW5zLXNlcmlmJztcbiAgY3R4LmZpbGxUZXh0KGAke3NpbS5kaXN0YW5jZU1ldGVyc31tICB2JHsocC5ncm91bmQgPyBwLnMgOiBNYXRoLmh5cG90KHAudngsIHAudnkpKS50b0ZpeGVkKDApfSAgZ2FwICR7c2ltLmdhcC50b0ZpeGVkKDApfSAgeiAke2NhbS56LnRvRml4ZWQoMil9YCwgMTIsIDMwKTtcbn1cblxubGV0IGFjYyA9IDAsIGxhc3QgPSBwZXJmb3JtYW5jZS5ub3coKTtcbndpbmRvdy5fX3NpbSA9ICgpID0+IHNpbTtcbndpbmRvdy5fX2FkdmFuY2UgPSAoc2VjLCBwcmVzc0ZuKSA9PiB7XG4gIGNvbnN0IG4gPSBNYXRoLnJvdW5kKHNlYyAvIFNURVApO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xuICAgIGNvbnN0IHByID0gcHJlc3NGbiA/IHByZXNzRm4oc2ltKSA6IChib3QgPyBib3Qoc2ltKSA6IHByZXNzaW5nKTtcbiAgICBwcmVzc2luZyA9IHByO1xuICAgIHNpbS5zdGVwKFNURVAsIHByKTtcbiAgICBpZiAoaSAlIDIgPT09IDApIGNhbS51cGRhdGUoc2ltLCBTVEVQICogMik7XG4gIH1cbiAgc2ltLmRyYWluRXZlbnRzKCk7XG4gIGRyYXcoKTtcbn07XG5mdW5jdGlvbiBmcmFtZShub3cpIHtcbiAgaWYgKHdpbmRvdy5fX21hbnVhbCkgcmV0dXJuO1xuICBjb25zdCBkdCA9IE1hdGgubWluKDAuMDUsIChub3cgLSBsYXN0KSAvIDEwMDApOyBsYXN0ID0gbm93O1xuICBhY2MgKz0gZHQ7XG4gIHdoaWxlIChhY2MgPj0gU1RFUCkge1xuICAgIGNvbnN0IHByID0gYm90ID8gYm90KHNpbSkgOiBwcmVzc2luZztcbiAgICBzaW0uc3RlcChTVEVQLCBwcik7IGFjYyAtPSBTVEVQO1xuICB9XG4gIHNpbS5kcmFpbkV2ZW50cygpO1xuICBpZiAoc2ltLnN0YXRlID09PSAnY2F1Z2h0JykgeyBzaW0gPSBuZXcgUnVuU2ltKHsgbGV2ZWxzOiBMRVZFTFMsIGJhbGFuY2UsIHVwZ3JhZGVzOiB1cHMgfSk7IGNhbS5zbmFwKHNpbSk7IH1cbiAgY2FtLnVwZGF0ZShzaW0sIGR0KTtcbiAgZHJhdygpO1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnJhbWUpO1xufVxucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZyYW1lKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7O0FBQUE7QUFBQSxJQUNFLFVBQVk7QUFBQSxJQUNaLFNBQVc7QUFBQSxNQUNULGVBQWlCO0FBQUEsSUFDbkI7QUFBQSxJQUNBLFNBQVc7QUFBQSxNQUNULFNBQVc7QUFBQSxNQUNYLGlCQUFtQjtBQUFBLE1BQ25CLG9CQUFzQjtBQUFBLE1BQ3RCLGdCQUFrQjtBQUFBLE1BQ2xCLFNBQVc7QUFBQSxNQUNYLFlBQWM7QUFBQSxNQUNkLFVBQVk7QUFBQSxNQUNaLFVBQVk7QUFBQSxNQUNaLFlBQWM7QUFBQSxNQUNkLFFBQVU7QUFBQSxNQUNWLGNBQWdCO0FBQUEsTUFDaEIscUJBQXVCO0FBQUEsTUFDdkIsY0FBZ0I7QUFBQSxNQUNoQixXQUFhO0FBQUEsTUFDYixVQUFZO0FBQUEsTUFDWixVQUFZO0FBQUEsTUFDWixVQUFZO0FBQUEsTUFDWixZQUFjO0FBQUEsTUFDZCxXQUFhO0FBQUEsTUFDYixlQUFpQjtBQUFBLE1BQ2pCLG1CQUFxQjtBQUFBLE1BQ3JCLGFBQWU7QUFBQSxNQUNmLGdCQUFrQjtBQUFBLE1BQ2xCLGFBQWU7QUFBQSxNQUNmLFdBQWE7QUFBQSxNQUNiLGVBQWlCO0FBQUEsTUFDakIsV0FBYTtBQUFBLE1BQ2Isa0JBQW9CO0FBQUEsUUFDbEI7QUFB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
