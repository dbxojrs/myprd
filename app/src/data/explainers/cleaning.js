// 세정 자세한 설명. 원문을 옮기지 않고 풀어 썼습니다. 문장마다 출처 키(data/sourceCatalog.js). (검수 전)
// 출처 원문을 내려받아 인용문과 대조해 확인했습니다(2026-11-26). 1순위 근거 출처는 아직 찾지 못해 모두 설명 출처입니다.
export default {
  id: 'cleaning',
  reviewed: false,
  checked: '2026-11-26',
  analogy: null,
  easy: [
    { text: '아주 작은 먼지 하나도 칩의 전기적 특성을 망가뜨려 불량과 수율 저하로 이어질 수 있습니다.', cite: ['hynix-clean-cmp'] },
    { text: '그래서 여러 공정의 앞뒤마다 웨이퍼를 씻습니다. 세정은 다른 공정보다 2배 정도 자주 진행됩니다.', cite: ['hynix-clean-cmp', 'samsung-cleaning'] },
    { text: '약품과 초순수로 씻는 습식 세정과, 플라즈마 같은 가스를 쓰는 건식 세정이 있습니다.', cite: ['hynix-clean-cmp'] },
    { text: '씻을 때마다 말리는 단계가 뒤따릅니다.', cite: ['semieng-cleaning-3d'] },
  ],
  sections: [
    {
      heading: '무엇을 없애나',
      points: [
        { text: '없애야 할 불순물에는 입자, 금속, 유기물, 자연산화막이 있습니다. 아주 적은 양도 패턴 결함과 전기적 특성 저하를 일으켜 수율과 신뢰성을 떨어뜨립니다.', cite: ['samsung-cleaning'] },
        { text: '몇 나노미터 크기의 입자도 칩을 못 쓰게 만드는 "킬러" 결함이 될 수 있습니다.', cite: ['mks-wafer-cleaning'] },
        { text: '금속 오염은 누설 전류를 키워 소자 성능을 떨어뜨립니다.', cite: ['mks-wafer-cleaning'] },
        { text: '공기 중에 늘 떠다니는 휘발성 물질에서 온 유기물 오염도 없애야 합니다.', cite: ['mks-wafer-cleaning'] },
        { text: '실리콘 표면에 저절로 생기는 얇은 자연산화막도 소자 제조에 문제를 일으킵니다.', cite: ['mks-wafer-cleaning'] },
      ],
    },
    {
      heading: '얼마나 자주',
      points: [
        { text: '세정 단계는 공정 전체에 걸쳐 수백 개가 있고, 수율과 신뢰성에 결정적입니다.', cite: ['semieng-cleaning-3d'] },
        { text: '세정 절차가 전체 공정 단계의 30~40%를 차지할 수 있습니다.', cite: ['mks-wafer-cleaning'] },
      ],
    },
    {
      heading: 'RCA 세정: 약품별 역할',
      points: [
        { text: '실리콘 웨이퍼 전공정의 첫 성공적인 습식 세정법은 RCA에서 개발되었습니다.', cite: ['mks-wafer-cleaning'] },
        { text: 'SC-1은 수산화암모늄·과산화수소·초순수를 섞은 액으로, 실리콘 표면을 얇게 산화시켜 녹지 않는 입자를 떼어 냅니다.', cite: ['mks-wafer-cleaning'] },
        { text: 'SC-2는 염산·과산화수소·초순수를 섞은 산성 액으로, 금속 오염을 제거합니다.', cite: ['mks-wafer-cleaning'] },
        { text: '묽은 불산(HF)은 자연산화막을 완전히 없애고, 수소로 덮인 깨끗한 실리콘 표면을 남깁니다.', cite: ['mks-wafer-cleaning'] },
        { text: 'RCA 세정대에는 SC-1·SC-2 가열조와 2% 불산 담금조가 있고, 고온 퍼니스 공정 전에 유기물과 금속 오염을 없애는 데 씁니다.', cite: ['nist-rca-bench'] },
        { text: '요즘 SC-1 세정에는 0.8~2.0MHz 메가소닉 진동을 함께 써서 입자 제거를 돕습니다.', cite: ['mks-wafer-cleaning'] },
      ],
    },
    {
      heading: '헹굼과 건조',
      points: [
        { text: '남은 약품은 많은 양의 초순수(UPW)를 뿌리는 헹굼과 빠르게 채웠다 비우는 헹굼으로 없앱니다.', cite: ['mks-wet-cleaning'] },
        { text: '헹군 뒤에는 보통 웨이퍼를 빠르게 돌려(스핀) 말립니다. 헹굼·건조 중에 메가소닉이나 IPA를 함께 쓰기도 합니다.', cite: ['mks-wet-cleaning'] },
        { text: '3D 구조에서는 건조 단계가 가는 패턴이 쓰러지는(패턴 붕괴) 위험을 키워, IPA 건조 단계가 점점 많이 필요해졌습니다.', cite: ['semieng-cleaning-3d'] },
        { text: '액체 약품의 표면장력 때문에 여러 결함이 생기기 때문에, 표면장력이 없는 초임계 유체로 씻는 방법도 씁니다.', cite: ['hynix-clean-cmp'] },
      ],
    },
    {
      heading: '배치식과 매엽식',
      points: [
        { text: '배치식(침지식)은 약품이나 초순수를 채운 조에 여러 장을 한꺼번에 담가 씻습니다.', cite: ['samsung-cleaning', 'hynix-clean-cmp'] },
        { text: '매엽식은 장비 안의 챔버마다 웨이퍼를 한 장씩 약품으로 씻습니다. 최근에는 매엽식 비중이 커지고 있습니다.', cite: ['hynix-clean-cmp', 'samsung-cleaning'] },
        { text: '배치식은 섬세한 첨단 웨이퍼를 씻는 데는 알맞지 않고, 매엽식보다 자동화도 어렵습니다.', cite: ['hynix-clean-cmp', 'mks-wet-cleaning'] },
        { text: '메가소닉은 터지는 기포가 섬세한 구조를 손상시킬 수 있어 65nm 이후 첨단 공정에서는 거의 쓰이지 않게 되었습니다.', cite: ['semieng-cleaning-3d'] },
      ],
    },
    {
      heading: '건식 세정',
      points: [
        { text: '건식 세정은 주로 감광막을 걷어 내는 스트립과 남은 찌꺼기를 없애는 디스컴(descum)에 씁니다.', cite: ['mks-dry-cleaning'] },
        { text: '플라즈마의 라디칼이 감광막 같은 유기 잔류물과 반응해 탄소산화물과 물로 바꿔 없앱니다.', cite: ['mks-dry-cleaning'] },
      ],
    },
  ],
  gaps: [
    '세정 횟수는 출처마다 표현이 다릅니다(다른 공정의 약 2배 / 전체 단계의 30~40% / 수백 개). 정확한 횟수는 공정마다 다릅니다.',
    'SC-1이 유기물을 없앤다는 설명, 마랑고니 건조·워터마크 결함은 확인한 출처에서 찾지 못했습니다.',
  ],
}
