# 분석 이벤트와 첫날 이탈 진단 기준

목표 지표는 **D1 리텐션**(설치 다음 날 다시 들어온 비율)입니다. 아래 이벤트는 게임에 모두 들어가 있고(`src/meta/analytics.js`의 `EVENTS` 목록, 호출 위치는 `src/app.js`·`src/game/run-scene.js`), 지금은 `services.analyticsSink`가 콘솔/개발 패널로만 보냅니다. 실제 분석 서비스에 연결할 때는 `src/services/services.js`의 `analyticsSink.send(batch)` 하나만 바꾸면 됩니다.

모든 이벤트에 공통으로 붙는 값: `pid`(기기별 게스트 ID), `v`(게임 버전), `lang`, `ts`(시각).

## 1. 이벤트 목록

| 이벤트 | 언제 | 주요 값 |
|---|---|---|
| `first_open` | 설치 후 첫 실행(기기당 1번) | — |
| `session_start` | 앱 실행 / 30분 이상 떠났다 돌아옴 | `sessions`(누적), `day`(접속한 날 수), `resumed` |
| `session_end` | 앱이 가려질 때 | `seconds`, `runs`(이번 세션 판 수) |
| `tutorial_step` | 첫 판 안내 단계 통과 | `step`: `hold` / `release` |
| `tutorial_complete` | 첫 판 안내 끝 | `time`(초) |
| `run_start` | 판 시작 | `mode`(main/today/editor), `island`(출발 섬), `run`(몇 번째 판), `ups`(강화 상태), `assist`(도움 수준), `tutorial` |
| `run_end` | 판 끝(눈보라에 잡힘) | `distance`, `traveled`, `fish`, `island`, `progress`(섬 진행 %), `cleared`(이번 판에 넘은 섬 수), `time`, `perfects`, `bonks`, `fevers`, `maxH`, `run`, `pressUp`(오르막에서 누르고 있던 비율 %), `releaseDown`(내리막에서 떼고 있던 비율 %), `cause`, `newBest`, `fails`(같은 섬 연속 실패 수) |
| `hint_shown` | 결과 화면 팁 표시 | `key`(어떤 팁), `where` |
| `level_reach` | 판 중에 섬 도착 | `island`, `first`(처음 도착?) |
| `island_clear` | 섬을 건너감 | `island` |
| `record_passed` | 판 중에 최고 기록 통과 | `distance` |
| `fever` | 눈꽃 질주 발동 | `island` |
| `currency_earn` | 물고기 획득 | `source`(run/rack/streak/mission/mission_bonus/goal/today), `amount` |
| `currency_spend` | 물고기 사용 | `sink`(upgrade/building), `item`, `level`, `amount` |
| `upgrade_purchase` | 강화 구매 | `key`, `level`, `cost` |
| `building_built` | 마을 건물 완성 | `id`, `cost` |
| `egg_hatched` | 아기 펭귄 부화 | `id` |
| `feature_unlock` | 기능이 열림 | `feature` |
| `streak_claim` | 출석 선물 받음 | `day`, `streak` |
| `mission_complete` | 오늘의 할 일 완료 | `type` |
| `goal_complete` | 섬 목표 달성 | `island`, `goal` |
| `today_start` / `today_clear` | 오늘의 섬 도전 / 통과 | `mod`, `tier` |
| `settings_change` | 설정 변경 | `key`, `value` |
| `perf_sample` | 판 진행 중 60초마다 | `fps`, `q`(그래픽 품질), `dpr` |

## 2. 첫날 깔때기 (대시보드 기본 화면)

`first_open` → `tutorial_complete` → 첫 `run_end` → 첫 `upgrade_purchase` → `level_reach{island:1}`(섬 2 도착) → 첫 `building_built` → 5판 이상 → 다음 날 `session_start{day:2}`

| 단계 | 기대치(시뮬레이터 기준 설계값) | 이 값보다 낮으면 의심할 곳 |
|---|---|---|
| 안내 완료 / 첫 실행 | 90% 이상 | 첫 화면 로딩, 첫 터치가 무엇인지 모름 |
| 첫 판 길이(`run_end.time`, run=1) | 중앙값 25초 이상 | 너무 빨리 잡힘 → 눈보라 예열·첫 섬 난이도 |
| 첫 강화 / 첫 판 끝 | 70% 이상(첫 판 물고기 ≥ 20) | 결과 화면의 [강화] 안내가 안 보임 |
| 섬 2 도착 / 첫 세션 | 60% 이상(시뮬레이터: 첫 섬 통과율 초보 88%) | 첫 섬이 너무 어려움 |
| 첫 세션 판 수 | 중앙값 5판 이상 | 판이 끝난 뒤 다시 하기까지의 마찰 |
| D1 | 목표 40% | 아래 3절로 원인 분류 |

## 3. 이탈 진단 기준 — "왜 안 돌아왔나"

첫날 마지막 `run_end` 몇 개와 세션 기록으로 이탈한 사람을 다음처럼 나눕니다. 한 사람이 여러 유형에 걸리면 위에 있는 것을 우선합니다.

1. **조작을 못 알아챔** — 판 3개 이하, 마지막 판들에서 `pressUp` ≥ 45% 또는 `releaseDown` ≥ 50%, `perfects` 0~1.
   → 첫 판 안내/손가락 힌트, 결과 화면 팁(`tip.pressUp`, `tip.releaseDown`)이 실제로 보였는지(`hint_shown`) 확인.
2. **같은 섬에서 막힘** — `fails` ≥ 3인 상태로 이탈, 같은 `island`에서 `progress`가 오르지 않음.
   → 도움 장치(`run_start.assist` > 0)가 켜졌는데도 이탈했다면 해당 섬 난이도·눈보라 속도를 낮출 후보. 섬별 실패 분포를 `island`로 나눠 확인.
3. **물고기가 모자람(경제 벽)** — 마지막 3판 동안 `upgrade_purchase`도 `building_built`도 없고, 남은 물고기 < 가장 싼 강화·건물 가격.
   → `currency_earn{source:run}` 판당 평균과 다음 가격 비교. 강화 비용 곡선/섬 보너스 조정 후보.
4. **할 게 없다고 느낌(지루함)** — 판 수 15 이상인데 마지막 5판에 `level_reach{first:true}`, `newBest`, 구매가 모두 없음.
   → 새 섬 간격, 섬 목표(`goal_complete`), 오늘의 할 일 완료율 확인.
5. **기술 문제** — `perf_sample.fps` 중앙값 < 40, 또는 `session_end.seconds` < 20인데 `run_start`가 없음(첫 화면에서 떠남).
   → 기기·품질 설정별 fps, 로딩 시간.
6. **분류 안 됨** — 위에 해당하지 않음. 플레이 시간이 충분하고 진행도 좋았던 사람(정상적인 이탈)으로 보고, 재방문 장치(출석 선물·건조대·알 부화) 노출 여부만 확인.

## 4. 재방문 장치가 작동하는지

- 다음 날 들어온 사람 중 `streak_claim` 비율, 건조대 수거(`currency_earn{source:rack}`) 비율, 부화(`egg_hatched`)를 본 비율.
- 둘째 날 첫 판까지 걸린 시간(`session_start` → `run_start`): 팝업이 판을 막지 않는지(목표: 중앙값 10초 이내).

## 5. 확인 방법(개발 중)

개발 빌드(`out/dev/index.html`)의 DEV 패널 → **Analytics log**에서 최근 이벤트와 값을 바로 볼 수 있습니다. 진행 속도 기대치는 `node tools/run-sim.mjs 70 6`(가상 플레이어 시뮬레이션)으로 다시 계산할 수 있습니다.

※ 위 기대치는 봇·시뮬레이터로 만든 설계값입니다. 실제 사람 데이터로 검증된 값이 아닙니다.
