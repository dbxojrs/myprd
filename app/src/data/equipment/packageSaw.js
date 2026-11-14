// 패키지 쏘(QFN 싱귤레이션) 장비 소개·조작 순서·결과물 데이터. 형식은 data/equipment/index.js 머리 주석을 보세요.
// 근거: review/equipment-back.md 7장. 장비사·뉴스룸 자료는 모두 "설명 출처"입니다. 모두 검수 전입니다.
// 한미반도체 MSVP의 세정·건조·검사·적재 흐름은 언론 보도에서만 나와 사실로 쓰지 않고 'press'로 따로 표시합니다.

export default {
  id: 'package-saw',
  reviewed: false,
  kind: { ko: '패키지 쏘 (싱귤레이션)', en: 'Package Saw / Singulation' },
  summary:
    '몰딩·마킹을 마친 스트립을 블레이드로 잘라 패키지 하나하나로 나누는(싱귤레이션, Singulation) 장비입니다. 스트립을 지그(Jig)나 테이프 프레임에 고정하고, 카메라로 절단 위치를 맞춘 뒤 고속으로 도는 블레이드로 가로·세로를 자릅니다.',
  vendors: [
    { name: 'DISCO', products: 'DFD6370 · DFD6080 · QFN 싱귤레이션', note: 'DFD6370은 최대 330×330 mm, 여러 스트립을 한 프레임에 처리, 옵션 높이 측정으로 웨터블 플랭크 QFN의 하프컷 깊이 제어', src: 'disco6370' },
    { name: 'Hanmi Semiconductor (한미반도체)', products: 'micro SAW · VISION PLACEMENT', note: '공식 제품 목록에서 모델명만 확인(설명은 이미지라 읽지 못함)', src: 'hanmi' },
    { name: 'EO Technics', products: 'PKG cutting BMC254', note: '블레이드 대신 레이저로 스트립을 자르는 장비. align vision, 자동 스캐너 보정', src: 'eo' },
  ],
  vendorNote:
    '삼성전자·SK하이닉스가 어떤 패키지 쏘를 쓰는지는 공식 페이지에서 확인하지 못했습니다. 한미반도체 "Micro SAW & Vision Placement"의 공정 흐름(절단 → 세척 → 건조 → 비전 검사 → 선별 → 적재)은 언론 보도에만 있어 허용 출처로 확인하지 못했습니다. 스트립 매거진 입력부의 배치와 비전 검사 항목도 확인하지 못했습니다.',
  modules: [
    { id: 'jig', name: { ko: '지그·척 테이블', en: 'Jig / Chuck Table' }, desc: '스트립을 진공으로 붙잡는 받침입니다. 테이프 없이 지그로 잡는 방식과, 테이프를 붙인 프레임으로 잡는 방식이 있습니다.', src: 'discoQfn' },
    { id: 'camera', name: { ko: '얼라인 카메라', en: 'Alignment Camera' }, desc: '절단선 위치를 찾습니다. 열로 늘어난 기판에서 생기는 인덱스 편차를 소프트웨어로 보정합니다.', src: 'discoQfn' },
    { id: 'spindle', name: { ko: '스핀들·블레이드', en: 'Spindle / Blade' }, desc: '고속으로 도는 축(스핀들) 끝의 얇은 블레이드가 몰드와 구리 리드프레임을 함께 자릅니다.', src: 'discoQfn' },
    { id: 'height', name: { ko: '높이 센서 (옵션)', en: 'Height Sensor' }, desc: '스트립 높이를 재서 자르는 깊이를 맞춥니다. 웨터블 플랭크 QFN의 하프컷 깊이를 조절할 때 씁니다(DFD6370).', src: 'disco6370' },
    { id: 'post', name: { ko: '후처리부 (보도 기준)', en: 'Clean / Dry / Vision' }, desc: '한미반도체 MSVP 같은 일체형 장비는 자른 뒤 세척·건조·비전 검사까지 한다고 언론에 보도되었지만, 공식 자료로는 확인하지 못했습니다.', src: 'press' },
    { id: 'tray', name: { ko: '트레이 적재', en: 'Tray Output' }, desc: '잘린 패키지를 트레이에 담아 테스트로 보냅니다.', src: 'skhynix6' },
  ],
  operation: [
    { id: 'recipe', who: '작업자', at: 'jig', lot: 'jig', title: '스트립 로드 · 디바이스 데이터 선택', desc: '몰드·마킹을 마친 스트립을 지그나 테이프 프레임에 올리고, 패키지 크기·절단 간격이 담긴 디바이스 데이터(레시피)를 고릅니다.', terms: ['jigTape'], src: 'discoQfn' },
    { id: 'hold', who: '장비', at: 'jig', lot: 'jig', title: '진공 고정', desc: '지그가 진공으로 스트립을 붙잡아 자르는 동안 움직이지 않게 합니다.', src: 'discoQfn' },
    { id: 'align', who: '장비', at: 'camera', lot: 'jig', title: '얼라인먼트 · 인덱스 보정', desc: '카메라로 절단선을 찾고, 열로 늘어난 기판 때문에 생긴 인덱스 편차를 보정합니다.', terms: ['index'], src: 'discoQfn' },
    { id: 'height', who: '장비', at: 'height', lot: 'jig', title: '높이 측정 (옵션)', desc: '웨터블 플랭크 QFN이면 높이를 재서 하프컷 깊이를 맞춥니다.', terms: ['flank'], src: 'disco6370' },
    { id: 'cut1', who: '장비', at: 'spindle', lot: 'jig', title: '1방향 절단', desc: '블레이드로 스트립을 한 방향으로 줄줄이 자릅니다.', terms: ['blade', 'burr'], src: 'skhynix6' },
    { id: 'cut2', who: '장비', at: 'spindle', lot: 'jig', title: '90° 돌려 2방향 절단', desc: '스트립을 90° 돌려 반대 방향을 잘라 패키지를 낱개로 나눕니다.', src: 'app' },
    { id: 'post', who: '장비', at: 'post', lot: 'post', title: '세척·건조·검사 (보도 기준)', desc: '일체형 장비는 이어서 세척·건조·비전 검사를 한다고 보도되었습니다(공식 자료로는 확인 못 함).', src: 'press' },
    { id: 'tray', who: '장비', at: 'tray', lot: 'tray', title: '트레이 적재 · 테스트로', desc: '패키지를 트레이에 담아 테스트 공정으로 보냅니다.', src: 'skhynix6' },
    { id: 'blade', who: '작업자', at: 'spindle', lot: 'tray', title: '블레이드 마모 확인', desc: '일렉트로폼 블레이드는 옆면이 빨리 닳아 패키지 치수가 틀어질 수 있으니 마모를 확인하고 교체합니다.', terms: ['electro'], src: 'discoQfn' },
  ],
  outputs: {
    product: '낱개로 잘린 QFN 패키지(트레이) — 테스트 공정으로 갑니다.',
    metrics: ['패키지 치수(블레이드 마모 영향)', '구리 버(Burr) 크기', '절단 위치 정확도'],
    notes: [
      { text: '구리 리드프레임을 자를 때 생기는 구리 버와, 블레이드 마모로 인한 패키지 치수 불량이 대표 결함입니다.', src: 'discoQfn' },
      { text: '리드가 바깥으로 나온 리드프레임 패키지는 자르는 대신 트림(댐바 제거)·폼(리드 성형) 공정을 거칩니다.', src: 'skhynix6' },
    ],
  },
  terms: [
    { id: 'singulation', ko: '싱귤레이션', en: 'Singulation', short: '스트립을 낱개 패키지로 나누는 공정', deep: 'SK하이닉스는 싱귤레이션을 "블레이드로 완성된 기판 스트립을 개별 패키지로 자르는 것"이라고 설명하고, 자른 패키지는 트레이에 담아 테스트합니다. Amkor는 QFN(MicroLeadFrame)을 자르는 Saw 방식과 찍어 내는 Punch 방식이 있다고 씁니다.', src: 'skhynix6' },
    { id: 'blade', ko: '블레이드', en: 'Blade', short: '다이아몬드 입자를 굳힌 얇은 절단 날', deep: '몰드와 구리 리드프레임을 함께 자르기 때문에, 블레이드 종류에 따라 버와 패키지 치수가 달라집니다. DISCO는 일렉트로폼과 레지노이드 블레이드의 마모 방식을 비교합니다.', src: 'discoQfn' },
    { id: 'electro', ko: '일렉트로폼 블레이드', en: 'Electroformed Blade', short: '기존에 표준으로 쓰던 전기 도금형 블레이드', deep: 'DISCO는 일렉트로폼 블레이드가 반지름 방향보다 옆면이 빨리 닳아, 수명 끝 무렵 패키지 치수 불량이 생긴다고 설명합니다.', src: 'discoQfn' },
    { id: 'resinoid', ko: '레지노이드 블레이드', en: 'Resinoid Blade', short: '수지로 입자를 굳힌 블레이드', deep: 'DISCO는 신형 레지노이드 블레이드가 반지름 방향으로 고르게 닳고 구리를 버 없이 자른다고 소개합니다(장비사 설명).', src: 'discoQfn' },
    { id: 'jigTape', ko: '지그 방식·테이프 방식', en: 'Jig / Tape Method', short: '스트립을 잡는 두 가지 방법', deep: '지그 방식은 진공으로 잡아 테이프가 필요 없고 대량·소품종에 맞으며 전용 핸들러와 묶어 씁니다. 테이프 방식은 모든 DISCO 다이싱 소에서 쓸 수 있습니다.', src: 'discoQfn' },
    { id: 'burr', ko: '구리 버', en: 'Copper Burr', short: '잘린 구리 리드 끝에 남는 거스러미', deep: '구리 리드프레임을 자를 때 리드 끝에 생기는 거스러미입니다. DISCO는 구리 버를 QFN 싱귤레이션의 대표 과제로 들고, 레지노이드 블레이드가 버 없이 자른다고 소개합니다.', src: 'discoQfn' },
    { id: 'index', ko: '인덱스 보정', en: 'Index Correction', short: '절단 간격 차이를 맞추는 것', deep: '열로 늘어난 기판에서는 절단선 간격(인덱스)이 설계값과 달라집니다. DISCO는 얼라인 소프트웨어로 이 편차를 보정합니다.', src: 'discoQfn' },
    { id: 'flank', ko: '웨터블 플랭크 하프컷', en: 'Wettable Flank Half-cut', short: '리드 옆면에 납이 잘 묻게 일부만 자르는 것', deep: 'DFD6370은 높이 측정 옵션으로 웨터블 플랭크 QFN의 하프컷 깊이를 조절합니다. 리드 옆면을 일부만 깎는 방식이라 깊이를 정확히 맞춰야 합니다.', src: 'disco6370' },
  ],
  sources: {
    discoQfn: { title: 'QFN Singulation (Solution Library)', publisher: 'DISCO', url: 'https://disco.co.jp/eg/solution/library/dicing/qfn.html', status: '읽음' },
    disco6370: { title: 'DFD6370 출시 소식', publisher: 'DISCO', url: 'https://disco.co.jp/eg/news/corp/20241206_3.html', status: '읽음' },
    hanmi: { title: '제품 목록 (micro SAW · VISION PLACEMENT)', publisher: 'Hanmi Semiconductor', url: 'https://www.hanmisemi.com/', status: '읽음 · 상세 텍스트 없음' },
    eo: { title: '반도체 장비 (PKG cutting BMC254)', publisher: 'EO Technics', url: 'https://www.eotechnics.com/page/products/equipment_catno3.php', status: '읽음' },
    amkor: { title: 'MicroLeadFrame (QFN)', publisher: 'Amkor', url: 'https://amkor.com/packaging/leadframe/microleadframe/', status: '읽음' },
    skhynix6: { title: 'Semiconductor Back-End Process Episode 6: Conventional Packages', publisher: 'SK hynix Newsroom', url: 'https://news.skhynix.com/semiconductor-back-end-process-episode-6-conventional-packages/', status: '읽음' },
    press: { title: '한미반도체 MSVP 관련 언론 보도', publisher: '언론 보도 (허용 출처 아님)', url: '', status: '검색요약 · 공식 확인 못 함' },
    app: { title: '이 앱 장비 시뮬레이터의 가동 순서·규칙', publisher: '이 앱', url: '', status: '교육용 가설 · 출처 미확인' },
  },
}
