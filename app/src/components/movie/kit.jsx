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

// 지시선 + 글자
export const Callout = ({ x, y, tx, ty, text, at = 0, anchor = 'start' }) => (
  <g style={anim('mv-fade', at, 0.5)}>
    <path d={`M${x} ${y} L${tx} ${ty}`} className="mv-leader" />
    <circle cx={x} cy={y} r="1.6" className="mv-dotc" />
    <text x={tx + (anchor === 'end' ? -2 : 2)} y={ty + (ty < y ? -2 : 6)} textAnchor={anchor} className="mv-tag strong">
      {text}
    </text>
  </g>
)

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

// 공용 정의 (화살촉, 무늬)
export const Defs = () => (
  <defs>
    <marker id="mv-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" className="mv-arrowhead" />
    </marker>
    <linearGradient id="mv-si" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" className="mv-si-a" />
      <stop offset="1" className="mv-si-b" />
    </linearGradient>
    <radialGradient id="mv-glow">
      <stop offset="0" className="mv-glow-a" />
      <stop offset="1" className="mv-glow-b" />
    </radialGradient>
  </defs>
)
