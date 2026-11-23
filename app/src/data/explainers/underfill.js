// 언더필 자세한 설명. 원문을 옮기지 않고 풀어 썼습니다. (검수 전)
export default {
  id: 'underfill',
  reviewed: false,
  checked: '2026-11-23',
  analogy: null,
  easy: [
    { text: '칩과 기판 사이의 좁은 틈을 채웁니다.', cite: ['hynix-be-10'] },
    { text: '온도 변화로 범프 접합부에 몰리는 힘을 덜어 줍니다.', cite: ['hynix-be-6'] },
    { text: '붙인 뒤 채우거나, 미리 깔고 붙입니다.', cite: ['hynix-be-10'] },
  ],
  sections: [
    {
      heading: '왜 필요한가',
      points: [
        { text: '칩과 기판은 열팽창계수가 달라 온도가 바뀌면 범프 접합부에 힘이 걸리는데, 언더필이 이를 보호합니다.', cite: ['hynix-be-6', 'hynix-be-3', 'hynix-be-10'] },
      ],
    },
    {
      heading: '방식',
      points: [
        { text: '미리 깔고 붙이는 방식: 페이스트(NCP), 필름(NCF). 웨이퍼 레벨에서는 주로 NCF를 씁니다.', cite: ['hynix-be-10', 'hynix-be-6'] },
        { text: '붙인 뒤 채우는 방식: 칩 가장자리에서 넣어 스며들게 하는 CUF, 몰딩과 동시에 채우는 MUF.', cite: ['hynix-be-10', 'hynix-be-6'] },
        { text: '칩을 쌓은 뒤 액체 보호재를 한 번에 넣어 굳히는 MR-MUF는 필름 방식보다 효율과 열 방출이 좋다고 소개됩니다.', cite: ['hynix-hbm-packaging'] },
      ],
    },
  ],
  gaps: [
    '언더필 재료의 구체적 성분과 굳히는 조건은 위 출처에서 확인하지 못했습니다.',
  ],
}
