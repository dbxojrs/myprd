// 습식 세정 장비 규칙표. 형식은 data/machineSim.js 머리 주석을 보세요.
// 인용문(cite)은 출처 원문을 내려받아 그대로 있는지 대조했습니다(2026-11-26). 원인과 결과를 잇는 부분 중 출처에 없는 것은 "교육용 가설"로 적습니다.
// 메가소닉 손상 규칙은 OA 논문(근거 출처), 나머지는 설명 출처(장비 업체 기술 자료·업계 매체·뉴스룸)입니다.

export default {
  id: 'cleaning',
  processId: 'cleaning',
  stage: 'front',
  sources: {
    mksClean: { title: 'Wafer Surface Cleaning', publisher: 'MKS Instruments (장비 업체 기술 자료)', url: 'https://www.mks.com/n/cmos-wafer-cleaning' },
    mksWet: { title: 'Wet Substrate Surface Cleaning', publisher: 'MKS Instruments (장비 업체 기술 자료)', url: 'https://www.mks.com/n/wet-substrate-cleaning' },
    semiengClean: {
      title: 'Wafer Cleaning Becomes Key Challenge In Manufacturing 3D Structures',
      publisher: 'Semiconductor Engineering (2022)',
      url: 'https://semiengineering.com/wafer-cleaning-becomes-key-challenge-in-manufacturing-3d-structures',
    },
    hynixCleanCmp: {
      title: 'Creating Defectless Wafers: A Look at CLEAN & CMP Technology',
      publisher: 'SK hynix Newsroom',
      url: 'https://news.skhynix.com/en/creating-defectless-wafers-a-look-at-clean-cmp-technology/',
    },
    megasonicOa: {
      title: 'Chemically controlled megasonic cleaning of patterned structures using solutions with dissolved gas and surfactant',
      publisher: 'Ultrasonics Sonochemistry (2021), CC BY-NC-ND 4.0',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8799594/',
    },
  },
  name: '습식 세정 장비 (매엽식 세정)',
  reviewed: false,
  conditions: [
    {
      id: 'dirt',
      name: { en: 'Main Contamination', ko: '주된 오염' },
      levels: [
        { label: '입자(파티클)', pct: 30 },
        { label: '금속 오염', pct: 60 },
        { label: '자연산화막', pct: 90 },
      ],
      best: 0,
    },
    {
      id: 'pattern',
      name: { en: 'Pattern on Wafer', ko: '웨이퍼 패턴' },
      levels: [
        { label: '평평하거나 굵은 패턴', pct: 20 },
        { label: '가늘고 높은 3D 패턴', pct: 90 },
      ],
      best: 0,
    },
    {
      id: 'bath',
      name: { en: 'Chemical Condition', ko: '약품 상태' },
      levels: [
        { label: '새 약품', pct: 100 },
        { label: '오래 써서 교체 시기', pct: 20 },
      ],
      best: 0,
    },
  ],
  controls: [
    {
      id: 'chem',
      name: { en: 'Chemical Sequence', ko: '약품 순서' },
      levels: [
        { label: 'SC-1만', pct: 30 },
        { label: 'SC-1 → SC-2', pct: 60 },
        { label: 'SC-1 → SC-2 → 묽은 HF', pct: 95 },
      ],
      best: 1,
    },
    {
      id: 'mega',
      name: { en: 'Megasonic', ko: '메가소닉' },
      levels: [
        { label: '끔', pct: 0 },
        {
          label: '켬',
          example: '1 MHz',
          pct: 70,
          sourced: { value: '0.8~2.0 MHz', src: 'mksClean', cite: '"Modern SC-1 cleans employ megasonic (0.8 - 2.0 MHz) vibration"' },
        },
      ],
      best: 1,
    },
    {
      id: 'rinse',
      name: { en: 'UPW Rinse', ko: '초순수 헹굼' },
      levels: [
        { label: '짧게', example: '10초', pct: 20 },
        { label: '충분히', example: '60초', pct: 80 },
      ],
      best: 1,
    },
    {
      id: 'dry',
      name: { en: 'Drying', ko: '건조 방식' },
      levels: [
        { label: '고속 스핀 건조', pct: 40 },
        { label: 'IPA 건조', pct: 80 },
      ],
      best: 0,
    },
  ],
  actions: [{ id: 'bath', label: '약품 교체', needs: { bath: 1 }, sets: { bath: 0 }, log: '오래 쓴 약품을 버리고 새 약품을 채움' }],
  rules: [
    {
      when: { bath: [1] },
      severity: 'alarm',
      at: 'chem',
      title: '약품 상태 이상 · 세정 정지',
      cause: '오래 쓴 약품으로는 오염을 제대로 없앨 수 없어 장비가 약품 단계에서 멈춥니다.',
      fix: '"약품 교체" 후 다시 시작합니다.',
      basis: '교육용 가설(검수 전)',
    },
    {
      when: { dirt: [1], chem: [0] },
      severity: 'bad',
      title: '금속 오염 남음: 누설 전류 위험',
      cause: '금속 오염은 SC-2 같은 산성 세정으로 없애는데, SC-1만 써서 남았습니다. 금속 오염은 누설 전류를 키워 소자 성능을 떨어뜨립니다.',
      fix: '약품 순서를 "SC-1 → SC-2"로 바꿉니다.',
      src: 'mksClean',
      cite: '"Metal contaminants can be removed ... using an acidic clean such as SC-2", "degrade device performance, permitting larger leakage currents"',
    },
    {
      when: { dirt: [2], chem: [0, 1] },
      severity: 'bad',
      title: '자연산화막 남음',
      cause: '자연산화막은 묽은 불산(HF)으로 없앱니다. HF 단계가 빠져 산화막이 남았고, 자연산화막은 소자 제조에 문제를 일으킵니다.',
      fix: '약품 순서를 "SC-1 → SC-2 → 묽은 HF"로 바꿉니다.',
      src: 'mksClean',
      cite: '"completely remove silicon native oxide, leaving a hydrogen-terminated clean silicon surface", "causes problems in semiconductor device manufacturing"',
    },
    {
      when: { dirt: [0], mega: [0], pattern: [0] },
      severity: 'warn',
      title: '입자가 덜 떨어짐',
      cause: 'SC-1 세정에서 메가소닉 진동이 입자 제거를 돕는데, 꺼 두어 입자가 일부 남을 수 있습니다.',
      fix: '패턴이 튼튼하면 메가소닉을 "켬"으로 바꿉니다.',
      src: 'mksClean',
      cite: '"employ megasonic (0.8 - 2.0 MHz) vibration to aid in the removal of particles". 입자가 남는다는 결과는 교육용 가설(검수 전)',
    },
    {
      when: { pattern: [1], mega: [1] },
      severity: 'bad',
      title: '메가소닉 기포로 섬세한 패턴 손상',
      cause: '메가소닉에서 기포가 갑자기 터지면 패턴을 다치게 하는 힘이 생깁니다. 섬세한 패턴은 이 손상을 피하기 어려워 첨단 공정에서는 거의 쓰지 않게 되었습니다.',
      fix: '메가소닉을 "끔"으로 바꿉니다.',
      src: 'megasonicOa',
      cite: '"transient cavitation could produce damaging forces" (Semiconductor Engineering: "popping bubbles can damage delicate structures")',
    },
    {
      when: { pattern: [1], dry: [0] },
      severity: 'warn',
      title: '건조 중 패턴 붕괴 위험',
      cause: '3D 구조에서는 건조 단계가 가는 패턴이 쓰러지는 위험을 키웁니다. 그래서 첨단 3D 구조일수록 IPA 건조 단계를 더 많이 씁니다.',
      fix: '건조 방식을 "IPA 건조"로 바꿉니다.',
      src: 'semiengClean',
      cite: '"that drying step creates greater risks of pattern collapse", "advanced 3D structures now rely on more and more IPA drying steps". IPA가 붕괴를 줄인다는 연결은 교육용 가설(검수 전)',
    },
    {
      when: { rinse: [0] },
      severity: 'bad',
      title: '약품 잔류',
      cause: '남은 약품은 많은 양의 초순수로 헹궈 없애야 하는데, 헹굼이 짧아 약품이 남았습니다.',
      fix: '초순수 헹굼을 "충분히"로 바꿉니다.',
      src: 'mksWet',
      cite: '"removed by a combination of high volume UPW spray rinsing and rapid overflow dump rinsing". 짧게 헹구면 남는다는 결과는 교육용 가설(검수 전)',
    },
  ],
  metrics: [
    { id: 'throughput', name: '처리 속도', good: 'high', base: 20, add: { chem: [40, 25, 10], rinse: [25, 0], dry: [15, 0], mega: [0, 0] } },
    { id: 'clean', name: '세정도', good: 'high', base: 40, add: { chem: [0, 20, 30], mega: [0, 15], rinse: [-30, 10], bath: [0, -40] } },
    {
      id: 'damage',
      name: '패턴 손상 위험',
      good: 'low',
      base: 0,
      add: { pattern: [0, 20], mega: [0, 10], dry: [5, 0] },
      // 가늘고 높은 패턴에서만 메가소닉·스핀 건조의 위험이 크게 늘어납니다.
      extra: [
        { when: { pattern: [1], mega: [1] }, add: 40 },
        { when: { pattern: [1], dry: [0] }, add: 20 },
      ],
    },
  ],
  sequence: [
    { id: 'load', text: '웨이퍼 로딩 · 챔버에 한 장 넣기', scene: '매엽식 장비는 챔버마다 웨이퍼를 한 장씩 넣어 씻습니다.' },
    { id: 'chem', text: '약품 세정: {chem} · 메가소닉 {mega}', scene: '웨이퍼를 돌리며 약품을 뿌려 오염을 녹이거나 떼어 냅니다.' },
    { id: 'rinse', text: '초순수 헹굼: {rinse}', scene: '초순수를 넉넉히 뿌려 남은 약품을 씻어 냅니다.' },
    { id: 'dry', text: '건조: {dry}', scene: '웨이퍼를 말립니다. 가는 패턴은 이때 쓰러질 위험이 큽니다.' },
    { id: 'inspect', text: '파티클 검사', scene: '표면에 남은 입자를 검사해 다음 공정으로 넘길지 정합니다.' },
  ],
  scenarios: [
    {
      id: 'metal',
      title: '금속 오염 로트',
      brief: '앞 공정에서 금속 오염이 의심되는 로트입니다. 누설 전류 문제가 없도록 씻으세요.',
      preset: { dirt: 1, chem: 0 },
      goal: { maxGrade: 'good' },
      hint: '약품마다 맡은 오염이 다릅니다.',
    },
    {
      id: 'collapse',
      title: '3D 패턴 웨이퍼 세정',
      brief: '가늘고 높은 3D 패턴 웨이퍼입니다. 패턴을 다치지 않게 깨끗이 씻으세요.',
      preset: { pattern: 1, mega: 1 },
      goal: { maxGrade: 'good' },
      hint: '입자를 잘 떼는 방법이 섬세한 구조에는 해로울 수 있습니다. 건조도 확인하세요.',
    },
    {
      id: 'oxide',
      title: '자연산화막 제거',
      brief: '다음 공정 전에 실리콘 표면의 자연산화막을 없애야 합니다. 경고 없이 마치세요.',
      preset: { dirt: 2 },
      goal: { maxGrade: 'good' },
      hint: '산화막을 녹이는 약품은 무엇이었나요?',
    },
  ],
}
