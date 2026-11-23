// 현장 실무 훈련 시나리오 목록. 이 폴더에 시나리오 파일(.js)을 추가하면 자동으로 목록에 나옵니다.
const modules = import.meta.glob('./*.js', { eager: true })
export const FIELD_CASES = Object.entries(modules)
  .filter(([path]) => !path.endsWith('/index.js'))
  .map(([, m]) => m.default)
  .sort((a, b) => a.id.localeCompare(b.id))

export const findFieldCase = (id) => FIELD_CASES.find((c) => c.id === id)
export const fieldCasesFor = (processId) => FIELD_CASES.filter((c) => c.process === processId)
