import { anim, Callout, Tag, loop } from '../kit.jsx'

// 언더필 애니메이션 그림(직접 그린 옆모습). 자막은 data/processMovies/underfill.js
const BUMPS = [110, 135, 160, 185, 210]

const Assembly = () => (
  <g>
    <rect x="40" y="118" width="240" height="16" rx="2" className="mv-subst" />
    <rect x="96" y="92" width="128" height="18" rx="2" className="m-si" />
    {BUMPS.map((x) => (
      <circle key={x} cx={x} cy="114" r="4" className="mv-solder" />
    ))}
  </g>
)

// 온도가 바뀌면 칩과 기판이 서로 다르게 늘어나 범프에 힘이 걸림
const Why = ({ B }) => (
  <g>
    <Assembly />
    <g style={anim('mv-fade', 0.4, 0.5)}>
      <path d="M150 100 H110" className="mv-arrow" markerEnd="url(#mv-head)" />
      <path d="M170 100 H210" className="mv-arrow" markerEnd="url(#mv-head)" />
      <path d="M140 128 H60" className="mv-arrow" markerEnd="url(#mv-head)" />
      <path d="M180 128 H260" className="mv-arrow" markerEnd="url(#mv-head)" />
    </g>
    <Tag x={160} y={60} anchor="middle" at={0.4} strong>
      칩과 기판은 열에 늘어나는 정도(CTE)가 다름
    </Tag>
    {BUMPS.map((x, i) => (
      <g key={x} style={anim('mv-fade', B(1), 0.4)}>
        <circle cx={x} cy="114" r="6" className="mv-alert" style={loop('mv-pulse', B(1) + i * 0.1, 1)} />
      </g>
    ))}
    <Tag x={160} y={152} anchor="middle" at={B(1)}>
      → 범프 접합부에 힘이 몰림
    </Tag>
  </g>
)

// 칩 가장자리에서 액체를 넣으면 틈으로 스며 들어가 채움(CUF)
const Fill = ({ B }) => (
  <g>
    <Assembly />
    <g className="mv-box left" style={anim('mv-widenx', 0.8, B(1) + 1.2, { ease: 'linear' })}>
      <rect x="96" y="110" width="128" height="8" className="mv-underfill" />
    </g>
    <g style={anim('mv-fade', 0.2, 0.4)}>
      <path d="M86 60 V96" className="mv-line" />
      <rect x="80" y="66" width="12" height="20" rx="2" className="mv-soft" />
      <circle cx="88" cy="112" r="4" className="mv-underfill" style={anim('mv-drop', 0.4, 0.6)} />
    </g>
    <Callout x={92} y={112} tx={40} ty={60} text="칩 가장자리에서 주입" at={0.4} />
    <Callout x={200} y={114} tx={260} ty={150} text="틈을 채워 범프를 감쌈" at={B(1) + 1} anchor="end" />
    <Tag x={220} y={40} anchor="middle" at={B(2)} strong>
      필름(NCF)·몰딩과 함께(MUF) 방식도
    </Tag>
  </g>
)

export default {
  id: 'underfill',
  scenes: {
    why: { beat: 3.6, draw: (B) => <Why B={B} />, legend: ['si'] },
    fill: { beat: 3.8, draw: (B) => <Fill B={B} />, legend: ['si'] },
  },
}
