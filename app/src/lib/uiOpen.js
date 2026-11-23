import { createStore, useStore } from './sharedStore.js'

// 접는 상자(Collapsible)의 열림 상태. { [id]: true|false } 하나로 저장해 "모두 펼치기/접기"를 한 번에 합니다.
const openStore = createStore('tutor.ui.open', {})

export function useOpen(id, defaultOpen = true) {
  const map = useStore(openStore)
  const open = id in map ? map[id] : defaultOpen
  return [open, (next) => openStore.set((m) => ({ ...m, [id]: typeof next === 'function' ? next(open) : next }))]
}

export function setAllOpen(ids, value) {
  openStore.set((m) => ({ ...m, ...Object.fromEntries(ids.map((id) => [id, value])) }))
}

// 화면 전체 설정: 집중 모드, 메뉴 줄·흐름 막대 접힘
export const uiStore = createStore('tutor.ui', { focus: false, subbar: true, flowbar: true })
export const useUi = () => useStore(uiStore)
export const setUi = (patch) => uiStore.set((s) => ({ ...s, ...patch }))
