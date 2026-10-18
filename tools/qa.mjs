// End-to-end QA as a first-time player on the production build (out/index.html).
// Real taps/holds go through the normal input path; a bot only takes over the steering mid-run
// (like a player getting better: novice -> average -> good). Every screen and popup is checked
// for text overflow / elements outside the viewport, console errors are collected, and
// screenshots are written for review.
// node tools/qa.mjs <w> <h> <lang> <runs> <outDir>
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const [W = 360, H = 640, LANG = 'ko', RUNS = 10, OUT = '/tmp/qa'] = process.argv.slice(2);
const w = +W, h = +H, runs = +RUNS;
fs.mkdirSync(OUT, { recursive: true });
const URL = process.env.QA_URL || 'http://localhost:8766/index.html';
const report = { device: `${w}x${h}`, lang: LANG, steps: [], overflow: [], errors: [], runs: [] };
const log = (s, extra) => { report.steps.push(extra ? { s, ...extra } : { s }); console.log('-', s, extra ? JSON.stringify(extra) : ''); };

const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
async function newPage(storage, dayShift = 0) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: LANG === 'ko' ? 'ko-KR' : 'en-US' });
  if (storage) await ctx.addInitScript((s) => { try { if (!sessionStorage.getItem('qa.loaded')) { localStorage.setItem('ps.save.v1', s); sessionStorage.setItem('qa.loaded', '1'); } } catch (e) {} }, storage);
  if (dayShift) {
    await ctx.addInitScript((ms) => {
      const D = Date, off = ms;
      class FakeDate extends D { constructor(...a) { if (a.length === 0) super(D.now() + off); else super(...a); } static now() { return D.now() + off; } }
      window.Date = FakeDate;
    }, dayShift);
  }
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') report.errors.push(m.text()); });
  page.on('pageerror', (e) => report.errors.push('pageerror: ' + e.message));
  await page.goto(URL);
  await page.waitForFunction(() => window.__app && window.__app.mode && window.__app.mode !== 'boot', null, { timeout: 20000 });
  await page.waitForTimeout(600);
  return { ctx, page };
}

const shot = async (page, name) => page.screenshot({ path: path.join(OUT, name + '.png') });
async function tapEl(page, js, label) {
  const r = await page.evaluate((src) => { const e = new Function('return ' + src)(); if (!e) return null; const b = e.getBoundingClientRect(); return b.width ? [b.x + b.width / 2, b.y + b.height / 2, b.width, b.height] : null; }, js);
  if (!r) { log('missing element: ' + label); return false; }
  await page.touchscreen.tap(r[0], r[1]);
  await page.waitForTimeout(450);
  return r;
}
// text clipping and things sticking out of the screen, for whatever is visible now
async function checkLayout(page, where) {
  const bad = await page.evaluate(() => {
    const out = [];
    const vw = innerWidth, vh = innerHeight;
    for (const e of document.querySelectorAll('#app *')) {
      if (!e.offsetParent && getComputedStyle(e).position !== 'fixed') continue;
      if (e.closest('.hidden') || e.closest('[hidden]')) continue;
      const cs = getComputedStyle(e);
      if (cs.visibility === 'hidden' || +cs.opacity === 0) continue;
      const r = e.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const scrollable = /(auto|scroll)/.test(cs.overflowY + cs.overflowX);
      const inScroller = e.closest('.pop-body, .res-scroll, .build-list');
      if (!inScroller && (r.right > vw + 1 || r.left < -1 || r.bottom > vh + 1) && !e.classList.contains('toast') && !e.closest('.toast')) out.push(['outside', e.className || e.tagName, Math.round(r.left), Math.round(r.right), Math.round(r.bottom)]);
      const hasText = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (hasText && !scrollable && (e.scrollWidth > e.clientWidth + 2 || e.scrollHeight > e.clientHeight + 4) && cs.overflow !== 'visible') out.push(['clipped', e.className || e.tagName, e.textContent.trim().slice(0, 30)]);
    }
    return out.slice(0, 12);
  });
  if (bad.length) report.overflow.push({ where, bad });
  return bad;
}

async function playRun(page, idx, prof) {
  const t0 = Date.now();
  await page.waitForFunction(() => window.__app.mode === 'run', null, { timeout: 15000 }).catch(() => log(`run ${idx}: did not start (mode ${'?'})`));
  // the player's own first touch: hold at the lower middle of the screen, then let go
  await page.mouse.move(w * 0.5, h * 0.78);
  await page.mouse.down();
  await page.waitForTimeout(900);
  await page.mouse.up();
  // from here the steering is a bot of the given skill (input is the same press/release)
  await page.evaluate((p) => { window.__app.run.bot = window.__app.makeBot(p, Math.floor(Math.random() * 1000)); }, prof);
  await page.waitForFunction(() => window.__app.mode === 'results', null, { timeout: 240000, polling: 500 });
  await page.waitForTimeout(2300);
  const r = await page.evaluate(() => { const s = window.__app.state; return { runs: s.runs, fish: s.fish, best: s.bestIsland, ups: s.upgrades, built: Object.keys(s.village.built).length, tut: s.tutorialDone }; });
  r.realSeconds = Math.round((Date.now() - t0) / 1000);
  r.prof = prof;
  // the results buttons must be fully on screen, whatever the card shows
  r.buttons = await page.evaluate(() => [...document.querySelectorAll('.screen:not(.hidden) .res-actions button')].filter((b) => !b.classList.contains('hidden')).map((b) => { const x = b.getBoundingClientRect(); return x.top >= 0 && x.bottom <= innerHeight ? 'ok' : `off(${Math.round(x.top)}-${Math.round(x.bottom)})`; }).join(','));
  r.chips = await page.evaluate(() => document.querySelectorAll('.screen:not(.hidden) .chip').length);
  if (/off/.test(r.buttons)) report.overflow.push({ where: `results run ${idx}`, bad: [r.buttons] });
  report.runs.push(r);
  log(`run ${idx} done`, r);
}

// ------------------------------------------------------------- 1. fresh install
let { ctx, page } = await newPage(null);
log('boot', { mode: await page.evaluate(() => window.__app.mode), lang: await page.evaluate(() => document.documentElement.lang) });
await shot(page, '01_title');
await checkLayout(page, 'title');
// title -> first run with tutorial: tap, then hold
await page.touchscreen.tap(w * 0.5, h * 0.6);
await page.waitForTimeout(700);
await shot(page, '02_tutorial');
const profs = ['novice', 'novice', 'average', 'average', 'average', 'good', 'good', 'good', 'good', 'good', 'good', 'good'];
for (let i = 1; i <= runs; i++) {
  if (i > 1) {
    // results -> again (biggest button)
    const ok = await tapEl(page, "document.querySelector('.screen:not(.hidden) .res-actions .btn-primary') || document.querySelector('.screen:not(.hidden) .res-actions button')", 'again');
    if (!ok) break;
    await page.waitForTimeout(500);
  }
  await playRun(page, i, profs[i - 1] || 'good');
  if (i === 1) { await shot(page, '03_results_first'); await checkLayout(page, 'results first'); }
  // a first-time player taps the glowing upgrade button when they can afford something
  const canUp = await page.evaluate(() => { const b = [...document.querySelectorAll('.screen:not(.hidden) .res-row button')][0]; return !!(b && b.querySelector('.badge:not(.hidden)')); });
  if (canUp) {
    await tapEl(page, "[...document.querySelectorAll('.screen:not(.hidden) .res-row button')][0]", 'results upgrade');
    if (i <= 2) { await shot(page, `04_upgrades_run${i}`); await checkLayout(page, 'upgrades popup'); }
    const bought = await page.evaluate(() => { const a = window.__app; const before = JSON.stringify(a.state.upgrades); const cards = a.pop.upgrades.cards; for (const k of Object.keys(cards)) { const b = cards[k].btn; if (!b.disabled && !b.classList.contains('busy')) { b.click(); break; } } return before !== JSON.stringify(a.state.upgrades); });
    log(`run ${i}: upgrade bought=${bought}`);
    await page.waitForTimeout(400);
    if (!(await tapEl(page, "document.querySelector('.popup:not(.closing) .btn-close')", 'close upgrades'))) await page.evaluate(() => window.__app.ui.closeAll());
  }
  // every few runs, visit the village and build what is affordable
  if (i % 3 === 0) {
    await tapEl(page, "[...document.querySelectorAll('.screen:not(.hidden) .res-row button')][1]", 'results village');
    await page.waitForTimeout(800);
    await shot(page, `05_hub_run${i}`);
    await checkLayout(page, `hub after run ${i}`);
    const built = await page.evaluate(() => { const a = window.__app; const E = a.pop.build; a.openBuild(); const ids = Object.keys(E.rows); for (const id of ids) { const b = E.rows[id].btn; if (b.offsetParent && !b.disabled && !b.classList.contains('busy')) { b.click(); return id; } } a.ui.closeAll(); return null; });
    log(`run ${i}: built ${built}`);
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.__app.ui.closeAll());
    // daily popup may auto-open; close anything open and press play
    await tapEl(page, 'window.__app.ui.screens.hub.playBtn', 'play');
    await page.waitForTimeout(400);
    if (i < runs) {
      // that tap already started the next run; play it here
      i++;
      await playRun(page, i, profs[i - 1] || 'good');
    }
  }
}

// ------------------------------------------------------------- 2. every hub popup
await page.evaluate(() => { window.__app.ui.closeAll(); window.__app.goHub(); });
await page.waitForTimeout(1200);
await page.evaluate(() => window.__app.ui.closeAll());
await shot(page, '06_hub');
await checkLayout(page, 'hub');
const popups = [['upgrades', 'btnUp'], ['build', 'btnBuild'], ['map', 'btnMap'], ['missions', 'btnMis'], ['daily', 'giftBtn'], ['today', 'todayBtn'], ['settings', 'settingsBtn']];
for (const [name, btn] of popups) {
  await page.evaluate(() => window.__app.ui.closeAll());
  await page.waitForTimeout(300);
  // double tap must not open two popups
  const r = await page.evaluate((b) => { const e = window.__app.ui.screens.hub[b]; const x = e.getBoundingClientRect(); return x.width ? [x.x + x.width / 2, x.y + x.height / 2] : null; }, btn);
  if (!r) { log(`popup ${name}: button hidden (feature not unlocked yet)`); continue; }
  await page.touchscreen.tap(r[0], r[1]);
  await page.waitForTimeout(60);
  await page.touchscreen.tap(r[0], r[1]);
  await page.waitForTimeout(600);
  const st = await page.evaluate(() => ({ stack: window.__app.ui.stack.map((p) => p.id), title: document.querySelector('.popup:not(.closing) .pop-title')?.textContent, close: !!document.querySelector('.popup:not(.closing) .btn-close') }));
  log(`popup ${name}`, st);
  await shot(page, `07_popup_${name}`);
  await checkLayout(page, `popup ${name}`);
}
await page.evaluate(() => window.__app.ui.closeAll());

// ------------------------------------------------------------- 3. settings + language switch
await tapEl(page, 'window.__app.ui.screens.hub.settingsBtn', 'settings');
const other = LANG === 'ko' ? 'en' : 'ko';
await tapEl(page, `[...document.querySelectorAll('.popup .seg')[1].children][${other === 'ko' ? 0 : 1}]`, 'lang');
await page.waitForTimeout(500);
await shot(page, '08_settings_switched');
await checkLayout(page, `settings (${other})`);
await tapEl(page, `[...document.querySelectorAll('.popup .toggle')][0]`, 'music toggle');
await tapEl(page, `[...document.querySelectorAll('.popup .seg')[0].children][0]`, 'quality low');
const setState = await page.evaluate(() => ({ lang: document.documentElement.lang, settings: window.__app.state.settings, dpr: window.__app.dpr, q: window.__app.quality }));
log('settings changed', setState);
await page.evaluate(() => window.__app.ui.closeAll());
await page.waitForTimeout(400);
await shot(page, '09_hub_switched');
await checkLayout(page, `hub (${other})`);
for (const [name, btn] of popups.slice(0, 4)) {
  await page.evaluate((b) => { window.__app.ui.closeAll(); const e = window.__app.ui.screens.hub[b]; if (e.offsetParent) e.click(); }, btn);
  await page.waitForTimeout(500);
  await checkLayout(page, `popup ${name} (${other})`);
  await shot(page, `10_popup_${name}_${other}`);
}
await page.evaluate(() => window.__app.ui.closeAll());
// back to the original language and quality
await page.evaluate((l) => { window.__app.setSetting('lang', l); window.__app.setSetting('quality', 'auto'); window.__app.setSetting('music', true); }, LANG);

// ------------------------------------------------------------- 4. relaunch: does everything persist?
const before = await page.evaluate(() => { const s = window.__app.state; return JSON.stringify({ runs: s.runs, fish: s.fish, ups: s.upgrades, built: Object.keys(s.village.built).sort(), best: s.bestIsland, lang: s.settings.lang }); });
await page.reload();
await page.waitForFunction(() => window.__app && window.__app.mode && window.__app.mode !== 'boot');
await page.waitForTimeout(800);
const after = await page.evaluate(() => { const s = window.__app.state; return JSON.stringify({ runs: s.runs, fish: s.fish, ups: s.upgrades, built: Object.keys(s.village.built).sort(), best: s.bestIsland, lang: s.settings.lang }); });
log('reload persistence', { same: before === after, before: JSON.parse(before), after: JSON.parse(after), mode: await page.evaluate(() => window.__app.mode) });
await shot(page, '11_after_reload');
const save = await page.evaluate(() => localStorage.getItem('ps.save.v1'));
await ctx.close();

// ------------------------------------------------------------- 5. next day: relaunch with the clock 26 h ahead
({ ctx, page } = await newPage(save, 26 * 3600 * 1000));
await page.waitForTimeout(1500);
const next = await page.evaluate(() => { const s = window.__app.state; return { mode: window.__app.mode, popups: window.__app.ui.stack.map((p) => p.id), days: s.daily.days, streak: s.daily.streak, rack: window.__app.ui.screens.hub && document.querySelector('.toast:not(.hidden)')?.textContent, missions: s.daily.missions && s.daily.missions.list.map((m) => m.type) }; });
log('next day', next);
await shot(page, '12_next_day');
await checkLayout(page, 'next day');
// a run on day 2 starts without anything blocking it
await page.evaluate(() => window.__app.ui.closeAll());
await tapEl(page, 'window.__app.ui.screens.hub.playBtn', 'play day 2');
await page.waitForTimeout(800);
log('day 2 run started', { mode: await page.evaluate(() => window.__app.mode), popups: await page.evaluate(() => window.__app.ui.stack.length) });
await shot(page, '13_day2_run');
await ctx.close();
await browser.close();
fs.writeFileSync(path.join(OUT, 'qa.json'), JSON.stringify(report, null, 1));
console.log('overflow issues:', report.overflow.length, 'errors:', report.errors.length);
for (const o of report.overflow) console.log('  ', o.where, JSON.stringify(o.bad).slice(0, 300));
for (const e of report.errors.slice(0, 10)) console.log('   err', e);
