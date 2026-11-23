import { Tag, anim } from '../kit.jsx'

// 반도체 기초 7: 트랜지스터의 진화. 자막은 data/processMovies/b-evolution.js (직접 그린 그림)
// 간단한 입체(등각) 그림: 아래 바탕 위에 게이트(회색)가 채널(주황)을 얼마나 감싸는지

// 상자 하나를 입체로: (x, y) 앞면 왼쪽 위, w 너비, h 높이, d 깊이
const Box3 = ({ x, y, w, h, d = 10, cls }) => (
  <g className={cls}>
    <path d={`M${x} ${y} l${d} ${-d * 0.6} h${w} l${-d} ${d * 0.6} Z`} className="top" />
    <path d={`M${x + w} ${y} l${d} ${-d * 0.6} v${h} l${-d} ${d * 0.6} Z`} className="side" />
    <rect x={x} y={y} width={w} height={h} className="front" />
  </g>
)

const Planar = ({ x }) => (
  <g>
    <Box3 x={x} y={98} w={56} h={18} cls="mv-3d-sub" />
    <Box3 x={x + 4} y={92} w={14} h={6} cls="mv-3d-ch" />
    <Box3 x={x + 38} y={92} w={14} h={6} cls="mv-3d-ch" />
    <Box3 x={x + 12} y={78} w={32} h={14} cls="mv-3d-gate" />
  </g>
)
const Fin = ({ x }) => (
  <g>
    <Box3 x={x} y={98} w={56} h={18} cls="mv-3d-sub" />
    <Box3 x={x + 8} y={74} w={40} h={24} cls="mv-3d-gate" />
    <Box3 x={x + 25} y={70} w={6} h={28} d={6} cls="mv-3d-ch" />
  </g>
)
const Gaa = ({ x, sheets = false }) => (
  <g>
    <Box3 x={x} y={98} w={56} h={18} cls="mv-3d-sub" />
    <Box3 x={x + 8} y={66} w={40} h={32} cls="mv-3d-gate" />
    {[0, 1, 2].map((i) => (sheets ? <Box3 key={i} x={x + 14} y={72 + i * 9} w={28} h={3} d={6} cls="mv-3d-ch" /> : <Box3 key={i} x={x + 25} y={72 + i * 9} w={6} h={3} d={6} cls="mv-3d-ch" />))}
  </g>
)

const Evolution = ({ B }) => {
  const items = [
    { x: 14, label: '평면형(Planar)', el: <Planar x={14} /> },
    { x: 92, label: 'FinFET', el: <Fin x={92} /> },
    { x: 170, label: 'GAA(나노와이어)', el: <Gaa x={170} /> },
    { x: 248, label: 'MBCFET(나노시트)', el: <Gaa x={248} sheets /> },
  ]
  return (
    <g>
      {items.map((it, i) => (
        <g key={it.label} style={anim('mv-rise', 0.3 + i * B(1) * 0.5, 0.8)}>
          {it.el}
          <text x={it.x + 33} y={136} textAnchor="middle" className="mv-tag strong">
            {it.label}
          </text>
          {i < 3 && <path d={`M${it.x + 70} 92 h6`} className="mv-arrow" markerEnd="url(#mv-head)" />}
        </g>
      ))}
      <Tag x={160} y={30} anchor="middle" at={B(2)} strong>
        게이트가 채널을 1면 → 3면 → 4면으로 감쌈
      </Tag>
    </g>
  )
}

// 왜? 크기가 작아질수록 새는 전류를 막기 어려워서
const Why = ({ B }) => (
  <g>
    <g style={anim('mv-rise', 0.2, 0.6)}>
      <Planar x={60} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${78 + i * 8} 112 q4 8 0 16`} className="mv-leak" style={anim('mv-fade', 0.8 + i * 0.2, 0.4)} />
      ))}
      <text x="93" y="150" textAnchor="middle" className="mv-tag strong">
        작아지면 전류가 샘
      </text>
    </g>
    <g style={anim('mv-rise', B(1), 0.6)}>
      <Gaa x={200} sheets />
      <text x="233" y="150" textAnchor="middle" className="mv-tag strong">
        감싸면 꽉 잡음
      </text>
    </g>
    <Tag x={160} y={30} anchor="middle" at={0.4} strong>
      게이트가 채널을 더 많이 감쌀수록 전류를 잘 끄고 켬
    </Tag>
  </g>
)

export default {
  id: 'b-evolution',
  scenes: {
    evo: { beat: 3.8, draw: (B) => <Evolution B={B} /> },
    why: { beat: 3.8, draw: (B) => <Why B={B} /> },
  },
}
