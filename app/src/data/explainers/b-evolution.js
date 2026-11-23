// 반도체 기초: 트랜지스터의 진화 자세한 설명. 원문을 옮기지 않고 풀어 썼습니다. (검수 전)
export default {
  id: 'b-evolution',
  reviewed: false,
  checked: '2026-11-23',
  analogy: null,
  easy: [
    { text: '트랜지스터가 작아지면 전류가 새기 쉬워집니다.', cite: ['samsung-gaa-ep6', 'samsung-gaa-2019'] },
    { text: '그래서 게이트가 채널을 감싸는 면을 1면 → 3면(핀펫) → 4면(GAA)으로 늘려 왔습니다.', cite: ['samsung-gaa-2019', 'samsung-term-finfet', 'samsung-3nm-gaa'] },
    { text: '삼성은 2022년 GAA를 적용한 3나노 공정을 세계 처음으로 양산했습니다.', cite: ['samsung-3nm-gaa'] },
  ],
  sections: [
    {
      heading: '왜 바꿔야 했나',
      points: [
        { text: '작아질수록 소스와 드레인이 가까워지고 게이트가 짧아져, 게이트가 전류를 제대로 막지 못하는 단채널 현상이 생깁니다.', cite: ['samsung-gaa-ep6', 'samsung-gaa-chat1', 'samsung-gaa-2019', 'samsung-blog-scaling'] },
        { text: '평면형은 게이트와 채널이 한 면에서만 맞닿아, 동작 전압을 낮추는 데 20나노미터 정도가 한계였다고 설명됩니다.', cite: ['samsung-blog-scaling', 'samsung-gaa-2019'] },
      ],
    },
    {
      heading: '핀펫(FinFET)',
      points: [
        { text: '지느러미처럼 세운 채널의 세 면을 게이트가 감싸 닿는 면적을 넓혀 성능을 높이고 누설을 줄였습니다.', cite: ['samsung-term-finfet', 'samsung-gaa-2019'] },
        { text: '삼성은 14나노 공정부터 핀펫을 썼고, 2016년 10월 10나노 핀펫을 업계 처음으로 양산했습니다.', cite: ['samsung-term-finfet', 'samsung-blog-scaling'] },
        { text: '핀펫도 더 작아지면 동작 전압을 낮추기 어려운 한계가 있었습니다.', cite: ['samsung-gaa-2019', 'samsung-blog-scaling'] },
      ],
    },
    {
      heading: 'GAA와 MBCFET',
      points: [
        { text: 'GAA는 게이트가 채널의 네 면을 모두 감싸 전류를 조절하는 힘을 크게 높인 구조입니다.', cite: ['samsung-3nm-gaa', 'samsung-gaa-ep6', 'samsung-gaa-2019'] },
        { text: '가는 나노와이어 채널(지름 약 1nm)은 전류를 충분히 얻기 어려워, 삼성은 얇고 넓은 나노시트를 여러 장 쌓은 MBCFET을 만들었습니다.', cite: ['samsung-gaa-2019', 'samsung-blog-scaling', 'samsung-3nm-gaa'] },
        { text: '나노시트의 폭을 조절해 전류를 세밀하게 맞출 수 있습니다. 계산이 많은 곳에는 넓은 시트, 전력을 아낄 곳에는 좁은 시트를 씁니다.', cite: ['samsung-3nm-gaa', 'samsung-gaa-chat1'] },
        { text: '2022년 6월 30일 삼성은 GAA를 적용한 3나노 공정 양산을 시작했고, 5나노 핀펫보다 1세대가 전력 45% 감소·성능 23% 향상·면적 16% 축소라고 밝혔습니다.', cite: ['samsung-3nm-gaa'] },
      ],
    },
    {
      heading: '함께 쓰는 기술: HKMG',
      points: [
        { text: '게이트를 금속으로, 절연막을 고유전율(high-k) 물질로 바꿔 누설을 줄이는 HKMG도 쓰이며, SK하이닉스는 이를 DRAM에도 적용하고 있습니다.', cite: ['hynix-hkmg', 'hynix-fe-2'] },
      ],
    },
    {
      heading: '다른 무료 출처로 더 알아보기',
      points: [
        { text: '소자를 줄이면 문턱 전압이 낮아지고 꺼져 있어도 전류가 새는 단채널 효과가 생겨, 게이트를 늘린 구조(이중 게이트 → 트라이게이트 FinFET → GAA)로 발전했습니다.', cite: ['oa-gaa-2022'] },
        { text: '인텔은 2011년 22나노에서 얇은 실리콘 핀의 세 면을 게이트가 감싸는 트라이게이트(3D) 트랜지스터를 양산한다고 발표했습니다.', cite: ['intel-trigate-2011'] },
        { text: 'IBM은 나노와이어에서 여러 장 쌓은 나노시트로 발전시켰고, 2015년 학회 논문에서 "나노시트"라는 이름을 처음 썼습니다.', cite: ['ibm-nanosheet'] },
        { text: '다만 같은 면적으로 비교하면 나노시트가 늘 FinFET보다 유리한 것은 아니라는 연구도 있습니다.', cite: ['oa-gaa-2022'] },
      ],
    },
  ],
  gaps: [
    'SK하이닉스 뉴스룸에서는 GAA 해설 글을 찾지 못했습니다.',
    'MBCFET 성능 비교 숫자는 비교 기준(5나노·7나노 핀펫)에 따라 글마다 달라, 기준이 분명한 3나노 양산 발표 숫자만 썼습니다.',
  ],
}
