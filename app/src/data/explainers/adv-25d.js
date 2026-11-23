// 첨단 패키지: 2.5D 패키지 자세한 설명. 원문을 옮기지 않고 풀어 썼습니다. (검수 전)
export default {
  id: 'adv-25d',
  reviewed: false,
  checked: '2026-11-23',
  analogy: null,
  easy: [
    { text: '패키지 기판 위에 실리콘 인터포저를 올립니다.', cite: ['hynix-be-4', 'samsung-pkg-engineer'] },
    { text: '인터포저 위에 로직 칩과 HBM을 나란히 붙입니다.', cite: ['hynix-be-4', 'samsung-pkg-engineer'] },
    { text: '인터포저의 가는 배선으로 칩끼리 짧게 이어집니다.', cite: ['hynix-be-4'] },
  ],
  sections: [
    {
      heading: '구조',
      points: [
        { text: '2.5D 패키지는 인터포저 위에 여러 칩을 나란히 배치하는 방식입니다.', cite: ['samsung-pkg-engineer', 'hynix-be-4'] },
        { text: '인터포저 안의 관통 전극(TSV)이 위의 칩과 아래 기판을 이어 줍니다.', cite: ['hynix-be-4', 'oa-tsv-bump-2023'] },
        { text: 'HBM과 로직 칩을 인터포저 위에 함께 두는 구성이 대표적입니다.', cite: ['hynix-be-4'] },
      ],
    },
    {
      heading: '필요한 기술',
      points: [
        { text: '칩과 인터포저는 아주 작은 범프(마이크로 범프)로 연결하고, 틈은 언더필로 보호합니다.', cite: ['hynix-be-4', 'hynix-be-6'] },
        { text: '범프 아래 금속층(UBM)과 범프는 도금으로 만듭니다.', cite: ['hynix-be-7', 'hynix-be-8'] },
      ],
    },
  ],
  gaps: [
    '인터포저 크기·배선 폭 같은 숫자와 회사별 제품 이름은 이 설명에서 다루지 않았습니다.',
  ],
}
