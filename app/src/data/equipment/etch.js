// 건식 식각기 장비 소개·조작 순서·결과물 데이터. 형식은 data/equipment/index.js 머리 주석을 보세요.
// 근거: review/equipment-front.md 0·3장. 장비사·뉴스룸 자료는 모두 "설명 출처"입니다. 모두 검수 전입니다.

export default {
  id: 'etch',
  reviewed: false,
  kind: { ko: '플라즈마 건식 식각기 (클러스터 툴)', en: 'Plasma Dry Etcher (Cluster Tool)' },
  summary:
    '진공 이송 챔버 둘레에 공정 챔버 여러 개를 붙인 클러스터 툴(Cluster Tool)입니다. 각 챔버에서 가스를 플라즈마로 만들어, 감광액이 열린 곳의 막을 한 장씩(매엽) 깎습니다.',
  vendors: [
    { name: 'Lam Research', products: 'Kiyo · Flex · Akara · Sense.i', note: 'Kiyo는 대칭 챔버, 정전척, 웨이퍼 없이 하는 자동 세정(waferless auto-clean). Sense.i는 고밀도 플랫폼과 자율 보정·정비', src: 'lamKiyo' },
    { name: 'Tokyo Electron (TEL)', products: 'Tactras', note: '300mm 식각 장비로 식각 챔버를 최대 6개까지 실을 수 있음', src: 'telTactras' },
    { name: 'Applied Materials', products: 'Centura', note: '연차보고서(10-K): 기본 플랫폼에 공정 챔버 여러 개를 붙인 매엽 시스템', src: 'amat10k' },
  ],
  vendorNote:
    'SK하이닉스 식각 글에는 식각 깊이를 빛 반사로 추정하는 "Lam Spectral Reflectometer(LSR)"라는 용어가 나오지만 장비 전체 구성은 공개되지 않았습니다. Lam 연차보고서는 삼성전자·SK하이닉스를 주요 고객으로 적었지만 어떤 장비인지는 없습니다. 삼성전자의 식각 장비는 확인하지 못했습니다.',
  modules: [
    { id: 'loadport', name: { ko: '로드포트', en: 'Load Port' }, desc: 'OHT가 실어 온 FOUP을 내려놓는 입구입니다.', src: 'samsungFab' },
    { id: 'efem', name: { ko: 'EFEM', en: 'Equipment Front End Module' }, desc: '대기압 상태에서 로봇이 FOUP의 웨이퍼를 꺼내 로드락으로 넘기는 앞단 상자입니다(일반 구조, 특허 검색 요약).', src: 'patent' },
    { id: 'loadlock', name: { ko: '로드락', en: 'Load Lock' }, desc: '문이 두 개인 작은 방입니다. 웨이퍼를 넣고 공기를 빼 대기압에서 진공으로 바꾼 뒤 안쪽으로 넘깁니다(일반 구조, 특허 검색 요약).', src: 'patent' },
    { id: 'transfer', name: { ko: '진공 이송 챔버', en: 'Vacuum Transfer Chamber' }, desc: '가운데 로봇이 진공을 깨지 않고 웨이퍼를 공정 챔버로 나릅니다. AMAT는 이를 "기본 플랫폼에 붙은 여러 공정 챔버"로 설명합니다.', src: 'amat10k' },
    { id: 'chamber', name: { ko: '식각 챔버', en: 'Process Chamber' }, desc: '정전척(ESC)이 웨이퍼를 붙잡고, 가스를 플라즈마로 만들어 깎습니다. ICP 방식은 유전체 창 위 유도 코일로 고밀도 플라즈마를 만들어 밀도와 웨이퍼 바이어스를 따로 조절합니다.', src: 'mitL17' },
    { id: 'gas', name: { ko: '가스 박스', en: 'Gas Box' }, desc: '대기압보다 낮은 진공 챔버에 식각 가스를 넣고, 전기 에너지를 공급해 플라즈마를 만듭니다.', src: 'samsung5' },
    { id: 'pump', name: { ko: '배기·스크러버', en: 'Exhaust / Scrubber' }, desc: '배기 가스를 중화하는 스크러버(Scrubber)가 배기 라인에 달립니다.', src: 'skhynixEtch21' },
  ],
  operation: [
    { id: 'oht', who: 'OHT', at: 'loadport', lot: 'loadport', title: 'FOUP 도착', desc: 'OHT가 FOUP을 로드포트에 내려놓습니다.', src: 'samsungFab' },
    { id: 'recipe', who: '작업자', at: 'loadport', lot: 'loadport', title: '레시피 선택 · 로트 시작', desc: '압력·가스·RF·시간이 묶인 레시피를 고르고 로트를 시작합니다. 엔지니어는 레시피와 APC 알고리즘을 고쳐 결과를 맞춥니다.', terms: ['apc'], src: 'skhynixEtch' },
    { id: 'efem', who: '장비', at: 'efem', lot: 'efem', title: 'EFEM 반송', desc: 'EFEM 로봇이 FOUP에서 웨이퍼를 꺼내 로드락으로 넣습니다.', src: 'patent' },
    { id: 'loadlock', who: '장비', at: 'loadlock', lot: 'loadlock', title: '로드락 감압', desc: '로드락 문을 닫고 공기를 빼 진공으로 만듭니다.', terms: ['loadlock'], src: 'patent' },
    { id: 'chuck', who: '장비', at: 'transfer', lot: 'transfer', title: '챔버 반입 · 정전척 고정', desc: '이송 로봇이 웨이퍼를 식각 챔버에 넣고 정전척이 붙잡습니다.', terms: ['esc'], src: 'lamKiyo' },
    { id: 'etch', who: '장비', at: 'chamber', lot: 'chamber', title: '플라즈마 식각', desc: '가스를 넣고 전기 에너지를 걸어 플라즈마를 만들고, 열린 곳의 막을 깎습니다.', terms: ['icp', 'aniso'], src: 'samsung5' },
    { id: 'epd', who: '장비', at: 'chamber', lot: 'chamber', title: '종말점 검출', desc: '건식 식각에서는 정확한 종말점(EOP)을 찾아 멈추는 것이 중요합니다.', terms: ['epd'], src: 'skhynixEtch' },
    { id: 'unload', who: '장비', at: 'loadlock', lot: 'loadlock', title: '반출 → 애싱·세정', desc: '웨이퍼를 꺼낸 뒤 감광액을 태워 없애고(애싱), 남은 폴리머를 세정합니다.', src: 'skhynixEtch21' },
    { id: 'inspect', who: '작업자', at: 'loadport', lot: 'loadport', title: 'CD·깊이 계측', desc: '선폭과 식각 깊이를 잽니다. 특이점이 있으면 설비를 멈추거나 레시피를 바꿉니다.', terms: ['loading'], src: 'samsungRecipe' },
  ],
  outputs: {
    product: '감광액 무늬대로 아래 막이 깎인 웨이퍼 — 홈·무늬가 생기고, 다음 증착·이온주입으로 넘어갑니다.',
    metrics: ['식각률(Etch Rate)', '균일도(Uniformity)', '선택비(Selectivity)', '형상(Profile)·이방성', 'CD·식각 깊이'],
    notes: [
      { text: '웨이퍼 부위에 따라 식각 속도가 다르면 불량이 됩니다.', src: 'samsung5' },
      { text: '균일도 문제 유형: 가장자리가 더 빨리 깎이는 bull’s eye, 웨이퍼가 많을 때의 매크로 로딩, 넓게 열린 곳 옆이 덜 깎이는 마이크로 로딩.', src: 'mitL17' },
      { text: '남은 폴리머는 세정으로 없애고, 웨이퍼 가장자리(베벨) 잔류물은 떨어져 나와 결함을 만들 수 있습니다.', src: 'lamEtch' },
    ],
  },
  terms: [
    { id: 'cluster', ko: '클러스터 툴', en: 'Cluster Tool', short: '이송 챔버 둘레에 공정 챔버를 여럿 붙인 장비', deep: '로드포트 → EFEM → 로드락 → 진공 이송 챔버 → 공정 챔버 순서로 웨이퍼가 갑니다. TEL Tactras는 식각 챔버를 최대 6개까지 실을 수 있습니다.', src: 'telTactras' },
    { id: 'loadlock', ko: '로드락', en: 'Load Lock', short: '대기압과 진공을 바꿔 주는 작은 방', deep: '공정 챔버를 늘 진공으로 두려면 웨이퍼만 드나들 문이 필요합니다. 로드락은 바깥 문으로 웨이퍼를 받고 공기를 뺀 뒤 안쪽 문으로 넘깁니다. 이 설명은 특허 검색 요약에 근거한 일반 구조입니다.', src: 'patent' },
    { id: 'esc', ko: '정전척', en: 'ESC (Electrostatic Chuck)', short: '정전기로 웨이퍼를 붙잡는 받침', deep: '진공에서는 흡착(진공 척)을 쓸 수 없어 정전기 힘으로 웨이퍼를 고정합니다. Lam Kiyo 소개에 정전척 기술이 나옵니다.', src: 'lamKiyo' },
    { id: 'icp', ko: 'RIE · ICP', en: 'Reactive Ion Etch / Inductively Coupled Plasma', short: '평행판 플라즈마와 고밀도 유도 플라즈마', deep: 'RIE는 10–100 mTorr에서 평행판 전극으로 플라즈마를 만들고, 압력이 낮을수록 이온이 곧게 날아 이방성이 커집니다. ICP는 유전체 창 위 코일로 1–10 mTorr에서 고밀도 플라즈마를 만들고 밀도와 바이어스를 따로 조절합니다.', src: 'mitL17' },
    { id: 'aniso', ko: '이방성 · 선택비', en: 'Anisotropy / Selectivity', short: '수직으로 깎는 정도와, 깎을 막만 깎는 정도', deep: '이온 에너지가 클수록 수직으로 깎이지만 선택비는 떨어집니다. 선택비가 낮으면 감광액이나 아래 막까지 깎입니다.', src: 'mitL17' },
    { id: 'epd', ko: '종말점 검출', en: 'End Point Detection (EPD/EOP)', short: '막을 다 깎은 순간을 찾아 멈추기', deep: 'SK하이닉스는 건식 식각에서 정확한 종말점(EOP)을 찾는 것이 중요하다고 설명하고, 빛 반사로 깊이를 추정하는 LSR이라는 기법을 언급합니다.', src: 'skhynixEtch' },
    { id: 'apc', ko: '레시피 · APC', en: 'Recipe / Advanced Process Control', short: '공정 조건 묶음과 자동 보정', deep: '식각 엔지니어는 공정 레시피와 APC 알고리즘을 고쳐 결과를 맞춥니다.', src: 'skhynixEtch' },
    { id: 'loading', ko: '로딩 효과', en: 'Loading Effect', short: '무늬 밀도·웨이퍼 수에 따라 식각 속도가 달라짐', deep: '웨이퍼가 많으면 식각제가 모자라 느려지는 매크로 로딩, 마스크 없는 넓은 면적이 식각제를 차지해 옆의 좁은 무늬가 덜 깎이는 마이크로 로딩이 있습니다.', src: 'mitL17' },
  ],
  sources: {
    lamEtch: { title: 'Etch (공정 소개)', publisher: 'Lam Research', url: 'https://www.lamresearch.com/products/our-processes/etch/', status: '읽음' },
    lamKiyo: { title: 'Kiyo Product Family', publisher: 'Lam Research', url: 'https://www.lamresearch.com/product/kiyo-product-family/', status: '읽음' },
    telTactras: { title: 'Tactras', publisher: 'Tokyo Electron', url: 'https://www.tel.co.jp/product/tactras.html', status: '읽음' },
    amat10k: { title: 'Form 10-K FY2012', publisher: 'Applied Materials (SEC)', url: 'https://www.sec.gov/Archives/edgar/data/0000006951/000000695112000018/amat10282012-10kdoc.htm', status: '읽음' },
    mitL17: { title: '6.152J Lecture 17: Dry Etching', publisher: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu/courses/6-152j-micro-nano-processing-technology-fall-2005/lecture17.pdf', status: 'PDF 추출' },
    samsung5: { title: '[반도체 8대 공정] 5탄 식각공정', publisher: '삼성전자 반도체 뉴스룸', url: 'https://news.samsungsemiconductor.com/kr/%EB%B0%98%EB%8F%84%EC%B2%B4-8%EB%8C%80-%EA%B3%B5%EC%A0%95-5%ED%83%84-%ED%8A%B9%EC%A0%95-%ED%9A%8C%EB%A1%9C%ED%8C%A8%ED%84%B4%EC%9D%84-%EA%B5%AC%ED%98%84%ED%95%98%EB%8A%94-%EC%8B%9D%EA%B0%81%EA%B3%B5/', status: '읽음' },
    skhynixEtch: { title: 'Details, Defined: A Look at Etch Technology (2021.10.07)', publisher: 'SK hynix Newsroom', url: 'https://news.skhynix.com/en/details-defined-a-look-at-etch-technology/', status: '읽음' },
    skhynixEtch21: { title: 'Etching Process to Complete Semiconductor Patterning (2021.05.11)', publisher: 'SK hynix Newsroom', url: 'https://news.skhynix.com/en/etching-process-to-complete-semiconductor-patterning-1/', status: '읽음' },
    samsungFab: { title: '우리 반모 할래 7탄 (2021.04.22, FOUP·OHT·클린룸)', publisher: '삼성전자 반도체 뉴스룸', url: 'https://news.samsungsemiconductor.com/kr/', status: '읽음 · 제목으로 검색' },
    samsungRecipe: { title: '나는 신입사원입니다 시즌2 Ep.2 (2024.01.18)', publisher: '삼성전자 반도체 뉴스룸', url: 'https://news.samsungsemiconductor.com/kr/', status: '읽음 · 제목으로 검색' },
    patent: { title: '클러스터 툴 구성 (미국 특허 US 8562271 등 검색 요약)', publisher: 'USPTO', url: '', status: '검색 요약 · 일반 구조 참고' },
  },
}
