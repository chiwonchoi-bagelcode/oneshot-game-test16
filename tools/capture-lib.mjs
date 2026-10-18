// Frame-by-frame capture of the real game (dev build) for the trailer and store screenshots.
// The page's own loop is paused (window.__cap.start) and every frame is advanced explicitly,
// so the footage is smooth regardless of how slow the headless renderer is, and every sound
// the game plays is logged with its game time for the offline audio mix.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BASE = process.env.CAP_URL || 'http://localhost:8766/dev/index.html';

export async function launch() {
  return chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required', '--disable-gpu-vsync'] });
}

export class Session {
  constructor(browser, { lang = 'ko', save = null, w = 360, h = 640, dpr = 3, query = 'nodebug=1' } = {}) {
    Object.assign(this, { browser, lang, save, w, h, dpr, query });
    this.frames = []; // per recorded frame: game time at that frame
  }

  async open() {
    this.ctx = await this.browser.newContext({ viewport: { width: this.w, height: this.h }, deviceScaleFactor: this.dpr, isMobile: true, hasTouch: true, locale: this.lang === 'ko' ? 'ko-KR' : 'en-US' });
    const save = this.save;
    const lang = this.lang;
    await this.ctx.addInitScript(([sv, lg]) => {
      try {
        if (sv) localStorage.setItem('ps.save.v1', JSON.stringify(sv));
        else localStorage.setItem('ps.save.v1', JSON.stringify({ settings: { music: true, sound: true, vibration: true, quality: 'high', saver: false, lang: lg } }));
      } catch (e) { /* ignore */ }
    }, [save, lang]);
    this.page = await this.ctx.newPage();
    this.errors = [];
    this.page.on('pageerror', (e) => this.errors.push(e.message));
    this.page.on('console', (m) => { if (m.type() === 'error') this.errors.push(m.text()); });
    await this.page.goto(BASE + '?' + this.query);
    await this.page.waitForFunction(() => window.__cap && window.__app && window.__app.run, null, { timeout: 20000 });
    await this.page.waitForTimeout(400);
    await this.page.evaluate(() => window.__cap.start());
    return this;
  }

  eval(fn, arg) { return this.page.evaluate(fn, arg); }

  // advance without recording (fast-forward)
  async skip(seconds, dt = 1 / 30) {
    const n = Math.round(seconds / dt);
    await this.page.evaluate(([d, k]) => window.__cap.step(d, k), [dt, n]);
  }

  async skipUntil(cond, maxSeconds = 120, dt = 1 / 30) {
    const ok = await this.page.evaluate(([src, d, max]) => {
      const f = new Function('app', 'sim', 'return (' + src + ')');
      for (let i = 0; i < max / d; i++) {
        const app = window.__app;
        if (f(app, app.run && app.run.sim)) return true;
        window.__cap.step(d, 1);
      }
      return false;
    }, [cond, dt, maxSeconds]);
    if (!ok) console.warn('skipUntil timed out:', cond);
    return ok;
  }

  // record n frames; perFrame(i) may return js to run before the step (camera moves, input)
  // stills mode (this.stills = { at: Set of frame indexes, dir }): only those frames are saved, as PNG
  async record(dir, n, { dt = 1 / 30, perFrame = null, jpeg = true, startIndex = null } = {}) {
    if (!this.stills) fs.mkdirSync(dir, { recursive: true });
    let idx = startIndex ?? this.frames.length;
    for (let i = 0; i < n; i++) {
      const js = perFrame ? perFrame(i) : null;
      const t = await this.page.evaluate(([src, d]) => {
        if (src) new Function('app', 'sim', src)(window.__app, window.__app.run && window.__app.run.sim);
        window.__cap.step(d, 1);
        return window.__cap.t;
      }, [js, typeof dt === 'function' ? dt(i) : dt]);
      if (this.stills) {
        if (this.stills.at.has(idx)) await this.page.screenshot({ path: path.join(this.stills.dir, `${this.stills.name}_${idx}.png`) });
      } else {
        const file = path.join(dir, String(idx).padStart(5, '0') + (jpeg ? '.jpg' : '.png'));
        await this.page.screenshot(jpeg ? { path: file, type: 'jpeg', quality: 94 } : { path: file });
      }
      this.frames.push(t);
      idx++;
    }
  }

  async shot(file) { await this.page.screenshot({ path: file }); }

  async log() { return this.page.evaluate(() => ({ log: window.__cap.log, loops: window.__cap.loops, t: window.__cap.t })); }

  async close() { await this.ctx.close(); }
}

// a realistic mid-game save built from the economy rules (same functions the game uses)
export function setupJs({ upgrades = {}, bestIsland = 0, fish = 0, runs = 8, build = [], hatch = 0, tutorialDone = true, startIsland = 0 }) {
  return `
    const s = app.state, E = window.__cap.E;
    s.tutorialDone = ${tutorialDone};
    s.runs = ${runs};
    s.upgrades = Object.assign(s.upgrades, ${JSON.stringify(upgrades)});
    s.bestIsland = ${bestIsland};
    for (let i = 0; i <= ${bestIsland}; i++) s.islands[i] = Object.assign(s.islands[i] || { goals: {} }, { reached: true, cleared: i < ${bestIsland}, best: 1 });
    for (const id of ${JSON.stringify(build)}) { if (!E.isBuilt(s, id)) { s.fish += 100000; E.build(s, id); s.fish -= 100000; } }
    for (let k = 0; k < ${hatch}; k++) { s.runs++; E.hatchEggs(s); }
    s.startIsland = ${startIsland};
    s.fish = ${fish};
    E.checkUnlocks(s);
    for (const k of Object.keys(s.unlocked)) s.unlockSeen[k] = 1;
    s.intros = Object.assign(s.intros, { blizzard: 1, ice: 1, wind: 1, geyser: 1, ring: 1, cloud: 1, ramp: 1, fever: 1 });
    app.save.write();
    app.village.sync(s);
  `;
}
