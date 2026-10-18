// Feature graphic 1024x500: the real renderer at a landscape size during a real soar on Sunset
// Cliffs (bot input, camera framed for the banner), with the game's own logo styling on top.
// node tools/feature.mjs [lang=ko] -> .cache/stills/<lang>/feature@2x.png (store_compose.py scales it)
import path from 'node:path';
import fs from 'node:fs';
import { launch, Session, ROOT, setupJs } from './capture-lib.mjs';

const lang = process.argv[2] || 'ko';
const DIR = path.join(ROOT, '.cache/stills', lang);
fs.mkdirSync(DIR, { recursive: true });
const ups = { flap: 4, slide: 4, magnet: 2, glide: 2, scarf: 1 };
const browser = await launch();
const s = await new Session(browser, { lang, w: 1024, h: 500, dpr: 2 }).open();
await s.eval(new Function(setupJs({ runs: 20, bestIsland: 4, upgrades: ups }).replace(/app\./g, 'window.__app.')));
await s.eval((u) => {
  const app = window.__app;
  app.beginRun({ levels: app.levels, upgrades: u, startIndex: 4, assist: 0, modifiers: {} }, 'main');
  window.__cap.bot('good', 4);
}, ups);
// a 165 m soar found with the simulator (island 5, seed 4, takeoff ~8.5 s)
await s.skipUntil('sim.time >= 8.8', 20);
await s.eval(() => {
  const app = window.__app;
  app.hud.el.classList.add('hidden');
  app.run.capture = false;
  const c = app.run.cam, p = app.run.sim.p;
  // frame the hills along the bottom and the penguin in the upper third
  const ground = Math.min(app.run.sim.world.heightAt(p.x), app.run.sim.world.heightAt(p.x + 400));
  const z = Math.min(c.z * 1.7, (c.H * 0.52) / Math.max(200, p.y - ground));
  c.override = { x: p.x, z, anchor: 0.64, y: ground + (c.H * 0.06) / z };
  app.run.floaters.clear(); app.run.floaters.add = () => {};
  const st = document.createElement('style');
  st.textContent = `.feat{position:absolute;left:44px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;z-index:50;pointer-events:none}
    .feat .logo-main{font-size:84px;animation:none;transform:rotate(-4deg);transform-origin:left center}
    .feat .logo-sub{margin-top:22px;font-size:24px;animation:none}`;
  document.head.appendChild(st);
  const d = document.createElement('div');
  d.className = 'feat';
  d.innerHTML = `<div class="logo-main"></div><div class="logo-sub"></div>`;
  d.querySelector('.logo-main').textContent = document.querySelector('.title-screen .logo-main')?.textContent || (document.documentElement.lang === 'ko' ? '펭귄 슬라이드' : 'Penguin Slide');
  document.getElementById('app').appendChild(d);
});
await s.eval(() => { const ts = window.__app.ui.screens.title; ts.onShow?.(); document.querySelector('.feat .logo-main').textContent = ts.logo.querySelector('.logo-main').textContent; document.querySelector('.feat .logo-sub').textContent = ts.logo.querySelector('.logo-sub').textContent; });
await s.skip(1 / 30);
await s.shot(path.join(DIR, 'feature@2x.png'));
console.log('feature', s.errors.length ? s.errors : 'ok');
await s.close();
await browser.close();
