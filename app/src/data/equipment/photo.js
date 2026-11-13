// 노광 장비 + 트랙 장비 소개·조작 순서·결과물 데이터. 형식은 data/equipment/index.js 머리 주석을 보세요.
// 근거: review/equipment-front.md 0·2장. 장비사·뉴스룸 자료는 모두 "설명 출처"입니다. 모두 검수 전입니다.

export default {
  id: 'photo',
  reviewed: false,
  kind: { ko: '트랙 + 노광 장비(스캐너)', en: 'Coater/Developer Track + Scanner' },
  summary:
    '감광액(PR)을 바르고 굽고 현상하는 트랙(Track, 코터/디벨로퍼)과, 빛으로 마스크 무늬를 옮기는 노광 장비(스캐너·스테퍼)가 인라인(Inline)으로 붙어 한 덩어리로 돌아갑니다.',
  vendors: [
    { name: 'ASML', products: 'TWINSCAN NXT·XT(DUV) · NXE·EXE(EUV)', note: 'ArF 이머전 장비를 업계의 "workhorse"라고 소개. NXT:2150i는 듀얼 스테이지(Dual-stage) ArF 이머전. EUV는 주석 액적 광원·미러 광학계·진공 경로', src: 'asmlDuv' },
    { name: 'Tokyo Electron (TEL)', products: 'CLEAN TRACK LITHIUS Pro · ACT 12', note: '300mm 코터/디벨로퍼. 노광 장비와 인라인으로 연결해 쓰며, LITHIUS Pro는 검사·측정 모듈 여러 개를 실을 수 있음', src: 'telLithius' },
  ],
  vendorNote:
    'SK하이닉스는 2025년 9월 ASML TWINSCAN EXE:5200B(High-NA EUV)를 이천 M16 팹에 들였다고 발표했고, 삼성전자는 2028년까지 첨단 D램에 High-NA EUV를 도입할 계획이라고 밝혔습니다(모델·팹은 기사에 없음). 두 회사가 어떤 트랙(코터/디벨로퍼)을 쓰는지는 공식 페이지에서 확인하지 못했습니다.',
  modules: [
    { id: 'loadport', name: { ko: '캐리어 블록·로드포트', en: 'Carrier Block / Load Port' }, desc: 'FOUP을 트랙에 올려놓는 입구 블록입니다. 여기서 웨이퍼를 꺼내 공정 블록으로 보냅니다(일반 구조, 특허 검색 요약).', src: 'patentTrack' },
    { id: 'coater', name: { ko: '코터', en: 'Coater' }, desc: '웨이퍼를 돌리며 감광액을 얇게 펴 바르고, 가장자리·뒷면에 묻은 남는 감광액을 걷어 냅니다. 필요하면 먼저 반사 방지막(BARC)을 바릅니다.', src: 'skhynix3' },
    { id: 'bake', name: { ko: '베이크 플레이트', en: 'Hot / Cool Plate' }, desc: '도포 뒤 가열해 용제를 날리고, 노광 뒤에도 다시 가열(PEB)합니다. TEL ACT 12는 정밀 오븐을 갖춘다고 소개합니다.', src: 'skhynix3' },
    { id: 'interface', name: { ko: '인터페이스 블록', en: 'Interface Block' }, desc: '트랙과 노광 장비를 잇는 부분입니다. 인라인(Inline)은 노광 장비와 코터/디벨로퍼를 하나로 이은 구성을 말합니다.', src: 'telNews' },
    { id: 'source', name: { ko: '광원·투영 광학계', en: 'Light Source / Projection Optics' }, desc: 'EUV는 CO₂ 레이저 펄스로 주석 액적을 때려 빛을 만들고, 미러로 무늬를 4배 줄여 비춥니다. EUV 빛은 공기에도 흡수돼 경로 전체가 진공입니다.', src: 'asmlEuv' },
    { id: 'stage', name: { ko: '레티클·웨이퍼 스테이지', en: 'Reticle / Wafer Stage' }, desc: '마스크(레티클)와 웨이퍼를 실어 정밀하게 움직입니다. ASML은 EUV 웨이퍼 스테이지 위치 정밀도를 0.25 nm 이내로 소개합니다.', src: 'asmlEuv' },
    { id: 'developer', name: { ko: '디벨로퍼', en: 'Developer' }, desc: '현상액으로 감광액을 녹여 무늬를 드러내고 헹굽니다. 현상 장비는 처리 속도와 결함률 사이에서 고르는 경우가 많습니다.', src: 'skhynix3' },
  ],
  operation: [
    { id: 'oht', who: 'OHT', at: 'loadport', lot: 'loadport', title: 'FOUP 도착', desc: 'OHT가 FOUP을 트랙의 로드포트에 내려놓습니다.', terms: ['track'], src: 'samsungFab' },
    { id: 'recipe', who: '작업자', at: 'loadport', lot: 'loadport', title: '로트 확인 · 레시피 선택', desc: '로트를 확인하고 도포·베이크·노광·현상 조건이 묶인 레시피를 고릅니다.', src: 'samsungRecipe' },
    { id: 'coat', who: '장비', at: 'coater', lot: 'coater', title: '감광액 도포', desc: '코터가 웨이퍼를 돌려 감광액을 펴 바르고 가장자리·뒷면의 남는 감광액을 걷어 냅니다.', terms: ['pr'], src: 'skhynix3' },
    { id: 'softbake', who: '장비', at: 'bake', lot: 'bake', title: '베이크(용제 제거)', desc: '오븐에서 가열해 감광액 속 용제를 날립니다.', src: 'skhynix3' },
    { id: 'align', who: '장비', at: 'stage', lot: 'stage', title: '정렬', desc: '인터페이스 블록을 지나 노광 장비로 들어간 웨이퍼를, 이전 층에 새긴 정렬 마크에 맞춥니다.', terms: ['overlay'], src: 'skhynix3' },
    { id: 'expose', who: '장비', at: 'source', lot: 'stage', title: '노광', desc: '칩 크기 영역씩 빛을 비추고, 스테이지가 옮겨 가며 웨이퍼 전체를 반복해 노광합니다.', terms: ['scanner', 'euv'], src: 'skhynix3' },
    { id: 'peb', who: '장비', at: 'bake', lot: 'bake', title: 'PEB(노광 후 베이크)', desc: '트랙으로 돌아와 노광된 웨이퍼를 다시 가열합니다.', terms: ['peb'], src: 'skhynix3' },
    { id: 'develop', who: '장비', at: 'developer', lot: 'developer', title: '현상 · 린스', desc: '현상액으로 무늬를 드러내고 헹굽니다.', src: 'skhynix3' },
    { id: 'inspect', who: '작업자', at: 'loadport', lot: 'loadport', title: '검사·계측 → 식각으로', desc: '오버레이 등은 모든 웨이퍼가 아니라 골라서(샘플링) 잽니다. 측정 장비·현미경·육안 검사를 통과한 웨이퍼만 다음 공정으로 갑니다.', terms: ['cd'], src: 'samsung4' },
  ],
  outputs: {
    product: '감광액(레지스트) 무늬가 새겨진 웨이퍼 — 다음 식각 공정에서 깎지 않을 곳을 가리는 마스크가 됩니다.',
    metrics: ['오버레이(Overlay): 이전 층과 겹침 정확도', '포커스(Focus)', 'CD(선폭) 균일도'],
    notes: [
      { text: '오버레이 측정은 모든 웨이퍼에서 하지 않고 골라서 합니다.', src: 'skhynix3' },
      { text: 'TEL LITHIUS Pro Z는 파티클이 적은 반송 방식과 베벨 비접촉 반송으로 뒷면·가장자리 결함을 줄인다고 소개합니다.', src: 'telLithius' },
      { text: '현상 장비 선택은 처리 속도와 결함률 사이의 맞바꿈인 경우가 많습니다.', src: 'skhynix3' },
    ],
  },
  terms: [
    { id: 'track', ko: '트랙', en: 'Track (Coater/Developer)', short: '감광액 도포·베이크·현상을 하는 장비', deep: '코터와 디벨로퍼, 베이크 플레이트를 묶은 장비입니다. 노광 장비와 인라인으로 붙여 웨이퍼가 사람 손 없이 도포 → 노광 → 현상까지 이어 갑니다. TEL ACT 12는 인라인일 때 작은 면적과 빠른 반송을 장점으로 듭니다.', src: 'telAct' },
    { id: 'scanner', ko: '스캐너·스테퍼', en: 'Scanner / Stepper', short: '마스크 무늬를 빛으로 웨이퍼에 옮기는 노광 장비', deep: '칩 하나 크기씩 노광하고 옮겨 가며 반복합니다. 삼성 뉴스룸은 이 방식을 "스테퍼 노광(Stepper Exposure)"이라 부릅니다. ASML의 DUV 장비 NXT:2150i는 스테이지가 두 개인 듀얼 스테이지 구조입니다.', src: 'samsung4' },
    { id: 'pr', ko: '감광액·BARC', en: 'Photoresist (PR) / BARC', short: '빛에 반응하는 막과 그 아래 반사 방지막', deep: '감광액은 코터로 돌려 바릅니다. 그 전에 BARC를 발라 반사를 줄이기도 하고, ArF 이머전에서는 위쪽 반사 방지막(TARC)을 씁니다.', src: 'skhynix3' },
    { id: 'peb', ko: 'PEB', en: 'Post Exposure Bake', short: '노광 뒤 다시 굽는 단계', deep: '노광을 마친 웨이퍼를 현상 전에 다시 가열합니다. 도포 뒤 굽는 단계와 구분해 노광 후 베이크라 부릅니다.', src: 'skhynix3' },
    { id: 'overlay', ko: '오버레이', en: 'Overlay', short: '이번 층 무늬가 이전 층과 겹치는 정확도', deep: '노광 전 이전 층의 정렬 마크로 위치를 맞추고, 현상 뒤 겹침 오차를 샘플링해 잽니다. ASML은 오버레이를 처리량·포커스와 함께 주요 성능 지표로 듭니다.', src: 'asmlDuv' },
    { id: 'cd', ko: 'CD', en: 'Critical Dimension', short: '무늬의 가장 중요한 선폭', deep: '현상된 무늬의 선폭입니다. TEL은 Pro Z가 미세 선폭 균일도를 제어한다고 소개합니다. CD가 흔들리면 다음 식각 결과가 달라집니다.', src: 'telLithius' },
    { id: 'euv', ko: 'EUV · High-NA EUV', en: 'Extreme Ultraviolet', short: '13 nm 해상도급 극자외선 노광', deep: 'ASML은 NXE(NA 0.33) 13 nm, EXE(NA 0.55) 8 nm 해상도를 제시합니다. EUV 빛은 공기에도 흡수되므로 광원부터 웨이퍼까지 진공이고, 렌즈 대신 미러를 씁니다.', src: 'asmlEuv' },
    { id: 'inline', ko: '인라인', en: 'Inline', short: '트랙과 노광 장비를 한 덩어리로 연결', deep: 'TEL은 인라인을 "노광 장비와 코터/디벨로퍼의 통합"으로 정의하고, 2021년 EXE:5000과의 인라인 연결을 발표했습니다.', src: 'telNews' },
  ],
  sources: {
    asmlDuv: { title: 'DUV lithography systems', publisher: 'ASML', url: 'https://www.asml.com/en/products/duv-lithography-systems', status: '읽음' },
    asmlEuv: { title: 'EUV lithography systems', publisher: 'ASML', url: 'https://www.asml.com/en/products/euv-lithography-systems', status: '읽음' },
    telLithius: { title: 'CLEAN TRACK LITHIUS Pro', publisher: 'Tokyo Electron', url: 'https://www.tel.co.jp/product/lithius.html', status: '읽음' },
    telAct: { title: 'CLEAN TRACK ACT 12', publisher: 'Tokyo Electron', url: 'https://www.tel.com/product/act.html', status: '읽음' },
    telNews: { title: 'EXE:5000 인라인 코터/디벨로퍼 (2021)', publisher: 'Tokyo Electron', url: 'https://www.tel.com/news/topics/2021/20210608_001.html', status: '읽음' },
    skhynix3: { title: 'Semiconductor Front-End Process Episode 3', publisher: 'SK hynix Newsroom', url: 'https://news.skhynix.com/semiconductor-front-end-process-episode-3/', status: '읽음' },
    samsung4: { title: '[반도체 8대 공정] 4탄 포토공정', publisher: '삼성전자 반도체 뉴스룸', url: 'https://news.samsungsemiconductor.com/kr/%EB%B0%98%EB%8F%84%EC%B2%B4-8%EB%8C%80-%EA%B3%B5%EC%A0%95-4%ED%83%84-%EC%9B%A8%EC%9D%B4%ED%8D%BC%EC%97%90-%ED%95%9C-%ED%8F%AD%EC%9D%98-%EC%84%B8%EB%B0%80%ED%99%94%EB%A5%BC-%EA%B7%B8%EB%A0%A4/', status: '읽음' },
    samsungFab: { title: '우리 반모 할래 7탄 (2021.04.22, FOUP·OHT·클린룸)', publisher: '삼성전자 반도체 뉴스룸', url: 'https://news.samsungsemiconductor.com/kr/', status: '읽음 · 제목으로 검색' },
    samsungRecipe: { title: '나는 신입사원입니다 시즌2 Ep.2 (2024.01.18)', publisher: '삼성전자 반도체 뉴스룸', url: 'https://news.samsungsemiconductor.com/kr/', status: '읽음 · 제목으로 검색' },
    patentTrack: { title: '트랙 블록 구성 (미국 특허 US 8372480 등 검색 요약)', publisher: 'USPTO', url: '', status: '검색 요약 · 일반 구조 참고' },
  },
}
