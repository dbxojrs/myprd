import { useEffect, useRef, useState } from 'react'
import { addNote, deleteNote, notesFor, openNotePage, setCurrent, sortNotes, updateNote, useEdit, useNotes } from '../../lib/notes.js'
import MiniText from '../MiniText.jsx'

// 떠 있는 노트 창의 내용. 지금 보는 공정에 붙은 노트를 보여주고, 쓰던 노트는 화면을 옮겨도 그대로 둡니다.
export default function NotesPanel({ currentRef, onOpenProcess }) {
  const notes = useNotes()
  const { currentId, saveError } = useEdit()
  const [scope, setScope] = useState('here') // here | all
  const [undo, setUndo] = useState(null)
  const current = notes.find((n) => n.id === currentId)

  useEffect(() => {
    if (!undo) return
    const timer = setTimeout(() => setUndo(null), 5000)
    return () => clearTimeout(timer)
  }, [undo])

  const remove = (note) => {
    if (!window.confirm(`"${note.title || '제목 없는 노트'}"를 지울까요?`)) return
    setUndo({ restore: deleteNote(note.id) })
  }

  const list = scope === 'here' && currentRef ? notesFor(notes, currentRef) : sortNotes(notes)

  return (
    <div className="notes-panel">
      {saveError && <p className="ai-error">브라우저 저장 공간이 부족하거나 저장할 수 없습니다. 쓴 글은 이 화면에 남아 있으니 내보내기로 백업하세요.</p>}
      {current ? (
        <NoteEditor key={current.id} note={current} onBack={() => setCurrent(null)} onDelete={() => remove(current)} onOpenProcess={onOpenProcess} />
      ) : (
        <>
          <div className="notes-here">
            <span className="muted">📍 지금: {currentRef?.label ?? '특정 공정 없음'}</span>
            <div className="seg" role="radiogroup" aria-label="노트 범위">
              <button type="button" role="radio" aria-checked={scope === 'here'} className={scope === 'here' ? 'active' : ''} onClick={() => setScope('here')} disabled={!currentRef}>
                이 공정
              </button>
              <button type="button" role="radio" aria-checked={scope === 'all' || !currentRef} className={scope === 'all' || !currentRef ? 'active' : ''} onClick={() => setScope('all')}>
                전체
              </button>
            </div>
          </div>
          <button
            type="button"
            className="primary notes-new"
            onClick={() => setCurrent(addNote({ ref: currentRef ?? null }).id)}
          >
            + 새 노트{currentRef ? ` (${currentRef.label})` : ''}
          </button>
          {list.length === 0 ? (
            <p className="muted notes-empty">
              {scope === 'here' && currentRef ? '이 공정에 쓴 노트가 없습니다.' : '아직 노트가 없습니다.'}
              <br />
              공부하다 떠오른 것을 적어 보세요. 공정 설명의 글을 드래그하면 바로 노트에 넣을 수도 있습니다.
            </p>
          ) : (
            <ul className="notes-list">
              {list.map((n) => (
                <li key={n.id}>
                  <button type="button" className="note-row" onClick={() => setCurrent(n.id)}>
                    <strong>
                      {n.pinned && '📌 '}
                      {n.title || n.body.split('\n')[0].replace(/^[>\-*\s]+/, '').slice(0, 40) || '제목 없는 노트'}
                    </strong>
                    <small className="muted">
                      {scope === 'all' && n.ref ? `${n.ref.label} · ` : ''}
                      {new Date(n.updatedAt).toLocaleDateString('ko-KR')}
                      {n.tags.length > 0 && ` · ${n.tags.map((t) => `#${t}`).join(' ')}`}
                    </small>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      {undo && (
        <div className="toast" role="status">
          노트를 지웠습니다.
          <button
            type="button"
            className="link"
            onClick={() => {
              undo.restore()
              setUndo(null)
            }}
          >
            되돌리기
          </button>
        </div>
      )}
    </div>
  )
}

export function NoteEditor({ note, onBack, onDelete, onOpenProcess }) {
  const [draft, setDraft] = useState({ title: note.title, body: note.body })
  const [status, setStatus] = useState('saved') // saved | typing
  const [preview, setPreview] = useState(false)
  const [tag, setTag] = useState('')
  const saved = useRef({ title: note.title, body: note.body })
  const latest = useRef(draft)
  const area = useRef(null)
  latest.current = draft

  // 다른 곳에서 노트에 글을 붙이면(선택 글·챗봇 답) 편집 칸에도 반영합니다.
  useEffect(() => {
    if (note.title !== saved.current.title || note.body !== saved.current.body) {
      saved.current = { title: note.title, body: note.body }
      setDraft({ title: note.title, body: note.body })
    }
  }, [note.title, note.body])

  // 입력을 멈추고 0.8초 뒤 자동 저장
  useEffect(() => {
    if (draft.title === saved.current.title && draft.body === saved.current.body) return
    setStatus('typing')
    const timer = setTimeout(() => {
      saved.current = draft
      updateNote(note.id, draft)
      setStatus('saved')
    }, 800)
    return () => clearTimeout(timer)
  }, [draft, note.id])

  // 창을 닫거나 다른 노트로 바꿀 때는 바로 저장
  useEffect(
    () => () => {
      const d = latest.current
      if (d.title !== saved.current.title || d.body !== saved.current.body) updateNote(note.id, d)
    },
    [note.id],
  )

  // 서식 버튼: 선택한 글을 감싸거나 줄 앞에 "- "를 붙입니다.
  const format = (kind) => {
    const el = area.current
    if (!el) return
    const { selectionStart: s, selectionEnd: e, value } = el
    let next
    let cursor
    if (kind === 'list') {
      const lineStart = value.lastIndexOf('\n', s - 1) + 1
      const block = value.slice(lineStart, e)
      const lines = block.split('\n').map((l) => (l.startsWith('- ') ? l.slice(2) : `- ${l}`))
      next = value.slice(0, lineStart) + lines.join('\n') + value.slice(e)
      cursor = lineStart + lines.join('\n').length
    } else {
      const mark = kind === 'bold' ? '**' : '=='
      const inner = value.slice(s, e) || (kind === 'bold' ? '굵게' : '형광펜')
      next = value.slice(0, s) + mark + inner + mark + value.slice(e)
      cursor = s + mark.length + inner.length + mark.length
    }
    setDraft((d) => ({ ...d, body: next }))
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(cursor, cursor)
    })
  }

  const addTag = () => {
    const t = tag.trim().replace(/^#/, '')
    if (t && !note.tags.includes(t)) updateNote(note.id, { tags: [...note.tags, t] })
    setTag('')
  }

  return (
    <div className="note-editor">
      <div className="note-editor-top">
        <button type="button" className="link" onClick={onBack}>
          ← 목록
        </button>
        <span className={`note-status ${status}`} aria-live="polite">
          {status === 'saved' ? '저장됨 ✓' : '입력 중…'}
        </span>
        <button type="button" className="link" onClick={() => openNotePage(note.id)} title="큰 화면에서 블록으로 꾸미기">
          📄 페이지로 열기
        </button>
      </div>
      {note.ref && (
        <p className="note-ref muted">
          📍{' '}
          {note.ref.kind === 'process' && onOpenProcess ? (
            <button type="button" className="link inline-link" onClick={() => onOpenProcess(note.ref.id)}>
              {note.ref.label}
            </button>
          ) : (
            note.ref.label
          )}
          <button type="button" className="link note-unref" onClick={() => updateNote(note.id, { ref: null })} title="공정 연결 끊기">
            연결 해제
          </button>
        </p>
      )}
      <input
        className="note-title"
        value={draft.title}
        placeholder="제목 (선택)"
        aria-label="노트 제목"
        onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
      />
      <div className="note-tools" role="toolbar" aria-label="서식">
        <button type="button" onClick={() => format('list')} title="목록 (줄 앞 - )" disabled={preview}>
          • 목록
        </button>
        <button type="button" onClick={() => format('bold')} title="굵게 (**글**)" disabled={preview}>
          <strong>B</strong>
        </button>
        <button type="button" onClick={() => format('mark')} title="형광펜 (==글==)" disabled={preview}>
          <mark>형광펜</mark>
        </button>
        <button type="button" className={preview ? 'active' : ''} aria-pressed={preview} onClick={() => setPreview((p) => !p)}>
          {preview ? '✎ 편집' : '👁 보기'}
        </button>
      </div>
      {preview ? (
        <div className="note-preview">
          <MiniText text={draft.body || '(빈 노트)'} onOpenProcess={onOpenProcess} />
        </div>
      ) : (
        <textarea
          ref={area}
          className="note-body"
          value={draft.body}
          placeholder={'공부하며 떠오른 것을 적으세요.\n- 줄 앞 "- " 는 목록\n**굵게**, ==형광펜=='}
          aria-label="노트 내용"
          onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
        />
      )}
      <div className="note-tags">
        {note.tags.map((t) => (
          <button key={t} type="button" className="chip small" title="태그 지우기" onClick={() => updateNote(note.id, { tags: note.tags.filter((x) => x !== t) })}>
            #{t} ✕
          </button>
        ))}
        <input
          value={tag}
          placeholder="#태그 입력 후 Enter"
          aria-label="태그 추가"
          onChange={(e) => setTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              e.preventDefault()
              addTag()
            }
          }}
          onBlur={addTag}
        />
      </div>
      <div className="note-foot">
        <button type="button" aria-pressed={note.pinned} onClick={() => updateNote(note.id, { pinned: !note.pinned })}>
          {note.pinned ? '📌 고정됨' : '📌 고정'}
        </button>
        <button type="button" className="danger" onClick={onDelete}>
          삭제
        </button>
      </div>
    </div>
  )
}
