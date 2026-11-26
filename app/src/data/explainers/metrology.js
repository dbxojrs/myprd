// 계측·검사 자세한 설명. 원문을 옮기지 않고 풀어 썼습니다. 문장마다 출처 키(data/sourceCatalog.js). (검수 전)
// 출처 원문을 내려받아 인용문과 대조해 확인했습니다(2026-11-26).
export default {
  id: 'metrology',
  reviewed: false,
  checked: '2026-11-26',
  analogy: null,
  easy: [
    { text: '공정이 하나 끝날 때마다 웨이퍼를 재고 살펴봅니다. "측정할 수 없으면 관리할 수 없다"는 말처럼, 재야 공정을 제어할 수 있습니다.', cite: ['samsung-metrology'] },
    { text: '계측(메트롤로지)은 의도한 크기·두께대로 만들어졌는지 재는 일이고, 검사(인스펙션)는 원하지 않는 불량이나 먼지가 떨어졌는지 찾는 일입니다.', cite: ['samsung-metrology'] },
    { text: '대부분 웨이퍼에 빛을 쏘고 되돌아온 빛을 분석해 상태를 판단합니다.', cite: ['samsung-metrology'] },
  ],
  sections: [
    {
      heading: '왜 공정마다 잴까',
      points: [
        { text: '웨이퍼 한 장에서 정상 칩을 최대한 많이 얻으려면 공정마다 정확히 제어해야 하고, 그러려면 측정과 검사가 필요합니다.', cite: ['samsung-metrology'] },
        { text: '반도체 제조에서 계측은 연구·개발뿐 아니라 공정 제어에도 쓰입니다.', cite: ['nist-metrology-2018'] },
        { text: '어떤 제품은 제조 단계의 절반 넘게 측정이나 분석이 들어갑니다.', cite: ['nist-metrology-2018'] },
        { text: '층과 층은 정확히 맞물려야 해서, 1nm보다 작은 어긋남만으로도 칩이 동작하지 않을 수 있습니다.', cite: ['nist-overlay-sem'] },
      ],
    },
    {
      heading: '무엇을 재나 (계측)',
      points: [
        { text: '주로 재는 값은 임계 치수(CD, 무늬의 크기와 모양)와 막 두께입니다.', cite: ['nist-metrology-2018'] },
        { text: 'CD-SEM은 전자현미경으로 위에서 내려다본 이미지를 찍어 선폭 같은 치수를 잽니다.', cite: ['nist-metrology-2018'] },
        { text: '측정이 빨라서 CD를 잴 때는 빛의 산란을 이용하는 산란계측기가 주력 장비로 쓰입니다. 산란계측은 엘립소메트리를 특수하게 바꾼 방법입니다.', cite: ['nist-metrology-2018'] },
        { text: '오버레이 측정은 차례로 쌓은 패턴 층들이 서로 얼마나 어긋났는지를 구합니다.', cite: ['nist-metrology-2018'] },
        { text: '오버레이와 CD 측정은 집적회로 제조의 공정 제어에 꼭 필요합니다.', cite: ['nist-overlay-sem'] },
        { text: '단면 TEM처럼 이미지를 얻는 방법은 재는 소자 수가 너무 적어 통계적으로 의미 있는 결과를 얻기 어려울 수 있습니다.', cite: ['nist-metrology-2018'] },
      ],
    },
    {
      heading: '불량 찾기 (검사)',
      points: [
        { text: '결함은 수율과 제조 비용에 영향을 주기 때문에, 팹에서 결함 검사 장비가 점점 중요해지고 있습니다.', cite: ['oa-wafer-inspection-2022'] },
        { text: '광학 검사의 주된 목적은 결함을 선명하게 보는 것이 아니라 결함이 있는지, 어디 있는지를 찾는 것입니다.', cite: ['oa-wafer-inspection-2022'] },
        { text: '명시야(brightfield) 광학 검사는 한 번에 넓은 범위를 볼 수 있습니다. 무늬가 없는 웨이퍼는 주로 암시야(darkfield) 광학 검사로 봅니다.', cite: ['oa-wafer-inspection-2022'] },
        { text: '전자빔 검사는 1nm 크기의 작은 결함까지 찾을 수 있지만, 한 번에 보는 범위가 아주 좁아 느려서 생산 라인에서 쓰기 어렵습니다.', cite: ['oa-wafer-inspection-2022'] },
        { text: '결함의 종류를 가리려면 따로 SEM으로 들여다보는 리뷰가 필요합니다.', cite: ['oa-wafer-inspection-2022'] },
        { text: '찾은 결함 위치를 모아 웨이퍼 결함 지도(맵)를 만듭니다. 패터닝 단계가 늘어나면 검사 단계도 그만큼 늘어납니다.', cite: ['oa-wafer-inspection-2022'] },
      ],
    },
    {
      heading: '측정값으로 공정 관리하기 (SPC)',
      points: [
        { text: '반도체 공정에서 실험의 기본 단위는 실리콘 웨이퍼입니다. 반도체 공정은 변동이 여러 곳에서 생깁니다.', cite: ['nist-litho-case'] },
        { text: '모든 웨이퍼·모든 지점을 재지 않고 일부만 뽑아 잽니다. NIST의 리소그래피 사례에서는 웨이퍼마다 5개 지점을, 카세트(보통 24~25장)마다 3장을 쟀습니다.', cite: ['nist-litho-case'] },
        { text: '통계적 공정 관리(SPC)는 지금 공정에서 일어나는 일을 과거와 비교하는 것에서 출발합니다. 데이터를 모아 관리 한계와 비교하고, 한계를 벗어난 값은 따로 조사합니다.', cite: ['nist-spc-overview'] },
        { text: '정해 둔 관리 한계로 공정을 실시간 감시하는 단계를 Phase II라고 합니다.', cite: ['nist-spc-overview'] },
      ],
    },
  ],
  gaps: [
    '엘립소메트리·반사측정으로 막 두께를 재는 원리, 명시야와 암시야의 원리 차이는 확인한 출처에서 직접 설명을 찾지 못했습니다.',
    '측정값을 공정 조건 자동 보정(APC)에 쓰는 방법은 다루지 않았습니다.',
  ],
}
