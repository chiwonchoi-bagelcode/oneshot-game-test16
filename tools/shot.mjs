// Screenshot helper: node tools/shot.mjs <url-query> <outPrefix> <times...>
import { chromium } from 'playwright';
import path from 'node:path';
const [query = '', prefix = 'shot', ...times] = process.argv.slice(2);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log('[console]', m.text()); });
page.on('pageerror', e => console.log('[pageerror]', e.message));
await page.goto('file://' + root + '/out/index.html?' + query);
await page.waitForTimeout(300);
await page.evaluate(() => { window.__manual = true; });
let t = 0;
for (const ts of (times.length ? times : ['1'])) {
  const target = parseFloat(ts);
  await page.evaluate((d) => window.__advance(d), target - t);
  t = target;
  await page.screenshot({ path: `${prefix}_${ts}.png` });
}
await browser.close();
