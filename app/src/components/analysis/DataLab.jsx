import { useMemo, useState } from 'react'
import { CAPABILITY_ASK, CAPABILITY_SETS, PARETO_SETS, SPC_SETS } from '../../data/analysisSets.js'
import { WECO_RULES, capability, firstSignal, fmt, individualsLimits, pareto, parseNumbers, wecoFlags } from '../../lib/spc.js'
import { Cites } from '../movie/ProcessMovie.jsx'

// 공정 데이터 분석 실습: 관리도(SPC) · 공정능력(Cp/Cpk) · Pareto.
// 계산은 lib/spc.js 공식(NIST 핸드북)으로만 하고, 실습 데이터는 data/analysisSets.js의 교육용 가상 데이터입니다.

const TABS = [
  { id: 'spc', label: '관리도 (SPC)' },
  { id: 'cap', label: '공정능력 (Cp·Cpk)' },
  { id: 'pareto', label: 'Pareto 분석' },
]

export default function DataLab({ onOpenField }) {
  const [tab, setTab] = useState(() => {
    try {
      return sessionStorage.getItem('tutor-datalab-tab') ?? 'spc'
    } catch {
      return 'spc'
    }
  })
  const pick = (id) => {
    setTab(id)
    try {
      sessionStorage.setItem('tutor-datalab-tab', id)
    } catch {
      // 저장 실패는 무시
    }
  }
  return (
    <section className="screen datalab">
      <h2>공정 데이터 분석</h2>
      <p className="muted">
        현장에서 이상을 "언제부터·얼마나" 판단하는 기본 도구를 직접 계산해 봅니다. 실습 데이터는 <span className="scenario-tag">교육용 가상 데이터</span>이고, 내 숫자를 붙여 넣어 계산할 수도 있습니다.
      </p>
      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={`tab${tab === t.id ? ' tab-active' : ''}`} onClick={() => pick(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'spc' && <SpcTab onOpenField={onOpenField} />}
      {tab === 'cap' && <CapTab onOpenField={onOpenField} />}
      {tab === 'pareto' && <ParetoTab onOpenField={onOpenField} />}
    </section>
  )
}

// 실습 데이터 고르기 + 직접 입력
function SetPicker({ sets, value, onChange }) {
  return (
    <div className="dl-sets" role="group" aria-label="데이터 고르기">
      {sets.map((s) => (
        <button key={s.id} type="button" className={`chip small${value === s.id ? ' active' : ''}`} onClick={() => onChange(s.id)}>
          <span className={`cat ${s.category === 'FAB' ? 'fab' : 'pkg'}`}>{s.category}</span> {s.title}
        </button>
      ))}
      <button type="button" className={`chip small${value === 'mine' ? ' active' : ''}`} onClick={() => onChange('mine')}>
        ✏️ 내 데이터 입력
      </button>
    </div>
  )
}

function CaseLink({ set, onOpenField }) {
  if (!set?.caseId || !onOpenField) return null
  return (
    <button type="button" className="link" onClick={() => onOpenField(set.caseId, set.category)}>
      관련 현장 시나리오 {set.caseId} 열기 →
    </button>
  )
}

// ── 관리도 ──
function SpcTab({ onOpenField }) {
  const [id, setId] = useState(SPC_SETS[0].id)
  const [text, setText] = useState('')
  const [base, setBase] = useState('')
  const [answer, setAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const set = SPC_SETS.find((s) => s.id === id)
  const values = set ? set.values : parseNumbers(text)
  const baseN = set ? set.base : Number(base) || values.length
  const enough = values.length >= 5
  const lim = useMemo(() => (enough ? individualsLimits(values, baseN) : null), [values, baseN, enough])
  const flags = useMemo(() => (lim ? wecoFlags(values, lim) : []), [values, lim])
  const first = firstSignal(flags)
  const change = (v) => {
    setId(v)
    setAnswer('')
    setChecked(false)
  }
  const right = Number(answer) === first + 1

  return (
    <div className="dl-body">
      <SetPicker sets={SPC_SETS} value={id} onChange={change} />
      {set ? (
        <p className="dl-story">
          <span className="scenario-tag">가상 데이터</span> {set.story} <CaseLink set={set} onOpenField={onOpenField} />
        </p>
      ) : (
        <div className="dl-input">
          <label>
            측정값 (순서대로, 쉼표·띄어쓰기·줄바꿈으로 구분)
            <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="예: 27.1 26.4 27.8 26.9 …" />
          </label>
          <label>
            한계선 계산에 쓸 앞쪽 점 수 (비우면 전체)
            <input type="number" min="2" value={base} onChange={(e) => setBase(e.target.value)} />
          </label>
        </div>
      )}

      {!enough ? (
        <p className="muted">값을 5개 이상 넣으면 관리도를 그립니다.</p>
      ) : (
        <>
          <div className="dl-stats">
            <Stat label="중심선 (x̄)" value={fmt(lim.center)} unit={set?.unit} />
            <Stat label="σ 추정 (MR̄/1.128)" value={fmt(lim.sigma, 3)} unit={set?.unit} />
            <Stat label="관리 상한 UCL" value={fmt(lim.ucl)} unit={set?.unit} />
            <Stat label="관리 하한 LCL" value={fmt(lim.lcl)} unit={set?.unit} />
          </div>
          <ControlChart values={values} lim={lim} flags={flags} unit={set?.unit ?? ''} />
          <ul className="dl-legend" aria-label="그래프 읽는 법">
            <li>
              <span className="dl-key line" /> 측정값
            </li>
            <li>
              <span className="dl-key dash" /> 중심선·관리 한계선(±3σ)
            </li>
            <li>
              <span className="dl-key zone" /> 한계선 계산에 쓴 구간 ({lim.base}점)
            </li>
            <li>
              <span className="dl-key flag">✕</span> 관리 이탈 신호
            </li>
          </ul>

          <div className="dl-rules card">
            <h4>관리 이탈 규칙 (WECO)</h4>
            <ul>
              {WECO_RULES.map((r) => {
                const hit = flags.findIndex((f) => f.includes(r.id))
                return (
                  <li key={r.id}>
                    {hit >= 0 ? <span className="status bad">{hit + 1}번째 점부터</span> : <span className="status ok">없음</span>} <strong>규칙 {r.id}</strong> {r.label} — <span className="muted">{r.desc}</span>
                  </li>
                )
              })}
            </ul>
            <p className="muted dl-cite">
              공식: 개별값 관리도 UCL/LCL = x̄ ± 3·MR̄/1.128 <Cites keys={['nist-individuals-chart']} /> · 규칙 <Cites keys={['nist-control-rules']} />
            </p>
          </div>

          {set?.ask && (
            <div className="dl-ask card">
              <h4>❓ {set.ask.prompt}</h4>
              <div className="dl-ask-row">
                <input type="number" min="1" value={answer} onChange={(e) => (setAnswer(e.target.value), setChecked(false))} aria-label="점 번호" />
                <span>번째</span>
                <button type="button" className="primary" disabled={!answer} onClick={() => setChecked(true)}>
                  확인
                </button>
              </div>
              {checked && (
                <p className={right ? 'dl-ok' : 'dl-no'}>
                  {right ? '✓ 맞습니다.' : `✕ 정답은 ${first + 1}번째입니다.`} 그 점에 걸린 규칙: {flags[first].map((n) => `규칙 ${n}`).join(', ')}. {set.lesson}
                </p>
              )}
            </div>
          )}
          <DataTable cols={['번호', `값${set?.unit ? ` (${set.unit})` : ''}`, '걸린 규칙']} rows={values.map((v, i) => [i + 1, v, flags[i].length ? flags[i].map((n) => `규칙 ${n}`).join(', ') : '—'])} />
        </>
      )}
    </div>
  )
}

function Stat({ label, value, unit }) {
  return (
    <div className="dl-stat">
      <span className="muted">{label}</span>
      <strong>
        {value}
        {unit && value !== '—' ? <small> {unit}</small> : null}
      </strong>
    </div>
  )
}

function DataTable({ cols, rows }) {
  return (
    <details className="dl-table">
      <summary>표로 보기</summary>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {cols.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((v, k) => (
                  <td key={k}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}

const W = 640
const H = 260
const PAD = { l: 48, r: 56, t: 14, b: 28 }

function ControlChart({ values, lim, flags, unit }) {
  const [hover, setHover] = useState(null)
  const lo = Math.min(lim.lcl, ...values)
  const hi = Math.max(lim.ucl, ...values)
  const span = hi - lo || 1
  const y0 = lo - span * 0.08
  const y1 = hi + span * 0.08
  const x = (i) => PAD.l + (i * (W - PAD.l - PAD.r)) / Math.max(1, values.length - 1)
  const y = (v) => PAD.t + ((y1 - v) * (H - PAD.t - PAD.b)) / (y1 - y0)
  const path = values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
  const lines = [
    { v: lim.ucl, label: 'UCL', cls: 'limit' },
    { v: lim.center, label: 'x̄', cls: 'center' },
    { v: lim.lcl, label: 'LCL', cls: 'limit' },
  ]
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => y0 + t * (y1 - y0))
  const step = (W - PAD.l - PAD.r) / Math.max(1, values.length - 1)
  return (
    <div className="dl-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`개별값 관리도. 점 ${values.length}개, 중심선 ${fmt(lim.center)}, UCL ${fmt(lim.ucl)}, LCL ${fmt(lim.lcl)}`} onMouseLeave={() => setHover(null)}>
        <rect x={PAD.l} y={PAD.t} width={x(lim.base - 1) - PAD.l} height={H - PAD.t - PAD.b} className="dl-zone" />
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} className="dl-grid" />
            <text x={PAD.l - 6} y={y(t) + 4} className="dl-axis" textAnchor="end">
              {t.toFixed(1)}
            </text>
          </g>
        ))}
        {lines.map((l) => (
          <g key={l.label}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(l.v)} y2={y(l.v)} className={`dl-ref ${l.cls}`} />
            <text x={W - PAD.r + 6} y={y(l.v) + 4} className="dl-axis">
              {l.label}
            </text>
          </g>
        ))}
        <path d={path} className="dl-line" />
        {values.map((v, i) => {
          const bad = flags[i].length > 0
          return (
            <g key={i}>
              {bad ? (
                <g className="dl-flag" transform={`translate(${x(i)} ${y(v)})`}>
                  <circle r="7" />
                  <path d="M-3 -3 L3 3 M3 -3 L-3 3" />
                </g>
              ) : (
                <circle cx={x(i)} cy={y(v)} r={hover === i ? 5 : 3.5} className="dl-dot" />
              )}
              <rect x={x(i) - step / 2} y={PAD.t} width={step} height={H - PAD.t - PAD.b} fill="transparent" onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} />
            </g>
          )
        })}
        {[1, Math.ceil(values.length / 2), values.length].map((n) => (
          <text key={n} x={x(n - 1)} y={H - 8} className="dl-axis" textAnchor="middle">
            {n}
          </text>
        ))}
        {hover != null && <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={H - PAD.b} className="dl-cross" />}
      </svg>
      {hover != null && (
        <div className="dl-tip" style={{ left: `${(x(hover) / W) * 100}%` }}>
          <strong>{hover + 1}번째</strong> {values[hover]} {unit}
          {flags[hover].length > 0 && <span className="status bad">{flags[hover].map((n) => `규칙 ${n}`).join(', ')}</span>}
        </div>
      )}
    </div>
  )
}

// ── 공정능력 ──
function CapTab({ onOpenField }) {
  const [id, setId] = useState(CAPABILITY_SETS[0].id)
  const [text, setText] = useState('')
  const [lslT, setLsl] = useState('')
  const [uslT, setUsl] = useState('')
  const [pick, setPick] = useState(null)
  const set = CAPABILITY_SETS.find((s) => s.id === id)
  const values = set ? set.values : parseNumbers(text)
  const lsl = set ? (set.lsl ?? NaN) : lslT === '' ? NaN : Number(lslT)
  const usl = set ? (set.usl ?? NaN) : uslT === '' ? NaN : Number(uslT)
  const ok = values.length >= 5 && (Number.isFinite(lsl) || Number.isFinite(usl))
  const cap = ok ? capability(values, lsl, usl) : null
  const pair = CAPABILITY_ASK.pair.map((k) => {
    const s = CAPABILITY_SETS.find((x) => x.id === k)
    return { s, c: capability(s.values, s.lsl ?? NaN, s.usl ?? NaN) }
  })

  return (
    <div className="dl-body">
      <SetPicker sets={CAPABILITY_SETS} value={id} onChange={setId} />
      {set ? (
        <p className="dl-story">
          <span className="scenario-tag">가상 데이터 · 가상 규격</span> 규격 {Number.isFinite(lsl) ? `하한 ${lsl}` : ''}
          {Number.isFinite(lsl) && Number.isFinite(usl) ? ' ~ ' : ''}
          {Number.isFinite(usl) ? `상한 ${usl}` : ''} {set.unit} · 시료 {values.length}개 <CaseLink set={set} onOpenField={onOpenField} />
        </p>
      ) : (
        <div className="dl-input">
          <label>
            측정값
            <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="예: 100.4 99.6 100.9 …" />
          </label>
          <div className="dl-input-row">
            <label>
              규격 하한 LSL
              <input type="number" value={lslT} onChange={(e) => setLsl(e.target.value)} />
            </label>
            <label>
              규격 상한 USL
              <input type="number" value={uslT} onChange={(e) => setUsl(e.target.value)} />
            </label>
          </div>
        </div>
      )}
      {!ok ? (
        <p className="muted">값 5개 이상과 규격(하한·상한 중 하나 이상)을 넣으면 계산합니다.</p>
      ) : (
        <>
          <div className="dl-stats">
            <Stat label="평균 x̄" value={fmt(cap.mean)} unit={set?.unit} />
            <Stat label="표준편차 s" value={fmt(cap.s, 3)} unit={set?.unit} />
            <Stat label="Cp (흩어짐만)" value={fmt(cap.cp)} />
            <Stat label="Cpk (치우침까지)" value={fmt(cap.cpk)} />
            <Stat label="규격 밖 시료" value={`${cap.out}개`} />
          </div>
          <Histogram values={values} lsl={lsl} usl={usl} mean={cap.mean} unit={set?.unit ?? ''} />
          <CapRead cap={cap} />
          <DataTable cols={['번호', '값']} rows={values.map((v, i) => [i + 1, v])} />
        </>
      )}

      <div className="dl-ask card">
        <h4>❓ {CAPABILITY_ASK.prompt}</h4>
        <table className="dl-mini">
          <thead>
            <tr>
              <th>묶음</th>
              <th>평균</th>
              <th>s</th>
              <th>Cp</th>
              <th>Cpk</th>
            </tr>
          </thead>
          <tbody>
            {pair.map(({ s, c }) => (
              <tr key={s.id}>
                <td>{s.title}</td>
                <td>{fmt(c.mean)}</td>
                <td>{fmt(c.s, 3)}</td>
                <td>{fmt(c.cp)}</td>
                <td>{fmt(c.cpk)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="dl-choices">
          {CAPABILITY_ASK.choices.map((t, i) => (
            <button key={t} type="button" className={`quiz-choice${pick === i ? (i === CAPABILITY_ASK.answer ? ' correct' : ' wrong') : ''}`} onClick={() => setPick(i)}>
              {t}
            </button>
          ))}
        </div>
        {pick != null && (
          <p className={pick === CAPABILITY_ASK.answer ? 'dl-ok' : 'dl-no'}>
            {pick === CAPABILITY_ASK.answer ? '✓ 맞습니다. ' : '✕ 다시 보세요. '}
            {CAPABILITY_ASK.explain}
          </p>
        )}
      </div>
    </div>
  )
}

function CapRead({ cap }) {
  // NIST 6.1.6 표: 가운데 놓인 공정에서 Cp 1.00 → 불량 0.27%, 1.33 → 64 ppm, 1.66 → 0.6 ppm, 2.00 → 2 ppb
  const v = cap.cpk
  const tone = v == null ? 'info' : v < 1 ? 'bad' : v < 1.33 ? 'warn' : 'ok'
  return (
    <div className="dl-read card">
      <p>
        <span className={`status ${tone}`}>Cpk {fmt(v)}</span>{' '}
        {v == null
          ? '계산할 수 없습니다.'
          : v < 1
            ? '평균에서 ±3s 범위가 규격 밖으로 나갑니다. 규격 밖 제품이 꾸준히 나올 수 있는 상태입니다.'
            : v < 1.33
              ? '±3s 범위는 규격 안이지만 여유가 크지 않습니다.'
              : '±3s 범위와 규격 사이에 여유가 있습니다.'}
        {cap.cp != null && cap.cpk != null && cap.cp - cap.cpk > 0.3 && ' Cp보다 Cpk가 많이 낮습니다 → 흩어짐보다 "평균이 한쪽으로 치우친 것"이 문제입니다.'}
      </p>
      <p className="muted">
        참고(NIST 표, 정규분포·가운데 놓인 공정 가정): Cp 1.00 → 불량 약 0.27% · 1.33 → 64 ppm · 1.66 → 0.6 ppm · 2.00 → 2 ppb. 시료가 적으면 추정이 불안정합니다(NIST는 약 50개를 "충분한" 수로 봅니다).{' '}
        <Cites keys={['nist-capability']} />
      </p>
      <p className="muted">색 구분(1.0·1.33)은 위 NIST 표의 값을 기준으로 한 앱의 학습용 표시이며, 실제 회사 관리 기준은 제품·고객마다 다릅니다.</p>
    </div>
  )
}

function Histogram({ values, lsl, usl, mean: m, unit }) {
  const [hover, setHover] = useState(null)
  const lo = Math.min(...values, Number.isFinite(lsl) ? lsl : Infinity)
  const hi = Math.max(...values, Number.isFinite(usl) ? usl : -Infinity)
  const span = hi - lo || 1
  const a = lo - span * 0.1
  const b = hi + span * 0.1
  const bins = 14
  const bw = (b - a) / bins
  const counts = Array.from({ length: bins }, (_, k) => values.filter((v) => v >= a + k * bw && (k === bins - 1 ? v <= b : v < a + (k + 1) * bw)).length)
  const top = Math.max(...counts, 1)
  const x = (v) => PAD.l + ((v - a) * (W - PAD.l - PAD.r)) / (b - a)
  const y = (n) => H - PAD.b - (n * (H - PAD.t - PAD.b - 16)) / top
  const bwPx = x(a + bw) - x(a)
  const refs = [
    Number.isFinite(lsl) && { v: lsl, label: 'LSL', cls: 'spec' },
    Number.isFinite(usl) && { v: usl, label: 'USL', cls: 'spec' },
    { v: m, label: 'x̄', cls: 'center' },
  ].filter(Boolean)
  return (
    <div className="dl-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`측정값 분포 막대그래프와 규격선. 평균 ${fmt(m)}`} onMouseLeave={() => setHover(null)}>
        <line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} className="dl-base" />
        {counts.map((n, k) =>
          n ? (
            <path
              key={k}
              d={barPath(x(a + k * bw) + 1, y(n), Math.max(1, bwPx - 2), H - PAD.b - y(n))}
              className={`dl-bar${hover === k ? ' on' : ''}`}
              onMouseEnter={() => setHover(k)}
            />
          ) : null,
        )}
        {refs.map((r) => (
          <g key={r.label}>
            <line x1={x(r.v)} x2={x(r.v)} y1={PAD.t} y2={H - PAD.b} className={`dl-ref ${r.cls}`} />
            <text x={x(r.v)} y={PAD.t + 10} className="dl-axis strong" textAnchor="middle">
              {r.label}
            </text>
          </g>
        ))}
        {[a, (a + b) / 2, b].map((t) => (
          <text key={t} x={x(t)} y={H - 8} className="dl-axis" textAnchor="middle">
            {t.toFixed(1)}
          </text>
        ))}
      </svg>
      {hover != null && (
        <div className="dl-tip" style={{ left: `${(x(a + (hover + 0.5) * bw) / W) * 100}%` }}>
          {(a + hover * bw).toFixed(2)} ~ {(a + (hover + 1) * bw).toFixed(2)} {unit}: <strong>{counts[hover]}개</strong>
        </div>
      )}
    </div>
  )
}

// 위쪽 모서리만 둥근 막대(바닥에 붙음)
function barPath(x, y, w, h) {
  const r = Math.min(4, w / 2, h)
  return `M${x} ${y + h} V${y + r} Q${x} ${y} ${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h} Z`
}

// ── Pareto ──
function ParetoTab({ onOpenField }) {
  const [id, setId] = useState(PARETO_SETS[0].id)
  const [text, setText] = useState('')
  const [answer, setAnswer] = useState(null)
  const set = PARETO_SETS.find((s) => s.id === id)
  const counts = set ? set.counts : parseCounts(text)
  const p = pareto(counts)
  const ask = set?.ask
  const right = !ask ? null : ask.kind === 'top' ? p.rows[0]?.label : String(p.rows.findIndex((r) => r.cum >= ask.target) + 1)
  const change = (v) => {
    setId(v)
    setAnswer(null)
  }
  const top = p.rows[0]?.n || 1
  return (
    <div className="dl-body">
      <SetPicker sets={PARETO_SETS} value={id} onChange={change} />
      {set ? (
        <p className="dl-story">
          <span className="scenario-tag">가상 데이터</span> 전체 {p.total}
          {set.unit} <CaseLink set={set} onOpenField={onOpenField} />
        </p>
      ) : (
        <div className="dl-input">
          <label>
            항목과 건수 (한 줄에 하나, "항목: 건수")
            <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder={'잔류물: 46\n파티클: 18\n스크래치: 7'} />
          </label>
        </div>
      )}
      {p.rows.length === 0 ? (
        <p className="muted">항목을 넣으면 많은 순서로 정렬합니다.</p>
      ) : (
        <div className="pareto">
          <div className="pareto-head muted">
            <span>항목 (많은 순)</span>
            <span>건수</span>
            <span>누적 비율</span>
          </div>
          {p.rows.map((r, i) => (
            <div key={r.label} className="pareto-row">
              <span className="pareto-label">
                <b>{i + 1}</b> {r.label}
              </span>
              <span className="pareto-bar" title={`${r.label}: ${r.n} (${r.pct.toFixed(1)}%)`}>
                <i style={{ width: `${(r.n / top) * 100}%` }} />
                <em>
                  {r.n} <small>({r.pct.toFixed(0)}%)</small>
                </em>
              </span>
              <span className="pareto-cum">
                <i style={{ width: `${r.cum}%` }} />
                <em>{r.cum.toFixed(0)}%</em>
              </span>
            </div>
          ))}
          <p className="muted">막대는 건수, 오른쪽 띠는 위에서부터 더한 누적 비율입니다(두 값을 한 축에 섞지 않았습니다).</p>
        </div>
      )}
      {ask && (
        <div className="dl-ask card">
          <h4>❓ {ask.prompt}</h4>
          <div className="dl-choices">
            {(ask.kind === 'top' ? p.rows.slice(0, 4).map((r) => r.label) : ['1', '2', '3', '4']).map((c) => (
              <button key={c} type="button" className={`quiz-choice${answer === c ? (c === right ? ' correct' : ' wrong') : ''}`} onClick={() => setAnswer(c)}>
                {ask.kind === 'top' ? c : `${c}개`}
              </button>
            ))}
          </div>
          {answer != null && (
            <p className={answer === right ? 'dl-ok' : 'dl-no'}>
              {answer === right ? '✓ 맞습니다. ' : `✕ 정답은 ${ask.kind === 'top' ? right : `${right}개`}입니다. `}
              {set.lesson}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function parseCounts(text) {
  const out = {}
  for (const line of String(text).split('\n')) {
    const m = line.match(/^\s*(.+?)\s*[:：,]\s*(\d+(?:\.\d+)?)\s*$/)
    if (m) out[m[1]] = (out[m[1]] ?? 0) + Number(m[2])
  }
  return out
}

