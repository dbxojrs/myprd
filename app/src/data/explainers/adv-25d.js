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
    {
      heading: '더 알아보기: 실제 제품과 회사 발표',
      points: [
        { text: 'HBM은 완성품이 아니라 반쯤 패키징된 제품이라, 이를 받은 회사가 인터포저 위에 로직 칩과 나란히 놓아 2.5D 패키지를 만듭니다.', cite: ['hynix-be-4'] },
        { text: '일반 기판으로는 HBM과 로직의 수많은 단자를 모두 받을 수 없어, 패드와 배선이 촘촘한 인터포저를 거쳐 기판에 연결합니다.', cite: ['hynix-be-4'] },
        { text: '삼성전자 I-Cube4는 실리콘 인터포저 위에 로직과 HBM 4개를 올린 구조로, 100μm 수준의 아주 얇은 인터포저가 휘지 않게 만들고 몰드 없는 구조로 열을 빼냅니다.', cite: ['samsung-icube4'] },
        { text: '삼성전자 2.5D Cube-S는 큰 실리콘 인터포저 위에 로직과 최대 8개의 HBM을 함께 올립니다.', cite: ['samsung-foundry-ahi'] },
      ],
    },
  ],
  gaps: [
    '인터포저 크기·배선 폭 같은 숫자와 회사별 제품 이름은 이 설명에서 다루지 않았습니다.',
  ],
}
