// 문제은행: 설명 문장(data/explainers)을 근거로 직접 작성한 원리·이유 문제. 파일마다 { explainer, reviewed, questions }.
// 문제마다 basis(근거 문장 원문)와 cite(그 문장의 출처)를 붙이며, scripts/check-qbank.mjs가 설명 파일과 대조합니다. 모두 검수 전입니다.
const modules = import.meta.glob('./*.js', { eager: true })
export const QUESTION_BANK = Object.entries(modules)
  .filter(([path]) => !path.endsWith('/index.js'))
  .map(([, m]) => m.default)
  .sort((a, b) => a.explainer.localeCompare(b.explainer))
