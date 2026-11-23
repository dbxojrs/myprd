import { useEffect, useState } from 'react'
import { appendToCurrentNote, quote } from '../../lib/notes.js'
import { useIsMobile } from '../../lib/floatState.js'

// 본문(main)에서 글을 드래그해 고르면 [📝 노트에 추가] 버튼을 띄웁니다.
// 데스크톱은 선택한 글 바로 위, 모바일은 화면 아래에 고정해서 보여줍니다.
export default function SelectionToNote({ currentRef }) {
  const mobile = useIsMobile()
  const [sel, setSel] = useState(null) // { text, x, y }

  useEffect(() => {
    let timer
    const check = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        const s = window.getSelection()
        const text = s?.toString().trim() ?? ''
        const main = document.querySelector('.app main')
        if (!text || text.length < 2 || !s.rangeCount || !main?.contains(s.anchorNode)) return setSel(null)
        // 입력칸 안 선택은 제외
        const el = s.anchorNode.nodeType === 1 ? s.anchorNode : s.anchorNode.parentElement
        if (el?.closest('input, textarea')) return setSel(null)
        const rect = s.getRangeAt(0).getBoundingClientRect()
        setSel({ text, x: rect.left + rect.width / 2, y: rect.top })
      }, 180)
    }
    document.addEventListener('selectionchange', check)
    window.addEventListener('scroll', check, true)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('selectionchange', check)
      window.removeEventListener('scroll', check, true)
    }
  }, [])

  if (!sel) return null
  const style = mobile
    ? undefined
    : { left: Math.min(Math.max(sel.x, 80), window.innerWidth - 80), top: Math.max(sel.y - 48, 8) }
  return (
    <button
      type="button"
      className={`select-to-note${mobile ? ' bottom' : ''}`}
      style={style}
      // 누르는 순간 선택이 풀리지 않게
      onPointerDown={(e) => e.preventDefault()}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => {
        appendToCurrentNote(quote(sel.text.slice(0, 2000)), currentRef ?? null, currentRef?.label ? `${currentRef.label} 정리` : '')
        window.getSelection()?.removeAllRanges()
        setSel(null)
      }}
    >
      📝 노트에 추가
    </button>
  )
}
