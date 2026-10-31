import { findProcess, STAGES } from '../data/processes.js'
import { ProcessIllustration } from './Illustrations.jsx'
import { Term } from '../lib/terms.jsx'

// 공정 목록. 후공정 흐름도와 전공정 화면이 함께 씁니다.
export function FlowList({ ids, completed, currentId, onOpenProcess }) {
  return (
    <ol className="flow">
      {ids.map((id, i) => {
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
              <span className="flow-index">{i + 1}</span>
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
  )
}

export default function FlowChart({ pkg, completed, currentId, onOpenProcess, onChangePackage, onStartLine }) {
  if (!pkg?.flow) {
    return (
      <section className="screen">
        <p className="placeholder">공정 흐름이 준비된 패키지를 먼저 고르세요.</p>
        <button type="button" onClick={onChangePackage}>패키지 고르기</button>
      </section>
    )
  }

  const done = pkg.flow.filter((id) => completed.includes(id)).length

  return (
    <section className="screen">
      <div className="screen-head">
        <h2>
          <Term value={pkg.name} /> <Term value={STAGES.back.name} /> 흐름
        </h2>
        <button type="button" onClick={onChangePackage}>패키지 바꾸기</button>
      </div>
      <p className="muted">{STAGES.back.note}</p>
      <FlowList ids={pkg.flow} completed={completed} currentId={currentId} onOpenProcess={onOpenProcess} />
      <div className="screen-foot">
        <span>학습 {done}/{pkg.flow.length}</span>
        <button type="button" className="primary" onClick={onStartLine}>라인 실습 시작</button>
      </div>
    </section>
  )
}
