// App icon (512 and 192) from the same vector generators as the in-game sprites.
// node art/store-art.mjs  -> out/release/icon-512.png, out/assets/icon-192.png, art/out/store/*
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { penguinSVG, penguinFrames } from './penguin.mjs';
import { fishSVG } from './sprites.mjs';
import { PAL, sparkle, svg } from './lib.mjs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

// place a full <svg> (with its own viewBox) inside another one
function nest(inner, x, y, w, h, extra = '') {
  return inner.replace(/^<svg[^>]*?width="(\d+)" height="(\d+)" viewBox="([^"]+)">/, (m, iw, ih, vb) =>
    `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${vb}" overflow="visible" ${extra}>`);
}

export function iconSVG() {
  const S = 512;
  const F = penguinFrames();
  const peng = penguinSVG({ ...F.soar, eyes: 'happy', beak: 'grin', wingLen: 86 }, 384);
  const fish = fishSVG(false), gold = fishSVG(true);
  const defs = `
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fc4ff"/><stop offset="0.62" stop-color="#9fdcff"/><stop offset="1" stop-color="#d9f3ff"/></linearGradient>
    <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fffbe0"/><stop offset="0.45" stop-color="#fff2a8" stop-opacity="0.9"/><stop offset="1" stop-color="#fff2a8" stop-opacity="0"/></radialGradient>
    <linearGradient id="snow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="${PAL.snowShade}"/></linearGradient>
    <linearGradient id="snow2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6f1ff"/><stop offset="1" stop-color="${PAL.snowDeep}"/></linearGradient>`;
  const streaks = [[70, 360, 150], [40, 410, 120], [110, 318, 110]].map(([x, y, l]) =>
    `<path d="M${x},${y} q${l * 0.5},-${l * 0.28} ${l},-${l * 0.5}" fill="none" stroke="#fff" stroke-width="13" stroke-linecap="round" opacity="0.85"/>`).join('');
  const body = `
    <rect width="${S}" height="${S}" fill="url(#sky)"/>
    <circle cx="410" cy="96" r="150" fill="url(#sun)"/>
    <path d="M-20,${S} L-20,430 Q120,300 270,392 Q400,470 540,380 L540,${S} Z" fill="url(#snow2)" stroke="${PAL.ink}" stroke-width="10" stroke-linejoin="round"/>
    <path d="M-20,${S} L-20,470 Q150,370 300,452 Q420,512 540,470 L540,${S} Z" fill="url(#snow)" stroke="${PAL.ink}" stroke-width="10" stroke-linejoin="round"/>
    <path d="M20,452 Q150,386 280,446" fill="none" stroke="${PAL.rim}" stroke-width="9" stroke-linecap="round" opacity="0.9"/>
    ${streaks}
    ${nest(fish, 330, 300, 120, 90, 'transform="rotate(-18 390 345)"')}
    ${nest(fish, 386, 214, 104, 78, 'transform="rotate(-24 438 253)"')}
    ${nest(gold, 404, 116, 112, 84, 'transform="rotate(-30 460 158)"')}
    ${nest(peng, 18, 6, 470, 470, 'transform="rotate(-14 253 241)"')}
    <path d="${sparkle(96, 112, 20, 0.24)}" fill="#fff" stroke="${PAL.ink}" stroke-width="4"/>
    <path d="${sparkle(150, 70, 12, 0.24)}" fill="#fff"/>`;
  return svg(S, S, defs, body);
}

async function render(svgStr, file, size) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  await page.setContent(`<html><body style="margin:0"><div id="c" style="width:${size}px;height:${size}px">${svgStr.replace('<svg ', `<svg style="width:${size}px;height:${size}px" `)}</div></body></html>`);
  await (await page.$('#c')).screenshot({ path: file });
  await browser.close();
}

const store = path.join(root, 'art/out/store');
fs.mkdirSync(store, { recursive: true });
const icon = iconSVG();
fs.writeFileSync(path.join(store, 'icon.svg'), icon);
fs.mkdirSync(path.join(root, 'out/release'), { recursive: true });
await render(icon, path.join(root, 'out/release/icon-512.png'), 512);
await render(icon, path.join(root, 'out/assets/icon-192.png'), 192);
await render(icon, path.join(store, 'icon-48.png'), 48);
console.log('icon done');
