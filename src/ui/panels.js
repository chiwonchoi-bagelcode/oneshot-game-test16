// All popups. Lists are built once and updated in place, so buying something never rebuilds the
// list or moves the scroll position.
import { h, icon, button, onTap, setBadge, fit } from './dom.js';
import { Popup } from './ui.js';
import { t, formatNumber, name, LANGS } from '../i18n/i18n.js';
import balance from '../data/balance.json';
import dailyData from '../data/daily.json';
import {
  UPGRADE_KEYS, upgradeCost, upgradeUnlocked, upgradeUnlockText, upgradeDisplay, availableBuildings, buildingKey, BUILDINGS,
  isBuilt, BUILDING, rackAmount, rackRate, population, villagePct, goalReward,
} from '../meta/economy.js';
import { streakRewards, streakClaimable, todayInfo } from '../meta/daily.js';
import { goalText } from './screens.js';

const fishCost = (n, ok) => h('span', { class: 'cost' + (ok ? '' : ' short') }, icon('fish', 22), h('span', {}, formatNumber(n)));

// ---------------------------------------------------------------- upgrades
export class UpgradesPopup extends Popup {
  constructor(app) {
    super(app, 'upgrades', 'up.title', { iconName: 'flap' });
    this.fishLine = h('div', { class: 'pop-wallet' });
    this.body.appendChild(this.fishLine);
    this.cards = {};
    for (const k of UPGRADE_KEYS) {
      const c = {};
      c.icon = icon(k, 56, 'card-ico');
      c.name = h('div', { class: 'card-name' });
      c.lv = h('div', { class: 'card-lv' });
      c.pips = h('div', { class: 'pips' });
      c.desc = h('div', { class: 'card-desc' });
      c.stat = h('div', { class: 'card-stat' });
      c.btn = button('', { cls: 'btn-buy', onTap: () => this.buy(k) });
      c.lock = h('div', { class: 'card-lock hidden' }, icon('lock', 26), h('span', {}));
      c.el = h('div', { class: 'card up-card' },
        h('div', { class: 'card-left' }, c.icon),
        h('div', { class: 'card-mid' }, h('div', { class: 'card-head' }, c.name, c.lv), c.pips, c.desc, c.stat),
        h('div', { class: 'card-right' }, c.btn, c.lock));
      this.cards[k] = c;
      this.body.appendChild(c.el);
    }
  }

  buy(k) {
    const r = this.app.buyUpgrade(k);
    if (r) {
      const c = this.cards[k];
      c.el.classList.remove('flash'); void c.el.offsetWidth; c.el.classList.add('flash');
    }
    this.refresh();
  }

  refresh() {
    const s = this.app.state;
    this.fishLine.innerHTML = '';
    this.fishLine.appendChild(icon('fish', 28));
    this.fishLine.appendChild(h('span', {}, formatNumber(s.fish)));
    for (const k of UPGRADE_KEYS) {
      const c = this.cards[k];
      const U = balance.upgrades[k];
      const lv = s.upgrades[k] || 0;
      const unlocked = upgradeUnlocked(s, k);
      c.name.textContent = t(`up.${k}.name`);
      c.lv.textContent = t('up.level', { n: lv });
      c.desc.textContent = t(`up.${k}.desc`);
      c.pips.innerHTML = '';
      for (let i = 0; i < U.maxLevel; i++) c.pips.appendChild(h('i', { class: i < lv ? 'on' : '' }));
      const now = upgradeDisplay(k, lv), next = upgradeDisplay(k, Math.min(U.maxLevel, lv + 1));
      c.stat.innerHTML = '';
      if (lv >= U.maxLevel) c.stat.appendChild(h('span', { class: 'stat-now' }, t(`up.${k}.stat`, { v: now })));
      else {
        c.stat.appendChild(h('span', { class: 'stat-now' }, lv === 0 && k !== 'scarf' ? t(`up.${k}.stat`, { v: 0 }) : t(`up.${k}.stat`, { v: now })));
        c.stat.appendChild(h('span', { class: 'stat-arrow' }, '→'));
        c.stat.appendChild(h('span', { class: 'stat-next' }, t(`up.${k}.stat`, { v: next })));
      }
      c.el.classList.toggle('locked', !unlocked);
      c.lock.classList.toggle('hidden', unlocked);
      c.btn.classList.toggle('hidden', !unlocked);
      if (!unlocked) {
        const [key, vars] = upgradeUnlockText(k);
        c.lock.querySelector('span').textContent = t(key, vars);
        continue;
      }
      c.btn.innerHTML = '';
      if (lv >= U.maxLevel) {
        c.btn.appendChild(h('span', { class: 'btn-label' }, t('up.max')));
        c.btn.disabled = true; c.btn.classList.add('maxed');
      } else {
        const cost = upgradeCost(k, lv);
        const ok = s.fish >= cost;
        c.btn.appendChild(h('span', { class: 'btn-label' }, t('up.buy')));
        c.btn.appendChild(fishCost(cost, ok));
        c.btn.disabled = !ok; c.btn.classList.remove('maxed');
        c.btn.classList.toggle('ready', ok);
      }
    }
  }
}

// ---------------------------------------------------------------- build
export class BuildPopup extends Popup {
  constructor(app) {
    super(app, 'build', 'vil.title', { iconName: 'village' });
    this.summary = h('div', { class: 'vil-summary' });
    this.rackRow = h('div', { class: 'rack-row hidden' });
    this.list = h('div', { class: 'build-list' });
    this.body.append(this.summary, this.rackRow, this.list);
    this.rows = {};
    for (const b of BUILDINGS) {
      const r = {};
      const k = buildingKey(b);
      r.name = h('div', { class: 'card-name' });
      r.desc = h('div', { class: 'card-desc' });
      r.btn = button('', { cls: 'btn-buy', onTap: () => { if (app.build(b.id)) this.refresh(); } });
      r.done = h('div', { class: 'built-mark hidden' }, icon('check', 30));
      r.el = h('div', { class: 'card build-card' }, h('div', { class: 'card-left' }, buildingThumb(b)), h('div', { class: 'card-mid' }, r.name, r.desc), h('div', { class: 'card-right' }, r.btn, r.done));
      r.k = k;
      this.rows[b.id] = r;
      this.list.appendChild(r.el);
    }
  }

  refresh() {
    const s = this.app.state;
    this.summary.innerHTML = '';
    this.summary.append(icon('village', 28), h('span', {}, `${t('vil.population', { n: population(s) })} · ${t('vil.bonus', { p: villagePct(s) })}`));
    const rack = rackAmount(s);
    this.rackRow.innerHTML = '';
    if (isBuilt(s, 'fishrack')) {
      this.rackRow.classList.remove('hidden');
      if (rack > 0) {
        this.rackRow.appendChild(button(t('vil.collect', { n: rack }), { icon: 'fish', iconSize: 28, cls: 'btn-secondary btn-wide', onTap: () => { this.app.collectRack(); this.refresh(); } }));
      } else this.rackRow.appendChild(h('div', { class: 'rack-wait' }, icon('fish', 24), h('span', {}, t('vil.rackEmpty'))));
    } else this.rackRow.classList.add('hidden');
    const avail = new Set(availableBuildings(s).map((b) => b.id));
    // order: available (cheapest first), then built; hide locked ones
    const order = [...BUILDINGS].sort((a, b) => {
      const ra = avail.has(a.id) ? 0 : isBuilt(s, a.id) ? 1 : 2, rb = avail.has(b.id) ? 0 : isBuilt(s, b.id) ? 1 : 2;
      return ra - rb || a.cost - b.cost;
    });
    let shownAvail = 0;
    for (const b of order) {
      const r = this.rows[b.id];
      const built = isBuilt(s, b.id);
      const av = avail.has(b.id);
      const visible = built || (av && shownAvail < 6);
      if (av) shownAvail++;
      r.el.classList.toggle('hidden', !visible);
      this.list.appendChild(r.el); // keeps DOM order = sort order without rebuilding
      r.name.textContent = t(r.k.name);
      r.desc.textContent = t(r.k.desc, r.k.vars);
      r.done.classList.toggle('hidden', !built);
      r.btn.classList.toggle('hidden', built);
      r.el.classList.toggle('is-built', built);
      if (!built) {
        r.btn.innerHTML = '';
        const ok = s.fish >= b.cost;
        r.btn.appendChild(h('span', { class: 'btn-label' }, t('vil.build')));
        r.btn.appendChild(fishCost(b.cost, ok));
        r.btn.disabled = !ok;
        r.btn.classList.toggle('ready', ok);
      }
    }
  }
}

function buildingThumb(b) {
  const map = { igloo: 'home', fishrack: 'fish', rack2: 'fish', workshop: 'slide', lighthouse: 'lighthouse', tent: 'goldfish', hotspring: 'snowflake', lamp: 'graphics', stage: 'music', kite: 'gift', statue: 'trophy', snowman: 'snowflake', fence: 'build', pine: 'village' };
  return icon(map[b.type] || 'home', 52, 'card-ico');
}

// ---------------------------------------------------------------- map
export class MapPopup extends Popup {
  constructor(app) {
    super(app, 'map', 'map.title', { iconName: 'map', cls: 'tall' });
    this.rows = [];
    this.list = h('div', { class: 'map-list' });
    this.body.appendChild(this.list);
    // highest island on top: the journey goes up into the sky
    for (let i = app.levels.length - 1; i >= 0; i--) {
      const r = { i };
      r.num = h('div', { class: 'map-num' });
      r.name = h('div', { class: 'card-name' });
      r.info = h('div', { class: 'card-desc' });
      r.goals = h('div', { class: 'map-goals' });
      r.btn = button('', { cls: 'btn-buy', onTap: () => this.pick(i) });
      r.el = h('div', { class: 'card map-card' }, h('div', { class: 'card-left' }, r.num), h('div', { class: 'card-mid' }, r.name, r.info, r.goals), h('div', { class: 'card-right' }, r.btn));
      this.rows.push(r);
      this.list.appendChild(r.el);
    }
  }

  pick(i) {
    this.app.state.startIsland = i;
    this.app.save.write();
    this.refresh();
    this.app.ui.close('map');
    this.app.startMainRun();
  }

  onOpen() {
    super.onOpen();
    // scroll so the furthest island is in view, once, without jumping later
    const s = this.app.state;
    const target = this.rows.find((r) => r.i === s.bestIsland);
    if (target) requestAnimationFrame(() => { this.body.scrollTop = Math.max(0, target.el.offsetTop - this.body.clientHeight / 2 + target.el.clientHeight / 2); });
  }

  refresh() {
    const s = this.app.state;
    const lh = isBuilt(s, 'lighthouse');
    for (const r of this.rows) {
      const lv = this.app.levels[r.i];
      const rec = s.islands[r.i];
      const reached = r.i === 0 || (rec && rec.reached);
      r.el.classList.toggle('locked', !reached);
      r.num.textContent = String(r.i + 1);
      r.num.className = 'map-num biome-' + lv.biome;
      r.name.textContent = reached ? name(lv.name) : '???';
      r.goals.innerHTML = '';
      if (!reached) { r.info.textContent = t('map.locked'); r.btn.classList.add('hidden'); continue; }
      const best = rec ? Math.round((rec.cleared ? 1 : rec.best || 0) * 100) : 0;
      r.info.textContent = rec && rec.cleared ? t('map.cleared') : t('map.best', { p: best });
      (lv.goals || []).forEach((g, gi) => {
        const done = rec && rec.goals && rec.goals[gi];
        r.goals.appendChild(h('div', { class: 'goal' + (done ? ' done' : '') }, icon(done ? 'star' : 'starEmpty', 20), h('span', {}, goalText(g)), done ? null : h('span', { class: 'goal-rw' }, '+' + goalReward(r.i))));
      });
      r.btn.classList.remove('hidden');
      r.btn.innerHTML = '';
      if (lh || r.i === 0) {
        r.btn.appendChild(h('span', { class: 'btn-label' }, s.startIsland === r.i ? t('map.start') + ' ✓' : t('map.start')));
        r.btn.disabled = false; r.btn.classList.add('ready');
      } else {
        r.btn.appendChild(icon('lighthouse', 26));
        r.btn.disabled = true; r.btn.classList.remove('ready');
        r.info.textContent += ' · ' + t('map.needLighthouse');
      }
    }
  }
}

// ---------------------------------------------------------------- missions
export class MissionsPopup extends Popup {
  constructor(app) {
    super(app, 'missions', 'mis.title', { iconName: 'missions' });
    this.rows = [];
    for (let i = 0; i < dailyData.missions.perDay; i++) {
      const r = {};
      r.text = h('div', { class: 'card-name' });
      r.barFill = h('div', { class: 'bar-fill' });
      r.barText = h('div', { class: 'bar-text' });
      r.bar = h('div', { class: 'bar' }, r.barFill, r.barText);
      r.btn = button('', { cls: 'btn-buy', onTap: () => { app.claimMission(i); this.refresh(); } });
      r.el = h('div', { class: 'card mis-card' }, h('div', { class: 'card-mid' }, r.text, r.bar), h('div', { class: 'card-right' }, r.btn));
      this.rows.push(r);
      this.body.appendChild(r.el);
    }
    this.bonus = h('div', { class: 'card mis-bonus' });
    this.note = h('div', { class: 'pop-note' });
    this.body.append(this.bonus, this.note);
  }

  refresh() {
    const m = this.app.state.daily.missions;
    if (!m) return;
    m.list.forEach((it, i) => {
      const r = this.rows[i];
      r.text.textContent = t('mis.' + it.type, { n: it.target });
      r.barFill.style.transform = `scaleX(${Math.min(1, it.progress / it.target).toFixed(3)})`;
      r.barText.textContent = `${formatNumber(Math.min(it.progress, it.target))} / ${formatNumber(it.target)}`;
      r.btn.innerHTML = '';
      if (it.claimed) { r.btn.appendChild(icon('check', 30)); r.btn.disabled = true; r.btn.classList.remove('ready'); r.el.classList.add('is-built'); }
      else {
        r.el.classList.remove('is-built');
        r.btn.appendChild(h('span', { class: 'btn-label' }, t('mis.claim')));
        r.btn.appendChild(fishCost(it.reward, true));
        const ok = it.progress >= it.target;
        r.btn.disabled = !ok; r.btn.classList.toggle('ready', ok);
      }
    });
    this.bonus.innerHTML = '';
    const all = m.list.every((x) => x.claimed);
    if (all && !m.bonusClaimed) this.bonus.appendChild(button(t('mis.allDone') + ' +' + dailyData.missions.allDoneBonus, { icon: 'gift', iconSize: 30, cls: 'btn-primary btn-wide', onTap: () => { this.app.claimMissionBonus(); this.refresh(); } }));
    else this.bonus.appendChild(h('div', { class: 'card-desc' }, icon('gift', 28), h('span', {}, all ? t('mis.allDone') : `${t('mis.allDone').replace('!', '')} +${dailyData.missions.allDoneBonus}`)));
    this.note.textContent = t('mis.refresh');
  }
}

// ---------------------------------------------------------------- daily gift
export class DailyPopup extends Popup {
  constructor(app) {
    super(app, 'daily', 'daily.title', { iconName: 'gift' });
    this.streak = h('div', { class: 'streak-line' });
    this.grid = h('div', { class: 'cal-grid' });
    this.cells = streakRewards().map((v, i) => {
      const c = { day: h('div', { class: 'cal-day' }), val: h('div', { class: 'cal-val' }) };
      c.el = h('div', { class: 'cal-cell' + (i === 6 ? ' big' : '') }, c.day, icon(i === 6 ? 'gift' : 'fish', i === 6 ? 44 : 34), c.val);
      this.grid.appendChild(c.el);
      return c;
    });
    this.claim = button(t('daily.claim'), { cls: 'btn-primary btn-wide', onTap: () => { this.app.claimStreak(); this.refresh(); } });
    this.note = h('div', { class: 'pop-note' });
    this.body.append(this.streak, this.grid, this.note);
    this.footer.classList.remove('hidden');
    this.footer.appendChild(this.claim);
  }

  refresh() {
    const s = this.app.state;
    const cyc = s.daily.cycle % 7;
    const can = streakClaimable(s);
    this.streak.innerHTML = '';
    this.streak.append(icon('calendar', 30), h('span', {}, t('daily.streak', { n: s.daily.streak })));
    this.cells.forEach((c, i) => {
      c.day.textContent = t('daily.day', { n: i + 1 });
      c.val.textContent = formatNumber(streakRewards()[i]);
      const claimed = i < cyc || (i === (cyc + 6) % 7 && !can && s.daily.cycle > 0 && i === (s.daily.cycle - 1) % 7);
      c.el.classList.toggle('claimed', i < cyc);
      c.el.classList.toggle('today', can && i === cyc);
    });
    this.claim.querySelector('.btn-label').textContent = can ? t('daily.claim') : t('daily.claimed');
    this.claim.disabled = !can;
    this.note.textContent = t('daily.comeBack');
  }
}

// ---------------------------------------------------------------- island of the day
export class TodayPopup extends Popup {
  constructor(app) {
    super(app, 'today', 'today.title', { iconName: 'daily' });
    this.desc = h('div', { class: 'today-desc' });
    this.mod = h('div', { class: 'today-mod' });
    this.reward = h('div', { class: 'today-reward' });
    this.best = h('div', { class: 'pop-note' });
    this.play = button(t('today.play'), { icon: 'play', iconSize: 30, cls: 'btn-primary btn-wide', onTap: () => { app.ui.close('today'); app.startTodayRun(); } });
    this.body.append(this.desc, this.mod, this.reward, this.best);
    this.footer.classList.remove('hidden');
    this.footer.appendChild(this.play);
  }
  refresh() {
    const s = this.app.state;
    const info = todayInfo(s);
    this.desc.textContent = t('today.desc');
    this.mod.innerHTML = '';
    this.mod.append(icon('snowflake', 30), h('span', {}, t('today.mod.' + info.mod)));
    this.reward.innerHTML = '';
    const td = s.daily.today || {};
    if (td.claimed) this.reward.append(icon('check', 30), h('span', {}, t('today.cleared')));
    else this.reward.append(icon('fish', 30), h('span', {}, t('today.reward', { n: info.reward })));
    this.best.textContent = t('today.best', { p: Math.round((td.best || 0) * 100) });
    this.play.querySelector('.btn-label').textContent = t('today.play');
  }
}

// ---------------------------------------------------------------- settings
export class SettingsPopup extends Popup {
  constructor(app) {
    super(app, 'settings', 'set.title', { iconName: 'settings' });
    const row = (ic, key, ctrl) => h('div', { class: 'set-row' }, icon(ic, 32), h('span', { class: 'set-label', 'data-k': key }), ctrl);
    this.toggles = {};
    const tog = (k) => {
      const b = button('', { cls: 'toggle', onTap: () => { app.setSetting(k, !app.state.settings[k]); this.refresh(); } });
      this.toggles[k] = b;
      return b;
    };
    this.gfx = h('div', { class: 'seg' }, ...['low', 'mid', 'high'].map((q) => button('', { cls: 'seg-btn', onTap: () => { app.setSetting('quality', q); this.refresh(); } })));
    this.lang = h('div', { class: 'seg' }, ...LANGS.map((l) => button(l === 'ko' ? '한국어' : 'English', { cls: 'seg-btn', onTap: () => { app.setSetting('lang', l); this.refresh(); } })));
    this.vibNote = h('div', { class: 'set-note hidden' });
    this.ver = h('div', { class: 'set-ver' });
    this.credits = h('div', { class: 'set-credits' });
    this.reset = button('', { cls: 'btn-ghost', onTap: () => app.confirmReset() });
    this.body.append(
      row('music', 'set.music', tog('music')),
      row('sound', 'set.sound', tog('sound')),
      row('vibrate', 'set.vibration', tog('vibration')),
      this.vibNote,
      h('div', { class: 'set-row col' }, h('div', { class: 'set-row-top' }, icon('graphics', 32), h('span', { class: 'set-label', 'data-k': 'set.graphics' })), this.gfx),
      row('graphics', 'set.saver', tog('saver')),
      h('div', { class: 'set-row col' }, h('div', { class: 'set-row-top' }, icon('language', 32), h('span', { class: 'set-label', 'data-k': 'set.language' })), this.lang),
      this.credits, this.reset, this.ver,
    );
  }

  refresh() {
    const s = this.app.state.settings;
    this.titleEl.textContent = t('set.title');
    for (const el of this.body.querySelectorAll('.set-label')) el.textContent = t(el.dataset.k);
    for (const [k, b] of Object.entries(this.toggles)) {
      b.classList.toggle('on', !!s[k]);
      b.innerHTML = `<span class="knob"></span><span class="tog-text">${s[k] ? t('set.on') : t('set.off')}</span>`;
      b.setAttribute('aria-pressed', s[k] ? 'true' : 'false');
    }
    const q = this.app.qualityName();
    [...this.gfx.children].forEach((b, i) => {
      const key = ['low', 'mid', 'high'][i];
      b.querySelector('.btn-label') ? (b.querySelector('.btn-label').textContent = t('set.gfx.' + key)) : b.appendChild(h('span', { class: 'btn-label' }, t('set.gfx.' + key)));
      b.classList.toggle('on', q === key);
    });
    const lang = this.app.lang;
    [...this.lang.children].forEach((b, i) => b.classList.toggle('on', LANGS[i] === lang));
    this.vibNote.textContent = t('set.noVibration');
    this.vibNote.classList.toggle('hidden', this.app.haptics.supported);
    this.reset.innerHTML = `<span class="btn-label">${t('set.reset')}</span>`;
    this.ver.textContent = t('set.version', { v: this.app.version });
    this.credits.innerHTML = '';
    this.credits.append(h('div', { class: 'set-credits-t' }, t('set.credits')), h('div', { class: 'set-credits-b' }, t('set.creditsText')));
  }
}

// ---------------------------------------------------------------- pause
export class PausePopup extends Popup {
  constructor(app) {
    super(app, 'pause', 'pause.title', { iconName: 'pause', cls: 'small' });
    this.closeBtn && this.closeBtn.remove();
    this.resume = button('', { icon: 'play', iconSize: 30, cls: 'btn-primary btn-wide', onTap: () => app.resumeRun() });
    this.restart = button('', { icon: 'replay', iconSize: 28, cls: 'btn-secondary btn-wide', onTap: () => app.restartRun() });
    this.home = button('', { icon: 'village', iconSize: 28, cls: 'btn-secondary btn-wide', onTap: () => app.quitRun() });
    this.settings = button('', { icon: 'settings', iconSize: 28, cls: 'btn-secondary btn-wide', onTap: () => app.openSettings() });
    this.body.append(this.resume, this.restart, this.settings, this.home);
    this.dismissable = false;
  }
  refresh() {
    const lb = (b, k) => { b.querySelector('.btn-label') ? (b.querySelector('.btn-label').textContent = t(k)) : b.appendChild(h('span', { class: 'btn-label' }, t(k))); };
    lb(this.resume, 'pause.resume'); lb(this.restart, 'pause.restart'); lb(this.home, 'pause.home'); lb(this.settings, 'set.title');
  }
  onClose() { this.app.onPauseClosed(); }
}

// ---------------------------------------------------------------- generic info / confirm
export class InfoPopup extends Popup {
  constructor(app) {
    super(app, 'info', 'common.ok', { cls: 'small' });
    this.iconBox = h('div', { class: 'info-ico' });
    this.text = h('div', { class: 'info-text' });
    this.ok = button('', { cls: 'btn-primary btn-wide', onTap: () => app.ui.close('info') });
    this.body.append(this.iconBox, this.text);
    this.footer.classList.remove('hidden');
    this.footer.appendChild(this.ok);
  }
  set(titleKeyOrText, text, ic, okText) {
    this.titleKey = titleKeyOrText;
    this._text = text; this._ic = ic; this._ok = okText;
    return this;
  }
  refresh() {
    this.titleEl.textContent = this.titleKey.includes('.') ? t(this.titleKey) : this.titleKey;
    this.text.textContent = this._text;
    this.iconBox.innerHTML = '';
    if (this._ic) this.iconBox.appendChild(icon(this._ic, 72));
    this.ok.innerHTML = `<span class="btn-label">${this._ok || t('common.ok')}</span>`;
  }
}

export class ConfirmPopup extends Popup {
  constructor(app) {
    super(app, 'confirm', 'set.reset', { cls: 'small' });
    this.text = h('div', { class: 'info-text' });
    this.yes = button('', { cls: 'btn-danger btn-wide', onTap: () => { const f = this.onYes; app.ui.close('confirm'); f && f(); } });
    this.no = button('', { cls: 'btn-secondary btn-wide', onTap: () => app.ui.close('confirm') });
    this.body.append(this.text);
    this.footer.classList.remove('hidden');
    this.footer.append(this.no, this.yes);
  }
  set(titleKey, textKey, yesKey, onYes) { this.titleKey = titleKey; this.textKey = textKey; this.yesKey = yesKey; this.onYes = onYes; return this; }
  refresh() {
    this.titleEl.textContent = t(this.titleKey);
    this.text.textContent = t(this.textKey);
    this.yes.innerHTML = `<span class="btn-label">${t(this.yesKey)}</span>`;
    this.no.innerHTML = `<span class="btn-label">${t('set.cancel')}</span>`;
  }
}
