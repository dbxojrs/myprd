// 첨단 패키지: 칩렛 자세한 설명. 원문을 옮기지 않고 풀어 썼습니다. (검수 전)
export default {
  id: 'adv-chiplet',
  reviewed: false,
  checked: '2026-11-24',
  analogy: null,
  easy: [
    { text: '큰 칩을 기능별 작은 칩(칩렛)으로 나눠 만듭니다.', cite: ['oa-sip-2023', 'hynix-be-4'] },
    { text: '작게 나눌수록 수율이 높아지고, 필요한 부분만 최신 공정으로 바꿀 수 있습니다.', cite: ['hynix-be-4'] },
    { text: '나눈 칩렛은 브리지·인터포저 같은 첨단 패키지로 다시 잇습니다.', cite: ['oa-sip-2023', 'samsung-foundry-ahi'] },
  ],
  sections: [
    {
      heading: '왜 나누나',
      points: [
        { text: '칩렛은 한 웨이퍼에 함께 만들던 부분을 특정 기능을 가진 여러 작은 칩으로 나눈 뒤 다시 연결하는 방식입니다.', cite: ['oa-sip-2023'] },
        { text: '수율: 웨이퍼에 불량이 5개 고르게 있을 때 칩 100개짜리 제품은 수율 95%, 1,000개짜리는 99.5%입니다.', cite: ['hynix-be-4'] },
        { text: '개발 효율: 일부 칩만 최신 공정으로 바꾸고 나머지는 그대로 쓰거나, 외부에서 사 올 수 있습니다.', cite: ['hynix-be-4'] },
        { text: '큰 다이를 작은 칩렛으로 나누고 칩렛마다 알맞은 공정을 쓰면 수율이 오르고 비용이 줄어든다고 삼성전자도 설명합니다.', cite: ['samsung-hetero-blog'] },
      ],
    },
    {
      heading: '어떻게 잇나',
      points: [
        { text: '인텔 EMIB는 TSV가 없는 유기 기판형 패키지로, 기판 맨 위층에 아주 얇은 실리콘 브리지를 넣어 칩 사이를 촘촘하게 잇습니다.', cite: ['oa-sip-2023'] },
        { text: '삼성전자 Cube-E는 실리콘 브리지를 TSV 없는 RDL 인터포저에 넣은 구조입니다.', cite: ['samsung-foundry-ahi'] },
        { text: '인터포저 위에 칩렛을 나란히 놓는 2.5D 방식이나, 위로 쌓는 3D 방식으로도 잇습니다.', cite: ['hynix-be-4', 'samsung-advanced-pkg'] },
      ],
    },
    {
      heading: '공개 표준 UCIe',
      points: [
        { text: 'UCIe는 패키지 안에서 칩렛끼리 잇는 방법을 정한 공개 산업 표준으로, 다이 사이의 물리 연결·통신 규칙·소프트웨어까지 다룹니다.', cite: ['ucie-specs'] },
      ],
    },
  ],
  gaps: [
    '유리 기판 같은 차세대 기판은 회사 발표 자료만 있고 원문을 다시 확인하지 못해 다루지 않았습니다.',
  ],
}
