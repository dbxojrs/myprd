// 다이싱 소 장비 소개·조작 순서·결과물 데이터. 형식은 data/equipment/index.js 머리 주석을 보세요.
// 근거: review/equipment-back.md 2장. 장비사·뉴스룸 자료는 모두 "설명 출처"입니다. 모두 검수 전입니다.

export default {
  id: 'wafer-saw',
  reviewed: false,
  kind: { ko: '전자동 다이싱 소 (블레이드 다이싱)', en: 'Fully Automatic Dicing Saw' },
  summary:
    '링 프레임에 마운트된 웨이퍼를 척 테이블에 진공으로 붙잡고, 고속으로 도는 다이아몬드 블레이드로 스트리트(칩 사이 길)를 따라 잘라 개별 다이로 나누는 장비입니다. 마주 보는 두 스핀들(Z1·Z2)로 스텝 컷을 하고, 현미경으로 커프를 확인합니다.',
  vendors: [
    { name: 'DISCO', products: 'DFD6362 · DAD3351', note: 'DFD6362는 Φ300 mm 전자동, 마주 보는 듀얼 스핀들. DAD3351은 반자동 단일 스핀들(6,000~60,000 min⁻¹)', src: 'dfd6362' },
    { name: 'ACCRETECH (Tokyo Seimitsu)', products: 'AD3000T-PLUS', note: 'Φ300 mm 전자동, 대각선으로 마주 본 2축 스핀들, 광학 커터 셋(OPC)', src: 'ad3000' },
    { name: 'EO Technics', products: 'LMC3200G / LMC3200D', note: 'G는 스트리트의 Low-k·금속층을 레이저로 미리 걷어 내는 그루빙, D는 200 μm 이하 얇은 웨이퍼 레이저 절단', src: 'eotech' },
  ],
  vendorNote: '삼성전자·SK하이닉스가 어떤 다이싱 장비를 쓰는지는 공식 페이지에서 확인하지 못했습니다. 카세트 엘리베이터의 형태, 터치패널 여부, "티칭"·"블레이드 드레싱" 같은 현장 용어의 장비사 원문은 허용 출처에서 확인하지 못했습니다.',
  modules: [
    { id: 'cassette', name: { ko: '카세트', en: 'Frame Cassette' }, desc: '링 프레임에 마운트된 웨이퍼가 담긴 Φ300 프레임 카세트를 올리는 곳입니다.', src: 'dfd6362' },
    { id: 'prealign', name: { ko: '프리얼라인 스테이지', en: 'Pre-align Stage' }, desc: '아래쪽 암이 카세트에서 꺼낸 웨이퍼를 프리얼라인 스테이지에서 대략 맞춥니다.', src: 'dfd6362' },
    { id: 'chuck', name: { ko: '척 테이블', en: 'Chuck Table' }, desc: '프레임에 붙은 웨이퍼를 진공으로 붙잡고, 절삭 방향으로 움직이며 90°로 돌아갑니다.', src: 'dfd6362' },
    { id: 'spindle', name: { ko: '대향 듀얼 스핀들 · 블레이드', en: 'Facing Dual Spindles / Blades' }, desc: 'Z1과 Z2 스핀들이 마주 보고, 끝에 원형 다이아몬드 블레이드와 휠 커버가 있습니다.', src: 'dfd6362' },
    { id: 'scope', name: { ko: '현미경 · GUI', en: 'Microscope / GUI' }, desc: '현미경 화면과 조작 버튼이 같은 화면에 있어, 얼라인먼트와 커프 체크를 보면서 조작합니다.', src: 'dfd6362' },
    { id: 'spinner', name: { ko: '스피너 테이블', en: 'Spinner Table' }, desc: '위쪽 암이 다 자른 웨이퍼를 스피너로 옮겨 씻고 말립니다.', src: 'dfd6362' },
  ],
  operation: [
    { id: 'load', who: '작업자', at: 'cassette', lot: 'cassette', title: '카세트 로드 · 디바이스 데이터 선택', desc: '마운트된 웨이퍼 카세트를 올리고, 칩 크기·스트리트 간격 등이 든 디바이스 데이터(레시피)를 고릅니다.', terms: ['device'], src: 'discoQfn' },
    { id: 'prealign', who: '장비', at: 'prealign', lot: 'prealign', title: '꺼내기 · 프리얼라인', desc: '아래쪽 암이 웨이퍼를 꺼내 프리얼라인 스테이지에서 대략 맞춘 뒤 척 테이블로 옮깁니다.', src: 'dfd6362' },
    { id: 'align', who: '장비', at: 'scope', lot: 'chuck', title: '얼라인먼트 (패턴 인식)', desc: '현미경으로 웨이퍼의 패턴을 인식해 스트리트가 절삭 방향과 나란하도록 맞춥니다.', terms: ['align'], src: 'dad3351' },
    { id: 'setup', who: '장비', at: 'spindle', lot: 'chuck', title: '블레이드 높이 셋업', desc: '비접촉 셋업(NCS)이나 광학 커터 셋(OPC)으로 블레이드 끝 높이를 재서 컷 깊이를 정확히 맞춥니다.', src: 'dad3351' },
    { id: 'cut1', who: '장비', at: 'spindle', lot: 'chuck', title: '1방향 절삭 · 스텝 컷', desc: '스핀들이 돌며 블레이드가 스트리트를 따라 자릅니다. Z1이 먼저 일부를 자르고 Z2가 나머지를 자르는 스텝 컷을 하고, 인덱스만큼 옮겨 가며 반복합니다.', terms: ['stepCut', 'index'], src: 'discoThin' },
    { id: 'rotate', who: '장비', at: 'chuck', lot: 'chuck', title: '90° 회전 · 2방향 절삭', desc: '척 테이블을 90° 돌려 나머지 방향의 스트리트를 같은 방법으로 자릅니다.', src: 'dfd6362' },
    { id: 'kerf', who: '작업자', at: 'scope', lot: 'chuck', title: '커프 체크', desc: '현미경으로 잘린 폭(커프)과 칩핑 크기를 확인합니다.', terms: ['kerf'], src: 'discoThin' },
    { id: 'clean', who: '장비', at: 'spinner', lot: 'spinner', title: '스피너 세정·건조 → 언로드', desc: '위쪽 암이 웨이퍼를 스피너로 옮겨 씻고 말린 뒤 카세트로 돌려보냅니다.', src: 'dfd6362' },
  ],
  outputs: {
    product: '테이프 위에서 개별 다이로 나뉜 웨이퍼(링 프레임에 붙은 상태 그대로)',
    metrics: ['커프 폭', '앞면·뒷면 칩핑 크기', '절단 여부(미절단)'],
    notes: [
      { text: '웨이퍼가 얇을수록 뒷면 칩핑이 늘어나며, 입자가 더 고운 블레이드로 줄입니다.', src: 'discoThin' },
      { text: '블레이드 다이싱은 얇은 웨이퍼를 깨뜨리기 쉽고, 비접촉인 레이저 다이싱이 얇은 웨이퍼에 알맞습니다.', src: 'skhynix6' },
      { text: '스트리트의 Low-k 막을 레이저로 미리 걷어 내면(그루빙) 블레이드 다이싱의 칩핑을 줄일 수 있습니다.', src: 'eotech' },
    ],
  },
  terms: [
    { id: 'device', ko: '디바이스 데이터', en: 'Device Data (Recipe)', short: '칩·스트리트 정보가 든 가공 조건', deep: '칩 크기, 스트리트 간격, 컷 깊이 같은 조건을 담은 데이터입니다. 디바이스 데이터를 바꾸면 같은 장비로 다른 제품을 처리할 수 있습니다.', src: 'discoQfn' },
    { id: 'align', ko: '얼라인먼트', en: 'Alignment', short: '현미경으로 스트리트 위치를 맞춤', deep: '프리얼라인으로 대략 맞춘 뒤 현미경 패턴 인식으로 정밀하게 맞춥니다. DAD3351에는 여러 곳을 보고 맞추는 멀티 얼라인먼트 옵션이 있습니다.', src: 'dad3351' },
    { id: 'stepCut', ko: '싱글 컷 · 스텝 컷', en: 'Single Cut / Step Cut', short: '한 번에 자르기 · 두 블레이드로 나눠 자르기', deep: '스텝 컷은 Z1 블레이드가 먼저 일부 깊이를 자르고, Z2 블레이드가 나머지를 잘라 칩핑을 줄이는 방법입니다.', src: 'discoThin' },
    { id: 'index', ko: '인덱스', en: 'Index', short: '스트리트 간격만큼 옮겨 가며 반복 절삭', deep: '한 줄을 자르면 다음 스트리트 간격만큼 이동해 다시 자릅니다. 패키지 쏘잉에서는 기판이 열로 늘어나 인덱스가 달라지므로 정렬 보정을 합니다.', src: 'discoQfn' },
    { id: 'kerf', ko: '커프 체크', en: 'Kerf Check', short: '잘린 폭과 칩핑을 현미경으로 확인', deep: '커프는 블레이드가 지나가며 깎아 낸 폭입니다. 커프 체크로 폭과 칩핑이 스트리트 안에 들어오는지 확인합니다. DISCO는 짧게 확인하는 Short Kerf Check를 씁니다.', src: 'discoThin' },
    { id: 'grit', ko: '블레이드 그릿', en: 'Blade Grit', short: '블레이드 다이아몬드 입자 크기(#2000, #4800 등)', deep: '숫자가 클수록 입자가 곱습니다. 얇은 웨이퍼의 뒷면 칩핑을 줄이려면 #4800 같은 고운 블레이드를 씁니다.', src: 'discoThin' },
    { id: 'selfSharp', ko: '블레이드 자생 작용', en: 'Self-sharpening', short: '닳은 입자가 빠지고 새 입자가 드러나는 것', deep: '가공 부하가 일정해야 블레이드 표면의 닳은 입자가 떨어지고 새 입자가 드러나는 자생 작용이 유지됩니다. 앞면 막이나 TEG 때문에 블레이드가 막힐(clogging) 수 있습니다.', src: 'discoThin' },
    { id: 'stealth', ko: '스텔스 다이싱', en: 'Stealth Dicing', short: '레이저로 내부에 금을 낸 뒤 테이프를 늘려 분리', deep: '웨이퍼 안쪽에 레이저를 모아 개질층을 만들고 테이프를 늘려(익스팬션) 칩을 나눕니다. 물을 쓰지 않아 부스러기가 적고 스트리트를 좁힐 수 있습니다.', src: 'stealth' },
  ],
  sources: {
    dfd6362: { title: 'DFD6362 Fully Automatic Dicing Saw', publisher: 'DISCO', url: 'https://www.disco.co.jp/eg/products/dicer/dfd6362.html', status: '읽음' },
    dad3351: { title: 'DAD3351 Automatic Dicing Saw', publisher: 'DISCO', url: 'https://disco.co.jp/eg/products/dicer/dad3351.html', status: '읽음' },
    discoThin: { title: 'Dicing Thin Wafers (Solutions)', publisher: 'DISCO', url: 'https://disco.co.jp/eg/solution/library/dicing/dicing_thin.html', status: '읽음' },
    discoQfn: { title: 'QFN Package Processing', publisher: 'DISCO', url: 'https://disco.co.jp/eg/solution/apexp/dicing/qfn.html', status: '읽음' },
    stealth: { title: 'Stealth Dicing (Solutions)', publisher: 'DISCO', url: 'https://disco.co.jp/eg/solution/library/laser/stealth.html', status: '읽음' },
    ad3000: { title: 'AD3000T-PLUS Dicing Machine', publisher: 'ACCRETECH (Tokyo Seimitsu)', url: 'https://www.accretech.com/en/product/semicon/semi/dicer_semi/ad3000t-plus.html', status: '읽음' },
    eotech: { title: 'Laser Grooving / Dicing (LMC3200)', publisher: 'EO Technics', url: 'https://www.eotechnics.com/page/products/equipment_catno3.php', status: '읽음' },
    skhynix6: { title: 'Semiconductor Back-End Process Episode 6: Conventional Packages', publisher: 'SK hynix Newsroom', url: 'https://news.skhynix.com/semiconductor-back-end-process-episode-6-conventional-packages/', status: '읽음' },
  },
}
