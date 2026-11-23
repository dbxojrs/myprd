// 공정별 자세한 설명(쉽게 보기 · 자세히 보기). 키는 processes.js의 공정 id입니다.
// 문장마다 cite: ['출처 키'](data/sourceCatalog.js)를 붙입니다. 출처가 없는 문장은 넣지 않습니다.
const modules = import.meta.glob('./*.js', { eager: true })
export const explainers = Object.fromEntries(
  Object.entries(modules)
    .filter(([path]) => !path.endsWith('/index.js'))
    .map(([, m]) => [m.default.id, m.default]),
)
