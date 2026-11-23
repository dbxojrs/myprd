// 플립칩 본딩 자세한 설명. 원문을 옮기지 않고 풀어 썼습니다. (검수 전)
export default {
  id: 'flipchip-bond',
  reviewed: false,
  checked: '2026-11-23',
  analogy: null,
  easy: [
    { text: '칩을 뒤집어 범프로 기판에 바로 붙입니다.', cite: ['samsung-8-9'] },
    { text: '와이어 없이 연결해 길이 짧고 빠릅니다.', cite: ['samsung-8-9'] },
    { text: '칩 면 전체를 연결에 쓸 수 있습니다.', cite: ['hynix-be-3'] },
  ],
  sections: [
    {
      heading: '특징',
      points: [
        { text: '와이어보다 저항이 작고 빠르며 작은 패키지를 만들 수 있습니다.', cite: ['samsung-8-9'] },
        { text: '패드를 칩 면 전체에 둘 수 있어 연결 수가 늘고 신호 길이 짧아져, 많은 곳에서 와이어 본딩을 대신했습니다.', cite: ['hynix-be-3'] },
        { text: '플립칩 범프는 수십 μm, 웨이퍼 레벨 패키지의 볼은 수백 μm 크기로 소개됩니다.', cite: ['hynix-be-3'] },
      ],
    },
    {
      heading: '붙이는 방법과 순서',
      points: [
        { text: '높은 온도로 한꺼번에 녹여 붙이는 매스 리플로와, 열과 압력을 함께 주는 열압착 방식이 있습니다.', cite: ['hynix-be-6'] },
        { text: '범프 형성 → 백그라인딩 → 다이싱 → 플립칩 본딩·언더필 → 몰딩 → 마킹 → 볼 붙이기 → 싱귤레이션 순서로 진행합니다.', cite: ['hynix-be-8'] },
      ],
    },
  ],
  gaps: [
    '열압착의 온도·압력 숫자는 위 출처에서 확인하지 못했습니다.',
  ],
}
