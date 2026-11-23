// 공정 애니메이션의 장면 제목과 자막(문장마다 출처 키). 키는 processes.js의 공정 id입니다.
// 그림은 components/movie/scenes/에 같은 id로 있습니다.
const modules = import.meta.glob('./*.js', { eager: true })
export const processMovies = Object.fromEntries(
  Object.entries(modules)
    .filter(([path]) => !path.endsWith('/index.js'))
    .map(([, m]) => [m.default.id, m.default]),
)
