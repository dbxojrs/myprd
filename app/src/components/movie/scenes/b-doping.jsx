import { Ball, Block, Callout, Tag, anim, loop } from '../kit.jsx'

// 반도체 기초 2: 도핑. 자막은 data/processMovies/b-doping.js (직접 그린 그림)

// 실리콘 격자(3×5) 가운데에 불순물 원자 하나
const Lattice = ({ center, centerTone, B, extra, missing }) => {
  const cells = []
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 5; c++) {
      const x = 48 + c * 56
      const y = 40 + r * 48
      const isCenter = r === 1 && c === 2
      cells.push(
        <g key={`${r}-${c}`}>
          <Ball cx={x} cy={y} r={isCenter ? 15 : 13} tone={isCenter ? centerTone : 'teal'} label={isCenter ? center : 'Si'} style={isCenter ? anim('mv-fade', 0.4, 0.8) : undefined} />
          {c < 4 && (
            <>
              <Ball cx={x + 24} cy={y - 4} r={3.4} tone="orange" />
              <Ball cx={x + 32} cy={y + 4} r={3.4} tone="orange" />
            </>
          )}
          {r < 2 && (
            <>
              <Ball cx={x - 4} cy={y + 20} r={3.4} tone="orange" />
              <Ball cx={x + 4} cy={y + 28} r={3.4} tone="orange" />
            </>
          )}
        </g>,
      )
    }
  return (
    <g>
      {cells}
      {/* 남는 전자(N형): 떨어져 나와 돌아다님 */}
      {extra && (
        <g style={anim('mv-fade', B(1), 0.4)}>
          <g style={loop('mv-wander', B(1) + 0.4, 3.2, 'ease-in-out')}>
            <Ball cx={172} cy={74} r={4.5} tone="orange" label="-" />
          </g>
        </g>
      )}
      {/* 모자란 자리(P형): 정공 */}
      {missing && (
        <g style={anim('mv-fade', B(1), 0.4)}>
          <circle cx={184} cy={84} r={5} className="mv-void" />
          <g style={loop('mv-pulse', B(1), 1.2)}>
            <Ball cx={184} cy={84} r={4.6} hole label="+" />
          </g>
        </g>
      )}
    </g>
  )
}

const NType = ({ B }) => (
  <g>
    <Lattice center="P" centerTone="pink" B={B} extra />
    <Callout x={160} y={100} tx={60} ty={150} text="인(P): 바깥 전자 5개" at={0.8} />
    <Callout x={176} y={70} tx={312} ty={16} text="남는 전자 → 자유롭게 움직임" at={B(1) + 0.4} anchor="end" />
  </g>
)

const PType = ({ B }) => (
  <g>
    <Lattice center="B" centerTone="blue" B={B} missing />
    <Callout x={160} y={100} tx={60} ty={150} text="붕소(B): 바깥 전자 3개" at={0.8} />
    <Callout x={188} y={80} tx={312} ty={16} text="전자가 빈 자리 = 정공(+)" at={B(1) + 0.4} anchor="end" />
  </g>
)

// 블록으로 요약: N형(전자가 많음), P형(정공이 많음)
const Blocks = ({ B }) => (
  <g>
    <Block x={24} y={40} w={128} h={90} tone="n" style={anim('mv-rise', 0.2, 0.7)} />
    <Block x={168} y={40} w={128} h={90} tone="p" style={anim('mv-rise', 0.5, 0.7)} />
    {Array.from({ length: 12 }, (_, i) => (
      <Ball key={`e${i}`} cx={40 + (i % 4) * 32} cy={56 + Math.floor(i / 4) * 28} r={6} tone="orange" label="-" style={anim('mv-fade', 0.9 + i * 0.05, 0.3)} />
    ))}
    {Array.from({ length: 12 }, (_, i) => (
      <Ball key={`h${i}`} cx={184 + (i % 4) * 32} cy={56 + Math.floor(i / 4) * 28} r={6} hole label="+" style={anim('mv-fade', 1.2 + i * 0.05, 0.3)} />
    ))}
    <text x="88" y="146" textAnchor="middle" className="mv-tag strong">
      N형: 전자가 많음
    </text>
    <text x="232" y="146" textAnchor="middle" className="mv-tag strong">
      P형: 정공이 많음
    </text>
    <Tag x={160} y={24} anchor="middle" at={B(1)} strong>
      n형은 전자가, p형은 정공이 전류를 나름
    </Tag>
  </g>
)

export default {
  id: 'b-doping',
  scenes: {
    ntype: { beat: 3.8, draw: (B) => <NType B={B} /> },
    ptype: { beat: 3.8, draw: (B) => <PType B={B} /> },
    blocks: { beat: 3.8, draw: (B) => <Blocks B={B} /> },
  },
}
