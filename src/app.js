// App controller: boot, main loop, input, scene switching and every player action from the UI.
import balance from './data/balance.json';
import atlasData from './data/atlas.json';
import { LEVELS } from './data/levels.js';
import { loadAtlas, preloadBg, draw as drawSprite } from './game/assets.js';
import { RunScene } from './game/run-scene.js';
import { VillageScene } from './game/village-scene.js';
import { Haptics } from './game/haptics.js';
import { Audio } from './audio/audio.js';
import { Save, now, dayKey } from './meta/save.js';
import { Analytics } from './meta/analytics.js';
import { services } from './services/services.js';
import * as E from './meta/economy.js';
import * as D from './meta/daily.js';
import { detectLanguage, setLanguage, getLanguage, t, name } from './i18n/i18n.js';
import { UI } from './ui/ui.js';
import { HUD } from './ui/hud.js';
import { TitleScreen, HubScreen, ResultsScreen } from './ui/screens.js';
import { UpgradesPopup, BuildPopup, MapPopup, MissionsPopup, DailyPopup, TodayPopup, SettingsPopup, PausePopup, InfoPopup, ConfirmPopup } from './ui/panels.js';
import { makeBot } from './core/bot.js';
import audioList from './data/audio-list.json';
export { makeBot };

const UPM = balance.display.unitsPerMeter;

export class App {
  constructor() {
    this.version = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'dev';
    this.levels = LEVELS;
    this.canvas = document.getElementById('game');
    this.ctx = this.canvas.getContext('2d', { alpha: false, desynchronized: true });
    this.W = 390; this.H = 844; this.dpr = 1;
    this.save = new Save();
    this.analytics = new Analytics();
    this.audio = new Audio();
    this.haptics = new Haptics();
    this.mode = 'boot'; // boot | title | hub | run | results
    this.quality = 1;
    this.fps = 60; this.fpsAcc = 0; this.fpsN = 0; this.perfT = 0;
    this.pointers = new Set();
    this.lastFrame = 0;
    this.sessionStart = Date.now();
    this.runsThisSession = 0;
  }

  get state() { return this.save.state; }
  makeBot(p, seed = 1) { return makeBot(p, seed); }
  get lang() { return getLanguage(); }

  // ---------------------------------------------------------------- boot
  async boot() {
    const s = this.save.load();
    setLanguage(s.settings.lang || detectLanguage());
    const auth = await services.auth.signIn().catch(() => ({ playerId: 'guest' }));
    s.playerId = s.playerId || auth.playerId;
    await this.save.pullCloud();
    this.analytics.setCommon({ pid: this.state.playerId, v: this.version, lang: this.lang });
    if (!this.state.firstOpenSent) { this.analytics.track('first_open', {}); this.state.firstOpenSent = true; }
    this.state.stats.sessions++;
    this.analytics.track('session_start', { sessions: this.state.stats.sessions, day: this.state.daily.days });
    this.applySettings();
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('orientationchange', () => setTimeout(() => this.resize(), 200));
    const fill = document.getElementById('bootFill');
    await Promise.all([
      loadAtlas(atlasData, (k) => { if (fill) fill.style.width = Math.round(20 + k * 60) + '%'; }),
      preloadBg(['far_dawn', 'mid_dawn', 'isle_pine', 'sun', 'tex_snow', 'cloud_0'].filter((n) => !n.startsWith('cloud'))),
      // the font stylesheet arrives without blocking first paint; wait for it, then for the faces
      new Promise((r) => { const l = document.getElementById('fontcss'); if (!l || l.media === 'all') r(); else { l.addEventListener('load', r, { once: true }); l.addEventListener('error', r, { once: true }); setTimeout(r, 2500); } })
        .then(() => (document.fonts && document.fonts.load ? Promise.race([document.fonts.load('20px GameFont', '펭귄 Penguin 0123'), new Promise((r) => setTimeout(r, 1500))]) : null)),
    ]);
    if (fill) fill.style.width = '90%';
    // sound downloads after the first screen is up (or at the first touch), off the critical path
    let audioStarted = false;
    const startAudio = () => { if (!audioStarted) { audioStarted = true; this.loadAudioPacks(); } };
    setTimeout(startAudio, 1200);
    window.addEventListener('pointerdown', startAudio, { once: true, capture: true });
    this.buildUI();
    this.bindInput();
    this.dailyCheck(true);
    this.run = new RunScene(this);
    this.village = new VillageScene(this);
    this.village.sync(this.state);
    if (fill) fill.style.width = '100%';
    document.getElementById('boot').classList.add('hide');
    const editorLevel = this.editorLevel();
    if (editorLevel) this.startEditorRun(editorLevel);
    else if (!this.state.tutorialDone && this.state.runs === 0) this.showTitle();
    else this.goHub(true);
    requestAnimationFrame((tm) => this.frame(tm));
    this.installCapture();
    if (typeof __DEV__ !== 'undefined' && __DEV__ && !/nodebug=1/.test(location.search)) import('./ui/debug.js').then((m) => m.installDebug(this)).catch((e) => console.warn(e));
    this.save.write();
  }

  // Sound loads after the game is already playable. Over http(s) the MP3 files are fetched
  // directly; from file:// (where fetch is blocked) the base64 script packs are used instead.
  loadAudioPacks() {
    const base = (window.ASSET_BASE || '') + 'assets/';
    Object.assign(this.audio.loopPoints, Object.fromEntries(Object.entries(audioList.loops).map(([k, v]) => [k, v])));
    const viaScripts = () => {
      const add = (file) => new Promise((res) => {
        const sc = document.createElement('script');
        sc.src = base + file;
        sc.async = true;
        sc.onload = res; sc.onerror = res;
        document.head.appendChild(sc);
      });
      window.__audioPack = (pack) => this.audio.addPack(pack);
      return add('audio-sfx.js').then(() => add('audio-music.js'));
    };
    if (!/^https?:/.test(location.protocol)) { viaScripts(); return; }
    const one = (name) => fetch(base + 'audio/' + name + '.mp3').then((r) => { if (!r.ok) throw new Error(name); return r.arrayBuffer(); }).then((ab) => this.audio.addBuffer(name, ab));
    Promise.all(audioList.sfx.map(one))
      .then(() => Promise.all(['music_theme', 'music_run', 'music_run_layer'].map(one)))
      .catch(() => viaScripts());
  }

  buildUI() {
    this.ui = new UI(this);
    this.hud = new HUD(this);
    this.hud.el.classList.add('hidden');
    this.ui.root.insertBefore(this.hud.el, this.ui.root.firstChild);
    this.ui.addScreen('title', new TitleScreen(this));
    this.ui.addScreen('hub', new HubScreen(this));
    this.ui.addScreen('results', new ResultsScreen(this));
    this.ui.addScreen('run', { el: document.createElement('div') });
    this.pop = {
      upgrades: new UpgradesPopup(this), build: new BuildPopup(this), map: new MapPopup(this), missions: new MissionsPopup(this),
      daily: new DailyPopup(this), today: new TodayPopup(this), settings: new SettingsPopup(this), pause: new PausePopup(this),
      info: new InfoPopup(this), confirm: new ConfirmPopup(this),
    };
  }

  // ---------------------------------------------------------------- settings
  applySettings() {
    const st = this.state.settings;
    this.audio.musicOn = st.music; this.audio.sfxOn = st.sound;
    if (this.audio.ctx) { this.audio.setMusic(st.music); this.audio.setSfx(st.sound); }
    this.haptics.enabled = st.vibration;
    const q = st.quality === 'auto' ? (this.autoQuality ?? 1) : { low: 0, mid: 1, high: 2 }[st.quality];
    this.quality = q;
    this.frameCap = st.saver ? 30 : 60;
    if (this.run) this.run.parts.setBudget([90, 170, 260][q]);
    this.resize();
  }

  qualityName() { return ['low', 'mid', 'high'][this.quality]; }

  setSetting(k, v) {
    const st = this.state.settings;
    st[k] = v;
    if (k === 'lang') {
      setLanguage(v);
      this.analytics.setCommon({ lang: v });
      if (this.run && this.run.sim) this.run.applyNames();
      for (const p of Object.values(this.pop)) if (this.ui.isOpen(p.id)) p.onOpen();
      this.ui.screens[this.ui.current]?.refresh?.();
      this.ui.screens.title.onShow();
    }
    this.applySettings();
    this.save.write();
    this.analytics.track('settings_change', { key: k, value: String(v) });
    if (k === 'vibration' && v) this.haptics.pulse('medium');
  }

  resize() {
    const vv = window.visualViewport;
    const W = Math.round(window.innerWidth), H = Math.round(window.innerHeight);
    const maxDpr = [1, 1.5, 2.5][this.quality ?? 1];
    const dpr = Math.min(maxDpr, window.devicePixelRatio || 1);
    this.W = W; this.H = H; this.dpr = dpr;
    this.canvas.width = Math.round(W * dpr); this.canvas.height = Math.round(H * dpr);
    if (this.run) this.run.cam.resize(W, H);
    this.layoutVillage();
  }

  layoutVillage() {
    if (!this.village) return;
    const hub = this.ui && this.ui.screens.hub;
    let bottom = this.H * 0.36;
    if (hub && !hub.el.classList.contains('hidden')) {
      const r = hub.bottom.getBoundingClientRect();
      if (r.height > 0) bottom = this.H - r.top + 6;
    }
    this.village.setRegion(0, Math.max(240, this.H - bottom));
  }

  // ---------------------------------------------------------------- input
  bindInput() {
    const el = document.getElementById('app');
    const down = (e) => {
      this.audio.unlock();
      if (this.mode !== 'run' || this.ui.hasPopup) return;
      if (e.target.closest && e.target.closest('button')) return;
      this.pointers.add(e.pointerId);
      this.run.setPress(true);
      e.preventDefault();
    };
    const up = (e) => {
      this.pointers.delete(e.pointerId);
      if (this.pointers.size === 0 && this.run) this.run.setPress(false);
    };
    el.addEventListener('pointerdown', down, { passive: false });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    window.addEventListener('blur', () => { this.pointers.clear(); if (this.run) this.run.setPress(false); });
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      if (e.code === 'Space' || e.code === 'ArrowDown') { this.audio.unlock(); if (this.mode === 'run' && !this.ui.hasPopup) this.run.setPress(true); e.preventDefault(); }
      if (e.code === 'Escape') { if (this.ui.hasPopup && this.ui.stack[this.ui.stack.length - 1].id !== 'pause') this.ui.close(); else if (this.mode === 'run') this.pauseRun(); }
    });
    window.addEventListener('keyup', (e) => { if ((e.code === 'Space' || e.code === 'ArrowDown') && this.run) this.run.setPress(false); });
    document.addEventListener('pointerdown', () => this.audio.unlock(), { capture: true });
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    document.addEventListener('dblclick', (e) => e.preventDefault());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.audio.suspend();
        if (this.mode === 'run' && !this.run.ended) this.pauseRun();
        this.analytics.track('session_end', { seconds: Math.round((Date.now() - this.sessionStart) / 1000), runs: this.runsThisSession });
        this.analytics.flush();
        this.save.write();
        this.hiddenAt = Date.now();
      } else {
        this.audio.resume();
        if (this.hiddenAt && Date.now() - this.hiddenAt > 30 * 60 * 1000) {
          this.sessionStart = Date.now(); this.runsThisSession = 0;
          this.analytics.track('session_start', { sessions: ++this.state.stats.sessions, resumed: true });
        }
        this.dailyCheck(false);
        if (this.mode === 'hub') this.ui.screens.hub.refresh();
      }
    });
    window.addEventListener('pagehide', () => this.save.write());
  }

  // ---------------------------------------------------------------- capture (dev build only)
  // Deterministic frame stepping for the trailer and store screenshots: the real game, advanced
  // one fixed frame at a time, with every sound effect logged so the video's audio lines up.
  installCapture() {
    if (typeof __DEV__ === 'undefined' || !__DEV__) return;
    const app = this;
    window.__cap = {
      log: [],
      loops: [],
      t: 0,
      E, D,
      // tap indicator for UI presses in trailer footage (ring + hand sprite, fingertip at x,y)
      tapFx(x, y) {
        if (!document.getElementById('capStyle')) {
          const st = document.createElement('style'); st.id = 'capStyle';
          st.textContent = '.cap-tap{position:absolute;z-index:300;pointer-events:none;left:0;top:0}.cap-ring{position:absolute;width:64px;height:64px;margin:-32px 0 0 -32px;border-radius:50%;border:5px solid #fff;background:rgba(255,255,255,.35);animation:capRing .5s ease-out forwards}@keyframes capRing{from{transform:scale(.35);opacity:1}to{transform:scale(1.3);opacity:0}}.cap-hand{position:absolute;animation:capHand .6s ease-out forwards}@keyframes capHand{0%{transform:translateY(-12px)}30%{transform:none}80%{opacity:1}100%{opacity:0}}';
          document.head.appendChild(st);
        }
        const fr = atlasData.frames.hand_down, pg = atlasData.pages[fr.p], k = 0.58;
        const url = (window.ASSET_BASE || '') + 'assets/' + pg.file + '.png';
        const d = document.createElement('div');
        d.className = 'cap-tap';
        d.style.cssText = `left:${x}px;top:${y}px`;
        d.innerHTML = `<span class="cap-ring"></span><span class="cap-hand" style="left:${-fr.px * k}px;top:${-fr.py * k}px;width:${fr.w * k}px;height:${fr.h * k}px;background:url(${url}) ${-fr.x * k}px ${-fr.y * k}px/${pg.w * k}px ${pg.h * k}px"></span>`;
        document.getElementById('app').appendChild(d);
        app.later(() => d.remove(), 650);
      },
      bot(profile = 'expert', seed = 3) { app.run.bot = profile ? makeBot(profile, seed) : null; },
      // ground decisions from one player profile, air decisions (dive timing) from another
      bot2(ground, air, seed = 3) {
        const g = makeBot(ground, seed), a = makeBot(air, seed);
        app.run.bot = (sim) => { const pg = g(sim), pa = a(sim); return sim.p.ground ? pg : pa; };
      },
      start() {
        app.capturing = true;
        window.__now = () => window.__cap.t * 1000;
        app.run.capture = true;
        const orig = app.audio.play.bind(app.audio);
        app.audio.play = (name, o = {}) => { window.__cap.log.push({ t: window.__cap.t, name, rate: o.rate || 1, volume: o.volume ?? 1 }); orig(name, o); };
        const om = app.audio.playMusic.bind(app.audio);
        app.audio.playMusic = (name, force) => { window.__cap.log.push({ t: window.__cap.t, music: name }); om(name, force); };
        for (const k of ['setSlide', 'setWind']) {
          const o = app.audio[k].bind(app.audio);
          app.audio[k] = (...a) => { const L = window.__cap.loops; const last = L[L.length - 1]; const row = last && last.t === window.__cap.t ? last : { t: window.__cap.t }; if (row !== last) L.push(row); row[k] = a; o(...a); };
        }
        const od = app.audio.duckMusic.bind(app.audio);
        app.audio.duckMusic = (amount, time) => { window.__cap.log.push({ t: window.__cap.t, duck: amount, dur: time ?? 0.8 }); od(amount, time); };
        const os = app.audio.setFever.bind(app.audio);
        app.audio.setFever = (on) => { window.__cap.log.push({ t: window.__cap.t, fever: on }); os(on); };
      },
      step(dt = 1 / 30, n = 1) {
        for (let i = 0; i < n; i++) {
          app.tick(dt); window.__cap.t += dt;
          for (const a of document.getAnimations()) { try { a.pause(); a.currentTime = (a.currentTime || 0) + dt * 1000; } catch (e) { /* finished */ } }
        }
      },
    };
  }

  // ---------------------------------------------------------------- loop
  frame(tm) {
    requestAnimationFrame((x) => this.frame(x));
    if (this.capturing) return;
    const cap = this.mode === 'run' ? this.frameCap : 30; // menus run at 30fps to save battery
    if (this.lastFrame && tm - this.lastFrame < 1000 / cap - 2) return;
    const dt = this.lastFrame ? Math.min(0.05, (tm - this.lastFrame) / 1000) : 1 / 60;
    this.lastFrame = tm;
    this.fpsAcc += dt; this.fpsN++;
    if (this.fpsAcc >= 1) { this.fps = this.fpsN / this.fpsAcc; this.fpsAcc = 0; this.fpsN = 0; this.autoTune(); }
    this.tick(dt);
  }

  // game-clock timers (UI banners, toasts) so they stay in step with frame-by-frame capture
  later(fn, ms) {
    const id = ++this._timerId || (this._timerId = 1);
    (this._timers || (this._timers = [])).push({ id, at: (this.appTime || 0) + ms / 1000, fn });
    return id;
  }

  cancel(id) { if (this._timers) this._timers = this._timers.filter((x) => x.id !== id); }

  tick(dt) {
    this.appTime = (this.appTime || 0) + dt;
    if (this._timers && this._timers.length) {
      const due = this._timers.filter((x) => x.at <= this.appTime);
      if (due.length) { this._timers = this._timers.filter((x) => x.at > this.appTime); for (const x of due) x.fn(); }
    }
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    if (this.mode === 'run' || this.mode === 'title' || this.mode === 'results') {
      if (this.mode !== 'results' || !this.run.ended || this.run.endT < 3) this.run.update(dt);
      this.run.render(ctx);
      if (this.mode === 'run') {
        this.perfT += dt;
        if (this.perfT > 60) { this.perfT = 0; this.analytics.track('perf_sample', { fps: Math.round(this.fps), q: this.quality, dpr: this.dpr }); }
      }
    } else if (this.mode === 'hub') {
      this.village.update(dt);
      this.village.render(ctx, this.W, this.H);
    }
  }

  // automatic quality: drop a level if a run stays under 45 fps for a few seconds
  autoTune() {
    if (this.state.settings.quality !== 'auto' || this.mode !== 'run') return;
    this.lowFps = this.fps < 45 ? (this.lowFps || 0) + 1 : 0;
    if (this.lowFps >= 3 && this.quality > 0) {
      this.autoQuality = this.quality - 1;
      this.lowFps = 0;
      this.applySettings();
    }
  }

  // ---------------------------------------------------------------- scenes
  showTitle() {
    this.mode = 'title';
    this.ui.show('title');
    this.hud.el.classList.add('hidden');
    // attract mode: the real game plays itself behind the logo
    this.run.start({ levels: this.levels, upgrades: { flap: 2, slide: 1 }, startIndex: 0 });
    this.run.bot = makeBot('expert', 3);
    this.run.sim.blizzardHold = 1e9;
    this.audio.playMusic('theme');
  }

  titleTapped() {
    this.audio.unlock();
    this.audio.play('ui_tap');
    this.startMainRun();
  }

  goHub(boot = false) {
    this.ui.closeAll();
    this.mode = 'hub';
    this.hud.el.classList.add('hidden');
    this.audio.stopLoops?.();
    this.audio.setFever(false);
    this.audio.playMusic('theme');
    this.village.sync(this.state);
    this.ui.show('hub');
    if (this.pendingHatch) { this.pendingHatch = false; this.later(() => { this.audio.play('hatch'); this.ui.toast(t('vil.eggHatched'), 'egg'); }, 700); }
    requestAnimationFrame(() => this.layoutVillage());
    this.ui.screens.hub.refresh();
    if (!this.autoPopupDone) {
      this.autoPopupDone = true;
      this.later(() => this.autoPopups(boot), 500);
    }
  }

  // at most one automatic popup per hub entry, never during play
  autoPopups(boot) {
    if (this.mode !== 'hub' || this.ui.hasPopup) return;
    // the daily gift opens first; the welcome-back note waits until it is closed
    if (E.featureOn(this.state, 'streak') && D.streakClaimable(this.state)) this.openDaily();
    if (this.welcome) {
      const w = this.welcome; this.welcome = null;
      const parts = [];
      if (w.rack > 0) parts.push(t('welcome.rack', { n: w.rack }));
      if (w.grown > 0) parts.push(t('welcome.grown', { n: w.grown }));
      this.ui.toastWhenFree(t('welcome.back') + (parts.length ? ' ' + parts.join(' · ') : ''), 'village');
    }
  }

  nextIslandBiome() {
    const i = Math.min(this.levels.length - 1, (this.state.bestIsland || 0) + 1);
    return this.levels[i].biome;
  }

  // ---------------------------------------------------------------- runs
  startMainRun() {
    this.audio.unlock();
    if (this.runMode === 'editor' && this.editorLv) { this.startEditorRun(this.editorLv); return; }
    const s = this.state;
    const lighthouse = E.isBuilt(s, 'lighthouse');
    const startIndex = lighthouse ? Math.min(s.startIsland || 0, s.bestIsland, this.levels.length - 1) : 0;
    const startX = this.islandStartX(startIndex);
    const opts = {
      levels: this.levels,
      upgrades: { ...s.upgrades },
      startIndex,
      tutorial: !s.tutorialDone,
      assist: E.assistLevel(s, startIndex),
      modifiers: E.startPushOn(s) ? { startSpeedMul: 3.4 } : {},
      ghost: s.ghost && s.ghostStart === startIndex ? s.ghost : null,
      recordX: s.bestUnits > startX + 200 ? s.bestUnits : null,
    };
    this.beginRun(opts, 'main');
  }

  // level editor "test play": dev build only, never touches the player's save
  editorLevel() {
    if (typeof __DEV__ === 'undefined' || !__DEV__) return null;
    if (!/editorLevel=1/.test(location.search)) return null;
    try { return JSON.parse(localStorage.getItem('ps.editorLevel')); } catch (e) { return null; }
  }

  startEditorRun(lv) {
    this.editorLv = lv;
    this.beginRun({ levels: this.levels, upgrades: (lv.expect && lv.expect.upgrades) || {}, levelOverride: lv }, 'editor');
  }

  startTodayRun() {
    const s = this.state;
    const { level, info } = D.todayLevel(s);
    this.todayInfo = info;
    this.beginRun({ levels: this.levels, upgrades: { ...s.upgrades }, levelOverride: level, modifiers: E.startPushOn(s) ? { startSpeedMul: 3.4 } : {} }, 'today');
    this.analytics.track('today_start', { mod: info.mod, tier: info.tier });
  }

  beginRun(opts, mode) {
    this.ui.closeAll();
    this.runMode = mode;
    this.mode = 'run';
    this.run.bot = null;
    this.run.start(opts);
    this.run.endSent = false;
    this.ui.show('run');
    this.hud.reset();
    this.hud.el.classList.remove('hidden');
    this.hud.update(this.run);
    this.audio.playMusic('run');
    this.runsThisSession++;
    this.analytics.track('run_start', { mode, island: opts.startIndex || 0, run: this.state.runs + 1, ups: JSON.stringify(opts.upgrades), assist: opts.assist || 0, tutorial: !!opts.tutorial });
  }

  islandStartX(index) {
    let x = 0;
    for (let i = 0; i < index && i < this.levels.length; i++) x += this.levels[i].points[this.levels[i].points.length - 1][0] + 1500;
    return x;
  }

  wantsHints() { return this.state.runs < 12; }
  onTutorialDone() { this.state.tutorialDone = true; this.save.write(); }
  markIntro(k) { if (this.state.intros[k]) return false; this.state.intros[k] = 1; return true; }

  // called from the run scene when an island is reached; returns true the first time
  onIslandReach(index) {
    const first = this.runMode === 'main' && !(this.state.islands[index] && this.state.islands[index].reached);
    this.analytics.track('level_reach', { island: index, first });
    this.analytics.track('island_clear', { island: index - 1 });
    return first;
  }

  onRunEnd(res) {
    const s = this.state;
    if (this.runMode === 'editor') {
      res.traveledM = res.distanceUnits / UPM;
      const applied = { newBest: false, newIslands: [], unlocks: [], hatched: [], goals: [], rewards: { lines: [{ key: 'res.fishCollected', v: res.stats.fishValue }], total: res.stats.fishValue } };
      this.mode = 'results';
      this.hud.el.classList.add('hidden');
      this.ui.show('results', { res, applied, tip: this.pickTip(res, applied), mode: 'editor', levelOf: (i) => (i === 0 ? this.editorLv : null) });
      return;
    }
    const startX = res.startIndex > 0 ? this.islandStartX(res.startIndex) : 0;
    res.traveledM = (res.distanceUnits - (this.runMode === 'today' ? 0 : startX)) / UPM;
    res.islandStats = this.run.sim.islandStats;
    let applied;
    if (this.runMode === 'today') {
      applied = E.applyRun(s, { ...res, islandIndex: 0, startIndex: 0 }, this.levels, 'today');
      const td = s.daily.today;
      td.best = Math.max(td.best || 0, res.islandsCleared > 0 ? 1 : res.progress);
      if (res.islandsCleared > 0 && !td.claimed) {
        td.claimed = true; td.cleared = true;
        const r = this.todayInfo.reward;
        s.fish += r; s.earned += r;
        applied.rewards.lines.push({ key: 'today.cleared', v: r });
        applied.rewards.total += r;
        this.analytics.track('today_clear', { mod: this.todayInfo.mod });
        this.analytics.track('currency_earn', { source: 'today', amount: r });
      }
    } else {
      applied = E.applyRun(s, res, this.levels, 'main');
      // keep the trail as next run's ghost (decimated)
      const tr = res.trail;
      const step = Math.max(1, Math.ceil(tr.length / 1500));
      s.ghost = tr.filter((_, i) => i % step === 0);
      s.ghostStart = res.startIndex;
    }
    for (const u of applied.unlocks) this.analytics.track('feature_unlock', { feature: u });
    for (const g of applied.goals) this.analytics.track('goal_complete', { island: g.island, goal: g.goal.type });
    for (const hb of applied.hatched) this.analytics.track('egg_hatched', { id: hb.id });
    if (applied.hatched.length) this.pendingHatch = true;
    this.analytics.track('currency_earn', { source: 'run', amount: applied.rewards.total });
    this.analytics.track('run_end', {
      mode: this.runMode, distance: res.distance, traveled: Math.round(res.traveledM), fish: applied.rewards.total, island: res.islandIndex,
      progress: Math.round(res.progress * 100), cleared: res.islandsCleared, time: Math.round(res.time), perfects: res.stats.perfect,
      bonks: res.stats.bonk, fevers: res.stats.fevers, maxH: Math.round(res.stats.maxHeight / UPM), run: s.runs,
      pressUp: Math.round(100 * res.stats.pressUp / Math.max(0.01, res.stats.pressUp + res.stats.releaseUp)),
      releaseDown: Math.round(100 * res.stats.releaseDown / Math.max(0.01, res.stats.releaseDown + res.stats.pressDown)),
      cause: 'caught', newBest: applied.newBest, fails: s.fails.count,
    });
    const tip = this.pickTip(res, applied);
    if (tip) this.analytics.track('hint_shown', { key: tip, where: 'results' });
    this.save.write();
    this.mode = 'results';
    this.hud.el.classList.add('hidden');
    this.audio.playMusic('theme');
    this.ui.show('results', { res, applied, tip, mode: this.runMode, pointUpgrade: s.runs === 1, levelOf: (i) => (this.runMode === 'today' ? (i === 0 ? { name: { ko: '오늘의 섬', en: 'Island of the Day' } } : null) : this.levels[i] || null) });
    if (applied.newBest || applied.newIslands.length) this.haptics.pulse('medium');
    this.audio.play(applied.newBest ? 'record' : 'results');
  }

  pickTip(res, applied) {
    const st = res.stats;
    const up = st.pressUp / Math.max(0.01, st.pressUp + st.releaseUp);
    const rd = st.releaseDown / Math.max(0.01, st.releaseDown + st.pressDown);
    const s = this.state;
    if (st.groundTime < 2) return null;
    if (up > 0.45) return 'tip.pressUp';
    if (rd > 0.5) return 'tip.releaseDown';
    if (st.bonk >= 3 && st.bonk > st.perfect) return 'tip.bonk';
    if (s.fails.count >= 3 && E.anyUpgradeAffordable(s)) return 'tip.stuck';
    if (st.perfect >= 3 && st.fevers === 0 && s.runs < 15) return 'tip.fever';
    if (up < 0.25 && rd < 0.35 && E.anyUpgradeAffordable(s)) return 'tip.goodRhythm';
    if (s.runs < 8) return 'tip.high';
    return null;
  }

  // ---------------------------------------------------------------- pause
  pauseRun() {
    if (this.mode !== 'run' || this.run.ended) return;
    this.run.paused = true;
    this.run.setPress(false);
    this.audio.setSlide(0, false, false);
    this.ui.open(this.pop.pause);
  }
  resumeRun() { this.ui.close('pause'); }
  onPauseClosed() { if (this.run) { this.run.paused = false; this.pointers.clear(); } }
  restartRun() { this.ui.closeAll(); if (this.runMode === 'today') this.startTodayRun(); else this.startMainRun(); }
  quitRun() { this.ui.closeAll(); this.run.paused = false; this.goHub(); }

  // ---------------------------------------------------------------- meta actions
  openUpgrades() { this.ui.open(this.pop.upgrades); }
  openBuild() { this.ui.open(this.pop.build); }
  openMap() { this.ui.open(this.pop.map); }
  openMissions() { this.ui.open(this.pop.missions); }
  openDaily() { this.ui.open(this.pop.daily); }
  openToday() { this.ui.open(this.pop.today); }
  openSettings() { this.ui.open(this.pop.settings); }

  buyUpgrade(k) {
    const r = E.buyUpgrade(this.state, k);
    if (!r) return null;
    this.audio.play('buy');
    this.haptics.pulse('medium');
    this.ui.toast(t('up.bought', { name: t(`up.${k}.name`), n: r.level }), k);
    this.analytics.track('upgrade_purchase', { key: k, level: r.level, cost: r.cost });
    this.analytics.track('currency_spend', { sink: 'upgrade', item: k, level: r.level, amount: r.cost });
    this.save.write();
    this.ui.screens[this.ui.current]?.refresh?.();
    return r;
  }

  build(id, delay = 0) {
    const r = E.build(this.state, id);
    if (!r) return null;
    this.audio.play('build');
    this.haptics.pulse('medium');
    const b = E.BUILDING[id];
    this.ui.toast(t('vil.built', { name: t(E.buildingKey(b).name) }), 'build');
    this.analytics.track('building_built', { id, cost: r.cost });
    this.analytics.track('currency_spend', { sink: 'building', item: id, amount: r.cost });
    const unlocks = E.checkUnlocks(this.state);
    for (const u of unlocks) this.analytics.track('feature_unlock', { feature: u });
    this.save.write();
    this.village.sync(this.state);
    this.village.celebrate(id, delay);
    this.ui.screens[this.ui.current]?.refresh?.();
    if (unlocks.includes('map')) this.later(() => this.showInfo('unlock.title', t('unlock.map'), 'lighthouse'), 400);
    return r;
  }

  collectRack() {
    const n = E.collectRack(this.state);
    if (n > 0) {
      this.audio.play('gold');
      this.ui.toast('+' + n, 'fish');
      this.analytics.track('currency_earn', { source: 'rack', amount: n });
      this.save.write();
      this.ui.screens.hub.refresh();
    }
    return n;
  }

  claimStreak() {
    const r = D.claimStreak(this.state);
    if (!r) return;
    this.audio.play('record');
    this.haptics.pulse('medium');
    this.ui.toast('+' + r.amount, 'gift');
    this.analytics.track('streak_claim', { day: r.index + 1, streak: this.state.daily.streak });
    this.analytics.track('currency_earn', { source: 'streak', amount: r.amount });
    this.save.write();
    this.ui.screens.hub.refresh();
  }

  claimMission(i) {
    const v = D.claimMission(this.state, i);
    if (!v) return;
    this.audio.play('buy');
    this.ui.toast('+' + v, 'fish');
    this.analytics.track('mission_complete', { type: this.state.daily.missions.list[i].type });
    this.analytics.track('currency_earn', { source: 'mission', amount: v });
    this.save.write();
    this.ui.screens.hub.refresh();
  }

  claimMissionBonus() {
    const v = D.claimMissionBonus(this.state);
    if (!v) return;
    this.audio.play('record');
    this.ui.toast('+' + v, 'gift');
    this.analytics.track('currency_earn', { source: 'mission_bonus', amount: v });
    this.save.write();
    this.ui.screens.hub.refresh();
  }

  villageTap(id) {
    this.audio.play('chirp', { rate: 0.9 + Math.random() * 0.3 });
    if (id === 'rack') { this.collectRack(); return; }
    if (id === 'site') { this.openBuild(); return; }
    const b = E.BUILDING[id];
    if (!b) return;
    const k = E.buildingKey(b);
    this.showInfo(k.name, t(k.desc, k.vars), null);
  }

  showInfo(titleKey, text, ic) {
    this.pop.info.set(titleKey, text, ic);
    this.ui.open(this.pop.info);
  }

  confirmReset() {
    this.pop.confirm.set('set.reset', 'set.resetConfirm', 'set.resetYes', () => {
      this.save.reset();
      this.village.sync(this.state);
      this.dailyCheck(false);
      this.ui.closeAll();
      this.autoPopupDone = false;
      this.showTitle();
    });
    this.ui.open(this.pop.confirm);
  }

  // new day: streak, tasks, babies grow, rack fills (detected at boot and on resume)
  dailyCheck(boot) {
    const s = this.state;
    const before = s.daily.lastDay;
    const grownBefore = s.village.babies.filter((b) => E.babyStage(s, b) !== 'baby').length;
    const evs = D.onNewDayCheck(s);
    const unlocks = E.checkUnlocks(s);
    if (evs.some((e) => e.type === 'newDay') && before) {
      const grown = s.village.babies.filter((b) => E.babyStage(s, b) !== 'baby').length - grownBefore;
      this.welcome = { rack: E.rackAmount(s), grown: Math.max(0, grown) };
      this.autoPopupDone = false;
      if (!boot && this.mode === 'hub') this.later(() => this.autoPopups(false), 300);
    }
    for (const u of unlocks) this.analytics.track('feature_unlock', { feature: u });
    this.save.write();
  }

  // finger overlay for capture mode (trailer): shows when the screen is held
  drawFinger(ctx, down, W, H, time) {
    // lower centre, clear of the side buttons video apps put on the right
    const x = W * 0.5, y = H * 0.875;
    const f = this.fingerFx || (this.fingerFx = { k: 0, last: false, t0: 0 });
    if (down && !f.last) f.t0 = time;
    f.last = down;
    f.k += ((down ? 1 : 0) - f.k) * 0.5;
    ctx.save();
    if (down) {
      const r = ((time - f.t0) * 1.5) % 1;
      ctx.strokeStyle = `rgba(255,201,51,${(0.95 - r * 0.95).toFixed(2)})`;
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(x, y, 16 + r * 34, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = 'rgba(255,201,51,0.55)';
      ctx.strokeStyle = '#1e2350'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(x, y, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    drawSprite(ctx, f.k > 0.5 ? 'hand_down' : 'hand_up', x, y - 12 * (1 - f.k), 0.5, 0, 1, false, 1, 1 - 0.06 * f.k);
    ctx.restore();
  }


}
