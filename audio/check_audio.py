"""Visual + numeric audio check: spectrograms and level stats (no listening available here).
python3 audio/check_audio.py <out.png>"""
import os, sys
import numpy as np
from scipy import signal
from scipy.io import wavfile
from PIL import Image, ImageDraw
SRC = os.path.join(os.path.dirname(__file__), 'out')
files = [('sfx', f) for f in sorted(os.listdir(os.path.join(SRC, 'sfx')))] + [('music', f) for f in sorted(os.listdir(os.path.join(SRC, 'music')))]
W, Hh = 300, 110
cols = 4
rows = (len(files) + cols - 1) // cols
img = Image.new('RGB', (cols * W, rows * (Hh + 16)), (255, 255, 255))
d = ImageDraw.Draw(img)
report = []
for i, (kind, f) in enumerate(files):
    sr, x = wavfile.read(os.path.join(SRC, kind, f))
    x = x.astype(float) / 32768
    if x.ndim > 1: x = x.mean(axis=1)
    if kind == 'music': x = x[: sr * 12]
    peak = np.max(np.abs(x)); rms = np.sqrt(np.mean(x ** 2)); dc = np.mean(x)
    clip = np.mean(np.abs(x) > 0.995)
    # click detection: big sample-to-sample jumps
    jumps = np.mean(np.abs(np.diff(x)) > 0.5)
    report.append(f'{kind:5} {f:18} dur {len(x)/sr:5.2f}s peak {peak:.2f} rms {20*np.log10(rms+1e-9):6.1f}dB dc {dc:+.4f} clip {clip:.4f} jumps {jumps:.5f}')
    fr, tt, S = signal.spectrogram(x, sr, nperseg=512, noverlap=384)
    S = 10 * np.log10(S + 1e-12)
    S = S[fr < 12000]
    S = np.clip((S + 100) / 70, 0, 1)
    im = Image.fromarray((255 * (1 - S[::-1])).astype(np.uint8)).resize((W - 10, Hh))
    r, c = divmod(i, cols)
    img.paste(im.convert('RGB'), (c * W + 5, r * (Hh + 16) + 14))
    d.text((c * W + 6, r * (Hh + 16)), f, fill=(0, 0, 0))
img.save(sys.argv[1] if len(sys.argv) > 1 else 'spec.png')
print('\n'.join(report))
