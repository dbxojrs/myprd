// 장비 라인 연결 실습 규칙표. 모두 검수 전입니다.
//
// LINES: 이어서 돌릴 장비 순서. 아직 없는 장비 id는 화면에서 건너뜁니다.
// handoffs: 앞 장비(from)의 조건(when.values: { 키: [단계] })이나 결과 제목(when.titles: [포함할 말])이 맞으면
//   sets: 뒤 장비(to)에 들어올 때의 상태를 바꿉니다(그 장비의 conditions 키).
//   final: 끝까지 남아 최종 판정에 더해지는 영향 { grade: 'warn' | 'bad', text }.
//   note: 화면에 보여줄 연결 설명. basis: 근거(lineSim.js 연결 규칙, 공정 데이터, 장비 규칙 출처 등).

export const LINES = [
  {
    id: 'front',
    name: '전공정 라인',
    desc: '산화 → 포토 → 식각 → 증착 → 이온 주입 → 금속 배선 장비를 이어서 돌립니다.',
    machines: ['oxidation', 'photo', 'etch', 'deposition', 'ion-implant', 'metallization'],
  },
  {
    id: 'back',
    name: '후공정 라인 (QFN)',
    desc: '백그라인딩부터 최종 테스트까지 QFN 후공정 장비를 이어서 돌립니다.',
    machines: ['backgrind', 'wafer-saw', 'die-attach', 'wire-bond', 'molding', 'marking', 'package-saw', 'test'],
  },
]

export const handoffs = [
  {
    from: 'wafer-saw',
    when: { titles: ['칩핑', '깨짐'] },
    final: { grade: 'warn', text: '다이 모서리의 깨진 자국이 온도 변화를 겪으며 균열로 커질 수 있습니다.' },
    note: '웨이퍼 쏘잉의 칩핑 → 완성 패키지의 다이 균열 위험',
    basis: '라인 실습 규칙표(lineSim.js) 이송 속도 "빠르게"의 effect',
  },
  {
    from: 'wire-bond',
    when: { titles: ['크레이터링', '패드가 깨짐'] },
    final: { grade: 'warn', text: '패드 아래 균열이 사용 중 커져 나중에 연결이 끊길 수 있습니다.' },
    note: '와이어 본딩의 패드 아래 손상 → 출하 뒤 연결 끊김 위험',
    basis: '라인 실습 규칙표(lineSim.js) 초음파 출력·하중 "강하게"의 effect',
  },
]
