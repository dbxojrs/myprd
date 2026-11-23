// 산화 공정 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/oxidation.jsx (검수 전)
export default {
  id: 'oxidation',
  title: '산화: 웨이퍼 표면에 보호막(SiO₂) 키우기',
  reviewed: false,
  scenes: [
    {
      id: 'furnace',
      title: '산화로에 넣고 가열',
      beats: [
        { text: '산화는 웨이퍼 표면에 실리콘 산화막(SiO₂)을 키우는 공정입니다. 철이 공기 중에서 녹스는 것과 비슷합니다.', cite: ['samsung-8-2', 'hynix-fe-2'] },
        { text: '웨이퍼 수십 장을 산화로에 한꺼번에 넣고, 약 800~1,200℃로 가열합니다(열산화).', cite: ['samsung-8-2', 'hynix-fe-2'] },
        { text: '산화로 양 끝은 반응 조건이 조금 달라서, 그 차이를 메우려고 더미 웨이퍼를 함께 넣습니다.', cite: ['hynix-fe-2'] },
      ],
    },
    {
      id: 'drywet',
      title: '건식 산화와 습식 산화',
      beats: [
        { text: '건식 산화는 산소(O₂)만 씁니다. 막이 느리게 자라지만 치밀하고 품질이 좋아, 얇은 막에 씁니다.', cite: ['samsung-8-2', 'hynix-fe-2'] },
        { text: '습식 산화는 산소와 수증기(H₂O)를 함께 씁니다. 빨리 자라 두꺼운 막을 만들 수 있지만 밀도는 낮습니다.', cite: ['samsung-8-2', 'hynix-fe-2'] },
        { text: '같은 온도·시간이면 습식 막이 건식보다 약 5~10배 두껍습니다. 산소 분자가 수증기 분자보다 무거워 막 속으로 더 느리게 들어가기 때문입니다.', cite: ['samsung-8-2', 'hynix-fe-2'] },
      ],
    },
    {
      id: 'conformal',
      title: '모서리까지 고르게: 라디칼 산화',
      beats: [
        { text: '라디칼 산화는 높은 온도에서 산소와 수소를 섞어, 반응성이 큰 라디칼로 산화막을 만듭니다.', cite: ['hynix-fe-2'] },
        { text: '막 품질이 좋고, 입체 구조의 모서리와 옆면에서도 두께가 고르게 자랍니다.', cite: ['hynix-fe-2'] },
      ],
    },
    {
      id: 'roles',
      title: '산화막이 하는 일',
      beats: [
        { text: '산화막은 전기가 통하지 않는 절연막이라, 회로 사이로 새는 전류를 막습니다.', cite: ['samsung-8-2', 'hynix-fe-2'] },
        { text: '이온 주입이나 식각을 할 때 필요한 부분을 지키는 보호막 역할도 합니다.', cite: ['samsung-8-2', 'hynix-fe-2'] },
        { text: '트랜지스터의 게이트 아래 절연막도 산화막입니다. 최신 칩은 이 자리를 고유전율 막과 금속 게이트(HKMG)로 바꾸는 추세입니다.', cite: ['hynix-fe-2'] },
      ],
    },
  ],
}
