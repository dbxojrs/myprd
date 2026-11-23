// 반도체 기초 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/b-pn.jsx (검수 전)
export default {
  id: 'b-pn',
  title: 'PN 접합과 다이오드: 한쪽으로만 흐르는 전기',
  reviewed: false,
  scenes: [
    {
      id: 'join',
      title: 'P형과 N형을 맞붙이면',
      beats: [
        { text: 'p형과 n형이 맞닿은 구조를 PN 접합이라 하며, 다이오드를 비롯한 거의 모든 반도체 소자에 들어 있습니다.', cite: ['mit-6012-l5', 'samsung-term-diode'] },
        { text: '맞닿은 경계에는 전자와 정공이 빠져나간 영역(공핍 영역)이 생기고, 그 안의 전기장이 캐리어가 더 넘어가지 못하게 막습니다.', cite: ['mit-6012-l5'] },
      ],
    },
    {
      id: 'bias',
      title: '전지를 연결하면',
      beats: [
        { text: 'p형에 +, n형에 −를 연결하면(순방향) 장벽이 낮아져, 캐리어가 반대편으로 많이 넘어가며 큰 전류가 흐릅니다.', cite: ['mit-6012-l14'] },
        { text: '이때 전류는 p형 쪽(애노드)에서 n형 쪽(캐소드)으로 흐릅니다.', cite: ['samsung-term-diode'] },
        { text: '반대로 연결하면(역방향) 공핍 영역이 넓어지고 전류가 거의 흐르지 않습니다.', cite: ['mit-6012-l14'] },
      ],
    },
    {
      id: 'rectify',
      title: '정류와 LED',
      beats: [
        { text: '이렇게 한쪽으로만 전류를 흘리는 성질을 정류라 하며, 교류를 직류로 바꾸는 데 씁니다.', cite: ['samsung-term-diode', 'hynix-101-players'] },
        { text: 'LED는 순방향으로 넣어 준 전자와 정공이 접합 부근에서 다시 만나며, 남는 에너지를 빛으로 내보냅니다.', cite: ['mit-3024-led', 'samsung-term-led'] },
      ],
    },
  ],
}
