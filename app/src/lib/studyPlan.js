import { createStore, useStore } from './sharedStore.js'
import { BASICS } from '../data/basics.js'
import { COURSES } from '../data/courses.js'
import { findProcess, STAGES } from '../data/processes.js'
import { wholeFlow } from '../data/packages.js'
import { ymd } from './activity.js'

// 공부 일정. 앱의 단원을 "전체 → 자세히" 순서로 늘어놓고, 목표일까지 공부하는 요일에 하루 공부 시간만큼 나눠 담습니다.
// 계산은 정해진 규칙으로만 합니다(AI·무작위 없음). 일정은 늘 "오늘부터 남은 단원"으로 다시 계산하므로,
// 하루 빠지면 남은 단원이 자동으로 뒤로 밀립니다. AI 조정은 순서·뺄 단원·시간 설정만 바꿉니다.

// settings: { title, start, goal, days: [0~6, 0=일], minutes } | null
// order: 사용자가 바꾼 단원 순서(id 배열) | null, skip: 뺀 단원 id, done: { 단원 id: 'YYYY-MM-DD' }
export const planStore = createStore('tutor.plan', { settings: null, order: null, skip: [], done: {}, note: '' })
export const usePlan = () => useStore(planStore)

const proc = (id, min) => {
  const p = findProcess(id)
  return { id: `proc:${id}`, title: p.name.ko, min, stage: p.stage, go: { kind: 'process', id } }
}

// 공부 단원 전체 (기본 순서)
export function allUnits() {
  const flow = wholeFlow(null)
  const ofStage = (s) => flow.filter((id) => findProcess(id)?.stage === s)
  const advOnly = COURSES.adv.lessons.filter((l) => !findProcess(l.id))
  return [
    ...BASICS.map((b) => ({ id: `basic:${b.id}`, title: `기초 · ${b.title}`, min: 15, stage: 'basics', go: { kind: 'course', course: 'basics', lesson: b.id } })),
    ...ofStage('design').map((id) => proc(id, 15)),
    ...ofStage('front').map((id) => proc(id, 25)),
    { id: 'quiz:front', title: '전공정 문제 풀기', min: 15, stage: 'front', go: { kind: 'screen', screen: 'quiz' } },
    ...ofStage('link').map((id) => proc(id, 10)),
    ...ofStage('mid').map((id) => proc(id, 20)),
    { id: 'pkg:overview', title: '후공정 영상 · 전체 모습과 재료', min: 15, stage: 'back', go: { kind: 'course', course: 'pkg', lesson: 'pkg-overview' } },
    ...ofStage('back').map((id) => proc(id, 25)),
    { id: 'pkg:types', title: '패키지 타입 5가지 비교', min: 20, stage: 'back', go: { kind: 'screen', screen: 'package' } },
    { id: 'quiz:back', title: '후공정 문제 풀기', min: 15, stage: 'back', go: { kind: 'screen', screen: 'quiz' } },
    ...ofStage('board').map((id) => proc(id, 15)),
    ...advOnly.map((l) => ({ id: `adv:${l.id}`, title: `첨단 · ${l.title}`, min: 15, stage: 'adv', go: { kind: 'course', course: 'adv', lesson: l.id } })),
    { id: 'written:all', title: '심화 주관식 풀기', min: 20, stage: 'exam', go: { kind: 'screen', screen: 'written' } },
    { id: 'quiz:all', title: '전체 범위 시험', min: 20, stage: 'exam', go: { kind: 'screen', screen: 'quiz' } },
  ]
}

export const REVIEW_UNIT = { id: 'review', title: '복습 · 오답 다시 풀기', min: 15, stage: 'review', go: { kind: 'screen', screen: 'wrong' } }

export const STAGE_LABEL = {
  basics: '반도체 기초',
  ...Object.fromEntries(Object.entries(STAGES).map(([k, v]) => [k, v.name.ko])),
  adv: '첨단 패키징',
  exam: '시험',
  review: '복습',
}

// 공정 단원은 공정 상세에서 "학습 완료"를 누르면 끝난 것으로 봅니다. 나머지는 일정에서 직접 체크합니다.
export function isDone(unit, plan, completed) {
  if (plan.done[unit.id]) return true
  return unit.go.kind === 'process' && completed.includes(unit.go.id)
}

export function orderedUnits(plan) {
  const base = allUnits()
  const byId = new Map(base.map((u) => [u.id, u]))
  const ids = plan.order ? [...plan.order.filter((id) => byId.has(id)), ...base.map((u) => u.id).filter((id) => !plan.order.includes(id))] : base.map((u) => u.id)
  return ids.filter((id) => !plan.skip.includes(id)).map((id) => byId.get(id))
}

const parse = (s) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// 오늘부터 목표일까지 공부하는 날 목록
export function studyDays(settings, today = new Date()) {
  const out = []
  const from = parse(settings.start) > parse(ymd(today)) ? parse(settings.start) : parse(ymd(today))
  const end = parse(settings.goal)
  for (const d = new Date(from); d <= end; d.setDate(d.getDate() + 1)) if (settings.days.includes(d.getDay())) out.push(ymd(d))
  return out
}

// 일정 계산 → { days: { 'YYYY-MM-DD': [단원] }, overflow: [목표일까지 못 넣은 단원], needMinutes, remainingMinutes }
export function schedule(plan, completed, today = new Date()) {
  const { settings } = plan
  if (!settings) return null
  const remaining = orderedUnits(plan).filter((u) => !isDone(u, plan, completed))
  const dates = studyDays(settings, today)
  const days = {}
  let i = 0
  for (const date of dates) {
    const list = []
    let used = 0
    // 하루 시간 안에 들어가는 만큼 담습니다(하루에 적어도 한 단원).
    while (i < remaining.length && (list.length === 0 || used + remaining[i].min <= settings.minutes)) {
      list.push(remaining[i])
      used += remaining[i].min
      i += 1
    }
    // 단원을 다 담고 남은 날은 복습으로 채웁니다.
    days[date] = list.length ? list : [REVIEW_UNIT]
  }
  const overflow = remaining.slice(i)
  const remainingMinutes = remaining.reduce((s, u) => s + u.min, 0)
  const needMinutes = dates.length ? Math.ceil(remainingMinutes / dates.length / 5) * 5 : null
  // 오늘 끝낸 단원도 오늘 칸에 보여 줍니다(체크된 상태로).
  const todayKey = ymd(today)
  const doneToday = orderedUnits(plan).filter((u) => plan.done[u.id] === todayKey)
  if (doneToday.length) days[todayKey] = [...doneToday, ...(days[todayKey] ?? []).filter((u) => u.id !== 'review')]
  return { days, overflow, needMinutes, remainingMinutes, total: orderedUnits(plan).length, left: remaining.length }
}

export function toggleDone(unitId, today = new Date()) {
  planStore.set((p) => {
    const done = { ...p.done }
    if (done[unitId]) delete done[unitId]
    else done[unitId] = ymd(today)
    return { ...p, done }
  })
}

export const saveSettings = (settings) => planStore.set((p) => ({ ...p, settings }))
export const resetOrder = () => planStore.set((p) => ({ ...p, order: null, skip: [], note: '' }))
export const resetPlan = () => planStore.set({ settings: null, order: null, skip: [], done: {}, note: '' })

// AI 조정 결과 적용. 모르는 id는 버리고, 숫자·요일은 범위를 확인합니다.
export function applyAdjust(result) {
  const valid = new Set(allUnits().map((u) => u.id))
  planStore.set((p) => ({
    ...p,
    order: result.order?.length ? result.order.filter((id) => valid.has(id)) : p.order,
    skip: (result.skip ?? []).filter((id) => valid.has(id)),
    settings: {
      ...p.settings,
      minutes: result.minutesPerDay && result.minutesPerDay >= 10 && result.minutesPerDay <= 600 ? Math.round(result.minutesPerDay) : p.settings.minutes,
      days: Array.isArray(result.days) && result.days.length && result.days.every((d) => d >= 0 && d <= 6) ? [...new Set(result.days)].sort() : p.settings.days,
    },
    note: result.note ?? '',
  }))
}
