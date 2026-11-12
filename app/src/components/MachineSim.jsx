import { useEffect, useState } from 'react'
import { DISPLAY_MODES, machines, SEVERITY, SOURCES } from '../data/machineSim.js'
import { findProcess } from '../data/processes.js'
import { defaultValues, findFindings, goalMet, judge, levelText } from '../lib/machineJudge.js'
import MachineView, { TowerLamp } from './MachineView.jsx'
import { DetailIllustration } from './DetailIllustration.jsx'
import { Term } from '../lib/terms.jsx'

// 고급 장비 시뮬레이터. 장비 조작반처럼 조건을 정하고 START를 누르면 가동 순서를 따라 진행하고,
// 규칙표(data/machineSim.js)로 알람·불량·경고·정상을 판정합니다.

const STEP_MS = 800

const STATUS_TEXT = { idle: '대기', running: '가동 중', alarm: '알람 정지', bad: '완료 · 불량', warn: '완료 · 경고', good: '완료 · 정상' }

function fillTemplate(text, machine, values, mode) {
  return text.replace(/\{(\w+)\}/g, (_, key) => {
    const item = [...machine.controls, ...machine.conditions].find((c) => c.id === key)
    const level = item.levels[values[key]]
    const shown = levelText(level, mode).text
    return shown ? `${level.label}(${shown})` : level.label
  })
}

function LevelPicker({ item, value, mode, disabled, onChange }) {
  const current = levelText(item.levels[value], mode)
  return (
    <div className="ms-control">
      <div className="ms-control-head">
        <span className="ms-control-name">
          <Term value={item.name} />
        </span>
        <span className="ms-lcd" aria-live="polite">
          {item.levels[value].label}
          {current.text && <b> {current.text}</b>}
          {current.sourced && <span title="출처 있는 숫자"> 📖</span>}
          {current.example && <small> 예시</small>}
        </span>
      </div>
      <div className="ms-steps" role="radiogroup" aria-label={item.name.ko}>
        {item.levels.map((level, i) => (
          <button
            key={level.label}
            type="button"
            role="radio"
            aria-checked={i === value}
            className={`ms-step${i === value ? ' on' : ''}${i === item.best ? ' best' : ''}`}
            disabled={disabled}
            onClick={() => onChange(i)}
          >
            {level.label}
          </button>
        ))}
      </div>
      {current.source && !current.sourced && (
        <p className="ms-source-line">📖 출처 숫자: {current.source.value}</p>
      )}
    </div>
  )
}

function Gauge({ metric, value }) {
  const tone =
    metric.good === 'mid' ? '' : metric.good === 'low' ? (value >= 60 ? 'bad' : value >= 30 ? 'warn' : 'good') : value < 40 ? 'bad' : value < 70 ? 'warn' : 'good'
  return (
    <div className="ms-gauge">
      <span>{metric.name}</span>
      <div className="ms-gauge-bar">
        <span className={tone} style={{ width: `${value}%` }} />
      </div>
      <b>{value}</b>
    </div>
  )
}

function Basis({ finding }) {
  if (finding.src) {
    const source = SOURCES[finding.src]
    return (
      <p className="ms-basis">
        근거:{' '}
        <a href={source.url} target="_blank" rel="noreferrer">
          {source.publisher} · {source.title}
        </a>{' '}
        — {finding.cite}
      </p>
    )
  }
  return <p className="ms-basis">근거: {finding.basis ?? '교육용 가설(검수 전)'}</p>
}

export default function MachineSim({ onOpenProcess }) {
  const [machineId, setMachineId] = useState(machines[0].id)
  const machine = machines.find((m) => m.id === machineId)
  const [mode, setMode] = useState('free')
  const [display, setDisplay] = useState('example')
  const [scenarioId, setScenarioId] = useState(null)
  const [values, setValues] = useState(() => defaultValues(machines[0]))
  const [phase, setPhase] = useState('idle') // idle | running | finished
  const [step, setStep] = useState(0)
  const [log, setLog] = useState([])
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  const scenario = mode === 'scenario' ? machine.scenarios.find((s) => s.id === scenarioId) : null
  const running = phase === 'running'
  const status = running ? 'running' : phase === 'finished' && result ? result.grade : 'idle'
  const liveFindings = phase === 'finished' && result ? result.findings : []

  const resetRun = (message) => {
    setPhase('idle')
    setStep(0)
    setResult(null)
    setLog(message ? [message] : [])
  }

  const chooseMachine = (id) => {
    const next = machines.find((m) => m.id === id)
    setMachineId(id)
    setScenarioId(null)
    setValues(defaultValues(next))
    resetRun()
  }

  const chooseMode = (next) => {
    setMode(next)
    setScenarioId(null)
    setValues(defaultValues(machine))
    resetRun()
  }

  const chooseScenario = (s) => {
    setScenarioId(s.id)
    setValues({ ...defaultValues(machine), ...s.preset })
    resetRun(`작업 지시: ${s.title}`)
  }

  const setValue = (id, level) => {
    setValues((v) => ({ ...v, [id]: level }))
    if (phase === 'finished') resetRun()
  }

  const runAction = (action) => {
    setValues((v) => ({ ...v, ...action.sets }))
    setPhase('idle')
    setResult(null)
    setLog((lines) => [...lines, `[조치] ${action.log}`])
  }

  const start = () => {
    const r = judge(machine, values)
    setResult(r)
    setStep(0)
    setPhase('running')
    setLog((lines) => [...lines.filter((l) => l.startsWith('[조치]') || l.startsWith('작업 지시')), '▶ START'])
  }

  const stop = () => {
    setPhase('idle')
    setResult(null)
    setLog((lines) => [...lines, '■ 작업자가 정지함'])
  }

  // 가동 순서를 한 단계씩 진행합니다. 알람이 걸린 단계에서 멈춥니다.
  useEffect(() => {
    if (!running || !result) return undefined
    const timer = setTimeout(() => {
      const seq = machine.sequence
      if (step === result.stopIndex && result.alarm) {
        setLog((lines) => [...lines, fillTemplate(seq[step].text, machine, values, display), `⚠ ALARM · ${result.alarm.title}`])
        setPhase('finished')
      } else if (step >= seq.length) {
        setLog((lines) => [...lines, `■ 완료 · ${SEVERITY[result.grade].label}`])
        setPhase('finished')
      } else {
        setLog((lines) => [...lines, fillTemplate(seq[step].text, machine, values, display)])
        setStep(step + 1)
      }
    }, STEP_MS)
    return () => clearTimeout(timer)
  }, [running, step, result, machine, values, display])

  // 끝나면 이력에 남깁니다.
  useEffect(() => {
    if (phase !== 'finished' || !result) return
    setHistory((list) => [
      {
        n: list.length + 1,
        machine: machine.name,
        scenario: scenario?.title ?? '자유 조작',
        settings: machine.controls.map((c) => `${c.name.ko} ${c.levels[values[c.id]].label}`).join(' · '),
        grade: result.grade,
        goal: goalMet(scenario, result),
      },
      ...list,
    ])
    // 판정이 끝났을 때 한 번만 남깁니다.
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  const preview = findFindings(machine, values)
  const metrics = (phase === 'finished' && result ? result : judge(machine, values)).metrics
  const met = phase === 'finished' && result ? goalMet(scenario, result) : null
  const processName = findProcess(machine.processId).name

  return (
    <section className="screen">
      <h2>고급 장비 시뮬레이터</h2>
      <p className="muted">
        실제 장비 조작반처럼 상태를 확인하고 조건을 정한 뒤 START를 누르세요. 가동 순서대로 진행하다가 문제가 있으면 알람으로 멈추고,
        끝나면 불량·경고·정상을 판정합니다. 판정은 규칙표로만 계산하며 검수 전입니다.
      </p>

      <div className="ms-toolbar">
        <div className="button-row" role="group" aria-label="장비">
          {machines.map((m) => (
            <button key={m.id} type="button" className={m.id === machineId ? 'chip chip-active' : 'chip'} aria-pressed={m.id === machineId} onClick={() => chooseMachine(m.id)}>
              {m.name}
            </button>
          ))}
        </div>
        <div className="button-row" role="group" aria-label="모드">
          {[
            ['free', '자유 조작'],
            ['scenario', '상황 실습'],
          ].map(([id, label]) => (
            <button key={id} type="button" className={mode === id ? 'chip chip-active' : 'chip'} aria-pressed={mode === id} onClick={() => chooseMode(id)}>
              {label}
            </button>
          ))}
        </div>
        <div className="button-row" role="group" aria-label="값 표시">
          {DISPLAY_MODES.map((d) => (
            <button key={d.id} type="button" className={display === d.id ? 'chip chip-active' : 'chip'} aria-pressed={display === d.id} onClick={() => setDisplay(d.id)}>
              {d.label}
            </button>
          ))}
        </div>
        <p className="muted ms-note">{DISPLAY_MODES.find((d) => d.id === display).note}</p>
      </div>

      {mode === 'scenario' && (
        <div className="ms-scenarios">
          {machine.scenarios.map((s) => (
            <button key={s.id} type="button" className={`ms-scenario${s.id === scenarioId ? ' on' : ''}`} onClick={() => chooseScenario(s)}>
              <strong>{s.title}</strong>
              <span>{s.brief}</span>
            </button>
          ))}
        </div>
      )}
      {scenario && (
        <article className="ms-order">
          <strong>📋 작업 지시서 · {scenario.title}</strong>
          <p>{scenario.brief}</p>
          <p className="muted">
            목표: {scenario.goal.maxGrade === 'good' ? '경고 없이 정상' : '불량·알람 없이(경고까지 허용)'}
            {Object.entries(scenario.goal.metric ?? {}).map(([id, min]) => ` · ${machine.metrics.find((m) => m.id === id).name} ${min} 이상`)}
            {' · '}힌트: {scenario.hint}
          </p>
        </article>
      )}

      {mode === 'scenario' && !scenario ? (
        <p className="placeholder">위에서 상황을 하나 고르세요.</p>
      ) : (
        <div className="ms-hmi">
          <div className="ms-screen">
            <div className="ms-screen-head">
              <strong>{machine.name}</strong>
              <span className={`ms-status ${status}`}>{STATUS_TEXT[status]}</span>
              <TowerLamp status={status} />
            </div>
            <MachineView machine={machine} values={values} running={running} findings={liveFindings} />
            <div className="ms-gauges">
              {machine.metrics.map((m) => (
                <Gauge key={m.id} metric={m} value={metrics[m.id]} />
              ))}
              <p className="muted ms-note">지표는 규칙표로 계산한 교육용 상대값(0~100)입니다.</p>
            </div>
            {log.length === 0 ? (
              <p className="ms-log muted">로그 없음 · START를 누르세요</p>
            ) : (
              <ol className="ms-log" aria-live="polite">
                {log.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ol>
            )}
          </div>

          <div className="ms-panel">
            <h3>상태 {mode === 'scenario' && <small className="muted">(상황이 정함 · 조치 버튼으로만 바꿀 수 있음)</small>}</h3>
            {machine.conditions.map((c) => (
              <LevelPicker key={c.id} item={c} value={values[c.id]} mode={display} disabled={running || mode === 'scenario'} onChange={(i) => setValue(c.id, i)} />
            ))}
            <div className="button-row">
              {machine.actions.map((a) => {
                const ready = Object.entries(a.needs).every(([k, v]) => values[k] === v)
                return (
                  <button key={a.id} type="button" disabled={running || !ready} onClick={() => runAction(a)} title={ready ? '' : '지금 상태에서는 필요 없습니다'}>
                    🔧 {a.label}
                  </button>
                )
              })}
            </div>

            <h3>조건</h3>
            {machine.controls.map((c) => (
              <LevelPicker key={c.id} item={c} value={values[c.id]} mode={display} disabled={running} onChange={(i) => setValue(c.id, i)} />
            ))}
            <p className="muted ms-note">점선 테두리 단계가 권장값입니다. 지금 조건으로 걸리는 규칙 {preview.length}개 (가동해야 내용이 보입니다)</p>

            <div className="ms-run">
              <button type="button" className="ms-start" disabled={running} onClick={start}>
                ▶ START
              </button>
              <button type="button" className="ms-stop" disabled={!running} onClick={stop}>
                ■ STOP
              </button>
              <button type="button" disabled={running} onClick={() => resetRun('↺ RESET · 알람 해제')}>
                ↺ RESET
              </button>
            </div>
          </div>
        </div>
      )}

      {phase === 'finished' && result && (
        <article className={`card ms-result ${result.grade}`}>
          <h3>
            판정: {SEVERITY[result.grade].label}
            {met !== null && <span className={met ? 'ms-goal ok' : 'ms-goal no'}>{met ? '🎯 목표 달성' : '목표 미달성'}</span>}
          </h3>
          {result.findings.length === 0 ? (
            <p>모든 단계를 문제없이 마쳤습니다. 조건을 바꿔 보며 지표가 어떻게 달라지는지 비교해 보세요.</p>
          ) : (
            <ul className="ms-findings">
              {result.findings.map((f) => (
                <li key={`${f.severity}-${f.title}`} className={f.severity}>
                  <p className="ms-finding-title">
                    <span className={`ms-badge ${f.severity}`}>{SEVERITY[f.severity].label}</span> {f.title}
                  </p>
                  <p>왜? {f.cause}</p>
                  <p>
                    <b>조치:</b> {f.fix}
                  </p>
                  <Basis finding={f} />
                  {f.figure && <DetailIllustration id={f.figure} />}
                </li>
              ))}
            </ul>
          )}
          {result.alarm && <p className="muted">알람으로 멈추면 그 뒤 단계의 불량은 아직 알 수 없습니다. 조치하고 다시 START 하세요.</p>}
          <button type="button" onClick={() => onOpenProcess(machine.processId)}>
            🔍 <Term value={processName} compact /> 원리 다시 보기 (확대해서 보기)
          </button>
        </article>
      )}

      {history.length > 0 && (
        <details className="ms-history" open>
          <summary>작업 이력 {history.length}건</summary>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>상황</th>
                <th>조건</th>
                <th>판정</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.n}>
                  <td>{h.n}</td>
                  <td>
                    {h.machine}
                    <br />
                    <small>{h.scenario}</small>
                  </td>
                  <td>
                    <small>{h.settings}</small>
                  </td>
                  <td>
                    <span className={`ms-badge ${h.grade}`}>{SEVERITY[h.grade].label}</span>
                    {h.goal !== null && <small>{h.goal ? ' 🎯' : ' ✗'}</small>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      )}
    </section>
  )
}
