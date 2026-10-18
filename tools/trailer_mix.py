#!/usr/bin/env python3
"""Assembles the trailer from the frame-stepped shots in .cache/trailer/<lang>/ (tools/trailer.mjs).

Edit: shots are cut on the beat of the run music (132 BPM). Audio is mixed offline from the
same files the game plays: the run music bed (+ its Snow Rush layer while the game was in Snow
Rush), and every sound effect the game triggered, placed at the exact frame it happened, with the
slide/wind loops following the levels the game set each frame.

python3 tools/trailer_mix.py [lang]   -> ko: out/release/trailer.mp4 (clean, subtitles as tracks)
                                          + trailer-ad-ko.mp4 (captions burned in, for muted feeds)
                                          en: trailer-ad-en.mp4 (English UI + English captions)
                                          out/release/subtitles/trailer.<ko|en>.vtt/.srt
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

# (name, shot, first frame in the shot, length in beats). A shot may be used twice (jump cut).
EDL = [
    ('hook', 'hook', 0, 8),
    ('hook2', 'hook', 136, 8),   # jump cut inside the same run: skips the top of the 2nd flight
    ('escape', 'escape', 0, 6),
    ('crossing', 'crossing', 0, 8),
    ('meta', 'meta', 0, 9),
    ('payoff', 'payoff', 0, 4),
    ('m_wind', 'm_wind', 2, 2),
    ('m_geyser', 'm_geyser', 2, 2),
    ('m_rings', 'm_rings', 2, 2),
    ('m_clouds', 'm_clouds', 2, 2),
    ('cinematic', 'cinematic', 0, 5),
    ('title', 'title', 0, 6),
]
# shots whose own sound effects play quieter (the end card's attract mode)
SFX_GAIN = {'title': 0.45}
# shots where the Snow Rush layer of the music is brought in for energy (it is the same track)
LAYER_ON = {'crossing', 'payoff', 'm_wind', 'm_geyser', 'm_rings', 'm_clouds'}

# captions: (from entry, offset s, to entry, offset s (None = entry end), position)
# position 'auto' = the band (sky under the HUD, the usual 70 % line, or low) the penguin is least in
CUES = [
    ('hook', 0.0, 'hook', 1.30, 'auto'),
    ('hook', 1.30, 'hook', 3.0, 'auto'),
    ('hook', 3.0, 'hook2', None, 'auto'),
    ('escape', 0.0, 'escape', None, 'auto'),
    ('crossing', 0.0, 'crossing', None, 'auto'),
    ('meta', 0.0, 'meta', 'hub', 0.60),
    ('meta', 'hub', 'meta', None, 0.615),
    ('payoff', 0.0, 'payoff', None, 'auto'),
    ('m_wind', 0.0, 'm_clouds', None, 'auto'),
    ('cinematic', 0.0, 'cinematic', None, 'auto'),
    ('title', 0.0, 'title', None, 0.60),
]
BANDS = [0.70, 0.175, 0.80, 0.60]


TEXT = {
    'ko': ['꾹 누르면 쭉 미끄러지고', '손을 떼면 하늘 높이!', '완벽 착지 3연속이면 눈꽃 질주!', '눈보라를 따돌리세요!',
           '바다 건너 새로운 섬으로', '모은 물고기로 날개를 강화하고', '펭귄 마을을 키워요', '강화할수록 더 높이!',
           '아홉 개의 섬, 그리고 끝없는 하늘', '더 높이, 더 멀리', '한 손가락으로, 끝없는 하늘까지'],
    'en': ['Hold to slide.', 'Let go to fly!', '3 perfect landings = Snow Rush!', 'Shake off the blizzard!',
           'Fly across the sea to new islands', 'Spend fish on stronger wings', 'and grow your penguin village', 'Upgrade to fly even higher!',
           'Nine islands and an endless sky', 'Higher. Farther.', 'One finger. Endless sky.'],
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
    for name, shot, f0, nb in EDL:
        a = round(beats * BEAT * FPS)
        beats += nb
        b = round(beats * BEAT * FPS)
        out.append((name, shot, f0, b - a, a))
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


MARK = {}
PY = {}  # per EDL entry: penguin screen y for each trailer frame (None outside runs)


def main():
    cuts, total = cut_points()
    dur = total / FPS
    print(f'trailer {total} frames = {dur:.2f}s')
    # ---- video frames
    seq = os.path.join(ROOT, '.cache/trailer', 'seq_' + LANG)
    shutil.rmtree(seq, ignore_errors=True)
    os.makedirs(seq)
    k = 0
    for name, shot, f0, n, _ in cuts:
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
    for ent, shot, f0, n, start in cuts:
        meta = json.load(open(os.path.join(SRC, shot, 'meta.json')))
        to_frame, t0, t1 = frame_time_map(meta, f0, n)
        base = start / FPS
        g = SFX_GAIN.get(ent, 1.0)
        fever = False
        for e in meta['log']:
            if 'fever' in e and e['t'] <= t0:
                fever = e['fever']
        a, b = int(base * SR), int((base + n / FPS) * SR)
        layer[a:b] = 1.0 if (fever or ent in LAYER_ON) else 0.0
        count = 0
        for e in meta['log']:
            fi = to_frame(e['t'])
            if fi is None:
                continue
            at = int((base + fi / FPS) * SR)
            if 'fever' in e:
                if ent not in LAYER_ON:
                    layer[at:b] = 1.0 if e['fever'] else 0.0
                continue
            if 'duck' in e:
                m = int(e['dur'] * SR)
                duck[at:at + m] = np.minimum(duck[at:at + m], 1 - e['duck'])
                continue
            if e.get('music') == 'theme' and shot == 'meta':
                MARK['hub'] = base + fi / FPS
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
        shot_rows.append((ent, base, n / FPS, count))
        PY[ent] = [(meta.get('py') or [None] * (f0 + n))[f0 + i] if f0 + i < len(meta.get('py') or []) else None for i in range(n)]
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
    # ---- caption timing (same for every language)
    start = {r[0]: r[1] for r in shot_rows}
    length = {r[0]: r[2] for r in shot_rows}
    def at(shot, off, end=False):
        if off is None:
            return start[shot] + length[shot]
        if isinstance(off, str):
            return MARK[off]
        return start[shot] + off
    def place(a, b, pos):
        if pos != 'auto':
            return pos
        ys = []
        for name, _, _, n, st in cuts:
            for i, y in enumerate(PY.get(name, [])):
                t = (st + i) / FPS
                if a <= t < b and y is not None:
                    ys.append(y)
        if not ys:
            return BANDS[0]
        # the penguin plus its pop-up labels take roughly +-8 % of the height around it
        cost = [sum(1 for y in ys if abs(y - band) < 0.085 or (band < 0.3 and y - 0.12 < band < y)) / len(ys) for band in BANDS]
        best = min(range(len(BANDS)), key=lambda k: (round(cost[k], 2), k))
        return BANDS[best]
    cues = [(at(a, oa), at(b, ob)) for a, oa, b, ob, pos in CUES]
    cues = [(a, b, place(a, b, c[4])) for (a, b), c in zip(cues, CUES)]
    # ---- subtitle files
    sub_dir = os.path.join(REL, 'subtitles')
    os.makedirs(sub_dir, exist_ok=True)
    def ts(x, sep):
        h, m, s2 = int(x // 3600), int(x % 3600 // 60), x % 60
        ms = int(round((s2 % 1) * 1000))
        if ms == 1000:
            ms = 999
        return f'{h:02d}:{m:02d}:{int(s2):02d}{sep}{ms:03d}'
    for lg, lines in TEXT.items():
        with open(os.path.join(sub_dir, f'trailer.{lg}.vtt'), 'w', encoding='utf-8') as f:
            f.write('WEBVTT\n\n')
            for i, ((a, b, pos), txt) in enumerate(zip(cues, lines), 1):
                f.write(f'{i}\n{ts(a, ".")} --> {ts(min(b, dur) - 0.02, ".")} line:{round(pos * 100)}%\n{txt}\n\n')
        with open(os.path.join(sub_dir, f'trailer.{lg}.srt'), 'w', encoding='utf-8') as f:
            for i, ((a, b, pos), txt) in enumerate(zip(cues, lines), 1):
                f.write(f'{i}\n{ts(a, ",")} --> {ts(min(b, dur) - 0.02, ",")}\n{txt}\n\n')
    # ---- encode: clean version (subtitles as tracks) and an ad version with captions burned in
    os.makedirs(REL, exist_ok=True)
    caps = caption_images(cues, TEXT[LANG])
    outputs = [(os.path.join(REL, f'trailer-ad-{LANG}.mp4'), caps)]
    if LANG == 'ko':
        outputs.insert(0, (os.path.join(REL, 'trailer.mp4'), None))
    for out, overlays in outputs:
        crf = 21
        while True:
            cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', os.path.join(seq, '%05d.jpg')]
            vf = []
            if overlays:
                for f, a, b in overlays:
                    cmd += ['-i', f]
                chain, last = [], '0:v'
                for i, (f, a, b) in enumerate(overlays, 1):
                    tag = f'v{i}'
                    chain.append(f"[{last}][{i}:v]overlay=0:0:enable='between(t,{a:.3f},{b:.3f})'[{tag}]")
                    last = tag
                vf = ['-filter_complex', ';'.join(chain), '-map', f'[{last}]', '-map', f'{len(overlays) + 1}:a']
            cmd += ['-i', wav] + vf + ['-c:v', 'libx264', '-preset', 'slow', '-crf', str(crf), '-maxrate', '5200k', '-bufsize', '10400k',
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
    for (a, b, pos), txt in zip(cues, TEXT[LANG]):
        print(f'  cue {a:6.2f}-{b:6.2f} @{pos:.2f} {txt!r}')
    json.dump({'lang': LANG, 'duration': dur, 'shots': [{'shot': r[0], 'start': round(r[1], 3), 'dur': round(r[2], 3)} for r in shot_rows],
               'cues': [{'start': round(a, 3), 'end': round(b, 3), 'text': t} for (a, b, _), t in zip(cues, TEXT[LANG])]},
              open(os.path.join(ROOT, '.cache/trailer', f'edl_{LANG}.json'), 'w'), indent=1, ensure_ascii=False)


def caption_images(cues, lines):
    """Burned-in caption cards (game font, white with ink outline on a soft dark pill)."""
    from PIL import Image, ImageDraw, ImageFont, ImageFilter
    d = os.path.join(ROOT, '.cache/trailer', 'caps_' + LANG)
    shutil.rmtree(d, ignore_errors=True)
    os.makedirs(d)
    W, H = 1080, 1920
    def font(size):
        if LANG == 'ko':
            return ImageFont.truetype(os.path.join(ROOT, 'art/fonts/Jua-Regular.ttf'), size)
        f = ImageFont.truetype(os.path.join(ROOT, 'art/fonts/Fredoka.ttf'), size)
        f.set_variation_by_axes([620, 100])
        return f
    out = []
    for i, ((a, b, pos), txt) in enumerate(zip(cues, lines)):
        img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        dr = ImageDraw.Draw(img)
        size = 74 if LANG == 'ko' else 68
        f = font(size)
        while max(dr.textlength(t, font=f) for t in txt.split('\n')) > W - 170:
            size -= 3
            f = font(size)
        box = dr.multiline_textbbox((W / 2, pos * H), txt, font=f, anchor='mm', align='center', spacing=10, stroke_width=8)
        pill = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        ImageDraw.Draw(pill).rounded_rectangle([box[0] - 34, box[1] - 18, box[2] + 34, box[3] + 18], 40, fill=(20, 24, 60, 120))
        img.alpha_composite(pill.filter(ImageFilter.GaussianBlur(3)))
        dr.multiline_text((W / 2, pos * H), txt, font=f, anchor='mm', align='center', spacing=10, fill=(255, 255, 255), stroke_width=8, stroke_fill=(30, 35, 80))
        p = os.path.join(d, f'cap{i:02d}.png')
        img.save(p)
        out.append((p, a, b - 0.02))
    return out


if __name__ == '__main__':
    main()
