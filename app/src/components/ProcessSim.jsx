import { useState } from 'react'
import { lineOptions, GRADE_LABEL } from '../data/lineSim.js'
import { findProcess } from '../data/processes.js'
import { judgeProcess } from '../lib/judge.js'
import { ProcessIllustration } from './Illustrations.jsx'
import { Term } from '../lib/terms.jsx'

const simProcessIds = Object.keys(lineOptions)

function defaultValues(processId) {
  return Object.fromEntries(lineOptions[processId].map((variable) => [variable.id, 1]))
}

export default function ProcessSim() {
  const [processId, setProcessId] = useState(simProcessIds[1])
  const [values, setValues] = useState(() => defaultValues(simProcessIds[1]))
  const [result, setResult] = useState(null)

  const choose = (id) => {
    setProcessId(id)
    setValues(defaultValues(id))
    setResult(null)
  }

  return (
    <section className="screen">
      <h2>공정 시뮬레이션</h2>
      <div className="button-row">
        {simProcessIds.map((id) => (
          <button
            key={id}
            type="button"
            className={id === processId ? 'chip chip-active' : 'chip'}
            aria-pressed={id === processId}
            onClick={() => choose(id)}
          >
            <Term value={findProcess(id).name} compact />
          </button>
        ))}
      </div>

      <article className="card">
        <ProcessIllustration id={processId} />
        {lineOptions[processId].map((variable) => (
          <label key={variable.id} className="slider">
            <span>
              <Term value={variable.name} />
            </span>
            <input
              type="range"
              min="0"
              max="2"
              step="1"
              value={values[variable.id]}
              onChange={(event) => {
                setValues({ ...values, [variable.id]: Number(event.target.value) })
                setResult(null)
              }}
            />
            <span className="slider-value">{variable.choices[values[variable.id]].label}</span>
          </label>
        ))}
        <button type="button" className="primary" onClick={() => setResult(judgeProcess(processId, values))}>
          실행
        </button>
      </article>

      {result && (
        <article className="card">
          {result.items.map((item) => (
            <div key={item.variable.id} className={`result-line grade-${item.grade}`}>
              <strong>
                <Term value={item.variable.name} />: {GRADE_LABEL[item.grade]}
              </strong>
              {item.choice.defect && (
                <span>
                  {' '}
                  · <Term value={item.choice.defect} />
                </span>
              )}
              <p>{item.choice.reason}</p>
              {item.choice.effect && <p className="effect">완성 패키지에서: {item.choice.effect}</p>}
            </div>
          ))}
          <p className="muted">교육용 가설 규칙 · 검수 전</p>
        </article>
      )}
    </section>
  )
}
