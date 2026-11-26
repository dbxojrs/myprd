import { useMemo, useState } from 'react'
import { findMachine, SEVERITY, SOURCES } from '../../data/machineSim.js'
import { LINES } from '../../data/machineLine.js'
import { defaultValues, judge, levelText } from '../../lib/machineJudge.js'
import { finalVerdict, incoming, lineMachines } from '../../lib/machineLine.js'
import { useStoredState } from '../../lib/storage.js'
import { markActive } from '../../lib/activity.js'
import { WaferSection } from './WaferSection.jsx'
import { sourceTier, TIER_LABEL } from '../../lib/sourceTier.js'

// FAB 공정 시뮬레이션: 전공정 7단계(산화 → 포토 → 식각 → 증착 → 이온 주입 → 금속 배선 → CMP)의 조건을 바꾸며 웨이퍼 단면이 어떻게 달라지는지 봅니다.
// 판정은 설비 규칙표(data/machines/*.js)와 라인 연결 규칙(data/machineLine.js)으로만 계산합니다(AI·무작위 없음). 모두 검수 전입니다.
// 설비 실습(장비 조작)과 같은 규칙을 공정·웨이퍼 관점에서 보는 화면입니다.

const LINE_ID = 'front'
const TONE = { good: 'ok', warn: 'warn', bad: 'bad', alarm: 'bad' }

function LevelButtons({ item, value, locked, onChange }) {
  return (
    <div className="fs-cond">
      <span className="fs-cond-name">
        {item.name.ko}
        {locked && <small className="status info">앞 공정이 정함</small>}
      </span>
      <div className="fs-levels" role="radiogroup" aria-label={item.name.ko}>
        {item.levels.map((lv, i) => {
          const ex = levelText(lv, 'example')
          return (
            <button key={lv.label} type="button" role="radio" aria-checked={value === i} disabled={locked} className={`${value === i ? 'on' : ''}${item.best === i ? ' best' : ''}`} onClick={() => onChange(i)} title={item.best === i ? '권장' : ''}>
              {lv.label}
              {ex.text && <small>{ex.text}</small>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Findings({ machine, result }) {
  if (!result.findings.length)
    return (
      <p className="fs-ok">
        <span className="status ok">정상</span> 이 조건에서는 규칙표에 걸리는 알람·불량·경고가 없습니다.
      </p>
    )
  return (
    <ul className="fs-findings">
      {result.findings.map((f) => {
        const src = f.src ? (machine.sources?.[f.src] ?? SOURCES[f.src]) : null
        return (
          <li key={f.title} className={f.severity}>
            <div className="fs-f-head">
              <span className={`status ${TONE[f.severity]}`}>{SEVERITY[f.severity].label}</span>
              <strong>{f.title}</strong>
            </div>
            <p>
              <b>원인</b> {f.cause}
            </p>
            <p>
              <b>조치</b> {f.fix}
            </p>
            <p className="muted fs-basis">
              근거:{' '}
              {src ? (
                <>
                  <a href={src.url} target="_blank" rel="noreferrer">
                    {src.title}
                  </a>{' '}
                  · {src.publisher} <span className={`tier ${sourceTier(src)}`}>{TIER_LABEL[sourceTier(src)]}</span>
                  {f.cite && <q>{f.cite}</q>}
                </>
              ) : (
                f.basis
              )}
            </p>
          </li>
        )
      })}
    </ul>
  )
}

function Metrics({ machine, result }) {
  return (
    <ul className="fs-metrics" aria-label="상대 지표 (교육용 0~100)">
      {machine.metrics.map((mt) => (
        <li key={mt.id}>
          <span>{mt.name}</span>
          <span className="an-track">
            <i style={{ width: `${result.metrics[mt.id]}%` }} />
          </span>
          <b>{result.metrics[mt.id]}</b>
          <small className="muted">{mt.good === 'low' ? '낮을수록 좋음' : '높을수록 좋음'}</small>
        </li>
      ))}
    </ul>
  )
}

// 조건 조작 + 단면 + 판정 (단위 공정·전체 흐름 공통)
function ProcessPanel({ machine, values, setValues, locked = [], onOpenProcess, onOpenMachine, footer }) {
  const result = useMemo(() => judge(machine, values), [machine, values])
  const actions = (machine.actions ?? []).filter((a) => Object.entries(a.needs).every(([k, v]) => values[k] === v))
  return (
    <div className="fs-panel">
      <div className="fs-view">
        <div className="fs-section card">
          <div className="fs-section-head">
            <strong>{machine.name}</strong>
            <span className={`status ${TONE[result.grade]}`}>{SEVERITY[result.grade].label}</span>
          </div>
          <WaferSection machineId={machine.id} values={values} result={result} />
          <p className="muted fs-note">교육용 개념 단면입니다. 모양은 아래 판정과 상대 지표로만 정해지며 실제 치수·비율이 아닙니다.</p>
        </div>
        <div className="card">
          <h4>상대 지표 (교육용 0~100)</h4>
          <Metrics machine={machine} result={result} />
        </div>
      </div>
      <div className="fs-controls card">
        <h4>장비·웨이퍼 상태</h4>
        {machine.conditions.map((c) => (
          <LevelButtons key={c.id} item={c} value={values[c.id]} locked={locked.includes(c.id)} onChange={(v) => setValues({ ...values, [c.id]: v })} />
        ))}
        <h4>공정 조건</h4>
        {machine.controls.map((c) => (
          <LevelButtons key={c.id} item={c} value={values[c.id]} onChange={(v) => setValues({ ...values, [c.id]: v })} />
        ))}
        {actions.length > 0 && (
          <div className="fs-actions">
            <strong>조치</strong>
            {actions.map((a) => (
              <button key={a.id} type="button" onClick={() => setValues({ ...values, ...a.sets })} title={a.log}>
                🔧 {a.label}
              </button>
            ))}
          </div>
        )}
        <div className="button-row">
          <button type="button" className="link" onClick={() => setValues({ ...defaultValues(machine), ...Object.fromEntries(locked.map((k) => [k, values[k]])) })}>
            ↺ 권장값으로
          </button>
          {onOpenProcess && (
            <button type="button" className="link" onClick={() => onOpenProcess(machine.processId)}>
              📘 공정 설명
            </button>
          )}
          {onOpenMachine && (
            <button type="button" className="link" onClick={() => onOpenMachine(machine.id)}>
              🎛️ 설비 실습에서 장비로
            </button>
          )}
        </div>
      </div>
      <div className="fs-result card">
        <h4>판정 결과 · 근거</h4>
        <Findings machine={machine} result={result} />
        {footer?.(result)}
      </div>
    </div>
  )
}

// 7단계 단면 띠(지나온 단계 · 지금 단계 · 남은 단계)
function Strip({ ids, lot, currentId, liveValues }) {
  return (
    <ol className="fs-strip" aria-label="공정 단계">
      {ids.map((id, i) => {
        const m = findMachine(id)
        const done = lot[id]
        const now = id === currentId
        const vals = done?.values ?? (now ? liveValues : null)
        const res = done?.result ?? (now && vals ? judge(m, vals) : null)
        return (
          <li key={id} className={`${done ? 'done' : ''}${now ? ' now' : ''}`}>
            <span className="fs-strip-head">
              <b>{i + 1}</b> {m.name.split(' (')[0]}
              {done && <span className={`status ${TONE[done.result.grade]}`} aria-label={SEVERITY[done.result.grade].label} title={SEVERITY[done.result.grade].label} />}
            </span>
            {res ? <WaferSection machineId={id} values={vals} result={res} /> : <div className="fs-strip-empty">아직</div>}
          </li>
        )
      })}
    </ol>
  )
}

export default function FabProcessSim({ onOpenProcess, onOpenMachine }) {
  const ids = lineMachines(LINE_ID)
  const line = LINES.find((l) => l.id === LINE_ID)
  const [mode, setMode] = useState(() => {
    try {
      return sessionStorage.getItem('tutor-fabsim-mode') ?? 'unit'
    } catch {
      return 'unit'
    }
  })
  const pickMode = (m) => {
    setMode(m)
    try {
      sessionStorage.setItem('tutor-fabsim-mode', m)
    } catch {
      // 무시
    }
  }

  // 단위 공정
  const [unitId, setUnitId] = useState(ids[0])
  const [unitValues, setUnitValues] = useState(() => Object.fromEntries(ids.map((id) => [id, defaultValues(findMachine(id))])))

  // 전체 흐름: 지나온 단계의 조건·결과(lot)와 지금 단계의 조건
  const [flow, setFlow] = useStoredState('tutor.fabSim', { lot: {}, values: null, finished: false })
  const lot = flow.lot ?? {}
  const currentId = ids.find((id) => !lot[id]) ?? null
  const arrive = currentId ? incoming(currentId, lot) : null
  const lockedKeys = arrive ? [...new Set(arrive.notes.flatMap((n) => Object.keys(n.sets ?? {})))] : []
  const flowValues = currentId ? (flow.values?.id === currentId ? flow.values.v : arrive.values) : null
  const setFlowValues = (v) => setFlow({ ...flow, values: { id: currentId, v } })
  const verdict = !currentId ? finalVerdict(LINE_ID, lot) : null

  return (
    <section className="screen fabsim">
      <h2>FAB 공정 시뮬레이션</h2>
      <p className="muted">
        전공정 7단계의 조건을 바꾸며 웨이퍼 단면과 불량이 어떻게 달라지는지 봅니다. 판정은 설비 실습과 같은 규칙표로만 계산하고, 규칙마다 근거(출처 또는 "교육용 가설")를 함께 보여 줍니다. 모든 내용은 검수 전입니다.
      </p>
      <div className="tabs" role="tablist">
        {[
          ['unit', '단위 공정'],
          ['flow', '전체 흐름 (7공정 연결)'],
        ].map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={mode === id} className={`tab${mode === id ? ' tab-active' : ''}`} onClick={() => pickMode(id)}>
            {label}
          </button>
        ))}
      </div>

      {mode === 'unit' && (
        <>
          <div className="fs-picks" role="group" aria-label="공정 고르기">
            {ids.map((id, i) => (
              <button key={id} type="button" className={`chip small${unitId === id ? ' active' : ''}`} onClick={() => setUnitId(id)}>
                {i + 1}. {findMachine(id).name.split(' (')[0]}
              </button>
            ))}
          </div>
          <ProcessPanel
            key={unitId}
            machine={findMachine(unitId)}
            values={unitValues[unitId]}
            setValues={(v) => setUnitValues({ ...unitValues, [unitId]: v })}
            onOpenProcess={onOpenProcess}
            onOpenMachine={onOpenMachine}
          />
        </>
      )}

      {mode === 'flow' && (
        <>
          <p className="fs-flow-intro">
            {line.desc} 앞 공정의 조건·결과가 뒤 공정의 상태를 바꾸고(예: 얇은 감광막 → 이온 주입 마스크가 얇음), 끝까지 남은 영향은 최종 판정에 더해집니다.{' '}
            <span className="muted">8대 공정 순서로 단순화한 교육용 흐름이며 실제 소자 공정 순서와 다릅니다.</span>
          </p>
          <Strip ids={ids} lot={lot} currentId={currentId} liveValues={flowValues} />
          {currentId ? (
            <>
              {arrive.notes.length > 0 && (
                <div className="fs-arrive card">
                  <strong>⬇ 앞 공정에서 넘어온 상태</strong>
                  <ul>
                    {arrive.notes.map((n) => (
                      <li key={n.note}>
                        {n.note} <small className="muted">· 근거: {n.basis}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <ProcessPanel
                key={currentId}
                machine={findMachine(currentId)}
                values={flowValues}
                setValues={setFlowValues}
                locked={lockedKeys}
                onOpenProcess={onOpenProcess}
                footer={(result) => (
                  <div className="button-row fs-next">
                    <button
                      type="button"
                      className="primary"
                      disabled={Boolean(result.alarm)}
                      onClick={() => {
                        const next = { ...lot, [currentId]: { values: flowValues, result } }
                        const finished = ids.every((id) => next[id])
                        if (finished) markActive()
                        setFlow({ lot: next, values: null, finished })
                      }}
                    >
                      {ids.indexOf(currentId) === ids.length - 1 ? '이 조건으로 진행 → 최종 판정' : `이 조건으로 진행 → ${findMachine(ids[ids.indexOf(currentId) + 1]).name.split(' (')[0]}`}
                    </button>
                    {result.alarm && <p className="field-time-warn">⛔ 장비가 멈춰 진행할 수 없습니다. 원인을 없애는 조치나 조건을 바꾸세요.</p>}
                    {Object.keys(lot).length > 0 && (
                      <button type="button" className="link" onClick={() => setFlow({ lot: {}, values: null, finished: false })}>
                        ↻ 처음부터
                      </button>
                    )}
                  </div>
                )}
              />
            </>
          ) : (
            <FlowVerdict verdict={verdict} onRestart={() => setFlow({ lot: {}, values: null, finished: false })} />
          )}
        </>
      )}
    </section>
  )
}

function FlowVerdict({ verdict, onRestart }) {
  const tone = TONE[verdict.grade]
  return (
    <div className="fs-verdict card">
      <div className="fs-verdict-head">
        <span className={`status ${tone}`}>최종 판정: {verdict.label}</span>
        <small className="muted">공정별 판정과 끝까지 남은 영향 중 가장 나쁜 것으로 정합니다.</small>
      </div>
      <table className="nb-table">
        <thead>
          <tr>
            <th>공정</th>
            <th>판정</th>
            <th>주요 내용</th>
          </tr>
        </thead>
        <tbody>
          {verdict.steps.map((s) => (
            <tr key={s.machine.id}>
              <td>{s.machine.name.split(' (')[0]}</td>
              <td>
                <span className={`status ${TONE[s.result.grade]}`}>{SEVERITY[s.result.grade].label}</span>
              </td>
              <td>{s.result.findings.map((f) => f.title).join(' · ') || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {verdict.carried.length > 0 && (
        <>
          <h4>끝까지 남은 영향</h4>
          <ul>
            {verdict.carried.map((h) => (
              <li key={h.note}>
                <span className={`status ${TONE[h.final.grade]}`}>{SEVERITY[h.final.grade].label}</span> {h.final.text} <small className="muted">· 근거: {h.basis}</small>
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="button-row">
        <button type="button" className="primary" onClick={onRestart}>
          ↻ 다른 조건으로 다시
        </button>
      </div>
    </div>
  )
}
