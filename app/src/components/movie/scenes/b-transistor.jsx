import { Battery, Block, Callout, Flow, Tag, anim } from '../kit.jsx'

// 반도체 기초 4: 트랜지스터. 자막은 data/processMovies/b-transistor.js (직접 그린 그림)

// N-P-N 블록(가운데 P가 얇음)
const NPN = ({ B }) => (
  <g>
    <Block x={60} y={30} w={90} h={70} tone="n" label="N" style={anim('mv-rise', 0.2, 0.6)} />
    <Block x={150} y={30} w={20} h={70} tone="p" label="P" style={anim('mv-rise', 0.5, 0.6)} />
    <Block x={170} y={30} w={90} h={70} tone="n" label="N" style={anim('mv-rise', 0.8, 0.6)} />
    <Callout x={160} y={34} tx={160} ty={16} text="가운데 P를 얇게" at={1.2} />
    {/* 작은 전지(베이스)와 큰 전지(컬렉터) */}
    <g style={anim('mv-fade', B(1), 0.5)}>
      <path d="M60 65 H40 V150 H96 M132 150 H160 V100" className="mv-copper" />
      <Battery x={98} y={150} />
      <path d="M260 65 H284 V150 H230 M196 150 H160" className="mv-copper" />
      <Battery x={196} y={150} />
    </g>
    <Flow d="M160 104 V150 H132" n={3} dur={1.4} at={B(1) + 0.6} r={2} />
    <Flow d="M284 65 V150 H160 V104" n={8} dur={1.4} at={B(2)} r={2.4} />
    <Tag x={60} y={124} at={B(1) + 0.4}>
      작은 전류
    </Tag>
    <Tag x={234} y={124} at={B(2)} strong>
      큰 전류가 흐름
    </Tag>
  </g>
)

// 스위치와 증폭, 그리고 칩 속으로
const Roles = ({ B }) => (
  <g>
    <g style={anim('mv-rise', 0.2, 0.6)}>
      <rect x="30" y="40" width="110" height="64" rx="8" className="mv-legendbox" />
      <path d="M50 84 H70 L94 66 M98 84 H120" className="mv-switch" />
      <circle cx="70" cy="84" r="2.5" className="mv-dotc" />
      <circle cx="98" cy="84" r="2.5" className="mv-dotc" />
      <text x="85" y="58" textAnchor="middle" className="mv-tag strong">
        스위치: 켜고 끄기(1과 0)
      </text>
    </g>
    <g style={anim('mv-rise', 0.6, 0.6)}>
      <rect x="180" y="40" width="110" height="64" rx="8" className="mv-legendbox" />
      <path d="M196 84 q6 -8 12 0 t12 0" className="mv-wave-ac" />
      <path d="M226 80 h10" className="mv-arrow" markerEnd="url(#mv-head)" />
      <path d="M240 84 q8 -22 16 0 t16 0" className="mv-wave-dc" />
      <text x="235" y="58" textAnchor="middle" className="mv-tag strong">
        증폭: 작은 신호를 크게
      </text>
    </g>
    <Tag x={160} y={140} anchor="middle" at={B(1)} strong>
      1947년 트랜지스터 → 1958년 집적 회로(IC)
    </Tag>
  </g>
)

export default {
  id: 'b-transistor',
  scenes: {
    npn: { beat: 3.8, draw: (B) => <NPN B={B} /> },
    roles: { beat: 3.8, draw: (B) => <Roles B={B} /> },
  },
}
