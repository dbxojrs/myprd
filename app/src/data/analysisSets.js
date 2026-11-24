// 공정 데이터 분석 실습용 데이터 묶음.
// ⚠ 모든 수치는 교육용 가상 데이터입니다. 실제 업체·장비의 관리 규격이나 수율이 아닙니다.
// 계산(관리 한계선, 이상 신호, Cp/Cpk, 누적 비율)은 lib/spc.js의 공식으로만 합니다.
// 문제(ask)의 정답도 여기 적지 않고, 같은 계산으로 앱이 구합니다(데이터를 바꿔도 정답이 어긋나지 않음).

export const SPC_SETS = [
  {
    id: 'wb-shear',
    title: '와이어 본더 2호기 Ball Shear (시간별 시료 평균)',
    unit: 'gf',
    category: 'PKG',
    caseId: 'PKG-001',
    base: 20, // 앞 20점(정상 기간)으로 한계선을 정합니다
    story: '앞 20점은 정상 기간, 그 뒤는 Capillary 교체 이후 값입니다.',
    values: [27.1, 26.4, 27.8, 26.9, 27.5, 26.2, 27.0, 27.9, 26.7, 27.3, 26.8, 27.6, 26.5, 27.2, 27.4, 26.9, 27.7, 26.6, 27.1, 27.0, 17.8, 16.2, 15.9, 16.8, 15.4, 16.5],
    ask: { kind: 'firstSignal', prompt: '관리 이탈 신호가 처음 나온 점은 몇 번째입니까?' },
    lesson: '갑자기 크게 떨어지면 3σ 밖 규칙에 바로 걸립니다. 그 시점에 바뀐 것(교체 작업)부터 찾습니다.',
  },
  {
    id: 'cvd-drift',
    title: 'CVD 챔버 B 막 두께 (LOT별 평균)',
    unit: 'nm',
    category: 'FAB',
    caseId: 'FAB-001',
    base: 20,
    story: '앞 20점은 정상 기간, 그 뒤는 배기 계통 PM 이후 LOT입니다. 한계선 밖으로 나간 점은 없습니다.',
    values: [100.4, 99.6, 100.9, 99.2, 100.1, 99.8, 100.6, 99.5, 100.3, 99.9, 100.7, 99.4, 100.2, 100.5, 99.7, 100.0, 99.3, 100.8, 99.9, 100.2, 100.9, 101.3, 100.6, 101.1, 101.4, 100.8, 101.2, 101.0, 101.6, 101.3],
    ask: { kind: 'firstSignal', prompt: '한계선 밖 점이 없어도 이상 신호가 있습니다. 처음 나온 점은 몇 번째입니까?' },
    lesson: '조금씩 옮겨 간 평균은 3σ 규칙만으로는 늦게 잡힙니다. 1σ·2σ 묶음 규칙과 "한쪽 연속" 규칙이 더 먼저 알려 줍니다.',
  },
  {
    id: 'ft-lot-yield',
    title: 'Final Test LOT별 수율',
    unit: '%',
    category: 'PKG',
    caseId: 'PKG-004',
    base: 15,
    story: '앞 15 LOT은 평소 기간, 마지막 2 LOT은 수율이 떨어졌다고 보고된 LOT입니다.',
    values: [97.8, 98.1, 97.5, 98.3, 97.9, 97.6, 98.2, 98.0, 97.7, 98.4, 97.9, 98.1, 97.6, 98.0, 97.8, 94.2, 93.8],
    ask: { kind: 'firstSignal', prompt: '관리 이탈 신호가 처음 나온 LOT은 몇 번째입니까?' },
    lesson: '수율 관리도는 "언제부터" 나빠졌는지 알려 줄 뿐, 제품 불량인지 테스트 환경 문제인지는 알려 주지 않습니다. 사이트·소켓별로 나눠 봐야 합니다.',
  },
]

// PM 이전 막 두께(가상). PM 이후는 같은 흩어짐에 평균만 1.2 nm 옮겨 간 값으로 만듭니다(비교 학습용).
const CVD_BEFORE = [100.4, 99.6, 100.9, 99.2, 100.1, 99.8, 100.6, 99.5, 100.3, 99.9, 100.7, 99.4, 100.2, 100.5, 99.7, 100.0, 99.3, 100.8, 99.9, 100.2, 100.1, 99.8, 100.3, 99.6, 100.4]

export const CAPABILITY_SETS = [
  {
    id: 'cvd-before',
    title: 'CVD 막 두께 — 배기 PM 이전',
    unit: 'nm',
    category: 'FAB',
    caseId: 'FAB-001',
    lsl: 98,
    usl: 102,
    values: CVD_BEFORE,
  },
  {
    id: 'cvd-after',
    title: 'CVD 막 두께 — 배기 PM 이후',
    unit: 'nm',
    category: 'FAB',
    caseId: 'FAB-001',
    lsl: 98,
    usl: 102,
    values: CVD_BEFORE.map((v) => Math.round((v + 1.2) * 10) / 10),
  },
  {
    id: 'shear-lsl',
    title: 'Ball Shear — 한쪽 규격(하한만)',
    unit: 'gf',
    category: 'PKG',
    caseId: 'PKG-001',
    lsl: 18,
    usl: null,
    values: [27.1, 26.4, 27.8, 26.9, 27.5, 26.2, 27.0, 27.9, 26.7, 27.3, 26.8, 27.6, 26.5, 27.2, 27.4, 26.9, 27.7, 26.6, 27.1, 27.0, 25.9, 28.1, 26.3, 27.4, 26.8],
  },
]

// 같은 규격·같은 Cp인데 평균만 옮겨 간 두 묶음을 비교하는 문제
export const CAPABILITY_ASK = {
  prompt: 'PM 이전과 이후를 비교하면 맞는 설명은?',
  pair: ['cvd-before', 'cvd-after'],
  choices: [
    '흩어짐(Cp)은 비슷한데 평균이 규격 가운데에서 벗어나 Cpk가 크게 떨어졌다',
    '흩어짐이 크게 늘어 Cp와 Cpk가 함께 떨어졌다',
    '규격 밖 시료가 없으므로 공정능력은 그대로다',
    'Cpk가 올라가 공정이 더 좋아졌다',
  ],
  answer: 0, // 앱이 Cp·Cpk를 다시 계산해 이 설명이 맞는지 확인합니다(scripts/check-content.mjs)
  explain: 'Cp는 규격 폭과 흩어짐만 보고, Cpk는 평균이 규격 가운데서 얼마나 벗어났는지까지 봅니다. 평균만 옮겨 가면 Cp는 그대로인데 Cpk가 떨어집니다(NIST 6.1.6 공식).',
}

export const PARETO_SETS = [
  {
    id: 'etch-defects',
    title: 'Etch 후 검사 불량 유형 (1주)',
    unit: '건',
    category: 'FAB',
    caseId: 'FAB-002',
    counts: { '잔류물': 46, '파티클': 18, '패턴 브리지': 9, '스크래치': 7, '언더컷': 4, '기타': 3 },
    ask: { kind: 'top', prompt: '가장 먼저 줄여야 할 불량 유형은?' },
    lesson: '많은 순서로 정렬하면 개선 효과가 큰 항목부터 고를 수 있습니다. 단, 건수가 많다고 늘 가장 심각한 것은 아니므로 영향(고객·신뢰성)도 함께 봅니다.',
  },
  {
    id: 'ft-bins',
    title: 'Final Test 불량 Bin (수율이 떨어진 2 LOT)',
    unit: '개',
    category: 'PKG',
    caseId: 'PKG-004',
    counts: { '접촉 불량 (Open/Short)': 128, '누설 전류': 21, '기능 불량': 17, '속도 불량': 9, '기타': 5 },
    ask: { kind: 'cover', target: 70, prompt: '위에서부터 몇 개 항목을 합해야 전체의 70% 이상이 됩니까?' },
    lesson: '접촉(Open/Short) 불량이 대부분이면 칩보다 소켓·접촉 쪽을 먼저 의심해 볼 근거가 됩니다. 사이트·소켓별로 나눠 확인합니다.',
  },
  {
    id: 'pkg-line',
    title: 'PKG 라인 외관 불량 (1개월)',
    unit: '건',
    category: 'PKG',
    caseId: null,
    counts: { '와이어 쓸림': 31, '몰딩 보이드': 24, '다이 칩핑': 15, '마킹 불량': 8, '리드 휨': 6, '기타': 4 },
    ask: { kind: 'cover', target: 60, prompt: '위에서부터 몇 개 항목을 합해야 전체의 60% 이상이 됩니까?' },
    lesson: '상위 몇 개 항목이 대부분을 차지하는지 보면 개선 순서를 정하기 쉽습니다.',
  },
]
