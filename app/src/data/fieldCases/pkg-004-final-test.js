// PKG-004: Final Test 수율 급락 (분기형 현장 실무 시나리오)
// ⚠ 모든 사건·수치·로그는 교육용 가상 데이터입니다. 실제 업체·장비의 규격이나 사양이 아닙니다.
// 근거
//   - 실패가 제품을 따라가는지(여러 사이트·장비에서 같은 칩이 실패) 위치를 따라가는지(같은 사이트·소켓에서 다른 칩이 실패)로
//     제품 불량과 테스트 환경 문제를 가르고, 소켓을 사이트끼리 맞바꿔 오류가 하드웨어를 따라가는지 본다: Semiconductor Engineering 기사(설명 출처)
//   - 반복 삽입으로 생긴 찌꺼기·접점 마모 → 접촉 저항 증가 → 재검사율 증가 → 일정 수준에서 소켓 청소: Semiconductor Engineering 재검사 기사(설명 출처)
//   - 멀티 사이트에서 낮은 수율 사이트("bad site")를 찾고 몰려 있는 불량을 본다: ASEMEP 학회 논문(onsemi)
// 사건 구조와 수치는 교육용 가정입니다. 전문가 검수 전입니다.

export default {
  id: 'PKG-004',
  category: 'PKG',
  processLabel: 'Final Test',
  difficulty: '고급',
  equipment: { name: '테스트 핸들러 H3 + ATE (4사이트 병렬)', kind: 'test', diagram: 'iso' },
  competencies: ['제품 불량과 테스트 환경 구분', '사이트·Bin 데이터 분석', '양품 손실 막기', '판정 기준 지키기'],
  version: '1.0',
  reviewed: false,
  updated: '2026-11-24',
  title: 'Final Test 수율 급락',
  subtitle: '핸들러 H3 수율 98% → 94% — 같은 제품의 다른 핸들러는 정상',
  process: 'test',
  machine: 'test',
  level: '상',
  minutes: 30,
  roles: ['테스트 엔지니어', '생산', '품질관리'],
  goals: [
    '불량 판정된 칩을 바로 버리지 않는다. 테스트 환경 문제라면 양품을 버리게 된다.',
    '판정 기준을 느슨하게 바꿔 수율을 맞추지 않는다.',
    '실패가 "칩"을 따라가는지 "사이트·소켓"을 따라가는지로 원인 쪽을 가른다.',
    '사이트별 수율과 Bin(불량 종류)을 나눠 본다.',
    '소켓 청소·교체 뒤 사이트별로 다시 확인하고, 청소 주기를 지킨다.',
  ],
  assumptions: [
    '모든 수치(수율 %, Bin 수, 삽입 횟수, 시간)는 교육용으로 만든 가상 데이터입니다. 실제 관리 규격이 아닙니다.',
    '4사이트 병렬 테스트와 사이트 번호는 설명을 위해 단순화했습니다.',
    '"소켓을 맞바꾸면 불량이 소켓을 따라간다"는 결과는 교육용 가정입니다.',
    '원인·대응 설명은 업계 매체 기사(설명 출처)와 학회 논문을 근거로 하며 전문가 검수 전입니다.',
  ],
  sources: ['kjmr-socket', 'asemep-bad-sites', 'sens-ocap-probe', 'semieng-test-cell', 'semieng-unit-retest', 'hynix-be-1-test'],
  related: [
    { kind: 'process', id: 'test', label: '테스트 공정 설명' },
    { kind: 'machine', id: 'test', label: '테스트 핸들러 설비 실습' },
    { kind: 'screen', id: 'datalab', label: '공정 데이터 분석 (Bin Pareto)' },
  ],

  // 현장 상황 개요(현장 보기)와 테스트 셀 개념도 설정. 수치는 아래 brief 표와 같은 가상 데이터입니다.
  // diagram.flags는 해당 데이터(after)를 확인한 뒤에만 그림에 표시합니다(정답 미리 노출 방지).
  scene: {
    location: '테스트 라인 · 핸들러 H3',
    clock: '오전 7:40 보고 (어젯밤 11시 무렵 LOT부터 저하)',
    startClock: '07:40',
    state: 'H3 수율 저하',
    metrics: {
      title: '핸들러별 최근 2 LOT 수율',
      unit: '%',
      max: 100,
      rows: [
        { label: 'H1', value: 98.1 },
        { label: 'H2', value: 97.9 },
        { label: 'H3', value: 94.0, flag: true, flagText: '저하' },
      ],
      note: 'H1·H2·H3는 같은 제품·같은 테스트 프로그램·같은 웨이퍼 LOT 묶음을 검사하는 핸들러입니다(같은 기준의 비교).',
    },
    diagram: {
      handler: '핸들러 H3',
      sites: 4,
      flags: [
        { after: 'site', site: 2, text: '사이트 2 수율 85.6 % (확인한 데이터)' },
        { after: 'swap', text: '소켓을 맞바꾸자 불량이 소켓을 따라 옮겨 감 (확인한 데이터)' },
      ],
    },
  },

  timeLimit: 180,
  timeRule: { cat: 'contain', penalty: 5, text: '목표 시간(가상 180분) 안에 원인 쪽을 가르지 못해, 그동안 H3의 테스트 대기 물량이 쌓였습니다.' },

  checks: [
    { q: '위험한 조치(불량품 즉시 폐기, 판정 기준 완화)를 피했는가?', rule: { notPicked: ['contain.scrap', 'contain.loosen', 'action.loosen', 'action.scrap', 'recover.more'] } },
    { q: '불량품과 테스트 기록을 보존했는가?', rule: { picked: ['contain.hold', 'contain.datalog'] } },
    { q: '사이트별로 나눠 봤는가?', rule: { viewedAny: ['site'] } },
    { q: '실패가 칩을 따라가는지 위치를 따라가는지 확인했는가?', rule: { viewedAny: ['retest', 'swap'] } },
    { q: '조치 뒤 사이트별 수율로 검증했는가?', rule: { picked: ['verify.multi'], notPicked: ['verify.once'] } },
  ],
  similar: ['cases:ft-yield', 'PKG-001'],

  rubric: [
    { id: 'contain', label: '긴급 대응', points: 20, desc: '투입 조정, 불량품·기록 보존, 공유' },
    { id: 'know', label: '공정 지식', points: 15, desc: '테스트 환경 문제를 가르는 원리를 아는가' },
    { id: 'data', label: '데이터 분석', points: 20, desc: '원인을 가를 데이터를 골라 확인했는가(시간 대비)' },
    { id: 'cause', label: '원인 분석', points: 15, desc: '가설과 근거 데이터가 맞는가' },
    { id: 'fix', label: '개선 조치', points: 15, desc: '원인을 없애고 양품 손실을 막았는가' },
    { id: 'verify', label: '재발 방지', points: 15, desc: '정상 복귀 판단과 재발 방지 대책' },
  ],

  start: 'brief',
  nodes: {
    brief: {
      type: 'brief',
      step: 1,
      title: '현장 상황 전달',
      goal: '무슨 일이 일어났는지 파악합니다.',
      who: '테스트 라인 작업자 (오전 7:40)',
      report:
        '"엔지니어님, 어젯밤부터 H3 핸들러 수율이 94%대로 떨어졌습니다. 같은 제품을 돌리는 H1·H2는 98% 그대로예요. 불량 트레이가 빨리 차는데 불량품은 폐기 박스로 옮길까요?"',
      status: [
        { label: '핸들러 H3', value: '가동 중 · 수율 저하', tone: 'warn' },
        { label: '핸들러 H1·H2', value: '가동 중 · 정상', tone: 'ok' },
        { label: '불량 트레이', value: '폐기 전 보관 중', tone: 'info' },
      ],
      table: {
        virtual: true,
        cols: ['확인 항목', 'H1', 'H2', 'H3'],
        rows: [
          ['최근 2 LOT 수율', '98.1 %', '97.9 %', '94.0 % ⚠'],
          ['제품·테스트 프로그램', '같음', '같음', '같음'],
          ['웨이퍼 LOT', '같은 묶음', '같은 묶음', '같은 묶음'],
          ['설비 알람', '없음', '없음', '없음'],
        ],
      },
      facts: ['수율 저하는 어젯밤 11시 무렵 LOT부터 보입니다.', 'H3는 한 번에 4개를 동시에 검사하는 4사이트 방식입니다.', '불량품은 아직 폐기하지 않고 불량 트레이에 있습니다.'],
      next: 'contain',
    },

    contain: {
      type: 'choice',
      multi: true,
      step: 2,
      title: '초기 대응 판단',
      goal: '피해가 커지지 않게 하면서 원인을 가를 증거를 지킵니다. 해당하는 조치를 모두 고르세요.',
      prompt: '지금 바로 할 조치를 모두 고르세요.',
      // 함께 고를 수 없는 조치(같은 불량품을 보관하면서 폐기할 수는 없음)
      exclusive: [['hold', 'scrap']],
      options: [
        { id: 'pause', title: 'H3 신규 LOT 투입 보류', target: 'H3 · 대기 LOT', cost: 5, text: 'H3에 새 LOT 투입을 멈추고, 대기 LOT은 정상인 H1·H2로 돌린다', score: { contain: 5 }, tone: 'good', log: 'H3 투입 중지 · 대기 LOT H1·H2로', status: 'H3 투입 중지', feedback: '원인을 모르는 채 계속 돌리면 같은 문제가 반복됩니다. 정상 설비로 생산은 이어 갑니다.' },
        { id: 'hold', title: '불량품 보관 · 해당 LOT 출하 보류', target: 'H3 불량 트레이 · 해당 LOT', cost: 10, text: 'H3 불량품을 폐기하지 말고 LOT별로 보관하고, 해당 LOT 출하를 보류한다', score: { contain: 6 }, tone: 'good', log: 'H3 불량품 보관 · 해당 LOT 출하 보류', feedback: '테스트 환경 문제라면 불량 판정된 칩 상당수가 양품일 수 있습니다. 버리면 되돌릴 수 없습니다.' },
        { id: 'datalog', title: '사이트·Bin 테스트 기록 보존', target: '테스트 데이터', cost: 5, text: '사이트·Bin별 테스트 기록(datalog)을 지워지기 전에 보존한다', score: { contain: 5 }, tone: 'good', log: '사이트·Bin 테스트 기록 보존', feedback: '사이트별로 나눠 봐야 원인 쪽을 가를 수 있습니다.' },
        { id: 'share', title: '생산·품질 담당에게 현황 공유', target: '관련 부서', cost: 5, text: '생산·품질 담당에게 알리고 수율 저하 시작 시각을 기록한다', score: { contain: 4 }, tone: 'good', log: '관련 부서 공유, 시각 기록', feedback: '시작 시각은 그때 바뀐 것을 찾는 단서입니다.' },
        { id: 'scrap', title: '불량품 폐기', target: 'H3 불량 트레이', cost: 0, text: '불량 트레이가 차니 불량품을 폐기 박스로 옮긴다', score: { contain: -8 }, tone: 'bad', log: '불량품 폐기', status: '불량품 폐기됨', feedback: '테스트 환경 때문에 생긴 불량 판정이라면 양품을 버리게 됩니다. 원인 확인 전에는 보관합니다.' },
        { id: 'loosen', title: '접촉 판정 기준 완화', target: '테스트 프로그램 판정 기준', cost: 5, text: '접촉 검사 판정 기준을 조금 느슨하게 바꿔 수율을 맞춘다', score: { contain: -6, fix: -5 }, tone: 'bad', log: '판정 기준 완화', feedback: '판정 기준이 느슨하면 규격을 벗어난 칩도 통과합니다(테스트 핸들러 규칙표). 수율 숫자만 맞추는 조치입니다.' },
        { id: 'loop', title: 'H3에서 반복 재검사', target: 'H3 불량품', cost: 15, text: '불량품을 H3에 넣어 통과할 때까지 여러 번 재검사한다', score: { contain: -3 }, tone: 'warn', log: 'H3에서 반복 재검사', feedback: '원인이 H3 쪽에 있다면 같은 곳에서 반복해도 원인을 가리지 못하고, 통과 여부가 우연에 좌우됩니다.' },
      ],
      essay: { label: '판단 이유 (선택)', placeholder: '왜 이렇게 판단했는지 짧게 써 보세요.' },
      hints: [
        '불량 판정된 칩이 정말 불량일까요? 확실하지 않다면 어떻게 다뤄야 할까요?',
        '원인을 가르려면 어떤 기록이 남아 있어야 할까요?',
        'H3 투입 중지(정상 설비로 돌리기), 불량품 보관·출하 보류, 사이트·Bin 기록 보존, 공유가 기본입니다.',
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
        { id: 'site', icon: '🔢', purpose: 'H3의 4개 사이트 수율을 나눠 봅니다.', label: 'H3 사이트별 수율', group: '테스트 데이터', cost: 10, parts: ['socket'], observe: { normal: '네 사이트 수율이 비슷합니다.', abnormal: '한 사이트만 수율이 낮습니다("bad site").' }, score: { data: 6 }, key: true, result: { kind: 'bars', title: 'H3 사이트별 수율', unit: '%', max: 100, rows: [{ label: '사이트 1', value: 98.0 }, { label: '사이트 2', value: 85.6, flag: true, flagText: '낮음' }, { label: '사이트 3', value: 98.2 }, { label: '사이트 4', value: 97.9 }], note: '같은 LOT·같은 시간대에 네 사이트가 나눠 검사한 결과입니다.' }, note: '불량이 사이트 2에 몰려 있습니다. 멀티 사이트에서는 사이트별로 나눠 "몰려 있는 불량"을 찾습니다(onsemi 학회 논문).' },
        { id: 'lottrend', icon: '📈', purpose: 'H3에서 검사한 최근 LOT의 수율이 언제부터 떨어졌는지 봅니다.', label: 'H3 최근 LOT별 수율 추이', group: '테스트 데이터', cost: 5, score: { data: 1 }, result: { kind: 'trend', title: 'H3 최근 LOT별 수율', unit: '%', points: [{ label: 'L1', value: 97.7 }, { label: 'L2', value: 98.4 }, { label: 'L3', value: 97.9 }, { label: 'L4', value: 98.1 }, { label: 'L5', value: 97.6 }, { label: 'L6', value: 98.0 }, { label: 'L7', value: 97.8 }, { label: 'L8', value: 94.2, flag: true, note: '어젯밤 11시 무렵 시작' }, { label: 'L9', value: 93.8, flag: true }], note: 'L8부터 떨어졌습니다. "언제부터"는 알려 주지만, 칩 문제인지 테스트 환경 문제인지는 알려 주지 않습니다.' }, note: '수율이 L8(어젯밤 11시 무렵)부터 떨어졌습니다. 그때 바뀐 것을 찾는 단서가 됩니다.' },
        { id: 'bins', icon: '📊', purpose: '어떤 종류의 불량(Bin)이 늘었는지 봅니다.', label: '불량 Bin 분포 (Pareto)', group: '테스트 데이터', cost: 5, score: { data: 3 }, key: true, result: { kind: 'bars', title: '불량 Bin 개수 (많은 순)', unit: '개', rows: [{ label: '접촉 불량 (Open/Short)', value: 128, note: '누적 71 %' }, { label: '누설 전류', value: 21, note: '누적 83 %' }, { label: '기능 불량', value: 17, note: '누적 92 %' }, { label: '속도 불량', value: 9, note: '누적 97 %' }, { label: '기타', value: 5, note: '누적 100 %' }], note: '전체 180개 중 접촉 불량이 71 %입니다(막대에 마우스를 올리면 누적 비율).' }, note: '접촉(Open/Short) 불량이 대부분입니다. 공정 데이터 분석 화면의 Pareto 실습에서 직접 계산해 볼 수 있습니다.' },
        { id: 'retest', icon: '🔁', purpose: '사이트 2 불량품을 정상 사이트·다른 핸들러에서 다시 검사합니다.', label: '사이트 2 불량품을 H1에서 재검사', group: '테스트 데이터', cost: 15, observe: { normal: '진짜 불량이면 다른 곳에서도 다시 실패합니다(실패가 칩을 따라감).', abnormal: '다른 곳에서는 통과합니다(실패가 위치를 따라감).' }, score: { data: 6 }, key: true, result: { kind: 'table', cols: ['재검사 대상', '수량', 'H1 결과'], rows: [['사이트 2 접촉 불량품', '50', '통과 46 · 실패 4'], ['사이트 1·3·4 불량품', '20', '통과 1 · 실패 19']] }, note: '사이트 2 불량품 대부분이 다른 곳에서는 통과합니다 → 실패가 칩이 아니라 위치를 따라갑니다(Semiconductor Engineering 기사의 구분법).' },
        { id: 'swap', icon: '🔀', purpose: '사이트 1과 2의 소켓을 맞바꿔 불량이 소켓을 따라가는지 봅니다.', label: '소켓 맞바꾸기 (사이트 1 ↔ 2)', group: '설비 점검', cost: 15, parts: ['socket', 'head'], observe: { normal: '맞바꿔도 수율이 그대로면 소켓보다 사이트 쪽(채널·보드)을 의심합니다.', abnormal: '불량이 소켓을 따라 다른 사이트로 옮겨 갑니다.' }, score: { data: 3 }, key: true, result: { kind: 'table', cols: ['맞바꾼 뒤', '수율'], rows: [['사이트 1 (예전 사이트 2 소켓)', '86.1 % ✕'], ['사이트 2 (예전 사이트 1 소켓)', '98.0 % ✓']] }, note: '불량이 소켓을 따라 옮겨 갔습니다 → 테스터 채널이 아니라 소켓 쪽입니다. 소켓을 맞바꿔 오류가 하드웨어를 따라가는지 보는 방법입니다(Semiconductor Engineering 기사).' },
        { id: 'socketlog', icon: '🧹', purpose: '소켓 삽입 횟수와 청소 이력을 봅니다.', label: '소켓 삽입 횟수·청소 이력', group: '설비 점검', cost: 5, parts: ['socket'], score: { data: 2 }, key: true, result: { kind: 'table', cols: ['사이트', '마지막 청소 뒤 삽입 횟수', '청소 주기(가상)'], rows: [['사이트 1', '18,200', '25,000'], ['사이트 2', '31,500 ⚠', '25,000'], ['사이트 3', '17,900', '25,000'], ['사이트 4', '18,400', '25,000']] }, note: '사이트 2 소켓만 청소 주기를 넘겼습니다(지난번 청소 때 교체 소켓이 늦게 와 미룸). 반복 삽입은 찌꺼기와 접점 마모로 접촉 저항을 올립니다(재검사 기사). 오염된 소켓 핀 표면층 때문에 접촉 저항이 올라 신호가 늦어진 불량 분석 사례도 있습니다(한국재료학회지 2008).' },
        { id: 'lotmap', icon: '🧬', purpose: '같은 웨이퍼 LOT의 칩이 다른 핸들러에서 어땠는지 봅니다.', label: '웨이퍼 LOT·EDS 이력 비교', group: '제품 이력', cost: 10, score: { data: 1 }, result: { kind: 'text', text: '같은 웨이퍼 LOT 묶음의 칩이 H1·H2에서는 98% 수율입니다. EDS 수율도 평소와 같습니다.' }, note: '제품(칩) 자체 문제라면 다른 핸들러에서도 수율이 떨어져야 합니다.' },
        { id: 'program', icon: '💾', purpose: '테스트 프로그램 버전과 변경 이력을 봅니다.', label: '테스트 프로그램 버전·변경 이력', group: '설비 점검', cost: 5, parts: ['ate'], score: { data: 1 }, result: { kind: 'text', text: 'H1·H2·H3 모두 같은 버전입니다. 이번 주 변경 없음.' }, note: '프로그램 변경은 원인이 아닙니다.' },
        { id: 'temp', icon: '🌡️', purpose: '온도 안정화 챔버 기록을 봅니다.', label: '온도 챔버 기록', group: '설비 점검', cost: 5, parts: ['soak'], score: {}, result: { kind: 'text', text: '설정 온도대로 유지됐습니다.' }, note: '온도 문제라면 네 사이트가 함께 나빠졌을 가능성이 큽니다.' },
        { id: 'calib', icon: '📐', purpose: '테스터 교정 이력을 봅니다.', label: 'ATE 교정 이력', group: '설비 점검', cost: 5, parts: ['ate'], score: {}, result: { kind: 'text', text: '지난달 정기 교정 완료, 이상 없음.' }, note: '이번 문제와는 관련이 적었습니다.' },
      ],
      hints: [
        '"H3 전체"가 나쁜 걸까요, H3 안의 어느 한 곳이 나쁜 걸까요?',
        '불량 판정된 칩을 다른 곳에서 다시 검사하면 무엇을 알 수 있을까요?',
        '사이트별 수율 → 재검사(칩을 따라가나, 위치를 따라가나) → 소켓 맞바꾸기 → 청소 이력 순서가 효율적입니다.',
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
          id: 'socket',
          text: '사이트 2 소켓이 청소 주기를 넘겨 핀 오염·마모로 접촉 저항이 커져, 좋은 칩도 접촉 불량으로 판정됨',
          correct: true,
          support: ['site', 'bins', 'retest', 'swap', 'socketlog', 'lotmap', 'program'],
          feedback: '맞습니다. 불량이 사이트 2에 몰려 있고, 접촉 Bin이 대부분이며, 다른 곳에서 재검사하면 통과하고, 소켓을 맞바꾸면 불량이 소켓을 따라갑니다.',
          missing: { retest: '재검사가 없으면 칩 불량인지 테스트 환경 문제인지 가를 수 없습니다.' },
        },
        { id: 'product', text: '웨이퍼(칩) 자체 불량', feedback: '사이트 2 불량품 대부분이 H1에서 통과하고, 같은 웨이퍼 LOT이 다른 핸들러에서 정상입니다.', refute: ['retest', 'lotmap'] },
        { id: 'channel', text: '테스터 사이트 2 채널(측정 카드) 이상', feedback: '소켓을 맞바꾸자 불량이 소켓을 따라 사이트 1로 옮겨 갔습니다. 채널 문제라면 사이트 2에 남았어야 합니다.', refute: ['swap'] },
        { id: 'program', text: '테스트 프로그램 변경', feedback: '세 핸들러가 같은 버전이고 변경 이력도 없습니다.', refute: ['program'] },
        { id: 'temp', text: '온도 챔버 이상', feedback: '온도는 설정대로였고, 한 사이트만 나쁜 현상을 설명하지 못합니다.', refute: ['temp', 'site'] },
      ],
      score: { correct: 8, retry: 4, evidenceEach: 2, evidenceMax: 7 },
      essay: { label: '가설 설명 (선택)', placeholder: '왜 이 가설이 가장 유력한지 근거와 함께 써 보세요.' },
      hints: [
        '실패가 칩을 따라갔나요, 위치를 따라갔나요?',
        '소켓을 맞바꿨을 때 불량은 어디로 갔나요?',
        '사이트별 수율, 접촉 Bin, 재검사 결과, 소켓 맞바꾸기, 청소 이력, 반증(웨이퍼 LOT·프로그램)을 함께 근거로 드세요.',
      ],
      next: 'know',
    },

    know: {
      type: 'quiz',
      step: 5,
      title: '조치 전 점검: 테스트 환경 문제 가르기',
      goal: '대책을 정하기 전에 테스트 환경 문제를 가르는 원리를 확인합니다.',
      questions: [
        {
          id: 'k1',
          prompt: '제품 불량과 테스트 환경(사이트·소켓) 문제를 가르는 방법으로 맞는 것은?',
          choices: [
            '같은 칩이 여러 사이트·장비에서 계속 실패하면 칩을, 같은 사이트·소켓에서 다른 칩들이 실패하면 테스트 환경을 의심한다',
            '불량이 많으면 항상 칩 불량이다',
            '수율이 떨어지면 항상 테스트 프로그램 문제다',
            '재검사는 의미가 없으므로 하지 않는다',
          ],
          answer: 0,
          points: 8,
          explain: '같은 칩이 사이트·보드·테스터를 바꿔도 실패하면 칩이 더 의심스럽고, 다른 칩들이 지나가는데 실패가 특정 사이트·소켓·핸들러 위치에 남으면 테스트 쪽을 의심합니다(Semiconductor Engineering 기사).',
        },
        {
          id: 'k2',
          prompt: '소켓에 패키지를 반복해서 넣고 빼면 생길 수 있는 일로 맞는 것은?',
          choices: ['찌꺼기가 생기고 접점이 닳아 접촉 저항이 오르고, 재검사가 늘어 소켓 청소가 필요해진다', '접촉이 점점 좋아진다', '칩의 속도가 빨라진다', '아무 변화가 없다'],
          answer: 0,
          points: 7,
          explain: '반복 삽입은 찌꺼기를 만들고 접점 표면을 닳게 해 접촉 저항을 올리고, 그 결과 재검사율이 늘어 일정 수준에서 로드보드·소켓 청소가 필요합니다(Semiconductor Engineering 재검사 기사).',
        },
      ],
      hints: ['실패가 "무엇을 따라가는지"가 핵심입니다.', '소켓 핀은 매번 패키지 단자와 문질러집니다.', '두 문제 모두 첫 번째 보기가 맞는지 다시 확인해 보세요.'],
      next: 'action',
    },

    action: {
      type: 'choice',
      step: 5,
      title: '조치 선택',
      goal: '원인을 없애고 양품 손실을 막는 조치를 하나 고릅니다.',
      prompt: '어떤 조치를 하시겠습니까?',
      options: [
        { id: 'clean', title: '사이트 2 소켓 청소·교체 + 재검사', target: '사이트 2 소켓 · 불량품', cost: 25, text: '사이트 2 소켓을 청소(필요하면 교체)하고 사이트별 수율이 비슷한지 확인한 뒤 재가동한다. 사이트 2 불량품은 정상 사이트에서 재검사해 진짜 불량만 남긴다', score: { fix: 15 }, tone: 'good', log: '사이트 2 소켓 청소·교체 + 사이트별 확인 + 불량품 재검사', status: 'H3 재가동 · 사이트 2 소켓 교체', next: 'r_good', feedback: '원인(소켓)을 없애고, 잘못 불량 판정된 양품도 되살렸습니다.' },
        { id: 'disable', title: '사이트 2 끄고 3사이트 가동', target: '사이트 2', cost: 10, text: '사이트 2만 끄고 3사이트로 계속 돌린다', score: { fix: 6 }, tone: 'warn', log: '사이트 2 비활성화 후 3사이트 가동', next: 'r_disable', feedback: '불량 확산은 막지만, 원인은 그대로이고 처리량이 줄어듭니다.' },
        { id: 'loosen', title: '판정 기준 완화 후 재가동', target: '테스트 프로그램 판정 기준', cost: 5, text: '접촉 검사 판정 기준을 느슨하게 바꿔 재가동한다', score: { fix: 0 }, tone: 'bad', log: '판정 기준 완화 후 재가동', status: '판정 기준 완화', next: 'r_loosen', feedback: '원인(소켓)은 그대로 두고 판정을 바꿔 숫자만 맞추는 조치입니다.' },
        { id: 'scrap', title: '불량품 폐기 + 소켓 청소', target: '불량품 · 소켓', cost: 5, text: '불량품은 모두 폐기하고 소켓만 청소한다', score: { fix: 4 }, tone: 'bad', log: '불량품 전량 폐기 + 소켓 청소', next: 'r_scrap', feedback: '원인은 없앴지만 잘못 불량 판정된 양품까지 버렸습니다.' },
      ],
      hints: ['원인을 없애는 일과, 이미 잘못 판정된 칩을 다루는 일을 함께 생각해 보세요.', '판정 기준을 바꾸면 무엇이 통과하게 될까요?', '소켓 청소·교체 + 사이트별 확인 + 불량품을 정상 사이트에서 재검사입니다.'],
    },

    r_good: {
      type: 'outcome',
      step: 5,
      title: '조치 결과',
      tone: 'ok',
      text: '소켓을 바꾼 뒤 네 사이트 수율이 비슷하게 돌아왔고, 사이트 2 불량품 대부분이 재검사에서 양품으로 확인됐습니다.',
      chart: { kind: 'compare', title: 'H3 사이트별 수율: 조치 전 → 조치 후', unit: '%', max: 100, rows: [{ label: '사이트 1', before: 98.0, after: 97.8 }, { label: '사이트 2', before: 85.6, after: 98.1 }, { label: '사이트 3', before: 98.2, after: 98.2 }, { label: '사이트 4', before: 97.9, after: 97.9 }] },
      table: { virtual: true, cols: ['항목', '결과', '판정'], rows: [['사이트별 수율', '97.8 / 98.1 / 98.2 / 97.9 %', '✓ 고름'], ['사이트 2 불량품 재검사', '128개 중 117개 통과', '✓ 양품 회수'], ['H3 LOT 수율', '97.9 %', '✓']] },
      next: 'verify',
    },
    r_disable: {
      type: 'outcome',
      step: 5,
      title: '조치 결과',
      tone: 'warn',
      text: '3사이트로 돌리자 수율은 돌아왔지만 처리량이 25% 줄어 테스트 대기 LOT이 쌓입니다. 사이트 2 불량품도 그대로 불량 트레이에 있습니다.',
      table: { virtual: true, cols: ['항목', '결과'], rows: [['H3 수율 (3사이트)', '98.0 %'], ['시간당 처리량', '평소의 75 % ⚠'], ['사이트 2 불량품', '재검사 안 함 ⚠']] },
      lesson: '사이트를 끄는 것은 응급 조치일 뿐입니다. 멀티 사이트 설비에서 끈 사이트가 늘면 처리량을 잃습니다(onsemi 학회 논문). 원인을 없애야 합니다.',
      next: 'recover',
    },
    r_loosen: {
      type: 'outcome',
      step: 5,
      title: '조치 결과',
      tone: 'bad',
      text: '수율 숫자는 97%로 올랐습니다. 그런데 품질팀 샘플 재검사에서, 진짜 접촉 불량(단자 이상) 칩이 양품으로 섞여 나간 것이 확인됐습니다.',
      table: { virtual: true, cols: ['항목', '결과'], rows: [['H3 수율', '97.1 % (겉보기)'], ['양품 샘플 중 실제 불량', '200개 중 3개 ✕'], ['사이트 2 소켓', '여전히 오염']] },
      lesson: '판정 기준이 느슨하면 규격을 벗어난 칩도 통과합니다(테스트 핸들러 규칙표). 원인을 그대로 두고 판정을 바꾸면 불량이 고객에게 갑니다.',
      next: 'recover',
    },
    r_scrap: {
      type: 'outcome',
      step: 5,
      title: '조치 결과',
      tone: 'warn',
      text: '소켓 청소 뒤 수율은 돌아왔지만, 폐기한 불량품 128개 중 대부분이 실제로는 양품이었을 가능성이 큽니다(재검사 결과로 추정).',
      table: { virtual: true, cols: ['항목', '결과'], rows: [['H3 수율 (청소 후)', '98.0 %'], ['폐기한 접촉 불량품', '128개'], ['재검사였다면 회수 가능(추정)', '약 110개 이상 ⚠']] },
      lesson: '테스트 환경 문제로 생긴 불량 판정은 재검사로 양품을 되살릴 수 있습니다. 원인 확인 전 폐기는 양품 손실입니다.',
      next: 'recover',
    },

    recover: {
      type: 'choice',
      step: 5,
      title: '판단 수정',
      goal: '새 결과를 보고 조치를 고칩니다.',
      prompt: '이제 어떻게 하시겠습니까?',
      options: [
        { id: 'rollback', title: '기준 원복 + 소켓 교체 + 사이트별 확인', target: '판정 기준 · 사이트 2 소켓', cost: 25, text: '판정 기준을 바꿨다면 원래대로 되돌리고, 사이트 2 소켓을 청소·교체해 사이트별로 확인한 뒤 남은 불량품은 정상 사이트에서 재검사한다', score: { fix: 6 }, tone: 'good', log: '기준 원복 + 소켓 청소·교체 + 사이트별 확인 + 재검사', status: '기준 원복 · 소켓 교체', next: 'r_good', feedback: '좋습니다. 결과를 보고 판단을 고친 것도 중요한 역량입니다.' },
        { id: 'more', title: '기준 추가 완화', target: '판정 기준', cost: 5, text: '기준을 조금 더 느슨하게 해 처리량을 맞춘다', score: { fix: -3, know: -3 }, tone: 'bad', log: '판정 기준 추가 완화', next: 'recover', feedback: '불량 유출 위험만 커집니다. 다시 고르세요.' },
      ],
      hints: ['원인(소켓)은 지금 해결됐나요?', '바꾼 판정 기준이 있다면 먼저 원래대로 돌려야 하지 않을까요?', '기준 원복 + 소켓 청소·교체 + 사이트별 확인 + 재검사입니다.'],
    },

    verify: {
      type: 'choice',
      multi: true,
      step: 6,
      title: '검증 및 재발 방지',
      goal: '정상 복귀를 무엇으로 판단하고, 다시 생기지 않게 무엇을 할지 고릅니다.',
      prompt: '해당하는 것을 모두 고르세요.',
      options: [
        { id: 'multi', title: '여러 LOT 사이트별 수율·재검사율 확인', target: 'H3 사이트 1~4', cost: 20, text: '여러 LOT 동안 사이트별 수율과 재검사율이 서로 비슷하게 유지되는지 본다', score: { verify: 5 }, tone: 'good', log: '여러 LOT 사이트별 수율·재검사율 확인' },
        { id: 'retestlot', title: '보관 불량품 재검사 · 보류 LOT 판정', target: '보관 불량품 · 보류 LOT', cost: 15, text: '보관한 불량품은 정상 사이트에서 재검사해 진짜 불량만 남기고, 출하 보류 LOT을 판정한다', score: { verify: 3 }, tone: 'good', log: '보관 불량품 재검사 · 보류 LOT 판정' },
        { id: 'pm', title: '소켓 청소 주기 준수 · 교체 재고', target: '소켓 관리 절차', cost: 10, text: '삽입 횟수 기준 소켓 청소 주기를 지키고, 교체 소켓 재고를 확보해 미루지 않게 한다', score: { verify: 4 }, tone: 'good', log: '소켓 청소 주기 준수 · 교체 소켓 재고 확보' },
        { id: 'monitor', title: '사이트별 수율 경고', target: '테스트 감시 기준', cost: 10, text: '한 사이트만 수율이 낮아지면 바로 알리는 사이트별 수율 경고를 건다', score: { verify: 3 }, tone: 'good', log: '사이트별 수율 경고 설정' },
        { id: 'once', title: '첫 LOT 정상으로 종료', cost: 0, text: '첫 LOT 수율이 돌아왔으니 바로 종료한다', score: { verify: -5 }, tone: 'bad', log: '1 LOT 확인 후 종료', feedback: '사이트별 차이는 여러 LOT으로 봐야 우연을 배제할 수 있습니다.' },
        { id: 'norecord', title: '기록 없이 종료', cost: 0, text: '원인 기록 없이 정상 생산으로 돌아간다', score: { verify: -3 }, tone: 'bad', log: '기록 없이 종료', feedback: '청소 주기를 또 미루면 같은 일이 반복됩니다.' },
      ],
      essay: { label: '재발 방지 대책 (선택)', placeholder: '내가 생각하는 재발 방지 대책을 써 보세요.' },
      hints: ['첫 LOT만으로 충분할까요?', '이번 일의 시작은 "청소를 미룬 것"이었습니다.', '여러 LOT 사이트별 확인, 보관 불량품 재검사, 청소 주기·재고, 사이트별 경고입니다.'],
      next: 'end',
    },
    end: { type: 'end', step: 6, title: '결과 평가' },
  },

  steps: ['현장 상황 전달', '초기 대응 판단', '데이터 수집', '원인 분석', '조치 및 검증', '결과 평가'],

  model: [
    'H3 투입을 멈추고 대기 LOT은 정상 핸들러로 돌린다. 불량품은 폐기하지 않고 보관하며, 사이트·Bin 테스트 기록을 보존하고 공유한다.',
    '사이트별 수율로 나눠 본다 → 사이트 2에 불량이 몰려 있고, Bin은 접촉(Open/Short)이 대부분이다.',
    '사이트 2 불량품을 다른 핸들러에서 재검사한다 → 대부분 통과(실패가 위치를 따라감).',
    '소켓을 사이트끼리 맞바꾼다 → 불량이 소켓을 따라감(채널이 아니라 소켓). 청소 이력에서 주기 초과를 확인한다.',
    '판정 기준은 바꾸지 않는다. 소켓을 청소·교체하고 사이트별 수율을 확인한 뒤, 불량품은 정상 사이트에서 재검사해 양품을 회수한다.',
    '여러 LOT 동안 사이트별 수율·재검사율로 정상 복귀를 판단한다.',
    '재발 방지: 삽입 횟수 기준 청소 주기 준수와 교체 소켓 재고, 사이트별 수율 경고.',
  ],
}
