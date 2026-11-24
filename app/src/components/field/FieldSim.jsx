import { useEffect, useRef, useState } from 'react'
import { DIFFICULTIES, FIELD_CASES, FIELD_PROCESSES, findFieldCase, PLANNED_CASES } from '../../data/fieldCases/index.js'
import { findSource } from '../../data/sourceCatalog.js'
import { evaluate, finishRun, grade, HINT_PENALTY, newRun, resetRun, saveRun, useField } from '../../lib/fieldSim.js'
import { markActive } from '../../lib/activity.js'
import { addNote, openNotePage } from '../../lib/notes.js'
import { findScenario } from '../../data/scenarios.js'
import { addReport, reportFromRun } from '../../lib/reports.js'
import { ChartView, SituationOverview, StageMedia } from './SceneVisuals.jsx'
import { writeStored } from '../../lib/storage.js'
import { findProcess } from '../../data/processes.js'
import EquipmentPanel from './EquipmentPanel.jsx'

// 현장 실무 훈련: 분기형 시나리오 목록과 진행 화면(3단: 사건·진행 / 상황·판단 / 데이터·선임 엔지니어).
// 시나리오는 data/fieldCases, 진행·채점 규칙은 lib/fieldSim.js. 진행 상태는 'tutor.field'에 저장돼 새로고침해도 이어집니다.

const STATUS_LABEL = { new: '미시작', doing: '진행 중', done: '완료' }
const statusOf = (st) => (st?.run && !st.run.done ? 'doing' : st?.best != null ? 'done' : 'new')

export default function FieldSim({ tab = 'ALL', onOpenProcess, onOpenMachine, onGo }) {
  const field = useField()
  const [openId, setOpenId] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tutor.field.open')) ?? null
    } catch {
      return null
    }
  })
  const [filter, setFilter] = useState({ status: 'all', diff: 'all', proc: 'all', q: '' })
  const open = (id) => {
    setOpenId(id)
    writeStored('tutor.field.open', id)
    window.scrollTo({ top: 0 })
  }
  const c = findFieldCase(openId)
  if (c) return <FieldRun key={c.id} c={c} saved={field[c.id]} onBack={() => open(null)} onOpenCase={open} onOpenProcess={onOpenProcess} onOpenMachine={onOpenMachine} onGo={onGo} />

  const TABS = [
    ['ALL', '전체', 'field'],
    ['FAB', '전공정 FAB', 'field-fab'],
    ['PKG', '후공정 PKG', 'field-pkg'],
  ]
  const inTab = (x) => tab === 'ALL' || x.category === tab
  const procs = tab === 'ALL' ? [...FIELD_PROCESSES.FAB, ...FIELD_PROCESSES.PKG] : FIELD_PROCESSES[tab]
  const q = filter.q.trim().toLowerCase()
  const match = (x, st) =>
    inTab(x) &&
    (filter.status === 'all' || filter.status === st) &&
    (filter.diff === 'all' || x.difficulty === filter.diff) &&
    (filter.proc === 'all' || x.processLabel === filter.proc) &&
    (!q || `${x.id} ${x.title} ${x.processLabel} ${x.subtitle ?? ''} ${x.summary ?? ''}`.toLowerCase().includes(q))
  const ready = FIELD_CASES.filter((x) => match(x, statusOf(field[x.id])))
  const planned = PLANNED_CASES.filter((x) => match(x, 'new') && !FIELD_CASES.some((r) => r.id === x.id))
  // 이미 만든 시나리오와 같은 id의 준비 중 항목은 빼고 셉니다.
  const pendingOnly = PLANNED_CASES.filter((x) => !FIELD_CASES.some((r) => r.id === x.id))
  const count = (cat) => [...FIELD_CASES, ...pendingOnly].filter((x) => cat === 'ALL' || x.category === cat).length

  return (
    <section className="screen field">
      <div className="field-hero">
        <p className="home-eyebrow">현장 실무 훈련</p>
        <h2>현장 실무 훈련</h2>
        <p className="muted">
          실제 반도체 생산 현장에서 발생할 수 있는 문제를 해결하며 공정 엔지니어의 판단 능력을 훈련합니다. <strong>상황 파악 → 초기 대응 → 데이터 수집 → 원인 분석 → 조치·검증 → 평가</strong> 순서로 진행하고,
          고른 조치에 따라 다음 상황이 달라집니다. 점수는 공개된 기준으로만 계산하며 API 키 없이 진행됩니다.
        </p>
        <span className="virtual-badge">모든 사례·수치는 교육용 가상 데이터</span>
      </div>

      <div className="field-tabs" role="tablist" aria-label="공정 구분">
        {TABS.map(([id, label, screen]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} className={`field-tab ${id.toLowerCase()}${tab === id ? ' on' : ''}`} onClick={() => onGo(screen)}>
            {id !== 'ALL' && <span className={`cat ${id.toLowerCase()}`}>{id}</span>}
            {label} <small>{count(id)}</small>
          </button>
        ))}
      </div>

      <div className="field-filters">
        <input type="search" value={filter.q} onChange={(e) => setFilter({ ...filter, q: e.target.value })} placeholder="시나리오 검색 (제목·공정·ID)" aria-label="시나리오 검색" />
        <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })} aria-label="학습 상태">
          <option value="all">상태: 전체</option>
          <option value="doing">진행 중</option>
          <option value="done">완료</option>
          <option value="new">미시작</option>
        </select>
        <select value={filter.diff} onChange={(e) => setFilter({ ...filter, diff: e.target.value })} aria-label="난이도">
          <option value="all">난이도: 전체</option>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select value={filter.proc} onChange={(e) => setFilter({ ...filter, proc: e.target.value })} aria-label="공정 종류">
          <option value="all">공정: 전체</option>
          {procs.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="field-list">
        {ready.map((x) => {
          const st = field[x.id]
          const s = statusOf(st)
          return (
            <article key={x.id} className={`card field-card cat-${x.category.toLowerCase()}`}>
              <div className="field-card-top">
                <span className={`cat ${x.category.toLowerCase()}`}>{x.category}</span>
                <span className="field-proc">{x.processLabel}</span>
                <code>{x.id}</code>
              </div>
              <h3>{x.title}</h3>
              <p className="muted">{x.subtitle}</p>
              <div className="case-tags">
                <span className="quiz-tag">{x.difficulty}</span>
                <span className="quiz-tag soft">약 {x.minutes}분</span>
                <span className={`status ${s === 'done' ? 'ok' : s === 'doing' ? 'info' : 'warn'}`}>{STATUS_LABEL[s]}</span>
                <span className="status warn">검수 전 v{x.version}</span>
              </div>
              <p className="field-comp">
                <strong>주요 역량</strong> {x.competencies?.join(' · ')}
              </p>
              <div className="field-card-foot">
                {st?.best != null ? <span className={`status ${grade(st.best).tone}`}>최고 {st.best}점</span> : <span />}
                <button type="button" className="primary" onClick={() => open(x.id)}>
                  {s === 'doing' ? '이어서 하기 →' : s === 'done' ? '다시 도전 →' : '시작하기 →'}
                </button>
              </div>
            </article>
          )
        })}
        {planned.map((x) => (
          <article key={x.id} className={`card field-card soon cat-${x.category.toLowerCase()}`}>
            <div className="field-card-top">
              <span className={`cat ${x.category.toLowerCase()}`}>{x.category}</span>
              <span className="field-proc">{x.processLabel}</span>
              <code>{x.id}</code>
            </div>
            <h3>{x.title}</h3>
            <p className="muted">{x.summary}</p>
            <div className="case-tags">
              <span className="quiz-tag">{x.difficulty}</span>
              <span className="status info">설계 샘플 · 준비 중</span>
            </div>
            <div className="field-card-foot">
              <button type="button" className="link" onClick={() => onOpenProcess(x.process)}>
                관련 이론 →
              </button>
              {x.practice ? (
                <button type="button" onClick={() => onGo('cases')}>
                  서술형 사례로 먼저 연습 →
                </button>
              ) : (
                <button type="button" disabled>
                  준비 중
                </button>
              )}
            </div>
          </article>
        ))}
        {ready.length + planned.length === 0 && <p className="muted">조건에 맞는 시나리오가 없습니다.</p>}
      </div>
    </section>
  )
}

// 웨이퍼 맵(영역별 값). 가운데→가장자리 동심원, 목표 대비 편차로 색을 칠하고 숫자·글자를 함께 씁니다.
function WaferMap({ data }) {
  const rings = data.rings
  // 목표값 대비 편차(target) 또는 한계값(limit, 예: 오버레이) 기준으로 판정합니다.
  const dev = (v) => (data.limit ? v / data.limit : (v - data.target) / data.target)
  const tone = (v) => (data.limit ? (v > data.limit ? 'bad' : v >= data.limit * 0.8 ? 'warn' : 'ok') : Math.abs(dev(v)) >= 0.05 ? 'bad' : Math.abs(dev(v)) >= 0.02 ? 'warn' : 'ok')
  const R = [70, 50, 26]
  const one = (set, title) => (
    <figure className="wmap">
      <svg viewBox="0 0 160 160" role="img" aria-label={`${title} 웨이퍼 맵: ${set.map((r) => `${r.label} ${r.value}${data.unit}`).join(', ')}`}>
        {/* set은 바깥(가장자리)→안(가운데) 순서. 큰 원부터 그려 안쪽 원이 위에 오게 합니다. */}
        {set.map((r, k) => (
          <circle key={r.label} cx="80" cy="80" r={R[k] ?? 20} className={`wmap-ring ${tone(r.value)}`} />
        ))}
        <path d="M74 152 L86 152 L80 146 Z" className="wmap-notch" />
        {set.map((r, i) => (
          <text key={r.label} x="80" y={80 - (R[i] - (R[i + 1] ?? 0)) / 2 - (R[i + 1] ?? 0) + 4} textAnchor="middle" className="wmap-val">
            {r.value}
          </text>
        ))}
      </svg>
      <figcaption>{title}</figcaption>
    </figure>
  )
  const outer = [...rings].reverse() // R 순서(바깥→안)에 맞춤
  return (
    <div className="wmap-wrap">
      <div className="wmap-row">
        {one(outer, data.title ?? '이 설비')}
        {data.compare && one([...data.compare.rings].reverse(), data.compare.label)}
      </div>
      <ul className="wmap-legend">
        {rings.map((r) => (
          <li key={r.label}>
            <span className={`status ${tone(r.value)}`}>{r.label}</span> {r.value} {data.unit}
            {data.limit ? ` (한계의 ${Math.round(dev(r.value) * 100)}%)` : ` (${dev(r.value) >= 0 ? '+' : ''}${(dev(r.value) * 100).toFixed(1)}%)`}
          </li>
        ))}
        <li className="muted">
          {data.limit
            ? `관리 한계 ${data.limit} ${data.unit} · 색: 한계의 80 % 미만 ✓ / 80~100 % ⚠ / 한계 초과 ✕ (가상 판정 기준)`
            : `목표 ${data.target} ${data.unit} · 색: 목표 대비 ±2 % 안 ✓ / 2~5 % ⚠ / 5 % 넘음 ✕ (가상 판정 기준)`}
        </li>
      </ul>
    </div>
  )
}

// 가상 시각: 시나리오 시작 시각(scene.startClock 또는 보고 시각 "오전 7:40") + 경과 분
export function makeClock(c) {
  const a = c.scene?.startClock?.match(/^(\d{1,2}):(\d{2})$/)
  const b = !a && c.nodes.brief?.who?.match(/(오전|오후)\s*(\d{1,2}):(\d{2})/)
  const start = a ? +a[1] * 60 + +a[2] : b ? ((+b[2] % 12) + (b[1] === '오후' ? 12 : 0)) * 60 + +b[3] : null
  return (t) => {
    if (start == null) return `${t}분`
    const m = (start + t) % 1440
    return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
  }
}

// 차트로 보여 준 데이터의 표 보기(접근성: 색·모양 말고 숫자로도 읽기)
function ChartTable({ result }) {
  const rows =
    result.kind === 'trend'
      ? result.points.map((p) => [p.label, `${p.value} ${result.unit}`, p.flag ? '✕ 이상' : ''])
      : result.kind === 'compare'
        ? result.rows.map((r) => [r.label, `${r.before} → ${r.after} ${result.unit}`, ''])
        : result.rows.map((r) => [r.label, `${r.value} ${result.unit}`, [r.flag ? `✕ ${r.flagText ?? '이상'}` : '', r.note ?? ''].filter(Boolean).join(' · ')])
  return (
    <details className="dl-table">
      <summary>표로 보기</summary>
      <DataView result={{ kind: 'table', cols: ['항목', '값', '비고'], rows }} />
    </details>
  )
}

function DataView({ result }) {
  if (!result) return null
  const meta = result.meta && <p className="data-meta">📋 {result.meta}</p>
  if (['bars', 'trend', 'compare'].includes(result.kind))
    return (
      <>
        {meta}
        <ChartView chart={result} />
        <ChartTable result={result} />
      </>
    )
  if (result.kind === 'wafermap')
    return (
      <>
        {meta}
        <WaferMap data={result} />
      </>
    )
  if (result.kind === 'table' && meta)
    return (
      <>
        {meta}
        <DataView result={{ ...result, meta: null }} />
      </>
    )
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

function FieldRun({ c, saved, onBack, onOpenCase, onOpenProcess, onOpenMachine, onGo }) {
  const [run, setRunState] = useState(() => saved?.run && !saved.run.done ? saved.run : saved?.run?.done ? saved.run : newRun(c))
  const [panel, setPanel] = useState('data')
  const [part, setPart] = useState(null) // 장비 구조 탭에서 강조할 부위 id 또는 검사 그림 id
  // 데이터 항목의 장비 위치 보기(관련 부위 강조 + 장비 구조 탭)
  const [drawer, setDrawer] = useState(false) // 좁은 화면: 오른쪽 패널을 아래 서랍으로 엽니다
  const showOnEquipment = (item, open = false) => {
    const target = item.parts?.[0] ?? item.figure
    if (!target) return
    setPart(target)
    setPanel('equip')
    if (open) setDrawer(true)
  }
  // 구성도·장비 그림의 부위를 누르면 장비 구조 탭에서 설명
  const pickPart = (id) => {
    setPart(id)
    setPanel('equip')
    setDrawer(true)
  }
  const clock = makeClock(c)
  // 장비 구조 탭에서 "이 데이터 확인하러 가기": 데이터 수집 단계의 해당 카드로 스크롤
  const jumpToData = (id) => {
    const el = document.getElementById(`fd-${id}`)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.classList.add('flash')
    setTimeout(() => el.classList.remove('flash'), 1600)
  }
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
      if (next.mode === 'exam') addWrongNotes(next.quiz)
      markActive()
      finishRun(c.id, next, result)
      setRunState({ ...next, done: true })
    } else setRun(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const stepNo = node?.step ?? c.steps.length
  const hintLevel = run.hints[run.node] ?? 0
  const result = run.done ? evaluate(c, run) : null
  const exam = run.mode === 'exam'
  const hideFeedback = exam && !run.done // 평가 모드: 결과 전까지 정답·피드백 숨김
  const started = run.started !== false // 예전 기록(모드 선택 전 버전)은 이미 시작한 것으로 봄
  const timeRatio = c.timeLimit ? run.time / c.timeLimit : 0
  const [sheet, setSheet] = useState(null) // 'summary' | 'prev' | null
  const [nudge, setNudge] = useState('') // 다음 단계로 못 갈 때 안내
  const centerRef = useRef(null)
  useEffect(() => setNudge(''), [run.node])

  // 틀린 점검 문제를 오답 노트로(연습: 바로, 평가: 결과 때)
  const addWrongNotes = (quizAnswers) => {
    const qs = Object.values(c.nodes).filter((n) => n.type === 'quiz').flatMap((n) => n.questions)
    const wrong = qs.filter((q) => quizAnswers[q.id] !== undefined && quizAnswers[q.id] !== q.answer)
    if (!wrong.length) return 0
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
      // 저장 실패는 진행에 영향 없음
    }
    return wrong.length
  }

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
          <SituationOverview c={c} run={run} stage={1} focus={part} onPick={pickPart} onOpenProcess={onOpenProcess} />
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
          {!started && (
            <fieldset className="field-mode">
              <legend>훈련 방식</legend>
              <label className={`field-option${!exam ? ' on' : ''}`}>
                <input type="radio" name="mode" checked={!exam} onChange={() => setRun({ ...run, mode: 'practice', timed: false })} />
                <span>
                  <strong>연습 모드 (기본)</strong>
                  <small>판단마다 바로 피드백, 힌트·장비 관찰 포인트 자유롭게, 실수해도 다시 생각해 볼 수 있습니다.</small>
                </span>
              </label>
              <label className={`field-option${exam ? ' on' : ''}`}>
                <input type="radio" name="mode" checked={exam} onChange={() => setRun({ ...run, mode: 'exam' })} />
                <span>
                  <strong>평가 모드</strong>
                  <small>결과가 나올 때까지 정답·피드백을 숨깁니다. 가설은 한 번만 제출, 힌트는 1단계마다 −{HINT_PENALTY}점. 모든 판단 이력이 기록됩니다.</small>
                </span>
              </label>
              {exam && c.timeLimit && (
                <label className="field-timed">
                  <input type="checkbox" checked={Boolean(run.timed)} onChange={(e) => setRun({ ...run, timed: e.target.checked })} />
                  제한 시간 적용 (가상 {c.timeLimit}분) — 넘기면 실패가 아니라 사건 규칙대로 감점: {c.timeRule?.text}
                </label>
              )}
            </fieldset>
          )}
          <button type="button" className="primary" onClick={() => goto(log({ ...run, started: true }, `현장 도착 · 상황 파악 (${exam ? `평가 모드${run.timed ? ' · 제한 시간' : ''}` : '연습 모드'})`), node.next)}>
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
          r = { ...r, time: r.time + (o.cost ?? 0) }
          r = log(r, o.log ?? o.text, o.tone === 'good' ? 'ok' : o.tone === 'bad' ? 'bad' : 'warn')
          if (o.status) r.status = o.status
        }
        setRun(r)
      }
      const shown = node.multi ? run.picks[run.node] ?? [] : lastPick ? [lastPick] : []
      // 함께 고를 수 없는 조치(시나리오의 exclusive 규칙)
      const blockedBy = (id) => {
        const pair = (node.exclusive ?? []).find((g) => g.includes(id))
        return pair?.find((x) => x !== id && pickedNow.includes(x))
      }
      const totalCost = pickedNow.reduce((t, id) => t + (node.options.find((o) => o.id === id)?.cost ?? 0), 0)
      return (
        <>
          {node.step <= 2 ? (
            <details className="scene-peek" open>
              <summary>🏭 현장 보기 — 장비 구성과 초기 데이터</summary>
              <SituationOverview c={c} run={run} stage={2} focus={part} onPick={pickPart} compact />
            </details>
          ) : (
            <StageMedia c={c} run={run} stage={node.step} focus={part} onPick={pickPart} only={['diagram']} collapsed />
          )}
          <p className="field-prompt">{node.prompt}</p>
          {!done ? (
            <>
              <div className="field-options action-cards" role={node.multi ? 'group' : 'radiogroup'} aria-label={node.multi ? '조치 (여러 개 고르기)' : '조치 (하나 고르기)'}>
                {node.options.map((o) => {
                  const on = pickedNow.includes(o.id)
                  const block = !on && blockedBy(o.id)
                  const other = block && node.options.find((x) => x.id === block)
                  return (
                    <label key={o.id} className={`field-option action-card${on ? ' on' : ''}${block ? ' blocked' : ''}`}>
                      <input
                        type={node.multi ? 'checkbox' : 'radio'}
                        name={run.node}
                        checked={on}
                        disabled={Boolean(block)}
                        onChange={() => setDraft((d) => ({ ...d, picks: node.multi ? (on ? pickedNow.filter((x) => x !== o.id) : [...pickedNow, o.id]) : [o.id] }))}
                      />
                      <span className="ac-body">
                        <span className="ac-head">
                          <strong>{o.title ?? o.text}</strong>
                          {on && (
                            <span className="ac-check" aria-hidden="true">
                              ✓
                            </span>
                          )}
                        </span>
                        {o.title && <span className="ac-desc">{o.text}</span>}
                        <span className="ac-meta">
                          {o.target && <span>🎯 대상: {o.target}</span>}
                          <span>⏱ {o.cost > 0 ? `가상 ${o.cost}분` : '즉시'}</span>
                        </span>
                        {other && <small className="ac-block">"{other.title ?? other.text}"와(과) 함께 고를 수 없습니다.</small>}
                      </span>
                    </label>
                  )
                })}
              </div>
              <p className="ac-total" aria-live="polite">
                {node.multi ? `선택 ${pickedNow.length}개 · ` : pickedNow.length ? '선택함 · ' : ''}예상 소요 가상 {totalCost}분
              </p>
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
              {hideFeedback ? (
                <div className="field-recorded">
                  <span className="status info">기록함</span>
                  <ul>
                    {shown.map((id) => (
                      <li key={id}>{node.options.find((o) => o.id === id)?.text}</li>
                    ))}
                  </ul>
                  <p className="muted">평가 모드: 판단이 적절했는지는 결과 평가에서 공개됩니다.</p>
                </div>
              ) : (
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
              )}
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
      // 이 단계에서 쓴 시간 = 확인한 데이터의 시간 합
      const usedHere = node.items.filter((i) => run.viewed.includes(i.id)).reduce((t, i) => t + i.cost, 0)
      const left = node.budget - usedHere
      const groups = [...new Set(node.items.map((i) => i.group))]
      return (
        <>
          <StageMedia c={c} run={run} stage={3} focus={part} onPick={pickPart} only={['diagram']} collapsed />
          <p className="field-prompt">{node.prompt}</p>
          <div className={`field-budget${left <= node.budget * 0.2 ? ' warn' : ''}`}>
            <span>데이터 확인 시간</span>
            <div className="home-progress-bar" aria-hidden="true">
              <span style={{ width: `${Math.min(100, (usedHere / node.budget) * 100)}%` }} />
            </div>
            <strong>
              {node.budget - left} / {node.budget}분
            </strong>
          </div>
          {left <= node.budget * 0.2 && left > 0 && <p className="field-time-warn">⚠ 데이터 확인 시간이 {left}분 남았습니다. 가장 중요한 확인부터 하세요.</p>}
          {left <= 0 && <p className="field-time-warn">⚠ 데이터 확인 시간을 다 썼습니다. 확보한 데이터로 원인 분석을 진행하세요.</p>}
          {groups.map((g) => (
            <div key={g} className="field-data-group">
              <h4>{g}</h4>
              {node.items
                .filter((i) => i.group === g)
                .map((i) => {
                  const seen = run.viewed.includes(i.id)
                  return (
                    <div key={i.id} id={`fd-${i.id}`} className={`field-data-item${seen ? ' seen' : ''}`}>
                      <div className="field-data-head">
                        <span className="field-data-icon" aria-hidden="true">
                          {i.icon ?? '📄'}
                        </span>
                        <span className="field-data-title">
                          <strong>{i.label}</strong>
                          {i.purpose && <small>{i.purpose}</small>}
                          <small className="field-cost">예상 소요 {i.cost}분</small>
                        </span>
                        {(i.parts?.length > 0 || i.figure) && (
                          <button type="button" className="link field-eq-link" onClick={() => showOnEquipment(i, true)} title="이 데이터와 관련된 장비 부위·검사 원리를 오른쪽 패널에서 봅니다">
                            🔧 장비에서 보기
                          </button>
                        )}
                        {seen ? (
                          <span className="status ok">확인함</span>
                        ) : (
                          <button
                            type="button"
                            disabled={i.cost > left}
                            onClick={() => {
                              const r = log({ ...run, viewed: [...run.viewed, i.id], time: run.time + i.cost }, `확인: ${i.label}`)
                              setRun(r)
                              if (i.parts?.length || i.figure) showOnEquipment(i)
                              else setPanel('data')
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
                          {!hideFeedback && <p className="muted">💡 {i.note}</p>}
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
        let r = { ...run, hypo: { pick, tries, evidence: ev, solved: exam || Boolean(o.correct) || tries >= 3 }, essays: draft.essay ? { ...run.essays, hypo: draft.essay } : run.essays }
        r = log(r, `가설: ${o.text}`, exam ? 'info' : o.correct ? 'ok' : 'bad')
        setRun(r)
        setDraft({})
      }
      return (
        <>
          <StageMedia c={c} run={run} stage={4} focus={part} onPick={pickPart} only={['diagram']} collapsed />
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
          {h.solved && hideFeedback ? (
            <>
              <div className="field-recorded">
                <span className="status info">가설 기록함</span>
                <p>
                  <strong>{last?.text}</strong>
                </p>
                <p className="muted">근거: {h.evidence.map((id) => dataNode.items.find((i) => i.id === id)?.label).join(' / ') || '없음'}</p>
                <p className="muted">평가 모드: 가설이 맞았는지는 결과 평가에서 공개됩니다.</p>
              </div>
              <button type="button" className="primary" onClick={() => goto(run, node.next)}>
                조치 단계로 →
              </button>
            </>
          ) : h.solved ? (
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
        r = log(r, exam ? '조건 변경 위험 점검 답 제출' : `조건 변경 위험 점검: ${node.questions.length - wrong.length}/${node.questions.length} 정답`, exam ? 'info' : wrong.length ? 'warn' : 'ok')
        if (!exam) addWrongNotes(quiz)
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
                  const reveal = done && !hideFeedback
                  const state = reveal ? (i === q.answer ? ' correct' : picked ? ' wrong' : '') : picked ? ' on' : ''
                  return (
                    <label key={ch} className={`field-option${state}`}>
                      <input type="radio" name={q.id} disabled={done} checked={picked} onChange={() => setDraft((d) => ({ ...d, answers: { ...answers, [q.id]: i } }))} />
                      <span>
                        {ch}
                        {reveal && i === q.answer && <em className="status ok">정답</em>}
                        {reveal && picked && i !== q.answer && <em className="status bad">내 답</em>}
                        {done && hideFeedback && picked && <em className="status info">내 답</em>}
                      </span>
                    </label>
                  )
                })}
              </div>
              {done && !hideFeedback && <p className="muted">{q.explain}</p>}
            </div>
          ))}
          {!done ? (
            <button type="button" className="primary" disabled={node.questions.some((q) => answers[q.id] === undefined)} onClick={submit}>
              답 확인
            </button>
          ) : (
            <>
              {hideFeedback ? (
                <p className="muted">평가 모드: 정답과 해설은 결과 평가에서 공개됩니다.</p>
              ) : (
                node.questions.some((q) => run.quiz[q.id] !== q.answer) && <p className="muted">틀린 문제는 오답 노트에 담았습니다.</p>
              )}
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
          {node.chart && <ChartView chart={node.chart} />}
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
      ...((run.hypotheses ?? []).length
        ? ['### 검토한 가설', ...run.hypotheses.map((h) => `- [${{ open: '검증 전', supported: '지지됨', rejected: '기각' }[h.status]}] ${h.text}${h.memo ? ` — ${h.memo}` : ''}`), '']
        : []),
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
          <p className="muted">
            {exam ? '평가 모드' : '연습 모드'} · 선택형 점수는 미리 공개된 규칙(아래 표)으로만 계산했습니다. 힌트 {result.hintCount}회
            {result.hintPenalty ? ` (−${result.hintPenalty}점)` : ' (감점 없음)'}
            {result.overtime ? ` · 제한 시간 초과(${run.time}/${c.timeLimit}분) 규칙 적용` : ''}.
          </p>
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
            <h4>ℹ 놓친 주요 증거</h4>
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
        {result.checks.length > 0 && (
          <section className="field-checks">
            <h4>판단 점검표</h4>
            <ul>
              {result.checks.map((k) => (
                <li key={k.q} className={k.ok ? 'ok' : 'bad'}>
                  <span className={`status ${k.ok ? 'ok' : 'bad'}`}>{k.ok ? '예' : '아니요'}</span> {k.q}
                </li>
              ))}
            </ul>
          </section>
        )}
        {result.hintPenalty > 0 && (
          <p className="muted">
            항목 합계 {result.subtotal}점 − 힌트 감점 {result.hintPenalty}점 = <strong>{result.total}점</strong>
          </p>
        )}
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
          <h4>유사 시나리오</h4>
          <div className="button-row">
            {(c.similar ?? []).map((sid) => {
              if (sid.startsWith('cases:'))
                return (
                  <button key={sid} type="button" onClick={() => onGo('cases')}>
                    서술형 사례: {findScenario(sid.slice(6))?.title ?? '현장 사례'} →
                  </button>
                )
              const real = findFieldCase(sid)
              const plan = PLANNED_CASES.find((x) => x.id === sid)
              return real ? (
                <button key={sid} type="button" onClick={() => onOpenCase(sid)}>
                  {sid} · {real.title} →
                </button>
              ) : plan ? (
                <button key={sid} type="button" disabled title="설계 샘플 · 준비 중">
                  {sid} · {plan.title} (준비 중)
                </button>
              ) : null
            })}
          </div>
        </div>
        <div className="button-row">
          <button type="button" className="primary" onClick={report}>
            🧾 엔지니어 보고서 작성 (노트로)
          </button>
          <button
            type="button"
            onClick={() => {
              addReport(reportFromRun(c, run))
              onGo('report')
            }}
          >
            📑 8D · 5 Why · 피시본으로 정리
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
        <div className="field-badges">
          <span className={`cat ${c.category.toLowerCase()}`}>{c.category}</span>
          <code className="field-id">{c.id}</code>
        </div>
        <h2 className="field-title">{c.title}</h2>
        <p className="muted field-meta">
          {c.processLabel} · {c.difficulty} · 약 {c.minutes}분
        </p>
        <div className="field-badges">
          {started && <span className={`status ${exam ? 'warn' : 'info'}`}>{exam ? `평가 모드${run.timed ? ' · 제한 시간' : ''}` : '연습 모드'}</span>}
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
              {run.log.map((l, i) => {
                const tone = hideFeedback ? 'info' : l.tone
                return (
                  <li key={i} className={`tone-${tone}`}>
                    <small className="field-log-time" title={`시작 뒤 ${l.t}분`}>
                      {clock(l.t)}
                    </small>
                    <span>{l.text}</span>
                    {!hideFeedback && (tone === 'ok' || tone === 'bad' || tone === 'warn') && <small className={`field-log-res ${tone}`}>{tone === 'ok' ? '적절' : tone === 'bad' ? '위험' : '보완'}</small>}
                  </li>
                )
              })}
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
        <nav className="field-crumb" aria-label="현재 위치">
          <button type="button" className="link" onClick={onBack}>
            현장 실무 훈련
          </button>
          <span aria-hidden="true">›</span>
          <span>{c.category === 'FAB' ? '전공정 FAB' : '후공정 PKG'}</span>
          <span aria-hidden="true">›</span>
          <strong>{c.processLabel}</strong>
          {started && <span className={`status ${exam ? 'warn' : 'info'} field-crumb-mode`}>{exam ? `평가 모드${run.timed ? ' · 제한 시간' : ''}` : '연습 모드'}</span>}
        </nav>
        <dl className="field-summary" aria-label="사건 요약">
          <div>
            <dt>사건</dt>
            <dd>{c.id}</dd>
          </div>
          <div className="field-summary-step">
            <dt>현재 단계 · 진행률</dt>
            <dd>
              {run.done ? `${c.steps.length}/${c.steps.length} 결과 평가` : `${stepNo}/${c.steps.length} ${c.steps[stepNo - 1] ?? ''}`}
              <span className="field-timebar" aria-hidden="true">
                <span style={{ width: `${run.done ? 100 : Math.round(((stepNo - 1) / c.steps.length) * 100)}%` }} />
              </span>
            </dd>
          </div>
          <div>
            <dt>공정</dt>
            <dd>
              <span className={`cat ${c.category.toLowerCase()}`}>{c.category}</span> {c.processLabel}
            </dd>
          </div>
          <div>
            <dt>설비</dt>
            <dd>{c.equipment?.name ?? '-'}</dd>
          </div>
          <div>
            <dt>현재 상태</dt>
            <dd>{run.done ? '조치 완료 · 평가' : run.status ?? '이상 보고 접수'}</dd>
          </div>
          <div className={`field-summary-time${run.timed && exam && timeRatio >= 0.8 ? ' warn' : ''}`}>
            <dt>가상 경과{run.timed && exam ? ` / 제한 ${c.timeLimit}분` : ''}</dt>
            <dd>
              {run.time}분
              {c.timeLimit && (
                <span className="field-timebar" aria-hidden="true">
                  <span style={{ width: `${Math.min(100, timeRatio * 100)}%` }} className={timeRatio >= 1 ? 'bad' : timeRatio >= 0.8 ? 'warn' : ''} />
                </span>
              )}
            </dd>
          </div>
        </dl>
        <ol className="field-stepbar" aria-label="진행 단계">
          {c.steps.map((st, i) => {
            const n = i + 1
            const k = run.done || n < stepNo ? 'done' : n === stepNo ? 'now' : ''
            return (
              <li key={st} className={k} aria-current={k === 'now' ? 'step' : undefined}>
                <span>{k === 'done' ? '✓' : n}</span>
                <small>{st}</small>
              </li>
            )
          })}
        </ol>
        {run.timed && exam && !run.done && timeRatio >= 0.8 && (
          <p className="field-time-warn">{timeRatio >= 1 ? `⚠ 제한 시간(${c.timeLimit}분)을 넘겼습니다. 끝까지 진행할 수 있으며, 사건 규칙대로 감점됩니다.` : `⚠ 제한 시간까지 ${c.timeLimit - run.time}분 남았습니다. 우선순위를 정하세요.`}</p>
        )}
        <p className="home-eyebrow">
          {run.done ? '6단계 · 결과 평가' : `${stepNo}단계 · ${node?.title}`}
        </p>
        {!run.done && <h3 className="field-node-title">{node?.title}</h3>}
        <div ref={centerRef}>{run.done ? evaluation() : center()}</div>
        {!run.done && started && (
          <div className="field-actionbar" role="toolbar" aria-label="진행 버튼">
            {nudge && <p className="field-nudge" role="status">{nudge}</p>}
            <button type="button" onClick={() => setSheet('prev')} disabled={run.path.length < 2}>
              ← 이전 단계 보기
            </button>
            <button type="button" onClick={() => setSheet('summary')}>
              🗂 현재까지 정리하기
            </button>
            <button type="button" className="field-drawer-btn" onClick={() => setDrawer((d) => !d)} aria-expanded={drawer}>
              📂 자료 {run.viewed.length}
            </button>
            <button type="button" onClick={() => (setPanel('mentor'), setDrawer(true))} disabled={!node?.hints}>
              💡 힌트{exam ? ` (−${HINT_PENALTY}점)` : ''}
            </button>
            <button
              type="button"
              className="primary"
              onClick={() => {
                const btns = [...(centerRef.current?.querySelectorAll('button.primary') ?? [])]
                const go = btns.at(-1)
                if (go && !go.disabled) return go.click()
                const why = {
                  choice: '선택지를 하나 이상 고른 뒤 결정하세요.',
                  data: '데이터를 하나 이상 확인하세요. 모든 데이터를 볼 필요는 없습니다.',
                  hypothesis: '가장 유력한 원인 가설을 하나 고르세요. 근거 데이터도 함께 고르면 좋습니다.',
                  quiz: '모든 문항에 답을 고르세요.',
                }
                setNudge(why[node?.type] ?? '이 단계에서 할 일을 먼저 마치세요.')
              }}
            >
              다음 단계 →
            </button>
          </div>
        )}
      </div>
      {sheet && <FieldSheet kind={sheet} c={c} run={run} hideFeedback={hideFeedback} clock={clock} onClose={() => setSheet(null)} />}

      {/* 오른쪽: 확보한 데이터 · 공정 조건 · 선임 엔지니어 */}
      {drawer && <div className="field-drawer-bg" onClick={() => setDrawer(false)} aria-hidden="true" />}
      <aside className={`field-right card${drawer ? ' open' : ''}`} aria-label="자료 패널">
        <div className="field-drawer-head">
          <strong>자료 패널</strong>
          <button type="button" className="link" onClick={() => setDrawer(false)}>
            닫기 ✕
          </button>
        </div>
        <div className="field-tabs" role="tablist" aria-label="오른쪽 패널">
          {[
            ['data', '📂', '확보 데이터', run.viewed.length],
            ['scene', '🏭', '현장 보기'],
            ['equip', '🔧', '장비 구조'],
            ['hypo', '🧠', '현재 가설', (run.hypotheses ?? []).length],
            ['mentor', '🧑‍🔧', '선임 엔지니어'],
          ].map(([id, icon, label, n]) => (
            <button key={id} type="button" role="tab" aria-selected={panel === id} className={panel === id ? 'active' : ''} onClick={() => setPanel(id)}>
              <span aria-hidden="true">{icon}</span>
              <span>
                {label}
                {n ? <b>{n}</b> : null}
              </span>
            </button>
          ))}
        </div>
        {panel === 'scene' ? (
          <div className="field-panel">
            <SituationOverview c={c} run={run} stage={run.done ? null : stepNo} focus={part} onPick={pickPart} compact />
          </div>
        ) : panel === 'equip' ? (
          <div className="field-panel">
            <EquipmentPanel c={c} run={run} focus={part} onFocus={setPart} onJumpData={jumpToData} canJump={node?.type === 'data' && !run.done} hideObserve={hideFeedback} />
          </div>
        ) : panel === 'hypo' ? (
          <div className="field-panel">
            <HypothesisBoard run={run} items={dataNode.items} onChange={(hypotheses) => setRun({ ...run, hypotheses })} />
          </div>
        ) : panel === 'data' ? (
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
                      {run.log.find((l) => l.text === `확인: ${it.label}`) && <small className="muted"> · 확보 {clock(run.log.find((l) => l.text === `확인: ${it.label}`).t)}</small>}
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
            {exam && !run.done && <p className="field-time-warn">평가 모드: 힌트 1단계마다 −{HINT_PENALTY}점입니다.</p>}
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
            <p className="muted field-hint-count">이 시나리오에서 힌트 {Object.values(run.hints).reduce((s, n) => s + n, 0)}회 사용 {exam ? `(평가 모드: 1단계마다 −${HINT_PENALTY}점)` : '(연습 모드: 점수와 무관, 기록만 남습니다)'}</p>
          </div>
        )}
      </aside>
    </section>
  )
}

const HYPO_STATUS = { open: { label: '검증 전', tone: 'info' }, supported: { label: '지지됨', tone: 'ok' }, rejected: { label: '기각', tone: 'bad' } }

// "현재 가설" 탭: 내가 생각하는 원인 후보를 여러 개 적고, 확보한 데이터를 근거/반대 증거로 붙이며, 검증 상태와 메모를 관리합니다.
// 점수에는 들어가지 않는 개인 작업 공간이며(채점은 원인 분석 단계에서), 보고서에 함께 들어갑니다.
function HypothesisBoard({ run, items, onChange }) {
  const list = run.hypotheses ?? []
  const [text, setText] = useState('')
  const viewed = items.filter((i) => run.viewed.includes(i.id))
  const patch = (id, p) => onChange(list.map((h) => (h.id === id ? { ...h, ...p } : h)))
  const toggle = (h, key, dataId) => patch(h.id, { [key]: h[key].includes(dataId) ? h[key].filter((x) => x !== dataId) : [...h[key], dataId] })
  return (
    <div className="hypo-board">
      <p className="muted">생각나는 원인 후보를 적고, 확보한 데이터를 근거·반대 증거로 연결해 보세요. 점수와 무관한 개인 메모이며 보고서에 들어갑니다.</p>
      <form
        className="hypo-add"
        onSubmit={(e) => {
          e.preventDefault()
          if (!text.trim()) return
          onChange([...list, { id: `h${Date.now().toString(36)}`, text: text.trim(), for: [], against: [], status: 'open', memo: '' }])
          setText('')
        }}
      >
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="예: 새 Capillary 문제일 것 같다" aria-label="새 가설" />
        <button type="submit" disabled={!text.trim()}>
          추가
        </button>
      </form>
      {list.length === 0 && <p className="muted">아직 적은 가설이 없습니다.</p>}
      {list.map((h) => (
        <article key={h.id} className={`hypo-card ${h.status}`}>
          <div className="hypo-head">
            <strong>{h.text}</strong>
            <button type="button" className="link" onClick={() => onChange(list.filter((x) => x.id !== h.id))} aria-label="가설 지우기">
              ✕
            </button>
          </div>
          <div className="hypo-status" role="radiogroup" aria-label="검증 상태">
            {Object.entries(HYPO_STATUS).map(([k, v]) => (
              <button key={k} type="button" role="radio" aria-checked={h.status === k} className={`status ${h.status === k ? v.tone : ''}`} onClick={() => patch(h.id, { status: k })}>
                {v.label}
              </button>
            ))}
          </div>
          {viewed.length === 0 ? (
            <p className="muted">데이터를 확인하면 근거로 연결할 수 있습니다.</p>
          ) : (
            <div className="hypo-evidence">
              {[
                ['for', '근거'],
                ['against', '반대 증거'],
              ].map(([key, label]) => (
                <div key={key}>
                  <small>{label}</small>
                  <div className="field-evidence">
                    {viewed.map((i) => (
                      <label key={i.id} className={`chip small${h[key].includes(i.id) ? ' chip-active' : ''}`}>
                        <input type="checkbox" checked={h[key].includes(i.id)} onChange={() => toggle(h, key, i.id)} />
                        {i.label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          <textarea className="wq-input" rows={2} value={h.memo} onChange={(e) => patch(h.id, { memo: e.target.value })} placeholder="메모" aria-label="가설 메모" />
        </article>
      ))}
    </div>
  )
}

// 하단 버튼의 "이전 단계 보기"·"현재까지 정리하기" 창(읽기 전용)
function FieldSheet({ kind, c, run, hideFeedback, clock, onClose }) {
  const dataNode = Object.values(c.nodes).find((n) => n.type === 'data')
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  const decided = (nodeId) => {
    const n = c.nodes[nodeId]
    if (n?.options && n.type !== 'hypothesis') return (run.picks[nodeId] ?? []).map((id) => n.options.find((o) => o.id === id)?.text)
    if (n?.type === 'data') return run.viewed.map((id) => n.items.find((i) => i.id === id)?.label)
    if (n?.type === 'hypothesis' && run.hypo.pick) return [n.options.find((o) => o.id === run.hypo.pick)?.text]
    if (n?.type === 'quiz') return n.questions.filter((q) => run.quiz[q.id] !== undefined).map((q) => `${q.prompt} → ${q.choices[run.quiz[q.id]]}`)
    if (n?.type === 'outcome') return [n.text]
    return []
  }
  const past = [...new Set(run.path.slice(0, -1))]
  return (
    <div className="field-sheet-bg" onClick={onClose}>
      <div className="field-sheet card" role="dialog" aria-modal="true" aria-label={kind === 'prev' ? '이전 단계' : '현재까지 정리'} onClick={(e) => e.stopPropagation()}>
        <div className="field-sheet-head">
          <h3>{kind === 'prev' ? '지나온 단계 (읽기 전용)' : '현재까지 정리'}</h3>
          <button type="button" className="link" onClick={onClose} autoFocus>
            닫기 ✕
          </button>
        </div>
        {kind === 'prev' ? (
          <ol className="field-sheet-list">
            {past.map((id) => (
              <li key={id}>
                <strong>{c.nodes[id]?.title}</strong>
                <ul>
                  {decided(id).filter(Boolean).map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                  {decided(id).length === 0 && <li className="muted">기록 없음</li>}
                </ul>
              </li>
            ))}
            <p className="muted">이미 내린 판단은 바꿀 수 없습니다. 실제 현장처럼, 새 정보가 나오면 다음 단계에서 판단을 고쳐 가세요.</p>
          </ol>
        ) : (
          <div className="field-sheet-grid">
            <section>
              <h4>진행</h4>
              <p>
                {run.mode === 'exam' ? '평가 모드' : '연습 모드'} · 가상 {run.time}분{c.timeLimit && run.timed ? ` / 제한 ${c.timeLimit}분` : ''} · 현재 상태: {run.status ?? '이상 보고 접수'}
              </p>
            </section>
            <section>
              <h4>확보한 데이터 {run.viewed.length}개</h4>
              <ul>
                {run.viewed.map((id) => (
                  <li key={id}>{dataNode.items.find((i) => i.id === id)?.label}</li>
                ))}
              </ul>
            </section>
            <section>
              <h4>수행한 조치</h4>
              <ul>
                {run.log.map((l, i) => (
                  <li key={i}>
                    <small className="muted">{clock(l.t)}</small> {l.text}
                    {!hideFeedback && l.tone !== 'info' && <small className={`field-log-res ${l.tone}`}> {l.tone === 'ok' ? '적절' : l.tone === 'bad' ? '위험' : '보완'}</small>}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h4>내 가설</h4>
              {(run.hypotheses ?? []).length ? (
                <ul>
                  {run.hypotheses.map((h) => (
                    <li key={h.id}>
                      [{HYPO_STATUS[h.status].label}] {h.text} <small className="muted">근거 {h.for.length} · 반대 {h.against.length}</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">오른쪽 "현재 가설" 탭에서 적을 수 있습니다.</p>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
