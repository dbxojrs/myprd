// PKG-001 (예전 CASE-WB-001): Wire Bonding 접합 강도 이상 (분기형 현장 실무 시나리오)
// ⚠ 모든 사건·수치·로그는 교육용 가상 데이터입니다. 실제 업체·장비의 규격이나 사양이 아닙니다.
// 원인·불량에 대한 설명은 앱의 와이어 본더 규칙표(data/machines/wireBond.js)에 있는 내용만 근거로 씁니다.
// 구조 설명은 lib/fieldSim.js 맨 위 주석을 보세요.

export default {
  id: 'PKG-001',
  legacyIds: ['CASE-WB-001'], // 예전 id로 저장된 진행 기록을 옮길 때 씁니다(lib/migrations.js)
  category: 'PKG',
  processLabel: 'Wire Bonding',
  difficulty: '중급',
  equipment: { name: '와이어 본더 2호기', kind: 'wire-bond' },
  competencies: ['긴급 대응', '측정 신뢰성 검증', '가설 검증', '변경 관리'],
  version: '1.1',
  reviewed: false,
  updated: '2026-11-24',
  title: 'Wire Bonding 접합 강도 이상',
  subtitle: '2호기 Ball Shear 값 급락 — Capillary 교체 1시간 뒤',
  process: 'wire-bond',
  machine: 'wire-bond',
  level: '중',
  minutes: 25,
  roles: ['공정기술', '생산기술', '품질관리'],
  goals: [
    '이상이 생기면 원인보다 먼저 불량 확산을 막는다(설비 중단·영향 LOT 격리).',
    '측정 결과를 믿기 전에 측정 자체가 맞는지 확인한다.',
    '"그때 무엇이 바뀌었나"로 가설을 세우고 데이터로 검증한다.',
    '원인 확인 없이 공정 조건을 바꾸지 않는다(변경 관리).',
    '한 번의 정상 측정이 아니라 충분한 데이터로 정상 복귀를 판단한다.',
  ],
  assumptions: [
    '모든 수치(gf, μm, 시간, 수량)는 교육용으로 만든 가상 데이터입니다. 실제 관리 규격이 아닙니다.',
    '설비 로그·검사 결과는 판단 연습을 위해 단순화했습니다. 실제 현장은 확인 항목과 절차가 더 많습니다.',
    '"가상 시간"은 데이터 확인에 드는 시간을 단순하게 나타낸 것입니다.',
    '원인·불량 설명은 앱의 와이어 본더 규칙표를 근거로 하며 전문가 검수 전입니다.',
  ],
  sources: ['hynix-be-6', 'oa-capillary-2021', 'ufl-wirebond-sop'],
  related: [
    { kind: 'process', id: 'wire-bond', label: '와이어 본딩 공정 설명' },
    { kind: 'machine', id: 'wire-bond', label: '와이어 본더 설비 실습' },
    { kind: 'screen', id: 'cases', label: '사례 서술형 연습' },
  ],

  // 평가 기준(총 100점). 선택형 점수는 아래 각 선택지·데이터에 적힌 규칙대로만 계산합니다.
  rubric: [
    { id: 'contain', label: '긴급 대응', points: 20, desc: '설비 중단, 영향 LOT 격리, 정보 공유' },
    { id: 'know', label: '공정 지식', points: 15, desc: '조건 변경이 만드는 새 불량을 아는가' },
    { id: 'data', label: '데이터 분석', points: 20, desc: '원인을 가를 데이터를 골라 확인했는가(시간 대비)' },
    { id: 'cause', label: '원인 분석', points: 15, desc: '가설과 근거 데이터가 맞는가' },
    { id: 'fix', label: '개선 조치', points: 15, desc: '원인을 직접 없애는 조치를 골랐는가' },
    { id: 'verify', label: '재발 방지', points: 15, desc: '정상 복귀 판단과 재발 방지 대책' },
  ],

  start: 'brief',
  nodes: {
    brief: {
      type: 'brief',
      step: 1,
      title: '현장 상황 전달',
      goal: '무슨 일이 일어났는지 파악합니다.',
      who: '생산라인 작업자 (오전 10:00)',
      report:
        '"엔지니어님, 2번 와이어 본딩 설비에서 생산한 제품의 Ball Shear Test 결과가 갑자기 낮아졌습니다. 그런데 현미경으로 보면 Ball 모양은 정상입니다. 어떻게 해야 할까요?"',
      status: [
        { label: '2호기', value: '가동 중', tone: 'warn' },
        { label: '1호기', value: '가동 중 · 정상', tone: 'ok' },
        { label: '설비 알람', value: '없음', tone: 'info' },
      ],
      table: {
        virtual: true,
        cols: ['확인 항목', '1호기 (정상)', '2호기 (이상)'],
        rows: [
          ['Ball Shear 평균', '27 gf', '16 gf ⚠'],
          ['관리 하한(가상)', '18 gf', '18 gf'],
          ['Ball 직경', '100 μm', '101 μm'],
          ['육안 검사', '정상', '정상'],
          ['설비 알람', '없음', '없음'],
          ['자재 · Recipe', '동일', '동일'],
        ],
      },
      facts: ['약 1시간 전(09:05) 2호기 Capillary를 교체했습니다.', '교체 전에는 2호기 Ball Shear도 정상 범위였습니다.', '2호기는 지금도 생산 중입니다.'],
      next: 'contain',
    },

    contain: {
      type: 'choice',
      multi: true,
      step: 2,
      title: '초기 대응 판단',
      goal: '불량이 더 퍼지지 않게 막습니다. 해당하는 조치를 모두 고르세요.',
      prompt: '현장에 도착했습니다. 지금 바로 할 조치를 모두 고르세요.',
      options: [
        { id: 'stop2', text: '2호기 생산을 즉시 멈춘다', score: { contain: 6 }, tone: 'good', log: '2호기 생산 중단', status: '2호기 정지', feedback: '관리 하한 아래 값이 나오는 설비를 계속 돌리면 불량이 계속 쌓입니다.' },
        { id: 'hold', text: 'Capillary 교체(09:05) 이후 2호기에서 만든 LOT을 찾아 Hold하고 다음 공정 투입을 막는다', score: { contain: 9 }, tone: 'good', log: '09:05 이후 2호기 LOT Hold', feedback: '이상이 시작됐을 수 있는 시점 이후 제품이 영향 범위입니다. 다음 공정으로 넘어가면 되돌리기 어렵습니다.' },
        { id: 'share', text: '품질·생산 담당에게 알리고, 발견 시각·LOT·교체 시각을 기록한다', score: { contain: 5 }, tone: 'good', log: '품질·생산 공유, 시각 기록', feedback: '영향 범위 판단과 나중의 원인 분석에 시각 기록이 꼭 필요합니다.' },
        { id: 'stop1', text: '예방 차원에서 1호기도 함께 멈춘다', score: { contain: -3 }, tone: 'warn', log: '1호기도 중단', feedback: '1호기는 같은 자재·Recipe로 정상 값(27 gf)이 나옵니다. 근거 없이 멈추면 생산 손실만 커집니다.' },
        { id: 'keeprun', text: '측정 오류일 수 있으니 확인될 때까지 2호기를 계속 돌린다', score: { contain: -8 }, tone: 'bad', log: '2호기 계속 생산', status: '2호기 가동 중 (이상 상태)', feedback: '측정 확인은 필요하지만, 그동안 생산을 계속하면 진짜 불량일 경우 피해가 계속 커집니다. 먼저 멈추고 확인합니다.' },
        { id: 'usnow', text: '초음파 출력을 바로 올려 생산을 이어 간다', score: { contain: -6, fix: -5 }, tone: 'bad', log: '원인 확인 전 초음파 출력 상향', feedback: '원인을 모르는 채 조건을 바꾸면 진짜 원인을 가리고, 초음파가 지나치면 패드 아래 층이 깨질 수 있습니다(와이어 본더 규칙표).' },
      ],
      essay: { label: '판단 이유 (선택)', placeholder: '왜 이렇게 판단했는지 짧게 써 보세요. 보고서에 그대로 들어갑니다.' },
      hints: [
        '지금 2호기에서 나오는 제품은 어떤 상태일까요? 그대로 두면 무슨 일이 생길까요?',
        '이상이 "언제부터" 시작됐을 수 있을까요? 그 이후 만든 제품은 어떻게 다뤄야 할까요?',
        '설비 중단, 09:05 이후 LOT 격리, 관련 부서 공유 — 이 세 가지가 확산 방지의 기본입니다. 정상인 1호기까지 멈출 근거가 있는지도 생각해 보세요.',
      ],
      next: 'collect',
    },

    collect: {
      type: 'data',
      step: 3,
      title: '데이터 수집',
      goal: '원인을 가를 데이터를 고릅니다. 확인에는 가상 시간이 듭니다(최대 60분).',
      prompt: '어떤 데이터부터 확인하시겠습니까? 누르면 오른쪽 패널에 결과가 열리고 기록됩니다.',
      budget: 60,
      maxScore: 'data',
      items: [
        { id: 'meas1', label: '1호기 시료를 같은 Shear 시험기로 측정', group: '검사 데이터', cost: 15, score: { data: 5 }, key: true, result: { kind: 'table', cols: ['시료', '결과'], rows: [['1호기 시료 (같은 시험기)', '26 gf · 정상']] }, note: '시험기가 1호기 시료는 정상으로 잽니다 → 시험기 자체 문제일 가능성이 낮아집니다.' },
        { id: 'meas2', label: '2호기 시료를 다른 Shear 시험기로 재측정', group: '검사 데이터', cost: 15, score: { data: 4 }, key: true, result: { kind: 'table', cols: ['시료', '결과'], rows: [['2호기 시료 (다른 시험기)', '15 ~ 17 gf · 여전히 낮음']] }, note: '다른 시험기로도 낮습니다 → 실제 접합이 약할 가능성이 큽니다.' },
        { id: 'capscope', label: '새 Capillary 팁 현미경 관찰', group: '설비 상태', cost: 10, score: { data: 6 }, key: true, result: { kind: 'text', text: '팁 끝 구멍 주변에 이물이 붙어 있습니다. 같은 박스의 새 Capillary 2개는 깨끗합니다.' }, note: '닳거나 더러운 Capillary는 볼을 고르게 누르고 문지르지 못합니다(와이어 본더 규칙표).' },
        { id: 'fracture', label: 'Shear 시험 뒤 파괴면 관찰', group: '검사 데이터', cost: 15, score: { data: 3 }, result: { kind: 'text', text: '2호기 시료 대부분이 패드와 볼 사이 경계에서 떨어졌습니다(가상 관찰 결과). 1호기 시료는 볼 쪽에서 깨졌습니다.' }, note: '어디서 떨어졌는지는 접합 자체가 약한지 판단하는 단서가 됩니다.' },
        { id: 'recipe', label: 'Recipe 비교 (1호기 vs 2호기, 교체 전후)', group: '공정 Recipe', cost: 10, score: { data: 3 }, key: true, result: { kind: 'table', cols: ['항목', '1호기', '2호기 교체 전', '2호기 교체 후'], rows: [['Bonding Force', '기준', '기준', '기준'], ['Ultrasonic Power', '기준', '기준', '기준'], ['Bond Time', '기준', '기준', '기준'], ['Stage 온도', '기준', '기준', '기준']] }, note: 'Recipe(설정값)는 바뀌지 않았습니다 → 설정값 자체가 원인일 가능성은 낮습니다.' },
        { id: 'alarm', label: '설비 알람·이벤트 로그', group: '설비 로그', cost: 5, score: { data: 1 }, result: { kind: 'log', lines: ['08:12 정기 점검 완료', '09:05 툴(Capillary) 교체 — 작업자 A', '09:08 생산 재개', '09:10~10:00 알람 없음'] }, note: '알람 없이도 품질은 나빠질 수 있습니다. 교체 시각이 로그로 확인됩니다.' },
        { id: 'caplot', label: 'Capillary 품번·입고 LOT 확인', group: '자재·교체 이력', cost: 5, score: { data: 1 }, result: { kind: 'text', text: '기존과 같은 품번입니다. 이번 달 같은 입고 LOT에서 다른 문제 보고는 없습니다.' }, note: '품번이 같으므로 "다른 부품을 잘못 달았다"는 가설은 약해집니다.' },
        { id: 'matlot', label: '와이어·리드프레임 자재 LOT 이력', group: '자재·교체 이력', cost: 10, score: { data: 1 }, result: { kind: 'text', text: '1호기와 2호기가 같은 자재 LOT을 쓰고 있습니다.' }, note: '같은 자재로 1호기가 정상 → 자재 원인 가능성은 낮습니다.' },
        { id: 'env', label: '클린룸 온습도 기록', group: '관련 품질 데이터', cost: 5, score: {}, result: { kind: 'text', text: '평소 범위입니다.' }, note: '이번 문제와는 관련이 적은 데이터였습니다.' },
        { id: 'shift', label: '작업자 교대 기록', group: '관련 품질 데이터', cost: 5, score: {}, result: { kind: 'text', text: '09:00 교대. 1호기·2호기 같은 조가 담당합니다.' }, note: '두 설비 담당이 같아 차이를 설명하지 못합니다.' },
      ],
      hints: [
        '측정 결과를 믿기 전에, 측정 자체가 맞는지 확인할 방법이 있을까요?',
        '"이상이 시작되기 직전에 바뀐 것"은 무엇이었나요? 그것의 상태를 직접 볼 수 있을까요?',
        '시험기 교차 확인(1호기 시료·다른 시험기) → 교체한 Capillary 상태 → Recipe 비교 순서가 시간 대비 가장 많은 원인을 가립니다.',
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
          id: 'cap',
          text: '새로 단 Capillary의 이상(팁 오염 등)으로 볼을 제대로 누르고 문지르지 못함',
          correct: true,
          support: ['capscope', 'meas1', 'meas2', 'recipe', 'fracture', 'matlot'],
          feedback: '맞습니다. 이상 시작 시점이 Capillary 교체와 겹치고, 팁 이물이 직접 보이며, 측정·Recipe·자재 원인은 데이터로 지워집니다.',
          missing: { capscope: 'Capillary 팁을 직접 보지 않으면 이 가설은 "추측"에 머뭅니다.' },
        },
        { id: 'meas', text: 'Shear 시험기 측정 오류', feedback: '가능성은 처음에 꼭 의심해야 합니다. 하지만 1호기 시료를 같은 시험기로 재면 정상(26 gf), 2호기 시료를 다른 시험기로 재도 낮게(15~17 gf) 나와 측정 오류로는 설명되지 않습니다.', refute: ['meas1', 'meas2'] },
        { id: 'mat', text: '와이어·패드 자재 문제', feedback: '자재 원인이라면 같은 자재를 쓰는 1호기도 나빠야 합니다. 1호기는 정상이라 가능성이 낮습니다.', refute: ['matlot'] },
        { id: 'recipe', text: 'Recipe 설정값(초음파 출력 등)이 낮게 잡혀 있음', feedback: '설정값은 교체 전후, 1호기와 모두 같습니다. 교체 전에는 같은 설정으로 정상이었으므로 설정값 자체가 원인은 아닙니다.', refute: ['recipe'] },
      ],
      score: { correct: 8, retry: 4, evidenceEach: 2, evidenceMax: 7 },
      essay: { label: '가설 설명 (선택)', placeholder: '왜 이 가설이 가장 유력한지 근거와 함께 써 보세요.' },
      hints: [
        '이상이 시작된 시점과 겹치는 사건은 무엇이었나요?',
        '측정 오류·자재·Recipe 가설은 각각 어떤 데이터로 지울 수 있었나요?',
        '시점(09:05 교체), 직접 관찰(팁 이물), 반증(1호기 정상·Recipe 동일·교차 측정)을 함께 근거로 드세요.',
      ],
      next: 'know',
    },

    know: {
      type: 'quiz',
      step: 5,
      title: '조치 전 점검: 조건 변경의 위험',
      goal: '선임 엔지니어가 "초음파 출력을 높여 보자"고 합니다. 조건을 바꾸면 무슨 일이 생길 수 있는지 먼저 확인합니다.',
      questions: [
        {
          id: 'k1',
          prompt: '초음파 출력을 지나치게 높이면 생길 수 있는 불량은?',
          choices: ['패드 아래 층 균열(크레이터링)', '와이어 쓸림(와이어끼리 닿음)', '다이 흡착 실패', '몰딩 미충전'],
          answer: 0,
          points: 8,
          explain: '초음파 출력이 지나치면 패드 아래 층에 균열(크레이터링)이 생깁니다. 와이어 쓸림·미충전은 몰딩, 흡착 실패는 다이 본더에서 생기는 문제입니다(장비 규칙표).',
        },
        {
          id: 'k2',
          prompt: 'Bonding Force(하중)를 지나치게 높였을 때 함께 볼 위험으로 맞는 것은?',
          choices: ['볼이 패드보다 넓게 퍼지고, 패드 아래가 손상될 수 있다', '볼이 더 작아져 접합 면적이 줄어든다', '와이어가 더 잘 끊긴다(테일이 길어진다)', '아무 영향이 없다'],
          answer: 0,
          points: 7,
          explain: '하중이 지나치면 볼이 넓게 퍼져 작은 패드를 벗어날 수 있고, 본딩 헤드가 패드를 세게 때려 아래 층이 깨질 수 있습니다(와이어 본더 규칙표).',
        },
      ],
      hints: ['접합을 "세게" 만드는 조건이 지나치면 접합 아래쪽은 어떻게 될까요?', '와이어 본더 설비 실습에서 하중·초음파를 "높음"으로 두고 결과를 확인해 볼 수 있습니다.', '두 문제 모두 "패드 아래 손상"과 관련됩니다.'],
      next: 'action',
    },

    action: {
      type: 'choice',
      step: 5,
      title: '조치 선택',
      goal: '원인을 없애는 조치를 하나 고릅니다. 고른 조치에 따라 결과가 달라집니다.',
      prompt: '어떤 조치를 하시겠습니까?',
      options: [
        { id: 'replace', text: '다른 새 Capillary로 바꾸고, 조건은 그대로 둔 채 첫 제품 Shear·외관을 확인한 뒤 재가동한다', score: { fix: 15 }, tone: 'good', log: 'Capillary 재교체 + 첫 제품 확인', status: 'Capillary 재교체 · 첫 제품 확인', next: 'r_good', feedback: '원인(오염된 툴)을 직접 없애고, 조건을 바꾸지 않아 새 불량 위험도 만들지 않았습니다.' },
        { id: 'clean', text: '지금 Capillary를 청소해서 다시 쓴다', score: { fix: 6 }, tone: 'warn', log: 'Capillary 청소 후 재사용', status: '청소한 툴로 재가동', next: 'r_clean', feedback: '원인 쪽으로 가는 조치지만, 이물이 붙었던 툴은 상태를 장담하기 어렵습니다.' },
        { id: 'us_up', text: '초음파 출력을 높여 강도를 맞추고 재가동한다', score: { fix: 0 }, tone: 'bad', log: '초음파 출력 상향 후 재가동', status: '조건 변경 후 재가동', next: 'r_us', feedback: '원인(툴)은 그대로 둔 채 조건으로 덮는 조치입니다.' },
        { id: 'doe', text: '변경 승인을 받아 하중·초음파 조합을 소량 시험(DOE)으로 찾는다', score: { fix: 5 }, tone: 'warn', log: '조건 최적화 시험 요청', status: '2호기 정지 · 조건 시험 대기', next: 'r_doe', feedback: '변경 절차는 지켰지만, 원인이 툴로 확인된 상황에서 조건을 찾는 것은 돌아가는 길입니다.' },
      ],
      hints: [
        '원인으로 확인한 것은 "조건"이었나요, "툴"이었나요?',
        '원인을 직접 없애는 조치와, 결과만 맞추는 조치를 구분해 보세요.',
        '오염된 툴을 새것으로 바꾸고, 조건은 그대로 둔 채 첫 제품을 확인하는 것이 가장 직접적입니다.',
      ],
    },

    r_good: {
      type: 'outcome',
      step: 5,
      title: '조치 결과',
      tone: 'ok',
      text: '새 Capillary로 바꾼 뒤 첫 제품 Shear가 정상으로 돌아왔습니다.',
      table: { virtual: true, cols: ['시료', 'Ball Shear', '판정'], rows: [['첫 제품 5개 평균', '26.4 gf', '✓ 정상'], ['첫 제품 최솟값', '24.1 gf', '✓ 하한 18 gf보다 여유'], ['외관·볼 직경', '정상', '✓']] },
      next: 'verify',
    },
    r_clean: {
      type: 'outcome',
      step: 5,
      title: '조치 결과',
      tone: 'warn',
      text: '청소 직후에는 23 gf로 회복했지만, 2시간 뒤 다시 19 gf까지 떨어졌습니다. 팁 끝에 미세한 손상이 보입니다.',
      table: { virtual: true, cols: ['시점', 'Ball Shear 평균'], rows: [['청소 직후', '23.0 gf'], ['1시간 뒤', '21.2 gf'], ['2시간 뒤', '19.1 gf ⚠']] },
      next: 'recover',
    },
    r_us: {
      type: 'outcome',
      step: 5,
      title: '조치 결과',
      tone: 'bad',
      text: 'Shear 평균은 22 gf로 올라 겉보기엔 회복했습니다. 그런데 품질팀의 패드 단면 검사에서 일부 시료 패드 아래에 균열(크레이터링)이 발견됐습니다.',
      table: { virtual: true, cols: ['항목', '결과'], rows: [['Ball Shear 평균', '22.0 gf'], ['패드 아래 균열', '검사 시료 20개 중 3개 ✕'], ['Capillary 팁', '여전히 이물 부착']] },
      lesson: '초음파 출력이 지나치면 패드 아래 층에 균열이 생깁니다(와이어 본더 규칙표). 원인(툴)을 그대로 두고 조건으로 덮으면 새 불량이 생길 수 있습니다.',
      next: 'recover',
    },
    r_doe: {
      type: 'outcome',
      step: 5,
      title: '조치 결과',
      tone: 'warn',
      text: '조건 시험 계획을 세우는 동안 2호기는 계속 멈춰 있습니다. 선임 엔지니어가 묻습니다: "원인이 툴이라면, 조건을 바꾸기 전에 툴부터 확인해야 하지 않을까요?"',
      next: 'recover',
    },

    recover: {
      type: 'choice',
      step: 5,
      title: '판단 수정',
      goal: '새 결과를 보고 조치를 고칩니다.',
      prompt: '이제 어떻게 하시겠습니까?',
      options: [
        { id: 'rollback', text: '바꾼 조건이 있으면 원래대로 되돌리고, 새 Capillary로 교체한 뒤 첫 제품 Shear와 패드 손상을 함께 확인한다', score: { fix: 6 }, tone: 'good', log: '조건 원복 + Capillary 교체 + 첫 제품 확인', status: '조건 원복 · 툴 교체', next: 'r_good', feedback: '좋습니다. 결과를 보고 판단을 고친 것도 중요한 역량입니다.' },
        { id: 'more_us', text: '조건을 조금 더 조정해 맞춘다', score: { fix: -3, know: -3 }, tone: 'bad', log: '조건 추가 조정', next: 'recover', feedback: '원인을 그대로 둔 채 조건을 더 바꾸면 손상 위험이 더 커집니다. 다시 고르세요.' },
      ],
      hints: ['처음 확인한 원인(툴)은 지금 해결됐나요?', '조건을 바꾼 것이 있다면 그것부터 원래대로 돌려야 하지 않을까요?', '조건 원복 + 툴 교체 + 첫 제품 확인입니다.'],
    },

    verify: {
      type: 'choice',
      multi: true,
      step: 6,
      title: '검증 및 재발 방지',
      goal: '정상 복귀를 무엇으로 판단하고, 다시 생기지 않게 무엇을 할지 고릅니다.',
      prompt: '해당하는 것을 모두 고르세요.',
      options: [
        { id: 'multi', text: '여러 시간대·여러 LOT에서 충분한 수의 시료로 Shear를 확인한다', score: { verify: 5 }, tone: 'good', log: '여러 LOT·시간대 Shear 확인' },
        { id: 'minval', text: '평균뿐 아니라 최솟값이 하한보다 여유 있는지, 1호기와 비슷한지 본다', score: { verify: 3 }, tone: 'good', log: '최솟값·1호기 비교' },
        { id: 'crater', text: '패드 아래 손상 같은 새 불량이 없는지도 함께 확인한다', score: { verify: 2 }, tone: 'good', log: '패드 손상 확인' },
        { id: 'sop', text: 'Capillary 교체 뒤 첫 제품 Shear 확인을 표준 절차에 넣는다', score: { verify: 3 }, tone: 'good', log: '교체 후 첫 제품 확인 표준화' },
        { id: 'incoming', text: '같은 박스·LOT의 Capillary를 점검하고, 입고 때 팁 상태 확인을 넣는다', score: { verify: 2 }, tone: 'good', log: 'Capillary 입고 점검 추가' },
        { id: 'holdlot', text: 'Hold한 LOT은 시료 검사 결과로 출하·재작업·폐기를 정한다', score: { verify: 2 }, tone: 'good', log: 'Hold LOT 처리 기준 결정' },
        { id: 'once', text: '첫 제품이 한 번 정상으로 나왔으니 바로 종료한다', score: { verify: -5 }, tone: 'bad', log: '1회 측정 후 종료', feedback: '한 번의 결과는 우연일 수 있습니다. 여러 시료·시간대로 확인해야 합니다.' },
        { id: 'norecord', text: '원인 기록 없이 정상 생산으로 돌아간다', score: { verify: -3 }, tone: 'bad', log: '기록 없이 종료', feedback: '기록이 없으면 같은 문제가 다시 생겼을 때 빨리 대응할 수 없습니다.' },
      ],
      essay: { label: '재발 방지 대책 (선택)', placeholder: '내가 생각하는 재발 방지 대책을 써 보세요. 보고서에 들어갑니다.' },
      hints: ['한 번 정상으로 나온 결과만으로 충분할까요?', '이번 일이 다시 생기지 않으려면 "교체할 때" 무엇을 확인해야 할까요?', '여러 시료·시간대, 최솟값, 새 불량 확인 + 교체 후 첫 제품 확인 표준화 + 입고 점검입니다.'],
      next: 'end',
    },
    end: { type: 'end', step: 6, title: '결과 평가' },
  },

  // 단계 표시(왼쪽 패널)
  steps: ['현장 상황 전달', '초기 대응 판단', '데이터 수집', '원인 분석', '조치 및 검증', '결과 평가'],

  // 모범 대응 절차
  model: [
    '2호기를 멈추고, 09:05 Capillary 교체 이후 LOT을 Hold해 다음 공정 투입을 막는다. 품질·생산에 공유하고 시각을 기록한다.',
    '측정부터 확인한다: 1호기 시료를 같은 시험기로, 2호기 시료를 다른 시험기로 잰다 → 측정 오류를 지운다.',
    '"그때 바뀐 것"인 Capillary를 직접 관찰한다 → 팁 이물 확인. Recipe·자재는 1호기와 같아 원인에서 지운다.',
    '조건(초음파·하중)은 바꾸지 않는다. 지나치면 패드 아래 손상 같은 새 불량이 생길 수 있다.',
    '새 Capillary로 교체하고 첫 제품 Shear·외관을 확인한 뒤 재가동한다.',
    '여러 시간대·LOT의 Shear(평균과 최솟값), 패드 손상 여부로 정상 복귀를 판단한다. Hold LOT은 시료 검사로 처리한다.',
    '재발 방지: 교체 후 첫 제품 확인을 표준 절차로, Capillary 입고 점검 추가, 경위를 기록한다.',
  ],
}
