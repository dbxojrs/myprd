import { memo, useEffect, useState } from 'react'
import { ORIGIN_LABEL } from '../../data/visuals.js'
import { highlightedParts, mediaFor } from '../../data/media.js'
import ProcessMovie, { Cites } from '../movie/ProcessMovie.jsx'
import { processMovies } from '../../data/processMovies/index.js'

// 현장 실무 시나리오의 시각 자료: 상황 개요, 미디어 틀(확대·출처·대체 UI), 교육용 도식, 차트.
// 수치·도식은 시나리오 데이터(c.scene, 데이터 항목 result)에서만 가져옵니다. 확인하지 않은 데이터는 보여 주지 않습니다.

// ── 미디어 틀: 종류 배지 · 출처 · 클릭 확대 · 불러오기 실패 대체 ──
export function MediaFrame({ m, children }) {
  const [zoom, setZoom] = useState(false)
  const [failed, setFailed] = useState(false)
  const origin = ORIGIN_LABEL[m.isEducationalIllustration ? 'edu-diagram' : 'real-photo']
  useEffect(() => {
    if (!zoom) return
    const onKey = (e) => e.key === 'Escape' && setZoom(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoom])
  const body =
    m.mediaType === 'photo' ? (
      failed ? (
        <div className="media-fallback" role="img" aria-label={m.alt}>
          <span aria-hidden="true">🖼️</span>
          <p>이미지를 불러오지 못했습니다.</p>
          <small className="muted">{m.alt}</small>
        </div>
      ) : (
        <img src={m.assetPath} alt={m.alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />
      )
    ) : (
      children
    )
  return (
    <figure className="media-frame">
      <div className="media-head">
        <strong>{m.title}</strong>
        <span className={`visual-badge ${m.isEducationalIllustration ? 'edu-diagram' : 'real-photo'}`} title={origin.note}>
          {origin.icon} {origin.label}
          {m.validationStatus !== 'reviewed' && ' · 검수 전'}
        </span>
        {m.mediaType !== 'movie' && (
          <button type="button" className="link media-zoom" onClick={() => setZoom(true)} aria-label={`${m.title} 크게 보기`}>
            ⤢ 크게
          </button>
        )}
      </div>
      <div className="media-body">{body}</div>
      <figcaption className="muted">
        {m.description}{' '}
        <span className="media-src">
          출처: {m.url ? <a href={m.url} target="_blank" rel="noreferrer">{m.source}</a> : m.source} · {m.license}
        </span>
        {m.cite && <Cites keys={m.cite} />}
      </figcaption>
      {zoom && (
        <div className="media-modal" role="dialog" aria-modal="true" aria-label={m.title} onClick={() => setZoom(false)}>
          <div className="media-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="media-head">
              <strong>{m.title}</strong>
              <button type="button" className="link" onClick={() => setZoom(false)} autoFocus>
                닫기 ✕
              </button>
            </div>
            <div className="media-modal-body">{body}</div>
          </div>
        </div>
      )}
    </figure>
  )
}

// ── 공정 애니메이션: 누르기 전에는 불러오지 않습니다(자동 재생·자동 로딩 없음). 단계가 바뀌면 그 단계 장면으로 엽니다. ──
function LazyMovie({ m, onOpenProcess }) {
  const [open, setOpen] = useState(false)
  if (!open)
    return (
      <button type="button" className="media-movie-open" onClick={() => setOpen(true)}>
        <span aria-hidden="true">▶</span> 애니메이션 열기 <small className="muted">(자막·배속·구간 반복 · 소리 없음)</small>
      </button>
    )
  return <ProcessMovie id={m.movieId} startScene={m.startScene} onOpenProcess={onOpenProcess} compact />
}

// ── 테스트 셀 관계 개념도 (부위를 누르면 장비 구조 탭에서 설명) ──
const TC_PARTS = {
  ate: { x: 20, y: 18, w: 140, h: 50, label: 'ATE 본체', sub: '프로그램·판정' },
  head: { x: 210, y: 18, w: 150, h: 50, label: '테스트 헤드', sub: '측정 카드' },
  input: { x: 36, y: 140, w: 84, h: 62, label: '입력부', sub: '트레이·튜브' },
  soak: { x: 132, y: 140, w: 90, h: 62, label: '온도 챔버', sub: '온도 맞추기' },
  arm: { x: 234, y: 140, w: 84, h: 62, label: '픽앤플레이스', sub: '넣고 빼기' },
  sort: { x: 528, y: 140, w: 92, h: 62, label: '분류 (Bin)', sub: '양품·불량' },
}

export const TestCellDiagram = memo(function TestCellDiagram({ handler = '핸들러', sites = 4, focus, highlight = [], flags = [], onPick }) {
  const on = (id) => focus === id || highlight.includes(id)
  const pick = (id) => onPick?.(id)
  const key = (id) => (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), pick(id))
  const box = (id) => {
    const p = TC_PARTS[id]
    return (
      <g key={id} className={`tc-part${on(id) ? ' on' : ''}`} data-part={id} role="button" tabIndex={0} aria-label={`${p.label} 설명 보기`} onClick={() => pick(id)} onKeyDown={key(id)}>
        <rect x={p.x} y={p.y} width={p.w} height={p.h} rx="8" />
        <text x={p.x + p.w / 2} y={p.y + p.h / 2 - 3} textAnchor="middle" className="tc-label">
          {p.label}
        </text>
        <text x={p.x + p.w / 2} y={p.y + p.h / 2 + 13} textAnchor="middle" className="tc-sub">
          {p.sub}
        </text>
      </g>
    )
  }
  const sx = 332
  const sw = Math.min(40, 180 / sites)
  return (
    <svg viewBox="0 0 640 300" className="tc-svg" role="img" aria-label={`테스트 셀 관계 개념도. ${handler}, ${sites}개 사이트 병렬 테스트. ${flags.map((f) => f.text).join(' ')}`}>
      <defs>
        <marker id="tc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" className="tc-arrowhead" />
        </marker>
      </defs>
      <rect x="20" y="96" width="608" height="132" rx="12" className="tc-frame" />
      <text x="34" y="118" className="tc-frame-label">
        {handler} · {sites}사이트 병렬
      </text>
      <line x1="160" y1="43" x2="208" y2="43" className="tc-link" />
      <text x="184" y="36" textAnchor="middle" className="tc-sub">
        연결
      </text>
      {['ate', 'head'].map(box)}
      {['input', 'soak', 'arm', 'sort'].map(box)}
      <line x1="120" y1="171" x2="130" y2="171" className="tc-flow" markerEnd="url(#tc-arrow)" />
      <line x1="222" y1="171" x2="232" y2="171" className="tc-flow" markerEnd="url(#tc-arrow)" />
      <line x1="318" y1="171" x2="328" y2="171" className="tc-flow" markerEnd="url(#tc-arrow)" />
      <line x1="514" y1="171" x2="526" y2="171" className="tc-flow" markerEnd="url(#tc-arrow)" />
      {/* 소켓·사이트 */}
      <g className={`tc-part${on('socket') ? ' on' : ''}`} data-part="socket" role="button" tabIndex={0} aria-label="소켓·컨택터 설명 보기" onClick={() => pick('socket')} onKeyDown={key('socket')}>
        <rect x={sx - 4} y="128" width={sites * sw + 12} height="86" rx="8" />
        <text x={sx + (sites * sw) / 2 + 2} y="208" textAnchor="middle" className="tc-sub">
          소켓·컨택터 (DUT)
        </text>
      </g>
      {Array.from({ length: sites }, (_, i) => {
        const f = flags.find((x) => x.site === i + 1)
        const x = sx + 2 + i * sw
        return (
          <g key={i} className={`tc-site${f ? ' flag' : ''}`}>
            <rect x={x} y="140" width={sw - 6} height="44" rx="5" />
            <text x={x + (sw - 6) / 2} y="158" textAnchor="middle" className="tc-sub">
              S{i + 1}
            </text>
            <text x={x + (sw - 6) / 2} y="176" textAnchor="middle" className="tc-site-mark">
              {f ? '✕' : '·'}
            </text>
          </g>
        )
      })}
      <path d="M285 68 L285 92 L410 92 L410 126" className="tc-signal" markerEnd="url(#tc-arrow)" />
      <text x="348" y="86" textAnchor="middle" className="tc-sub">
        신호 보내고 응답 측정
      </text>
      <path d="M574 202 L574 252" className="tc-flow" markerEnd="url(#tc-arrow)" />
      <rect x="400" y="254" width="226" height="36" rx="8" className="tc-result" />
      <text x="513" y="276" textAnchor="middle" className="tc-label">
        결과: 수율 · 사이트별 · Bin 기록
      </text>
      {flags
        .filter((f) => f.text)
        .map((f, i) => (
          <text key={i} x="36" y={258 + i * 16} className="tc-flag-text">
            ✕ {f.text}
          </text>
        ))}
    </svg>
  )
})

// ── 소켓 접점 원리 도식 (정상 / 찌꺼기·마모) ──
export const SocketContactFigure = memo(function SocketContactFigure() {
  const pin = (x, worn) => (
    <g>
      <rect x={x} y="40" width="120" height="16" rx="3" className="sc-pkg" />
      <text x={x + 60} y="33" textAnchor="middle" className="tc-sub">
        패키지 단자
      </text>
      {worn ? (
        <>
          <path d={`M${x + 44} 150 L${x + 44} 72 Q${x + 52} 60 ${x + 60} 66 Q${x + 68} 60 ${x + 76} 72 L${x + 76} 150 Z`} className="sc-pin" />
          {[0, 1, 2, 3, 4].map((k) => (
            <circle key={k} cx={x + 46 + k * 7} cy={60 + (k % 2) * 3} r="2.6" className="sc-debris" />
          ))}
          <line x1={x + 56} y1="57" x2={x + 64} y2="57" className="sc-contact bad" />
        </>
      ) : (
        <>
          <path d={`M${x + 44} 150 L${x + 44} 62 Q${x + 60} 52 ${x + 76} 62 L${x + 76} 150 Z`} className="sc-pin" />
          <line x1={x + 46} y1="57" x2={x + 74} y2="57" className="sc-contact ok" />
        </>
      )}
      <text x={x + 60} y="172" textAnchor="middle" className="tc-label">
        {worn ? '✕ 찌꺼기·마모' : '✓ 깨끗한 접점'}
      </text>
      <text x={x + 60} y="190" textAnchor="middle" className="tc-sub">
        {worn ? '닿는 면이 좁고 저항이 커짐' : '넓게 닿음'}
      </text>
    </g>
  )
  return (
    <svg viewBox="0 0 340 200" className="sc-svg" role="img" aria-label="소켓 접점 비교 도식: 깨끗한 접점은 단자와 넓게 닿고, 찌꺼기와 마모가 생긴 접점은 닿는 면이 좁아 접촉 저항이 커진다">
      {pin(20, false)}
      {pin(200, true)}
    </svg>
  )
})

const DIAGRAMS = { TestCellDiagram, SocketContactFigure }

// ── 가로 막대 차트(0에서 시작, 값 표시, 이상 항목은 색 + ✕ + 글자) ──
export function BarChart({ chart }) {
  const [hover, setHover] = useState(null)
  const max = chart.max ?? Math.max(...chart.rows.map((r) => r.value)) * 1.08
  const fmt = (v) => `${v}${chart.unit === '%' ? ' %' : chart.unit ? ` ${chart.unit}` : ''}`
  return (
    <div className="bc" role="figure" aria-label={`${chart.title}: ${chart.rows.map((r) => `${r.label} ${fmt(r.value)}${r.flag ? ' (이상)' : ''}`).join(', ')}`}>
      {chart.title && <p className="bc-title">{chart.title}</p>}
      <ul className="bc-rows">
        {chart.rows.map((r, i) => (
          <li key={r.label} className={r.flag ? 'flag' : ''} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <span className="bc-label">{r.label}</span>
            <span className="bc-track">
              <i style={{ width: `${Math.max(1, (r.value / max) * 100)}%` }} />
            </span>
            <span className="bc-val">
              {fmt(r.value)}
              {r.flag && <span className="status bad">{r.flagText ?? '이상'}</span>}
            </span>
            {hover === i && r.note && <span className="bc-tip">{r.note}</span>}
          </li>
        ))}
      </ul>
      <p className="bc-note muted">
        {chart.virtual !== false && <span className="virtual-badge">가상 데이터</span>} {chart.note ?? ''} 막대는 0에서 시작합니다.
      </p>
    </div>
  )
}

// ── 순서대로 놓인 값의 추이(한 계열 선 그래프). 이상 점은 ✕로 표시 ──
export function TrendChart({ chart }) {
  const [hover, setHover] = useState(null)
  const W = 520
  const H = 200
  const P = { l: 44, r: 16, t: 16, b: 34 }
  const vals = chart.points.map((p) => p.value)
  const lo = Math.min(...vals, chart.ref ?? Infinity)
  const hi = Math.max(...vals, chart.ref ?? -Infinity)
  const pad = (hi - lo || 1) * 0.15
  const y0 = lo - pad
  const y1 = hi + pad
  const x = (i) => P.l + (i * (W - P.l - P.r)) / Math.max(1, chart.points.length - 1)
  const y = (v) => P.t + ((y1 - v) * (H - P.t - P.b)) / (y1 - y0)
  const d = chart.points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(' ')
  return (
    <div className="dl-chart trend">
      {chart.title && <p className="bc-title">{chart.title}</p>}
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${chart.title}: ${chart.points.map((p) => `${p.label} ${p.value}${chart.unit}`).join(', ')}`} onMouseLeave={() => setHover(null)}>
        {[y0 + pad, (y0 + y1) / 2, y1 - pad].map((t) => (
          <g key={t}>
            <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} className="dl-grid" />
            <text x={P.l - 6} y={y(t) + 4} textAnchor="end" className="dl-axis">
              {t.toFixed(1)}
            </text>
          </g>
        ))}
        {chart.ref != null && (
          <>
            <line x1={P.l} x2={W - P.r} y1={y(chart.ref)} y2={y(chart.ref)} className="dl-ref limit" />
            <text x={W - P.r} y={y(chart.ref) - 5} textAnchor="end" className="dl-axis">
              {chart.refLabel}
            </text>
          </>
        )}
        <path d={d} className="dl-line" />
        {chart.points.map((p, i) => (
          <g key={p.label} onMouseEnter={() => setHover(i)}>
            {p.flag ? (
              <g className="dl-flag" transform={`translate(${x(i)} ${y(p.value)})`}>
                <circle r="7" />
                <path d="M-3 -3 L3 3 M3 -3 L-3 3" />
              </g>
            ) : (
              <circle cx={x(i)} cy={y(p.value)} r={hover === i ? 5 : 3.5} className="dl-dot" />
            )}
            <rect x={x(i) - 14} y={P.t} width="28" height={H - P.t - P.b} fill="transparent" />
          </g>
        ))}
        {chart.points.map((p, i) =>
          i === 0 || i === chart.points.length - 1 || i % Math.ceil(chart.points.length / 6) === 0 ? (
            <text key={p.label} x={x(i)} y={H - 12} textAnchor="middle" className="dl-axis">
              {p.label}
            </text>
          ) : null,
        )}
      </svg>
      {hover != null && (
        <div className="dl-tip" style={{ left: `${(x(hover) / W) * 100}%` }}>
          <strong>{chart.points[hover].label}</strong> {chart.points[hover].value} {chart.unit}
          {chart.points[hover].note && <span className="muted"> · {chart.points[hover].note}</span>}
        </div>
      )}
      <p className="bc-note muted">
        <span className="virtual-badge">가상 데이터</span> {chart.note}
      </p>
    </div>
  )
}

// 시나리오 단계에 맞는 미디어 목록 렌더링
export function StageMedia({ c, run, stage, focus, onPick, only, collapsed = false, onOpenProcess }) {
  const list = mediaFor(c, stage, run.viewed, processMovies).filter((m) => !only || only.includes(m.mediaType))
  if (!list.length) return null
  if (collapsed)
    return (
      <details className="scene-peek">
        <summary>🖼️ 관련 시각 자료 {list.length}개 — {list.map((m) => m.title.split(' (')[0]).join(' · ')}</summary>
        <StageMedia c={c} run={run} stage={stage} focus={focus} onPick={onPick} only={only} onOpenProcess={onOpenProcess} />
      </details>
    )
  return (
    <div className="stage-media">
      {list.map((m) => {
        const Diagram = DIAGRAMS[m.component]
        const props = m.component === 'TestCellDiagram' ? { ...(c.scene?.diagram ?? {}), flags: (c.scene?.diagram?.flags ?? []).filter((f) => run.viewed.includes(f.after)), highlight: highlightedParts(m, run.viewed), focus, onPick } : {}
        return (
          <MediaFrame key={m.mediaId} m={m}>
            {m.mediaType === 'movie' ? <LazyMovie key={m.startScene} m={m} onOpenProcess={onOpenProcess} /> : Diagram ? <Diagram {...props} /> : null}
          </MediaFrame>
        )
      })}
    </div>
  )
}

// ── 현장 상황 개요: 공정·장비·이상 위치·발생 시각·현재 상태 + 핵심 지표 차트 + 단계별 미디어 ──
export function SituationOverview({ c, run, stage, focus, onPick, onOpenProcess, compact = false }) {
  const s = c.scene
  const facts = [
    ['담당 공정', `${c.category} · ${c.processLabel}`],
    ['장비', c.equipment?.name ?? '-'],
    s?.location && ['이상 발생 위치', s.location],
    s?.clock && ['발생·보고 시각', s.clock],
    ['현재 상태', run.done ? '조치 완료 · 평가' : run.status ?? s?.state ?? '이상 보고 접수'],
  ].filter(Boolean)
  return (
    <section className={`situation${compact ? ' compact' : ''}`} aria-label="현장 상황 개요">
      <dl className="situation-facts">
        {facts.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      {s?.metrics && <BarChart chart={s.metrics} />}
      <StageMedia c={c} run={run} stage={stage} focus={focus} onPick={onPick} only={compact ? ['diagram', 'movie'] : null} onOpenProcess={onOpenProcess} />
      {onOpenProcess && (
        <button type="button" className="link" onClick={() => onOpenProcess(c.process)}>
          📽 {c.processLabel} 공정 애니메이션·설명 보기 →
        </button>
      )}
    </section>
  )
}

// ── 조치 전후 비교(두 계열: 조치 전 = 흐린 막대, 조치 후 = 진한 막대, 범례 표시) ──
export function CompareBars({ chart }) {
  const max = chart.max ?? Math.max(...chart.rows.flatMap((r) => [r.before, r.after])) * 1.08
  const u = chart.unit === '%' ? ' %' : ` ${chart.unit ?? ''}`
  return (
    <div className="bc compare" role="figure" aria-label={`${chart.title}: ${chart.rows.map((r) => `${r.label} 조치 전 ${r.before}${u}, 조치 후 ${r.after}${u}`).join('; ')}`}>
      <p className="bc-title">{chart.title}</p>
      <ul className="bc-legend">
        <li>
          <i className="before" /> 조치 전
        </li>
        <li>
          <i className="after" /> 조치 후
        </li>
      </ul>
      <ul className="bc-rows">
        {chart.rows.map((r) => (
          <li key={r.label}>
            <span className="bc-label">{r.label}</span>
            <span className="bc-pair">
              <span className="bc-track before">
                <i style={{ width: `${(r.before / max) * 100}%` }} />
              </span>
              <span className="bc-track">
                <i style={{ width: `${(r.after / max) * 100}%` }} />
              </span>
            </span>
            <span className="bc-val">
              {r.before} → <strong>{r.after}</strong>
              {u}
            </span>
          </li>
        ))}
      </ul>
      <p className="bc-note muted">
        <span className="virtual-badge">가상 데이터</span> 고른 조치에 따라 시나리오 규칙이 정한 결과입니다. 막대는 0에서 시작합니다.
      </p>
    </div>
  )
}

// 데이터 항목·조치 결과의 차트 종류별 진입점
export function ChartView({ chart }) {
  if (chart.kind === 'bars') return <BarChart chart={chart} />
  if (chart.kind === 'trend') return <TrendChart chart={chart} />
  if (chart.kind === 'compare') return <CompareBars chart={chart} />
  return null
}
