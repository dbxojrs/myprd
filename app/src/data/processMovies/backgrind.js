// 백그라인딩 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/backgrind.jsx (검수 전)
export default {
  id: 'backgrind',
  title: '백그라인딩: 웨이퍼 뒷면을 갈아 얇게',
  reviewed: false,
  scenes: [
    {
      id: 'tape',
      title: '앞면 보호하기',
      beats: [
        { text: '회로가 만들어진 웨이퍼는 패키지에 넣기에는 두꺼워서, 뒷면을 갈아 얇게 만듭니다. 칩 하나짜리 패키지는 보통 약 200~250μm까지 갈아냅니다.', cite: ['hynix-be-6'] },
        { text: '갈기 전에 회로가 있는 앞면에 백그라인딩 테이프를 붙여 회로를 보호합니다. 이 테이프는 나중에 자국 없이 떨어져야 합니다.', cite: ['hynix-be-6', 'hynix-be-9'] },
      ],
    },
    {
      id: 'grind',
      title: '숫돌로 갈기',
      beats: [
        { text: '숫돌 휠이 돌면서 웨이퍼 뒷면을 조금씩 갈아냅니다.', cite: ['hynix-be-6', 'disco-ultra-thin-grinding'] },
        { text: '먼저 거친 휠로 빠르게 많이 갈고, 고운 휠로 바꿔 목표 두께에 맞춥니다.', cite: ['hynix-be-6'] },
        { text: '마지막으로 고운 패드로 표면을 연마합니다. 표면이 거칠면 금이 가거나 칩이 깨지기 쉽기 때문입니다.', cite: ['hynix-be-6'] },
      ],
    },
    {
      id: 'polish',
      title: '손상층 없애기',
      beats: [
        { text: '갈아낸 면에는 응력이 남아 웨이퍼가 웃는 입 모양(스마일)으로 휘고, 얇을수록 더 심해집니다.', cite: ['hynix-be-6'] },
        { text: '그래서 뒷면에 마운팅 테이프를 붙여 링 프레임에 고정하고, 앞면 테이프를 떼어 다음 공정으로 보냅니다. 칩 두께에 따라 깨지는 힘도 달라집니다.', cite: ['hynix-be-6', 'kmeps-2011-die-strength'] },
      ],
    },
  ],
}
