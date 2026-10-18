// Parallax background strips (tile horizontally), far island silhouettes and terrain textures.
import { PAL, id, lin, rad, svg, blob, curve, f, star, sparkle } from './lib.mjs';
import { snowflake } from './sprites.mjs';

export const BIOMES = {
  dawn: { sky: ['#6ec3f2', '#b9e4fb', '#ffe0cf'], far: ['#b7c4f0', '#8f9fdb'], cap: '#ffe9f0', mid: ['#dbe9fc', '#b4cbf0'], haze: '#ffe8de', prop: 'round' },
  pine: { sky: ['#47acf0', '#9fd8fa', '#e6f6ff'], far: ['#98b3e8', '#6f8bd0'], cap: '#ffffff', mid: ['#7fc3b6', '#4f9a92'], haze: '#e4f4ff', prop: 'pine' },
  lake: { sky: ['#5fcbe6', '#bdeef4', '#f6ffff'], far: ['#9fdcec', '#6bb8d8'], cap: '#ffffff', mid: ['#c6f1f7', '#8fd3e6'], haze: '#efffff', prop: 'berg' },
  wind: { sky: ['#8792de', '#c5c3ef', '#f3e6f5'], far: ['#9a98d6', '#7473b8'], cap: '#f4f0ff', mid: ['#b3b0e2', '#8d89c9'], haze: '#efe6f7', prop: 'spire' },
  sunset: { sky: ['#6a58c2', '#f08aa8', '#ffc46b'], far: ['#b5679a', '#8a4a86'], cap: '#ffd3c4', mid: ['#e5869a', '#b8607e'], haze: '#ffcf9e', prop: 'cliff' },
  geyser: { sky: ['#56bfc0', '#aee9df', '#fff1df'], far: ['#86a9b4', '#5f8494'], cap: '#ffffff', mid: ['#a3cbc4', '#76a49f'], haze: '#fff3e6', prop: 'volcano' },
  aurora: { sky: ['#121848', '#28307a', '#4b3f8f'], far: ['#2d3f80', '#1f2c62'], cap: '#bfe9ff', mid: ['#3a4f9a', '#2a3a7a'], haze: '#5a4a9a', prop: 'pine', night: true },
  cloud: { sky: ['#56b5f5', '#a5dbfb', '#fff2df'], far: ['#ffffff', '#e6eefc'], cap: '#ffffff', mid: ['#ffffff', '#f0e8fb'], haze: '#fff6ea', prop: 'cloud' },
  stars: { sky: ['#0c1136', '#2a1f5e', '#6b3f8f'], far: ['#3b3f8c', '#262a68'], cap: '#e8dcff', mid: ['#4a3f9a', '#30296f'], haze: '#7a4f9a', prop: 'crystal', night: true },
};

const W = 1024;

// periodic height function (integer cycles over W so the strip tiles)
function wave(x, comps) {
  let y = 0;
  for (const [amp, cyc, ph] of comps) y += amp * Math.sin((x / W) * Math.PI * 2 * cyc + ph);
  return y;
}

function ridge(comps, base, H, step = 8) {
  const pts = [];
  for (let x = 0; x <= W; x += step) pts.push([x, base + wave(x, comps)]);
  return pts;
}

function pathFrom(pts, H) {
  return `M0,${H} ` + pts.map(([x, y]) => `L${f(x)},${f(y)}`).join(' ') + ` L${W},${H} Z`;
}

export function farStripSVG(biomeKey) {
  const B = BIOMES[biomeKey];
  const H = 384;
  const g = id('fg'), gh = id('fh'), gs = id('fs');
  let comps, base;
  if (B.prop === 'spire' || B.prop === 'cliff') { comps = [[70, 2, 0.4], [46, 5, 1.2], [18, 9, 2.2], [6, 17, 0.7]]; base = 200; }
  else if (B.prop === 'cloud') { comps = [[26, 4, 0.3], [18, 9, 1.1], [10, 17, 2.4]]; base = 250; }
  else if (B.prop === 'volcano') { comps = [[80, 2, 1.0], [30, 5, 0.2], [10, 11, 1.5]]; base = 210; }
  else { comps = [[78, 2, 0.2], [52, 3, 1.7], [22, 7, 0.9], [7, 13, 2.0]]; base = 215; }
  const pts = ridge(comps, base, H, 8);
  const d = pathFrom(pts, H);
  const clip = id('fc');
  let body = '';
  if (B.prop === 'cloud') {
    let props = '';
    for (let i = 0; i < 10; i++) {
      const x = (i * 103) % W, y = 240 + (i % 3) * 28;
      for (const dx of [0, -W, W]) props += `<circle cx="${x + dx}" cy="${y}" r="${50 + (i % 4) * 12}" fill="${B.far[0]}" opacity="0.95"/><circle cx="${x + dx + 30}" cy="${y + 30}" r="${44 + (i % 3) * 10}" fill="${B.far[1]}" opacity="0.9"/>`;
    }
    body = `${props}<rect x="0" y="${H * 0.55}" width="${W}" height="${H * 0.45}" fill="url(#${gh})"/>`;
  } else {
    // shade the right flank of every peak: the same ridge shifted right, drawn darker, clipped
    const shifted = pts.map(([x, y]) => [x + 46, y + 6]);
    const shD = `M0,${H} ` + [[-W + 46, 0], ...shifted].filter(([x]) => x >= -60).map(([x, y], i) => `L${f(x)},${f(i === 0 ? pts[0][1] : y)}`).join(' ') + ` L${W + 60},${H} Z`;
    const minY = Math.min(...pts.map((p) => p[1]));
    const maxY = Math.max(...pts.map((p) => p[1]));
    const capLine = minY + (maxY - minY) * 0.42;
    // caps only on the high peaks, with a ragged lower edge
    const capPts = pts.map(([x, y]) => [x, y < capLine ? Math.min(capLine + 12 * Math.sin(x * 0.09) + 8 * Math.sin(x * 0.23), y + 70) : y]);
    const capD = `M0,0 L${W},0 ` + capPts.slice().reverse().map(([x, y]) => `L${f(x)},${f(y)}`).join(' ') + ' Z';
    let props = '';
    if (B.prop === 'volcano') for (const x of [256, 768]) props += `<path d="M${x - 30},${150} q-20,-40 10,-70 q30,-30 0,-70" fill="none" stroke="#ffffff" stroke-width="22" stroke-linecap="round" opacity="0.5"/>`;
    body = `${props}
      <path d="${d}" fill="url(#${g})"/>
      <clipPath id="${clip}"><path d="${d}"/></clipPath>
      <g clip-path="url(#${clip})">
        <path d="${shD}" fill="url(#${gs})" opacity="0.55"/>
        <path d="${capD}" fill="${B.cap}" opacity="0.85"/>
        <path d="${shD}" fill="${B.far[1]}" opacity="0.18"/>
      </g>
      <rect x="0" y="${H * 0.5}" width="${W}" height="${H * 0.5}" fill="url(#${gh})"/>`;
  }
  return svg(W, H, lin(g, [[0, B.far[0]], [1, B.far[1]]]) + lin(gs, [[0, B.far[1]], [1, B.far[1]]]) + lin(gh, [[0, B.haze, 0], [1, B.haze, 0.9]]), body);
}

export function midStripSVG(biomeKey) {
  const B = BIOMES[biomeKey];
  const H = 320;
  const g = id('mg'), gh = id('mh');
  const comps = B.prop === 'cloud' ? [[22, 5, 0.6], [12, 11, 2.1]] : [[34, 4, 1.1], [20, 7, 0.3], [10, 15, 1.9]];
  const pts = ridge(comps, 170, H, 8);
  const d = pathFrom(pts, H);
  let props = '';
  const rngPos = [60, 150, 210, 330, 420, 520, 600, 690, 780, 860, 950];
  for (let k = 0; k < rngPos.length; k++) {
    const x = rngPos[k];
    const y = 170 + wave(x, comps) + 6;
    const s = 0.7 + ((k * 37) % 10) / 20;
    let p = '';
    switch (B.prop) {
      case 'pine':
        p = `<path d="M${x},${y - 90 * s} L${x + 26 * s},${y - 30 * s} L${x + 16 * s},${y - 30 * s} L${x + 34 * s},${y} L${x - 34 * s},${y} L${x - 16 * s},${y - 30 * s} L${x - 26 * s},${y - 30 * s}Z" fill="${B.mid[1]}"/>
          <path d="M${x},${y - 90 * s} L${x + 12 * s},${y - 62 * s} L${x - 12 * s},${y - 62 * s}Z" fill="#fff" opacity="0.85"/>`;
        break;
      case 'berg':
        p = `<path d="M${x - 40 * s},${y} L${x - 22 * s},${y - 60 * s} L${x + 4 * s},${y - 80 * s} L${x + 30 * s},${y - 40 * s} L${x + 44 * s},${y}Z" fill="${B.mid[0]}" stroke="${B.mid[1]}" stroke-width="3"/>
          <path d="M${x - 22 * s},${y - 60 * s} L${x - 6 * s},${y - 10 * s}" stroke="#fff" stroke-width="4" opacity="0.8"/>`;
        break;
      case 'spire':
        p = `<path d="M${x - 16 * s},${y} Q${x - 12 * s},${y - 90 * s} ${x},${y - 130 * s} Q${x + 12 * s},${y - 90 * s} ${x + 18 * s},${y}Z" fill="${B.mid[1]}"/>
          <path d="M${x - 6 * s},${y - 110 * s} Q${x},${y - 134 * s} ${x + 7 * s},${y - 110 * s}Z" fill="#fff" opacity="0.85"/>`;
        break;
      case 'cliff':
        p = k % 2 ? `<path d="M${x - 30 * s},${y} L${x - 22 * s},${y - 70 * s} L${x + 18 * s},${y - 76 * s} L${x + 30 * s},${y}Z" fill="${B.mid[1]}"/>` : '';
        break;
      case 'volcano':
        p = k % 3 === 0 ? `<path d="M${x},${y - 20} q-12,-24 6,-44 q16,-18 0,-40" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity="0.6"/>` : `<ellipse cx="${x}" cy="${y}" rx="${30 * s}" ry="${18 * s}" fill="${B.mid[1]}"/>`;
        break;
      case 'cloud':
        p = `<circle cx="${x}" cy="${y - 10}" r="${40 * s}" fill="${B.mid[0]}"/><circle cx="${x + 34 * s}" cy="${y}" r="${30 * s}" fill="${B.mid[0]}"/>`;
        break;
      case 'crystal':
        p = `<path d="M${x - 12 * s},${y} L${x - 12 * s},${y - 60 * s} L${x},${y - 80 * s} L${x + 12 * s},${y - 60 * s} L${x + 12 * s},${y}Z" fill="#8f7fe8" opacity="0.9"/><path d="M${x},${y - 80 * s} L${x},${y}" stroke="#d8ccff" stroke-width="3"/>`;
        break;
      default:
        p = `<ellipse cx="${x}" cy="${y}" rx="${36 * s}" ry="${22 * s}" fill="${B.mid[0]}"/>`;
    }
    props += p;
    // wrap copies so the strip tiles
    if (x < 80) props += p.replace(/(cx|x)="([\d.]+)"/g, (m, k2, v) => `${k2}="${+v + W}"`);
  }
  const clip = id('mc');
  const shifted = [...pts, ...pts.slice(1, 8).map(([x, y]) => [x + W, y])].map(([x, y]) => [x - 30, y + 4]);
  const hiD = `M-60,${H} ` + shifted.map(([x, y]) => `L${f(x)},${f(y)}`).join(' ') + ` L${W + 40},${H} Z`;
  const body = `${props}<path d="${d}" fill="url(#${g})"/>
    <clipPath id="${clip}"><path d="${d}"/></clipPath>
    <g clip-path="url(#${clip})"><path d="${d}" fill="#ffffff" opacity="0.35" transform="translate(0,-2)"/><path d="${hiD}" fill="url(#${g})" opacity="0.85"/></g>
    <rect x="0" y="${H * 0.6}" width="${W}" height="${H * 0.4}" fill="url(#${gh})"/>`;
  return svg(W, H, lin(g, [[0, B.mid[0]], [1, B.mid[1]]]) + lin(gh, [[0, B.haze, 0], [1, B.haze, 0.7]]), body);
}

export function farIslandSVG(biomeKey) {
  const B = BIOMES[biomeKey];
  const Wd = 512, H = 256;
  const g = id('fi');
  const top = [[30, 200], [70, 150], [120, 120], [180, 132], [240, 92], [300, 104], [360, 80], [420, 118], [470, 160], [490, 200]];
  const d = `M20,210 ` + curve(top).slice(1).replace(/^[\d.,]+/, '') + ` L500,212 Z`;
  let props = '';
  if (B.prop === 'pine' || B.prop === 'round') props = [150, 260, 330, 400].map((x, i) => `<path d="M${x},${110 - i * 4} l12,30 l-24,0z" fill="${B.mid[1]}"/>`).join('');
  if (B.prop === 'spire') props = [200, 330].map((x) => `<path d="M${x - 10},120 Q${x},40 ${x + 10},120Z" fill="${B.far[1]}"/>`).join('');
  if (B.prop === 'volcano') props = `<path d="M330,84 q-14,-22 6,-40 q18,-18 0,-34" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" opacity="0.7"/>`;
  if (B.prop === 'crystal') props = [220, 300, 360].map((x) => `<path d="M${x - 8},110 L${x},70 L${x + 8},110Z" fill="#b8a8ff"/>`).join('');
  if (B.prop === 'cloud') props = `<circle cx="180" cy="110" r="50" fill="#fff"/><circle cx="260" cy="90" r="64" fill="#fff"/><circle cx="340" cy="112" r="46" fill="#fff"/>`;
  const body = `${props}
    <path d="M20,206 ${top.map(([x, y]) => `L${x},${y}`).join(' ')} L500,206 Q260,250 20,206Z" fill="url(#${g})" stroke="${PAL.inkSoft}" stroke-width="4" stroke-linejoin="round" opacity="0.92"/>
    <path d="M60,160 ${top.slice(2, 8).map(([x, y]) => `L${x},${y + 10}`).join(' ')}" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity="0.8"/>
    <path d="M10,212 Q256,236 502,212" fill="none" stroke="#ffffff" stroke-width="6" opacity="0.7"/>`;
  return svg(Wd, H, lin(g, [[0, B.cap], [0.35, B.far[0]], [1, B.far[1]]]), body);
}

// tileable overlay texture for snow terrain (soft blotches + sparkles), transparent background
export function snowTextureSVG(kind = 'snow') {
  const T = 256;
  let body = '';
  const seedPts = [];
  let s = kind === 'snow' ? 7 : kind === 'cloud' ? 13 : 23;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const put = (fn) => { for (const dx of [-T, 0, T]) for (const dy of [-T, 0, T]) body += fn(dx, dy); };
  if (kind === 'snow') {
    for (let i = 0; i < 22; i++) {
      const x = rnd() * T, y = rnd() * T, rx = 14 + rnd() * 30, ry = 5 + rnd() * 10, c = rnd() < 0.5 ? '#ffffff' : '#c9d8f5', o = 0.18 + rnd() * 0.25;
      put((dx, dy) => `<ellipse cx="${f(x + dx)}" cy="${f(y + dy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${c}" opacity="${f(o)}"/>`);
    }
    for (let i = 0; i < 14; i++) {
      const x = rnd() * T, y = rnd() * T, r = 3 + rnd() * 4;
      put((dx, dy) => `<path d="${sparkle(x + dx, y + dy, r, 0.25)}" fill="#ffffff" opacity="0.9"/>`);
    }
    for (let i = 0; i < 30; i++) {
      const x = rnd() * T, y = rnd() * T;
      put((dx, dy) => `<circle cx="${f(x + dx)}" cy="${f(y + dy)}" r="1.6" fill="#a9bde8" opacity="0.6"/>`);
    }
  } else if (kind === 'cloud') {
    for (let i = 0; i < 16; i++) {
      const x = rnd() * T, y = rnd() * T, r = 16 + rnd() * 26;
      put((dx, dy) => `<circle cx="${f(x + dx)}" cy="${f(y + dy)}" r="${f(r)}" fill="${rnd() < 0.5 ? '#ffffff' : '#f3dcf2'}" opacity="0.35"/>`);
    }
  } else { // ice
    for (let i = 0; i < 10; i++) {
      const x = rnd() * T, y = rnd() * T, l = 30 + rnd() * 50;
      put((dx, dy) => `<path d="M${f(x + dx)},${f(y + dy)} l${f(l)},${f(-l * 0.3)}" stroke="#ffffff" stroke-width="${f(2 + rnd() * 3)}" stroke-linecap="round" opacity="0.6"/>`);
    }
  }
  return svg(T, T, '', body);
}

export function auroraSVG() {
  const Wd = 1024, H = 384;
  const g = id('au'), g2 = id('au');
  const band = (yOff, amp, col) => {
    let d = `M0,${200 + yOff}`;
    for (let x = 0; x <= Wd; x += 16) d += ` L${x},${f(200 + yOff + Math.sin((x / Wd) * Math.PI * 4) * amp + Math.sin((x / Wd) * Math.PI * 10) * amp * 0.3)}`;
    d += ` L${Wd},${60 + yOff} L0,${60 + yOff} Z`;
    return `<path d="${d}" fill="url(#${col})" opacity="0.75"/>`;
  };
  return svg(Wd, H, lin(g, [[0, '#7be0c0', 0], [0.6, '#7be0c0', 0.55], [1, '#b8fff0', 0.9]]) + lin(g2, [[0, '#c4a6ff', 0], [0.7, '#c4a6ff', 0.4], [1, '#ffd1f0', 0.7]]),
    band(0, 60, g) + band(60, 40, g2));
}

export function sunSVG(kind = 'sun') {
  const Wd = 256, H = 256;
  const g = id('sn');
  if (kind === 'moon') {
    return svg(Wd, H, rad(g, [[0, '#fffbe8', 1], [0.5, '#fff0b8', 0.3], [1, '#fff0b8', 0]], 0.5, 0.5, 0.5),
      `<circle cx="128" cy="128" r="128" fill="url(#${g})"/><circle cx="128" cy="128" r="46" fill="#fff8de" stroke="${PAL.inkSoft}" stroke-width="4"/><circle cx="112" cy="116" r="9" fill="#f0e2b0"/><circle cx="142" cy="142" r="6" fill="#f0e2b0"/>`);
  }
  return svg(Wd, H, rad(g, [[0, '#ffffff', 1], [0.28, '#fff6d0', 0.9], [0.55, '#ffe6a8', 0.25], [1, '#ffe6a8', 0]], 0.5, 0.5, 0.5),
    `<circle cx="128" cy="128" r="128" fill="url(#${g})"/>`);
}
