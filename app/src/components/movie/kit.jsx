// 공정 애니메이션 그리기 도구. 모든 그림은 이 앱에서 직접 그린 SVG입니다(외부 그림을 따라 그리지 않음).
// 무대 크기: viewBox 0 0 320 180. 단면도는 아래쪽이 실리콘 웨이퍼, 위로 막이 쌓입니다.
// 움직임은 CSS 애니메이션으로 하고, 플레이어가 Web Animations API로 멈춤·속도·되감기를 조절합니다.

export const W = 320
export const H = 180
export const SI_TOP = 132 // 실리콘 윗면 y

// 재료 색 (범례와 같은 이름)
export const MAT = {
  si: { label: '실리콘(Si)', cls: 'm-si' },
  oxide: { label: '산화막(SiO₂)', cls: 'm-oxide' },
  pr: { label: '감광액(PR)', cls: 'm-pr' },
  prx: { label: '빛 받은 감광액', cls: 'm-prx' },
  film: { label: '증착막', cls: 'm-film' },
  nitride: { label: '질화막', cls: 'm-nitride' },
  metal: { label: '금속(구리·알루미늄)', cls: 'm-metal' },
  barrier: { label: '배리어 막', cls: 'm-barrier' },
  doped: { label: '불순물이 들어간 영역', cls: 'm-doped' },
  mask: { label: '마스크', cls: 'm-mask' },
}

// 애니메이션 한 줄: 이름, 시작(초), 길이(초)
export const anim = (name, at = 0, dur = 1, { ease = 'cubic-bezier(.3,.7,.3,1)', iter = 1, fill = 'both' } = {}) => ({
  animation: `${name} ${dur}s ${ease} ${at}s ${iter === Infinity ? 'infinite' : iter} ${fill}`,
})
// 반복 애니메이션 (at초에 시작해 계속)
export const loop = (name, at = 0, dur = 1, ease = 'linear') => ({ animation: `${name} ${dur}s ${ease} ${at}s infinite both` })

// 사각형 막 하나. enter: 나타나는 방식, exit: 사라지는 방식
// origin: 자라거나 사라질 때 기준(bottom 아래에서 위로 | top 위에서 아래로 | left | center)
export function Slab({ x = 0, y, w = W, h, mat = 'oxide', enter, at = 0, dur = 1.2, exit, exitAt = 0, exitDur = 1, rx = 0, origin = 'bottom', exitOrigin, className = '' }) {
  const rect = <rect x={x} y={y} width={w} height={h} rx={rx} className={`${MAT[mat]?.cls ?? mat} ${className}`} />
  const box = (o) => `mv-box${o && o !== 'bottom' ? ` ${o}` : ''}`
  let node = rect
  if (exit) node = <g className={box(exitOrigin ?? origin)} style={anim(exit, exitAt, exitDur)}>{node}</g>
  if (enter) node = <g className={box(origin)} style={anim(enter, at, dur)}>{node}</g>
  return node
}

// 실리콘 웨이퍼 단면 (아래 바탕)
export const Substrate = ({ label = true }) => (
  <g>
    <rect x="0" y={SI_TOP} width={W} height={H - SI_TOP} className="m-si" />
    <path d={`M0 ${SI_TOP + 18} H${W}`} className="mv-hatch" />
    {label && (
      <text x="8" y={H - 8} className="mv-tag">
        실리콘 웨이퍼
      </text>
    )}
  </g>
)

// 글자 표시 (at초에 나타남)
export const Tag = ({ x, y, children, at = 0, anchor = 'start', strong = false }) => (
  <text x={x} y={y} textAnchor={anchor} className={`mv-tag${strong ? ' strong' : ''}`} style={anim('mv-fade', at, 0.5)}>
    {children}
  </text>
)

// 글자 폭 대략 계산 (한글은 글자 크기만큼, 영문·숫자는 그 0.6배)
const textWidth = (text, size) => [...String(text)].reduce((w, ch) => w + (/[\u3131-\uD79D]/.test(ch) ? size : size * 0.6), 0)

// 괄호 라벨: 「[ 글자 ]」 모양 라벨에서 휘어진 화살표가 (x, y)를 가리킵니다.
// tx, ty: 라벨 글자의 기준점, anchor: start면 라벨이 tx에서 오른쪽으로, end면 왼쪽으로 놓입니다.
export function Callout({ x, y, tx, ty, text, at = 0, anchor = 'start' }) {
  const size = 8.5
  const w = textWidth(text, size)
  const bw = w + 14
  const bh = 14
  // 화면 밖으로 나가지 않게 안쪽으로 밀어 넣습니다.
  const bx = Math.min(Math.max(anchor === 'end' ? tx - bw : tx, 3), W - 3 - bw)
  const by = Math.min(Math.max(ty - 10.5, 2), H - 2 - 14)
  const c = 3.5 // 괄호 모서리 길이
  // 화살표 시작점: 라벨 상자에서 가리킬 곳과 가까운 쪽
  const sx = Math.min(Math.max(x, bx + 4), bx + bw - 4)
  const sy = y > by + bh ? by + bh + 1.5 : y < by ? by - 1.5 : by + bh / 2
  const midX = (sx + x) / 2 + (x > sx ? -6 : 6)
  const midY = (sy + y) / 2 + (y > sy ? -6 : 6)
  return (
    <g style={anim('mv-fade', at, 0.5)} className="mv-callout">
      <path d={`M${sx} ${sy} Q${midX} ${midY} ${x} ${y}`} className="mv-leader" markerEnd="url(#mv-head-dark)" />
      <path
        d={`M${bx + c} ${by} H${bx} V${by + bh} H${bx + c} M${bx + bw - c} ${by} H${bx + bw} V${by + bh} H${bx + bw - c}`}
        className="mv-bracket"
      />
      <text x={bx + bw / 2} y={by + 10.5} textAnchor="middle" className="mv-tag strong">
        {text}
      </text>
    </g>
  )
}

// 내려오는 입자들 (가스·이온·원자). 여러 줄로 시간차를 두고 반복합니다.
export function Rain({ x0 = 20, x1 = 300, y0 = 10, y1 = SI_TOP, n = 14, at = 0, dur = 1.4, cls = 'mv-gas', r = 2, angle = 0, until }) {
  const items = []
  for (let i = 0; i < n; i++) {
    const x = x0 + ((x1 - x0) * (i + 0.5)) / n
    const delay = at + ((i * 7) % n) * (dur / n)
    items.push(
      <circle
        key={i}
        cx={x}
        cy={y0}
        r={r}
        className={cls}
        style={{ ...loop('mv-fall', delay, dur, 'cubic-bezier(.5,0,1,1)'), '--fall': `${y1 - y0}px`, '--drift': `${angle}px` }}
      />,
    )
  }
  const g = <g>{items}</g>
  return until ? <g style={anim('mv-fadeout', until, 0.6)}>{g}</g> : g
}

// 빛줄기 (노광)
export function Rays({ xs, y0 = 8, y1 = 100, at = 0, until, w = 10 }) {
  const node = (
    <g style={anim('mv-fade', at, 0.4)}>
      {xs.map((x, i) => (
        <g key={i}>
          <rect x={x - w / 2} y={y0} width={w} height={y1 - y0} className="mv-ray" />
          <path d={`M${x} ${y0} V${y1}`} className="mv-ray-core" style={loop('mv-flow', at, 0.6)} />
        </g>
      ))}
    </g>
  )
  return until ? <g style={anim('mv-fadeout', until, 0.5)}>{node}</g> : node
}

// 열 표시 (구불구불 아지랑이)
export const Heat = ({ xs = [40, 100, 160, 220, 280], y = 40, at = 0 }) => (
  <g style={anim('mv-fade', at, 0.6)}>
    {xs.map((x, i) => (
      <path key={i} d={`M${x} ${y + 24} q4 -6 0 -12 q-4 -6 0 -12`} className="mv-heat" style={loop('mv-heat', at + i * 0.2, 1.4, 'ease-in-out')} />
    ))}
  </g>
)

// 화살표
export const Arrow = ({ x1, y1, x2, y2, at = 0, cls = '' }) => (
  <g style={anim('mv-fade', at, 0.4)} className={cls}>
    <path d={`M${x1} ${y1} L${x2} ${y2}`} className="mv-arrow" markerEnd="url(#mv-head)" />
  </g>
)

// 재료 광택 (위가 밝고 아래가 어두운 세로 그라데이션)
const SLAB_GRADIENTS = {
  si: ['#7a7d82', '#55585d'],
  oxide: ['#a9e2f5', '#62bfe0'],
  pr: ['#f6b26b', '#e08a35'],
  prx: ['#fbe3c2', '#f2c894'],
  film: ['#8fd3a4', '#4fa874'],
  nitride: ['#b8a5ea', '#8a74cf'],
  metal: ['#f2c15c', '#c98e22'],
  barrier: ['#9aa3b5', '#6d7689'],
  doped: ['#ef7d52', '#c9471f'],
  mask: ['#3a3d44', '#1f2126'],
}
// 구슬(원자·이온·전자) 그라데이션: [밝은 점, 본색, 그림자색]
const SPHERES = {
  teal: ['#c8fff0', '#3cc7a5', '#1e7e68'],
  orange: ['#ffe2bf', '#f7871f', '#b2510b'],
  blue: ['#d7e6ff', '#3f7be8', '#1d3f99'],
  gold: ['#fff2c2', '#e0a92b', '#9c6d0e'],
  silver: ['#ffffff', '#c3c9d3', '#7d8594'],
  pink: ['#ffd9e2', '#f0587d', '#a51f45'],
  gray: ['#f2f4f7', '#a3aab6', '#646c7a'],
  cyan: ['#e3fbff', '#46c6e6', '#16809c'],
}

// 공용 정의 (화살촉, 재료 광택, 구슬 질감)
export const Defs = () => (
  <defs>
    <marker id="mv-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" className="mv-arrowhead" />
    </marker>
    <marker id="mv-head-dark" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M0 1 L9 5 L0 9" fill="none" stroke="#6b717c" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </marker>
    <linearGradient id="mv-si" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#7a7d82" />
      <stop offset="1" stopColor="#4f5257" />
    </linearGradient>
    {Object.entries(SLAB_GRADIENTS).map(([k, [a, b]]) => (
      <linearGradient key={k} id={`g-${k}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={a} />
        <stop offset="0.55" stopColor={b} />
        <stop offset="1" stopColor={b} stopOpacity="0.92" />
      </linearGradient>
    ))}
    {Object.entries(SPHERES).map(([k, [hi, mid, lo]]) => (
      <radialGradient key={k} id={`s-${k}`} cx="0.36" cy="0.32" r="0.7">
        <stop offset="0" stopColor={hi} />
        <stop offset="0.45" stopColor={mid} />
        <stop offset="1" stopColor={lo} />
      </radialGradient>
    ))}
    <radialGradient id="mv-glow">
      <stop offset="0" className="mv-glow-a" />
      <stop offset="1" className="mv-glow-b" />
    </radialGradient>
    <radialGradient id="mv-flare" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#fffbe6" stopOpacity="0.95" />
      <stop offset="0.4" stopColor="#ffe8a3" stopOpacity="0.5" />
      <stop offset="1" stopColor="#ffd36b" stopOpacity="0" />
    </radialGradient>
  </defs>
)
