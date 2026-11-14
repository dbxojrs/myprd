import { useSyncExternalStore } from 'react'

// Claude API 키 보관. 기본은 이 탭의 메모리에만 두고(새로고침하면 사라짐),
// 사용자가 "이 브라우저에 기억"을 고르면 localStorage에 저장합니다. 읽기·쓰기는 try/catch로 감쌉니다.
const STORE = 'tutor.aiKey'

function readSaved() {
  try {
    return localStorage.getItem(STORE) ?? ''
  } catch {
    return ''
  }
}

let state = { key: readSaved(), remembered: readSaved() !== '' }
const listeners = new Set()

function set(next) {
  state = { ...state, ...next }
  try {
    if (state.remembered && state.key) localStorage.setItem(STORE, state.key)
    else localStorage.removeItem(STORE)
  } catch {
    // 저장소를 못 쓰면 메모리에만 둡니다.
  }
  listeners.forEach((fn) => fn())
}

export function useApiKey() {
  const snapshot = useSyncExternalStore(
    (fn) => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    () => state,
  )
  return {
    apiKey: snapshot.key,
    remembered: snapshot.remembered,
    setApiKey: (key) => set({ key: key.trim() }),
    setRemembered: (remembered) => set({ remembered }),
    clear: () => set({ key: '', remembered: false }),
  }
}
