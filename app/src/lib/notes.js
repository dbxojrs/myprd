import { createStore, useStore } from './sharedStore.js'
import { openPanel } from './floatState.js'

// 개인 노트. 브라우저 localStorage('tutor.notes')에만 저장하고 서버나 AI로 보내지 않습니다
// (챗봇에서 사용자가 "내 노트 같이 보내기"를 켠 경우만 예외).
// 노트: { id, title, body, ref: { kind, id, label } | null, tags, pinned, createdAt, updatedAt }
export const notesStore = createStore('tutor.notes', [])
// 지금 노트 창에서 쓰고 있는 노트와 저장 실패 알림(새로고침하면 사라져도 되는 값)
export const editStore = createStore(null, { currentId: null, saveError: false })

export const useNotes = () => useStore(notesStore)
export const useEdit = () => useStore(editStore)
export const setCurrent = (currentId) => editStore.set((s) => ({ ...s, currentId }))

const newId = () => `n-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
const sameRef = (a, b) => (a?.kind ?? null) === (b?.kind ?? null) && (a?.id ?? null) === (b?.id ?? null)

function save(next) {
  const ok = notesStore.set(next)
  editStore.set((s) => ({ ...s, saveError: !ok }))
  return ok
}

export function addNote({ title = '', body = '', ref = null, tags = [] } = {}) {
  const now = new Date().toISOString()
  const note = { id: newId(), title, body, ref, tags, pinned: false, createdAt: now, updatedAt: now }
  save((list) => [note, ...list])
  return note
}

export function updateNote(id, patch) {
  save((list) => list.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n)))
}

export function deleteNote(id) {
  const list = notesStore.get()
  const index = list.findIndex((n) => n.id === id)
  const removed = list[index]
  save(list.filter((n) => n.id !== id))
  if (editStore.get().currentId === id) setCurrent(null)
  // 되돌리기용 함수
  return () => removed && save((now) => [...now.slice(0, index), removed, ...now.slice(index)])
}

export const sortNotes = (list) =>
  [...list].sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt.localeCompare(a.updatedAt))

export const notesFor = (list, ref) => sortNotes(list.filter((n) => sameRef(n.ref, ref)))

export function searchNotes(list, text = '', tag = '') {
  const q = text.trim().toLowerCase()
  return sortNotes(
    list.filter(
      (n) =>
        (!tag || n.tags.includes(tag)) &&
        (!q || `${n.title}\n${n.body}\n${n.ref?.label ?? ''}\n${n.tags.join(' ')}`.toLowerCase().includes(q)),
    ),
  )
}

// 다른 화면(공정 설명 선택 글, 시험 해설, 챗봇 답)에서 노트로 보냅니다.
// 지금 쓰는 노트가 있으면 그 끝에 붙이고, 없으면 새 노트를 만든 뒤 노트 창을 엽니다.
export function appendToCurrentNote(text, ref = null, title = '') {
  const { currentId } = editStore.get()
  const current = notesStore.get().find((n) => n.id === currentId)
  if (current) {
    updateNote(current.id, { body: current.body ? `${current.body.trimEnd()}\n\n${text}` : text })
  } else {
    const note = addNote({ title, body: text, ref })
    setCurrent(note.id)
  }
  openPanel('notes')
}

export const quote = (text) =>
  text
    .trim()
    .split('\n')
    .map((line) => `> ${line}`)
    .join('\n')

// 전체 노트를 .md 글로 (공정별 제목 아래 노트)
export function notesToMarkdown(list) {
  const groups = new Map()
  for (const n of sortNotes(list)) {
    const key = n.ref?.label ?? '공정 지정 없음'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(n)
  }
  const parts = ['# 내 노트', '', `내보낸 날: ${new Date().toLocaleString('ko-KR')}`, '']
  for (const [label, items] of groups) {
    parts.push(`## ${label}`, '')
    for (const n of items) {
      parts.push(`### ${n.pinned ? '📌 ' : ''}${n.title || '(제목 없음)'}`)
      if (n.tags.length) parts.push(n.tags.map((t) => `#${t}`).join(' '))
      parts.push('', n.body.replace(/==(.+?)==/g, '<mark>$1</mark>'), '')
    }
  }
  return parts.join('\n')
}

// 백업 .json 가져오기. 형식이 맞는 노트만, id가 겹치면 건너뜁니다. 가져온 개수를 돌려줍니다.
export function importNotes(data) {
  if (!Array.isArray(data)) throw new Error('노트 백업 파일 형식이 아닙니다.')
  const have = new Set(notesStore.get().map((n) => n.id))
  const ok = data.filter(
    (n) => n && typeof n.id === 'string' && typeof n.body === 'string' && !have.has(n.id),
  ).map((n) => ({
    id: n.id,
    title: typeof n.title === 'string' ? n.title : '',
    body: n.body,
    ref: n.ref && typeof n.ref.kind === 'string' ? n.ref : null,
    tags: Array.isArray(n.tags) ? n.tags.filter((t) => typeof t === 'string') : [],
    pinned: Boolean(n.pinned),
    createdAt: typeof n.createdAt === 'string' ? n.createdAt : new Date().toISOString(),
    updatedAt: typeof n.updatedAt === 'string' ? n.updatedAt : new Date().toISOString(),
  }))
  save((list) => [...ok, ...list])
  return ok.length
}

export function download(filename, text, type = 'text/markdown') {
  const url = URL.createObjectURL(new Blob([text], { type: `${type};charset=utf-8` }))
  const a = Object.assign(document.createElement('a'), { href: url, download: filename })
  document.body.append(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
