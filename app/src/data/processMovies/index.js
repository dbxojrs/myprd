// 공정 애니메이션의 장면 제목과 자막(문장마다 출처 키). 키는 processes.js의 공정 id입니다.
// 그림은 components/movie/scenes/에 같은 id로 있습니다.
const modules = import.meta.glob('./*.js', { eager: true })
export const processMovies = Object.fromEntries(
  Object.entries(modules)
    .filter(([path]) => !path.endsWith('/index.js'))
    .map(([, m]) => [m.default.id, m.default]),
)

// 목차: 영상처럼 "지금 어느 공정인지"를 보여 주는 묶음. 순서는 실제 공정 순서입니다.
export const CHAPTERS = [
  { title: '반도체 기초', ids: ['b-atom', 'b-doping', 'b-pn', 'b-transistor', 'b-mosfet', 'b-cmos', 'b-evolution'] },
  { title: '전공정 8대 공정', ids: ['wafer-make', 'oxidation', 'photo', 'etch', 'deposition', 'ion-implant', 'metallization', 'eds'] },
  { title: '전공정 반복 공정', ids: ['cleaning', 'cmp'] },
  { title: '후공정(PKG·TEST)', ids: ['backgrind', 'wafer-saw', 'die-attach', 'wire-bond', 'molding', 'marking', 'package-saw', 'test'] },
  { title: '첨단 패키징', ids: ['bumping', 'flipchip-bond', 'underfill', 'rdl', 'tsv'] },
]
