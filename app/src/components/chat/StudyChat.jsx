import { useEffect, useRef, useState } from 'react'
import { useApiKey } from '../../lib/apiKey.js'
import { useStoredState } from '../../lib/storage.js'
import { floatStore, setDot, useIsMobile } from '../../lib/floatState.js'
import { appendToCurrentNote, notesFor, useNotes } from '../../lib/notes.js'
import { processes, STAGES, STAGE_ORDER } from '../../data/processes.js'
import { machines } from '../../data/machineSim.js'
import { AiKeyBox } from '../AiTutor.jsx'
import ModelPicker from './ModelPicker.jsx'
import MiniText from '../MiniText.jsx'

// 공부 도우미 챗봇. 지금 보는 공정·장비의 앱 자료만 근거로 답합니다(lib/studyChat.js).
// 대화는 공정별로 따로 이 브라우저에 저장합니다(공정당 최근 50개).

const loadChat = () => import('../../lib/studyChat.js')
const MODE_LIST = [
  { id: 'explain', label: '설명', hint: '바로 쉽게 설명' },
  { id: 'analogy', label: '비유', hint: '일상 비유로 먼저' },
  { id: 'coach', label: '코칭', hint: '질문으로 스스로 답하게' },
  { id: 'quiz', label: '퀴즈', hint: '한 문제씩 내고 채점' },
]
const MAX_KEEP = 50
const SEND_TURNS = 10

const keyOf = (ref) => (ref ? `tutor.chat.${ref.kind}.${ref.id}` : 'tutor.chat.none')
function readChat(ref) {
  try {
    const raw = localStorage.getItem(keyOf(ref))
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}
function writeChat(ref, list) {
  try {
    localStorage.setItem(keyOf(ref), JSON.stringify(list.slice(-MAX_KEEP)))
  } catch {
    // 저장소를 못 쓰면 이번 화면에서만 유지합니다.
  }
}

const sameRef = (a, b) => (a?.kind ?? null) === (b?.kind ?? null) && (a?.id ?? null) === (b?.id ?? null)

function suggestions(ref) {
  if (ref?.kind === 'machine')
    return ['이 설비는 어떤 순서로 동작합니까?', '조건을 바꾸면 어떤 알람이 날 수 있습니까?', '대표 알람의 원인과 조치를 정리해 주십시오', '이 설비의 핵심 용어 3개만 정리해 주십시오']
  if (ref?.kind === 'process')
    return ['이 공정은 왜 필요합니까?', '앞 공정이 잘못되면 여기서 무슨 일이 생깁니까?', '이 공정의 대표 불량과 원인은 무엇입니까?', '핵심 용어 3개만 정리해 주십시오']
  return ['반도체 전체 공정 흐름을 짧게 설명해 주십시오', '전공정과 후공정은 무엇이 다릅니까?', '처음 공부할 때 어떤 순서로 보면 좋습니까?']
}

// 대화 대상으로 고를 수 있는 목록
const TARGETS = [
  ...STAGE_ORDER.map((s) => ({
    label: `공정 · ${STAGES[s].name.ko}`,
    items: processes.filter((p) => p.stage === s).map((p) => ({ kind: 'process', id: p.id, label: p.name.ko })),
  })),
  { label: '설비', items: machines.map((m) => ({ kind: 'machine', id: m.id, label: m.name })) },
]

export default function StudyChat({ currentRef, onOpenProcess, onOpenMachine }) {
  const { apiKey } = useApiKey()
  const mobile = useIsMobile()
  const notes = useNotes()
  const [mode, setMode] = useStoredState('tutor.chat.mode', 'explain')
  const [withNotes, setWithNotes] = useStoredState('tutor.chat.withNotes', false)
  const [pinned, setPinned] = useState(false)
  const [chatRef, setChatRef] = useState(currentRef)
  const [messages, setMessages] = useState(() => readChat(currentRef))
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const abort = useRef(null)
  const scroller = useRef(null)

  // 화면을 옮기면 대화 대상도 따라갑니다. 고정했거나 답을 받는 중이면 그대로 둡니다.
  useEffect(() => {
    if (pinned || busy || sameRef(chatRef, currentRef)) return
    setChatRef(currentRef)
    setMessages(readChat(currentRef))
    setError('')
  }, [currentRef, pinned, busy, chatRef])

  // 새 글이 오면 맨 아래로
  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  const pick = (ref) => {
    setChatRef(ref)
    setMessages(readChat(ref))
    setPinned(!sameRef(ref, currentRef))
    setError('')
  }

  const send = async (text, base = messages) => {
    const q = text.trim()
    if (!q || busy || !apiKey) return
    const ref = chatRef
    const history = [...base, { role: 'user', text: q, at: Date.now() }]
    const answering = [...history, { role: 'assistant', text: '', at: Date.now(), streaming: true }]
    setMessages(answering)
    setInput('')
    setError('')
    setBusy(true)
    const controller = new AbortController()
    abort.current = controller
    const chat = await loadChat()
    const replace = (patch) =>
      setMessages((list) => {
        const next = [...list]
        next[next.length - 1] = { ...next[next.length - 1], ...patch }
        return next
      })
    let streamed = ''
    let final
    try {
      const myNotes = withNotes && ref ? notesFor(notes, ref).map((n) => `- ${n.title ? `${n.title}: ` : ''}${n.body}`).join('\n') : ''
      const answer = await chat.streamChat({
        apiKey,
        mode,
        ref,
        history,
        notes: myNotes,
        signal: controller.signal,
        onText: (t) => {
          streamed = t
          replace({ text: t })
        },
      })
      final = [...history, { role: 'assistant', text: answer, at: Date.now() }]
    } catch (err) {
      const aborted = controller.signal.aborted
      // 받은 데까지는 남깁니다.
      final = streamed ? [...history, { role: 'assistant', text: `${streamed}${aborted ? '\n\n(중지됨)' : ''}`, at: Date.now() }] : history
      if (!aborted) {
        const { aiErrorText } = await import('../../lib/aiTutor.js')
        setError(aiErrorText(err))
      }
    }
    setMessages(final)
    writeChat(ref, final)
    setBusy(false)
    abort.current = null
    // 창이 줄어 있을 때 답이 끝나면 동그라미에 점을 찍습니다.
    if (!floatStore.get().open.chat) setDot('chat', true)
  }

  const regenerate = () => {
    const lastUser = messages.findLastIndex((m) => m.role === 'user')
    if (lastUser < 0) return
    send(messages[lastUser].text, messages.slice(0, lastUser))
  }

  const clear = () => {
    if (!window.confirm('이 공정의 대화를 모두 지울까요?')) return
    setMessages([])
    writeChat(chatRef, [])
  }

  if (!apiKey)
    return (
      <div className="study-chat">
        <p className="muted">
          공부하다 궁금한 것을 물어보는 AI 도우미입니다. 본인의 Claude API 키를 넣으면 쓸 수 있고, 지금 보는 공정의 앱 자료만 근거로 답합니다.
        </p>
        <AiKeyBox compact />
      </div>
    )

  const lastUserText = [...messages].reverse().find((m) => m.role === 'user')?.text ?? ''
  const asksJudge = chatRef?.kind === 'machine' && /판정|정상인지|불량인지|합격/.test(lastUserText)

  return (
    <div className="study-chat">
      <div className="chat-head">
        <div className="chat-target">
          <span>📍</span>
          <select
            value={chatRef ? `${chatRef.kind}:${chatRef.id}` : ''}
            aria-label="질문할 공정·설비"
            disabled={busy}
            onChange={(e) => {
              const [kind, id] = e.target.value.split(':')
              const found = TARGETS.flatMap((g) => g.items).find((x) => x.kind === kind && x.id === id)
              pick(found ?? null)
            }}
          >
            <option value="">특정 공정 없음</option>
            {TARGETS.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {g.items.map((x) => (
                  <option key={`${x.kind}:${x.id}`} value={`${x.kind}:${x.id}`}>
                    {x.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <button
            type="button"
            className={pinned ? 'pin active' : 'pin'}
            aria-pressed={pinned}
            title={pinned ? '고정 풀기: 화면을 옮기면 대상도 바뀝니다' : '이 대상에 고정: 화면을 옮겨도 그대로'}
            onClick={() => setPinned((p) => !p)}
          >
            📌
          </button>
        </div>
        <div className="chat-modes" role="radiogroup" aria-label="답하는 방식">
          {MODE_LIST.map((m) => (
            <button key={m.id} type="button" role="radio" aria-checked={mode === m.id} className={mode === m.id ? 'chip small active' : 'chip small'} title={m.hint} onClick={() => setMode(m.id)}>
              {m.label}
            </button>
          ))}
        </div>
        <details className="chat-settings">
          <summary>⚙ 설정</summary>
          <ModelPicker compact />
          <label className="ai-remember">
            <input type="checkbox" checked={withNotes} onChange={(e) => setWithNotes(e.target.checked)} /> 이 공정의 내 노트도 같이 보내기
          </label>
          <AiKeyBox compact />
          <button type="button" className="link" onClick={clear} disabled={busy || messages.length === 0}>
            대화 지우기
          </button>
        </details>
      </div>

      <div className="chat-log" ref={scroller} aria-live="polite">
        {messages.length > SEND_TURNS * 2 && <p className="muted chat-cut">앞 대화는 AI에 보내지 않습니다(최근 {SEND_TURNS}번 주고받은 것만 보냄).</p>}
        {messages.length === 0 && (
          <div className="chat-empty">
            <p className="muted">
              {chatRef ? `「${chatRef.label}」` : '반도체 공정'}에 대해 무엇이든 물어보세요. 앱 자료에 없는 내용은 &quot;앱 자료에서 확인되지 않음&quot;이라고 답합니다.
            </p>
            <div className="chat-suggest">
              {suggestions(chatRef).map((s) => (
                <button key={s} type="button" onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) =>
          m.role === 'user' ? (
            <div key={i} className="msg user">
              <p>{m.text}</p>
            </div>
          ) : (
            <div key={i} className="msg bot">
              {m.text ? <MiniText text={m.text} onOpenProcess={onOpenProcess} /> : <p className="muted">앱 자료를 확인하는 중…</p>}
              {!m.streaming && m.text && (
                <div className="msg-actions">
                  <span className="ai-badge">AI 요약 · 출처 확인 권장</span>
                  <button type="button" className="link" onClick={() => appendToCurrentNote(`💬 AI 답 (출처 확인 권장)\n${m.text}`, chatRef, chatRef?.label ? `${chatRef.label} 질문 정리` : '')}>
                    📝 노트로
                  </button>
                  {i === messages.length - 1 && (
                    <button type="button" className="link" onClick={regenerate} disabled={busy}>
                      ↻ 다시 답하기
                    </button>
                  )}
                  <button type="button" className="link" onClick={() => navigator.clipboard?.writeText(m.text)}>
                    복사
                  </button>
                </div>
              )}
            </div>
          ),
        )}
        {asksJudge && !busy && (
          <p className="notice">
            정상/불량 판정은 AI가 하지 않고 설비 실습의 규칙표로 계산합니다.{' '}
            <button type="button" className="link" onClick={() => onOpenMachine(chatRef.id)}>
              설비 실습에서 확인하기 →
            </button>
          </p>
        )}
        {error && <p className="ai-error">{error}</p>}
      </div>

      <form
        className="chat-input"
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
      >
        <textarea
          value={input}
          rows={2}
          placeholder={mode === 'quiz' ? '「문제 내 주세요」 또는 답을 입력' : '질문을 입력하세요'}
          aria-label="질문"
          disabled={busy}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            // 데스크톱: Enter 보내기, Shift+Enter 줄바꿈. 모바일: Enter는 줄바꿈, 보내기 버튼으로 보냄.
            if (!mobile && e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault()
              send(input)
            }
          }}
        />
        {busy ? (
          <button type="button" onClick={() => abort.current?.abort()}>
            ■ 중지
          </button>
        ) : (
          <button type="submit" className="primary" disabled={!input.trim()}>
            보내기
          </button>
        )}
      </form>
    </div>
  )
}
