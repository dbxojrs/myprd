// 첨단 패키지: 왜 첨단 패키지인가 자세한 설명. 원문을 옮기지 않고 풀어 썼습니다. (검수 전)
export default {
  id: 'adv-overview',
  reviewed: false,
  checked: '2026-11-23',
  analogy: null,
  easy: [
    { text: '회로를 더 작게 만드는 것만으로 성능을 올리기가 점점 어려워졌습니다.', cite: ['oa-sip-2023'] },
    { text: '그래서 여러 칩을 한 패키지 안에 가깝게 모으는 기술이 중요해졌습니다.', cite: ['oa-sip-2023', 'samsung-advanced-pkg'] },
    { text: '대표 구조는 2.5D, 3D, 팬아웃, 칩렛입니다.', cite: ['oa-sip-2023', 'hynix-be-3', 'hynix-be-4'] },
  ],
  sections: [
    {
      heading: '배경',
      points: [
        { text: '반도체 업계의 기준이던 무어의 법칙이 한계에 이르렀다는 평가 속에서, 그 너머(Beyond Moore)를 위한 방법으로 시스템 인 패키지(SiP)가 주목받고 있습니다.', cite: ['oa-sip-2023'] },
        { text: 'SiP는 여러 능동 소자와 부품을 하나의 패키지에 모아 시스템처럼 동작하게 합니다.', cite: ['oa-sip-2023'] },
        { text: '삼성전자도 재배선(RDL) 기반의 2.5D·3D 첨단 패키지 기술을 중점적으로 개발하고 있다고 소개합니다.', cite: ['samsung-advanced-pkg'] },
      ],
    },
    {
      heading: '대표 구조',
      points: [
        { text: '2.5D: 인터포저 위에 칩을 나란히 놓고 연결합니다.', cite: ['samsung-pkg-engineer', 'hynix-be-4'] },
        { text: '3D: 칩을 수직으로 쌓고 관통 전극(TSV)으로 잇습니다.', cite: ['samsung-pkg-engineer', 'hynix-be-4', 'samsung-tsv-12h'] },
        { text: '팬아웃: 칩 바깥까지 배선을 넓혀 단자를 늘립니다.', cite: ['oa-sip-2023', 'hynix-be-3'] },
        { text: '칩렛: 한 웨이퍼에 함께 만들던 부분을 기능별 작은 칩으로 나눠 만든 뒤 다시 연결합니다.', cite: ['oa-sip-2023'] },
      ],
    },
    {
      heading: '더 알아보기: 실제 제품과 회사 발표',
      points: [
        { text: '무어의 법칙은 반도체 집적도가 24개월마다 두 배로 는다는 예측인데, 컴퓨팅 수요가 빠르게 느는 데 비해 반도체 성능 발전 속도가 따라가지 못하고 있습니다.', cite: ['samsung-advanced-pkg', 'samsung-gigo-pkg-2023'] },
        { text: '그래서 서로 다른 칩을 가는 배선으로 수평·수직으로 이어 하나처럼 동작하게 하는 이종 집적이 중요해졌고, 크게 2.5D와 3D로 나뉩니다.', cite: ['samsung-advanced-pkg'] },
        { text: '3D로 쌓으면 칩 안 블록 사이 신호 길이가 밀리미터에서 마이크로미터 단위로 줄어든다고 설명됩니다.', cite: ['samsung-hetero-blog'] },
      ],
    },
  ],
  gaps: [
  ],
}
