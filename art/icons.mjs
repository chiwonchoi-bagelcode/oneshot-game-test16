// UI icons, 128x128, same outline + paint style as the world sprites. Each icon has a distinct
// silhouette and its own main color so none can be confused at a glance.
import { PAL, id, paintFilter, lin, rad, svg, blob, f, star, sparkle } from './lib.mjs';
import { snowflake } from './sprites.mjs';

const O = 6;
const S = (o) => `stroke="${PAL.ink}" stroke-width="${o ?? O}" stroke-linejoin="round" stroke-linecap="round"`;

function icon(defs, body, seed = 5) {
  const fid = id('if');
  return svg(128, 128, paintFilter(fid, { wobble: 1.0, grain: 0.08, seed }) + defs.join(''), `<g filter="url(#${fid})">${body}</g>`);
}
const L = (stops, x2 = 0, y2 = 1) => { const g = id('ig'); return [g, lin(g, stops, 0, 0, x2, y2)]; };

export const ICONS = {
  fish: () => {
    const [g, d] = L([[0, PAL.fishLight], [0.55, PAL.fish], [1, PAL.fishDark]]);
    return icon([d], `<path d="M30,64 L10,40 Q18,64 10,88Z" fill="url(#${g})" ${S()}/>
      <path d="M24,64 C40,32 86,26 112,52 C118,64 112,74 106,80 C86,100 40,96 24,64Z" fill="url(#${g})" ${S()}/>
      <path d="M44,48 Q70,36 96,46" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="0.75"/>
      <circle cx="94" cy="58" r="9" fill="#fff" ${S(4)}/><circle cx="96" cy="59" r="4.5" fill="${PAL.navyDark}"/>`);
  },
  goldfish: () => {
    const [g, d] = L([[0, PAL.goldLight], [0.55, PAL.gold], [1, PAL.goldDark]]);
    return icon([d], `<path d="M30,64 L10,40 Q18,64 10,88Z" fill="url(#${g})" ${S()}/>
      <path d="M58,34 L64,14 L74,30 L84,12 L90,36" fill="${PAL.gold}" ${S(5)}/>
      <path d="M24,64 C40,32 86,26 112,52 C118,64 112,74 106,80 C86,100 40,96 24,64Z" fill="url(#${g})" ${S()}/>
      <circle cx="94" cy="58" r="9" fill="#fff" ${S(4)}/><circle cx="96" cy="59" r="4.5" fill="${PAL.navyDark}"/>
      <path d="${sparkle(34, 30, 13, 0.25)}" fill="#fff" ${S(3)}/>`);
  },
  flap: () => { // wing with motion arcs
    const [g, d] = L([[0, '#7fa2ff'], [0.5, PAL.navyLight], [1, PAL.navy]], 1, 1);
    return icon([d], `<path d="M36,96 C20,60 40,22 92,16 C104,16 108,24 100,32 C80,52 70,74 66,100 C62,112 44,112 36,96Z" fill="url(#${g})" ${S()}/>
      <path d="M52,84 C48,60 62,40 86,30" fill="none" stroke="#bcd0ff" stroke-width="7" stroke-linecap="round"/>
      <path d="M86,64 Q102,72 110,92 M74,84 Q88,92 94,110" fill="none" stroke="${PAL.gold}" stroke-width="7" stroke-linecap="round"/>
      <path d="M86,64 Q102,72 110,92 M74,84 Q88,92 94,110" fill="none" stroke="${PAL.ink}" stroke-width="2" stroke-linecap="round" opacity="0.5"/>`);
  },
  slide: () => { // red sled with snow spray
    const [g, d] = L([[0, PAL.scarfLight], [0.6, PAL.scarf], [1, PAL.scarfDark]]);
    return icon([d], `<path d="M14,64 L96,64 Q116,64 116,82 L22,82 Q14,82 14,64Z" fill="url(#${g})" ${S()}/>
      <path d="M18,96 L104,96 Q118,96 120,82" fill="none" stroke="${PAL.ink}" stroke-width="12" stroke-linecap="round"/>
      <path d="M18,96 L104,96 Q118,96 120,82" fill="none" stroke="#e6ecff" stroke-width="6" stroke-linecap="round"/>
      <path d="M36,82 L36,96 M84,82 L84,96" stroke="${PAL.ink}" stroke-width="6"/>
      <path d="M26,58 Q60,48 98,58" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.7"/>
      <circle cx="16" cy="44" r="8" fill="#fff" ${S(4)}/><circle cx="34" cy="34" r="6" fill="#fff" ${S(4)}/><circle cx="10" cy="26" r="5" fill="#fff" ${S(4)}/>`);
  },
  magnet: () => {
    return icon([], `<path d="M30,24 L30,70 A34,34 0 0 0 98,70 L98,24 L72,24 L72,70 A8,8 0 0 1 56,70 L56,24 Z" fill="#ff5a5a" ${S()}/>
      <rect x="30" y="18" width="26" height="22" rx="4" fill="#e6ecff" ${S()}/><rect x="72" y="18" width="26" height="22" rx="4" fill="#e6ecff" ${S()}/>
      <path d="M38,64 Q40,88 60,96" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.7"/>
      <path d="M100,104 L112,94 L112,114Z" fill="${PAL.fish}" ${S(4)}/><path d="M86,104 C92,94 106,94 112,104 C106,114 92,114 86,104Z" fill="${PAL.fish}" ${S(4)}/>`);
  },
  glide: () => { // feather
    const [g, d] = L([[0, '#ffffff'], [0.6, '#dff3ff'], [1, '#9fd2f5']], 1, 1);
    return icon([d], `<path d="M100,14 C60,20 26,58 24,104 C50,104 92,80 104,40 C108,28 106,18 100,14Z" fill="url(#${g})" ${S()}/>
      <path d="M100,16 Q60,60 18,116" fill="none" stroke="${PAL.ink}" stroke-width="6" stroke-linecap="round"/>
      <path d="M86,40 L66,44 M80,56 L56,62 M70,72 L46,78" stroke="#7fbfe8" stroke-width="5" stroke-linecap="round"/>`);
  },
  scarf: () => {
    const [g, d] = L([[0, PAL.scarfLight], [0.5, PAL.scarf], [1, PAL.scarfDark]]);
    return icon([d], `<path d="M18,46 Q64,70 110,44 L112,66 Q64,92 16,68Z" fill="url(#${g})" ${S()}/>
      <path d="M30,62 L22,112 L44,114 L50,70Z" fill="url(#${g})" ${S()}/>
      <path d="M26,58 Q64,78 104,58" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="9 9" stroke-linecap="round"/>
      <path d="M24,100 L44,102" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
      <circle cx="38" cy="66" r="11" fill="url(#${g})" ${S(5)}/>`);
  },
  home: () => {
    const [g, d] = L([[0, '#ffffff'], [1, '#bfd2f0']]);
    return icon([d], `<path d="M10,104 Q8,34 64,30 Q120,34 118,104Z" fill="url(#${g})" ${S()}/>
      <path d="M44,104 Q44,70 64,68 Q84,70 84,104Z" fill="#ffcf6b" ${S()}/>
      <path d="M26,70 Q40,46 62,42" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
      <path d="M24,80 L104,80 M18,58 L110,58" stroke="#a9bfe6" stroke-width="3.4"/>`);
  },
  map: () => {
    const [g, d] = L([[0, '#fff3d6'], [1, '#f0d29a']]);
    return icon([d], `<path d="M14,26 L44,16 L84,28 L114,18 L114,100 L84,110 L44,98 L14,108Z" fill="url(#${g})" ${S()}/>
      <path d="M44,16 L44,98 M84,28 L84,110" stroke="${PAL.ink}" stroke-width="4" opacity="0.6"/>
      <path d="M26,84 Q40,60 60,70 Q78,80 98,44" fill="none" stroke="${PAL.scarf}" stroke-width="5" stroke-dasharray="8 7" stroke-linecap="round"/>
      <path d="M90,36 L106,52 M106,36 L90,52" stroke="${PAL.scarf}" stroke-width="7" stroke-linecap="round"/>`);
  },
  missions: () => {
    const [g, d] = L([[0, PAL.woodLight], [1, PAL.wood]]);
    return icon([d], `<rect x="20" y="18" width="88" height="100" rx="12" fill="url(#${g})" ${S()}/>
      <rect x="30" y="30" width="68" height="80" rx="6" fill="#fffaf0" ${S(4)}/>
      <rect x="46" y="10" width="36" height="18" rx="6" fill="#c9d6ef" ${S(4)}/>
      <path d="M38,50 L46,58 L58,44" fill="none" stroke="#3fbf6f" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M66,52 L88,52 M66,76 L88,76 M42,94 L88,94" stroke="#a9b3d6" stroke-width="6" stroke-linecap="round"/>
      <path d="M38,74 L46,82 L58,68" fill="none" stroke="#3fbf6f" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`);
  },
  calendar: () => {
    return icon([], `<rect x="14" y="22" width="100" height="94" rx="14" fill="#fff" ${S()}/>
      <path d="M14,36 Q14,22 28,22 L100,22 Q114,22 114,36 L114,50 L14,50Z" fill="${PAL.scarf}" ${S()}/>
      <rect x="34" y="10" width="12" height="26" rx="6" fill="#e6ecff" ${S(4)}/><rect x="82" y="10" width="12" height="26" rx="6" fill="#e6ecff" ${S(4)}/>
      ${snowflake(64, 84, 22, 0, '#7fc8ff', 6)}`);
  },
  settings: () => {
    let teeth = '';
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      teeth += `<rect x="56" y="6" width="16" height="26" rx="5" transform="rotate(${(a * 180) / Math.PI} 64 64)" fill="#c9d6ef" ${S(5)}/>`;
    }
    return icon([], `${teeth}<circle cx="64" cy="64" r="38" fill="#c9d6ef" ${S()}/><circle cx="64" cy="64" r="16" fill="${PAL.navy}" ${S(5)}/>
      <path d="M40,52 Q48,34 66,32" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>`);
  },
  pause: () => icon([], `<rect x="32" y="24" width="24" height="80" rx="8" fill="#fff" ${S()}/><rect x="72" y="24" width="24" height="80" rx="8" fill="#fff" ${S()}/>`),
  play: () => icon([], `<path d="M38,22 Q38,14 46,18 L104,56 Q112,64 104,70 L46,110 Q38,114 38,106Z" fill="#fff" ${S()}/>`),
  close: () => icon([], `<path d="M32,32 L96,96 M96,32 L32,96" stroke="${PAL.ink}" stroke-width="26" stroke-linecap="round"/><path d="M32,32 L96,96 M96,32 L32,96" stroke="#fff" stroke-width="13" stroke-linecap="round"/>`),
  back: () => icon([], `<path d="M80,20 L36,64 L80,108" fill="none" stroke="${PAL.ink}" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/><path d="M80,20 L36,64 L80,108" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>`),
  music: () => icon([], `<path d="M44,92 L44,30 L104,18 L104,80" fill="none" stroke="${PAL.ink}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M44,92 L44,30 L104,18 L104,80" fill="none" stroke="#ffd166" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    <ellipse cx="32" cy="94" rx="18" ry="14" fill="#ffd166" ${S()}/><ellipse cx="92" cy="82" rx="18" ry="14" fill="#ffd166" ${S()}/>`),
  sound: () => icon([], `<path d="M16,48 L40,48 L68,22 L68,106 L40,80 L16,80Z" fill="#7fd3ff" ${S()}/>
    <path d="M84,44 Q98,64 84,84 M96,30 Q120,64 96,98" fill="none" stroke="${PAL.ink}" stroke-width="14" stroke-linecap="round"/>
    <path d="M84,44 Q98,64 84,84 M96,30 Q120,64 96,98" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>`),
  vibrate: () => icon([], `<rect x="40" y="14" width="48" height="100" rx="12" fill="#c4a6ff" ${S()}/><rect x="48" y="26" width="32" height="66" rx="5" fill="#fff" ${S(4)}/>
    <path d="M24,40 L16,52 L24,64 L16,76 L24,88 M104,40 L112,52 L104,64 L112,76 L104,88" fill="none" stroke="${PAL.ink}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`),
  language: () => icon([], `<circle cx="64" cy="64" r="48" fill="#7be0a0" ${S()}/>
    <ellipse cx="64" cy="64" rx="22" ry="48" fill="none" ${S(5)}/><path d="M16,64 L112,64 M24,40 L104,40 M24,88 L104,88" fill="none" ${S(5)}/>
    <path d="M36,32 Q46,22 60,20" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>`),
  graphics: () => icon([], `<path d="${sparkle(54, 62, 44, 0.24)}" fill="#ffd166" ${S()}/><path d="${sparkle(98, 30, 20, 0.26)}" fill="#fff" ${S(5)}/><path d="${sparkle(100, 96, 14, 0.26)}" fill="#7fd3ff" ${S(4)}/>`),
  lock: () => icon([], `<path d="M40,58 L40,40 A24,24 0 0 1 88,40 L88,58" fill="none" stroke="${PAL.ink}" stroke-width="20" stroke-linecap="round"/><path d="M40,58 L40,40 A24,24 0 0 1 88,40 L88,58" fill="none" stroke="#c9d6ef" stroke-width="9" stroke-linecap="round"/>
    <rect x="24" y="54" width="80" height="62" rx="14" fill="${PAL.gold}" ${S()}/><circle cx="64" cy="80" r="9" fill="${PAL.ink}"/><rect x="60" y="82" width="8" height="18" rx="3" fill="${PAL.ink}"/>`),
  check: () => icon([], `<circle cx="64" cy="64" r="52" fill="#3fbf6f" ${S()}/><path d="M36,66 L56,86 L94,44" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>`),
  star: () => { const [g, d] = L([[0, '#fff7b8'], [0.6, PAL.gold], [1, PAL.goldDark]]); return icon([d], `<path d="${star(64, 68, 56, 26, 5)}" fill="url(#${g})" ${S()}/><path d="M44,50 Q52,40 62,40" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>`); },
  starEmpty: () => icon([], `<path d="${star(64, 68, 56, 26, 5)}" fill="#d6dcf0" ${S()}/>`),
  gift: () => icon([], `<rect x="18" y="52" width="92" height="64" rx="10" fill="#ff8fa3" ${S()}/><rect x="12" y="36" width="104" height="24" rx="8" fill="#ffb3c4" ${S()}/>
    <rect x="56" y="36" width="16" height="80" fill="${PAL.gold}" ${S(5)}/>
    <path d="M64,36 C40,10 26,30 44,36 M64,36 C88,10 102,30 84,36" fill="none" stroke="${PAL.ink}" stroke-width="12" stroke-linecap="round"/>
    <path d="M64,36 C40,10 26,30 44,36 M64,36 C88,10 102,30 84,36" fill="none" stroke="${PAL.gold}" stroke-width="6" stroke-linecap="round"/>`),
  trophy: () => icon([], `<path d="M36,18 L92,18 L88,62 Q64,86 40,62Z" fill="${PAL.gold}" ${S()}/>
    <path d="M36,28 Q10,28 18,50 Q24,62 40,62 M92,28 Q118,28 110,50 Q104,62 88,62" fill="none" ${S(7)}/>
    <rect x="56" y="76" width="16" height="20" fill="${PAL.goldDark}" ${S(5)}/><rect x="34" y="94" width="60" height="20" rx="6" fill="${PAL.wood}" ${S()}/>
    <path d="M50,28 Q50,48 60,58" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>`),
  lighthouse: () => icon([], `<path d="M40,118 L50,40 L78,40 L88,118Z" fill="#fff" ${S()}/><path d="M44,92 L84,92 L86,106 L42,106Z M48,58 L80,58 L82,72 L46,72Z" fill="${PAL.scarf}"/>
    <path d="M40,118 L50,40 L78,40 L88,118Z" fill="none" ${S()}/><rect x="48" y="16" width="32" height="26" rx="6" fill="#ffd166" ${S()}/>
    <path d="M82,22 L120,10 L120,46Z" fill="#fff3a0" opacity="0.8"/>`),
  egg: () => icon([], `<ellipse cx="64" cy="70" rx="38" ry="48" fill="#fff" ${S()}/><path d="M42,48 Q50,30 64,28" fill="none" stroke="#dce8fb" stroke-width="7" stroke-linecap="round"/><circle cx="76" cy="80" r="6" fill="#9fc0ee"/><circle cx="54" cy="92" r="4.5" fill="#9fc0ee"/>`),
  arrowUp: () => icon([], `<path d="M64,14 L110,62 L80,62 L80,114 L48,114 L48,62 L18,62Z" fill="#3fbf6f" ${S()}/><path d="M64,28 L90,54" stroke="#bff5d0" stroke-width="6" stroke-linecap="round"/>`),
  distance: () => icon([], `<rect x="28" y="12" width="12" height="104" rx="5" fill="#e6ecff" ${S()}/><path d="M40,18 Q76,6 108,26 Q86,44 108,62 Q74,52 40,66Z" fill="${PAL.scarf}" ${S()}/><ellipse cx="34" cy="116" rx="26" ry="8" fill="#fff" ${S(4)}/>`),
  height: () => icon([], `<path d="M64,10 L98,46 L76,46 L76,110 L52,110 L52,46 L30,46Z" fill="#7fd3ff" ${S()}/><path d="M12,108 Q30,90 50,104 Q70,88 90,104 Q108,92 118,108Z" fill="#fff" ${S(5)}/>`),
  info: () => icon([], `<circle cx="64" cy="64" r="50" fill="#7fd3ff" ${S()}/><circle cx="64" cy="36" r="9" fill="#fff" ${S(4)}/><rect x="54" y="54" width="20" height="46" rx="8" fill="#fff" ${S(4)}/>`),
  replay: () => icon([], `<path d="M100,64 A36,36 0 1 1 82,32" fill="none" stroke="${PAL.ink}" stroke-width="24" stroke-linecap="round"/><path d="M100,64 A36,36 0 1 1 82,32" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round"/>
    <path d="M70,10 L104,28 L74,52Z" fill="#fff" ${S(5)}/>`),
  build: () => icon([], `<rect x="56" y="36" width="16" height="84" rx="6" transform="rotate(40 64 64)" fill="${PAL.wood}" ${S()}/>
    <rect x="30" y="14" width="62" height="34" rx="8" transform="rotate(40 64 64)" fill="#c9d6ef" ${S()}/>`),
  village: () => {
    const [g, d] = L([[0, '#ffffff'], [1, '#bfd2f0']]);
    return icon([d], `<path d="M4,108 Q4,58 40,56 Q76,58 76,108Z" fill="url(#${g})" ${S(5)}/><path d="M50,108 Q50,40 88,38 Q126,40 124,108Z" fill="url(#${g})" ${S(5)}/>
      <path d="M74,108 Q74,84 88,82 Q102,84 102,108Z" fill="#ffcf6b" ${S(4)}/><path d="M28,108 Q28,92 40,90 Q52,92 52,108Z" fill="#3d4a8a" ${S(4)}/>`);
  },
  snowflake: () => icon([], snowflake(64, 64, 48, 0, '#bfe6ff', 9)),
  daily: () => icon([], `<circle cx="64" cy="64" r="50" fill="#ffd166" ${S()}/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M64,64 L${f(64 + Math.cos(i * Math.PI / 4) * 30)},${f(64 + Math.sin(i * Math.PI / 4) * 30)}" stroke="#fff3c0" stroke-width="5" stroke-linecap="round"/>`).join('')}
    <path d="M30,84 Q64,40 98,84 Q64,72 30,84Z" fill="${PAL.navy}" ${S(4)}/><circle cx="64" cy="64" r="10" fill="#fff" ${S(4)}/>`),
};
