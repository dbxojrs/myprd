import { useEffect, useState } from 'react'
import { FIELD_CASES, findFieldCase } from '../../data/fieldCases/index.js'
import { findSource } from '../../data/sourceCatalog.js'
import { evaluate, finishRun, grade, newRun, resetRun, saveRun, useField } from '../../lib/fieldSim.js'
import { markActive } from '../../lib/activity.js'
import { addNote, openNotePage } from '../../lib/notes.js'
import { writeStored } from '../../lib/storage.js'
import { findProcess } from '../../data/processes.js'

// 현장 실무 훈련: 분기형 시나리오 목록과 진행 화면(3단: 사건·진행 / 상황·판단 / 데이터·선임 엔지니어).
// 시나리오는 data/fieldCases, 진행·채점 규칙은 lib/fieldSim.js. 진행 상태는 'tutor.field'에 저장돼 새로고침해도 이어집니다.

export default function FieldSim({ onOpenProcess, onOpenMachine, onGo }) {
  const field = useField()
  const [openId, setOpenId] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tutor.field.open')) ?? null
    } catch {
      return null
    }
  })
  const open = (id) => {
    setOpenId(id)
    writeStored('tutor.field.open', id)
    window.scrollTo({ top: 0 })
  }
  const c = findFieldCase(openId)
  if (c) return <FieldRun key={c.id} c={c} saved={field[c.id]} onBack={() => open(null)} onOpenProcess={onOpenProcess} onOpenMachine={onOpenMachine} onGo={onGo} />

  return (
    <section className="screen field">
      <div className="field-hero">
        <p className="home-eyebrow">현장 실무 훈련</p>
        <h2>오늘 당신은 패키징 공정기술 엔지니어입니다</h2>
        <p className="muted">
          생산라인에서 생긴 문제를 <strong>상황 파악 → 초기 대응 → 데이터 수집 → 원인 분석 → 조치·검증 → 평가</strong> 순서로 해결합니다. 고른 조치에 따라 다음 상황이 달라지고, 점수는
          미리 공개된 기준으로만 계산합니다. API 키 없이 진행됩니다.
        </p>
        <span className="virtual-badge">모든 사례·수치는 교육용 가상 데이터</span>
      </div>
      <div className="field-list">
        {FIELD_CASES.map((x) => {
          const st = field[x.id]
          const inProgress = st?.run && !st.run.done
          return (
            <article key={x.id} className="card field-card">
              <div className="field-card-top">
                <code>{x.id}</code>
                <span className="status warn">검수 전 · v{x.version}</span>
              </div>
              <h3>{x.title}</h3>
              <p className="muted">{x.subtitle}</p>
              <div className="case-tags">
                <span className="quiz-tag">난이도 {x.level}</span>
                <span className="quiz-tag soft">약 {x.minutes}분</span>
                <span className="quiz-tag soft">{findProcess(x.process)?.name.ko}</span>
              </div>
              <ul className="field-goals">
                {x.goals.slice(0, 3).map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
              <div className="field-card-foot">
                {st?.best != null && <span className={`status ${grade(st.best).tone}`}>최고 {st.best}점</span>}
                <button type="button" className="primary" onClick={() => open(x.id)}>
                  {inProgress ? '이어서 하기 →' : st?.best != null ? '다시 도전 →' : '시작하기 →'}
                </button>
              </div>
            </article>
          )
        })}
        <article className="card field-card soon">
          <h3>다음 시나리오 (준비 중)</h3>
          <p className="muted">Die Attach Void → Molding 보이드·박리 → Final Test 수율 급락 → 고객 불량 클레임 순서로 난도를 높여 추가합니다. 지금은 같은 주제를 "사례 서술형 연습"에서 풀 수 있습니다.</p>
          <button type="button" onClick={() => onGo('cases')}>
            사례 서술형 연습 열기 →
          </button>
        </article>
      </div>
    </section>
  )
}

function DataView({ result }) {
  if (!result) return null
  if (result.kind === 'table')
    return (
      <div className="nb-table-wrap">
        <table className="nb-table">
          <thead>
            <tr>
              {result.cols.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((r, i) => (
              <tr key={i}>
                {r.map((x, j) => (
                  <td key={j}>{x}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  if (result.kind === 'log')
    return (
      <pre className="field-log">
        {result.lines.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </pre>
    )
  return <p className="field-data-text">{result.text}</p>
}

function Table({ table }) {
  return (
    <>
      {table.virtual && <span className="virtual-badge">가상 데이터</span>}
      <DataView result={{ kind: 'table', ...table }} />
    </>
  )
}

function FieldRun({ c, saved, onBack, onOpenProcess, onOpenMachine, onGo }) {
  const [run, setRunState] = useState(() => saved?.run && !saved.run.done ? saved.run : saved?.run?.done ? saved.run : newRun(c))
  const [panel, setPanel] = useState('data')
  const [draft, setDraft] = useState({}) // 현재 노드에서 고르는 중인 값
  const node = c.nodes[run.node]
  const dataNode = Object.values(c.nodes).find((n) => n.type === 'data')

  const setRun = (next) => {
    setRunState(next)
    saveRun(c.id, next)
  }
  useEffect(() => setDraft({}), [run.node])

  const log = (r, text, tone = 'info') => ({ ...r, log: [...r.log, { t: r.time, text, tone }] })
  const goto = (r, nodeId) => {
    const next = { ...r, node: nodeId, path: [...r.path, nodeId] }
    if (c.nodes[nodeId]?.type === 'end') {
      const result = evaluate(c, next)
      markActive()
      finishRun(c.id, next, result)
      setRunState({ ...next, done: true })
    } else setRun(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const stepNo = node?.step ?? c.steps.length
  const hintLevel = run.hints[run.node] ?? 0
  const result = run.done ? evaluate(c, run) : null

  // ── 노드별 가운데 화면 ──
  const center = () => {
    if (!node) return null
    if (node.type === 'brief')
      return (
        <>
          <div className="nb-callout c-blue field-report">
            <span className="nb-callout-icon">📞</span>
            <div>
              <p className="muted">{node.who}</p>
              <p>{node.report}</p>
            </div>
          </div>
          <div className="field-status">
            {node.status.map((s) => (
              <span key={s.label} className={`status ${s.tone}`}>
                {s.label}: {s.value}
              </span>
            ))}
          </div>
          <h4>현장에서 확보한 초기 데이터</h4>
          <Table table={node.table} />
          <ul className="case-facts">
            {node.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <button type="button" className="primary" onClick={() => goto(log(run, '현장 도착 · 상황 파악'), node.next)}>
            현장으로 출동 →
          </button>
        </>
      )

    if (node.type === 'choice') {
      const done = run.submitted[run.node]
      const pickedNow = draft.picks ?? []
      const lastPick = (run.picks[run.node] ?? []).at(-1)
      const submit = () => {
        let r = { ...run, picks: { ...run.picks, [run.node]: node.multi ? pickedNow : [...(run.picks[run.node] ?? []), pickedNow[0]] }, submitted: { ...run.submitted, [run.node]: true } }
        if (draft.essay) r.essays = { ...r.essays, [run.node]: draft.essay }
        for (const id of pickedNow) {
          const o = node.options.find((x) => x.id === id)
          r = log(r, o.log ?? o.text, o.tone === 'good' ? 'ok' : o.tone === 'bad' ? 'bad' : 'warn')
        }
        setRun(r)
      }
      const shown = node.multi ? run.picks[run.node] ?? [] : lastPick ? [lastPick] : []
      return (
        <>
          <p className="field-prompt">{node.prompt}</p>
          {!done ? (
            <>
              <div className="field-options" role={node.multi ? 'group' : 'radiogroup'}>
                {node.options.map((o) => {
                  const on = pickedNow.includes(o.id)
                  return (
                    <label key={o.id} className={`field-option${on ? ' on' : ''}`}>
                      <input
                        type={node.multi ? 'checkbox' : 'radio'}
                        name={run.node}
                        checked={on}
                        onChange={() => setDraft((d) => ({ ...d, picks: node.multi ? (on ? pickedNow.filter((x) => x !== o.id) : [...pickedNow, o.id]) : [o.id] }))}
                      />
                      <span>{o.text}</span>
                    </label>
                  )
                })}
              </div>
              {node.essay && (
                <label className="field-essay">
                  <span>{node.essay.label}</span>
                  <textarea className="wq-input" rows={3} value={draft.essay ?? ''} placeholder={node.essay.placeholder} onChange={(e) => setDraft((d) => ({ ...d, essay: e.target.value }))} />
                </label>
              )}
              <button type="button" className="primary" disabled={!pickedNow.length} onClick={submit}>
                {node.multi ? `이대로 결정 (${pickedNow.length}개)` : '이 조치로 결정'}
              </button>
            </>
          ) : (
            <>
              <ul className="field-feedback">
                {node.options
                  .filter((o) => shown.includes(o.id) || (node.multi && o.tone === 'good'))
                  .map((o) => {
                    const mine = shown.includes(o.id)
                    const tone = o.tone === 'good' ? 'ok' : o.tone === 'bad' ? 'bad' : 'warn'
                    return (
                      <li key={o.id} className={`fb-${mine ? tone : 'missed'}`}>
                        <span className={`status ${mine ? tone : 'info'}`}>{mine ? (tone === 'ok' ? '적절' : tone === 'bad' ? '위험' : '보완') : '놓침'}</span>
                        <div>
                          <strong>{o.text}</strong>
                          {o.feedback && <p>{o.feedback}</p>}
                        </div>
                      </li>
                    )
                  })}
              </ul>
              <button
                type="button"
                className="primary"
                onClick={() => {
                  const o = node.options.find((x) => x.id === lastPick)
                  const nextId = !node.multi && o?.next ? o.next : node.next
                  // 같은 노드로 돌아오면(다시 고르기) 제출 표시를 지웁니다.
                  const r = { ...run, submitted: { ...run.submitted, [nextId]: false } }
                  goto(r, nextId)
                }}
              >
                다음 →
              </button>
            </>
          )}
        </>
      )
    }

    if (node.type === 'data') {
      const left = node.budget - run.time
      const groups = [...new Set(node.items.map((i) => i.group))]
      return (
        <>
          <p className="field-prompt">{node.prompt}</p>
          <div className="field-budget">
            <span>가상 시간</span>
            <div className="home-progress-bar" aria-hidden="true">
              <span style={{ width: `${(run.time / node.budget) * 100}%` }} />
            </div>
            <strong>
              {run.time} / {node.budget}분
            </strong>
          </div>
          {groups.map((g) => (
            <div key={g} className="field-data-group">
              <h4>{g}</h4>
              {node.items
                .filter((i) => i.group === g)
                .map((i) => {
                  const seen = run.viewed.includes(i.id)
                  return (
                    <div key={i.id} className={`field-data-item${seen ? ' seen' : ''}`}>
                      <div className="field-data-head">
                        <span>{i.label}</span>
                        {seen ? (
                          <span className="status ok">확인함</span>
                        ) : (
                          <button
                            type="button"
                            disabled={i.cost > left}
                            onClick={() => {
                              const r = log({ ...run, viewed: [...run.viewed, i.id], time: run.time + i.cost }, `확인: ${i.label}`)
                              setRun(r)
                              setPanel('data')
                            }}
                            title={i.cost > left ? '남은 시간이 부족합니다' : ''}
                          >
                            확인 ({i.cost}분)
                          </button>
                        )}
                      </div>
                      {seen && (
                        <div className="field-data-body">
                          <DataView result={i.result} />
                          <p className="muted">💡 {i.note}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          ))}
          <button type="button" className="primary" disabled={run.viewed.length === 0} onClick={() => goto(log(run, `데이터 수집 마침 (${run.viewed.length}개, ${run.time}분)`), node.next)}>
            데이터 수집 마치고 원인 분석으로 →
          </button>
        </>
      )
    }

    if (node.type === 'hypothesis') {
      const h = run.hypo
      const pick = draft.pick ?? null
      const ev = draft.evidence ?? []
      const last = h.pick && node.options.find((o) => o.id === h.pick)
      const right = node.options.find((o) => o.correct)
      const viewedItems = dataNode.items.filter((i) => run.viewed.includes(i.id))
      const submit = () => {
        const o = node.options.find((x) => x.id === pick)
        const tries = h.tries + 1
        let r = { ...run, hypo: { pick, tries, evidence: ev, solved: Boolean(o.correct) || tries >= 3 }, essays: draft.essay ? { ...run.essays, hypo: draft.essay } : run.essays }
        r = log(r, `가설: ${o.text}`, o.correct ? 'ok' : 'bad')
        setRun(r)
        setDraft({})
      }
      return (
        <>
          <p className="field-prompt">{node.prompt}</p>
          {last && !last.correct && !h.solved && (
            <div className="field-verdict bad">
              <span className="status bad">가설 재검토</span>
              <p>{last.feedback}</p>
              {last.refute?.some((id) => !run.viewed.includes(id)) && (
                <p className="muted">이 가설은 "{dataNode.items.find((i) => i.id === last.refute.find((x) => !run.viewed.includes(x)))?.label}" 데이터를 확인했다면 바로 지울 수 있었습니다.</p>
              )}
              <p className="muted">다른 가설을 다시 세워 보세요. (두 번째 시도는 점수 절반)</p>
            </div>
          )}
          {h.solved ? (
            <>
              <div className={`field-verdict ${last?.correct ? 'ok' : 'warn'}`}>
                <span className={`status ${last?.correct ? 'ok' : 'warn'}`}>{last?.correct ? '가설 적중' : '정답 공개'}</span>
                <p>
                  <strong>{right.text}</strong>
                </p>
                <p>{right.feedback}</p>
                <p className="muted">
                  내가 고른 근거: {h.evidence.length ? h.evidence.map((id) => `${right.support.includes(id) ? '✓' : '·'} ${dataNode.items.find((i) => i.id === id)?.label}`).join(' / ') : '없음'}
                </p>
                {Object.entries(right.missing ?? {})
                  .filter(([id]) => !run.viewed.includes(id))
                  .map(([id, t]) => (
                    <p key={id} className="muted">
                      ⚠ {t}
                    </p>
                  ))}
              </div>
              <button type="button" className="primary" onClick={() => goto(run, node.next)}>
                조치 단계로 →
              </button>
            </>
          ) : (
            <>
              <div className="field-options" role="radiogroup">
                {node.options.map((o) => (
                  <label key={o.id} className={`field-option${pick === o.id ? ' on' : ''}`}>
                    <input type="radio" name="hypo" checked={pick === o.id} onChange={() => setDraft((d) => ({ ...d, pick: o.id }))} />
                    <span>{o.text}</span>
                  </label>
                ))}
              </div>
              <h4>이 가설을 뒷받침하는 데이터 (확인한 것 중에서)</h4>
              {viewedItems.length === 0 ? (
                <p className="muted">확인한 데이터가 없습니다. 근거 없이 가설만 세우게 됩니다.</p>
              ) : (
                <div className="field-evidence">
                  {viewedItems.map((i) => (
                    <label key={i.id} className={`chip${ev.includes(i.id) ? ' chip-active' : ''}`}>
                      <input type="checkbox" checked={ev.includes(i.id)} onChange={() => setDraft((d) => ({ ...d, evidence: ev.includes(i.id) ? ev.filter((x) => x !== i.id) : [...ev, i.id] }))} />
                      {i.label}
                    </label>
                  ))}
                </div>
              )}
              {node.essay && (
                <label className="field-essay">
                  <span>{node.essay.label}</span>
                  <textarea className="wq-input" rows={3} value={draft.essay ?? ''} placeholder={node.essay.placeholder} onChange={(e) => setDraft((d) => ({ ...d, essay: e.target.value }))} />
                </label>
              )}
              <button type="button" className="primary" disabled={!pick} onClick={submit}>
                가설 제출
              </button>
            </>
          )}
        </>
      )
    }

    if (node.type === 'quiz') {
      const done = run.submitted[run.node]
      const answers = draft.answers ?? {}
      const submit = () => {
        const quiz = { ...run.quiz, ...answers }
        let r = { ...run, quiz, submitted: { ...run.submitted, [run.node]: true } }
        const wrong = node.questions.filter((q) => quiz[q.id] !== q.answer)
        r = log(r, `조건 변경 위험 점검: ${node.questions.length - wrong.length}/${node.questions.length} 정답`, wrong.length ? 'warn' : 'ok')
        // 틀린 문제는 오답 노트로
        if (wrong.length) {
          try {
            const list = JSON.parse(localStorage.getItem('tutor.wrong') ?? '[]')
            for (const q of wrong) {
              const id = `field-${c.id}-${q.id}`
              const item = { q: { id, type: '실무 시나리오', topic: findProcess(c.process)?.stage ?? 'back', prompt: q.prompt, choices: q.choices, answer: q.answer, explain: q.explain, ref: { kind: 'process', id: c.process } }, misses: 1, at: new Date().toISOString() }
              const at = list.findIndex((w) => w.q.id === id)
              if (at >= 0) list[at] = { ...list[at], misses: list[at].misses + 1, at: item.at }
              else list.unshift(item)
            }
            localStorage.setItem('tutor.wrong', JSON.stringify(list.slice(0, 200)))
          } catch {
            // 저장 실패는 무시(진행에는 영향 없음)
          }
        }
        setRun(r)
      }
      return (
        <>
          {node.questions.map((q, qi) => (
            <div key={q.id} className="field-quiz">
              <p className="field-prompt">
                <span className="case-q-no">{qi + 1}</span> {q.prompt}
              </p>
              <div className="field-options">
                {q.choices.map((ch, i) => {
                  const picked = done ? run.quiz[q.id] === i : answers[q.id] === i
                  const state = done ? (i === q.answer ? ' correct' : picked ? ' wrong' : '') : picked ? ' on' : ''
                  return (
                    <label key={ch} className={`field-option${state}`}>
                      <input type="radio" name={q.id} disabled={done} checked={picked} onChange={() => setDraft((d) => ({ ...d, answers: { ...answers, [q.id]: i } }))} />
                      <span>
                        {ch}
                        {done && i === q.answer && <em className="status ok">정답</em>}
                        {done && picked && i !== q.answer && <em className="status bad">내 답</em>}
                      </span>
                    </label>
                  )
                })}
              </div>
              {done && <p className="muted">{q.explain}</p>}
            </div>
          ))}
          {!done ? (
            <button type="button" className="primary" disabled={node.questions.some((q) => answers[q.id] === undefined)} onClick={submit}>
              답 확인
            </button>
          ) : (
            <>
              {node.questions.some((q) => run.quiz[q.id] !== q.answer) && <p className="muted">틀린 문제는 오답 노트에 담았습니다.</p>}
              <button type="button" className="primary" onClick={() => goto(run, node.next)}>
                조치 선택으로 →
              </button>
            </>
          )}
        </>
      )
    }

    if (node.type === 'outcome')
      return (
        <>
          <div className={`field-verdict ${node.tone}`}>
            <span className={`status ${node.tone}`}>{node.tone === 'ok' ? '정상 복귀 신호' : node.tone === 'bad' ? '새 문제 발생' : '불완전한 결과'}</span>
            <p>{node.text}</p>
          </div>
          {node.table && <Table table={node.table} />}
          {node.lesson && <p className="field-lesson">📘 {node.lesson}</p>}
          <button type="button" className="primary" onClick={() => goto(log(run, node.text, node.tone), node.next)}>
            {node.next === 'verify' ? '검증 단계로 →' : '판단 다시 하기 →'}
          </button>
        </>
      )
    return null
  }

  // ── 평가 화면 ──
  const report = () => {
    const pickText = (nodeId) => (run.picks[nodeId] ?? []).map((id) => c.nodes[nodeId].options.find((o) => o.id === id)?.text).filter(Boolean)
    const hypo = c.nodes.hypo?.options.find((o) => o.id === run.hypo.pick)
    const body = [
      `> [!🧪|orange] ${c.id} · 교육용 가상 사례 보고서 (점수 ${result.total}/100)`,
      '',
      '## 1. 문제 정의',
      `${c.subtitle}. ${c.nodes.brief?.report ?? ''}`,
      '',
      '## 2. 영향 범위',
      ...pickText('contain').map((t) => `- ${t}`),
      '',
      '## 3. 원인 가설',
      `- ${hypo?.text ?? ''}`,
      run.essays.hypo ? `- 설명: ${run.essays.hypo}` : '',
      '',
      '## 4. 확인한 증거',
      ...run.viewed.map((id) => `- ${dataNode.items.find((i) => i.id === id)?.label}`),
      '',
      '## 5. 최종 판단',
      ...run.log.slice(-3).map((l) => `- ${l.text}`),
      '',
      '## 6. 개선 조치',
      ...[...pickText('action'), ...pickText('recover')].map((t) => `- ${t}`),
      '',
      '## 7. 검증 결과',
      '- (확인한 검증 데이터를 적으세요)',
      '',
      '## 8. 재발 방지 대책',
      ...pickText('verify').map((t) => `- [ ] ${t}`),
      run.essays.verify ? `- ${run.essays.verify}` : '',
      '',
      '<details><summary>모범 대응 절차</summary>',
      '',
      ...c.model.map((m, i) => `${i + 1}. ${m}`),
      '',
      '</details>',
    ]
      .filter((x) => x !== '')
      .join('\n')
    const note = addNote({ title: `엔지니어 보고서: ${c.title}`, body, ref: { kind: 'process', id: c.process, label: `${c.id} 보고서` }, tags: ['실무훈련', '보고서'], style: { icon: '🧾', cover: 'night' } })
    openNotePage(note.id)
  }

  const evaluation = () => {
    const g = grade(result.total)
    return (
      <>
        <div className="field-score">
          <div>
            <p className="home-eyebrow">최종 평가</p>
            <h2>
              {result.total} <small>/ 100</small>
            </h2>
            <span className={`status ${g.tone}`}>{g.label}</span>
          </div>
          <p className="muted">선택형 점수는 미리 공개된 규칙(아래 표)으로만 계산했습니다. 힌트 사용 {result.hintCount}회(점수에는 영향 없음).</p>
        </div>
        <table className="nb-table field-rubric">
          <thead>
            <tr>
              <th>평가 항목</th>
              <th>무엇을 보나</th>
              <th>점수</th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((r) => (
              <tr key={r.id}>
                <td>{r.label}</td>
                <td className="muted">{r.desc}</td>
                <td>
                  <div className="field-bar">
                    <span style={{ width: `${(r.score / r.points) * 100}%` }} className={r.score / r.points >= 0.8 ? 'ok' : r.score / r.points >= 0.5 ? 'warn' : 'bad'} />
                  </div>
                  <strong>
                    {r.score}/{r.points}
                  </strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="field-eval-grid">
          <section>
            <h4>✓ 적절한 판단</h4>
            {result.good.length ? (
              <ul>
                {result.good.map((x, i) => (
                  <li key={i}>{x.text}</li>
                ))}
              </ul>
            ) : (
              <p className="muted">없음</p>
            )}
          </section>
          <section>
            <h4>⚠ 위험하거나 보완할 판단</h4>
            {result.risky.length ? (
              <ul>
                {result.risky.map((x, i) => (
                  <li key={i}>
                    <span className={`status ${x.tone === 'bad' ? 'bad' : 'warn'}`}>{x.tone === 'bad' ? '위험' : '보완'}</span> {x.text}
                    {x.feedback && <p className="muted">{x.feedback}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">없음 👍</p>
            )}
          </section>
          <section>
            <h4>ℹ 놓친 정보</h4>
            {result.missed.length ? (
              <ul>
                {result.missed.map((x) => (
                  <li key={x.label}>
                    {x.label}
                    <p className="muted">{x.note}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">핵심 데이터를 모두 확인했습니다.</p>
            )}
          </section>
        </div>
        <details className="card field-model" open>
          <summary>모범 대응 절차</summary>
          <ol>
            {c.model.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ol>
        </details>
        <div className="field-next">
          <h4>이어서 공부하기</h4>
          <div className="button-row">
            {c.related.map((r) => (
              <button key={r.label} type="button" onClick={() => (r.kind === 'process' ? onOpenProcess(r.id) : r.kind === 'machine' ? onOpenMachine(r.id) : onGo(r.id))}>
                {r.label} →
              </button>
            ))}
            <button type="button" onClick={() => onGo('wrong')}>
              오답 노트 →
            </button>
          </div>
        </div>
        <div className="button-row">
          <button type="button" className="primary" onClick={report}>
            🧾 엔지니어 보고서 작성 (노트로)
          </button>
          <button
            type="button"
            onClick={() => {
              resetRun(c.id)
              setRunState(newRun(c))
              window.scrollTo({ top: 0 })
            }}
          >
            ↻ 처음부터 다시
          </button>
          <button type="button" className="link" onClick={onBack}>
            시나리오 목록
          </button>
        </div>
      </>
    )
  }

  const sources = c.sources.map(findSource).filter(Boolean)

  return (
    <section className="field-run">
      {/* 왼쪽: 사건 정보 · 단계 · 목표 · 진행한 조치 */}
      <aside className="field-left card">
        <button type="button" className="link" onClick={onBack}>
          ← 시나리오 목록
        </button>
        <code className="field-id">{c.id}</code>
        <h2 className="field-title">{c.title}</h2>
        <div className="field-badges">
          <span className="virtual-badge">가상 데이터</span>
          <span className="status warn">검수 전 v{c.version}</span>
        </div>
        <ol className="field-steps">
          {c.steps.map((s, i) => {
            const n = i + 1
            const st = run.done || n < stepNo ? 'done' : n === stepNo ? 'now' : ''
            return (
              <li key={s} className={st}>
                <span className="field-step-no">{st === 'done' ? '✓' : n}</span>
                {s}
              </li>
            )
          })}
        </ol>
        {!run.done && node?.goal && (
          <div className="field-goal">
            <strong>현재 목표</strong>
            <p>{node.goal}</p>
          </div>
        )}
        <div className="field-actions">
          <strong>진행한 조치</strong>
          {run.log.length === 0 ? (
            <p className="muted">아직 없음</p>
          ) : (
            <ol>
              {run.log.map((l, i) => (
                <li key={i} className={`tone-${l.tone}`}>
                  <small>+{l.t}분</small> {l.text}
                </li>
              ))}
            </ol>
          )}
        </div>
        <details className="field-assume">
          <summary>가정 · 교육용 단순화</summary>
          <ul>
            {c.assumptions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          <p className="muted">참고 출처(공정 설명):</p>
          <ul>
            {sources.map((s) => (
              <li key={s.key}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.short}: {s.title}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </aside>

      {/* 가운데: 상황 · 판단 */}
      <div className="field-center card" role="region" aria-label="상황과 판단" aria-live="polite">
        <p className="home-eyebrow">
          {run.done ? '6단계 · 결과 평가' : `${stepNo}단계 · ${node?.title}`}
        </p>
        {!run.done && <h3 className="field-node-title">{node?.title}</h3>}
        {run.done ? evaluation() : center()}
      </div>

      {/* 오른쪽: 확보한 데이터 · 공정 조건 · 선임 엔지니어 */}
      <aside className="field-right card">
        <div className="seg" role="tablist" aria-label="오른쪽 패널">
          {[
            ['data', `확보한 데이터 ${run.viewed.length}`],
            ['mentor', '선임 엔지니어'],
          ].map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={panel === id} className={panel === id ? 'active' : ''} onClick={() => setPanel(id)}>
              {label}
            </button>
          ))}
        </div>
        {panel === 'data' ? (
          <div className="field-panel">
            <h4>초기 데이터</h4>
            {c.nodes.brief?.table && <Table table={c.nodes.brief.table} />}
            {run.viewed.length === 0 ? (
              <p className="muted">데이터 수집 단계에서 확인한 데이터가 여기에 쌓입니다.</p>
            ) : (
              run.viewed.map((id) => {
                const it = dataNode.items.find((i) => i.id === id)
                return (
                  <details key={id} className="field-panel-item" open={id === run.viewed.at(-1)}>
                    <summary>
                      {it.label} <small className="muted">· {it.group}</small>
                    </summary>
                    <DataView result={it.result} />
                  </details>
                )
              })
            )}
          </div>
        ) : (
          <div className="field-panel">
            <p className="muted">정답을 바로 알려 주지 않고, 질문으로 생각을 이끕니다. 단계가 올라갈수록 구체적입니다.</p>
            {run.done || !node?.hints ? (
              <p className="muted">이 단계에는 힌트가 없습니다.</p>
            ) : (
              <>
                {node.hints.slice(0, hintLevel).map((h, i) => (
                  <div key={i} className="field-hint">
                    <span className="field-hint-lv">힌트 {i + 1}</span>
                    <p>🧑‍🔧 {h}</p>
                  </div>
                ))}
                {hintLevel < node.hints.length && (
                  <button type="button" onClick={() => setRun({ ...run, hints: { ...run.hints, [run.node]: hintLevel + 1 } })}>
                    {hintLevel === 0 ? '선임에게 물어보기' : '조금 더 구체적으로'} ({hintLevel + 1}/{node.hints.length})
                  </button>
                )}
              </>
            )}
            <p className="muted field-hint-count">이 시나리오에서 힌트 {Object.values(run.hints).reduce((s, n) => s + n, 0)}회 사용 (점수와 무관, 기록만 남습니다)</p>
          </div>
        )}
      </aside>
    </section>
  )
}
