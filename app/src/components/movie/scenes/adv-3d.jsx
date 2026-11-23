import { Callout, Flow, Tag, anim } from '../kit.jsx'

// 첨단 패키지 3: 3D 적층과 HBM. 자막은 data/processMovies/adv-3d.js (직접 그린 단면도)
const X = 90
const W = 140
const TSV = [110, 140, 170, 200]

// 받침 칩 위에 메모리 칩이 한 장씩 쌓이고 TSV로 이어짐
const Stack = ({ B }) => (
  <g>
    <rect x={X - 10} y="138" width={W + 20} height="14" rx="2" className="m-si" />
    <text x={X + W / 2} y="149" textAnchor="middle" className="mv-block-label">
      받침(로직) 칩
    </text>
    {Array.from({ length: 8 }, (_, i) => {
      const y = 126 - i * 13
      return (
        <g key={i} style={anim('mv-drop', 0.3 + i * ((B(1) + 1.5) / 8), 0.5)}>
          <rect x={X} y={y} width={W} height="10" rx="1" className="mv-hbm" />
          {TSV.map((x) => (
            <rect key={x} x={x} y={y} width="2.4" height="13" className="m-metal" />
          ))}
        </g>
      )
    })}
    <Callout x={X + W} y={90} tx={300} ty={60} text="DRAM 칩 여러 장" at={B(1)} anchor="end" />
    <Callout x={TSV[1] + 1} y={74} tx={20} ty={40} text="TSV(관통 전극)" at={B(1) + 0.5} />
    {TSV.map((x, i) => (
      <Flow key={x} d={`M${x + 1.2} 138 V30`} n={3} dur={1.4} at={B(2) + i * 0.1} r={1.6} tone="gold" />
    ))}
    <Tag x={160} y={16} anchor="middle" at={B(2)} strong>
      수많은 통로로 한꺼번에 데이터를 주고받음
    </Tag>
  </g>
)

// 칩 사이 틈 메우기: 필름(NCF) vs 액체를 한 번에(MR-MUF)
const Fill = ({ B }) => (
  <g>
    {[0, 1].map((k) => {
      const x0 = k === 0 ? 30 : 180
      return (
        <g key={k}>
          <rect x={x0} y="132" width="110" height="10" rx="2" className="m-si" />
          {Array.from({ length: 5 }, (_, i) => (
            <rect key={i} x={x0 + 10} y={118 - i * 16} width="90" height="10" rx="1" className="mv-hbm" />
          ))}
          {k === 0
            ? Array.from({ length: 5 }, (_, i) => (
                <rect key={i} x={x0 + 10} y={128 - i * 16} width="90" height="4" className="mv-ncf" style={anim('mv-fade', 0.4 + i * 0.25, 0.4)} />
              ))
            : (
              <g className="mv-box" style={anim('mv-grow', B(1), 2)}>
                <rect x={x0 + 4} y={40} width="102" height="92" rx="3" className="mv-muf" />
              </g>
            )}
          <text x={x0 + 55} y="154" textAnchor="middle" className="mv-tag strong">
            {k === 0 ? '층마다 필름(NCF)' : '쌓은 뒤 액체로 한 번에(MR-MUF)'}
          </text>
        </g>
      )
    })}
    <Tag x={160} y={24} anchor="middle" at={0.2} strong>
      칩과 칩 사이를 메워 접합을 보호
    </Tag>
  </g>
)

export default {
  id: 'adv-3d',
  scenes: {
    stack: { beat: 3.8, draw: (B) => <Stack B={B} /> },
    fill: { beat: 3.8, draw: (B) => <Fill B={B} /> },
  },
}
