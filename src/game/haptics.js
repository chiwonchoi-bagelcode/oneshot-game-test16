// Vibration with distinct strengths per moment. Silently does nothing where unsupported
// (iOS Safari, desktop) or when the player turns it off.
const PATTERNS = {
  light: [12],
  medium: [24],
  strong: [40, 30, 40],
  bonk: [30, 20, 14],
  caught: [60, 40, 90],
  ui: [8],
};

export class Haptics {
  constructor() {
    this.enabled = true;
    this.supported = typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
    this.last = 0;
  }

  pulse(kind) {
    if (!this.enabled || !this.supported) return;
    const now = performance.now();
    if (kind === 'light' && now - this.last < 70) return; // avoid buzzing on fish streams
    this.last = now;
    try { navigator.vibrate(PATTERNS[kind] || PATTERNS.light); } catch (e) { this.supported = false; }
  }
}
