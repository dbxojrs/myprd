import { wholeFlow } from '../data/packages.js'
import { findProcess, STAGE_ORDER, STAGES } from '../data/processes.js'
import { Term } from '../lib/terms.jsx'

// 전체 순서(전공정 → 연결 → 중간공정 → 후공정)에서 지금 공정의 위치와 앞뒤 공정.
// 위쪽에는 경로(Breadcrumb), 아래쪽에는 이전·다음 버튼을 둡니다.

export function ProcessBreadcrumb({ process, pkg, onOpenMap }) {
  const order = wholeFlow(pkg)
  const index = order.indexOf(process.id)
  return (
    <p className="crumbs">
      <button type="button" className="crumb-link" onClick={onOpenMap}>
        전체 지도
      </button>
      <span aria-hidden="true">›</span>
      <span>
        <Term value={STAGES[process.stage].name} compact />
      </span>
      <span aria-hidden="true">›</span>
      <span>
        {index >= 0 && `${index + 1}. `}
        <Term value={process.name} compact />
      </span>
    </p>
  )
}

export default function ProcessSequence({ process, pkg, completed, onOpen, onComplete }) {
  // 사이사이 반복 공정은 전체 순서에 없으므로, 붙어 있는 8대 공정으로 돌아가는 버튼만 둡니다.
  if (process.repeatsAfter) {
    return (
      <nav className="seq" aria-label="공정 순서">
        <p className="seq-title">↻ 이 공정이 반복되는 자리로 돌아가기</p>
        <div className="seq-buttons">
          {process.repeatsAfter.map((id) => (
            <button key={id} type="button" onClick={() => onOpen(id)}>
              ← <Term value={findProcess(id).name} compact />
            </button>
          ))}
        </div>
      </nav>
    )
  }

  const order = wholeFlow(pkg)
  const index = order.indexOf(process.id)
  if (index < 0) return null

  const prev = findProcess(order[index - 1])
  const next = findProcess(order[index + 1])
  const isDone = completed.includes(process.id)
  const crossing = next && next.stage !== process.stage
  const stage = STAGES[process.stage]
  const nextStage = next && STAGES[next.stage]

  const goNext = () => {
    if (!isDone) onComplete(process.id)
    onOpen(next.id)
  }

  return (
    <nav className="seq" aria-label="공정 순서">
      <p className="seq-title">
        전체 순서 {index + 1} / {order.length} · <Term value={stage.name} compact />
      </p>
      <ol className="seq-bar" aria-hidden="true">
        {STAGE_ORDER.map((key) => {
          const ids = order.filter((id) => findProcess(id).stage === key)
          return (
            <li key={key} style={{ flexGrow: ids.length }} className={key === process.stage ? 'here' : ''}>
              {ids.map((id) => (
                <span key={id} className={id === process.id ? 'now' : completed.includes(id) ? 'done' : ''} />
              ))}
            </li>
          )
        })}
      </ol>

      {crossing && (
        <p className="seq-cross">
          여기까지가 <Term value={stage.name} compact />입니다. 결과: {stage.result}. 다음은{' '}
          <strong>
            <Term value={nextStage.name} compact />
          </strong>
          {nextStage.optional ? '(일부 패키지만 거침)' : ''}입니다.
        </p>
      )}

      <div className="seq-buttons">
        {prev ? (
          <button type="button" onClick={() => onOpen(prev.id)}>
            ← <Term value={prev.name} compact />
          </button>
        ) : (
          <span />
        )}
        {next ? (
          <button type="button" className="primary" onClick={goNext}>
            {isDone ? '다음' : '학습 완료하고 다음'}
            {crossing && (
              <>
                {' '}
                · <Term value={nextStage.name} compact /> 시작
              </>
            )}
            : <Term value={next.name} compact /> →
          </button>
        ) : (
          <span className="seq-end">🎉 마지막 공정입니다. 라인 실습으로 전체를 이어서 진행해 보세요.</span>
        )}
      </div>
    </nav>
  )
}
