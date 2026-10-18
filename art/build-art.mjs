// Renders every sprite to PNG (art/out/png/<sheet>/<name>.png) and writes a manifest that
// tools/pack_atlas.py turns into atlases. Run: node art/build-art.mjs
import fs from 'node:fs';
import path from 'node:path';
import { renderSVGs } from './render.mjs';
import { penguinSVG, penguinFrames, villagerFrames } from './penguin.mjs';
import * as SP from './sprites.mjs';
import { ICONS } from './icons.mjs';
import { BIOMES, farStripSVG, midStripSVG, farIslandSVG, snowTextureSVG, auroraSVG, sunSVG } from './backgrounds.mjs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const outRoot = path.join(root, 'art/out/png');
const only = process.argv[2] || null;

const sheets = {
  chars: [],   // penguins, blizzard
  world: [],   // fish, objects, fx
  village: [], // buildings
  ui: [],      // icons
  bg: [],      // separate images (not packed)
};
const manifest = {};

function add(sheet, name, svg, w, h, opts = {}) {
  sheets[sheet].push({ name, svg, w, h });
  manifest[name] = { sheet, w, h, scale: opts.scale ?? 1, pivot: opts.pivot ?? [0.5, 0.5] };
  if (opts.anchor) manifest[name].anchor = [opts.anchor[0] / w, opts.anchor[1] / h];
}

// penguins
for (const [n, pose] of Object.entries(penguinFrames())) { const svgS = penguinSVG(pose); add('chars', 'p_' + n, svgS, 384, 384, { pivot: [pose.pivot[0] / 384, pose.pivot[1] / 384], anchor: penguinSVG.lastAnchor }); }
for (const [n, pose] of Object.entries(villagerFrames())) add('chars', 'v_' + n, penguinSVG({ ...pose, pivot: pose.pivot }), 384, 384, { scale: 0.5, pivot: [pose.pivot[0] / 384, pose.pivot[1] / 384] });
// hero (large) frames for title/results
add('chars', 'hero_cheer', penguinSVG({ ...penguinFrames().cheer_0 }, 384), 384, 384, { scale: 1, pivot: [0.5, 300 / 384] });
// blizzard spirit
for (const [mood, ph] of [['blow', 0], ['blow', 0.7], ['grin', 0.2], ['laugh', 0.4], ['sulk', 0.1]]) {
  add('chars', `bz_${mood}${mood === 'blow' ? (ph > 0.5 ? 1 : 0) : ''}`, SP.blizzardSVG(mood, ph), 512, 512, { scale: 0.8, pivot: [230 / 512, 270 / 512] });
}
for (let i = 0; i < 2; i++) add('chars', `snowball_${i}`, SP.snowballSVG(i), 320, 320, { scale: 0.7, pivot: [0.5, 288 / 320] });
add('world', 'hand_up', SP.handSVG(false), 192, 256, { scale: 0.6, pivot: [96 / 192, 18 / 256] });
add('world', 'hand_down', SP.handSVG(true), 192, 256, { scale: 0.6, pivot: [96 / 192, 28 / 256] });
// fish
add('world', 'fish_0', SP.fishSVG(false, 0), 128, 96, { scale: 0.75 });
add('world', 'fish_1', SP.fishSVG(false, 1), 128, 96, { scale: 0.75 });
add('world', 'gold_0', SP.fishSVG(true, 0), 128, 96, { scale: 0.9 });
add('world', 'gold_1', SP.fishSVG(true, 1), 128, 96, { scale: 0.9 });
// world objects (pivot at the base)
for (let v = 0; v < 3; v++) add('world', `pine_${v}`, SP.pineSVG(v), 256, 384, { scale: 0.6, pivot: [0.5, 365 / 384] });
for (let v = 0; v < 3; v++) add('world', `rock_${v}`, SP.rockSVG(v), 256, 192, { scale: 0.6, pivot: [0.5, 170 / 192] });
add('world', 'crystal_0', SP.crystalSVG(0), 256, 256, { scale: 0.6, pivot: [0.5, 240 / 256] });
add('world', 'crystal_1', SP.crystalSVG(1), 256, 256, { scale: 0.6, pivot: [0.5, 240 / 256] });
add('world', 'crystal_2', SP.crystalSVG(0, 'aurora'), 256, 256, { scale: 0.6, pivot: [0.5, 240 / 256] });
add('world', 'crystal_3', SP.crystalSVG(1, 'star'), 256, 256, { scale: 0.6, pivot: [0.5, 240 / 256] });
add('world', 'snowman', SP.snowmanSVG(), 256, 320, { scale: 0.6, pivot: [0.5, 300 / 320] });
add('world', 'spire_0', SP.spireSVG(0), 256, 448, { scale: 0.6, pivot: [0.5, 440 / 448] });
add('world', 'spire_1', SP.spireSVG(1), 256, 448, { scale: 0.6, pivot: [0.5, 440 / 448] });
add('world', 'balloon', SP.balloonSVG(), 256, 384, { scale: 0.6 });
add('world', 'star', SP.starDecoSVG(), 192, 192, { scale: 0.6 });
add('world', 'sign', SP.signSVG(), 320, 320, { scale: 0.7, pivot: [0.5, 305 / 320] });
add('world', 'flag_record', SP.flagSVG('record'), 192, 320, { scale: 0.6, pivot: [47 / 192, 306 / 320] });
add('world', 'flag_ghost', SP.flagSVG('ghost'), 192, 320, { scale: 0.6, pivot: [47 / 192, 306 / 320] });
add('world', 'ramp', SP.rampSVG(), 192, 128, { scale: 0.6 });
add('world', 'geyser_vent', SP.geyserVentSVG(), 256, 128, { scale: 0.6, pivot: [0.5, 100 / 128] });
for (let i = 0; i < 4; i++) add('world', `plume_${i}`, SP.plumeSVG(i), 256, 512, { scale: 0.5, pivot: [0.5, 500 / 512] });
for (let i = 0; i < 4; i++) add('world', `wind_${i}`, SP.windSVG(i), 192, 384, { scale: 0.5 });
add('world', 'ring_back', SP.ringSVG('back'), 256, 320, { scale: 0.6 });
add('world', 'ring_front', SP.ringSVG('front'), 256, 320, { scale: 0.6 });
for (let v = 0; v < 3; v++) add('world', `cloud_${v}`, SP.cloudSVG(v), 384, 192, { scale: 0.6 });
// effects
for (let i = 0; i < 4; i++) add('world', `puff_${i}`, SP.puffSVG(i), 192, 192, { scale: 0.5 });
add('world', 'sparkle', SP.sparkleSVG('#ffffff'), 96, 96, { scale: 0.6 });
add('world', 'sparkle_gold', SP.sparkleSVG('#ffe27a'), 96, 96, { scale: 0.6 });
add('world', 'sparkle_blue', SP.sparkleSVG('#9fe6ff'), 96, 96, { scale: 0.6 });
add('world', 'burst', SP.burstSVG(), 256, 256, { scale: 0.6 });
add('world', 'ringwave', SP.ringWaveSVG(), 256, 256, { scale: 0.6 });
add('world', 'flake', SP.flakeSVG(), 96, 96, { scale: 0.6 });
add('world', 'dizzy', SP.dizzySVG(), 96, 96, { scale: 0.6 });
add('world', 'speedline', SP.speedLineSVG(), 256, 32, { scale: 0.6 });
add('world', 'heart', SP.heartSVG(), 96, 96, { scale: 0.6 });
add('world', 'note', SP.noteSVG(), 96, 96, { scale: 0.6 });
// village buildings
add('village', 'igloo_0', SP.iglooSVG(0), 384, 320, { scale: 0.7, pivot: [0.5, 292 / 320] });
add('village', 'igloo_1', SP.iglooSVG(1), 384, 320, { scale: 0.7, pivot: [0.5, 292 / 320] });
add('village', 'igloo_2', SP.iglooSVG(2), 384, 320, { scale: 0.7, pivot: [0.5, 292 / 320] });
add('village', 'fishrack', SP.fishRackSVG(), 384, 320, { scale: 0.7, pivot: [0.5, 300 / 320] });
add('village', 'lighthouse', SP.lighthouseSVG(), 256, 512, { scale: 0.7, pivot: [0.5, 484 / 512] });
add('village', 'workshop', SP.workshopSVG(), 384, 320, { scale: 0.7, pivot: [0.5, 294 / 320] });
add('village', 'hotspring', SP.hotSpringSVG(), 384, 256, { scale: 0.7, pivot: [0.5, 0.8] });
add('village', 'statue', SP.statueSVG(), 256, 384, { scale: 0.7, pivot: [0.5, 360 / 384] });
add('village', 'stage', SP.stageSVG(), 448, 320, { scale: 0.7, pivot: [0.5, 300 / 320] });
add('village', 'nest_1', SP.nestSVG(1), 256, 192, { scale: 0.6, pivot: [0.5, 0.9] });
add('village', 'nest_crack', SP.nestSVG(1, true), 256, 192, { scale: 0.6, pivot: [0.5, 0.9] });
add('village', 'site', SP.siteSVG(), 384, 320, { scale: 0.7, pivot: [0.5, 298 / 320] });
add('village', 'kite', SP.kiteSVG(), 256, 384, { scale: 0.6 });
add('village', 'fence', SP.fenceSVG(), 256, 128, { scale: 0.6, pivot: [0.5, 120 / 128] });
add('village', 'lamp', SP.lampSVG(), 128, 320, { scale: 0.6, pivot: [0.5, 310 / 320] });
add('village', 'tent', SP.tentSVG(), 384, 320, { scale: 0.7, pivot: [0.5, 294 / 320] });
add('village', 'snowman_v', SP.snowmanSVG(), 256, 320, { scale: 0.6, pivot: [0.5, 300 / 320] });
add('village', 'pine_v', SP.pineSVG(1), 256, 384, { scale: 0.6, pivot: [0.5, 365 / 384] });
// UI icons
for (const [n, fn] of Object.entries(ICONS)) add('ui', 'i_' + n, fn(), 128, 128, { scale: 1 });
// backgrounds (separate images)
for (const b of Object.keys(BIOMES)) {
  add('bg', `far_${b}`, farStripSVG(b), 1024, 384);
  add('bg', `mid_${b}`, midStripSVG(b), 1024, 320);
  add('bg', `isle_${b}`, farIslandSVG(b), 512, 256);
}
add('bg', 'tex_snow', snowTextureSVG('snow'), 256, 256);
add('bg', 'tex_cloud', snowTextureSVG('cloud'), 256, 256);
add('bg', 'tex_ice', snowTextureSVG('ice'), 256, 256);
add('bg', 'aurora', auroraSVG(), 1024, 384);
add('bg', 'sun', sunSVG('sun'), 256, 256);
add('bg', 'moon', sunSVG('moon'), 256, 256);

for (const [sheet, items] of Object.entries(sheets)) {
  if (only && sheet !== only) continue;
  const t = Date.now();
  await renderSVGs(items, path.join(outRoot, sheet));
  console.log(`rendered ${sheet}: ${items.length} in ${Date.now() - t}ms`);
}
fs.writeFileSync(path.join(root, 'art/out/manifest.json'), JSON.stringify(manifest, null, 1));
console.log('manifest', Object.keys(manifest).length, 'entries');
