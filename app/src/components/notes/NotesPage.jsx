import { useRef, useState } from 'react'
import { findProcess, STAGES, STAGE_ORDER } from '../../data/processes.js'
import { machines } from '../../data/machineSim.js'
import { openPanel } from '../../lib/floatState.js'
import { deleteNote, download, importNotes, notesToMarkdown, searchNotes, setCurrent, updateNote, useNotes } from '../../lib/notes.js'
import MiniText from '../MiniText.jsx'

// "내 노트" 전체 화면: 검색·태그·묶어 보기, 복습 모드, 내보내기/가져오기.

function stageOf(note) {
  const ref = note.ref
  if (ref?.kind === 'process') {
    const stage = findProcess(ref.id)?.stage
    return stage ? { key: stage, label: STAGES[stage].name.ko, order: STAGE_ORDER.indexOf(stage) } : null
  }
  if (ref?.kind === 'machine') {
    const stage = machines.find((m) => m.id === ref.id)?.stage
    return { key: `eq-${stage}`, label: stage === 'front' ? '설비 실습 · FAB' : '설비 실습 · PKG·TEST', order: 10 }
  }
  if (ref?.kind === 'quiz') return { key: 'quiz', label: '시험', order: 11 }
  return null
}

function group(list, by) {
  const map = new Map()
  const put = (key, label, order, note) => {
    if (!map.has(key)) map.set(key, { key, label, order, notes: [] })
    map.get(key).notes.push(note)
  }
  for (const n of list) {
    if (by === 'stage') {
      const s = stageOf(n)
      if (s) put(s.key, s.label, s.order, n)
      else put('none', '공정 지정 없음', 99, n)
    } else if (by === 'tag') {
      if (n.tags.length === 0) put('#', '태그 없음', 1e9, n)
      for (const t of n.tags) put(t, `#${t}`, t, n)
    } else {
      const d = n.updatedAt.slice(0, 10)
      put(d, new Date(n.updatedAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }), -new Date(d).getTime(), n)
    }
  }
  return [...map.values()].sort((a, b) => (a.order < b.order ? -1 : a.order > b.order ? 1 : 0))
}

export default function NotesPage({ onOpenProcess }) {
  const notes = useNotes()
  const [text, setText] = useState('')
  const [tag, setTag] = useState('')
  const [by, setBy] = useState('stage')
  const [review, setReview] = useState(null) // 복습 모드 { index, shown }
  const [message, setMessage] = useState('')
  const fileRef = useRef(null)

  const tags = [...new Set(notes.flatMap((n) => n.tags))].sort()
  const found = searchNotes(notes, text, tag)
  const groups = group(found, by)

  const edit = (id) => {
    setCurrent(id)
    openPanel('notes')
  }

  const onImport = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const count = importNotes(JSON.parse(await file.text()))
      setMessage(`노트 ${count}개를 가져왔습니다.`)
    } catch (error) {
      setMessage(`가져오지 못했습니다: ${error.message}`)
    }
  }

  if (review) return <ReviewMode notes={found} start={review.index} onClose={() => setReview(null)} onOpenProcess={onOpenProcess} />

  return (
    <section className="screen notes-page">
      <div className="notes-page-head">
        <div>
          <h2>내 노트</h2>
          <p className="muted">
            공부하며 쓴 노트 {notes.length}개. 노트는 이 브라우저에만 저장되므로 가끔 내보내기로 백업하세요. 어느 화면에서든 오른쪽 아래 📝 동그라미(Alt+N)로 바로 쓸 수 있습니다.
          </p>
        </div>
        <div className="button-row">
          <button type="button" className="primary" disabled={found.length === 0} onClick={() => setReview({ index: 0 })}>
            🔁 복습 모드
          </button>
          <button type="button" disabled={notes.length === 0} onClick={() => download(`내노트-${new Date().toISOString().slice(0, 10)}.md`, notesToMarkdown(notes))}>
            ⬇ .md 내보내기
          </button>
          <button
            type="button"
            disabled={notes.length === 0}
            onClick={() => download(`내노트-백업-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(notes, null, 2), 'application/json')}
          >
            ⬇ 백업(.json)
          </button>
          <button type="button" onClick={() => fileRef.current?.click()}>
            ⬆ 백업 가져오기
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={onImport} />
        </div>
        {message && (
          <p className="notice" role="status">
            {message}
          </p>
        )}
      </div>

      <div className="notes-layout">
        <details className="notes-filter" open={typeof window !== 'undefined' && window.innerWidth >= 960}>
          <summary>검색 · 거르기</summary>
          <input type="search" value={text} placeholder="노트 검색" aria-label="노트 검색" onChange={(e) => setText(e.target.value)} />
          <div className="quiz-field">
            <span>묶어 보기</span>
            <div className="seg" role="radiogroup" aria-label="묶어 보기">
              {[
                ['stage', '공정 단계'],
                ['tag', '태그'],
                ['date', '날짜'],
              ].map(([id, label]) => (
                <button key={id} type="button" role="radio" aria-checked={by === id} className={by === id ? 'active' : ''} onClick={() => setBy(id)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          {tags.length > 0 && (
            <div className="quiz-field">
              <span>태그</span>
              <div className="button-row">
                <button type="button" className={tag === '' ? 'chip small active' : 'chip small'} onClick={() => setTag('')}>
                  전체
                </button>
                {tags.map((t) => (
                  <button key={t} type="button" className={tag === t ? 'chip small active' : 'chip small'} onClick={() => setTag(tag === t ? '' : t)}>
                    #{t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </details>

        <div className="notes-groups">
          {found.length === 0 && (
            <p className="muted">{notes.length === 0 ? '아직 노트가 없습니다. 오른쪽 아래 📝 동그라미를 눌러 첫 노트를 써 보세요.' : '찾는 노트가 없습니다.'}</p>
          )}
          {groups.map((g) => (
            <section key={g.key} className="notes-group">
              <h3>
                {g.label} <small className="muted">{g.notes.length}</small>
              </h3>
              <div className="notes-cards">
                {g.notes.map((n) => (
                  <article key={`${g.key}-${n.id}`} className="card note-card">
                    <header>
                      <strong>
                        {n.pinned && '📌 '}
                        {n.title || '제목 없는 노트'}
                      </strong>
                      {n.ref &&
                        (n.ref.kind === 'process' ? (
                          <button type="button" className="link inline-link" onClick={() => onOpenProcess(n.ref.id)}>
                            {n.ref.label}
                          </button>
                        ) : (
                          <span className="muted">{n.ref.label}</span>
                        ))}
                    </header>
                    <div className="note-card-body">
                      <MiniText text={n.body || '(빈 노트)'} onOpenProcess={onOpenProcess} />
                    </div>
                    <footer>
                      <small className="muted">
                        {new Date(n.updatedAt).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' })}
                        {n.tags.length > 0 && ` · ${n.tags.map((t) => `#${t}`).join(' ')}`}
                      </small>
                      <div className="button-row">
                        <button type="button" onClick={() => edit(n.id)}>
                          ✎ 편집
                        </button>
                        <button type="button" aria-pressed={n.pinned} onClick={() => updateNote(n.id, { pinned: !n.pinned })} title="고정">
                          📌
                        </button>
                        <button
                          type="button"
                          className="danger"
                          onClick={() => window.confirm(`"${n.title || '제목 없는 노트'}"를 지울까요?`) && deleteNote(n.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </footer>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}

// 복습 모드: 하나씩 크게, 본문은 가렸다가 눌러서 드러냅니다. 모바일은 좌우로 밀어 넘깁니다.
function ReviewMode({ notes, start, onClose, onOpenProcess }) {
  const [index, setIndex] = useState(start)
  const [shown, setShown] = useState(false)
  const swipe = useRef(null)
  const note = notes[index]
  const go = (next) => {
    if (next < 0 || next >= notes.length) return
    setIndex(next)
    setShown(false)
  }
  if (!note) return null
  return (
    <section
      className="screen notes-review"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(index + 1)
        if (e.key === 'ArrowLeft') go(index - 1)
        if (e.key === ' ' && e.target === e.currentTarget) {
          e.preventDefault()
          setShown(true)
        }
      }}
      tabIndex={-1}
    >
      <div className="quiz-top">
        <span>
          {index + 1} / {notes.length}
        </span>
        <div className="home-progress-bar" aria-hidden="true">
          <span style={{ width: `${((index + 1) / notes.length) * 100}%` }} />
        </div>
        <button type="button" className="link" onClick={onClose}>
          복습 끝내기
        </button>
      </div>
      <article
        className="card review-card"
        onPointerDown={(e) => (swipe.current = e.clientX)}
        onPointerUp={(e) => {
          const dx = swipe.current === null ? 0 : e.clientX - swipe.current
          swipe.current = null
          if (dx < -50) go(index + 1)
          else if (dx > 50) go(index - 1)
        }}
      >
        <p className="muted">{note.ref?.label ?? '공정 지정 없음'}</p>
        <h3>{note.title || '제목 없는 노트'}</h3>
        <p className="muted">이 노트에 무엇을 적었는지 먼저 떠올려 보세요.</p>
        {shown ? (
          <MiniText text={note.body || '(빈 노트)'} onOpenProcess={onOpenProcess} />
        ) : (
          <button type="button" className="review-cover" onClick={() => setShown(true)}>
            눌러서 내용 보기
          </button>
        )}
      </article>
      <div className="quiz-nav">
        <button type="button" disabled={index === 0} onClick={() => go(index - 1)}>
          ← 이전
        </button>
        <button type="button" className="primary" disabled={index === notes.length - 1} onClick={() => go(index + 1)}>
          다음 →
        </button>
      </div>
      <p className="muted quiz-keys">키보드: ← → 넘기기 · 모바일: 좌우로 밀기</p>
    </section>
  )
}
