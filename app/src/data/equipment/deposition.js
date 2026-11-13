// CVD 증착 장비 소개·조작 순서·결과물 데이터. 형식은 data/equipment/index.js 머리 주석을 보세요.
// 근거: review/equipment-front.md 0·4장. 장비사·뉴스룸 자료는 모두 "설명 출처"입니다. 모두 검수 전입니다.

export default {
  id: 'deposition',
  reviewed: false,
  kind: { ko: 'CVD 증착 장비 (매엽 클러스터 · 배치로)', en: 'CVD Deposition (Single-wafer Cluster / Batch Furnace)' },
  summary:
    '가스를 챔버에 넣어 웨이퍼 위에서 반응시켜 얇은 막을 쌓습니다. 플라즈마 CVD(PECVD)는 클러스터 툴의 챔버에서 한 장씩(또는 여러 스테이션에서 나눠), LPCVD·ALD는 산화로와 같은 수직 배치로에서 여러 장을 한꺼번에 처리합니다.',
  vendors: [
    { name: 'Lam Research', products: 'VECTOR(PECVD) · Striker(ALD) · ALTUS(W)', note: 'VECTOR는 한 모듈에 스테이션 4개(QSM)로 웨이퍼 안·웨이퍼 사이 균일도를 높이고, 3D NAND 적층에서 응력과 결함을 관리', src: 'lamVector' },
    { name: 'Applied Materials', products: 'Producer', note: '연차보고서(10-K): 한 유닛에 매엽 공정 챔버 2개가 든 트윈 챔버(Twin-Chamber) 모듈', src: 'amat10k' },
    { name: 'Tokyo Electron (TEL)', products: 'TELINDY PLUS · IRad', note: '배치 열 ALD(SiO₂·SiN·high-k)와 플라즈마 ALD', src: 'tel' },
    { name: 'KOKUSAI ELECTRIC', products: 'AdvancedAce · QUIXACE', note: '대형 배치로 박막·CVD. 수십 장을 한 번에 증착', src: 'kokusai' },
    { name: 'ASM International', products: 'ALD · PECVD · Vertical furnace', note: 'ALD로 옹스트롬 수준의 제어', src: 'asm' },
  ],
  vendorNote: '삼성전자·SK하이닉스가 어떤 CVD 장비를 쓰는지는 공식 페이지에서 확인하지 못했습니다. SK하이닉스 교육센터에 박막 CVD 장비 실습이 있다는 사실만 확인했습니다.',
  modules: [
    { id: 'loadport', name: { ko: '로드포트', en: 'Load Port' }, desc: 'OHT가 실어 온 FOUP을 내려놓는 입구입니다.', src: 'samsungFab' },
    { id: 'efem', name: { ko: 'EFEM', en: 'Equipment Front End Module' }, desc: '대기압 로봇이 FOUP의 웨이퍼를 로드락으로 넘깁니다(일반 구조, 특허 검색 요약).', src: 'patent' },
    { id: 'loadlock', name: { ko: '로드락', en: 'Load Lock' }, desc: '대기압과 진공을 바꿔 웨이퍼를 진공 쪽으로 넘기는 작은 방입니다(일반 구조, 특허 검색 요약).', src: 'patent' },
    { id: 'transfer', name: { ko: '진공 이송 챔버', en: 'Vacuum Transfer Chamber' }, desc: '가운데 로봇이 진공을 유지한 채 웨이퍼를 공정 모듈로 나릅니다.', src: 'patent' },
    { id: 'chamber', name: { ko: 'PECVD 챔버', en: 'PECVD Chamber' }, desc: '평행판 전극 사이에 플라즈마를 켜고 가열 받침대(서셉터, Susceptor) 위 웨이퍼에 막을 쌓습니다. 식각 챔버와 비슷하지만 증착 가스를 씁니다.', src: 'mitPvd' },
    { id: 'qsm', name: { ko: '멀티 스테이션 모듈', en: 'Quad Station Module' }, desc: '한 모듈 안에 스테이션 4개가 있어 웨이퍼가 스테이션을 차례로 옮겨 가며 막을 나눠 쌓습니다(Lam VECTOR).', src: 'lamVector' },
    { id: 'gas', name: { ko: '가스 캐비닛', en: 'Gas Cabinet' }, desc: '온도와 함께 가스 혼합·압력·유량을 조절합니다. 기체 속에서 입자가 생기지 않도록 낮은 분압(LPCVD)을 쓰기도 합니다.', src: 'mitCvd' },
  ],
  operation: [
    { id: 'oht', who: 'OHT', at: 'loadport', lot: 'loadport', title: 'FOUP 도착', desc: 'OHT가 FOUP을 로드포트에 내려놓습니다.', src: 'samsungFab' },
    { id: 'recipe', who: '작업자', at: 'loadport', lot: 'loadport', title: '레시피 선택', desc: '온도·가스 혼합·압력·유량(PECVD는 RF 전력까지)을 정한 레시피를 고릅니다.', src: 'mitCvd' },
    { id: 'transfer', who: '장비', at: 'loadlock', lot: 'loadlock', title: '로드락 → 이송 챔버', desc: 'EFEM이 웨이퍼를 로드락에 넣고, 진공으로 바꾼 뒤 이송 로봇이 공정 모듈로 나릅니다.', terms: ['loadlock'], src: 'patent' },
    { id: 'heat', who: '장비', at: 'chamber', lot: 'chamber', title: '예열', desc: '가열 받침대에서 웨이퍼를 데웁니다. Lam VECTOR는 막 증착과 따로 웨이퍼를 데우는 방식을 씁니다.', src: 'lamVector' },
    { id: 'deposit', who: '장비', at: 'chamber', lot: 'chamber', title: '플라즈마 증착', desc: '가스를 넣고 플라즈마를 켜 막을 쌓습니다. 플라즈마 CVD는 낮은 온도에서도 되고 두께 균일도를 조절할 수 있으며 대량 처리가 가능합니다.', terms: ['pecvd', 'uniformity'], src: 'samsung6' },
    { id: 'station', who: '장비', at: 'qsm', lot: 'qsm', title: '스테이션 순차 증착', desc: '멀티 스테이션 모듈에서는 웨이퍼가 스테이션을 차례로 옮겨 가며 막을 나눠 쌓아 고르게 만듭니다.', terms: ['qsm'], src: 'lamVector' },
    { id: 'clean', who: '장비', at: 'gas', lot: 'loadlock', title: '반출 · 챔버 세정', desc: '웨이퍼를 꺼내고 챔버 벽에 쌓인 막을 가스로 세정합니다(TEL 배치로의 Gas cleaning 옵션).', src: 'tel' },
    { id: 'measure', who: '작업자', at: 'loadport', lot: 'loadport', title: '두께·균일도·스텝 커버리지 계측', desc: '막 두께와 균일도, 홈 위아래 두께 차이(스텝 커버리지)를 재고 다음 공정으로 보냅니다.', terms: ['step'], src: 'skhynix5' },
  ],
  outputs: {
    product: '얇은 막이 덮인 웨이퍼 — 절연막(SiO₂·SiN, 하드마스크, 반사 방지막, 패시베이션)이나 도전막(텅스텐, 폴리실리콘).',
    metrics: ['막 두께', '균일도(Uniformity)', '스텝 커버리지(Step Coverage)', '막 응력(Stress)'],
    notes: [
      { text: '박막의 얇기와 균일성이 반도체 품질을 좌우합니다.', src: 'samsung6' },
      { text: 'CVD 부산물 가스는 불순물 오염을, 막과 아래층의 열팽창 차이는 패턴 손상을 일으킬 수 있습니다.', src: 'skhynix5' },
      { text: '기체 속에서 입자가 생기는 것을 피하려고 낮은 분압(LPCVD)을 씁니다.', src: 'mitCvd' },
    ],
  },
  terms: [
    { id: 'pecvd', ko: 'PECVD', en: 'Plasma Enhanced CVD', short: '플라즈마로 낮은 온도에서 막을 쌓는 CVD', deep: '열만으로 반응시키기 어려운 낮은 온도에서도 플라즈마가 반응을 돕습니다. 삼성 뉴스룸은 저온 형성, 두께 균일도 조절, 대량 처리를 장점으로 듭니다.', src: 'samsung6' },
    { id: 'lpcvd', ko: 'LPCVD', en: 'Low Pressure CVD', short: '낮은 압력·고온 배치로에서 쌓는 CVD', deep: '압력을 낮추면 가스 전달이 좋아져 막이 고르고 등각성이 좋아집니다. MIT 실습에서는 산화로와 비슷한 반응관에서 도핑 폴리실리콘을 쌓습니다.', src: 'mitCvd' },
    { id: 'ald', ko: 'ALD', en: 'Atomic Layer Deposition', short: '원자층 단위로 한 겹씩 쌓는 증착', deep: '원료를 번갈아 넣는 과정을 반복해 막 두께를 원자 수준으로 조절합니다.', src: 'skhynix5' },
    { id: 'uniformity', ko: '균일도', en: 'Uniformity', short: '막이 고르게 쌓인 정도', deep: '막 재료가 얼마나 고르게 형성되는지를 봅니다. Lam VECTOR는 웨이퍼 안·웨이퍼 사이 균일도를 강조합니다.', src: 'skhynix5' },
    { id: 'step', ko: '스텝 커버리지', en: 'Step Coverage', short: '홈 위·아래 막 두께 차이', deep: '깊은 홈이 있는 곳에서 위쪽 막과 아래쪽 막의 두께 차이입니다. 차이가 크면 홈 안쪽 막이 얇아 절연이 약해집니다.', src: 'skhynix5' },
    { id: 'qsm', ko: '멀티 스테이션 순차 증착', en: 'Multi-Station Sequential Deposition', short: '스테이션을 옮겨 가며 나눠 쌓기', deep: 'Lam은 한 모듈에 스테이션 4개(QSM)를 두고 웨이퍼가 차례로 옮겨 가며 막을 나눠 쌓는 구조를 연차보고서에서 "Multi-Station Sequential Deposition"이라 부릅니다.', src: 'lamVector' },
    { id: 'loadlock', ko: '로드락', en: 'Load Lock', short: '대기압과 진공을 바꿔 주는 작은 방', deep: '공정 챔버를 늘 진공으로 두기 위해 웨이퍼만 드나드는 방입니다. 특허 검색 요약에 근거한 일반 구조입니다.', src: 'patent' },
  ],
  sources: {
    lamVector: { title: 'VECTOR Product Family', publisher: 'Lam Research', url: 'https://www.lamresearch.com/product/vector-product-family/', status: '읽음' },
    amat10k: { title: 'Form 10-K FY2012', publisher: 'Applied Materials (SEC)', url: 'https://www.sec.gov/Archives/edgar/data/0000006951/000000695112000018/amat10282012-10kdoc.htm', status: '읽음' },
    tel: { title: 'TELINDY PLUS 제품 페이지', publisher: 'Tokyo Electron', url: 'https://www.tel.co.jp/product/telindy.html', status: '읽음' },
    kokusai: { title: 'Products', publisher: 'KOKUSAI ELECTRIC', url: 'https://www.kokusai-electric.com/en/products/', status: '읽음' },
    asm: { title: 'Our technology & products', publisher: 'ASM International', url: 'https://www.asm.com/our-technology-products', status: '읽음' },
    skhynix5: { title: 'Semiconductor Front-End Process Episode 5', publisher: 'SK hynix Newsroom', url: 'https://news.skhynix.com/semiconductor-front-end-process-episode-5/', status: '읽음' },
    samsung6: { title: '[반도체 8대 공정] 6탄 증착&이온주입', publisher: '삼성전자 반도체 뉴스룸', url: 'https://news.samsungsemiconductor.com/kr/%EB%B0%98%EB%8F%84%EC%B2%B4-8%EB%8C%80-%EA%B3%B5%EC%A0%95-6%ED%83%84-%EB%B0%98%EB%8F%84%EC%B2%B4%EC%97%90-%EC%A0%84%EA%B8%B0%EC%A0%81-%ED%8A%B9%EC%84%B1%EC%9D%84-%EC%9E%85%ED%9E%88%EB%8B%A4/', status: '읽음' },
    mitCvd: { title: '6.152J CVD lecture notes', publisher: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu/courses/6-152j-micro-nano-processing-technology-fall-2005/cvd.pdf', status: 'PDF 추출' },
    mitPvd: { title: '6.152J PVD (Sputtering) lecture notes', publisher: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu/courses/6-152j-micro-nano-processing-technology-fall-2005/pvd_1.pdf', status: 'PDF 추출' },
    samsungFab: { title: '우리 반모 할래 7탄 (2021.04.22, FOUP·OHT·클린룸)', publisher: '삼성전자 반도체 뉴스룸', url: 'https://news.samsungsemiconductor.com/kr/', status: '읽음 · 제목으로 검색' },
    patent: { title: '클러스터 툴 구성 (미국 특허 검색 요약)', publisher: 'USPTO', url: '', status: '검색 요약 · 일반 구조 참고' },
  },
}
