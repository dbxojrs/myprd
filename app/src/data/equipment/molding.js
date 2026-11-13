// 몰딩 프레스 장비 소개·조작 순서·결과물 데이터. 형식은 data/equipment/index.js 머리 주석을 보세요.
// 근거: review/equipment-back.md 5장. 장비사·뉴스룸 자료는 모두 "설명 출처"입니다. 모두 검수 전입니다.
// 출처로 확인하지 못한 단계는 src: 'app'(이 앱의 교육용 가동 순서)으로 따로 표시합니다.

export default {
  id: 'molding',
  reviewed: false,
  kind: { ko: '트랜스퍼 몰딩 프레스', en: 'Transfer Molding Press' },
  summary:
    '와이어 본딩을 마친 스트립(Strip)을 금형에 넣고, 녹인 EMC를 게이트(Gate)로 밀어 넣어 칩과 와이어를 감싼 뒤 굳히는 봉지(Encapsulation) 장비입니다. 프레스가 위·아래 금형을 꽉 닫고, 플런저(Plunger)가 수지를 밀어 넣습니다.',
  vendors: [
    { name: 'TOWA', products: 'YPM 시리즈 (트랜스퍼)', note: 'YPM1200은 200톤 프레스, 듀얼 플런저·롱 태블릿 옵션, 플런저 분진 수집. YPM1180은 이형 필름 대응', src: 'towaYpm' },
    { name: 'TOWA', products: 'CPM 시리즈 (컴프레션)', note: '자동 수지 계량 디스펜서(과립·액상), 이형 필름 프리컷, cavity-down 구조. WLP·PLP·HBM·2.5D/3D 대응', src: 'towaCpm' },
  ],
  vendorNote:
    'ASMPT·Besi의 몰딩 장비는 이번 조사에서 공식 페이지를 열지 못했습니다. 삼성전자·SK하이닉스가 어떤 몰딩 장비를 쓰는지는 공식 페이지에서 확인하지 못했습니다. 로더·언로더·디게이팅·금형 클리너의 정확한 배치도 출처로 확인하지 못했습니다.',
  modules: [
    { id: 'handler', name: { ko: '핸들러 로봇', en: 'Handler Robot' }, desc: '스트립을 금형으로 옮겨 넣고, 다 굳은 몰드 스트립을 꺼내는 자동 이송부입니다.', src: 'towaCpm' },
    { id: 'tablet', name: { ko: '태블릿 공급·플런저', en: 'Tablet Feeder / Plunger' }, desc: '알약 모양으로 굳힌 EMC 태블릿(Tablet)을 넣고, 녹은 수지를 플런저로 밀어 냅니다. 플런저를 두 개 쓰는 듀얼 플런저 장비도 있습니다.', src: 'towaYpm' },
    { id: 'press', name: { ko: '프레스', en: 'Press' }, desc: '위·아래 금형을 큰 힘으로 눌러 닫습니다. YPM1200은 200톤급이고, YPM1120은 위·아래를 각각 AC 서보로 움직입니다.', src: 'towaYpm' },
    { id: 'mold', name: { ko: '금형·캐비티·게이트', en: 'Mold / Cavity / Gate' }, desc: '스트립의 칩 자리마다 패키지 모양의 빈 공간(캐비티, Cavity)이 있고, 수지는 게이트를 지나 캐비티를 채웁니다.', src: 'towa' },
    { id: 'film', name: { ko: '이형 필름', en: 'Release Film' }, desc: '금형 면에 까는 필름으로, 굳은 수지가 금형에서 잘 떨어지게 합니다. YPM1180과 CPM 시리즈가 대응합니다.', src: 'towaYpm' },
    { id: 'dust', name: { ko: '플런저 분진 수집', en: 'Plunger Dust Collection' }, desc: '플런저가 움직이며 생기는 수지 가루를 모읍니다(YPM1200).', src: 'towaYpm' },
  ],
  operation: [
    { id: 'recipe', who: '작업자', at: 'handler', lot: 'handler', title: '로트 확인 · 레시피 선택', desc: '와이어 본딩을 마친 스트립 로트를 확인하고, 금형 온도·플런저 속도·압력·경화 시간이 정해진 레시피를 고릅니다.', terms: ['recipe'], src: 'app' },
    { id: 'load', who: '장비', at: 'handler', lot: 'mold', title: '스트립 세팅', desc: '핸들러 로봇이 스트립을 아래 금형의 캐비티 자리에 올려놓습니다.', terms: ['cavity'], src: 'towaCpm' },
    { id: 'film', who: '장비', at: 'film', lot: 'mold', title: '이형 필름 공급', desc: '금형 면에 이형 필름을 깔아 굳은 수지가 금형에 달라붙지 않게 합니다.', terms: ['film'], src: 'towaYpm' },
    { id: 'clamp', who: '장비', at: 'press', lot: 'mold', title: '금형 닫기 (형 체결)', desc: '프레스가 위·아래 금형을 눌러 닫습니다. 금형 틈으로 수지가 새어 나온 것을 플래시(Flash)라고 합니다.', terms: ['flash'], src: 'towaYpm' },
    { id: 'transfer', who: '장비', at: 'tablet', lot: 'tablet', title: '태블릿 녹이기 · 밀어 넣기', desc: 'EMC 태블릿을 녹여 플런저로 밀어 넣으면, 수지가 게이트를 지나 캐비티를 채웁니다.', terms: ['emc', 'tablet', 'gate'], src: 'skhynix6' },
    { id: 'cure', who: '장비', at: 'mold', lot: 'mold', title: '금형 안에서 경화', desc: '채워진 수지를 금형 안에서 열로 굳힙니다.', src: 'towa' },
    { id: 'unload', who: '장비', at: 'handler', lot: 'handler', title: '금형 열기 · 꺼내기', desc: '금형을 열고 핸들러가 굳은 몰드 스트립을 꺼냅니다.', src: 'app' },
    { id: 'next', who: '작업자', at: 'handler', lot: 'handler', title: '몰드 스트립 확인 · 마킹으로', desc: '봉지된 스트립을 확인하고 다음 공정인 레이저 마킹으로 보냅니다.', src: 'skhynix6' },
  ],
  outputs: {
    product: 'EMC로 칩과 와이어를 감싸 밀봉한 몰드 스트립 — 다음 공정인 레이저 마킹으로 갑니다.',
    metrics: ['패키지(몰드) 두께 정확도', '수지 누출(플래시) 여부', '캐비티 충전 상태'],
    notes: [
      { text: '트랜스퍼 몰딩은 패키지가 얇아지고 기판이 커지면서 한계가 있어, 미리 금형에 수지를 채우는 컴프레션 몰딩도 씁니다.', src: 'skhynix6' },
      { text: '와이어 스윕·보이드·미충전 같은 결함과 X선·초음파(SAT) 검사는 이번 조사의 허용 출처로 확인하지 못해, 이 앱의 교육용 규칙으로만 보여줍니다.', src: 'app' },
    ],
  },
  terms: [
    { id: 'transfer', ko: '트랜스퍼 몰딩', en: 'Transfer Molding', short: '녹인 수지를 게이트로 밀어 넣어 굳히는 방식', deep: '흐르는 수지를 게이트(공급구)를 통해 칩 주변으로 보낸 뒤 굳힙니다. EMC 태블릿을 녹여 금형으로 밀어 넣는 방식이라, 패키지가 얇고 기판이 클수록 수지가 끝까지 흐르기 어렵습니다.', src: 'towa' },
    { id: 'compression', ko: '컴프레션 몰딩', en: 'Compression Molding', short: '미리 담아 둔 수지에 칩을 담가 눌러 굳히는 방식', deep: '금형(캐비티)에 수지를 계량해 미리 채워 두고, 기판을 담가 눌러 굳힙니다. TOWA CPM은 과립·액상 수지를 자동으로 계량하는 디스펜서를 쓰고, 웨이퍼·패널 같은 큰 기판과 HBM·2.5D/3D 패키지에 대응합니다.', src: 'towaCpm' },
    { id: 'emc', ko: 'EMC', en: 'Epoxy Molding Compound', short: '패키지 몸체를 만드는 열경화성 수지', deep: '열경화성 수지와 무기 필러로 이루어진 봉지 재료입니다. 검은색 EMC는 레이저 마킹 글자가 잘 보이게 해 줍니다.', src: 'skhynix6' },
    { id: 'tablet', ko: '태블릿·플런저', en: 'Tablet / Plunger', short: '알약 모양 수지 덩어리와 그것을 밀어 내는 피스톤', deep: '트랜스퍼 몰딩은 EMC를 태블릿 형태로 넣어 녹이고, 플런저가 밀어 금형으로 보냅니다. TOWA YPM1200은 듀얼 플런저와 긴 태블릿 옵션이 있습니다.', src: 'towaYpm' },
    { id: 'gate', ko: '게이트', en: 'Gate', short: '수지가 캐비티로 들어가는 입구', deep: 'TOWA는 트랜스퍼 방식을 "게이트(공급구)를 통해 수지를 칩 주변에 공급"한다고 설명합니다. 사이드 게이트·탑 게이트처럼 위치가 다른 방식이 있고, 에지 게이트로 수지 누출을 막는 금형도 있습니다.', src: 'towaYpm' },
    { id: 'cavity', ko: '캐비티', en: 'Cavity', short: '패키지 모양대로 파인 금형의 빈 공간', deep: '수지가 채워져 패키지 몸체가 되는 공간입니다. TOWA CPM1180은 캐비티가 아래를 향하는 cavity-down 구조를 씁니다.', src: 'towaCpm' },
    { id: 'film', ko: '이형 필름', en: 'Release Film', short: '굳은 수지가 금형에서 잘 떨어지게 까는 필름', deep: 'TOWA는 이형 필름(T 시리즈)을 따로 공급하고, YPM1180과 CPM 시리즈가 이형 필름에 대응합니다. CPM은 필름을 미리 잘라(프리컷) 씁니다.', src: 'towaCpm' },
    { id: 'flash', ko: '플래시', en: 'Flash', short: '금형 틈으로 새어 나와 굳은 얇은 수지', deep: '금형 사이 틈으로 수지가 새어 나오면 패키지 가장자리에 얇은 수지 막이 남습니다. TOWA YPM은 에지 게이트로 이런 수지 누출을 막는다고 설명합니다.', src: 'towaYpm' },
    { id: 'recipe', ko: '레시피', en: 'Recipe', short: '장비가 따라 할 공정 조건 묶음', deep: '온도·속도·압력·시간 같은 조건을 묶어 저장한 것입니다. 몰딩에서 어떤 값을 레시피에 넣는지는 출처로 확인하지 못했고, 이 앱의 조작반 조건을 예로 씁니다.', src: 'app' },
  ],
  sources: {
    towa: { title: 'Molding Equipment', publisher: 'TOWA', url: 'https://www.towajapan.co.jp/en/products/molding/', status: '읽음' },
    towaYpm: { title: 'YPM Series', publisher: 'TOWA', url: 'https://www.towajapan.co.jp/en/products/molding/ypm/', status: '읽음' },
    towaCpm: { title: 'CPM Series', publisher: 'TOWA', url: 'https://www.towajapan.co.jp/en/products/molding/cpm/', status: '읽음' },
    skhynix6: { title: 'Semiconductor Back-End Process Episode 6: Conventional Packages', publisher: 'SK hynix Newsroom', url: 'https://news.skhynix.com/semiconductor-back-end-process-episode-6-conventional-packages/', status: '읽음' },
    app: { title: '이 앱 장비 시뮬레이터의 가동 순서·규칙', publisher: '이 앱', url: '', status: '교육용 가설 · 출처 미확인' },
  },
}
