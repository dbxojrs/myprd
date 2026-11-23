// 반도체 기초 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/b-mosfet.jsx (검수 전)
export default {
  id: 'b-mosfet',
  title: 'MOSFET: 게이트 전압으로 길을 여닫기',
  reviewed: false,
  scenes: [
    {
      id: 'structure',
      title: '구조',
      beats: [
        { text: 'MOSFET은 금속(게이트)·산화막(절연)·반도체를 겹친 구조라 MOS라는 이름이 붙었습니다.', cite: ['chm-mos-1960', 'samsung-blog-scaling'] },
        { text: '게이트는 얇은 절연막을 사이에 두고 있어, 전류가 흐르는 길에 직접 닿지 않습니다.', cite: ['hynix-fe-2', 'mit-6012-l7'] },
        { text: '게이트 양쪽에는 전류가 드나드는 소스와 드레인이 있고, 그 사이가 전류가 흐르는 길(채널)입니다.', cite: ['samsung-sait-2023', 'samsung-blog-scaling', 'mit-6012-l8'] },
      ],
    },
    {
      id: 'channel',
      title: '켜지는 원리',
      beats: [
        { text: 'p형 바탕의 NMOS에서 게이트 전압을 충분히 높이면(문턱 전압 이상) 게이트 아래 표면에 얇은 전자층(반전층)이 생깁니다.', cite: ['mit-6012-l7', 'mit-6012-l8'] },
        { text: '이 전자층이 소스와 드레인을 이어 주어 전류가 흐릅니다.', cite: ['mit-6012-l8', 'samsung-gaa-2019'] },
        { text: '게이트 전압을 빼면 길이 사라져 전류가 끊깁니다. 켜짐과 꺼짐을 1과 0으로 써서 계산합니다.', cite: ['samsung-gaa-2019', 'samsung-blog-dtco'] },
      ],
    },
    {
      id: 'pair',
      title: 'NMOS와 PMOS',
      beats: [
        { text: 'n형 바탕의 PMOS는 정공층으로 길을 만들어 NMOS와 반대로 동작합니다.', cite: ['mit-6012-l8', 'samsung-blog-dtco'] },
        { text: 'MOS 트랜지스터는 1959년 벨 연구소에서 처음 만들어졌고, 작고 전력을 적게 써서 오늘날 칩의 99% 이상이 MOS 트랜지스터를 씁니다.', cite: ['chm-mos-1960', 'samsung-8-3-ic-2012'] },
      ],
    },
  ],
}
