import { useState } from 'react'

// 설명 아래에 "비유로 쉽게 보기" 버튼을 두고, 누르면 비유 설명을 펼칩니다.
export default function AnalogyButton({ text }) {
  const [open, setOpen] = useState(false)
  if (!text) return null

  return (
    <div className="analogy">
      <button type="button" className="analogy-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        💡 {open ? '비유 닫기' : '비유로 쉽게 보기'}
      </button>
      {open && (
        <div className="analogy-body">
          <p>{text}</p>
          <p className="muted">비유는 이해를 돕기 위한 단순화입니다. 실제 공정과 다른 점이 있습니다.</p>
        </div>
      )}
    </div>
  )
}
