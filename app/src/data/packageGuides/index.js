// 패키지 타입별 안내(구조 · 후공정 순서 · 다른 타입과 비교). 키는 packages.js의 패키지 id입니다.
// 문장마다 cite: ['출처 키'](data/sourceCatalog.js)를 붙입니다. 출처가 없는 문장은 넣지 않습니다.
// flow의 각 단계는 processes.js의 공정 id를 쓰거나, 공정 페이지가 없는 단계는 name만 씁니다.
const modules = import.meta.glob('./*.js', { eager: true })
export const packageGuides = Object.fromEntries(
  Object.entries(modules)
    .filter(([path]) => !path.endsWith('/index.js'))
    .map(([, m]) => [m.default.id, m.default]),
)
