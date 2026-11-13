// 백그라인더 장비 소개·조작 순서·결과물 데이터. 형식은 data/equipment/index.js 머리 주석을 보세요.
// 근거: review/equipment-back.md 1장. 장비사·뉴스룸 자료는 모두 "설명 출처"입니다. 모두 검수 전입니다.

export default {
  id: 'backgrind',
  reviewed: false,
  kind: { ko: '백그라인더 (그라인더/폴리셔)', en: 'Back Grinder / Grinder-Polisher' },
  summary:
    '회로가 완성된 웨이퍼의 뒷면을 다이아몬드 휠로 갈아 목표 두께까지 얇게 만드는 장비입니다. 거친 연삭(Z1) → 미세 연삭(Z2) → 스트레스 릴리프(Z3)를 한 장비에서 이어서 하고, 인라인 마운터가 다이싱 테이프·링 프레임 부착과 BG 테이프 박리까지 맡습니다.',
  vendors: [
    { name: 'DISCO', products: 'DGP8761 (+ 인라인 마운터 DFM2800)', note: 'Φ300 mm 전자동 그라인더/폴리셔. 백사이드 그라인딩과 스트레스 릴리프를 한 장비에서 처리하고 25 μm 미만까지 얇게 갈 수 있음', src: 'dgp8761' },
    { name: 'ACCRETECH (Tokyo Seimitsu)', products: 'PG3000RMII / PG3000RMX', note: '고정밀 연삭과 웨트 폴리싱, RM 기구가 DC 테이프 부착과 BG 테이프 디테이핑 담당', src: 'pg3000' },
  ],
  vendorNote: '삼성전자·SK하이닉스가 어떤 백그라인더를 쓰는지는 공식 페이지에서 확인하지 못했습니다. 조작 패널(터치패널) 모습과 검사 방법도 출처에서 확인하지 못했습니다.',
  modules: [
    { id: 'cassette', name: { ko: '카세트 (로드 포트)', en: 'Cassette' }, desc: 'BG 테이프를 붙인 웨이퍼가 담긴 카세트(오픈 카세트 또는 FOUP)를 장비 앞쪽에 올립니다.', src: 'dgp8761' },
    { id: 'robot', name: { ko: '로봇 픽 · 포지셔닝 테이블', en: 'Robot Pick / Positioning Table' }, desc: '로봇이 카세트에서 웨이퍼를 꺼내 포지셔닝 테이블에 올리고 중심을 맞춥니다(센터링).', src: 'dgp8761' },
    { id: 'chuck', name: { ko: '척 테이블 (4개)', en: 'Chuck Tables' }, desc: 'T1 암이 웨이퍼를 척 테이블에 올리면 진공으로 붙잡고, 척 테이블이 연삭 축 아래를 차례로 돌며 가공받습니다.', src: 'dgp8761' },
    { id: 'wheels', name: { ko: '연삭 축 Z1·Z2·Z3', en: 'Grinding Spindles Z1/Z2/Z3' }, desc: 'Z1은 거친 연삭(Φ300 다이아몬드 휠), Z2는 미세 연삭, Z3는 드라이 폴리싱(Φ450 휠) 또는 웨트 폴리싱 패드로 스트레스 릴리프를 합니다.', src: 'dgp8761' },
    { id: 'spinner', name: { ko: '스피너 테이블', en: 'Spinner Table' }, desc: 'T2 암이 다 간 웨이퍼를 스피너로 옮겨 돌리면서 씻고 말립니다.', src: 'dgp8761' },
    { id: 'mounter', name: { ko: '인라인 마운터', en: 'Inline Wafer Mounter' }, desc: '웨이퍼를 받아 다이싱 테이프(또는 DAF 일체형 테이프)를 붙이고 링 프레임에 마운트한 뒤, 앞면의 BG 테이프를 벗겨 카세트에 담습니다.', src: 'dfm2800' },
  ],
  operation: [
    { id: 'tape', who: '작업자', at: 'cassette', lot: 'cassette', title: 'BG 테이프 라미네이트', desc: '회로가 있는 웨이퍼 앞면에 BG 테이프(백그라인딩 보호 테이프)를 붙여 연삭 중 회로를 보호합니다.', terms: ['bgTape'], src: 'skhynix6' },
    { id: 'recipe', who: '작업자', at: 'cassette', lot: 'cassette', title: '카세트 로드 · 레시피 선택', desc: '카세트를 올리고 목표 두께 등이 정해진 레시피를 고릅니다. 마운터와 연결된 경우 그라인더 조작부에서 레시피 선택과 시작/정지를 함께 합니다.', terms: ['recipe'], src: 'dfm2800' },
    { id: 'center', who: '장비', at: 'robot', lot: 'robot', title: '꺼내기 · 센터링', desc: '로봇이 웨이퍼를 꺼내 포지셔닝 테이블에서 중심을 맞추고, T1 암이 척 테이블에 올립니다.', src: 'dgp8761' },
    { id: 'z1', who: '장비', at: 'wheels', lot: 'chuck', title: 'Z1 거친 연삭', desc: '굵은 다이아몬드 휠로 뒷면을 빠르게 갈아 두께를 크게 줄입니다.', terms: ['z123'], src: 'dgp8761' },
    { id: 'z2', who: '장비', at: 'wheels', lot: 'chuck', title: 'Z2 미세 연삭 · 마무리 감속', desc: '고운 휠로 표면을 다듬습니다. 목표 두께에 가까워지면 휠 스핀들 이송을 늦춰 연삭 부하를 낮춥니다.', terms: ['feedDown'], src: 'discoThin' },
    { id: 'z3', who: '장비', at: 'wheels', lot: 'chuck', title: 'Z3 스트레스 릴리프', desc: '드라이 폴리싱 등으로 연삭 뒤 남은 얇은 손상(데미지)층을 걷어 내 다이 강도를 높입니다.', terms: ['damage'], src: 'discoThin' },
    { id: 'spin', who: '장비', at: 'spinner', lot: 'spinner', title: '스피너 세정·건조', desc: 'T2 암이 웨이퍼를 스피너로 옮겨 씻고 말립니다.', src: 'dgp8761' },
    { id: 'mount', who: '장비', at: 'mounter', lot: 'mounter', title: '테이프·프레임 마운트 · BG 테이프 박리', desc: '다이싱 테이프(또는 DAF)를 붙이고 링 프레임에 마운트한 뒤 BG 테이프를 벗깁니다. UV 테이프면 벗기기 전에 UV를 쬡니다.', terms: ['ringFrame', 'daf'], src: 'dfm2800' },
    { id: 'out', who: '작업자', at: 'mounter', lot: 'cassette', title: '카세트 수납 → 다이싱으로', desc: '프레임에 마운트된 웨이퍼를 카세트에 담아 다이싱 공정으로 보냅니다.', src: 'dfm2800' },
  ],
  outputs: {
    product: '목표 두께로 얇아지고 다이싱 테이프·링 프레임에 마운트된 웨이퍼. SK하이닉스는 단일 칩 패키지 기준 대략 200~250 μm로 설명합니다.',
    metrics: ['마무리 두께', '엣지 칩핑·크랙 여부', '연삭 데미지층 제거 여부'],
    notes: [
      { text: '얇게 갈면 둥근 가장자리가 날카로워져 엣지 칩핑이 생기기 쉽고, 엣지 트리밍으로 예방합니다.', src: 'discoThin' },
      { text: '연삭 뒤 남은 데미지층은 다이 강도를 떨어뜨리므로 스트레스 릴리프로 제거합니다.', src: 'discoThin' },
      { text: '패드와 웨이퍼 사이에 파티클이 끼면 웨이퍼가 깨질 수 있습니다.', src: 'dfm2800' },
    ],
  },
  terms: [
    { id: 'bgTape', ko: 'BG 테이프', en: 'Back Grinding Tape', short: '연삭 중 웨이퍼 앞면(회로)을 지키는 보호 테이프', deep: '뒷면을 갈기 전에 회로가 있는 앞면에 붙입니다. 연삭과 마운트가 끝나면 벗기는데(디테이핑), UV 테이프는 UV를 쬐어 점착력을 약하게 만든 뒤 벗깁니다.', src: 'skhynix6' },
    { id: 'recipe', ko: '레시피', en: 'Recipe', short: '목표 두께 등 가공 조건 묶음', deep: '목표 두께, 연삭 순서 같은 조건을 묶어 저장한 것입니다. 인라인 마운터와 연결하면 그라인더 조작부 한 곳에서 레시피를 고르고 시작·정지합니다.', src: 'dfm2800' },
    { id: 'z123', ko: 'Z1·Z2·Z3 연삭 축', en: 'Rough / Fine / Polish Spindles', short: '거친 연삭 → 미세 연삭 → 폴리싱', deep: 'DGP8761은 척 테이블 4개와 연삭 축 3개로 되어 있습니다. Z1은 거친 연삭, Z2는 미세 연삭, Z3는 드라이 폴리싱·웨트 폴리싱·Poligrind 중 하나를 씁니다.', src: 'dgp8761' },
    { id: 'feedDown', ko: '마무리 감속', en: 'Low-load Finish Grinding', short: '목표 두께 근처에서 이송을 늦춤', deep: '얇아질수록 웨이퍼가 약해지므로, 마무리 두께에 가까워지면 휠 스핀들 이송 속도를 줄여 연삭 부하를 낮춥니다.', src: 'discoThin' },
    { id: 'damage', ko: '데미지층 · 스트레스 릴리프', en: 'Damaged Layer / Stress Relief', short: '연삭 손상층을 걷어 내 다이 강도를 높임', deep: '연삭 뒤 표면에는 얇은 손상층이 남아 다이 강도를 떨어뜨립니다. 드라이 폴리싱 같은 스트레스 릴리프로 이 층을 제거하면 다이 강도가 올라갑니다.', src: 'discoThin' },
    { id: 'edge', ko: '엣지 칩핑 · 엣지 트리밍', en: 'Edge Chipping / Edge Trimming', short: '얇아진 가장자리가 깨지는 것과 그 예방', deep: '웨이퍼를 얇게 갈면 원래 둥글던 가장자리가 칼날처럼 날카로워져 칩핑과 파손이 생기기 쉽습니다. 연삭 전에 가장자리를 다듬는 엣지 트리밍으로 예방합니다.', src: 'discoThin' },
    { id: 'ringFrame', ko: '링 프레임 마운트', en: 'Ring Frame Mount', short: '얇은 웨이퍼를 테이프와 프레임에 붙여 들고 다님', deep: '얇아진 웨이퍼를 다이싱 테이프에 붙이고 둥근 링 프레임에 고정해, 다이싱과 다음 공정에서 안전하게 다룰 수 있게 합니다.', src: 'dfm2800' },
    { id: 'daf', ko: 'DAF · DBG', en: 'Die Attach Film / Dicing Before Grinding', short: '접착 필름 일체형 테이프 · 먼저 자르고 가는 방식', deep: '마운터는 DAF 일체형 다이싱 테이프도 붙일 수 있습니다. DBG는 먼저 하프컷한 뒤 뒷면을 갈아 칩으로 나누는 방식으로, 그라인더와 인라인으로 운용할 수 있습니다.', src: 'dgp8761' },
  ],
  sources: {
    dgp8761: { title: 'DGP8761 Fully Automatic Grinder/Polisher', publisher: 'DISCO', url: 'https://disco.co.jp/eg/products/polisher_etcher/dgp8761.html', status: '읽음' },
    dfm2800: { title: 'DFM2800 Wafer Mounter', publisher: 'DISCO', url: 'https://www.disco.co.jp/eg/products/mounter/dfm2800.html', status: '읽음' },
    discoThin: { title: 'Ultra-Thin Grinding (Solutions)', publisher: 'DISCO', url: 'https://disco.co.jp/eg/solution/library/grinder/thin.html', status: '읽음' },
    pg3000: { title: 'PG3000RMX Polish Grinder', publisher: 'ACCRETECH (Tokyo Seimitsu)', url: 'https://www.accretech.com/en/product/semicon/semi/polish/pg3000rmx.html', status: '읽음' },
    skhynix6: { title: 'Semiconductor Back-End Process Episode 6: Conventional Packages', publisher: 'SK hynix Newsroom', url: 'https://news.skhynix.com/semiconductor-back-end-process-episode-6-conventional-packages/', status: '읽음' },
  },
}
