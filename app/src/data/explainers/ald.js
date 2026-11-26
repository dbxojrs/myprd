// ALD·원자층 증착 자세한 설명. 원문을 옮기지 않고 풀어 썼습니다. 문장마다 출처 키(data/sourceCatalog.js). (검수 전)
// 출처 원문을 내려받아 인용문과 대조해 확인했습니다(2026-11-26).
export default {
  id: 'ald',
  reviewed: false,
  checked: '2026-11-26',
  analogy: null,
  easy: [
    { text: '원료 기체(전구체)를 한 번에 섞지 않고 차례로 번갈아 넣어 막을 쌓습니다.', cite: ['oa-ald-2019', 'hynix-as-ald'] },
    { text: '원료는 드러난 표면에만 붙을 수 있어서, 표면이 다 덮이면 반응이 저절로 멈춥니다(자기 제한).', cite: ['semieng-lam-ald', 'oa-ald-2019'] },
    { text: '이 과정을 한 번 돌 때마다 아주 얇은 층이 쌓여, 반복 횟수로 두께를 정확히 정할 수 있습니다.', cite: ['oa-ald-2019', 'mdpi-highk-2014'] },
    { text: '깊고 좁은 홈 안쪽까지 고르게 덮는 대신, 쌓는 속도가 느립니다.', cite: ['oa-ald-2019'] },
  ],
  sections: [
    {
      heading: '한 사이클의 순서',
      points: [
        { text: '한 사이클은 첫 번째 원료 넣기 → 남은 원료와 부산물 불어 내기(퍼지) → 두 번째 원료 넣기 → 다시 퍼지 순서입니다.', cite: ['oa-ald-2019', 'mdpi-highk-2014'] },
        { text: '퍼지에는 반응하지 않는 기체(불활성 기체)를 씁니다.', cite: ['mdpi-highk-2014'] },
        { text: '이미 반응한 자리에는 새 원료가 반응하지 못하기 때문에, 반쪽 사이클마다 표면 화학에 의해 반응이 스스로 멈춥니다.', cite: ['hynix-as-ald', 'mdpi-highk-2014'] },
        { text: '원하는 두께가 될 때까지 사이클을 되풀이합니다.', cite: ['oa-ald-2019', 'semieng-lam-ald'] },
      ],
    },
    {
      heading: '두께 조절',
      points: [
        { text: '한 사이클마다 원자 한 층 또는 그보다 얇은 층이 쌓입니다. 사이클당 약 1Å(0.1nm) 이하입니다.', cite: ['oa-ald-2019', 'mdpi-highk-2014'] },
        { text: '사이클마다 정확히 원자 한 층씩 쌓이지는 않지만, 두께는 잘 조절됩니다.', cite: ['semieng-lam-ald'] },
        { text: '사이클 수를 정하는 것만으로 막 두께를 정할 수 있어, 원자 수준으로 두께를 조절합니다.', cite: ['mdpi-highk-2014', 'hynix-as-ald'] },
      ],
    },
    {
      heading: '장점: 단차 피복성',
      points: [
        { text: '종횡비(깊이 ÷ 폭)가 매우 큰 구조도 거의 완벽하게 고르게 덮습니다.', cite: ['oa-ald-2019', 'mdpi-highk-2014'] },
        { text: '이런 높은 단차 피복성은 종횡비가 큰 구조와 3D 구조에서 꼭 필요한 능력입니다.', cite: ['semieng-lam-ald'] },
        { text: 'DRAM 구조는 종횡비가 커서 CVD로는 증착하기 어렵습니다.', cite: ['mdpi-highk-2014'] },
        { text: '3D NAND에서는 메모리 홀 옆벽에 절연막을 만드는 데 씁니다.', cite: ['semieng-lam-ald'] },
      ],
    },
    {
      heading: '단점과 조건',
      points: [
        { text: '증착 속도가 느린 것이 ALD의 가장 큰 단점입니다. 종횡비가 큰 구조일수록 원료를 넣고 불어 내는 시간이 더 길어집니다.', cite: ['oa-ald-2019'] },
        { text: '성장이 일정하게 유지되는 온도 범위(ALD 온도 창) 안에서 공정해야 합니다.', cite: ['oa-ald-2019'] },
        { text: '염소가 들어간 원료는 불어 내는 시간이 훨씬 깁니다.', cite: ['hynix-as-ald'] },
        { text: '플라즈마를 쓰는 PEALD는 열로만 하는 ALD보다 낮은 온도에서 증착할 수 있습니다.', cite: ['oa-ald-2019'] },
      ],
    },
    {
      heading: 'CVD와 비교, 쓰이는 곳',
      points: [
        { text: 'ALD는 CVD를 발전시킨 방식으로, CVD와 달리 원료를 동시에 넣지 않고 차례로 넣습니다.', cite: ['oa-ald-2019'] },
        { text: 'ALD는 같은 물질의 CVD 공정보다 조금 낮은 온도에서 진행되는 경향이 있습니다.', cite: ['mdpi-highk-2014'] },
        { text: '2007년 인텔이 로직 반도체 회사 가운데 처음으로, 하프늄(Hf) 기반 고유전율(high-k) 절연막과 금속 게이트를 CMOS 양산에 쓴 트랜지스터를 발표했습니다.', cite: ['mdpi-highk-2014'] },
        { text: 'DRAM 커패시터에는 두 ZrO₂ 층 사이에 얇은 Al₂O₃를 끼운 적층막(ZAZ)을 씁니다.', cite: ['mdpi-highk-2014'] },
        { text: '증착 온도가 낮아 커패시터·DRAM 같은 곳에 쓸모가 큽니다.', cite: ['oa-ald-2019'] },
      ],
    },
  ],
  gaps: [
    '구리 확산 방지막(배리어)·라이너 용도, Al₂O₃를 게이트 절연막으로 쓰는 경우는 확인한 출처에서 찾지 못했습니다.',
    '온도 창을 벗어났을 때 생기는 현상의 자세한 설명은 다루지 않았습니다.',
  ],
}
