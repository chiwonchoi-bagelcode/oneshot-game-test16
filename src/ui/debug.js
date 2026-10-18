// Development-only panel (dev build: out/dev/). Never included in the production bundle:
// app.js imports it behind `if (__DEV__)`, which esbuild strips from out/game.js.
import { h } from './dom.js';
import * as E from '../meta/economy.js';
import { onNewDayCheck } from '../meta/daily.js';
import balance from '../data/balance.json';

export function installDebug(app) {
  const panel = h('div', { class: 'dbg hidden' });
  const toggle = h('button', { class: 'dbg-toggle', type: 'button' }, 'DEV');
  const log = h('pre', { class: 'dbg-log' });
  const info = h('div', { class: 'dbg-info' });
  const row = (...els) => h('div', { class: 'dbg-row' }, ...els);
  const btn = (label, fn) => {
    const b = h('button', { type: 'button' }, label);
    b.addEventListener('click', (e) => { e.stopPropagation(); fn(); refresh(); });
    b.addEventListener('pointerdown', (e) => e.stopPropagation());
    return b;
  };
  const after = () => { app.save.write(); app.village.sync(app.state); app.ui.screens[app.ui.current]?.refresh?.(); };
  const s = () => app.state;
  panel.append(
    h('div', { class: 'dbg-title' }, 'Debug'),
    info,
    row(btn('+100 fish', () => { s().fish += 100; after(); }), btn('+1000', () => { s().fish += 1000; after(); }), btn('+10000', () => { s().fish += 10000; after(); })),
    row(btn('Next day', () => { s().dayOffset = (s().dayOffset || 0) + 1; app.dailyCheck(false); after(); }), btn('+3 h (rack)', () => { if (s().village.rackAt) s().village.rackAt -= 3 * 3600000; after(); })),
    row(btn('Clear island', () => { if (app.mode === 'run') { const sim = app.run.sim; sim.p.x = sim.island.endX - 30; sim.p.ground = true; sim.p.s = 1500; } }),
      btn('Reach next island', () => { s().bestIsland = Math.min(app.levels.length - 1, s().bestIsland + 1); for (let i = 0; i <= s().bestIsland; i++) s().islands[i] = { ...(s().islands[i] || { goals: {} }), reached: true, cleared: i < s().bestIsland, best: 1 }; E.checkUnlocks(s()); after(); })),
    row(btn('Go to island…', () => { const n = +prompt('island (1-' + app.levels.length + ')', '3'); if (n >= 1) { s().bestIsland = Math.max(s().bestIsland, n - 1); for (let i = 0; i < n; i++) s().islands[i] = { ...(s().islands[i] || { goals: {} }), reached: true }; s().startIsland = n - 1; s().village.built.lighthouse = s().village.built.lighthouse || Date.now(); E.checkUnlocks(s()); after(); } }),
      btn('Max upgrades', () => { for (const k of E.UPGRADE_KEYS) s().upgrades[k] = balance.upgrades[k].maxLevel; E.checkUnlocks(s()); after(); })),
    row(btn('Build all', () => { for (const b of E.BUILDINGS) if (!s().village.built[b.id]) { s().fish += b.cost; E.build(s(), b.id); } after(); }), btn('Hatch eggs', () => { s().runs++; E.hatchEggs(s()); after(); })),
    row(btn('Bot: expert', () => { if (app.mode === 'run') app.run.bot = app.run.bot ? null : app.makeBot('expert'); }), btn('Toggle FPS', () => { app.showFps = !app.showFps; })),
    row(btn('Safe area sim', () => { const r = document.documentElement.style; const on = !r.getPropertyValue('--sim-top'); r.setProperty('--sim-top', on ? '47px' : ''); r.setProperty('--sim-bottom', on ? '34px' : ''); }), btn('Analytics log', () => { log.classList.toggle('hidden'); })),
    row(btn('Reset save', () => { app.save.reset(); location.reload(); })),
    log,
  );
  toggle.addEventListener('click', (e) => { e.stopPropagation(); panel.classList.toggle('hidden'); refresh(); });
  toggle.addEventListener('pointerdown', (e) => e.stopPropagation());
  panel.addEventListener('pointerdown', (e) => e.stopPropagation());
  document.getElementById('app').append(toggle, panel);
  const style = h('style', {}, `
    .dbg-toggle{position:absolute;left:calc(var(--sal) + 6px);bottom:calc(var(--sab) + 6px);z-index:90;font:12px monospace;padding:6px 8px;border-radius:8px;border:2px solid #1e2350;background:#ffec8a;opacity:.85}
    .dbg{position:absolute;left:8px;right:8px;top:calc(var(--sat) + 60px);max-height:70%;overflow:auto;z-index:91;background:rgba(255,255,255,.96);border:3px solid #1e2350;border-radius:14px;padding:10px;font:13px monospace;color:#1e2350}
    .dbg-row{display:flex;gap:6px;margin:6px 0;flex-wrap:wrap}.dbg-row button{flex:1;min-height:40px;font:13px monospace;border:2px solid #1e2350;border-radius:8px;background:#eef4ff}
    .dbg-title{font-weight:bold;margin-bottom:4px}.dbg-log{max-height:180px;overflow:auto;background:#f4f6fb;padding:6px;font-size:11px;white-space:pre-wrap}
  `);
  document.head.appendChild(style);
  function refresh() {
    const st = s();
    info.textContent = `fish ${st.fish} | runs ${st.runs} | best isl ${st.bestIsland + 1} | day+${st.dayOffset || 0} ${st.daily.lastDay} | streak ${st.daily.streak} | fps ${Math.round(app.fps)} q${app.quality} dpr ${app.dpr}`;
    log.textContent = app.analytics.log.slice(-25).map((e) => `${new Date(e.ts).toLocaleTimeString()} ${e.name} ${JSON.stringify(e.params).slice(0, 160)}`).join('\n');
  }
  setInterval(() => { if (!panel.classList.contains('hidden')) refresh(); }, 1000);
  app.analytics.log.length;
  app.debugPanel = { panel, refresh };
}
