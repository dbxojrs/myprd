import { useEffect, useRef } from 'react'

// 화면 이동을 브라우저 기록(History API)에 남깁니다.
// - 화면을 옮길 때마다 기록이 하나 쌓여, 휴대폰·브라우저의 "뒤로 가기"가 앱 안의 이전 화면으로 갑니다.
// - 주소 뒤에 #/화면(예: #/query/wire-bonding)을 붙여 새로고침해도 같은 화면이 열립니다.
// - 메뉴 서랍·시나리오처럼 화면 위에 열리는 "층"은 useBackLayer로 기록을 하나 더 쌓아, 뒤로 가기로 닫힙니다.

export const SCREENS = [
  'home', 'today', 'plan', 'package', 'map', 'front', 'flow', 'query', 'fab-sim', 'sim', 'machine-fab', 'machine-pkg',
  'quiz', 'wrong', 'ai', 'line', 'written', 'cases', 'field', 'field-fab', 'field-pkg', 'datalab', 'defects', 'report',
  'analytics', 'notes', 'basics', 'advanced',
]

export const hashFor = (st) => (st.screen === 'query' && st.processId ? `#/query/${st.processId}` : `#/${st.screen}`)

// 주소의 #/화면을 읽습니다. 모르는 화면이면 null.
export function readHash(hash = typeof location === 'undefined' ? '' : location.hash) {
  const m = /^#\/([\w-]+)(?:\/([\w-]+))?/.exec(hash || '')
  if (!m || !SCREENS.includes(m[1])) return null
  return { screen: m[1], processId: m[1] === 'query' ? m[2] ?? null : null }
}

const safe = (fn) => {
  try {
    fn()
  } catch {
    // 기록을 못 남겨도(샌드박스 등) 화면 이동에는 영향 없음
  }
}

// 지금 기록을 바꿉니다(처음 열 때).
export function replaceNav(st) {
  safe(() => history.replaceState({ tutor: 1, screen: st.screen, processId: st.processId ?? null }, '', hashFor(st)))
}

// 새 화면 기록을 쌓습니다. 같은 화면이면 쌓지 않고, 맨 위가 잠깐 열린 층(메뉴 서랍)이면 그 자리를 바꿉니다.
export function pushNav(st) {
  const next = { tutor: 1, screen: st.screen, processId: st.screen === 'query' ? st.processId ?? null : null }
  const cur = typeof history === 'undefined' ? null : history.state
  if (cur?.tutor && !cur.layer && cur.screen === next.screen && (cur.processId ?? null) === next.processId) return
  safe(() => (cur?.transient ? history.replaceState(next, '', hashFor(next)) : history.pushState(next, '', hashFor(next))))
}

const pendingBack = new Map()

// active인 동안 기록을 하나 더 쌓고, 뒤로 가기를 누르면 close()를 부릅니다.
// 화면 안의 버튼으로 닫으면 쌓아 둔 기록을 되돌려(history.back) 뒤로 가기가 헛돌지 않게 합니다.
// transient: 메뉴 서랍처럼 잠깐 열리는 층. 그 위에서 다른 화면으로 가면 기록을 덮어씁니다.
export function useBackLayer(active, close, id, { transient = false } = {}) {
  const closeRef = useRef(close)
  closeRef.current = close
  useEffect(() => {
    if (!active) return undefined
    clearTimeout(pendingBack.get(id))
    if (history.state?.layer !== id) safe(() => history.pushState({ ...(history.state ?? {}), layer: id, transient }, '', location.hash))
    const onPop = () => {
      if (history.state?.layer !== id) closeRef.current()
    }
    window.addEventListener('popstate', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      // 개발 모드(StrictMode)의 연속 실행과 구분하려고 한 박자 늦게 확인합니다.
      pendingBack.set(
        id,
        setTimeout(() => {
          if (history.state?.layer === id) safe(() => history.back())
        }, 0),
      )
    }
  }, [active, id, transient])
}
