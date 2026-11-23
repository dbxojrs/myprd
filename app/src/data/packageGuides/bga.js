// BGA 패키지 설명. 원문을 옮기지 않고 풀어 썼습니다. (검수 전)
export default {
  id: 'bga',
  reviewed: false,
  checked: '2026-11-24',
  structure: [
    { text: 'BGA는 기판(substrate)을 몸체로 쓰는 플라스틱 패키지로, 기판 패키지 중 가장 흔한 형태입니다.', cite: ['hynix-be-3'] },
    { text: '기판은 여러 겹의 필름을 쌓아 만들기 때문에 적층(laminate) 패키지라고도 부르며, 배선을 여러 층으로 깔 수 있습니다.', cite: ['hynix-be-3'] },
    { text: '단자 역할을 하는 솔더볼을 패키지 바닥 한 면 전체에 격자처럼 깔아 단자를 많이 둘 수 있습니다.', cite: ['hynix-be-3'] },
    { text: '칩은 금선이나 구리선으로 기판에 잇고, 위를 몰딩 수지로 덮습니다.', cite: ['amkor-pbga', 'hynix-be-6'] },
    { text: '솔더볼은 납이 든 것과 무연 솔더 둘 다 쓰이며, 볼 간격은 1.0~1.5mm가 표준이고 더 좁게도 만듭니다.', cite: ['amkor-pbga'] },
  ],
  flow: [
    { id: 'backgrind', note: { text: '한 칩만 담는 패키지는 보통 웨이퍼를 약 200~250µm 두께로 갑니다.', cite: ['hynix-be-6'] } },
    { id: 'wafer-saw', note: { text: '블레이드나 레이저로 웨이퍼를 칩 단위로 자릅니다.', cite: ['hynix-be-6'] } },
    { id: 'die-attach', note: { text: '웨이퍼 테스트를 통과한 칩만 떼어 접착제를 바른 기판에 붙입니다.', cite: ['hynix-be-6'] } },
    { id: 'wire-bond', note: { text: '열·압력·진동으로 와이어를 칩 패드와 기판의 본드 핑거에 붙여 잇습니다.', cite: ['hynix-be-6'] } },
    { id: 'molding', note: { text: 'EMC로 칩과 와이어를 감싸 바깥 충격과 화학적 손상에서 보호합니다.', cite: ['hynix-be-6'] } },
    { id: 'marking', note: { text: '제품 정보를 표면에 새겨, 나중에 고장 원인을 추적할 때 씁니다.', cite: ['hynix-be-6'] } },
    { name: '솔더볼 부착', note: { text: '기판 패드에 플럭스를 바르고 솔더볼을 올린 뒤, 리플로우로 녹여 붙이고 플럭스를 씻어 냅니다. 리드프레임 패키지와 갈라지는 단계입니다.', cite: ['hynix-be-6'] } },
    { id: 'package-saw', note: { text: '여러 패키지가 이어진 기판 스트립을 블레이드로 잘라 낱개로 나눕니다.', cite: ['hynix-be-6', 'amkor-pbga'] } },
    { id: 'test', note: { text: '낱개 패키지는 트레이에 담겨 패키지 테스트로 넘어갑니다.', cite: ['hynix-be-6'] } },
  ],
  compare: [
    { text: 'QFN 같은 리드프레임 패키지는 단자가 가장자리에만 있지만, BGA는 바닥 전체에 솔더볼을 깔아 단자를 더 많이 두고 패키지도 더 작게 만들 수 있습니다.', cite: ['hynix-be-3'] },
    { text: '배선이 서로 엇갈려야 할 때 기판은 다른 금속층으로 넘어갈 수 있어 전기 특성이 좋지만, 기판은 만드는 과정이 복잡해 리드프레임보다 비쌉니다.', cite: ['hynix-be-3'] },
    { text: '후공정 앞부분(백그라인딩~몰딩)은 리드프레임 패키지와 같고, 몰딩 뒤 솔더볼 부착과 싱귤레이션에서 갈라집니다.', cite: ['hynix-be-6'] },
  ],
  sections: [
    {
      heading: '솔더볼과 리플로우',
      points: [
        { text: '솔더볼은 패키지와 바깥 회로를 잇는 전기 통로이면서 기계적으로 붙잡는 역할도 합니다.', cite: ['hynix-be-6'] },
        { text: '플럭스는 리플로우 중 솔더볼 표면의 산화막과 불순물을 없애 볼이 고르게 녹게 합니다.', cite: ['hynix-be-6'] },
        { text: '녹은 솔더는 패드에 붙은 부분을 빼고는 표면 장력으로 둥근 모양을 유지한 채 다시 굳습니다.', cite: ['hynix-be-6'] },
      ],
    },
    {
      heading: '비슷한 모양: LGA',
      points: [
        { text: '솔더볼 대신 납작한 접점(랜드)을 둔 LGA도 최근 쓰입니다.', cite: ['hynix-be-3'] },
      ],
    },
    {
      heading: '휨(warpage)',
      points: [
        { text: '패키지가 휘는 원인으로는 부품 사이 열팽창계수 차이와 함께 EMC가 굳으며 줄어드는 수축도 크게 작용합니다.', cite: ['oa-vfbga-2024'] },
      ],
    },
  ],
  gaps: [
    '기판 자체를 만드는 공정(층 쌓기, 비아 뚫기)은 이번에 읽은 출처에서 다루지 않았습니다.',
    '플립칩으로 붙이는 BGA(FC-BGA)는 플립칩 항목에서 따로 설명합니다.',
  ],
}
