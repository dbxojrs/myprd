// 반도체 기초: MOSFET 자세한 설명. 원문을 옮기지 않고 풀어 썼습니다. (검수 전)
export default {
  id: 'b-mosfet',
  reviewed: false,
  checked: '2026-11-23',
  analogy: null,
  easy: [
    { text: 'MOSFET은 게이트·절연막·반도체를 겹친 트랜지스터입니다.', cite: ['chm-mos-1960', 'samsung-blog-scaling'] },
    { text: '게이트에 전압을 걸면 게이트 아래에 전류의 길(채널)이 생겨 켜집니다.', cite: ['mit-6012-l8', 'samsung-gaa-2019'] },
    { text: '오늘날 칩의 99% 이상이 MOS 트랜지스터를 씁니다.', cite: ['chm-mos-1960'] },
  ],
  sections: [
    {
      heading: '구조',
      points: [
        { text: '금속 전극(게이트), 산화물 절연막, 반도체 채널의 세 층으로 이루어집니다.', cite: ['samsung-blog-scaling', 'chm-mos-1960'] },
        { text: '전류가 흐르는 길인 채널과 흐름을 조절하는 게이트로 구성되고, 채널은 소스와 드레인 사이에 있습니다.', cite: ['samsung-sait-2023', 'samsung-blog-scaling'] },
        { text: '게이트 아래 반전층, 게이트 밑까지 뻗은 고농도 소스·드레인, 바디까지 네 단자로 된 소자입니다.', cite: ['mit-6012-l8'] },
        { text: '게이트는 절연막을 사이에 두고 간접적으로만 채널에 영향을 줍니다. 이 점이 예전 BJT와 다릅니다.', cite: ['hynix-fe-2'] },
      ],
    },
    {
      heading: '켜지고 꺼지는 원리',
      points: [
        { text: '게이트 전압을 높여 표면의 전자 농도가 바탕의 도핑 농도와 같아지는 지점을 문턱 전압이라 합니다.', cite: ['mit-6012-l7'] },
        { text: '문턱 전압을 넘으면 표면에 전자층(반전층)이 생겨 소스와 드레인이 이어지고, 넘지 못하면 반전층이 없어 전류가 흐르지 않습니다.', cite: ['mit-6012-l7', 'mit-6012-l8'] },
        { text: 'NMOS는 p형 바탕에서 전자 반전층을, PMOS는 n형 바탕에서 정공 반전층을 씁니다.', cite: ['mit-6012-l8'] },
        { text: '켜짐은 1, 꺼짐은 0으로 볼 수 있어 트랜지스터로 이진수 계산을 합니다.', cite: ['samsung-blog-dtco'] },
      ],
    },
    {
      heading: '절연막이 얇아지며 생긴 문제',
      points: [
        { text: '미세화로 절연막이 얇아지자 전하가 새어 나가 누설이 늘어, 고유전율(high-k) 물질을 쓰게 되었습니다.', cite: ['samsung-sait-2023', 'hynix-hkmg'] },
      ],
    },
    {
      heading: '역사',
      points: [
        { text: '1959년 벨 연구소의 강대원과 마틴 아탈라가 처음으로 MOSFET을 만들었습니다.', cite: ['chm-mos-1960', 'samsung-8-3-ic-2012'] },
        { text: '평평한 구조라 웨이퍼 하나에 많은 MOSFET을 한꺼번에, 서로 연결된 상태로 만들 수 있습니다.', cite: ['hynix-fe-1'] },
      ],
    },
  ],
  gaps: [
    'SK하이닉스 글 중에는 MOSFET 발표 연도를 1960년으로 적은 곳도 있어, 처음 만든 해(1959년)를 기준으로 썼습니다.',
  ],
}
