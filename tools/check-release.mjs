// Checks every release deliverable against its spec and prints a table (used as report evidence).
// node tools/check-release.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const rel = path.join(root, 'out/release');
const rows = [];
const ok = (name, pass, detail) => rows.push([pass ? 'OK' : 'FAIL', name, detail]);
const png = (f) => { const b = fs.readFileSync(f); return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), sig: b.slice(1, 4).toString() === 'PNG', alpha: b[25] === 6 || b[25] === 4 }; };
const exists = (p) => fs.existsSync(path.join(rel, p));

// store texts
const store = fs.existsSync(path.join(rel, 'store')) ? fs.readdirSync(path.join(rel, 'store')).filter((f) => f.endsWith('.md')) : [];
ok('store/*.md (2, ko+en)', store.length === 2 && store.includes('ko.md') && store.includes('en.md'), store.join(', '));
for (const f of store) {
  const s = fs.readFileSync(path.join(rel, 'store', f), 'utf8');
  const sec = (re) => { const m = s.split(/^## /m).find((x) => re.test(x.split('\n')[0])); return m ? m.split('\n').slice(1).join('\n').trim() : ''; };
  const name = sec(/이름|name/i), short = sec(/짧은|Short/i), full = sec(/자세한|Full/i);
  ok(`store/${f} lengths`, name.length <= 30 && short.length <= 80 && full.length <= 4000, `name ${name.length}/30, short ${short.length}/80, full ${full.length}/4000`);
}
// icon + feature
if (exists('icon-512.png')) { const i = png(path.join(rel, 'icon-512.png')); ok('icon-512.png 512x512', i.sig && i.w === 512 && i.h === 512, `${i.w}x${i.h} png`); } else ok('icon-512.png', false, 'missing');
if (exists('feature-1024x500.png')) { const i = png(path.join(rel, 'feature-1024x500.png')); ok('feature-1024x500.png', i.sig && i.w === 1024 && i.h === 500, `${i.w}x${i.h} png`); } else ok('feature-1024x500.png', false, 'missing');
// screenshots
const shots = exists('screenshots') ? fs.readdirSync(path.join(rel, 'screenshots')).filter((f) => f.endsWith('.png')) : [];
const dims = shots.map((f) => png(path.join(rel, 'screenshots', f))).map((i) => `${i.w}x${i.h}`);
ok('screenshots/*.png (1-8)', shots.length >= 1 && shots.length <= 8, `${shots.length} files, ${[...new Set(dims)].join(', ')}`);
// videos
for (const f of fs.readdirSync(rel).filter((x) => x.endsWith('.mp4'))) {
  const p = path.join(rel, f);
  const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_name,width,height,r_frame_rate:format=duration,size', '-of', 'json', p]).toString());
  const v = probe.streams.find((s) => s.width), a = probe.streams.find((s) => !s.width);
  const dur = +probe.format.duration, size = +probe.format.size;
  ok(`${f}`, v.codec_name === 'h264' && dur <= 30 && dur >= 15 && size <= 20000000, `${v.codec_name} ${v.width}x${v.height} ${v.r_frame_rate}fps, ${dur.toFixed(2)} s, ${(size / 1e6).toFixed(2)} MB, audio ${a ? a.codec_name : 'none'}`);
}
// subtitles
const subs = exists('subtitles') ? fs.readdirSync(path.join(rel, 'subtitles')) : [];
const subOk = subs.length >= 2 && subs.length <= 4 && subs.every((f) => /\.(vtt|srt)$/.test(f)) && subs.some((f) => f.includes('.ko.')) && subs.some((f) => f.includes('.en.'));
const vttOk = subs.filter((f) => f.endsWith('.vtt')).every((f) => fs.readFileSync(path.join(rel, 'subtitles', f), 'utf8').startsWith('WEBVTT'));
ok('subtitles (2-4, vtt/srt, ko+en)', subOk && vttOk, subs.join(', '));
// docs + pages
for (const f of ['plan.md', 'report.md', 'index.html', 'docs/analytics.md']) ok(f, exists(f) && fs.statSync(path.join(rel, f)).size > 500, exists(f) ? `${(fs.statSync(path.join(rel, f)).size / 1024).toFixed(1)} KB` : 'missing');
ok('game entry out/index.html', fs.existsSync(path.join(root, 'out/index.html')), 'out/index.html');
// showcase references resolve
if (exists('index.html')) {
  const html = fs.readFileSync(path.join(rel, 'index.html'), 'utf8');
  const refs = [...html.matchAll(/(?:src|href)="([^"#:]+)"/g)].map((m) => m[1]).filter((r) => !r.startsWith('http'));
  const missing = [...new Set(refs)].filter((r) => !fs.existsSync(path.join(rel, r)));
  ok('release/index.html links', missing.length === 0, missing.length ? 'missing: ' + missing.join(', ') : `${new Set(refs).size} local links resolve`);
}
const w = Math.max(...rows.map((r) => r[1].length));
for (const r of rows) console.log(`${r[0].padEnd(4)} ${r[1].padEnd(w)}  ${r[2]}`);
console.log(rows.every((r) => r[0] === 'OK') ? 'ALL OK' : 'SOME FAILED');
