// One run on screen: drives the simulation from touch input, turns sim events into feel
// (particles, words, sound, vibration, camera), runs the first-run tutorial and the hints.
import balance from '../data/balance.json';
import { RunSim, STEP } from '../core/run.js';
import { generateLevel } from '../core/world.js';
import { Camera } from './camera.js';
import { WorldRenderer } from './world-render.js';
import { PenguinRenderer, BlizzardRenderer } from './actors-render.js';
import { Particles, Floaters } from './fx.js';
import { draw, preloadBg } from './assets.js';
import { t } from '../i18n/i18n.js';

const TAU = Math.PI * 2;

export function endlessGenerator(levels) {
  const biomes = ['cloud', 'stars', 'aurora', 'sunset'];
  return (index) => {
    const k = index - levels.length;
    const lv = generateLevel(7000 + k * 131, {
      id: 'endless_' + k,
      biome: biomes[k % biomes.length],
      surface: biomes[k % biomes.length] === 'cloud' ? 'cloud' : 'snow',
      name: { ko: `끝없는 하늘 ${k + 1}`, en: `Endless Sky ${k + 1}` },
      features: ['ice', 'wind', 'geyser', 'ring'],
      amp: 1.15,
      blizzard: { startGap: 1400, speed: 1080 + k * 40, accel: 10 },
    });
    return lv;
  };
}

export class RunScene {
  constructor(app) {
    this.app = app;
    this.cam = new Camera();
    this.wr = new WorldRenderer();
    this.pr = new PenguinRenderer();
    this.br = new BlizzardRenderer();
    this.parts = new Particles(260);
    this.floaters = new Floaters();
    this.sim = null;
    this.time = 0;
    this.acc = 0;
    this.timeScale = 1;
    this.slowT = 0;
    this.pressing = false;
    this.ended = false;
    this.endT = 0;
    this.ghost = null;
    this.trail = [];
    this.trailT = 0;
    this.biome = 'dawn';
    this.prevBiome = null;
    this.biomeBlend = 1;
    this.fishCombo = 0; this.fishComboT = 0;
    this.tutorial = null;
    this.hint = null;
    this.hintCounts = {};
    this.paused = false;
    this.recordX = null; this.recordPassed = false;
    this.speedLines = [];
    this.flash = 0;
    this.bannerQueue = [];
    this.feverGlow = 0;
    this.lastHud = 0;
    this.bot = null;
    this.capture = false;
  }

  start(opts) {
    const { levels, upgrades, startIndex = 0, tutorial = false, assist = 0, modifiers = {}, ghost = null, recordX = null, levelOverride = null } = opts;
    const lv = levelOverride ? [levelOverride] : levels;
    this.levels = lv;
    this.sim = new RunSim({ levels: lv, balance, upgrades, startIndex: levelOverride ? 0 : startIndex, tutorial, assist, modifiers, generator: levelOverride ? null : endlessGenerator(levels) });
    this.applyNames();
    this.opts = opts;
    this.time = 0; this.acc = 0; this.timeScale = 1; this.slowT = 0;
    this.ended = false; this.endT = 0;
    this.parts.clear(); this.floaters.clear(); this.pr.reset();
    this.trail = []; this.trailT = 0;
    this.ghost = ghost;
    this.recordX = recordX; this.recordPassed = false;
    this.biome = this.sim.island.biome; this.prevBiome = null; this.biomeBlend = 1;
    this.fishCombo = 0;
    this.hint = null; this.hintCounts = {};
    this.tutorial = tutorial ? { step: 0, t: 0, hills: 0, done: false } : null;
    this.pressing = false;
    this.paused = false;
    this.flash = 0;
    this.feverGlow = 0;
    this.cam.resize(this.app.W, this.app.H);
    this.cam.snap(this.sim);
    this.preloadBiomes();
    this.runStats = { pressCount: 0, startTime: performance.now() };
  }

  applyNames() {
    const lang = this.app.lang;
    for (const isl of this.sim.world.islands) isl.displayName = (isl.level.name && (isl.level.name[lang] || isl.level.name.en)) || '';
  }

  preloadBiomes() {
    const names = new Set();
    for (const isl of this.sim.world.islands) {
      names.add('far_' + isl.biome); names.add('mid_' + isl.biome); names.add('isle_' + isl.biome);
    }
    const nx = this.nextIsland();
    if (nx) names.add('isle_' + nx.biome);
    preloadBg([...names]);
  }

  nextIsland() {
    const w = this.sim.world;
    const i = w.islands.indexOf(this.sim.island);
    return w.islands[i + 1] || (w.levelFor(this.sim.island.index + 1) ? { biome: w.levelFor(this.sim.island.index + 1).biome } : null);
  }

  setPress(v) {
    if (this.paused || this.ended) { this.pressing = false; return; }
    if (v && !this.pressing) this.runStats.pressCount++;
    this.pressing = v;
  }

  // ---------------------------------------------------------------- update
  update(dt) {
    if (this.paused) return;
    const sim = this.sim;
    this.time += dt;
    this.wr.time = this.time;
    // tutorial may freeze or slow time
    let scale = 1;
    if (this.bot && this.tutorial && !this.tutorial.done && this.tutorial.step === 0) this.pressing = true;
    if (this.tutorial && !this.tutorial.done) scale = this.tutorialUpdate(dt);
    if (this.slowT > 0) { this.slowT -= dt; scale = Math.min(scale, this.timeScale); }
    if (this.ended) scale = 0.6;
    this.acc += dt * scale;
    let steps = 0;
    while (this.acc >= STEP && steps < 12) {
      const press = this.bot ? this.bot(sim) : this.pressing;
      if (this.bot) this.pressing = press;
      sim.step(STEP, press);
      this.acc -= STEP;
      steps++;
      for (const e of sim.drainEvents()) this.onEvent(e);
    }
    if (steps >= 12) this.acc = 0;
    this.cam.update(sim, dt);
    this.pr.update(dt, sim, this.pressing);
    this.parts.update(dt);
    this.floaters.update(dt);
    if (this.biomeBlend < 1) this.biomeBlend = Math.min(1, this.biomeBlend + dt * 0.8);
    if (this.flash > 0) this.flash -= dt * 2.5;
    this.feverGlow += ((sim.p.fever > 0 ? 1 : 0) - this.feverGlow) * Math.min(1, 4 * dt);
    if (this.fishComboT > 0) { this.fishComboT -= dt; if (this.fishComboT <= 0) this.fishCombo = 0; }
    this.trailT += dt * scale;
    if (this.trailT > 0.08 && sim.state !== 'caught') { this.trailT = 0; this.trail.push([Math.round(sim.p.x), Math.round(sim.p.y)]); if (this.trail.length > 4000) this.trail.splice(0, 2); }
    this.ambientFx(dt);
    this.hintsUpdate(dt);
    if (this.recordX && !this.recordPassed && sim.p.x > this.recordX && sim.state !== 'caught') {
      this.recordPassed = true;
      this.word(t('fx.record'), { size: 30, color: '#ffe27a', life: 1.6 });
      this.confetti(26);
      this.app.audio.play('record');
      this.app.haptics.pulse('medium');
      this.app.analytics.track('record_passed', { distance: sim.distanceMeters });
    }
    if (this.ended) {
      this.endT += dt;
      if (this.endT > 1.7 && !this.endSent) { this.endSent = true; this.app.onRunEnd(this.result()); }
    }
    // audio: slide loop & wind follow the action
    const p = sim.p;
    const speed = p.ground ? p.s : Math.hypot(p.vx, p.vy);
    this.app.audio.setSlide(p.ground && sim.state === 'run' ? Math.min(1, speed / 2200) : 0, this.pressing, p.ice);
    const B = balance.blizzard;
    this.app.audio.setWind(sim.state === 'caught' ? 0.6 : Math.max(0.08, Math.min(1, 1 - (sim.gap - 200) / (B.maxGap)) * 0.9));
    if (this.app.hud && this.time - this.lastHud > 0.08) { this.lastHud = this.time; this.app.hud.update(this); }
  }

  tutorialUpdate(dt) {
    const tu = this.tutorial, sim = this.sim, p = sim.p;
    tu.t += dt;
    if (tu.step === 0) {
      this.hint = { key: 'tut.hold', icon: 'hold' };
      if (this.pressing) { tu.step = 1; tu.t = 0; this.hint = null; this.app.analytics.track('tutorial_step', { step: 'hold' }); }
      return 0; // frozen at the top until the first touch
    }
    if (tu.step === 1) {
      // sliding down; look for the valley bottom
      const isl = sim.island;
      const s = [0, 0, 0];
      isl.sample(p.x + Math.max(140, p.s * 0.22), s);
      if (p.ground && s[1] > 0.05 && p.slope < 0.3) { tu.step = 2; tu.t = 0; }
      else if (!this.pressing && p.ground && p.slope < -0.1 && tu.t > 0.4) this.hint = { key: 'tut.holdMore', icon: 'hold' };
      else this.hint = null;
      return 1;
    }
    if (tu.step === 2) {
      this.hint = { key: 'tut.release', icon: 'release' };
      if (!this.pressing || !p.ground) {
        tu.step = 3; tu.t = 0; this.hint = null;
        this.app.analytics.track('tutorial_step', { step: 'release' });
        return 1;
      }
      return tu.t > 3 ? 1 : 0.22; // slow motion while we wait for the release
    }
    if (tu.step === 3) {
      // after the first flight, teach the dive once while falling toward a downslope
      if (!p.ground && p.vy < -200 && !tu.diveShown && p.air > 0.35) { tu.diveShown = true; this.hint = { key: 'tut.dive', icon: 'hold', t: 2.4 }; }
      if (this.hint && this.hint.t) { this.hint.t -= dt; if (this.hint.t <= 0) this.hint = null; }
      if (sim.stats.hills >= 3 && (sim.blizzardHold <= 0.5 || sim.stats.hills >= 4)) {
        tu.step = 4; tu.t = 0;
        this.banner(t('tut.blizzardTitle'), t('tut.blizzard'), 'blizzard');
        // let it show itself once: roll in from the left edge, then the chase begins
        sim.blizzardX = Math.max(sim.blizzardX, p.x - 950);
        sim.blizzardHold = 0;
        this.app.audio.play('danger');
        this.app.analytics.track('tutorial_complete', { time: Math.round(this.time) });
        this.app.onTutorialDone();
        tu.done = true; this.hint = null;
      }
      return 1;
    }
    return 1;
  }

  hintsUpdate(dt) {
    if (this.tutorial && !this.tutorial.done) return;
    if (!this.app.wantsHints()) return;
    const sim = this.sim, p = sim.p;
    this._upHold = (p.ground && this.pressing && p.slope > 0.15) ? (this._upHold || 0) + dt : Math.max(0, (this._upHold || 0) - dt * 0.5);
    this._idle = (p.ground && !this.pressing && sim.state === 'run') ? (this._idle || 0) + dt : 0;
    const show = (key, icon) => {
      this.hintCounts[key] = (this.hintCounts[key] || 0) + 1;
      if (this.hintCounts[key] > 2) return;
      this.hint = { key, icon, t: 2.2 };
    };
    if (!this.hint) {
      if (this._upHold > 1.0) { show('hint.releaseUp', 'release'); this._upHold = 0; }
      else if (this._idle > 5) { show('hint.holdDown', 'hold'); this._idle = 0; }
    } else if (this.hint.t !== undefined) {
      this.hint.t -= dt;
      if (this.hint.t <= 0) this.hint = null;
    }
  }

  ambientFx(dt) {
    const sim = this.sim, p = sim.p, z = this.cam.z;
    const q = this.app.quality;
    const speed = p.ground ? p.s : Math.hypot(p.vx, p.vy);
    // belly spray while sliding fast
    if (p.ground && sim.state === 'run' && speed > 700 && Math.random() < (q >= 1 ? 0.5 : 0.2) * (this.pressing ? 1 : 0.5)) {
      this.parts.spawn({ sprite: 'puff_' + (Math.random() < 0.5 ? 1 : 2), x: p.x - 30, y: p.y + 6, vx: -speed * 0.25 + (Math.random() - 0.5) * 80, vy: 80 + Math.random() * 120, life: 0.45, scale: 0.35, scale1: 0.7, grav: 400, alpha: 0.85 });
    }
    // fever snowflake trail
    if (p.fever > 0 && Math.random() < (q >= 1 ? 0.7 : 0.3)) {
      this.parts.spawn({ sprite: Math.random() < 0.5 ? 'flake' : 'sparkle_blue', x: p.x - 20, y: p.y + 30, vx: -200 + Math.random() * 100, vy: (Math.random() - 0.3) * 150, life: 0.8, scale: 0.5, scale1: 0.2, vr: 3 });
    }
    // speed lines (screen space)
    const W = this.app.W, H = this.app.H;
    if (speed > 1900 && Math.random() < (q >= 1 ? 0.45 : 0.15)) {
      this.parts.spawn({ sprite: 'speedline', world: false, x: W + 60, y: H * (0.15 + Math.random() * 0.6), vx: -(1400 + Math.random() * 800), vy: 0, life: 0.5, scale: 0.7 + Math.random() * 0.5, alpha: 0.6 });
    }
  }

  // ---------------------------------------------------------------- events -> feel
  word(text, o = {}) {
    const p = this.sim.p;
    this.floaters.add(text, { x: p.x + 30, y: p.y + 210, size: o.size || 26, color: o.color || '#ffffff', life: o.life || 1.0, kind: 'word' });
  }

  confetti(n) {
    const W = this.app.W;
    const cols = ['#ff8fa3', '#ffd166', '#7be0a0', '#7fd3ff', '#c4a6ff', '#ff9a2e'];
    for (let i = 0; i < n; i++) {
      this.parts.spawn({ world: false, color: cols[i % cols.length], w: 8, h: 14, x: W * (0.2 + Math.random() * 0.6), y: this.app.H * 0.25, vx: (Math.random() - 0.5) * 700, vy: -(200 + Math.random() * 500), grav: -900, life: 1.4, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 14, drag: 1.2 });
    }
  }

  banner(title, sub, kind) {
    if (this.app.hud) this.app.hud.banner(title, sub, kind);
  }

  burst(x, y, sprite = 'sparkle', n = 8, speed = 420, scale = 0.6) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + Math.random() * 0.3;
      this.parts.spawn({ sprite, x, y, vx: Math.cos(a) * speed * (0.6 + Math.random() * 0.6), vy: Math.sin(a) * speed * (0.6 + Math.random() * 0.6), life: 0.55, scale, scale1: 0.1, drag: 2.5, vr: 4 });
    }
  }

  onEvent(e) {
    const app = this.app, sim = this.sim, p = sim.p, au = app.audio, hp = app.haptics;
    this.pr.onEvent(e);
    switch (e.type) {
      case 'takeoff': {
        const big = e.speed > 1700;
        au.play('takeoff', { rate: 0.85 + Math.min(0.5, e.speed / 4000), volume: 0.5 + Math.min(0.5, e.speed / 3000) });
        if (e.flap > 40) au.play('flap', { volume: Math.min(1, e.flap / 500) });
        for (let i = 0; i < (big ? 5 : 3); i++) this.parts.spawn({ sprite: 'puff_1', x: p.x - 20 + i * 12, y: p.y - 10, vx: -100 + Math.random() * 200, vy: 60 + Math.random() * 100, life: 0.5, scale: 0.45, scale1: 0.9, grav: 200 });
        break;
      }
      case 'height': {
        const m = e.meters;
        this.floaters.add(t('fx.height', { m }), { x: p.x, y: p.y + 170, size: 22 + e.level * 2, color: '#bff0ff', life: 1.1, kind: 'word' });
        au.play('height', { rate: 1 + e.level * 0.12 });
        if (e.level >= 2) hp.pulse('light');
        break;
      }
      case 'land': {
        if (e.kind === 'perfect') {
          const c = p.chain;
          const label = c >= 3 ? t('fx.perfect3') : c === 2 ? t('fx.perfect2') : t('fx.perfect1');
          this.word(label, { size: 24 + Math.min(4, c) * 3, color: c >= 3 ? '#ffe27a' : '#ffffff' });
          au.play('perfect', { rate: 1 + Math.min(6, c - 1) * 0.0833 * 2 });
          hp.pulse(c >= 3 ? 'medium' : 'light');
          this.burst(p.x, p.y + 30, c >= 3 ? 'sparkle_gold' : 'sparkle', 6 + Math.min(6, c * 2), 360, 0.55);
          this.parts.spawn({ sprite: 'ringwave', x: p.x, y: p.y + 20, life: 0.4, scale: 0.4, scale1: 1.5, alpha: 0.8 });
        } else if (e.kind === 'bonk') {
          this.word(t('fx.bonk'), { size: 22, color: '#d6dcf0' });
          au.play('bonk');
          hp.pulse('bonk');
          this.cam.shake(10, 0.25);
          for (let i = 0; i < 6; i++) this.parts.spawn({ sprite: 'puff_' + (i % 3), x: p.x, y: p.y, vx: (Math.random() - 0.5) * 400, vy: 100 + Math.random() * 250, life: 0.6, scale: 0.5, scale1: 0.9, grav: 500 });
        } else {
          au.play('land', { volume: Math.min(1, 0.3 + e.height / 1200) });
          for (let i = 0; i < 3; i++) this.parts.spawn({ sprite: 'puff_1', x: p.x - 10 + i * 10, y: p.y, vx: (Math.random() - 0.5) * 240, vy: 60 + Math.random() * 120, life: 0.45, scale: 0.4, scale1: 0.8, grav: 400 });
        }
        break;
      }
      case 'fever': {
        this.word(t('fx.fever'), { size: 34, color: '#9fe6ff', life: 1.4 });
        au.play('fever');
        au.setFever(true);
        hp.pulse('strong');
        this.flash = 1;
        this.burst(p.x, p.y + 40, 'flake', 12, 520, 0.7);
        app.analytics.track('fever', { island: sim.island.index });
        break;
      }
      case 'feverEnd': au.setFever(false); break;
      case 'fish': {
        this.fishCombo++; this.fishComboT = 0.6;
        au.play(e.gold ? 'gold' : 'fish', { rate: e.gold ? 1 : 1 + Math.min(12, this.fishCombo - 1) * 0.06 });
        this.parts.spawn({ sprite: e.gold ? 'sparkle_gold' : 'sparkle', x: e.x, y: e.y, life: 0.35, scale: e.gold ? 0.9 : 0.5, scale1: 0.1, vr: 6 });
        if (e.gold) {
          this.floaters.add('+' + e.value, { x: e.x, y: e.y + 40, size: 26, color: '#ffe27a', life: 0.9, kind: 'num' });
          this.burst(e.x, e.y, 'sparkle_gold', 8, 300, 0.5);
          hp.pulse('light');
        }
        if (app.hud) app.hud.bumpFish();
        break;
      }
      case 'ring': {
        au.play('ring');
        hp.pulse('light');
        this.burst(e.x, e.y, 'sparkle_blue', 10, 420, 0.6);
        const r = sim.island.rings.find((q) => q.x === e.x && q.y === e.y);
        if (r) r.fade = 0.0001;
        this.word(t('fx.ring'), { size: 24, color: '#a6ffe0' });
        break;
      }
      case 'geyser': {
        au.play('geyser');
        hp.pulse('medium');
        this.cam.shake(6, 0.3);
        for (let i = 0; i < 4; i++) this.parts.spawn({ sprite: 'plume_' + i, x: e.x, y: sim.island.heightAt(e.x), frames: ['plume_0', 'plume_1', 'plume_2', 'plume_3', 'plume_0', 'plume_1'], fps: 10, life: 0.8, scale: 1.6, scale1: 2.0, alpha: 0.9 - i * 0.15 });
        break;
      }
      case 'wind': au.play('gust'); break;
      case 'danger': {
        au.play('danger');
        hp.pulse('light');
        break;
      }
      case 'escape': {
        this.floaters.add(t('fx.escape'), { x: p.x, y: p.y + 200, size: 22, color: '#ffffff', life: 1, kind: 'word' });
        au.play('escape');
        break;
      }
      case 'secondWind': {
        this.word(t('fx.secondWind'), { size: 32, color: '#ff8fa3', life: 1.4 });
        au.play('secondwind');
        hp.pulse('strong');
        this.burst(p.x, p.y + 40, 'heart', 10, 500, 0.6);
        break;
      }
      case 'islandClear': {
        this.timeScale = 0.55; this.slowT = 0.5;
        au.play('launch');
        hp.pulse('medium');
        this.burst(p.x, p.y + 20, 'sparkle_gold', 14, 600, 0.7);
        break;
      }
      case 'islandReach': {
        const isl = sim.island;
        this.applyNames();
        this.prevBiome = this.biome; this.biome = isl.biome; this.biomeBlend = this.prevBiome === this.biome ? 1 : 0;
        const first = app.onIslandReach(isl.index);
        this.banner(first ? t('banner.newIsland') : t('banner.island', { n: isl.index + 1 }), isl.displayName, first ? 'new' : 'island');
        au.play(first ? 'fanfare' : 'arrive');
        hp.pulse('strong');
        this.confetti(first ? 40 : 18);
        this.preloadBiomes();
        const intro = isl.level.intro;
        if (intro && app.markIntro(intro)) this.hint = { key: 'intro.' + intro, icon: intro, t: 3.6 };
        break;
      }
      case 'caught': {
        this.ended = true;
        au.play('caught');
        au.setFever(false);
        hp.pulse('caught');
        this.cam.shake(8, 0.4);
        this.floaters.add(t('fx.caught'), { x: this.app.W / 2, y: this.app.H * 0.32, world: false, size: 34, color: '#ffffff', life: 1.8, kind: 'word', rise: 20 });
        break;
      }
      default: break;
    }
  }

  result() {
    const sim = this.sim;
    return {
      distance: sim.distanceMeters,
      distanceUnits: sim.p.x,
      stats: sim.stats,
      islandIndex: sim.island.index,
      islandsCleared: sim.islandsCleared,
      startIndex: sim.startIndex,
      progress: Math.max(0, Math.min(1, (sim.p.x - sim.island.startX) / sim.island.length)),
      island: sim.island,
      time: sim.time,
      trail: this.trail,
      presses: this.runStats.pressCount,
      ended: 'caught',
    };
  }

  // ---------------------------------------------------------------- render
  render(ctx) {
    const W = this.app.W, H = this.app.H;
    const cam = this.cam, sim = this.sim;
    const world = sim.world;
    const isl = sim.island;
    const prog = Math.max(0, Math.min(1, (sim.p.x - isl.startX) / isl.length));
    const nx = this.nextIsland();
    this.wr.quality = this.app.quality;
    this.br.quality = this.app.quality;
    this.wr.drawBackground(ctx, cam, this.biome, this.prevBiome, this.biomeBlend, W, H, sim.state === 'crossing' ? null : nx, prog);
    this.wr.clouds(ctx, cam, W, H, this.biome);
    this.wr.drawSea(ctx, cam, world, W, H);
    // ghost trail of the last run
    if (this.ghost && this.ghost.length > 2) this.drawGhost(ctx);
    for (const i of world.islands) this.wr.drawWind(ctx, cam, i);
    this.wr.drawTerrain(ctx, cam, world, W, H);
    this.wr.drawDecor(ctx, cam, world);
    if (this.recordX) this.drawRecordFlag(ctx);
    for (const i of world.islands) this.wr.drawRings(ctx, cam, i, 'back');
    for (const i of world.islands) {
      for (const r of i.rings) if (r.fade) r.fade = Math.min(1, r.fade + 1 / 30);
      this.wr.drawFish(ctx, cam, i, this.time);
    }
    this.parts.render(ctx, cam, true);
    this.pr.render(ctx, cam, sim, this.pressing, this.time, world);
    for (const i of world.islands) this.wr.drawRings(ctx, cam, i, 'front');
    this.floaters.render(ctx, cam);
    this.br.render(ctx, cam, sim, this.time, W, H);
    this.parts.render(ctx, cam, false);
    // fever glow on the edges
    if (this.feverGlow > 0.02) {
      const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.4, W / 2, H / 2, Math.max(W, H) * 0.72);
      g.addColorStop(0, 'rgba(160,230,255,0)');
      g.addColorStop(1, `rgba(160,230,255,${(0.45 * this.feverGlow * (0.8 + 0.2 * Math.sin(this.time * 10))).toFixed(3)})`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    if (this.flash > 0) { ctx.fillStyle = `rgba(255,255,255,${(0.5 * this.flash).toFixed(3)})`; ctx.fillRect(0, 0, W, H); }
    if (this.hint) this.drawHint(ctx, W, H);
    if (this.capture && this.app.drawFinger) this.app.drawFinger(ctx, this.pressing, W, H, this.time);
  }

  drawGhost(ctx) {
    const cam = this.cam;
    const L = cam.left - 100, R = cam.right + 100;
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    const r = Math.max(2, 7 * cam.z);
    let shown = 0;
    for (let i = 0; i < this.ghost.length; i += 2) {
      const [x, y] = this.ghost[i];
      if (x < L) continue;
      if (x > R) break;
      ctx.beginPath(); ctx.arc(cam.toScreenX(x), cam.toScreenY(y + 40), r, 0, TAU); ctx.fill();
      shown++;
    }
  }

  drawRecordFlag(ctx) {
    const cam = this.cam;
    const x = this.recordX;
    if (x < cam.left - 200 || x > cam.right + 200) return;
    const y = this.sim.world.heightAt(x);
    if (this.sim.world.inGap(x)) return;
    const sx = cam.toScreenX(x), sy = cam.toScreenY(y);
    draw(ctx, 'flag_record', sx, sy + 4 * cam.z, cam.z * 1.3);
    const fs = Math.max(11, 34 * cam.z);
    ctx.font = `${fs}px GameFont, sans-serif`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.lineWidth = fs * 0.25; ctx.strokeStyle = '#1e2350'; ctx.fillStyle = '#ffffff';
    const label = t('hud.best');
    ctx.strokeText(label, sx + 8 * cam.z, sy - 230 * cam.z * 1.3); ctx.fillText(label, sx + 8 * cam.z, sy - 230 * cam.z * 1.3);
  }

  drawHint(ctx, W, H) {
    const h = this.hint;
    const text = t(h.key);
    const y = H * 0.27;
    const fs = Math.min(24, W * 0.058);
    ctx.font = `${fs}px GameFont, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const tw = Math.min(W - 40, ctx.measureText(text).width + 40);
    // pill
    const bw = tw, bh = fs * 2.1, bx = (W - bw) / 2, by = y - bh / 2;
    ctx.fillStyle = 'rgba(30,35,80,0.78)';
    roundRect(ctx, bx, by, bw, bh, bh / 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    fitText(ctx, text, W / 2, y + 1, bw - 28, fs);
    // finger icon
    if (h.icon === 'hold' || h.icon === 'release') this.drawHand(ctx, W / 2, H * 0.8, h.icon === 'hold');
  }

  drawHand(ctx, x, y, down) {
    const t2 = this.time * 2.4;
    const press = down ? (Math.sin(t2) > -0.4) : (Math.sin(t2) > 0.4);
    if (press) {
      const k = (this.time * 1.6) % 1;
      ctx.strokeStyle = `rgba(255,255,255,${(0.9 - k * 0.9).toFixed(2)})`;
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(x, y, 16 + k * 34, 0, TAU); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.beginPath(); ctx.arc(x, y, 18, 0, TAU); ctx.fill();
    }
    draw(ctx, press ? 'hand_down' : 'hand_up', x, y + (press ? 0 : -14), 0.62);
  }

}

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function fitText(ctx, text, x, y, maxW, size) {
  let s = size;
  ctx.font = `${s}px GameFont, sans-serif`;
  while (ctx.measureText(text).width > maxW && s > 10) { s -= 1; ctx.font = `${s}px GameFont, sans-serif`; }
  ctx.fillText(text, x, y);
}
