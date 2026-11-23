import { Ball, Battery, Block, Callout, Flow, Tag, anim, loop } from '../kit.jsx'

// 반도체 기초 3: PN 접합과 다이오드. 자막은 data/processMovies/b-pn.js (직접 그린 그림)
const X0 = 50
const MID = 160
const X1 = 270
const Y0 = 34
const Y1 = 104

// P(왼쪽, 정공) + N(오른쪽, 전자) 블록. depletion: 가운데 빈 띠 너비(0이면 없음)
const Junction = ({ depAt = null, depW = 26 }) => (
  <g>
    <Block x={X0} y={Y0} w={MID - X0} h={Y1 - Y0} tone="p" />
    <Block x={MID} y={Y0} w={X1 - MID} h={Y1 - Y0} tone="n" />
    {Array.from({ length: 12 }, (_, i) => {
      const x = X0 + 12 + (i % 4) * 24
      const y = Y0 + 12 + Math.floor(i / 4) * 23
      const nearMid = i % 4 === 3
      return <Ball key={`h${i}`} cx={x} cy={y} r={5.5} hole label="+" style={nearMid && depAt !== null ? anim('mv-fadeout', depAt, 0.8) : undefined} />
    })}
    {Array.from({ length: 12 }, (_, i) => {
      const x = MID + 14 + (i % 4) * 24
      const y = Y0 + 12 + Math.floor(i / 4) * 23
      const nearMid = i % 4 === 0
      return <Ball key={`e${i}`} cx={x} cy={y} r={5.5} tone="orange" label="-" style={nearMid && depAt !== null ? anim('mv-fadeout', depAt, 0.8) : undefined} />
    })}
    {depAt !== null && (
      <g className="mv-box center" style={anim('mv-widen', depAt + 0.4, 1)}>
        <rect x={MID - depW / 2} y={Y0} width={depW} height={Y1 - Y0} className="mv-depletion" opacity="0.85" />
      </g>
    )}
    <text x={(X0 + MID) / 2} y={Y1 + 14} textAnchor="middle" className="mv-tag strong">
      P형
    </text>
    <text x={(MID + X1) / 2} y={Y1 + 14} textAnchor="middle" className="mv-tag strong">
      N형
    </text>
  </g>
)

const Join = ({ B }) => (
  <g>
    <Junction depAt={B(1)} />
    <Tag x={160} y={22} anchor="middle" at={0.2} strong>
      P형과 N형을 맞붙임
    </Tag>
    <Callout x={MID} y={70} tx={312} ty={150} text="경계: 전자와 정공이 만나 사라진 빈 띠(공핍층)" at={B(1) + 1} anchor="end" />
  </g>
)

// 전지를 연결: 순방향(흐름) / 역방향(막힘)
const WIRE = `M${X0} 70 H30 V150 H${MID - 40} M${MID + 6} 150 H290 V70 H${X1}`
const Bias = ({ B }) => (
  <g>
    <Junction depAt={-1} depW={14} />
    <path d={WIRE} className="mv-copper" />
    <Battery x={MID - 40} y={150} />
    <Flow d={`M290 70 V150 H${MID + 8}`} n={5} dur={1.6} at={0.6} tone="orange" until={B(2)} />
    <Flow d={`M${MID - 42} 150 H30 V70 H${X0}`} n={5} dur={1.6} at={0.6} tone="orange" until={B(2)} />
    <Tag x={160} y={22} anchor="middle" at={0.2} strong>
      순방향: P에 +, N에 − → 전류가 흐름
    </Tag>
    <g style={anim('mv-fade', B(2), 0.5)}>
      <rect x="70" y="10" width="180" height="20" rx="4" className="mv-legendbox" />
      <text x="160" y="24" textAnchor="middle" className="mv-tag strong">
        반대로 연결하면(역방향) 빈 띠가 넓어져 막힘
      </text>
    </g>
  </g>
)

// 정류(교류 → 한 방향)와 LED
const Rectify = ({ B }) => {
  const sine = Array.from({ length: 61 }, (_, i) => {
    const x = 30 + i * 4
    return `${i ? 'L' : 'M'}${x} ${70 - 26 * Math.sin((i / 60) * 4 * Math.PI)}`
  }).join(' ')
  const half = Array.from({ length: 61 }, (_, i) => {
    const x = 30 + i * 4
    return `${i ? 'L' : 'M'}${x} ${70 - Math.max(0, 26 * Math.sin((i / 60) * 4 * Math.PI))}`
  }).join(' ')
  return (
    <g>
      <path d="M30 70 H270 M30 30 V110" className="mv-axis" />
      <path d={sine} className="mv-wave-ac" pathLength="1" style={anim('mv-draw', 0.3, 1.6)} />
      <g style={anim('mv-fade', 1.6, 0.6)}>
        <path d={half} className="mv-wave-dc" pathLength="1" style={anim('mv-draw', 1.8, 1.6)} />
      </g>
      <Tag x={274} y={52} at={0.4}>
        교류
      </Tag>
      <Tag x={274} y={66} at={1.8} strong>
        → 한 방향만
      </Tag>
      {/* LED: 전자와 정공이 만나며 빛 */}
      <g style={anim('mv-fade', B(1), 0.6)}>
        <Block x={110} y={118} w={50} h={24} tone="p" />
        <Block x={160} y={118} w={50} h={24} tone="n" />
        <circle cx="160" cy="130" r="22" fill="url(#mv-flare)" style={loop('mv-pulse', B(1), 1.2, 'ease-in-out')} />
        <Tag x={220} y={134} strong>
          LED: 만날 때 빛이 남
        </Tag>
      </g>
    </g>
  )
}

export default {
  id: 'b-pn',
  scenes: {
    join: { beat: 3.8, draw: (B) => <Join B={B} /> },
    bias: { beat: 3.8, draw: (B) => <Bias B={B} /> },
    rectify: { beat: 3.8, draw: (B) => <Rectify B={B} /> },
  },
}
