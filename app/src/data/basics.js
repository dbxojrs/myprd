// 반도체 기초 단원 목록. 공정을 보기 전에 알아 둘 기본 지식입니다.
// 단원마다 애니메이션 자막(data/processMovies/<id>.js), 그림(components/movie/scenes/<id>.jsx),
// 자세한 설명(data/explainers/<id>.js)이 같은 id로 있습니다. 설명 문장마다 출처가 붙습니다.
export const BASICS = [
  { id: 'b-atom', title: '원자와 전자', short: '실리콘의 바깥 전자 4개와 공유 결합' },
  { id: 'b-doping', title: '도핑: N형과 P형', short: '불순물을 넣어 전기가 통하게' },
  { id: 'b-pn', title: 'PN 접합과 다이오드', short: '한쪽으로만 흐르는 전기, LED' },
  { id: 'b-transistor', title: '트랜지스터', short: '작은 신호로 큰 전류를 켜고 끄기' },
  { id: 'b-mosfet', title: 'MOSFET', short: '게이트 전압으로 길(채널)을 여닫기' },
  { id: 'b-cmos', title: 'CMOS', short: 'NMOS와 PMOS를 짝지어 전력 아끼기' },
  { id: 'b-evolution', title: '트랜지스터의 진화', short: '평면형 → FinFET → GAA' },
]
export const findBasic = (id) => BASICS.find((b) => b.id === id) ?? null
