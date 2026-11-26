import { useState } from 'react'

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // 저장소를 쓸 수 없으면 이번 화면에서만 유지합니다.
  }
}

// 이 탭에서만 기억하는 값(sessionStorage). 다른 화면(전체 설명 페이지 등)에 다녀와도 진행 중이던 문제·조건이 남게 합니다.
export function readSession(key, fallback = null) {
  try {
    const raw = sessionStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}
export function writeSession(key, value) {
  try {
    if (value === null || value === undefined) sessionStorage.removeItem(key)
    else sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    // 저장소를 쓸 수 없으면 이번 화면에서만 유지합니다.
  }
}
// useState와 같지만 이 탭의 sessionStorage에 함께 기억합니다.
export function useSessionState(key, fallback) {
  const [value, setValue] = useState(() => readSession(key, typeof fallback === 'function' ? fallback() : fallback))
  const update = (next) => {
    setValue((current) => {
      const resolved = typeof next === 'function' ? next(current) : next
      writeSession(key, resolved)
      return resolved
    })
  }
  return [value, update]
}

// 화면 밖(다른 화면의 버튼 등)에서 저장값을 미리 바꿔 둘 때 씁니다.
export function writeStored(key, value) {
  write(key, value)
}

export function useStoredState(key, fallback) {
  const [value, setValue] = useState(() => read(key, fallback))
  const update = (next) => {
    setValue((current) => {
      const resolved = typeof next === 'function' ? next(current) : next
      write(key, resolved)
      return resolved
    })
  }
  return [value, update]
}
