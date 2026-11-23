// 증착 공정 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/deposition.jsx (검수 전)
export default {
  id: 'deposition',
  title: '증착: 원자 수준의 얇은 막 입히기',
  reviewed: false,
  scenes: [
    {
      id: 'layers',
      title: '얇은 막을 층층이',
      beats: [
        { text: '증착은 분자나 원자 크기 수준의 아주 얇은 막(박막, 1μm 이하)을 웨이퍼 위에 입히는 공정입니다.', cite: ['samsung-8-6'] },
        { text: '칩은 막을 입히고, 그리고, 깎고, 씻는 일을 되풀이해 쌓은 고층 건물 같은 구조입니다.', cite: ['samsung-8-6'] },
      ],
    },
    {
      id: 'cvd',
      title: 'CVD: 가스의 화학 반응으로',
      beats: [
        { text: '화학기상증착(CVD)은 가스를 흘려 화학 반응을 일으키고, 그 결과물이 표면에 쌓여 막이 됩니다.', cite: ['samsung-8-6', 'hynix-fe-5'] },
        { text: '플라즈마를 쓰는 CVD는 낮은 온도에서도 고르게 막을 만들 수 있어 많이 쓰입니다.', cite: ['samsung-8-6'] },
        { text: 'CVD는 빠르고 턱진 곳도 잘 덮지만, 부산물 때문에 불순물이 섞일 수 있습니다.', cite: ['hynix-fe-5'] },
      ],
    },
    {
      id: 'pvd',
      title: 'PVD(스퍼터링): 원자를 떼어 붙이기',
      beats: [
        { text: '물리기상증착(PVD)은 화학 반응 없이 막을 입힙니다. 대표 방식인 스퍼터링은 이온이 금속 판(타깃)을 때려 원자를 떼어 냅니다.', cite: ['samsung-8-6', 'hynix-fe-5'] },
        { text: '떨어져 나온 원자가 웨이퍼에 쌓여 금속막이 됩니다. 부산물이 없어 막이 깨끗합니다.', cite: ['samsung-8-6', 'hynix-fe-5'] },
      ],
    },
    {
      id: 'ald',
      title: 'ALD: 원자 한 층씩',
      beats: [
        { text: '원자층 증착(ALD)은 두 가지 재료를 번갈아 넣어, 한 번에 원자 한 층씩 쌓습니다.', cite: ['hynix-fe-5'] },
        { text: '두께를 아주 정확히 맞출 수 있고 고르지만, 속도가 느립니다.', cite: ['hynix-fe-5'] },
        { text: '깊은 홈의 옆벽과 바닥까지 같은 두께로 덮는 능력(단차 피복)이 뛰어나 DRAM 커패시터처럼 깊은 구조에 씁니다.', cite: ['hynix-fe-5'] },
      ],
    },
  ],
}
