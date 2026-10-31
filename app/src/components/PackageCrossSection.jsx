import { PART_LABEL } from '../data/lineSim.js'
import { useTerms } from '../lib/terms.jsx'

const LABELS = {
  die: { en: 'Die', ko: '다이' },
  pad: { en: 'Pad', ko: '패드' },
  lead: { en: 'Lead', ko: '리드' },
  mold: { en: 'Mold', ko: '몰딩' },
}

const SYMBOL = { good: '', warn: '!', bad: '✗' }

// QFN 단면 그림. partGrades: { die, attach, wire, mold, mark, lead } → 'good' | 'warn' | 'bad'
export default function PackageCrossSection({ partGrades }) {
  const { t } = useTerms()
  const g = (part) => partGrades[part] ?? 'good'
  const tag = (part, x, y) =>
    g(part) !== 'good' && (
      <text x={x} y={y} className={`xs-tag xs-tag-${g(part)}`} textAnchor="middle">
        {SYMBOL[g(part)]} {t(PART_LABEL[part], true)}
      </text>
    )

  return (
    <figure className="xs">
      <svg viewBox="0 0 360 190" role="img" aria-label="완성된 QFN 패키지 단면 그림">
        <rect x="30" y="40" width="300" height="110" rx="6" className={`xs-mold xs-${g('mold')}`} />
        <rect x="120" y="44" width="120" height="8" rx="2" className={`xs-mark xs-${g('mark')}`} />
        <rect x="130" y="118" width="100" height="22" className="xs-pad" />
        <rect x="130" y="110" width="100" height="8" className={`xs-attach xs-${g('attach')}`} />
        <rect x="140" y="82" width="80" height="28" rx="2" className={`xs-die xs-${g('die')}`} />
        <path d="M150 82 Q105 55 70 128" className={`xs-wire xs-${g('wire')}`} />
        <path d="M210 82 Q255 55 290 128" className={`xs-wire xs-${g('wire')}`} />
        <rect x="30" y="128" width="60" height="22" className={`xs-lead xs-${g('lead')}`} />
        <rect x="270" y="128" width="60" height="22" className={`xs-lead xs-${g('lead')}`} />

        <text x="180" y="100" textAnchor="middle" className="xs-label">{t(LABELS.die, true)}</text>
        <text x="180" y="134" textAnchor="middle" className="xs-label">{t(LABELS.pad, true)}</text>
        <text x="60" y="144" textAnchor="middle" className="xs-label">{t(LABELS.lead, true)}</text>
        <text x="300" y="144" textAnchor="middle" className="xs-label">{t(LABELS.lead, true)}</text>
        <text x="300" y="66" textAnchor="middle" className="xs-label">{t(LABELS.mold, true)}</text>

        {tag('mark', 180, 30)}
        {tag('wire', 95, 74)}
        {tag('die', 180, 168)}
        {tag('attach', 180, 182)}
        {tag('mold', 300, 30)}
        {tag('lead', 60, 168)}
      </svg>
      <figcaption className="muted">
        회색: 문제 없음 · 노란색(!): 신뢰성 위험 · 빨간색(✗): 불량 부위
      </figcaption>
    </figure>
  )
}
