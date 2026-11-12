// 고급 장비 시뮬레이터 규칙표(data/machines)를 검사합니다. `npm run check-machines`
// - 모든 조건을 권장값으로 두면 정상이어야 합니다.
// - 상황 실습마다 조치 버튼과 조건 조합으로 목표를 이룰 방법이 하나 이상 있어야 합니다.
// - 규칙의 키·단계 번호, 출처 키, 알람 단계(at), 지표 표 길이가 올바라야 합니다.
import { machines, SOURCES } from '../src/data/machineSim.js'
import { findProcess } from '../src/data/processes.js'
import { defaultValues, goalMet, judge } from '../src/lib/machineJudge.js'

let failed = 0
const fail = (machine, message) => {
  failed++
  console.log(`  ✗ ${machine.id}: ${message}`)
}

const combos = (items, i = 0, acc = {}) =>
  i === items.length ? [acc] : items[i].levels.flatMap((_, l) => combos(items, i + 1, { ...acc, [items[i].id]: l }))

for (const m of machines) {
  console.log(`${m.id} (${m.name})`)
  if (!findProcess(m.processId)) fail(m, `processId ${m.processId}가 processes.js에 없음`)
  const items = Object.fromEntries([...m.conditions, ...m.controls].map((c) => [c.id, c]))
  const steps = m.sequence.map((s) => s.id)

  for (const item of Object.values(items)) {
    if (!(item.best >= 0 && item.best < item.levels.length)) fail(m, `${item.id}.best 범위 밖`)
    for (const level of item.levels) {
      if (level.pct === undefined) fail(m, `${item.id} "${level.label}" pct 없음`)
      if (level.sourced && !SOURCES[level.sourced.src]) fail(m, `${item.id} "${level.label}" 출처 키 ${level.sourced.src} 없음`)
    }
  }
  for (const rule of m.rules) {
    for (const [key, levels] of Object.entries(rule.when)) {
      if (!items[key]) fail(m, `규칙 "${rule.title}"의 키 ${key} 없음`)
      else if (levels.some((l) => l < 0 || l >= items[key].levels.length)) fail(m, `규칙 "${rule.title}"의 ${key} 단계 범위 밖`)
    }
    if (rule.severity === 'alarm' && !steps.includes(rule.at)) fail(m, `알람 "${rule.title}"의 at ${rule.at}가 sequence에 없음`)
    if (rule.src && !SOURCES[rule.src]) fail(m, `규칙 "${rule.title}"의 출처 키 ${rule.src} 없음`)
    if (!rule.src && !rule.basis) fail(m, `규칙 "${rule.title}"에 src도 basis도 없음`)
  }
  for (const metric of m.metrics) {
    for (const [key, table] of Object.entries(metric.add)) {
      if (!items[key]) fail(m, `지표 ${metric.id}의 키 ${key} 없음`)
      else if (table.length !== items[key].levels.length) fail(m, `지표 ${metric.id}.${key} 길이 ${table.length} ≠ 단계 ${items[key].levels.length}`)
    }
  }
  for (const a of m.actions) for (const k of [...Object.keys(a.needs), ...Object.keys(a.sets)]) if (!items[k]) fail(m, `조치 ${a.id}의 키 ${k} 없음`)

  const d = judge(m, defaultValues(m))
  if (d.grade !== 'good') fail(m, `권장값인데 판정이 ${d.grade} (${d.findings.map((f) => f.title).join(', ')})`)

  for (const s of m.scenarios) {
    for (const k of Object.keys(s.preset)) if (!items[k]) fail(m, `상황 ${s.id} preset 키 ${k} 없음`)
    let cond = { ...defaultValues(m), ...s.preset }
    for (let k = 0; k < 3; k++) for (const a of m.actions) if (Object.entries(a.needs).every(([x, v]) => cond[x] === v)) cond = { ...cond, ...a.sets }
    const wins = combos(m.controls).filter((c) => goalMet(s, judge(m, { ...cond, ...c }))).length
    const start = judge(m, { ...defaultValues(m), ...s.preset })
    console.log(`  상황 ${s.id}: 시작 ${start.grade} · 해결 조합 ${wins}개`)
    if (wins === 0) fail(m, `상황 ${s.id}를 해결할 조합이 없음`)
    if (start.grade === 'good' && !s.goal.metric) fail(m, `상황 ${s.id}가 처음부터 정상이라 할 일이 없음`)
  }
}
console.log(failed ? `\n✗ 문제 ${failed}개` : '\n✓ 모든 장비 통과')
process.exit(failed ? 1 : 0)
