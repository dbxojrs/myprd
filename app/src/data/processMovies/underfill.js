// 언더필 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/underfill.jsx (검수 전)
export default {
  id: 'underfill',
  title: '언더필: 칩과 기판 사이 틈 채우기',
  reviewed: false,
  scenes: [
    {
      id: 'why',
      title: '왜 채우나',
      beats: [
        { text: '칩과 기판은 온도가 바뀔 때 늘어나고 줄어드는 정도(열팽창계수)가 다릅니다.', cite: ['hynix-be-6', 'hynix-be-10'] },
        { text: '그 차이 때문에 범프 접합부에 힘이 몰려, 이를 막으려고 틈을 채웁니다.', cite: ['hynix-be-6', 'hynix-be-3'] },
      ],
    },
    {
      id: 'fill',
      title: '채우는 방법',
      beats: [
        { text: '칩을 붙인 뒤 칩 가장자리에서 액체를 넣으면 틈으로 스며들어 범프를 감쌉니다(CUF).', cite: ['hynix-be-10', 'hynix-be-6'] },
        { text: '몰딩과 동시에 채우는 방식(MUF)도 있고, 미리 필름(NCF)이나 페이스트(NCP)를 깔고 붙이는 방식도 있습니다.', cite: ['hynix-be-10', 'hynix-be-6'] },
        { text: '칩을 여러 장 쌓은 뒤 액체 보호재를 한 번에 넣어 굳히는 MR-MUF는 효율과 열 방출이 좋은 방식으로 소개됩니다.', cite: ['hynix-hbm-packaging'] },
      ],
    },
  ],
}
