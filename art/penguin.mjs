// The penguin rig. One set of parts, posed by parameters, so every frame (slide, flight, idle,
// village walk, baby, villagers) is visibly the same character.
import { PAL, id, paintFilter, lin, rad, svg, blob, curve, ellipsePts, f, sparkle } from './lib.mjs';

const OUT = 5.2; // outline width at 256px cell

function eyes(expr, near, far) {
  // near/far: [x, y, scale] in head space
  const ink = PAL.navyDark;
  const one = ([x, y, s], isNear) => {
    const rx = 6.6 * s, ry = 9.4 * s;
    switch (expr) {
      case 'happy': // ^ ^
        return `<path d="M${x - rx},${y + 2} Q${x},${y - ry * 1.2} ${x + rx},${y + 2}" fill="none" stroke="${ink}" stroke-width="${4.4 * s}" stroke-linecap="round"/>`;
      case 'closed':
        return `<path d="M${x - rx},${y} Q${x},${y + ry * 0.7} ${x + rx},${y}" fill="none" stroke="${ink}" stroke-width="${4 * s}" stroke-linecap="round"/>`;
      case 'determined':
        return `<ellipse cx="${x}" cy="${y + 1}" rx="${rx}" ry="${ry * 0.85}" fill="${ink}"/>
          <circle cx="${x - rx * 0.3}" cy="${y - ry * 0.35}" r="${2.6 * s}" fill="#fff"/>
          <path d="M${x - rx * 1.4},${y - ry * 1.0} L${x + rx * 1.3},${y - ry * 0.55}" stroke="${ink}" stroke-width="${3.6 * s}" stroke-linecap="round"/>`;
      case 'dizzy':
        return `<path d="M${x},${y} m-1,0 a1.5,1.5 0 1,1 3,0 a3,3 0 1,1 -6,0 a4.8,4.8 0 1,1 9.6,0 a6.4,6.4 0 1,1 -12.8,0" fill="none" stroke="${ink}" stroke-width="${2.6 * s}" stroke-linecap="round" transform="scale(1)"/>`;
      case 'worried':
        return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${ink}"/>
          <circle cx="${x - rx * 0.3}" cy="${y - ry * 0.4}" r="${2.8 * s}" fill="#fff"/>
          <path d="M${x - rx * 1.3},${y - ry * 0.75} L${x + rx * 1.1},${y - ry * 1.35}" stroke="${ink}" stroke-width="${3.2 * s}" stroke-linecap="round"/>`;
      case 'sparkle':
        return `<ellipse cx="${x}" cy="${y}" rx="${rx * 1.05}" ry="${ry * 1.05}" fill="${ink}"/>
          <path d="${sparkle(x - rx * 0.25, y - ry * 0.25, 5 * s, 0.3)}" fill="#fff"/>
          <circle cx="${x + rx * 0.35}" cy="${y + ry * 0.4}" r="${1.6 * s}" fill="#fff"/>`;
      case 'x':
        return `<path d="M${x - rx},${y - rx} L${x + rx},${y + rx} M${x + rx},${y - rx} L${x - rx},${y + rx}" stroke="${ink}" stroke-width="${3.6 * s}" stroke-linecap="round"/>`;
      default: // open
        return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${ink}"/>
          <circle cx="${x - rx * 0.32}" cy="${y - ry * 0.38}" r="${2.9 * s}" fill="#fff"/>
          <circle cx="${x + rx * 0.3}" cy="${y + ry * 0.35}" r="${1.3 * s}" fill="#fff" opacity="0.8"/>`;
    }
  };
  return one(far, false) + one(near, true);
}

function beak(kind, x, y, s = 1) {
  // head-space beak pointing right
  const L = 22 * s, Hh = 9 * s;
  if (kind === 'open') {
    return `<path d="M${x - 2},${y - Hh} Q${x + L * 0.7},${y - Hh * 1.3} ${x + L},${y - Hh * 0.6} Q${x + L * 0.6},${y - 1} ${x - 2},${y - 1}Z" fill="${PAL.beak}" stroke="${PAL.ink}" stroke-width="${OUT * 0.75}" stroke-linejoin="round"/>
      <path d="M${x - 2},${y + 2} Q${x + L * 0.55},${y + Hh * 0.4} ${x + L * 0.82},${y + Hh * 1.2} Q${x + L * 0.4},${y + Hh * 1.7} ${x - 2},${y + Hh * 0.9}Z" fill="${PAL.beakDark}" stroke="${PAL.ink}" stroke-width="${OUT * 0.75}" stroke-linejoin="round"/>
      <path d="M${x + 1},${y + 1} Q${x + L * 0.4},${y + Hh * 0.5} ${x + L * 0.5},${y + Hh * 0.9}" fill="#c4435a" opacity="0.9"/>`;
  }
  if (kind === 'grin') {
    return `<path d="M${x - 2},${y - Hh} Q${x + L * 0.7},${y - Hh * 1.2} ${x + L * 1.02},${y} Q${x + L * 0.6},${y + Hh * 1.25} ${x - 2},${y + Hh * 0.8}Z" fill="${PAL.beak}" stroke="${PAL.ink}" stroke-width="${OUT * 0.75}" stroke-linejoin="round"/>
      <path d="M${x + 1},${y + 1} Q${x + L * 0.55},${y + Hh * 0.55} ${x + L * 0.95},${y}" fill="none" stroke="${PAL.ink}" stroke-width="${2.4 * s}" stroke-linecap="round"/>
      <path d="M${x + 2},${y - Hh * 0.7} Q${x + L * 0.5},${y - Hh * 0.95} ${x + L * 0.7},${y - Hh * 0.55}" fill="none" stroke="${PAL.beakLight}" stroke-width="${2.6 * s}" stroke-linecap="round"/>`;
  }
  return `<path d="M${x - 2},${y - Hh} Q${x + L * 0.7},${y - Hh * 1.15} ${x + L},${y + 0.5} Q${x + L * 0.6},${y + Hh * 1.15} ${x - 2},${y + Hh}Z" fill="${PAL.beak}" stroke="${PAL.ink}" stroke-width="${OUT * 0.75}" stroke-linejoin="round"/>
    <path d="M${x + 1},${y + 1} L${x + L * 0.9},${y + 1}" stroke="${PAL.beakDark}" stroke-width="${2 * s}" stroke-linecap="round"/>
    <path d="M${x + 2},${y - Hh * 0.6} Q${x + L * 0.5},${y - Hh * 0.85} ${x + L * 0.72},${y - Hh * 0.3}" fill="none" stroke="${PAL.beakLight}" stroke-width="${2.6 * s}" stroke-linecap="round"/>`;
}

function wingPath(len, width, curl = 0) {
  // flipper in wing-local space: root at (0,0), extends along +y
  const pts = [[-width * 0.55, 0], [-width * 0.65, len * 0.35], [-width * 0.35 + curl, len * 0.8], [curl * 1.3, len], [width * 0.45 + curl, len * 0.75], [width * 0.55, len * 0.3], [width * 0.4, -width * 0.15]];
  return blob(pts, 0.9);
}

// pose: {
//   bodyRot (deg, 0 upright facing right, +90 belly down), headRot (deg, relative), squash [sx, sy],
//   wingNear (deg), wingFar (deg), wingLen, feet: 'stand'|'tuck'|'trail'|'step0'..'step3', eyes, beak,
//   blush, sweat, scarf (color) | null, hat, baby, scale, tails: 'hang'|'none'|'fly'
// }
export function penguinSVG(pose, cell = 384) {
  const p = Object.assign({
    bodyRot: 0, headRot: 0, squash: [1, 1], wingNear: 12, wingFar: -10, wingLen: 58, feet: 'stand',
    eyes: 'open', beak: 'closed', blush: true, sweat: false, scarf: PAL.scarf, scarfDark: PAL.scarfDark,
    hat: null, baby: false, scale: 1, tails: 'hang', pivot: [192, 270], anchor: 'feet', bob: 0, glow: false,
  }, pose);
  const fid = id('pf'), gBody = id('gb'), gBelly = id('gl'), gHead = id('gh'), gWing = id('gw'), gScarf = id('gs'), clip = id('cl'), gFace = id('gf');
  const baby = p.baby;
  const bodyCol = baby ? ['#b9c2d9', '#8e98b8', '#6c7598'] : [PAL.navyLight, PAL.navy, PAL.navyDark];
  const defs = [
    paintFilter(fid, { wobble: 1.4, grain: 0.10, seed: 5 }),
    // light stays top-left in screen space: counter-rotate gradients by body rotation
    `<radialGradient id="${gBody}" cx="0.32" cy="0.25" r="0.85" gradientTransform="rotate(${-p.bodyRot} 0.5 0.5)">
      <stop offset="0" stop-color="${bodyCol[0]}"/><stop offset="0.55" stop-color="${bodyCol[1]}"/><stop offset="0.92" stop-color="${bodyCol[2]}"/><stop offset="1" stop-color="${baby ? '#9aa6cc' : '#3b4f96'}"/></radialGradient>`,
    `<radialGradient id="${gHead}" cx="0.3" cy="0.25" r="0.9" gradientTransform="rotate(${-p.bodyRot - p.headRot} 0.5 0.5)">
      <stop offset="0" stop-color="${bodyCol[0]}"/><stop offset="0.6" stop-color="${bodyCol[1]}"/><stop offset="1" stop-color="${bodyCol[2]}"/></radialGradient>`,
    `<radialGradient id="${gBelly}" cx="0.35" cy="0.3" r="0.85" gradientTransform="rotate(${-p.bodyRot} 0.5 0.5)">
      <stop offset="0" stop-color="#ffffff"/><stop offset="0.6" stop-color="${baby ? '#f4f1ff' : PAL.belly}"/><stop offset="1" stop-color="${baby ? '#d5d4ea' : PAL.bellyShade}"/></radialGradient>`,
    `<radialGradient id="${gFace}" cx="0.4" cy="0.3" r="0.9"><stop offset="0" stop-color="#ffffff"/><stop offset="0.8" stop-color="#f6f9ff"/><stop offset="1" stop-color="#dfe7f7"/></radialGradient>`,
    `<linearGradient id="${gWing}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bodyCol[1]}"/><stop offset="1" stop-color="${bodyCol[2]}"/></linearGradient>`,
    lin(gScarf, [[0, PAL.scarfLight], [0.5, p.scarf || PAL.scarf], [1, p.scarfDark || PAL.scarfDark]]),
  ].join('');

  // local rig (upright, facing right, body center at 0,0)
  const bodyH = baby ? 50 : 62, bodyW = baby ? 46 : 50;
  const bodyPts = [[0, -bodyH], [bodyW * 0.72, -bodyH * 0.72], [bodyW * 1.02, -bodyH * 0.05], [bodyW * 0.9, bodyH * 0.6], [bodyW * 0.35, bodyH * 0.98],
    [-bodyW * 0.35, bodyH * 0.98], [-bodyW * 0.92, bodyH * 0.6], [-bodyW * 1.0, -bodyH * 0.05], [-bodyW * 0.7, -bodyH * 0.72]];
  const bodyD = blob(bodyPts, 1);
  const bellyD = blob(ellipsePts(bodyW * 0.32, bodyH * 0.18, bodyW * 0.62, bodyH * 0.74, 10), 1);
  const headR = baby ? 44 : 40;
  const headC = [baby ? 4 : 6, -bodyH - headR * 0.62];

  // feet
  const foot = (x, y, rot, s = 1) => `<g transform="translate(${f(x)},${f(y)}) rotate(${rot})"><path d="M-4,-6 Q12,-9 20,-2 Q24,4 16,7 Q6,9 -6,6 Q-11,0 -4,-6Z" transform="scale(${s})" fill="${PAL.beak}" stroke="${PAL.ink}" stroke-width="${OUT * 0.8}" stroke-linejoin="round"/>
    <path d="M2,-2 Q10,-4 15,0" transform="scale(${s})" fill="none" stroke="${PAL.beakLight}" stroke-width="2.4" stroke-linecap="round"/></g>`;
  let feetFar = '', feetNear = '';
  const fy = bodyH * 0.92;
  switch (p.feet) {
    case 'tuck': feetFar = foot(-bodyW * 0.45, fy - 4, 160, 0.85); feetNear = foot(-bodyW * 0.15, fy, 150, 0.9); break;
    case 'trail': feetFar = foot(-bodyW * 0.55, fy - 12, 120, 0.85); feetNear = foot(-bodyW * 0.25, fy - 4, 105, 0.95); break;
    case 'step0': feetFar = foot(-14, fy + 2, -8); feetNear = foot(12, fy + 4, 6); break;
    case 'step1': feetFar = foot(-20, fy - 2, -25); feetNear = foot(16, fy + 6, 0); break;
    case 'step2': feetFar = foot(-12, fy + 4, 4); feetNear = foot(8, fy + 1, -10); break;
    case 'step3': feetFar = foot(-10, fy + 6, 0); feetNear = foot(22, fy - 3, -26); break;
    case 'none': break;
    default: feetFar = foot(-16, fy + 3, -6); feetNear = foot(10, fy + 5, 4);
  }

  // wings: root near shoulders
  const wl = (p.wingLen) * (baby ? 0.7 : 1);
  const ww = p.wingW || 28;
  const wingFar = `<g transform="translate(${-bodyW * 0.55},${-bodyH * 0.35}) rotate(${p.wingFar})"><path d="${wingPath(wl, ww * 0.92)}" fill="url(#${gWing})" stroke="${PAL.ink}" stroke-width="${OUT}" stroke-linejoin="round"/></g>`;
  const wingNear = `<g transform="translate(${bodyW * (p.wingRootX ?? -0.08)},${-bodyH * 0.36}) rotate(${p.wingNear})"><path d="${wingPath(wl, ww, 4)}" fill="url(#${gWing})" stroke="${PAL.ink}" stroke-width="${OUT}" stroke-linejoin="round"/>
    <path d="M-6,${wl * 0.15} Q-9,${wl * 0.5} -3,${wl * 0.82}" fill="none" stroke="${bodyCol[0]}" stroke-width="3.4" stroke-linecap="round" opacity="0.8"/></g>`;

  // head with face
  const s = baby ? 1.12 : 1;
  const faceD = blob([[-6, -22], [12, -28], [30, -18], [36, 2], [30, 22], [10, 30], [-8, 22], [-14, 4]], 1);
  let hat = '';
  if (p.hat === 'beanie') {
    hat = `<path d="M${-headR * 0.92},${-headR * 0.25} Q${-headR * 0.8},${-headR * 1.25} ${headR * 0.1},${-headR * 1.15} Q${headR * 0.95},${-headR * 1.05} ${headR * 0.95},${-headR * 0.3} Z" fill="#3fbf8f" stroke="${PAL.ink}" stroke-width="${OUT}" stroke-linejoin="round"/>
      <path d="M${-headR * 0.98},${-headR * 0.3} Q0,${-headR * 0.55} ${headR},${-headR * 0.32}" fill="none" stroke="${PAL.ink}" stroke-width="${OUT * 2.6}" stroke-linecap="round"/>
      <path d="M${-headR * 0.98},${-headR * 0.3} Q0,${-headR * 0.55} ${headR},${-headR * 0.32}" fill="none" stroke="#e9fff6" stroke-width="${OUT * 1.6}" stroke-linecap="round"/>
      <circle cx="${headR * 0.05}" cy="${-headR * 1.22}" r="9" fill="#fff" stroke="${PAL.ink}" stroke-width="${OUT * 0.8}"/>`;
  } else if (p.hat === 'earmuff') {
    hat = `<path d="M${-headR * 0.75},${-headR * 0.2} Q${-headR * 0.2},${-headR * 1.45} ${headR * 0.7},${-headR * 0.55}" fill="none" stroke="${PAL.ink}" stroke-width="10" stroke-linecap="round"/>
      <path d="M${-headR * 0.75},${-headR * 0.2} Q${-headR * 0.2},${-headR * 1.45} ${headR * 0.7},${-headR * 0.55}" fill="none" stroke="#ffd166" stroke-width="5" stroke-linecap="round"/>
      <circle cx="${-headR * 0.78}" cy="${-headR * 0.05}" r="13" fill="#ff9ec7" stroke="${PAL.ink}" stroke-width="${OUT * 0.8}"/>`;
  } else if (p.hat === 'tuft') {
    hat = `<path d="M-6,${-headR + 4} Q-14,${-headR - 18} 2,${-headR - 14} Q0,${-headR - 26} 14,${-headR - 16} Q12,${-headR - 6} 6,${-headR + 4}Z" fill="${bodyCol[0]}" stroke="${PAL.ink}" stroke-width="${OUT * 0.8}" stroke-linejoin="round"/>`;
  }
  const head = `<g transform="translate(${f(headC[0])},${f(headC[1])}) rotate(${p.headRot})">
    <circle cx="0" cy="0" r="${headR}" fill="url(#${gHead})" stroke="${PAL.ink}" stroke-width="${OUT}"/>
    <path d="M${-headR * 0.62},${-headR * 0.55} Q${-headR * 0.2},${-headR * 0.95} ${headR * 0.35},${-headR * 0.86}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.28"/>
    <g transform="scale(${s}) translate(${baby ? -2 : 0},${baby ? 4 : 0})">
      <path d="${faceD}" fill="url(#${gFace})" stroke="${PAL.ink}" stroke-width="${OUT * 0.55}" opacity="1"/>
      ${p.blush ? `<ellipse cx="25" cy="15" rx="7" ry="4.5" fill="${PAL.blush}" opacity="0.75"/><ellipse cx="0" cy="14" rx="5" ry="3.6" fill="${PAL.blush}" opacity="0.55"/>` : ''}
      ${eyes(p.eyes, [16, -2, baby ? 1.15 : 1], [-2, -4, baby ? 1.0 : 0.85])}
      ${beak(p.beak, 28, 8, baby ? 0.75 : 1)}
    </g>
    ${hat}
    ${p.sweat ? `<path d="M${-headR * 0.9},${-headR * 0.4} Q${-headR * 1.05},${-headR * 0.05} ${-headR * 0.85},${headR * 0.05} Q${-headR * 0.65},${-headR * 0.05} ${-headR * 0.9},${-headR * 0.4}Z" fill="#bfe9ff" stroke="${PAL.ink}" stroke-width="2.6"/>` : ''}
  </g>`;

  // scarf band around the neck + knot + tails
  let scarf = '';
  if (p.scarf && !baby) {
    const y0 = -bodyH - 2;
    const tails = p.tails === 'hang'
      ? `<path d="M${-bodyW * 0.62},${y0 + 4} Q${-bodyW * 0.95},${y0 + 26} ${-bodyW * 0.88},${y0 + 46} L${-bodyW * 0.62},${y0 + 44} Q${-bodyW * 0.66},${y0 + 24} ${-bodyW * 0.42},${y0 + 8}Z" fill="url(#${gScarf})" stroke="${PAL.ink}" stroke-width="${OUT * 0.85}" stroke-linejoin="round"/>
         <path d="M${-bodyW * 0.86},${y0 + 36} L${-bodyW * 0.64},${y0 + 35}" stroke="#fff" stroke-width="3.2" opacity="0.85"/>`
      : '';
    scarf = `${tails}
      <path d="M${-bodyW * 0.86},${y0 - 6} Q0,${y0 + 14} ${bodyW * 0.88},${y0 - 8} L${bodyW * 0.84},${y0 + 10} Q0,${y0 + 30} ${-bodyW * 0.8},${y0 + 12}Z" fill="url(#${gScarf})" stroke="${PAL.ink}" stroke-width="${OUT}" stroke-linejoin="round"/>
      <path d="M${-bodyW * 0.7},${y0 + 5} Q0,${y0 + 22} ${bodyW * 0.72},${y0 + 2}" fill="none" stroke="#fff" stroke-width="3.4" stroke-dasharray="7 9" opacity="0.85"/>
      <circle cx="${-bodyW * 0.55}" cy="${y0 + 8}" r="9" fill="url(#${gScarf})" stroke="${PAL.ink}" stroke-width="${OUT * 0.85}"/>`;
  }

  const [sx, sy] = p.squash;
  const glow = p.glow ? `<ellipse cx="0" cy="${-20}" rx="${bodyW * 1.6}" ry="${bodyH * 1.8}" fill="#fff6a8" opacity="0.0"/>` : '';
  const rig = `
    ${glow}
    ${wingFar}
    ${feetFar}
    <path d="${bodyD}" fill="url(#${gBody})" stroke="${PAL.ink}" stroke-width="${OUT}" stroke-linejoin="round"/>
    <clipPath id="${clip}"><path d="${bodyD}"/></clipPath>
    <g clip-path="url(#${clip})"><path d="${bellyD}" fill="url(#${gBelly})"/>
      <path d="${bellyD}" fill="none" stroke="${PAL.ink}" stroke-width="${OUT * 0.5}" opacity="0.5"/></g>
    ${feetNear}
    ${head}
    ${scarf}
    ${wingNear}`;

  // place: rotate rig, then align its anchor to the pivot
  const rotRad = p.bodyRot * Math.PI / 180;
  // anchor point in rig space
  let ax = 0, ay = bodyH + 8; // feet bottom
  if (p.anchor === 'belly') {
    // lowest point of the body ellipse after rotation (contact with the ground)
    // for belly-down, contact is the belly front: rig point (bodyW, 0) rotated
    ax = bodyW * Math.cos(-rotRad) * 0 + bodyW * 0.95; ay = bodyH * 0.1;
  } else if (p.anchor === 'center') { ax = 0; ay = -10; }
  const rx = ax * Math.cos(rotRad) - ay * Math.sin(rotRad);
  const ry = ax * Math.sin(rotRad) + ay * Math.cos(rotRad);
  const tx = p.pivot[0] - rx * p.scale * sx, ty = p.pivot[1] - ry * p.scale * sy + p.bob;
  const body = `<g filter="url(#${fid})"><g transform="translate(${f(tx)},${f(ty)}) scale(${p.scale * sx},${p.scale * sy}) rotate(${p.bodyRot})">${rig}</g></g>`;
  // scarf knot (back of the neck) in cell coordinates, used to attach the runtime scarf tails
  const kx = -bodyW * 0.55, ky = -bodyH + 6;
  const kxr = kx * Math.cos(rotRad) - ky * Math.sin(rotRad), kyr = kx * Math.sin(rotRad) + ky * Math.cos(rotRad);
  penguinSVG.lastAnchor = [tx + kxr * p.scale * sx, ty + kyr * p.scale * sy];
  return svg(cell, cell, defs, body);
}

// Named frames used by the game. pivot = where the sprite attaches to the world position.
const STAND = [192, 300], BELLY = [192, 250], CENTER = [192, 200];
export function penguinFrames() {
  const F = {};
  const slide = { bodyRot: 84, headRot: -62, anchor: 'belly', pivot: BELLY, feet: 'trail', wingNear: 14, wingFar: 24, wingLen: 56, wingRootX: 0.0, eyes: 'determined', tails: 'none' };
  F.slide_0 = { ...slide };
  F.slide_1 = { ...slide, squash: [1.03, 0.97], wingNear: 20 };
  F.slide_happy = { ...slide, eyes: 'happy', beak: 'grin' };
  F.slide_worry = { ...slide, headRot: -118, eyes: 'worried', sweat: true, beak: 'open' };
  F.slide_fever = { ...slide, eyes: 'sparkle', beak: 'grin' };
  const fly = { bodyRot: 58, headRot: -40, anchor: 'center', pivot: CENTER, feet: 'trail', eyes: 'happy', beak: 'grin', tails: 'none', wingLen: 74, wingW: 31, wingRootX: 0.05 };
  F.fly_0 = { ...fly, wingNear: 112, wingFar: 128 }; // wings up
  F.fly_1 = { ...fly, wingNear: 62, wingFar: 80 };
  F.fly_2 = { ...fly, wingNear: 14, wingFar: 30 }; // wings down
  F.soar = { ...fly, bodyRot: 52, headRot: -36, wingNear: 86, wingFar: 104, wingLen: 82, eyes: 'closed', beak: 'grin' };
  F.dive = { bodyRot: 102, headRot: -62, anchor: 'center', pivot: CENTER, feet: 'tuck', wingNear: 0, wingFar: 8, wingLen: 52, eyes: 'determined', beak: 'closed', tails: 'none' };
  F.land = { ...slide, squash: [1.14, 0.84], eyes: 'sparkle', beak: 'grin' };
  F.bonk = { ...slide, squash: [1.18, 0.8], headRot: -50, eyes: 'dizzy', beak: 'open', wingNear: 60, wingFar: 80 };
  F.idle_0 = { pivot: STAND, wingNear: 8, wingFar: -10 };
  F.idle_1 = { pivot: STAND, wingNear: 10, wingFar: -12, squash: [1.02, 0.98], eyes: 'closed' };
  F.idle_look = { pivot: STAND, wingNear: 6, wingFar: -8, headRot: -8, eyes: 'open', beak: 'grin' };
  F.walk_0 = { pivot: STAND, feet: 'step0', wingNear: 22, wingFar: -24, bodyRot: -5 };
  F.walk_1 = { pivot: STAND, feet: 'step1', wingNear: 12, wingFar: -16, bob: -4 };
  F.walk_2 = { pivot: STAND, feet: 'step2', wingNear: 22, wingFar: -24, bodyRot: 5 };
  F.walk_3 = { pivot: STAND, feet: 'step3', wingNear: 12, wingFar: -16, bob: -4 };
  F.cheer_0 = { pivot: STAND, wingNear: -158, wingFar: 158, eyes: 'happy', beak: 'open', squash: [0.96, 1.04], wingRootX: 0.05 };
  F.cheer_1 = { pivot: [192, 290], wingNear: -135, wingFar: 140, eyes: 'happy', beak: 'grin', feet: 'tuck', squash: [1.03, 0.97], wingRootX: 0.05 };
  F.sad = { pivot: STAND, wingNear: 2, wingFar: -4, headRot: 10, eyes: 'closed', beak: 'closed' };
  return F;
}

export function villagerFrames() {
  const kinds = {
    va: { scarf: '#3f8ee8', scarfDark: '#2a5fb0' },
    vb: { scarf: null, hat: 'beanie' },
    vc: { scarf: '#ffc933', scarfDark: '#d9951a', hat: 'earmuff' },
    vd: { scarf: '#7be0a0', scarfDark: '#3fae73' },
  };
  const F = {};
  for (const [k, look] of Object.entries(kinds)) {
    F[`${k}_idle`] = { ...look, pivot: STAND, wingNear: 8, wingFar: -10 };
    F[`${k}_blink`] = { ...look, pivot: STAND, wingNear: 8, wingFar: -10, eyes: 'closed' };
    F[`${k}_walk0`] = { ...look, pivot: STAND, feet: 'step0', wingNear: 22, wingFar: -24, bodyRot: -5 };
    F[`${k}_walk1`] = { ...look, pivot: STAND, feet: 'step1', wingNear: 12, wingFar: -16, bob: -4 };
    F[`${k}_walk2`] = { ...look, pivot: STAND, feet: 'step2', wingNear: 22, wingFar: -24, bodyRot: 5 };
    F[`${k}_walk3`] = { ...look, pivot: STAND, feet: 'step3', wingNear: 12, wingFar: -16, bob: -4 };
    F[`${k}_cheer`] = { ...look, pivot: STAND, wingNear: -158, wingFar: 158, eyes: 'happy', beak: 'open', wingRootX: 0.05 };
  }
  const baby = { baby: true, scarf: null, hat: 'tuft', pivot: STAND, scale: 0.62 };
  F.baby_idle = { ...baby, wingNear: 12, wingFar: -14 };
  F.baby_blink = { ...baby, wingNear: 12, wingFar: -14, eyes: 'closed' };
  F.baby_walk0 = { ...baby, feet: 'step0', wingNear: 30, wingFar: -30, bodyRot: -6 };
  F.baby_walk1 = { ...baby, feet: 'step1', wingNear: 18, wingFar: -20, bob: -3 };
  F.baby_walk2 = { ...baby, feet: 'step2', wingNear: 30, wingFar: -30, bodyRot: 6 };
  F.baby_walk3 = { ...baby, feet: 'step3', wingNear: 18, wingFar: -20, bob: -3 };
  F.baby_cheer = { ...baby, wingNear: -158, wingFar: 158, eyes: 'happy', beak: 'open', wingRootX: 0.05 };
  const juv = { baby: true, scarf: null, pivot: STAND, scale: 0.8 };
  F.juv_idle = { ...juv, wingNear: 10, wingFar: -12 };
  F.juv_walk0 = { ...juv, feet: 'step0', wingNear: 26, wingFar: -26, bodyRot: -5 };
  F.juv_walk1 = { ...juv, feet: 'step1', wingNear: 16, wingFar: -18, bob: -3 };
  F.juv_walk2 = { ...juv, feet: 'step2', wingNear: 26, wingFar: -26, bodyRot: 5 };
  F.juv_walk3 = { ...juv, feet: 'step3', wingNear: 16, wingFar: -18, bob: -3 };
  return F;
}
