// 개념 그림 데이터. 삼성전자 반도체 뉴스룸 「[반도체 8대 공정]」 시리즈(A판, 2017–2018)의 그림이 가르치는 개념을
// 이 앱이 글 내용만 보고 새로 그린 움직이는 그림으로 보여줍니다. 원본 그림의 구도는 따라 그리지 않습니다(PRD 이미지 정책).
// 근거 노트: review/samsung-figures.md. 모두 설명 출처(explain)이며 검수 전입니다.
//
// 형식: { [공정 id]: [{ id, title, teach, points: [], article }] }
//   id: 그림 id(components/concepts/index.js의 키) · teach: 그 그림이 가르치는 핵심 한두 문장(원문 요약)
//   points: 그림 아래 짧은 설명들 · article: ARTICLES 키(원본 그림이 있는 글) · also: 함께 쓴 다른 판본 글(선택)

export const ARTICLES = {
  a1: { title: '[반도체 8대 공정] 1탄, ‘웨이퍼’란 무엇일까요?', date: '2017.04.06', url: 'https://news.samsungsemiconductor.com/kr/%eb%b0%98%eb%8f%84%ec%b2%b4-8%eb%8c%80-%ea%b3%b5%ec%a0%95-1%ed%83%84-%ec%9b%a8%ec%9d%b4%ed%8d%bc%eb%9e%80-%eb%ac%b4%ec%97%87%ec%9d%bc%ea%b9%8c%ec%9a%94/' },
  a2: { title: '[반도체 8대 공정] 2탄, 웨이퍼 표면을 보호하는 산화공정', date: '2017.06.05', url: 'https://news.samsungsemiconductor.com/kr/%eb%b0%98%eb%8f%84%ec%b2%b4-8%eb%8c%80-%ea%b3%b5%ec%a0%95-2%ed%83%84-%ec%9b%a8%ec%9d%b4%ed%8d%bc-%ed%91%9c%eb%a9%b4%ec%9d%84-%eb%b3%b4%ed%98%b8%ed%95%98%eb%8a%94-%ec%82%b0%ed%99%94%ea%b3%b5/' },
  a6: { title: '[반도체 8대 공정] 6탄, 반도체에 전기적 특성을 입히다! 증착&이온주입 공정', date: '2018.02.22', url: 'https://news.samsungsemiconductor.com/kr/%eb%b0%98%eb%8f%84%ec%b2%b4-8%eb%8c%80-%ea%b3%b5%ec%a0%95-6%ed%83%84-%eb%b0%98%eb%8f%84%ec%b2%b4%ec%97%90-%ec%a0%84%ea%b8%b0%ec%a0%81-%ed%8a%b9%ec%84%b1%ec%9d%84-%ec%9e%85%ed%9e%88%eb%8b%a4/' },
  b6: { title: '반도체 8대 공정 6탄. 반도체가 원하는 전기적 특성을 갖게 하려면?', date: '2012.11.16', url: 'https://news.samsungsemiconductor.com/kr/%eb%b0%98%eb%8f%84%ec%b2%b4-8%eb%8c%80-%ea%b3%b5%ec%a0%95-6%ed%83%84-%eb%b0%98%eb%8f%84%ec%b2%b4%ea%b0%80-%ec%9b%90%ed%95%98%eb%8a%94-%ec%a0%84%ea%b8%b0%ec%a0%81-%ed%8a%b9%ec%84%b1%ec%9d%84-%ea%b0%96/' },
  a7: { title: '[반도체 8대 공정] 7탄, 전기가 통하는 길을 만드는 ‘금속 배선 공정’', date: '2018.03.19', url: 'https://news.samsungsemiconductor.com/kr/%eb%b0%98%eb%8f%84%ec%b2%b4-8%eb%8c%80-%ea%b3%b5%ec%a0%95-7%ed%83%84-%ec%a0%84%ea%b8%b0%ea%b0%80-%ed%86%b5%ed%95%98%eb%8a%94-%ea%b8%b8%ec%9d%84-%eb%a7%8c%eb%93%9c%eb%8a%94-%ea%b8%88/' },
  b7: { title: '반도체 8대 공정 7탄. 전기를 통하게 하는 마지막 작업, 금속 배선 공정', date: '2012.12.05', url: 'https://news.samsungsemiconductor.com/kr/%eb%b0%98%eb%8f%84%ec%b2%b4-8%eb%8c%80-%ea%b3%b5%ec%a0%95-7%ed%83%84-%ec%a0%84%ea%b8%b0%eb%a5%bc-%ed%86%b5%ed%95%98%ea%b2%8c-%ed%95%98%eb%8a%94-%eb%a7%88%ec%a7%80%eb%a7%89-%ec%9e%91%ec%97%85/' },
  a8: { title: '[반도체 8대 공정] 8탄, 완벽한 반도체로 태어나기 위한 첫 번째 테스트 ‘EDS공정’', date: '2018.05.09', url: 'https://news.samsungsemiconductor.com/kr/%eb%b0%98%eb%8f%84%ec%b2%b4-8%eb%8c%80-%ea%b3%b5%ec%a0%95-8%ed%83%84-%ec%99%84%eb%b2%bd%ed%95%9c-%eb%b0%98%eb%8f%84%ec%b2%b4%eb%a1%9c-%ed%83%9c%ec%96%b4%eb%82%98%ea%b8%b0-%ec%9c%84%ed%95%9c/' },
  a9: { title: '[반도체 8대 공정] 9탄, 외부환경으로부터 반도체를 보호하는 패키징 (Packaging) 공정', date: '2018.10.12', url: 'https://news.samsungsemiconductor.com/kr/%eb%b0%98%eb%8f%84%ec%b2%b4-8%eb%8c%80-%ea%b3%b5%ec%a0%95-9%ed%83%84-%ec%99%b8%eb%b6%80%ed%99%98%ea%b2%bd%ec%9c%bc%eb%a1%9c%eb%b6%80%ed%84%b0-%eb%b0%98%eb%8f%84%ec%b2%b4%eb%a5%bc-%eb%b3%b4%ed%98%b8/' },
  b1: { title: '반도체 8대 공정 1탄. 반도체 집적회로의 핵심재료, 웨이퍼란 무엇일까요?', date: '2012.08.02', url: 'https://news.samsungsemiconductor.com/kr/%eb%b0%98%eb%8f%84%ec%b2%b4-8%eb%8c%80-%ea%b3%b5%ec%a0%95-1%ed%83%84-%eb%b0%98%eb%8f%84%ec%b2%b4-%ec%a7%91%ec%a0%81%ed%9a%8c%eb%a1%9c%ec%9d%98-%ed%95%b5%ec%8b%ac%ec%9e%ac%eb%a3%8c-%ec%9b%a8%ec%9d%b4/' },
  a3: { title: '[반도체 8대 공정] 3탄, 전자산업의 혁명! 집적회로', date: '2017.07.19', url: 'https://news.samsungsemiconductor.com/kr/%eb%b0%98%eb%8f%84%ec%b2%b4-8%eb%8c%80-%ea%b3%b5%ec%a0%95-3%ed%83%84-%ec%a0%84%ec%9e%90%ec%82%b0%ec%97%85%ec%9d%98-%ed%98%81%eb%aa%85-%ec%a7%91%ec%a0%81%ed%9a%8c%eb%a1%9c/' },
  a4: { title: '[반도체 8대 공정] 4탄, 웨이퍼에 회로를 그려 넣는 포토공정', date: '2017.09.22', url: 'https://news.samsungsemiconductor.com/kr/%eb%b0%98%eb%8f%84%ec%b2%b4-8%eb%8c%80-%ea%b3%b5%ec%a0%95-4%ed%83%84-%ec%9b%a8%ec%9d%b4%ed%8d%bc%ec%97%90-%ed%9a%8c%eb%a1%9c%eb%a5%bc-%ea%b7%b8%eb%a0%a4-%eb%84%a3%eb%8a%94-%ed%8f%ac%ed%86%a0/' },
  b4: { title: '반도체 8대 공정 4탄. 웨이퍼에 한 폭의 세밀화를 그려 넣는 포토공정(Photo)', date: '2012.09.26', url: 'https://news.samsungsemiconductor.com/kr/%eb%b0%98%eb%8f%84%ec%b2%b4-8%eb%8c%80-%ea%b3%b5%ec%a0%95-4%ed%83%84-%ec%9b%a8%ec%9d%b4%ed%8d%bc%ec%97%90-%ed%95%9c-%ed%8f%ad%ec%9d%98-%ec%84%b8%eb%b0%80%ed%99%94%eb%a5%bc-%ea%b7%b8%eb%a0%a4/' },
  a5: { title: '[반도체 8대 공정] 5탄, 반도체 회로패턴의 완성 ‘식각 공정’', date: '2018.01.04', url: 'https://news.samsungsemiconductor.com/kr/%eb%b0%98%eb%8f%84%ec%b2%b4-8%eb%8c%80-%ea%b3%b5%ec%a0%95-5%ed%83%84-%eb%b0%98%eb%8f%84%ec%b2%b4-%ed%9a%8c%eb%a1%9c%ed%8c%a8%ed%84%b4%ec%9d%98-%ec%99%84%ec%84%b1-%ec%8b%9d%ea%b0%81-%ea%b3%b5/' },
}

export const CONCEPTS = {
  'wafer-make': [
    {
      id: 'wafer-steps',
      title: '웨이퍼가 만들어지는 3단계',
      teach: '실리콘 원료를 녹여 결정 성장시킨 기둥(잉곳)을 다이아몬드 톱으로 얇게 썰고, 연마액과 연마 장비로 표면을 매끄럽게 갈아냅니다.',
      points: [
        '① 잉곳(Ingot): 녹인 실리콘 표면에 단결정 실리콘(seed)을 접촉시키고 천천히 끌어올려 키움',
        '② 슬라이싱(Wafer Slicing): 다이아몬드 톱으로 균일한 두께로 얇게 썲 · 잉곳 지름이 웨이퍼 크기를 결정',
        '③ 연마(Lapping & Polishing): 연마액과 연마 장비로 표면을 매끄럽게',
        '가공 전의 웨이퍼 = 베어 웨이퍼(Bare wafer)',
      ],
      article: 'a1',
      also: 'b1', // seed를 끌어올리는 과정은 B판 1탄 원문
    },
    {
      id: 'wafer-parts',
      title: '웨이퍼 부위 이름',
      teach: '웨이퍼 위 사각형 하나하나가 IC칩인 다이(Die)이고, 다이 사이에는 다이아몬드 톱으로 잘라낼 폭인 스크라이브 라인을 둡니다. 플랫존과 노치는 가공할 때의 기준입니다.',
      points: [
        '다이(Die): 전자 회로가 집적된 IC칩 하나',
        '스크라이브 라인(Scribe Line): 다이를 잘라낼 수 있게 둔 폭',
        '플랫존(Flat Zone): 웨이퍼 가공 시 기준선',
        '노치(Notch): 노치 웨이퍼가 플랫존 웨이퍼보다 다이를 더 많이 만들 수 있어 효율이 높음',
      ],
      article: 'a1',
    },
    {
      id: 'wafer-die-device',
      title: '웨이퍼 → 다이 → 소자',
      teach: '작은 반도체 칩(다이) 안에는 다이오드, 트랜지스터, 캐패시터, 저항 같은 전자 부품이 수천 개에서 수백만 개 이상 들어 있습니다.',
      points: ['트랜지스터: 전원을 켜고 끄는 스위치', '캐패시터: 전하를 충전해 보관하는 창고', '저항: 전류의 흐름을 조절', '다이오드: 신호를 고르게 전함'],
      article: 'a3',
    },
  ],
  photo: [
    {
      id: 'photomask',
      title: '포토마스크(Photo Mask)',
      teach: '순도가 높은 석영(Quartz) 기판 위에 크롬(Cr)으로 미세 회로를 그린 것이 포토마스크입니다. 세밀한 패터닝을 위해 회로보다 크게 만들고, 렌즈로 빛을 축소해 비춥니다.',
      points: ['석영 기판: 빛이 통과하는 판', '크롬(Cr) 회로: 빛을 가리는 무늬', '마스크는 실제 회로보다 크게 제작'],
      article: 'a4',
    },
    {
      id: 'pr-coat',
      title: '① 감광액 도포',
      teach: '산화막이 생긴 웨이퍼 표면에 빛에 민감한 물질인 감광액(PR, Photo Resist)을 골고루 바릅니다. 웨이퍼를 인화지로 만드는 단계입니다.',
      points: ['감광액(PR): 빛에 민감한 물질', '포토공정 = 감광액 도포 → 노광 → 현상', '흑백 사진의 인화지와 비슷한 역할'],
      article: 'a4',
    },
    {
      id: 'exposure',
      title: '② 노광: 축소해서 찍고 반복',
      teach: '노광장비(Stepper)로 회로 패턴이 담긴 마스크에 빛을 통과시켜 웨이퍼에 회로를 찍어냅니다. 마스크를 웨이퍼보다 크게 만들어 먼지 크기도 함께 축소되게 하고, 한 칩씩 축소 촬영을 반복해 웨이퍼 전면을 찍습니다.',
      points: ['노광: 빛을 선택적으로 비추는 과정', '마스크가 크면 마스크 위 먼지도 함께 작아짐', '반복 축소 촬영으로 웨이퍼 전면을 주사'],
      article: 'b4',
    },
    {
      id: 'develop-pn',
      title: '③ 현상: 양성 vs 음성 감광액',
      teach: '웨이퍼에 현상액을 뿌려 노광된 영역과 노광되지 않은 영역을 선택적으로 제거해 회로 패턴을 만듭니다. 양성 감광액은 노광되지 않은 영역을 남기고, 음성 감광액은 노광된 영역만 남깁니다.',
      points: ['양성(Positive) 감광액: 빛 받은 곳이 제거됨', '음성(Negative) 감광액: 빛 받은 곳만 남음', '필름의 상을 인화지에 인화하는 것과 비슷'],
      article: 'a4',
    },
  ],
  etch: [
    {
      id: 'etch-principle',
      title: '식각 원리: 감광액이 덮은 곳만 남긴다',
      teach: '포토공정에서 만든 감광액 부분은 남겨 둔 채 나머지를 부식액(etchant)으로 벗겨 내 회로를 만듭니다. 식각이 끝나면 감광액도 제거합니다.',
      points: ['부식액(etchant): 액체 또는 기체', '감광액(PR)이 덮은 곳은 보호됨', '식각 후 감광액 제거 → 회로 패턴 완성'],
      article: 'a5',
    },
    {
      id: 'wet-dry',
      title: '습식 식각 vs 건식 식각',
      teach: '습식 식각(Wet Etching)은 용액의 화학 반응으로, 건식 식각(Dry Etching)은 반응성 기체·이온 등으로 특정 부위를 제거합니다. 건식은 비용이 비싸고 방법이 까다롭지만 쓰임이 늘고 있습니다.',
      points: ['습식: 용액 + 화학 반응', '건식: 반응성 기체·이온', '건식은 습식보다 비싸고 까다롭지만 확대되는 추세'],
      article: 'a5',
    },
    {
      id: 'plasma-gen',
      title: '플라즈마가 생기는 과정',
      teach: '대기압보다 낮은 압력의 진공 챔버에 가스를 넣고 전기 에너지를 주면 플라즈마가 생깁니다. 플라즈마에서 해리된 반응성 원자(라디칼)가 막질 원자와 만나 휘발성을 띠며 표면에서 떨어져 나갑니다.',
      points: ['진공 챔버 + 가스 + 전기 에너지', '자유전자 충돌 → 이온화 → 연쇄 반응(Avalanche)', '라디칼이 막과 반응해 휘발되어 떨어져 나감'],
      article: 'a5',
    },
  ],
  oxidation: [
    {
      id: 'oxide-roles',
      title: '산화막(SiO₂)이 하는 일',
      teach: '웨이퍼 표면에 입힌 산화막은 회로 사이 누설전류를 막는 절연막이고, 이온주입 때는 확산 방지막, 식각 때는 식각 방지막이 됩니다.',
      points: ['절연막: 회로와 회로 사이 누설전류 차단', '확산 방지막: 이온주입에서 막이 있는 곳은 이온이 못 들어감', '식각 방지막: 필요한 부분이 잘못 깎이는 것을 막음'],
      article: 'a2',
    },
    {
      id: 'dry-wet',
      title: '건식 산화 vs 습식 산화',
      teach: '건식은 산소(O₂)만 써서 느리게 자라지만 얇고 전기적 특성이 좋은 막을, 습식은 산소와 수증기(H₂O)를 함께 써서 빠르고 두껍지만 밀도가 낮은 막을 만듭니다.',
      points: ['열산화: 800~1,200℃ 고온에서 얇고 균일한 막', '습식은 같은 조건에서 건식보다 약 5~10배 두꺼움', '건식 = 얇고 전기적 특성이 좋음 · 습식 = 빠르고 두껍지만 밀도가 낮음'],
      article: 'a2',
    },
  ],
  deposition: [
    {
      id: 'thin-film-stack',
      title: '박막이 층층이 쌓이는 증착',
      teach: '회로 간의 구분과 연결, 보호 역할을 하는 1μm 이하의 얇은 막을 박막이라 하고, 웨이퍼 위에 분자·원자 단위의 박막을 입히는 과정을 증착이라고 합니다.',
      points: ['박막은 금속막(전도)층과 절연막층으로 나뉨', '고층 빌딩처럼 높고 견고하게 층층이 쌓임 (2012년판 6탄)', '반경 100mm 웨이퍼에 1μm 막 = 반경 100m 운동장에 모래를 1mm 이하로 고르게 쌓는 수준 (2012년판 6탄 비유)'],
      article: 'a6',
      also: 'b6',
    },
    {
      id: 'pvd-cvd',
      title: '물리적 증착(PVD) vs 화학적 증착(CVD)',
      teach: 'PVD는 화학반응 없이 주로 금속 박막을 입히고, CVD는 가스의 화학 반응으로 만든 입자를 쏘아 도체·부도체·반도체 박막 모두에 씁니다.',
      points: ['PVD: 금속 박막 증착에 주로 사용, 화학반응 없음', 'CVD: 가스의 화학 반응으로 입자를 만들어 증착', '플라즈마 CVD: 저온 형성, 두께 균일도 조절, 대량 처리'],
      article: 'a6',
    },
  ],
  'ion-implant': [
    {
      id: 'n-p-doping',
      title: '이온주입으로 n형·p형 만들기',
      teach: '불순물 이온을 미세한 가스입자로 만들어 원하는 깊이만큼 웨이퍼 전면에 균일하게 넣습니다. 15족 원소를 넣으면 n형, 13족 원소를 넣으면 p형 반도체가 됩니다.',
      points: ['15족: 인(P), 비소(As) → n형 반도체', '13족: 붕소(B) → p형 반도체', '원하는 깊이만큼 웨이퍼 전면에 균일하게 주입'],
      article: 'a6',
    },
  ],
  metallization: [
    {
      id: 'metal-conditions',
      title: '배선 금속이 갖춰야 할 조건',
      teach: '회로 패턴을 따라 금속선을 잇는 배선 재료는 웨이퍼와 잘 붙고 전기저항이 낮으며 안정적이고 다루기 쉬워야 합니다.',
      points: ['1) 웨이퍼와의 부착성 2) 낮은 전기저항 3) 열적·화학적 안정성', '4) 패턴 형성의 용이성 5) 높은 신뢰성 6) 제조 가격', '대표 금속: 알루미늄(Al), 티타늄(Ti), 텅스텐(W)'],
      article: 'b7',
    },
    {
      id: 'al-barrier',
      title: '알루미늄 배선과 베리어 메탈',
      teach: '알루미늄은 실리콘과 만나면 서로 섞이려 해서, 접합면 사이에 장벽 역할을 하는 베리어 메탈을 먼저 증착합니다. 좁은 접점(contact) 구멍에는 텅스텐을 CVD로 채웁니다.',
      points: ['알루미늄: 산화막과 부착성이 좋고 가공성이 뛰어남', '베리어 메탈: 알루미늄과 실리콘이 섞이지 않게 막음', '좁은 hole 형상의 접점은 텅스텐(W)을 CVD로 (2012년판 7탄)'],
      article: 'a7',
      also: 'b7',
    },
  ],
  eds: [
    {
      id: 'eds-flow',
      title: 'EDS 4단계',
      teach: '프로브 카드의 미세한 핀이 웨이퍼와 접촉해 전기를 보내고, 그 신호로 칩의 양품·불량을 가립니다. EDS는 FAB 공정과 패키지 공정 사이에 진행됩니다.',
      points: ['1단계 ET Test & WBI: 전기 특성 측정, 열과 전압으로 잠재 불량 찾기', '2단계 Hot/Cold Test · 3단계 Repair / Final Test', '4단계 Inking: 불량 칩 표시(현재는 Data로 판별)'],
      article: 'a8',
    },
    {
      id: 'wafer-map-yield',
      title: '웨이퍼 맵과 수율',
      teach: '수율은 웨이퍼 한 장에 설계된 최대 칩 개수 대비 생산된 양품(Prime Good) 칩의 개수를 백분율로 계산한 것입니다.',
      points: ['수율 = 양품 칩 수 ÷ 설계된 최대 칩 수 × 100', '수선 가능한 칩은 Repair로 양품화', '불량 칩을 미리 골라 패키징·테스트 효율을 높임'],
      article: 'a8',
    },
  ],
  'wafer-saw': [
    {
      id: 'pkg-flow',
      title: '패키징 공정 순서',
      teach: '패키징은 칩이 외부와 신호를 주고받을 길을 만들고 외부환경으로부터 보호하는 과정입니다. 웨이퍼 절단 → 칩 접착 → 금선 연결 → 성형 → 패키지 테스트 순서로 진행됩니다.',
      points: ['웨이퍼 절단: 스크라이브 라인을 따라 다이아몬드 톱·레이저로', '칩 접착: 리드프레임 또는 PCB 위로', '금선 연결 → 성형(화학 수지로 밀봉) → 패키지 테스트'],
      article: 'a9',
    },
  ],
  'wire-bond': [
    {
      id: 'wb-vs-flipchip',
      title: '와이어본딩 vs 플립칩',
      teach: '와이어본딩은 칩의 접점과 기판의 접점을 가는 금선으로 잇고, 플립칩은 볼 모양의 범프(Bump)로 칩과 기판을 직접 연결해 전기 저항이 작고 빠르며 작게 만들 수 있습니다.',
      points: ['와이어본딩: 가는 금선으로 칩과 기판 접점 연결', '플립칩: 범프로 직접 연결 → 저항 작고 빠름, 작은 폼팩터', '범프 소재: 주로 금(Au) 또는 솔더(Solder)'],
      article: 'a9',
    },
  ],
}

// 같은 그림을 쓰는 공정
CONCEPTS['flipchip-bond'] = CONCEPTS['wire-bond']
