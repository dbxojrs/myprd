import { createContext, useContext } from 'react'
import { useStoredState } from './storage.js'

// 용어 표시 방식. 데이터의 용어는 { en, ko } 쌍이고, 일반 문자열은 그대로 보여줍니다.
// en: 영어만 / both: 영어 (한글) / ko: 한글만
export const TERM_MODES = [
  { id: 'en', label: 'English' },
  { id: 'both', label: 'English(한글)' },
  { id: 'ko', label: '한글' },
]

const TermContext = createContext({ mode: 'both', setMode: () => {} })

export function TermProvider({ children }) {
  const [mode, setMode] = useStoredState('tutor.termMode', 'both')
  return <TermContext.Provider value={{ mode, setMode }}>{children}</TermContext.Provider>
}

// compact: 흐름 막대·버튼처럼 좁은 자리. "영어(한글)" 모드에서도 영어만 쓰고 한글은 툴팁으로 보여줍니다.
export function formatTerm(term, mode, compact = false) {
  if (!term || typeof term === 'string') return term ?? ''
  const { en, ko } = term
  if (mode === 'ko') return ko
  if (mode === 'en' || compact || en === ko) return en
  return `${en} (${ko})`
}

function tooltip(term, mode, compact) {
  if (!term || typeof term === 'string' || term.en === term.ko) return undefined
  if (mode === 'ko') return term.en
  if (mode === 'en' || compact) return term.ko
  return undefined
}

export function useTerms() {
  const { mode, setMode } = useContext(TermContext)
  const t = (term, compact = false) => formatTerm(term, mode, compact)
  const list = (terms, compact = false) => terms.map((term) => t(term, compact)).join(', ')
  return { mode, setMode, t, list, tip: (term, compact = false) => tooltip(term, mode, compact) }
}

export function Term({ value, compact = false }) {
  const { mode } = useContext(TermContext)
  return <span title={tooltip(value, mode, compact)}>{formatTerm(value, mode, compact)}</span>
}

export function TermModeSwitch() {
  const { mode, setMode } = useContext(TermContext)
  return (
    <div className="term-switch" role="radiogroup" aria-label="용어 표시">
      <span className="muted">용어</span>
      {TERM_MODES.map((option) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={mode === option.id}
          className={mode === option.id ? 'term-option active' : 'term-option'}
          onClick={() => setMode(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
