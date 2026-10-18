// Draws the world behind and around the penguin: sky, parallax layers, the next island on the
// horizon, terrain with its painted snow, objects, fish and decor.
import BIOMES from '../data/biomes.json';
import { draw, bg, frame } from './assets.js';
import { SEA_LEVEL } from '../core/world.js';

const TAU = Math.PI * 2;

export class WorldRenderer {
  constructor() {
    this.skyCache = {};
    this.stars = [];
    for (let i = 0; i < 70; i++) this.stars.push([Math.random(), Math.random() * 0.62, 0.6 + Math.random() * 1.6, Math.random() * TAU]);
    this.pattern = {};
    this.time = 0;
    this.quality = 2;
    this.labelCache = {};
  }

  sky(ctx, biome, W, H) {
    const key = biome + W + 'x' + H;
    let c = this.skyCache[key];
    if (!c) {
      c = document.createElement('canvas');
      c.width = 4; c.height = Math.max(64, Math.round(H / 4));
      const g = c.getContext('2d');
      const B = BIOMES[biome] || BIOMES.dawn;
      const gr = g.createLinearGradient(0, 0, 0, c.height);
      gr.addColorStop(0, B.sky[0]); gr.addColorStop(0.62, B.sky[1]); gr.addColorStop(1, B.sky[2]);
      g.fillStyle = gr; g.fillRect(0, 0, 4, c.height);
      this.skyCache[key] = c;
    }
    return c;
  }

  // background layers. t01 = biome blend (0 = from, 1 = to)
  drawBackground(ctx, cam, biome, prevBiome, blend, W, H, nextIsland, progress) {
    const drawSky = (b, a) => {
      ctx.globalAlpha = a;
      ctx.drawImage(this.sky(ctx, b, W, H), 0, 0, W, H);
      ctx.globalAlpha = 1;
    };
    if (prevBiome && blend < 1) { drawSky(prevBiome, 1); drawSky(biome, blend); } else drawSky(biome, 1);
    const B = BIOMES[biome] || BIOMES.dawn;
    const horizon = H * 0.62 + (cam.y + 300) * cam.z * 0.06; // drifts slightly with camera height
    const zk = Math.pow(Math.min(1, cam.z / (W / 1050)), 0.35);
    // stars + moon at night
    if (B.night) {
      ctx.fillStyle = '#ffffff';
      for (const [sx, sy, r, ph] of this.stars) {
        const a = 0.45 + 0.55 * Math.sin(this.time * 1.6 + ph);
        ctx.globalAlpha = a * (blend < 1 && !BIOMES[prevBiome]?.night ? blend : 1);
        ctx.beginPath(); ctx.arc(((sx * W * 1.3 - cam.x * cam.z * 0.01) % (W * 1.3) + W * 1.3) % (W * 1.3) - W * 0.15, sy * H, r, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
      const moon = bg('moon');
      if (moon) ctx.drawImage(moon, W * 0.62, H * 0.06, W * 0.38, W * 0.38);
      if (biome === 'aurora' || biome === 'stars') {
        const au = bg('aurora');
        if (au) {
          const aw = W * 1.6, ah = aw * 384 / 1024;
          const off = ((-cam.x * cam.z * 0.02 + this.time * 8) % aw + aw) % aw;
          ctx.globalAlpha = 0.65 + 0.2 * Math.sin(this.time * 0.7);
          for (let x = off - aw; x < W; x += aw) ctx.drawImage(au, x, H * 0.02, aw, ah);
          ctx.globalAlpha = 1;
        }
      }
    } else {
      const sun = bg('sun');
      if (sun) {
        const s = W * 0.7;
        ctx.drawImage(sun, W * 0.62 - s / 2 + 40, H * 0.13 - s / 2 + 40, s, s);
      }
    }
    // far mountains
    this.strip(ctx, 'far_' + biome, cam, 0.05, horizon - W * 0.42 * zk, W * 1.1 * zk, W, prevBiome && blend < 1 ? 'far_' + prevBiome : null, blend);
    // sea band at the horizon
    const sea = B.sea;
    const sg = ctx.createLinearGradient(0, horizon - 4, 0, horizon + H * 0.3);
    sg.addColorStop(0, sea[0]); sg.addColorStop(1, sea[1]);
    ctx.fillStyle = sg;
    ctx.fillRect(0, horizon - 4, W, H);
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    for (let i = 0; i < 6; i++) {
      const y = horizon + 6 + i * i * 5;
      const x = ((i * 97 - cam.x * cam.z * (0.02 + i * 0.01)) % W + W) % W;
      ctx.fillRect(x, y, 30 + i * 6, 2);
      ctx.fillRect((x + W * 0.5) % W, y + 3, 18 + i * 4, 2);
    }
    // the next island on the horizon (always in sight: "almost there")
    if (nextIsland) {
      const img = bg('isle_' + nextIsland.biome);
      if (img) {
        const near = progress; // 0..1 through the current island
        const sc = (0.32 + 0.5 * near * near) * W / 512;
        const ix = W * (0.98 - 0.26 * near) - 256 * sc * 0.5;
        const iy = horizon + 8 - 212 * sc;
        ctx.drawImage(img, ix, iy, 512 * sc, 256 * sc);
      }
    }
    // mid hills
    this.strip(ctx, 'mid_' + biome, cam, 0.16, horizon - W * 0.12 * zk, W * 0.92 * zk, W, prevBiome && blend < 1 ? 'mid_' + prevBiome : null, blend);
    return horizon;
  }

  strip(ctx, name, cam, par, y, w, W, prevName, blend) {
    const img = bg(name);
    const h = w * (name.startsWith('far') ? 384 : 320) / 1024;
    const pimg = prevName ? bg(prevName) : null;
    const off = ((-cam.x * cam.z * par) % w + w) % w;
    if (pimg) {
      for (let x = off - w; x < W; x += w) ctx.drawImage(pimg, x, y, w + 1, h);
      ctx.globalAlpha = blend;
    }
    if (img) for (let x = off - w; x < W; x += w) ctx.drawImage(img, x, y, w + 1, h);
    ctx.globalAlpha = 1;
  }

  clouds(ctx, cam, W, H, biome) {
    if (BIOMES[biome]?.night) return;
    for (let i = 0; i < 4; i++) {
      const par = 0.03 + i * 0.015;
      const span = W * 1.8;
      const x = ((i * 433 - cam.x * cam.z * par - this.time * (6 + i * 3)) % span + span) % span - W * 0.4;
      const y = H * (0.12 + 0.09 * i) + Math.sin(i * 1.7) * 20;
      draw(ctx, 'cloud_' + (i % 3), x, y, (W / 390) * (0.42 + 0.1 * (i % 2)), 0, 0.9);
    }
  }

  texture(ctx, name) {
    if (this.pattern[name]) return this.pattern[name];
    const img = bg(name);
    if (!img) return null;
    this.pattern[name] = ctx.createPattern(img, 'repeat');
    return this.pattern[name];
  }

  // terrain polygon across the screen
  drawTerrain(ctx, cam, world, W, H) {
    const z = cam.z;
    const x0 = cam.left - 40, x1 = cam.right + 40;
    const stepPx = this.quality >= 2 ? 5 : this.quality === 1 ? 7 : 10;
    const step = stepPx / z;
    // group by island so each one gets its own colors and cliff edges
    for (const isl of world.islands) {
      const a = Math.max(x0, isl.startX - 300), b = Math.min(x1, isl.endX + 300);
      if (a >= b) continue;
      const B = BIOMES[isl.biome] || BIOMES.dawn;
      const cloud = isl.surface === 'cloud';
      const pts = [];
      for (let x = a; x <= b + step; x += step) {
        const xx = Math.min(x, b);
        pts.push(cam.toScreenX(xx), cam.toScreenY(world.drawHeightAt(xx)));
        if (xx === b) break;
      }
      const path = new Path2D();
      path.moveTo(pts[0], H + 20);
      for (let i = 0; i < pts.length; i += 2) path.lineTo(pts[i], pts[i + 1]);
      path.lineTo(pts[pts.length - 2], H + 20);
      path.closePath();
      // body gradient (screen space, keyed to the surface height so it reads as depth)
      const topY = Math.min(...pts.filter((_, i) => i % 2 === 1));
      const gr = ctx.createLinearGradient(0, topY, 0, topY + Math.max(260, 900 * z));
      gr.addColorStop(0, B.terrain[0]); gr.addColorStop(0.45, B.terrain[1]); gr.addColorStop(1, B.terrain[2]);
      ctx.fillStyle = gr;
      ctx.fill(path);
      ctx.save();
      ctx.clip(path);
      // painted strata following the surface
      const surf = new Path2D();
      surf.moveTo(pts[0], pts[1]);
      for (let i = 2; i < pts.length; i += 2) surf.lineTo(pts[i], pts[i + 1]);
      ctx.lineJoin = 'round';
      if (this.quality >= 1) {
        ctx.save(); ctx.translate(0, 120 * z + 26); ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 40 * z + 12; ctx.stroke(surf); ctx.restore();
        ctx.save(); ctx.translate(0, 300 * z + 40); ctx.strokeStyle = 'rgba(120,140,210,0.16)'; ctx.lineWidth = 70 * z + 16; ctx.stroke(surf); ctx.restore();
      }
      // texture overlay
      const pat = this.texture(ctx, cloud ? 'tex_cloud' : 'tex_snow');
      if (pat && this.quality >= 1) {
        const m = new DOMMatrix();
        const ts = Math.max(0.35, z * 1.6);
        pat.setTransform(m.translate(cam.toScreenX(0) % (256 * ts), cam.toScreenY(0) % (256 * ts)).scale(ts));
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = pat;
        ctx.fillRect(0, topY - 10, W, H - topY + 20);
        ctx.globalAlpha = 1;
      }
      // rim light under the surface edge
      ctx.strokeStyle = B.rim; ctx.lineWidth = 34 * z + 8; ctx.globalAlpha = 0.85; ctx.stroke(surf); ctx.globalAlpha = 1;
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 14 * z + 5; ctx.stroke(surf);
      // ice patches
      if (isl.ice.length) this.drawIce(ctx, cam, world, isl);
      ctx.restore();
      if (cloud) this.cloudBumps(ctx, cam, world, isl, a, b);
      // outline
      ctx.strokeStyle = '#1e2350'; ctx.lineWidth = Math.max(2.2, 7 * z); ctx.stroke(surf);
      // launch ramp chevrons
      if (isl.rampX > a - 600 && isl.rampX < b + 600) this.drawRamp(ctx, cam, isl);
    }
  }

  drawIce(ctx, cam, world, isl) {
    const z = cam.z;
    for (const [a, b] of isl.ice) {
      if (b < cam.left - 50 || a > cam.right + 50) continue;
      const p = new Path2D();
      const st = 8 / z;
      let first = true;
      for (let x = a; x <= b; x += st) {
        const sx = cam.toScreenX(x), sy = cam.toScreenY(isl.heightAt(x));
        if (first) { p.moveTo(sx, sy); first = false; } else p.lineTo(sx, sy);
      }
      ctx.strokeStyle = '#4fb6e8'; ctx.lineWidth = 60 * z + 10; ctx.globalAlpha = 0.55; ctx.stroke(p);
      ctx.strokeStyle = '#9be7ff'; ctx.lineWidth = 30 * z + 8; ctx.globalAlpha = 0.95; ctx.stroke(p);
      ctx.globalAlpha = 1;
      // glints
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = Math.max(1.5, 5 * z);
      for (let x = a + 60; x < b - 40; x += 160) {
        const sx = cam.toScreenX(x), sy = cam.toScreenY(isl.heightAt(x)) + 10 * z + 4;
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + 40 * z, sy - 4 * z); ctx.stroke();
      }
    }
  }

  cloudBumps(ctx, cam, world, isl, a, b) {
    const z = cam.z;
    ctx.fillStyle = '#ffffff';
    const s0 = Math.floor(a / 90) * 90;
    for (let x = s0; x < b; x += 90) {
      const y = world.drawHeightAt(x);
      const r = (38 + 14 * Math.sin(x * 0.013)) * z;
      ctx.beginPath(); ctx.arc(cam.toScreenX(x), cam.toScreenY(y) + r * 0.55, r, 0, TAU); ctx.fill();
    }
  }

  drawRamp(ctx, cam, isl) {
    const z = cam.z;
    const a = isl.rampX + 120, b = isl.endX - 80;
    for (let x = a; x < b; x += 190) {
      const y = isl.heightAt(x);
      const d = (isl.heightAt(x + 5) - isl.heightAt(x - 5)) / 10;
      draw(ctx, 'ramp', cam.toScreenX(x), cam.toScreenY(y) + 34 * z, z * 0.8, -Math.atan(d), 0.9);
    }
  }

  drawDecor(ctx, cam, world, front = false) {
    const z = cam.z;
    for (const isl of world.islands) {
      if (isl.endX < cam.left - 400 || isl.startX > cam.right + 400) continue;
      for (const d of isl.decor) {
        if (d.x < cam.left - 300 || d.x > cam.right + 300) continue;
        const y = isl.heightAt(d.x);
        const sx = cam.toScreenX(d.x), sy = cam.toScreenY(y) + 6 * z;
        const sc = (d.s || 1) * z * 0.95;
        let name = null;
        switch (d.type) {
          case 'pine': name = 'pine_' + ((d.v || 0) % 3); break;
          case 'rock': name = 'rock_' + ((d.v || 0) % 3); break;
          case 'crystal': name = 'crystal_' + (isl.biome === 'aurora' ? 2 : isl.biome === 'stars' ? 3 : (d.v || 0) % 2); break;
          case 'snowman': name = 'snowman'; break;
          case 'spire': name = 'spire_' + ((d.v || 0) % 2); break;
          case 'balloon': {
            draw(ctx, 'balloon', sx, sy - (420 + 60 * Math.sin(this.time + d.x)) * z, sc * 0.9);
            continue;
          }
          case 'star': draw(ctx, 'star', sx, sy - (320 + 40 * Math.sin(this.time * 1.3 + d.x)) * z, sc * 0.9); continue;
          case 'sign': this.drawSign(ctx, sx, sy, z, isl); continue;
          case 'flag': name = 'flag_ghost'; break;
          default: name = null;
        }
        if (name) draw(ctx, name, sx, sy, sc);
      }
      // geysers (vents; plumes are drawn by the effects layer)
      for (const g of isl.geysers) {
        if (g.x < cam.left - 200 || g.x > cam.right + 200) continue;
        const y = isl.heightAt(g.x);
        const sx = cam.toScreenX(g.x), sy = cam.toScreenY(y) + 8 * z;
        const t = this.time * 6 + g.x;
        if (!g.used) {
          draw(ctx, 'plume_' + (Math.floor(t) % 4), sx, sy - 4 * z, z * 0.9, 0, 0.55, false, 0.6, 0.5 + 0.08 * Math.sin(t));
        }
        draw(ctx, 'geyser_vent', sx, sy, z * 1.2);
      }
    }
  }

  drawSign(ctx, sx, sy, z, isl) {
    draw(ctx, 'sign', sx, sy, z * 1.4);
    const fr = frame('sign');
    if (!fr) return;
    const name = isl.displayName || '';
    if (!name) return;
    const s = z * 1.4;
    ctx.save();
    ctx.translate(sx, sy - fr.py * s + 100 * s * 0.7);
    const fs = Math.max(9, 30 * s);
    ctx.font = `${fs}px GameFont, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff6e6';
    ctx.lineWidth = fs * 0.22; ctx.strokeStyle = '#5a2f17';
    let text = name;
    const maxW = 200 * s;
    while (ctx.measureText(text).width > maxW && ctx.font) { ctx.font = `${(parseFloat(ctx.font) * 0.92).toFixed(1)}px GameFont, sans-serif`; if (parseFloat(ctx.font) < 7) break; }
    ctx.strokeText(text, 0, 0); ctx.fillText(text, 0, 0);
    ctx.restore();
  }

  drawWind(ctx, cam, isl) {
    const z = cam.z;
    for (const w of isl.wind) {
      if (w.x + w.w < cam.left - 100 || w.x > cam.right + 100) continue;
      const gy = isl.heightAt(w.x + w.w / 2);
      const sx = cam.toScreenX(w.x + w.w / 2);
      const fr = Math.floor(this.time * 8) % 4;
      const segH = 384 * 0.5 * 1.6;
      for (let y = 0; y < w.h; y += segH / (z * 1.6) * z * 1.6 / z) {
        const sy = cam.toScreenY(gy + y + segH * 0.5);
        if (sy < -200 || sy > cam.H + 200) continue;
        draw(ctx, 'wind_' + ((fr + Math.floor(y / 300)) % 4), sx, sy, z * 1.6 * (w.w / 320), 0, 0.7);
      }
    }
  }

  drawRings(ctx, cam, isl, part) {
    const z = cam.z;
    for (const r of isl.rings) {
      if (r.x < cam.left - 200 || r.x > cam.right + 200) continue;
      const sx = cam.toScreenX(r.x), sy = cam.toScreenY(r.y);
      const s = z * (r.r / 100) * 1.25;
      const a = r.used ? Math.max(0, 1 - (r.fade || 0)) : 1;
      if (a <= 0) continue;
      draw(ctx, part === 'back' ? 'ring_back' : 'ring_front', sx, sy, s * (r.used ? 1 + (r.fade || 0) : 1), 0, a);
    }
  }

  drawFish(ctx, cam, isl, time) {
    const z = cam.z;
    const L = cam.left - 80, R = cam.right + 80;
    const wig = Math.floor(time * 4) % 2;
    for (const f of isl.fish) {
      if (f.taken || f.x < L) continue;
      if (f.x > R) break;
      const bob = Math.sin(time * 3 + f.x * 0.01) * 8;
      const sx = cam.toScreenX(f.x), sy = cam.toScreenY(f.y + bob);
      if (f.gold) {
        draw(ctx, 'gold_' + wig, sx, sy, z * 1.05);
        const tw = (Math.sin(time * 5 + f.x) + 1) * 0.5;
        draw(ctx, 'sparkle_gold', sx + 30 * z, sy - 26 * z, z * (0.4 + tw * 0.5), time * 2, 0.4 + tw * 0.6);
      } else {
        draw(ctx, 'fish_' + wig, sx, sy, z * 0.95);
      }
    }
  }

  drawSea(ctx, cam, world, W, H) {
    // water in island gaps (foreground)
    const sy = cam.toScreenY(SEA_LEVEL);
    if (sy > H) return;
    const B = BIOMES[world.islandAt(cam.x).biome] || BIOMES.dawn;
    const g = ctx.createLinearGradient(0, sy, 0, H);
    g.addColorStop(0, B.sea[0]); g.addColorStop(1, B.sea[1]);
    ctx.fillStyle = g;
    ctx.fillRect(0, sy, W, H - sy);
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 12) {
      const y = sy + Math.sin(x * 0.05 + this.time * 2 + cam.x * cam.z * 0.05) * 3;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}
