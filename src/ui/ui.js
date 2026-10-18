// Screen + popup manager. Screens are built once at boot and only updated when shown, so nothing
// pops in late. Popups have a fixed header (title + close) and a scrolling body; a popup that is
// already open or still animating can't be opened twice.
import { h, button, onTap, icon } from './dom.js';
import { t } from '../i18n/i18n.js';

export class UI {
  constructor(app) {
    this.app = app;
    this.root = document.getElementById('ui');
    this.screens = {};
    this.current = null;
    this.stack = [];
    this.layer = h('div', { class: 'popup-layer hidden' });
    this.scrim = h('div', { class: 'scrim' });
    this.layer.appendChild(this.scrim);
    onTap(this.scrim, () => { const top = this.stack[this.stack.length - 1]; if (top && top.dismissable !== false) this.close(); });
    this.toastEl = h('div', { class: 'toast hidden' });
    this.root.appendChild(this.layer);
    this.root.appendChild(this.toastEl);
    this.busy = false;
  }

  addScreen(name, screen) {
    this.screens[name] = screen;
    screen.el.classList.add('screen', 'hidden');
    this.root.insertBefore(screen.el, this.layer);
  }

  show(name, data) {
    if (this.current === name) { this.screens[name].refresh?.(data); return; }
    const prev = this.current && this.screens[this.current];
    if (prev) { prev.el.classList.add('hidden'); prev.onHide?.(); }
    this.current = name;
    const s = this.screens[name];
    s.el.classList.remove('hidden');
    s.onShow?.(data);
  }

  isOpen(id) { return this.stack.some((p) => p.id === id); }
  get hasPopup() { return this.stack.length > 0; }

  open(popup) {
    if (this.busy || this.isOpen(popup.id)) return false;
    this.busy = true;
    setTimeout(() => { this.busy = false; }, 260);
    this.stack.forEach((p) => p.el.classList.add('behind'));
    this.stack.push(popup);
    this.layer.classList.remove('hidden');
    this.layer.appendChild(popup.el);
    popup.onOpen?.();
    popup.el.classList.remove('closing');
    popup.el.classList.add('opening');
    requestAnimationFrame(() => requestAnimationFrame(() => popup.el.classList.remove('opening')));
    this.app.audio.play('ui_open', { volume: 0.6 });
    return true;
  }

  close(id) {
    const top = this.stack[this.stack.length - 1];
    if (!top || (id && top.id !== id)) return;
    if (this.busy && !top.forceClose) return;
    this.busy = true;
    setTimeout(() => { this.busy = false; }, 200);
    this.stack.pop();
    top.el.classList.add('closing');
    this.app.audio.play('ui_close', { volume: 0.5 });
    setTimeout(() => { if (top.el.parentNode) top.el.parentNode.removeChild(top.el); top.el.classList.remove('closing'); }, 180);
    top.onClose?.();
    const next = this.stack[this.stack.length - 1];
    if (next) next.el.classList.remove('behind'); else this.layer.classList.add('hidden');
    this.screens[this.current]?.refresh?.();
  }

  closeAll() {
    while (this.stack.length) {
      const p = this.stack.pop();
      if (p.el.parentNode) p.el.parentNode.removeChild(p.el);
      p.onClose?.();
    }
    this.layer.classList.add('hidden');
    this.busy = false;
  }

  toast(text, iconName) {
    const el = this.toastEl;
    el.innerHTML = '';
    if (iconName) el.appendChild(icon(iconName, 28));
    el.appendChild(h('span', {}, text));
    el.classList.remove('hidden');
    el.classList.remove('show');
    el.classList.toggle('low', this.stack.length > 0); // over a popup: show near the bottom, clear of its title
    void el.offsetWidth;
    el.classList.add('show');
    this.app.cancel(this.toastTimer);
    this.toastTimer = this.app.later(() => { el.classList.remove('show'); el.classList.add('hidden'); }, 2300);
  }
}

// Base popup: fixed header with title + close, scrolling body, optional fixed footer.
export class Popup {
  constructor(app, id, titleKey, { cls = '', closable = true, iconName = null } = {}) {
    this.app = app;
    this.id = id;
    this.titleEl = h('h2', { class: 'pop-title' });
    this.titleKey = titleKey;
    this.closeBtn = closable ? button('', { icon: 'close', iconSize: 26, cls: 'btn-close', aria: t('common.close'), onTap: () => app.ui.close(this.id) }) : null;
    this.header = h('div', { class: 'pop-head' }, iconName ? icon(iconName, 34, 'pop-ico') : null, this.titleEl, this.closeBtn);
    this.body = h('div', { class: 'pop-body' });
    this.footer = h('div', { class: 'pop-foot hidden' });
    this.box = h('div', { class: 'pop-box' }, this.header, this.body, this.footer);
    this.el = h('div', { class: 'popup ' + cls }, this.box);
    this.el.addEventListener('pointerdown', (e) => e.stopPropagation());
  }

  onOpen() { this.titleEl.textContent = t(this.titleKey); this.refresh(); }
  refresh() {}
}
