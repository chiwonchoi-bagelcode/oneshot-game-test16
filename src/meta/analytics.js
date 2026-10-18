// Analytics event catalogue + dispatcher. See release/docs/analytics.md for the dashboards and
// the day-1 churn diagnosis that these events feed.
import { services } from '../services/services.js';

export const EVENTS = {
  first_open: 'Install / first launch (once per device)',
  session_start: 'App opened or returned from background after 30 min',
  session_end: 'App hidden (duration, runs this session)',
  tutorial_step: 'Tutorial step reached (hold, release)',
  tutorial_complete: 'First-run tutorial finished',
  run_start: 'A run begins (island, upgrades, run number, mode)',
  run_end: 'A run ends (distance, fish, island, progress, cause, time, perfects, bonks, tips shown)',
  level_reach: 'Reached an island during a run (index, first time?)',
  island_clear: 'Crossed an island (index)',
  record_passed: 'Passed the previous best distance during a run',
  fever: 'Snow Rush triggered',
  currency_earn: 'Fish earned (source: run, rack, streak, mission, goal, today)',
  currency_spend: 'Fish spent (sink: upgrade, building; item; level)',
  upgrade_purchase: 'Upgrade bought (key, level, cost)',
  building_built: 'Village building built (id, cost)',
  egg_hatched: 'Baby penguin hatched',
  feature_unlock: 'A feature unlocked (feature)',
  streak_claim: 'Daily gift claimed (day in cycle, streak)',
  mission_complete: 'Daily task completed (type)',
  today_start: 'Island of the Day attempt',
  today_clear: 'Island of the Day crossed',
  goal_complete: 'Island goal completed (island, goal)',
  settings_change: 'Setting changed (key, value)',
  perf_sample: 'Average fps + quality every 60 s of play',
  hint_shown: 'Contextual hint shown (key)',
};

export class Analytics {
  constructor() {
    this.queue = [];
    this.common = {};
    this.flushTimer = null;
    this.log = []; // last events, visible in the debug panel
  }

  setCommon(obj) { Object.assign(this.common, obj); }

  track(name, params = {}) {
    if (!EVENTS[name] && typeof __DEV__ !== 'undefined' && __DEV__) console.warn('unknown analytics event', name);
    const e = { name, params: { ...this.common, ...params }, ts: Date.now() };
    this.queue.push(e);
    this.log.push(e);
    if (this.log.length > 60) this.log.shift();
    if (!this.flushTimer) this.flushTimer = setTimeout(() => this.flush(), 2000);
  }

  flush() {
    this.flushTimer = null;
    if (!this.queue.length) return;
    const batch = this.queue.splice(0);
    try { services.analyticsSink.send(batch); } catch (e) { /* never break the game */ }
  }
}
