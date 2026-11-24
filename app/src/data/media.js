// 현장 실무 시나리오에서 쓰는 학습용 미디어(이미지·도식·영상) 등록부.
// FAB·PKG 시나리오가 같은 구조를 씁니다. 미디어가 없어도 시나리오는 그대로 진행됩니다.
//
// 필드
//   mediaId            고유 id
//   scenarioId         특정 시나리오 전용이면 그 id, 공정 공용이면 null
//   processCategory    'FAB' | 'PKG'
//   process            공정 id (data/processes.js)
//   stages             보여 줄 단계 번호(1~6) — 시나리오 steps 순서
//   mediaType          'diagram'(교육용 도식 컴포넌트) | 'photo'(이미지 파일) | 'equipment'(장비 입체 도식) | 'movie'(공정 애니메이션 화면으로 연결)
//   component          diagram일 때 components/field/SceneVisuals.jsx의 그림 이름
//   assetPath          photo일 때 public/ 아래 경로
//   title, description, alt
//   hotspots           클릭할 수 있는 부위 id (data/equipment 모듈 id와 같음)
//   relatedDataIds     관련 데이터 항목 id — 이 데이터를 확인하면 관련 부위를 강조합니다
//   revealAfter        이 데이터 중 하나를 확인하기 전에는 보여 주지 않습니다(정답 미리 노출 방지)
//   source, license, validationStatus('unreviewed'|'reviewed'), isEducationalIllustration
//
// 실제 장비 사진은 출처·라이선스를 확인한 것만 씁니다(data/processes.js의 photo). 확인한 사진이 없으면 교육용 도식만 씁니다.

import { processes } from './processes.js'

export const MEDIA = [
  {
    mediaId: 'test-cell',
    scenarioId: null,
    processCategory: 'PKG',
    process: 'test',
    stages: [1, 2, 3, 4, 5],
    mediaType: 'diagram',
    component: 'TestCellDiagram',
    title: '파이널 테스트 셀 구성 (관계 개념도)',
    description: '테스터(ATE)가 프로그램대로 신호를 만들고, 핸들러가 패키지(DUT)를 소켓에 넣고 빼며, 결과에 따라 Bin으로 나누는 관계를 보여 줍니다. 장비의 실제 배치·모양이 아니라 신호와 패키지가 오가는 관계만 그렸습니다.',
    alt: '테스트 셀 개념도: ATE 본체와 테스트 헤드, 핸들러의 입력부·온도 챔버·픽앤플레이스 암, 여러 사이트의 소켓, 분류(Bin) 사이의 관계',
    hotspots: ['ate', 'head', 'socket', 'arm', 'soak', 'input', 'sort'],
    relatedDataIds: { site: ['socket'], swap: ['socket', 'head'], socketlog: ['socket'], program: ['ate'], calib: ['ate'], temp: ['soak'], bins: ['sort'], retest: ['socket'] },
    source: '부위 설명: data/equipment/test.js (장비사 공개 자료, 설명 출처). 테스트 헤드와 핸들러의 정확한 배치는 출처로 확인하지 못해 관계만 그렸습니다.',
    license: '자체 제작',
    validationStatus: 'unreviewed',
    isEducationalIllustration: true,
  },
  {
    mediaId: 'socket-contact',
    scenarioId: 'PKG-004',
    processCategory: 'PKG',
    process: 'test',
    stages: [3, 4, 5, 6],
    mediaType: 'diagram',
    component: 'SocketContactFigure',
    title: '소켓 접점: 깨끗한 상태와 찌꺼기·마모가 생긴 상태 (원리 도식)',
    description: '반복 삽입으로 접점에 찌꺼기가 생기고 표면이 닳으면 접촉 저항이 올라 재검사가 늘어날 수 있다는 설명을 그림으로 나타냈습니다. 실제 소켓 구조·치수가 아닙니다.',
    alt: '두 개의 소켓 핀 비교. 왼쪽은 깨끗한 핀이 패키지 단자와 넓게 닿고, 오른쪽은 끝에 찌꺼기가 쌓이고 닳아 접촉 면이 좁다',
    hotspots: [],
    revealAfter: ['socketlog', 'swap'],
    source: 'Semiconductor Engineering "Digging Much Deeper With Unit Retest"(설명 출처)의 반복 삽입·찌꺼기·접점 마모·접촉 저항 설명을 그림으로 옮김',
    cite: ['semieng-unit-retest'],
    license: '자체 제작',
    validationStatus: 'unreviewed',
    isEducationalIllustration: true,
  },
]

// 공정 설명에 이미 등록된 실제 사진(출처·라이선스 확인)을 시나리오 미디어로도 씁니다.
function processPhoto(process) {
  const p = processes.find((x) => x.id === process)?.photo
  if (!p?.src) return null
  return {
    mediaId: `photo-${process}`,
    scenarioId: null,
    process,
    stages: [1],
    mediaType: 'photo',
    assetPath: p.src,
    title: p.title,
    description: '공정 설명 화면과 같은 참고 사진입니다. 시나리오 속 설비 사진이 아닙니다.',
    alt: p.title,
    source: `${p.author} · Wikimedia Commons`,
    url: p.url,
    license: p.license,
    validationStatus: 'reviewed',
    isEducationalIllustration: false,
  }
}

// 이 시나리오의 이 단계에서 보여 줄 미디어. 아직 확인하지 않은 데이터에 묶인 미디어는 숨깁니다.
export function mediaFor(c, stage, viewed = []) {
  const list = MEDIA.filter((m) => (m.scenarioId === c.id || (!m.scenarioId && m.process === c.process)) && (!stage || m.stages.includes(stage)))
  const photo = processPhoto(c.process)
  if (photo && (!stage || photo.stages.includes(stage))) list.push(photo)
  return list.filter((m) => !m.revealAfter || m.revealAfter.some((id) => viewed.includes(id)))
}

// 확인한 데이터에 따라 강조할 부위
export function highlightedParts(media, viewed = []) {
  const map = media.relatedDataIds ?? {}
  return [...new Set(viewed.flatMap((id) => map[id] ?? []))]
}
