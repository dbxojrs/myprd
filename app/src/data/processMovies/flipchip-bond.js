// 플립칩 본딩 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/flipchip-bond.jsx (검수 전)
export default {
  id: 'flipchip-bond',
  title: '플립칩 본딩: 칩을 뒤집어 범프로 바로 붙이기',
  reviewed: false,
  scenes: [
    {
      id: 'flip',
      title: '뒤집어 붙이기',
      beats: [
        { text: '플립칩은 와이어 대신, 칩 위의 범프로 칩과 기판을 바로 연결하는 방식입니다.', cite: ['samsung-8-9'] },
        { text: '범프가 달린 칩을 뒤집어(flip) 기판의 패드 위에 맞춰 내려놓습니다.', cite: ['samsung-8-9', 'hynix-be-3'] },
        { text: '높은 온도로 녹여 붙이거나(매스 리플로), 열과 압력을 함께 가해 붙입니다(열압착).', cite: ['hynix-be-6'] },
      ],
    },
    {
      id: 'compare',
      title: '와이어 본딩과 다른 점',
      beats: [
        { text: '와이어 본딩은 칩 가장자리 패드만 쓰지만, 플립칩은 칩 면 전체에 범프를 둘 수 있어 연결 수가 많고 신호 길이 짧습니다.', cite: ['hynix-be-3'] },
        { text: '그래서 저항이 작고 빠르며 패키지를 작게 만들 수 있어, 많은 곳에서 와이어 본딩을 대신하고 있습니다.', cite: ['samsung-8-9', 'hynix-be-3'] },
      ],
    },
  ],
}
