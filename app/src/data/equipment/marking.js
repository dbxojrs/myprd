// 레이저 마커 장비 소개·조작 순서·결과물 데이터. 형식은 data/equipment/index.js 머리 주석을 보세요.
// 근거: review/equipment-back.md 6장. 장비사·뉴스룸 자료는 모두 "설명 출처"입니다. 모두 검수 전입니다.
// 출처로 확인하지 못한 단계는 src: 'app'(이 앱의 교육용 가동 순서)으로 따로 표시합니다.

export default {
  id: 'marking',
  reviewed: false,
  kind: { ko: '스트립 레이저 마커', en: 'Strip Laser Marker' },
  summary:
    '몰딩을 마친 스트립의 EMC 표면을 레이저로 태워 제품 정보·고객 패턴·코드를 새기는 장비입니다. 매거진(Magazine)으로 스트립을 넣고, 셔틀이나 레일로 한 칸씩 보내며(인덱싱, Indexing) 카메라로 맞춘 뒤 레이저로 새깁니다.',
  vendors: [
    { name: 'EO Technics (이오테크닉스)', products: 'Strip marker (2 beam / 4 beam), Tray marker', note: 'slot·stack 매거진으로 로딩/언로딩, 셔틀 타입과 레일 타입, align vision으로 유닛별 개별 얼라인. 레이저는 CO₂·Nd:YVO₄·Fiber·Nd:YAG 시리즈', src: 'eo' },
    { name: 'Hanmi Semiconductor (한미반도체)', products: 'LASER MARK 3000S', note: '제품 목록에서만 확인(상세 설명은 이미지라 읽지 못함)', src: 'hanmi' },
  ],
  vendorNote:
    '삼성전자·SK하이닉스가 어떤 레이저 마커를 쓰는지는 공식 페이지에서 확인하지 못했습니다. 흄 집진기·안전 커버의 배치와 구체적인 마킹 불량 유형(희미함·위치 어긋남·깊이 과다 등)도 이번 조사의 출처로 확인하지 못했습니다.',
  modules: [
    { id: 'magIn', name: { ko: '매거진 로더', en: 'Magazine Loader' }, desc: '스트립이 층층이 담긴 매거진에서 한 장씩 꺼내 넣습니다. slot 매거진과 stack 매거진을 씁니다.', src: 'eo' },
    { id: 'indexer', name: { ko: '셔틀·레일 인덱서', en: 'Shuttle / Rail Indexer' }, desc: '스트립을 셔틀에 올려 옮기거나(셔틀 타입), 인덱싱 모터로 레일을 따라 한 칸씩 보냅니다(레일 타입).', src: 'eo' },
    { id: 'vision', name: { ko: '얼라인 비전', en: 'Align Vision' }, desc: '카메라로 패키지 하나하나의 위치를 찾아 마킹 위치를 맞춥니다.', src: 'eo' },
    { id: 'laser', name: { ko: '레이저 헤드·스캐너', en: 'Laser Head / Scanner' }, desc: '레이저 빔을 움직여 글자를 새깁니다. 헤드 1~2개, 빔 1·2·4개 구성이 있어 여러 패키지를 동시에 새길 수 있습니다.', src: 'eo' },
    { id: 'inspect', name: { ko: '마킹 검사', en: 'Marking Inspection' }, desc: '새긴 글자를 카메라로 읽어 확인합니다. EO Technics의 웨이퍼 마커는 자동 마킹 검사 기능을 둡니다.', src: 'eo' },
    { id: 'magOut', name: { ko: '매거진 언로더', en: 'Magazine Unloader' }, desc: '마킹을 마친 스트립을 다시 매거진에 담아 내보냅니다(1 in 1 out, 2 in 2 out 구성).', src: 'eo' },
  ],
  operation: [
    { id: 'recipe', who: '작업자', at: 'magIn', lot: 'magIn', title: '매거진 투입 · 마킹 내용 선택', desc: '몰드 스트립이 든 매거진을 넣고, 새길 내용(제품 정보·고객 패턴·코드)과 레시피를 고릅니다.', terms: ['magazine', 'trace'], src: 'skhynix6' },
    { id: 'index', who: '장비', at: 'indexer', lot: 'indexer', title: '스트립 인덱싱', desc: '스트립을 셔틀이나 레일로 마킹 위치까지 한 칸씩 보냅니다.', terms: ['index'], src: 'eo' },
    { id: 'align', who: '장비', at: 'vision', lot: 'indexer', title: '유닛별 얼라인', desc: '얼라인 비전이 패키지 하나하나의 위치를 찾아 새길 자리를 맞춥니다.', terms: ['align'], src: 'eo' },
    { id: 'mark', who: '장비', at: 'laser', lot: 'indexer', title: '레이저 마킹', desc: '레이저가 EMC 표면을 태워 글자를 새깁니다. 빔이 여러 개면 여러 패키지를 동시에 새깁니다.', terms: ['laserType'], src: 'eo' },
    { id: 'inspect', who: '장비', at: 'inspect', lot: 'indexer', title: '마킹 검사', desc: '새긴 글자를 카메라로 읽어 빠지거나 흐린 곳이 없는지 확인합니다.', src: 'eo' },
    { id: 'unload', who: '장비', at: 'magOut', lot: 'magOut', title: '매거진 언로드', desc: '마킹을 마친 스트립을 매거진에 담아 내보냅니다.', src: 'eo' },
    { id: 'next', who: '작업자', at: 'magOut', lot: 'magOut', title: '다음 공정 · 외관 검사', desc: '스트립을 다음 공정(싱귤레이션)으로 보냅니다. 최종 외관 검사에서는 마킹 상태도 함께 봅니다.', src: 'skhynix1' },
  ],
  outputs: {
    product: '표면에 제품 정보·코드가 새겨진 몰드 스트립 — 나중에 불량을 추적하는 표시가 됩니다.',
    metrics: ['글자 판독(빠짐·흐림 여부)', '새긴 깊이', '패키지별 마킹 위치'],
    notes: [
      { text: '검은색 EMC가 글자를 잘 보이게 하고, 레이저 대신 잉크로 찍는 잉크 마킹도 있습니다.', src: 'skhynix6' },
      { text: '글자 끊김·칩 손상 같은 판정은 이 앱의 교육용 규칙(Low Depth Marking 논문을 바탕으로 한 가설)입니다.', src: 'app' },
    ],
  },
  terms: [
    { id: 'marker', ko: '레이저 마커', en: 'Laser Marker', short: '레이저로 패키지 표면에 글자를 새기는 장비', deep: 'EMC 같은 표면 재료를 레이저로 태워 제품 정보, 고객 패턴, 코드를 새깁니다. 새긴 정보는 불량이 났을 때 어느 로트에서 왔는지 추적하는 데 씁니다.', src: 'skhynix6' },
    { id: 'stripTray', ko: '스트립 마커·트레이 마커', en: 'Strip / Tray Marker', short: '스트립째 새기는 장비와 낱개 패키지를 트레이로 새기는 장비', deep: '스트립 마커는 매거진에서 스트립을 꺼내 새기고, 트레이 마커는 트레이에 담긴 패키지를 새깁니다. EO Technics 트레이 마커는 컴팩트한 U 타입과 일자형 I 타입이 있습니다.', src: 'eo' },
    { id: 'magazine', ko: '매거진', en: 'Magazine (slot / stack)', short: '스트립을 층층이 담아 옮기는 통', deep: 'slot 매거진은 칸마다 스트립을 하나씩 꽂고, stack 매거진은 스트립을 쌓아 담습니다. 장비 앞뒤에 로더·언로더 매거진을 둡니다.', src: 'eo' },
    { id: 'index', ko: '인덱싱 (셔틀·레일)', en: 'Indexing (Shuttle / Rail)', short: '스트립을 정해진 간격만큼 한 칸씩 보내는 것', deep: '셔틀 타입은 스트립을 셔틀에 올려 옮기고, 레일 타입은 인덱싱 모터로 레일을 따라 보냅니다.', src: 'eo' },
    { id: 'align', ko: '얼라인 비전', en: 'Align Vision', short: '카메라로 위치를 찾아 맞추는 기능', deep: 'EO Technics 마커는 align vision 모듈로 유닛(패키지)마다 개별 얼라인을 합니다. 스트립이 조금 틀어져 들어와도 글자가 패키지 가운데에 새겨지게 합니다.', src: 'eo' },
    { id: 'laserType', ko: '레이저 종류', en: 'CO₂ / YVO₄ / Fiber / YAG', short: '재료에 맞춰 고르는 레이저 광원', deep: 'EO Technics는 CO₂(SC), End-pumped Nd:YVO₄(SVL), Fiber(SFL), Diode-pumped Nd:YAG(SLD) 시리즈를 두고, EMC·플라스틱·PCB·금속·세라믹을 새깁니다.', src: 'eo' },
    { id: 'trace', ko: '추적성', en: 'Traceability', short: '새긴 정보로 제품 이력을 거슬러 찾는 것', deep: 'SK하이닉스는 레이저 마킹이 제품 정보와 코드를 새겨 불량 추적에 도움이 된다고 설명합니다. 테스트를 마친 뒤 마킹하는 흐름도 소개합니다.', src: 'skhynix1' },
  ],
  sources: {
    eo: { title: '반도체 장비 (Strip/Tray/Wafer marker)', publisher: 'EO Technics', url: 'https://www.eotechnics.com/page/products/equipment_catno3.php', status: '읽음' },
    hanmi: { title: 'LASER MARK 3000S (제품 목록)', publisher: 'Hanmi Semiconductor', url: 'https://www.hanmisemi.com/?module=Html&action=SiteProduct&sSubNo=8&sNo=2', status: '읽음 · 상세 텍스트 없음' },
    skhynix6: { title: 'Semiconductor Back-End Process Episode 6: Conventional Packages', publisher: 'SK hynix Newsroom', url: 'https://news.skhynix.com/semiconductor-back-end-process-episode-6-conventional-packages/', status: '읽음' },
    skhynix1: { title: 'Semiconductor Back-End Process Episode 1: Understanding Semiconductor Testing', publisher: 'SK hynix Newsroom', url: 'https://news.skhynix.com/semiconductor-back-end-process-episode-1-understanding-semiconductor-testing/', status: '읽음' },
    app: { title: '이 앱 장비 시뮬레이터의 가동 순서·규칙', publisher: '이 앱', url: '', status: '교육용 가설 · 출처 미확인' },
  },
}
