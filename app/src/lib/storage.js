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
