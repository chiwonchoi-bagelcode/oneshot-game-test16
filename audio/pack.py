"""Encodes audio/out/{sfx,music}/*.wav to MP3 in out/assets/audio/ and writes
  out/assets/audio-sfx.js / audio-music.js  (base64 fallback packs for file://)
  src/data/audio-list.json                   (names + exact loop lengths for the game)
python3 audio/pack.py
"""
import base64, json, os, subprocess
import scipy.io.wavfile as wavfile

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SRC = os.path.join(ROOT, 'audio', 'out')
DST = os.path.join(ROOT, 'out', 'assets', 'audio')
os.makedirs(DST, exist_ok=True)

MUSIC_BITRATE = {'theme': '72k', 'run': '80k', 'run_layer': '64k'}


def enc(wav, mp3, args):
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav] + args + [mp3], check=True)


sfx, music, loops = {}, {}, {}
for f in sorted(os.listdir(os.path.join(SRC, 'sfx'))):
    if not f.endswith('.wav'):
        continue
    n = f[:-4]
    mp3 = os.path.join(DST, n + '.mp3')
    enc(os.path.join(SRC, 'sfx', f), mp3, ['-ac', '1', '-c:a', 'libmp3lame', '-q:a', '5'])
    sfx[n] = base64.b64encode(open(mp3, 'rb').read()).decode()
for f in sorted(os.listdir(os.path.join(SRC, 'music'))):
    if not f.endswith('.wav'):
        continue
    n = f[:-4]
    sr, data = wavfile.read(os.path.join(SRC, 'music', f))
    loops[n] = [0, round(len(data) / sr, 6)]
    mp3 = os.path.join(DST, 'music_' + n + '.mp3')
    enc(os.path.join(SRC, 'music', f), mp3, ['-ac', '2', '-c:a', 'libmp3lame', '-b:a', MUSIC_BITRATE.get(n, '80k')])
    music['music_' + n] = base64.b64encode(open(mp3, 'rb').read()).decode()

loop_js = json.dumps({k.replace('_layer', '') if False else k: v for k, v in loops.items()})
open(os.path.join(ROOT, 'out', 'assets', 'audio-sfx.js'), 'w').write('window.__audioPack(' + json.dumps(sfx) + ');\n')
open(os.path.join(ROOT, 'out', 'assets', 'audio-music.js'), 'w').write('window.__audioPack(' + json.dumps(music) + ',' + loop_js + ');\n')
json.dump({'sfx': sorted(sfx), 'music': sorted(music), 'loops': loops}, open(os.path.join(ROOT, 'src', 'data', 'audio-list.json'), 'w'), indent=1)
size = lambda d: sum(len(v) for v in d.values()) * 3 // 4 // 1024
print(f'sfx {len(sfx)} ({size(sfx)} KB mp3), music {len(music)} ({size(music)} KB mp3)')
