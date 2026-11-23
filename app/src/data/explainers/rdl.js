// RDL(재배선) 자세한 설명. 원문을 옮기지 않고 풀어 썼습니다. (검수 전)
export default {
  id: 'rdl',
  reviewed: false,
  checked: '2026-11-23',
  analogy: null,
  easy: [
    { text: '칩 위에 금속 길을 한 층 더 깝니다.', cite: ['hynix-be-3'] },
    { text: '패드를 원하는 자리로 옮깁니다.', cite: ['hynix-be-3', 'hynix-be-8'] },
    { text: '옮긴 자리에 범프·볼을 달거나 와이어를 잇습니다.', cite: ['hynix-be-8'] },
  ],
  sections: [
    {
      heading: '무엇을 하나',
      points: [
        { text: '금속층을 추가해 패드를 새 위치(예: 가운데 → 가장자리)로 옮깁니다.', cite: ['hynix-be-3', 'hynix-be-8'] },
        { text: '와이어 본딩이 잘 되도록 옮긴 패드에 금을 도금하기도 합니다.', cite: ['hynix-be-8'] },
      ],
    },
    {
      heading: '만드는 방법',
      points: [
        { text: '포토, 스퍼터, 도금, 감광액 제거, 금속 식각의 다섯 가지 공정을 공통으로 씁니다.', cite: ['hynix-be-7'] },
        { text: '재배선 금속에는 잘 붙게 하는 층과 전류를 흘리는 층만 씁니다.', cite: ['hynix-be-7'] },
      ],
    },
    {
      heading: '어디에 쓰나',
      points: [
        { text: '삼성전자는 재배선 기반의 2.5D·3D 첨단 패키지 기술에 집중하고 있다고 소개합니다.', cite: ['samsung-advanced-pkg'] },
        { text: '칩을 받침에 다시 배치하고 몰딩해 만든 웨이퍼 위에 배선을 넓게 펼치는 팬아웃 패키지에도 쓰입니다.', cite: ['hynix-be-3', 'hynix-be-8'] },
      ],
    },
  ],
  gaps: [
    '재배선 선폭·층 수 숫자는 위 출처에서 확인하지 못했습니다.',
  ],
}
