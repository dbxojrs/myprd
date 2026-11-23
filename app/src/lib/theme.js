import { useEffect, useState } from 'react'

// 다크 모드. 고르지 않았으면 기기 설정을 따르고, 고르면 이 브라우저에 기억합니다(<html data-theme>).
const KEY = 'tutor.ui.theme'

function saved() {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

const systemDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches

export function useTheme() {
  const [theme, setTheme] = useState(() => saved())
  const dark = theme ? theme === 'dark' : systemDark()
  useEffect(() => {
    if (theme) document.documentElement.dataset.theme = theme
    else delete document.documentElement.dataset.theme
  }, [theme])
  const setDark = (on) => {
    const next = on ? 'dark' : 'light'
    setTheme(next)
    try {
      localStorage.setItem(KEY, next)
    } catch {
      // 저장소를 못 쓰면 이번 화면에서만
    }
  }
  return [dark, setDark]
}
