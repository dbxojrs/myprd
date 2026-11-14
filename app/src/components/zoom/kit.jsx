// 확대 스토리 장면 그림에 쓰는 SMIL 도우미.
// 장면마다 svg를 새로 그리므로 0초 = 장면 시작입니다. 시각은 모두 "장면 시작 뒤 몇 초"로 적습니다.

const sec = (t) => `${+t.toFixed(3)}s`

// keys: [[초, 값], ...]. 첫 시각에 시작해 마지막 값에서 멈춥니다. loop이면 같은 구간을 계속 되풀이합니다.
// 같은 시각이 겹치면 순서를 지키도록 아주 조금씩 밉니다.
function timing(keys, loop) {
  const t0 = keys[0][0]
  const span = Math.max(keys[keys.length - 1][0] - t0, 0.001)
  const times = []
  keys.forEach(([t], i) => {
    const k = (t - t0) / span
    times.push(i > 0 && k <= times[i - 1] ? times[i - 1] + 0.0002 : k)
  })
  times[times.length - 1] = 1
  return {
    values: keys.map(([, v]) => v).join(';'),
    keyTimes: times.map((k) => +Math.min(k, 1).toFixed(5)).join(';'),
    begin: sec(t0),
    dur: sec(span),
    ...(loop ? { repeatCount: 'indefinite' } : { fill: 'freeze' }),
  }
}

// 속성 하나를 시각표대로 바꿉니다. 시작 전에는 요소에 적은 원래 값이 보이니, 원래 값을 첫 값과 같게 둡니다.
export const Keys = ({ attr, keys, loop = false }) => <animate attributeName={attr} {...timing(keys, loop)} />

// 위치(translate 'x y')나 회전(rotate '각도 cx cy')을 시각표대로 바꿉니다.
export const Path = ({ keys, loop = false, type = 'translate' }) => (
  <animateTransform attributeName="transform" type={type} {...timing(keys, loop)} />
)

// at초에 서서히 나타납니다.
export const Appear = ({ at, fade = 0.6, children }) => (
  <g opacity="0">
    {children}
    <Keys attr="opacity" keys={[[at, 0], [at + fade, 1]]} />
  </g>
)

// at초에 서서히 사라집니다.
export const Vanish = ({ at, fade = 0.6, children }) => (
  <g>
    {children}
    <Keys attr="opacity" keys={[[at, 1], [at + fade, 0]]} />
  </g>
)

// (cx, cy)를 중심으로 계속 돕니다. period초에 angle도(음수면 반대 방향). from초부터 돌기 시작합니다.
export const Spin = ({ cx, cy, period, angle = 360, from = 0, children }) => (
  <g>
    {children}
    <animateTransform
      attributeName="transform"
      type="rotate"
      from={`0 ${cx} ${cy}`}
      to={`${angle} ${cx} ${cy}`}
      begin={sec(from)}
      dur={sec(period)}
      repeatCount="indefinite"
    />
  </g>
)

// 그림 위 설명 글자. 배경색 테두리를 둘러 어떤 그림 위에서도 읽히게 합니다.
export const Note = ({ x, y, anchor = 'middle', at, className = '', children }) => {
  const text = (
    <text x={x} y={y} textAnchor={anchor} className={`zs-note ${className}`}>
      {children}
    </text>
  )
  return at === undefined ? text : <Appear at={at}>{text}</Appear>
}

// 가리키는 선과 설명. from은 가리키는 곳, to는 글자 자리입니다.
export const Callout = ({ from, to, anchor = 'start', at, children }) => {
  const [x, y] = to
  const tx = anchor === 'start' ? x + 1.5 : anchor === 'end' ? x - 1.5 : x
  const ty = anchor === 'middle' ? y - 2 : y + 2
  const body = (
    <>
      <line x1={from[0]} y1={from[1]} x2={x} y2={y} className="zs-pointer" />
      <circle cx={from[0]} cy={from[1]} r="0.9" className="zs-pointer-dot" />
      <text x={tx} y={ty} textAnchor={anchor} className="zs-note">
        {children}
      </text>
    </>
  )
  return at === undefined ? <g>{body}</g> : <Appear at={at}>{body}</Appear>
}

// 고정된 씨앗값으로 만드는 난수. 그림이 매번 같게 나옵니다.
export function seeded(seed) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// (x, y)를 중심으로 반지름 r 안팎의 울퉁불퉁한 다각형(입자·가루 모양)
export function grain(rand, x, y, r, sides = 5) {
  const turn = rand() * Math.PI
  return Array.from({ length: sides }, (_, i) => {
    const a = turn + (i / sides) * Math.PI * 2
    const k = 0.7 + rand() * 0.45
    return `${(x + Math.cos(a) * r * k).toFixed(1)},${(y + Math.sin(a) * r * k).toFixed(1)}`
  }).join(' ')
}
