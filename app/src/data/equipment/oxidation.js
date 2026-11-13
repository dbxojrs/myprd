// 산화로 장비 소개·조작 순서·결과물 데이터. 형식은 data/equipment/index.js 머리 주석을 보세요.
// 근거: review/equipment-front.md 1장. 장비사·뉴스룸 자료는 모두 "설명 출처"(tier: 'explain')입니다. 모두 검수 전입니다.

export default {
  id: 'oxidation',
  reviewed: false,
  kind: { ko: '수직형 배치 확산로', en: 'Vertical Batch Furnace' },
  summary:
    '웨이퍼 수십~수백 장을 보트(Boat)에 층층이 세워 한꺼번에 반응관(Tube)에 넣고, 고온에서 산소나 수증기와 반응시켜 산화막(SiO₂)을 키우는 배치(Batch)식 열처리 장비입니다.',
  vendors: [
    { name: 'Tokyo Electron (TEL)', products: 'TELINDY PLUS · EVAROS', note: '배치식 열처리 장치. TELINDY PLUS 최대 125매, EVAROS 최대 200매, 보트 2개 운용', src: 'tel' },
    { name: 'KOKUSAI ELECTRIC', products: 'AdvancedAce · QUIXACE · VERTRON', note: '대형 배치로 산화·확산·어닐. QUIXACE-LV는 웨이퍼 로딩 영역에 진공 로드락 구조', src: 'kokusai' },
    { name: 'ASM International', products: 'SONORA · A400 DUO', note: '수직로는 많은 웨이퍼를 동시에 처리하는 배치 구성, 반응로 2개(dual-batch)', src: 'asm' },
  ],
  vendorNote: '삼성전자·SK하이닉스가 어떤 산화 장비를 쓰는지는 공식 페이지에서 확인하지 못했습니다.',
  // 장비 둘러보기 순서. id는 장비 그림(components/equipment)의 부위 id와 같습니다.
  modules: [
    { id: 'loadport', name: { ko: '로드포트', en: 'Load Port' }, desc: 'OHT가 천장 레일로 실어 온 FOUP을 내려놓는 입구입니다.', src: 'samsungFab' },
    { id: 'stocker', name: { ko: 'FOUP 스토커', en: 'FOUP Stocker' }, desc: '장비 안에서 FOUP을 잠시 보관하는 선반입니다. TELINDY PLUS는 18개, EVAROS는 22개까지 둡니다.', src: 'tel' },
    { id: 'robot', name: { ko: '웨이퍼 이송 로봇', en: 'Wafer Transfer Robot' }, desc: 'FOUP과 보트 사이에서 웨이퍼를 한 장씩 옮깁니다.', src: 'patent' },
    { id: 'boat', name: { ko: '보트·보트 엘리베이터', en: 'Boat / Boat Elevator' }, desc: '웨이퍼를 일정 간격으로 층층이 세우는 받침대입니다. 아래에서 반응관 안으로 올려 넣고, 끝나면 내려서 식힙니다.', src: 'patent' },
    { id: 'tube', name: { ko: '반응관·히터', en: 'Process Tube / Heater' }, desc: '석영 반응관을 둘러싼 히터가 웨이퍼를 고온으로 가열합니다. 여러 구역(Multi-zone)으로 나눠 온도를 맞추는 장비도 있습니다.', src: 'tel' },
    { id: 'gas', name: { ko: '가스 박스·배기', en: 'Gas Box / Exhaust' }, desc: '산소(건식), 산소+수증기(습식) 같은 공정 가스를 넣고, 반응 뒤 가스를 내보냅니다.', src: 'skhynix2' },
  ],
  // 조작 순서. who: 누가 하는 일인지, at: 이 단계에서 강조할 부위, lot: 로트(FOUP·웨이퍼)가 있는 부위
  operation: [
    { id: 'oht', who: 'OHT', at: 'loadport', lot: 'loadport', title: 'FOUP 도착', desc: 'OHT가 천장 레일을 따라 FOUP을 실어 와 로드포트에 내려놓습니다.', terms: ['foup', 'oht'], src: 'samsungFab' },
    { id: 'recipe', who: '작업자', at: 'loadport', lot: 'loadport', title: '로트 확인 · 레시피 선택', desc: '들어온 로트가 맞는지 확인하고, 산화 방식·온도·시간이 정해진 레시피(Recipe)를 고릅니다.', terms: ['lot', 'recipe'], src: 'samsungRecipe' },
    { id: 'stock', who: '장비', at: 'stocker', lot: 'stocker', title: 'FOUP 보관', desc: 'FOUP을 장비 안 스토커 선반으로 옮겨 순서를 기다립니다.', src: 'tel' },
    { id: 'charge', who: '장비', at: 'robot', lot: 'boat', title: '웨이퍼 장입 · 더미 배치', desc: '이송 로봇이 웨이퍼를 보트에 옮겨 담습니다. 양 끝에는 반응 차이를 메우려고 더미 웨이퍼(Dummy Wafer)를 함께 넣습니다.', terms: ['dummy'], src: 'skhynix2' },
    { id: 'boatin', who: '장비', at: 'boat', lot: 'tube', title: '보트 로드', desc: '보트 엘리베이터가 보트를 반응관 안으로 올려 넣고 입구를 닫습니다.', src: 'patent' },
    { id: 'process', who: '장비', at: 'tube', lot: 'tube', title: '가스 주입 · 가열 · 산화', desc: '가스를 넣고 가열해 웨이퍼 표면을 산화시킵니다. 건식은 O₂만, 습식은 O₂+H₂O를 씁니다.', terms: ['dryWet'], src: 'samsungOx' },
    { id: 'cool', who: '장비', at: 'boat', lot: 'boat', title: '보트 언로드 · 쿨다운', desc: '보트를 내려 뜨거운 웨이퍼를 식힌 뒤 FOUP에 다시 담습니다.', src: 'patent' },
    { id: 'measure', who: '작업자', at: 'loadport', lot: 'loadport', title: '두께 측정 · 다음 공정으로', desc: '산화막 두께와 균일도를 재고, 기준에 맞으면 FOUP을 다음 공정으로 보냅니다.', terms: ['uniformity'], src: 'mitL2' },
  ],
  outputs: {
    product: '산화막(SiO₂)이 덮인 웨이퍼 — 보호막, 절연막, 이온주입 차단막, 게이트 산화막으로 씁니다.',
    metrics: ['산화막 두께', '웨이퍼 안 균일도', '웨이퍼 사이(보트 위치별) 균일도'],
    notes: [
      { text: '습식은 빠르지만 균일도와 밀도가 낮고, 건식은 느리지만 조밀하고 균일해 게이트 산화막에 씁니다.', src: 'skhynix2' },
      { text: '미세한 불순물이 실리콘 표면에 들어가면 비저항이나 전도율이 바뀌어 전기적 특성이 나빠집니다.', src: 'samsungOx' },
    ],
  },
  // 더 알아보기 용어. short는 한 줄, deep은 "더 알아보기"를 눌렀을 때의 설명
  terms: [
    { id: 'foup', ko: 'FOUP', en: 'Front Opening Unified Pod', short: '웨이퍼를 담아 옮기는 밀폐 용기', deep: '웨이퍼를 보관하거나 안전하게 이동하도록 만든 웨이퍼 배송 전용 상자입니다. 앞쪽 문이 열려 장비가 웨이퍼를 바로 꺼냅니다.', src: 'samsungFab' },
    { id: 'oht', ko: 'OHT', en: 'Overhead Hoist Transport', short: '천장 레일을 달리는 FOUP 운반 장치', deep: '팹 천장에 도로처럼 설치된 레일을 따라 FOUP을 필요한 장비로 빠르고 자동으로 옮깁니다. 사람이 웨이퍼를 들고 다니지 않아 오염과 파손이 줄어듭니다.', src: 'samsungFab' },
    { id: 'lot', ko: '로트', en: 'Lot', short: '같은 조건으로 함께 처리하는 웨이퍼 묶음', deep: '같은 레시피로 함께 흘러가는 웨이퍼 묶음입니다. 품질은 웨이퍼끼리(Wafer-to-wafer)뿐 아니라 로트끼리(Lot-to-lot)도 반복성이 있어야 합니다.', src: 'axcelis' },
    { id: 'recipe', ko: '레시피', en: 'Recipe', short: '장비가 따라 할 공정 조건 묶음', deep: '온도·시간·가스 같은 공정 조건을 묶어 저장한 것입니다. 엔지니어는 데이터를 보다가 특이점이 있으면 설비를 멈추거나 레시피를 바꿉니다.', src: 'samsungRecipe' },
    { id: 'dummy', ko: '더미 웨이퍼', en: 'Dummy Wafer', short: '제품이 아닌, 위치 차이를 메우는 웨이퍼', deep: '배치 장비는 구조상 보트 양 끝에서 반응 속도가 달라집니다. 이를 보정하려고 제품 웨이퍼 옆에 더미 웨이퍼를 함께 넣습니다.', src: 'skhynix2' },
    { id: 'dryWet', ko: '건식·습식 산화', en: 'Dry / Wet Oxidation', short: 'O₂만(건식) 또는 O₂+H₂O(습식)', deep: '같은 온도·시간이면 습식이 건식보다 약 5~10배 두껍게 자랍니다. 건식은 막이 얇지만 조밀하고 전기적 특성이 좋아 게이트 산화막에 씁니다.', src: 'samsungOx' },
    { id: 'uniformity', ko: '균일도', en: 'Uniformity', short: '막 두께가 고른 정도', deep: '한 웨이퍼 안(Within-wafer)과 보트 위치에 따른 웨이퍼 사이(Wafer-to-wafer) 두께 차이를 봅니다. 구체적인 기준 수치는 출처에서 확인하지 못했습니다.', src: 'skhynix2' },
  ],
  sources: {
    tel: { title: 'TELINDY PLUS / EVAROS 제품 페이지', publisher: 'Tokyo Electron', url: 'https://www.tel.co.jp/product/telindy.html', status: '읽음' },
    kokusai: { title: 'Products', publisher: 'KOKUSAI ELECTRIC', url: 'https://www.kokusai-electric.com/en/products/', status: '읽음' },
    asm: { title: 'Vertical Furnace', publisher: 'ASM International', url: 'https://www.asm.com/our-technology-products/vertical-furnace', status: '읽음' },
    skhynix2: { title: 'Semiconductor Front-End Process Episode 2', publisher: 'SK hynix Newsroom', url: 'https://news.skhynix.com/semiconductor-front-end-process-episode-2/', status: '읽음' },
    samsungOx: { title: '[반도체 8대 공정] 2탄 산화공정', publisher: '삼성전자 반도체 뉴스룸', url: 'https://news.samsungsemiconductor.com/kr/%eb%b0%98%eb%8f%84%ec%b2%b4-8%eb%8c%80-%ea%b3%b5%ec%a0%95-2%ed%83%84-%ec%9b%a8%ec%9d%b4%ed%8d%bc-%ed%91%9c%eb%a9%b4%ec%9d%84-%eb%b3%b4%ed%98%b8%ed%95%98%eb%8a%94-%ec%82%b0%ed%99%94%ea%b3%b5%ec%a0%95/', status: '읽음' },
    samsungFab: { title: '우리 반모 할래 7탄 (2021.04.22, FOUP·OHT·클린룸)', publisher: '삼성전자 반도체 뉴스룸', url: 'https://news.samsungsemiconductor.com/kr/', status: '읽음 · 제목으로 검색' },
    samsungRecipe: { title: '나는 신입사원입니다 시즌2 Ep.2 (2024.01.18)', publisher: '삼성전자 반도체 뉴스룸', url: 'https://news.samsungsemiconductor.com/kr/', status: '읽음 · 제목으로 검색' },
    axcelis: { title: 'Rubin & Poate, Ion Implantation in Silicon Technology (2003)', publisher: 'The Industrial Physicist (Axcelis 저자)', url: 'https://www.axcelis.com/wp-content/uploads/2019/02/Ion_Implantation_in_Silicon_Technology.pdf', status: 'PDF 추출' },
    mitL2: { title: '6.152J Lecture 2', publisher: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu/courses/6-152j-micro-nano-processing-technology-fall-2005/lecture2.pdf', status: 'PDF 추출' },
    patent: { title: '수직로 보트·이송 구조 (미국 특허 검색 요약)', publisher: 'USPTO', url: '', status: '검색 요약 · 일반 구조 참고' },
  },
}
