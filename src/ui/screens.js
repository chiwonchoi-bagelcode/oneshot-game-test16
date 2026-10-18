// Title, village hub and results screens.
import { h, icon, button, onTap, setBadge, countUp, fit } from './dom.js';
import { t, formatNumber, name } from '../i18n/i18n.js';
import { anyUpgradeAffordable, anyBuildAffordable, featureOn, population, villagePct, villageStage, isBuilt, availableBuildings, rackAmount } from '../meta/economy.js';
import { streakClaimable, missionsClaimable, todayInfo } from '../meta/daily.js';
import balance from '../data/balance.json';

export class TitleScreen {
  constructor(app) {
    this.app = app;
    this.logo = h('div', { class: 'logo' }, h('div', { class: 'logo-main' }), h('div', { class: 'logo-sub' }));
    this.tap = h('div', { class: 'title-tap' });
    this.el = h('div', { class: 'title-screen' }, this.logo, this.tap);
    this.el.addEventListener('pointerdown', (e) => { e.stopPropagation(); });
    onTap(this.el, () => app.titleTapped());
  }
  onShow() {
    this.logo.querySelector('.logo-main').textContent = t('app.name');
    this.logo.querySelector('.logo-sub').textContent = t('app.tagline');
    this.tap.textContent = t('boot.tap');
  }
}

export class HubScreen {
  constructor(app) {
    this.app = app;
    this.fishNum = h('span', { class: 'pill-num' }, '0');
    this.fishPill = h('div', { class: 'pill fish-pill' }, icon('fish', 30), this.fishNum);
    this.stageLabel = h('div', { class: 'stage-label' });
    this.settingsBtn = button('', { icon: 'settings', iconSize: 30, cls: 'btn-round', aria: t('home.settings'), onTap: () => app.openSettings() });
    this.top = h('div', { class: 'hub-top' }, this.fishPill, this.stageLabel, this.settingsBtn);
    this.giftBtn = button(t('home.daily'), { icon: 'gift', iconSize: 34, cls: 'btn-side', badge: true, onTap: () => app.openDaily() });
    this.todayBtn = button(t('home.today'), { icon: 'daily', iconSize: 34, cls: 'btn-side', badge: true, onTap: () => app.openToday() });
    this.side = h('div', { class: 'hub-side' }, this.giftBtn, this.todayBtn);
    this.popPill = h('div', { class: 'pill pop-pill hidden' });
    this.btnUp = button(t('home.upgrades'), { icon: 'flap', iconSize: 36, cls: 'btn-tile', badge: true, onTap: () => app.openUpgrades() });
    this.btnBuild = button(t('home.build'), { icon: 'build', iconSize: 36, cls: 'btn-tile', badge: true, onTap: () => app.openBuild() });
    this.btnMap = button(t('home.map'), { icon: 'map', iconSize: 36, cls: 'btn-tile', badge: true, onTap: () => app.openMap() });
    this.btnMis = button(t('home.missions'), { icon: 'missions', iconSize: 36, cls: 'btn-tile', badge: true, onTap: () => app.openMissions() });
    this.tiles = h('div', { class: 'hub-tiles' }, this.btnUp, this.btnBuild, this.btnMap, this.btnMis);
    this.playBtn = button(t('home.play'), { icon: 'play', iconSize: 34, cls: 'btn-primary btn-play', onTap: () => app.startMainRun() });
    this.startLabel = h('div', { class: 'start-label hidden' });
    this.bottom = h('div', { class: 'hub-bottom' }, this.popPill, this.tiles, this.playBtn, this.startLabel);
    this.el = h('div', { class: 'hub' }, this.top, this.side, this.bottom);
    // village touch: drag to pan, tap buildings
    this.el.addEventListener('pointerdown', (e) => this.down(e));
    this.el.addEventListener('pointermove', (e) => this.move(e));
    this.el.addEventListener('pointerup', (e) => this.up(e));
    this.el.addEventListener('pointercancel', () => { this.drag = null; });
  }

  down(e) { if (e.target.closest('button, .pill')) return; this.drag = { x: e.clientX, y: e.clientY, sx: e.clientX, moved: false }; }
  move(e) {
    if (!this.drag) return;
    const dx = e.clientX - this.drag.x;
    this.drag.x = e.clientX;
    if (Math.abs(e.clientX - this.drag.sx) > 8) this.drag.moved = true;
    if (this.drag.moved) this.app.village.drag(dx);
  }
  up(e) {
    if (!this.drag) return;
    const d = this.drag; this.drag = null;
    if (d.moved) return;
    const id = this.app.village.hitTest(e.clientX, e.clientY);
    if (id) this.app.villageTap(id);
  }

  onShow() { this.refresh(); }

  refresh() {
    const s = this.app.state;
    this.fishNum.textContent = formatNumber(s.fish);
    this.stageLabel.textContent = t('vil.stage.' + villageStage(s));
    this.playBtn.querySelector('.btn-label').textContent = t('home.play');
    const lab = (b, k) => { b.querySelector('.btn-label').textContent = t(k); fit(b.querySelector('.btn-label'), 10); };
    lab(this.btnUp, 'home.upgrades'); lab(this.btnBuild, 'home.build'); lab(this.btnMap, 'home.map'); lab(this.btnMis, 'home.missions');
    lab(this.giftBtn, 'home.daily'); lab(this.todayBtn, 'home.today');
    const show = (el, on) => el.classList.toggle('hidden', !on);
    show(this.btnUp, featureOn(s, 'upgrades'));
    show(this.btnBuild, featureOn(s, 'village'));
    show(this.btnMap, featureOn(s, 'map'));
    show(this.btnMis, featureOn(s, 'missions'));
    show(this.giftBtn, featureOn(s, 'streak'));
    show(this.todayBtn, featureOn(s, 'today'));
    setBadge(this.btnUp, anyUpgradeAffordable(s) ? true : 0);
    setBadge(this.btnBuild, anyBuildAffordable(s) || rackAmount(s) > 0 ? true : 0);
    setBadge(this.btnMis, missionsClaimable(s));
    setBadge(this.giftBtn, streakClaimable(s) ? 1 : 0);
    setBadge(this.todayBtn, s.daily.today && !s.daily.today.claimed ? true : 0);
    setBadge(this.btnMap, 0);
    const pop = population(s);
    if (pop > 0) {
      this.popPill.textContent = '';
      this.popPill.appendChild(icon('village', 24));
      this.popPill.appendChild(h('span', {}, `${t('vil.population', { n: pop })} · ${t('vil.bonus', { p: villagePct(s) })}`));
      this.popPill.classList.remove('hidden');
    } else this.popPill.classList.add('hidden');
    const si = s.startIsland || 0;
    if (si > 0 && isBuilt(s, 'lighthouse')) {
      this.startLabel.textContent = t('home.startFrom', { name: name(this.app.levels[si].name) });
      this.startLabel.classList.remove('hidden');
    } else this.startLabel.classList.add('hidden');
  }
}

export class ResultsScreen {
  constructor(app) {
    this.app = app;
    this.title = h('div', { class: 'res-title' });
    this.ribbon = h('div', { class: 'res-ribbon hidden' });
    this.distNum = h('div', { class: 'res-dist' });
    this.bestLine = h('div', { class: 'res-best' });
    this.isleFill = h('div', { class: 'res-isle-fill' });
    this.isleMark = h('div', { class: 'res-isle-mark' });
    this.isleBar = h('div', { class: 'res-isle-bar' }, this.isleFill, this.isleMark);
    this.isleLabel = h('div', { class: 'res-isle-label' });
    this.isleIcon = h('div', { class: 'res-isle-next' });
    this.isle = h('div', { class: 'res-isle' }, h('div', { class: 'res-isle-row' }, this.isleBar, this.isleIcon), this.isleLabel);
    this.fishTotal = h('span', { class: 'res-fish-num' }, '0');
    this.fishRow = h('div', { class: 'res-fish' }, icon('fish', 40), this.fishTotal);
    this.lines = h('div', { class: 'res-lines' });
    this.tip = h('div', { class: 'res-tip hidden' });
    this.chips = h('div', { class: 'res-chips' });
    this.card = h('div', { class: 'res-card' }, this.ribbon, this.title, this.distNum, this.bestLine, this.isle, this.fishRow, this.lines, this.chips, this.tip);
    this.again = button(t('res.again'), { icon: 'replay', iconSize: 32, cls: 'btn-primary btn-again', onTap: () => app.startMainRun() });
    this.up = button(t('res.upgrade'), { icon: 'flap', iconSize: 30, cls: 'btn-secondary', badge: true, onTap: () => app.openUpgrades() });
    this.vil = button(t('res.village'), { icon: 'village', iconSize: 30, cls: 'btn-secondary', badge: true, onTap: () => app.goHub() });
    this.row = h('div', { class: 'res-row' }, this.up, this.vil);
    this.actions = h('div', { class: 'res-actions' }, this.again, this.row);
    this.skip = h('div', { class: 'res-skip' });
    this.el = h('div', { class: 'results' }, h('div', { class: 'res-scroll' }, this.card, this.actions), this.skip);
    this.el.addEventListener('pointerdown', (e) => { e.stopPropagation(); this.finish(); });
    this.finishers = [];
  }

  finish() { for (const f of this.finishers) f(); this.finishers = []; this.el.classList.add('done'); }

  onShow(data) {
    const app = this.app, s = app.state;
    const { res, applied } = data;
    this.el.classList.remove('done');
    this.finishers = [];
    this.title.textContent = data.mode === 'today' ? t('today.title') : t('res.title');
    const newBest = applied.newBest;
    this.ribbon.textContent = t('res.newBest');
    this.ribbon.classList.toggle('hidden', !newBest);
    this.finishers.push(countUp(this.distNum, 0, res.distance, 900, (v) => formatNumber(v) + 'm'));
    this.bestLine.textContent = t('res.best', { m: Math.floor(s.bestUnits / balance.display.unitsPerMeter) });
    // island progress
    const isl = res.island;
    const lv = data.levelOf(isl.index);
    const nextLv = data.levelOf(isl.index + 1);
    const remM = Math.max(0, Math.ceil((isl.endX - res.distanceUnits) / balance.display.unitsPerMeter));
    this.isleFill.style.transform = 'scaleX(0)';
    this.isleMark.style.left = '0%';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      this.isleFill.style.transform = `scaleX(${res.progress.toFixed(3)})`;
      this.isleMark.style.left = (res.progress * 100).toFixed(1) + '%';
    }));
    this.isleIcon.innerHTML = '';
    this.isleIcon.appendChild(icon('distance', 30));
    const nextName = nextLv ? name(nextLv.name) : t('hud.lastIsland');
    if (applied.newIslands.length) this.isleLabel.textContent = t('res.reached', { name: name(lv.name) }) + ' ' + t('res.toNext', { name: nextName, m: remM });
    else this.isleLabel.textContent = t('res.toNext', { name: nextName, m: remM });
    // fish
    const rw = applied.rewards;
    this.lines.innerHTML = '';
    const all = rw.lines.slice();
    for (const g of applied.goals) all.push({ text: t('map.goals') + ': ' + goalText(g.goal), v: g.reward });
    all.forEach((ln, i) => {
      const row = h('div', { class: 'res-line', style: `animation-delay:${0.5 + i * 0.18}s` },
        h('span', { class: 'res-line-k' }, ln.text || t(ln.key, ln.vars)), h('span', { class: 'res-line-v' }, '+' + formatNumber(ln.v)));
      this.lines.appendChild(row);
    });
    this.finishers.push(countUp(this.fishTotal, 0, rw.total, 1200, (v) => '+' + formatNumber(v)));
    // chips: hatches, unlocks
    this.chips.innerHTML = '';
    const chip = (ic, text) => this.chips.appendChild(h('div', { class: 'chip' }, icon(ic, 24), h('span', {}, text)));
    if (applied.hatched.length) chip('egg', t('vil.eggHatched'));
    for (const u of applied.unlocks) {
      const map = { upgrades: ['flap', 'unlock.upgrades'], village: ['village', 'unlock.village'], missions: ['missions', 'unlock.missions'], map: ['map', 'unlock.map'], today: ['daily', 'unlock.today'], slide: ['slide', 'unlock.slide'], magnet: ['magnet', 'unlock.magnet'], glide: ['glide', 'unlock.glide'], scarf: ['scarf', 'unlock.scarf'] };
      if (map[u]) chip(map[u][0], t(map[u][1]));
    }
    // diagnosis tip
    const tip = data.tip;
    if (tip) { this.tip.innerHTML = ''; this.tip.appendChild(icon('info', 26)); this.tip.appendChild(h('span', {}, t(tip))); this.tip.classList.remove('hidden'); }
    else this.tip.classList.add('hidden');
    this.again.querySelector('.btn-label').textContent = t('res.again');
    this.up.querySelector('.btn-label').textContent = t('res.upgrade');
    this.vil.querySelector('.btn-label').textContent = t('res.village');
    this.up.classList.toggle('hidden', !featureOn(s, 'upgrades') || data.mode === 'today');
    setBadge(this.up, anyUpgradeAffordable(s) ? true : 0);
    setBadge(this.vil, anyBuildAffordable(s) || (applied.hatched.length > 0) ? true : 0);
    this.up.classList.toggle('pulse', !!data.pointUpgrade);
    this.again.classList.toggle('pulse', !data.pointUpgrade);
    this.skip.textContent = t('res.tapSkip');
    setTimeout(() => this.el.classList.add('done'), 1800);
  }

  refresh() {
    const s = this.app.state;
    setBadge(this.up, anyUpgradeAffordable(s) ? true : 0);
    this.up.classList.toggle('pulse', false);
  }
}

export function goalText(g) {
  const k = { fish: 'goal.fish', perfect: 'goal.perfect', height: 'goal.height', gold: 'goal.gold', fever: 'goal.fever', rings: 'goal.rings' }[g.type];
  return t(k, { n: g.n });
}
