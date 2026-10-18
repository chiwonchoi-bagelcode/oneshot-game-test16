// Prototype entry (replaced by the full app as systems come online).
import balance from './data/balance.json';
import { LEVELS } from './data/levels.js';
import { RunSim, STEP } from './core/run.js';
import { makeBot } from './core/bot.js';
import { Camera } from './game/camera.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
let W = 0, H = 0, dpr = 1;
const cam = new Camera();
function resize() {
  dpr = Math.min(2, window.devicePixelRatio || 1);
  W = window.innerWidth; H = window.innerHeight;
  canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
  cam.resize(W, H);
}
window.addEventListener('resize', resize);
resize();
document.getElementById('boot').classList.add('hide');

const params = new URLSearchParams(location.search);
const ups = params.get('ups') ? JSON.parse(params.get('ups')) : {};
let sim = new RunSim({ levels: LEVELS, balance, upgrades: ups, tutorial: false });
const bot = params.get('bot') ? makeBot(params.get('bot'), 1) : null;
let pressing = false;
canvas.addEventListener('pointerdown', () => { pressing = true; });
window.addEventListener('pointerup', () => { pressing = false; });
cam.snap(sim);

function draw() {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#5fb6ee'); g.addColorStop(0.7, '#cdeefe'); g.addColorStop(1, '#ffe9d6');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const w = sim.world;
  ctx.beginPath();
  const x0 = cam.left - 20, x1 = cam.right + 20;
  const step = 6 / cam.z;
  ctx.moveTo(cam.toScreenX(x0), H + 10);
  for (let x = x0; x <= x1; x += step) ctx.lineTo(cam.toScreenX(x), cam.toScreenY(w.drawHeightAt(x)));
  ctx.lineTo(cam.toScreenX(x1), H + 10);
  ctx.closePath();
  ctx.fillStyle = '#eaf4ff'; ctx.fill();
  ctx.lineWidth = 3; ctx.strokeStyle = '#2a3570'; ctx.stroke();
  // fish
  for (const isl of w.islands) for (const f of isl.fish) {
    if (f.taken) continue;
    const sx = cam.toScreenX(f.x), sy = cam.toScreenY(f.y);
    if (sx < -20 || sx > W + 20) continue;
    ctx.fillStyle = f.gold ? '#ffc833' : '#5aa0e8';
    ctx.beginPath(); ctx.ellipse(sx, sy, 16 * cam.z / 0.33, 9 * cam.z / 0.33, 0, 0, 7); ctx.fill();
  }
  // penguin
  const p = sim.p;
  const ang = p.ground ? Math.atan(p.slope || 0) : Math.atan2(p.vy, p.vx);
  ctx.save();
  ctx.translate(cam.toScreenX(p.x), cam.toScreenY(p.y));
  ctx.rotate(-ang);
  const s = cam.z;
  ctx.fillStyle = pressing ? '#1b2340' : '#2b3a78';
  ctx.beginPath(); ctx.ellipse(0, -40 * s, 70 * s, 40 * s, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#e8423f'; ctx.fillRect(20 * s, -70 * s, 20 * s, 40 * s);
  ctx.restore();
  // blizzard
  const bx = cam.toScreenX(sim.blizzardX);
  ctx.fillStyle = 'rgba(230,240,255,0.9)';
  ctx.fillRect(0, 0, Math.max(0, bx), H);
  ctx.fillStyle = '#23306b'; ctx.font = '16px sans-serif';
  ctx.fillText(`${sim.distanceMeters}m  v${(p.ground ? p.s : Math.hypot(p.vx, p.vy)).toFixed(0)}  gap ${sim.gap.toFixed(0)}  z ${cam.z.toFixed(2)}`, 12, 30);
}

let acc = 0, last = performance.now();
window.__sim = () => sim;
window.__advance = (sec, pressFn) => {
  const n = Math.round(sec / STEP);
  for (let i = 0; i < n; i++) {
    const pr = pressFn ? pressFn(sim) : (bot ? bot(sim) : pressing);
    pressing = pr;
    sim.step(STEP, pr);
    if (i % 2 === 0) cam.update(sim, STEP * 2);
  }
  sim.drainEvents();
  draw();
};
function frame(now) {
  if (window.__manual) return;
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  acc += dt;
  while (acc >= STEP) {
    const pr = bot ? bot(sim) : pressing;
    sim.step(STEP, pr); acc -= STEP;
  }
  sim.drainEvents();
  if (sim.state === 'caught') { sim = new RunSim({ levels: LEVELS, balance, upgrades: ups }); cam.snap(sim); }
  cam.update(sim, dt);
  draw();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
