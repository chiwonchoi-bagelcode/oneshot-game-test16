// Non-penguin sprites: blizzard spirit, fish, world objects, effects, village buildings.
import { PAL, id, paintFilter, glowFilter, lin, rad, svg, blob, curve, ellipsePts, f, star, sparkle } from './lib.mjs';

const OUT = 5.2;
const S = (o) => `stroke="${PAL.ink}" stroke-width="${o ?? OUT}" stroke-linejoin="round" stroke-linecap="round"`;

function wrap(w, h, defsArr, body, { filter = true, seed = 4, wobble = 1.4 } = {}) {
  const fid = id('pf');
  const defs = (filter ? paintFilter(fid, { seed, wobble }) : '') + defsArr.join('');
  return svg(w, h, defs, filter ? `<g filter="url(#${fid})">${body}</g>` : body);
}

// ---------------------------------------------------------------- blizzard spirit
export function blizzardSVG(mood = 'blow', phase = 0) {
  const W = 512, H = 512;
  const g1 = id('bz'), g2 = id('bz'), gl = id('gl');
  const cx = 262, cy = 262;
  // cloud body from overlapping lobes
  const lobes = [];
  const n = 11;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + phase * 0.4;
    const r = 138 + 16 * Math.sin(i * 2.3 + phase * 2);
    lobes.push([cx + Math.cos(a) * r * 1.0, cy + Math.sin(a) * r * 0.9, 70 + 12 * Math.cos(i * 1.7 + phase * 3)]);
  }
  const lobeSvg = (fill, stroke, extra = 0) => lobes.map(([x, y, r]) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r + extra)}" fill="${fill}" ${stroke ? S(OUT * 1.2) : ''}/>`).join('');
  const core = `<ellipse cx="${cx}" cy="${cy}" rx="175" ry="150" fill="url(#${g1})"/>`;
  // face
  let face = '';
  const ex1 = cx + 40, ex2 = cx + 128, ey = cy - 30;
  const eye = (x, y, s, look = 10) => `<ellipse cx="${x}" cy="${y}" rx="${26 * s}" ry="${32 * s}" fill="#fff" ${S(OUT)}/>
    <ellipse cx="${x + look}" cy="${y + 4}" rx="${13 * s}" ry="${17 * s}" fill="${PAL.navyDark}"/>
    <circle cx="${x + look - 4}" cy="${y - 4}" r="${5 * s}" fill="#fff"/>`;
  const brow = (x, y, rot) => `<path d="M${x - 30},${y} Q${x},${y - 14} ${x + 30},${y + 2}" transform="rotate(${rot} ${x} ${y})" fill="none" stroke="${PAL.ink}" stroke-width="11" stroke-linecap="round"/>`;
  const cheeks = `<ellipse cx="${cx + 30}" cy="${cy + 40}" rx="26" ry="16" fill="#b9d2ff" opacity="0.8"/><ellipse cx="${cx + 150}" cy="${cy + 36}" rx="20" ry="13" fill="#b9d2ff" opacity="0.8"/>`;
  if (mood === 'blow') {
    const puff = phase > 0.5 ? 1.12 : 1;
    face = `${cheeks}${eye(ex1, ey, 1)}${eye(ex2, ey - 4, 0.92)}${brow(ex1, ey - 46, 14)}${brow(ex2, ey - 50, 8)}
      <ellipse cx="${cx + 172}" cy="${cy + 46}" rx="${22 * puff}" ry="${26 * puff}" fill="#3a4a8c" ${S(OUT)}/>
      <ellipse cx="${cx + 176}" cy="${cy + 50}" rx="${10 * puff}" ry="${13 * puff}" fill="#1d2550"/>
      <ellipse cx="${cx + 92}" cy="${cy + 34}" rx="${44 * puff}" ry="${30 * puff}" fill="#e8f1ff" opacity="0.6"/>`;
  } else if (mood === 'grin') {
    face = `${cheeks}${eye(ex1, ey, 1.05, 14)}${eye(ex2, ey - 4, 0.95, 14)}${brow(ex1, ey - 48, 22)}${brow(ex2, ey - 52, 14)}
      <path d="M${cx + 40},${cy + 40} Q${cx + 110},${cy + 100} ${cx + 180},${cy + 30} Q${cx + 110},${cy + 66} ${cx + 40},${cy + 40}Z" fill="#3a4a8c" ${S(OUT)}/>
      <path d="M${cx + 70},${cy + 52} L${cx + 82},${cy + 64} L${cx + 94},${cy + 58} M${cx + 130},${cy + 58} L${cx + 142},${cy + 62} L${cx + 154},${cy + 50}" fill="#fff" stroke="#fff" stroke-width="5"/>`;
  } else if (mood === 'laugh') {
    face = `${cheeks}
      <path d="M${ex1 - 26},${ey} Q${ex1},${ey - 30} ${ex1 + 26},${ey}" fill="none" stroke="${PAL.ink}" stroke-width="10" stroke-linecap="round"/>
      <path d="M${ex2 - 24},${ey - 4} Q${ex2},${ey - 32} ${ex2 + 24},${ey - 4}" fill="none" stroke="${PAL.ink}" stroke-width="10" stroke-linecap="round"/>
      <path d="M${cx + 30},${cy + 30} Q${cx + 110},${cy + 150} ${cx + 190},${cy + 24} Z" fill="#3a4a8c" ${S(OUT)}/>
      <path d="M${cx + 70},${cy + 80} Q${cx + 110},${cy + 118} ${cx + 150},${cy + 76} Q${cx + 110},${cy + 96} ${cx + 70},${cy + 80}Z" fill="#ff8fa3"/>`;
  } else { // sulk (far away)
    face = `${eye(ex1, ey + 6, 0.9, 6)}${eye(ex2, ey + 2, 0.82, 6)}
      <path d="M${ex1 - 30},${ey - 14} L${ex1 + 30},${ey - 6}" stroke="${PAL.ink}" stroke-width="10" stroke-linecap="round"/>
      <path d="M${ex2 - 28},${ey - 10} L${ex2 + 26},${ey - 16}" stroke="${PAL.ink}" stroke-width="10" stroke-linecap="round"/>
      <path d="M${cx + 70},${cy + 64} Q${cx + 100},${cy + 48} ${cx + 132},${cy + 62}" fill="none" stroke="${PAL.ink}" stroke-width="9" stroke-linecap="round"/>`;
  }
  // swirl marks inside the cloud
  const swirls = [0, 1, 2].map((k) => {
    const a = phase * 2 + k * 2.1;
    const x = cx - 80 + Math.cos(a) * 40, y = cy + 60 + Math.sin(a) * 50;
    return `<path d="M${f(x)},${f(y)} q30,-26 60,-6 q20,16 0,30" fill="none" stroke="#9fb8e8" stroke-width="7" stroke-linecap="round" opacity="0.7"/>`;
  }).join('');
  const flakes = [0, 1, 2, 3, 4].map((k) => {
    const a = phase * 3 + k * 1.3;
    const x = 60 + ((k * 97 + phase * 200) % 380), y = 80 + ((k * 151) % 360);
    return snowflake(x, y, 10 + (k % 3) * 4, a);
  }).join('');
  const body = `
    <g>${lobeSvg('#ffffff', true, 0)}</g>
    <g>${lobeSvg('#ffffff', false, -OUT * 0.6)}</g>
    ${core}
    <g opacity="0.55">${lobes.map(([x, y, r]) => `<circle cx="${f(x - r * 0.25)}" cy="${f(y - r * 0.3)}" r="${f(r * 0.45)}" fill="#ffffff"/>`).join('')}</g>
    ${swirls}
    ${face}
    ${flakes}`;
  return wrap(W, H, [
    `<radialGradient id="${g1}" cx="0.6" cy="0.35" r="0.75"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset="0.65" stop-color="#d7e5ff" stop-opacity="0.55"/><stop offset="1" stop-color="#9db6ec" stop-opacity="0.85"/></radialGradient>`,
  ], body, { seed: 9, wobble: 2.2 });
}

export function snowflake(x, y, r, rot = 0, color = '#ffffff', sw = 3.2) {
  let d = '';
  for (let i = 0; i < 6; i++) {
    const a = rot + (i * Math.PI) / 3;
    const ex = x + Math.cos(a) * r, ey = y + Math.sin(a) * r;
    d += `M${f(x)},${f(y)} L${f(ex)},${f(ey)} `;
    const bx = x + Math.cos(a) * r * 0.6, by = y + Math.sin(a) * r * 0.6;
    for (const s of [-1, 1]) {
      const a2 = a + s * 0.7;
      d += `M${f(bx)},${f(by)} L${f(bx + Math.cos(a2) * r * 0.35)},${f(by + Math.sin(a2) * r * 0.35)} `;
    }
  }
  return `<path d="${d}" stroke="${PAL.inkSoft}" stroke-width="${sw + 3}" stroke-linecap="round" opacity="0.55"/><path d="${d}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>`;
}

// ---------------------------------------------------------------- fish
export function fishSVG(gold = false, wiggle = 0) {
  const W = 128, H = 96;
  const g = id('fg'), gb = id('fb');
  const c = gold ? [PAL.goldLight, PAL.gold, PAL.goldDark] : [PAL.fishLight, PAL.fish, PAL.fishDark];
  const t = wiggle ? 8 : -6;
  const bodyD = blob([[22, 48], [44, 24], [78, 20], [100, 34], [108, 48], [100, 62], [78, 74], [44, 72]], 1);
  const tail = `<path d="M30,48 L${8},${26 + t} Q14,48 ${8},${70 + t} Z" fill="url(#${g})" ${S(4.4)}/>`;
  const fin = gold
    ? `<path d="M56,24 L62,8 L70,20 L78,6 L84,24" fill="${PAL.gold}" ${S(4)}/>`
    : `<path d="M58,24 Q70,8 84,24" fill="${c[1]}" ${S(4)}/>`;
  const body = `${tail}${fin}
    <path d="${bodyD}" fill="url(#${g})" ${S(4.6)}/>
    <path d="M42,58 Q66,70 96,56" fill="none" stroke="${c[2]}" stroke-width="4" stroke-linecap="round" opacity="0.6"/>
    <path d="M44,34 Q64,26 86,32" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.7"/>
    <path d="M70,30 Q66,48 72,66" fill="none" stroke="${c[2]}" stroke-width="3.4" stroke-linecap="round" opacity="0.7"/>
    <circle cx="90" cy="42" r="8" fill="#fff" ${S(3.4)}/><circle cx="92" cy="43" r="4" fill="${PAL.navyDark}"/><circle cx="90.5" cy="41" r="1.6" fill="#fff"/>
    <path d="M102,54 Q106,56 102,58" fill="none" stroke="${PAL.ink}" stroke-width="2.6" stroke-linecap="round"/>
    ${gold ? `<path d="${sparkle(30, 18, 12, 0.25)}" fill="#fff" ${S(2.4)}/><path d="${sparkle(112, 80, 8, 0.25)}" fill="#fff"/>` : ''}`;
  return wrap(W, H, [lin(g, [[0, c[0]], [0.55, c[1]], [1, c[2]]], 0, 0, 0, 1)], body, { seed: gold ? 2 : 3, wobble: 1 });
}

// ---------------------------------------------------------------- world objects
export function pineSVG(v = 0) {
  const W = 256, H = 384;
  const g = id('pn'), gs = id('ps');
  const tiers = v === 2 ? 4 : 3;
  const sy = v === 2 ? 0.86 : 1;
  let body = `<g transform="translate(0,${f(384 * (1 - sy))}) scale(1,${sy})"><rect x="116" y="300" width="24" height="70" rx="6" fill="${PAL.wood}" ${S()}/>`;
  for (let i = 0; i < tiers; i++) {
    const t = i / tiers;
    const w = (v === 1 ? 108 : 120) * (1 - t * 0.55);
    const y0 = 320 - i * (v === 2 ? 66 : 80);
    const top = y0 - (v === 2 ? 110 : 120);
    body += `<path d="M${128 - w},${y0} Q128,${y0 + 22} ${128 + w},${y0} L${128 + w * 0.15},${top} Q128,${top - 10} ${128 - w * 0.15},${top} Z" fill="url(#${g})" ${S()}/>
      <path d="M${128 - w * 0.75},${y0 - 6} Q${128 - w * 0.3},${y0 - 30} 128,${y0 - 12} Q${128 + w * 0.4},${y0 - 34} ${128 + w * 0.8},${y0 - 6} Q128,${y0 + 14} ${128 - w * 0.75},${y0 - 6}Z" fill="url(#${gs})" ${S(OUT * 0.7)}/>`;
  }
  body += `<path d="M110,${320 - (tiers - 1) * (v === 2 ? 66 : 80) - 108} Q128,${320 - (tiers - 1) * (v === 2 ? 66 : 80) - 140} 146,${320 - (tiers - 1) * (v === 2 ? 66 : 80) - 108} Z" fill="#fff" ${S(OUT * 0.7)}/>`;
  return wrap(W, H, [lin(g, [[0, PAL.pineLight], [0.6, PAL.pine], [1, PAL.pineDark]], 0, 0, 1, 1), lin(gs, [[0, '#ffffff'], [1, PAL.snowShade]])], body, { seed: 11 + v });
}

export function rockSVG(v = 0) {
  const W = 256, H = 192;
  const g = id('rk'), gs = id('rs');
  const shapes = [
    [[30, 170], [40, 110], [90, 70], [160, 62], [214, 100], [232, 170]],
    [[50, 172], [56, 120], [110, 84], [170, 96], [200, 172]],
    [[20, 172], [36, 130], [80, 110], [120, 60], [176, 70], [220, 120], [236, 172]],
  ][v % 3];
  const d = blob(shapes, 0.8);
  const capPts = shapes.filter((p) => p[1] < 140);
  const cap = curve([[capPts[0][0] - 6, capPts[0][1] + 18], ...capPts.map(([x, y]) => [x, y - 4]), [capPts[capPts.length - 1][0] + 6, capPts[capPts.length - 1][1] + 18]]);
  const body = `<path d="${d}" fill="url(#${g})" ${S()}/>
    <path d="${cap} Q128,${Math.min(...capPts.map((p) => p[1])) + 60} ${capPts[0][0] - 6},${capPts[0][1] + 18}Z" fill="url(#${gs})" ${S(OUT * 0.75)}/>
    <path d="M80,150 Q110,140 130,150" fill="none" stroke="${PAL.rockDark}" stroke-width="4" stroke-linecap="round"/>`;
  return wrap(W, H, [lin(g, [[0, PAL.rockLight], [0.5, PAL.rock], [1, PAL.rockDark]], 0, 0, 0.6, 1), lin(gs, [[0, '#ffffff'], [1, PAL.snowShade]])], body, { seed: 21 + v });
}

export function crystalSVG(v = 0, tint = 'ice') {
  const W = 256, H = 256;
  const g = id('cr');
  const cols = tint === 'star' ? ['#fff6c8', '#ffd86b', '#e0a72a'] : tint === 'aurora' ? ['#e8fff4', '#7be0c0', '#3a9f9a'] : ['#f0fdff', PAL.ice, PAL.iceDeep];
  const shards = v === 0
    ? [[128, 240, 30, 170, 0], [86, 240, 22, 110, -22], [170, 240, 24, 120, 20]]
    : [[110, 240, 26, 150, -8], [154, 240, 20, 100, 16], [76, 240, 16, 70, -28], [190, 240, 16, 66, 30]];
  let body = '';
  for (const [x, y, w, h, rot] of shards) {
    body += `<g transform="rotate(${rot} ${x} ${y})"><path d="M${x - w},${y} L${x - w},${y - h * 0.75} L${x},${y - h} L${x + w},${y - h * 0.75} L${x + w},${y} Z" fill="url(#${g})" ${S()}/>
      <path d="M${x},${y - h} L${x},${y}" stroke="#fff" stroke-width="4" opacity="0.6"/>
      <path d="M${x - w * 0.6},${y - h * 0.7} L${x - w * 0.6},${y - h * 0.2}" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.8"/></g>`;
  }
  body += `<ellipse cx="128" cy="236" rx="96" ry="12" fill="#ffffff" ${S(OUT * 0.7)}/>`;
  return wrap(W, H, [lin(g, [[0, cols[0]], [0.5, cols[1]], [1, cols[2]]], 0, 0, 1, 1)], body, { seed: 31 + v });
}

export function snowmanSVG() {
  const W = 256, H = 320;
  const g = id('sm');
  const body = `<g transform="translate(0,14) scale(0.96)">
    <circle cx="128" cy="236" r="70" fill="url(#${g})" ${S()}/>
    <circle cx="128" cy="138" r="50" fill="url(#${g})" ${S()}/>
    <circle cx="128" cy="62" r="40" fill="url(#${g})" ${S()}/>
    <path d="M86,40 L170,40 L162,28 L150,-2 L106,-2 L94,28 Z" transform="translate(0,6)" fill="#3a4a8c" ${S()}/>
    <rect x="80" y="42" width="96" height="12" rx="5" fill="#e8423f" ${S(OUT * 0.8)}/>
    <circle cx="114" cy="58" r="5" fill="${PAL.navyDark}"/><circle cx="142" cy="58" r="5" fill="${PAL.navyDark}"/>
    <path d="M128,68 L160,76 L128,80 Z" fill="${PAL.beak}" ${S(3.6)}/>
    <path d="M110,88 Q128,98 146,88" fill="none" stroke="${PAL.navyDark}" stroke-width="4" stroke-linecap="round"/>
    <path d="M80,108 Q128,128 176,108 L172,124 Q128,142 84,124Z" fill="${PAL.scarf}" ${S(OUT * 0.8)}/>
    <path d="M150,118 L166,170 L150,172 L140,126 Z" fill="${PAL.scarfDark}" ${S(OUT * 0.8)}/>
    <circle cx="128" cy="140" r="5" fill="${PAL.navyDark}"/><circle cx="128" cy="162" r="5" fill="${PAL.navyDark}"/>
    <path d="M80,140 L30,100 M44,112 L32,120 M184,140 L230,104 M216,114 L232,112" stroke="${PAL.woodDark}" stroke-width="7" stroke-linecap="round"/></g>`;
  return wrap(W, H, [rad(g, [[0, '#ffffff'], [0.7, PAL.snow], [1, PAL.snowShade]], 0.35, 0.3, 0.8)], body, { seed: 41 });
}

export function spireSVG(v = 0) {
  const W = 256, H = 448;
  const g = id('sp'), gs = id('ss');
  const top = v ? 60 : 30;
  const d = `M70,440 Q60,300 92,${top + 120} Q100,${top + 20} 126,${top} Q150,${top + 30} 162,${top + 110} Q196,300 190,440 Z`;
  const body = `<path d="${d}" fill="url(#${g})" ${S()}/>
    <path d="M100,${top + 60} Q126,${top - 10} 154,${top + 70} Q140,${top + 90} 126,${top + 70} Q112,${top + 96} 100,${top + 60}Z" fill="url(#${gs})" ${S(OUT * 0.75)}/>
    <path d="M96,300 Q120,290 140,300 M110,380 Q130,372 160,384" fill="none" stroke="${PAL.rockDark}" stroke-width="5" stroke-linecap="round"/>
    <path d="M78,420 Q74,330 98,250" fill="none" stroke="${PAL.rockLight}" stroke-width="6" stroke-linecap="round" opacity="0.7"/>`;
  return wrap(W, H, [lin(g, [[0, PAL.rockLight], [0.5, PAL.rock], [1, PAL.rockDark]], 0, 0, 1, 0.4), lin(gs, [[0, '#ffffff'], [1, PAL.snowShade]])], body, { seed: 51 + v });
}

export function balloonSVG() {
  const W = 256, H = 384;
  const g = id('bl');
  const body = `
    <path d="M128,30 C40,30 34,150 96,214 L112,250 L144,250 L160,214 C222,150 216,30 128,30Z" fill="url(#${g})" ${S()}/>
    <path d="M128,30 C96,60 92,170 112,250 M128,30 C160,60 164,170 144,250" fill="none" stroke="${PAL.ink}" stroke-width="4"/>
    <path d="M70,110 Q128,130 186,110" fill="none" stroke="#fff" stroke-width="10" opacity="0.8"/>
    <path d="M112,250 L106,300 M144,250 L150,300" stroke="${PAL.woodDark}" stroke-width="4"/>
    <rect x="98" y="298" width="60" height="44" rx="8" fill="${PAL.wood}" ${S()}/>
    <path d="M104,312 L152,312" stroke="${PAL.woodLight}" stroke-width="5" stroke-linecap="round"/>`;
  return wrap(W, H, [lin(g, [[0, '#ffd166'], [0.45, '#ff8fa3'], [1, '#8b6ee8']], 0, 0, 1, 1)], body, { seed: 61 });
}

export function starDecoSVG() {
  const W = 192, H = 192;
  const g = id('st'), gl = id('gw');
  const body = `<circle cx="96" cy="96" r="70" fill="#fff6b0" opacity="0.35"/>
    <path d="${star(96, 98, 64, 30, 5)}" fill="url(#${g})" ${S()}/>
    <circle cx="80" cy="92" r="5" fill="${PAL.navyDark}"/><circle cx="110" cy="92" r="5" fill="${PAL.navyDark}"/>
    <path d="M86,108 Q96,116 106,108" fill="none" stroke="${PAL.navyDark}" stroke-width="4" stroke-linecap="round"/>
    <path d="M70,72 Q80,62 92,64" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>`;
  return wrap(W, H, [lin(g, [[0, '#fff7b8'], [0.6, PAL.gold], [1, PAL.goldDark]], 0, 0, 0.5, 1)], body, { seed: 71 });
}

export function signSVG() {
  const W = 320, H = 320;
  const g = id('sg');
  const body = `<rect x="148" y="150" width="24" height="160" rx="6" fill="${PAL.wood}" ${S()}/>
    <path d="M30,60 L274,52 L294,104 L274,158 L36,164 Q22,112 30,60Z" fill="url(#${g})" ${S()}/>
    <path d="M44,76 L262,70" stroke="${PAL.woodLight}" stroke-width="6" stroke-linecap="round" opacity="0.8"/>
    <path d="M44,146 L262,142" stroke="${PAL.woodDark}" stroke-width="5" stroke-linecap="round" opacity="0.6"/>
    <path d="M28,62 Q60,36 120,46 Q180,30 240,44 Q280,40 276,56 L30,64Z" fill="#fff" ${S(OUT * 0.7)}/>`;
  return wrap(W, H, [lin(g, [[0, PAL.woodLight], [0.5, PAL.wood], [1, PAL.woodDark]], 0, 0, 0, 1)], body, { seed: 81 });
}

export function flagSVG(kind = 'record') {
  const W = 192, H = 320;
  const g = id('fl');
  const col = kind === 'record' ? ['#ff7a6b', PAL.scarf, PAL.scarfDark] : ['#a7f0ff', '#4fb6e8', '#2a7fc0'];
  const body = `<rect x="40" y="30" width="14" height="280" rx="6" fill="#e6ecff" ${S()}/>
    <path d="M54,40 Q110,26 170,50 Q140,78 172,108 Q112,96 54,118 Z" fill="url(#${g})" ${S()}/>
    ${kind === 'record' ? `<path d="${star(104, 76, 20, 9, 5)}" fill="#fff" ${S(3)}/>` : `<path d="M86,78 L104,62 L122,78 L104,94Z" fill="#fff" ${S(3)}/>`}
    <circle cx="47" cy="26" r="12" fill="${PAL.gold}" ${S(OUT * 0.8)}/>
    <ellipse cx="47" cy="306" rx="34" ry="10" fill="#fff" ${S(OUT * 0.7)}/>`;
  return wrap(W, H, [lin(g, [[0, col[0]], [0.5, col[1]], [1, col[2]]], 0, 0, 1, 1)], body, { seed: 91 });
}

export function rampSVG() {
  // chevron arrows painted on the launch ramp
  const W = 192, H = 128;
  const body = [0, 1, 2].map((i) => `<path d="M${30 + i * 50},24 L${70 + i * 50},64 L${30 + i * 50},104" fill="none" stroke="${PAL.ink}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
    <path d="M${30 + i * 50},24 L${70 + i * 50},64 L${30 + i * 50},104" fill="none" stroke="${PAL.gold}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
  return wrap(W, H, [], body, { seed: 95 });
}

export function geyserVentSVG() {
  const W = 256, H = 128;
  const g = id('gv');
  const body = `<path d="M20,110 Q30,60 80,56 Q128,40 176,56 Q226,60 236,110 Z" fill="url(#${g})" ${S()}/>
    <ellipse cx="128" cy="62" rx="44" ry="13" fill="#2a3266" ${S(OUT * 0.8)}/>
    <ellipse cx="128" cy="60" rx="30" ry="7" fill="#7be0e0" opacity="0.8"/>
    <path d="M44,96 Q60,80 84,84 M170,84 Q196,80 212,96" fill="none" stroke="${PAL.rockLight}" stroke-width="6" stroke-linecap="round"/>`;
  return wrap(W, H, [lin(g, [[0, '#c49a8a'], [0.6, '#9a6e6a'], [1, '#6d4a58']], 0, 0, 0, 1)], body, { seed: 97 });
}

export function plumeSVG(frame = 0) {
  const W = 256, H = 512;
  const g = id('pl');
  const puffs = [];
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const r = 26 + t * 40 + Math.sin(i * 1.7 + frame) * 6;
    const y = Math.max(r + 8, 470 - t * 400 - (frame * 14) % 40);
    const x = 128 + Math.sin(i * 2.1 + frame * 0.9) * 18 * t;
    puffs.push(`<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="url(#${g})" ${S(OUT * 0.8)}/>`);
  }
  const body = `<path d="M108,500 Q118,260 128,80 Q138,260 148,500Z" fill="#a8f0ff" opacity="0.85" ${S(OUT * 0.6)}/>${puffs.join('')}
    ${[0, 1, 2, 3].map((k) => `<circle cx="${100 + k * 18}" cy="${f(120 + ((k * 70 + frame * 30) % 300))}" r="6" fill="#d8faff" ${S(2.6)}/>`).join('')}`;
  return wrap(W, H, [rad(g, [[0, '#ffffff'], [0.7, '#eef8ff'], [1, '#c4dcf2']], 0.4, 0.35, 0.8)], body, { seed: 99 });
}

export function windSVG(frame = 0) {
  const W = 192, H = 384;
  let body = '';
  for (let i = 0; i < 4; i++) {
    const y = 370 - ((i * 90 + frame * 25) % 210);
    const x = 50 + (i % 2) * 70;
    body += `<path d="M${x},${y} q30,-40 0,-70 q-24,-22 -4,-50" fill="none" stroke="#ffffff" stroke-width="9" stroke-linecap="round" opacity="${0.55 + 0.1 * i}"/>
      <path d="M${x},${y} q30,-40 0,-70 q-24,-22 -4,-50" fill="none" stroke="#bfe0ff" stroke-width="3" stroke-linecap="round" opacity="0.9"/>`;
  }
  for (let i = 0; i < 3; i++) {
    const y = 330 - ((i * 120 + frame * 40) % 330);
    body += `<path d="M${130 + i * 8},${y} l10,-14 l6,10" fill="#fff" stroke="${PAL.inkSoft}" stroke-width="2"/>`;
  }
  return wrap(W, H, [], body, { filter: false });
}

export function ringSVG(part = 'back') {
  const W = 256, H = 320;
  const g = id('rg');
  const arc = part === 'back'
    ? `<path d="M128,20 A70,140 0 0 0 128,300" fill="none" stroke="${PAL.ink}" stroke-width="30" stroke-linecap="round" opacity="0.5"/><path d="M128,20 A70,140 0 0 0 128,300" fill="none" stroke="url(#${g})" stroke-width="20" stroke-linecap="round"/>`
    : `<path d="M128,20 A70,140 0 0 1 128,300" fill="none" stroke="${PAL.ink}" stroke-width="30" stroke-linecap="round"/><path d="M128,20 A70,140 0 0 1 128,300" fill="none" stroke="url(#${g})" stroke-width="20" stroke-linecap="round"/>
       <path d="M150,60 A60,120 0 0 1 176,150" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="0.9"/>`;
  return wrap(W, H, [lin(g, [[0, '#a6ffe0'], [0.5, '#62e0c4'], [1, '#8b6ee8']], 0, 0, 0, 1)], arc, { seed: 101 });
}

export function cloudSVG(v = 0) {
  const W = 384, H = 192;
  const g = id('cl');
  const sets = [
    [[90, 116, 52], [150, 90, 62], [222, 94, 56], [282, 120, 46], [190, 126, 54]],
    [[70, 126, 42], [130, 102, 56], [200, 88, 62], [270, 108, 52], [320, 132, 34], [190, 132, 50]],
    [[110, 120, 50], [180, 100, 60], [250, 118, 46], [180, 140, 48]],
  ][v % 3];
  const lobes = (extra, fill, st) => sets.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r + extra}" fill="${fill}" ${st}/>`).join('');
  const body = `${lobes(0, '#fff', S(OUT * 0.9))}${lobes(-3.5, `url(#${g})`, '')}
    <path d="M${sets[0][0] - 30},${Math.max(...sets.map((s) => s[1])) + 30} L${sets[sets.length - 2][0] + 40},${Math.max(...sets.map((s) => s[1])) + 30}" stroke="${PAL.ink}" stroke-width="0"/>`;
  return wrap(W, H, [lin(g, [[0, '#ffffff'], [0.6, '#f4f8ff'], [1, '#cddcf5']], 0, 0, 0, 1)], body, { seed: 111 + v, wobble: 2 });
}

// ---------------------------------------------------------------- effects (no outline wobble, crisp)
export function puffSVG(frame = 0) {
  const W = 192, H = 192;
  const g = id('pf');
  const t = frame / 3;
  const n = 6;
  let body = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + 0.3;
    const d = 22 + t * 46;
    const r = 34 - t * 16 + (i % 2) * 6;
    body += `<circle cx="${f(96 + Math.cos(a) * d)}" cy="${f(110 + Math.sin(a) * d * 0.7)}" r="${f(r)}" fill="url(#${g})" stroke="#9fb4e0" stroke-width="${2.6 - t * 1.2}" opacity="${1 - t * 0.35}"/>`;
  }
  return wrap(W, H, [rad(g, [[0, '#ffffff'], [0.7, '#f2f8ff'], [1, '#c8daf4']], 0.4, 0.35, 0.8)], body, { filter: false });
}

export function sparkleSVG(color = '#ffffff') {
  const W = 96, H = 96;
  const body = `<path d="${sparkle(48, 48, 44, 0.2)}" fill="${color}" stroke="${PAL.inkSoft}" stroke-width="3"/><circle cx="48" cy="48" r="8" fill="#fff"/>`;
  return wrap(W, H, [], body, { filter: false });
}

export function burstSVG() {
  const W = 256, H = 256;
  let body = '';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const r1 = 40, r2 = i % 2 ? 96 : 114;
    const x1 = 128 + Math.cos(a) * r1, y1 = 128 + Math.sin(a) * r1, x2 = 128 + Math.cos(a) * r2, y2 = 128 + Math.sin(a) * r2;
    body += `<path d="M${f(x1)},${f(y1)} L${f(x2)},${f(y2)}" stroke="#fff6b8" stroke-width="${i % 2 ? 9 : 13}" stroke-linecap="round"/>`;
  }
  body += `<circle cx="128" cy="128" r="34" fill="none" stroke="#fff" stroke-width="8"/>`;
  return wrap(W, H, [], body, { filter: false });
}

export function ringWaveSVG() {
  const W = 256, H = 256;
  return wrap(W, H, [], `<circle cx="128" cy="128" r="110" fill="none" stroke="#ffffff" stroke-width="14"/><circle cx="128" cy="128" r="110" fill="none" stroke="#bfe8ff" stroke-width="5"/>`, { filter: false });
}

export function flakeSVG() {
  return wrap(96, 96, [], snowflake(48, 48, 38, 0, '#ffffff', 6), { filter: false });
}

export function dizzySVG() {
  const g = id('dz');
  return wrap(96, 96, [lin(g, [[0, '#fff3a0'], [1, PAL.gold]])], `<path d="${star(48, 50, 40, 18, 5)}" fill="url(#${g})" ${S(4)}/>`, { filter: false });
}

export function speedLineSVG() {
  return wrap(256, 32, [], `<path d="M6,16 Q128,6 250,14 Q128,26 6,16Z" fill="#ffffff" opacity="0.95"/>`, { filter: false });
}

export function heartSVG() {
  return wrap(96, 96, [], `<path d="M48,82 C14,58 10,32 26,22 C38,14 48,24 48,32 C48,24 58,14 70,22 C86,32 82,58 48,82Z" fill="#ff8fa3" ${S(4)}/><path d="M30,32 Q34,26 40,28" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`, { filter: false });
}

export function noteSVG() {
  return wrap(96, 96, [], `<path d="M36,70 L36,22 L72,14 L72,62" fill="none" stroke="${PAL.ink}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="28" cy="72" rx="12" ry="9" fill="${PAL.ink}"/><ellipse cx="64" cy="64" rx="12" ry="9" fill="${PAL.ink}"/>`, { filter: false });
}

// ---------------------------------------------------------------- village buildings
export function iglooSVG(v = 0) {
  const W = 384, H = 320;
  const g = id('ig');
  const lantern = v >= 1;
  const chimney = v >= 2;
  let blocks = '';
  for (let r = 0; r < 4; r++) {
    const y = 270 - r * 46;
    const half = Math.sqrt(Math.max(0, 1 - Math.pow((270 - y + 20) / 210, 2))) * 160;
    blocks += `<path d="M${192 - half},${y} Q192,${y + 8} ${192 + half},${y}" fill="none" stroke="${PAL.snowDeep}" stroke-width="4" stroke-linecap="round" opacity="0.8"/>`;
    for (let k = -3; k <= 3; k++) {
      const x = 192 + k * 48 + (r % 2) * 24;
      if (Math.abs(x - 192) < half - 10) blocks += `<path d="M${x},${y} L${x + 3},${y - 40}" stroke="${PAL.snowDeep}" stroke-width="3.4" stroke-linecap="round" opacity="0.6"/>`;
    }
  }
  const body = `
    ${chimney ? `<rect x="250" y="70" width="34" height="70" rx="6" fill="#c9d6ef" ${S()}/><ellipse cx="267" cy="70" rx="22" ry="9" fill="#fff" ${S(OUT * 0.7)}/>` : ''}
    <path d="M32,290 Q30,92 192,80 Q354,92 352,290 Z" fill="url(#${g})" ${S()}/>
    ${blocks}
    <path d="M120,290 Q118,186 192,182 Q266,186 264,290 Z" fill="#dce8fb" ${S()}/>
    <path d="M146,290 Q146,216 192,212 Q238,216 238,290 Z" fill="#2b3570" ${S(OUT * 0.8)}/>
    <path d="M160,290 Q160,232 192,228 Q224,232 224,290 Z" fill="${lantern ? '#ffcf6b' : '#3d4a8a'}" opacity="${lantern ? 0.95 : 1}"/>
    ${lantern ? `<path d="M300,150 L300,196" stroke="${PAL.woodDark}" stroke-width="5"/><rect x="288" y="194" width="24" height="30" rx="7" fill="#ffd166" ${S(OUT * 0.8)}/><circle cx="300" cy="209" r="22" fill="#ffe7a0" opacity="0.4"/>` : ''}
    <path d="M70,170 Q110,110 180,104" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity="0.9"/>
    <ellipse cx="192" cy="292" rx="180" ry="14" fill="#ffffff" ${S(OUT * 0.6)}/>`;
  return wrap(W, H, [rad(g, [[0, '#ffffff'], [0.6, '#eef5ff'], [1, '#bccfee']], 0.35, 0.3, 0.85)], body, { seed: 121 + v });
}

export function fishRackSVG() {
  const W = 384, H = 320;
  const fish = (x, y) => `<g transform="translate(${x},${y}) rotate(90) scale(0.42)"><path d="M22,48 C40,20 80,18 104,38 C110,48 104,58 96,64 C80,76 40,74 22,48Z" fill="${PAL.fish}" ${S(9)}/><path d="M30,48 L6,28 Q14,48 6,70Z" fill="${PAL.fishDark}" ${S(9)}/><circle cx="88" cy="42" r="7" fill="#fff"/><circle cx="90" cy="43" r="3.4" fill="${PAL.navyDark}"/></g>`;
  const body = `
    <rect x="44" y="70" width="20" height="230" rx="6" fill="${PAL.wood}" ${S()}/>
    <rect x="320" y="70" width="20" height="230" rx="6" fill="${PAL.wood}" ${S()}/>
    <rect x="30" y="66" width="324" height="20" rx="8" fill="${PAL.woodLight}" ${S()}/>
    <rect x="30" y="150" width="324" height="16" rx="7" fill="${PAL.wood}" ${S()}/>
    <path d="M30,62 Q100,40 192,52 Q290,40 354,62 L354,70 L30,70Z" fill="#fff" ${S(OUT * 0.7)}/>
    ${[90, 140, 190, 240, 290].map((x) => `<path d="M${x},86 L${x},104" stroke="${PAL.ink}" stroke-width="3"/>${fish(x + 16, 98)}`).join('')}
    ${[115, 165, 215, 265].map((x) => `<path d="M${x},166 L${x},180" stroke="${PAL.ink}" stroke-width="3"/>${fish(x + 16, 174)}`).join('')}
    <ellipse cx="192" cy="300" rx="176" ry="12" fill="#fff" ${S(OUT * 0.6)}/>`;
  return wrap(W, H, [], body, { seed: 131 });
}

export function lighthouseSVG() {
  const W = 256, H = 512;
  const g = id('lh');
  const body = `
    <path d="M70,480 L96,150 L160,150 L186,480 Z" fill="#fff" ${S()}/>
    <path d="M84,330 L172,330 L178,400 L78,400 Z M92,210 L164,210 L168,262 L88,262 Z" fill="${PAL.scarf}"/>
    <path d="M70,480 L96,150 L160,150 L186,480 Z" fill="none" ${S()}/>
    <rect x="84" y="128" width="88" height="26" rx="6" fill="${PAL.navy}" ${S()}/>
    <rect x="96" y="66" width="64" height="64" rx="10" fill="#fff3b0" ${S()}/>
    <circle cx="128" cy="98" r="20" fill="#ffd166"/>
    <path d="M86,70 Q128,20 170,70 Z" fill="${PAL.scarf}" ${S()}/>
    <circle cx="128" cy="34" r="8" fill="${PAL.gold}" ${S(OUT * 0.7)}/>
    <rect x="114" y="420" width="28" height="60" rx="12" fill="${PAL.wood}" ${S(OUT * 0.8)}/>
    <ellipse cx="128" cy="484" rx="100" ry="14" fill="#fff" ${S(OUT * 0.6)}/>`;
  return wrap(W, H, [], body, { seed: 141 });
}

export function workshopSVG() {
  const W = 384, H = 320;
  const g = id('ws');
  const body = `
    <rect x="60" y="130" width="264" height="160" rx="8" fill="url(#${g})" ${S()}/>
    ${[160, 190, 220, 250].map((y) => `<path d="M64,${y} L320,${y}" stroke="${PAL.woodDark}" stroke-width="3.4" opacity="0.6"/>`).join('')}
    <path d="M36,140 L192,40 L348,140 Z" fill="${PAL.scarfDark}" ${S()}/>
    <path d="M30,140 Q110,96 192,40 Q274,96 354,140 Q300,150 270,130 Q230,156 192,128 Q150,156 110,130 Q80,150 30,140Z" fill="#fff" ${S(OUT * 0.8)}/>
    <rect x="160" y="200" width="64" height="90" rx="6" fill="${PAL.woodDark}" ${S()}/>
    <rect x="86" y="180" width="50" height="44" rx="6" fill="#ffd98a" ${S()}/>
    <rect x="248" y="180" width="50" height="44" rx="6" fill="#ffd98a" ${S()}/>
    <path d="M100,300 Q130,280 180,290 L300,290 Q320,292 320,280" fill="none" stroke="${PAL.ink}" stroke-width="7" stroke-linecap="round"/>
    <path d="M110,296 Q140,276 190,286 L310,286" fill="none" stroke="#ff8a3d" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="192" cy="294" rx="176" ry="12" fill="#fff" ${S(OUT * 0.6)}/>`;
  return wrap(W, H, [lin(g, [[0, PAL.woodLight], [1, PAL.wood]], 0, 0, 0, 1)], body, { seed: 151 });
}

export function hotSpringSVG() {
  const W = 384, H = 256;
  const g = id('hs');
  const body = `
    <ellipse cx="192" cy="170" rx="170" ry="62" fill="#9a8fbf" ${S()}/>
    <ellipse cx="192" cy="164" rx="140" ry="44" fill="url(#${g})" ${S(OUT * 0.8)}/>
    ${[[40, 160], [80, 214], [150, 228], [240, 228], [310, 210], [348, 160]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="30" ry="18" fill="${PAL.rock}" ${S(OUT * 0.8)}/><path d="M${x - 18},${y - 8} Q${x},${y - 20} ${x + 18},${y - 8}" fill="#fff" ${S(3)}/>`).join('')}
    <path d="M150,150 Q190,140 230,152" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.8"/>
    ${[130, 190, 250].map((x, i) => `<path d="M${x},120 q-14,-22 0,-44 q14,-22 0,-44" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity="0.75"/>`).join('')}`;
  return wrap(W, H, [lin(g, [[0, '#a8f4f0'], [1, '#4fc4d8']], 0, 0, 0, 1)], body, { seed: 161 });
}

export function statueSVG() {
  // ice statue of a penguin on a plinth
  const W = 256, H = 384;
  const g = id('is');
  const body = `
    <rect x="58" y="300" width="140" height="60" rx="8" fill="#c9d6ef" ${S()}/>
    <path d="M128,60 C70,60 60,140 70,200 C78,262 100,300 128,300 C156,300 178,262 186,200 C196,140 186,60 128,60Z" fill="url(#${g})" ${S()}/>
    <circle cx="128" cy="96" r="44" fill="url(#${g})" ${S()}/>
    <path d="M150,96 L188,104 L150,114Z" fill="#c8f6ff" ${S(4)}/>
    <path d="M70,150 L28,110" stroke="${PAL.ink}" stroke-width="22" stroke-linecap="round"/><path d="M70,150 L28,110" stroke="#c8f6ff" stroke-width="12" stroke-linecap="round"/>
    <path d="M110,80 Q120,70 132,74" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
    <path d="M96,160 Q100,230 120,270" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity="0.8"/>`;
  return wrap(W, H, [lin(g, [[0, '#f2feff'], [0.5, '#9be7ff'], [1, '#5ab8e8']], 0, 0, 1, 1)], body, { seed: 171 });
}

export function stageSVG() {
  // festival lanterns string between two poles + a little stage
  const W = 448, H = 320;
  const lanterns = [70, 130, 190, 250, 310, 370].map((x, i) => {
    const y = 70 + Math.sin((i / 5) * Math.PI) * 40;
    const c = ['#ff8fa3', '#ffd166', '#7be0a0', '#7fd3ff', '#c4a6ff', '#ff9a2e'][i];
    return `<rect x="${x - 14}" y="${f(y)}" width="28" height="36" rx="10" fill="${c}" ${S(4)}/><circle cx="${x}" cy="${f(y + 18)}" r="22" fill="${c}" opacity="0.25"/>`;
  }).join('');
  const body = `
    <rect x="30" y="40" width="16" height="250" rx="6" fill="${PAL.wood}" ${S()}/>
    <rect x="402" y="40" width="16" height="250" rx="6" fill="${PAL.wood}" ${S()}/>
    <path d="M38,56 Q224,150 410,56" fill="none" stroke="${PAL.ink}" stroke-width="4"/>
    ${lanterns}
    <path d="M90,250 L358,250 L380,300 L68,300 Z" fill="${PAL.wood}" ${S()}/>
    <path d="M90,250 L358,250" stroke="${PAL.woodLight}" stroke-width="6"/>
    <path d="M72,248 Q224,226 376,248 L374,256 L74,256Z" fill="#fff" ${S(OUT * 0.6)}/>`;
  return wrap(W, H, [], body, { seed: 181 });
}

export function nestSVG(eggs = 1, crack = false) {
  const W = 256, H = 192;
  const g = id('eg');
  let e = '';
  const pos = [[128, 96], [96, 104], [160, 104]].slice(0, eggs);
  for (const [x, y] of pos) {
    e += `<ellipse cx="${x}" cy="${y}" rx="26" ry="34" fill="url(#${g})" ${S()}/>
      <path d="M${x - 12},${y - 14} Q${x - 6},${y - 24} ${x + 4},${y - 26}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
      <circle cx="${x + 8}" cy="${y + 8}" r="4" fill="#9fc0ee"/><circle cx="${x - 8}" cy="${y + 14}" r="3" fill="#9fc0ee"/>
      ${crack ? `<path d="M${x - 22},${y - 2} L${x - 10},${y - 10} L${x},${y} L${x + 10},${y - 10} L${x + 22},${y - 2}" fill="none" stroke="${PAL.ink}" stroke-width="4" stroke-linejoin="round"/>` : ''}`;
  }
  const body = `<ellipse cx="128" cy="150" rx="104" ry="34" fill="${PAL.wood}" ${S()}/>
    ${e}
    <path d="M28,140 Q128,190 228,140 Q226,176 128,186 Q30,176 28,140Z" fill="${PAL.woodLight}" ${S()}/>
    ${[50, 80, 110, 140, 170, 200].map((x) => `<path d="M${x},154 L${x + 18},170" stroke="${PAL.woodDark}" stroke-width="4" stroke-linecap="round"/>`).join('')}`;
  return wrap(W, H, [rad(g, [[0, '#ffffff'], [0.8, '#eef4ff'], [1, '#cbd9f2']], 0.35, 0.3, 0.8)], body, { seed: 191 });
}

export function siteSVG() {
  // construction site: scaffold, stacked snow blocks, little flag
  const W = 384, H = 320;
  const body = `
    ${[[80, 250], [150, 250], [220, 250], [115, 205], [185, 205]].map(([x, y]) => `<rect x="${x}" y="${y}" width="68" height="44" rx="8" fill="#eef5ff" ${S()}/><path d="M${x + 8},${y + 10} L${x + 30},${y + 10}" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`).join('')}
    <path d="M290,296 L290,120" stroke="${PAL.wood}" stroke-width="12" stroke-linecap="round"/>
    <path d="M290,296 L290,120" stroke="${PAL.ink}" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
    <path d="M296,124 L350,138 L296,156Z" fill="${PAL.gold}" ${S(OUT * 0.8)}/>
    <path d="M40,296 L60,150 M100,296 L60,150 M44,240 L88,240" stroke="${PAL.woodDark}" stroke-width="9" stroke-linecap="round"/>
    <ellipse cx="192" cy="298" rx="176" ry="12" fill="#fff" ${S(OUT * 0.6)}/>`;
  return wrap(W, H, [], body, { seed: 201 });
}

export function kiteSVG() {
  const W = 256, H = 384;
  const body = `
    <path d="M128,30 L196,110 L128,210 L60,110 Z" fill="#ff8fa3" ${S()}/>
    <path d="M128,30 L128,210 M60,110 L196,110" stroke="${PAL.ink}" stroke-width="4"/>
    <path d="M128,30 L196,110 L128,110 Z" fill="#ffd166"/>
    <path d="M128,30 L196,110 L128,210 L60,110 Z" fill="none" ${S()}/>
    <path d="M128,210 Q100,250 130,280 Q160,310 128,350" fill="none" stroke="${PAL.ink}" stroke-width="4"/>
    ${[250, 290, 330].map((y, i) => `<path d="M${118 + (i % 2) * 18},${y} l14,-8 l0,16z" fill="${['#7fd3ff', '#7be0a0', '#c4a6ff'][i]}" ${S(3)}/>`).join('')}`;
  return wrap(W, H, [], body, { seed: 211 });
}

export function fenceSVG() {
  const W = 256, H = 128;
  const body = `${[20, 90, 160, 230].map((x) => `<rect x="${x - 9}" y="30" width="18" height="90" rx="6" fill="${PAL.wood}" ${S(OUT * 0.8)}/><ellipse cx="${x}" cy="30" rx="13" ry="7" fill="#fff" ${S(3)}/>`).join('')}
    <rect x="6" y="56" width="244" height="14" rx="6" fill="${PAL.woodLight}" ${S(OUT * 0.8)}/>
    <rect x="6" y="88" width="244" height="14" rx="6" fill="${PAL.woodLight}" ${S(OUT * 0.8)}/>`;
  return wrap(W, H, [], body, { seed: 221 });
}

export function lampSVG() {
  const W = 128, H = 320;
  const body = `<rect x="56" y="80" width="16" height="230" rx="6" fill="${PAL.navy}" ${S(OUT * 0.8)}/>
    <circle cx="64" cy="70" r="46" fill="#ffe7a0" opacity="0.35"/>
    <path d="M40,46 L88,46 L80,96 L48,96Z" fill="#ffd166" ${S(OUT * 0.8)}/>
    <path d="M34,46 L94,46 L64,22Z" fill="${PAL.navy}" ${S(OUT * 0.8)}/>
    <ellipse cx="64" cy="22" rx="20" ry="8" fill="#fff" ${S(3)}/>`;
  return wrap(W, H, [], body, { seed: 231 });
}

export function tentSVG() {
  // fish market stall
  const W = 384, H = 320;
  const body = `
    <rect x="70" y="150" width="244" height="140" rx="8" fill="${PAL.woodLight}" ${S()}/>
    <path d="M40,150 L344,150 L314,70 L70,70Z" fill="#fff" ${S()}/>
    ${[0, 1, 2, 3, 4].map((i) => `<path d="M${70 + i * 49},70 L${40 + i * 61},150 L${40 + (i + 0.5) * 61},150 L${70 + (i + 0.5) * 49},70Z" fill="${PAL.scarf}"/>`).join('')}
    <path d="M40,150 L344,150 L314,70 L70,70Z" fill="none" ${S()}/>
    ${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${40 + i * 51},150 q25,26 51,0" fill="${i % 2 ? PAL.scarf : '#fff'}" ${S(4)}/>`).join('')}
    <rect x="96" y="200" width="192" height="40" rx="8" fill="${PAL.wood}" ${S()}/>
    ${[120, 160, 200, 240].map((x) => `<ellipse cx="${x + 10}" cy="196" rx="20" ry="11" fill="${PAL.fish}" ${S(3.6)}/>`).join('')}
    <ellipse cx="192" cy="294" rx="176" ry="12" fill="#fff" ${S(OUT * 0.6)}/>`;
  return wrap(W, H, [], body, { seed: 241 });
}

// the "caught" snowball: penguin rolled up in snow, head and feet poking out
export function snowballSVG(frame = 0) {
  const W = 320, H = 320;
  const g = id('sb');
  const rot = frame * 40;
  const body = `
    <g transform="rotate(${rot} 160 170)">
      <circle cx="160" cy="170" r="118" fill="url(#${g})" ${S()}/>
      ${[[110, 120, 20], [200, 110, 14], [210, 220, 22], [100, 220, 16], [160, 70, 12]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff" stroke="#c4d8f2" stroke-width="3"/>`).join('')}
      <path d="M60,200 L30,214 L40,232 L70,222Z" fill="${PAL.beak}" ${S(4)}/>
      <path d="M250,210 L284,224 L272,240 L242,228Z" fill="${PAL.beak}" ${S(4)}/>
    </g>
    <g transform="translate(176,96)">
      <circle cx="0" cy="0" r="48" fill="${PAL.navy}" ${S()}/>
      <path d="M-14,-24 C4,-36 34,-26 40,2 C40,26 18,40 -4,34 C-20,28 -26,-6 -14,-24Z" fill="#fff" ${S(3)}/>
      <path d="M2,-10 L14,2 M14,-10 L2,2 M22,-12 L32,-2 M32,-12 L22,-2" stroke="${PAL.navyDark}" stroke-width="4" stroke-linecap="round"/>
      <path d="M26,12 L52,16 L28,24Z" fill="${PAL.beak}" ${S(3.6)}/>
      <ellipse cx="34" cy="2" rx="6" ry="4" fill="${PAL.blush}" opacity="0.8"/>
      <path d="M-40,26 Q0,48 40,30 L36,44 Q0,62 -38,40Z" fill="${PAL.scarf}" ${S(4)}/>
    </g>`;
  return wrap(W, H, [rad(g, [[0, '#ffffff'], [0.7, PAL.snow], [1, PAL.snowShade]], 0.35, 0.3, 0.85)], body, { seed: 251 });
}

// tutorial hand: a mitten-y cartoon hand with the index finger pointing down
export function handSVG(pressed = false) {
  const W = 192, H = 256;
  const dy = pressed ? 10 : 0;
  const body = `<g transform="translate(0,${dy})">
    <path d="M78,40 Q78,18 96,18 Q114,18 114,40 L114,118 Q132,104 148,116 Q164,128 158,150 L150,196 Q142,236 100,240 Q58,242 46,206 L32,150 Q26,128 44,122 Q58,118 70,132 L78,140 Z" fill="#ffe6d5" stroke="${PAL.ink}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M114,118 L114,150 M134,112 Q136,128 132,150" fill="none" stroke="${PAL.ink}" stroke-width="5" stroke-linecap="round" opacity="0.7"/>
    <path d="M88,30 Q96,24 104,30" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
    <path d="M58,206 Q100,226 146,200 L150,224 Q100,252 52,228 Z" fill="${PAL.scarf}" stroke="${PAL.ink}" stroke-width="6" stroke-linejoin="round"/>
  </g>`;
  return wrap(W, H, [], body, { seed: 261, wobble: 1 });
}
