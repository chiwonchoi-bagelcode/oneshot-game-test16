// Rasterizes SVG strings to transparent PNGs with headless Chromium.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

export async function renderSVGs(items, outDir, { scale = 1 } = {}) {
  // items: [{ name, svg, w, h }]
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: scale });
  await page.setContent('<html><body style="margin:0;background:transparent"><div id="c"></div></body></html>');
  for (const it of items) {
    await page.setViewportSize({ width: it.w, height: it.h });
    await page.evaluate((s) => { document.getElementById('c').innerHTML = s; }, it.svg);
    const el = await page.$('#c svg');
    await el.screenshot({ path: path.join(outDir, it.name + '.png'), omitBackground: true });
  }
  await browser.close();
}

// Contact sheet for visual review: each sprite on a checker + its name.
export async function contactSheet(dir, names, outFile, { cols = 6, cell = 200, bg = '#9fc7ee' } = {}) {
  const browser = await chromium.launch();
  const rows = Math.ceil(names.length / cols);
  const page = await browser.newPage({ viewport: { width: cols * cell, height: rows * (cell + 18) } });
  const imgs = names.map((n) => {
    const b64 = fs.readFileSync(path.join(dir, n + '.png')).toString('base64');
    return `<div style="width:${cell}px;height:${cell + 18}px;display:inline-block;vertical-align:top;font:11px sans-serif;text-align:center">
      <div style="width:${cell - 8}px;height:${cell - 8}px;margin:4px;background:${bg};background-image:linear-gradient(45deg,rgba(255,255,255,.25) 25%,transparent 25%,transparent 75%,rgba(255,255,255,.25) 75%),linear-gradient(45deg,rgba(255,255,255,.25) 25%,transparent 25%,transparent 75%,rgba(255,255,255,.25) 75%);background-size:20px 20px;background-position:0 0,10px 10px;display:flex;align-items:center;justify-content:center">
      <img src="data:image/png;base64,${b64}" style="max-width:100%;max-height:100%"></div>${n}</div>`;
  }).join('');
  await page.setContent(`<html><body style="margin:0;background:#fff;font-size:0">${imgs}</body></html>`);
  await page.waitForTimeout(100);
  await page.screenshot({ path: outFile, fullPage: true });
  await browser.close();
}
