// 개념 그림 데이터. 삼성전자 반도체 뉴스룸 「[반도체 8대 공정]」 시리즈(A판, 2017–2018)의 그림이 가르치는 개념을
// 이 앱이 글 내용만 보고 새로 그린 움직이는 그림으로 보여줍니다. 원본 그림의 구도는 따라 그리지 않습니다(PRD 이미지 정책).
// 근거 노트: review/samsung-figures.md. 모두 설명 출처(explain)이며 검수 전입니다.
//
// 형식: { [공정 id]: [{ id, title, teach, points: [], article }] }
//   id: 그림 id(components/concepts/index.js의 키) · teach: 그 그림이 가르치는 핵심 한두 문장(원문 요약)
//   points: 그림 아래 짧은 설명들 · article: ARTICLES 키(원본 그림이 있는 글)

export const ARTICLES = {
  a1: { title: '[반도체 8대 공정] 1탄, ‘웨이퍼’란 무엇일까요?', date: '2017.04.06', url: 'https://news.samsungsemiconductor.com/kr/%eb%b0%98%eb%8f%84%ec%b2%b4-8%eb%8c%80-%ea%b3%b5%ec%a0%95-1%ed%83%84-%ec%9b%a8%ec%9d%b4%ed%8d%bc%eb%9e%80-%eb%ac%b4%ec%97%87%ec%9d%bc%ea%b9%8c%ec%9a%94/' },
  a2: { title: '[반도체 8대 공정] 2탄, 웨이퍼 표면을 보호하는 산화공정', date: '2017.06.05', url: 'https://news.samsungsemiconductor.com/kr/%eb%b0%98%eb%8f%84%ec%b2%b4-8%eb%8c%80-%ea%b3%b5%ec%a0%95-2%ed%83%84-%ec%9b%a8%ec%9d%b4%ed%8d%bc-%ed%91%9c%eb%a9%b4%ec%9d%84-%eb%b3%b4%ed%98%b8%ed%95%98%eb%8a%94-%ec%82%b0%ed%99%94%ea%b3%b5/' },
}

export const CONCEPTS = {
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
}
