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
import { EQUIPMENT } from './equipment/index.js'
import { VISUALS } from './visuals.js'

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
  // ── 공정별 원리 도식(교육용, 실제 치수·모양 아님). 원인을 보여 주는 도식은 관련 데이터를 확인한 뒤에만 공개합니다. ──
  {
    mediaId: 'cvd-pressure',
    scenarioId: 'FAB-001',
    processCategory: 'FAB',
    process: 'deposition',
    stages: [3, 4, 5, 6],
    mediaType: 'diagram',
    component: 'CvdPressureFigure',
    title: 'CVD 압력과 원료 전달 (원리 도식)',
    description: '압력이 높으면 기체 분자가 멀리 가지 못해 원료 전달이 느려지고, 막이 고르게 자라지 않을 수 있습니다. 가운데가 두껍고 가장자리가 얇은 모양은 이 시나리오의 가상 두께 맵을 따른 것입니다.',
    alt: '두 개의 CVD 챔버 비교. 압력이 낮으면 분자가 챔버 전체에 퍼져 막이 고르고, 압력이 높으면 분자가 가운데에 몰려 막이 가운데만 두껍다',
    hotspots: [],
    revealAfter: ['pressure'],
    source: 'MIT OCW 6.152J CVD 강의 노트(설명 출처): "High P, small λ => slow mass transport"',
    cite: ['mit-6152j-cvd'],
    license: '자체 제작',
    validationStatus: 'unreviewed',
    isEducationalIllustration: true,
  },
  {
    mediaId: 'microloading',
    scenarioId: 'FAB-002',
    processCategory: 'FAB',
    process: 'etch',
    stages: [3, 4, 5, 6],
    mediaType: 'diagram',
    component: 'MicroloadingFigure',
    title: '마이크로 로딩 (단면 원리 도식)',
    description: '마스크 없이 넓게 열린 곳이 식각제를 많이 차지하면 근처 좁은 무늬에는 식각제가 모자라 덜 깎일 수 있습니다.',
    alt: '식각 단면 도식. 오른쪽 넓게 열린 영역에 식각제가 몰려 끝까지 깎이고, 왼쪽 좁은 무늬 바닥에는 막이 남아 있다',
    hotspots: [],
    revealAfter: ['product', 'sem'],
    source: 'MIT OCW 6.152J 건식 식각 강의(설명 출처): "Micro-loading: unmasked large areas hoard etchant"',
    cite: ['mit-6152j-dry-etch'],
    license: '자체 제작',
    validationStatus: 'unreviewed',
    isEducationalIllustration: true,
  },
  {
    mediaId: 'mark-asym',
    scenarioId: 'FAB-003',
    processCategory: 'FAB',
    process: 'photo',
    stages: [3, 4, 5, 6],
    mediaType: 'diagram',
    component: 'MarkAsymFigure',
    title: '정렬 마크 대칭 · 비대칭 (원리 도식)',
    description: '앞 공정(식각·CMP)에서 마크 모양이 비대칭해지면 잰 마크 중심이 실제와 어긋나 정렬 오차가 생기고 오버레이로 이어질 수 있습니다.',
    alt: '정렬 마크 단면 비교. 대칭 마크는 잰 중심이 실제 중심과 같고, 한쪽 벽이 기운 마크는 잰 중심이 옆으로 어긋난다',
    hotspots: [],
    revealAfter: ['asym'],
    source: 'Micromachines 16(8):876 (2025), CC BY 4.0 — 마크 비대칭과 정렬 오차·오버레이의 관계',
    cite: ['oa-alignment-3d-2025'],
    license: '자체 제작',
    validationStatus: 'unreviewed',
    isEducationalIllustration: true,
  },
  {
    mediaId: 'capillary-tip',
    scenarioId: 'PKG-001',
    processCategory: 'PKG',
    process: 'wire-bond',
    stages: [3, 4, 5, 6],
    mediaType: 'diagram',
    component: 'CapillaryTipFigure',
    title: '캐필러리 팁 상태와 볼 접합 (원리 도식)',
    description: '캐필러리의 형상이 볼 모양과 Shear 강도에 영향을 줍니다. 팁에 이물이 붙은 모습은 이 시나리오의 관찰 결과(가상)를 그린 것입니다.',
    alt: '캐필러리와 볼 비교. 깨끗한 팁은 볼을 고르게 눌러 패드와 넓게 닿고, 이물이 붙은 팁은 볼이 기울어 닿는 면이 좁다',
    hotspots: [],
    revealAfter: ['capscope'],
    source: '캐필러리 형상과 볼 모양·Shear 강도(오픈액세스 논문, 2021)',
    cite: ['oa-capillary-2021'],
    license: '자체 제작',
    validationStatus: 'unreviewed',
    isEducationalIllustration: true,
  },
  {
    mediaId: 'da-void',
    scenarioId: 'PKG-002',
    processCategory: 'PKG',
    process: 'die-attach',
    stages: [1, 2, 3, 4, 5, 6],
    mediaType: 'diagram',
    component: 'DieAttachVoidFigure',
    title: '다이 접착층 보이드 (단면 원리 도식)',
    description: '보고된 증상(접착층 보이드)을 그린 그림입니다. 보이드는 열 저항을 높여 칩 온도를 올리고 접착층 균열·계면 박리에 영향을 줄 수 있으며, X-ray로 부수지 않고 찾습니다. 원인은 그리지 않았습니다.',
    alt: '다이·접착층·기판 단면 비교. 보이드가 없으면 열 화살표가 아래까지 이어지고, 접착층에 작은 빈 공간이 많으면 열 화살표가 중간에 막힌다',
    hotspots: [],
    source: 'TI 엔지니어 업계 매체 기사(설명 출처) · arXiv 조사 논문(X-ray 검출)',
    cite: ['sst-da-void-ti', 'arxiv-da-wb-defects-2022'],
    license: '자체 제작',
    validationStatus: 'unreviewed',
    isEducationalIllustration: true,
  },
  {
    mediaId: 'mold-delam',
    scenarioId: 'PKG-003',
    processCategory: 'PKG',
    process: 'molding',
    stages: [1, 2, 3, 4, 5, 6],
    mediaType: 'diagram',
    component: 'MoldDelamFigure',
    title: '다이 패드-몰드 계면 박리 (단면 원리 도식)',
    description: '보고된 증상(계면 박리)을 그린 그림입니다. 패키지가 흡수한 습기는 리플로 고온에서 증기압이 크게 올라 박리·팝콘 균열을 일으킬 수 있고, 초음파 현미경(C-SAM)으로 찾습니다. 이 시나리오의 원인은 그리지 않았습니다.',
    alt: '몰딩 패키지 단면 비교. 다이는 다이 패드 위에 붙어 있다. 정상은 다이 패드와 그 아래 몰드가 붙어 있고, 박리된 패키지는 다이 패드와 몰드 사이에 틈과 증기 표시가 있다. 위에서 초음파로 검사한다',
    hotspots: [],
    source: 'NASA NEPP MSL 보고서(2004) · NASA NEPP 게시 PEM 신뢰성 보고서(1994)',
    cite: ['nasa-nepp-msl-2004', 'nasa-nepp-pems-1994'],
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

// 공정 애니메이션(components/movie, 자막 문장마다 출처)을 시나리오 단계에 연결합니다.
// 단계별로 처음 열 장면 id. 원인을 미리 알려 주지 않도록 공정 동작을 보여 주는 장면만 고릅니다.
export const MOVIE_STAGE_SCENES = {
  test: { default: 'handler', 5: 'sort', 6: 'sort' }, // 소켓에 넣고 검사 → (조치·검증) 나누고 알리기
  'wire-bond': { default: 'ball' },
  'die-attach': { default: 'place' },
  molding: { default: 'fill' },
  deposition: { default: 'cvd' },
  etch: { default: 'dry' },
  photo: { default: 'expose' },
}
function processMovie(process, stage, processMovies = {}) {
  const movie = processMovies[process]
  const map = MOVIE_STAGE_SCENES[process]
  if (!movie || !map) return null
  const sceneId = map[stage] ?? map.default
  const scene = movie.scenes.find((x) => x.id === sceneId)
  return {
    mediaId: `movie-${process}`,
    scenarioId: null,
    process,
    stages: [1, 2, 3, 4, 5, 6],
    mediaType: 'movie',
    movieId: process,
    startScene: sceneId,
    title: movie.title,
    description: `"${scene?.title ?? ''}" 장면부터 엽니다. 자동 재생하지 않으며, 장면 이동·배속·자막·구간 반복을 쓸 수 있습니다.`,
    alt: `${movie.title} 교육용 애니메이션`,
    source: '자막 문장마다 출처 표시(공정 애니메이션 데이터)',
    license: '자체 제작',
    validationStatus: movie.reviewed ? 'reviewed' : 'unreviewed',
    isEducationalIllustration: true,
  }
}

// 시나리오 장비의 입체 도식(설비 실습과 같은 그림). 그 공정 전용 도식(예: 테스트 셀 구성도)이 있으면 그것을 씁니다.
// 관련 부위는 시나리오 데이터 항목의 parts에서 가져옵니다(확인한 데이터의 부위를 강조).
function equipmentMedia(c) {
  const kind = c.equipment?.kind
  const eq = EQUIPMENT[kind]
  if (!eq || MEDIA.some((m) => m.process === c.process && m.mediaType === 'diagram' && !m.scenarioId)) return null
  const items = Object.values(c.nodes).filter((n) => n.type === 'data').flatMap((n) => n.items)
  return {
    mediaId: `equip-${kind}`,
    scenarioId: null,
    processCategory: c.category,
    process: c.process,
    stages: [1, 2, 3, 4, 5],
    mediaType: 'equipment',
    kind,
    title: `${c.equipment.name} 구조 (장비 입체 도식)`,
    description: '부위를 누르면 장비 구조 탭에서 역할과 출처를 봅니다. 데이터를 확인하면 관련 부위가 강조됩니다. 실제 장비 모양·배치와 다를 수 있습니다.',
    alt: `${eq.kind.ko} 입체 도식: ${eq.modules.map((m) => m.name.ko).join(', ')}`,
    hotspots: eq.modules.map((m) => m.id),
    relatedDataIds: Object.fromEntries(items.filter((i) => i.parts?.length).map((i) => [i.id, i.parts])),
    source: VISUALS['equipment-iso'].source,
    license: VISUALS['equipment-iso'].license,
    validationStatus: 'unreviewed',
    isEducationalIllustration: true,
  }
}

// 이 시나리오의 이 단계에서 보여 줄 미디어. 아직 확인하지 않은 데이터에 묶인 미디어는 숨깁니다.
// movies: data/processMovies의 영상 목록(화면 쪽에서 넘김 — 이 파일은 Node 검사에서도 읽히도록 Vite 전용 import를 쓰지 않습니다)
export function mediaFor(c, stage, viewed = [], movies = {}) {
  const list = MEDIA.filter((m) => (m.scenarioId === c.id || (!m.scenarioId && m.process === c.process)) && (!stage || m.stages.includes(stage)))
  const equip = equipmentMedia(c)
  if (equip && (!stage || equip.stages.includes(stage))) list.push(equip)
  const photo = processPhoto(c.process)
  if (photo && (!stage || photo.stages.includes(stage))) list.push(photo)
  const movie = processMovie(c.process, stage, movies)
  if (movie) list.push(movie)
  return list.filter((m) => !m.revealAfter || m.revealAfter.some((id) => viewed.includes(id)))
}

// 확인한 데이터에 따라 강조할 부위
export function highlightedParts(media, viewed = []) {
  const map = media.relatedDataIds ?? {}
  return [...new Set(viewed.flatMap((id) => map[id] ?? []))]
}
