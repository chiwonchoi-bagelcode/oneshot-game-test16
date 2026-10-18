#!/usr/bin/env python3
"""Markdown summary of tools/qa.mjs reports (for report.md). python3 tools/qa_summary.py dir1 dir2 ..."""
import json, os, sys

out = []
for d in sys.argv[1:]:
    r = json.load(open(os.path.join(d, 'qa.json')))
    out.append(f"#### {r['device']} · {r['lang']}\n")
    out.append('| 판 | 실력(조종 봇) | 실제 시간 | 판 끝 물고기 | 최고 섬 | 강화 | 건물 | 결과 버튼 | 새 기능 칩 |')
    out.append('|---|---|---|---|---|---|---|---|---|')
    for x in r['runs']:
        ups = ' '.join(f"{k[0]}{v}" for k, v in x['ups'].items() if v)
        out.append(f"| {x['runs']} | {x['prof']} | {x['realSeconds']}초 | {x['fish']} | {x['best'] + 1} | {ups or '-'} | {x['built']} | {x.get('buttons', '-')} | {x.get('chips', '-')} |")
    steps = {}
    for s in r['steps']:
        steps.setdefault(s['s'].split(' ')[0] + (' ' + s['s'].split(' ')[1] if s['s'].startswith('popup') else ''), []).append(s)
    pops = [s for s in r['steps'] if s['s'].startswith('popup ')]
    out.append('')
    out.append('- 팝업(두 번 연속 탭): ' + '; '.join(f"{s['s'][6:].split(':')[0]} → " + (f"열린 팝업 {len(s['stack'])}개, 제목 \"{s.get('title')}\", 닫기 {'있음' if s.get('close') else '없음'}" if 'stack' in s else '버튼 숨김(아직 안 열린 기능)') for s in pops))
    st = next((s for s in r['steps'] if s['s'] == 'settings changed'), None)
    if st:
        out.append(f"- 설정 변경: 언어 → {st['lang']}, 음악 {'켬' if st['settings']['music'] else '끔'}, 그래픽 {st['settings']['quality']} → 즉시 해상도 배율 {st['dpr']}, 품질 단계 {st['q']}")
    rl = next((s for s in r['steps'] if s['s'] == 'reload persistence'), None)
    if rl:
        out.append(f"- 다시 켜기: 진행 유지 {'예' if rl['same'] else '아니오'} (판 {rl['after']['runs']}, 물고기 {rl['after']['fish']}, 건물 {len(rl['after']['built'])}, 화면 {rl['mode']})")
    nd = next((s for s in r['steps'] if s['s'] == 'next day'), None)
    if nd:
        out.append(f"- 26시간 뒤 다시 켜기: 화면 {nd['mode']}, 자동 팝업 {nd['popups']}, 접속 일수 {nd['days']}, 연속 출석 {nd['streak']}, 오늘의 할 일 {nd['missions']}, 알림 \"{nd.get('rack')}\"")
    d2 = next((s for s in r['steps'] if s['s'] == 'day 2 run started'), None)
    if d2:
        out.append(f"- 둘째 날 [날기] → 화면 {d2['mode']}, 열린 팝업 {d2['popups']}개")
    out.append(f"- 자동 넘침 검사 문제: {len(r['overflow'])}건" + ('' if not r['overflow'] else ' — ' + '; '.join(f"{o['where']}: {o['bad'][:2]}" for o in r['overflow'][:5])))
    out.append(f"- 콘솔 오류: {len(r['errors'])}건" + ('' if not r['errors'] else ' — ' + '; '.join(r['errors'][:3])))
    miss = [s['s'] for s in r['steps'] if s['s'].startswith(('missing', 'run ')) and ('did not start' in s['s'] or s['s'].startswith('missing'))]
    if miss:
        out.append(f"- 스크립트가 못 찾은 요소: {', '.join(miss)}")
    out.append('')
print('\n'.join(out))
