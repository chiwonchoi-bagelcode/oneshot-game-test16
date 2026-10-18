// Pooled sprite particles and floating text. Budget scales with the graphics setting so a burst
// of effects never drops the frame rate on low-end phones.
import { draw } from './assets.js';

export class Particles {
  constructor(max = 260) {
    this.pool = [];
    for (let i = 0; i < 400; i++) this.pool.push({ alive: false });
    this.max = max;
    this.count = 0;
  }

  setBudget(max) { this.max = max; }

  spawn(o) {
    if (this.count >= this.max) return null;
    for (const p of this.pool) {
      if (!p.alive) {
        p.alive = true;
        p.sprite = o.sprite; p.x = o.x; p.y = o.y; p.vx = o.vx || 0; p.vy = o.vy || 0;
        p.life = 0; p.max = o.life || 0.6; p.scale = o.scale || 1; p.scale1 = o.scale1 ?? p.scale;
        p.rot = o.rot || 0; p.vr = o.vr || 0; p.alpha = o.alpha ?? 1; p.grav = o.grav || 0; p.drag = o.drag ?? 0;
        p.world = o.world !== false; p.fadeIn = o.fadeIn || 0; p.frames = o.frames || null; p.fps = o.fps || 12;
        p.color = o.color || null; p.w = o.w || 0; p.h = o.h || 0;
        this.count++;
        return p;
      }
    }
    return null;
  }

  update(dt) {
    for (const p of this.pool) {
      if (!p.alive) continue;
      p.life += dt;
      if (p.life >= p.max) { p.alive = false; this.count--; continue; }
      p.vy -= p.grav * dt;
      if (p.drag) { const k = Math.max(0, 1 - p.drag * dt); p.vx *= k; p.vy *= k; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.rot += p.vr * dt;
    }
  }

  // world particles use world units (y up); screen particles use css px (y down)
  render(ctx, cam, worldLayer) {
    for (const p of this.pool) {
      if (!p.alive || p.world !== worldLayer) continue;
      const t = p.life / p.max;
      let a = p.alpha * (t > 0.6 ? 1 - (t - 0.6) / 0.4 : 1);
      if (p.fadeIn && p.life < p.fadeIn) a *= p.life / p.fadeIn;
      const sc = p.scale + (p.scale1 - p.scale) * t;
      const x = worldLayer ? cam.toScreenX(p.x) : p.x;
      const y = worldLayer ? cam.toScreenY(p.y) : p.y;
      const z = worldLayer ? cam.z : 1;
      if (p.color) {
        ctx.globalAlpha = a;
        ctx.fillStyle = p.color;
        ctx.save(); ctx.translate(x, y); ctx.rotate(p.rot);
        ctx.fillRect(-p.w * z * sc / 2, -p.h * z * sc / 2, p.w * z * sc, p.h * z * sc);
        ctx.restore();
        ctx.globalAlpha = 1;
        continue;
      }
      let spr = p.sprite;
      if (p.frames) spr = p.frames[Math.min(p.frames.length - 1, Math.floor(p.life * p.fps))];
      draw(ctx, spr, x, y, sc * z, p.rot, a);
    }
  }

  clear() { for (const p of this.pool) p.alive = false; this.count = 0; }
}

// Floating words ("Perfect!") and numbers (+10). At most two on screen; a new one pushes the old.
export class Floaters {
  constructor() { this.items = []; }

  add(text, opts = {}) {
    const it = {
      text, x: opts.x ?? 0, y: opts.y ?? 0, world: opts.world !== false, t: 0, life: opts.life || 1.1,
      size: opts.size || 26, color: opts.color || '#ffffff', stroke: opts.stroke || '#1e2350', rise: opts.rise ?? 60,
      pop: opts.pop ?? 1.25, kind: opts.kind || 'word', follow: opts.follow || null, ox: opts.ox || 0, oy: opts.oy || 0,
    };
    // only the newest of a kind that follows the penguin (height milestones) stays on screen
    if (it.follow) this.items = this.items.filter((i) => i.kind !== it.kind);
    if (it.kind === 'word') {
      const words = this.items.filter((i) => i.kind === 'word');
      if (words.length >= 2) words[0].t = Math.max(words[0].t, words[0].life * 0.8);
    }
    this.items.push(it);
    if (this.items.length > 6) this.items.shift();
  }

  update(dt) {
    for (const it of this.items) it.t += dt;
    this.items = this.items.filter((it) => it.t < it.life);
  }

  render(ctx, cam) {
    const placed = []; // labels riding with the penguin never overlap each other
    for (const it of this.items) {
      const k = it.t / it.life;
      const pop = k < 0.15 ? 1 + (it.pop - 1) * Math.sin((k / 0.15) * Math.PI) : 1;
      const a = k > 0.7 ? 1 - (k - 0.7) / 0.3 : 1;
      let x = it.follow ? cam.toScreenX(it.follow.x) + it.ox : it.world ? cam.toScreenX(it.x) : it.x;
      let y = (it.follow ? cam.toScreenY(it.follow.y) - it.oy : it.world ? cam.toScreenY(it.y) : it.y) - it.rise * Math.sqrt(k);
      const size = it.size * pop;
      ctx.globalAlpha = a;
      ctx.font = `${size.toFixed(1)}px GameFont, sans-serif`;
      if (it.follow) {
        // keep labels that ride with the penguin fully on screen (below the HUD)
        const half = ctx.measureText(it.text).width / 2 + size * 0.3;
        x = Math.max(half, Math.min(cam.W - half, x));
        y = Math.max(cam.H * 0.14 + size, y);
        for (let guard = 0; guard < 4; guard++) {
          const hit = placed.find((r) => Math.abs(r.y - y) < (r.s + size) * 0.55 && Math.abs(r.x - x) < r.h + half);
          if (!hit) break;
          y = hit.y + (hit.s + size) * 0.6;
        }
        placed.push({ x, y, h: half, s: size });
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';
      ctx.lineWidth = size * 0.26; ctx.strokeStyle = it.stroke;
      ctx.strokeText(it.text, x, y + size * 0.06);
      ctx.fillStyle = it.color;
      ctx.fillText(it.text, x, y);
      ctx.globalAlpha = 1;
    }
  }

  clear() { this.items = []; }
}
