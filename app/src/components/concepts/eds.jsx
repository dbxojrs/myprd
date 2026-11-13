import { Anim, Move, StepCaption, Visible } from '../illustrationKit.jsx'

// EDS 개념 그림. viewBox 0 0 320 180. animate가 false면 다 끝난 모습만 그립니다.
// 삼성 뉴스룸 8탄의 그림을 따라 그리지 않고, 글 내용(프로브 카드, 4단계, 수율)만으로 새로 그렸습니다.

const DUR = '10s'

const Show = ({ animate, from, to = 1, children }) =>
  animate ? (
    <Visible from={from} to={to} dur={DUR}>
      {children}
    </Visible>
  ) : (
    children
  )

const STEPS = [
  { title: 'ET · WBI', sub: '전기 특성·열' },
  { title: 'Hot/Cold', sub: '높고 낮은 온도' },
  { title: 'Repair', sub: '수선 · Final Test' },
  { title: 'Inking', sub: '불량 표시' },
]
const BAD = [1, 4]
const FIXED = [3]

export function EdsFlow({ animate = true }) {
  return (
    <svg viewBox="0 0 320 180" className="il cf" role="img" aria-label="EDS 4단계와 프로브 카드">
      {/* 프로브 카드가 내려와 핀이 패드에 닿음 */}
      <g>
        {animate && <Move points={[[0, '0,-12'], [0.12, '0,0'], [0.92, '0,0'], [1, '0,-12']]} dur={DUR} />}
        <rect x="70" y="14" width="180" height="14" rx="3" className="cf-b-card" />
        <text x="160" y="24" textAnchor="middle" className="cf-on-dark">프로브 카드</text>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={i} x1={88 + i * 29} y1="28" x2={88 + i * 29} y2="44" className="cf-b-pin" />
        ))}
      </g>
      {/* 웨이퍼 위 칩 6개 */}
      <rect x="60" y="46" width="200" height="30" rx="4" className="cf-si" />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = 75 + i * 29
        const bad = BAD.includes(i)
        const fixed = FIXED.includes(i)
        return (
          <g key={i}>
            <rect x={x} y="50" width="26" height="22" rx="2" className="cf-b-die">
              {animate && (
                <Anim
                  attr="fill"
                  points={[
                    [0.15, '#c7cdd6'],
                    [0.2 + i * 0.02, bad ? '#e57373' : fixed ? '#f2c464' : '#7fcf9a'],
                    [0.55, bad ? '#e57373' : fixed ? '#f2c464' : '#7fcf9a'],
                    [0.6, bad ? '#e57373' : '#7fcf9a'],
                  ]}
                  dur={DUR}
                />
              )}
            </rect>
            {!animate && <rect x={x} y="50" width="26" height="22" rx="2" className={bad ? 'cf-b-die bad' : 'cf-b-die good'} />}
            {bad && (
              <Show animate={animate} from={0.76}>
                <circle cx={x + 13} cy="61" r="5" className="cf-b-ink" />
              </Show>
            )}
          </g>
        )
      })}
      {/* 4단계 */}
      {STEPS.map((s, i) => {
        const x = 18 + i * 74
        const from = 0.15 + i * 0.2
        return (
          <g key={s.title}>
            <rect x={x} y="96" width="64" height="40" rx="6" className="cf-b-step" />
            {animate && (
              <rect x={x} y="96" width="64" height="40" rx="6" className="cf-b-step on" opacity="0">
                <Anim attr="opacity" points={[[from, 0], [from + 0.01, 1], [from + 0.2, 1], [from + 0.21, 0]]} dur={DUR} />
              </rect>
            )}
            <text x={x + 32} y="113" textAnchor="middle" className="cf-sub dark strong">
              {i + 1}. {s.title}
            </text>
            <text x={x + 32} y="127" textAnchor="middle" className="cf-sub">
              {s.sub}
            </text>
            {i < 3 && <text x={x + 69} y="120" textAnchor="middle" className="cf-sub">›</text>}
          </g>
        )
      })}
      {animate ? (
        <StepCaption
          dur={DUR}
          x={160}
          y={160}
          items={[
            [0, 0.15, '프로브 카드의 미세한 핀이 웨이퍼에 닿아 전기를 보냄'],
            [0.15, 0.35, '전기 특성을 재고, 열과 전압으로 잠재 불량을 찾음'],
            [0.35, 0.55, '상온보다 높고 낮은 온도에서도 검사'],
            [0.55, 0.75, '수선 가능한 칩(노랑)을 고쳐 양품으로'],
            [0.75, 1, '불량 칩에 표시 · 지금은 Data로만 판별하기도 함'],
          ]}
        />
      ) : (
        <text x="160" y="160" textAnchor="middle" className="cf-sub">
          초록 = 양품 · 빨강(점) = 불량 표시
        </text>
      )}
      <text x="160" y="176" textAnchor="middle" className="cf-sub">
        FAB 공정과 패키지 공정 사이에서 진행
      </text>
    </svg>
  )
}

// 웨이퍼 맵과 수율: 칩을 차례로 판정하고 양품 비율을 셈
const GRID = (() => {
  const cells = []
  const cx = 92
  const cy = 92
  const r = 66
  const size = 16
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const x = cx - 64 + col * size
      const y = cy - 64 + row * size
      const mx = x + size / 2 - cx
      const my = y + size / 2 - cy
      if (Math.hypot(mx + Math.sign(mx) * 7, my + Math.sign(my) * 7) <= r) cells.push({ x, y })
    }
  }
  return cells
})()
const BAD_CELLS = new Set([2, 9, 17, 30, 41])
const REPAIR_CELLS = new Set([12, 25, 36])

export function WaferMapYield({ animate = true }) {
  const total = GRID.length
  const good = total - BAD_CELLS.size
  const pct = Math.round((good / total) * 100)
  return (
    <svg viewBox="0 0 320 180" className="il cf" role="img" aria-label="웨이퍼 맵의 양품·불량과 수율">
      <circle cx="92" cy="92" r="74" className="cf-b-wafer" />
      {GRID.map((c, i) => {
        const bad = BAD_CELLS.has(i)
        const rep = REPAIR_CELLS.has(i)
        const t = 0.05 + (i / total) * 0.45
        const final = bad ? '#e57373' : '#7fcf9a'
        return (
          <g key={i}>
            <rect x={c.x + 1} y={c.y + 1} width="14" height="14" rx="1.5" className="cf-b-die" style={animate ? undefined : { fill: final }}>
              {animate && (
                <Anim
                  attr="fill"
                  points={[
                    [t, '#c7cdd6'],
                    [t + 0.005, bad ? '#e57373' : rep ? '#f2c464' : '#7fcf9a'],
                    [0.6, bad ? '#e57373' : rep ? '#f2c464' : '#7fcf9a'],
                    [0.66, final],
                  ]}
                  dur={DUR}
                />
              )}
            </rect>
            {bad && (
              <Show animate={animate} from={0.7}>
                <circle cx={c.x + 8} cy={c.y + 8} r="3" className="cf-b-ink" />
              </Show>
            )}
          </g>
        )
      })}
      {/* 범례와 수율 */}
      <rect x="184" y="30" width="10" height="10" className="cf-b-die" style={{ fill: '#7fcf9a' }} />
      <text x="200" y="39" className="cf-sub dark">양품(Prime Good)</text>
      <rect x="184" y="48" width="10" height="10" className="cf-b-die" style={{ fill: '#f2c464' }} />
      <text x="200" y="57" className="cf-sub dark">수선 가능 → Repair</text>
      <rect x="184" y="66" width="10" height="10" className="cf-b-die" style={{ fill: '#e57373' }} />
      <text x="200" y="75" className="cf-sub dark">불량 → 표시</text>
      <Show animate={animate} from={0.78}>
        <rect x="178" y="92" width="134" height="52" rx="6" className="cf-b-note" />
        <text x="245" y="108" textAnchor="middle" className="cf-sub dark">
          수율 = 양품 ÷ 최대 칩 × 100
        </text>
        <text x="245" y="128" textAnchor="middle" className="cf-b-yield">
          {good} ÷ {total} × 100 ≈ {pct}%
        </text>
        <text x="245" y="140" textAnchor="middle" className="cf-sub">
          (이 그림의 예)
        </text>
      </Show>
      {animate && (
        <StepCaption
          dur={DUR}
          x={160}
          y={174}
          items={[
            [0, 0.55, '칩을 하나씩 검사해 양품·불량을 가림'],
            [0.55, 0.7, '수선 가능한 칩은 고쳐서 양품으로'],
            [0.7, 1, '불량 칩을 미리 골라 패키징 효율을 높임'],
          ]}
        />
      )}
    </svg>
  )
}
