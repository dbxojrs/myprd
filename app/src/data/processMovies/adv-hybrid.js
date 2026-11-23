// 첨단 패키지 영상 자막. 문장마다 출처 키. 그림: components/movie/scenes/adv-hybrid.jsx (검수 전)
export default {
  id: 'adv-hybrid',
  title: '하이브리드 본딩: 범프 없이 구리끼리',
  reviewed: false,
  scenes: [
    {
      id: 'compare',
      title: '범프와 무엇이 다른가',
      beats: [
        { text: '보통은 솔더 범프로 칩을 잇지만, 범프 사이 간격을 줄이는 데 한계가 있습니다.', cite: ['hynix-hybrid-note'] },
        { text: '하이브리드 본딩은 범프 없이 금속(구리)과 절연막을 함께 맞붙여 연결합니다.', cite: ['oa-tsv-bump-2023', 'hynix-hybrid-note'] },
      ],
    },
    {
      id: 'process',
      title: '붙이는 방법',
      beats: [
        { text: '맞붙일 면을 아주 평평하게 만듭니다.', cite: ['oa-tsv-bump-2023', 'hynix-hybrid-note'] },
        { text: '두 칩(또는 웨이퍼)을 맞대면 절연막끼리 먼저 붙습니다.', cite: ['oa-tsv-bump-2023', 'hynix-hybrid-note'] },
        { text: '열을 가하면 구리끼리도 붙어 전기가 통하는 연결이 됩니다.', cite: ['oa-tsv-bump-2023', 'hynix-hybrid-note'] },
      ],
    },
  ],
}
