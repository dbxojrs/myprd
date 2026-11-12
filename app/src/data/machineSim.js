// 고급 장비 시뮬레이터 규칙표. 판정은 이 표로만 계산합니다(AI·무작위 값 없음). 모두 검수 전입니다.
//
// conditions: 작업물·장비 상태(로트, 블레이드 상태 등). 상황 실습에서는 상황이 정하고, 자유 조작에서는 직접 고릅니다.
// controls: 작업자가 조작반에서 바꾸는 조건.
// 단계(levels)마다 세 가지 값 표시를 둡니다.
//   example: 단계형 + 예시 숫자 모드의 숫자. 출처 없는 예시값입니다.
//   sourced: 출처 숫자만 모드의 숫자. { value, src, cite } — src는 SOURCES 키, cite는 문서 안 위치입니다. 없으면 출처 숫자가 없는 단계입니다.
//   pct: 0~100% 상대값 모드의 숫자(장비 조정 범위 안에서의 상대 위치, 교육용).
// best: 권장 단계 번호.
// actions: 조작반 버튼. needs 상태일 때만 누를 수 있고, 누르면 sets로 상태를 바꿉니다.
// rules: when의 모든 키가 맞으면 해당합니다. when 값은 해당하는 단계 번호 목록입니다.
//   severity: alarm(장비가 at 단계에서 멈춤) | bad(불량) | warn(경고·신뢰성 위험)
//   src·cite가 있으면 그 문서에 근거한 규칙이고, 없으면 공정 데이터(processes.js)나 교육용 가설에 근거합니다(basis).
// metrics: 상대 지표(0~100, 교육용). 단계마다 더할 값을 적고, 합을 0~100으로 자릅니다. 알람으로 멈추면 처리 속도는 0입니다.
// sequence: 가동 순서. {키}는 그 조건의 현재 표시값으로 바뀝니다.
// stage: 공정 단계(processes.js의 stage). sources: 이 장비 규칙에서 쓰는 출처 { 키: { title, publisher, url } }.
// 장비 하나는 data/machines/<이름>.js 파일 하나이고, data/machines/index.js에 공정 순서대로 등록합니다.
// scenarios: 상황 실습. preset으로 상태를 정하고, goal을 만족하면 성공입니다.
//   goal.maxGrade: 허용하는 가장 나쁜 판정(good | warn), goal.metric: 넘어야 하는 지표 최소값.

import machineList from './machines/index.js'

export const SEVERITY = {
  alarm: { label: '알람 정지', rank: 3 },
  bad: { label: '불량', rank: 2 },
  warn: { label: '경고', rank: 1 },
  good: { label: '정상', rank: 0 },
}

export const DISPLAY_MODES = [
  { id: 'example', label: '단계 + 예시 숫자', note: '숫자는 이해를 돕는 예시값입니다. 📖 표시가 있는 숫자만 출처가 있습니다.' },
  { id: 'sourced', label: '출처 숫자만', note: '출처 문서에 적힌 숫자만 보여줍니다. 출처가 없는 단계는 이름만 보입니다.' },
  { id: 'relative', label: '0~100% 상대값', note: '장비 조정 범위 안에서의 상대 위치입니다(교육용).' },
]

export const machines = machineList

// 모든 장비의 출처를 한곳에 모읍니다. 키가 겹치면 같은 문서여야 합니다.
export const SOURCES = Object.assign({}, ...machines.map((machine) => machine.sources))

export function findMachine(id) {
  return machines.find((machine) => machine.id === id)
}
