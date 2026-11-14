// 이온 주입기 장비 소개·조작 순서·결과물 데이터. 형식은 data/equipment/index.js 머리 주석을 보세요.
// 근거: review/equipment-front.md 0·5장. 장비 구조 그림 설명은 Rubin & Poate(2003, Axcelis 저자) 자료라 지금 장비와 다를 수 있습니다.
// 장비사·뉴스룸 자료는 모두 "설명 출처"입니다. 모두 검수 전입니다.

export default {
  id: 'ion-implant',
  reviewed: false,
  kind: { ko: '이온 주입기 (빔라인 · 매엽 엔드 스테이션)', en: 'Ion Implanter (Beamline / Single-wafer End Station)' },
  summary:
    '이온 소스에서 불순물을 이온으로 만들고, 분석 자석으로 원하는 이온만 골라 빔라인(Beamline)에서 가속한 뒤, 엔드 스테이션의 웨이퍼에 쏘아 넣습니다. 레시피의 이온종·에너지·도즈·각도가 깊이와 농도를 정합니다.',
  vendors: [
    { name: 'Axcelis', products: 'Purion H(고전류) · M(중전류) · XE(고에너지)', note: '공통 플랫폼에 빔라인 3종, 진정한 매엽(single-wafer) 플랫폼, 최대 500 wph. Purion H6는 스캔 스폿 빔과 각도·도즈 독립 제어', src: 'axcelisH6' },
    { name: 'Applied Materials', products: 'VIISta', note: '연차보고서(10-K): 에너지·전류 전 범위를 다루는 매엽 이온주입 장비 라인', src: 'amat10k' },
  ],
  vendorNote: '삼성전자·SK하이닉스가 어떤 이온주입 장비를 쓰는지는 공식 페이지에서 확인하지 못했습니다. SK하이닉스 전공정 연재에는 이온주입 편이 없습니다.',
  modules: [
    { id: 'loadport', name: { ko: '로드포트', en: 'Load Port' }, desc: '자동 물류가 FOUP을 넣고 빼는 입구입니다. 처리량에는 이 투입·반출 시간도 들어갑니다.', src: 'rubin' },
    { id: 'loadlock', name: { ko: '로드락', en: 'Load Lock' }, desc: '웨이퍼를 대기압에서 진공의 엔드 스테이션으로 넘기는 방입니다(일반 구조, 특허 검색 요약).', src: 'patent' },
    { id: 'source', name: { ko: '이온 소스', en: 'Ion Source' }, desc: '불순물을 이온으로 만들고 슬릿이 두 개인 인출 전극(dual-slit extraction electrode)으로 끌어냅니다.', src: 'rubin' },
    { id: 'magnet', name: { ko: '분석 자석', en: 'Analyzer Magnet' }, desc: '이온 빔을 자석으로 휘게 해 질량이 맞는 원하는 이온만 골라 보냅니다.', src: 'rubin' },
    { id: 'beamline', name: { ko: '가속·감속 빔관', en: 'Acceleration / Deceleration' }, desc: '이온을 정한 에너지로 맞춥니다. 에너지가 높을수록 빔라인이 길어지고, 고에너지형은 RF 선형 가속기를 씁니다.', src: 'rubin' },
    { id: 'faraday', name: { ko: '패러데이 컵', en: 'Flag Faraday' }, desc: '빔 전류를 재는 장치입니다. 빔 셋업에서 전류와 균일도를 확인할 때 씁니다.', src: 'rubin' },
    { id: 'endstation', name: { ko: '엔드 스테이션', en: 'End Station' }, desc: '웨이퍼를 받침(플래튼)에 고정해 빔을 받는 처리 챔버입니다. 예전엔 원판에 13~17장을 돌렸지만 지금 장비사는 매엽을 강조합니다.', src: 'axcelis' },
  ],
  operation: [
    { id: 'oht', who: 'OHT', at: 'loadport', lot: 'loadport', title: 'FOUP 도착', desc: 'OHT가 FOUP을 로드포트에 내려놓습니다.', src: 'samsungFab' },
    { id: 'recipe', who: '작업자', at: 'source', lot: 'loadport', title: '레시피 선택', desc: '원하는 불순물의 농도와 깊이를 장비 설정의 도즈와 에너지로 정하고, 이온종과 각도를 고릅니다.', terms: ['dose', 'energy'], src: 'rubin' },
    { id: 'loadlock', who: '장비', at: 'loadlock', lot: 'loadlock', title: '로드락 → 엔드 스테이션', desc: '로드락에서 진공으로 바꾼 뒤 웨이퍼를 플래튼에 올립니다.', src: 'patent' },
    { id: 'setup', who: '장비', at: 'faraday', lot: 'endstation', title: '빔 셋업', desc: '빔을 켜고 패러데이로 전류와 균일도를 확인합니다.', terms: ['faraday'], src: 'axcelisH6' },
    { id: 'tilt', who: '장비', at: 'endstation', lot: 'endstation', title: '각도 맞추기', desc: '틸트·트위스트 각도를 맞춥니다. Purion은 각도와 도즈를 따로 제어합니다.', terms: ['tilt'], src: 'axcelisH6' },
    { id: 'scan', who: '장비', at: 'endstation', lot: 'endstation', title: '스캔 주입', desc: '스폿 빔이 웨이퍼를 훑으며 고르게 정한 도즈만큼 넣습니다.', src: 'axcelisH6' },
    { id: 'unload', who: '장비', at: 'loadlock', lot: 'loadlock', title: '반출 → 감광막 제거 · 어닐', desc: '웨이퍼를 꺼내 감광막을 벗기고, 고온 열처리로 결정 손상을 되돌리고 불순물을 활성화합니다.', terms: ['anneal'], src: 'rubin' },
    { id: 'measure', who: '작업자', at: 'loadport', lot: 'loadport', title: '면저항 측정', desc: '면저항으로 불순물이 제대로 들어갔는지 확인합니다(MIT 실습: Van der Pauw 구조).', terms: ['rs'], src: 'mitL2' },
  ],
  outputs: {
    product: '불순물이 들어간 도핑 영역 — 웰, 소스/드레인, 문턱 전압(Vt) 조정 영역 등. 산화막·감광막이 덮인 곳은 막아 줍니다.',
    metrics: ['도즈 균일도', '에너지(깊이)', '주입 각도', '면저항(Sheet Resistance)'],
    notes: [
      { text: '2003년 자료의 사양 예: 도즈 균일도 3σ 1.5%, 에너지 3σ 3.0%, 각도 3σ 약 1.0°.', src: 'rubin' },
      { text: '120 nm 크기의 입자도 수율을 떨어뜨릴 수 있고, 빔라인이 스퍼터링되면 금속 오염이 생깁니다.', src: 'rubin' },
      { text: '임베디드 메모리가 있는 CMOS 칩 하나에 이온주입이 35번까지 들어갈 수 있습니다(2003년).', src: 'rubin' },
    ],
  },
  terms: [
    { id: 'dose', ko: '도즈', en: 'Dose', short: '단위 면적당 넣은 이온 수', deep: '농도를 정하는 설정입니다. 공정 조건인 농도와 깊이는 장비 설정의 도즈와 에너지로 바로 지정합니다.', src: 'rubin' },
    { id: 'energy', ko: '에너지', en: 'Implant Energy (keV)', short: '이온을 가속한 세기 = 들어가는 깊이', deep: '에너지가 클수록 깊이 들어갑니다. 2003년 분류로 고전류형은 1 keV 미만~100~200 keV, 중전류형은 5–600 keV, 고에너지형은 MeV급입니다.', src: 'rubin' },
    { id: 'magnet', ko: '분석 자석', en: 'Analyzer Magnet', short: '원하는 이온만 골라내는 자석', deep: '이온 소스에서 나온 여러 이온 가운데 질량이 맞는 것만 휘어 빔라인으로 보냅니다. 고에너지형에는 70° 질량 분석 자석이 쓰였습니다.', src: 'rubin' },
    { id: 'faraday', ko: '패러데이 컵', en: 'Faraday Cup', short: '빔 전류를 재는 장치', deep: '빔을 받아 전류를 재 도즈를 확인합니다. 그림 설명에서 Flag Faraday로 나옵니다.', src: 'rubin' },
    { id: 'tilt', ko: '틸트 · 트위스트', en: 'Tilt / Twist', short: '빔에 대한 웨이퍼 기울기와 회전', deep: 'Purion H6는 각도 제어 시스템(Purion Vector)으로 주입 각도와 도즈를 따로 제어합니다.', src: 'axcelisH6' },
    { id: 'anneal', ko: '어닐', en: 'Post-implant Anneal', short: '주입 뒤 고온 열처리', deep: '이온이 부순 결정을 고온 열처리로 되돌리고 불순물을 활성화합니다. 2003년 자료는 최적 온도를 900~1,100 °C로 적었습니다.', src: 'rubin' },
    { id: 'rs', ko: '면저항', en: 'Sheet Resistance', short: '도핑된 층의 저항', deep: '도핑이 제대로 됐는지 면저항으로 확인합니다. MIT 실습은 Van der Pauw 구조로 잽니다.', src: 'mitL2' },
  ],
  sources: {
    axcelis: { title: 'Purion Ion Implantation Equipment', publisher: 'Axcelis', url: 'https://www.axcelis.com/products/purion-ion-implantation-equipment/', status: '읽음' },
    axcelisH6: { title: 'Purion H High Current', publisher: 'Axcelis', url: 'https://www.axcelis.com/products/purion-h-high-current-ion-implantation/', status: '읽음' },
    amat10k: { title: 'Form 10-K FY2012', publisher: 'Applied Materials (SEC)', url: 'https://www.sec.gov/Archives/edgar/data/0000006951/000000695112000018/amat10282012-10kdoc.htm', status: '읽음' },
    rubin: { title: 'Rubin & Poate, Ion Implantation in Silicon Technology (2003)', publisher: 'The Industrial Physicist (Axcelis 저자)', url: 'https://www.axcelis.com/wp-content/uploads/2019/02/Ion_Implantation_in_Silicon_Technology.pdf', status: 'PDF 추출 · 2003년 자료' },
    mitL2: { title: '6.152J Lecture 2', publisher: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu/courses/6-152j-micro-nano-processing-technology-fall-2005/lecture2.pdf', status: 'PDF 추출' },
    samsungFab: { title: '우리 반모 할래 7탄 (2021.04.22, FOUP·OHT·클린룸)', publisher: '삼성전자 반도체 뉴스룸', url: 'https://news.samsungsemiconductor.com/kr/', status: '읽음 · 제목으로 검색' },
    patent: { title: '로드락 구조 (미국 특허 검색 요약)', publisher: 'USPTO', url: '', status: '검색 요약 · 일반 구조 참고' },
  },
}
