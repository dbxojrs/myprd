// CMP·평탄화 자세한 설명. 원문을 옮기지 않고 풀어 썼습니다. 문장마다 출처 키(data/sourceCatalog.js). (검수 전)
// 출처 원문을 내려받아 인용문과 대조해 확인했습니다(2026-11-26).
export default {
  id: 'cmp',
  reviewed: false,
  checked: '2026-11-26',
  analogy: null,
  easy: [
    { text: '막을 여러 번 쌓으면 웨이퍼 표면이 울퉁불퉁해집니다. CMP는 이 표면을 갈아 평평하게 만듭니다.', cite: ['hynix-clean-cmp'] },
    { text: '웨이퍼를 패드에 눌러 돌리면서, 연마 입자와 약품이 섞인 슬러리를 뿌려 함께 갈아 냅니다.', cite: ['hynix-clean-cmp', 'sandia-cmp-design'] },
    { text: '높이 솟은 곳이 더 큰 압력을 받아 먼저 깎이기 때문에 표면이 점점 평평해집니다.', cite: ['hynix-clean-cmp', 'sandia-cmp-design'] },
    { text: '갈고 나면 남은 슬러리와 가루를 브러시로 씻어 내고 말립니다.', cite: ['hynix-clean-cmp'] },
  ],
  sections: [
    {
      heading: '왜 평평하게 해야 할까',
      points: [
        { text: 'CMP는 원래 고밀도 집적회로의 여러 층 금속 배선을 만들려고 개발된 평탄화 공정입니다.', cite: ['sandia-cmp-design'] },
        { text: 'CMP는 여러 층의 금속 배선(다층 배선)을 만드는 데 가장 중요한 공정 가운데 하나입니다.', cite: ['seo-cmp-review'] },
        { text: '표면의 단차가 심하면 포토 공정과 증착·식각 공정에 문제가 생기는데, CMP가 이 단차를 없애 줍니다.', cite: ['sandia-cmp-design'] },
        { text: '회로 선폭이 줄면서 포토 공정에서 표면 균일도가 더 중요해졌고, 같은 크기의 결함도 수율에 더 큰 영향을 줍니다.', cite: ['hynix-clean-cmp'] },
      ],
    },
    {
      heading: '화학 + 기계: 둘 다 필요한 이유',
      points: [
        { text: '기계적으로만 갈면 표면 손상이 크고, 화학 식각만으로는 사방으로 똑같이 깎여(등방성) 평평해지지 않습니다. 그래서 두 힘을 함께 씁니다.', cite: ['sandia-cmp-design'] },
        { text: '압력·회전에서 오는 기계적 힘과 화학 작용이 합쳐지면 높은 곳이 낮은 곳보다 빨리 깎여, 시간이 지나며 표면이 평평해집니다.', cite: ['sandia-cmp-design'] },
        { text: '슬러리의 화학 성분은 표면 긁힘을 막고 공정 제어의 불안정을 보완하는 역할도 합니다.', cite: ['hynix-clean-cmp'] },
      ],
    },
    {
      heading: '장비와 소모품',
      points: [
        { text: '웨이퍼는 홈이 파인 폴리우레탄 패드에 일정한 힘으로 눌립니다.', cite: ['seo-cmp-review'] },
        { text: '패드를 빠르게 돌리면 슬러리가 패드의 홈과 작은 구멍 안으로 실려 들어갑니다.', cite: ['seo-cmp-review'] },
        { text: '절연막용 슬러리에는 연마 입자, 분산제, 보호제, pH 조절제, 탈이온수가 들어갑니다.', cite: ['seo-cmp-review'] },
        { text: '패드 말고도 패드 컨디셔너, 웨이퍼를 잡는 캐리어, 리테이닝 링이 CMP 소모품입니다.', cite: ['seo-cmp-review'] },
        { text: 'CMP 장비는 연마부(폴리셔)와 세정부로 나뉩니다. 연마부에서는 웨이퍼와 패드 위에 슬러리를 뿌려 갈아 냅니다.', cite: ['hynix-clean-cmp'] },
      ],
    },
    {
      heading: '얼마나 깎이나: 프레스턴 식',
      points: [
        { text: '프레스턴 식은 깎이는 속도(MRR)가 계수 × 압력 × 상대 속도라고 봅니다(MRR = KPV). 누르는 힘이나 회전 속도를 키우면 더 빨리 깎인다는 뜻입니다.', cite: ['seo-cmp-review'] },
        { text: '다만 이 식은 압력·속도에 정비례한다고 가정해서, 실제 CMP에서 보이는 비선형 연마는 설명하지 못합니다.', cite: ['seo-cmp-review'] },
        { text: '금속 CMP는 산화제·착화제·부식 억제제가 있을 때 금속막이 보이는 전기화학적 성질에 따라 결과가 달라집니다.', cite: ['seo-cmp-review'] },
      ],
    },
    {
      heading: '다마신과 대표 불량',
      points: [
        { text: '다마신은 홈(트렌치)에 원하는 재료를 채운 뒤 넘친 부분을 CMP로 갈아내는 방식으로, 일반 식각으로 무늬를 만들기 어려운 구리·텅스텐 같은 재료에 씁니다.', cite: ['sandia-cmp-design'] },
        { text: '회로 패턴의 밀도에 따라 평탄화되는 정도가 달라, 칩 안에서도 지역마다 남는 막 두께가 달라질 수 있습니다(패턴 밀도 효과).', cite: ['mit-cmp-pattern'] },
        { text: '구리 다마신에서는 금속 배선이 접시처럼 오목하게 패이는 디싱(dishing)이 문제가 됩니다.', cite: ['mit-cmp-pattern'] },
        { text: '배선이 촘촘한 영역에서는 배선 사이 절연막이 함께 깎여 나가는 이로전(erosion)이 생깁니다.', cite: ['mit-cmp-pattern'] },
        { text: '구리와 배리어를 확실히 걷어 내려고 더 가는 과연마(over-polish) 단계에서 디싱과 이로전이 크게 생길 수 있습니다.', cite: ['mit-cmp-pattern'] },
        { text: 'CMP에서 생기는 긁힘(스크래치) 결함을 줄이는 것이 중요한 개선 목표입니다.', cite: ['hynix-clean-cmp'] },
      ],
    },
    {
      heading: 'CMP 후 세정',
      points: [
        { text: '남은 입자·이물·긁힘·부식 같은 결함을 연마 중에 모두 막을 수는 없어서, CMP 후 세정이 꼭 필요한 단계가 되었습니다.', cite: ['seo-cmp-review'] },
        { text: '연마가 끝나면 브러시로 습식 세정을 해서 남은 물질을 없애고, 이어서 건조합니다.', cite: ['hynix-clean-cmp'] },
      ],
    },
  ],
  gaps: [
    '노광 초점심도(DOF)와 CMP의 관계, 연마 종점 검출(endpoint) 방법, 패드 컨디셔너가 하는 일은 확인한 출처에서 설명을 찾지 못했습니다.',
    '웨이퍼 전체 두께 균일도 수치, 압력·회전 속도의 실제 범위는 다루지 않았습니다.',
  ],
}
