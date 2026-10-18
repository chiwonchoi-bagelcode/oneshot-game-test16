"""Small synthesis toolkit for Penguin Slide's music and sound effects (numpy + scipy).

Instruments are physical-ish models (modal bars for marimba/glockenspiel, Karplus-Strong plucks,
detuned-saw pads, breathy whistle lead) so the result sounds like a little band, not a chiptune.
"""
import numpy as np
from scipy import signal

SR = 44100
rng = np.random.default_rng(7)


def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def env_ad(n, attack=0.005, decay=0.3, curve=4.0):
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    d = np.exp(-np.maximum(t - attack, 0) / max(decay, 1e-4) * (curve / 4))
    return a * d


def env_adsr(n, a=0.01, d=0.1, s=0.7, r=0.2, hold=None):
    t = np.arange(n) / SR
    hold = (n / SR - r) if hold is None else hold
    e = np.where(t < a, t / max(a, 1e-4), 1.0)
    e = np.where((t >= a) & (t < a + d), 1 - (1 - s) * (t - a) / max(d, 1e-4), e)
    e = np.where((t >= a + d) & (t < hold), s, e)
    e = np.where(t >= hold, s * np.exp(-(t - hold) / max(r / 4, 1e-4)), e)
    return e


def fade(x, fin=0.002, fout=0.01):
    x = x.copy()
    a, b = int(fin * SR), int(fout * SR)
    if a > 0:
        x[:a] *= np.linspace(0, 1, a)
    if b > 0:
        x[-b:] *= np.linspace(1, 0, b)
    return x


def lowpass(x, f, q=0.707):
    b, a = signal.iirfilter(2, min(f, SR * 0.45) / (SR / 2), btype='low', ftype='butter')
    return signal.lfilter(b, a, x)


def highpass(x, f):
    b, a = signal.iirfilter(2, f / (SR / 2), btype='high', ftype='butter')
    return signal.lfilter(b, a, x)


def bandpass(x, lo, hi):
    b, a = signal.butter(2, [lo / (SR / 2), min(hi, SR * 0.45) / (SR / 2)], btype='band')
    return signal.lfilter(b, a, x)


def sweep_lowpass(x, f0, f1):
    """time-varying one-pole lowpass (cheap filter sweep)"""
    n = len(x)
    fs = np.geomspace(max(f0, 20), max(f1, 20), n)
    k = 1 - np.exp(-2 * np.pi * fs / SR)
    y = np.zeros(n)
    acc = 0.0
    # block-wise to keep it fast
    B = 64
    for i in range(0, n, B):
        kk = k[i]
        seg = x[i:i + B]
        out = signal.lfilter([kk], [1, -(1 - kk)], seg, zi=[acc * (1 - kk)])[0]
        y[i:i + B] = out
        acc = out[-1]
    return y


def noise(n, color='white'):
    w = rng.standard_normal(n)
    if color == 'pink':
        b = [0.049922035, -0.095993537, 0.050612699, -0.004408786]
        a = [1, -2.494956002, 2.017265875, -0.522189400]
        w = signal.lfilter(b, a, w) * 3
    return w


def osc(freq, dur, kind='sine', phase=0.0, vib=0.0, vib_rate=5.5, detune_cents=0.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = np.asarray(freq, dtype=float) * 2 ** (detune_cents / 1200)
    if f.ndim and len(f) != n:
        f = np.interp(np.linspace(0, 1, n), np.linspace(0, 1, len(f)), f)
    if vib:
        f = f * (1 + vib * np.sin(2 * np.pi * vib_rate * t) * np.clip(t / 0.25, 0, 1))
    ph = 2 * np.pi * np.cumsum(np.broadcast_to(f, (n,))) / SR + phase
    if kind == 'sine':
        return np.sin(ph)
    if kind == 'tri':
        return 2 / np.pi * np.arcsin(np.sin(ph))
    if kind == 'saw':
        # additive, band limited
        f0 = float(np.mean(f))
        out = np.zeros(n)
        k = 1
        while k * f0 < SR * 0.4 and k < 40:
            out += np.sin(ph * k) / k
            k += 1
        return out * 0.6
    if kind == 'square':
        f0 = float(np.mean(f))
        out = np.zeros(n)
        k = 1
        while k * f0 < SR * 0.4 and k < 40:
            out += np.sin(ph * k) / k
            k += 2
        return out * 0.8
    raise ValueError(kind)


# ---------------------------------------------------------------- instruments

def marimba(f, dur=1.2, vel=1.0, bright=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    parts = [(1.0, 1.0, 0.55), (3.93, 0.35 * bright, 0.16), (9.2, 0.12 * bright, 0.05), (2.0, 0.06, 0.3)]
    y = np.zeros(n)
    for r, amp, dec in parts:
        if f * r > SR * 0.45:
            continue
        y += amp * np.sin(2 * np.pi * f * r * t) * np.exp(-t / dec)
    click = bandpass(noise(n), 1500, 6000) * np.exp(-t / 0.004) * 0.25
    y = (y + click) * np.clip(t / 0.0015, 0, 1)
    return fade(y * vel, 0.0005, 0.02)


def glock(f, dur=2.0, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    parts = [(1.0, 1.0, 0.9), (2.76, 0.45, 0.35), (5.40, 0.22, 0.14), (8.93, 0.1, 0.06)]
    y = np.zeros(n)
    for r, amp, dec in parts:
        if f * r > SR * 0.45:
            continue
        y += amp * np.sin(2 * np.pi * f * r * t) * np.exp(-t / dec)
    y *= np.clip(t / 0.001, 0, 1)
    return fade(y * vel, 0.0005, 0.03)


def bell(f, dur=2.5, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    parts = [(0.5, 0.3, 1.2), (1.0, 1.0, 1.0), (1.19, 0.5, 0.6), (1.56, 0.35, 0.5), (2.0, 0.4, 0.4), (2.74, 0.25, 0.25), (3.76, 0.12, 0.15)]
    y = np.zeros(n)
    for r, amp, dec in parts:
        if f * r > SR * 0.45:
            continue
        y += amp * np.sin(2 * np.pi * f * r * t + r) * np.exp(-t / dec)
    return fade(y * vel * np.clip(t / 0.002, 0, 1), 0.0005, 0.05)


def pluck(f, dur=1.0, vel=1.0, bright=0.6, decay=0.996):
    """Karplus-Strong, computed one period block at a time."""
    n = int(dur * SR)
    N = max(2, int(round(SR / f)))
    buf = lowpass(rng.uniform(-1, 1, N), 1500 + 9000 * bright)
    out = np.zeros(n + N)
    out[:N] = buf
    i = N
    while i < n + N:
        prev = out[i - N:i]
        nxt = 0.5 * (prev + np.roll(prev, -1)) * decay
        # the roll wraps the last sample; use the true next sample when available
        nxt[-1] = 0.5 * (prev[-1] + out[i]) * decay if i < len(out) else nxt[-1]
        m = min(N, n + N - i)
        out[i:i + m] = nxt[:m]
        i += N
    y = out[N:N + n]
    return fade(y * vel, 0.0005, 0.02)


def pad(freqs, dur, vel=0.5, cutoff=1800, attack=0.4, release=0.8):
    n = int(dur * SR)
    y = np.zeros(n)
    for f in freqs:
        for dc in (-7, 0, 7):
            y += osc(f, dur, 'saw', phase=rng.uniform(0, 6), detune_cents=dc)
    y = lowpass(y, cutoff)
    e = env_adsr(n, a=attack, d=0.3, s=0.85, r=release)
    return y * e * vel / (len(freqs) * 3)


def bass(f, dur, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * osc(f, dur, 'tri')
    y = np.tanh(1.6 * y) * env_adsr(n, a=0.006, d=0.12, s=0.6, r=0.08)
    return fade(y * vel, 0.001, 0.02)


def whistle(f, dur, vel=1.0, vib=0.012):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = np.asarray(f, dtype=float)
    y = osc(f, dur, 'sine', vib=vib, vib_rate=5.8) + 0.18 * osc(f * 2, dur, 'sine', vib=vib, vib_rate=5.8) + 0.05 * osc(f * 3, dur, 'sine')
    fm = float(np.mean(f))
    breath = bandpass(noise(n), fm * 0.9, fm * 2.5) * 0.08
    e = env_adsr(n, a=0.03, d=0.08, s=0.8, r=0.12)
    return fade((y + breath) * e * vel, 0.002, 0.03)


def kick(dur=0.35, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 50 + 110 * np.exp(-t / 0.035)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.14)
    y += bandpass(noise(n), 800, 4000) * np.exp(-t / 0.003) * 0.3
    return np.tanh(1.5 * y) * vel


def snare(dur=0.25, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.04) * 0.5
    nz = bandpass(noise(n), 1200, 9000) * np.exp(-t / 0.07)
    return (tone + nz) * vel * 0.7


def shaker(dur=0.09, vel=0.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    e = np.clip(t / 0.01, 0, 1) * np.exp(-t / 0.03)
    return highpass(noise(n), 6000) * e * vel


def wood(f=900, dur=0.12, vel=0.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.025) + 0.4 * np.sin(2 * np.pi * f * 2.3 * t) * np.exp(-t / 0.012)
    return y * vel


def tamb(dur=0.2, vel=0.4):
    n = int(dur * SR)
    t = np.arange(n) / SR
    jingle = np.zeros(n)
    for fr in (5400, 7100, 8800, 10300):
        jingle += np.sin(2 * np.pi * fr * t + rng.uniform(0, 6))
    e = np.exp(-t / 0.06)
    return (highpass(noise(n), 7000) * 0.6 + jingle * 0.08) * e * vel


# ---------------------------------------------------------------- mixing

def place(track, clip, start_s, pan=0.0, gain=1.0):
    """add a mono clip into a stereo track at start time with equal-power pan"""
    i = int(start_s * SR)
    if i >= track.shape[1]:
        return
    m = min(len(clip), track.shape[1] - i)
    l = np.cos((pan + 1) * np.pi / 4) * gain
    r = np.sin((pan + 1) * np.pi / 4) * gain
    track[0, i:i + m] += clip[:m] * l
    track[1, i:i + m] += clip[:m] * r


def place_wrap(track, clip, start_s, pan=0.0, gain=1.0):
    """like place(), but anything past the end wraps to the start (seamless music loops)"""
    L = track.shape[1]
    i = int(start_s * SR) % L
    l = np.cos((pan + 1) * np.pi / 4) * gain
    r = np.sin((pan + 1) * np.pi / 4) * gain
    pos = 0
    while pos < len(clip):
        m = min(len(clip) - pos, L - i)
        track[0, i:i + m] += clip[pos:pos + m] * l
        track[1, i:i + m] += clip[pos:pos + m] * r
        pos += m
        i = 0


def reverb_ir(seconds=1.8, decay=0.45, damp=6000, pre=0.012):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    irs = []
    for ch in range(2):
        nz = noise(n) * np.exp(-t / decay)
        nz = lowpass(nz, damp)
        nz[: int(pre * SR)] = 0
        irs.append(nz / np.sqrt(np.sum(nz ** 2)))
    return np.stack(irs)


def reverb(stereo, wet=0.18, seconds=1.8, decay=0.45, damp=6000, loop=False):
    ir = reverb_ir(seconds, decay, damp)
    out = np.zeros_like(stereo)
    L = stereo.shape[1]
    for ch in range(2):
        mono = stereo.mean(axis=0)
        w = signal.fftconvolve(mono, ir[ch])
        if loop:
            # fold the tail back to the start so the loop point has the same ambience
            tail = w[L:]
            w = w[:L].copy()
            k = 0
            while k < len(tail):
                m = min(len(tail) - k, L)
                w[:m] += tail[k:k + m]
                k += m
        else:
            w = w[:L]
        out[ch] = stereo[ch] + w * wet
    return out


def to_mono(stereo):
    return stereo.mean(axis=0)


def normalize(x, peak=0.9):
    m = np.max(np.abs(x)) or 1
    return x * (peak / m)


def soft_limit(x, drive=1.2):
    return np.tanh(x * drive) / np.tanh(drive)
