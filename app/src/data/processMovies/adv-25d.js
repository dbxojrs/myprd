// 첨단 패키지 영상 자막. 문장마다 출처 키. 그림: components/movie/scenes/adv-25d.jsx (검수 전)
export default {
  id: 'adv-25d',
  title: '2.5D 패키지: 인터포저 위에 칩을 나란히',
  reviewed: false,
  scenes: [
    {
      id: 'build',
      title: '아래에서 위로 쌓기',
      beats: [
        { text: '맨 아래는 바깥 단자(솔더볼)가 달린 패키지 기판입니다.', cite: ['hynix-be-3', 'hynix-be-9'] },
        { text: '그 위에 실리콘 받침인 인터포저를 올립니다. 인터포저 안에는 위아래를 잇는 관통 전극(TSV)이 있습니다.', cite: ['hynix-be-4', 'samsung-pkg-engineer'] },
        { text: '인터포저 위에 GPU 같은 로직 칩과 HBM 메모리를 나란히, 아주 작은 범프로 붙입니다.', cite: ['hynix-be-4', 'samsung-pkg-engineer'] },
      ],
    },
    {
      id: 'paths',
      title: '왜 이렇게 하나',
      beats: [
        { text: '인터포저 위의 아주 가는 배선으로 칩끼리 짧고 촘촘하게 이을 수 있습니다.', cite: ['hynix-be-4'] },
        { text: '그래서 메모리와 로직 사이에 많은 데이터를 빠르게 주고받을 수 있어, AI 가속기·GPU에 쓰입니다.', cite: ['hynix-be-4', 'hynix-hbm-packaging'] },
      ],
    },
  ],
}
