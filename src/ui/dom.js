// Tiny DOM helpers shared by every screen.
import { iconStyle } from '../game/assets.js';

export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style') el.style.cssText = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'html') el.innerHTML = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) {
    if (c === null || c === undefined || c === false) continue;
    el.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
  }
  return el;
}

// icon sprite element, size in css px (box is square, sprite centered inside)
export function icon(name, size = 32, cls = '') {
  const box = h('span', { class: 'ico ' + cls, style: `width:${size}px;height:${size}px` });
  const inner = h('span', { class: 'ico-in', style: iconStyle(name, size) });
  box.appendChild(inner);
  return box;
}

export function setIcon(box, name, size) {
  const inner = box.firstChild;
  if (inner) inner.style.cssText = iconStyle(name, size);
}

// A tap handler that fires once per tap, ignores taps during transitions and stops the event
// from reaching the game canvas.
export function onTap(el, fn) {
  let last = 0;
  const handler = (e) => {
    e.stopPropagation();
    if (e.type === 'pointerup' && e.button > 0) return;
    const nowT = performance.now();
    if (nowT - last < 280) return; // swallow double taps
    last = nowT;
    if (el.disabled || el.classList.contains('busy')) return;
    fn(e);
  };
  el.addEventListener('click', handler);
  el.addEventListener('pointerdown', (e) => { e.stopPropagation(); el.classList.add('down'); });
  const up = () => el.classList.remove('down');
  el.addEventListener('pointerup', up);
  el.addEventListener('pointerleave', up);
  el.addEventListener('pointercancel', up);
  return el;
}

export function button(label, opts = {}) {
  const b = h('button', { class: 'btn ' + (opts.cls || ''), type: 'button', 'aria-label': opts.aria || label || opts.icon || '' });
  if (opts.icon) b.appendChild(icon(opts.icon, opts.iconSize || 30, 'btn-ico'));
  if (label) b.appendChild(h('span', { class: 'btn-label' }, label));
  if (opts.badge) b.appendChild(h('span', { class: 'badge hidden' }));
  if (opts.onTap) onTap(b, opts.onTap);
  return b;
}

export function setBadge(btn, n) {
  const bd = btn.querySelector('.badge');
  if (!bd) return;
  if (n === true) { bd.textContent = ''; bd.classList.remove('hidden'); bd.classList.add('dot'); }
  else if (n > 0) { bd.textContent = n > 9 ? '9+' : String(n); bd.classList.remove('hidden', 'dot'); }
  else bd.classList.add('hidden');
}

// counts a number up over time; returns a function to jump to the end
const clock = () => (window.__now ? window.__now() : performance.now());

export function countUp(el, from, to, dur, fmt) {
  const t0 = clock();
  let done = false;
  const step = () => {
    if (done) return;
    const k = Math.min(1, (clock() - t0) / dur);
    const e = 1 - Math.pow(1 - k, 3);
    el.textContent = fmt(from + (to - from) * e);
    if (k < 1) requestAnimationFrame(step); else done = true;
  };
  requestAnimationFrame(step);
  return () => { done = true; el.textContent = fmt(to); };
}

// shrinks text until it fits its box (one line)
export function fit(el, minPx = 11) {
  const max = parseFloat(getComputedStyle(el).fontSize);
  let s = max;
  el.style.fontSize = '';
  let guard = 0;
  while (el.scrollWidth > el.clientWidth + 1 && s > minPx && guard++ < 30) {
    s -= 1;
    el.style.fontSize = s + 'px';
  }
}
