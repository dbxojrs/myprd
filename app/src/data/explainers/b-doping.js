// 반도체 기초: 도핑 자세한 설명. 원문을 옮기지 않고 풀어 썼습니다. (검수 전)
export default {
  id: 'b-doping',
  reviewed: false,
  checked: '2026-11-23',
  analogy: null,
  easy: [
    { text: '순수한 반도체에 불순물을 조금 넣으면 전기가 통합니다.', cite: ['samsung-easy-3', 'samsung-transistor-principle'] },
    { text: '전자 5개짜리 원소를 넣으면 전자가 남아 n형이 됩니다.', cite: ['samsung-transistor-principle'] },
    { text: '전자 3개짜리 원소를 넣으면 빈 자리(정공)가 생겨 p형이 됩니다.', cite: ['samsung-easy-3', 'samsung-transistor-principle'] },
  ],
  sections: [
    {
      heading: 'n형',
      points: [
        { text: '최외각 전자가 5개인 인(P)·비소(As)를 넣으면 결합하고도 전자 하나가 남고, 이 자유 전자가 전류를 나릅니다.', cite: ['samsung-transistor-principle', 'samsung-term-zip'] },
        { text: 'n형은 전자 수를 늘린 반도체입니다.', cite: ['samsung-term-zip'] },
      ],
    },
    {
      heading: 'p형',
      points: [
        { text: '최외각 전자가 3개인 붕소(B)를 넣으면 전자가 비어 있는 자리(정공)가 생기고, 정공이 움직이며 전류가 흐릅니다.', cite: ['samsung-easy-3', 'samsung-transistor-principle'] },
        { text: 'p형은 정공 수를 늘린 반도체입니다.', cite: ['samsung-term-zip'] },
      ],
    },
    {
      heading: '공정에서는',
      points: [
        { text: '15족 원소(인·비소)를 넣으면 n형, 13족 원소(붕소)를 넣으면 p형이 됩니다. 예전 표기로는 5족·3족이라고도 합니다.', cite: ['samsung-8-6', 'samsung-transistor-principle'] },
        { text: '넣는 양으로 전기가 통하는 정도를 조절하며, 대표적인 방법은 불순물을 이온 상태로 원하는 깊이까지 고르게 넣는 이온 주입입니다.', cite: ['samsung-easy-3', 'samsung-easy-2', 'samsung-8-6'] },
      ],
    },
    {
      heading: '다른 무료 출처로 더 알아보기',
      points: [
        { text: '도너는 원자가 전자 5개인 V족 원소(인·비소·안티몬)로, 다섯 번째 전자를 내주고 움직이지 않는 양이온(+)으로 남습니다.', cite: ['mit-6012-l2'] },
        { text: '억셉터는 원자가 전자 3개인 III족 원소(붕소)로, 이웃 전자를 받아들여 정공을 만들고 움직이지 않는 음이온(−)이 됩니다.', cite: ['mit-6012-l2'] },
        { text: '도핑 농도가 순수 상태보다 훨씬 크면 도핑이 캐리어 수를 정합니다. 보통 1cm³에 10¹⁵~10²⁰개를 넣습니다.', cite: ['mit-6012-l2'] },
        { text: 'n형에서는 전자가 다수 캐리어, 정공이 소수 캐리어이고 p형은 그 반대입니다.', cite: ['mit-6012-l2'] },
      ],
    },
  ],
  gaps: [
  ],
}
