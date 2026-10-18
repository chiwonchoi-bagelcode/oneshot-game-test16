// Loads the sprite atlases and background images and draws frames by name.
const base = () => (window.ASSET_BASE || '') + 'assets/';

let useWebp = true;
export const atlas = { frames: {}, pages: {}, images: {} };
const bgImages = {};
const bgPending = {};

// draw once into a tiny canvas so decode + GPU upload happen at load time, not mid-run
const warm = typeof document !== 'undefined' ? document.createElement('canvas').getContext('2d') : null;
function warmUp(img) { try { if (warm) warm.drawImage(img, 0, 0, 1, 1); } catch (e) { /* ignore */ } }

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      const done = () => { warmUp(img); resolve(img); };
      if (img.decode) img.decode().then(done, done); else done();
    };
    img.onerror = () => reject(new Error('image ' + src));
    img.src = src;
  });
}

async function detectWebp() {
  try {
    const img = await loadImage('data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA');
    return img.width === 1;
  } catch (e) { return false; }
}

export async function loadAtlas(data, onProgress) {
  useWebp = await detectWebp();
  atlas.frames = data.frames;
  atlas.pages = data.pages;
  const ext = useWebp ? '.webp' : '.png';
  const keys = Object.keys(data.pages);
  let done = 0;
  await Promise.all(keys.map(async (k) => {
    atlas.images[k] = await loadImage(base() + data.pages[k].file + ext);
    done++;
    if (onProgress) onProgress(done / keys.length);
  }));
}

export function bg(name) {
  const img = bgImages[name];
  if (img) return img;
  if (!bgPending[name]) {
    bgPending[name] = loadImage(base() + 'bg/' + name + (useWebp ? '.webp' : '.png')).then((im) => { bgImages[name] = im; return im; }).catch(() => null);
  }
  return null;
}

export function preloadBg(names) {
  return Promise.all(names.map((n) => { bg(n); return bgPending[n]; }));
}

export function frame(name) {
  return atlas.frames[name];
}

// Draw a frame with its pivot at (x, y). scale is relative to the packed size.
export function draw(ctx, name, x, y, scale = 1, rot = 0, alpha = 1, flip = false, sx = 1, sy = 1) {
  const fr = atlas.frames[name];
  if (!fr) return;
  const img = atlas.images[fr.p];
  if (!img) return;
  if (alpha <= 0) return;
  const prevA = ctx.globalAlpha;
  if (alpha !== 1) ctx.globalAlpha = prevA * alpha;
  if (rot === 0 && !flip && sx === 1 && sy === 1) {
    ctx.drawImage(img, fr.x, fr.y, fr.w, fr.h, x - fr.px * scale, y - fr.py * scale, fr.w * scale, fr.h * scale);
  } else {
    ctx.save();
    ctx.translate(x, y);
    if (rot) ctx.rotate(rot);
    ctx.scale((flip ? -1 : 1) * scale * sx, scale * sy);
    ctx.drawImage(img, fr.x, fr.y, fr.w, fr.h, -fr.px, -fr.py, fr.w, fr.h);
    ctx.restore();
  }
  if (alpha !== 1) ctx.globalAlpha = prevA;
}

// CSS for DOM icons from the ui atlas page.
export function iconStyle(name, size) {
  const fr = atlas.frames['i_' + name];
  if (!fr) return '';
  const pg = atlas.pages[fr.p];
  const k = size / Math.max(fr.w, fr.h);
  const url = base() + pg.file + (useWebp ? '.webp' : '.png');
  const r = (v) => Math.round(v * 100) / 100;
  return `background-image:url(${url});background-size:${r(pg.w * k)}px ${r(pg.h * k)}px;background-position:${r(-fr.x * k)}px ${r(-fr.y * k)}px;width:${r(fr.w * k)}px;height:${r(fr.h * k)}px;`;
}

export function spriteURL() {
  return useWebp;
}
