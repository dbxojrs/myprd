// 매엽식 습식 세정 장비 소개·조작 순서·결과물 데이터. 형식은 data/equipment/index.js 머리 주석을 보세요.
// 인용 문장은 출처 원문을 내려받아 그대로 있는지 대조했습니다(2026-11-26). 장비사 자료·공개 특허는 모두 "설명 출처"입니다. 모두 검수 전입니다.

export default {
  id: 'cleaning',
  reviewed: false,
  kind: { ko: '매엽식 습식 세정 장비', en: 'Single-Wafer Wet Cleaning Tool' },
  summary:
    '반송 로봇이 웨이퍼를 여러 개의 공정 챔버에 한 장씩 넣고, 챔버 안에서 웨이퍼를 돌리며 약액과 초순수를 번갈아 뿌려 씻은 뒤 빠르게 돌려 말리는 장비입니다. 챔버를 여러 개 두어 한 장씩 씻으면서도 생산 처리량을 맞춥니다.',
  vendors: [
    { name: 'SCREEN', products: 'SU-3400', note: '6층·4타워 구조, 시간당 최대 1,200장 처리', src: 'screenSu3400' },
    { name: 'Tokyo Electron (TEL)', products: 'CELLESTA', note: '세정 챔버를 최대 20개까지 넣고 차지하는 면적은 훨씬 작게', src: 'telCellesta' },
    { name: 'Lam Research', products: 'EOS', note: '공정 챔버 최대 16개(페이지에 "매엽식"이라는 표현은 없음)', src: 'lamEos' },
    { name: 'ACM Research', products: 'Ultra C SAPS V', note: '매엽식 세정 챔버 12개, 웨이퍼가 도는 동안 메가소닉 진동자를 움직이거나 기울임', src: 'acmSaps' },
    { name: 'SEMES', products: '매엽식 세정 장비', note: '양산용 매엽식 세정 장비 누적 2,500대 판매(2025 기사)', src: 'asiaeSemes' },
  ],
  vendorNote: '세정 장비 시장은 SCREEN·TEL·Lam 세 회사가 약 75%를 차지한다고 소개됩니다(Semiconductor Engineering). 삼성전자·SK하이닉스가 어떤 장비를 쓰는지는 공식 페이지에서 확인하지 못했습니다.',
  modules: [
    { id: 'loadport', name: { ko: 'FOUP 인터페이스', en: 'FOUP Interface' }, desc: '웨이퍼가 든 FOUP을 받는 입구입니다. 요즘 세정 장비는 FOUP 인터페이스와 웨이퍼 반송 로봇을 갖춥니다(습식 벤치 설명을 참고).', src: 'mksWet' },
    { id: 'robot', name: { ko: '반송 로봇', en: 'Wafer Transport Robot' }, desc: '웨이퍼를 각 공정 챔버에 넣고 꺼냅니다. 로봇과 챔버의 배치를 개선해 처리량을 높입니다.', src: 'screenSu3400' },
    { id: 'chamber', name: { ko: '공정 챔버 (매엽식)', en: 'Single-Wafer Chamber' }, desc: '챔버마다 웨이퍼를 한 장씩 씻습니다. 챔버를 여러 개 두어 생산 처리량을 유지합니다(SU-3400은 6층·4타워).', src: 'mksWet' },
    { id: 'chuck', name: { ko: '스핀 척 · 처리 컵', en: 'Spin Chuck & Cup' }, desc: '스핀 척이 웨이퍼 가장자리를 잡고 돌리며, 둘레의 처리 컵이 튀는 액체를 받아 냅니다.', src: 'patent' },
    { id: 'nozzle', name: { ko: '약액·초순수 노즐', en: 'Chemical / DIW Nozzle' }, desc: '웨이퍼 윗면에 약액과 헹굼용 순수를 뿌립니다.', src: 'patent' },
    { id: 'megasonic', name: { ko: '메가소닉 진동자', en: 'Megasonic Transducer' }, desc: '웨이퍼가 도는 동안 진동자를 움직이거나 기울여 메가소닉 에너지를 고르게 전합니다. 질소와 순수를 섞어 뿌리는 이류체 분사로 입자 제거를 돕는 선택 사양도 있습니다.', src: 'acmSaps' },
    { id: 'dry', name: { ko: '건조 (스핀·IPA)', en: 'Drying' }, desc: '뜨거운 IPA와 순수를 쓰는 건조 기술을 더해 웨이퍼를 말립니다.', src: 'acmSaps' },
    { id: 'chem', name: { ko: '약액 공급부', en: 'Chemical Supply' }, desc: '약액을 공급하고 순환시키는 장치입니다. SU-2000은 약액 공급부를 장비 뒤쪽에 붙여 공정 제어를 좋게 했습니다.', src: 'screenSu2000' },
    { id: 'exhaust', name: { ko: '배기', en: 'Exhaust' }, desc: '챔버 안의 기체와 약액 증기를 빼냅니다. 공기 흐름을 자동으로 맞춰 배기량을 줄이기도 합니다.', src: 'screenSu3400' },
  ],
  operation: [
    { id: 'arrive', who: 'OHT', at: 'loadport', lot: 'loadport', title: 'FOUP 도착 · 레시피 선택', desc: 'FOUP이 장비 입구에 놓이고, 오염 종류에 맞는 약액 순서·건조 방식이 담긴 레시피를 고릅니다.', terms: ['scseq'], src: 'mksWet' },
    { id: 'in', who: '장비', at: 'robot', lot: 'robot', title: '챔버로 반입', desc: '반송 로봇이 웨이퍼를 공정 챔버 안으로 옮깁니다.', src: 'patent' },
    { id: 'chuck', who: '장비', at: 'chuck', lot: 'chamber', title: '스핀 척에 고정', desc: '스핀 척이 웨이퍼 가장자리를 잡습니다.', src: 'patent' },
    { id: 'clean', who: '장비', at: 'nozzle', lot: 'chamber', title: '약액 · 헹굼 반복', desc: '웨이퍼를 돌리며 약액 처리와 헹굼을 번갈아 되풀이합니다.', terms: ['megasonic'], src: 'patent' },
    { id: 'dry', who: '장비', at: 'dry', lot: 'chamber', title: '스핀 건조', desc: '웨이퍼를 빠르게 돌려 원심력으로 물방울을 떨어냅니다. 가는 패턴은 이때 쓰러질 위험이 큽니다(용어 참고).', terms: ['collapse'], src: 'patent' },
    { id: 'out', who: '장비', at: 'robot', lot: 'loadport', title: '반출 · FOUP으로', desc: '회전을 멈추고 척을 풀면 반송 로봇이 웨이퍼를 챔버 밖으로 꺼내 FOUP에 담습니다.', src: 'patent' },
  ],
  outputs: {
    product: '입자·금속·유기물·자연산화막이 씻겨 나간 깨끗한 웨이퍼 — 다음 공정(산화·증착·포토 등)에 바로 들어갑니다.',
    metrics: ['남은 입자 수', '금속 오염', '자연산화막', '패턴 붕괴 여부'],
    notes: [
      { text: '3D 구조에서는 씻은 뒤 말리는 단계가 패턴이 쓰러지는 위험을 키웁니다.', src: 'semiengClean' },
      { text: '액체의 표면장력 때문에 생기는 결함을 피하려고, 표면장력이 없는 초임계 유체로 씻는 방법도 씁니다.', src: 'hynixCC' },
    ],
  },
  terms: [
    { id: 'scseq', ko: '매엽식·배치식', en: 'Single-Wafer / Batch', short: '한 장씩 / 여러 장을 한꺼번에', deep: '배치식은 약품을 채운 조에 여러 장을 한꺼번에 담가 씻고, 매엽식은 챔버마다 한 장씩 씻습니다. 배치식은 섬세한 첨단 웨이퍼에는 알맞지 않습니다.', src: 'hynixCC' },
    { id: 'megasonic', ko: '메가소닉', en: 'Megasonic', short: '아주 높은 진동수로 입자 제거를 돕는 방법', deep: '요즘 SC-1 세정은 0.8~2.0MHz 메가소닉 진동으로 입자 제거를 돕습니다. 다만 터지는 기포가 섬세한 구조를 손상시킬 수 있어 65nm 이후 첨단 공정에서는 거의 쓰지 않게 되었습니다.', src: 'mksClean' },
    { id: 'collapse', ko: '패턴 붕괴', en: 'Pattern Collapse', short: '말릴 때 가는 패턴이 쓰러지는 불량', deep: '세정 뒤에는 늘 건조 단계가 있고, 3D 구조에서는 이 건조가 패턴 붕괴 위험을 키웁니다. 그래서 첨단 3D 구조일수록 IPA 건조 단계를 더 많이 씁니다.', src: 'semiengClean' },
  ],
  sources: {
    hynixCC: { title: 'Creating Defectless Wafers: A Look at CLEAN & CMP Technology', publisher: 'SK hynix Newsroom', url: 'https://news.skhynix.com/en/creating-defectless-wafers-a-look-at-clean-cmp-technology/', status: '읽음' },
    mksWet: { title: 'Wet Substrate Surface Cleaning', publisher: 'MKS Instruments', url: 'https://www.mks.com/n/wet-substrate-cleaning', status: '읽음' },
    mksClean: { title: 'Wafer Surface Cleaning', publisher: 'MKS Instruments', url: 'https://www.mks.com/n/cmos-wafer-cleaning', status: '읽음' },
    semiengClean: { title: 'Wafer Cleaning Becomes Key Challenge In Manufacturing 3D Structures', publisher: 'Semiconductor Engineering (2022)', url: 'https://semiengineering.com/wafer-cleaning-becomes-key-challenge-in-manufacturing-3d-structures', status: '읽음' },
    screenSu3400: { title: 'SU-3400 Single Wafer Cleaning System', publisher: 'SCREEN Semiconductor Solutions', url: 'https://www.screen.co.jp/spe/en/products/su-3400', status: '읽음 (처리량은 The Worldfolio 2022.12 기사)' },
    screenSu2000: { title: 'Single Wafer Cleaner SU-2000', publisher: 'SCREEN SPE Tech', url: 'https://www.screen.co.jp/setc/en/products/su-2000/', status: '읽음' },
    telCellesta: { title: 'CELLESTA', publisher: 'Tokyo Electron', url: 'https://www.tel.com/product/cellesta.html', status: '읽음' },
    lamEos: { title: 'EOS Product Family', publisher: 'Lam Research', url: 'https://www.lamresearch.com/product/eos/', status: '읽음' },
    acmSaps: { title: 'Ultra C SAPS', publisher: 'ACM Research', url: 'https://acmr.com/?p=110', status: '읽음' },
    asiaeSemes: { title: 'Semes Achieves 2,500th Unit Sold of Single-Wafer Cleaning Equipment (2025.08.01)', publisher: '아시아경제 영문판', url: 'https://www.asiae.co.kr/en/article/2025080110165761892', status: '기사 읽음' },
    patent: { title: 'US9508568B2 기판 처리 장치(세정 처리)', publisher: 'SCREEN Holdings 공개 특허 (Google Patents)', url: 'https://patents.google.com/patent/US9508568B2/en', status: '공개 특허 · 일반 구조 참고' },
  },
}
