"""Synthesizes every sound effect into audio/out/sfx/*.wav.  python3 audio/make_sfx.py
All pitched effects sit in D major pentatonic so stacked sounds (fish streams, chains) stay musical.
"""
import os, sys
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, os.path.dirname(__file__))
from synth import *  # noqa

OUT = os.path.join(os.path.dirname(__file__), 'out', 'sfx')
os.makedirs(OUT, exist_ok=True)
D5, FS5, A5, B5, D6, E6, FS6, A6, B6, D7 = [midi(n) for n in (74, 78, 81, 83, 86, 88, 90, 93, 95, 98)]


def mix(*parts):
    n = max(len(p) for p in parts)
    y = np.zeros(n)
    for p in parts:
        y[:len(p)] += p
    return y


def at(clip, t, total):
    y = np.zeros(int(total * SR))
    i = int(t * SR)
    m = min(len(clip), len(y) - i)
    y[i:i + m] += clip[:m]
    return y


def space(y, wet=0.15, sec=0.9, decay=0.25):
    st = np.stack([y, y])
    st = reverb(st, wet=wet, seconds=sec, decay=decay)
    return st.mean(axis=0)


def save(name, y, gain=1.0):
    y = normalize(fade(y, 0.001, 0.02), 0.9 * gain)
    wavfile.write(os.path.join(OUT, name + '.wav'), SR, (y * 32767).astype(np.int16))


def whoosh(dur, f0, f1, q=1.0, amp=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    nz = noise(n, 'pink')
    y = sweep_lowpass(nz, f0, f1)
    y = highpass(y, max(120, f0 * 0.4))
    e = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.5
    return y * e * amp


def chirp(f0, f1, f2, dur=0.16, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    k = t / dur
    f = np.where(k < 0.4, f0 + (f1 - f0) * (k / 0.4), f1 + (f2 - f1) * ((k - 0.4) / 0.6))
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.25 * np.sin(4 * np.pi * np.cumsum(f) / SR)
    return y * np.sin(np.pi * k) * vel


# --- movement
save('takeoff', space(mix(whoosh(0.42, 500, 5200, amp=1.0), chirp(380, 620, 760, 0.22, 0.25)), 0.1), 0.8)
fl = mix(at(lowpass(noise(int(0.07 * SR)), 1800) * env_ad(int(0.07 * SR), 0.004, 0.03), 0, 0.3),
         at(lowpass(noise(int(0.07 * SR)), 1500) * env_ad(int(0.07 * SR), 0.004, 0.03), 0.11, 0.3),
         at(np.sin(2 * np.pi * 140 * t_axis(0.12)) * np.exp(-t_axis(0.12) / 0.04) * 0.6, 0, 0.3))
save('flap', fl, 0.6)
pomf = lowpass(noise(int(0.2 * SR), 'pink'), 1300) * env_ad(int(0.2 * SR), 0.004, 0.06)
pomf += np.sin(2 * np.pi * 90 * t_axis(0.2)) * np.exp(-t_axis(0.2) / 0.05) * 0.5
save('land', pomf, 0.6)
# bonk: thud + spring boing, a little silly
n = int(0.6 * SR); tt = np.arange(n) / SR
boing = np.sin(2 * np.pi * np.cumsum(260 + 90 * np.sin(2 * np.pi * 18 * tt) * np.exp(-tt / 0.2)) / SR) * np.exp(-tt / 0.18) * 0.5
thud = lowpass(noise(n, 'pink'), 600) * np.exp(-tt / 0.05) + np.sin(2 * np.pi * np.cumsum(120 * np.exp(-tt / 0.08) + 50) / SR) * np.exp(-tt / 0.1)
save('bonk', space(mix(thud, at(boing, 0.03, 0.6)), 0.08), 0.85)

# --- rewards
save('fish', space(mix(marimba(A5, 0.35, 1.0, 1.2), at(glock(A6, 0.3, 0.25), 0.012, 0.35)), 0.12, 0.6), 0.75)
g = mix(glock(A6, 1.0, 1.0), at(glock(D7, 0.8, 0.6), 0.07, 1.0), at(glock(FS6 * 2, 0.6, 0.35), 0.14, 1.0), at(bell(D6, 1.0, 0.4), 0, 1.0))
save('gold', space(g, 0.2, 1.2, 0.35), 0.85)
save('perfect', space(mix(marimba(D6, 0.8, 1.0, 1.3), glock(A6, 0.9, 0.55), at(glock(D7, 0.7, 0.3), 0.05, 0.9)), 0.18, 1.2, 0.35), 0.85)
save('height', space(mix(glock(FS6, 0.7, 0.8), at(glock(A6, 0.6, 0.5), 0.06, 0.7)), 0.2, 1.0, 0.3), 0.6)
arp = np.zeros(int(1.4 * SR))
for i, f in enumerate([D6, FS6, A6, D7, FS6 * 2, A6 * 2]):
    arp += at(glock(f, 0.9, 0.8 - i * 0.06), i * 0.055, 1.4)
fever = mix(arp, whoosh(1.1, 800, 9000, amp=0.5), at(bell(D5, 1.2, 0.5), 0, 1.4))
save('fever', space(fever, 0.25, 1.6, 0.45), 0.95)
save('ring', space(mix(whoosh(0.5, 1200, 9000, amp=0.6), at(glock(E6, 0.6, 0.7), 0.05, 0.7), at(glock(B6, 0.5, 0.5), 0.1, 0.7)), 0.2), 0.8)
save('escape', space(mix(marimba(A5, 0.4, 0.8), at(marimba(D6, 0.6, 1.0), 0.09, 0.7)), 0.15), 0.6)
sw = mix(at(bell(D5, 1.2, 0.6), 0, 1.4), at(bell(A5, 1.1, 0.5), 0.02, 1.4), at(bell(D6, 1.0, 0.5), 0.04, 1.4), whoosh(0.7, 400, 7000, amp=0.7))
save('secondwind', space(sw, 0.25, 1.5, 0.4), 0.95)

# --- world
n = int(1.1 * SR); tt = np.arange(n) / SR
steam = highpass(noise(n, 'pink'), 700) * np.clip(tt / 0.02, 0, 1) * np.exp(-tt / 0.35)
rumble = lowpass(noise(n), 160) * np.exp(-tt / 0.3) * 1.5
bub = np.zeros(n)
for k in range(7):
    bub += at(chirp(500 + 90 * k, 900 + 60 * k, 700, 0.07, 0.25), 0.15 + k * 0.08, 1.1)
save('geyser', space(mix(steam, rumble, bub), 0.15), 0.9)
save('gust', whoosh(0.9, 300, 2600, amp=1.0) + whoosh(0.9, 200, 1400, amp=0.5), 0.6)
n = int(0.9 * SR); tt = np.arange(n) / SR
dang = (np.sin(2 * np.pi * midi(50) * tt) + np.sin(2 * np.pi * midi(51) * tt) * 0.7) * np.sin(np.pi * tt / 0.9) ** 2 * 0.5
dang += whoosh(0.9, 200, 1600, amp=0.8)
save('danger', space(dang, 0.2), 0.55)
lg = mix(whoosh(1.0, 300, 8000, amp=1.0), at(whistle(np.geomspace(midi(74), midi(98), int(0.8 * SR)), 0.8, 0.6, 0.0), 0.05, 1.0))
save('launch', space(lg, 0.2, 1.4, 0.4), 0.9)

# --- jingles
def jingle(notes, step, dur, lead='whistle', harm=None, roll=False):
    y = np.zeros(int(dur * SR))
    for i, (nn, ln) in enumerate(notes):
        f = midi(nn)
        tt0 = sum(l for _, l in notes[:i]) * step
        if lead == 'whistle':
            y += at(whistle(f, ln * step + 0.12, 0.7), tt0, dur)
        y += at(marimba(f, 0.6, 0.5), tt0, dur)
        if harm:
            y += at(glock(midi(nn + 12), 0.6, 0.25), tt0, dur)
    if roll:
        for k in range(10):
            y += at(snare(0.12, 0.08 + k * 0.015), k * 0.04, dur)
    return y

fan = jingle([(74, 1), (78, 1), (81, 1), (86, 3)], 0.12, 1.9, harm=True, roll=True)
fan += at(bell(midi(86), 1.2, 0.5), 0.36, 1.9) + at(bell(midi(81), 1.2, 0.35), 0.36, 1.9)
fan += at(kick(0.3, 0.5), 0.36, 1.9)
save('fanfare', space(fan, 0.22, 1.6, 0.45), 1.0)
save('arrive', space(jingle([(81, 1), (86, 2)], 0.12, 1.0, harm=True), 0.2), 0.8)
rec = np.zeros(int(1.4 * SR))
for i, nn in enumerate([74, 78, 81, 86, 90, 93]):
    rec += at(glock(midi(nn + 12 if i > 3 else nn), 0.8, 0.8), i * 0.07, 1.4)
rec += at(bell(midi(86), 1.0, 0.5), 0.42, 1.4)
for k in range(6):
    rec += at(shaker(0.08, 0.35), 0.42 + k * 0.09, 1.4)
save('record', space(rec, 0.22, 1.5, 0.4), 0.95)
save('results', space(mix(marimba(midi(81), 0.8, 0.8), at(marimba(midi(78), 0.8, 0.7), 0.14, 1.0), at(bell(midi(74), 1.0, 0.4), 0.28, 1.2)), 0.22, 1.4, 0.4), 0.7)
# caught: whomp + giggling spirit
n = int(1.5 * SR); tt = np.arange(n) / SR
whomp = lowpass(noise(n, 'pink'), 900) * np.clip(tt / 0.01, 0, 1) * np.exp(-tt / 0.25) * 1.2
whomp += np.sin(2 * np.pi * np.cumsum(70 + 80 * np.exp(-tt / 0.1)) / SR) * np.exp(-tt / 0.25)
gig = np.zeros(n)
for k, f in enumerate([700, 640, 590, 540]):
    seg = chirp(f * 1.2, f * 1.35, f, 0.11, 0.35)
    seg = bandpass(seg + 0.3 * np.sign(seg) * np.abs(seg), 300, 3500)
    gig += at(seg, 0.45 + k * 0.13, 1.5)
save('caught', space(mix(whomp, gig), 0.2, 1.2, 0.35), 0.9)

# --- UI
pop = chirp(380, 760, 700, 0.1, 1.0) * np.exp(-t_axis(0.1) / 0.05)
save('ui_open', pop, 0.45)
save('ui_close', chirp(700, 420, 380, 0.09, 1.0) * np.exp(-t_axis(0.09) / 0.05), 0.4)
save('ui_tap', wood(1300, 0.06, 1.0), 0.35)
save('buy', space(mix(wood(900, 0.1, 0.6), at(glock(E6, 0.6, 0.9), 0.04, 0.7), at(glock(B6, 0.6, 0.7), 0.1, 0.7)), 0.15), 0.75)
bl = np.zeros(int(1.1 * SR))
for k in range(3):
    bl += at(wood(520 + k * 40, 0.12, 0.9), k * 0.12, 1.1)
bl += at(glock(D6, 0.8, 0.6), 0.42, 1.1) + at(glock(FS6, 0.8, 0.5), 0.46, 1.1) + at(glock(A6, 0.8, 0.5), 0.5, 1.1)
save('build', space(bl, 0.18), 0.85)
crack = mix(at(bandpass(noise(int(0.05 * SR)), 1500, 7000) * np.exp(-t_axis(0.05) / 0.01), 0, 0.6), at(bandpass(noise(int(0.05 * SR)), 1800, 8000) * np.exp(-t_axis(0.05) / 0.01), 0.12, 0.6),
            at(chirp(900, 1500, 1100, 0.14, 0.7), 0.28, 0.6), at(chirp(1000, 1600, 1250, 0.12, 0.6), 0.44, 0.7))
save('hatch', space(crack, 0.15), 0.7)
save('chirp', chirp(900, 1450, 1050, 0.15, 1.0), 0.5)

# --- loops (seamless: crossfaded wrap)
def seamless(y, xf=0.25):
    k = int(xf * SR)
    out = y[k:].copy()
    head = y[:k]
    w = np.linspace(0, 1, k)
    out[-k:] = out[-k:] * (1 - w) + head * w
    return out

n = int(2.25 * SR); tt = np.arange(n) / SR
crunch = noise(n, 'pink')
crunch = bandpass(crunch, 500, 5000) * (0.75 + 0.25 * np.sin(2 * np.pi * 11 * tt) * np.sin(2 * np.pi * 3.1 * tt))
grains = np.zeros(n)
for k in range(60):
    i = rng.integers(0, n - 2000)
    grains[i:i + 1200] += highpass(noise(1200), 2500) * np.exp(-np.arange(1200) / 200) * rng.uniform(0.2, 0.6)
save('loop_slide', seamless(crunch + grains), 0.7)
n = int(4.25 * SR); tt = np.arange(n) / SR
wind = bandpass(noise(n, 'pink'), 250, 2200) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.47 * tt + 1) * np.sin(2 * np.pi * 0.23 * tt))
howl = np.sin(2 * np.pi * np.cumsum(420 + 80 * np.sin(2 * np.pi * 0.3 * tt)) / SR) * 0.04 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.47 * tt))
save('loop_wind', seamless(wind + howl), 0.7)
print('sfx written to', OUT, len(os.listdir(OUT)))
