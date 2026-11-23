// 첨단 패키지: 팬아웃 패키지 자세한 설명. 원문을 옮기지 않고 풀어 썼습니다. (검수 전)
export default {
  id: 'adv-fanout',
  reviewed: false,
  checked: '2026-11-23',
  analogy: null,
  easy: [
    { text: '칩을 받침 위에 다시 늘어놓고 몰딩해 새 웨이퍼를 만듭니다.', cite: ['hynix-be-3', 'hynix-be-8'] },
    { text: '칩 바깥까지 배선(RDL)을 넓힙니다.', cite: ['oa-sip-2023', 'hynix-be-3'] },
    { text: '넓힌 면에 솔더볼을 달아 단자를 많이 둡니다.', cite: ['hynix-be-8'] },
  ],
  sections: [
    {
      heading: '팬인과 팬아웃',
      points: [
        { text: '팬인은 패키지가 칩 크기와 거의 같고, 팬아웃은 칩 바깥까지 배선을 넓혀 핀(단자)을 더 많이 둡니다.', cite: ['oa-sip-2023', 'hynix-be-3'] },
      ],
    },
    {
      heading: '만드는 순서',
      points: [
        { text: '칩을 캐리어에 다시 배치하고 EMC로 몰딩해 재구성 웨이퍼를 만듭니다.', cite: ['hynix-be-3', 'hynix-be-8'] },
        { text: '공정은 몰딩을 먼저 하는 방식(칩 면을 아래로 또는 위로)과 배선(RDL)을 먼저 만드는 방식으로 나뉩니다.', cite: ['oa-fanout-2019'] },
        { text: '재배선의 절연막으로는 낮은 온도에서 굳는 감광성 폴리이미드 필름을 붙이고 레이저로 무늬를 냅니다.', cite: ['oa-fanout-2019'] },
      ],
    },
    {
      heading: '어려운 점',
      points: [
        { text: '몰딩할 때 칩에 걸리는 힘과, 받침·테이프·수지마다 열에 늘어나는 정도가 다른 탓에 칩 위치가 틀어질 수 있습니다(다이 시프트). 몰딩을 먼저 하는 방식의 큰 과제로 꼽힙니다.', cite: ['oa-fanout-2019'] },
      ],
    },
  ],
  gaps: [
  ],
}
