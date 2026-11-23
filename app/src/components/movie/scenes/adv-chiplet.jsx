import { Callout, Tag, anim } from '../kit.jsx'

// 첨단 패키지 5: 칩렛. 자막은 data/processMovies/adv-chiplet.js (직접 그린 그림)

// 큰 칩 하나 → 기능별 작은 칩(칩렛) 여러 개
const Split = ({ B }) => {
  const parts = [
    { x: 0, y: 0, label: '연산' },
    { x: 1, y: 0, label: '연산' },
    { x: 0, y: 1, label: '입출력' },
    { x: 1, y: 1, label: '메모리 연결' },
  ]
  return (
    <g>
      <g style={anim('mv-fadeout', B(1), 0.6)}>
        <rect x="100" y="40" width="120" height="90" rx="4" className="m-si" />
        <text x="160" y="90" textAnchor="middle" className="mv-block-label">
          큰 칩 하나
        </text>
      </g>
      {parts.map((p, i) => (
        <g key={i} style={{ ...anim('mv-spread2', B(1), 1), '--sx': `${(p.x - 0.5) * 70}px`, '--sy': `${(p.y - 0.5) * 30}px` }}>
          <g style={anim('mv-fade', B(1), 0.5)}>
            <rect x={102 + p.x * 59} y={42 + p.y * 44} width="56" height="42" rx="3" className={p.label === '연산' ? 'm-si' : 'mv-chiplet-io'} />
            <text x={130 + p.x * 59} y={67 + p.y * 44} textAnchor="middle" className="mv-block-label small">
              {p.label}
            </text>
          </g>
        </g>
      ))}
      <Tag x={160} y={150} anchor="middle" at={B(1) + 1} strong>
        기능별로 나눠 만든 작은 칩 = 칩렛
      </Tag>
    </g>
  )
}

// 기판 속 작은 다리(브리지)로 칩렛끼리 이음
const Connect = ({ B }) => (
  <g>
    <rect x="30" y="100" width="260" height="34" rx="2" className="mv-subst" />
    {[44, 116, 188, 260 - 12].map((x, i) => (
      <rect key={i} x={x} y="62" width="60" height="34" rx="2" className={i % 3 === 0 ? 'mv-chiplet-io' : 'm-si'} style={anim('mv-drop', 0.3 + i * 0.25, 0.5)} />
    ))}
    {[80, 152, 224].map((x, i) => (
      <rect key={x} x={x} y="100" width="44" height="7" rx="1" className="mv-bridge" style={anim('mv-fade', B(1) + i * 0.2, 0.5)} />
    ))}
    <Callout x={102} y={104} tx={14} ty={40} text="기판 속 작은 다리(브리지)" at={B(1)} />
    <Tag x={160} y={150} anchor="middle" at={B(1) + 0.8} strong>
      칩렛끼리 짧고 촘촘하게 연결
    </Tag>
  </g>
)

export default {
  id: 'adv-chiplet',
  scenes: {
    split: { beat: 3.8, draw: (B) => <Split B={B} /> },
    connect: { beat: 3.8, draw: (B) => <Connect B={B} /> },
  },
}
