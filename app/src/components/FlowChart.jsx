import { findProcess, frontFlow } from '../data/processes.js'
import { fullFlow } from '../data/packages.js'
import { ProcessIllustration } from './Illustrations.jsx'
import { Term } from '../lib/terms.jsx'

export default function FlowChart({ pkg, completed, currentId, onOpenProcess, onChangePackage, onStartLine }) {
  if (!pkg?.flow) {
    return (
      <section className="screen">
        <p className="placeholder">공정 흐름이 준비된 패키지를 먼저 고르세요.</p>
        <button type="button" onClick={onChangePackage}>패키지 고르기</button>
      </section>
    )
  }

  const flow = fullFlow(pkg)
  const done = flow.filter((id) => completed.includes(id)).length
  const stages = [
    { title: '전공정', note: '웨이퍼 위에 회로를 만듭니다. 모든 패키지가 같습니다.', ids: frontFlow },
    { title: '후공정', note: '완성된 웨이퍼를 패키지로 만듭니다.', ids: pkg.flow },
  ]

  return (
    <section className="screen">
      <div className="screen-head">
        <h2>
          <Term value={pkg.name} /> 공정 흐름
        </h2>
        <button type="button" onClick={onChangePackage}>패키지 바꾸기</button>
      </div>
      {stages.map((stage) => (
        <div key={stage.title} className="flow-stage">
          <h3>
            {stage.title} <span className="muted">· {stage.note}</span>
          </h3>
          <ol className="flow">
            {stage.ids.map((id) => {
              const process = findProcess(id)
              const isDone = completed.includes(id)
              const isCurrent = id === currentId
              return (
                <li key={id}>
                  <button
                    type="button"
                    className={`flow-step${isDone ? ' done' : ''}${isCurrent ? ' current' : ''}`}
                    onClick={() => onOpenProcess(id)}
                  >
                    <span className="flow-index">{flow.indexOf(id) + 1}</span>
                    <span className="flow-name">
                      <ProcessIllustration id={id} compact />
                      <Term value={process.name} />
                    </span>
                    <span className="flow-state">{isCurrent ? '● 현재' : isDone ? '✓ 완료' : '미학습'}</span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      ))}
      <div className="screen-foot">
        <span>학습 {done}/{flow.length}</span>
        <button type="button" className="primary" onClick={onStartLine}>라인 실습 시작</button>
      </div>
    </section>
  )
}
