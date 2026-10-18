// Level editor (dev tool). Levels are the same JSON files the game ships (src/data/levels/*.json).
// Left: level list · Center: drag-to-edit side view · Right: properties · Bottom: validation log.
import balance from '../data/balance.json';
import { LEVELS } from '../data/levels.js';
import { Island } from '../core/world.js';
import { RunSim } from '../core/run.js';
import { makeBot } from '../core/bot.js';
import { checkStructure, checkClearable } from '../core/validate.js';

const $ = (id) => document.getElementById(id);
const DRAFTS = 'ps.editor.drafts';
const BIOMES = ['dawn', 'pine', 'lake', 'wind', 'sunset', 'geyser', 'aurora', 'cloud', 'stars'];
const DECOR = ['pine', 'rock', 'crystal', 'snowman', 'spire', 'balloon', 'star', 'sign', 'flag'];
const TOOLS = [
  ['select', '선택/이동'], ['point', '+언덕점'], ['fish', '+물고기'], ['arc', '+물고기 호'], ['ground', '+바닥 물고기'],
  ['gold', '+황금'], ['ice', '+얼음'], ['wind', '+바람'], ['geyser', '+간헐천'], ['ring', '+고리'], ['decor', '+장식'], ['delete', '삭제'],
];

let levels = LEVELS.map((l) => JSON.parse(JSON.stringify(l)));
try {
  const d = JSON.parse(localStorage.getItem(DRAFTS) || 'null');
  if (Array.isArray(d) && d.length) levels = d;
} catch (e) { /* ignore */ }
let cur = 0;
let tool = 'select';
let sel = null; // {kind, i, part}
let view = { x: -200, y: -700, s: 0.32 };
let drag = null;
let results = {};
let trail = null;
let island = null;

const cv = $('cv');
const ctx = cv.getContext('2d');

function level() { return levels[cur]; }
function rebuild() { island = new Island(level(), 0, 0); }
function saveDrafts() { try { localStorage.setItem(DRAFTS, JSON.stringify(levels)); } catch (e) { /* full */ } }
function changed() { rebuild(); saveDrafts(); results[cur] = null; trail = null; renderList(); draw(); }

// ---------------------------------------------------------------- view transforms
const W = () => cv.clientWidth, H = () => cv.clientHeight;
const sx = (x) => (x - view.x) * view.s;
const sy = (y) => H() - (y - view.y) * view.s;
const wx = (px) => px / view.s + view.x;
const wy = (py) => (H() - py) / view.s + view.y;

function resize() {
  const r = cv.getBoundingClientRect();
  cv.width = r.width * devicePixelRatio; cv.height = r.height * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  draw();
}

// ---------------------------------------------------------------- drawing
function draw() {
  if (!island) rebuild();
  const lv = level();
  ctx.clearRect(0, 0, W(), H());
  // grid
  ctx.strokeStyle = 'rgba(30,35,80,.08)'; ctx.lineWidth = 1;
  for (let x = Math.floor(wx(0) / 500) * 500; x < wx(W()); x += 500) { ctx.beginPath(); ctx.moveTo(sx(x), 0); ctx.lineTo(sx(x), H()); ctx.stroke(); }
  for (let y = Math.floor(wy(H()) / 250) * 250; y < wy(0); y += 250) { ctx.beginPath(); ctx.moveTo(0, sy(y)); ctx.lineTo(W(), sy(y)); ctx.stroke(); }
  ctx.fillStyle = 'rgba(30,35,80,.5)'; ctx.font = '11px monospace';
  const stepU = [1000, 2000, 5000, 10000].find((u) => u * view.s > 70) || 20000;
  for (let x = Math.floor(wx(0) / stepU) * stepU; x < wx(W()); x += stepU) ctx.fillText((x / balance.display.unitsPerMeter) + 'm', sx(x) + 3, 14);
  // wind columns
  for (const [i, w] of (lv.wind || []).entries()) {
    const gy = island.localHeight(w.x + w.w / 2);
    ctx.fillStyle = isSel('wind', i) ? 'rgba(255,154,46,.35)' : 'rgba(180,220,255,.45)';
    ctx.fillRect(sx(w.x), sy(gy + w.h), w.w * view.s, w.h * view.s);
  }
  // terrain
  const pts = lv.points;
  const L = pts[pts.length - 1][0];
  ctx.beginPath();
  ctx.moveTo(sx(0), H());
  for (let x = 0; x <= L; x += Math.max(4, 6 / view.s)) ctx.lineTo(sx(x), sy(island.localHeight(x)));
  ctx.lineTo(sx(L), sy(island.localHeight(L)));
  ctx.lineTo(sx(L), H());
  ctx.closePath();
  ctx.fillStyle = lv.surface === 'cloud' ? '#fdf2ff' : '#f4f9ff'; ctx.fill();
  ctx.strokeStyle = '#1e2350'; ctx.lineWidth = 2; ctx.stroke();
  // ramp zone
  const rx = pts[pts.length - 2][0];
  ctx.fillStyle = 'rgba(255,201,51,.25)'; ctx.fillRect(sx(rx), 0, (L - rx) * view.s, H());
  // ice
  for (const [i, [a, b]] of (lv.ice || []).entries()) {
    ctx.strokeStyle = isSel('ice', i) ? '#ff9a2e' : '#4fb6e8'; ctx.lineWidth = 7;
    ctx.beginPath();
    for (let x = a; x <= b; x += 10) { const y = sy(island.localHeight(x)); if (x === a) ctx.moveTo(sx(x), y); else ctx.lineTo(sx(x), y); }
    ctx.stroke();
    handle(sx(a), sy(island.localHeight(a)), '#4fb6e8'); handle(sx(b), sy(island.localHeight(b)), '#4fb6e8');
  }
  // bot trajectory
  if (trail) {
    ctx.strokeStyle = 'rgba(214,69,69,.75)'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
    ctx.beginPath(); trail.pts.forEach(([x, y], i) => (i ? ctx.lineTo(sx(x), sy(y)) : ctx.moveTo(sx(x), sy(y)))); ctx.stroke();
    ctx.setLineDash([]);
    if (trail.caughtX !== null) { ctx.fillStyle = '#d64545'; ctx.fillRect(sx(trail.caughtX) - 2, 0, 4, H()); ctx.fillText('caught', sx(trail.caughtX) + 4, 28); }
  }
  // keypoints
  pts.forEach(([x, y], i) => {
    ctx.fillStyle = isSel('point', i) ? '#ff9a2e' : (i === pts.length - 1 ? '#ffc933' : '#1e2350');
    ctx.beginPath(); ctx.arc(sx(x), sy(y), 6, 0, 7); ctx.fill();
  });
  // geysers, rings, decor
  for (const [i, g] of (lv.geysers || []).entries()) { ctx.fillStyle = isSel('geyser', i) ? '#ff9a2e' : '#9a6e6a'; const y = sy(island.localHeight(g.x)); ctx.fillRect(sx(g.x) - 7, y - 14, 14, 14); }
  for (const [i, r] of (lv.rings || []).entries()) { ctx.strokeStyle = isSel('ring', i) ? '#ff9a2e' : '#62e0c4'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(sx(r.x), sy(r.y), (r.r || 90) * view.s * 0.5, (r.r || 90) * view.s, 0, 0, 7); ctx.stroke(); }
  for (const [i, d] of (lv.decor || []).entries()) {
    const y = sy(island.localHeight(d.x));
    ctx.fillStyle = isSel('decor', i) ? '#ff9a2e' : '#2f8f6b';
    ctx.beginPath(); ctx.moveTo(sx(d.x), y - 18); ctx.lineTo(sx(d.x) - 6, y); ctx.lineTo(sx(d.x) + 6, y); ctx.fill();
    if (view.s > 0.18) { ctx.fillStyle = '#1e2350'; ctx.fillText(d.type, sx(d.x) - 10, y - 22); }
  }
  // fish (expanded through the Island, drawn with entry handles)
  for (const f of island.fish) {
    ctx.fillStyle = f.gold ? '#ffc933' : '#6ab7f0';
    ctx.beginPath(); ctx.ellipse(sx(f.x), sy(f.y), 6, 4, 0, 0, 7); ctx.fill();
  }
  for (const [i, f] of (lv.fish || []).entries()) {
    const hy = f.type === 'ground' ? island.localHeight(f.x) + (f.off || 46) : f.y;
    handle(sx(f.x), sy(hy), isSel('fish', i) ? '#ff9a2e' : 'rgba(30,35,80,.35)', 4);
  }
}

function handle(x, y, c, r = 5) { ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.strokeRect(x - r, y - r, r * 2, r * 2); }
function isSel(kind, i) { return sel && sel.kind === kind && sel.i === i; }

// ---------------------------------------------------------------- picking
function pick(px, py) {
  const lv = level();
  const near = (x, y, r = 10) => Math.hypot(sx(x) - px, sy(y) - py) < r;
  for (let i = 0; i < lv.points.length; i++) if (near(lv.points[i][0], lv.points[i][1])) return { kind: 'point', i };
  for (let i = 0; i < (lv.fish || []).length; i++) {
    const f = lv.fish[i];
    const hy = f.type === 'ground' ? island.localHeight(f.x) + (f.off || 46) : f.y;
    if (near(f.x, hy, 9)) return { kind: 'fish', i };
  }
  for (let i = 0; i < (lv.ice || []).length; i++) {
    const [a, b] = lv.ice[i];
    if (near(a, island.localHeight(a))) return { kind: 'ice', i, part: 0 };
    if (near(b, island.localHeight(b))) return { kind: 'ice', i, part: 1 };
  }
  for (let i = 0; i < (lv.rings || []).length; i++) if (near(lv.rings[i].x, lv.rings[i].y, 16)) return { kind: 'ring', i };
  for (let i = 0; i < (lv.geysers || []).length; i++) if (near(lv.geysers[i].x, island.localHeight(lv.geysers[i].x) + 20, 12)) return { kind: 'geyser', i };
  for (let i = 0; i < (lv.decor || []).length; i++) if (near(lv.decor[i].x, island.localHeight(lv.decor[i].x) + 30, 14)) return { kind: 'decor', i };
  const x = wx(px), y = wy(py);
  for (let i = 0; i < (lv.wind || []).length; i++) {
    const w = lv.wind[i];
    const gy = island.localHeight(w.x + w.w / 2);
    if (x >= w.x && x <= w.x + w.w && y >= gy && y <= gy + w.h) return { kind: 'wind', i };
  }
  return null;
}

function arr(lv, key) { return lv[key] || (lv[key] = []); }

cv.addEventListener('pointerdown', (e) => {
  const r = cv.getBoundingClientRect();
  const px = e.clientX - r.left, py = e.clientY - r.top;
  const lv = level();
  const x = Math.round(wx(px)), y = Math.round(wy(py));
  const hit = pick(px, py);
  if (tool === 'delete') {
    if (hit) { removeSel(hit); changed(); }
    return;
  }
  if (tool !== 'select' && !hit) {
    const gy = island.localHeight(x);
    if (tool === 'point') {
      const idx = lv.points.findIndex((p) => p[0] > x);
      if (idx > 0) lv.points.splice(idx, 0, [x, y]);
      sel = { kind: 'point', i: idx };
    } else if (tool === 'fish' || tool === 'gold') { arr(lv, 'fish').push({ type: 'single', x, y: Math.max(y, gy + 40), gold: tool === 'gold' }); sel = { kind: 'fish', i: lv.fish.length - 1 }; }
    else if (tool === 'arc') { arr(lv, 'fish').push({ type: 'arc', x, y: Math.max(y, gy + 60), w: 500, h: 180, n: 7 }); sel = { kind: 'fish', i: lv.fish.length - 1 }; }
    else if (tool === 'ground') { arr(lv, 'fish').push({ type: 'ground', x, n: 5, spacing: 90, off: 52 }); sel = { kind: 'fish', i: lv.fish.length - 1 }; }
    else if (tool === 'ice') { arr(lv, 'ice').push([x, x + 400]); sel = { kind: 'ice', i: lv.ice.length - 1, part: 1 }; }
    else if (tool === 'wind') { arr(lv, 'wind').push({ x: x - 160, w: 320, h: 1500, power: 1 }); sel = { kind: 'wind', i: lv.wind.length - 1 }; }
    else if (tool === 'geyser') { arr(lv, 'geysers').push({ x }); sel = { kind: 'geyser', i: lv.geysers.length - 1 }; }
    else if (tool === 'ring') { arr(lv, 'rings').push({ x, y, r: 100 }); sel = { kind: 'ring', i: lv.rings.length - 1 }; }
    else if (tool === 'decor') { arr(lv, 'decor').push({ type: 'pine', x, s: 1, v: 0 }); sel = { kind: 'decor', i: lv.decor.length - 1 }; }
    changed(); renderProps();
    return;
  }
  sel = hit;
  renderProps();
  drag = { px, py, hit, vx: view.x, vy: view.y };
  cv.setPointerCapture(e.pointerId);
  draw();
});

cv.addEventListener('pointermove', (e) => {
  if (!drag) return;
  const r = cv.getBoundingClientRect();
  const px = e.clientX - r.left, py = e.clientY - r.top;
  const lv = level();
  const x = Math.round(wx(px)), y = Math.round(wy(py));
  const h = drag.hit;
  if (!h) { view.x = drag.vx - (px - drag.px) / view.s; view.y = drag.vy + (py - drag.py) / view.s; draw(); return; }
  if (h.kind === 'point') {
    const p = lv.points;
    const lo = h.i > 0 ? p[h.i - 1][0] + 60 : 0, hi = h.i < p.length - 1 ? p[h.i + 1][0] - 60 : 1e9;
    p[h.i] = [h.i === 0 ? 0 : Math.max(lo, Math.min(hi, x)), y];
  } else if (h.kind === 'fish') { const f = lv.fish[h.i]; f.x = x; if (f.type !== 'ground') f.y = y; }
  else if (h.kind === 'ice') { lv.ice[h.i][h.part] = x; lv.ice[h.i].sort((a, b) => a - b); }
  else if (h.kind === 'wind') { lv.wind[h.i].x = x - lv.wind[h.i].w / 2; }
  else if (h.kind === 'geyser') lv.geysers[h.i].x = x;
  else if (h.kind === 'ring') { lv.rings[h.i].x = x; lv.rings[h.i].y = y; }
  else if (h.kind === 'decor') lv.decor[h.i].x = x;
  rebuild(); draw();
});

cv.addEventListener('pointerup', () => { if (drag && drag.hit) { changed(); renderProps(); } drag = null; });
cv.addEventListener('wheel', (e) => {
  e.preventDefault();
  const r = cv.getBoundingClientRect();
  const px = e.clientX - r.left, py = e.clientY - r.top;
  const bx = wx(px), by = wy(py);
  view.s = Math.max(0.03, Math.min(2, view.s * (e.deltaY < 0 ? 1.15 : 1 / 1.15)));
  view.x = bx - px / view.s; view.y = by - (H() - py) / view.s;
  draw();
}, { passive: false });

window.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;
  if ((e.key === 'Delete' || e.key === 'Backspace') && sel) { removeSel(sel); changed(); }
  if (e.key === 'v') runValidate();
});

function removeSel(h) {
  const lv = level();
  if (h.kind === 'point') { if (h.i > 0 && lv.points.length > 4) lv.points.splice(h.i, 1); }
  else if (h.kind === 'fish') lv.fish.splice(h.i, 1);
  else if (h.kind === 'ice') lv.ice.splice(h.i, 1);
  else if (h.kind === 'wind') lv.wind.splice(h.i, 1);
  else if (h.kind === 'geyser') lv.geysers.splice(h.i, 1);
  else if (h.kind === 'ring') lv.rings.splice(h.i, 1);
  else if (h.kind === 'decor') lv.decor.splice(h.i, 1);
  sel = null; renderProps();
}

// ---------------------------------------------------------------- panels
function renderList() {
  const el = $('list');
  el.innerHTML = '';
  const tools = document.createElement('div');
  tools.className = 'tools';
  const mk = (label, fn) => { const b = document.createElement('button'); b.textContent = label; b.onclick = fn; tools.appendChild(b); };
  mk('+ 새 레벨', () => { const base = JSON.parse(JSON.stringify(level())); base.id = 'island' + String(levels.length + 1).padStart(2, '0'); base.name = { ko: '새 섬', en: 'New Island' }; levels.push(base); cur = levels.length - 1; changed(); renderProps(); });
  mk('복제', () => { const c = JSON.parse(JSON.stringify(level())); c.id += '_copy'; levels.splice(cur + 1, 0, c); cur++; changed(); renderProps(); });
  mk('삭제', () => { if (levels.length > 1 && confirm('delete ' + level().id + '?')) { levels.splice(cur, 1); cur = Math.max(0, cur - 1); changed(); renderProps(); } });
  mk('▲', () => { if (cur > 0) { [levels[cur - 1], levels[cur]] = [levels[cur], levels[cur - 1]]; cur--; changed(); } });
  mk('▼', () => { if (cur < levels.length - 1) { [levels[cur + 1], levels[cur]] = [levels[cur], levels[cur + 1]]; cur++; changed(); } });
  mk('원본으로', () => { if (confirm('discard drafts and reload shipped levels?')) { localStorage.removeItem(DRAFTS); levels = LEVELS.map((l) => JSON.parse(JSON.stringify(l))); cur = 0; changed(); renderProps(); } });
  el.appendChild(tools);
  levels.forEach((lv, i) => {
    const it = document.createElement('div');
    it.className = 'item' + (i === cur ? ' sel' : '');
    const r = results[i];
    const len = Math.round(lv.points[lv.points.length - 1][0] / balance.display.unitsPerMeter);
    it.innerHTML = `<span class="dot ${r ? (r.ok ? 'ok' : 'bad') : ''}"></span><div><b>${i + 1}. ${lv.name?.ko || lv.id}</b><br><small>${lv.id} · ${lv.biome} · ${len}m</small></div>`;
    it.onclick = () => { cur = i; sel = null; rebuild(); fitView(); renderList(); renderProps(); draw(); };
    el.appendChild(it);
  });
}

function input(label, value, onchange, type = 'text', opts = null) {
  const l = document.createElement('label');
  l.append(document.createTextNode(label));
  let inp;
  if (opts) {
    inp = document.createElement('select');
    for (const o of opts) { const op = document.createElement('option'); op.value = o; op.textContent = o; if (o === value) op.selected = true; inp.appendChild(op); }
  } else {
    inp = document.createElement('input');
    inp.type = type;
    if (type === 'checkbox') inp.checked = !!value; else inp.value = value ?? '';
  }
  inp.onchange = () => { onchange(type === 'number' ? +inp.value : type === 'checkbox' ? inp.checked : inp.value); changed(); };
  l.appendChild(inp);
  return l;
}

function renderProps() {
  const el = $('props');
  const lv = level();
  el.innerHTML = '<h3>레벨 속성</h3>';
  el.append(
    input('id', lv.id, (v) => { lv.id = v; }),
    input('이름 (ko)', lv.name?.ko, (v) => { lv.name.ko = v; }),
    input('name (en)', lv.name?.en, (v) => { lv.name.en = v; }),
    input('biome', lv.biome, (v) => { lv.biome = v; }, 'text', BIOMES),
    input('surface', lv.surface || 'snow', (v) => { lv.surface = v; }, 'text', ['snow', 'cloud']),
    input('intro', lv.intro || '', (v) => { lv.intro = v || null; }, 'text', ['', 'ice', 'wind', 'geyser', 'ring', 'cloud']),
  );
  el.insertAdjacentHTML('beforeend', '<h3>눈보라 Blizzard</h3>');
  lv.blizzard = lv.blizzard || { startGap: 1200, speed: 700, accel: 6 };
  for (const k of ['speed', 'accel', 'startGap']) el.append(input(k, lv.blizzard[k], (v) => { lv.blizzard[k] = v; }, 'number'));
  el.insertAdjacentHTML('beforeend', '<h3>예상 강화 Expected upgrades (검증용)</h3>');
  lv.expect = lv.expect || { upgrades: {} };
  for (const k of ['flap', 'slide', 'magnet', 'glide', 'scarf']) el.append(input(k, lv.expect.upgrades[k] || 0, (v) => { lv.expect.upgrades[k] = v; }, 'number'));
  el.insertAdjacentHTML('beforeend', '<h3>섬 목표 Goals</h3>');
  (lv.goals || []).forEach((g, gi) => {
    el.append(input('goal ' + (gi + 1) + ' type', g.type, (v) => { g.type = v; }, 'text', ['fish', 'perfect', 'height', 'gold', 'fever', 'rings']));
    el.append(input('goal ' + (gi + 1) + ' n', g.n, (v) => { g.n = v; }, 'number'));
  });
  if (!sel) { el.insertAdjacentHTML('beforeend', '<h3>선택 없음</h3><p>점/물고기/오브젝트를 클릭하세요. 빈 곳 드래그 = 화면 이동, 휠 = 확대.</p>'); return; }
  el.insertAdjacentHTML('beforeend', `<h3>선택: ${sel.kind} #${sel.i}</h3>`);
  if (sel.kind === 'point') {
    const p = lv.points[sel.i];
    el.append(input('x', p[0], (v) => { p[0] = v; }, 'number'), input('y', p[1], (v) => { p[1] = v; }, 'number'));
  } else if (sel.kind === 'fish') {
    const f = lv.fish[sel.i];
    el.append(input('type', f.type, (v) => { f.type = v; }, 'text', ['single', 'arc', 'line', 'ground']));
    for (const k of ['x', 'y', 'w', 'h', 'n', 'x2', 'y2', 'spacing', 'off']) if (f[k] !== undefined || (k === 'n' && f.type !== 'single')) el.append(input(k, f[k] ?? '', (v) => { f[k] = v; }, 'number'));
    el.append(input('gold', f.gold, (v) => { f.gold = v; }, 'checkbox'));
  } else if (sel.kind === 'wind') {
    const w = lv.wind[sel.i];
    for (const k of ['x', 'w', 'h', 'power']) el.append(input(k, w[k], (v) => { w[k] = v; }, 'number'));
  } else if (sel.kind === 'ring') {
    const r = lv.rings[sel.i];
    for (const k of ['x', 'y', 'r']) el.append(input(k, r[k], (v) => { r[k] = v; }, 'number'));
  } else if (sel.kind === 'decor') {
    const d = lv.decor[sel.i];
    el.append(input('type', d.type, (v) => { d.type = v; }, 'text', DECOR), input('x', d.x, (v) => { d.x = v; }, 'number'), input('scale', d.s || 1, (v) => { d.s = v; }, 'number'), input('variant', d.v || 0, (v) => { d.v = v; }, 'number'));
  } else if (sel.kind === 'geyser') {
    el.append(input('x', lv.geysers[sel.i].x, (v) => { lv.geysers[sel.i].x = v; }, 'number'));
  } else if (sel.kind === 'ice') {
    el.append(input('from', lv.ice[sel.i][0], (v) => { lv.ice[sel.i][0] = v; }, 'number'), input('to', lv.ice[sel.i][1], (v) => { lv.ice[sel.i][1] = v; }, 'number'));
  }
}

function renderToolbar() {
  const el = $('toolbar');
  el.innerHTML = '';
  for (const [k, label] of TOOLS) {
    const b = document.createElement('button');
    b.textContent = label;
    b.className = tool === k ? 'on' : '';
    b.onclick = () => { tool = k; renderToolbar(); $('hint').textContent = hintFor(k); };
    el.appendChild(b);
  }
}
function hintFor(k) {
  return { select: '클릭: 선택 · 드래그: 이동 · 빈 곳 드래그: 화면 이동 · 휠: 확대 · Del: 삭제 · V: 검증', point: '빈 곳을 클릭하면 그 x 위치에 언덕 점이 추가돼요' }[k] || '빈 곳을 클릭해서 추가해요';
}

function fitView() {
  const lv = level();
  const L = lv.points[lv.points.length - 1][0];
  view.s = Math.max(0.03, (W() - 40) / (L + 400));
  view.x = -200;
  const ys = lv.points.map((p) => p[1]);
  const mid = (Math.min(...ys) + Math.max(...ys)) / 2 + 300;
  view.y = mid - (H() / 2) / view.s;
}

// ---------------------------------------------------------------- validate / play / io
function log(html) { $('out').innerHTML = html; }

function runValidate() {
  const lv = level();
  const st = checkStructure(lv);
  let html = `<b>${lv.id}</b> structure: ${st.errors.length ? '<span class="bad">' + st.errors.length + ' errors</span>' : '<span class="ok">ok</span>'}\n`;
  for (const e of st.errors) html += `<span class="bad">  ✗ ${e}</span>\n`;
  for (const w of st.warnings) html += `<span class="warn">  ! ${w}</span>\n`;
  const t0 = performance.now();
  const r = checkClearable(levels, cur, balance, { seeds: 5 });
  html += `clearability (expected upgrades ${JSON.stringify(r.upgrades)}): ${r.pass ? '<span class="ok">PASS</span>' : '<span class="bad">FAIL</span>'}  (${Math.round(performance.now() - t0)} ms)\n`;
  html += `length ${r.lengthM} m · fish available ${r.fishAvailable}\n`;
  for (const [p, v] of Object.entries(r.profiles)) {
    html += `  ${p.padEnd(8)} clear ${Math.round(v.clearRate * 100)}% · progress ${Math.round(v.avgProgress * 100)}% · ${v.avgTime.toFixed(1)}s · fish ${v.avgFish.toFixed(0)} · perfect ${v.avgPerfect.toFixed(1)} · bonk ${v.avgBonk.toFixed(1)} · max height ${v.avgMaxHeightM.toFixed(0)}m\n`;
  }
  for (const n of r.notes) html += `<span class="warn">  · ${n}</span>\n`;
  results[cur] = { ok: st.errors.length === 0 && r.pass };
  // one traced "good" run for the overlay
  const sim = new RunSim({ levels: levels.slice(0, cur + 1), balance, upgrades: r.upgrades, startIndex: cur });
  const bot = makeBot('good', 3);
  const pts = [];
  let caughtX = null;
  while (sim.state === 'run' && sim.time < 300) {
    sim.step(1 / 120, bot(sim));
    if (((sim.time * 120) | 0) % 6 === 0) pts.push([sim.p.x - sim.island.startX, sim.p.y]);
  }
  if (sim.state === 'caught') caughtX = sim.p.x - sim.island.startX;
  trail = { pts, caughtX };
  log(html);
  renderList();
  draw();
}

function testPlay() {
  try { localStorage.setItem('ps.editorLevel', JSON.stringify(level())); } catch (e) { /* ignore */ }
  $('frame').src = '../dev/index.html?editorLevel=1&t=' + Date.now();
  $('play').classList.add('show');
}

function download(name, data) {
  const blob = new Blob([JSON.stringify(data, null, 1) + '\n'], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

$('bValidate').onclick = runValidate;
$('bPlay').onclick = testPlay;
$('bClose').onclick = () => { $('play').classList.remove('show'); $('frame').src = 'about:blank'; };
$('bExport').onclick = () => download(level().id + '.json', level());
$('bExportAll').onclick = () => levels.forEach((lv, i) => setTimeout(() => download(`island${String(i + 1).padStart(2, '0')}.json`, lv), i * 250));
$('bImport').onclick = () => $('file').click();
$('file').onchange = async (e) => {
  for (const f of e.target.files) {
    try {
      const data = JSON.parse(await f.text());
      const list = Array.isArray(data) ? data : [data];
      for (const lv of list) {
        if (!lv.points) continue;
        const i = levels.findIndex((l) => l.id === lv.id);
        if (i >= 0) levels[i] = lv; else levels.push(lv);
        cur = i >= 0 ? i : levels.length - 1;
      }
    } catch (err) { alert(f.name + ': ' + err.message); }
  }
  e.target.value = '';
  changed(); renderProps(); fitView(); draw();
};

window.addEventListener('resize', resize);
renderToolbar();
renderList();
rebuild();
resize();
fitView();
renderProps();
draw();
$('hint').textContent = hintFor('select');
log('레벨을 고르고 편집하세요. [검증]은 구조 검사 + 봇 플레이로 클리어 가능 여부를 확인합니다. 편집 내용은 브라우저에 자동 저장되고, [내보내기]로 JSON 파일을 받아 src/data/levels/ 에 넣으면 게임에 반영됩니다.');
window.__editor = { levels: () => levels, select: (i) => { cur = i; rebuild(); fitView(); renderList(); renderProps(); draw(); }, validate: runValidate };
