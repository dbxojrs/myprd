import { anim, Callout, Tag, loop } from '../kit.jsx'

// 와이어 본딩 애니메이션 그림(직접 그린 옆모습). 자막은 data/processMovies/wire-bond.js

const Base = () => (
  <g>
    <rect x="20" y="130" width="280" height="12" rx="2" className="mv-frame" />
    <rect x="40" y="108" width="110" height="22" className="m-si" />
    <rect x="128" y="104" width="16" height="4" className="m-metal" />
    <rect x="236" y="124" width="40" height="6" className="mv-lead" />
    <text x="95" y="122" textAnchor="middle" className="mv-tag">
      다이
    </text>
    <text x="256" y="152" textAnchor="middle" className="mv-tag">
      리드
    </text>
  </g>
)

// 1) 볼 만들기 → 패드에 누르며 초음파
const Ball = ({ B }) => (
  <g>
    <Base />
    <g style={anim('mv-capdown', B(1), 1)}>
      <path d="M128 20 L132 60 H140 L144 20 Z" className="mv-capillary" />
      <path d="M136 0 V66" className="mv-wire" />
      <circle cx="136" cy="68" r="4" className="mv-ball" style={anim('mv-fade', B(0) + 1.4, 0.3)} />
    </g>
    {/* 불꽃(방전)으로 볼 만들기 */}
    <g style={anim('mv-fadeout', B(1), 0.3)}>
      <path d="M150 72 l-6 -4 l4 0 l-6 -6" className="mv-spark" style={anim('mv-fade', 1, 0.2)} />
    </g>
    <Callout x={140} y={40} tx={200} ty={30} text="캐필러리" at={0.3} />
    <Callout x={140} y={68} tx={200} ty={70} text="볼" at={1.6} />
    <g style={anim('mv-fade', B(2), 0.4)}>
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${112 - i * 6} 96 q-3 4 0 8`} className="mv-wave" style={loop('mv-pulse', B(2) + i * 0.15, 0.5)} />
      ))}
      <Tag x={60} y={86} anchor="middle" strong>
        초음파 + 열 + 누르는 힘
      </Tag>
    </g>
  </g>
)

// 2) 루프를 그리며 리드로 가서 스티치 본드
const Loop = ({ B }) => (
  <g>
    <Base />
    <circle cx="136" cy="102" r="4" className="mv-ball" />
    <path d="M136 100 C140 50 220 50 256 124" className="mv-wire draw" pathLength="1" style={anim('mv-draw', 0.4, B(1) + 1)} />
    <g style={anim('mv-capmove', 0.4, B(1) + 1)}>
      <path d="M-8 -48 L-4 -8 H4 L8 -48 Z" className="mv-capillary" />
    </g>
    <Callout x={256} y={124} tx={280} ty={96} text="스티치 본드" at={B(1) + 1.4} anchor="end" />
    <Callout x={136} y={102} tx={80} ty={70} text="볼 본드" at={0.3} anchor="end" />
    <Tag x={196} y={40} anchor="middle" at={B(2)} strong>
      끊고 다음 볼을 만들 준비
    </Tag>
  </g>
)

// 3) 위에서 본 모습: 다이 둘레 패드에서 리드로 여러 가닥
const Many = ({ B }) => {
  const pads = []
  for (let i = 0; i < 6; i++) {
    pads.push([125 + i * 14, 62, 125 + i * 22 - 20, 24])
    pads.push([125 + i * 14, 118, 125 + i * 22 - 20, 156])
  }
  return (
    <g>
      <rect x="112" y="56" width="96" height="68" rx="2" className="m-si" />
      {pads.map(([x1, y1, x2, y2], i) => (
        <g key={i}>
          <rect x={x2 - 6} y={y2 < 90 ? y2 - 10 : y2} width="12" height="10" className="mv-lead" />
          <path d={`M${x1} ${y1} L${x2} ${y2}`} className="mv-wire draw" pathLength="1" style={anim('mv-draw', 0.3 + i * 0.25, 0.5)} />
        </g>
      ))}
      <Tag x={262} y={92} anchor="middle" at={B(1)} strong>
        패드마다 한 가닥씩
      </Tag>
    </g>
  )
}

export default {
  id: 'wire-bond',
  scenes: {
    ball: { beat: 3.6, draw: (B) => <Ball B={B} />, legend: ['si', 'metal'] },
    loop: { beat: 3.8, draw: (B) => <Loop B={B} />, legend: ['si'] },
    many: { beat: 3.6, draw: (B) => <Many B={B} />, legend: ['si'] },
  },
}
