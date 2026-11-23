// 첨단 패키지 영상 자막. 문장마다 출처 키. 그림: components/movie/scenes/adv-overview.jsx (검수 전)
export default {
  id: 'adv-overview',
  title: '첨단 패키지: 왜 필요하고, 어떤 종류가 있나',
  reviewed: false,
  scenes: [
    {
      id: 'why',
      title: '왜 필요한가',
      beats: [
        { text: '회로를 더 미세하게 만들어 성능을 올리는 방식(무어의 법칙)이 한계에 부딪히면서, 그 너머를 위한 방법으로 패키징 기술이 주목받고 있습니다.', cite: ['oa-sip-2023'] },
        { text: '여러 칩을 하나의 패키지에 가깝게 모아, 마치 하나의 시스템처럼 동작하게 하는 방식이 중요해졌습니다.', cite: ['oa-sip-2023', 'samsung-advanced-pkg'] },
      ],
    },
    {
      id: 'kinds',
      title: '대표 구조',
      beats: [
        { text: '2.5D는 받침(인터포저) 위에 칩을 나란히 놓고, 3D는 칩을 위로 쌓습니다.', cite: ['samsung-pkg-engineer', 'hynix-be-4'] },
        { text: '팬아웃은 칩 바깥까지 배선을 넓혀 단자를 늘리고, 칩렛은 큰 칩을 기능별로 나눠 만든 뒤 다시 잇습니다.', cite: ['oa-sip-2023', 'hynix-be-3'] },
      ],
    },
  ],
}
