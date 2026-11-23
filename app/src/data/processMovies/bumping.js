// 범핑 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/bumping.jsx (검수 전)
export default {
  id: 'bumping',
  title: '범핑: 칩 위에 작은 금속 기둥(범프) 세우기',
  reviewed: false,
  scenes: [
    {
      id: 'plate',
      title: '도금으로 범프 만들기',
      beats: [
        { text: '범프는 칩을 기판에 바로 붙이기 위한 작은 금속 돌기로, 주로 금이나 솔더(주석·은 등)로 만듭니다.', cite: ['samsung-8-9'] },
        { text: '먼저 얇은 금속 씨앗층을 입히고, 그 위에 두꺼운 감광액(약 30~100μm)을 발라 범프 자리에 구멍을 냅니다.', cite: ['hynix-be-8', 'hynix-be-7'] },
        { text: '전기 도금으로 구멍을 금속으로 채운 뒤, 감광액을 벗기고 드러난 씨앗층을 식각해 없앱니다.', cite: ['hynix-be-8'] },
      ],
    },
    {
      id: 'reflow',
      title: '가열해 둥글게',
      beats: [
        { text: '가열(리플로)하면 솔더가 녹아 둥근 범프가 됩니다.', cite: ['hynix-be-8'] },
        { text: '둥글어지면서 범프 높이가 고르게 되고 표면의 산화막도 없어집니다. 구리 기둥 위에 솔더를 얹은 구리 필러 범프도 씁니다.', cite: ['hynix-be-8'] },
      ],
    },
  ],
}
