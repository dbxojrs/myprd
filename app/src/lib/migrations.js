import { FIELD_CASES } from '../data/fieldCases/index.js'
import { fieldStore } from './fieldSim.js'
import { planStore } from './studyPlan.js'

// 저장 데이터 이전(앱 시작 때 한 번). 시나리오 id가 바뀌어도(legacyIds) 진행 기록·최고 점수·일정 체크가 이어지게 옮깁니다.
// 이미 옮겼으면 아무것도 하지 않습니다(여러 번 실행해도 안전).
export function runMigrations() {
  const renames = FIELD_CASES.flatMap((c) => (c.legacyIds ?? []).map((old) => [old, c.id]))
  if (!renames.length) return

  const field = fieldStore.get()
  if (renames.some(([old]) => field[old])) {
    const next = { ...field }
    for (const [old, id] of renames) {
      if (!next[old]) continue
      const a = next[old]
      const b = next[id] ?? {}
      next[id] = {
        run: b.run ?? (a.run ? { ...a.run } : null),
        attempts: [...(b.attempts ?? []), ...(a.attempts ?? [])].sort((x, y) => (y.at > x.at ? 1 : -1)).slice(0, 20),
        best: Math.max(a.best ?? 0, b.best ?? 0) || (a.best ?? b.best),
      }
      delete next[old]
    }
    fieldStore.set(next)
  }

  try {
    const open = JSON.parse(localStorage.getItem('tutor.field.open'))
    const hit = renames.find(([old]) => old === open)
    if (hit) localStorage.setItem('tutor.field.open', JSON.stringify(hit[1]))
  } catch {
    // 무시
  }

  const plan = planStore.get()
  const unit = (id) => `field:${id}`
  if (renames.some(([old]) => plan.done?.[unit(old)] || plan.order?.includes(unit(old)) || plan.skip?.includes(unit(old)))) {
    const map = Object.fromEntries(renames.map(([o, n]) => [unit(o), unit(n)]))
    const re = (id) => map[id] ?? id
    planStore.set({
      ...plan,
      done: Object.fromEntries(Object.entries(plan.done ?? {}).map(([k, v]) => [re(k), v])),
      order: plan.order ? plan.order.map(re) : plan.order,
      skip: (plan.skip ?? []).map(re),
    })
  }
}
