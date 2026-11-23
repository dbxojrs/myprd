// TSV 자세한 설명. 원문을 옮기지 않고 풀어 썼습니다. (검수 전)
export default {
  id: 'tsv',
  reviewed: false,
  checked: '2026-11-23',
  analogy: null,
  easy: [
    { text: '칩에 아주 작은 구멍을 뚫고 금속을 채웁니다.', cite: ['samsung-tsv-12h'] },
    { text: '여러 칩을 위아래로 바로 연결합니다.', cite: ['samsung-tsv-12h', 'hynix-be-4'] },
    { text: 'HBM 같은 고대역폭 메모리에 씁니다.', cite: ['hynix-be-4', 'hynix-hbm-packaging'] },
  ],
  sections: [
    {
      heading: '왜 쓰나',
      points: [
        { text: '칩에 미세한 구멍을 뚫고 전극으로 위아래 칩을 수직 연결해, 와이어로 쌓을 때보다 연결 통로가 훨씬 많습니다.', cite: ['samsung-tsv-12h', 'hynix-be-4'] },
        { text: 'HBM은 데이터 통로가 1,024개(X1,024)로, 와이어로 쌓은 칩(X32)보다 훨씬 넓습니다.', cite: ['hynix-be-4'] },
        { text: '2.5D는 받침(인터포저) 위에 칩을 나란히 놓고, 3D는 칩을 수직으로 쌓습니다.', cite: ['samsung-pkg-engineer', 'hynix-be-4'] },
      ],
    },
    {
      heading: '삼성 12단 3D-TSV 예시',
      points: [
        { text: '지름 수 μm의 통로 약 6만 개를 뚫고, 칩 두께를 종이 두께(100μm)의 절반 이하로 줄였으며, 패키지 두께는 8단과 같은 720μm로 맞췄다고 소개합니다.', cite: ['samsung-tsv-12h'] },
      ],
    },
    {
      heading: '만드는 순서(비아 미들)',
      points: [
        { text: '실리콘 식각 → 절연막 → 배리어 → 구리 도금 → CMP → 앞면 범프 → 받침 웨이퍼 부착 → 뒷면 갈기 → 뒷면 범프 → 받침 떼기 순서로 설명됩니다.', cite: ['hynix-be-8'] },
        { text: '얇아진 웨이퍼는 받침 웨이퍼에 임시로 붙여 다룹니다(WSS).', cite: ['hynix-be-8', 'samsung-pkg-engineer'] },
        { text: 'SK하이닉스는 2013년 1세대 HBM에 TSV를 적용했다고 소개합니다.', cite: ['hynix-hbm-packaging'] },
      ],
    },
  ],
  gaps: [
    '구멍 식각 깊이·종횡비 숫자는 위 출처에서 확인하지 못했습니다.',
  ],
}
