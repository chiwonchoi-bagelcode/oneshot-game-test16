"""Writes one blizzard speed curve into every island file + island-specs.json.
python3 tools/set-speeds.py 540,680,...  (9 values)"""
import json, os, sys
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
speeds = [int(v) for v in sys.argv[1].split(',')]
d = os.path.join(root, 'src/data/levels')
for i, f in enumerate(sorted(x for x in os.listdir(d) if x.startswith('island'))):
    p = os.path.join(d, f); lv = json.load(open(p)); lv['blizzard']['speed'] = speeds[i]
    open(p, 'w').write(json.dumps(lv, indent=1, ensure_ascii=False) + '\n')
p = os.path.join(root, 'src/data/island-specs.json'); sp = json.load(open(p))
for i, s in enumerate(sp['islands']): s['blizzard']['speed'] = speeds[i]
open(p, 'w').write(json.dumps(sp, indent=1, ensure_ascii=False))
print('speeds', speeds)
