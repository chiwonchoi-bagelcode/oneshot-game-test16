// Captures every trailer shot from the real game (dev build, frame-stepped).
// node tools/trailer.mjs [lang=ko] [shot names...]
// Output: .cache/trailer/<lang>/<shot>/00000.jpg… + meta.json (game time per frame, sound log).
// Run moments were chosen with the simulator (same RunSim + bot as the game): the bots play
// with the same press/release input a player has; nothing is animated by hand except the
// camera in the one marked "cinematic" shot.
import fs from 'node:fs';
import path from 'node:path';
import { launch, Session, ROOT } from './capture-lib.mjs';
import { SHOTS, FPS } from './shots.mjs';

const lang = process.argv[2] || 'ko';
const only = process.argv.slice(3);
const OUT = path.join(ROOT, '.cache/trailer', lang);

const browser = await launch();
fs.mkdirSync(OUT, { recursive: true });
for (const [name, fn] of Object.entries(SHOTS)) {
  if (only.length && !only.includes(name)) continue;
  const dir = path.join(OUT, name);
  fs.rmSync(dir, { recursive: true, force: true });
  const t = Date.now();
  const s = await new Session(browser, { lang }).open();
  await fn(s, dir);
  const L = await s.log();
  fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify({ fps: FPS, frames: s.frames, py: s.py, log: L.log, loops: L.loops }));
  console.log(name.padEnd(10), s.frames.length, 'frames', ((Date.now() - t) / 1000).toFixed(0) + 's', s.errors.length ? s.errors : '');
  await s.close();
}
await browser.close();
