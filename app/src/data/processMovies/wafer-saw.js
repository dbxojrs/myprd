// 웨이퍼 쏘잉(다이싱) 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/wafer-saw.jsx (검수 전)
export default {
  id: 'wafer-saw',
  title: '웨이퍼 쏘잉: 웨이퍼를 칩 하나하나로 자르기',
  reviewed: false,
  scenes: [
    {
      id: 'mount',
      title: '테이프에 붙여 고정',
      beats: [
        { text: '웨이퍼는 링 프레임에 고정된 테이프(다이싱·마운팅 테이프)에 붙어 있습니다. 자를 때는 칩을 단단히 잡아 줍니다.', cite: ['hynix-be-9', 'hynix-be-6'] },
        { text: '웨이퍼에는 칩 사이마다 자를 길(스크라이브 라인)이 나 있습니다.', cite: ['samsung-8-9', 'samsung-8-1'] },
      ],
    },
    {
      id: 'blade',
      title: '블레이드로 자르기',
      beats: [
        { text: '스크라이브 라인을 따라 다이아몬드 톱(블레이드)이나 레이저로 웨이퍼를 자릅니다.', cite: ['samsung-8-9'] },
        { text: '블레이드는 다이아몬드 입자로 강화한 바퀴 모양 날입니다. 날이 지나갈 여유가 있도록 스크라이브 라인은 날보다 넓어야 합니다.', cite: ['hynix-be-6'] },
        { text: '날이 웨이퍼에 직접 닿기 때문에 얇은 웨이퍼는 깨질 위험이 있습니다. 고운 입자의 블레이드를 쓰면 뒷면이 덜 깨집니다.', cite: ['hynix-be-6', 'disco-dicing-thin-wafers'] },
      ],
    },
    {
      id: 'laser',
      title: '레이저로 자르기',
      beats: [
        { text: '레이저 다이싱은 웨이퍼에 닿지 않고 잘라서 얇은 웨이퍼에 알맞습니다.', cite: ['hynix-be-6', 'samsung-8-9'] },
        { text: '스텔스 다이싱은 레이저로 웨이퍼 안쪽에 금을 낸 뒤, 테이프를 사방으로 늘려 칩을 떼어 냅니다.', cite: ['hynix-be-6'] },
      ],
    },
    {
      id: 'result',
      title: '칩 하나하나로',
      beats: [
        { text: '자르고 나면 칩(다이)이 하나씩 나뉘어 테이프 위에 남습니다.', cite: ['samsung-8-9'] },
        { text: '자른 면의 모서리가 깨지는 칩핑이 생기면 칩의 강도가 떨어질 수 있습니다.', cite: ['disco-tr16-03'] },
      ],
    },
  ],
}
