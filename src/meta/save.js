// Persistent player state. One JSON blob in localStorage, versioned, written on every important
// change and mirrored to the cloud-save adapter (services.js) when one is plugged in.
import { services } from '../services/services.js';

const KEY = 'ps.save.v1';

export function freshState() {
  const now = Date.now();
  return {
    v: 1,
    createdAt: now,
    updatedAt: now,
    playerId: null,
    settings: { music: true, sound: true, vibration: true, quality: 'auto', saver: false, lang: null },
    fish: 0,
    earned: 0,
    spent: 0,
    runs: 0,
    tutorialDone: false,
    bestUnits: 0,
    bestIsland: 0,
    islands: {},
    upgrades: { flap: 0, slide: 0, magnet: 0, glide: 0, scarf: 0 },
    village: { built: {}, eggs: [], babies: [], rackAt: null, rackLevel: 0, seenCount: 0 },
    unlocked: {},
    unlockSeen: {},
    intros: {},
    daily: { lastDay: null, streak: 0, cycle: 0, claimedDay: null, firstRunDay: null, missions: null, today: null, days: 0 },
    fails: { island: -1, count: 0 },
    ghost: null,
    ghostStart: 0,
    startIsland: 0,
    stats: { perfects: 0, fevers: 0, maxHeightM: 0, distanceM: 0, sessions: 0, playSeconds: 0 },
    dayOffset: 0,
    firstOpenSent: false,
  };
}

function migrate(s) {
  const base = freshState();
  // shallow-merge known sections so older saves pick up new fields
  const out = { ...base, ...s };
  for (const k of ['settings', 'upgrades', 'village', 'daily', 'stats', 'fails']) out[k] = { ...base[k], ...(s[k] || {}) };
  return out;
}

export class Save {
  constructor() {
    this.state = freshState();
    this.timer = null;
    this.ok = true;
  }

  load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) this.state = migrate(JSON.parse(raw));
    } catch (e) {
      this.ok = false;
      this.state = freshState();
    }
    return this.state;
  }

  write() {
    this.state.updatedAt = Date.now();
    try { localStorage.setItem(KEY, JSON.stringify(this.state)); } catch (e) { this.ok = false; }
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      services.cloud.push(this.state.playerId, this.state, this.state.updatedAt).catch(() => {});
    }, 5000);
  }

  async pullCloud() {
    try {
      const r = await services.cloud.pull(this.state.playerId);
      if (r && r.data && r.updatedAt > this.state.updatedAt) { this.state = migrate(r.data); this.write(); return true; }
    } catch (e) { /* offline: keep local */ }
    return false;
  }

  reset() {
    const keep = { settings: this.state.settings, playerId: this.state.playerId, firstOpenSent: true };
    this.state = { ...freshState(), ...keep };
    this.write();
  }
}

// time with the debug day offset applied
export function now(state) { return Date.now() + (state.dayOffset || 0) * 86400000; }

export function dayKey(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function daysBetween(a, b) {
  const pa = a.split('-').map(Number), pb = b.split('-').map(Number);
  const da = Date.UTC(pa[0], pa[1] - 1, pa[2]), db = Date.UTC(pb[0], pb[1] - 1, pb[2]);
  return Math.round((db - da) / 86400000);
}
