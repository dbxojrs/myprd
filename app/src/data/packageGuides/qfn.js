// QFN 패키지 설명. 원문을 옮기지 않고 풀어 썼습니다. (검수 전)
export default {
  id: 'qfn',
  reviewed: false,
  checked: '2026-11-24',
  structure: [
    { text: 'QFN은 Quad Flat No-Lead의 줄임말로, 리드프레임을 쓰는 패키지입니다.', cite: ['disco-qfn', 'adt-qfn-singulation'] },
    { text: '리드프레임은 얇은 금속판을 식각하거나 찍어 내어 배선 모양을 만든 판이며, QFN에서는 주로 구리 리드프레임을 씁니다.', cite: ['hynix-be-3', 'adt-qfn-singulation'] },
    { text: '칩은 에폭시 몰딩 컴파운드(EMC) 같은 플라스틱으로 덮어 보호합니다.', cite: ['hynix-be-3'] },
    { text: '몰딩 수지에는 실리카 알갱이가 들어 있어 응력을 줄이고 판의 평평함을 지켜 줍니다.', cite: ['adt-qfn-singulation'] },
    { text: '리드프레임은 금속층이 하나뿐이고, 단자 역할을 하는 리드는 패키지 가장자리에만 둘 수 있습니다.', cite: ['hynix-be-3'] },
  ],
  flow: [
    { id: 'backgrind', note: { text: '웨이퍼 뒷면을 갈아 원하는 두께로 만듭니다. 리드프레임과 기판 패키지가 같이 거치는 앞부분입니다.', cite: ['hynix-be-6'] } },
    { id: 'wafer-saw', note: { text: '웨이퍼를 스크라이브 라인을 따라 잘라 칩으로 나눕니다.', cite: ['hynix-be-6'] } },
    { id: 'die-attach', note: { text: '좋은 칩만 골라 리드프레임 위에 붙입니다.', cite: ['hynix-be-6'] } },
    { id: 'wire-bond', note: { text: '금속 와이어로 칩과 리드프레임을 전기적으로 잇습니다.', cite: ['hynix-be-6'] } },
    { id: 'molding', note: { text: 'EMC로 칩과 와이어를 감싸 밀봉합니다.', cite: ['hynix-be-6'] } },
    { id: 'marking', note: { text: '몰딩된 표면에 레이저 등으로 제품 정보를 새깁니다.', cite: ['hynix-be-6'] } },
    { id: 'package-saw', note: { text: '여러 개가 이어진 QFN 판을 다이싱 톱으로 잘라 낱개로 나눕니다. 예전에는 라우터 같은 공구를 썼지만 지금은 다이싱 톱이 널리 쓰입니다.', cite: ['disco-qfn', 'adt-qfn-singulation'] } },
    { id: 'test', note: { text: '낱개로 나뉜 패키지는 트레이에 담겨 패키지 테스트로 넘어갑니다.', cite: ['hynix-be-6'] } },
  ],
  compare: [
    { text: '기판(BGA) 패키지는 여러 층으로 배선할 수 있고 바닥 전체에 솔더볼을 깔 수 있지만, QFN 같은 리드프레임 패키지는 금속층이 하나이고 단자가 가장자리에만 놓입니다.', cite: ['hynix-be-3'] },
    { text: '대신 리드프레임은 금속판을 찍거나 식각해 만들어 기판보다 싸므로, 아주 빠른 전기 특성이 필요 없는 제품에 여전히 많이 쓰입니다.', cite: ['hynix-be-3'] },
  ],
  sections: [
    {
      heading: '자를 때 어려운 점',
      points: [
        { text: '무른 구리와 단단하고 잘 깨지는 몰딩 수지를 한 번에 잘라야 해서, 구리 거스러미(버)와 몰딩 쪽 깨짐이 함께 문제가 됩니다.', cite: ['adt-qfn-singulation'] },
        { text: '구리를 반쯤 식각해 깎아 낸(half-etched) 리드프레임은 칼날이 자를 구리 양을 줄여 절단 품질과 칼날 수명을 좋게 합니다.', cite: ['adt-qfn-singulation'] },
        { text: '판을 테이프에 붙여 자르는 방식과, 테이프 없이 진공 지그로 잡고 자르는 방식이 있으며 대량 생산에서는 테이프 없는 방식이 흔합니다.', cite: ['adt-qfn-singulation', 'disco-qfn'] },
      ],
    },
  ],
  gaps: [
    '바닥에 드러난 방열 패드(exposed pad)의 구조와 열 방출 효과는 이번에 읽은 출처에서 확인하지 못했습니다.',
    '리드프레임 도금 재료(PPF 등)의 자세한 구성은 확인하지 못했습니다.',
  ],
}
