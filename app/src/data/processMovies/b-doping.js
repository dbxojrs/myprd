// 반도체 기초 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/b-doping.jsx (검수 전)
export default {
  id: 'b-doping',
  title: '도핑: 불순물로 전기가 통하게',
  reviewed: false,
  scenes: [
    {
      id: 'ntype',
      title: 'N형: 전자가 남는다',
      beats: [
        { text: '순수한 반도체에 불순물을 조금 넣으면 전류가 흐르게 됩니다. 이렇게 만든 반도체를 불순물(외인성) 반도체라고 합니다.', cite: ['samsung-easy-3', 'samsung-transistor-principle'] },
        { text: '최외각 전자가 5개인 인(P)이나 비소(As)를 넣으면, 이웃과 결합하고도 전자 하나가 남습니다.', cite: ['samsung-transistor-principle', 'samsung-term-zip'] },
        { text: '남는 전자는 자유롭게 움직이며 전류를 나릅니다. 이것이 n형 반도체입니다.', cite: ['samsung-transistor-principle'] },
      ],
    },
    {
      id: 'ptype',
      title: 'P형: 빈 자리가 생긴다',
      beats: [
        { text: '최외각 전자가 3개인 붕소(B)를 넣으면 결합에 전자가 하나 모자랍니다.', cite: ['samsung-easy-3', 'samsung-transistor-principle'] },
        { text: '전자가 비어 있는 자리를 정공이라 하며, 정공이 옮겨 다니며 전류가 흐릅니다.', cite: ['samsung-easy-3', 'samsung-transistor-principle'] },
        { text: '이것이 p형 반도체입니다. 공정에서는 15족 원소를 넣으면 n형, 13족 원소를 넣으면 p형이 됩니다.', cite: ['samsung-transistor-principle', 'samsung-8-6'] },
      ],
    },
    {
      id: 'blocks',
      title: '정리',
      beats: [
        { text: 'n형은 전자 수를 늘린 반도체, p형은 정공 수를 늘린 반도체입니다.', cite: ['samsung-term-zip'] },
        { text: '넣는 불순물의 양으로 전기가 통하는 정도를 조절하며, 불순물은 주로 이온 주입으로 넣습니다.', cite: ['samsung-easy-3', 'samsung-easy-2', 'samsung-8-6'] },
      ],
    },
  ],
}
