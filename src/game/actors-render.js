// Penguin and blizzard drawing: frame choice by state, squash & stretch, scarf ribbon, shadow,
// the snow wall and the blizzard spirit's moods.
import { draw, frame } from './assets.js';

const TAU = Math.PI * 2;
const lerpAngle = (a, b, k) => {
  let d = b - a;
  while (d > Math.PI) d -= TAU;
  while (d < -Math.PI) d += TAU;
  return a + d * k;
};

export class PenguinRenderer {
  constructor() {
    this.angle = 0;
    this.squash = 1; this.squashV = 0;
    this.flapT = 0;
    this.landT = 0; this.landKind = null;
    this.happyT = 0;
    this.scarf = [];
    for (let i = 0; i < 7; i++) this.scarf.push({ x: 0, y: 0, vx: 0, vy: 0 });
    this.scarfInit = false;
    this.caughtT = 0;
    this.size = 205; // world units across the sprite
    this.worry = 0;
  }

  reset() { this.scarfInit = false; this.landT = 0; this.happyT = 0; this.caughtT = 0; this.angle = 0; this.squash = 1; this.squashV = 0; }

  onEvent(e) {
    if (e.type === 'takeoff') { this.flapT = 0.36; this.squashV -= 3.5; }
    if (e.type === 'land') {
      this.landKind = e.kind; this.landT = e.kind === 'bonk' ? 0.5 : 0.18;
      this.squashV += e.kind === 'bonk' ? 9 : e.kind === 'perfect' ? 6 : 4;
      if (e.kind === 'perfect') this.happyT = 0.6;
    }
    if (e.type === 'caught') this.caughtT = 0.0001;
  }

  update(dt, sim, pressing) {
    const p = sim.p;
    // spring squash (1 = rest)
    const target = p.ground ? (pressing ? 0.9 : 1) : 1.04;
    this.squashV += (target - this.squash) * 160 * dt;
    this.squashV *= Math.max(0, 1 - 14 * dt);
    this.squash += this.squashV * dt;
    this.squash = Math.max(0.7, Math.min(1.3, this.squash));
    if (this.flapT > 0) this.flapT -= dt;
    if (this.landT > 0) this.landT -= dt;
    if (this.happyT > 0) this.happyT -= dt;
    if (this.caughtT > 0) this.caughtT += dt;
    let want;
    if (p.ground) want = Math.atan(p.slope || 0);
    else {
      const va = Math.atan2(p.vy, p.vx);
      want = Math.max(-1.1, Math.min(1.0, va));
      if (pressing) want = Math.max(-1.25, va - 0.15);
    }
    this.angle = lerpAngle(this.angle, want, Math.min(1, (p.ground ? 18 : 6) * dt));
    const gap = sim.gap;
    const wt = gap < sim.balance.blizzard.dangerGap ? 1 : 0;
    this.worry += (wt - this.worry) * Math.min(1, 4 * dt);
  }

  pickFrame(sim, pressing, time) {
    const p = sim.p;
    if (sim.state === 'caught') return 'snowball_' + (Math.floor(time * 6) % 2);
    if (p.ground) {
      if (this.landT > 0 && this.landKind === 'bonk') return 'p_bonk';
      if (this.landT > 0 && this.landKind === 'perfect') return 'p_land';
      if (p.fever > 0) return 'p_slide_fever';
      if (this.worry > 0.5 && Math.floor(time * 2.5) % 3 === 0) return 'p_slide_worry';
      if (this.happyT > 0 || !pressing) return 'p_slide_happy';
      return Math.floor(p.x / 120) % 2 ? 'p_slide_1' : 'p_slide_0';
    }
    if (sim.state === 'crossing') return p.vy > 0 ? 'p_soar' : 'p_fly_1';
    if (pressing) return 'p_dive';
    if (this.flapT > 0) return ['p_fly_2', 'p_fly_1', 'p_fly_0', 'p_fly_1'][Math.floor((0.36 - this.flapT) / 0.09) % 4];
    if (p.vy > 250) return 'p_soar';
    return Math.floor(time * 5) % 6 === 0 ? 'p_fly_0' : 'p_fly_1';
  }

  neckOffset(name) {
    // scarf knot position baked by the art pipeline (relative to the pivot, packed px)
    const fr = frame(name);
    if (fr && fr.ax !== undefined) return [fr.ax, fr.ay];
    return [0, -70];
  }

  render(ctx, cam, sim, pressing, time, world) {
    const p = sim.p;
    const z = cam.z;
    const name = this.pickFrame(sim, pressing, time);
    const fr = frame(name);
    if (!fr) return;
    const scale = (this.size / 250) * z;
    const sx = cam.toScreenX(p.x), sy = cam.toScreenY(p.y);
    // shadow on the ground while airborne helps judge the landing
    if (!p.ground && sim.state === 'run') {
      const gy = world.heightAt(p.x);
      const h = p.y - gy;
      const k = Math.max(0, 1 - h / 1600);
      ctx.globalAlpha = 0.25 * k + 0.05;
      ctx.fillStyle = '#26306e';
      ctx.beginPath();
      ctx.ellipse(sx, cam.toScreenY(gy) + 2, (40 + 30 * k) * z, (10 + 6 * k) * z, 0, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    const caught = sim.state === 'caught';
    const rot = caught ? 0 : -this.angle;
    // scarf ribbon (behind the body)
    if (!caught) this.drawScarf(ctx, cam, sim, name, scale, rot, sx, sy, time);
    const sq = this.squash;
    if (caught) {
      draw(ctx, name, sx, sy, scale * 1.05, Math.sin(this.caughtT * 8) * 0.1);
    } else {
      draw(ctx, name, sx, sy, scale, rot, 1, false, 1 / Math.sqrt(sq), sq);
    }
    if (this.landT > 0 && this.landKind === 'bonk') {
      for (let i = 0; i < 3; i++) {
        const a = time * 6 + (i * TAU) / 3;
        draw(ctx, 'dizzy', sx + Math.cos(a) * 46 * z * 1.4, sy - 110 * z + Math.sin(a) * 16 * z, z * 0.5, a);
      }
    }
  }

  drawScarf(ctx, cam, sim, name, scale, rot, sx, sy, time) {
    const p = sim.p;
    const [nx, ny] = this.neckOffset(name);
    const c = Math.cos(rot), s = Math.sin(rot);
    const ax = sx + (nx * c - ny * s) * scale;
    const ay = sy + (nx * s + ny * c) * scale;
    const pts = this.scarf;
    if (!this.scarfInit) {
      for (const q of pts) { q.x = ax; q.y = ay; q.vx = 0; q.vy = 0; }
      this.scarfInit = true;
    }
    // world velocity in screen space pushes the ribbon backwards
    // direction the ribbon streams: opposite to motion, sagging a little, fluttering
    const mvx = p.ground ? Math.cos(this.angle) : p.vx, mvy = p.ground ? -Math.sin(this.angle) : -p.vy;
    const ml = Math.hypot(mvx, mvy) || 1;
    const speed = p.ground ? p.s : Math.hypot(p.vx, p.vy);
    const stream = Math.min(1, speed / 900);
    const seg = 13 * cam.z * (this.size / 150) * 1.25;
    pts[0].x = ax; pts[0].y = ay;
    for (let i = 1; i < pts.length; i++) {
      const q = pts[i];
      const pr = pts[i - 1];
      const flutter = Math.sin(time * 16 - i * 0.8) * 0.45 * stream;
      // target = previous point + backward vector (blend of stream direction and gravity)
      let bx = -mvx / ml * stream, by = -mvy / ml * stream + (1 - stream) * 1 + 0.25;
      const bl = Math.hypot(bx, by) || 1; bx /= bl; by /= bl;
      const tx = pr.x + (bx - by * flutter) * seg, ty = pr.y + (by + bx * flutter) * seg;
      q.x += (tx - q.x) * 0.55; q.y += (ty - q.y) * 0.55;
      const dx = q.x - pr.x, dy = q.y - pr.y;
      const d = Math.hypot(dx, dy) || 1;
      q.x = pr.x + (dx / d) * seg; q.y = pr.y + (dy / d) * seg;
    }
    const path = new Path2D();
    path.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (pts[i].x + pts[i + 1].x) / 2, my = (pts[i].y + pts[i + 1].y) / 2;
      path.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
    }
    path.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    const w = Math.max(2.5, 15 * cam.z * (this.size / 150));
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1e2350'; ctx.lineWidth = w + Math.max(2.5, 6 * cam.z); ctx.stroke(path);
    ctx.strokeStyle = '#e8423f'; ctx.lineWidth = w; ctx.stroke(path);
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = Math.max(1.2, w * 0.22);
    ctx.setLineDash([w * 0.6, w * 0.9]); ctx.stroke(path); ctx.setLineDash([]);
  }
}

export class BlizzardRenderer {
  constructor() {
    this.streaks = [];
    for (let i = 0; i < 26; i++) this.streaks.push({ x: Math.random(), y: Math.random(), l: 0.4 + Math.random() * 0.6, v: 0.6 + Math.random() * 0.8 });
    this.flakes = [];
    for (let i = 0; i < 50; i++) this.flakes.push({ x: Math.random(), y: Math.random(), r: 1 + Math.random() * 3, v: 0.3 + Math.random() });
    this.faceX = -400;
    this.mood = 'blow';
    this.laughT = 0;
    this.quality = 2;
  }

  // The blizzard always sits at the left edge: how far it has come in tells you how close it is.
  render(ctx, cam, sim, time, W, H) {
    const caught = sim.state === 'caught';
    const B = sim.balance.blizzard;
    const gap = sim.gap;
    const close = caught ? 1 : Math.max(0, Math.min(1, 1 - gap / B.maxGap));
    this.closeS = (this.closeS ?? close) + (close - (this.closeS ?? close)) * 0.12;
    const c = this.closeS;
    const size = Math.min(W * 0.7, 330);
    const targetX = caught ? W * 0.34 : W * (-0.1 + 0.48 * c);
    this.faceX += (targetX - this.faceX) * 0.15;
    const wallX = this.faceX + size * 0.12;
    // wall body
    if (wallX > -40) {
      const g = ctx.createLinearGradient(Math.max(0, wallX - 170), 0, wallX + 40, 0);
      g.addColorStop(0, 'rgba(236,243,255,0.97)');
      g.addColorStop(0.7, 'rgba(225,236,255,0.6)');
      g.addColorStop(1, 'rgba(225,236,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      const n = 14;
      for (let i = 0; i <= n; i++) {
        const y = (i / n) * H;
        const wob = Math.sin(time * 3 + i * 1.3) * 16 + Math.sin(time * 5.1 + i * 2.7) * 8;
        ctx.lineTo(Math.max(0, wallX + wob + 40), y);
      }
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fill();
    }
    // streaks blowing forward out of the wall, longer and denser when close
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineCap = 'round';
    const count = Math.round((this.quality >= 2 ? this.streaks.length : this.quality === 1 ? 16 : 9) * (0.35 + 0.65 * c));
    const span = Math.max(120, wallX + 160 + c * W * 0.5);
    for (let i = 0; i < count; i++) {
      const s = this.streaks[i];
      const x = ((s.x * span + time * (380 + 300 * c) * s.v) % span) - 60;
      const y = s.y * H;
      ctx.lineWidth = 2 + s.l * 3;
      ctx.globalAlpha = (0.2 + 0.6 * s.l) * (0.5 + 0.5 * c);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 40 + 90 * s.l, y - 6); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // snow flakes everywhere, denser when close
    const nf = Math.floor(this.flakes.length * (0.25 + 0.75 * c) * (this.quality >= 1 ? 1 : 0.5));
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < nf; i++) {
      const f = this.flakes[i];
      const x = ((f.x * W * 1.2 + time * (160 + 260 * c) * f.v) % (W * 1.2)) - W * 0.1;
      const y = ((f.y * H + time * 70 * f.v + Math.sin(time * 2 + i) * 10) % H);
      ctx.globalAlpha = 0.5 + 0.4 * f.v;
      ctx.beginPath(); ctx.arc(x, y, f.r, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // the spirit's face
    let mood;
    if (caught) mood = 'laugh';
    else if (gap < B.dangerGap) mood = 'grin';
    else if (c < 0.12) mood = 'sulk';
    else mood = Math.floor(time * 3) % 2 ? 'blow0' : 'blow1';
    const p = sim.p;
    const py = cam.toScreenY(p.y);
    const fy = Math.max(H * 0.3, Math.min(H * 0.68, py - 30));
    this.faceY = (this.faceY ?? fy) + (fy - (this.faceY ?? fy)) * 0.08;
    const sc = size / 410;
    const bob = Math.sin(time * 2.4) * 8;
    draw(ctx, 'bz_' + mood, this.faceX - size * 0.18, this.faceY + bob, sc, Math.sin(time * 1.3) * 0.05);
    // frost overlay when very close
    if (c > 0.68 && !caught) {
      const a = Math.min(1, (c - 0.68) * 3.2) * (0.6 + 0.4 * Math.sin(time * 8));
      const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
      g.addColorStop(0, 'rgba(220,235,255,0)');
      g.addColorStop(1, `rgba(220,235,255,${(0.55 * a).toFixed(3)})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }
  }
}
