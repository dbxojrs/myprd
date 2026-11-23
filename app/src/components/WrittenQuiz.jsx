import { useState } from 'react'
import { checkKeywords, gradeShort, makeWritten, norm, WRITTEN_KINDS, WRITTEN_SCOPES, writtenTopicLabel } from '../lib/writtenQuiz.js'
import { useStoredState } from '../lib/storage.js'
import { useApiKey } from '../lib/apiKey.js'
import { appendToCurrentNote } from '../lib/notes.js'
import { markActive } from '../lib/activity.js'
import { AiKeyBox } from './AiTutor.jsx'

// 심화 주관식 시험. 문제는 공정 데이터에서 만듭니다(lib/writtenQuiz.js).
// 단답형은 규칙으로 바로 채점하고, 서술형은 핵심어 검사 + 모범 답안을 보고 직접 판정합니다(AI 채점은 선택).
// 판정 점수: 맞음 1, 부분 0.5, 틀림 0. 틀리거나 부분 점수인 문제는 'tutor.wrongWritten'에 남습니다.

const COUNTS = [5, 10, 15]
const POINT = { correct: 1, partial: 0.5, wrong: 0 }
const VERDICT = { correct: '⭕ 맞음', partial: '🔺 부분', wrong: '❌ 틀림' }
const loadAi = () => import('../lib/aiTutor.js')

// 힌트: 글자 수와 첫 글자의 초성(예: "캐필러리" → 4글자, ㅋ로 시작)
const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'
function hintOf(q) {
  // 정답 후보 중 가장 짧은 한글 이름(없으면 가장 짧은 이름)을 기준으로 알려 줍니다.
  const byLen = [...q.accept].filter((v) => !v.includes('·') && norm(v).length >= 2).sort((a, b) => norm(a).length - norm(b).length)
  const word = byLen.find((v) => /[가-힣]/.test(v)) ?? byLen[0] ?? q.accept[0]
  const first = word.trim()[0]
  const code = first.charCodeAt(0) - 0xac00
  const head = code >= 0 && code < 11172 ? CHO[Math.floor(code / 588)] : first
  return `정답 중 하나는 ${norm(word).length}글자, “${head}”로 시작합니다 (띄어쓰기 빼고)`
}

function toNote(q, r) {
  const answer = q.kind === 'short' ? q.answerText : q.model.join(' ')
  appendToCurrentNote(
    `✍️ ${q.prompt}\n- 내 답: ${r?.text || '(비움)'}\n- 판정: ${r?.verdict ? VERDICT[r.verdict] : '-'}\n- 모범 답: **${answer}**`,
    { kind: 'quiz', id: q.topic ?? 'quiz', label: '심화 주관식' },
    '심화 주관식 정리',
  )
}

export default function WrittenQuiz({ onOpenProcess }) {
  const [scope, setScope] = useStoredState('tutor.wq.scope', 'all')
  const [kind, setKind] = useStoredState('tutor.wq.kind', 'mix')
  const [count, setCount] = useStoredState('tutor.wq.count', 5)
  const [attempt, setAttempt] = useStoredState('tutor.wq.attempt', 0)
  const [wrong, setWrong] = useStoredState('tutor.wrongWritten', [])
  const [history, setHistory] = useStoredState('tutor.wq.history', [])
  const [run, setRun] = useState(null) // { questions, results: [{text, verdict, ai}], index, done, fromWrong, label }

  const start = (questions, fromWrong, label) => setRun({ questions, results: questions.map(() => null), index: 0, fromWrong, label })

  const startNew = () => {
    const seed = attempt + 1
    setAttempt(seed)
    const qs = makeWritten({ scope, kind, count, seed })
    start(qs, false, `${WRITTEN_SCOPES.find((s) => s.id === scope)?.label} · ${WRITTEN_KINDS.find((k) => k.id === kind)?.label}`)
  }

  const finish = (results) => {
    markActive()
    const qs = run.questions
    const score = qs.reduce((sum, q, i) => sum + (POINT[results[i]?.verdict] ?? 0), 0)
    setWrong((list) => {
      let next = [...list]
      qs.forEach((q, i) => {
        const ok = results[i]?.verdict === 'correct'
        const at = next.findIndex((w) => w.q.id === q.id)
        if (ok && at >= 0) next.splice(at, 1)
        else if (!ok) {
          if (at >= 0) next[at] = { ...next[at], misses: next[at].misses + 1, at: new Date().toISOString() }
          else next = [{ q, misses: 1, at: new Date().toISOString() }, ...next]
        }
      })
      return next.slice(0, 200)
    })
    if (!run.fromWrong) setHistory((list) => [{ at: new Date().toISOString(), label: run.label, score, total: qs.length }, ...list].slice(0, 20))
    setRun({ ...run, results, done: true })
  }

  if (run) return <WrittenRun run={run} setRun={setRun} finish={finish} onOpenProcess={onOpenProcess} />

  return (
    <section className="screen quiz">
      <h2>심화 주관식</h2>
      <p className="muted">
        보기 없이 직접 써서 맞힙니다. 단답형은 띄어쓰기·영문 대소문자를 무시하고 바로 채점하고, 서술형은 핵심어가 들어갔는지 보여 준 뒤 모범 답안과 비교해 직접 판정합니다. 문제는 앱의 공정
        설명에서 만들어지며 검수 전입니다.
      </p>
      <article className="card quiz-setup">
        <label className="quiz-field">
          <span>범위</span>
          <select value={scope} onChange={(e) => setScope(e.target.value)}>
            {WRITTEN_SCOPES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <div className="quiz-field">
          <span>문제 형식</span>
          <div className="button-row" role="radiogroup" aria-label="문제 형식">
            {WRITTEN_KINDS.map((k) => (
              <button key={k.id} type="button" role="radio" aria-checked={kind === k.id} className={kind === k.id ? 'subtab active' : 'subtab'} onClick={() => setKind(k.id)}>
                {k.label}
              </button>
            ))}
          </div>
        </div>
        <div className="quiz-field">
          <span>문제 수</span>
          <div className="button-row" role="radiogroup" aria-label="문제 수">
            {COUNTS.map((n) => (
              <button key={n} type="button" role="radio" aria-checked={count === n} className={count === n ? 'subtab active' : 'subtab'} onClick={() => setCount(n)}>
                {n}문제
              </button>
            ))}
          </div>
        </div>
        <button type="button" className="primary quiz-start" onClick={startNew}>
          시작하기
        </button>
      </article>

      {wrong.length > 0 && (
        <article className="card">
          <h3>다시 풀 문제 {wrong.length}개</h3>
          <p className="muted">틀렸거나 부분 점수였던 주관식 문제입니다. 다시 풀어 “맞음”이 되면 빠집니다.</p>
          <div className="button-row">
            <button type="button" className="primary" onClick={() => start(wrong.map((w) => w.q).slice(0, 15), true, '주관식 다시 풀기')}>
              다시 풀기
            </button>
            <button type="button" onClick={() => setWrong([])}>
              목록 비우기
            </button>
          </div>
        </article>
      )}

      <details className="card ai-optional">
        <summary>🤖 서술형 AI 채점 (선택 · 내 API 키 필요)</summary>
        <p className="muted">키를 연결하면 서술형 답 아래에 “AI로 채점 받기” 버튼이 생깁니다. AI 판정은 참고용이고, 최종 판정은 직접 바꿀 수 있습니다.</p>
        <AiKeyBox compact />
      </details>

      {history.length > 0 && (
        <article className="card">
          <h3>최근 기록</h3>
          <ol className="quiz-history">
            {history.slice(0, 8).map((h) => (
              <li key={h.at}>
                <span>{new Date(h.at).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                <span>{h.label}</span>
                <strong>
                  {h.score} / {h.total}
                </strong>
              </li>
            ))}
          </ol>
        </article>
      )}
    </section>
  )
}

function WrittenRun({ run, setRun, finish, onOpenProcess }) {
  const { questions, results, index, done } = run
  const q = questions[index]
  const r = results[index]
  const [draft, setDraft] = useState(r?.text ?? '')
  const [hint, setHint] = useState(false)
  const last = index === questions.length - 1
  const submitted = Boolean(r?.submitted)

  const save = (patch) => {
    const next = [...results]
    next[index] = { ...(next[index] ?? {}), ...patch }
    setRun({ ...run, results: next })
    return next
  }

  const submit = () => {
    if (q.kind === 'short') save({ text: draft, submitted: true, verdict: gradeShort(q, draft) ? 'correct' : 'wrong', hint })
    else save({ text: draft, submitted: true, verdict: null, hits: checkKeywords(q, draft) })
  }

  const go = (to) => {
    setRun({ ...run, index: to })
    setDraft(results[to]?.text ?? '')
    setHint(false)
  }

  if (done) {
    const score = questions.reduce((sum, x, i) => sum + (POINT[results[i]?.verdict] ?? 0), 0)
    return (
      <section className="screen quiz">
        <article className="card quiz-result">
          <p className="home-eyebrow">{run.label}</p>
          <h2>
            {score} / {questions.length}
          </h2>
          <div className="home-progress-bar" aria-hidden="true">
            <span style={{ width: `${(score / questions.length) * 100}%` }} />
          </div>
          <div className="button-row">
            <button type="button" className="primary" onClick={() => setRun(null)}>
              다른 시험 보기
            </button>
          </div>
        </article>
        <h3>문제별 정리</h3>
        <ol className="quiz-review">
          {questions.map((x, i) => {
            const v = results[i]?.verdict ?? 'wrong'
            return (
              <li key={x.id} className={`card ${v === 'correct' ? 'ok' : 'ng'}`}>
                <p className="quiz-prompt">
                  {VERDICT[v]} · {x.prompt}
                </p>
                <p className="quiz-mine">내 답: {results[i]?.text || '(비움)'}</p>
                <ModelAnswer q={x} />
                <button type="button" className="link" onClick={() => onOpenProcess(x.ref.id)}>
                  이 공정 설명 다시 보기 →
                </button>{' '}
                <button type="button" className="link" onClick={() => toNote(x, results[i])}>
                  📝 노트로
                </button>
              </li>
            )
          })}
        </ol>
      </section>
    )
  }

  return (
    <section className="screen quiz">
      <div className="quiz-top">
        <span>
          {index + 1} / {questions.length}
        </span>
        <div className="home-progress-bar" aria-hidden="true">
          <span style={{ width: `${((index + (submitted ? 1 : 0)) / questions.length) * 100}%` }} />
        </div>
        <button type="button" className="link" onClick={() => setRun(null)}>
          그만두기
        </button>
      </div>
      <article className="card quiz-card" key={q.id}>
        <div>
          <span className="quiz-tag">{q.type}</span> <span className="quiz-tag soft">{writtenTopicLabel(q.topic)}</span>
        </div>
        <p className="quiz-prompt big">{q.prompt}</p>

        <form
          className="wq-form"
          onSubmit={(e) => {
            e.preventDefault()
            if (!submitted && draft.trim()) submit()
          }}
        >
          {q.kind === 'short' ? (
            <input className="wq-input" value={draft} onChange={(e) => setDraft(e.target.value)} disabled={submitted} placeholder="답을 쓰고 Enter" aria-label="답" autoFocus />
          ) : (
            <textarea
              className="wq-input"
              rows={6}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={submitted}
              placeholder="자기 말로 써 보세요. 단계 이름·핵심 용어를 넣으면 좋습니다."
              aria-label="답"
              autoFocus
            />
          )}
          {!submitted && (
            <div className="button-row">
              <button type="submit" className="primary" disabled={!draft.trim()}>
                제출
              </button>
              {q.kind === 'short' && !hint && (
                <button type="button" onClick={() => setHint(true)}>
                  💡 힌트
                </button>
              )}
              <button type="button" className="link" onClick={() => save({ text: '', submitted: true, verdict: 'wrong', hits: q.kind === 'essay' ? checkKeywords(q, '') : undefined })}>
                모르겠어요 (답 보기)
              </button>
            </div>
          )}
          {hint && !submitted && <p className="muted">힌트: {hintOf(q)}</p>}
        </form>

        {submitted && (
          <div className={`quiz-feedback ${r.verdict === 'correct' ? 'ok' : r.verdict ? 'ng' : ''}`} aria-live="polite">
            {q.kind === 'short' ? (
              <>
                <strong>{r.verdict === 'correct' ? '정답입니다' : '틀렸습니다'}</strong>
                <ModelAnswer q={q} />
                {r.verdict === 'wrong' && r.text && (
                  <button type="button" className="link" onClick={() => save({ verdict: 'correct', self: true })}>
                    뜻이 같은 다른 말로 썼어요 → 맞음으로 인정
                  </button>
                )}
              </>
            ) : (
              <EssayCheck q={q} r={r} save={save} />
            )}
            <p>
              <button type="button" className="link" onClick={() => onOpenProcess(q.ref.id)}>
                이 공정 설명 다시 보기 →
              </button>{' '}
              <button type="button" className="link" onClick={() => toNote(q, r)}>
                📝 노트로
              </button>
            </p>
          </div>
        )}

        <div className="quiz-nav">
          <button type="button" disabled={index === 0} onClick={() => go(index - 1)}>
            ← 이전
          </button>
          {last ? (
            <button type="button" className="primary" disabled={!submitted || !r.verdict} onClick={() => finish(results)}>
              결과 보기
            </button>
          ) : (
            <button type="button" className="primary" disabled={!submitted || !r.verdict} onClick={() => go(index + 1)}>
              다음 →
            </button>
          )}
        </div>
        {submitted && !r.verdict && <p className="muted quiz-keys">모범 답안과 비교해 판정을 고르면 다음으로 넘어갈 수 있습니다.</p>}
      </article>
    </section>
  )
}

function ModelAnswer({ q }) {
  if (q.kind === 'short')
    return (
      <>
        <p>
          <strong>정답:</strong> {q.answerText}
        </p>
        <p className="quiz-explain">{q.explain}</p>
      </>
    )
  return (
    <div className="wq-model">
      <strong>모범 답안 (앱 자료)</strong>
      <ul>
        {q.model.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  )
}

// 서술형: 핵심어 검사 → 모범 답안 → 직접 판정(또는 AI 채점 참고)
function EssayCheck({ q, r, save }) {
  const { apiKey } = useApiKey()
  const [ai, setAi] = useState({ status: 'idle' })
  const hits = r.hits ?? []
  const n = hits.filter((h) => h.hit).length

  const askAi = async () => {
    setAi({ status: 'loading' })
    const mod = await loadAi()
    try {
      const result = await mod.gradeWritten({ apiKey, question: q, answer: r.text })
      setAi({ status: 'done', result })
      if (!r.verdict) save({ verdict: result.verdict, ai: true })
    } catch (error) {
      setAi({ status: 'error', text: mod.aiErrorText(error) })
    }
  }

  return (
    <>
      {hits.length > 0 ? (
        <div className="wq-keywords">
          <strong>
            핵심어 {n} / {hits.length}개 포함
          </strong>
          <ul>
            {hits.map((h) => (
              <li key={h.label} className={h.hit ? 'hit' : 'miss'}>
                {h.hit ? '✓' : '·'} {h.label}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="muted">이 문제는 정해진 핵심어가 없어 모범 답안과 비교해 판정합니다.</p>
      )}
      <ModelAnswer q={q} />

      {apiKey && r.text && ai.status === 'idle' && (
        <button type="button" onClick={askAi}>
          🤖 AI로 채점 받기
        </button>
      )}
      {ai.status === 'loading' && <p className="muted">AI가 모범 답안과 비교하는 중…</p>}
      {ai.status === 'error' && <p className="ai-error">{ai.text}</p>}
      {ai.status === 'done' && (
        <div className="ai-answer">
          <span className="ai-badge">AI 채점 · 참고용</span>
          <p>
            <strong>
              {VERDICT[ai.result.verdict]} · {ai.result.score}점
            </strong>
          </p>
          <p>잘 쓴 점: {ai.result.good}</p>
          <p>빠진 점: {ai.result.missing}</p>
          <p>{ai.result.feedback}</p>
        </div>
      )}

      <div className="wq-judge" role="radiogroup" aria-label="판정">
        <span>내 판정:</span>
        {Object.entries(VERDICT).map(([id, label]) => (
          <button key={id} type="button" role="radio" aria-checked={r.verdict === id} className={r.verdict === id ? 'subtab active' : 'subtab'} onClick={() => save({ verdict: id })}>
            {label}
          </button>
        ))}
      </div>
    </>
  )
}
