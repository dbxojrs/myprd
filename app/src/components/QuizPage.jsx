import { useEffect, useState } from 'react'
import { makeQuiz, QUIZ_SCOPES, topicLabel } from '../lib/quiz.js'
import { useStoredState } from '../lib/storage.js'

// 시험 화면. 문제는 공정 데이터와 장비 규칙표로 만듭니다(lib/quiz.js).
// 연습 모드는 한 문제씩 바로 채점하고 해설을 보여주며, 시험 모드는 끝난 뒤 한꺼번에 채점합니다.
// 틀린 문제는 오답 노트(localStorage 'tutor.wrong')에 남고, 오답 노트에서 다시 맞히면 지워집니다.

const COUNTS = [10, 20, 30]
const MODES = [
  { id: 'practice', label: '연습', desc: '한 문제씩 바로 채점하고 해설을 봅니다.' },
  { id: 'exam', label: '시험', desc: '끝까지 푼 뒤 한꺼번에 채점합니다.' },
]

export default function QuizPage({ view = 'quiz', onOpenProcess, onOpenMachine }) {
  const [scope, setScope] = useStoredState('tutor.quizScope', 'all')
  const [count, setCount] = useStoredState('tutor.quizCount', 10)
  const [mode, setMode] = useStoredState('tutor.quizMode', 'practice')
  const [attempt, setAttempt] = useStoredState('tutor.quizAttempt', 0)
  const [wrong, setWrong] = useStoredState('tutor.wrong', [])
  const [history, setHistory] = useStoredState('tutor.quizHistory', [])
  const [run, setRun] = useState(null) // { questions, answers: [], index, fromWrong, scopeLabel }

  // 메뉴에서 다른 화면(문제 풀기 ↔ 오답 노트)으로 바꾸면 풀던 시험을 닫습니다.
  useEffect(() => setRun(null), [view])

  const start = (questions, fromWrong, scopeLabel) =>
    setRun({ questions, answers: Array(questions.length).fill(null), index: 0, fromWrong, scopeLabel, mode: fromWrong ? 'practice' : mode })

  const startNew = () => {
    const seed = attempt + 1
    setAttempt(seed)
    const questions = makeQuiz({ scope, count, seed })
    start(questions, false, topicLabel(scope))
  }

  const finish = (answers) => {
    const qs = run.questions
    const score = qs.filter((q, i) => answers[i] === q.answer).length
    setWrong((list) => {
      let next = [...list]
      qs.forEach((q, i) => {
        const ok = answers[i] === q.answer
        const at = next.findIndex((w) => w.q.id === q.id)
        if (ok && run.fromWrong && at >= 0) next.splice(at, 1)
        else if (!ok) {
          if (at >= 0) next[at] = { ...next[at], misses: next[at].misses + 1, at: new Date().toISOString() }
          else next = [{ q, misses: 1, at: new Date().toISOString() }, ...next]
        }
      })
      return next.slice(0, 200)
    })
    if (!run.fromWrong)
      setHistory((list) => [{ at: new Date().toISOString(), scope: run.scopeLabel, score, total: qs.length }, ...list].slice(0, 20))
    setRun({ ...run, answers, done: true })
  }

  if (run) return <QuizRun run={run} setRun={setRun} finish={finish} onOpenProcess={onOpenProcess} onOpenMachine={onOpenMachine} />

  if (view === 'wrong')
    return (
      <section className="screen quiz">
        <h2>오답 노트</h2>
        <p className="muted">틀린 문제가 모입니다. 여기서 다시 풀어 맞히면 목록에서 빠집니다.</p>
        {wrong.length === 0 ? (
          <p className="placeholder">아직 틀린 문제가 없습니다.</p>
        ) : (
          <>
            <div className="button-row">
              <button type="button" className="primary" onClick={() => start(wrong.map((w) => w.q), true, '오답 노트')}>
                오답 {wrong.length}문제 다시 풀기
              </button>
              <button type="button" onClick={() => setWrong([])}>
                오답 노트 비우기
              </button>
            </div>
            <ul className="quiz-wrong-list">
              {wrong.map((w) => (
                <li key={w.q.id} className="card">
                  <span className="quiz-tag">{w.q.type}</span> <span className="quiz-tag soft">{topicLabel(w.q.topic)}</span>
                  <span className="quiz-misses">틀린 횟수 {w.misses}</span>
                  <p className="quiz-prompt">{w.q.prompt}</p>
                  <details>
                    <summary>정답과 해설 보기</summary>
                    <p>
                      <strong>정답:</strong> {w.q.choices[w.q.answer]}
                    </p>
                    <p className="quiz-explain">{w.q.explain}</p>
                  </details>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    )

  return (
    <section className="screen quiz">
      <h2>문제 풀기</h2>
      <p className="muted">문제는 앱의 공정 설명과 장비 규칙표에서 만들어집니다. 내용이 검수 전이므로 문제도 검수 전입니다.</p>
      <article className="card quiz-setup">
        <label className="quiz-field">
          <span>범위</span>
          <select value={scope} onChange={(e) => setScope(e.target.value)}>
            {QUIZ_SCOPES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id.startsWith('machine:') ? `　장비 · ${s.label}` : s.label}
              </option>
            ))}
          </select>
        </label>
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
        <div className="quiz-field">
          <span>방식</span>
          <div className="button-row" role="radiogroup" aria-label="방식">
            {MODES.map((m) => (
              <button key={m.id} type="button" role="radio" aria-checked={mode === m.id} className={mode === m.id ? 'subtab active' : 'subtab'} title={m.desc} onClick={() => setMode(m.id)}>
                {m.label}
              </button>
            ))}
          </div>
          <small className="muted">{MODES.find((m) => m.id === mode).desc}</small>
        </div>
        <button type="button" className="primary quiz-start" onClick={startNew}>
          시작하기
        </button>
      </article>

      {history.length > 0 && (
        <article className="card">
          <h3>최근 기록</h3>
          <ol className="quiz-history">
            {history.slice(0, 8).map((h) => (
              <li key={h.at}>
                <span>{new Date(h.at).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                <span>{h.scope}</span>
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

function QuizRun({ run, setRun, finish, onOpenProcess, onOpenMachine }) {
  const { questions, answers, index, done } = run
  const q = questions[index]
  const picked = answers[index]
  const practice = run.mode === 'practice'
  const revealed = practice && picked !== null

  const pick = (i) => {
    if (done || revealed) return
    const next = [...answers]
    next[index] = i
    setRun({ ...run, answers: next })
  }
  const go = (to) => setRun({ ...run, index: to })
  const last = index === questions.length - 1

  // 숫자 키 1~4로 보기 고르기, Enter로 다음
  useEffect(() => {
    if (done) return undefined
    const onKey = (e) => {
      if (e.target.closest?.('input, select, textarea')) return
      const n = Number(e.key)
      if (n >= 1 && n <= q.choices.length) pick(n - 1)
      if (e.key === 'Enter' && picked !== null) last ? finish(answers) : go(index + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (done) {
    const score = questions.filter((x, i) => answers[i] === x.answer).length
    const byTopic = {}
    questions.forEach((x, i) => {
      const t = (byTopic[x.topic] ??= { ok: 0, total: 0 })
      t.total += 1
      if (answers[i] === x.answer) t.ok += 1
    })
    return (
      <section className="screen quiz">
        <article className="card quiz-result">
          <p className="home-eyebrow">{run.scopeLabel}</p>
          <h2>
            {score} / {questions.length}
          </h2>
          <div className="home-progress-bar" aria-hidden="true">
            <span style={{ width: `${(score / questions.length) * 100}%` }} />
          </div>
          <ul className="quiz-topics">
            {Object.entries(byTopic).map(([t, v]) => (
              <li key={t}>
                <span>{topicLabel(t)}</span>
                <strong className={v.ok === v.total ? 'ok' : 'ng'}>
                  {v.ok}/{v.total}
                </strong>
              </li>
            ))}
          </ul>
          <div className="button-row">
            <button type="button" className="primary" onClick={() => setRun(null)}>
              다른 시험 보기
            </button>
          </div>
        </article>
        <h3>문제별 해설</h3>
        <ol className="quiz-review">
          {questions.map((x, i) => (
            <li key={x.id} className={`card ${answers[i] === x.answer ? 'ok' : 'ng'}`}>
              <p className="quiz-prompt">
                {answers[i] === x.answer ? '⭕ ' : '❌ '}
                {x.prompt}
              </p>
              {answers[i] !== x.answer && answers[i] !== null && <p className="quiz-mine">내 답: {x.choices[answers[i]]}</p>}
              <p>
                <strong>정답:</strong> {x.choices[x.answer]}
              </p>
              <p className="quiz-explain">{x.explain}</p>
              <RefLink q={x} onOpenProcess={onOpenProcess} onOpenMachine={onOpenMachine} />
            </li>
          ))}
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
          <span style={{ width: `${((index + (picked !== null ? 1 : 0)) / questions.length) * 100}%` }} />
        </div>
        <button type="button" className="link" onClick={() => setRun(null)}>
          그만두기
        </button>
      </div>
      <article className="card quiz-card" key={q.id}>
        <div>
          <span className="quiz-tag">{q.type}</span> <span className="quiz-tag soft">{topicLabel(q.topic)}</span>
        </div>
        <p className="quiz-prompt big">{q.prompt}</p>
        <ol className="quiz-choices">
          {q.choices.map((c, i) => {
            const state = revealed ? (i === q.answer ? 'correct' : i === picked ? 'wrong' : 'dim') : picked === i ? 'picked' : ''
            return (
              <li key={c}>
                <button type="button" className={`quiz-choice ${state}`} aria-pressed={picked === i} onClick={() => pick(i)}>
                  <span className="quiz-no">{i + 1}</span>
                  <span>{c}</span>
                </button>
              </li>
            )
          })}
        </ol>
        {revealed && (
          <div className={`quiz-feedback ${picked === q.answer ? 'ok' : 'ng'}`} aria-live="polite">
            <strong>{picked === q.answer ? '정답입니다' : '틀렸습니다'}</strong>
            <p className="quiz-explain">{q.explain}</p>
            <RefLink q={q} onOpenProcess={onOpenProcess} onOpenMachine={onOpenMachine} />
          </div>
        )}
        <div className="quiz-nav">
          <button type="button" disabled={index === 0} onClick={() => go(index - 1)}>
            ← 이전
          </button>
          {last ? (
            <button type="button" className="primary" disabled={picked === null} onClick={() => finish(answers)}>
              채점하기
            </button>
          ) : (
            <button type="button" className="primary" disabled={picked === null} onClick={() => go(index + 1)}>
              다음 →
            </button>
          )}
        </div>
        <p className="muted quiz-keys">키보드: 1~4 보기 선택 · Enter 다음</p>
      </article>
    </section>
  )
}

function RefLink({ q, onOpenProcess, onOpenMachine }) {
  if (q.ref.kind === 'process')
    return (
      <button type="button" className="link" onClick={() => onOpenProcess(q.ref.id)}>
        이 공정 설명 다시 보기 →
      </button>
    )
  return (
    <button type="button" className="link" onClick={() => onOpenMachine(q.ref.id)}>
      이 장비 시뮬레이터에서 확인하기 →
    </button>
  )
}
