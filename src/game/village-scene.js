// The penguin village drawn on the main canvas behind the hub UI. Families walk between their
// igloos, eggs sit in nests, babies waddle after their parents, and the next building site waits
// with a little flag. Tapping a building shows what it does.
import { draw, frame, bg } from './assets.js';
import { BUILDINGS, isBuilt, availableBuildings, babyStage, rackAmount, iglooCount } from '../meta/economy.js';
import BIOMES from '../data/biomes.json';

const VW = 640, VH = 900;
const depthAt = (y) => 0.42 + (y - 300) / 560 * 0.66; // farther up = smaller

export class VillageScene {
  constructor(app) {
    this.app = app;
    this.time = 0;
    this.penguins = [];
    this.puffs = [];
    this.pan = 0; this.panV = 0;
    this.region = { top: 0, h: 600 };
    this.hit = [];
    this.flakes = [];
    for (let i = 0; i < 40; i++) this.flakes.push([Math.random(), Math.random(), 1 + Math.random() * 2.4, 0.3 + Math.random()]);
    this.highlight = null; this.highlightT = 0;
    this.built = {};
    this.buildAnim = null;
  }

  // rebuild the population from the save (called on show and after changes)
  sync(state) {
    const fams = [];
    for (const b of BUILDINGS) if (b.effect.family && isBuilt(state, b.id)) fams.push(b);
    const want = [];
    const kinds = ['va', 'vb', 'vc', 'vd'];
    fams.forEach((b, i) => {
      want.push({ id: b.id + '_a', kind: kinds[i % 4], home: b, size: 1 });
      want.push({ id: b.id + '_b', kind: kinds[(i + 1) % 4], home: b, size: 1 });
    });
    state.village.babies.forEach((bb, i) => {
      const home = fams[i % Math.max(1, fams.length)];
      if (!home) return;
      want.push({ id: bb.id, kind: 'baby', stage: babyStage(state, bb), home, follow: home.id + '_a', size: 1, babyKind: bb.kind });
    });
    const keep = {};
    for (const p of this.penguins) keep[p.id] = p;
    this.penguins = want.map((w) => {
      const old = keep[w.id];
      if (old) { old.stage = w.stage; old.home = w.home; return old; }
      const [hx, hy] = w.home.plot;
      return { ...w, x: hx + (Math.random() - 0.5) * 120, y: hy + 14 + Math.random() * 30, tx: hx, ty: hy + 24, wait: Math.random() * 2, dir: 1, walkT: 0, spawnT: 0 };
    });
    this.eggs = state.village.eggs.map((e) => {
      const b = BUILDINGS.find((x) => e.id.startsWith(x.id));
      return b ? { x: b.plot[0] + 70 * depthAt(b.plot[1]), y: b.plot[1] + 12 } : null;
    }).filter(Boolean);
    this.next = availableBuildings(state)[0] || null;
    this.state = state;
  }

  setRegion(top, h) { this.region = { top, h }; }

  // Frame what has been built: a lone igloo fills the view, a full village zooms out to fit.
  focusBox() {
    let x0 = 330 - 150, x1 = 330 + 150, y0 = 470, y1 = 880;
    const grow = (x, y, r = 130) => { x0 = Math.min(x0, x - r); x1 = Math.max(x1, x + r); y0 = Math.min(y0, y - r * 1.6); y1 = Math.max(y1, y + 30); };
    if (this.state) for (const b of BUILDINGS) if (isBuilt(this.state, b.id)) grow(b.plot[0], b.plot[1], 170 * depthAt(b.plot[1]));
    if (this.next) grow(this.next.plot[0], this.next.plot[1], 150 * depthAt(this.next.plot[1]));
    return [Math.max(0, x0), Math.min(VW, x1), Math.max(250, y0), 890];
  }

  layout(W) {
    const R = this.region;
    const full = Math.min(W / VW, R.h / 690);
    const [x0, x1, y0, y1] = this.focusBox();
    const fit = Math.min(W / (x1 - x0), R.h / (y1 - y0 + 60));
    const target = Math.max(full, Math.min(full * 1.7, fit));
    this.zoom = this.zoom ? this.zoom + (target - this.zoom) * 0.05 : target;
    const sc = this.zoom;
    const cx = (x0 + x1) / 2;
    const vw = W / sc;
    const minC = vw / 2, maxC = VW - vw / 2;
    const centerX = minC > maxC ? VW / 2 : Math.max(minC, Math.min(maxC, cx + this.pan));
    return { sc, ox: W / 2 - centerX * sc, oy: R.top + R.h - 885 * sc, maxPan: 0 };
  }

  drag(dx) {
    const L = this.lastLayout;
    if (!L) return;
    this.pan = Math.max(-VW / 2, Math.min(VW / 2, this.pan - dx / L.sc));
  }

  update(dt) {
    this.time += dt;
    if (this.highlightT > 0) this.highlightT -= dt;
    for (const p of this.penguins) {
      if (p.spawnT < 1) p.spawnT = Math.min(1, p.spawnT + dt * 1.5);
      if (p.wait > 0) { p.wait -= dt; continue; }
      let tx = p.tx, ty = p.ty;
      if (p.follow) {
        const parent = this.penguins.find((q) => q.id === p.follow);
        if (parent) { tx = parent.x - 50 * parent.dir; ty = parent.y + 8; }
      }
      const dx = tx - p.x, dy = ty - p.y;
      const d = Math.hypot(dx, dy);
      const sp = p.kind === 'baby' ? 50 : 38;
      if (d < 6) {
        if (!p.follow) {
          p.wait = 1.5 + Math.random() * 3.5;
          const [hx, hy] = p.home.plot;
          p.tx = Math.max(30, Math.min(VW - 30, hx + (Math.random() - 0.5) * 260));
          p.ty = Math.max(330, Math.min(840, hy + 8 + (Math.random() - 0.3) * 110));
        }
        p.walking = false;
      } else {
        p.x += (dx / d) * sp * dt; p.y += (dy / d) * sp * dt;
        p.dir = dx < 0 ? -1 : 1;
        p.walking = true;
        p.walkT += dt;
      }
    }
    // chimney smoke
    if (Math.random() < dt * 2) {
      for (const b of BUILDINGS) {
        if (b.sprite === 'igloo_2' && this.state && isBuilt(this.state, b.id)) {
          const k = depthAt(b.plot[1]);
          this.puffs.push({ x: b.plot[0] + 55 * k, y: b.plot[1] - 230 * k, t: 0, k });
        }
        if (b.type === 'hotspring' && this.state && isBuilt(this.state, b.id) && Math.random() < 0.5) {
          const k = depthAt(b.plot[1]);
          this.puffs.push({ x: b.plot[0] + (Math.random() - 0.5) * 150 * k, y: b.plot[1] - 40 * k, t: 0, k });
        }
      }
    }
    this.puffs = this.puffs.filter((p) => (p.t += dt) < 3);
    if (this.buildAnim) { this.buildAnim.t += dt; if (this.buildAnim.t > 1.4) this.buildAnim = null; }
  }

  celebrate(id, delay = 0) {
    this.buildAnim = { id, t: -delay };
    this.highlight = id; this.highlightT = 2;
  }

  render(ctx, W, H) {
    const L = this.layout(W);
    this.lastLayout = L;
    const { sc, ox, oy } = L;
    const X = (x) => ox + x * sc, Y = (y) => oy + y * sc;
    // sky
    const B = BIOMES.dawn;
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, B.sky[0]); g.addColorStop(0.5, B.sky[1]); g.addColorStop(0.8, B.sky[2]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const sun = bg('sun');
    if (sun) ctx.drawImage(sun, W * 0.55, Y(40), W * 0.6, W * 0.6);
    // far mountains + sea + the next island on the horizon
    const far = bg('far_dawn');
    const horizon = Y(290);
    if (far) {
      const fw = 1024 * sc * 0.9, fh = 384 * sc * 0.9;
      const off = ((-this.pan * sc * 0.2) % fw + fw) % fw;
      for (let x = off - fw; x < W; x += fw) ctx.drawImage(far, x, horizon - fh * 0.78, fw + 1, fh);
    }
    const sg = ctx.createLinearGradient(0, horizon, 0, horizon + 120 * sc);
    sg.addColorStop(0, B.sea[0]); sg.addColorStop(1, B.sea[1]);
    ctx.fillStyle = sg; ctx.fillRect(0, horizon - 2, W, 160 * sc);
    const nextIsle = this.app.nextIslandBiome ? bg('isle_' + this.app.nextIslandBiome()) : null;
    if (nextIsle) ctx.drawImage(nextIsle, X(470), horizon - 62 * sc, 200 * sc, 100 * sc);
    // clouds
    for (let i = 0; i < 3; i++) {
      const cx = ((i * 300 + this.time * (8 + i * 4)) % (VW + 400)) - 200;
      draw(ctx, 'cloud_' + i, X(cx), Y(110 + i * 45), sc * 0.6, 0, 0.9);
    }
    // ground plateau
    ctx.fillStyle = '#eef5ff';
    ctx.beginPath();
    ctx.moveTo(X(-400), Y(305));
    for (let x = -400; x <= VW + 400; x += 30) ctx.lineTo(X(x), Y(300 + Math.sin(x * 0.011) * 10 + Math.sin(x * 0.031) * 4));
    ctx.lineTo(X(VW + 400), H + 10); ctx.lineTo(X(-400), H + 10); ctx.closePath();
    const gg = ctx.createLinearGradient(0, Y(300), 0, Y(900));
    gg.addColorStop(0, '#ffffff'); gg.addColorStop(0.5, '#e6effc'); gg.addColorStop(1, '#c9d9f2');
    ctx.fillStyle = gg; ctx.fill();
    ctx.strokeStyle = '#1e2350'; ctx.lineWidth = Math.max(2, 5 * sc); ctx.stroke();
    // paths
    ctx.strokeStyle = 'rgba(160,185,230,0.5)'; ctx.lineCap = 'round';
    ctx.lineWidth = 46 * sc;
    ctx.beginPath(); ctx.moveTo(X(330), Y(900)); ctx.quadraticCurveTo(X(300), Y(700), X(330), Y(610)); ctx.quadraticCurveTo(X(380), Y(500), X(330), Y(380)); ctx.stroke();
    ctx.lineWidth = 26 * sc;
    ctx.beginPath(); ctx.moveTo(X(20), Y(600)); ctx.quadraticCurveTo(X(330), Y(540), X(630), Y(560)); ctx.stroke();
    // collect drawables with depth sorting by y
    const items = [];
    this.hit = [];
    const st = this.state;
    for (const b of BUILDINGS) {
      if (!st || !isBuilt(st, b.id)) continue;
      if (b.upgradeOf) continue; // drawn as its base building
      const [x, y] = b.plot;
      items.push({ y, fn: () => this.drawBuilding(ctx, b, X(x), Y(y), sc * depthAt(y)) });
    }
    if (this.next) {
      const [x, y] = this.next.plot;
      const k = depthAt(y);
      const already = this.next.upgradeOf && isBuilt(st, this.next.upgradeOf);
      if (!already) items.push({ y, fn: () => { draw(ctx, 'site', X(x), Y(y), sc * k * 0.8, 0, 0.92); this.addHit('site', X(x), Y(y) - 90 * sc * k, 260 * sc * k, 220 * sc * k); } });
    }
    for (const e of this.eggs || []) {
      items.push({ y: e.y, fn: () => draw(ctx, Math.sin(this.time * 3 + e.x) > 0.85 ? 'nest_crack' : 'nest_1', X(e.x), Y(e.y), sc * depthAt(e.y) * 0.75, Math.sin(this.time * 6 + e.x) * 0.04) });
    }
    for (const p of this.penguins) {
      items.push({ y: p.y, fn: () => this.drawPenguin(ctx, p, X(p.x), Y(p.y), sc) });
    }
    // the player's penguin stands at the front, ready to go
    const hero = { y: 870, fn: () => {
      const fr = Math.floor(this.time * 1.2) % 5 === 0 ? 'p_idle_1' : 'p_idle_0';
      draw(ctx, fr, X(330), Y(872), sc * 0.5);
    } };
    items.push(hero);
    items.sort((a, b) => a.y - b.y);
    for (const it of items) it.fn();
    // smoke
    for (const p of this.puffs) {
      const k = p.t / 3;
      draw(ctx, 'puff_1', X(p.x + k * 30), Y(p.y - k * 120), sc * (0.5 + k * 0.8) * p.k, 0, 0.7 * (1 - k));
    }
    // rack bubble
    if (st) {
      const n = rackAmount(st);
      const rack = BUILDINGS.find((b) => b.id === 'fishrack');
      if (n > 0 && isBuilt(st, 'fishrack')) {
        const bx = X(rack.plot[0]), by = Y(rack.plot[1] - 260 * depthAt(rack.plot[1])) + Math.sin(this.time * 3) * 4;
        this.drawBubble(ctx, bx, by, '+' + n, sc);
        this.addHit('rack', bx, by + 20 * sc, 150 * sc, 110 * sc, 2);
      }
    }
    // snow
    ctx.fillStyle = '#ffffff';
    for (const f of this.flakes) {
      const x = ((f[0] * W + this.time * 20 * f[3]) % W);
      const y = ((f[1] * H + this.time * 36 * f[3]) % H);
      ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.arc(x, y, f[2], 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  drawBubble(ctx, x, y, text, sc) {
    const s = Math.max(0.7, sc * 1.6);
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#1e2350'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(0, 0, 46 * s, 28 * s, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-8 * s, 26 * s); ctx.lineTo(0, 40 * s); ctx.lineTo(8 * s, 26 * s); ctx.fill();
    draw(ctx, 'fish_0', -18 * s, 0, s * 0.45);
    ctx.font = `${Math.round(22 * s)}px GameFont, sans-serif`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#1e2350';
    ctx.fillText(text, 2 * s, 1);
    ctx.restore();
  }

  drawBuilding(ctx, b, x, y, s) {
    let sprite = b.sprite;
    if (b.id === 'fishrack' && isBuilt(this.state, 'rack2')) s *= 1.15;
    let k = 1;
    if (this.buildAnim && this.buildAnim.id === b.id) {
      const t = this.buildAnim.t;
      if (t < 0) { this.addHit(b.id, x, y, 1, 1); return; } // waits for the build list to close
      k = t < 0.4 ? Math.max(0.05, t / 0.4 * 1.15) : 1 + 0.15 * Math.max(0, 1 - (t - 0.4) / 0.4);
      if (t < 0.6 && Math.random() < 0.5) this.puffs.push({ x: b.plot[0] + (Math.random() - 0.5) * 200 * depthAt(b.plot[1]), y: b.plot[1] - 20, t: 1.5, k: depthAt(b.plot[1]) });
    }
    if (b.type === 'kite') {
      draw(ctx, 'kite', x + Math.sin(this.time) * 20 * s, y - 330 * s + Math.sin(this.time * 1.4) * 14 * s, s * 0.8, Math.sin(this.time * 1.1) * 0.15);
      draw(ctx, 'v_baby_cheer', x, y, s * 0.9);
      this.addHit(b.id, x, y - 100 * s, 140 * s, 200 * s);
      return;
    }
    draw(ctx, sprite, x, y, s * k, 0, 1, false, 1, k);
    const fr = frame(sprite);
    if (fr) this.addHit(b.id, x, y - fr.py * s * 0.5, fr.w * s, fr.py * s);
    if (this.highlight === b.id && this.highlightT > 0) {
      draw(ctx, 'sparkle_gold', x + Math.cos(this.time * 4) * 80 * s, y - 160 * s + Math.sin(this.time * 4) * 40 * s, s * 0.8, this.time * 3, Math.min(1, this.highlightT));
    }
  }

  drawPenguin(ctx, p, x, y, sc) {
    let name;
    const t = p.walkT;
    const step = Math.floor(t * 6) % 4;
    const blink = Math.floor(this.time * 0.8 + p.x) % 7 === 0;
    if (p.kind === 'baby') {
      const pre = p.stage === 'adult' ? 'v_' + (p.babyKind || 'va') + '_' : p.stage === 'juv' ? 'v_juv_' : 'v_baby_';
      if (p.stage === 'adult') name = p.walking ? pre + 'walk' + step : pre + (blink ? 'blink' : 'idle');
      else if (p.stage === 'juv') name = p.walking ? pre + 'walk' + step : pre + 'idle';
      else name = p.walking ? pre + 'walk' + step : pre + (blink ? 'blink' : 'idle');
    } else {
      name = p.walking ? `v_${p.kind}_walk${step}` : `v_${p.kind}_${blink ? 'blink' : 'idle'}`;
    }
    const depth = depthAt(p.y) * 1.1;
    const k = p.spawnT < 1 ? 0.3 + 0.7 * p.spawnT : 1;
    draw(ctx, name, x, y, sc * depth * 0.62 * k, 0, 1, p.dir < 0);
  }

  addHit(id, cx, cy, w, h, pri = 1) { this.hit.push({ id, x: cx - w / 2, y: cy - h / 2, w, h, pri }); }

  hitTest(x, y) {
    let best = null;
    for (const r of this.hit) {
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
        if (!best || r.pri > best.pri || (r.pri === best.pri && r.y > best.y)) best = r;
      }
    }
    return best ? best.id : null;
  }
}
