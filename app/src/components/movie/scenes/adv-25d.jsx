import { Ball, Callout, Flow, Tag, anim } from '../kit.jsx'

// 첨단 패키지 2: 2.5D 패키지. 자막은 data/processMovies/adv-25d.js (직접 그린 단면도)

// 아래에서 위로: 솔더볼 → 기판 → (범프) → 인터포저(TSV) → (마이크로 범프) → GPU·HBM
const Build = ({ B }) => (
  <g>
    <g style={anim('mv-rise', 0.2, 0.6)}>
      {Array.from({ length: 11 }, (_, i) => (
        <Ball key={i} cx={46 + i * 23} cy={146} r={5} tone="silver" />
      ))}
      <rect x="30" y="126" width="260" height="14" rx="2" className="mv-subst" />
    </g>
    <g style={anim('mv-drop', B(1) - 1.4, 0.8)}>
      {Array.from({ length: 14 }, (_, i) => (
        <Ball key={i} cx={58 + i * 15.5} cy={123} r={2.6} tone="silver" />
      ))}
      <rect x="50" y="104" width="220" height="16" className="mv-interposer" />
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={66 + i * 21} y="104" width="2.2" height="16" className="m-metal" />
      ))}
    </g>
    <g style={anim('mv-drop', B(1) + 0.2, 0.8)}>
      {Array.from({ length: 20 }, (_, i) => (
        <Ball key={i} cx={62 + i * 10.4} cy={101.5} r={1.6} tone="gold" />
      ))}
      <rect x="62" y="64" width="100" height="36" rx="2" className="m-si" />
      <text x="112" y="86" textAnchor="middle" className="mv-block-label">
        GPU
      </text>
    </g>
    <g style={anim('mv-drop', B(1) + 0.8, 0.8)}>
      {[176, 222].map((x) => (
        <g key={x}>
          {Array.from({ length: 6 }, (_, i) => (
            <rect key={i} x={x} y={92 - i * 7} width="40" height="6" rx="1" className="mv-hbm" />
          ))}
        </g>
      ))}
      <text x="219" y="46" textAnchor="middle" className="mv-tag strong">
        HBM
      </text>
    </g>
    <Callout x={60} y={112} tx={10} ty={40} text="인터포저" at={B(1) - 0.6} />
    <Callout x={70} y={133} tx={10} ty={112} text="기판" at={0.6} />
    <Callout x={120} y={101} tx={150} ty={20} text="마이크로 범프" at={B(2)} />
  </g>
)

// 인터포저 속 촘촘한 배선으로 GPU와 HBM이 짧게 이어짐
const Paths = ({ B }) => (
  <g>
    <rect x="30" y="94" width="260" height="30" className="mv-interposer" />
    <rect x="44" y="40" width="120" height="52" rx="2" className="m-si" />
    <text x="104" y="70" textAnchor="middle" className="mv-block-label">
      GPU
    </text>
    {Array.from({ length: 6 }, (_, i) => (
      <rect key={i} x="196" y={82 - i * 9} width="70" height="8" rx="1" className="mv-hbm" />
    ))}
    {[0, 1, 2, 3].map((i) => (
      <path key={i} d={`M${140 + i * 6} 94 V${102 + i * 5} H${206 + i * 6} V94`} className="mv-rdl-line" style={anim('mv-fade', 0.4 + i * 0.2, 0.4)} />
    ))}
    {[0, 1, 2, 3].map((i) => (
      <Flow key={i} d={`M${140 + i * 6} 94 V${102 + i * 5} H${206 + i * 6} V94`} n={3} dur={1.2} at={B(1) + i * 0.1} r={1.6} tone="gold" />
    ))}
    <Tag x={160} y={140} anchor="middle" at={B(1)} strong>
      아주 가늘고 촘촘한 배선 → 많은 신호를 짧게
    </Tag>
  </g>
)

export default {
  id: 'adv-25d',
  scenes: {
    build: { beat: 3.8, draw: (B) => <Build B={B} /> },
    paths: { beat: 3.8, draw: (B) => <Paths B={B} /> },
  },
}
