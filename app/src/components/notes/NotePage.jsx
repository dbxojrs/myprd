import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { BLOCK_TYPES, COLOR_LABEL, COLORS, newBlock, parseBlocks, serializeBlocks, TEXT_TYPES, typeInfo } from '../../lib/blocks.js'
import { deleteNote, notesStore, openNotePage, setCurrent, updateNote, useEdit, useNotes } from '../../lib/notes.js'
import { COVER_LABEL, COVERS, FONTS, ICONS, saveTemplate, SIZES } from '../../lib/noteTemplates.js'
import { markActive } from '../../lib/activity.js'
import { openPanel } from '../../lib/floatState.js'
import { BlockView, inline } from '../MiniText.jsx'

// 노션처럼 꾸미는 노트 페이지. 본문은 블록으로 나눠 편집하고, 저장할 때는 Markdown 글(body) 하나로 합칩니다(lib/blocks.js).
// 블록 넣기: 빈 줄에서 "/" → 메뉴, 또는 "# ", "- ", "[] ", "> ", "1. ", "---", "```" 처럼 치면 바로 바뀝니다.
// 키: Enter 새 블록 · Shift+Enter 줄바꿈 · 빈 블록 Backspace 지우기 · ↑↓ 블록 이동 · Ctrl+B 굵게 · Ctrl+I 기울임 · Ctrl+Shift+H 형광펜
// 블록 왼쪽 ⋮⋮ 손잡이: 끌어서 순서 바꾸기, 눌러서 종류 바꾸기·색·복제·삭제.

const SHORTCUTS = [
  [/^#\s$/, 'h1'],
  [/^##\s$/, 'h2'],
  [/^###\s$/, 'h3'],
  [/^[-*]\s$/, 'bullet'],
  [/^1[.)]\s$/, 'number'],
  [/^\[\s?\]\s$/, 'todo'],
  [/^>\s$/, 'quote'],
  [/^!!\s$/, 'callout'],
  [/^>>\s$/, 'toggle'],
  [/^```$/, 'code'],
  [/^---$/, 'divider'],
]
const CONTINUE = new Set(['bullet', 'number', 'todo'])

function autosize(el) {
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

// 이미지 파일을 긴 변 1200px JPEG로 줄여 글 안에 넣습니다(브라우저 저장 공간을 아끼려고).
function shrinkImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, 1200 / Math.max(img.width, img.height))
      const canvas = Object.assign(document.createElement('canvas'), { width: Math.round(img.width * scale), height: Math.round(img.height * scale) })
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.82))
    }
    img.onerror = () => reject(new Error('이미지를 읽지 못했습니다.'))
    img.src = url
  })
}

export default function NotePage({ noteId, onClose, onOpenProcess }) {
  const notes = useNotes()
  const note = notes.find((n) => n.id === noteId)
  const { saveError } = useEdit()
  const [blocks, setBlocks] = useState(() => {
    const b = parseBlocks(note?.body ?? '')
    return b.length ? b : [newBlock('p')]
  })
  const [title, setTitle] = useState(note?.title ?? '')
  const [focus, setFocus] = useState(null) // { id, caret }
  const [slash, setSlash] = useState(null) // { id, query, index }
  const [menu, setMenu] = useState(null) // 블록 id (⋮⋮ 메뉴)
  const [pop, setPop] = useState(null) // 'icon' | 'cover' | { emoji: 블록 id }
  const [drag, setDrag] = useState(null) // { from, over }
  const [tag, setTag] = useState('')
  const [status, setStatus] = useState('saved')
  const refs = useRef({})
  const lastSaved = useRef({ title: note?.title ?? '', body: note?.body ?? '' })
  const style = note?.style ?? {}

  // 다른 곳(떠 있는 노트 창, "노트로 보내기")에서 본문이 바뀌면 다시 읽습니다.
  useEffect(() => {
    if (!note) return
    if (note.body !== lastSaved.current.body) {
      lastSaved.current.body = note.body
      const b = parseBlocks(note.body)
      setBlocks(b.length ? b : [newBlock('p')])
    }
    if (note.title !== lastSaved.current.title) {
      lastSaved.current.title = note.title
      setTitle(note.title)
    }
  }, [note])

  // 0.4초 동안 입력이 없으면 저장
  useEffect(() => {
    const body = serializeBlocks(blocks)
    if (body === lastSaved.current.body && title === lastSaved.current.title) return undefined
    setStatus('typing')
    const timer = setTimeout(() => {
      lastSaved.current = { title, body }
      updateNote(noteId, { title, body })
      setStatus('saved')
    }, 400)
    return () => clearTimeout(timer)
  }, [blocks, title, noteId])

  // 페이지를 닫을 때 아직 저장 안 된 입력을 바로 저장하고, 쓴 게 있으면 공부한 날로 기록합니다.
  const latest = useRef({ title, blocks })
  latest.current = { title, blocks }
  useEffect(
    () => () => {
      const { title: t, blocks: bs } = latest.current
      const body = serializeBlocks(bs)
      const n = notesStore.get().find((x) => x.id === noteId)
      if (!n) return
      if (body !== lastSaved.current.body || t !== lastSaved.current.title) updateNote(noteId, { title: t, body })
      if (body.trim() || t.trim()) markActive()
    },
    [noteId],
  )

  useLayoutEffect(() => {
    if (!focus) return
    const el = refs.current[focus.id]
    if (!el) return
    el.focus()
    if (typeof focus.caret === 'number' && el.setSelectionRange) {
      const c = focus.caret < 0 ? el.value.length : focus.caret
      el.setSelectionRange(c, c)
    }
    autosize(el)
  }, [focus])

  if (!note)
    return (
      <section className="screen">
        <p className="muted">노트를 찾을 수 없습니다.</p>
        <button type="button" onClick={onClose}>
          ← 목록
        </button>
      </section>
    )

  const setStyle = (patch) => updateNote(noteId, { style: { ...style, ...patch } })
  const at = (id) => blocks.findIndex((b) => b.id === id)
  const patch = (id, p) => setBlocks((list) => list.map((b) => (b.id === id ? { ...b, ...p } : b)))
  const insertAfter = (id, block, caret = 0) => {
    setBlocks((list) => {
      const i = list.findIndex((b) => b.id === id)
      return [...list.slice(0, i + 1), block, ...list.slice(i + 1)]
    })
    setFocus({ id: block.id, caret })
  }
  const remove = (id, focusPrev = true) => {
    const i = at(id)
    setBlocks((list) => {
      const next = list.filter((b) => b.id !== id)
      return next.length ? next : [newBlock('p')]
    })
    if (focusPrev && i > 0) setFocus({ id: blocks[i - 1].id, caret: -1 })
  }
  const move = (id, dir) => {
    setBlocks((list) => {
      const i = list.findIndex((b) => b.id === id)
      const j = i + dir
      if (j < 0 || j >= list.length) return list
      const next = [...list]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  }
  // 블록 종류 바꾸기. text를 주면 그 글로, 안 주면 글자 블록끼리는 원래 글을 그대로 둡니다.
  const convert = (id, type, text) => {
    const old = blocks[at(id)]
    const keep = text !== undefined ? { text } : TEXT_TYPES.has(type) && TEXT_TYPES.has(old.type) ? { text: old.text } : {}
    const nb = { ...newBlock(type, keep), id }
    patch(id, nb)
    if (type === 'divider') insertAfter(id, newBlock('p'))
    else setFocus({ id, caret: -1 })
    setSlash(null)
    setMenu(null)
  }

  const slashItems = slash ? BLOCK_TYPES.filter((t) => !slash.query || `${t.label} ${t.keys}`.toLowerCase().includes(slash.query.toLowerCase())) : []

  const onTextChange = (b, value, el) => {
    autosize(el)
    if (b.type === 'p') {
      for (const [re, type] of SHORTCUTS)
        if (re.test(value)) {
          convert(b.id, type, '')
          return
        }
    }
    if (value.startsWith('/') && !value.includes(' ') && b.type !== 'code') setSlash({ id: b.id, query: value.slice(1), index: 0 })
    else if (slash?.id === b.id) setSlash(null)
    patch(b.id, { text: value })
  }

  const wrap = (b, el, mark) => {
    const { selectionStart: s, selectionEnd: e, value } = el
    const [open, close] = Array.isArray(mark) ? mark : [mark, mark]
    const next = value.slice(0, s) + open + value.slice(s, e) + close + value.slice(e)
    patch(b.id, { text: next })
    requestAnimationFrame(() => el.setSelectionRange(s + open.length, e + open.length))
  }

  const onKeyDown = (b, e) => {
    const el = e.currentTarget
    if (e.nativeEvent.isComposing || e.keyCode === 229) return // 한글 조합 중
    if (slash?.id === b.id && slashItems.length) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const d = e.key === 'ArrowDown' ? 1 : -1
        setSlash((s) => ({ ...s, index: (s.index + d + slashItems.length) % slashItems.length }))
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        const t = slashItems[slash.index] ?? slashItems[0]
        convert(b.id, t.type, '')
        return
      }
      if (e.key === 'Escape') {
        setSlash(null)
        return
      }
    }
    const mod = e.ctrlKey || e.metaKey
    if (mod && e.key.toLowerCase() === 'b') return e.preventDefault(), wrap(b, el, '**')
    if (mod && e.key.toLowerCase() === 'i') return e.preventDefault(), wrap(b, el, '*')
    if (mod && e.key.toLowerCase() === 'e') return e.preventDefault(), wrap(b, el, '`')
    if (mod && e.shiftKey && e.key.toLowerCase() === 'h') return e.preventDefault(), wrap(b, el, '==')
    if (mod && e.shiftKey && e.key.toLowerCase() === 'x') return e.preventDefault(), wrap(b, el, '~~')

    const i = at(b.id)
    const start = el.selectionStart
    const end = el.selectionEnd
    if (e.key === 'Enter' && !e.shiftKey && b.type !== 'code') {
      e.preventDefault()
      if (CONTINUE.has(b.type) && !b.text) return convert(b.id, 'p')
      const before = b.text.slice(0, start)
      const after = b.text.slice(end)
      patch(b.id, { text: before })
      insertAfter(b.id, newBlock(CONTINUE.has(b.type) ? b.type : 'p', { text: after }), 0)
      return
    }
    if (e.key === 'Backspace' && start === 0 && end === 0) {
      if (b.type !== 'p' && b.type !== 'code') {
        e.preventDefault()
        return convert(b.id, 'p')
      }
      const prev = blocks[i - 1]
      if (!prev) return
      if (!b.text) {
        e.preventDefault()
        return remove(b.id)
      }
      if (TEXT_TYPES.has(prev.type) && prev.type !== 'toggle') {
        e.preventDefault()
        const caret = prev.text.length
        setBlocks((list) => list.filter((x) => x.id !== b.id).map((x) => (x.id === prev.id ? { ...x, text: x.text + b.text } : x)))
        setFocus({ id: prev.id, caret })
      }
      return
    }
    if (e.key === 'ArrowUp' && start === 0 && i > 0) {
      e.preventDefault()
      setFocus({ id: blocks[i - 1].id, caret: -1 })
    }
    if (e.key === 'ArrowDown' && end === el.value.length && i < blocks.length - 1) {
      e.preventDefault()
      setFocus({ id: blocks[i + 1].id, caret: 0 })
    }
  }

  const textArea = (b, extra = {}) => (
    <textarea
      ref={(el) => {
        refs.current[b.id] = el
        autosize(el)
      }}
      rows={1}
      className={`nb-input nb-input-${b.type}`}
      value={b.text}
      placeholder={b.type === 'p' ? '글을 쓰거나 "/"로 블록 넣기' : `${typeInfo(b.type).label}`}
      onChange={(e) => onTextChange(b, e.target.value, e.target)}
      onKeyDown={(e) => onKeyDown(b, e)}
      onFocus={() => focus?.id !== b.id && setFocus({ id: b.id })}
      onBlur={() => setTimeout(() => setFocus((f) => (f?.id === b.id ? null : f)), 120)}
      spellCheck={false}
      {...extra}
    />
  )

  const editing = (b) => focus?.id === b.id
  const listNo = (i) => {
    let n = 1
    for (let k = i - 1; k >= 0 && blocks[k].type === 'number'; k -= 1) n += 1
    return n
  }

  const renderBlock = (b, i) => {
    switch (b.type) {
      case 'divider':
        return <hr className="nb-divider" />
      case 'table':
        return <TableEditor b={b} onChange={(rows) => patch(b.id, { rows })} />
      case 'image':
        return <ImageEditor b={b} onChange={(p) => patch(b.id, p)} />
      case 'toggle':
        return (
          <div className="nb-toggle edit">
            <div className="nb-toggle-head">
              <button type="button" className={`nb-toggle-arrow${b.open !== false ? ' open' : ''}`} onClick={() => patch(b.id, { open: b.open === false })} aria-label="펼치기·접기">
                ▸
              </button>
              <input className="nb-toggle-title" value={b.title} placeholder="토글 제목" onChange={(e) => patch(b.id, { title: e.target.value })} />
            </div>
            {b.open !== false && (
              <div className="nb-toggle-body">
                {editing(b) || !b.text ? textArea(b, { placeholder: '펼치면 보일 내용 (- 목록, **굵게** 등 그대로 쓸 수 있음)', onKeyDown: undefined }) : <div onClick={() => setFocus({ id: b.id, caret: -1 })}><BlockView b={{ ...b, type: 'p' }} onOpenProcess={onOpenProcess} /></div>}
              </div>
            )}
          </div>
        )
      case 'callout':
        return (
          <div className={`nb-callout c-${b.color || 'yellow'}`}>
            <button type="button" className="nb-callout-icon" onClick={() => setPop({ emoji: b.id })} title="아이콘 바꾸기">
              {b.emoji || '💡'}
            </button>
            <div className="nb-callout-text">{editing(b) || !b.text ? textArea(b) : <div className="nb-view" onClick={() => setFocus({ id: b.id, caret: -1 })}>{b.text.split('\n').map((l, k) => <p key={k}>{inline(l, onOpenProcess, `${b.id}-${k}`)}</p>)}</div>}</div>
            {pop?.emoji === b.id && (
              <EmojiPop
                onPick={(emoji) => {
                  patch(b.id, { emoji })
                  setPop(null)
                }}
                onClose={() => setPop(null)}
              />
            )}
          </div>
        )
      case 'code':
        return (
          <div className="nb-code edit">
            <input className="nb-code-lang" value={b.lang} placeholder="언어" onChange={(e) => patch(b.id, { lang: e.target.value })} />
            {textArea(b, { placeholder: '코드나 고정폭 글' })}
          </div>
        )
      default: {
        const prefix =
          b.type === 'bullet' ? <span className="nb-marker">•</span> : b.type === 'number' ? <span className="nb-marker num">{listNo(i)}.</span> : b.type === 'todo' ? (
            <input type="checkbox" className="nb-check" checked={Boolean(b.checked)} onChange={() => patch(b.id, { checked: !b.checked })} aria-label="할 일 체크" />
          ) : null
        const show = editing(b) || !b.text
        return (
          <div className={`nb-line nb-${b.type}${b.type === 'todo' && b.checked ? ' checked' : ''}`}>
            {prefix}
            {show ? (
              textArea(b)
            ) : (
              <div className="nb-view" onClick={() => setFocus({ id: b.id, caret: -1 })} role="textbox" tabIndex={0} onFocus={() => setFocus({ id: b.id, caret: -1 })}>
                {b.text.split('\n').map((l, k) => (
                  <span key={k} className="nb-view-line">
                    {inline(l, onOpenProcess, `${b.id}-${k}`)}
                  </span>
                ))}
              </div>
            )}
          </div>
        )
      }
    }
  }

  const cover = COVERS[style.cover]
  const pageCls = ['note-page', `font-${style.font || 'sans'}`, `size-${style.size || 'm'}`, style.wide && 'wide'].filter(Boolean).join(' ')

  return (
    <section className={pageCls}>
      <div className="np-topbar">
        <button type="button" className="link" onClick={onClose}>
          ← 내 노트
        </button>
        <span className={`note-status ${status}`} aria-live="polite">
          {saveError ? '⚠ 저장 공간이 가득 차 저장하지 못했습니다(이미지를 줄여 보세요)' : status === 'saved' ? '저장됨 ✓' : '입력 중…'}
        </span>
        <div className="np-tools">
          <label>
            글꼴
            <select value={style.font || 'sans'} onChange={(e) => setStyle({ font: e.target.value })}>
              {Object.entries(FONTS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label>
            크기
            <select value={style.size || 'm'} onChange={(e) => setStyle({ size: e.target.value })}>
              {Object.entries(SIZES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <button type="button" aria-pressed={Boolean(style.wide)} className={style.wide ? 'active' : ''} onClick={() => setStyle({ wide: !style.wide })} title="페이지 너비">
            ↔ 넓게
          </button>
          <button type="button" aria-pressed={note.pinned} className={note.pinned ? 'active' : ''} onClick={() => updateNote(noteId, { pinned: !note.pinned })} title="고정">
            📌
          </button>
          <button
            type="button"
            onClick={() => {
              const name = window.prompt('템플릿 이름', note.title || '내 템플릿')
              if (name !== null) {
                saveTemplate({ name, note: { ...note, title, body: serializeBlocks(blocks) } })
                window.alert('내 템플릿으로 저장했습니다. "＋ 새 페이지"에서 고를 수 있습니다.')
              }
            }}
            title="이 페이지 모양을 템플릿으로 저장"
          >
            ⭐ 템플릿으로 저장
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrent(noteId)
              openPanel('notes')
            }}
            title="떠 있는 노트 창에서 이어 쓰기"
          >
            ◱ 작은 창
          </button>
          <button
            type="button"
            className="danger"
            onClick={() => {
              if (!window.confirm(`"${title || '제목 없는 노트'}"를 지울까요?`)) return
              deleteNote(noteId)
              onClose()
            }}
          >
            삭제
          </button>
        </div>
      </div>

      <div className={`np-cover${cover ? '' : ' empty'}`} style={cover ? { background: cover } : undefined}>
        <button type="button" className="np-cover-btn" onClick={() => setPop(pop === 'cover' ? null : 'cover')}>
          🎨 {cover ? '커버 바꾸기' : '커버 추가'}
        </button>
        {pop === 'cover' && (
          <div className="np-pop np-cover-pop" role="dialog" aria-label="커버 고르기">
            {Object.entries(COVERS).map(([k, v]) => (
              <button
                key={k}
                type="button"
                className={`np-swatch${style.cover === k || (!style.cover && k === 'none') ? ' on' : ''}`}
                style={v ? { background: v } : undefined}
                onClick={() => {
                  setStyle({ cover: k === 'none' ? '' : k })
                  setPop(null)
                }}
              >
                <span>{COVER_LABEL[k]}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="np-body">
        <div className="np-icon-wrap">
          <button type="button" className={`np-icon${style.icon ? '' : ' empty'}`} onClick={() => setPop(pop === 'icon' ? null : 'icon')} title="아이콘 바꾸기">
            {style.icon || '＋ 아이콘'}
          </button>
          {pop === 'icon' && (
            <EmojiPop
              onPick={(icon) => {
                setStyle({ icon })
                setPop(null)
              }}
              onRemove={style.icon ? () => (setStyle({ icon: '' }), setPop(null)) : undefined}
              onClose={() => setPop(null)}
            />
          )}
        </div>
        <textarea
          className="np-title"
          rows={1}
          ref={autosize}
          value={title}
          placeholder="제목 없음"
          onChange={(e) => {
            setTitle(e.target.value.replace(/\n/g, ''))
            autosize(e.target)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              e.preventDefault()
              setFocus({ id: blocks[0].id, caret: 0 })
            }
          }}
        />
        <div className="np-meta">
          {note.ref && (
            <span className="np-ref">
              📍{' '}
              {note.ref.kind === 'process' && onOpenProcess ? (
                <button type="button" className="link inline-link" onClick={() => onOpenProcess(note.ref.id)}>
                  {note.ref.label}
                </button>
              ) : (
                note.ref.label
              )}
            </span>
          )}
          {note.tags.map((t) => (
            <button key={t} type="button" className="chip small" title="눌러서 태그 빼기" onClick={() => updateNote(noteId, { tags: note.tags.filter((x) => x !== t) })}>
              #{t} ✕
            </button>
          ))}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const t = tag.trim().replace(/^#/, '')
              if (t && !note.tags.includes(t)) updateNote(noteId, { tags: [...note.tags, t] })
              setTag('')
            }}
          >
            <input className="np-tag-input" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="+ 태그" aria-label="태그 추가" />
          </form>
        </div>

        <div className="np-blocks">
          {blocks.map((b, i) => (
            <div
              key={b.id}
              className={`nb-row${drag?.over === b.id && drag.from !== b.id ? ' drop' : ''}${focus?.id === b.id ? ' focused' : ''}`}
              onDragOver={(e) => {
                if (!drag) return
                e.preventDefault()
                if (drag.over !== b.id) setDrag((d) => ({ ...d, over: b.id }))
              }}
              onDrop={(e) => {
                e.preventDefault()
                if (!drag) return
                setBlocks((list) => {
                  const from = list.findIndex((x) => x.id === drag.from)
                  const moving = list[from]
                  const rest = list.filter((x) => x.id !== drag.from)
                  const to = rest.findIndex((x) => x.id === b.id)
                  return [...rest.slice(0, to + (from < i ? 1 : 0)), moving, ...rest.slice(to + (from < i ? 1 : 0))]
                })
                setDrag(null)
              }}
            >
              <div className="nb-gutter">
                <button type="button" className="nb-add" title="아래에 블록 추가" onClick={() => insertAfter(b.id, newBlock('p'))}>
                  ＋
                </button>
                <button
                  type="button"
                  className="nb-handle"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = 'move'
                    e.dataTransfer.setData('text/plain', b.id)
                    setDrag({ from: b.id, over: null })
                  }}
                  onDragEnd={() => setDrag(null)}
                  onClick={() => setMenu(menu === b.id ? null : b.id)}
                  title="끌어서 옮기기 · 눌러서 메뉴"
                  aria-label="블록 메뉴"
                >
                  ⋮⋮
                </button>
              </div>
              <div className="nb-content">{renderBlock(b, i)}</div>

              {menu === b.id && (
                <div className="np-pop nb-menu" role="menu">
                  <p className="np-pop-title">바꾸기</p>
                  <div className="nb-menu-types">
                    {BLOCK_TYPES.map((t) => (
                      <button key={t.type} type="button" className={t.type === b.type ? 'on' : ''} onClick={() => convert(b.id, t.type)}>
                        <span className="nb-type-icon">{t.icon}</span>
                        {t.label}
                      </button>
                    ))}
                  </div>
                  {b.type === 'callout' && (
                    <>
                      <p className="np-pop-title">색</p>
                      <div className="nb-colors">
                        {COLORS.map((c) => (
                          <button key={c} type="button" className={`nb-color c-${c}${b.color === c ? ' on' : ''}`} title={COLOR_LABEL[c]} aria-label={COLOR_LABEL[c]} onClick={() => patch(b.id, { color: c })} />
                        ))}
                      </div>
                    </>
                  )}
                  <div className="nb-menu-actions">
                    <button type="button" onClick={() => (move(b.id, -1), setMenu(null))} disabled={i === 0}>
                      ↑ 위로
                    </button>
                    <button type="button" onClick={() => (move(b.id, 1), setMenu(null))} disabled={i === blocks.length - 1}>
                      ↓ 아래로
                    </button>
                    <button type="button" onClick={() => (insertAfter(b.id, { ...structuredClone(b), id: newBlock().id }), setMenu(null))}>
                      ⧉ 복제
                    </button>
                    <button type="button" className="danger" onClick={() => (remove(b.id, false), setMenu(null))}>
                      🗑 삭제
                    </button>
                  </div>
                </div>
              )}

              {slash?.id === b.id && slashItems.length > 0 && (
                <div className="np-pop nb-slash" role="listbox" aria-label="블록 넣기">
                  <p className="np-pop-title">블록 넣기 {slash.query && `· "${slash.query}"`}</p>
                  {slashItems.map((t, k) => (
                    <button
                      key={t.type}
                      type="button"
                      role="option"
                      aria-selected={k === slash.index}
                      className={k === slash.index ? 'on' : ''}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => convert(b.id, t.type, '')}
                    >
                      <span className="nb-type-icon">{t.icon}</span>
                      <span>
                        <strong>{t.label}</strong>
                        <small>{t.desc}</small>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          className="np-tail"
          onClick={() => {
            const last = blocks.at(-1)
            if (last?.type === 'p' && !last.text) setFocus({ id: last.id, caret: 0 })
            else {
              const nb = newBlock('p')
              setBlocks((list) => [...list, nb])
              setFocus({ id: nb.id, caret: 0 })
            }
          }}
        >
          ＋ 눌러서 이어 쓰기 · “/”로 블록 넣기
        </button>
        <p className="muted np-help">
          단축키: <kbd>#</kbd> 제목 · <kbd>-</kbd> 목록 · <kbd>[]</kbd> 할 일 · <kbd>&gt;</kbd> 인용 · <kbd>!!</kbd> 콜아웃 · <kbd>&gt;&gt;</kbd> 토글 · <kbd>---</kbd> 구분선 (뒤에 띄어쓰기) ·{' '}
          <kbd>Ctrl+B</kbd> 굵게 · <kbd>Ctrl+Shift+H</kbd> 형광펜
        </p>
      </div>
    </section>
  )
}

function EmojiPop({ onPick, onRemove, onClose }) {
  const [custom, setCustom] = useState('')
  return (
    <div className="np-pop np-emoji-pop" role="dialog" aria-label="아이콘 고르기">
      <div className="np-emoji-grid">
        {ICONS.map((e) => (
          <button key={e} type="button" onClick={() => onPick(e)}>
            {e}
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (custom.trim()) onPick([...custom.trim()].slice(0, 2).join(''))
        }}
      >
        <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="다른 이모지 붙여넣기" aria-label="이모지 직접 입력" />
      </form>
      <div className="button-row">
        {onRemove && (
          <button type="button" className="link" onClick={onRemove}>
            아이콘 빼기
          </button>
        )}
        <button type="button" className="link" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  )
}

function TableEditor({ b, onChange }) {
  const rows = b.rows?.length ? b.rows : [['', '']]
  const set = (r, c, v) => onChange(rows.map((row, i) => (i === r ? row.map((x, j) => (j === c ? v : x)) : row)))
  return (
    <div className="nb-table-wrap edit">
      <table className="nb-table">
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => {
                const Cell = r === 0 ? 'th' : 'td'
                return (
                  <Cell key={c}>
                    <input value={cell} onChange={(e) => set(r, c, e.target.value)} placeholder={r === 0 ? '머리글' : ''} aria-label={`${r + 1}행 ${c + 1}열`} />
                  </Cell>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="nb-table-tools">
        <button type="button" onClick={() => onChange([...rows, rows[0].map(() => '')])}>
          ＋ 행
        </button>
        <button type="button" onClick={() => onChange(rows.map((r) => [...r, '']))}>
          ＋ 열
        </button>
        <button type="button" disabled={rows.length <= 1} onClick={() => onChange(rows.slice(0, -1))}>
          − 행
        </button>
        <button type="button" disabled={rows[0].length <= 1} onClick={() => onChange(rows.map((r) => r.slice(0, -1)))}>
          − 열
        </button>
      </div>
    </div>
  )
}

function ImageEditor({ b, onChange }) {
  const fileRef = useRef(null)
  const [error, setError] = useState('')
  const [url, setUrl] = useState('')
  if (b.url)
    return (
      <figure className="nb-image edit">
        <img src={b.url} alt={b.alt || ''} />
        <input className="nb-caption" value={b.alt} onChange={(e) => onChange({ alt: e.target.value })} placeholder="설명 (선택)" />
        <button type="button" className="link" onClick={() => onChange({ url: '' })}>
          이미지 바꾸기
        </button>
      </figure>
    )
  return (
    <div className="nb-image-empty">
      <button type="button" onClick={() => fileRef.current?.click()}>
        🖼 파일에서 고르기
      </button>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (/^https?:\/\//.test(url.trim())) onChange({ url: url.trim() })
          else setError('https:// 로 시작하는 이미지 주소를 넣어 주세요.')
        }}
      >
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="또는 이미지 주소 붙여넣기 후 Enter" aria-label="이미지 주소" />
      </form>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={async (e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (!file) return
          try {
            const data = await shrinkImage(file)
            if (data.length > 1_500_000) setError('이미지가 커서 브라우저 저장 공간이 부족할 수 있습니다. 더 작은 이미지를 권합니다.')
            onChange({ url: data, alt: file.name.replace(/\.[^.]+$/, '') })
          } catch (err) {
            setError(err.message)
          }
        }}
      />
      {error && <p className="ai-error">{error}</p>}
      <small className="muted">파일은 긴 변 1200px로 줄여 이 브라우저에만 저장됩니다.</small>
    </div>
  )
}

export { openNotePage }
