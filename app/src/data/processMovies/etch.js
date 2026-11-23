// 식각 공정 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/etch.jsx (검수 전)
export default {
  id: 'etch',
  title: '식각: 필요 없는 막을 깎아 무늬 완성하기',
  reviewed: false,
  scenes: [
    {
      id: 'intro',
      title: '무엇을 깎나',
      beats: [
        { text: '포토 공정으로 그린 감광액 무늬가 남길 부분을 덮고 있습니다. 덮이지 않은 막이 깎아 낼 부분입니다.', cite: ['samsung-8-5', 'hynix-fe-4'] },
        { text: '동판에 그림을 새기는 판화처럼, 덮이지 않은 곳만 골라 깎아 냅니다.', cite: ['samsung-8-5'] },
      ],
    },
    {
      id: 'wet',
      title: '습식 식각: 약액으로 녹이기',
      beats: [
        { text: '습식 식각은 액체 약품으로 막을 녹여 없앱니다.', cite: ['samsung-8-5', 'hynix-fe-4'] },
        { text: '액체는 모든 방향으로 깎아서(등방성), 감광액 밑까지 둥글게 파고 들어갑니다.', cite: ['hynix-fe-4'] },
        { text: '빠르고 원하는 막만 잘 골라 깎지만, 아주 미세한 무늬를 정확히 만들기는 어렵습니다.', cite: ['hynix-fe-4'] },
      ],
    },
    {
      id: 'dry',
      title: '건식 식각: 플라즈마로 깎기',
      beats: [
        { text: '건식 식각은 진공 챔버에 가스를 넣고 전기 에너지를 가해 만든 플라즈마를 씁니다.', cite: ['samsung-8-5', 'hynix-fe-4'] },
        { text: '플라즈마 속 이온이 아래로 곧게 날아와, 벽이 반듯하게 한 방향으로 깎입니다(이방성).', cite: ['hynix-fe-4'] },
        { text: '이온이 표면을 약하게 만들고 라디칼이 그 부분을 빠르게 깎는 방식(RIE)으로, 정확도와 선택성을 함께 얻습니다.', cite: ['hynix-fe-4'] },
      ],
    },
    {
      id: 'strip',
      title: '감광액 벗기기',
      beats: [
        { text: '식각이 끝나면 감광액을 벗겨 냅니다. 막에 회로 무늬가 남고, 이 과정을 층마다 반복합니다.', cite: ['samsung-8-5', 'hynix-fe-4'] },
        { text: '3D 낸드는 100층이 넘는 막을 한 번에 뚫어야 해서, 깊고 좁은 구멍을 곧게 파는 기술이 중요합니다.', cite: ['hynix-fe-4'] },
      ],
    },
  ],
}
