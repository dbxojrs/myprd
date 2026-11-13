// 금속 배선(PVD 스퍼터) 장비 소개·조작 순서·결과물 데이터. 형식은 data/equipment/index.js 머리 주석을 보세요.
// 근거: review/equipment-front.md 0·6장. 장비사·뉴스룸 자료는 모두 "설명 출처"입니다. 모두 검수 전입니다.

export default {
  id: 'metallization',
  reviewed: false,
  kind: { ko: 'PVD 스퍼터 장비 (클러스터 툴)', en: 'PVD Sputtering System (Cluster Tool)' },
  summary:
    '진공 챔버의 아르곤 플라즈마로 금속 타깃(Target)을 때려 떨어진 금속 원자를 웨이퍼에 쌓습니다. 금속 배선 전용 장비가 따로 있는 것은 아니고, PVD·CVD·도금·식각·CMP 장비를 이어 써서 배선을 만듭니다.',
  vendors: [
    { name: 'Applied Materials', products: 'Endura(PVD) · Reflexion(CMP)', note: '연차보고서(10-K): Endura는 폭넓은 금속 증착 공정, Reflexion LK는 300mm CMP', src: 'amat10k' },
    { name: 'Tokyo Electron (TEL)', products: 'EXIM · LEXIA-EX', note: 'EXIM은 공정 모듈을 용도에 맞게 자유롭게 배치하는 멀티 캐소드 PVD, LEXIA-EX는 초고진공 챔버와 4타깃 챔버', src: 'telExim' },
    { name: 'Lam Research', products: 'SABRE(Cu 전해도금) · ALTUS(W)', note: 'SABRE는 구리 다마신용 정밀 금속 도금', src: 'lamDep' },
  ],
  vendorNote: '삼성전자·SK하이닉스가 어떤 PVD·CMP 장비를 쓰는지는 공식 페이지에서 확인하지 못했습니다. 삼성 뉴스룸에는 CMP 엔지니어가 "슬러리와 패드로 웨이퍼 표면을 평탄화"한다는 업무 설명만 나옵니다.',
  modules: [
    { id: 'loadport', name: { ko: '로드포트', en: 'Load Port' }, desc: 'OHT가 실어 온 FOUP을 내려놓는 입구입니다.', src: 'samsungFab' },
    { id: 'efem', name: { ko: 'EFEM', en: 'Equipment Front End Module' }, desc: '대기압 로봇이 FOUP의 웨이퍼를 로드락으로 넘깁니다(일반 구조, 특허 검색 요약).', src: 'patent' },
    { id: 'loadlock', name: { ko: '로드락', en: 'Load Lock' }, desc: '대기압과 진공을 바꿔 웨이퍼를 진공 쪽으로 넘기는 작은 방입니다(일반 구조, 특허 검색 요약).', src: 'patent' },
    { id: 'transfer', name: { ko: '진공 이송 챔버', en: 'Vacuum Transfer Chamber' }, desc: '진공을 깨지 않고 웨이퍼를 프리클린·배리어·시드 챔버로 차례로 나릅니다.', src: 'amatCubs' },
    { id: 'preclean', name: { ko: '프리클린 챔버', en: 'Preclean Chamber' }, desc: '금속을 쌓기 전에 웨이퍼 표면을 걷어 냅니다(AMAT "Aktiv Preclean", 검색 요약).', src: 'amatCubs' },
    { id: 'barrier', name: { ko: '배리어 챔버', en: 'Barrier Chamber' }, desc: '구리가 절연막으로 퍼지지 않게 막는 배리어 금속(Ta 계열)을 쌓습니다.', src: 'skhynix6' },
    { id: 'sputter', name: { ko: '스퍼터(시드) 챔버', en: 'Sputter Chamber' }, desc: '음극인 금속 타깃을 아르곤 이온이 때려 떨어진 원자가 웨이퍼에 쌓입니다. 타깃이 부도체면 RF 스퍼터링을 씁니다.', src: 'mitPvd' },
    { id: 'gas', name: { ko: '아르곤 가스 박스', en: 'Argon Gas Box' }, desc: '아르곤을 넣어 10–100 mTorr에서 플라즈마를 만듭니다.', src: 'mitPvd' },
  ],
  operation: [
    { id: 'oht', who: 'OHT', at: 'loadport', lot: 'loadport', title: 'FOUP 도착', desc: 'OHT가 FOUP을 로드포트에 내려놓습니다.', src: 'samsungFab' },
    { id: 'recipe', who: '작업자', at: 'loadport', lot: 'loadport', title: '레시피 선택', desc: '압력·전력·온도·시간이 묶인 레시피를 고르고 로트를 시작합니다.', src: 'samsungRecipe' },
    { id: 'loadlock', who: '장비', at: 'loadlock', lot: 'loadlock', title: '로드락 감압', desc: 'EFEM이 웨이퍼를 로드락에 넣고 진공으로 바꿉니다.', src: 'patent' },
    { id: 'preclean', who: '장비', at: 'preclean', lot: 'preclean', title: '프리클린', desc: '표면 산화막·오염을 걷어 내 금속이 잘 붙게 합니다(검색 요약).', terms: ['preclean'], src: 'amatCubs' },
    { id: 'barrier', who: '장비', at: 'barrier', lot: 'barrier', title: '배리어 증착', desc: '배리어 금속을 먼저 쌓아 구리 확산을 막습니다.', terms: ['barrier'], src: 'skhynix6' },
    { id: 'seed', who: '장비', at: 'sputter', lot: 'sputter', title: '시드(금속막) 증착', desc: '진공을 깨지 않고 이어서 금속을 스퍼터링합니다. 구리 배선이면 도금의 씨앗이 되는 시드층입니다.', terms: ['sputter', 'target'], src: 'skhynix6' },
    { id: 'unload', who: '장비', at: 'loadlock', lot: 'loadlock', title: '반출', desc: '로드락으로 꺼내 대기압으로 되돌립니다.', src: 'patent' },
    { id: 'measure', who: '작업자', at: 'loadport', lot: 'loadport', title: '두께·면저항 계측', desc: '금속막 두께와 저항을 잽니다(계측 항목은 일반적인 해석).', src: 'telExim' },
    { id: 'cmp', who: '장비', at: 'loadport', lot: 'loadport', title: '다음: 도금 → CMP', desc: '구리 다마신은 시드 위에 전해도금으로 채운 뒤 넘친 구리를 CMP로 갈아 냅니다.', terms: ['damascene', 'cmp'], src: 'skhynix6' },
  ],
  outputs: {
    product: '금속막이 덮인 웨이퍼 — 이어지는 공정을 거쳐 금속 배선·콘택·비아가 됩니다.',
    metrics: ['막 두께', '면내 균일도·재현성', '스텝 커버리지(비아 바닥·벽)', '파티클'],
    notes: [
      { text: '배선 안이 비는 보이드, 구리가 절연막으로 퍼져 생기는 누설 전류, 금속–실리콘 경계의 높은 저항이 대표 결함입니다.', src: 'skhynix6' },
      { text: '스퍼터링은 단차 피복이 나쁜 편이고, 압력을 높이면 단차 피복이 좋아집니다.', src: 'mitPvd' },
      { text: 'TEL은 PVD 품질로 면내 균일도·재현성·파티클을 듭니다.', src: 'telExim' },
    ],
  },
  terms: [
    { id: 'sputter', ko: '스퍼터링', en: 'Sputtering', short: '이온으로 타깃을 때려 원자를 떼어 쌓기', deep: '아르곤 플라즈마의 Ar⁺ 이온이 음극(타깃)으로 가속돼 부딪치면, 중성 타깃 원자가 튀어나와 기판에 쌓입니다. 화학 반응이 없는 물리 증착입니다.', src: 'mitPvd' },
    { id: 'target', ko: '타깃', en: 'Target', short: '쌓을 금속 원료 판', deep: '스퍼터링의 음극이자 원료입니다. TEL LEXIA-EX에는 타깃 4개를 단 챔버와 큰 타깃 2개를 단 챔버가 있습니다.', src: 'telExim' },
    { id: 'barrier', ko: '배리어 메탈', en: 'Barrier Metal', short: '금속이 절연막·실리콘으로 퍼지는 것을 막는 막', deep: '구리 배선은 절연막 안으로 구리 원자가 퍼지면 누설 전류가 생겨 Ta 계열 배리어를 먼저 쌓습니다.', src: 'skhynix6' },
    { id: 'preclean', ko: '프리클린', en: 'Preclean', short: '증착 직전 표면 세정', deep: '금속을 쌓기 전에 표면을 걷어 내 접촉 저항을 낮춥니다. AMAT 제품 소개 검색 요약에 나오는 단계입니다.', src: 'amatCubs' },
    { id: 'damascene', ko: '다마신', en: 'Damascene', short: '홈을 먼저 파고 금속을 채운 뒤 갈아 내는 배선법', deep: '절연막에 홈을 판 뒤 배리어 → 구리 시드 → 전해도금으로 채우고, 넘친 구리를 갈아 냅니다. 구리는 식각이 어려워 이렇게 만듭니다.', src: 'skhynix6' },
    { id: 'cmp', ko: 'CMP', en: 'Chemical Mechanical Polishing', short: '슬러리와 패드로 표면을 평탄화', deep: 'CMP 엔지니어는 슬러리와 패드로 웨이퍼 표면을 평탄화합니다. AMAT Reflexion LK는 300mm CMP 장비입니다.', src: 'samsungRecipe' },
    { id: 'em', ko: '일렉트로마이그레이션', en: 'Electromigration (EM)', short: '금속 배선의 신뢰성 문제 가운데 하나', deep: 'SK하이닉스 전공정 연재에서 금속 배선의 신뢰성 문제로 일렉트로마이그레이션(EM)을 다룹니다. 자세한 원리는 이 앱의 출처 노트에서 아직 확인하지 않았습니다.', src: 'skhynix5' },
  ],
  sources: {
    amat10k: { title: 'Form 10-K FY2012', publisher: 'Applied Materials (SEC)', url: 'https://www.sec.gov/Archives/edgar/data/0000006951/000000695112000018/amat10282012-10kdoc.htm', status: '읽음' },
    amatCubs: { title: 'Endura CuBS RF XT PVD', publisher: 'Applied Materials', url: 'https://www.appliedmaterials.com/us/en/product-library/endura-cubs-rf-xt-pvd.html', status: '검색 요약(원문 403)' },
    telExim: { title: 'EXIM / LEXIA-EX', publisher: 'Tokyo Electron', url: 'https://www.tel.co.jp/product/exim.html', status: '읽음' },
    lamDep: { title: 'Deposition (공정 소개)', publisher: 'Lam Research', url: 'https://www.lamresearch.com/products/our-processes/deposition/', status: '읽음' },
    skhynix6: { title: 'Semiconductor Front-End Process Episode 6', publisher: 'SK hynix Newsroom', url: 'https://news.skhynix.com/semiconductor-front-end-process-episode-6/', status: '읽음' },
    skhynix5: { title: 'Semiconductor Front-End Process Episode 5', publisher: 'SK hynix Newsroom', url: 'https://news.skhynix.com/semiconductor-front-end-process-episode-5/', status: '읽음' },
    mitPvd: { title: '6.152J PVD (Sputtering) lecture notes', publisher: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu/courses/6-152j-micro-nano-processing-technology-fall-2005/pvd_1.pdf', status: 'PDF 추출' },
    samsungFab: { title: '우리 반모 할래 7탄 (2021.04.22, FOUP·OHT·클린룸)', publisher: '삼성전자 반도체 뉴스룸', url: 'https://news.samsungsemiconductor.com/kr/', status: '읽음 · 제목으로 검색' },
    samsungRecipe: { title: '나는 신입사원입니다 시즌2 Ep.2 (2024.01.18)', publisher: '삼성전자 반도체 뉴스룸', url: 'https://news.samsungsemiconductor.com/kr/', status: '읽음 · 제목으로 검색' },
    patent: { title: '클러스터 툴 구성 (미국 특허 검색 요약)', publisher: 'USPTO', url: '', status: '검색 요약 · 일반 구조 참고' },
  },
}
