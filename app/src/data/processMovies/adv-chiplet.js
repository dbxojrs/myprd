// 첨단 패키지 영상 자막. 문장마다 출처 키. 그림: components/movie/scenes/adv-chiplet.jsx (검수 전)
export default {
  id: 'adv-chiplet',
  title: '칩렛: 큰 칩을 나눠 만들고 다시 잇기',
  reviewed: false,
  scenes: [
    {
      id: 'split',
      title: '나눠 만들기',
      beats: [
        { text: '큰 칩 하나에 모든 기능을 넣는 대신, 기능별 작은 칩(칩렛)으로 나눠 만든 뒤 한 패키지 안에서 다시 잇습니다.', cite: ['oa-sip-2023', 'hynix-be-4'] },
        { text: '웨이퍼에 불량이 5개 있을 때 칩이 100개면 수율이 95%, 1,000개면 99.5%여서, 칩을 작게 나눌수록 수율이 높아집니다.', cite: ['hynix-be-4'] },
      ],
    },
    {
      id: 'connect',
      title: '다시 잇기',
      beats: [
        { text: '칩렛끼리는 기판 맨 위층에 묻은 아주 얇은 실리콘 다리(브리지)로 촘촘하게 잇기도 합니다.', cite: ['oa-sip-2023', 'samsung-foundry-ahi'] },
        { text: '여러 회사의 칩렛을 섞어 쓸 수 있도록, 패키지 안에서 칩렛끼리 잇는 방법을 정한 공개 표준 UCIe도 만들어졌습니다.', cite: ['ucie-specs'] },
      ],
    },
  ],
}
