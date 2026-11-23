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
    {
      heading: '다른 무료 출처로 더 알아보기',
      points: [
        { text: '가장 흔한 고장 원인은 재료 사이의 열팽창계수 차이로 생기는 응력이며, 언더필은 실리카를 채운 에폭시입니다.', cite: ['oa-underfill-2025'] },
        { text: '모세관 방식은 칩 한 변에 바늘로 바르고, 잘 흘러 들어가도록 보통 70~100℃로 미리 데웁니다.', cite: ['oa-underfill-2025'] },
        { text: '몰딩과 동시에 채우면 수지가 다이 둘레의 넓은 길로 먼저 흘러 뒤에서 만나 다이 밑에 공기를 가둘 수 있어, 진공 몰딩으로 줄입니다.', cite: ['oa-underfill-2025'] },
      ],
    },
  ],
  gaps: [
    '언더필 재료의 구체적 성분과 굳히는 조건은 위 출처에서 확인하지 못했습니다.',
  ],
}
