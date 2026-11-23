// 첨단 패키지: 3D 적층과 HBM 자세한 설명. 원문을 옮기지 않고 풀어 썼습니다. (검수 전)
export default {
  id: 'adv-3d',
  reviewed: false,
  checked: '2026-11-23',
  analogy: null,
  easy: [
    { text: '메모리 칩 여러 장을 위로 쌓습니다.', cite: ['hynix-be-4', 'hynix-hbm-packaging'] },
    { text: '칩을 뚫은 관통 전극(TSV)으로 위아래를 바로 잇습니다.', cite: ['samsung-tsv-12h', 'hynix-be-4'] },
    { text: '통로가 많아 데이터를 한꺼번에 많이 주고받습니다.', cite: ['hynix-be-4'] },
  ],
  sections: [
    {
      heading: 'TSV로 쌓기',
      points: [
        { text: '칩에 아주 작은 구멍을 뚫고 전극을 채워 위아래 칩을 수직으로 연결합니다.', cite: ['samsung-tsv-12h', 'hynix-be-4'] },
        { text: 'HBM은 데이터 통로가 1,024개(X1,024)로, 와이어로 쌓은 칩(X32)보다 훨씬 넓습니다.', cite: ['hynix-be-4'] },
        { text: '삼성전자는 12단 3D-TSV에서 지름 수 μm의 통로 약 6만 개를 뚫고, 칩을 종이 두께(100μm)의 절반 이하로 얇게 만들어 8단과 같은 720μm 두께에 담았다고 소개합니다.', cite: ['samsung-tsv-12h'] },
        { text: 'SK하이닉스는 2013년 1세대 HBM에 TSV를 적용했다고 소개합니다.', cite: ['hynix-hbm-packaging'] },
      ],
    },
    {
      heading: '칩 사이 메우기',
      points: [
        { text: '미리 필름(NCF)을 깔고 붙이는 방식과, 쌓은 뒤 액체 보호재를 넣는 방식(MUF)이 있습니다.', cite: ['hynix-be-10'] },
        { text: 'MR-MUF는 칩을 쌓은 뒤 액체 보호재를 한 번에 넣어 굳히는 방식으로, 필름 방식보다 효율과 열 방출이 좋다고 소개됩니다.', cite: ['hynix-hbm-packaging'] },
      ],
    },
    {
      heading: '얇은 칩 다루기',
      points: [
        { text: '수십 μm까지 얇게 간 웨이퍼는 받침 웨이퍼에 임시로 붙여 다룹니다(WSS).', cite: ['hynix-be-8', 'samsung-pkg-engineer'] },
      ],
    },
  ],
  gaps: [
    'HBM 세대별 대역폭·층수 숫자는 이 설명에서 다루지 않았습니다.',
  ],
}
