// 테스트 핸들러 + ATE 테스터 장비 소개·조작 순서·결과물 데이터. 형식은 data/equipment/index.js 머리 주석을 보세요.
// 근거: review/equipment-back.md 8장. 장비사·뉴스룸 자료는 모두 "설명 출처"입니다. 모두 검수 전입니다.

export default {
  id: 'test',
  reviewed: false,
  kind: { ko: '테스트 핸들러 + ATE 테스터', en: 'Test Handler + ATE' },
  summary:
    '완성된 패키지를 하나씩 소켓(Socket)에 넣고, 테스터(ATE)가 전압·신호·온도 조건을 바꿔 가며 전기적·기능적 특성과 동작 속도를 잰 뒤, 결과에 따라 양품과 불량품으로 나누는 장비 묶음입니다. 패키지를 옮기는 핸들러(Handler)와 측정하는 테스터가 짝을 이룹니다.',
  vendors: [
    { name: 'Advantest', products: 'M6242/M6243 핸들러 · V93000 테스터', note: 'M6242는 최대 512개 동시 테스트, −40~+125 °C, 온도 안정화 챔버와 양품·불량 분류 암. V93000은 웨이퍼 소트와 파이널 테스트에 쓰는 SoC 테스터', src: 'advM6242' },
    { name: 'Teradyne', products: 'UltraFLEX · J750 · Magnum 7H', note: 'SoC·디지털용 UltraFLEX·J750, 메모리용 Magnum(7H는 HBM 테스트)', src: 'teradyne' },
    { name: 'Cohu', products: 'Pick-and-Place · Gravity · Turret · Strip 핸들러', note: 'MATRiX·MT9510은 Tri-Temp, T-Core 능동 열 제어, 컨택터 내장 온도 센서', src: 'cohu' },
  ],
  vendorNote:
    '삼성전자·SK하이닉스가 어떤 핸들러·테스터를 쓰는지는 공식 페이지에서 확인하지 못했습니다(Amkor 사진 설명에 V93000·UltraFLEX 같은 장비명이 나오지만 "표준"이라는 뜻은 아닙니다). 테스트 헤드가 핸들러에 도킹하는 정확한 배치, JEDEC 번인 규격도 이번 조사에서 확인하지 못했습니다.',
  modules: [
    { id: 'input', name: { ko: '입력부 (트레이·튜브)', en: 'Input (Tray / Tube)' }, desc: '테스트할 로트를 트레이나 튜브로 넣는 곳입니다. 핸들러 종류에 따라 트레이(Pick-and-Place)나 튜브(Gravity)를 씁니다.', src: 'cohu' },
    { id: 'soak', name: { ko: '온도 안정화 챔버', en: 'Temperature Stabilization Chamber' }, desc: '패키지를 시험 온도까지 미리 데우거나 식혀 둡니다. Advantest M6242는 −40~+125 °C 범위를 씁니다.', src: 'advM6242' },
    { id: 'arm', name: { ko: '픽앤플레이스 암', en: 'Pick-and-Place Arm' }, desc: '패키지를 집어 소켓에 넣고, 테스트가 끝나면 꺼내 결과대로 분류합니다.', src: 'advM6242' },
    { id: 'socket', name: { ko: '소켓·컨택터·DUT 보드', en: 'Socket / Contactor / DUT Board' }, desc: '패키지 단자와 전기적으로 닿는 부분입니다. 컨택터 안에 온도 센서를 둔 핸들러도 있고, DUT 보드는 핸들러에 맞춰 만듭니다.', src: 'cohu' },
    { id: 'head', name: { ko: '테스트 헤드', en: 'Test Head' }, desc: '테스터의 측정 카드가 꽂히는 부분입니다. V93000은 모든 카드가 모든 테스트 헤드에 맞습니다. 핸들러와 붙는 정확한 배치는 출처로 확인하지 못했습니다.', src: 'advV93k' },
    { id: 'ate', name: { ko: 'ATE 테스터 본체', en: 'ATE Mainframe' }, desc: '테스트 프로그램대로 전압·신호를 만들고 응답을 재서 합격·불합격을 판정합니다.', src: 'samsung9' },
    { id: 'sort', name: { ko: '분류·T&R', en: 'Sort / Tape & Reel' }, desc: '결과에 따라 양품과 불량품을 나누고, 양품은 트레이나 테이프 앤 릴(T&R)로 포장합니다.', src: 'amkor' },
  ],
  operation: [
    { id: 'lot', who: '작업자', at: 'input', lot: 'input', title: '로트 투입', desc: '테스트할 패키지 로트를 트레이나 튜브로 핸들러에 넣습니다.', terms: ['handler'], src: 'cohu' },
    { id: 'program', who: '작업자', at: 'socket', lot: 'input', title: '테스트 프로그램 선택 · 체인지 키트', desc: '제품에 맞는 테스트 프로그램을 고르고, 패키지 크기에 맞는 체인지 키트(테스트 트레이 등)로 바꿔 끼웁니다.', terms: ['kit'], src: 'advKit' },
    { id: 'burnin', who: '장비', at: 'soak', lot: 'soak', title: '(메모리) 번인 · TDBI', desc: '메모리는 번인(TDBI)으로 초기 불량을 먼저 걸러 냅니다.', terms: ['tdbi'], src: 'skhynix1' },
    { id: 'soak', who: '장비', at: 'soak', lot: 'soak', title: '온도 맞추기', desc: '온도 안정화 챔버에서 패키지를 시험 온도(Hot·Cold·Room)까지 맞춥니다.', terms: ['temp'], src: 'advM6242' },
    { id: 'insert', who: '장비', at: 'arm', lot: 'socket', title: '소켓에 넣기', desc: '픽앤플레이스 암이 패키지를 집어 테스트 보드의 소켓에 눌러 넣습니다.', terms: ['socket'], src: 'skhynix1' },
    { id: 'test', who: '장비', at: 'ate', lot: 'socket', title: 'ATE 전기 검사', desc: '테스터가 전압·전기 신호·온도 조건을 걸어 전기적·기능적 특성과 동작 속도(Speed)를 잽니다.', terms: ['ate'], src: 'samsung9' },
    { id: 'sort', who: '장비', at: 'sort', lot: 'sort', title: '양품·불량 분류', desc: '결과에 따라 분류 암이 양품과 불량품을 나눠 담습니다.', terms: ['bin'], src: 'advM6242' },
    { id: 'pack', who: '작업자', at: 'sort', lot: 'sort', title: '외관 검사 · 포장', desc: '외관 검사(크랙·마킹·솔더볼 누락 등)를 거쳐 트레이나 T&R로 포장합니다. 결과는 제조·조립 공정에 피드백합니다.', terms: ['tr'], src: 'skhynix1' },
  ],
  outputs: {
    product: '양품 패키지(트레이 또는 Tape & Reel)와 결과별로 분류된 불량품',
    metrics: ['전기적·기능적 특성', '동작 속도', '온도(Hot·Cold·Room)별 합격 여부'],
    notes: [
      { text: '테스트 결과는 제조와 조립 공정에 피드백되어 앞 공정의 문제를 찾는 데 쓰입니다.', src: 'samsung9' },
      { text: '번인으로 초기 불량을 걸러 내고, 외관 검사에서는 크랙·마킹·솔더볼 눌림이나 누락을 봅니다.', src: 'skhynix1' },
    ],
  },
  terms: [
    { id: 'ate', ko: 'ATE', en: 'Automatic Test Equipment', short: '자동으로 전기 검사를 하는 테스터', deep: '전압·전기 신호·온도·습도 조건을 걸어 전기적·기능적 특성과 동작 속도를 재는 검사장비(Tester)입니다. Advantest V93000은 웨이퍼 소트와 파이널 테스트를 모두 하고, Teradyne Magnum 7H는 HBM 메모리를 시험합니다.', src: 'samsung9' },
    { id: 'handler', ko: '핸들러', en: 'Test Handler', short: '패키지를 소켓에 넣고 빼며 분류하는 장비', deep: 'Cohu는 핸들러를 Pick-and-Place, Gravity(튜브 투입), Turret, Strip 방식으로 나눕니다. Amkor는 Turret 핸들러로 테스트 → 스캔 → 테이프 앤 릴을 차례로 한다고 소개합니다.', src: 'cohu' },
    { id: 'socket', ko: '소켓·컨택터', en: 'Socket / Contactor', short: '패키지 단자와 테스터를 잇는 접점', deep: '패키지 테스트는 패키지 테스트 보드의 소켓에서 합니다. 웨이퍼 상태로 시험하는 EDS(웨이퍼 테스트)는 소켓 대신 프로브 카드를 씁니다.', src: 'skhynix1' },
    { id: 'tdbi', ko: '번인 · TDBI', en: 'Burn-in / Test During Burn-In', short: '초기 불량을 미리 걸러 내는 시험', deep: '패키지 뒤의 번인을 SK하이닉스는 TDBI(Test During Burn-In)라 부릅니다. Amkor는 TDBI와 100% 번인을 서비스로 소개합니다.', src: 'skhynix1' },
    { id: 'temp', ko: 'Hot·Cold·Room 테스트', en: 'Tri-Temp Test', short: '높은·낮은·상온 온도에서 각각 시험', deep: 'SK하이닉스 설명으로 Hot 테스트는 규격 최고 온도보다 10% 이상 높은 온도, Cold 테스트는 최저 온도보다 10% 낮은 온도, Room 테스트는 보통 25 °C입니다. 여기에 속도를 보는 Speed 테스트가 있습니다.', src: 'skhynix1' },
    { id: 'bin', ko: '양품·불량 분류', en: 'Sorting (Binning)', short: '결과에 따라 패키지를 나눠 담는 것', deep: 'Advantest M6242는 테스트 뒤 양품과 불량품을 나누는 복합 암 기구를 둡니다. 현장에서 흔히 쓰는 "빈(Bin)"이라는 말은 이번 조사의 공식 원문에서 직접 확인하지 못했습니다.', src: 'advM6242' },
    { id: 'kit', ko: '체인지 키트', en: 'Change Kit', short: '패키지 종류에 맞춰 바꿔 끼우는 부품 묶음', deep: '한 핸들러로 여러 패키지를 시험하려고 테스트 트레이 같은 부품을 바꿔 끼우는 키트입니다.', src: 'advKit' },
    { id: 'tr', ko: '테이프 앤 릴', en: 'Tape & Reel (T&R)', short: '패키지를 테이프에 넣어 릴에 감는 포장', deep: 'Amkor는 테스트 뒤 Tape & Reel 핸들러로 포장하는 흐름을 소개합니다.', src: 'amkor' },
  ],
  sources: {
    advM6242: { title: 'M6242/M6243 Test Handler', publisher: 'Advantest', url: 'https://www.advantest.com/en/products/component-test-system/test-handler/m6242/', status: '읽음' },
    advKit: { title: 'Change Kit', publisher: 'Advantest', url: 'https://www.advantest.com/en/products/component-test-system/test-handler/change-kit/', status: '읽음' },
    advV93k: { title: 'V93000 EXA Scale', publisher: 'Advantest', url: 'https://www.advantest.com/en/products/semiconductor-test-system/soc/v93000-exa-scale/', status: '읽음' },
    teradyne: { title: 'Products', publisher: 'Teradyne', url: 'https://www.teradyne.com/products/', status: '읽음' },
    cohu: { title: 'Test Handlers', publisher: 'Cohu', url: 'https://www.cohu.com/test-handlers', status: '읽음' },
    amkor: { title: 'Test Services', publisher: 'Amkor', url: 'https://amkor.com/test-services/', status: '읽음' },
    skhynix1: { title: 'Semiconductor Back-End Process Episode 1: Understanding Semiconductor Testing', publisher: 'SK hynix Newsroom', url: 'https://news.skhynix.com/semiconductor-back-end-process-episode-1-understanding-semiconductor-testing/', status: '읽음' },
    samsung9: { title: '[반도체 8대 공정] 9탄 패키징 공정', publisher: '삼성전자 반도체 뉴스룸', url: 'https://news.samsungsemiconductor.com/kr/%eb%b0%98%eb%8f%84%ec%b2%b4-8%eb%8c%80-%ea%b3%b5%ec%a0%95-9%ed%83%84-%ec%99%b8%eb%b6%80%ed%99%98%ea%b2%bd%ec%9c%bc%eb%a1%9c%eb%b6%80%ed%84%b0-%eb%b0%98%eb%8f%84%ec%b2%b4%eb%a5%bc-%eb%b3%b4%ed%98%b8/', status: '읽음' },
  },
}
