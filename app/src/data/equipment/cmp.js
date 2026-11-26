// CMP 장비 소개·조작 순서·결과물 데이터. 형식은 data/equipment/index.js 머리 주석을 보세요.
// 인용 문장은 출처 원문을 내려받아 그대로 있는지 대조했습니다(2026-11-26). 장비사 자료는 모두 "설명 출처"입니다. 모두 검수 전입니다.

export default {
  id: 'cmp',
  reviewed: false,
  kind: { ko: 'CMP 장비 (연마부 + 세정부)', en: 'CMP Polisher' },
  summary:
    'CMP 장비는 웨이퍼를 패드에 눌러 슬러리와 함께 갈아 평평하게 만드는 연마부(폴리셔)와, 갈고 난 웨이퍼를 브러시로 씻고 말리는 세정부로 나뉩니다. 연마부에는 회전하는 플래튼(패드), 웨이퍼를 잡고 누르는 헤드, 슬러리 공급부, 패드 컨디셔너가 있습니다.',
  vendors: [
    { name: 'Applied Materials', products: 'Reflexion LK Prime', note: '연마 스테이션 6개와 세정 스테이션 8개를 한 장비에 넣었고, 실시간 프로파일·종점 제어로 웨이퍼 안 균일도를 맞춤(2014 보도자료)', src: 'amatPr' },
    { name: '荏原製作所 (Ebara)', products: 'F-REX300XA', note: '2021년 발표, 새로 개발한 고효율 반송 기구와 처리량 최적화 알고리즘을 넣은 CMP 장비', src: 'monoist' },
    { name: 'IPEC (연구용 예시)', products: 'IPEC 472', note: 'NIST 나노팹의 연구용 CMP 장비. 100mm 웨이퍼 전용, 25장 카세트에서 카세트로', src: 'nistIpec' },
  ],
  vendorNote: '국내 장비사(KCTech 등)와 삼성전자·SK하이닉스가 어떤 CMP 장비를 쓰는지는 공식 페이지에서 확인하지 못했습니다. Applied Materials·Ebara 공식 제품 페이지는 열 수 없어 보도자료·기사로 확인했습니다.',
  modules: [
    { id: 'load', name: { ko: '카세트·로딩부', en: 'Cassette Load/Unload' }, desc: '웨이퍼가 든 카세트를 넣고 꺼내는 입구입니다. 연구용 장비 IPEC 472는 25장 카세트에서 꺼내 갈고 다시 카세트로 넣습니다.', src: 'nistIpec' },
    { id: 'transfer', name: { ko: '웨이퍼 반송 기구', en: 'Wafer Transfer' }, desc: '장비 안에서 웨이퍼를 로딩부·연마부·세정부로 옮깁니다. 반송 속도가 장비의 처리량을 좌우해 장비사가 따로 개발합니다.', src: 'monoist' },
    { id: 'platen', name: { ko: '플래튼·연마 패드', en: 'Platen & Pad' }, desc: '웨이퍼를 홈이 파인 폴리우레탄 패드에 누르고, 패드를 빠르게 돌려 슬러리를 패드의 홈과 작은 구멍 안으로 실어 나릅니다.', src: 'seoCmp' },
    { id: 'head', name: { ko: '연마 헤드·리테이닝 링', en: 'Polishing Head & Retaining Ring' }, desc: '웨이퍼를 잡고 패드에 일정한 힘으로 눌러 돌립니다. 웨이퍼를 둘러싼 리테이닝 링과 캐리어는 패드·컨디셔너와 함께 CMP 소모품입니다.', src: 'seoCmp' },
    { id: 'slurry', name: { ko: '슬러리 공급부', en: 'Slurry Delivery' }, desc: '웨이퍼와 패드 위에 슬러리(연마 입자 + 약품)를 뿌립니다. 패드가 돌면서 슬러리를 패드의 홈 안으로 실어 나릅니다.', src: 'hynixCC' },
    { id: 'conditioner', name: { ko: '패드 컨디셔너', en: 'Pad Conditioner' }, desc: '패드 표면을 다듬는 장치입니다. 연구용 IPEC 472는 1차 플래튼에서 막을 깎으면서 동시에 패드를 컨디셔닝하고, 2차 플래튼에서 마무리 연마를 합니다.', src: 'nistIpec' },
    { id: 'endpoint', name: { ko: '실시간 종점·프로파일 제어', en: 'Real-time Endpoint Control' }, desc: '언제 연마를 멈출지(종점)와 웨이퍼 전체가 고르게 깎이는지를 실시간으로 제어해 웨이퍼 안 균일도를 맞춥니다.', src: 'amatPr' },
    { id: 'cleaner', name: { ko: '세정부 (브러시·건조)', en: 'Post-CMP Cleaner & Dryer' }, desc: '연마가 끝난 웨이퍼의 남은 물질을 브러시로 습식 세정하고 말립니다. Reflexion LK Prime은 세정 스테이션이 8개입니다.', src: 'hynixCC' },
  ],
  operation: [
    { id: 'in', who: '작업자', at: 'load', lot: 'load', title: '카세트 투입 · 레시피 선택', desc: '웨이퍼 카세트를 넣고 막 종류에 맞는 연마 레시피(압력·속도·시간)를 고릅니다.', terms: ['recipe'], src: 'nistIpec' },
    { id: 'move', who: '장비', at: 'transfer', lot: 'transfer', title: '웨이퍼 반송', desc: '반송 기구가 웨이퍼를 한 장씩 꺼내 연마부의 헤드로 옮깁니다.', src: 'monoist' },
    { id: 'polish', who: '장비', at: 'head', lot: 'head', title: '연마: 누르고 돌리며 슬러리', desc: '헤드가 웨이퍼를 패드에 눌러 돌리고, 슬러리를 뿌려 갈아 냅니다. 높이 솟은 곳이 더 큰 압력을 받아 먼저 깎입니다.', terms: ['preston', 'slurry'], src: 'hynixCC' },
    { id: 'condition', who: '장비', at: 'conditioner', lot: 'head', title: '패드 컨디셔닝', desc: '1차 플래튼에서 막을 깎는 동안 컨디셔너가 패드 표면을 다듬습니다(연구용 IPEC 472 기준).', src: 'nistIpec' },
    { id: 'endpoint', who: '장비', at: 'endpoint', lot: 'head', title: '종점 감지 · 마무리 연마', desc: '실시간 종점·프로파일 제어로 연마를 멈출 때를 정해 웨이퍼 안 균일도를 맞춥니다. 너무 오래 갈면(과연마) 디싱·이로전이 생깁니다(용어 참고).', terms: ['dishing'], src: 'amatPr' },
    { id: 'clean', who: '장비', at: 'cleaner', lot: 'cleaner', title: '브러시 세정 · 건조', desc: '세정부에서 남은 슬러리·입자를 브러시로 씻고 말립니다.', src: 'hynixCC' },
    { id: 'out', who: '작업자', at: 'load', lot: 'load', title: '두께·평탄도 측정 · 다음 공정으로', desc: '남은 막 두께와 디싱·이로전을 재고, 기준에 맞으면 다음 공정으로 보냅니다.', src: 'samsungMet' },
  ],
  outputs: {
    product: '표면이 평평해진 웨이퍼 — 다마신이면 넘친 구리가 걷히고 홈 속 구리 배선만 남습니다.',
    metrics: ['남은 막 두께', '넓은 배선 디싱 깊이', '촘촘한 영역 이로전 깊이', '긁힘·잔류 입자'],
    notes: [
      { text: '구리 다마신의 과연마 단계에서 디싱과 이로전이 크게 생길 수 있습니다.', src: 'mitCmp' },
      { text: '잔류 입자·이물·긁힘·부식 같은 결함은 연마 중에 다 막을 수 없어 CMP 후 세정이 꼭 필요합니다.', src: 'seoCmp' },
    ],
  },
  terms: [
    { id: 'recipe', ko: '레시피', en: 'Recipe', short: '장비가 따라 할 공정 조건 묶음', deep: 'CMP에서는 누르는 압력, 패드·헤드 회전 속도, 연마 시간, 슬러리 공급이 레시피에 들어갑니다. 생산성을 위해 바꾸면 디싱 같은 부작용을 먼저 확인해야 합니다(현장 시나리오 FAB-004).', src: 'seoCmp' },
    { id: 'slurry', ko: '슬러리', en: 'Slurry', short: '연마 입자와 약품을 섞은 연마액', deep: '절연막용 슬러리에는 연마 입자, 분산제, 보호제, pH 조절제, 탈이온수가 들어갑니다. 슬러리의 화학 성분은 긁힘을 막는 역할도 합니다.', src: 'seoCmp' },
    { id: 'preston', ko: '프레스턴 식', en: "Preston's Equation", short: '깎이는 속도 = 계수 × 압력 × 상대 속도', deep: '누르는 힘이나 회전 속도를 키우면 더 빨리 깎인다는 식입니다. 다만 압력·속도에 정비례한다고 가정해 실제 CMP의 비선형 연마는 설명하지 못합니다.', src: 'seoCmp' },
    { id: 'dishing', ko: '디싱·이로전', en: 'Dishing / Erosion', short: '배선이 오목하게 패임 / 촘촘한 영역의 막이 깎임', deep: '디싱은 넓은 금속 배선 가운데가 접시처럼 패이는 것, 이로전은 배선이 촘촘한 영역에서 배선 사이 절연막까지 깎이는 것입니다. 패턴 밀도에 따라 남는 두께가 달라지는 것이 핵심 관심사입니다.', src: 'mitCmp' },
  ],
  sources: {
    hynixCC: { title: 'Creating Defectless Wafers: A Look at CLEAN & CMP Technology', publisher: 'SK hynix Newsroom', url: 'https://news.skhynix.com/en/creating-defectless-wafers-a-look-at-clean-cmp-technology/', status: '읽음' },
    seoCmp: { title: 'A review on chemical and mechanical phenomena at the wafer interface during CMP', publisher: 'Journal of Materials Research (2020), CC BY 4.0', url: 'https://www.cambridge.org/core/journals/journal-of-materials-research/article/review-on-chemical-and-mechanical-phenomena-at-the-wafer-interface-during-chemical-mechanical-planarization/F53CF209A1FD6CA18FFF50631A0CC654', status: '읽음' },
    mitCmp: { title: 'Pattern Dependent Modeling for CMP Optimization and Control', publisher: 'MIT Microsystems Technology Laboratories (MRS 1999 Proceedings)', url: 'https://boning.mit.edu/wp-content/uploads/2022/11/MRS99-reprint.pdf', status: 'PDF 추출' },
    amatPr: { title: 'Applied Materials Introduces CVD and CMP Systems for 3D Architectures (2014)', publisher: 'Applied Materials 보도자료 (ACN Newswire 게재본)', url: 'https://www.acnnewswire.com/press-release/english/17324/applied-materials-introduces-cvd-and-cmp-systems-for-3d-architectures', status: '보도자료 읽음' },
    monoist: { title: 'ウエハー表面の研磨工程を効率化 CMP装置「F-REX300XA型」(2021.12.24)', publisher: 'MONOist (ITmedia)', url: 'https://monoist.itmedia.co.jp/mn/articles/2112/24/news048.html', status: '기사 읽음' },
    nistIpec: { title: 'NanoFab Tool: IPEC 472, Chemical Mechanical Polisher (CMP)', publisher: 'NIST Center for Nanoscale Science and Technology', url: 'https://www.nist.gov/node/1559681', status: '읽음' },
    samsungMet: { title: '[인생맛칩 Ep.13] 계측 공정 살펴보기', publisher: '삼성전자 반도체 뉴스룸 (2022.08.30)', url: 'https://news.samsungsemiconductor.com/kr/%ec%9d%b8%ec%83%9d%eb%a7%9b%ec%b9%a9-ep-13-%ec%99%84%eb%b2%bd%ed%95%9c-%eb%b0%98%eb%8f%84%ec%b2%b4%ec%9d%98-%ec%8b%9c%ec%9e%91%ec%9d%80-%ec%a0%95%ed%99%95%ed%95%9c-%ea%b3%84%ec%b8%a1%ec%9c%bc/', status: '읽음' },
  },
}
