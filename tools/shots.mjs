// Shot definitions shared by the trailer (tools/trailer.mjs) and store stills (tools/store-shots.mjs).
import { setupJs } from './capture-lib.mjs';

export const FPS = 30;

const UPS = [{}, { flap: 1, slide: 1 }, { flap: 2, slide: 2, magnet: 1 }, { flap: 3, slide: 3, magnet: 2, glide: 1 }, { flap: 4, slide: 4, magnet: 2, glide: 2, scarf: 1 },
  { flap: 5, slide: 5, magnet: 3, glide: 3, scarf: 1 }, { flap: 6, slide: 6, magnet: 4, glide: 4, scarf: 2 }, { flap: 7, slide: 7, magnet: 5, glide: 5, scarf: 2 }, { flap: 8, slide: 8, magnet: 6, glide: 6, scarf: 3 }];

// a run shot: start island `island` with the upgrades a player has there, bot plays, record a window
function runShot({ island, ups = UPS[island], prof = 'good', air = null, seed, t0, dur, runs = 20, blizzard = null, cinematic = null }) {
  return async (s, dir) => {
    await s.eval(new Function(setupJs({ runs, bestIsland: island, upgrades: ups }).replace(/app\./g, 'window.__app.')));
    await s.eval(([isl, u, p, a, sd]) => {
      const app = window.__app;
      app.beginRun({ levels: app.levels, upgrades: u, startIndex: isl, assist: 0, modifiers: {} }, 'main');
      if (a) window.__cap.bot2(p, a, sd); else window.__cap.bot(p, sd);
    }, [island, ups, prof, air, seed]);
    if (t0 > 0) await s.skipUntil(`sim.time >= ${t0}`, t0 + 5);
    if (blizzard !== null) await s.eval((c) => { const sim = window.__app.run.sim; sim.blizzardX = sim.p.x - sim.maxGap() * (1 - c); }, blizzard);
    const n = Math.round(dur * FPS);
    if (!cinematic) { await s.record(dir, n); return; }
    // in-engine cinematic: slow motion while the camera moves in close on the penguin at the top
    // of its flight (the game's own renderer, only the camera is directed)
    await s.eval(() => { const c = window.__app.run.cam; window.__cine = { z: c.z, anchor: c.anchor, y: c.y }; });
    await s.record(dir, n, {
      dt: (i) => (1 / FPS) * (1 - 0.65 * Math.min(1, i / 10)),
      perFrame: (i) => {
        const k = Math.min(1, i / (n * 0.7));
        const e = k * k * (3 - 2 * k);
        return `const c = app.run.cam, C = window.__cine, p = sim.p, H = c.H;
          const z = C.z * (1 + ${cinematic.zoom} * ${e});
          const sy = H * 0.46;
          const yFollow = p.y - (H * 0.8 - sy) / z;
          c.override = { x: p.x, z, anchor: C.anchor + (0.5 - C.anchor) * ${e}, y: C.y + (yFollow - C.y) * ${e} };`;
      },
    });
  };
}

export const SHOTS = {
  // 1. first run on island 1, no upgrades: hold on the downhill, release, soar through fish,
  //    the blizzard right behind
  hook: runShot({ island: 0, ups: {}, runs: 1, prof: 'average', air: 'expert', seed: 3, t0: 0, dur: 5.8, blizzard: 0.5 }),
  // 2. perfect-landing chain into Snow Rush on island 2
  fever: runShot({ island: 1, seed: 11, t0: 12.7, dur: 3.2 }),
  // 3. a real close call on island 3 (blizzard danger → escape with a big launch)
  escape: runShot({ island: 2, seed: 5, t0: 7.9, dur: 2.9 }),
  // 4. island 4 cleared: launch ramp, sea crossing, arrival at Sunset Cliffs
  crossing: runShot({ island: 3, seed: 1, t0: 17.75, dur: 3.3 }),
  // 5. results after run 1 → first upgrade
  upgrade: async (s, dir) => {
    await s.eval(new Function(setupJs({ runs: 0, upgrades: {} }).replace(/app\./g, 'window.__app.')));
    await s.eval(() => { const app = window.__app; app.state.runs = 0; app.beginRun({ levels: app.levels, upgrades: {}, startIndex: 0, assist: 0, modifiers: {} }, 'main'); window.__cap.bot('novice', 4); });
    await s.skipUntil(`app.mode === 'results'`, 120);
    await s.record(dir, 30);
    const r1 = await s.eval(() => { const b = [...document.querySelectorAll('.screen:not(.hidden) button')].find((x) => x.querySelector('.ico') && /upgrade|강화/i.test(x.textContent)); const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
    await s.eval((p) => window.__cap.tapFx(p[0], p[1]), r1);
    await s.record(dir, 6);
    await s.eval(() => window.__app.openUpgrades());
    await s.record(dir, 16);
    const r2 = await s.eval(() => { const b = window.__app.pop.upgrades.cards.flap.btn; const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
    await s.eval((p) => window.__cap.tapFx(p[0], p[1]), r2);
    await s.record(dir, 5);
    await s.eval(() => window.__app.pop.upgrades.buy('flap'));
    await s.record(dir, 30);
  },
  // 6. village: build an igloo, a new family moves in
  village: async (s, dir) => {
    await s.eval(new Function(setupJs({ runs: 14, bestIsland: 3, fish: 760, upgrades: UPS[3], build: ['igloo1', 'fishrack', 'igloo2', 'workshop', 'pine', 'lighthouse'], hatch: 6 }).replace(/app\./g, 'window.__app.')));
    await s.eval(() => window.__app.goHub());
    await s.skip(1.2);
    await s.record(dir, 14);
    const r1 = await s.eval(() => { const r = window.__app.ui.screens.hub.btnBuild.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
    await s.eval((p) => window.__cap.tapFx(p[0], p[1]), r1);
    await s.record(dir, 5);
    await s.eval(() => window.__app.openBuild());
    await s.record(dir, 18);
    const r2 = await s.eval(() => { const r = window.__app.pop.build.rows.igloo3.btn.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
    await s.eval((p) => window.__cap.tapFx(p[0], p[1]), r2);
    await s.record(dir, 5);
    await s.eval(() => window.__app.pop.build.rows.igloo3.btn.click());
    await s.record(dir, 56);
  },
  // 7. montage of later islands (each a natural moment found with the simulator)
  m_sunset: runShot({ island: 4, seed: 4, t0: 5.7, dur: 1.15 }),
  m_geyser: runShot({ island: 5, seed: 1, t0: 6.9, dur: 1.15 }),
  m_rings: runShot({ island: 6, seed: 1, t0: 2.75, dur: 1.15 }),
  m_clouds: runShot({ island: 7, seed: 3, t0: 6.5, dur: 1.15 }),
  // 8. in-engine cinematic: the highest soar on Sky's End in slow motion, camera moves in close
  cinematic: runShot({ island: 8, seed: 3, t0: 4.75, dur: 2.0, cinematic: { zoom: 1.3 } }),
  // 9. end card: the real title screen (the game plays itself behind the logo)
  title: async (s, dir) => {
    await s.eval(() => { const app = window.__app; app.state.tutorialDone = false; app.state.runs = 0; app.showTitle(); app.run.capture = false; });
    await s.skip(2.4);
    await s.record(dir, 78);
  },
};

