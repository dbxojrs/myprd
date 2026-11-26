// 장비 라인 연결 실습 규칙표. 모두 검수 전입니다.
//
// LINES: 이어서 돌릴 장비 순서. 아직 없는 장비 id는 화면에서 건너뜁니다.
// handoffs: 앞 장비(from)의 조건(when.values: { 키: [단계] })이나 결과 제목(when.titles: [포함할 말])이 맞으면
//   sets: 뒤 장비(to)에 들어올 때의 상태를 바꿉니다(그 장비의 conditions 키).
//   final: 끝까지 남아 최종 판정에 더해지는 영향 { grade: 'warn' | 'bad', text }.
//   and: 다른 장비의 조건도 함께 맞아야 할 때 { from, values } (예: 몰딩 보이드 + 패키지 쏘잉 빠른 이송).
//   note: 화면에 보여줄 연결 설명. basis: 근거(lineSim.js 연결 규칙, 공정 데이터, 장비 규칙 출처 등).

export const LINES = [
  {
    id: 'front',
    name: '전공정 라인',
    desc: '산화 → 포토 → 식각 → 증착 → 이온 주입 → 금속 배선 → CMP 장비를 이어서 돌립니다.',
    machines: ['oxidation', 'photo', 'etch', 'deposition', 'ion-implant', 'metallization', 'cmp'],
  },
  {
    id: 'back',
    name: '후공정 라인 (QFN)',
    desc: '백그라인딩부터 최종 테스트까지 QFN 후공정 장비를 이어서 돌립니다.',
    machines: ['backgrind', 'wafer-saw', 'die-attach', 'wire-bond', 'molding', 'marking', 'package-saw', 'test'],
  },
]

export const handoffs = [
  // ── 후공정 라인 ──
  {
    from: 'backgrind',
    when: { values: { target: [2, 3] } },
    to: 'wafer-saw',
    sets: { wafer: 1 },
    note: '백그라인딩에서 얇게 갈아 → 다이싱 장비에 "얇은 웨이퍼"로 도착',
    basis: '라인 실습 규칙표(lineSim.js): 백그라인딩 두께가 웨이퍼 쏘잉에 영향',
  },
  {
    from: 'backgrind',
    when: { values: { target: [2, 3] } },
    to: 'die-attach',
    sets: { die: 1 },
    note: '백그라인딩에서 정한 두께가 그대로 다이 두께 → 다이 본더에 "얇은 다이"로 도착',
    basis: '공정 데이터: 백그라인딩 결과(얇아진 웨이퍼)를 잘라 다이를 만듦',
  },
  {
    from: 'backgrind',
    when: { titles: ['손상층이 남음', '날카로워져'] },
    final: { grade: 'warn', text: '연삭 손상이 남은 다이는 강도가 낮아 패키지 안에서 균열이 생기기 쉽습니다.' },
    note: '백그라인딩의 손상층·날카로운 가장자리 → 다이 강도 저하',
    basis: 'DISCO Ultra-Thin Grinding: 손상층을 걷어 내면 다이 강도 향상, 얇게 갈면 가장자리가 날카로워져 강도 저하',
  },
  {
    from: 'wafer-saw',
    when: { values: { wafer: [1], feed: [2, 3] } },
    final: { grade: 'bad', text: '다이를 가로지르는 균열이 생겨 테스트에서 기능 불량으로 걸립니다.' },
    note: '얇은 웨이퍼 + 빠른 절단 → 칩핑이 크랙으로 커짐',
    basis: '라인 실습 규칙표(lineSim.js): 백그라인딩 "너무 얇게" → 웨이퍼 쏘잉 "빠르게" = 불량',
  },
  {
    from: 'wafer-saw',
    when: { titles: ['칩핑', '깨짐'] },
    final: { grade: 'warn', text: '다이 모서리의 깨진 자국이 온도 변화를 겪으며 균열로 커질 수 있습니다.' },
    note: '웨이퍼 쏘잉의 칩핑 → 완성 패키지의 다이 균열 위험',
    basis: '라인 실습 규칙표(lineSim.js) 이송 속도 "빠르게"의 effect',
  },
  {
    from: 'die-attach',
    when: { values: { amount: [2] } },
    to: 'wire-bond',
    sets: { pad: 1 },
    note: '다이 어태치 접착제 과다 → 넘친 접착제가 패드를 오염 → 와이어 본더에 "산화막·오염 있음"으로 도착',
    basis: '라인 실습 규칙표(lineSim.js): 접착제 과다 → 와이어 접합 약화',
  },
  {
    from: 'die-attach',
    when: { titles: ['보이드', '박리'] },
    final: { grade: 'warn', text: '다이 아래 빈 공간 때문에 열이 잘 빠지지 않고, 온도 변화가 반복되면 다이가 들뜰 수 있습니다.' },
    note: '다이 어태치의 보이드·박리 → 열 방출 저하·들뜸',
    basis: '라인 실습 규칙표(lineSim.js) 접착제 "부족"의 effect',
  },
  {
    from: 'wire-bond',
    when: { titles: ['크레이터링', '패드가 깨짐'] },
    final: { grade: 'warn', text: '패드 아래 균열이 사용 중 커져 나중에 연결이 끊길 수 있습니다.' },
    note: '와이어 본딩의 패드 아래 손상 → 출하 뒤 연결 끊김 위험',
    basis: '라인 실습 규칙표(lineSim.js) 초음파 출력·하중 "강하게"의 effect',
  },
  {
    from: 'molding',
    when: { titles: ['와이어 쓸림'] },
    final: { grade: 'bad', text: '밀린 와이어가 옆 와이어와 닿아 전기가 엉뚱한 곳으로 흐릅니다(단락).' },
    note: '몰딩의 와이어 쓸림 → 와이어끼리 닿아 단락',
    basis: '공정 데이터: 알아둘 점 "와이어 쓸림"',
  },
  {
    from: 'molding',
    when: { titles: ['보이드', '미충전'] },
    and: { from: 'package-saw', values: { feed: [2, 3] } },
    final: { grade: 'bad', text: '깨진 모서리로 내부가 드러나 외관 검사와 신뢰성 검사에서 불량이 됩니다.' },
    note: '몰딩 보이드 + 패키지 쏘잉 빠른 절단 → 모서리가 크게 깨짐',
    basis: '라인 실습 규칙표(lineSim.js): 몰딩 보이드 → 패키지 쏘잉 빠른 절단 = 불량',
  },
  {
    from: 'marking',
    when: { titles: ['칩 손상'] },
    final: { grade: 'bad', text: '레이저가 몰드를 지나 칩 표면을 손상시켜 신뢰성이 떨어집니다.' },
    note: '레이저 마킹의 칩 손상 → 신뢰성 저하',
    basis: 'KoreaScience 2022 Low Depth Marking: 레이저 노출에 의한 Chip Damage로 신뢰성 저하',
  },
  {
    from: 'package-saw',
    when: { titles: ['버'] },
    to: 'test',
    sets: { lot: 1 },
    note: '패키지 쏘잉의 구리 버 → 테스트 핸들러에 "버·변형 섞임" 로트로 도착',
    basis: '공정 데이터: 알아둘 점 "버(burr)"',
  },
  {
    from: 'package-saw',
    when: { titles: ['버'] },
    final: { grade: 'warn', text: '버가 크면 제품 기판에 붙일 때 옆 단자와 닿을 수 있습니다.' },
    note: '패키지 쏘잉의 구리 버 → 기판 실장 때 단자끼리 닿을 위험',
    basis: '공정 데이터: 알아둘 점 "버(burr)"',
  },

  // ── 전공정 라인 ──
  {
    from: 'oxidation',
    when: { titles: ['오염'] },
    final: { grade: 'bad', text: '아주 작은 불순물도 회로의 전기적 특성을 망가뜨립니다.' },
    note: '산화 공정의 오염 → 회로 특성 불량',
    basis: '삼성반도체 뉴스룸 8대 공정 2탄: "아주 작은 불순물도 집적회로의 전기적 특성에 치명적"',
  },
  {
    from: 'photo',
    when: { titles: ['너무 얇음'] },
    to: 'ion-implant',
    sets: { mask: 1 },
    note: '포토에서 감광액이 얇게 입혀짐 → 이온 주입기에 "마스크 얇음"으로 도착',
    basis: 'MIT OCW 6.152J Lecture 6: 마스크를 뚫고 들어가는 이온(dose penetrating mask)',
  },
  {
    from: 'photo',
    when: { titles: ['덜 열림', '찌꺼기', '반복', '무너짐'] },
    final: { grade: 'bad', text: '무늬가 제대로 열리지 않은 곳은 식각·증착이 엉뚱하게 되어 회로가 끊기거나 붙습니다.' },
    note: '포토의 무늬 불량 → 회로 무늬 불량',
    basis: '삼성반도체 뉴스룸 8대 공정 4탄: 미세 회로 패턴은 포토 공정이 결정',
  },
  {
    from: 'etch',
    to: 'deposition',
    when: {},
    sets: { pattern: 1 },
    note: '식각으로 홈이 생긴 웨이퍼 → 증착 장비에 "깊은 홈 패턴"으로 도착',
    basis: '공정 데이터: 식각 결과(무늬대로 깎인 웨이퍼)가 증착으로 넘어감',
  },
  {
    from: 'etch',
    when: { titles: ['과식각', '언더컷', '기판 손상'] },
    final: { grade: 'warn', text: '무늬 모양이 틀어지거나 아래층이 손상되어 소자 특성이 흔들릴 수 있습니다.' },
    note: '식각 불량 → 무늬 모양·아래층 손상',
    basis: 'MIT OCW 6.152J Lecture 17: 압력·이온 에너지와 이방성·선택비·기판 손상의 관계',
  },
  {
    from: 'deposition',
    when: { titles: ['오염', '파티클'] },
    final: { grade: 'bad', text: '막 속 입자나 다른 물질이 회로를 끊거나 이어 버립니다.' },
    note: '증착의 오염·파티클 → 회로 불량',
    basis: 'MIT OCW CVD: 고온벽 반응기 오염, 기체 속 입자 생성',
  },
  {
    from: 'deposition',
    when: { titles: ['덜 덮임'] },
    final: { grade: 'warn', text: '홈 안쪽 막이 얇아 절연이 약하거나 다음 막이 고르게 쌓이지 않습니다.' },
    note: '증착의 단차 피복 불량 → 홈 안쪽 막 부족',
    basis: 'MIT OCW CVD: LPCVD의 등각성(conformality)',
  },
  {
    from: 'ion-implant',
    when: { titles: ['결정 손상', '비정질화'] },
    final: { grade: 'warn', text: '손상된 결정은 열처리로 되돌려야 하며, 남으면 전기적 특성이 나빠집니다.' },
    note: '이온 주입 손상 → 열처리 필요',
    basis: 'MIT OCW 6.152J Lecture 6: 주입 손상·비정질화와 재결정화',
  },
  {
    from: 'metallization',
    when: { titles: ['저항', '덮이지 않음'] },
    final: { grade: 'bad', text: '배선 저항이 높거나 비아가 이어지지 않아 신호가 제대로 전달되지 않습니다.' },
    note: '금속 배선 불량 → 신호 전달 불량',
    basis: '공정 데이터: 금속 배선은 전기가 통하는 길',
  },
  {
    from: 'metallization',
    to: 'cmp',
    when: {},
    sets: { film: 1 },
    note: '금속 배선에서 금속을 넘치게 채운 웨이퍼 → CMP 장비에 "구리 배선(다마신)"으로 도착(교육용 단순화)',
    basis: 'SK하이닉스 뉴스룸: 구리는 홈을 판 뒤 채우고 넘친 구리를 갈아냄 · Sandia CMP 설계 문서: 넘친 재료를 CMP로 갈아내는 다마신',
  },
  {
    from: 'cmp',
    when: { titles: ['디싱', '이로전'] },
    final: { grade: 'bad', text: '배선이 패이거나 촘촘한 영역의 막이 함께 깎여, 칩 안에서 남는 두께가 고르지 않습니다.' },
    note: 'CMP 과연마 → 디싱·이로전',
    basis: 'MIT CMP 패턴 의존 모델 논문: 과연마 때 디싱·이로전이 크게 생기고, 칩 전체 평탄도가 핵심 관심사',
  },
  {
    from: 'cmp',
    when: { titles: ['잔막'] },
    final: { grade: 'bad', text: '넘친 구리가 덜 걷혀 배선끼리 이어질 수 있습니다(교육용 가설).' },
    note: 'CMP 연마 부족 → 구리 잔막',
    basis: 'Sandia CMP 설계 문서: 다마신은 넘친 재료를 CMP로 갈아냄. 배선끼리 이어진다는 결과는 교육용 가설(검수 전)',
  },
  {
    from: 'cmp',
    when: { titles: ['스크래치', '잔류'] },
    final: { grade: 'warn', text: '긁힘이나 남은 입자가 다음 층에 결함으로 남을 수 있습니다.' },
    note: 'CMP 긁힘·잔류 입자 → 다음 층 결함 위험',
    basis: 'Cambridge JMR CMP 리뷰: CMP 후 세정은 잔류 입자·이물·긁힘·부식 같은 결함을 없애는 필수 단계',
  },
]
