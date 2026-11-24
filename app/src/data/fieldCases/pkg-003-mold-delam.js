// PKG-003: Molding 공정 Delamination (분기형 현장 실무 시나리오)
// ⚠ 모든 사건·수치·로그는 교육용 가상 데이터입니다. 실제 업체·장비의 규격이나 사양이 아닙니다.
// 근거
//   - 리플로 때 흡습 수분의 증기압 → 박리·팝콘 균열, 판정은 전기 검사 + 초음파 현미경(C-SAM): NASA NEPP 보고서 2건
//   - 프리컨디셔닝 흐름(베이크 → 흡습 → 리플로 3회 → 전기 검사·C-SAM): NASA NEPP MSL 보고서
//   - bare Cu 리드프레임 표면 산화가 위험하고 몰딩 전 플라즈마로 표면 불순물을 씻어 냄: ASEMEP 학회 논문(Ampleon)
//   - 흡습 초과 시 베이크(J-STD-033): Mini-Circuits 애플리케이션 노트(설명 출처)
// "세정 생략 LOT에서만 박리"라는 사건 구조와 수치는 교육용 가정입니다. 전문가 검수 전입니다.

export default {
  id: 'PKG-003',
  category: 'PKG',
  processLabel: 'Molding',
  difficulty: '고급',
  equipment: { name: '몰드 프레스 2호기 (앞 공정: 플라즈마 세정)', kind: 'molding', diagram: 'iso' },
  competencies: ['출하 판정 기준', '공정 경로(이력) 추적', '가설 반증', '임시 우회 승인의 위험 관리'],
  version: '1.0',
  reviewed: false,
  updated: '2026-11-24',
  title: 'Molding 공정 Delamination',
  subtitle: '프리컨디셔닝 뒤 C-SAM에서 박리 — 전기 검사는 통과',
  process: 'molding',
  machine: 'molding',
  level: '상',
  minutes: 30,
  roles: ['공정기술(몰딩)', '신뢰성', '품질관리'],
  goals: [
    '전기 검사를 통과해도 박리가 확인되면 출하하지 않는다(판정은 전기 검사와 초음파 현미경 검사를 함께 본다).',
    '박리 LOT이 "어떤 경로로" 만들어졌는지 공정 이력으로 추적한다.',
    '자재(EMC)·시험 조건·몰딩 조건 가설을 데이터로 지운 뒤 원인을 정한다.',
    '임시 우회 승인(세정 생략) 같은 예외 경로가 남긴 위험을 관리한다.',
  ],
  assumptions: [
    '모든 수치(박리율, LOT 수, 접촉각, 시간)는 교육용으로 만든 가상 데이터입니다. 실제 관리 규격이 아닙니다.',
    '"세정을 생략한 LOT에서만 박리가 나왔다"는 사건 구조는 교육용 가정입니다.',
    '리드프레임 표면 "접촉각"은 표면 상태를 보여 주는 값을 단순화한 가상 지표입니다.',
    '원인·대응 설명은 NASA NEPP 보고서, 학회 논문, 부품사 노트를 근거로 하며 전문가 검수 전입니다.',
  ],
  sources: ['nasa-nepp-msl-2004', 'nasa-nepp-pems-1994', 'asemep-plasma-cu', 'minicircuits-msd', 'oa-emc-2024', 'hynix-be-11'],
  related: [
    { kind: 'process', id: 'molding', label: '몰딩 공정 설명' },
    { kind: 'machine', id: 'molding', label: '몰드 프레스 설비 실습' },
    { kind: 'screen', id: 'cases', label: '사례 서술형 연습' },
  ],

  timeLimit: 180,
  timeRule: { cat: 'contain', penalty: 5, text: '목표 시간(가상 180분) 안에 출하 판정과 재개 조건을 정하지 못해, 출하 일정과 Hold 물량 부담이 커졌습니다.' },

  checks: [
    { q: '위험한 조치(박리 LOT 출하, 원인 확인 전 몰딩 조건 변경)를 피했는가?', rule: { notPicked: ['contain.shippass', 'contain.pressure', 'action.pressure', 'recover.more'] } },
    { q: '같은 기간 LOT을 격리하고 C-SAM 범위를 넓혔는가?', rule: { picked: ['contain.hold', 'contain.sample'] } },
    { q: 'LOT별 공정 경로(이력)를 확인했는가?', rule: { viewedAny: ['route'] } },
    { q: '근거 데이터 없이 원인을 확정하지 않았는가?', rule: { evidenceMin: 2 } },
    { q: '재개 뒤 프리컨디셔닝 + C-SAM으로 검증했는가?', rule: { picked: ['verify.multi'], notPicked: ['verify.once'] } },
  ],
  similar: ['cases:mold-void', 'PKG-002'],

  rubric: [
    { id: 'contain', label: '긴급 대응', points: 20, desc: '출하 보류, 범위 확인, 이력 확보, 공유' },
    { id: 'know', label: '공정 지식', points: 15, desc: '박리가 생기는 원리와 판정 기준을 아는가' },
    { id: 'data', label: '데이터 분석', points: 20, desc: '원인을 가를 데이터를 골라 확인했는가(시간 대비)' },
    { id: 'cause', label: '원인 분석', points: 15, desc: '가설과 근거 데이터가 맞는가' },
    { id: 'fix', label: '개선 조치', points: 15, desc: '원인(예외 경로)을 직접 막는 조치를 골랐는가' },
    { id: 'verify', label: '재발 방지', points: 15, desc: '재개 검증과 예외 경로 관리' },
  ],

  start: 'brief',
  nodes: {
    brief: {
      type: 'brief',
      step: 1,
      title: '현장 상황 전달',
      goal: '무슨 일이 일어났는지 파악합니다.',
      who: '신뢰성 담당 (오전 9:30)',
      report:
        '"엔지니어님, 출하 전 프리컨디셔닝(베이크 → 흡습 → 리플로 3회) 시료를 C-SAM으로 봤더니 4개 LOT에서 다이 패드와 몰드 사이가 떠 있습니다. 전기 검사는 다 통과했어요. 오늘 오후 출하 예정인데 어떻게 할까요?"',
      status: [
        { label: '몰드 프레스 1·2호기', value: '가동 중', tone: 'info' },
        { label: '플라즈마 세정기', value: '월요일 수리 완료 · 가동 중', tone: 'ok' },
        { label: '출하', value: '오늘 오후 예정', tone: 'warn' },
      ],
      table: {
        virtual: true,
        cols: ['확인 항목', '박리 LOT (4개)', '같은 주 다른 LOT'],
        rows: [
          ['C-SAM 박리 (다이 패드-몰드 계면)', '시료 22개 중 9개 ✕', '시료 44개 중 0개'],
          ['전기 검사', '통과', '통과'],
          ['외관 (균열)', '이상 없음', '이상 없음'],
          ['몰드 프레스', '2호기', '1·2호기'],
          ['리드프레임', '도금 없는 bare Cu', '도금 없는 bare Cu'],
        ],
      },
      facts: [
        '박리가 나온 4개 LOT은 모두 지난 주말(토~일)에 몰딩했습니다.',
        '이번 달부터 EMC 입고 LOT이 바뀌었습니다.',
        '플라즈마 세정기는 지난 토요일 고장이 나서 월요일에 수리했습니다.',
      ],
      next: 'contain',
    },

    contain: {
      type: 'choice',
      multi: true,
      step: 2,
      title: '초기 대응 판단',
      goal: '박리 제품이 나가지 않게 막고, 범위를 확인할 준비를 합니다. 해당하는 조치를 모두 고르세요.',
      prompt: '지금 바로 할 조치를 모두 고르세요.',
      options: [
        { id: 'hold', cost: 10, text: '박리 LOT과 같은 기간(지난 주말) 몰딩 LOT을 모두 출하 보류(Hold)한다', score: { contain: 8 }, tone: 'good', log: '주말 몰딩 LOT 출하 보류', status: '주말 LOT Hold', feedback: '같은 기간 LOT은 같은 조건을 겪었을 수 있습니다. 확인 전에 내보내면 되돌릴 수 없습니다.' },
        { id: 'sample', cost: 15, text: '주말에 몰딩한 다른 LOT도 C-SAM 시료 검사로 범위를 확인한다', score: { contain: 4 }, tone: 'good', log: '주말 LOT C-SAM 범위 확인', feedback: '박리는 겉으로 보이지 않아 초음파 현미경으로 확인합니다(NASA NEPP).' },
        { id: 'trace', cost: 5, text: '박리 LOT의 공정 이력(설비·경로·자재·작업 기록)을 확보한다', score: { contain: 4 }, tone: 'good', log: '박리 LOT 공정 이력 확보', feedback: '어떤 경로로 만들어졌는지가 원인을 좁히는 첫 단서입니다.' },
        { id: 'share', cost: 5, text: '품질·생산·출하 담당에게 알리고 출하 일정 영향을 공유한다', score: { contain: 4 }, tone: 'good', log: '관련 부서 공유', feedback: '출하가 걸린 문제라 일정 판단을 함께 해야 합니다.' },
        { id: 'stopall', cost: 5, text: '예방 차원에서 몰딩 라인 전체를 멈춘다', score: { contain: -3 }, tone: 'warn', log: '몰딩 라인 전체 중단', feedback: '이번 주 LOT은 박리가 없습니다. 근거 없이 멈추면 생산 손실만 커집니다.' },
        { id: 'shippass', cost: 0, text: '전기 검사를 통과했으니 예정대로 출하한다', score: { contain: -8 }, tone: 'bad', log: '박리 LOT 출하 진행', status: '박리 LOT 출하', feedback: 'NASA NEPP 보고서에 따르면 J-STD-020 시험은 전기 검사와 초음파 현미경(C-SAM) 검사를 모두 통과해야 합니다. 박리가 확인된 LOT은 내보내면 안 됩니다.' },
        { id: 'pressure', cost: 10, text: '몰딩 압력·온도를 바로 올려 접착을 강하게 만든다', score: { contain: -5, fix: -5 }, tone: 'bad', log: '원인 확인 전 몰딩 조건 상향', feedback: '원인을 모르는 채 조건을 바꾸면 원인을 가리고, 압력이 지나치면 플래시 같은 새 불량이 생길 수 있습니다(몰드 프레스 규칙표, 교육용 가설).' },
      ],
      essay: { label: '판단 이유 (선택)', placeholder: '왜 이렇게 판단했는지 짧게 써 보세요.' },
      hints: [
        '전기 검사를 통과한 것만으로 출하해도 될까요? 판정 기준은 무엇이었나요?',
        '박리 LOT과 "같은 조건을 겪었을 수 있는" LOT은 어디까지일까요?',
        '주말 LOT 출하 보류, 주말 LOT C-SAM 범위 확인, 공정 이력 확보, 공유가 기본입니다.',
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
      maxScore: 'data',
      items: [
        { id: 'route', icon: '🛤️', purpose: 'LOT마다 거친 공정 경로와 예외 승인을 봅니다.', label: 'LOT별 공정 경로 이력 (MES)', group: '공정 흐름', cost: 10, observe: { normal: '모든 LOT이 정해진 경로(플라즈마 세정 → 몰딩)로 갑니다.', abnormal: '일부 LOT이 임시 승인으로 단계를 건너뛰었습니다.' }, score: { data: 6 }, key: true, result: { kind: 'table', cols: ['LOT 묶음', '플라즈마 세정', '비고'], rows: [['박리 LOT 4개', '생략 ⚠', '토요일 세정기 고장 → "세정 생략" 임시 승인'], ['주말 다른 LOT 2개', '진행', '고장 전(토요일 오전) 세정 완료'], ['이번 주 LOT', '진행', '수리 후 정상 경로']] }, note: '박리 LOT만 "세정 생략" 경로였습니다. 몰딩 전 플라즈마는 금속 표면의 불순물을 씻어 내려고 넣는 단계입니다(ASEMEP 논문).' },
        { id: 'samsplit', icon: '🔊', purpose: '세정 여부에 따라 박리가 갈리는지 C-SAM으로 비교합니다.', label: '주말 LOT 전체 C-SAM: 세정 생략 vs 세정 진행', group: '검사 데이터', cost: 15, observe: { normal: '세정 여부와 관계없이 계면이 붙어 있습니다.', abnormal: '특정 경로 LOT에서만 계면이 떠 있습니다.' }, score: { data: 6 }, key: true, result: { kind: 'table', cols: ['구분', '시료', '박리'], rows: [['세정 생략 LOT', '32', '13 ✕'], ['세정 진행 LOT (주말)', '12', '0'], ['세정 진행 LOT (이번 주)', '32', '0']] }, note: '같은 주말·같은 프레스라도 세정을 생략한 LOT에서만 박리가 나왔습니다.' },
        { id: 'surface', icon: '🟤', purpose: '세정 생략 기간에 대기하던 리드프레임 표면 상태를 봅니다.', label: '남은 리드프레임 표면 상태 (변색·접촉각)', group: '자재 상태', cost: 10, observe: { normal: '표면 색이 고르고 접촉각이 기준 범위입니다.', abnormal: '표면이 변색되고 접촉각이 커져 있습니다(표면 산화·오염의 신호로 쓰는 가상 지표).' }, score: { data: 3 }, key: true, result: { kind: 'table', cols: ['시료', '표면 색', '접촉각(가상)'], rows: [['세정 생략 기간 대기 스트립', '갈색 변색 ⚠', '78° ⚠'], ['세정 후 스트립', '고름', '32°']] }, note: 'bare Cu 리드프레임은 열 공정과 관리되지 않은 환경에서 대기하는 동안 표면 산화가 위험합니다(ASEMEP 논문).' },
        { id: 'emc', icon: '💊', purpose: '바뀐 EMC LOT의 이력과 보관 상태를 봅니다.', label: 'EMC 입고 LOT·보관 기록', group: '자재 이력', cost: 10, parts: ['tablet'], observe: { normal: '보관 조건을 지켰고 해동 시간대로 썼습니다.', abnormal: '보관·해동 기록이 어긋납니다.' }, score: { data: 2 }, key: true, result: { kind: 'text', text: '새 EMC LOT은 박리 LOT과 이번 주 정상 LOT에 똑같이 쓰였습니다. 보관·해동 기록도 정상입니다.' }, note: '같은 EMC로 이번 주 LOT이 정상 → EMC 원인 가능성은 낮습니다.' },
        { id: 'precon', icon: '🌡️', purpose: '프리컨디셔닝 조건(흡습·리플로)이 정해진 대로였는지 봅니다.', label: '프리컨디셔닝 조건 기록 (흡습·리플로 프로파일)', group: '시험 조건', cost: 10, observe: { normal: '정해진 흡습 조건과 리플로 프로파일대로 진행했습니다.', abnormal: '흡습 시간이 길거나 리플로 온도가 높았습니다.' }, score: { data: 2 }, key: true, result: { kind: 'table', cols: ['항목', '박리 LOT 시료', '정상 LOT 시료'], rows: [['흡습 조건', '기준대로', '기준대로'], ['리플로 프로파일', '기준대로 (같은 오븐)', '기준대로 (같은 오븐)'], ['리플로 횟수', '3회', '3회']] }, note: '시험 조건이 같았습니다 → 시험 조건 때문에 박리가 생긴 것은 아닙니다.' },
        { id: 'samref', icon: '🎯', purpose: 'C-SAM 장비가 제대로 보는지 기준 시료로 확인합니다.', label: 'C-SAM 기준 시료 재검사', group: '시험 조건', cost: 5, score: { data: 1 }, result: { kind: 'text', text: '박리가 없는 기준 시료는 정상으로, 박리 기준 시료는 박리로 정확히 나옵니다.' }, note: '검사 장비 쪽 오류 가능성이 낮아집니다.' },
        { id: 'moldrecipe', icon: '🧾', purpose: '몰딩 조건이 주말과 평일에 같았는지 봅니다.', label: '몰드 프레스 2호기 Recipe 비교', group: '공정 Recipe', cost: 5, parts: ['mold', 'press'], score: { data: 1 }, result: { kind: 'table', cols: ['항목', '주말', '이번 주'], rows: [['금형 온도', '기준', '기준'], ['트랜스퍼 압력', '기준', '기준'], ['경화 시간', '기준', '기준']] }, note: '몰딩 조건은 같았습니다.' },
        { id: 'clean', icon: '🧽', purpose: '금형 클리닝 이력을 봅니다.', label: '금형 클리닝 이력', group: '설비 로그', cost: 5, parts: ['mold'], score: {}, result: { kind: 'log', lines: ['금요일 정기 클리닝 완료', '주말 이형 불량 알람 없음'] }, note: '이번 문제와는 관련이 적었습니다.' },
        { id: 'env', icon: '💧', purpose: '작업장 온습도를 봅니다.', label: '클린룸 온습도 기록', group: '관련 품질 데이터', cost: 5, score: {}, result: { kind: 'text', text: '평소 범위입니다.' }, note: '작업장 환경 자체는 평소와 같았습니다.' },
      ],
      hints: [
        '같은 프레스·같은 EMC인데 왜 4개 LOT만 박리가 났을까요? 그 LOT들이 "다르게 거친 길"이 있을까요?',
        '주말에 고장 난 설비는 무엇이었고, 그동안 LOT은 어떻게 처리됐을까요?',
        '공정 경로 이력 → 세정 여부별 C-SAM 비교 → 리드프레임 표면 → EMC·시험 조건(다른 가설 지우기) 순서가 효율적입니다.',
      ],
      next: 'hypo',
    },

    hypo: {
      type: 'hypothesis',
      step: 4,
      title: '원인 분석',
      goal: '가장 유력한 원인 가설을 고르고, 뒷받침하는 데이터를 고릅니다.',
      prompt: '지금까지 확인한 데이터로 볼 때 가장 유력한 원인은 무엇입니까?',
      options: [
        {
          id: 'plasma',
          text: '세정기 고장 중 "세정 생략"으로 진행한 LOT의 리드프레임 표면(산화·불순물) 때문에 몰드 접착이 약해졌고, 리플로 때 습기 증기압에 계면이 벌어짐',
          correct: true,
          support: ['route', 'samsplit', 'surface', 'emc', 'precon', 'samref', 'moldrecipe'],
          feedback: '맞습니다. 박리 LOT만 세정 생략 경로였고, 같은 주말이라도 세정한 LOT은 정상입니다. EMC·시험 조건·검사 장비·몰딩 조건은 데이터로 지워집니다.',
          missing: { samsplit: '세정 여부별 비교가 없으면 "세정 생략"과 박리의 관계는 추측에 머뭅니다.' },
        },
        { id: 'emc', text: '새 EMC LOT의 흡습·불량', feedback: '같은 EMC를 쓴 이번 주 LOT은 정상이고 보관 기록도 정상입니다.', refute: ['emc'] },
        { id: 'precon', text: '프리컨디셔닝 조건이 지나쳤음(시험이 만든 박리)', feedback: '박리 LOT과 정상 LOT 시료가 같은 조건·같은 오븐으로 시험했습니다.', refute: ['precon'] },
        { id: 'sam', text: 'C-SAM 검사 오류', feedback: '기준 시료 재검사가 정확했습니다.', refute: ['samref'] },
        { id: 'mold', text: '몰드 프레스 2호기 조건 이상', feedback: '주말과 이번 주 Recipe가 같고, 같은 2호기에서 세정한 LOT은 정상입니다.', refute: ['moldrecipe', 'samsplit'] },
      ],
      score: { correct: 8, retry: 4, evidenceEach: 2, evidenceMax: 7 },
      essay: { label: '가설 설명 (선택)', placeholder: '왜 이 가설이 가장 유력한지 근거와 함께 써 보세요.' },
      hints: [
        '박리 LOT만 거친 "예외 경로"가 있었나요?',
        '같은 주말·같은 프레스인데 결과가 갈린 조건은 무엇이었나요?',
        '경로 이력, 세정 여부별 C-SAM, 표면 상태, 반증(EMC·시험 조건·검사 장비·Recipe)을 함께 근거로 드세요.',
      ],
      next: 'know',
    },

    know: {
      type: 'quiz',
      step: 5,
      title: '조치 전 점검: 박리의 원리와 판정',
      goal: '대책을 정하기 전에 박리가 생기는 원리와 출하 판정 기준을 확인합니다.',
      questions: [
        {
          id: 'k1',
          prompt: '플라스틱 패키지가 리플로(납땜) 때 박리되거나 "팝콘" 균열이 생기는 이유로 맞는 것은?',
          choices: ['패키지가 흡수한 습기가 리플로 고온에서 증기가 되어 내부 압력이 크게 오르기 때문', '리플로 때 전류가 흘러 칩이 타기 때문', '와이어가 녹아 끊어지기 때문', '몰드 색이 바래기 때문'],
          answer: 0,
          points: 8,
          explain: '비기밀 패키지 속 습기의 증기압은 리플로의 높은 온도에서 크게 오르고, 그 응력으로 패키지가 부풀고 갈라질 수 있습니다("팝콘" 현상, NASA NEPP).',
        },
        {
          id: 'k2',
          prompt: 'NASA NEPP 보고서가 설명한 J-STD-020 프리컨디셔닝 통과 조건으로 맞는 것은?',
          choices: ['전기 검사와 초음파 현미경(C-SAM) 검사를 모두 통과해야 한다', '전기 검사만 통과하면 된다', '외관 검사만 통과하면 된다', '리플로를 1회 견디면 된다'],
          answer: 0,
          points: 7,
          explain: '보고서는 J-STD-020을 통과하려면 전기 검사와 초음파 현미경(C-SAM) 검사 두 가지를 모두 통과해야 한다고 적었습니다. 그래서 전기 검사 통과만으로 출하할 수 없습니다.',
        },
      ],
      hints: ['리플로는 아주 뜨거운 공정입니다. 패키지 속 습기는 어떻게 될까요?', '이번 LOT은 전기 검사를 통과했는데도 문제가 됐습니다.', '두 문제 모두 첫 번째 보기가 맞는지 다시 확인해 보세요.'],
      next: 'action',
    },

    action: {
      type: 'choice',
      step: 5,
      title: '조치 선택',
      goal: '원인을 막는 조치를 하나 고릅니다.',
      prompt: '어떤 조치를 하시겠습니까?',
      options: [
        { id: 'restore', cost: 25, text: '몰딩 투입은 플라즈마 세정을 거친 경로로만 허용하고, 세정 생략 기간에 대기하던 리드프레임은 표면 상태를 확인해 쓰지 않는다. 첫 LOT은 프리컨디셔닝 + C-SAM으로 확인한다', score: { fix: 15 }, tone: 'good', log: '세정 경로 복구·생략 금지 + 대기 리드프레임 격리 + 첫 LOT C-SAM', status: '정상 경로로 재개', next: 'r_good', feedback: '원인(세정 생략 경로와 표면 상태)을 직접 막고, 몰딩 조건은 건드리지 않았습니다.' },
        { id: 'bake', cost: 20, text: '박리 LOT을 베이크해 습기를 뺀 뒤 출하한다', score: { fix: 2 }, tone: 'warn', log: '박리 LOT 베이크 후 출하 검토', next: 'r_bake', feedback: '베이크는 흡습을 빼는 절차(J-STD-033)지만, 이미 벌어진 계면을 붙이지는 못합니다.' },
        { id: 'emcchange', cost: 15, text: 'EMC를 예전 LOT으로 되돌린다', score: { fix: 3 }, tone: 'warn', log: 'EMC 예전 LOT으로 교체', next: 'r_emc', feedback: 'EMC는 원인이 아니었습니다. 세정 생략 경로는 그대로입니다.' },
        { id: 'pressure', cost: 10, text: '몰딩 압력과 금형 온도를 올려 접착을 강하게 한다', score: { fix: 0 }, tone: 'bad', log: '몰딩 압력·온도 상향', status: '조건 변경 후 재개', next: 'r_pressure', feedback: '원인(표면 상태)은 그대로 둔 채 조건으로 덮는 조치입니다.' },
      ],
      hints: ['원인은 "몰딩 조건"이었나요, "몰딩 전 표면을 준비하는 경로"였나요?', '이미 박리된 LOT을 살리는 일과, 앞으로 박리가 안 생기게 하는 일을 구분해 보세요.', '세정 경로만 허용 + 대기 리드프레임 격리 + 첫 LOT 프리컨디셔닝·C-SAM 확인입니다.'],
    },

    r_good: {
      type: 'outcome',
      step: 5,
      title: '조치 결과',
      tone: 'ok',
      text: '세정 경로로 몰딩한 첫 LOT은 프리컨디셔닝 뒤 C-SAM에서 박리가 없었습니다.',
      table: { virtual: true, cols: ['항목', '결과', '판정'], rows: [['C-SAM 박리', '시료 22개 중 0개', '✓'], ['전기 검사', '통과', '✓'], ['외관', '이상 없음', '✓']] },
      next: 'verify',
    },
    r_bake: {
      type: 'outcome',
      step: 5,
      title: '조치 결과',
      tone: 'warn',
      text: '베이크한 박리 LOT 시료를 다시 C-SAM으로 봤지만 박리는 그대로였습니다. 그사이 새로 몰딩한 LOT에도 세정 생략 기간의 리드프레임이 섞여 들어갔습니다.',
      table: { virtual: true, cols: ['항목', '결과'], rows: [['베이크 뒤 C-SAM (박리 LOT)', '박리 그대로 ✕'], ['새 LOT 중 대기 리드프레임 사용', '1 LOT ⚠']] },
      lesson: '베이크는 습기를 빼는 절차이지 붙지 않은 계면을 붙이는 방법이 아닙니다. 원인 경로를 먼저 막아야 합니다.',
      next: 'recover',
    },
    r_emc: {
      type: 'outcome',
      step: 5,
      title: '조치 결과',
      tone: 'warn',
      text: 'EMC를 바꿨지만, 세정 생략 기간에 대기하던 리드프레임으로 몰딩한 LOT에서 다시 박리가 나왔습니다.',
      table: { virtual: true, cols: ['LOT', 'EMC', '리드프레임', 'C-SAM 박리'], rows: [['재개 LOT 1', '예전 LOT', '대기 스트립', '시료 11개 중 4개 ✕'], ['재개 LOT 2', '예전 LOT', '새 스트립 + 세정', '0']] },
      lesson: '자재를 바꿔도 원인(표면 상태·세정 생략)이 남아 있으면 같은 불량이 반복됩니다.',
      next: 'recover',
    },
    r_pressure: {
      type: 'outcome',
      step: 5,
      title: '조치 결과',
      tone: 'bad',
      text: '조건을 올렸지만 대기 리드프레임으로 만든 LOT에서는 여전히 박리가 나왔고, 일부 스트립 리드에 플래시(새어 나온 수지)가 생겼습니다.',
      table: { virtual: true, cols: ['항목', '결과'], rows: [['C-SAM 박리 (대기 스트립)', '시료 11개 중 3개 ✕'], ['플래시', '스트립 10개 중 2개 ✕']] },
      lesson: '압력이 지나치면 금형 틈으로 수지가 새어 나올 수 있습니다(몰드 프레스 규칙표, 교육용 가설). 원인을 그대로 두고 조건으로 덮으면 새 불량이 생깁니다.',
      next: 'recover',
    },

    recover: {
      type: 'choice',
      step: 5,
      title: '판단 수정',
      goal: '새 결과를 보고 조치를 고칩니다.',
      prompt: '이제 어떻게 하시겠습니까?',
      options: [
        { id: 'rollback', cost: 25, text: '바꾼 조건이 있으면 원래대로 되돌리고, 세정 경로만 허용·대기 리드프레임 격리 후 첫 LOT을 프리컨디셔닝 + C-SAM으로 확인한다', score: { fix: 6 }, tone: 'good', log: '조건 원복 + 세정 경로 복구 + 첫 LOT C-SAM', status: '정상 경로로 재개', next: 'r_good', feedback: '좋습니다. 결과를 보고 판단을 고친 것도 중요한 역량입니다.' },
        { id: 'more', cost: 10, text: '압력을 조금 더 올려 본다', score: { fix: -3, know: -3 }, tone: 'bad', log: '몰딩 압력 추가 상향', next: 'recover', feedback: '원인을 그대로 둔 채 조건을 더 바꾸면 플래시 같은 새 불량만 늘어납니다. 다시 고르세요.' },
      ],
      hints: ['처음 확인한 원인 경로는 지금 막혀 있나요?', '바꾼 조건이 있다면 먼저 원래대로 돌려야 하지 않을까요?', '조건 원복 + 세정 경로 복구 + 대기 리드프레임 격리 + 첫 LOT 확인입니다.'],
    },

    verify: {
      type: 'choice',
      multi: true,
      step: 6,
      title: '검증 및 재발 방지',
      goal: '정상 복귀를 무엇으로 판단하고, 다시 생기지 않게 무엇을 할지 고릅니다.',
      prompt: '해당하는 것을 모두 고르세요.',
      options: [
        { id: 'multi', cost: 20, text: '재개 뒤 여러 LOT을 프리컨디셔닝 + C-SAM으로 확인한다', score: { verify: 5 }, tone: 'good', log: '여러 LOT 프리컨디셔닝·C-SAM 확인' },
        { id: 'holdlot', cost: 10, text: 'Hold한 주말 LOT은 C-SAM 결과로 판정하고, 박리 LOT은 출하하지 않는다', score: { verify: 3 }, tone: 'good', log: '주말 LOT C-SAM 판정 · 박리 LOT 출하 금지' },
        { id: 'interlock', cost: 10, text: 'MES에서 플라즈마 세정 기록이 없으면 몰딩 투입을 막고, 임시 우회 승인 때는 C-SAM 확인을 필수 조건으로 붙인다', score: { verify: 4 }, tone: 'good', log: '세정 누락 시 투입 잠금 · 우회 승인 조건 강화' },
        { id: 'staging', cost: 10, text: 'bare Cu 리드프레임의 대기 시간과 보관 환경 기준을 정한다', score: { verify: 3 }, tone: 'good', log: '리드프레임 대기·보관 기준 설정' },
        { id: 'once', cost: 0, text: '첫 LOT이 정상이니 바로 종료한다', score: { verify: -5 }, tone: 'bad', log: '1 LOT 확인 후 종료', feedback: '여러 LOT으로 확인해야 우연을 배제할 수 있습니다.' },
        { id: 'norecord', cost: 0, text: '원인 기록 없이 정상 생산으로 돌아간다', score: { verify: -3 }, tone: 'bad', log: '기록 없이 종료', feedback: '다음에 세정기가 고장 나면 같은 우회 승인이 반복됩니다.' },
      ],
      essay: { label: '재발 방지 대책 (선택)', placeholder: '내가 생각하는 재발 방지 대책을 써 보세요.' },
      hints: ['한 LOT 결과만으로 충분할까요?', '다음에 세정기가 또 고장 나면 어떻게 되도록 해야 할까요?', '여러 LOT 확인, Hold LOT 판정, 세정 누락 잠금·우회 조건, 리드프레임 대기 기준입니다.'],
      next: 'end',
    },
    end: { type: 'end', step: 6, title: '결과 평가' },
  },

  steps: ['현장 상황 전달', '초기 대응 판단', '데이터 수집', '원인 분석', '조치 및 검증', '결과 평가'],

  model: [
    '전기 검사를 통과했어도 박리가 확인됐으므로 출하하지 않는다. 주말 몰딩 LOT을 모두 Hold하고 C-SAM으로 범위를 확인한다. 공정 이력을 확보하고 공유한다.',
    'LOT별 공정 경로를 본다 → 박리 LOT만 세정기 고장 중 "세정 생략" 임시 승인 경로였다.',
    '세정 여부별 C-SAM 비교로 관계를 확인하고, 대기하던 리드프레임 표면 변색을 확인한다.',
    'EMC·프리컨디셔닝 조건·C-SAM 기준 시료·몰딩 Recipe로 다른 가설을 지운다.',
    '몰딩 조건은 바꾸지 않는다. 세정 경로만 허용하고, 대기 리드프레임을 격리한 뒤 첫 LOT을 프리컨디셔닝 + C-SAM으로 확인한다.',
    '여러 LOT으로 정상 복귀를 판단하고, Hold LOT은 C-SAM 결과로 처리한다.',
    '재발 방지: 세정 기록 없으면 몰딩 투입 잠금, 우회 승인 때 C-SAM 필수, 리드프레임 대기·보관 기준.',
  ],
}
