import { anim, Callout, Tag } from '../kit.jsx'

// RDL(재배선) 애니메이션 그림(직접 그린 그림). 자막은 data/processMovies/rdl.js

// 위에서 본 칩: 가운데 패드 → 금속선이 가장자리 새 패드로
const Reroute = ({ B }) => {
  const center = [64, 76, 88, 100, 112].map((y) => [160, y])
  const edge = [
    [96, 40],
    [224, 40],
    [96, 136],
    [224, 136],
    [260, 88],
  ]
  return (
    <g>
      <rect x="80" y="30" width="160" height="116" rx="4" className="m-si" />
      {center.map(([x, y]) => (
        <rect key={y} x={x - 4} y={y - 4} width="8" height="8" className="m-metal" />
      ))}
      <Callout x={164} y={64} tx={300} ty={20} text="원래 패드(가운데)" at={0.3} anchor="end" />
      {center.map(([x, y], i) => {
        const [ex, ey] = edge[i]
        return (
          <g key={i}>
            <path d={`M${x} ${y} L${ex} ${ey}`} className="mv-rdl draw" pathLength="1" style={anim('mv-draw', B(1) + i * 0.3, 0.6)} />
            <circle cx={ex} cy={ey} r="5" className="mv-solder" style={anim('mv-fade', B(1) + i * 0.3 + 0.5, 0.3)} />
          </g>
        )
      })}
      <Tag x={40} y={100} anchor="middle" at={B(1)} strong>
        금속층을
      </Tag>
      <Tag x={40} y={112} anchor="middle" at={B(1)} strong>
        더 깔아
      </Tag>
      <Tag x={40} y={124} anchor="middle" at={B(1)} strong>
        패드를 옮김
      </Tag>
    </g>
  )
}

// 만드는 단계: 씨앗층 → 감광액 무늬 → 도금 → 감광액 제거 → 씨앗층 식각
const Steps = ({ B }) => {
  const labels = ['스퍼터(씨앗층)', '포토(무늬)', '도금', '감광액 제거', '금속 식각']
  return (
    <g>
      {labels.map((t, i) => (
        <g key={t} style={anim('mv-rise', 0.3 + i * ((B(1) + 2) / 5), 0.5)}>
          <rect x={12 + i * 61} y="70" width="56" height="40" rx="6" className="mv-legendbox" />
          <text x={40 + i * 61} y="94" textAnchor="middle" className="mv-tag">
            {t}
          </text>
          {i < 4 && <path d={`M${67 + i * 61} 90 h5`} className="mv-arrow" markerEnd="url(#mv-head)" />}
        </g>
      ))}
      <Tag x={160} y={40} anchor="middle" at={0.2} strong>
        웨이퍼 레벨 패키지의 공통 단계
      </Tag>
    </g>
  )
}

export default {
  id: 'rdl',
  scenes: {
    reroute: { beat: 3.6, draw: (B) => <Reroute B={B} />, legend: ['si', 'metal'] },
    steps: { beat: 3.8, draw: (B) => <Steps B={B} /> },
  },
}
