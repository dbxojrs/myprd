import { SEVERITY } from '../data/machineSim.js'

// 고급 장비 시뮬레이터 판정. 규칙표(data/machineSim.js)만으로 계산합니다.

const matches = (when, values) => Object.entries(when).every(([key, levels]) => levels.includes(values[key]))

export function defaultValues(machine) {
  return Object.fromEntries([...machine.conditions, ...machine.controls].map((item) => [item.id, item.best]))
}

// 해당하는 규칙을 모두 찾아 심한 것부터 돌려줍니다. 같은 제목은 한 번만 보여줍니다.
export function findFindings(machine, values) {
  const seen = new Set()
  return machine.rules
    .filter((rule) => matches(rule.when, values))
    .sort((a, b) => SEVERITY[b.severity].rank - SEVERITY[a.severity].rank)
    .filter((rule) => {
      const key = `${rule.severity}:${rule.title}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
}

// 가동 결과. 알람이 있으면 sequence 순서상 가장 먼저 걸리는 알람에서 멈춥니다.
export function judge(machine, values) {
  const findings = findFindings(machine, values)
  const order = machine.sequence.map((step) => step.id)
  const alarms = findings.filter((f) => f.severity === 'alarm').sort((a, b) => order.indexOf(a.at) - order.indexOf(b.at))
  const alarm = alarms[0] ?? null
  const grade = alarm ? 'alarm' : findings[0]?.severity ?? 'good'
  const stopIndex = alarm ? order.indexOf(alarm.at) : order.length
  return {
    grade,
    alarm,
    stopIndex,
    // 알람으로 멈추면 그 알람만 보여주고, 다 돌았으면 불량·경고를 보여줍니다.
    findings: alarm ? [alarm] : findings,
    metrics: computeMetrics(machine, values, Boolean(alarm)),
  }
}

export function computeMetrics(machine, values, stopped = false) {
  return Object.fromEntries(
    machine.metrics.map((metric) => {
      let sum = metric.base ?? 0
      for (const [key, table] of Object.entries(metric.add)) sum += table[values[key]] ?? 0
      for (const extra of metric.extra ?? []) if (matches(extra.when, values)) sum += extra.add
      if (stopped && metric.id === 'throughput') sum = 0
      return [metric.id, Math.max(0, Math.min(100, sum))]
    }),
  )
}

export function goalMet(scenario, result) {
  if (!scenario) return null
  const { maxGrade, metric } = scenario.goal
  const gradeOk = SEVERITY[result.grade].rank <= SEVERITY[maxGrade].rank
  const metricOk = Object.entries(metric ?? {}).every(([id, min]) => result.metrics[id] >= min)
  return gradeOk && metricOk
}

// 단계 값을 고른 표시 방식으로 보여줍니다. { text, sourced(출처 있음), source }
export function levelText(level, mode) {
  if (mode === 'relative') return { text: `${level.pct}%` }
  if (mode === 'sourced') return level.sourced ? { text: level.sourced.value, sourced: true, source: level.sourced } : { text: '' }
  // 예시 숫자가 출처 숫자와 같으면 출처 표시로, 다르면 예시 숫자를 보여주고 출처 숫자는 아래 줄(source)에 따로 보여줍니다.
  if (level.sourced && (!level.example || level.sourced.value === level.example)) return { text: level.sourced.value, sourced: true, source: level.sourced }
  return { text: level.example ?? '', example: Boolean(level.example), source: level.sourced }
}
