import { useState } from 'react'
import { useApiKey } from '../lib/apiKey.js'
import { processes, STAGES, STAGE_ORDER } from '../data/processes.js'
import { machines } from '../data/machineSim.js'

// AI 기능 화면 조각. 모두 선택 기능이며, 키가 없으면 키를 넣는 칸만 보여줍니다.
// AI 모듈(SDK 포함)은 처음 쓸 때만 내려받습니다.
const loadAi = () => import('../lib/aiTutor.js')

export function AiKeyBox({ compact = false }) {
  const { apiKey, remembered, setApiKey, setRemembered, clear } = useApiKey()
  const [draft, setDraft] = useState('')
  if (apiKey)
    return (
      <div className={`ai-key ok${compact ? ' compact' : ''}`}>
        <span>🔑 API 키 연결됨 {remembered ? '· 이 브라우저에 기억' : '· 이 탭에서만'}</span>
        <button type="button" className="link" onClick={clear}>
          키 지우기
        </button>
      </div>
    )
  return (
    <form
      className={`ai-key${compact ? ' compact' : ''}`}
      onSubmit={(e) => {
        e.preventDefault()
        if (draft.trim()) setApiKey(draft)
        setDraft('')
      }}
    >
      <label>
        <span>Claude API 키 (선택)</span>
        <input type="password" autoComplete="off" placeholder="sk-ant-..." value={draft} onChange={(e) => setDraft(e.target.value)} />
      </label>
      <label className="ai-remember">
        <input type="checkbox" checked={remembered} onChange={(e) => setRemembered(e.target.checked)} /> 이 브라우저에 기억
      </label>
      <button type="submit" className="primary" disabled={!draft.trim()}>
        연결
      </button>
      <small className="muted">
        키는 이 브라우저에서 Anthropic API로만 보내고 다른 곳에 저장하지 않습니다. 사용 요금은 키 주인에게 청구됩니다. 공용 컴퓨터에서는 "기억"을 끄세요.
      </small>
    </form>
  )
}

// 문제 해설 아래에 붙는 "AI로 더 깊게" 버튼과 답
export function AiExplain({ question, picked }) {
  const { apiKey } = useApiKey()
  const [state, setState] = useState({ status: 'idle' })
  if (!apiKey) return null
  const ask = async () => {
    setState({ status: 'loading' })
    const ai = await loadAi()
    try {
      setState({ status: 'done', text: await ai.explainDeeper({ apiKey, question, picked }) })
    } catch (error) {
      setState({ status: 'error', text: ai.aiErrorText(error) })
    }
  }
  return (
    <div className="ai-explain">
      {state.status === 'idle' && (
        <button type="button" onClick={ask}>
          🤖 AI로 더 깊게 설명 듣기
        </button>
      )}
      {state.status === 'loading' && <p className="muted">AI가 앱 자료를 바탕으로 설명을 쓰는 중…</p>}
      {state.status === 'error' && <p className="ai-error">{state.text}</p>}
      {state.status === 'done' && (
        <div className="ai-answer">
          <span className="ai-badge">AI 요약 · 출처 확인 권장</span>
          <p>{state.text}</p>
        </div>
      )}
    </div>
  )
}

// 고를 수 있는 자료 묶음: 단계별 공정, 장비
const SOURCES = [
  ...STAGE_ORDER.map((s) => ({
    id: s,
    label: `공정 · ${STAGES[s].name.ko}`,
    refs: processes.filter((p) => p.stage === s).map((p) => ({ kind: 'process', id: p.id })),
  })),
  ...machines.map((m) => ({ id: `machine:${m.id}`, label: `장비 · ${m.name}`, refs: [{ kind: 'machine', id: m.id }] })),
]
const LEVELS = ['입문', '실무', '심화']

// AI 문제 만들기 화면. 만든 문제는 onStart(questions)로 문제 풀기 화면에 넘깁니다.
export function AiQuizMaker({ onStart }) {
  const { apiKey } = useApiKey()
  const [sourceId, setSourceId] = useState(SOURCES[1].id)
  const [count, setCount] = useState(5)
  const [level, setLevel] = useState('실무')
  const [state, setState] = useState({ status: 'idle' })
  const source = SOURCES.find((s) => s.id === sourceId)

  const make = async () => {
    setState({ status: 'loading' })
    const ai = await loadAi()
    try {
      const made = await ai.generateQuestions({ apiKey, refs: source.refs, count, level })
      if (made.length === 0) throw new Error('쓸 수 있는 문제가 나오지 않았습니다. 다시 시도하세요.')
      const stamp = Date.now()
      const questions = made.map((q, i) => ({
        id: `ai-${stamp}-${i}`,
        type: 'AI 문제',
        topic: source.id,
        prompt: q.prompt,
        choices: q.choices,
        answer: q.answer,
        explain: `${q.explain}\n근거: ${q.basis}\n(AI 요약 · 출처 확인 권장)`,
        ref: source.refs[0],
        ai: true,
      }))
      setState({ status: 'idle' })
      onStart(questions, `AI · ${source.label}`)
    } catch (error) {
      setState({ status: 'error', text: ai.aiErrorText(error) })
    }
  }

  return (
    <section className="screen quiz">
      <h2>AI 문제 만들기</h2>
      <p className="muted">
        고른 범위의 앱 자료(공정 설명·장비 규칙표)만 AI에게 주고 새 문제를 만들게 합니다. AI가 만든 문제는 틀릴 수 있으니 해설의 근거 문장을 함께
        확인하세요.
      </p>
      <AiKeyBox />
      {apiKey && (
        <article className="card quiz-setup">
          <label className="quiz-field">
            <span>범위</span>
            <select value={sourceId} onChange={(e) => setSourceId(e.target.value)}>
              {SOURCES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <div className="quiz-field">
            <span>수준</span>
            <div className="button-row" role="radiogroup" aria-label="수준">
              {LEVELS.map((l) => (
                <button key={l} type="button" role="radio" aria-checked={level === l} className={level === l ? 'subtab active' : 'subtab'} onClick={() => setLevel(l)}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="quiz-field">
            <span>문제 수</span>
            <div className="button-row" role="radiogroup" aria-label="문제 수">
              {[3, 5, 10].map((n) => (
                <button key={n} type="button" role="radio" aria-checked={count === n} className={count === n ? 'subtab active' : 'subtab'} onClick={() => setCount(n)}>
                  {n}문제
                </button>
              ))}
            </div>
          </div>
          <button type="button" className="primary quiz-start" disabled={state.status === 'loading'} onClick={make}>
            {state.status === 'loading' ? 'AI가 문제를 만드는 중…' : '문제 만들기'}
          </button>
          {state.status === 'error' && <p className="ai-error">{state.text}</p>}
        </article>
      )}
    </section>
  )
}
