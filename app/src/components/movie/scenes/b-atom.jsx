import { Ball, Callout, Tag, anim, loop } from '../kit.jsx'

// 반도체 기초 1: 원자와 전자. 자막은 data/processMovies/b-atom.js (직접 그린 그림)

// 실리콘 원자 하나와 바깥 전자 4개(천천히 돎)
const Atom = ({ B }) => (
  <g>
    <g className="mv-box center" style={loop('mv-orbit', 0.6, 14)}>
      <circle cx="160" cy="86" r="44" className="mv-orbit-ring" />
      {[0, 90, 180, 270].map((deg) => {
        const rad = (deg * Math.PI) / 180
        return <Ball key={deg} cx={160 + 44 * Math.cos(rad)} cy={86 + 44 * Math.sin(rad)} r={7} tone="orange" style={anim('mv-fade', 0.6 + deg / 300, 0.4)} />
      })}
    </g>
    <Ball cx={160} cy={86} r={28} tone="teal" label="Si" style={anim('mv-rise', 0, 0.8)} />
    <Callout x={204} y={86} tx={250} ty={40} text="바깥 전자 4개" at={B(1)} />
  </g>
)

// 이웃 원자와 전자를 하나씩 내놓아 짝을 이룸(공유 결합) → 결정
const Bond = ({ B }) => {
  const xs = [60, 160, 260]
  return (
    <g>
      {xs.map((x, i) => (
        <g key={x} style={anim('mv-rise', i * 0.25, 0.7)}>
          <Ball cx={x} cy={84} r={22} tone="teal" label="Si" />
          <Ball cx={x} cy={50} r={5.5} tone="orange" />
          <Ball cx={x} cy={118} r={5.5} tone="orange" />
        </g>
      ))}
      {/* 두 원자 사이의 전자쌍 */}
      {[110, 210].map((x) => (
        <g key={x} style={anim('mv-fade', B(1) - 0.6, 0.6)}>
          <Ball cx={x - 6} cy={80} r={5.5} tone="orange" />
          <Ball cx={x + 6} cy={88} r={5.5} tone="orange" />
        </g>
      ))}
      <Callout x={110} y={92} tx={40} ty={150} text="전자쌍을 나눠 가짐(공유 결합)" at={B(1)} />
      <Tag x={160} y={24} anchor="middle" at={B(2)} strong>
        전자가 묶여 있어 순수한 실리콘은 전기가 잘 안 통함
      </Tag>
    </g>
  )
}

// 도체 · 반도체 · 절연체
const Compare = ({ B }) => {
  const items = [
    { x: 30, label: '도체', sub: '잘 통함', fill: 'mv-cmp-cond', h: 70 },
    { x: 125, label: '반도체', sub: '조건에 따라 통함', fill: 'mv-cmp-semi', h: 40 },
    { x: 220, label: '절연체', sub: '거의 안 통함', fill: 'mv-cmp-ins', h: 8 },
  ]
  return (
    <g>
      {items.map((it, i) => (
        <g key={it.label} style={anim('mv-rise', 0.3 + i * 0.4, 0.7)}>
          <rect x={it.x} y={40} width="70" height="80" rx="6" className="mv-legendbox" />
          <g className="mv-box" style={anim('mv-grow', 0.8 + i * 0.4, 1)}>
            <rect x={it.x + 20} y={115 - it.h} width="30" height={it.h} rx="3" className={it.fill} />
          </g>
          <text x={it.x + 35} y={134} textAnchor="middle" className="mv-tag strong">
            {it.label}
          </text>
          <text x={it.x + 35} y={146} textAnchor="middle" className="mv-tag">
            {it.sub}
          </text>
        </g>
      ))}
      <Tag x={160} y={26} anchor="middle" at={B(1)} strong>
        반도체는 불순물을 넣어 전기가 통하는 정도를 조절할 수 있음
      </Tag>
    </g>
  )
}

export default {
  id: 'b-atom',
  scenes: {
    atom: { beat: 3.8, draw: (B) => <Atom B={B} /> },
    bond: { beat: 3.8, draw: (B) => <Bond B={B} /> },
    compare: { beat: 3.8, draw: (B) => <Compare B={B} /> },
  },
}
