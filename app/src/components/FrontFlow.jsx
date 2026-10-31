import { frontFlow, STAGES } from '../data/processes.js'
import { FlowList } from './FlowChart.jsx'
import { Term } from '../lib/terms.jsx'

// 전공정 화면. 모든 패키지가 같으므로 패키지를 고르지 않아도 볼 수 있습니다.
export default function FrontFlow({ completed, currentId, onOpenProcess }) {
  const done = frontFlow.filter((id) => completed.includes(id)).length

  return (
    <section className="screen">
      <h2>
        <Term value={STAGES.front.name} /> 흐름
      </h2>
      <p className="muted">{STAGES.front.note}</p>
      <FlowList ids={frontFlow} completed={completed} currentId={currentId} onOpenProcess={onOpenProcess} />
      <div className="screen-foot">
        <span>학습 {done}/{frontFlow.length}</span>
      </div>
    </section>
  )
}
