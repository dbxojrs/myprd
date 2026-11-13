// 다이 본더 장비 소개·조작 순서·결과물 데이터. 형식은 data/equipment/index.js 머리 주석을 보세요.
// 근거: review/equipment-back.md 3장. 장비사·뉴스룸 자료는 모두 "설명 출처"입니다. 모두 검수 전입니다.

export default {
  id: 'die-attach',
  reviewed: false,
  kind: { ko: '에폭시 다이 본더', en: 'Epoxy Die Bonder' },
  summary:
    '다이싱 테이프 위의 다이를 이젝터로 밀어 올리고 콜릿(Collet)으로 집어, 에폭시를 바른 리드프레임(또는 기판) 위에 정해진 힘으로 눌러 붙이는 장비입니다. 비전으로 위치를 보정하고, 접착층 두께(BLT)와 에폭시 모양을 검사한 뒤 경화합니다.',
  vendors: [
    { name: 'ASMPT', products: 'AD832i', note: 'QFN·SOIC·SOP 같은 소형 패키지용 에폭시 다이 본더, 듀얼 디스펜싱, 그래픽 SPC 데이터', src: 'ad832i' },
    { name: 'Besi', products: 'Esec 2100 hS iXplus', note: '웨이퍼 4~12", 본드 포스 0.2~20 N, 4MP 비전·에폭시 형상 검사, 듀얼 스테이지 다이 이젝터, 매거진 핸들러 입력(MHIN) 옵션', src: 'besi2100' },
  ],
  vendorNote: '삼성전자·SK하이닉스가 어떤 다이 본더를 쓰는지는 공식 페이지에서 확인하지 못했습니다. 장비 안의 배치(웨이퍼 테이블 위치, 레일 방향 등)와 매거진 언로드 단계는 출처에서 확인하지 못해 그림은 일반 구성으로 그렸습니다.',
  modules: [
    { id: 'magazine', name: { ko: '매거진 입력', en: 'Magazine Handler Input' }, desc: '다이를 붙일 리드프레임(스트립)이 든 매거진을 넣는 곳입니다. Besi 장비에는 매거진 핸들러 입력(MHIN) 옵션이 있습니다.', src: 'besi2100' },
    { id: 'wafer', name: { ko: '웨이퍼 테이블', en: 'Wafer Table' }, desc: '다이싱 테이프 위에 다이가 붙어 있는 프레임 웨이퍼를 올려 둡니다.', src: 'asmptBlt' },
    { id: 'ejector', name: { ko: '다이 이젝터', en: 'Die Ejector' }, desc: '테이프 아래에서 핀으로 다이를 밀어 올려 테이프에서 떼어 냅니다. Besi는 두 단계로 밀어 올리는 듀얼 스테이지 이젝터를 씁니다.', src: 'besi2100' },
    { id: 'bondhead', name: { ko: '본드 헤드 · 콜릿', en: 'Bond Head / Collet' }, desc: '픽앤플레이스 암 끝의 콜릿이 다이를 진공으로 집어 기판 위로 옮기고, 정해진 본드 포스로 눌러 붙입니다.', src: 'besi2100' },
    { id: 'dispenser', name: { ko: '에폭시 디스펜서', en: 'Epoxy Dispenser' }, desc: '다이를 놓을 자리에 에폭시를 점이나 패턴으로 그려 바릅니다(싱글/듀얼).', src: 'ad832i' },
    { id: 'vision', name: { ko: '비전 카메라', en: 'Vision (Down/Up-looking)' }, desc: '위에서 보는 카메라와 아래에서 보는 카메라로 다이와 기판 위치를 맞추고 에폭시 모양을 검사합니다.', src: 'besi2100' },
    { id: 'rail', name: { ko: '기판 핸들링 레일', en: 'Leadframe Handling' }, desc: '리드프레임 스트립을 한 칸씩 옮겨 본딩 위치에 세웁니다.', src: 'ad832i' },
  ],
  operation: [
    { id: 'load', who: '작업자', at: 'magazine', lot: 'magazine', title: '매거진·웨이퍼 로드', desc: '리드프레임 매거진과 다이싱이 끝난 웨이퍼 프레임을 장비에 올립니다. (로드·레시피 선택의 장비별 세부 절차는 출처에서 확인하지 못했습니다.)', src: 'besi2100' },
    { id: 'index', who: '장비', at: 'rail', lot: 'rail', title: '스트립 인덱싱', desc: '레일이 리드프레임 스트립을 본딩 위치로 한 칸씩 보냅니다.', src: 'ad832i' },
    { id: 'dispense', who: '장비', at: 'dispenser', lot: 'rail', title: '에폭시 디스펜싱', desc: '다이를 놓을 자리에 에폭시를 점이나 연속 패턴으로 그려 바릅니다. 접착 필름(DAF)을 쓰면 이 단계가 없습니다.', terms: ['epoxyDaf'], src: 'besi2100' },
    { id: 'eject', who: '장비', at: 'ejector', lot: 'wafer', title: '이젝터로 밀어 올리기', desc: '이젝터 핀이 테이프 아래에서 다이를 밀어 올려 테이프에서 떨어지게 합니다. UV 테이프는 UV로 점착을 약하게 만든 뒤 픽업합니다.', terms: ['ejector'], src: 'skhynix6' },
    { id: 'pick', who: '장비', at: 'bondhead', lot: 'bondhead', title: '콜릿 픽업', desc: '콜릿이 다이를 진공으로 집어 올립니다. 픽업은 공압으로 세밀하게 제어합니다.', terms: ['collet'], src: 'asmptBlt' },
    { id: 'align', who: '장비', at: 'vision', lot: 'bondhead', title: '비전 위치 보정', desc: '카메라로 다이와 기판 위치를 보고 어긋난 만큼 보정합니다.', src: 'besi2100' },
    { id: 'bond', who: '장비', at: 'bondhead', lot: 'rail', title: '본딩 (본드 포스)', desc: '다이를 에폭시 위에 놓고 정해진 힘으로 눌러 붙입니다.', terms: ['force'], src: 'besi2100' },
    { id: 'inspect', who: '장비', at: 'vision', lot: 'rail', title: 'BLT·에폭시 형상 검사', desc: '접착층 두께(BLT)를 비접촉으로 재 실시간으로 보정하고, 에폭시 모양과 필렛을 비전으로 검사합니다.', terms: ['blt', 'fillet'], src: 'asmptBlt' },
    { id: 'cure', who: '작업자', at: 'rail', lot: 'magazine', title: '경화로 보내기', desc: '다이가 붙은 스트립의 에폭시를 고온에서 굳힙니다(큐어).', terms: ['cure'], src: 'asmptBlt' },
  ],
  outputs: {
    product: '다이가 접착된 리드프레임 또는 기판 스트립',
    metrics: ['BLT(접착층 두께)와 균일도', '다이 틸트·위치', '에폭시 필렛 높이·넘침', '보이드'],
    notes: [
      { text: 'BLT 불균일, 다이 틸트, 에폭시 넘침, 보이드, 필렛 높이, 다이 휨·위치 오차·크랙·배치 실패가 주요 결함입니다.', src: 'asmptBlt' },
      { text: '필름형 접착제(DAF·WBL)는 다이싱 중에는 단단히 붙어 있다가 UV를 받으면 점착이 약해져 픽업됩니다.', src: 'skhynix6' },
    ],
  },
  terms: [
    { id: 'epoxyDaf', ko: '에폭시 · DAF', en: 'Epoxy / Die Attach Film', short: '액체 접착제 · 다이 뒷면 접착 필름', deep: '액체 에폭시는 디스펜서나 스텐실 인쇄로 바르고, 필름형 접착제(DAF 또는 WBL)는 웨이퍼 뒷면에 미리 붙여 둡니다. 필름형은 적층 칩에서 선호됩니다.', src: 'skhynix6' },
    { id: 'ejector', ko: '다이 이젝터', en: 'Die Ejector', short: '테이프 아래에서 다이를 밀어 올리는 핀', deep: '테이프에 붙은 다이를 아래에서 밀어 올려 콜릿이 집기 쉽게 합니다. Besi 장비는 두 단계로 밀어 올리는 듀얼 스테이지 이젝터를 옵션으로 둡니다.', src: 'besi2100' },
    { id: 'collet', ko: '콜릿 · 픽앤플레이스', en: 'Collet / Pick & Place', short: '다이를 진공으로 집어 옮기는 끝단', deep: '본드 암 끝의 콜릿이 진공으로 다이를 집어 기판 위로 옮겨 놓습니다. 얇은 다이일수록 픽업을 공압으로 세밀하게 제어해야 합니다.', src: 'asmptBlt' },
    { id: 'force', ko: '본드 포스', en: 'Bond Force', short: '다이를 누르는 힘', deep: 'Besi Esec 2100 hS iXplus의 본드 포스 범위는 0.2~20 N입니다. 장비는 이 힘을 제어하며 누릅니다(bonding force control).', src: 'besi2100' },
    { id: 'blt', ko: 'BLT', en: 'Bond Line Thickness', short: '다이 아래 접착층의 두께', deep: '다이와 기판 사이 접착층의 두께입니다. BLT 불균일과 다이 틸트는 대표적인 다이 어태치 결함이며, ASMPT는 BLT를 비접촉으로 재고 실시간으로 보정하는 방식을 소개합니다.', src: 'asmptBlt' },
    { id: 'fillet', ko: '필렛', en: 'Fillet', short: '다이 가장자리로 밀려 나온 접착제 언덕', deep: '눌린 에폭시가 다이 옆으로 살짝 올라온 부분입니다. 필렛 높이와 에폭시 넘침(오버플로·스필)은 검사 항목입니다.', src: 'asmptBlt' },
    { id: 'void', ko: '보이드 · 틸트', en: 'Void / Die Tilt', short: '접착층 속 빈 공간 · 다이 기울어짐', deep: '접착층 안에 생긴 빈 공간을 보이드, 다이가 기울어 붙은 것을 틸트라고 합니다. 둘 다 다이 어태치의 주요 결함으로 꼽힙니다.', src: 'asmptBlt' },
    { id: 'cure', ko: '경화 (큐어)', en: 'Cure', short: '에폭시를 열로 굳히는 단계', deep: '본딩 뒤 고온에서 에폭시를 굳혀 다이를 단단히 고정합니다.', src: 'asmptBlt' },
  ],
  sources: {
    asmptBlt: { title: 'Innovative die attach solutions for advanced BLT control', publisher: 'ASMPT', url: 'https://semi.asmpt.com/en/news-center/market-insights/innovative-die-attach-solutions-for-advanced-blt-control/', status: '읽음' },
    ad832i: { title: 'AD832i Epoxy Die Attach', publisher: 'ASMPT', url: 'https://semi.asmpt.com/en/products/icd/da/epoxy-da/ad832i', status: '읽음' },
    besi2100: { title: 'Esec 2100 hS iXplus', publisher: 'Besi', url: 'https://www.besi.com/products-technology/product-details/product/esec-2100-hs-ixplus/', status: '읽음' },
    skhynix6: { title: 'Semiconductor Back-End Process Episode 6: Conventional Packages', publisher: 'SK hynix Newsroom', url: 'https://news.skhynix.com/semiconductor-back-end-process-episode-6-conventional-packages/', status: '읽음' },
  },
}
