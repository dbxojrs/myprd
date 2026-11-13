// 입체(아이소메트릭) 장비 그림 도구. 장비 좌표(x: 오른쪽 아래, y: 왼쪽 아래, z: 위)를 화면 좌표로 바꿔
// 상자·원기둥을 그립니다. 보이는 면은 윗면(top), 왼쪽 앞면(left), 오른쪽 앞면(right) 세 개입니다.

export const S = 14 // 한 칸 크기(px)
export const ORIGIN = [185, 150] // 그림 안에서 (0,0,0)의 위치

export function P(x, y, z = 0) {
  return [ORIGIN[0] + (x - y) * 0.866 * S, ORIGIN[1] + (x + y) * 0.5 * S - z * S]
}

const pts = (list) => list.map((p) => p.join(',')).join(' ')

// 직육면체. tone: 색 묶음(eq-tone-*), hl: 강조, dim: 흐리게, glass: 반투명 외곽
export function Box({ x, y, z = 0, w, d, h, tone = 'metal', className = '', glass = false }) {
  const top = [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)]
  const left = [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)]
  const right = [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)]
  return (
    <g className={`eq-box eq-tone-${tone}${glass ? ' glass' : ''} ${className}`}>
      <polygon points={pts(left)} className="f-left" />
      <polygon points={pts(right)} className="f-right" />
      <polygon points={pts(top)} className="f-top" />
    </g>
  )
}

// 세운 원기둥(반응관·스핀들 등). 아래 중심 (x,y,z), 반지름 r, 높이 h
export function Cylinder({ x, y, z = 0, r, h, tone = 'glass', className = '' }) {
  const [bx, by] = P(x, y, z)
  const [tx, ty] = P(x, y, z + h)
  const rx = r * S * 1.0
  const ry = r * S * 0.5
  return (
    <g className={`eq-cyl eq-tone-${tone} ${className}`}>
      <path d={`M${bx - rx},${by} L${tx - rx},${ty} L${tx + rx},${ty} L${bx + rx},${by} A${rx},${ry} 0 0 1 ${bx - rx},${by} Z`} className="f-left" />
      <ellipse cx={tx} cy={ty} rx={rx} ry={ry} className="f-top" />
    </g>
  )
}

// 부위 이름표: 부위 위치에서 선을 그어 글을 붙입니다.
export function Tag({ at, dx = 0, dy = -18, children, anchor = 'middle' }) {
  const [x, y] = at
  return (
    <g className="eq-tag">
      <line x1={x} y1={y} x2={x + dx} y2={y + dy + 4} />
      <text x={x + dx} y={y + dy} textAnchor={anchor}>
        {children}
      </text>
    </g>
  )
}

// 부위 묶음. 강조(hl)·흐리게(dim)·클릭으로 고르기
export function Part({ id, focus, onPick, children, label }) {
  const state = focus ? (focus === id ? ' hl' : ' dim') : ''
  return (
    <g
      className={`eq-part${state}`}
      data-part={id}
      role={onPick ? 'button' : undefined}
      tabIndex={onPick ? 0 : undefined}
      aria-label={label}
      onClick={onPick ? () => onPick(id) : undefined}
      onKeyDown={onPick ? (e) => (e.key === 'Enter' || e.key === ' ') && onPick(id) : undefined}
    >
      {children}
    </g>
  )
}

// 로트(FOUP) 표시: 부위 사이를 미끄러지듯 옮겨 다닙니다.
export function LotToken({ at, label = 'LOT' }) {
  if (!at) return null
  const [x, y] = at
  return (
    <g className="eq-lot" style={{ transform: `translate(${x}px, ${y}px)` }}>
      <rect x="-9" y="-16" width="18" height="13" rx="2" />
      <text x="0" y="-7" textAnchor="middle">
        {label}
      </text>
      <circle r="3" className="eq-lot-dot" />
    </g>
  )
}
