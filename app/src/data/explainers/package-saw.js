// 패키지 쏘잉(싱귤레이션) 자세한 설명. 원문을 옮기지 않고 풀어 썼습니다. (검수 전)
export default {
  id: 'package-saw',
  reviewed: false,
  checked: '2026-11-23',
  analogy: null,
  easy: [
    { text: '여러 패키지가 한 판(스트립)에 함께 만들어집니다.', cite: ['adt-qfn-singulation', 'hynix-be-6'] },
    { text: '블레이드로 잘라 패키지 하나하나로 나눕니다.', cite: ['hynix-be-6'] },
    { text: '나뉜 패키지는 트레이에 담겨 테스트로 갑니다.', cite: ['hynix-be-6'] },
  ],
  sections: [
    {
      heading: '자르기 전: 솔더볼 붙이기(BGA)',
      points: [
        { text: 'BGA 패키지는 자르기 전에 솔더볼을 붙입니다. 패드에 플럭스를 바르고 볼을 올린 뒤 가열(리플로)해 붙이고 플럭스를 씻어 냅니다.', cite: ['hynix-be-6'] },
        { text: '솔더볼은 크기가 30~760μm이며 납이 거의 없는 무연 솔더를 주로 씁니다. 리플로는 질소 분위기에서 합니다.', cite: ['hynix-be-9'] },
        { text: 'BGA는 가장 흔한 기판형 패키지이고, 리드프레임형으로는 TSOP·QFP 등이 있습니다.', cite: ['hynix-be-3'] },
      ],
    },
    {
      heading: '자르기',
      points: [
        { text: '공정이 끝난 스트립을 블레이드로 잘라 낱개 패키지로 나눕니다.', cite: ['hynix-be-6'] },
        { text: 'QFN처럼 리드프레임으로 만든 패키지는 단단한 몰딩 수지와 무른 구리를 함께 잘라야 해서, 웨이퍼 쏘잉과 다른 블레이드와 조건을 씁니다.', cite: ['adt-qfn-singulation', 'disco-qfn'] },
        { text: '구리를 자를 때 금속이 늘어나 거스러미(버)가 생길 수 있습니다.', cite: ['disco-qfn', 'adt-qfn-singulation'] },
      ],
    },
    {
      heading: '포장',
      points: [
        { text: '완성된 패키지는 테이프앤릴이나 트레이에 담아 보냅니다.', cite: ['hynix-be-9'] },
      ],
    },
    {
      heading: '다른 무료 출처로 더 알아보기',
      points: [
        { text: '얇은 BGA 스트립은 몰딩과 후경화가 끝난 뒤 쏘잉으로 낱개 패키지로 나눕니다.', cite: ['oa-vfbga-2024'] },
      ],
    },
  ],
  gaps: [
    '레이저·펀칭으로 자르는 방식과 스트립 크기는 위 출처에서 확인하지 못했습니다.',
  ],
}
