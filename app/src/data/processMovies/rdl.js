// RDL(재배선) 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/rdl.jsx (검수 전)
export default {
  id: 'rdl',
  title: 'RDL(재배선): 패드 자리를 옮기는 금속 길',
  reviewed: false,
  scenes: [
    {
      id: 'reroute',
      title: '패드 옮기기',
      beats: [
        { text: '칩 위에 금속층을 하나 더 깔아, 원래 패드를 새로운 위치(예: 가운데 → 가장자리)로 옮기는 것이 재배선(RDL)입니다.', cite: ['hynix-be-3', 'hynix-be-8'] },
        { text: '옮긴 자리에 범프나 볼을 달거나, 와이어 본딩이 잘 되도록 금을 도금하기도 합니다.', cite: ['hynix-be-8'] },
      ],
    },
    {
      id: 'steps',
      title: '만드는 단계',
      beats: [
        { text: '웨이퍼 레벨 패키지는 포토, 스퍼터(씨앗층), 도금, 감광액 제거, 금속 식각을 공통으로 씁니다.', cite: ['hynix-be-7'] },
        { text: '재배선 금속 아래에는 잘 붙게 하는 층과 전류를 흘려 도금하게 하는 층을 둡니다.', cite: ['hynix-be-7'] },
      ],
    },
  ],
}
