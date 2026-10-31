import { findProcess } from '../data/processes.js'
import { fullFlow } from '../data/packages.js'
import { ProcessIllustration } from './Illustrations.jsx'
import { Term, useTerms } from '../lib/terms.jsx'

// 모든 화면 맨 위에 고정되는 공정 흐름 막대. 현재 공정을 강조하고 학습 완료를 표시합니다.
// 학습 중에는 전공정부터, 라인 실습 중에는 후공정만 보여줍니다.
export default function FlowBar({ pkg, activeId, mode, completed, onOpenProcess, onChoosePackage }) {
  const { t, tip } = useTerms()

  if (!pkg?.flow) {
    return (
      <div className="flowbar flowbar-empty">
        <span>패키지를 고르면 전체 공정 흐름이 여기에 표시됩니다.</span>
        <button type="button" onClick={onChoosePackage}>패키지 고르기</button>
      </div>
    )
  }

  const flow = mode === 'line' ? pkg.flow : fullFlow(pkg)
  const activeIndex = flow.indexOf(activeId)
  const active = findProcess(activeId)

  return (
    <nav className="flowbar" aria-label={`${t(pkg.name)} 공정 흐름`}>
      <div className="flowbar-status">
        <strong>
          <Term value={pkg.name} />
        </strong>
        <span>
          {active && activeIndex >= 0
            ? `${mode === 'line' ? '라인 실습' : '학습 중'} · ${activeIndex + 1}/${flow.length} ${t(active.name)}`
            : '공정을 누르면 설명으로 이동합니다'}
        </span>
      </div>
      <ol className="flowbar-steps">
        {flow.map((id, i) => {
          const process = findProcess(id)
          const startsBack = i > 0 && process.stage !== findProcess(flow[i - 1]).stage
          const isActive = id === activeId
          const isDone = completed.includes(id)
          const isPassed = activeIndex >= 0 && i < activeIndex
          return (
            <li key={id} className="flowbar-item">
              {startsBack && <span className="flowbar-stage">후공정</span>}
              {i === 0 && mode !== 'line' && <span className="flowbar-stage">전공정</span>}
              <button
                type="button"
                className={`flowbar-step${isActive ? ' active' : ''}${isPassed ? ' passed' : ''}`}
                aria-current={isActive ? 'step' : undefined}
                title={tip(process.name, true) ?? t(process.name)}
                onClick={() => onOpenProcess(id)}
              >
                <ProcessIllustration id={id} compact />
                <span className="flowbar-name">
                  {isDone && <span aria-label="학습 완료">✓ </span>}
                  {t(process.name, true)}
                </span>
              </button>
              {i < flow.length - 1 && (
                <span className={`flowbar-link${isPassed || isActive ? ' passed' : ''}`} aria-hidden="true">
                  →
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
