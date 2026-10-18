// Shot definitions shared by the trailer (tools/trailer.mjs) and store stills (tools/store-shots.mjs).
// Every run moment below was found with the simulator (same RunSim + bots as the game) and is
// played live by a bot with the same hold/release input a player has. Only the "cinematic" shot
// directs the camera; the end card swaps the title's tap prompt for a call to action.
import { setupJs } from './capture-lib.mjs';

export const FPS = 30;

const UPS = [{}, { flap: 1, slide: 1 }, { flap: 2, slide: 2, magnet: 1 }, { flap: 3, slide: 3, magnet: 2, glide: 1 }, { flap: 4, slide: 4, magnet: 2, glide: 2, scarf: 1 },
  { flap: 5, slide: 5, magnet: 3, glide: 3, scarf: 1 }, { flap: 6, slide: 6, magnet: 4, glide: 4, scarf: 2 }, { flap: 7, slide: 7, magnet: 5, glide: 5, scarf: 2 }, { flap: 8, slide: 8, magnet: 6, glide: 6, scarf: 3 }];

const setup = (o) => new Function(setupJs(o).replace(/app\./g, 'window.__app.'));

// a run shot: start island `island` with the upgrades a player has there, bot plays, record a window
function runShot({ island, ups = UPS[island], prof = 'good', air = null, seed, t0, dur, runs = 20, cinematic = null, speed = null, blizzard = null }) {
  return async (s, dir) => {
    await s.eval(setup({ runs, bestIsland: island, upgrades: ups }));
    await s.eval(([isl, u, p, a, sd]) => {
      const app = window.__app;
      app.beginRun({ levels: app.levels, upgrades: u, startIndex: isl, assist: 0, modifiers: {} }, 'main');
      if (a) window.__cap.bot2(p, a, sd); else window.__cap.bot(p, sd);
    }, [island, ups, prof, air, seed]);
    if (t0 > 0) await s.skipUntil(`sim.time >= ${t0}`, t0 + 5);
    // blizzard closer than the default start gap (a normal state in play, just not at second 0)
    if (blizzard !== null) await s.eval((c) => { const sim = window.__app.run.sim; sim.blizzardX = sim.p.x - sim.maxGap() * (1 - c); }, blizzard);
    const n = Math.round(dur * FPS);
    if (speed) { await s.record(dir, n, { dt: speed }); return; }
    if (!cinematic) { await s.record(dir, n); return; }
    // in-engine cinematic: slow motion while the camera moves in close on the penguin at the top
    // of its flight, tracking it (centred, under the HUD) from the first frame
    await s.eval(() => { const c = window.__app.run.cam; window.__cine = { z: c.z, anchor: c.anchor }; });
    await s.record(dir, n, {
      dt: (i) => (1 / FPS) * (1 - 0.65 * Math.min(1, i / 8)),
      perFrame: (i) => {
        const k = Math.min(1, i / (n * 0.45));
        const e = k * k * (3 - 2 * k);
        return `const c = app.run.cam, C = window.__cine, p = sim.p, H = c.H;
          const z = C.z * (1 + ${cinematic.zoom} * ${e});
          c.override = { x: p.x, z, anchor: C.anchor + (0.5 - C.anchor) * ${e}, y: p.y - (H * 0.8 - H * 0.5) / z };`;
      },
    });
  };
}

// UI tap: the hand indicator on an element, then the real handler
async function tap(s, dir, el, after, n = 5) {
  const r = await s.eval(new Function(`const e = ${el}; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2];`));
  await s.eval((p) => window.__cap.tapFx(p[0], p[1]), r);
  await s.record(dir, n);
  if (after) await s.eval(new Function(after));
}

export const SHOTS = {
  // 1. a first run on island 1 (no upgrades): the finger holds down the opening slope, lets go,
  //    the penguin soars through the sky fish with the blizzard behind, three perfect landings
  //    in a row, Snow Rush
  hook: runShot({ island: 0, ups: {}, runs: 1, prof: 'good', air: 'expert', seed: 2, t0: 0, dur: 8.5, blizzard: 0.55 }),
  // 2. a real close call on island 3: danger, "Got away!", a big launch, the blizzard falls back
  escape: runShot({ island: 2, seed: 7, t0: 8.0, dur: 3.0 }),
  // 3. island 4 cleared: launch ramp, sea crossing (glide sped up 2.2x), arrival at Sunset Cliffs
  crossing: runShot({ island: 3, seed: 1, t0: 17.15, dur: 3.95, speed: "(sim.state === 'crossing' && sim.time > 17.95 && sim.time < 19.75 ? 2.2 : 1) / 30" }),
  // 4. one continuous session: the run ends, upgrade on the results screen, off to the village,
  //    build an igloo
  meta: async (s, dir) => {
    await s.eval(setup({ runs: 14, bestIsland: 3, fish: 640, upgrades: UPS[3], build: ['igloo1', 'fishrack', 'igloo2', 'workshop', 'pine', 'lighthouse'], hatch: 6 }));
    await s.eval((u) => {
      const app = window.__app;
      app.beginRun({ levels: app.levels, upgrades: u, startIndex: 3, assist: 0, modifiers: {} }, 'main');
      window.__cap.bot('average', 6);
    }, UPS[3]);
    await s.skipUntil(`app.mode === 'results'`, 120);
    await s.skip(0.55);
    await s.record(dir, 6);
    // each tap cuts straight to the opened panel (the 0.2 s fade is skipped, like a cut on the tap)
    await tap(s, dir, `[...document.querySelectorAll('.screen:not(.hidden) .res-row button')][0]`, 'window.__app.openUpgrades()', 5);
    await s.skip(0.25);
    await s.record(dir, 9);
    await tap(s, dir, 'window.__app.pop.upgrades.cards.flap.btn', "window.__app.pop.upgrades.buy('flap')", 5);
    await s.record(dir, 14);
    await tap(s, dir, `document.querySelector('.popup:not(.closing) .btn-close')`, 'window.__app.ui.closeAll()', 4);
    await tap(s, dir, `[...document.querySelectorAll('.screen:not(.hidden) .res-row button')][1]`, 'window.__app.goHub()', 4);
    await s.record(dir, 6);
    await tap(s, dir, 'window.__app.ui.screens.hub.btnBuild', 'window.__app.openBuild()', 4);
    await s.skip(0.25);
    await s.record(dir, 18);
    await tap(s, dir, 'window.__app.pop.build.rows.igloo3.btn', 'window.__app.pop.build.rows.igloo3.btn.click()', 4);
    await s.record(dir, 47);
  },
  // 5. upgrade payoff: with its first upgrades the penguin launches 170 m off Pine Ridge
  payoff: runShot({ island: 1, seed: 2, t0: 6.15, dur: 1.9 }),
  // 6. each island's signature moment
  m_wind: runShot({ island: 3, seed: 8, t0: 5.6, dur: 1.05 }),
  m_geyser: runShot({ island: 5, air: 'average', seed: 7, t0: 8.45, dur: 1.05 }),
  m_rings: runShot({ island: 6, seed: 1, t0: 2.95, dur: 1.05 }),
  m_clouds: runShot({ island: 7, seed: 1, t0: 6.05, dur: 1.05 }),
  // 7. in-engine cinematic: the highest soar on Sky's End in slow motion, camera moves in close
  cinematic: runShot({ island: 8, seed: 3, t0: 4.75, dur: 2.4, cinematic: { zoom: 1.3 } }),
  // 8. end card: the real title screen (the game plays itself behind the logo) with a call to action
  title: async (s, dir) => {
    await s.eval(() => {
      const app = window.__app;
      app.state.tutorialDone = false; app.state.runs = 0; app.showTitle(); app.run.capture = false;
      const tapEl = document.querySelector('.title-screen .title-tap');
      if (tapEl) { tapEl.textContent = document.documentElement.lang === 'ko' ? '지금 바로 날아 보세요!' : 'Play now!'; tapEl.style.animation = 'none'; tapEl.style.background = 'rgba(232,66,63,.92)'; tapEl.style.border = '3px solid #1e2350'; }
      // end card: the demo keeps playing behind the logo, without its praise pop-ups
      app.run.floaters.clear(); app.run.floaters.add = () => {};
    });
    await s.skip(2.4);
    await s.record(dir, 86);
  },
};
