import { useEffect, useState } from 'react'
import { lineOptions, GRADE_LABEL, PACKAGE_PARTS } from '../data/lineSim.js'
import { findProcess } from '../data/processes.js'
import { judgeLine } from '../lib/judge.js'
import PackageCrossSection from './PackageCrossSection.jsx'
import { ProcessIllustration } from './Illustrations.jsx'
import { Term, useTerms } from '../lib/terms.jsx'

const VERDICT = {
  good: { symbol: '✓', label: '정상', summary: '모든 공정에서 권장 조건을 골랐습니다. 이론상 패키지가 테스트를 통과하고 제대로 기능합니다.' },
  warn: { symbol: '!', label: '신뢰성 위험', summary: '테스트는 통과하지만, 출하 후 사용하면서 문제가 나타날 수 있습니다.' },
  bad: { symbol: '✗', label: '불량', summary: '완성된 패키지가 테스트에서 걸려 출하할 수 없습니다.' },
}

const RANK = { good: 0, warn: 1, bad: 2 }
const worse = (a, b) => (RANK[b] > RANK[a] ? b : a)

function ruleCauseLabel(rule, t) {
  const variable = lineOptions[rule.when.process].find((v) => v.id === rule.when.variable)
  return `${t(findProcess(rule.when.process).name)} "${variable.choices[rule.when.choice].label}"`
}

function itemEffect(item) {
  return item.rule ? item.rule.effect : item.choice.effect
}

// 선택지 하나의 진단(등급, 불량, 이유, 연결)을 보여줍니다.
function Diagnosis({ item }) {
  const { t } = useTerms()
  return (
    <div className={`result-line grade-${item.grade}`}>
      <strong>
        {t(item.variable.name)}: {item.index + 1}. {item.choice.label}
      </strong>{' '}
      <span className={`grade grade-${item.grade}`}>{GRADE_LABEL[item.grade]}</span>
      {item.grade !== 'good' && (
        <>
          {item.choice.defect && <p>문제: {t(item.choice.defect)}</p>}
          <p>이유: {item.rule ? item.rule.reason : item.choice.reason}</p>
          {item.rule && (
            <p>
              연결: {ruleCauseLabel(item.rule, t)} 때문에 {GRADE_LABEL[item.baseGrade]} → {GRADE_LABEL[item.grade]}
            </p>
          )}
        </>
      )}
      {item.grade === 'good' && <p>{item.choice.reason}</p>}
    </div>
  )
}

export default function LineSim({ pkg, onLearn, onChangePackage, onActiveChange }) {
  const { t } = useTerms()
  const steps = pkg?.flow?.filter((id) => lineOptions[id]) ?? []
  const [step, setStep] = useState(0)
  const [selections, setSelections] = useState({})
  const [finished, setFinished] = useState(false)
  const [instant, setInstant] = useState(false)

  // 상단 흐름 막대에 현재 진행 중인 공정을 알려줍니다. 판정 단계는 테스트 공정으로 표시합니다.
  const activeStepId = finished ? 'test' : steps[step]
  useEffect(() => {
    onActiveChange?.(activeStepId ?? null)
  }, [activeStepId, onActiveChange])

  if (steps.length === 0) {
    return (
      <section className="screen">
        <p className="placeholder">라인 실습이 준비된 패키지(QFN)를 먼저 고르세요.</p>
        <button type="button" onClick={onChangePackage}>패키지 고르기</button>
      </section>
    )
  }

  const reset = () => {
    setSelections({})
    setStep(0)
    setFinished(false)
  }

  const goTo = (index) => {
    setStep(index)
    setFinished(false)
  }

  if (finished) {
    const result = judgeLine(steps, selections)
    const verdict = VERDICT[result.verdict]

    const partGrades = {}
    for (const item of result.items) {
      const part = PACKAGE_PARTS[item.processId]
      partGrades[part] = worse(partGrades[part] ?? 'good', item.grade)
    }
    const testFails = result.items.filter((item) => item.grade === 'bad')
    const fieldRisks = result.items.filter((item) => item.grade === 'warn')

    return (
      <section className="screen">
        <article className={`card verdict verdict-${result.verdict}`}>
          <h2>
            최종 판정: {verdict.symbol} {verdict.label}
          </h2>
          <p>{verdict.summary}</p>
        </article>

        <article className="card">
          <h3>완성된 패키지는 이렇게 됩니다</h3>
          <PackageCrossSection partGrades={partGrades} />
          {testFails.length === 0 && fieldRisks.length === 0 && (
            <p>테스트를 통과하고, 이론상 사용 중에도 정상 동작합니다.</p>
          )}
          {testFails.length > 0 && (
            <>
              <h4>✗ 테스트에서 걸리는 문제</h4>
              <ul>
                {testFails.map((item) => (
                  <li key={`${item.processId}-${item.variable.id}`}>
                    <strong>
                      <Term value={findProcess(item.processId).name} />
                    </strong>{' '}
                    · {itemEffect(item)}
                  </li>
                ))}
              </ul>
            </>
          )}
          {fieldRisks.length > 0 && (
            <>
              <h4>! 출하 후 나타날 수 있는 문제</h4>
              <ul>
                {fieldRisks.map((item) => (
                  <li key={`${item.processId}-${item.variable.id}`}>
                    <strong>
                      <Term value={findProcess(item.processId).name} />
                    </strong>{' '}
                    · {itemEffect(item)}
                  </li>
                ))}
              </ul>
            </>
          )}
        </article>

        <article className="card">
          <h3>공정별 진단</h3>
          <ol className="timeline">
            {steps.map((processId, index) => {
              const items = result.items.filter((item) => item.processId === processId)
              const grade = items.reduce((acc, item) => worse(acc, item.grade), 'good')
              return (
                <li key={processId} className={`timeline-step grade-${grade}`}>
                  <div className="timeline-head">
                    <strong>
                      {index + 1}. <Term value={findProcess(processId).name} />
                    </strong>
                    <span className={`grade grade-${grade}`}>{GRADE_LABEL[grade]}</span>
                  </div>
                  {items.map((item) => (
                    <Diagnosis key={item.variable.id} item={item} />
                  ))}
                  {grade !== 'good' && (
                    <div className="button-row">
                      <button type="button" onClick={() => goTo(index)}>선택 바꾸기</button>
                      <button type="button" onClick={() => onLearn(processId)}>이 공정 다시 학습</button>
                    </div>
                  )}
                </li>
              )
            })}
            <li className={`timeline-step grade-${result.verdict}`}>
              <div className="timeline-head">
                <strong>{steps.length + 1}. 테스트</strong>
                <span className={`grade grade-${result.verdict}`}>
                  {result.verdict === 'bad' ? '불합격' : '합격'}
                </span>
              </div>
            </li>
          </ol>
          <p className="muted">교육용 가설 규칙 · 검수 전 · 출처 미등록</p>
        </article>

        <div className="screen-foot">
          <button type="button" onClick={() => goTo(steps.length - 1)}>이전 공정</button>
          <button type="button" className="primary" onClick={reset}>처음부터 다시</button>
        </div>
      </section>
    )
  }

  const processId = steps[step]
  const variables = lineOptions[processId]
  const current = selections[processId] ?? {}
  const complete = variables.every((variable) => current[variable.id] !== undefined)
  const stepItems = instant && complete
    ? judgeLine(steps.slice(0, step + 1), selections).items.filter((item) => item.processId === processId)
    : []

  const choose = (variableId, index) => {
    setSelections({ ...selections, [processId]: { ...current, [variableId]: index } })
  }

  const previous = steps
    .slice(0, step)
    .map((id) => {
      const picks = lineOptions[id].map((v) => selections[id]?.[v.id] + 1).join('·')
      return `${t(findProcess(id).name, true)} ${picks}`
    })
    .join(' · ')

  return (
    <section className="screen">
      <div className="screen-head">
        <h2>
          <Term value={pkg.name} /> 라인 실습
        </h2>
        <span className="progress-label">
          {step + 1}/{steps.length}
        </span>
      </div>
      <div className="progress" aria-hidden="true">
        {steps.map((id, i) => (
          <span key={id} className={i <= step ? 'progress-cell filled' : 'progress-cell'} />
        ))}
      </div>

      <label className="toggle">
        <input type="checkbox" checked={instant} onChange={(event) => setInstant(event.target.checked)} />
        공정마다 결과 바로 보기 (끄면 마지막에 한 번에 확인)
      </label>

      <article className="card">
        <h3>
          공정 {step + 1} · <Term value={findProcess(processId).name} />
        </h3>
        <ProcessIllustration id={processId} />
        {variables.map((variable) => (
          <fieldset key={variable.id} className="choices">
            <legend>
              <Term value={variable.name} />
            </legend>
            {variable.choices.map((choice, index) => (
              <label key={choice.label} className="choice">
                <input
                  type="radio"
                  name={`${processId}-${variable.id}`}
                  checked={current[variable.id] === index}
                  onChange={() => choose(variable.id, index)}
                />
                {index + 1}. {choice.label}
              </label>
            ))}
          </fieldset>
        ))}
        {previous && <p className="muted">이전 선택: {previous}</p>}
        {!complete && <p className="notice">선택지를 하나 고르세요.</p>}
        {stepItems.length > 0 && (
          <div className="step-result">
            <h4>이 공정 결과</h4>
            {stepItems.map((item) => (
              <div key={item.variable.id}>
                <Diagnosis item={item} />
                {itemEffect(item) && <p className="effect">완성 패키지에서: {itemEffect(item)}</p>}
              </div>
            ))}
          </div>
        )}
      </article>

      <div className="screen-foot">
        <button type="button" disabled={step === 0} onClick={() => setStep(step - 1)}>
          이전 공정
        </button>
        <button
          type="button"
          className="primary"
          disabled={!complete}
          onClick={() => (step === steps.length - 1 ? setFinished(true) : setStep(step + 1))}
        >
          {step === steps.length - 1 ? '테스트 · 최종 판정' : '다음 공정'}
        </button>
      </div>
    </section>
  )
}
