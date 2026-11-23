import { useEffect, useState } from 'react'
import { createStore, useStore } from './sharedStore.js'

// 떠 있는 동그라미와 창(노트·챗봇)의 상태. 어느 화면에서든 같은 값을 씁니다.
// open: 창이 열려 있는지, order: 앞에 있는 창이 뒤쪽, dots: 동그라미에 찍는 알림 점
export const PANELS = ['notes', 'chat']

export const floatStore = createStore('tutor.float', {
  open: { notes: false, chat: false },
  order: ['notes', 'chat'],
  bubble: { notes: { side: 'right', y: 0.74 }, chat: { side: 'right', y: 0.86 } },
  win: { notes: null, chat: null }, // 데스크톱: { x, y, w, h, max }
  sheet: 'mid', // 모바일 시트 높이: low | mid | full
})

const dotStore = createStore(null, { notes: false, chat: false })

export const useFloat = () => useStore(floatStore)
export const useDots = () => useStore(dotStore)
export const setDot = (name, value) => dotStore.set((d) => ({ ...d, [name]: value }))

const isMobile = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 959px)').matches

export function openPanel(name) {
  floatStore.set((s) => {
    // 모바일은 화면이 좁아 시트를 하나만 엽니다.
    const open = isMobile() ? { notes: false, chat: false, [name]: true } : { ...s.open, [name]: true }
    return { ...s, open, order: [...s.order.filter((n) => n !== name), name] }
  })
  if (name === 'chat') setDot('chat', false)
}

export const closePanel = (name) => floatStore.set((s) => ({ ...s, open: { ...s.open, [name]: false } }))
export const togglePanel = (name) => (floatStore.get().open[name] ? closePanel(name) : openPanel(name))
export const bringToFront = (name) =>
  floatStore.set((s) => (s.order.at(-1) === name ? s : { ...s, order: [...s.order.filter((n) => n !== name), name] }))
export const patchFloat = (patch) => floatStore.set((s) => ({ ...s, ...patch }))

export function useMediaQuery(query) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

export const useIsMobile = () => useMediaQuery('(max-width: 959px)')
