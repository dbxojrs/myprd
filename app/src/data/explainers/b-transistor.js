// 반도체 기초: 트랜지스터 자세한 설명. 원문을 옮기지 않고 풀어 썼습니다. (검수 전)
export default {
  id: 'b-transistor',
  reviewed: false,
  checked: '2026-11-23',
  analogy: null,
  easy: [
    { text: '트랜지스터는 전류를 키우거나(증폭) 켜고 끄는(스위치) 반도체 소자입니다.', cite: ['samsung-term-transistor', 'samsung-transistor-principle'] },
    { text: '작은 전류로 큰 전류를 조절할 수 있습니다.', cite: ['samsung-transistor-principle', 'hynix-fe-1'] },
    { text: '칩 하나에 아주 많이 들어갑니다.', cite: ['samsung-gaa-2019'] },
  ],
  sections: [
    {
      heading: '종류와 구조',
      points: [
        { text: '트랜지스터는 크게 접합형(BJT)과 전계효과형(FET)으로 나뉩니다.', cite: ['samsung-term-transistor', 'samsung-transistor-principle'] },
        { text: 'BJT는 n형과 p형을 세 겹으로 붙여 만들며, 순서에 따라 npn형과 pnp형이 있습니다.', cite: ['samsung-transistor-principle'] },
        { text: '전극은 캐리어를 내보내는 이미터, 모으는 콜렉터, 전류를 조절하는 베이스 3개이고, 베이스가 가장 얇습니다.', cite: ['samsung-transistor-principle'] },
      ],
    },
    {
      heading: '증폭 원리',
      points: [
        { text: '베이스가 아주 얇아 이미터에서 나온 전자 대부분이 콜렉터로 넘어가므로, 베이스의 작은 전류로 콜렉터의 큰 전류를 만듭니다.', cite: ['samsung-transistor-principle'] },
        { text: '집적 회로 안에서 트랜지스터는 전원을 켜고 끄는 스위치 역할을 합니다.', cite: ['samsung-8-3-ic-2012'] },
      ],
    },
    {
      heading: '역사',
      points: [
        { text: '진공관을 쓰던 ENIAC은 진공관 17만 개 이상을 쓰고 최대 170kW의 전력을 소비했으며, 진공관은 자주 고장 났습니다.', cite: ['hynix-fe-1'] },
        { text: '1947년 벨 연구소에서 바딘과 브래튼이 쇼클리 아래에서 처음 트랜지스터를 만들었고, 세 사람은 1956년 노벨 물리학상을 받았습니다.', cite: ['hynix-101-players', 'hynix-101-history', 'samsung-8-3-ic-2012'] },
        { text: '1958년 텍사스 인스트루먼트의 잭 킬비가 집적 회로(IC)를 발명했습니다.', cite: ['hynix-101-players', 'samsung-8-3-ic-2012'] },
        { text: '지금은 칩 하나에 트랜지스터가 수천만~수억 개 들어갑니다.', cite: ['samsung-gaa-2019'] },
      ],
    },
    {
      heading: '다른 무료 출처로 더 알아보기',
      points: [
        { text: 'BJT는 pn 접합 두 개를 등을 맞대어 붙인 구조로 볼 수 있습니다.', cite: ['mit-6012-l17'] },
        { text: '증폭할 때는 베이스-이미터 접합에 순방향, 베이스-콜렉터 접합에 역방향 전압을 걸어, 이미터에서 들어온 전자를 콜렉터가 끌어갑니다.', cite: ['mit-6012-l17'] },
        { text: '1947년 벨 연구소의 바딘과 브래튼이 저마늄 위에 금 접점 두 개를 댄 점접촉 트랜지스터로 신호를 최대 100배 증폭했다고 컴퓨터 역사 박물관은 설명합니다(출처마다 시연 날짜와 증폭 배수가 조금 다릅니다).', cite: ['chm-transistor-1947', 'nokia-bell-1956'] },
        { text: '1958년 텍사스 인스트루먼트의 잭 킬비가 반도체 하나에 여러 소자를 만든 회로를 시연했고, 1959년 노이스가 평면 공정 기반의 단일 칩 IC 특허를 냈습니다.', cite: ['chm-ic-1958', 'chm-ic-1959'] },
      ],
    },
  ],
  gaps: [
    '삼성 용어 사전은 트랜지스터 발명을 1948년으로 적었지만, 다른 삼성·SK하이닉스·박물관 자료는 1947년(1948년은 공식 발표 연도)이라 1947년으로 썼습니다.',
    'pnp형의 자세한 동작은 다루지 않았습니다.',
  ],
}
