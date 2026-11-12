// 패키지 선택 화면 데이터. PRD "패키지 선택 데이터 초안" 기준이며 모두 검수 전입니다.
// name과 substrate는 { en, ko } 용어 쌍입니다.
// flow가 null인 패키지는 첫 버전에서 설명만 제공합니다.
// flow는 후공정 순서만 적습니다. 전공정(frontFlow)은 모든 패키지가 같아 따로 둡니다. 전체 순서가 필요하면 fullFlow를 씁니다(검수표).

import { boardFlow, designFlow, frontFlow, linkFlow, midFlow } from './processes.js'

export const packages = [
  {
    id: 'qfn',
    name: { en: 'QFN', ko: 'QFN' },
    substrate: { en: 'Lead Frame', ko: '리드프레임' },
    strengths: ['작고 얇음', '저렴함', '바닥 노출 패드로 열 방출이 좋음'],
    uses: ['전원 관리 IC', 'MCU', '자동차·IoT 부품'],
    flowNote: '몰딩 뒤 패키지 쏘잉(싱귤레이션)으로 개별 패키지를 만듭니다.',
    flow: [
      'backgrind',
      'wafer-saw',
      'die-attach',
      'wire-bond',
      'molding',
      'marking',
      'package-saw',
      'test',
    ],
    reviewed: false,
    sources: [],
  },
  {
    id: 'bga',
    name: { en: 'BGA', ko: 'BGA' },
    substrate: { en: 'Organic Substrate', ko: '유기 기판' },
    strengths: ['입출력 단자가 많음', '전기적 특성이 좋음'],
    uses: ['CPU·GPU', '메모리', '칩셋'],
    flowNote: '몰딩 뒤 기판 아래에 솔더볼을 붙입니다.',
    flow: null,
    reviewed: false,
    sources: [],
  },
  {
    id: 'flipchip',
    name: { en: 'Flip Chip', ko: '플립칩' },
    substrate: { en: 'Organic Substrate (FC-BGA)', ko: '유기 기판 (FC-BGA)' },
    strengths: ['연결 길이가 짧아 고속·고성능', '열 방출에 유리'],
    uses: ['고성능 프로세서', '서버·AI 칩'],
    flowNote: '와이어 본딩 대신 범핑, 플립칩 본딩, 언더필을 합니다.',
    flow: null,
    reviewed: false,
    sources: [],
  },
  {
    id: 'wlcsp',
    name: { en: 'WLCSP', ko: 'WLCSP' },
    substrate: { en: 'No Substrate (Wafer Level)', ko: '기판 없음 (웨이퍼 그대로)' },
    strengths: ['칩 크기와 거의 같은 가장 작은 패키지'],
    uses: ['스마트폰·웨어러블의 PMIC', '센서'],
    flowNote: '웨이퍼 상태에서 재배선·범핑을 한 뒤 쏘잉합니다.',
    flow: null,
    reviewed: false,
    sources: [],
  },
  {
    id: 'fanout',
    name: { en: 'Fan-Out', ko: '팬아웃' },
    substrate: { en: 'No Substrate (RDL)', ko: '기판 없음 (재배선층)' },
    strengths: ['기판 없이 얇음', '칩 바깥까지 단자를 넓힐 수 있음'],
    uses: ['모바일 AP'],
    flowNote: '다이를 재배치해 몰딩한 뒤 재배선층을 만듭니다.',
    flow: null,
    reviewed: false,
    sources: [],
  },
]

export function findPackage(id) {
  return packages.find((pkg) => pkg.id === id)
}

// 전공정 + 후공정 전체 순서. 후공정 흐름이 없는 패키지는 null입니다.
export function fullFlow(pkg) {
  return pkg?.flow ? [...frontFlow, ...pkg.flow] : null
}

// 흐름이 있는 패키지를 고르지 않았을 때 후공정 흐름으로 보여줄 패키지
export const DEFAULT_PACKAGE_ID = 'qfn'

export function backFlowPackage(pkg) {
  return pkg?.flow ? pkg : findPackage(DEFAULT_PACKAGE_ID)
}

// 전체 학습 순서: 칩 설계 → 전공정 → 팹 아웃·웨이퍼 출하/입고 → 웨이퍼 레벨 패키징 → 후공정 → 보드 실장. 사이사이 반복 공정은 넣지 않습니다.
export function wholeFlow(pkg) {
  return [...designFlow, ...frontFlow, ...linkFlow, ...midFlow, ...backFlowPackage(pkg).flow, ...boardFlow]
}
