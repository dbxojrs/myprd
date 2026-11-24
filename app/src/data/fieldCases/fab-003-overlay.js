// FAB-003: Photolithography Overlay 불량 (분기형 현장 실무 시나리오)
// ⚠ 모든 사건·수치·로그는 교육용 가상 데이터입니다. 실제 업체·장비의 규격이나 사양이 아닙니다.
// 원인·대응 설명의 근거(2026-11-24 원문 확인, data/sourceCatalog.js):
//   - 정렬 마크 비대칭은 주로 앞 공정(식각·CMP)에서 생기고, 정렬 오차가 오버레이로 이어짐. 웨이퍼 가장자리의 식각 유발 마크 형상
//     불균일이 주원인이었던 사례, 정렬 전략·마크 설계·공정 모니터링 최적화 → oa-alignment-3d-2025
//   - 오버레이에 영향을 주는 요인(마스크 휨·열, 웨이퍼 변형, 렌즈 왜곡, 스테이지) → oa-overlay-hoc-2025
//   - 레티클 가열 누적 → 여러 웨이퍼에 걸쳐 점점 나빠짐 → oa-litho-thermal-2025
//   - 마크를 180° 돌려 재측정해 TIS(장비 유발 오차)를 줄임 → oa-overlay-dbo-2025
//   - 포토는 되돌릴 수 있음(감광액 제거 후 재작업), 식각·증착 뒤에는 대개 늦음 → epfl-cmi-rework
//   - 오버레이 정의·정렬 마크·샘플링 측정 → hynix-fe-3 (앱의 포토 설명)
// 이상 LOT의 측정값을 모든 LOT 보정값에 그대로 넣었을 때의 결과는 교육용 가정입니다(출처로 확인한 결과 아님).

export default {
  id: 'FAB-003',
  category: 'FAB',
  processLabel: 'Photolithography',
  process: 'photo',
  machine: 'photo',
  difficulty: '고급',
  title: 'Photolithography Overlay 불량',
  subtitle: '노광기 S2에서 일부 LOT만 오버레이 한계 초과 — 같은 노광기의 다른 LOT은 정상',
  equipment: { name: '노광기 S2 + 트랙', kind: 'photo', diagram: 'iso' },
  competencies: ['재작업 가능 시점 판단', '계측 신뢰성(TIS)', 'LOT 이력으로 앞 공정 추적', '보정값 오염 피하기'],
  version: '1.0',
  reviewed: false,
  updated: '2026-11-24',
  minutes: 30,
  roles: ['공정기술(포토)', '계측', '앞 공정(식각) 협업'],
  goals: [
    '식각 전이라면 재작업할 수 있다는 점을 알고, 이상 LOT이 식각으로 넘어가지 않게 막는다.',
    '샘플 측정 결과를 믿기 전에 계측(TIS)부터 확인하고, 영향 웨이퍼 범위를 넓혀 잰다.',
    '노광기 하나의 문제인지, 특정 앞 공정을 거친 LOT의 문제인지 LOT 이력으로 가른다.',
    '이상 LOT의 측정값으로 노광기 보정값을 함부로 바꾸지 않는다.',
  ],
  assumptions: [
    '모든 수치(오버레이 nm, 관리 한계, 시간, 수량)는 교육용으로 만든 가상 데이터입니다. 실제 공정 규격이 아닙니다.',
    '오버레이 판정은 "한계값 초과 여부"로 단순화했습니다. 실제로는 방향(X/Y)·성분별로 나눠 봅니다.',
    '"정렬 마크 비대칭 지표"는 마크 상태를 보여 주는 값을 단순화한 가상 지표입니다.',
    '이상 LOT의 측정값을 모든 LOT 보정에 넣었을 때 정상 LOT이 어긋나는 결과는 교육용 가정입니다.',
    '원인·대응 설명은 오픈액세스 논문과 대학 클린룸 자료를 근거로 하며 전문가 검수 전입니다.',
  ],
  sources: ['oa-alignment-3d-2025', 'oa-overlay-hoc-2025', 'oa-litho-thermal-2025', 'oa-overlay-dbo-2025', 'epfl-cmi-rework', 'hynix-fe-3'],
  related: [
    { kind: 'process', id: 'photo', label: '포토 공정 설명' },
    { kind: 'machine', id: 'photo', label: '포토 설비 실습' },
  ],
  timeLimit: 180,
  timeRule: { cat: 'contain', penalty: 5, text: '목표 시간(가상 180분) 안에 재작업 방향을 정하지 못해, Hold LOT의 식각 대기와 납기 부담이 커졌습니다.' },
  checks: [
    { q: '위험한 조치(이상 LOT 식각 진행, 이상값으로 보정값 일괄 변경)를 피했는가?', rule: { notPicked: ['contain.etchgo', 'contain.offsetnow', 'action.offset', 'action.etch_go', 'recover.more'] } },
    { q: '영향 범위(이상 LOT)를 식각 전에 격리했는가?', rule: { picked: ['contain.hold'] } },
    { q: '계측 결과의 신뢰성(TIS)을 검토했는가?', rule: { viewedAny: ['tis'] } },
    { q: '근거 데이터 없이 원인을 확정하지 않았는가?', rule: { evidenceMin: 2 } },
    { q: '재작업 결과와 식각 뒤 결과까지 충분히 검증했는가?', rule: { picked: ['verify.multi', 'verify.aei'], notPicked: ['verify.once'] } },
  ],
  similar: ['FAB-002', 'FAB-001'],

  rubric: [
    { id: 'contain', label: '긴급 대응', points: 20, desc: '식각 전 격리, 측정 범위 확대, 정보 공유' },
    { id: 'know', label: '공정 지식', points: 15, desc: '재작업 가능 시점, 마크 비대칭의 출처를 아는가' },
    { id: 'data', label: '데이터 분석', points: 20, desc: '계측·LOT 이력·마크 상태로 원인을 가렸는가' },
    { id: 'cause', label: '원인 분석', points: 15, desc: '가설과 근거 데이터가 맞는가' },
    { id: 'fix', label: '개선 조치', points: 15, desc: '재작업 + 정렬 전략 검토 + 앞 공정 협업' },
    { id: 'verify', label: '재발 방지', points: 15, desc: '재작업·식각 뒤 확인과 앞 공정 모니터링' },
  ],

  start: 'brief',
  nodes: {
    brief: {
      type: 'brief',
      step: 1,
      title: '현장 상황 전달',
      goal: '무슨 일이 일어났는지 파악합니다.',
      who: '계측 담당자 (오전 11:00)',
      report:
        '"엔지니어님, M2 층 현상 후 오버레이 샘플 측정에서 몇몇 LOT이 관리 한계를 넘었습니다. 모두 노광기 S2에서 진행했는데, 같은 S2에서 한 다른 LOT은 괜찮습니다."',
      status: [
        { label: '노광기 S2', value: '가동 중', tone: 'warn' },
        { label: '이상 LOT', value: '식각 대기 중', tone: 'warn' },
        { label: '설비 알람', value: '없음', tone: 'info' },
      ],
      table: {
        virtual: true,
        cols: ['확인 항목', '정상 LOT', '이상 LOT'],
        rows: [
          ['오버레이 (샘플 웨이퍼 평균)', '3.1 nm', '7.8 nm ⚠'],
          ['관리 한계(가상)', '6 nm', '6 nm'],
          ['노광기 · Recipe', 'S2 · 같음', 'S2 · 같음'],
          ['측정한 웨이퍼', 'LOT당 2장(샘플)', 'LOT당 2장(샘플)'],
        ],
      },
      facts: ['이상 LOT은 현상까지 끝났고 아직 식각 전입니다(식각 대기 줄에 있음).', '오버레이는 모든 웨이퍼가 아니라 골라서(샘플링) 잽니다.', '노광기 S2는 지금도 다른 LOT을 계속 노광하고 있습니다.'],
      next: 'contain',
    },

    contain: {
      type: 'choice',
      multi: true,
      step: 2,
      title: '초기 대응 판단',
      goal: '이상 LOT이 되돌릴 수 없는 단계로 넘어가지 않게 막습니다. 해당하는 조치를 모두 고르세요.',
      prompt: '지금 바로 할 조치를 모두 고르세요.',
      options: [
        { id: 'hold', cost: 10, text: '이상 LOT을 식각 전에 Hold해 식각 투입을 막는다', score: { contain: 9 }, tone: 'good', log: '이상 LOT 식각 전 Hold', status: '이상 LOT Hold (식각 전)', feedback: '포토는 식각 전이라면 감광액을 벗기고 다시 할 수 있지만, 식각·증착 뒤에는 대개 늦습니다(EPFL CMi).' },
        { id: 'measureall', cost: 20, text: '이상 LOT의 모든 웨이퍼로 오버레이 측정 범위를 넓힌다', score: { contain: 6 }, tone: 'good', log: '이상 LOT 전 웨이퍼 측정', feedback: '샘플 측정만으로는 어느 웨이퍼까지 영향인지 모릅니다. 재작업 범위를 정하려면 측정 범위를 넓혀야 합니다.' },
        { id: 'share', cost: 5, text: '계측·식각 담당에게 알리고, 이상 LOT 목록과 발견 시각을 기록한다', score: { contain: 5 }, tone: 'good', log: '관련 부서 공유, 기록', feedback: '식각 담당이 알아야 Hold LOT이 실수로 투입되지 않습니다.' },
        { id: 'stopscanner', cost: 5, text: '노광기 S2를 멈춘다', score: { contain: -3 }, tone: 'warn', log: '노광기 S2 정지', status: '노광기 S2 정지', feedback: '같은 S2에서 다른 LOT은 정상입니다. 노광기 문제라는 근거 없이 멈추면 생산만 줄어듭니다.' },
        { id: 'etchgo', cost: 0, text: '한계를 조금 넘은 정도이니 식각을 진행시키고 결과를 본다', score: { contain: -8 }, tone: 'bad', log: '이상 LOT 식각 진행', status: '이상 LOT 식각 진행 (되돌릴 수 없음)', feedback: '식각을 하고 나면 재작업이 대개 불가능합니다(EPFL CMi). 지금이 되돌릴 수 있는 마지막 시점입니다.' },
        { id: 'offsetnow', cost: 10, text: '이상 LOT의 측정값으로 노광기 보정값을 바로 바꿔 모든 LOT에 적용한다', score: { contain: -6, fix: -5 }, tone: 'bad', log: '이상값으로 보정값 일괄 변경', feedback: '원인이 이 LOT들에만 있다면, 그 값을 모든 LOT 보정에 넣으면 정상 LOT까지 어긋날 수 있습니다(교육용 가정).' },
      ],
      essay: { label: '판단 이유 (선택)', placeholder: '왜 이렇게 판단했는지 짧게 써 보세요.' },
      hints: [
        '이상 LOT은 지금 어느 단계에 있나요? 다음 단계로 넘어가면 무엇을 할 수 없게 될까요?',
        '샘플 2장만 잰 결과로 LOT 전체의 영향 범위를 알 수 있을까요?',
        '식각 전 Hold, 측정 범위 확대, 식각 담당 공유입니다. 노광기 전체를 멈출 근거가 있는지도 생각해 보세요.',
      ],
      next: 'collect',
    },

    collect: {
      type: 'data',
      step: 3,
      title: '데이터 수집',
      goal: '원인을 가를 데이터를 고릅니다. 확인에는 가상 시간이 듭니다(최대 60분).',
      prompt: '어떤 데이터부터 확인하시겠습니까?',
      budget: 60,
      items: [
        { id: 'tis', icon: '📏', purpose: '같은 마크를 180° 돌려 다시 재서 계측 장비가 만드는 오차를 확인합니다.', label: '오버레이 재측정 (시료 180° 회전)', group: '검사 데이터', cost: 15, score: { data: 4 }, key: true, result: { kind: 'table', meta: '이상 LOT 웨이퍼 2장 · 0°/180° 측정 · 가상 데이터', cols: ['측정', '오버레이'], rows: [['0°', '7.8 nm'], ['180° 회전', '7.6 nm'], ['장비 유발 오차(추정)', '작음 · 정상 범위']] }, note: '마크를 돌려 재도 값이 거의 같습니다 → 계측 장비 쪽 오차(TIS)로는 설명되지 않습니다. 마크를 180° 돌려 다시 재는 방법은 TIS를 줄이는 데 씁니다(Micromachines 2025).' },
        { id: 'map', icon: '🗺️', purpose: '웨이퍼 안 위치별 오버레이 분포를 봅니다.', label: '오버레이 웨이퍼 맵 (위치별)', group: '검사 데이터', cost: 10, score: { data: 4 }, key: true, result: { kind: 'wafermap', meta: '이상 LOT 웨이퍼 8장 평균 · 영역별 평균 · 가상 데이터', unit: 'nm', limit: 6, title: '이상 LOT', rings: [{ label: '가운데', value: 3.4 }, { label: '중간', value: 4.6 }, { label: '가장자리', value: 11.2 }], compare: { label: '정상 LOT', rings: [{ label: '가운데', value: 2.9 }, { label: '중간', value: 3.1 }, { label: '가장자리', value: 3.5 }] } }, note: '이상 LOT은 웨이퍼 가장자리에서 오버레이가 크게 벗어납니다. 정상 LOT은 가장자리도 괜찮습니다.' },
        { id: 'history', icon: '🧭', purpose: '이상 LOT과 정상 LOT이 앞 공정에서 어떤 장비를 거쳤는지 비교합니다.', label: 'LOT 이력 (이전 층 식각 장비)', group: '자재·설비 이력', cost: 10, score: { data: 6 }, key: true, result: { kind: 'table', meta: '최근 3일 S2 노광 LOT 18개 · 가상 데이터', cols: ['이전 층 식각 챔버', 'LOT 수', '오버레이 한계 초과'], rows: [['E1', '7', '0'], ['E2', '6', '0'], ['E3', '5', '5 ⚠']] }, note: '한계를 넘은 LOT은 모두 이전 층을 E3 챔버에서 식각했습니다. 노광기는 같고 앞 공정만 다릅니다.' },
        { id: 'asym', icon: '🎯', purpose: '정렬 마크 상태(비대칭)를 보여 주는 지표를 LOT별로 봅니다.', label: '정렬 마크 상태 지표 (마크 비대칭)', group: '설비 상태', cost: 10, score: { data: 4 }, key: true, parts: ['stage'], observe: { normal: '마크 상태 지표가 웨이퍼 전체에서 고릅니다.', abnormal: '특정 영역(예: 가장자리)에서 마크 상태 지표가 크게 나빠집니다.' }, result: { kind: 'table', meta: '노광 전 정렬 측정 기록 · 가상 지표', cols: ['LOT 묶음', '가운데', '가장자리'], rows: [['E3 거친 LOT', '보통', '나쁨 ⚠'], ['E1·E2 거친 LOT', '보통', '보통']] }, note: '마크 비대칭은 주로 앞 공정(식각·CMP)에서 생기고, 정렬 오차를 거쳐 오버레이로 이어집니다. 웨이퍼 가장자리의 식각 유발 마크 형상 불균일이 주원인이었던 사례도 보고됐습니다(Micromachines 2025).' },
        { id: 'scanner', icon: '🖥️', purpose: '같은 노광기로 한 다른 LOT·제품의 결과를 봅니다.', label: '같은 노광기의 다른 LOT 결과', group: '설비 로그', cost: 5, score: { data: 2 }, key: true, parts: ['source', 'stage'], result: { kind: 'table', meta: '같은 날 S2 노광 · 가상 데이터', cols: ['구분', '오버레이'], rows: [['E1·E2 거친 LOT', '2.8 ~ 3.4 nm · 정상'], ['다른 제품 LOT', '정상']] }, note: '노광기 자체(렌즈·스테이지) 문제라면 모든 LOT이 나빠야 하는데, 다른 LOT은 정상입니다.' },
        { id: 'trend', icon: '📈', purpose: 'LOT 안에서 웨이퍼 순서에 따라 오버레이가 변하는지 봅니다.', label: 'LOT 안 웨이퍼 순서별 오버레이', group: '검사 데이터', cost: 10, score: { data: 2 }, parts: ['source'], result: { kind: 'table', meta: '이상 LOT 1개 · 웨이퍼 25장 · 가상 데이터', cols: ['웨이퍼 순서', '오버레이'], rows: [['1~5번', '7.6 nm'], ['11~15번', '7.9 nm'], ['21~25번', '7.7 nm']] }, note: '첫 장부터 높고 순서에 따라 점점 나빠지지 않습니다. 레티클 가열이 누적되면 여러 웨이퍼에 걸쳐 점점 나빠지는데(Micromachines 2025), 그런 추세가 없습니다.' },
        { id: 'chuck', icon: '⚙️', purpose: '웨이퍼 받침(척)별로 결과가 다른지 봅니다.', label: '척별 비교', group: '설비 상태', cost: 10, score: { data: 1 }, parts: ['stage'], result: { kind: 'table', meta: '이상 LOT · 척별 평균 · 가상 데이터', cols: ['척', '오버레이'], rows: [['척 1', '7.7 nm'], ['척 2', '7.9 nm']] }, note: '두 척의 결과가 비슷합니다 → 척 하나의 문제로는 설명되지 않습니다.' },
        { id: 'env', icon: '🌡️', purpose: '클린룸 온습도가 평소 범위인지 봅니다.', label: '클린룸 온습도 기록', group: '관련 품질 데이터', cost: 5, score: {}, result: { kind: 'text', text: '평소 범위입니다.' }, note: '이번 문제와는 관련이 적은 데이터였습니다.' },
        { id: 'shift', icon: '👥', purpose: '작업 조와 담당자 변경을 확인합니다.', label: '작업자 교대 기록', group: '관련 품질 데이터', cost: 5, score: {}, result: { kind: 'text', text: '정상 LOT과 이상 LOT을 같은 조가 진행했습니다.' }, note: '담당이 같아 LOT 차이를 설명하지 못합니다.' },
      ],
      hints: [
        '측정값을 믿기 전에 계측 장비가 만드는 오차부터 확인할 방법이 있을까요?',
        '같은 노광기인데 일부 LOT만 나쁩니다. 그 LOT들만의 공통점은 앞 공정 어디에 있을까요?',
        '재측정(180°) → LOT 이력 → 마크 상태 지표 → 같은 노광기 다른 LOT 순서가 시간 대비 가장 많은 원인을 가립니다.',
      ],
      next: 'hypo',
    },

    hypo: {
      type: 'hypothesis',
      step: 4,
      title: '원인 분석',
      goal: '가장 유력한 원인 가설을 고르고, 그 가설을 뒷받침하는 데이터를 고릅니다.',
      prompt: '지금까지 확인한 데이터로 볼 때 가장 유력한 원인은 무엇입니까?',
      options: [
        {
          id: 'mark',
          text: '이전 층 식각(E3)을 거친 LOT의 정렬 마크가 비대칭해져(특히 가장자리) 정렬 오차가 생기고 오버레이로 이어짐',
          correct: true,
          support: ['history', 'asym', 'map', 'tis', 'scanner', 'trend', 'chuck'],
          feedback: '맞습니다. 한계를 넘은 LOT이 모두 E3를 거쳤고, 마크 상태가 가장자리에서 나쁘며, 오버레이도 가장자리에서 큽니다. 계측(TIS)·노광기·레티클 가열·척 원인은 데이터로 지워집니다. 마크 비대칭은 주로 앞 공정(식각·CMP)에서 생겨 오버레이로 이어집니다(Micromachines 2025).',
          missing: { history: 'LOT 이력을 보지 않으면 "E3를 거친 LOT만"이라는 핵심 단서를 놓칩니다.' },
        },
        { id: 'tis', text: '오버레이 계측 장비 오차', feedback: '처음에 꼭 의심해야 합니다. 하지만 마크를 180° 돌려 재도 값이 같고, 정상 LOT은 같은 장비에서 정상입니다.', refute: ['tis'] },
        { id: 'heat', text: '레티클 가열 누적', feedback: '레티클 가열이 누적되면 여러 웨이퍼에 걸쳐 점점 나빠지는데(Micromachines 2025), LOT 안 순서별 추세가 없고 다른 LOT은 정상입니다.', refute: ['trend', 'scanner'] },
        { id: 'scanner', text: '노광기 렌즈·스테이지 문제', feedback: '렌즈 왜곡이나 스테이지도 오버레이에 영향을 주지만(Nanoscale Advances 2025), 같은 S2에서 E1·E2를 거친 LOT은 정상입니다.', refute: ['scanner'] },
        { id: 'chuck', text: '척 하나의 문제', feedback: '두 척의 결과가 비슷해 척 하나의 문제로는 설명되지 않습니다.', refute: ['chuck'] },
      ],
      score: { correct: 8, retry: 4, evidenceEach: 2, evidenceMax: 7 },
      essay: { label: '가설 설명 (선택)', placeholder: '왜 이 가설이 가장 유력한지 근거와 함께 써 보세요.' },
      hints: [
        '같은 노광기·같은 Recipe인데 결과가 갈렸습니다. LOT들은 어디서 갈라졌나요?',
        '계측·노광기·레티클 가열·척 가설은 각각 어떤 데이터로 지울 수 있었나요?',
        'LOT 이력(E3) + 마크 상태(가장자리) + 오버레이 맵(가장자리) + 반증 데이터를 함께 근거로 드세요.',
      ],
      next: 'know',
    },

    know: {
      type: 'quiz',
      step: 5,
      title: '조치 전 점검',
      goal: '재작업과 보정을 정하기 전에 꼭 알아야 할 것을 확인합니다.',
      questions: [
        {
          id: 'k1',
          prompt: '포토 공정의 재작업(감광액을 벗기고 다시 노광)은 언제 할 수 있나요?',
          choices: ['식각이나 증착을 하기 전', '식각을 마친 뒤에도 언제든', '증착 뒤에만', '재작업은 할 수 없다'],
          answer: 0,
          points: 8,
          explain: '포토는 되돌릴 수 있어 문제가 있으면 감광액을 벗기고 다시 할 수 있지만, 기판을 식각하거나 막을 증착한 뒤에는 대개 늦습니다(EPFL CMi).',
        },
        {
          id: 'k2',
          prompt: '정렬 마크 비대칭은 주로 어디서 생기나요?',
          choices: ['앞 공정(특히 식각·CMP)', '노광기 광원', '클린룸 온습도', '작업자 교대'],
          answer: 0,
          points: 7,
          explain: '마크 형상의 비대칭은 주로 반도체 제조 공정, 특히 식각과 CMP에서 생깁니다(Micromachines 2025).',
        },
      ],
      hints: ['이상 LOT은 지금 어느 단계에 있었나요?', '마크는 이전 층을 만들 때 함께 새겨집니다. 그 뒤 어떤 공정을 거쳤나요?', '재작업은 식각 전, 마크 비대칭은 앞 공정(식각·CMP)입니다.'],
      next: 'action',
    },

    action: {
      type: 'choice',
      step: 5,
      title: '조치 선택',
      goal: '이상 LOT을 살리고 원인을 없애는 조치를 하나 고릅니다.',
      prompt: '어떤 조치를 하시겠습니까?',
      options: [
        { id: 'rework_align', cost: 45, text: '이상 LOT은 식각 전에 감광액을 벗겨 재작업하되, 마크 상태에 맞게 정렬 전략(측정 조건·사용할 마크)을 검토·승인받아 적용하고, E3 식각 담당에게 마크 형상 원인 조사를 요청한다', score: { fix: 15 }, tone: 'good', log: '재작업 + 정렬 전략 검토 + 앞 공정 조사 요청', status: '재작업 · 정렬 전략 검토', next: 'r_good', feedback: '되돌릴 수 있을 때 재작업하고, 원인(앞 공정의 마크 비대칭)에 맞춰 정렬 전략을 검토하며 앞 공정과 협업했습니다. 정렬 전략·마크 설계·공정 모니터링 최적화는 논문에서도 제시하는 방향입니다(Micromachines 2025).' },
        { id: 'rework_same', cost: 30, text: '같은 조건 그대로 재작업한다', score: { fix: 4 }, tone: 'warn', log: '같은 조건으로 재작업', status: '같은 조건 재작업', next: 'r_same', feedback: '재작업 자체는 맞지만, 마크 상태가 그대로라 같은 결과가 날 수 있습니다.' },
        { id: 'offset', cost: 15, text: '이상 LOT의 측정값으로 노광기 보정값을 바꿔 모든 LOT에 적용하고 재작업한다', score: { fix: 0 }, tone: 'bad', log: '이상값으로 보정값 일괄 변경', status: '보정값 변경', next: 'r_offset', feedback: '원인이 일부 LOT의 마크에 있는데 모든 LOT 보정을 바꿨습니다.' },
        { id: 'etch_go', cost: 0, text: '한계 근처이니 식각으로 넘긴다', score: { fix: 0 }, tone: 'bad', log: '이상 LOT 식각 진행', status: '이상 LOT 식각 진행 (되돌릴 수 없음)', next: 'r_etch', feedback: '되돌릴 수 있는 마지막 시점을 놓쳤습니다.' },
        { id: 'scanner_pm', cost: 60, text: '노광기 S2의 렌즈·스테이지를 점검한다', score: { fix: 2 }, tone: 'warn', log: '노광기 점검', status: '노광기 점검 중', next: 'r_pm', feedback: '데이터로 지운 원인을 점검하느라 시간이 듭니다.' },
      ],
      hints: ['이상 LOT은 아직 식각 전입니다. 무엇을 할 수 있나요?', '원인은 노광기가 아니라 일부 LOT의 마크 상태였습니다. 무엇을 바꿔야 하고, 누구와 협업해야 할까요?', '식각 전 재작업 + 마크 상태에 맞는 정렬 전략 검토(승인) + 앞 공정(E3) 조사 요청입니다.'],
    },

    r_good: {
      type: 'outcome',
      step: 5,
      title: '조치 결과',
      tone: 'ok',
      text: '정렬 전략을 검토해 적용한 재작업 웨이퍼의 오버레이가 한계 안으로 들어왔습니다. E3 담당은 챔버 가장자리 조건을 조사하기 시작했습니다.',
      table: { virtual: true, cols: ['항목', '결과', '판정'], rows: [['재작업 웨이퍼 오버레이', '3.9 nm', '✓ 한계 6 nm 안'], ['가장자리', '4.8 nm', '✓'], ['정상 LOT 영향', '없음(보정값 변경 안 함)', '✓']] },
      next: 'verify',
    },
    r_same: {
      type: 'outcome',
      step: 5,
      title: '조치 결과',
      tone: 'warn',
      text: '재작업에 30분이 들었지만 가장자리 오버레이가 여전히 한계를 넘습니다. 마크 상태가 그대로이기 때문입니다.',
      table: { virtual: true, cols: ['항목', '결과'], rows: [['재작업 웨이퍼 오버레이', '7.2 nm ⚠'], ['가장자리', '10.6 nm ✕']] },
      lesson: '재작업은 되돌릴 기회를 쓰는 것입니다. 원인(마크 비대칭)에 맞는 정렬 전략 없이 같은 조건으로 하면 같은 결과가 날 수 있습니다.',
      next: 'recover',
    },
    r_offset: {
      type: 'outcome',
      step: 5,
      title: '조치 결과',
      tone: 'bad',
      text: '이상 LOT은 조금 나아졌지만, 바뀐 보정값으로 노광한 E1·E2 LOT의 오버레이가 나빠졌습니다(교육용 가정).',
      table: { virtual: true, cols: ['구분', '오버레이'], rows: [['E3 LOT 재작업', '6.4 nm ⚠'], ['E1·E2 LOT (새로 노광)', '5.6 nm ⚠ (전에는 3 nm대)']] },
      lesson: '원인이 일부 LOT에만 있을 때 그 값을 모든 LOT 보정에 넣으면 정상 LOT까지 어긋날 수 있습니다. 보정은 원인과 적용 범위를 확인한 뒤 바꿉니다.',
      next: 'recover',
    },
    r_etch: {
      type: 'outcome',
      step: 5,
      title: '조치 결과',
      tone: 'bad',
      text: '식각 뒤 검사(AEI)에서도 오버레이 불량이 확인됐습니다. 식각한 웨이퍼는 재작업할 수 없어 폐기 여부를 검토해야 합니다. 아직 식각 전인 나머지 Hold LOT은 살릴 수 있습니다.',
      table: { virtual: true, cols: ['구분', '상태'], rows: [['식각한 LOT', '재작업 불가 ✕'], ['식각 전 Hold LOT', '재작업 가능']] },
      lesson: '포토는 식각 전에는 재작업할 수 있지만, 식각·증착 뒤에는 대개 늦습니다(EPFL CMi).',
      next: 'recover',
    },
    r_pm: {
      type: 'outcome',
      step: 5,
      title: '조치 결과',
      tone: 'warn',
      text: '점검에 60분이 들었고 노광기 S2는 정상이었습니다. 선임 엔지니어가 묻습니다: "E3를 거친 LOT만 나쁘다는 건 무엇을 뜻할까요?"',
      next: 'recover',
    },

    recover: {
      type: 'choice',
      step: 5,
      title: '판단 수정',
      goal: '새 결과를 보고 조치를 고칩니다.',
      prompt: '이제 어떻게 하시겠습니까?',
      options: [
        { id: 'rollback', cost: 45, text: '바꾼 보정값이 있으면 원래대로 되돌리고, 식각 전 LOT은 마크 상태에 맞는 정렬 전략을 검토·승인받아 재작업하며, E3 담당에게 원인 조사를 요청한다', score: { fix: 6 }, tone: 'good', log: '보정값 원복 + 정렬 전략 재작업 + 앞 공정 조사 요청', status: '원복 · 재작업', next: 'r_good', feedback: '결과를 보고 판단을 고친 것도 중요한 역량입니다.' },
        { id: 'more', cost: 10, text: '보정값을 조금 더 조정해 맞춘다', score: { fix: -3, know: -3 }, tone: 'bad', log: '보정값 추가 조정', next: 'recover', feedback: '원인(일부 LOT의 마크)을 그대로 둔 채 보정을 더 바꾸면 정상 LOT 영향이 커집니다. 다시 고르세요.' },
      ],
      hints: ['처음 확인한 원인(E3 LOT의 마크 상태)은 해결됐나요?', '바꾼 보정값이 있다면 먼저 되돌려야 하지 않을까요?', '보정값 원복 + 정렬 전략 검토 재작업 + 앞 공정 조사 요청입니다.'],
    },

    verify: {
      type: 'choice',
      multi: true,
      step: 6,
      title: '검증 및 재발 방지',
      goal: '정상 복귀를 무엇으로 판단하고, 다시 생기지 않게 무엇을 할지 고릅니다.',
      prompt: '해당하는 것을 모두 고르세요.',
      options: [
        { id: 'multi', cost: 15, text: '재작업한 LOT은 모든 웨이퍼, 이후 E3 LOT은 늘린 샘플로 오버레이를 확인한다', score: { verify: 4 }, tone: 'good', log: '재작업 LOT 전수·E3 LOT 샘플 확대' },
        { id: 'aei', cost: 10, text: '식각 뒤 검사(AEI)에서도 오버레이가 괜찮은지 확인한다', score: { verify: 3 }, tone: 'good', log: '식각 뒤 오버레이 확인' },
        { id: 'upstream', cost: 10, text: 'E3 식각의 마크 형상 개선 결과를 받고, 들어오는 LOT의 마크 상태 지표를 감시한다', score: { verify: 4 }, tone: 'good', log: '앞 공정 개선 확인·마크 상태 감시' },
        { id: 'offsetrule', cost: 5, text: '보정값은 원인과 적용 범위를 확인한 뒤에만 바꾸도록 절차를 정한다', score: { verify: 2 }, tone: 'good', log: '보정값 변경 절차' },
        { id: 'holdlot', cost: 5, text: 'Hold한 LOT은 측정 결과로 재작업·진행을 정한다', score: { verify: 2 }, tone: 'good', log: 'Hold LOT 처리 기준 결정' },
        { id: 'once', cost: 0, text: '재작업 웨이퍼 한 장이 괜찮으니 바로 종료한다', score: { verify: -5 }, tone: 'bad', log: '1장 확인 후 종료', feedback: '한 장의 결과는 우연일 수 있습니다. 식각 뒤 결과까지 확인해야 합니다.' },
        { id: 'norecord', cost: 0, text: '원인 기록 없이 정상 생산으로 돌아간다', score: { verify: -3 }, tone: 'bad', log: '기록 없이 종료', feedback: '앞 공정 문제는 기록과 공유가 없으면 반복됩니다.' },
      ],
      essay: { label: '재발 방지 대책 (선택)', placeholder: '내가 생각하는 재발 방지 대책을 써 보세요.' },
      hints: ['재작업 결과는 현상 뒤에만 보면 될까요?', '이번 원인은 포토가 아니라 앞 공정에 있었습니다. 앞 공정과 무엇을 함께 해야 할까요?', '전수·샘플 확대 + 식각 뒤 확인 + 앞 공정 개선·마크 상태 감시 + 보정값 변경 절차입니다.'],
      next: 'end',
    },
    end: { type: 'end', step: 6, title: '결과 평가' },
  },

  steps: ['현장 상황 전달', '초기 대응 판단', '데이터 수집', '원인 분석', '조치 및 검증', '결과 평가'],

  model: [
    '이상 LOT을 식각 전에 Hold하고, 모든 웨이퍼로 측정 범위를 넓힌다. 식각 담당에 공유한다. 노광기 전체를 멈추지는 않는다.',
    '계측부터 확인한다: 마크를 180° 돌려 다시 재서 TIS를 확인한다.',
    'LOT 이력을 본다 → 한계 초과 LOT이 모두 이전 층 E3 식각을 거침. 마크 상태 지표·오버레이 맵이 가장자리에서 나쁨.',
    '노광기·레티클 가열·척 원인은 같은 노광기 다른 LOT 정상, 웨이퍼 순서별 추세 없음, 척별 차이 없음으로 지운다.',
    '이상 LOT의 측정값으로 모든 LOT 보정값을 바꾸지 않는다(정상 LOT까지 어긋날 수 있음).',
    '식각 전에 재작업하되 마크 상태에 맞는 정렬 전략을 검토·승인받아 적용하고, E3 담당에게 원인 조사를 요청한다.',
    '재작업 LOT 전수·식각 뒤(AEI) 확인, 앞 공정 개선과 마크 상태 감시, 보정값 변경 절차로 재발을 막는다.',
  ],
}
