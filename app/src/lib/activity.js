import { createStore, useStore } from './sharedStore.js'

// 공부한 날 기록. { 'YYYY-MM-DD': 그날 한 활동 수 } 를 localStorage 'tutor.activity'에 둡니다.
// 공정 학습 완료·시험 채점·일정 체크·노트 저장 때 markActive()를 부릅니다. 홈의 "연속 공부일"에 씁니다.
export const activityStore = createStore('tutor.activity', {})
export const useActivity = () => useStore(activityStore)

// 이 기기의 날짜(현지 시간) 기준 YYYY-MM-DD
export function ymd(date = new Date()) {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function markActive(date = new Date()) {
  const key = ymd(date)
  activityStore.set((map) => ({ ...map, [key]: (map[key] ?? 0) + 1 }))
}

// 오늘(오늘 아직 안 했으면 어제)부터 거꾸로 이어진 공부일 수
export function streakOf(map, today = new Date()) {
  const day = new Date(today)
  if (!map[ymd(day)]) day.setDate(day.getDate() - 1)
  let n = 0
  while (map[ymd(day)]) {
    n += 1
    day.setDate(day.getDate() - 1)
  }
  return n
}
