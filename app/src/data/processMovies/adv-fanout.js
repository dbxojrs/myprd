// 첨단 패키지 영상 자막. 문장마다 출처 키. 그림: components/movie/scenes/adv-fanout.jsx (검수 전)
export default {
  id: 'adv-fanout',
  title: '팬아웃 패키지: 칩 바깥까지 배선 넓히기',
  reviewed: false,
  scenes: [
    {
      id: 'reconstitute',
      title: '새 웨이퍼 만들기',
      beats: [
        { text: '잘라 낸 칩을 받침(캐리어) 위에 간격을 두고 다시 늘어놓습니다.', cite: ['hynix-be-3', 'hynix-be-8'] },
        { text: '그 위를 수지(EMC)로 몰딩해 칩이 박힌 새 웨이퍼(재구성 웨이퍼)를 만듭니다.', cite: ['hynix-be-3', 'hynix-be-8'] },
        { text: '받침을 떼어 낸 뒤 그 면에 배선을 만듭니다. 몰딩을 먼저 하는 방식과 배선(RDL)을 먼저 만드는 방식이 있습니다.', cite: ['oa-fanout-2019'] },
      ],
    },
    {
      id: 'rdl',
      title: '바깥까지 넓힌 배선',
      beats: [
        { text: '팬인은 패키지가 칩 크기와 같지만, 팬아웃은 칩 바깥까지 배선을 넓혀 단자를 더 많이 둘 수 있습니다.', cite: ['oa-sip-2023', 'hynix-be-3'] },
        { text: '넓힌 배선 끝에 솔더볼을 달아 바깥과 연결합니다.', cite: ['hynix-be-8'] },
      ],
    },
  ],
}
