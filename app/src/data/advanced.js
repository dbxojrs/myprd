// Advanced Package 데이터. PRD "Advanced Package 데이터 초안" 기준이며 모두 검수 전입니다.
// basics: 먼저 볼 기본 학습 항목. type은 process | package | advanced 중 하나입니다.
// name, processes는 { en, ko } 용어 쌍이고, future는 futureTech의 id 목록입니다.
// sourceDate: 출처를 확인한 날짜(YYYY-MM-DD). 출처가 없으면 null입니다.

export const whyAdvanced = [
  '트랜지스터를 더 작게 만들어 성능을 올리는 방식(무어의 법칙)이 점점 어렵고 비싸지고 있습니다.',
  '그래서 칩 여러 개를 하나의 패키지 안에 가깝게 붙여 성능을 올리는 방식(이종 집적, 칩렛)이 중요해졌습니다.',
  'AI 가속기처럼 메모리 대역폭이 많이 필요한 칩은 GPU 옆에 HBM을 붙이는 첨단 패키지가 성능을 좌우합니다.',
  '패키징이 "칩을 보호하는 마지막 공정"에서 "성능을 만드는 공정"으로 바뀌고 있습니다.',
]

export const advancedPackages = [
  {
    id: '2.5d',
    name: { en: '2.5D Silicon Interposer', ko: '2.5D 실리콘 인터포저' },
    processes: [
      { en: 'Interposer Fabrication', ko: '인터포저 제작' },
      { en: 'TSV', ko: '실리콘 관통 전극' },
      { en: 'Micro Bump', ko: '마이크로 범프' },
      { en: 'Chip-on-Wafer Bonding', ko: '칩 온 웨이퍼 본딩' },
      { en: 'Underfill', ko: '언더필' },
    ],
    why: '칩 여러 개를 아주 촘촘한 배선으로 나란히 연결합니다.',
    uses: ['AI 가속기', 'GPU + HBM'],
    future: ['large-interposer', 'glass'],
    basics: [
      { type: 'process', id: 'flipchip-bond' },
      { type: 'process', id: 'underfill' },
    ],
    reviewed: false,
    sources: [],
    sourceDate: null,
  },
  {
    id: '3d',
    name: { en: '3D Stacking (TSV)', ko: '3D 적층' },
    processes: [
      { en: 'TSV Formation', ko: '관통 전극 형성' },
      { en: 'Wafer Thinning', ko: '웨이퍼 박화' },
      { en: 'Micro Bump', ko: '마이크로 범프' },
      { en: 'Die Stacking', ko: '칩 적층' },
    ],
    why: '칩을 위로 쌓아 면적과 연결 길이를 줄입니다.',
    uses: ['HBM 메모리'],
    future: ['hybrid-scaling', 'thermal'],
    basics: [
      { type: 'process', id: 'backgrind' },
      { type: 'process', id: 'flipchip-bond' },
    ],
    reviewed: false,
    sources: [],
    sourceDate: null,
  },
  {
    id: 'hybrid',
    name: { en: 'Hybrid Bonding', ko: '하이브리드 본딩' },
    processes: [
      { en: 'CMP', ko: '표면 평탄화' },
      { en: 'Cu-Cu Direct Bonding', ko: '구리-구리 직접 접합' },
      { en: 'Die/Wafer Alignment', ko: '다이·웨이퍼 정렬' },
    ],
    why: '범프 없이 붙여 연결 간격을 크게 줄입니다.',
    uses: ['이미지 센서', '차세대 HBM', '3D 로직'],
    future: ['hybrid-scaling'],
    basics: [
      { type: 'process', id: 'wafer-saw' },
      { type: 'process', id: 'die-attach' },
    ],
    reviewed: false,
    sources: [],
    sourceDate: null,
  },
  {
    id: 'chiplet',
    name: { en: 'Chiplet', ko: '칩렛' },
    processes: [
      { en: 'Die Partitioning', ko: '다이 분할 설계' },
      { en: 'Die-to-Die Interface (UCIe)', ko: '다이 간 인터페이스' },
      { en: '2.5D/3D Integration', ko: '2.5D·3D 집적' },
    ],
    why: '큰 칩 하나 대신 작은 칩 여러 개로 나눠 수율과 비용을 개선합니다.',
    uses: ['서버 CPU', 'AI 칩'],
    future: ['chiplet-standard'],
    basics: [{ type: 'advanced', id: '2.5d' }],
    reviewed: false,
    sources: [],
    sourceDate: null,
  },
  {
    id: 'hd-fanout',
    name: { en: 'High-Density Fan-Out', ko: '고밀도 팬아웃' },
    processes: [
      { en: 'Die Reconstitution', ko: '다이 재배치' },
      { en: 'Molding', ko: '몰딩' },
      { en: 'RDL', ko: '재배선층' },
    ],
    why: '기판 없이 얇게 만들고 단자를 넓게 배치합니다.',
    uses: ['모바일 AP'],
    future: ['panel'],
    basics: [
      { type: 'process', id: 'molding' },
      { type: 'package', id: 'wlcsp' },
    ],
    reviewed: false,
    sources: [],
    sourceDate: null,
  },
  {
    id: 'bridge',
    name: { en: 'Silicon Bridge', ko: '실리콘 브리지' },
    processes: [
      { en: 'Embedded Silicon Bridge', ko: '기판 속 실리콘 브리지 삽입' },
      { en: 'Fine-Pitch Bump', ko: '미세 범프' },
    ],
    why: '인터포저 전체 대신 필요한 부분만 고밀도로 연결합니다.',
    uses: ['서버·AI 칩'],
    future: ['glass', 'chiplet-standard'],
    basics: [
      { type: 'process', id: 'flipchip-bond' },
      { type: 'package', id: 'bga' },
    ],
    reviewed: false,
    sources: [],
    sourceDate: null,
  },
]

export const futureTech = [
  { id: 'hybrid-scaling', name: { en: 'Hybrid Bonding Scaling', ko: '하이브리드 본딩 미세화' }, problem: '범프 간격의 한계', point: '접합 간격이 줄면 연결 수가 늘어납니다.' },
  { id: 'glass', name: { en: 'Glass Core Substrate', ko: '유리 기판' }, problem: '유기 기판의 휨, 미세 배선 한계', point: '기판 재료가 성능과 크기에 주는 영향을 봅니다.' },
  { id: 'panel', name: { en: 'Panel-Level Packaging', ko: '패널 레벨 패키징' }, problem: '원형 웨이퍼의 면적 낭비, 비용', point: '사각 패널로 한 번에 더 많이 생산합니다.' },
  { id: 'cpo', name: { en: 'Co-Packaged Optics', ko: '광 연결' }, problem: '전기 신호의 전력·거리 한계', point: '칩 옆에서 빛으로 데이터를 보냅니다.' },
  { id: 'thermal', name: { en: 'Thermal Management', ko: '열 관리' }, problem: '적층과 고집적에 따른 발열', point: '패키지 설계에서 열이 제약이 되는 이유를 봅니다.' },
  { id: 'chiplet-standard', name: { en: 'Chiplet Standardization', ko: '칩렛 표준화' }, problem: '회사마다 다른 다이 간 연결 방식', point: '표준 인터페이스가 생태계를 만드는 방식을 봅니다.' },
  { id: 'large-interposer', name: { en: 'Large Interposer', ko: '인터포저 대형화' }, problem: '더 많은 칩과 HBM을 한 패키지에 넣어야 함', point: '인터포저 크기와 수율의 관계를 봅니다.' },
]

export function findAdvanced(id) {
  return advancedPackages.find((item) => item.id === id)
}
