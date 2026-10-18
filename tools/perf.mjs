// Frame-time test with CPU throttling (approximates a low-end Android phone).
// node tools/perf.mjs [throttle=4] [quality=auto] [seconds=20]
import { chromium } from 'playwright';
const throttle = +(process.argv[2] || 4), quality = process.argv[3] || 'auto', secs = +(process.argv[4] || 20);
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
const now = Date.now();
const save = { v: 1, createdAt: now, updatedAt: now, playerId: 'perf', settings: { music: true, sound: true, vibration: false, quality, saver: false, lang: 'ko' }, fish: 0, earned: 0, spent: 0, runs: 30, tutorialDone: true, bestUnits: 0, bestIsland: 6, islands: { 0: { reached: true }, 6: { reached: true } }, upgrades: { flap: 6, slide: 6, magnet: 4, glide: 4, scarf: 2 }, village: { built: { igloo1: now, lighthouse: now }, eggs: [], babies: [], rackAt: now }, unlocked: {}, unlockSeen: {}, intros: {}, daily: { days: 1 }, fails: { island: -1, count: 0 }, startIsland: 6, stats: {}, dayOffset: 0, firstOpenSent: true };
await ctx.addInitScript((s) => localStorage.setItem('ps.save.v1', s), JSON.stringify(save));
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await page.goto('http://127.0.0.1:8766/dev/index.html');
await page.waitForTimeout(1500);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle });
await page.evaluate(() => { window.__app.startMainRun(); window.__app.run.bot = window.__app.makeBot('expert', 5); window.__app.run.sim.scarfCharges = 99; });
const res = await page.evaluate((secs) => new Promise((r) => {
  const times = []; let last = performance.now();
  const t0 = last;
  function f(t) { times.push(t - last); last = t; if (t - t0 < secs * 1000) requestAnimationFrame(f); else r(times); }
  requestAnimationFrame(f);
}), secs);
const q = await page.evaluate(() => ({ quality: window.__app.quality, dpr: window.__app.dpr, parts: window.__app.run.parts.count }));
const sorted = res.slice().sort((a, b) => a - b);
const avg = res.reduce((a, b) => a + b, 0) / res.length;
const pct = (p) => sorted[Math.floor(sorted.length * p)];
const long = res.filter((t) => t > 33.4).length;
console.log(`throttle x${throttle} quality=${quality} -> frames ${res.length} avg ${avg.toFixed(1)}ms (${(1000 / avg).toFixed(0)} fps) p50 ${pct(0.5).toFixed(1)} p95 ${pct(0.95).toFixed(1)} p99 ${pct(0.99).toFixed(1)} >33ms: ${long} | final q${q.quality} dpr ${q.dpr}`);
await browser.close();
