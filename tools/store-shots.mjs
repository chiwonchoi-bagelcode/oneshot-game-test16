// Store screenshots: lossless stills of real game frames (same shots as the trailer) plus two
// meta screens, then tools/store_compose.py adds the caption band.
// node tools/store-shots.mjs [lang=ko] [names...]  -> .cache/stills/<lang>/*.png
import fs from 'node:fs';
import path from 'node:path';
import { launch, Session, ROOT, setupJs } from './capture-lib.mjs';
import { SHOTS } from './shots.mjs';

const lang = process.argv[2] || 'ko';
const DIR = path.join(ROOT, '.cache/stills', lang);
fs.mkdirSync(DIR, { recursive: true });

// [output name, shot, frame index in that shot]
export const STILLS = [
  ['01_soar', 'hook', 52],
  ['02_rush', 'fever', 84],
  ['03_blizzard', 'escape', 22],
  ['04_village', 'village', 80],
  ['05_upgrade', 'upgrade', 50],
  ['06_rings', 'm_rings', 14],
  ['07_sunset', 'm_sunset', 30],
];

const browser = await launch();
const only = process.argv.slice(3);
for (const [out, shot, frame] of STILLS) {
  if (only.length && !only.includes(out)) continue;
  const s = new Session(browser, { lang });
  s.stills = { at: new Set([frame]), dir: DIR, name: out };
  await s.open();
  await SHOTS[shot](s, DIR);
  const src = path.join(DIR, `${out}_${frame}.png`);
  fs.renameSync(src, path.join(DIR, out + '.png'));
  console.log(out, s.errors.length ? s.errors : 'ok');
  await s.close();
}
// island map: the journey across nine islands
if (!only.length || only.includes('08_map')) {
  const s = await new Session(browser, { lang }).open();
  await s.eval(new Function(setupJs({ runs: 30, bestIsland: 6, fish: 900, upgrades: { flap: 6, slide: 5, magnet: 4, glide: 4, scarf: 2 }, build: ['igloo1', 'fishrack', 'igloo2', 'workshop', 'lighthouse', 'igloo3', 'tent', 'pine'], hatch: 10 }).replace(/app\./g, 'window.__app.')));
  await s.eval(() => { const st = window.__app.state; for (let i = 0; i < 6; i++) st.islands[i].goals = { 0: 1, 1: 1 }; window.__app.goHub(); });
  await s.skip(1);
  await s.eval(() => window.__app.openMap ? window.__app.openMap() : window.__app.ui.open(window.__app.pop.map));
  await s.skip(0.8);
  await s.shot(path.join(DIR, '08_map.png'));
  console.log('08_map', s.errors.length ? s.errors : 'ok');
  await s.close();
}
await browser.close();
