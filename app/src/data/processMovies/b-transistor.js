// 반도체 기초 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/b-transistor.jsx (검수 전)
export default {
  id: 'b-transistor',
  title: '트랜지스터: 작은 전류로 큰 전류를',
  reviewed: false,
  scenes: [
    {
      id: 'npn',
      title: 'npn 트랜지스터의 원리',
      beats: [
        { text: 'n형과 p형을 세 겹으로 붙여 만든 트랜지스터를 접합형(BJT)이라 하며, 순서에 따라 npn형과 pnp형이 있습니다.', cite: ['samsung-transistor-principle', 'samsung-term-transistor'] },
        { text: '가운데(베이스)는 아주 얇고, 양쪽은 전자를 내보내는 이미터와 모으는 콜렉터입니다.', cite: ['samsung-transistor-principle'] },
        { text: '베이스가 얇아 이미터의 전자 대부분이 콜렉터로 넘어가므로, 베이스의 작은 전류로 콜렉터의 큰 전류를 만들 수 있습니다.', cite: ['samsung-transistor-principle', 'hynix-fe-1'] },
      ],
    },
    {
      id: 'roles',
      title: '하는 일과 역사',
      beats: [
        { text: '트랜지스터는 신호를 키우는 증폭과, 전류를 켜고 끄는 스위치 역할을 합니다.', cite: ['samsung-term-transistor', 'samsung-transistor-principle'] },
        { text: '1947년 벨 연구소에서 처음 만들어졌고, 1958년 집적 회로(IC)가 발명되며 칩 하나에 수많은 트랜지스터를 담게 되었습니다.', cite: ['hynix-101-players', 'hynix-101-history', 'samsung-8-3-ic-2012'] },
      ],
    },
  ],
}
