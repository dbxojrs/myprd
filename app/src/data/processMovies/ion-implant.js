// 이온 주입 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/ion-implant.jsx (검수 전)
export default {
  id: 'ion-implant',
  title: '이온 주입: 실리콘에 전기 성질 입히기',
  reviewed: false,
  scenes: [
    {
      id: 'why',
      title: '왜 불순물을 넣나',
      beats: [
        { text: '순수한 실리콘은 전기가 잘 통하지 않습니다. 그래서 불순물을 넣어 전기가 통하는 성질을 만듭니다.', cite: ['samsung-8-6'] },
        { text: '15족 원소인 인(P)·비소(As)를 넣으면 n형, 13족 원소인 붕소(B)를 넣으면 p형 반도체가 됩니다.', cite: ['samsung-8-6'] },
      ],
    },
    {
      id: 'beam',
      title: '이온 빔으로 넣기',
      beats: [
        { text: '불순물을 이온 상태의 입자로 만들어, 원하는 깊이까지 고르게 실리콘 속에 넣습니다.', cite: ['samsung-8-6'] },
        { text: '산화막은 이온 주입 때 원하지 않는 곳으로 불순물이 들어가고 퍼지는 것을 막는 덮개 역할을 합니다.', cite: ['samsung-8-2', 'hynix-fe-2'] },
        { text: '이온이 들어간 영역이 n형 또는 p형이 되어, 트랜지스터의 전기적 성질을 만듭니다.', cite: ['samsung-8-6'] },
      ],
    },
    {
      id: 'anneal',
      title: '열처리로 되살리기',
      beats: [
        { text: '이온이 부딪히면서 실리콘 결정이 흐트러지고, 많이 넣으면 결정이 아예 무너지기도 합니다.', cite: ['mit-6152j-implant'] },
        { text: '그래서 높은 온도(예: 850℃ 이상)로 열처리해 원자를 제자리로 돌려놓고, 불순물이 전기적으로 일하게(활성화) 만듭니다.', cite: ['mit-6152j-implant'] },
      ],
    },
  ],
}