import { useSyncExternalStore } from 'react'

// 설명 미리보기 창 상태(앱 전체에서 하나). 화면을 옮기지 않고 지금 화면 위에 공정 설명을 띄웁니다.
// stack: 창 안에서 다른 공정을 눌러 들어간 순서(맨 끝이 지금 보는 공정). 비어 있으면 창이 닫힌 상태입니다.
let state = { stack: [], from: null }
const listeners = new Set()
const emit = () => listeners.forEach((fn) => fn())

export function openPeek(id) {
  if (!id) return
  // 창을 연 버튼으로 닫을 때 포커스를 돌려주려고 기억합니다.
  const from = state.stack.length ? state.from : typeof document !== 'undefined' ? document.activeElement : null
  const top = state.stack[state.stack.length - 1]
  state = { stack: top === id ? state.stack : [...state.stack, id], from }
  emit()
}

// 창 안의 "← 이전 공정"
export function backPeek() {
  if (state.stack.length <= 1) return
  state = { ...state, stack: state.stack.slice(0, -1) }
  emit()
}

export function closePeek() {
  if (!state.stack.length) return
  const from = state.from
  state = { stack: [], from: null }
  emit()
  // 창을 연 버튼으로 포커스를 돌려줍니다.
  if (from && typeof from.focus === 'function' && document.contains(from)) setTimeout(() => from.focus(), 0)
}

const subscribe = (fn) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
export const usePeek = () => useSyncExternalStore(subscribe, () => state)
