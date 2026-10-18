// Shared art helpers: palette, painterly SVG filters, small shape utilities.
// Every sprite in the game is drawn by these generators, so one look runs through all of it:
// thick soft indigo outlines, saturated gradient fills, a top-left light, faint paper grain.

export const PAL = {
  ink: '#1e2350',       // outline
  inkSoft: '#2d3470',
  navy: '#27346f',
  navyDark: '#18204a',
  navyLight: '#3d55a3',
  rim: '#7fd3ff',
  belly: '#fff8ec',
  bellyShade: '#e9dccb',
  face: '#ffffff',
  beak: '#ff9a2e',
  beakDark: '#e2701b',
  beakLight: '#ffc56b',
  blush: '#ff8fa3',
  scarf: '#e8423f',
  scarfDark: '#b82a35',
  scarfLight: '#ff7a6b',
  white: '#ffffff',
  snow: '#f3f9ff',
  snowShade: '#c4d8f2',
  snowDeep: '#93b1e0',
  ice: '#9be7ff',
  iceDeep: '#4fb6e8',
  gold: '#ffc933',
  goldDark: '#e09a12',
  goldLight: '#fff09a',
  fish: '#6ab7f0',
  fishDark: '#3a7fcf',
  fishLight: '#c9ecff',
  pine: '#2f8f6b',
  pineDark: '#1d6150',
  pineLight: '#57c08f',
  rock: '#7f86b5',
  rockDark: '#585e93',
  rockLight: '#aeb4dc',
  wood: '#b06a3b',
  woodDark: '#7d4426',
  woodLight: '#d99560',
  pink: '#ff9ec7',
  purple: '#8b6ee8',
  green: '#7be0a0',
};

let uid = 0;
export function id(prefix = 'g') { return `${prefix}${++uid}`; }

// Painterly filter: slight wobble on edges + paper grain multiplied inside the shape.
export function paintFilter(fid, { wobble = 1.6, grain = 0.12, seed = 3, freq = 0.035 } = {}) {
  return `
  <filter id="${fid}" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" seed="${seed}" result="warp"/>
    <feDisplacementMap in="SourceGraphic" in2="warp" scale="${wobble}" xChannelSelector="R" yChannelSelector="G" result="wob"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${seed + 7}" result="grain"/>
    <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.6  0 0 0 ${grain * 2.2} ${-grain * 0.6}" result="g2"/>
    <feComposite in="g2" in2="wob" operator="in" result="g3"/>
    <feBlend in="g3" in2="wob" mode="multiply"/>
  </filter>`;
}

export function softShadowFilter(fid, blur = 4, opacity = 0.25) {
  return `<filter id="${fid}" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="${blur}"/>
    <feOffset dx="0" dy="${blur * 0.6}" result="o"/>
    <feComponentTransfer><feFuncA type="linear" slope="${opacity}"/></feComponentTransfer>
    <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>`;
}

export function glowFilter(fid, blur = 6, color = '#fff', opacity = 0.8) {
  return `<filter id="${fid}" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="${blur}" result="b"/>
    <feFlood flood-color="${color}" flood-opacity="${opacity}"/>
    <feComposite in2="b" operator="in" result="gl"/>
    <feMerge><feMergeNode in="gl"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>`;
}

export function lin(gid, stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) {
  return `<linearGradient id="${gid}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`;
}

export function rad(gid, stops, cx = 0.35, cy = 0.3, r = 0.8) {
  return `<radialGradient id="${gid}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</radialGradient>`;
}

export function svg(w, h, defs, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs>${body}</svg>`;
}

// polar helpers
export const P = (cx, cy, r, a) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
export const f = (n) => Math.round(n * 10) / 10;

// smooth closed blob through points (Catmull-Rom -> cubic bezier)
export function blob(points, tension = 1) {
  const n = points.length;
  let d = `M${f(points[0][0])},${f(points[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n], p1 = points[i], p2 = points[(i + 1) % n], p3 = points[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6 * tension, p1[1] + (p2[1] - p0[1]) / 6 * tension];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6 * tension, p2[1] - (p3[1] - p1[1]) / 6 * tension];
    d += ` C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return d + 'Z';
}

// open smooth path
export function curve(points, tension = 1) {
  const n = points.length;
  let d = `M${f(points[0][0])},${f(points[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[Math.max(0, i - 1)], p1 = points[i], p2 = points[i + 1], p3 = points[Math.min(n - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6 * tension, p1[1] + (p2[1] - p0[1]) / 6 * tension];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6 * tension, p2[1] - (p3[1] - p1[1]) / 6 * tension];
    d += ` C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return d;
}

export function ellipsePts(cx, cy, rx, ry, n = 12, rot = 0, jitter = null) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    let r = 1;
    if (jitter) r += jitter(i, a);
    const x = Math.cos(a) * rx * r, y = Math.sin(a) * ry * r;
    pts.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]);
  }
  return pts;
}

export function star(cx, cy, r1, r2, n = 5, rot = -Math.PI / 2) {
  let d = '';
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? r1 : r2;
    const a = rot + (i / (n * 2)) * Math.PI * 2;
    d += (i === 0 ? 'M' : 'L') + f(cx + Math.cos(a) * r) + ',' + f(cy + Math.sin(a) * r);
  }
  return d + 'Z';
}

// rounded 4-point sparkle
export function sparkle(cx, cy, r, w = 0.22) {
  const k = r * w;
  return `M${cx},${cy - r} Q${cx + k},${cy - k} ${cx + r},${cy} Q${cx + k},${cy + k} ${cx},${cy + r} Q${cx - k},${cy + k} ${cx - r},${cy} Q${cx - k},${cy - k} ${cx},${cy - r}Z`;
}
