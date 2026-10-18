// WebAudio manager: sound effects with pitch/volume variation, voice limits, continuous loops that
// follow the action (belly slide, blizzard wind), and layered music (run theme + Snow Rush layer).
// Assets come from assets/audio-*.js packs (base64 MP3, so file:// works too).
// The context is suspended when the app is hidden and resumed on return (and on the next touch,
// for browsers that need a gesture), so sound always comes back after leaving the app.

const LIMIT = { fish: 4, gold: 2, perfect: 2, land: 2, takeoff: 2, ui: 3, height: 2 };

export class Audio {
  constructor() {
    this.ctx = null;
    this.buffers = {};
    this.raw = {};
    this.musicOn = true;
    this.sfxOn = true;
    this.voices = {};
    this.loops = {};
    this.music = { name: null, src: null, gain: null, layer: null, layerGain: null, want: null };
    this.fever = false;
    this.unlocked = false;
    this.pendingDecode = [];
  }

  // called on the first user gesture
  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try { this.ctx = new AC({ latencyHint: 'interactive' }); } catch (e) { this.ctx = new AC(); }
      const c = this.ctx;
      this.master = c.createGain(); this.master.gain.value = 0.9;
      // gentle bus compression keeps stacked effects from clipping
      this.comp = c.createDynamicsCompressor();
      this.comp.threshold.value = -14; this.comp.knee.value = 12; this.comp.ratio.value = 3; this.comp.attack.value = 0.004; this.comp.release.value = 0.2;
      this.master.connect(this.comp); this.comp.connect(c.destination);
      this.sfxBus = c.createGain(); this.sfxBus.gain.value = this.sfxOn ? 1 : 0; this.sfxBus.connect(this.master);
      this.musicBus = c.createGain(); this.musicBus.gain.value = this.musicOn ? 0.55 : 0; this.musicBus.connect(this.master);
      this.decodeAll();
    }
    if (this.ctx.state !== 'running') this.ctx.resume().catch(() => {});
    this.unlocked = true;
  }

  addPack(pack) {
    for (const [k, b64] of Object.entries(pack)) this.raw[k] = b64;
    if (this.ctx) this.decodeAll();
  }

  decodeAll() {
    for (const [k, b64] of Object.entries(this.raw)) {
      if (this.buffers[k] || this.buffers[k] === null) continue;
      this.buffers[k] = null; // decoding
      const bin = atob(b64);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      this.ctx.decodeAudioData(arr.buffer, (buf) => {
        this.buffers[k] = buf;
        if (this.music.want && (k === 'music_' + this.music.want || k === 'music_' + this.music.want + '_layer')) this.playMusic(this.music.want, true);
        if (k === 'loop_slide' || k === 'loop_wind') this.ensureLoop(k);
      }, () => { this.buffers[k] = undefined; });
    }
  }

  setMusic(on) {
    this.musicOn = on;
    if (this.musicBus) this.musicBus.gain.setTargetAtTime(on ? 0.55 : 0, this.ctx.currentTime, 0.1);
  }

  setSfx(on) {
    this.sfxOn = on;
    if (this.sfxBus) this.sfxBus.gain.setTargetAtTime(on ? 1 : 0, this.ctx.currentTime, 0.05);
  }

  suspend() { if (this.ctx && this.ctx.state === 'running') this.ctx.suspend().catch(() => {}); }
  resume() { if (this.ctx && this.ctx.state !== 'running') this.ctx.resume().catch(() => {}); }

  play(name, { rate = 1, volume = 1, detune = 0 } = {}) {
    if (!this.ctx || !this.sfxOn) return;
    const buf = this.buffers[name];
    if (!buf) return;
    const lim = LIMIT[name] || 3;
    const vs = this.voices[name] || (this.voices[name] = []);
    const t = this.ctx.currentTime;
    while (vs.length && vs[0].end < t) vs.shift();
    if (vs.length >= lim) { try { vs[0].src.stop(); } catch (e) { /* already stopped */ } vs.shift(); }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = rate * (1 + (Math.random() - 0.5) * 0.03);
    if (detune) src.detune.value = detune;
    const g = this.ctx.createGain();
    g.gain.value = volume;
    src.connect(g); g.connect(this.sfxBus);
    src.start();
    vs.push({ src, end: t + buf.duration / rate });
  }

  ensureLoop(name) {
    if (!this.ctx || this.loops[name] || !this.buffers[name]) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.buffers[name];
    src.loop = true;
    const g = this.ctx.createGain(); g.gain.value = 0;
    const f = this.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1200;
    src.connect(f); f.connect(g); g.connect(this.sfxBus);
    src.start();
    this.loops[name] = { src, g, f };
  }

  setSlide(level, pressing, ice) {
    const L = this.loops.loop_slide;
    if (!L) { this.ensureLoop('loop_slide'); return; }
    const t = this.ctx.currentTime;
    L.g.gain.setTargetAtTime(level * (pressing ? 0.55 : 0.28), t, 0.05);
    L.src.playbackRate.setTargetAtTime(0.75 + level * 0.6 + (ice ? 0.25 : 0), t, 0.08);
    L.f.frequency.setTargetAtTime(500 + level * 2600 + (ice ? 1500 : 0), t, 0.08);
  }

  setWind(level) {
    const L = this.loops.loop_wind;
    if (!L) { this.ensureLoop('loop_wind'); return; }
    const t = this.ctx.currentTime;
    L.g.gain.setTargetAtTime(level * 0.45, t, 0.3);
    L.f.frequency.setTargetAtTime(300 + level * 1600, t, 0.3);
  }

  stopLoops() {
    for (const L of Object.values(this.loops)) L.g.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
  }

  // music: 'theme' (village/title) or 'run'. The run track has a Snow Rush layer kept in sync.
  playMusic(name, force = false) {
    this.music.want = name;
    if (!this.ctx) return;
    if (this.music.name === name && !force) return;
    const buf = this.buffers['music_' + name];
    if (!buf) return;
    const t = this.ctx.currentTime;
    // fade out the old track
    if (this.music.src) {
      const old = this.music;
      old.gain.gain.setTargetAtTime(0, t, 0.35);
      if (old.layerGain) old.layerGain.gain.setTargetAtTime(0, t, 0.35);
      setTimeout(() => { try { old.src.stop(); if (old.layer) old.layer.stop(); } catch (e) { /* noop */ } }, 1800);
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const loopInfo = this.loopPoints[name];
    if (loopInfo) { src.loopStart = loopInfo[0]; src.loopEnd = loopInfo[1]; }
    const gain = this.ctx.createGain(); gain.gain.value = 0;
    src.connect(gain); gain.connect(this.musicBus);
    const start = t + 0.05;
    src.start(start);
    gain.gain.setTargetAtTime(1, start, 0.4);
    const m = { name, src, gain, layer: null, layerGain: null, want: name };
    const lb = this.buffers['music_' + name + '_layer'];
    if (lb) {
      const ls = this.ctx.createBufferSource();
      ls.buffer = lb; ls.loop = true;
      if (loopInfo) { ls.loopStart = loopInfo[0]; ls.loopEnd = loopInfo[1]; }
      const lg = this.ctx.createGain(); lg.gain.value = 0;
      ls.connect(lg); lg.connect(this.musicBus);
      ls.start(start);
      m.layer = ls; m.layerGain = lg;
    }
    this.music = m;
    this.setFever(this.fever);
  }

  setFever(on) {
    this.fever = on;
    if (this.music.layerGain) this.music.layerGain.gain.setTargetAtTime(on ? 0.9 : 0, this.ctx.currentTime, on ? 0.15 : 0.6);
  }

  duckMusic(amount, time = 0.8) {
    if (!this.music.gain) return;
    const t = this.ctx.currentTime;
    this.music.gain.gain.setTargetAtTime(1 - amount, t, 0.05);
    this.music.gain.gain.setTargetAtTime(1, t + time, 0.4);
  }
}

Audio.prototype.loopPoints = {};
