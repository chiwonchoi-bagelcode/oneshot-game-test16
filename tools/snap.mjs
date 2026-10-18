// Scripted browser session for checks: node tools/snap.mjs <script.json|inline> 
// actions: {wait:ms} {shot:name} {tap:[x,y]} {down:[x,y]} {up:1} {eval:"js"} {hold:ms}
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2);
const spec = JSON.parse(fs.existsSync(args[0]) ? fs.readFileSync(args[0], 'utf8') : args[0]);
const outDir = spec.out || '/tmp';
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const vp = spec.viewport || { width: 390, height: 844 };
const context = await browser.newContext({ viewport: vp, deviceScaleFactor: spec.dpr || 2, isMobile: true, hasTouch: true, locale: spec.locale || 'ko-KR' });
if (spec.storage) await context.addInitScript((s) => { try { localStorage.setItem('ps.save.v1', s); } catch (e) {} }, spec.storage);
const page = await context.newPage();
const logs = [];
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) logs.push('[' + m.type() + '] ' + m.text()); });
page.on('pageerror', (e) => logs.push('[pageerror] ' + e.message));
const url = spec.url || ('file://' + root + '/out/' + (spec.page || 'index.html'));
await page.goto(url + (spec.query ? '?' + spec.query : ''));
for (const a of spec.actions || []) {
  if (a.wait) await page.waitForTimeout(a.wait);
  if (a.shot) await page.screenshot({ path: path.join(outDir, a.shot + '.png') });
  if (a.tap) { await page.mouse.click(a.tap[0], a.tap[1]); }
  if (a.down) { await page.mouse.move(a.down[0], a.down[1]); await page.mouse.down(); }
  if (a.up) await page.mouse.up();
  if (a.hold) { await page.mouse.move(195, 700); await page.mouse.down(); await page.waitForTimeout(a.hold); await page.mouse.up(); }
  if (a.eval) { const r = await page.evaluate(a.eval); if (r !== undefined) console.log('eval:', typeof r === 'string' ? r : JSON.stringify(r)); }
  if (a.click) { await page.click(a.click); }
}
for (const l of logs.slice(0, 30)) console.log(l);
await browser.close();
