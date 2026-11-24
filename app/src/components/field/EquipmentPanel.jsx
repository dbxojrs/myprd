import { useEffect, useRef, useState } from 'react'
import { ISO } from '../equipment/index.js'
import { EQUIPMENT } from '../../data/equipment/index.js'
import { ORIGIN_LABEL, VISUALS } from '../../data/visuals.js'
import { Cites } from '../movie/ProcessMovie.jsx'

// 실무 시나리오 오른쪽 패널의 "장비 구조" 탭.
// 설비 실습과 같은 장비 도식(components/equipment ISO)을 쓰고, 부위 설명은 출처가 있는 data/equipment modules만 씁니다.
// 데이터 항목의 parts(관련 부위)와 연결해 강조하고, figure(장비 그림에 없는 검사)는 별도 그림으로 보여 줍니다.
// 관찰 포인트(observe)는 시나리오의 교육용 가정이라 "시나리오 가정"으로 표시합니다.

const ZOOMS = [1, 1.5, 2, 3]
const CIRCLED = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩']

export function VisualBadge({ id }) {
  const v = VISUALS[id]
  if (!v) return null
  const o = ORIGIN_LABEL[v.origin]
  return (
    <span className={`visual-badge ${v.origin}`} title={`${o.note} ${v.source ?? ''} · ${v.license}${v.reviewed ? '' : ' · 검수 전'}`}>
      {o.icon} {o.label}
      {!v.reviewed && ' · 검수 전'}
    </span>
  )
}

// Ball Shear 시험 원리(교육용 도식): 패드 위 볼을 옆에서 미는 툴, 볼-패드 접촉면 강조
export function ShearTestFigure({ highlight = 'contact' }) {
  return (
    <svg viewBox="0 0 320 170" className="shear-fig" role="img" aria-label="Ball Shear 시험 원리 도식: 패드 위의 볼 접합부를 시험 툴이 옆에서 밀어 접합 강도를 잰다">
      <rect x="20" y="128" width="280" height="22" rx="3" className="sf-chip" />
      <text x="30" y="143" className="sf-label">칩</text>
      <rect x="110" y="120" width="100" height="8" rx="2" className="sf-pad" />
      <text x="214" y="127" className="sf-label">패드</text>
      <path d="M128 120 Q128 92 160 90 Q192 92 192 120 Z" className="sf-ball" />
      <path d="M160 90 L160 40" className="sf-wire" />
      <text x="166" y="52" className="sf-label">와이어</text>
      <text x="196" y="100" className="sf-label">볼</text>
      <line x1="128" y1="121" x2="192" y2="121" className={`sf-contact${highlight === 'contact' ? ' on' : ''}`} />
      <text x="128" y="164" className="sf-label strong">볼-패드 접촉면</text>
      <g className="sf-tool">
        <rect x="52" y="96" width="62" height="16" rx="2" />
        <path d="M114 96 L122 104 L114 112 Z" />
        <text x="54" y="90" className="sf-label">시험 툴 →</text>
      </g>
      <path d="M86 116 L118 116" className="sf-arrow" markerEnd="url(#sf-head)" />
      <defs>
        <marker id="sf-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" className="sf-arrowhead" />
        </marker>
      </defs>
    </svg>
  )
}

export default function EquipmentPanel({ c, run, focus, onFocus, onJumpData, canJump, hideObserve = false }) {
  const kind = c.equipment?.kind
  const Iso = ISO[kind]
  const eq = EQUIPMENT[kind]
  const dataNode = Object.values(c.nodes).find((n) => n.type === 'data')
  const items = dataNode?.items ?? []
  const [zoom, setZoom] = useState(0)
  const boxRef = useRef(null)
  const figureItem = items.find((i) => i.figure && i.figure === focus)

  // 확대했을 때 고른 부위가 가운데 오게 스크롤합니다(페이지는 움직이지 않음).
  useEffect(() => {
    const box = boxRef.current
    if (!box || !focus) return
    const el = box.querySelector(`[data-part="${focus}"]`)
    if (!el) return
    const b = box.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    box.scrollLeft += r.left + r.width / 2 - (b.left + b.width / 2)
    box.scrollTop += r.top + r.height / 2 - (b.top + b.height / 2)
  }, [focus, zoom])

  if (!Iso || !eq) return <p className="muted">이 시나리오의 장비 그림은 준비 중입니다(이미지 등록 예정).</p>

  const mod = eq.modules.find((m) => m.id === focus)
  const related = items.filter((i) => i.parts?.includes(focus))
  const figures = [...new Set(items.filter((i) => i.figure).map((i) => i.figure))]
  const srcOf = (key) => eq.sources?.[key]

  return (
    <div className="eqp">
      <div className="eqp-head">
        <strong>{c.equipment.name}</strong>
        <VisualBadge id="equipment-iso" />
      </div>

      <div className="eqp-stage">
        <div
          className="eqp-canvas"
          ref={boxRef}
          onWheel={(e) => {
            if (!e.ctrlKey) return
            e.preventDefault()
            setZoom((z) => Math.max(0, Math.min(ZOOMS.length - 1, z + (e.deltaY < 0 ? 1 : -1))))
          }}
        >
          <div className="eqp-inner" style={{ width: `${ZOOMS[zoom] * 100}%` }}>
            <Iso focus={focus && !figureItem ? focus : null} onPick={(id) => onFocus(id)} tags />
          </div>
        </div>
        <div className="eqp-zoom" role="group" aria-label="확대·축소">
          <button type="button" onClick={() => setZoom((z) => Math.min(ZOOMS.length - 1, z + 1))} disabled={zoom === ZOOMS.length - 1} aria-label="확대">
            ＋
          </button>
          <button type="button" onClick={() => setZoom((z) => Math.max(0, z - 1))} disabled={zoom === 0} aria-label="축소">
            −
          </button>
          <button type="button" onClick={() => (setZoom(0), onFocus(null))} aria-label="처음 보기">
            ↺
          </button>
          <small>{ZOOMS[zoom]}×</small>
        </div>
      </div>
      <p className="muted eqp-tip">부위를 누르거나 아래 번호를 고르세요. 그림 위에서 Ctrl+휠로 확대합니다.</p>

      <ol className="eqp-parts" aria-label="주요 부위">
        {eq.modules.map((m, i) => (
          <li key={m.id}>
            <button type="button" className={focus === m.id ? 'on' : ''} aria-pressed={focus === m.id} onClick={() => onFocus(focus === m.id ? null : m.id)}>
              <span className="eqp-no">{CIRCLED[i]}</span>
              {m.name.ko}
            </button>
          </li>
        ))}
        {figures.map((f) => (
          <li key={f}>
            <button type="button" className={focus === f ? 'on' : ''} aria-pressed={focus === f} onClick={() => onFocus(focus === f ? null : f)}>
              <span className="eqp-no">🔬</span>
              {VISUALS[f]?.title ?? f}
            </button>
          </li>
        ))}
      </ol>

      {mod && (
        <section className="eqp-detail" aria-live="polite">
          <h4>
            {CIRCLED[eq.modules.indexOf(mod)]} {mod.name.ko} <small className="muted">{mod.name.en}</small>
          </h4>
          <p>{mod.desc}</p>
          {srcOf(mod.src) && (
            <p className="muted eqp-src">
              출처:{' '}
              <a href={srcOf(mod.src).url} target="_blank" rel="noreferrer">
                {srcOf(mod.src).title}
              </a>{' '}
              · {srcOf(mod.src).publisher}
            </p>
          )}
          {related.map((i) => (
            <div key={i.id} className="eqp-related">
              <div className="eqp-related-head">
                <span>{i.label}</span>
                {run.viewed.includes(i.id) ? <span className="status ok">확인함</span> : <span className="status info">미확인</span>}
              </div>
              {i.observe && !hideObserve && (
                <div className="eqp-observe">
                  <span className="scenario-tag">시나리오 가정 · 관찰 포인트</span>
                  <div className="eqp-compare">
                    <div className="ok">
                      <strong>✓ 정상</strong>
                      <p>{i.observe.normal}</p>
                    </div>
                    <div className="bad">
                      <strong>✕ 이상 징후</strong>
                      <p>{i.observe.abnormal}</p>
                    </div>
                  </div>
                </div>
              )}
              {!run.viewed.includes(i.id) && canJump && (
                <button type="button" className="link" onClick={() => onJumpData(i.id)}>
                  이 데이터 확인하러 가기 →
                </button>
              )}
            </div>
          ))}
          {hideObserve && related.some((i) => i.observe) && <p className="muted">평가 모드: 관찰 포인트는 결과 평가 뒤에 볼 수 있습니다.</p>}
          {related.length === 0 && <p className="muted">이 시나리오에서 이 부위와 직접 연결된 데이터는 없습니다.</p>}
        </section>
      )}

      {figureItem || (focus && VISUALS[focus]?.type === 'figure') ? (
        <section className="eqp-detail" aria-live="polite">
          <h4>
            🔬 {VISUALS[focus].title} <VisualBadge id={focus} />
          </h4>
          <ShearTestFigure />
          <ul className="eqp-notes">
            {VISUALS[focus].notes.map((n) => (
              <li key={n.text}>
                {n.text}
                <Cites keys={n.cite} />
              </li>
            ))}
          </ul>
          {items
            .filter((i) => i.figure === focus)
            .map((i) => (
              <div key={i.id} className="eqp-related">
                <div className="eqp-related-head">
                  <span>{i.label}</span>
                  {run.viewed.includes(i.id) ? <span className="status ok">확인함</span> : <span className="status info">미확인</span>}
                </div>
                {i.observe && !hideObserve && (
                  <div className="eqp-observe">
                    <span className="scenario-tag">시나리오 가정 · 관찰 포인트</span>
                    <p>{i.observe.normal}</p>
                  </div>
                )}
                {!run.viewed.includes(i.id) && canJump && (
                  <button type="button" className="link" onClick={() => onJumpData(i.id)}>
                    이 데이터 확인하러 가기 →
                  </button>
                )}
              </div>
            ))}
        </section>
      ) : null}
    </div>
  )
}
