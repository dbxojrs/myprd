import { createContext, useContext } from 'react'
import { useStoredState } from './storage.js'

// 용어 표시 방식. 데이터의 용어는 { en, ko } 쌍이고, 일반 문자열은 그대로 보여줍니다.
// koEn: 한글 (영어) — 기본값, 비전공자도 읽기 쉽게 / en: 영어만 / ko: 한글만
// (예전 기본값 both "영어 (한글)"는 koEn으로 바꿔 보여 줍니다.)
export const TERM_MODES = [
  { id: 'koEn', label: '한글(English)' },
  { id: 'en', label: 'English' },
  { id: 'ko', label: '한글' },
]

const TermContext = createContext({ mode: 'koEn', setMode: () => {} })

export function TermProvider({ children }) {
  const [stored, setMode] = useStoredState('tutor.termMode', 'koEn')
  const mode = TERM_MODES.some((m) => m.id === stored) ? stored : 'koEn'
  return <TermContext.Provider value={{ mode, setMode }}>{children}</TermContext.Provider>
}

// compact: 흐름 막대·버튼처럼 좁은 자리. "한글(English)" 모드에서도 한글만 쓰고 영어는 툴팁으로 보여줍니다.
export function formatTerm(term, mode, compact = false) {
  if (!term || typeof term === 'string') return term ?? ''
  const { en, ko } = term
  if (mode === 'en') return en
  if (mode === 'ko' || compact || en === ko) return ko
  return `${ko} (${dropShared(en, ko)})`
}

// 한글 이름에 이미 있는 괄호 속 약어는 영어 쪽에서 뺍니다. 예: 프론트엔드 설계(RTL) (Front-End Design)
function dropShared(en, ko) {
  const out = en.replace(/\s*\(([^()]+)\)/g, (all, inner) => (ko.includes(inner) ? '' : all)).trim()
  return out || en
}

function tooltip(term, mode, compact) {
  if (!term || typeof term === 'string' || term.en === term.ko) return undefined
  if (mode === 'en') return term.ko
  if (mode === 'ko' || compact) return term.en
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
