// 마킹 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/marking.jsx (검수 전)
export default {
  id: 'marking',
  title: '마킹: 패키지에 이름 새기기',
  reviewed: false,
  scenes: [
    {
      id: 'laser',
      title: '레이저로 새기기',
      beats: [
        { text: '몰딩된 패키지 윗면에 레이저를 비추며 움직여 글자를 새깁니다. 잉크로 찍는 방식도 있습니다.', cite: ['hynix-be-6', 'kmeps-2022-laser-marking'] },
        { text: '레이저가 검은 수지(EMC) 표면을 태워 새기며, 어두운 바탕이라 글자가 잘 보입니다.', cite: ['hynix-be-6'] },
        { text: '제품 이름, 만든 날, 일련번호 같은 정보를 새겨, 나중에 불량이 나면 추적할 수 있게 합니다.', cite: ['hynix-be-6', 'samsung-8-9-2013'] },
      ],
    },
    {
      id: 'depth',
      title: '얼마나 깊게?',
      beats: [
        { text: '패키지가 얇아질수록 새기는 깊이가 중요해집니다. 너무 깊으면 수지가 얇아져 안쪽 칩이 손상될 수 있습니다.', cite: ['kmeps-2022-laser-marking'] },
        { text: '그래서 레이저의 특성을 조절해 글자는 잘 보이면서 얕게 새기는 기술이 연구되고 있습니다.', cite: ['kmeps-2022-laser-marking'] },
      ],
    },
  ],
}
