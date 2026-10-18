// In-run HUD. Small, at the top edge (below the notch), never over the penguin's lane.
import { h, icon, button, onTap } from './dom.js';
import { t, formatNumber } from '../i18n/i18n.js';
import balance from '../data/balance.json';

export class HUD {
  constructor(app) {
    this.app = app;
    this.dist = h('div', { class: 'hud-dist' }, '0m');
    this.barFill = h('div', { class: 'hud-bar-fill' });
    this.barLabel = h('div', { class: 'hud-bar-label' });
    this.bar = h('div', { class: 'hud-bar' }, this.barFill, h('span', { class: 'hud-bar-isle' }, icon('map', 18)));
    this.left = h('div', { class: 'hud-left' }, this.dist, this.bar, this.barLabel);
    this.fishNum = h('span', { class: 'hud-fish-num' }, '0');
    this.fish = h('div', { class: 'hud-fish' }, icon('fish', 30), this.fishNum);
    this.pause = button('', { icon: 'pause', iconSize: 26, cls: 'btn-round btn-pause', aria: t('hud.pause'), onTap: () => app.pauseRun() });
    this.right = h('div', { class: 'hud-right' }, this.fish, this.pause);
    this.bannerTitle = h('div', { class: 'banner-title' });
    this.bannerSub = h('div', { class: 'banner-sub' });
    this.bannerEl = h('div', { class: 'banner hidden' }, this.bannerTitle, this.bannerSub);
    this.el = h('div', { class: 'hud' }, this.left, this.right, this.bannerEl);
    this.lastFish = -1; this.lastDist = -1; this.lastLabel = '';
  }

  reset() { this.lastFish = -1; this.lastDist = -1; this.lastLabel = ''; this.bannerEl.classList.add('hidden'); }

  update(scene) {
    const sim = scene.sim;
    const d = sim.distanceMeters;
    if (d !== this.lastDist) { this.dist.textContent = formatNumber(d) + 'm'; this.lastDist = d; }
    const f = sim.stats.fishValue;
    if (f !== this.lastFish) { this.fishNum.textContent = formatNumber(f); this.lastFish = f; }
    const isl = sim.island;
    const prog = Math.max(0, Math.min(1, (sim.p.x - isl.startX) / isl.length));
    this.barFill.style.transform = `scaleX(${prog.toFixed(3)})`;
    const rem = Math.max(0, Math.ceil((isl.endX - sim.p.x) / balance.display.unitsPerMeter));
    const label = sim.state === 'crossing' ? '' : t('hud.toNext', { m: rem });
    if (label !== this.lastLabel) { this.barLabel.textContent = label; this.lastLabel = label; }
  }

  bumpFish() {
    this.fish.classList.remove('bump');
    void this.fish.offsetWidth;
    this.fish.classList.add('bump');
  }

  banner(title, sub, kind) {
    this.bannerTitle.textContent = title;
    this.bannerSub.textContent = sub || '';
    this.bannerEl.className = 'banner ' + (kind || '');
    void this.bannerEl.offsetWidth;
    this.bannerEl.classList.add('show');
    this.app.cancel(this.bt);
    this.bt = this.app.later(() => { this.bannerEl.classList.remove('show'); this.bannerEl.classList.add('hidden'); }, 2600);
  }
}
