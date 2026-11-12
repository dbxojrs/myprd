import { findMachine, SEVERITY } from '../data/machineSim.js'
import { handoffs, LINES } from '../data/machineLine.js'
import { defaultValues } from './machineJudge.js'

// 장비 라인 연결 실습. 앞 장비의 조건·결과가 뒤 장비의 상태를 바꾸고(handoffs.sets),
// 끝까지 간 뒤 최종 판정에 남습니다(handoffs.final). 규칙표(data/machineLine.js)만으로 계산합니다.
// lot: { [장비 id]: { values, result } } — 그 장비에서 로트를 넘길 때의 조건과 판정

export function lineMachines(lineId) {
  const line = LINES.find((l) => l.id === lineId)
  return line ? line.machines.filter((id) => findMachine(id)) : []
}

const hasTitle = (result, words) => result.findings.some((f) => words.some((w) => f.title.includes(w)))

// handoff가 이 로트에 해당하는지: from 장비를 이미 거쳤고, 조건(values)·결과 제목(titles)이 맞아야 합니다.
function applies(handoff, lot) {
  const done = lot[handoff.from]
  if (!done) return false
  const { values, titles } = handoff.when
  const valuesOk = Object.entries(values ?? {}).every(([key, levels]) => levels.includes(done.values[key]))
  const titlesOk = !titles || hasTitle(done.result, titles)
  return valuesOk && titlesOk
}

// 이 장비에 들어올 때의 상태: 권장값에서 시작해 앞 장비가 넘긴 상태(sets)를 덮어씁니다.
export function incoming(machineId, lot) {
  const machine = findMachine(machineId)
  const notes = handoffs.filter((h) => h.to === machineId && h.sets && applies(h, lot))
  const values = { ...defaultValues(machine) }
  for (const h of notes) Object.assign(values, h.sets)
  return { values, notes }
}

const VERDICT = { good: '정상', warn: '신뢰성 위험', bad: '불량' }

// 최종 판정: 장비별 판정과 끝까지 남은 영향(final) 중 가장 나쁜 것.
export function finalVerdict(lineId, lot) {
  const steps = lineMachines(lineId).map((id) => ({ machine: findMachine(id), ...lot[id] }))
  const carried = handoffs.filter((h) => h.final && applies(h, lot))
  const ranks = [...steps.map((s) => SEVERITY[s.result.grade].rank), ...carried.map((h) => SEVERITY[h.final.grade].rank)]
  const worst = Math.max(0, ...ranks)
  const grade = worst >= 2 ? 'bad' : worst === 1 ? 'warn' : 'good'
  return { grade, label: VERDICT[grade], steps, carried }
}
