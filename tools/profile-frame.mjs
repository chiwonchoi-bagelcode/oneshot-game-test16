import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const now = Date.now();
const save = { v: 1, createdAt: now, updatedAt: now, playerId: 'perf', settings: { music: false, sound: false, vibration: false, quality: process.argv[2] || 'mid', saver: false, lang: 'ko' }, fish: 0, runs: 30, tutorialDone: true, bestUnits: 0, bestIsland: 6, islands: { 0: { reached: true }, 6: { reached: true } }, upgrades: { flap: 6, slide: 6, magnet: 4, glide: 4, scarf: 2 }, village: { built: { igloo1: now, lighthouse: now }, eggs: [], babies: [], rackAt: now }, unlocked: {}, intros: {}, daily: { days: 1 }, fails: { island: -1, count: 0 }, startIsland: 6, stats: {}, dayOffset: 0, firstOpenSent: true };
await ctx.addInitScript((s) => localStorage.setItem('ps.save.v1', s), JSON.stringify(save));
const page = await ctx.newPage();
await page.goto('http://127.0.0.1:8766/dev/index.html');
await page.waitForTimeout(1500);
const r = await page.evaluate(() => new Promise((res) => {
  const app = window.__app; app.startMainRun(); app.run.bot = app.makeBot('expert', 5); app.run.sim.scarfCharges = 99;
  const run = app.run, wr = run.wr, br = run.br, pr = run.pr;
  const acc = {};
  const wrap = (obj, name, label) => { const f = obj[name].bind(obj); obj[name] = (...a) => { const t = performance.now(); const v = f(...a); acc[label] = (acc[label] || 0) + performance.now() - t; return v; }; };
  wrap(run, 'update', 'update'); wrap(wr, 'drawBackground', 'bg'); wrap(wr, 'drawTerrain', 'terrain'); wrap(wr, 'drawDecor', 'decor'); wrap(wr, 'drawFish', 'fish'); wrap(wr, 'clouds', 'clouds'); wrap(wr, 'drawWind', 'wind');
  wrap(br, 'render', 'blizzard'); wrap(pr, 'render', 'penguin'); wrap(run.parts, 'render', 'particles'); wrap(run.floaters, 'render', 'floaters'); wrap(run, 'render', 'renderTotal');
  let n = 0; const t0 = performance.now();
  function f() { n++; if (n < 400) requestAnimationFrame(f); else { const el = performance.now() - t0; const o = {}; for (const k in acc) o[k] = +(acc[k] / n).toFixed(2); o.frameAvg = +(el / n).toFixed(2); res(o); } }
  requestAnimationFrame(f);
}));
console.log(JSON.stringify(r));
await browser.close();
