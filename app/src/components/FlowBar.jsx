import { findProcess, frontFlow, STAGES } from '../data/processes.js'
import { ProcessIllustration } from './Illustrations.jsx'
import { Term, useTerms } from '../lib/terms.jsx'

// 모든 화면 맨 위에 고정되는 공정 흐름 막대. 현재 공정을 강조하고 학습 완료를 표시합니다.
// mode가 front이면 패키지와 관계없이 전공정 흐름을, 아니면 선택한 패키지의 후공정 흐름을 보여줍니다.
export default function FlowBar({ pkg, activeId, mode, completed, onOpenProcess, onChoosePackage }) {
  const { t, tip } = useTerms()

  const title = mode === 'front' ? STAGES.front.name : pkg?.name

  if (mode !== 'front' && !pkg?.flow) {
    return (
      <div className="flowbar flowbar-empty">
        <span>패키지를 고르면 전체 공정 흐름이 여기에 표시됩니다.</span>
        <button type="button" onClick={onChoosePackage}>패키지 고르기</button>
      </div>
    )
  }

  const flow = mode === 'front' ? frontFlow : pkg.flow
  const activeIndex = flow.indexOf(activeId)
  const active = findProcess(activeId)

  return (
    <nav className="flowbar" aria-label={`${t(title)} 공정 흐름`}>
      <div className="flowbar-status">
        <strong>
          <Term value={title} />
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
          const isActive = id === activeId
          const isDone = completed.includes(id)
          const isPassed = activeIndex >= 0 && i < activeIndex
          return (
            <li key={id} className="flowbar-item">
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
