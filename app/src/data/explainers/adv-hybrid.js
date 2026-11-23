// 첨단 패키지: 하이브리드 본딩 자세한 설명. 원문을 옮기지 않고 풀어 썼습니다. (검수 전)
export default {
  id: 'adv-hybrid',
  reviewed: false,
  checked: '2026-11-23',
  analogy: null,
  easy: [
    { text: '범프 없이 구리와 절연막을 함께 맞붙여 잇습니다.', cite: ['oa-tsv-bump-2023', 'hynix-hybrid-note'] },
    { text: '연결 간격을 크게 줄일 수 있습니다.', cite: ['hynix-hybrid-note', 'oa-tsv-bump-2023'] },
    { text: '평평하게 → 맞대기 → 열처리 순서로 붙입니다.', cite: ['oa-tsv-bump-2023'] },
  ],
  sections: [
    {
      heading: '원리',
      points: [
        { text: '하이브리드 본딩은 금속 결합과 절연막 결합을 함께 써서 웨이퍼를 붙이고 전기도 잇습니다. 구리/산화막(Cu/SiO₂) 방식이 가장 많이 쓰입니다.', cite: ['oa-tsv-bump-2023'] },
        { text: '붙이기 전 CMP로 산화막과 구리 면을 평평하게 만듭니다.', cite: ['oa-tsv-bump-2023'] },
        { text: '상온에서 산화막끼리 먼저 붙고, 이어서 200~400℃로 열처리하면 구리가 열에 늘어나 서로 닿아 붙습니다.', cite: ['oa-tsv-bump-2023'] },
      ],
    },
    {
      heading: '왜 중요한가',
      points: [
        { text: '범프 없이 붙여 연결을 아주 촘촘하게 만들 수 있고, 정렬도 정확합니다.', cite: ['oa-tsv-bump-2023'] },
        { text: '연결 간격이 솔더 범프는 약 100μm, 마이크로 범프는 약 20μm인 데 비해, 구리-구리 하이브리드 본딩은 1μm 아래까지 줄어든다고 소개됩니다.', cite: ['hynix-hybrid-note'] },
      ],
    },
  ],
  gaps: [
  ],
}
