import { lineOptions, lineRules } from '../data/lineSim.js'

const RANK = { good: 0, warn: 1, bad: 2 }

// selections: { [processId]: { [variableId]: choiceIndex } }
// 규칙표만으로 계산하므로 같은 선택이면 항상 같은 결과가 나옵니다.
export function judgeLine(processIds, selections) {
  const items = []

  for (const processId of processIds) {
    for (const variable of lineOptions[processId] ?? []) {
      const index = selections[processId]?.[variable.id]
      if (index === undefined) continue
      const choice = variable.choices[index]
      items.push({
        processId,
        variable,
        index,
        choice,
        baseGrade: choice.grade,
        grade: choice.grade,
        rule: null,
      })
    }
  }

  for (const rule of lineRules) {
    const { when, target } = rule
    if (selections[when.process]?.[when.variable] !== when.choice) continue
    const item = items.find(
      (it) =>
        it.processId === target.process &&
        it.variable.id === target.variable &&
        (target.choice === null || it.index === target.choice),
    )
    if (item && RANK[rule.grade] > RANK[item.grade]) {
      item.grade = rule.grade
      item.rule = rule
    }
  }

  const worst = items.reduce((max, it) => Math.max(max, RANK[it.grade]), 0)
  const verdict = worst === 2 ? 'bad' : worst === 1 ? 'warn' : 'good'
  const problems = items.filter((it) => RANK[it.grade] === worst && worst > 0)

  return { verdict, items, problems }
}

// 한 공정 안에서만 등급을 봅니다. 공정 시뮬레이션(기능 4)에서 씁니다.
export function judgeProcess(processId, values) {
  return judgeLine([processId], { [processId]: values })
}
