"""Composes and renders the music loops into audio/out/music/*.wav.  python3 audio/make_music.py

theme       : village / title, 96 BPM, 16 bars, cozy (marimba melody, plucked arpeggios, pad)
run         : flying, 132 BPM, 32 bars (A B A' B'), whistle + marimba leads, light drums
run_layer   : Snow Rush layer for `run`, same length, faded in by the game during fever
Every loop is rendered with wrap-around (notes and reverb tails continue past the loop point
into the beginning), so it repeats without a seam.
"""
import os, sys
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, os.path.dirname(__file__))
from synth import *  # noqa

OUT = os.path.join(os.path.dirname(__file__), 'out', 'music')
os.makedirs(OUT, exist_ok=True)

CH = {  # chord tones (midi) around octave 4
    'D': [62, 66, 69], 'Bm': [59, 62, 66], 'G': [55, 59, 62], 'A': [57, 61, 64], 'F#m': [54, 57, 61], 'Em': [52, 55, 59],
}
ROOT = {'D': 38, 'Bm': 35, 'G': 43, 'A': 45, 'F#m': 42, 'Em': 40}


class Song:
    def __init__(self, bpm, bars):
        self.bpm = bpm
        self.beat = 60 / bpm
        self.bars = bars
        self.L = int(round(bars * 4 * self.beat * SR))
        self.track = np.zeros((2, self.L))

    def t(self, beat):
        return beat * self.beat

    def add(self, clip, beat, pan=0.0, gain=1.0):
        place_wrap(self.track, clip, self.t(beat), pan, gain)

    def melody(self, notes, start_bar, inst, pan=0.0, gain=1.0, octave=0):
        b = start_bar * 4
        for nn, ln in notes:
            if nn is not None:
                f = midi(nn + 12 * octave)
                d = ln * self.beat
                if inst == 'marimba':
                    clip = marimba(f, max(0.5, d + 0.4), 0.9)
                elif inst == 'whistle':
                    clip = whistle(f, d * 0.95 + 0.05, 0.8)
                elif inst == 'glock':
                    clip = glock(f, 1.4, 0.7)
                elif inst == 'pluck':
                    clip = pluck(f, max(0.4, d + 0.3), 0.8, 0.7)
                self.add(clip, b, pan, gain)
            b += ln

    def render(self, wet=0.2, sec=2.0, decay=0.5, master=0.9):
        st = reverb(self.track, wet=wet, seconds=sec, decay=decay, loop=True)
        st = highpass(st, 35) if False else st
        peak = np.max(np.abs(st)) or 1
        st = soft_limit(st / peak * 1.1, 1.3) * master
        return st


def save(name, st):
    st = np.clip(st, -1, 1)
    wavfile.write(os.path.join(OUT, name + '.wav'), SR, (st.T * 32767).astype(np.int16))
    print(name, f'{st.shape[1] / SR:.3f}s', st.shape[1], 'samples')


# ------------------------------------------------------------------ theme (village)
def theme():
    s = Song(96, 16)
    chords = ['D', 'Bm', 'G', 'A', 'D', 'F#m', 'G', 'A', 'Bm', 'G', 'D', 'A', 'G', 'A', 'D', 'D']
    for bar, c in enumerate(chords):
        b0 = bar * 4
        s.add(pad([midi(n) for n in CH[c]], 4 * s.beat + 0.6, vel=0.55, cutoff=1500, attack=0.5, release=1.0), b0, 0, 0.55)
        # plucked arpeggio: 8ths up and down the chord
        tones = CH[c] + [CH[c][0] + 12]
        pat = [0, 1, 2, 3, 2, 1, 2, 1]
        for k, idx in enumerate(pat):
            s.add(pluck(midi(tones[idx] + 12), 0.7, 0.55, 0.5, 0.995), b0 + k * 0.5, -0.35 + 0.1 * (k % 2), 0.42)
        s.add(bass(midi(ROOT[c] + 12), 1.6 * s.beat, 0.9), b0, 0, 0.5)
        s.add(bass(midi(ROOT[c] + 12 + 7), 0.9 * s.beat, 0.7), b0 + 2.5, 0, 0.35)
        for k in range(8):
            s.add(shaker(0.08, 0.5 if k % 2 else 0.3), b0 + k * 0.5, 0.4, 0.22)
        if bar % 2 == 0:
            s.add(glock(midi(CH[c][2] + 24), 1.6, 0.5), b0, 0.5, 0.25)
        if bar % 4 == 3:
            s.add(wood(980, 0.1, 0.6), b0 + 3.5, 0.2, 0.25)
    mel = [
        (81, 1), (78, .5), (81, .5), (83, 1), (81, 1),
        (78, 1.5), (74, .5), (76, 1), (78, 1),
        (79, 1), (83, 1), (81, 1), (79, 1),
        (76, 2), (None, 1), (73, .5), (76, .5),
        (81, 1), (78, .5), (81, .5), (86, 1), (83, 1),
        (81, 1.5), (78, .5), (85, 1), (81, 1),
        (83, 1), (81, 1), (79, 1), (78, 1),
        (76, 3), (None, 1),
        (74, 1), (78, 1), (83, 1), (81, 1),
        (79, 1.5), (78, .5), (76, 1), (74, 1),
        (78, 1), (81, 1), (86, 2),
        (85, 1), (83, 1), (81, 2),
        (83, 1), (79, 1), (86, 1), (83, 1),
        (85, 1), (81, 1), (76, 1), (73, 1),
        (86, 1), (81, 1), (78, 1), (81, 1),
        (74, 3), (None, 1),
    ]
    s.melody(mel, 0, 'marimba', 0.15, 0.85)
    return s.render(wet=0.24, sec=2.2, decay=0.55, master=0.85)


# ------------------------------------------------------------------ run (flying)
RUN_A = ['D', 'D', 'G', 'A', 'Bm', 'G', 'A', 'A']
RUN_B = ['G', 'A', 'F#m', 'Bm', 'G', 'A', 'D', 'D']
LEAD_A = [
    (74, .5), (78, .5), (81, 1), (81, .5), (83, .5), (81, 1),
    (78, 1), (74, .5), (76, .5), (78, 2),
    (79, .5), (81, .5), (83, 1), (86, 1), (83, 1),
    (81, 2), (76, 1), (78, .5), (79, .5),
    (78, .5), (74, .5), (78, 1), (83, 1), (81, 1),
    (79, 1), (78, .5), (76, .5), (74, 1), (71, 1),
    (73, .5), (76, .5), (81, 1), (85, 1), (83, .5), (81, .5),
    (81, 3), (None, 1),
]
LEAD_B = [
    (83, .5), (86, .5), (83, .5), (79, .5), (83, 1), (86, 1),
    (85, .5), (88, .5), (85, .5), (81, .5), (88, 2),
    (85, 1), (81, 1), (78, 1), (81, 1),
    (83, 1.5), (81, .5), (78, 1), (74, 1),
    (79, .5), (83, .5), (86, 1), (88, 1), (86, 1),
    (85, 1), (88, 1), (93, 1), (88, 1),
    (90, 1), (88, .5), (86, .5), (81, 1), (78, 1),
    (86, 2), (None, 2),
]


def run(layer=False):
    s = Song(132, 32)
    sections = [('A', RUN_A), ('B', RUN_B), ('A2', RUN_A), ('B2', RUN_B)]
    bar = 0
    for name, chords in sections:
        for i, c in enumerate(chords):
            b0 = bar * 4
            if not layer:
                # drums: kick 1 & 3 (+ pickup), clap/snare 2 & 4, shaker 8ths
                s.add(kick(0.35, 0.9), b0, 0, 0.55)
                s.add(kick(0.35, 0.7), b0 + 2, 0, 0.5)
                if i % 2 == 1:
                    s.add(kick(0.3, 0.5), b0 + 3.5, 0, 0.35)
                s.add(snare(0.22, 0.8), b0 + 1, 0.1, 0.32)
                s.add(snare(0.22, 0.8), b0 + 3, 0.1, 0.32)
                for k in range(8):
                    s.add(shaker(0.07, 0.6 if k % 2 else 0.35), b0 + k * 0.5, 0.45, 0.25)
                # bouncy bass
                r = midi(ROOT[c] + 12)
                for k, (off, mult, v) in enumerate([(0, 1, 1.0), (0.75, 1, 0.6), (1.5, 2, 0.7), (2, 1, 0.9), (2.75, 1, 0.6), (3.5, 2, 0.7)]):
                    s.add(bass(r * mult, 0.42 * s.beat, v), b0 + off, 0, 0.42)
                # off-beat ukulele skank
                for k in range(4):
                    for j, n in enumerate(CH[c]):
                        s.add(pluck(midi(n + 12), 0.25, 0.5, 0.85, 0.99), b0 + k + 0.5 + j * 0.012, -0.4, 0.34)
                s.add(pad([midi(n) for n in CH[c]], 4 * s.beat + 0.3, vel=0.4, cutoff=1300, attack=0.2, release=0.6), b0, 0.0, 0.3)
            else:
                # Snow Rush layer: sparkling 16th glock arpeggio, tambourine, octave plucks
                tones = CH[c] + [CH[c][0] + 12, CH[c][1] + 12]
                for k in range(16):
                    n = tones[[0, 1, 2, 3, 4, 3, 2, 1][k % 8]] + 24
                    s.add(glock(midi(n), 0.5, 0.6 if k % 4 == 0 else 0.4), b0 + k * 0.25, 0.4 if k % 2 else -0.4, 0.28)
                for k in range(8):
                    s.add(tamb(0.15, 0.7 if k % 2 else 0.4), b0 + k * 0.5 + 0.25, -0.3, 0.3)
                s.add(bell(midi(CH[c][2] + 24), 1.4, 0.5), b0, 0, 0.18)
                s.add(kick(0.3, 0.5), b0 + 1.5, 0, 0.25)
                s.add(kick(0.3, 0.5), b0 + 3.5, 0, 0.25)
            bar += 1
    if not layer:
        s.melody(LEAD_A, 0, 'whistle', 0.12, 0.75)
        s.melody(LEAD_B, 8, 'marimba', 0.18, 0.9)
        s.melody(LEAD_A, 16, 'marimba', 0.18, 0.9)
        s.melody(LEAD_A, 16, 'glock', -0.2, 0.25, octave=1)
        s.melody(LEAD_B, 24, 'whistle', 0.12, 0.75)
        s.melody([(n - 4 if n else None, l) for n, l in LEAD_B], 24, 'marimba', -0.25, 0.35)
        return s.render(wet=0.18, sec=1.6, decay=0.4, master=0.88)
    s.melody(LEAD_A, 0, 'pluck', -0.3, 0.3, octave=1)
    s.melody(LEAD_B, 8, 'pluck', -0.3, 0.3)
    s.melody(LEAD_A, 16, 'pluck', -0.3, 0.3, octave=1)
    s.melody(LEAD_B, 24, 'pluck', -0.3, 0.3)
    return s.render(wet=0.22, sec=1.6, decay=0.4, master=0.6)


save('theme', theme())
save('run', run(False))
save('run_layer', run(True))
