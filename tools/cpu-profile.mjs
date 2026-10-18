// CPU profile of a throttled run (top self-time functions). node tools/cpu-profile.mjs [throttle] [quality]
import { chromium } from 'playwright';
const throttle = +(process.argv[2] || 4), quality = process.argv[3] || 'low';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
const now = Date.now();
const save = { v: 1, createdAt: now, updatedAt: now, playerId: 'perf', settings: { music: true, sound: true, vibration: false, quality, saver: false, lang: 'ko' }, fish: 0, runs: 30, tutorialDone: true, bestUnits: 0, bestIsland: 6, islands: { 0: { reached: true }, 6: { reached: true } }, upgrades: { flap: 6, slide: 6, magnet: 4, glide: 4, scarf: 2 }, village: { built: { igloo1: now, lighthouse: now }, eggs: [], babies: [], rackAt: now }, unlocked: {}, intros: {}, daily: { days: 1 }, fails: { island: -1, count: 0 }, startIsland: 6, stats: {}, dayOffset: 0, firstOpenSent: true };
await ctx.addInitScript((s) => localStorage.setItem('ps.save.v1', s), JSON.stringify(save));
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await page.goto('http://127.0.0.1:8766/dev/index.html');
await page.waitForTimeout(1500);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle });
await page.evaluate(() => { window.__app.startMainRun(); window.__app.run.bot = window.__app.makeBot('expert', 5); window.__app.run.sim.scarfCharges = 99; });
await cdp.send('Profiler.enable');
await cdp.send('Profiler.setSamplingInterval', { interval: 500 });
await cdp.send('Profiler.start');
await page.waitForTimeout(10000);
const { profile } = await cdp.send('Profiler.stop');
const self = {};
const dt = profile.timeDeltas;
const byId = new Map(profile.nodes.map((n) => [n.id, n]));
const counts = {};
for (const s of profile.samples) counts[s] = (counts[s] || 0) + 1;
let total = 0;
for (const [id, c] of Object.entries(counts)) {
  const n = byId.get(+id);
  const key = `${n.callFrame.functionName || '(anon)'} ${n.callFrame.url.split('/').pop()}:${n.callFrame.lineNumber}`;
  self[key] = (self[key] || 0) + c; total += c;
}
const top = Object.entries(self).sort((a, b) => b[1] - a[1]).slice(0, 25);
for (const [k, v] of top) console.log((100 * v / total).toFixed(1).padStart(5) + '%', k);
await browser.close();
