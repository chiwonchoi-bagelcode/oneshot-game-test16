#!/usr/bin/env python3
"""Assembles the trailer from the frame-stepped shots in .cache/trailer/<lang>/ (tools/trailer.mjs).

Edit: shots are cut on the beat of the run music (132 BPM). Audio is mixed offline from the
same files the game plays: the run music bed (+ its Snow Rush layer while the game was in Snow
Rush), and every sound effect the game triggered, placed at the exact frame it happened, with the
slide/wind loops following the levels the game set each frame.

python3 tools/trailer_mix.py [lang]   -> out/release/trailer.mp4 (ko) / trailer-en.mp4 (en),
                                          out/release/subtitles/trailer.<lang>.vtt/.srt
"""
import json, os, sys, shutil, subprocess
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, lfilter, resample_poly

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
LANG = sys.argv[1] if len(sys.argv) > 1 else 'ko'
SRC = os.path.join(ROOT, '.cache/trailer', LANG)
REL = os.path.join(ROOT, 'out/release')
FPS = 30
SR = 44100
BEAT = 60 / 132

# (shot, first frame in the shot, length in beats)
EDL = [
    ('hook', 0, 12),
    ('fever', 0, 7),
    ('escape', 0, 6),
    ('crossing', 0, 7),
    ('upgrade', 4, 6),
    ('village', 0, 7),
    ('m_sunset', 3, 2),
    ('m_geyser', 3, 2),
    ('m_rings', 3, 2),
    ('m_clouds', 3, 2),
    ('cinematic', 0, 4),
    ('title', 0, 5),
]
# shots whose own sound effects play quieter (the end card's attract mode)
SFX_GAIN = {'title': 0.45}
# shots where the Snow Rush layer of the music is brought in for energy (it is the same track)
LAYER_ON = {'crossing', 'm_sunset', 'm_geyser', 'm_rings', 'm_clouds'}

SUBS = {
    'ko': [
        (0.15, 2.7, '꾹 누르면 쭉 미끄러지고'),
        (2.7, 5.45, '손을 떼면 하늘 높이!'),
        (5.45, 8.6, '완벽하게 착지하면 눈꽃 질주'),
        (8.6, 11.35, '눈보라를 따돌리세요'),
        (11.35, 14.5, '바다 건너 새로운 섬으로'),
        (14.5, 17.25, '모은 물고기로 날개를 강화하고'),
        (17.25, 20.45, '펭귄 마을을 키워요'),
        (20.45, 24.1, '아홉 개의 섬, 그리고 끝없는 하늘'),
        (24.1, 25.9, '더 높이, 더 멀리'),
        (25.9, 28.1, '펭귄 슬라이드 — 한 손가락으로 날아보세요'),
    ],
    'en': [
        (0.15, 2.7, 'Hold to slide down the hill'),
        (2.7, 5.45, 'Let go to soar!'),
        (5.45, 8.6, 'Land smoothly for a Snow Rush'),
        (8.6, 11.35, 'Outrun the blizzard'),
        (11.35, 14.5, 'Fly across the sea to new islands'),
        (14.5, 17.25, 'Spend your fish on stronger wings'),
        (17.25, 20.45, 'and grow your penguin village'),
        (20.45, 24.1, 'Nine islands and an endless sky'),
        (24.1, 25.9, 'Higher. Farther.'),
        (25.9, 28.1, 'Penguin Slide — fly with one finger'),
    ],
}


def read_wav(path):
    sr, d = wavfile.read(path)
    d = d.astype(np.float32) / 32768.0
    if d.ndim == 1:
        d = np.stack([d, d], 1)
    assert sr == SR, path
    return d


def cut_points():
    out, beats = [], 0
    for shot, f0, nb in EDL:
        a = round(beats * BEAT * FPS)
        beats += nb
        b = round(beats * BEAT * FPS)
        out.append((shot, f0, b - a, a))
    return out, round(beats * BEAT * FPS)


def frame_time_map(meta, f0, n):
    """game time -> trailer-local frame index for this shot's window"""
    fr = meta['frames']
    t0 = fr[f0 - 1] if f0 > 0 else (fr[0] - 1 / FPS)
    t1 = fr[min(len(fr) - 1, f0 + n - 1)]
    def to_frame(t):
        if t < t0 or t > t1:
            return None
        i = int(np.searchsorted(fr, t - 1e-6))
        return i - f0
    return to_frame, t0, t1


def main():
    cuts, total = cut_points()
    dur = total / FPS
    print(f'trailer {total} frames = {dur:.2f}s')
    # ---- video frames
    seq = os.path.join(ROOT, '.cache/trailer', 'seq_' + LANG)
    shutil.rmtree(seq, ignore_errors=True)
    os.makedirs(seq)
    k = 0
    for shot, f0, n, _ in cuts:
        d = os.path.join(SRC, shot)
        files = sorted(x for x in os.listdir(d) if x.endswith('.jpg'))
        if len(files) < f0 + n:
            raise SystemExit(f'{shot}: needs {f0 + n} frames, has {len(files)}')
        for i in range(n):
            os.symlink(os.path.join(d, files[f0 + i]), os.path.join(seq, f'{k:05d}.jpg'))
            k += 1
    # ---- audio
    N = int(dur * SR) + SR
    music = np.zeros((N, 2), np.float32)
    layer = np.zeros(N, np.float32)  # gain envelope for the Snow Rush layer
    sfx = np.zeros((N, 2), np.float32)
    slide_g = np.zeros(N, np.float32)
    wind_g = np.zeros(N, np.float32)
    duck = np.ones(N, np.float32)
    cache = {}
    sfx_dir = os.path.join(ROOT, 'audio/out/sfx')
    shot_rows = []
    for shot, f0, n, start in cuts:
        meta = json.load(open(os.path.join(SRC, shot, 'meta.json')))
        to_frame, t0, t1 = frame_time_map(meta, f0, n)
        base = start / FPS
        g = SFX_GAIN.get(shot, 1.0)
        fever = False
        for e in meta['log']:
            if 'fever' in e and e['t'] <= t0:
                fever = e['fever']
        a, b = int(base * SR), int((base + n / FPS) * SR)
        layer[a:b] = 1.0 if (fever or shot in LAYER_ON) else 0.0
        count = 0
        for e in meta['log']:
            fi = to_frame(e['t'])
            if fi is None:
                continue
            at = int((base + fi / FPS) * SR)
            if 'fever' in e:
                if shot not in LAYER_ON:
                    layer[at:b] = 1.0 if e['fever'] else 0.0
                continue
            if 'duck' in e:
                m = int(e['dur'] * SR)
                duck[at:at + m] = np.minimum(duck[at:at + m], 1 - e['duck'])
                continue
            name = e.get('name')
            if not name or name.startswith('loop_'):
                continue
            if name not in cache:
                cache[name] = read_wav(os.path.join(sfx_dir, name + '.wav'))
            s = cache[name]
            rate = e.get('rate', 1) or 1
            if abs(rate - 1) > 0.01:
                up = int(round(1000 / rate))
                s = resample_poly(s, up, 1000, axis=0).astype(np.float32)
            s = s * float(e.get('volume', 1)) * g
            end = min(N, at + len(s))
            sfx[at:end] += s[:end - at]
            count += 1
        # continuous loops: levels the game set each frame
        for row in meta['loops']:
            fi = to_frame(row['t'])
            if fi is None:
                continue
            a2 = int((base + fi / FPS) * SR)
            b2 = int((base + (fi + 1) / FPS) * SR)
            if 'setSlide' in row:
                lv, pressing, ice = row['setSlide']
                slide_g[a2:b2] = lv * (0.55 if pressing else 0.28) * g
            if 'setWind' in row:
                wind_g[a2:b2] = row['setWind'][0] * 0.45 * g
        shot_rows.append((shot, base, n / FPS, count))
    # smooth the loop envelopes like WebAudio setTargetAtTime does
    def smooth(env, tau):
        a = 1 - np.exp(-1 / (tau * SR))
        return lfilter([a], [1, a - 1], env).astype(np.float32)
    slide_g, wind_g, layer, duck = smooth(slide_g, 0.05), smooth(wind_g, 0.3), smooth(layer, 0.25), smooth(duck, 0.05)
    def tile(x, n):
        r = int(np.ceil(n / len(x)))
        return np.tile(x, (r, 1))[:n]
    b_lo, a_lo = butter(2, 2600 / (SR / 2))
    slide = lfilter(b_lo, a_lo, tile(read_wav(os.path.join(sfx_dir, 'loop_slide.wav')), N), axis=0)
    b_w, a_w = butter(2, 1400 / (SR / 2))
    wind = lfilter(b_w, a_w, tile(read_wav(os.path.join(sfx_dir, 'loop_wind.wav')), N), axis=0)
    run = read_wav(os.path.join(ROOT, 'audio/out/music/run.wav'))
    run_l = read_wav(os.path.join(ROOT, 'audio/out/music/run_layer.wav'))
    music = tile(run, N) + tile(run_l, N) * (layer * 0.9)[:, None]
    # end: a short fade on the last beat; slow-motion shot gets a gentle dip
    t = np.arange(N) / SR
    fade = np.clip((dur - t) / (BEAT * 1.5), 0, 1)
    cine = next(r for r in shot_rows if r[0] == 'cinematic')
    dip = 1 - 0.35 * np.clip(1 - np.abs(t - (cine[1] + cine[2] * 0.5)) / (cine[2] * 0.6), 0, 1)
    mix = music * (0.6 * duck * dip * fade)[:, None] + sfx * 0.78 + slide * slide_g[:, None] + wind * wind_g[:, None]
    # end-card sting from the game's own sounds
    title = next(r for r in shot_rows if r[0] == 'title')
    st = read_wav(os.path.join(sfx_dir, 'fanfare.wav')) * 0.75
    a3 = int(title[1] * SR)
    mix[a3:a3 + len(st)] += st[:max(0, N - a3)]
    mix = mix[: int(dur * SR)]
    # gentle master limiter and loudness
    peak = np.max(np.abs(mix)) + 1e-9
    mix = np.tanh(mix / peak * 1.6) / np.tanh(1.6) * 0.89
    raw = os.path.join(ROOT, '.cache/trailer', f'mix_{LANG}_raw.wav')
    wavfile.write(raw, SR, (mix * 32767).astype(np.int16))
    # loudness: two-pass EBU R128 normalisation to -14 LUFS (linear gain, true peak <= -1.5 dBTP)
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', raw, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True)
    js = json.loads(r.stderr[r.stderr.rindex('{'):r.stderr.rindex('}') + 1])
    wav = os.path.join(ROOT, '.cache/trailer', f'mix_{LANG}.wav')
    af = (f"loudnorm=I=-14:TP=-1.5:LRA=11:linear=true:measured_I={js['input_i']}:measured_TP={js['input_tp']}:"
          f"measured_LRA={js['input_lra']}:measured_thresh={js['input_thresh']}:offset={js['target_offset']}")
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', raw, '-af', af, '-ar', str(SR), wav], check=True)
    # ---- encode
    out = os.path.join(REL, 'trailer.mp4' if LANG == 'ko' else f'trailer-{LANG}.mp4')
    os.makedirs(REL, exist_ok=True)
    crf = 21
    while True:
        cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', os.path.join(seq, '%05d.jpg'), '-i', wav,
               '-c:v', 'libx264', '-preset', 'slow', '-crf', str(crf), '-maxrate', '5200k', '-bufsize', '10400k',
               '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.1', '-g', '60',
               '-c:a', 'aac', '-b:a', '160k', '-ar', '44100', '-shortest', '-movflags', '+faststart', out]
        subprocess.run(cmd, check=True)
        size = os.path.getsize(out)
        if size <= 19_000_000 or crf > 30:
            break
        crf += 2
    print(f'{out}: {size / 1e6:.2f} MB crf {crf}')
    for r in shot_rows:
        print(f'  {r[0]:10s} {r[1]:6.2f}s +{r[2]:.2f}s  sfx {r[3]}')
    # ---- subtitles (same timing for every language)
    sub_dir = os.path.join(REL, 'subtitles')
    os.makedirs(sub_dir, exist_ok=True)
    def ts(x, sep):
        h, m, s = int(x // 3600), int(x % 3600 // 60), x % 60
        return f'{h:02d}:{m:02d}:{int(s):02d}{sep}{int(round((s % 1) * 1000)):03d}'
    for lg, lines in SUBS.items():
        with open(os.path.join(sub_dir, f'trailer.{lg}.vtt'), 'w', encoding='utf-8') as f:
            f.write('WEBVTT\n\n')
            for i, (a, b, txt) in enumerate(lines, 1):
                f.write(f'{i}\n{ts(a, ".")} --> {ts(min(b, dur), ".")} line:72%\n{txt}\n\n')
        with open(os.path.join(sub_dir, f'trailer.{lg}.srt'), 'w', encoding='utf-8') as f:
            for i, (a, b, txt) in enumerate(lines, 1):
                f.write(f'{i}\n{ts(a, ",")} --> {ts(min(b, dur), ",")}\n{txt}\n\n')
    json.dump({'lang': LANG, 'duration': dur, 'shots': [{'shot': r[0], 'start': round(r[1], 3), 'dur': round(r[2], 3)} for r in shot_rows]},
              open(os.path.join(ROOT, '.cache/trailer', f'edl_{LANG}.json'), 'w'), indent=1)


if __name__ == '__main__':
    main()
