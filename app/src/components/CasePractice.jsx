import { useState } from 'react'
import { BASIS_LABEL, findScenario, RUBRIC, SCENARIOS } from '../data/scenarios.js'
import { createStore, useStore } from '../lib/sharedStore.js'
import { useApiKey } from '../lib/apiKey.js'
import { markActive } from '../lib/activity.js'
import { appendToCurrentNote } from '../lib/notes.js'
import { AiKeyBox } from './AiTutor.jsx'

// 실무 상황 대처 연습. 현장 상황·데이터를 보고 Q1~Q5에 답한 뒤, 모범 포인트와 비교해 채점합니다(직접 체크 또는 AI 평가).
// 이어서 추가 현장 데이터를 받아 판단을 고치는 단계까지 합니다. 기록은 localStorage 'tutor.cases'.
// 상태: { [시나리오 id]: { answers: { q1: '…', f0: '…' }, checked: { 'q1-0': true }, stage, ai, best, at } }
const casesStore = createStore('tutor.cases', {})
const useCases = () => useStore(casesStore)
const patchCase = (id, p) => casesStore.set((all) => ({ ...all, [id]: { answers: {}, checked: {}, stage: 'answer', ...(all[id] ?? {}), ...p } }))
const loadAi = () => import('../lib/aiTutor.js')

// 체크한 모범 포인트로 기준별 점수 계산(포인트가 있는 기준만, 배점 × 체크 비율)
function scoreOf(scenario, checked, withFollowup) {
  const items = [
    ...scenario.questions.flatMap((q) => q.points.map((p, i) => ({ ...p, key: `${q.id}-${i}` }))),
    ...(withFollowup ? scenario.followups.flatMap((f, k) => f.points.map((p, i) => ({ ...p, key: `f${k}-${i}` }))) : []),
  ]
  const rows = RUBRIC.map((r) => {
    const mine = items.filter((p) => p.cat === r.id)
    const got = mine.filter((p) => checked[p.key]).length
    return { ...r, score: mine.length ? Math.round((r.points * got) / mine.length) : r.points, got, total: mine.length }
  })
  return { rows, total: rows.reduce((s, r) => s + r.score, 0) }
}

export default function CasePractice({ onOpenProcess, onOpenMachine }) {
  const cases = useCases()
  const [openId, setOpenId] = useState(null)
  const scenario = findScenario(openId)
  if (scenario) return <CaseRun key={scenario.id} scenario={scenario} state={cases[scenario.id]} onBack={() => setOpenId(null)} onNext={(id) => setOpenId(id)} onOpenProcess={onOpenProcess} onOpenMachine={onOpenMachine} />

  return (
    <section className="screen cases">
      <h2>실무 상황 대처 연습</h2>
      <p className="muted">
        패키징 현장에서 생길 법한 불량·설비 이상·수율 저하·고객 클레임을 실제 상황처럼 풀어 봅니다. 암기가 아니라 <strong>무엇을 먼저 확인하고, 어떻게 원인을 좁혀 해결할지</strong>를 연습합니다. 모든 사례와
        수치는 교육용 가상 사례이며, 모범 답안의 근거는 앱의 장비 규칙표와 현장 대응 원칙입니다(검수 전).
      </p>
      <div className="case-list">
        {SCENARIOS.map((s) => {
          const st = cases[s.id]
          return (
            <button key={s.id} type="button" className="card case-card" onClick={() => setOpenId(s.id)}>
              <span className="case-no">실무 시뮬레이션 {s.no}</span>
              <strong>{s.title}</strong>
              <span className="case-head">{s.headline}</span>
              <span className="case-tags">
                <span className="quiz-tag">난이도 {s.level}</span>
                {s.roles.map((r) => (
                  <span key={r} className="quiz-tag soft">
                    {r}
                  </span>
                ))}
              </span>
              <span className="case-status">{st?.best != null ? `최고 ${st.best}점` : st?.answers && Object.keys(st.answers).length ? '푸는 중' : '안 풀어 봄'}</span>
            </button>
          )
        })}
      </div>
      <details className="card ai-optional">
        <summary>🤖 AI 실무 평가 (선택 · 내 API 키 필요)</summary>
        <p className="muted">키가 없어도 모범 포인트와 비교해 직접 채점할 수 있습니다. 키를 연결하면 선임 엔지니어 관점의 기준별 점수와 의견을 받습니다.</p>
        <AiKeyBox compact />
      </details>
    </section>
  )
}

function DataTable({ table }) {
  return (
    <div className="nb-table-wrap">
      <table className="nb-table case-table">
        <thead>
          <tr>
            {table.cols.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CaseRun({ scenario, state, onBack, onNext, onOpenProcess, onOpenMachine }) {
  const st = state ?? { answers: {}, checked: {}, stage: 'answer' }
  const { apiKey } = useApiKey()
  const [ai, setAi] = useState({ status: st.ai ? 'done' : 'idle', result: st.ai })
  const withFollowup = st.stage === 'followup' || st.stage === 'done'
  const score = scoreOf(scenario, st.checked, st.stage === 'done')
  const answered = scenario.questions.filter((q) => (st.answers[q.id] ?? '').trim()).length
  const next = SCENARIOS.find((s) => s.no === scenario.no + 1)
  const setAnswer = (k, v) => patchCase(scenario.id, { answers: { ...st.answers, [k]: v } })
  const toggle = (k) => {
    const checked = { ...st.checked, [k]: !st.checked[k] }
    patchCase(scenario.id, { checked, best: Math.max(st.best ?? 0, scoreOf(scenario, checked, st.stage === 'done').total) })
  }

  const finish = (stage) => {
    const s = scoreOf(scenario, st.checked, stage === 'done').total
    markActive()
    patchCase(scenario.id, { stage, best: Math.max(st.best ?? 0, s), at: new Date().toISOString() })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const askAi = async () => {
    setAi({ status: 'loading' })
    const mod = await loadAi()
    try {
      const result = await mod.gradeCase({ apiKey, scenario, rubric: RUBRIC, answers: st.answers, followup: st.stage === 'done' })
      setAi({ status: 'done', result })
      const total = result.criteria.reduce((s, c) => s + c.score, 0)
      patchCase(scenario.id, { ai: result, best: Math.max(st.best ?? 0, total) })
    } catch (error) {
      setAi({ status: 'error', text: mod.aiErrorText(error) })
    }
  }

  const toNote = () => {
    const lines = [
      `> [!🏭|blue] ${scenario.headline}`,
      '',
      ...scenario.questions.flatMap((q) => [`## ${q.id.toUpperCase()}. ${q.q}`, `- 내 답: ${st.answers[q.id] || '(비움)'}`, ...q.points.map((p, i) => `- [${st.checked[`${q.id}-${i}`] ? 'x' : ' '}] ${p.text}`), '']),
      `**점수: ${score.total} / 100**`,
    ]
    appendToCurrentNote(lines.join('\n'), { kind: 'process', id: scenario.process, label: `실무 연습 · ${scenario.title}` }, `실무 연습: ${scenario.title}`)
  }

  const review = st.stage !== 'answer'

  return (
    <section className="screen cases case-run">
      <div className="quiz-top">
        <button type="button" className="link" onClick={onBack}>
          ← 사례 목록
        </button>
        <span className="muted">실무 시뮬레이션 {scenario.no} / {SCENARIOS.length}</span>
      </div>

      <article className="card case-brief">
        <p className="home-eyebrow">
          실무 시뮬레이션 {scenario.no} · 난이도 {scenario.level} · {scenario.roles.join(' / ')}
        </p>
        <h2>{scenario.title}</h2>
        <div className="nb-callout c-blue">
          <span className="nb-callout-icon">📞</span>
          <div>
            <p>
              <strong>상황: {scenario.headline}</strong>
            </p>
            <p>{scenario.story}</p>
          </div>
        </div>
        <h3>1. 현장에서 확보한 데이터</h3>
        <p className="muted case-note">아래 수치는 실무 교육을 위해 구성한 가상 사례이며, 실제 업체의 관리 규격은 아닙니다.</p>
        <DataTable table={scenario.table} />
        <p className="case-facts-title">추가로 확인한 사항</p>
        <ul className="case-facts">
          {scenario.facts.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <div className="button-row">
          <button type="button" className="link" onClick={() => onOpenProcess(scenario.process)}>
            관련 공정 설명 보기 →
          </button>
          <button type="button" className="link" onClick={() => onOpenMachine(scenario.machine)}>
            장비 시뮬레이터에서 조건 바꿔 보기 →
          </button>
        </div>
      </article>

      <h3 className="case-h">2. 엔지니어로서 해결해야 하는 문제</h3>
      {scenario.questions.map((q, qi) => (
        <article key={q.id} className="card case-q">
          <p className="case-q-title">
            <span className="case-q-no">Q{qi + 1}</span> {q.q}
          </p>
          {q.hint && <p className="muted case-hint">💡 {q.hint}</p>}
          {!review ? (
            <textarea className="wq-input" rows={4} value={st.answers[q.id] ?? ''} onChange={(e) => setAnswer(q.id, e.target.value)} placeholder="정답을 몰라도 괜찮습니다. 어떤 근거로 판단했는지가 중요합니다." />
          ) : (
            <>
              <p className="quiz-mine">내 답: {st.answers[q.id] || '(비움)'}</p>
              <PointChecks prefix={q.id} points={q.points} checked={st.checked} onToggle={toggle} />
            </>
          )}
        </article>
      ))}

      {!review && (
        <div className="case-submit">
          <button type="button" className="primary" disabled={answered === 0} onClick={() => finish('review')}>
            답안 제출하고 실무 평가받기
          </button>
          <span className="muted">
            {answered} / {scenario.questions.length}개 답함 · 답은 자동 저장됩니다
          </span>
        </div>
      )}

      {review && (
        <article className="card case-score">
          <h3>3. 실무 평가 {st.stage === 'done' ? '(추가 데이터 포함 최종)' : ''}</h3>
          <p className="muted">위 모범 포인트 중 내 답에 들어 있던 것을 체크하면 점수가 바로 계산됩니다.</p>
          <table className="nb-table case-rubric">
            <thead>
              <tr>
                <th>평가 기준</th>
                <th>배점</th>
                <th>내 체크</th>
                {ai.status === 'done' && <th>AI 평가</th>}
              </tr>
            </thead>
            <tbody>
              {score.rows.map((r) => {
                const c = ai.result?.criteria.find((x) => x.id === r.id)
                return (
                  <tr key={r.id}>
                    <td>{r.label}</td>
                    <td>{r.points}점</td>
                    <td>
                      <strong>{r.score}</strong> <small className="muted">({r.got}/{r.total})</small>
                    </td>
                    {ai.status === 'done' && (
                      <td>
                        <strong>{c?.score ?? '-'}</strong> <small className="muted">{c?.comment}</small>
                      </td>
                    )}
                  </tr>
                )
              })}
              <tr className="case-total">
                <td>총점</td>
                <td>100점</td>
                <td>
                  <strong>{score.total}</strong>
                </td>
                {ai.status === 'done' && (
                  <td>
                    <strong>{ai.result.criteria.reduce((s, c) => s + c.score, 0)}</strong>
                  </td>
                )}
              </tr>
            </tbody>
          </table>

          {apiKey ? (
            ai.status !== 'loading' && (
              <button type="button" onClick={askAi}>
                🤖 {ai.status === 'done' ? 'AI로 다시 평가받기' : 'AI 선임 엔지니어에게 평가받기'}
              </button>
            )
          ) : (
            <p className="muted">API 키를 연결하면 AI 선임 엔지니어의 기준별 평가도 받을 수 있습니다(사례 목록 아래 🤖).</p>
          )}
          {ai.status === 'loading' && <p className="muted">AI가 답안을 평가하는 중…</p>}
          {ai.status === 'error' && <p className="ai-error">{ai.text}</p>}
          {ai.status === 'done' && (
            <div className="ai-answer">
              <span className="ai-badge">AI 평가 · 참고용</span>
              <p>👍 {ai.result.strengths}</p>
              <p>🔧 {ai.result.improve}</p>
              <p>➡️ {ai.result.nextStep}</p>
            </div>
          )}
          <div className="button-row">
            <button type="button" className="link" onClick={toNote}>
              📝 노트로 정리
            </button>
            <button
              type="button"
              className="link"
              onClick={() => {
                patchCase(scenario.id, { stage: 'answer', checked: {}, ai: null })
                setAi({ status: 'idle' })
              }}
            >
              답안 고쳐서 다시 제출
            </button>
          </div>
        </article>
      )}

      {st.stage === 'review' && (
        <div className="case-submit">
          <button type="button" className="primary" onClick={() => patchCase(scenario.id, { stage: 'followup' })}>
            새로운 현장 데이터 받기 →
          </button>
          <span className="muted">추가 데이터가 나오면 기존 판단을 어떻게 고칠지 연습합니다.</span>
        </div>
      )}

      {withFollowup &&
        scenario.followups.map((f, k) => (
          <article key={k} className="card case-follow">
            <h3>4. {f.title}</h3>
            <DataTable table={f.table} />
            <p className="case-q-title">
              <span className="case-q-no">Q+</span> {f.q}
            </p>
            {st.stage === 'followup' ? (
              <>
                <textarea className="wq-input" rows={4} value={st.answers[`f${k}`] ?? ''} onChange={(e) => setAnswer(`f${k}`, e.target.value)} placeholder="새 데이터로 무엇을 지우고 무엇이 남는지, 다음 조치는?" />
                <div className="case-submit">
                  <button type="button" className="primary" disabled={!(st.answers[`f${k}`] ?? '').trim()} onClick={() => finish('done')}>
                    제출하고 최종 평가받기
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="quiz-mine">내 답: {st.answers[`f${k}`] || '(비움)'}</p>
                <PointChecks prefix={`f${k}`} points={f.points} checked={st.checked} onToggle={toggle} />
              </>
            )}
          </article>
        ))}

      {st.stage === 'done' && (
        <div className="case-submit">
          {next ? (
            <button type="button" className="primary" onClick={() => onNext(next.id)}>
              다음 사례: {next.title} →
            </button>
          ) : (
            <p>🎉 모든 사례를 끝까지 풀었습니다.</p>
          )}
          <button type="button" onClick={onBack}>
            사례 목록
          </button>
        </div>
      )}
    </section>
  )
}

function PointChecks({ prefix, points, checked, onToggle }) {
  return (
    <div className="case-points">
      <strong>모범 포인트</strong> <small className="muted">· 내 답에 있던 것을 체크</small>
      <ul>
        {points.map((p, i) => {
          const key = `${prefix}-${i}`
          const crit = RUBRIC.find((r) => r.id === p.cat)
          return (
            <li key={key} className={checked[key] ? 'on' : ''}>
              <label>
                <input type="checkbox" checked={Boolean(checked[key])} onChange={() => onToggle(key)} />
                <span>
                  {p.text}
                  <small className="case-basis">
                    {crit?.label} · 근거: {BASIS_LABEL[p.basis] ?? p.basis}
                  </small>
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
