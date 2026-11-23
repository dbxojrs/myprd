import { useId } from 'react'
import { setAllOpen, useOpen } from '../../lib/uiOpen.js'

// 제목 줄을 누르면 접히고 펼쳐지는 상자. 열림 상태는 id별로 이 브라우저에 기억합니다.
export default function Collapsible({ id, title, defaultOpen = true, badge, children, className = '' }) {
  const [open, setOpen] = useOpen(id, defaultOpen)
  const bodyId = useId()
  return (
    <section className={`collapsible${open ? ' open' : ''} ${className}`}>
      <button type="button" className="collapsible-head" aria-expanded={open} aria-controls={bodyId} onClick={() => setOpen((o) => !o)}>
        <span className="collapsible-arrow" aria-hidden="true">
          ▸
        </span>
        <span className="collapsible-title">{title}</span>
        {badge && <span className="collapsible-badge">{badge}</span>}
      </button>
      <div className="collapsible-wrap" id={bodyId} inert={!open}>
        <div className="collapsible-body">{children}</div>
      </div>
    </section>
  )
}

export function ExpandAll({ ids, label = '' }) {
  return (
    <div className="expand-all" role="group" aria-label={`${label} 섹션 펼치기·접기`}>
      <button type="button" className="link" onClick={() => setAllOpen(ids, true)}>
        ▾ 모두 펼치기
      </button>
      <button type="button" className="link" onClick={() => setAllOpen(ids, false)}>
        ▸ 모두 접기
      </button>
    </div>
  )
}
