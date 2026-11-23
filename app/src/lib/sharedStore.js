import { useSyncExternalStore } from 'react'

// 여러 컴포넌트가 같은 값을 함께 보는 작은 저장소. key가 있으면 localStorage에 저장합니다(읽기·쓰기 try/catch).
// 떠 있는 창 상태, 노트, 접기 상태, 고른 AI 모델처럼 화면 여러 곳에서 쓰는 값에 씁니다.
export function createStore(key, initial) {
  const load = () => {
    if (!key) return initial
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? initial : JSON.parse(raw)
    } catch {
      return initial
    }
  }
  let state = load()
  const listeners = new Set()
  const emit = () => listeners.forEach((fn) => fn())

  const store = {
    get: () => state,
    // 저장에 실패하면 false를 돌려줍니다(값은 이번 화면에서는 유지).
    set(next) {
      state = typeof next === 'function' ? next(state) : next
      let ok = true
      if (key) {
        try {
          localStorage.setItem(key, JSON.stringify(state))
        } catch {
          ok = false
        }
      }
      emit()
      return ok
    },
    subscribe(fn) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
  }

  // 다른 탭에서 바꾼 값도 반영합니다.
  if (key && typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
      if (event.key === key) {
        state = load()
        emit()
      }
    })
  }
  return store
}

export function useStore(store) {
  return useSyncExternalStore(store.subscribe, store.get)
}
