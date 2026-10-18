// Side-view camera for a portrait screen. Zooms out with speed and altitude so a big launch shows
// the hills behind and the next island ahead; zooms back in on the ground for timing precision.
export class Camera {
  constructor() {
    this.x = 0; this.y = 0; this.z = 0.35;
    this.W = 390; this.H = 844;
    this.anchor = 0.3;
    this.shakeT = 0; this.shakeA = 0;
    this.sx = 0; this.sy = 0;
    this.punch = 0;
    this.lowY = 0;
    this.override = null; // cinematic control {x,y,z}
  }

  resize(W, H) { this.W = W; this.H = H; }

  baseZoom(viewWidth) {
    // keep the same world width visible on every phone; cap for very tall/thin or wide screens
    const z = this.W / viewWidth;
    return Math.min(z, this.H / (viewWidth * 1.45));
  }

  snap(sim) { this.update(sim, 1, true); }

  update(sim, dt, snap = false) {
    const p = sim.p;
    const world = sim.world;
    const speed = p.ground ? p.s : Math.hypot(p.vx, p.vy);
    const sn = Math.min(1, Math.max(0, (speed - 500) / 1700));
    const viewW = 1050 + 560 * sn;
    let zt = this.baseZoom(viewW);
    // look-ahead/behind: at height shift the penguin toward center to reveal the trail behind
    const ground = world.heightAt(p.x);
    const alt = Math.max(0, p.y - ground);
    const altN = Math.min(1, alt / 1400);
    const crossing = sim.state === 'crossing';
    const anchorT = 0.3 + 0.1 * altN + (crossing ? 0.08 : 0);
    // lowest terrain in view (sampled) so valleys stay on screen
    const span = this.W / zt;
    let low = Infinity;
    const x0 = p.x - span * anchorT, x1 = p.x + span * (1 - anchorT);
    for (let i = 0; i <= 12; i++) {
      const y = world.heightAt(x0 + (x1 - x0) * i / 12);
      if (y < low) low = y;
    }
    // sea crossing: keep the penguin readable; the next island comes into view ahead of it
    if (crossing) low = Math.max(Math.min(low, sim.crossing.y1 - 200), p.y - 1250);
    low = Math.max(low, -700);
    const topMargin = this.H * 0.2, bottom = this.H * 0.8;
    const need = (p.y - low) + 60;
    const zFit = (bottom - topMargin) / Math.max(need, 1);
    if (zFit < zt) zt = zFit;
    if (crossing) zt = Math.min(zt, this.baseZoom(1750));
    zt = Math.max(zt, this.baseZoom(5200));
    if (snap) {
      this.z = zt; this.anchor = anchorT; this.lowY = low;
    } else {
      // zoom out quickly (keep the penguin visible), zoom in gently
      const kz = zt < this.z ? 4.5 : 1.6;
      this.z += (zt - this.z) * Math.min(1, kz * dt);
      this.anchor += (anchorT - this.anchor) * Math.min(1, 2 * dt);
      const kl = low < this.lowY ? 5 : 2.2;
      this.lowY += (low - this.lowY) * Math.min(1, kl * dt);
    }
    this.x = p.x;
    // camera y: world y shown at screen y = H*0.8 is lowY
    this.y = this.lowY;
    // keep the penguin under the top margin even mid-zoom
    const py = this.toScreenY(p.y);
    if (py < topMargin) this.y += (topMargin - py) / this.z;
    if (this.override) {
      const o = this.override;
      this.x = o.x; this.y = o.y; this.z = o.z; this.anchor = o.anchor ?? this.anchor;
    }
    // shake
    if (this.shakeT > 0) {
      this.shakeT -= dt;
      const a = this.shakeA * Math.max(0, this.shakeT) * 4;
      this.sx = (Math.random() - 0.5) * a; this.sy = (Math.random() - 0.5) * a;
    } else { this.sx = this.sy = 0; }
  }

  shake(amount, time = 0.25) {
    this.shakeA = Math.max(this.shakeA * (this.shakeT > 0 ? 1 : 0), amount);
    this.shakeT = Math.max(this.shakeT, time);
  }

  toScreenX(wx) { return (wx - this.x) * this.z + this.W * this.anchor + this.sx; }
  toScreenY(wy) { return this.H * 0.8 - (wy - this.y) * this.z + this.sy; }
  toWorldX(sx) { return (sx - this.W * this.anchor - this.sx) / this.z + this.x; }
  toWorldY(sy) { return (this.H * 0.8 - sy + this.sy) / this.z + this.y; }
  get left() { return this.toWorldX(0); }
  get right() { return this.toWorldX(this.W); }
}
