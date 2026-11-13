// 와이어 본더 장비 소개·조작 순서·결과물 데이터. 형식은 data/equipment/index.js 머리 주석을 보세요.
// 근거: review/equipment-back.md 4장. 장비사·뉴스룸 자료는 모두 "설명 출처"입니다. 모두 검수 전입니다.
// 논문 수치(70 mW, 0.60 N 등)는 특정 와이어·장비 조건의 결과라 일반 기준값으로 쓰지 않습니다.

export default {
  id: 'wire-bond',
  reviewed: false,
  kind: { ko: '볼 본더 (열초음파 와이어 본더)', en: 'Ball Bonder (Thermosonic Wire Bonder)' },
  summary:
    '세라믹 캐필러리(Capillary)로 금이나 구리 와이어를 안내하며, 와이어 끝에 전기 불꽃(EFO)으로 볼(FAB)을 만들어 칩 패드에 열·압력·초음파로 붙이고(1st 본드), 루프를 그려 리드프레임이나 기판에 스티치로 붙이는(2nd 본드) 장비입니다.',
  vendors: [
    { name: 'Kulicke & Soffa (K&S)', products: 'Ball Bonder 제품군', note: '"볼 본더 기술의 시장 선도 기업"이라고 자사 페이지에서 소개(회사 주장). 공정 소프트웨어 ProCu, ProStitch Plus, AutoOLP 등', src: 'ksBonder' },
    { name: 'ASMPT', products: 'AERO PRO · AERO 시리즈', note: 'X-POWER(AEROducer 트랜스듀서), AEROEYE 공정 모니터링, Al·Pd·Cu 와이어 대응', src: 'asmptWb' },
  ],
  vendorNote: '삼성전자·SK하이닉스가 어떤 와이어 본더를 쓰는지는 공식 페이지에서 확인하지 못했습니다. 히트 블록, 윈도 클램프, 매거진 핸들러, 인덱서 레일 같은 반송부와 NSOP 같은 장비 알람 용어는 허용 출처에서 확인하지 못해 그림에는 "스트립"만 단순하게 그렸습니다.',
  modules: [
    { id: 'bondhead', name: { ko: '본드 헤드 · 트랜스듀서', en: 'Bond Head / Transducer' }, desc: '캐필러리를 위아래로 움직이며 누르고, 트랜스듀서가 초음파 진동을 줍니다. ASMPT X-POWER는 테이블을 문지르지 않고 본딩합니다.', src: 'asmptWb' },
    { id: 'capillary', name: { ko: '캐필러리', en: 'Capillary' }, desc: '가운데 구멍으로 와이어를 안내하고 끝으로 볼과 스티치를 눌러 붙이는 세라믹 툴입니다.', src: 'ksBonding' },
    { id: 'efo', name: { ko: 'EFO', en: 'Electronic Flame-Off' }, desc: '전기 불꽃으로 와이어 끝을 녹여 둥근 볼(FAB)을 만듭니다. 전류와 시간이 볼 모양을 정합니다.', src: 'pmc' },
    { id: 'spool', name: { ko: '와이어 공급', en: 'Wire Feed' }, desc: '금(Au)이나 구리(Cu) 와이어가 캐필러리로 풀려 나옵니다.', src: 'ksBonding' },
    { id: 'heat', name: { ko: '가열부', en: 'Heating' }, desc: '본딩 자리를 데워 열·압력·초음파가 함께 작용하게 합니다. 참고 논문은 220 °C로 실험했습니다.', src: 'pmc' },
    { id: 'strip', name: { ko: '스트립 (다이 + 리드프레임)', en: 'Strip' }, desc: '다이 어태치를 마친 스트립입니다. 칩 패드와 리드가 와이어로 이어집니다.', src: 'skhynix6' },
  ],
  operation: [
    { id: 'load', who: '작업자', at: 'strip', lot: 'strip', title: '스트립 투입 · 본딩 프로그램 선택', desc: '다이 어태치를 마친 스트립을 넣고 본딩 프로그램(레시피)을 고릅니다. (투입·얼라인의 장비별 세부 절차는 허용 출처에서 확인하지 못했습니다.)', src: 'general' },
    { id: 'efo', who: '장비', at: 'efo', lot: 'capillary', title: 'EFO → FAB 형성', desc: '와이어 끝에 전기 불꽃을 튀겨 녹인 뒤 둥근 볼(FAB, Free Air Ball)을 만듭니다.', terms: ['efo'], src: 'pmc' },
    { id: 'ball', who: '장비', at: 'capillary', lot: 'strip', title: '1st 본드 (볼 본드)', desc: '캐필러리가 볼을 칩 패드에 내려 열·압력·초음파로 붙입니다.', terms: ['firstBond', 'usg'], src: 'ksBonding' },
    { id: 'loop', who: '장비', at: 'bondhead', lot: 'strip', title: '루프 형성', desc: '캐필러리가 와이어를 풀며 올라갔다가 리드 쪽으로 움직여 와이어 고리(루프)를 그립니다.', terms: ['loop'], src: 'ksBonding' },
    { id: 'stitch', who: '장비', at: 'capillary', lot: 'strip', title: '2nd 본드 (스티치)', desc: '리드나 기판 위에 와이어를 눌러 스티치(웨지) 본드를 만듭니다.', terms: ['stitch'], src: 'pmc' },
    { id: 'tail', who: '장비', at: 'capillary', lot: 'capillary', title: '테일 남기고 끊기', desc: '다음 볼을 만들 만큼 와이어 꼬리(테일)를 남기고 끊습니다. 참고 논문의 테일 길이는 0.15 mm였습니다.', terms: ['tail'], src: 'pmc' },
    { id: 'next', who: '장비', at: 'bondhead', lot: 'strip', title: '다음 와이어 반복', desc: '같은 순서로 다음 패드와 리드를 잇습니다.', src: 'skhynix6' },
    { id: 'test', who: '작업자', at: 'strip', lot: 'strip', title: '시어·풀 테스트로 확인', desc: '볼 시어 테스트와 와이어 풀 테스트로 접합 강도를 확인하고, 필요하면 SEM으로 단면을 봅니다.', terms: ['shearPull'], src: 'pmc' },
  ],
  outputs: {
    product: '칩 패드와 리드가 와이어로 이어진 스트립',
    metrics: ['볼 시어 강도', '와이어 풀 강도', '볼·스티치 모양', '넥 크랙 여부'],
    notes: [
      { text: '초음파 파워와 본드 포스가 지나치면 넥 크랙, 볼 오버플로, 패드 변형이 생기고, 부족하면 접합 강도가 낮아집니다.', src: 'pmc' },
      { text: '금 와이어 외에 Al·Pd·Cu 와이어에 대응하는 장비도 있습니다.', src: 'asmptWb' },
    ],
  },
  terms: [
    { id: 'efo', ko: 'EFO · FAB', en: 'Electronic Flame-Off / Free Air Ball', short: '전기 불꽃으로 와이어 끝에 만든 볼', deep: 'EFO 전류와 시간이 볼(FAB)의 크기와 모양을 정합니다. 참고 논문에서는 0.030 A, 0.8 ms가 최적이었지만 특정 와이어 기준이라 일반값은 아닙니다.', src: 'pmc' },
    { id: 'firstBond', ko: '1st 본드 (볼 본드)', en: 'First Bond / Ball Bond', short: '칩 패드 위에 볼을 눌러 붙이는 첫 접합', deep: '열·압력·초음파를 함께 써서 볼을 패드에 먼저 붙입니다. 그 뒤 와이어를 루프시켜 리드나 기판으로 잇습니다.', src: 'ksBonding' },
    { id: 'usg', ko: 'USG 파워 · 본드 포스', en: 'Ultrasonic Power / Bond Force', short: '초음파 세기와 누르는 힘', deep: '본딩 시간, 온도와 함께 가장 중요한 조건입니다. 참고 논문의 볼 본드 최적값은 70 mW, 0.60 N, 웨지 본드는 95 mW, 0.85 N이었으나 특정 와이어 기준입니다.', src: 'pmc' },
    { id: 'loop', ko: '루프 · 루프 하이트', en: 'Loop / Loop Height', short: '1st와 2nd 본드 사이 와이어 고리와 그 높이', deep: '1st 본드 뒤 와이어를 루프시켜 리드프레임이나 기판으로 잇습니다. K&S는 루프 모양을 다루는 공정 소프트웨어(ProCu Loop 등)를 제공합니다.', src: 'ksBonding' },
    { id: 'stitch', ko: '2nd 본드 (스티치)', en: 'Second Bond / Stitch Bond', short: '리드 위에 와이어를 눌러 붙이는 두 번째 접합', deep: '리드나 기판 위에 만드는 두 번째 접합으로, 스티치 또는 웨지 본드라고 부릅니다. 참고 논문은 웨지 본드 조건을 볼 본드와 따로 최적화했습니다.', src: 'pmc' },
    { id: 'tail', ko: '테일', en: 'Tail', short: '다음 볼을 만들 와이어 꼬리', deep: '2nd 본드 뒤 와이어를 끊을 때 다음 EFO에 쓸 꼬리를 남깁니다. 테일이 없으면 다음 볼을 만들 수 없습니다.', src: 'pmc' },
    { id: 'shearPull', ko: '볼 시어 · 와이어 풀 테스트', en: 'Ball Shear / Wire Pull Test', short: '접합 강도를 확인하는 기계 시험', deep: '볼을 옆에서 밀어 떨어지는 힘(시어)과 와이어를 당겨 끊어지는 힘(풀)을 재서 접합이 충분한지 봅니다.', src: 'pmc' },
    { id: 'neck', ko: '넥 크랙', en: 'Neck Crack', short: '볼 바로 위 와이어 목 부분의 균열', deep: '파워와 포스가 지나치면 볼과 와이어가 만나는 목 부분에 균열이 생길 수 있습니다.', src: 'pmc' },
  ],
  sources: {
    ksBonder: { title: 'Ball Bonder', publisher: 'Kulicke & Soffa', url: 'https://www.kns.com/products-services/ball-bonder', status: '읽음' },
    ksBonding: { title: 'Ball Bonding', publisher: 'Kulicke & Soffa', url: 'https://www.kns.com/products-services/ball-bonding', status: '읽음' },
    asmptWb: { title: 'Ball Bonding (AERO)', publisher: 'ASMPT', url: 'https://semi.asmpt.com/en/products/icd/wb/ball-bonding', status: '읽음' },
    pmc: { title: 'Cao et al., Micromachines 2020, 11(8):777 (CC BY)', publisher: 'PMC 오픈액세스 논문', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7465270/', status: '읽음' },
    skhynix6: { title: 'Semiconductor Back-End Process Episode 6: Conventional Packages', publisher: 'SK hynix Newsroom', url: 'https://news.skhynix.com/semiconductor-back-end-process-episode-6-conventional-packages/', status: '읽음' },
    general: { title: '일반 작업 흐름 (장비사 원문 미확인)', publisher: '—', url: '', status: '출처 미확인 · 검수 전' },
  },
}
