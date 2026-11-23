import { FIELD_CASES } from '../../data/fieldCases/index.js'
import { grade, recommendCase, useField } from '../../lib/fieldSim.js'
import { writeStored } from '../../lib/storage.js'

// 오늘의 현장 실무 훈련 카드(홈·오늘의 학습에서 씀)
export default function FieldTodayCard({ completed, onGo }) {
  const field = useField()
  const c = recommendCase(FIELD_CASES, field, completed)
  if (!c) return null
  const st = field[c.id]
  const doing = st?.run && !st.run.done
  return (
    <article className={`card field-today cat-${c.category.toLowerCase()}`}>
      <p className="home-eyebrow">🛠️ 오늘의 현장 실무 훈련</p>
      <div className="field-card-top">
        <span className={`cat ${c.category.toLowerCase()}`}>{c.category}</span>
        <span className="field-proc">{c.processLabel}</span>
        <code>{c.id}</code>
      </div>
      <h3>{c.title}</h3>
      <p className="muted">
        {c.difficulty} · 약 {c.minutes}분{st?.best != null && ` · 최고 ${st.best}점 (${grade(st.best).label})`}
      </p>
      <button
        type="button"
        className="primary"
        onClick={() => {
          writeStored('tutor.field.open', c.id)
          onGo(c.category === 'FAB' ? 'field-fab' : 'field-pkg')
        }}
      >
        {doing ? '이어서 하기 →' : st?.best != null ? '다시 도전 →' : '시작하기 →'}
      </button>
    </article>
  )
}
