// 웨이퍼 쏘잉(다이싱) 자세한 설명. 원문을 옮기지 않고 풀어 썼습니다. (검수 전)
export default {
  id: 'wafer-saw',
  reviewed: false,
  checked: '2026-11-23',
  analogy: null,
  easy: [
    { text: '웨이퍼를 테이프에 붙여 고정합니다.', cite: ['hynix-be-6', 'hynix-be-9'] },
    { text: '칩 사이의 길(스크라이브 라인)을 따라 블레이드나 레이저로 자릅니다.', cite: ['samsung-8-9', 'hynix-be-6'] },
    { text: '칩이 하나하나 나뉘어 테이프 위에 남습니다.', cite: ['samsung-8-9'] },
  ],
  sections: [
    {
      heading: '블레이드 다이싱',
      points: [
        { text: '다이아몬드 입자로 강화한 바퀴 모양 날로 자릅니다.', cite: ['hynix-be-6'] },
        { text: '날이 지나갈 여유가 필요해서 스크라이브 라인은 날보다 넓어야 합니다.', cite: ['hynix-be-6'] },
        { text: '날이 웨이퍼에 직접 닿아, 얇은 웨이퍼는 깨질 위험이 있습니다.', cite: ['hynix-be-6'] },
        { text: '얇은 웨이퍼는 고운 입자의 블레이드를 쓰면 뒷면이 덜 깨집니다.', cite: ['disco-dicing-thin-wafers'] },
        { text: '자른 면의 상태(칩핑 등)가 칩의 강도에 영향을 줍니다.', cite: ['disco-tr16-03'] },
      ],
    },
    {
      heading: '레이저 다이싱과 DBG',
      points: [
        { text: '레이저 다이싱은 웨이퍼에 닿지 않고 잘라 얇은 웨이퍼에 알맞습니다.', cite: ['hynix-be-6'] },
        { text: '스텔스 다이싱은 레이저로 웨이퍼 안쪽에 금을 낸 뒤 테이프를 늘려 쪼갭니다.', cite: ['hynix-be-6'] },
        { text: 'DBG(갈기 전 자르기)는 웨이퍼를 미리 일부만 잘라 두고, 백그라인딩 뒤 테이프를 늘려 완전히 나눕니다.', cite: ['hynix-be-6'] },
      ],
    },
    {
      heading: '테이프',
      points: [
        { text: '다이싱(마운팅) 테이프는 링 프레임에 웨이퍼를 붙잡아 둡니다. 자를 때는 강하게 붙어 있고, 자외선을 쬐면 접착력이 약해져 칩을 떼어 내기 쉬워집니다.', cite: ['hynix-be-9', 'hynix-be-6'] },
      ],
    },
  ],
  gaps: [
    '블레이드 회전수, 냉각수 양, 커프 폭 숫자는 위 출처에서 확인하지 못했습니다.',
  ],
}
