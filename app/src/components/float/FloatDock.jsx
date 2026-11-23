import { useEffect, useRef, useState } from 'react'
import {
  bringToFront,
  closePanel,
  floatStore,
  openPanel,
  patchFloat,
  togglePanel,
  useDots,
  useFloat,
  useIsMobile,
} from '../../lib/floatState.js'
import { useEdit } from '../../lib/notes.js'
import NotesPanel from '../notes/NotesPanel.jsx'
import StudyChat from '../chat/StudyChat.jsx'

// 화면 아래 떠 있는 동그라미(📝 노트, 💬 질문하기)와, 누르면 열리는 창.
// App의 <main> 바깥에 한 번만 그려 화면을 옮겨도 쓰던 글과 대화가 그대로 남습니다.
// 데스크톱: 창을 끌어 옮기고 모서리로 크기 조절, 두 창을 동시에 열 수 있음.
// 모바일: 아래에서 올라오는 시트(낮게·중간·전체), 손잡이를 끌어 높이 조절.

const PANEL_INFO = {
  notes: { icon: '📝', label: '노트', key: 'N' },
  chat: { icon: '💬', label: '질문하기', key: 'K' },
}
const BUBBLE = 56
const EDGE = 16
const SNAPS = { low: 0.35, mid: 0.65, full: 1 }

function useViewport() {
  const read = () => {
    const vv = window.visualViewport
    return {
      w: window.innerWidth,
      h: window.innerHeight,
      vh: vv?.height ?? window.innerHeight,
      // 화면 키보드가 올라오면 시트를 그만큼 위로 올립니다.
      kb: vv ? Math.max(0, window.innerHeight - vv.height - vv.offsetTop) : 0,
    }
  }
  const [size, setSize] = useState(read)
  useEffect(() => {
    const on = () => setSize(read())
    window.addEventListener('resize', on)
    window.visualViewport?.addEventListener('resize', on)
    window.visualViewport?.addEventListener('scroll', on)
    return () => {
      window.removeEventListener('resize', on)
      window.visualViewport?.removeEventListener('resize', on)
      window.visualViewport?.removeEventListener('scroll', on)
    }
  }, [])
  return size
}

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), Math.max(lo, hi))
const focusBubble = (name) => requestAnimationFrame(() => document.getElementById(`float-bubble-${name}`)?.focus())

export default function FloatDock({ currentRef, onOpenProcess, onOpenMachine }) {
  const float = useFloat()
  const dots = useDots()
  const { currentId } = useEdit()
  const mobile = useIsMobile()
  const view = useViewport()

  // 단축키: Alt+N 노트, Alt+K 질문하기, Esc 맨 앞 창 줄이기
  useEffect(() => {
    const onKey = (event) => {
      if (event.altKey && !event.ctrlKey && !event.metaKey) {
        const code = event.code
        if (code === 'KeyN' || code === 'KeyK') {
          event.preventDefault()
          togglePanel(code === 'KeyN' ? 'notes' : 'chat')
        }
      }
      if (event.key === 'Escape') {
        const s = floatStore.get()
        const front = [...s.order].reverse().find((n) => s.open[n])
        if (front) {
          closePanel(front)
          focusBubble(front)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // 모바일로 바뀌었는데 창이 둘 다 열려 있으면 앞의 것만 남깁니다.
  useEffect(() => {
    if (mobile && float.open.notes && float.open.chat) openPanel(float.order.at(-1))
  }, [mobile, float.open.notes, float.open.chat, float.order])

  const anyOpen = float.open.notes || float.open.chat
  const panels = ['notes', 'chat']

  return (
    <div className="float-dock">
      {panels.map((name) =>
        float.open[name] || (mobile && anyOpen) ? null : (
          <FloatBubble key={name} name={name} pos={float.bubble[name]} dot={name === 'notes' ? Boolean(currentId) : dots[name]} view={view} />
        ),
      )}
      {/* 닫힌 창도 숨긴 채 유지해, 줄여도 쓰던 글과 받는 중인 답이 사라지지 않게 합니다. */}
      {panels.map((name) => (
          <FloatWindow
            key={name}
            name={name}
            open={float.open[name]}
            mobile={mobile}
            view={view}
            z={1000 + float.order.indexOf(name)}
            geom={float.win[name]}
            sheet={float.sheet}
          >
            {name === 'notes' ? (
              <NotesPanel currentRef={currentRef} onOpenProcess={onOpenProcess} />
            ) : (
              <StudyChat currentRef={currentRef} onOpenProcess={onOpenProcess} onOpenMachine={onOpenMachine} />
            )}
          </FloatWindow>
      ))}
    </div>
  )
}

function FloatBubble({ name, pos, dot, view }) {
  const info = PANEL_INFO[name]
  const drag = useRef(null)
  const [live, setLive] = useState(null) // 끄는 중의 위치

  const restX = pos.side === 'left' ? EDGE : view.w - BUBBLE - EDGE
  const restY = clamp(pos.y * view.h - BUBBLE / 2, EDGE + 56, view.h - BUBBLE - EDGE)
  const x = live?.x ?? restX
  const y = live?.y ?? restY

  const down = (event) => {
    if (event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { sx: event.clientX, sy: event.clientY, x, y, moved: false }
  }
  const move = (event) => {
    const d = drag.current
    if (!d) return
    const dx = event.clientX - d.sx
    const dy = event.clientY - d.sy
    // 6px 넘게 움직여야 "끌기"로 봅니다(살짝 흔들려도 클릭은 클릭).
    if (!d.moved && Math.hypot(dx, dy) < 6) return
    d.moved = true
    setLive({ x: clamp(d.x + dx, 0, view.w - BUBBLE), y: clamp(d.y + dy, 0, view.h - BUBBLE) })
  }
  const up = () => {
    const d = drag.current
    drag.current = null
    if (!d) return
    if (!d.moved) {
      openPanel(name)
      return
    }
    // 가까운 왼쪽/오른쪽 가장자리에 붙이고, 높이는 화면 비율로 저장합니다.
    const cx = (live?.x ?? x) + BUBBLE / 2
    const cy = (live?.y ?? y) + BUBBLE / 2
    const s = floatStore.get()
    patchFloat({ bubble: { ...s.bubble, [name]: { side: cx < view.w / 2 ? 'left' : 'right', y: cy / view.h } } })
    setLive(null)
  }

  return (
    <button
      id={`float-bubble-${name}`}
      type="button"
      className={`float-bubble${live ? ' dragging' : ''}`}
      style={{ transform: `translate(${x}px, ${y}px)` }}
      aria-label={`${info.label} 열기 (Alt+${info.key})`}
      title={`${info.label} 열기 · Alt+${info.key} · 끌어서 옮기기`}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={() => {
        drag.current = null
        setLive(null)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          openPanel(name)
        }
      }}
    >
      <span aria-hidden="true">{info.icon}</span>
      {dot && <span className="float-dot" aria-label={name === 'chat' ? '새 답변' : '작성 중인 노트'} />}
    </button>
  )
}

function defaultGeom(name, view) {
  const w = Math.min(400, view.w - 48)
  const h = Math.min(560, view.h - 120)
  // 노트는 챗봇 창 왼쪽에 놓아 처음 둘 다 열어도 겹치지 않게 합니다.
  const x = view.w - w - 24 - (name === 'notes' ? w + 16 : 0)
  return { x: Math.max(16, x), y: Math.max(72, view.h - h - 24), w, h, max: false }
}

function FloatWindow({ name, open, mobile, view, z, geom, sheet, children }) {
  const info = PANEL_INFO[name]
  const g = geom ?? defaultGeom(name, view)
  const [live, setLive] = useState(null) // 끄는 중의 위치·크기(데스크톱) 또는 높이(모바일)
  const drag = useRef(null)
  const ref = useRef(null)

  const save = (patch) => {
    const s = floatStore.get()
    patchFloat({ win: { ...s.win, [name]: { ...g, ...patch } } })
  }
  const minimize = () => {
    closePanel(name)
    focusBubble(name)
  }

  // 열 때 창 안으로 포커스를 옮깁니다.
  useEffect(() => {
    if (open) ref.current?.focus({ preventScroll: true })
  }, [open])

  if (mobile) {
    const sheetH = (live?.h ?? SNAPS[sheet] * view.vh) | 0
    const onHandleDown = (event) => {
      event.currentTarget.setPointerCapture(event.pointerId)
      drag.current = { sy: event.clientY, h: SNAPS[sheet] * view.vh }
    }
    const onHandleMove = (event) => {
      const d = drag.current
      if (!d) return
      setLive({ h: clamp(d.h - (event.clientY - d.sy), 80, view.vh) })
    }
    const onHandleUp = () => {
      const d = drag.current
      drag.current = null
      if (!d || !live) return
      const ratio = live.h / view.vh
      setLive(null)
      // 아래로 끝까지 내리면 줄이기(동그라미로)
      if (ratio < 0.2) return minimize()
      const nearest = Object.entries(SNAPS).sort((a, b) => Math.abs(a[1] - ratio) - Math.abs(b[1] - ratio))[0][0]
      patchFloat({ sheet: nearest })
    }
    const other = name === 'notes' ? 'chat' : 'notes'
    return (
      <section
        ref={ref}
        tabIndex={-1}
        hidden={!open}
        className={`float-sheet${live ? ' dragging' : ''}${sheet === 'full' && !live ? ' full' : ''}`}
        style={{ height: sheetH, bottom: view.kb, zIndex: z }}
        role="dialog"
        aria-label={info.label}
      >
        <div
          className="sheet-handle"
          onPointerDown={onHandleDown}
          onPointerMove={onHandleMove}
          onPointerUp={onHandleUp}
          onPointerCancel={() => {
            drag.current = null
            setLive(null)
          }}
          aria-hidden="true"
        >
          <span />
        </div>
        <header className="float-head">
          <div className="sheet-tabs" role="tablist">
            {['notes', 'chat'].map((n) => (
              <button
                key={n}
                type="button"
                role="tab"
                aria-selected={n === name}
                className={n === name ? 'sheet-tab active' : 'sheet-tab'}
                onClick={() => n !== name && openPanel(other)}
              >
                {PANEL_INFO[n].icon} {PANEL_INFO[n].label}
              </button>
            ))}
          </div>
          <div className="float-actions">
            <button type="button" aria-label={sheet === 'full' ? '시트 낮추기' : '전체 화면'} onClick={() => patchFloat({ sheet: sheet === 'full' ? 'mid' : 'full' })}>
              {sheet === 'full' ? '▾' : '▴'}
            </button>
            <button type="button" aria-label="줄이기" onClick={minimize}>
              ✕
            </button>
          </div>
        </header>
        <div className="float-body">{children}</div>
      </section>
    )
  }

  // 데스크톱
  const box = g.max
    ? { x: Math.round(view.w / 2), y: 0, w: Math.round(view.w / 2), h: view.h }
    : {
        w: clamp(live?.w ?? g.w, 300, view.w * 0.9),
        h: clamp(live?.h ?? g.h, 240, view.h * 0.9),
        x: live?.x ?? g.x,
        y: live?.y ?? g.y,
      }
  // 화면 밖으로 반 넘게 나가지 않게
  box.x = clamp(box.x, -box.w / 2, view.w - box.w / 2)
  box.y = clamp(box.y, 0, view.h - 44)

  const startMove = (event) => {
    if (g.max || event.button !== 0 || event.target.closest('button')) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { type: 'move', sx: event.clientX, sy: event.clientY, x: box.x, y: box.y }
  }
  const startResize = (event) => {
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { type: 'size', sx: event.clientX, sy: event.clientY, w: box.w, h: box.h }
  }
  const onMove = (event) => {
    const d = drag.current
    if (!d) return
    const dx = event.clientX - d.sx
    const dy = event.clientY - d.sy
    if (d.type === 'move') setLive({ x: d.x + dx, y: d.y + dy })
    else setLive({ w: d.w + dx, h: d.h + dy })
  }
  const onUp = () => {
    if (!drag.current) return
    drag.current = null
    if (live) save({ x: box.x, y: box.y, w: box.w, h: box.h })
    setLive(null)
  }
  const toggleMax = () => save({ max: !g.max })

  return (
    <section
      ref={ref}
      tabIndex={-1}
      hidden={!open}
      className={`float-window${live ? ' dragging' : ''}${g.max ? ' max' : ''}`}
      style={{ transform: `translate(${box.x}px, ${box.y}px)`, width: box.w, height: box.h, zIndex: z }}
      role="dialog"
      aria-label={info.label}
      onPointerDownCapture={() => bringToFront(name)}
      onFocusCapture={() => bringToFront(name)}
    >
      <header
        className="float-head draggable"
        onPointerDown={startMove}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onDoubleClick={(event) => !event.target.closest('button') && toggleMax()}
        title="끌어서 옮기기 · 더블클릭으로 크게/원래대로"
      >
        <strong>
          <span aria-hidden="true">{info.icon}</span> {info.label}
        </strong>
        <div className="float-actions">
          <button type="button" aria-label="줄이기" title={`줄이기 (Esc · Alt+${info.key})`} onClick={minimize}>
            —
          </button>
          <button type="button" aria-label={g.max ? '원래 크기' : '크게'} title={g.max ? '원래 크기' : '크게'} onClick={toggleMax}>
            {g.max ? '❐' : '□'}
          </button>
          <button type="button" aria-label="닫기" title="닫기" onClick={minimize}>
            ✕
          </button>
        </div>
      </header>
      <div className="float-body">{children}</div>
      {!g.max && (
        <span
          className="float-resize"
          aria-hidden="true"
          onPointerDown={startResize}
          onPointerMove={onMove}
          onPointerUp={onUp}
        />
      )}
    </section>
  )
}
