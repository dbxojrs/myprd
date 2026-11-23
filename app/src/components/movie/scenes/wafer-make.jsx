import { anim, Callout, Rain, Tag, loop } from '../kit.jsx'

// 웨이퍼 제조 애니메이션 그림(직접 그린 그림). 자막은 data/processMovies/wafer-make.js

// 모래 → 정제 → 녹이기
const Melt = ({ B }) => (
  <g>
    {Array.from({ length: 26 }, (_, i) => (
      <circle key={i} cx={30 + (i % 9) * 9 + (i % 2) * 3} cy={150 - Math.floor(i / 9) * 7} r="3.4" className="mv-sand" />
    ))}
    <Tag x={68} y={120} anchor="middle" at={0.2} strong>
      모래(규사)
    </Tag>
    <path d="M120 140 H150" className="mv-arrow" markerEnd="url(#mv-head)" style={anim('mv-fade', 0.8, 0.4)} />
    <Tag x={135} y={130} anchor="middle" at={0.9}>
      정제
    </Tag>
    {/* 도가니 속 녹은 실리콘 */}
    <g style={anim('mv-fade', B(1) - 1.2, 0.6)}>
      <path d="M170 90 V150 Q170 162 182 162 H268 Q280 162 280 150 V90" className="mv-crucible" />
      <rect x="174" y="112" width="102" height="46" rx="6" className="mv-melt" style={loop('mv-pulse', B(1), 2, 'ease-in-out')} />
      <circle cx="225" cy="130" r="56" fill="url(#mv-glow)" style={loop('mv-pulse', B(1), 2, 'ease-in-out')} />
    </g>
    <Tag x={225} y={80} anchor="middle" at={B(1)} strong>
      아주 순수하게 정제해 녹임
    </Tag>
  </g>
)

// 녹은 실리콘에서 결정 기둥(잉곳)이 자라 올라감
const Ingot = ({ B }) => (
  <g>
    <path d="M100 110 V150 Q100 162 112 162 H208 Q220 162 220 150 V110" className="mv-crucible" />
    <rect x="104" y="118" width="112" height="40" rx="6" className="mv-melt" />
    <path d="M160 4 V30" className="mv-line" />
    <g className="mv-box" style={anim('mv-grow', 0.4, B(2) + 1.5)}>
      <rect x="138" y="30" width="44" height="88" rx="8" className="m-si" />
    </g>
    <g style={loop('mv-spinx', 0.4, 1.4)}>
      <path d="M140 60 H180 M140 80 H180 M140 100 H180" className="mv-shine" />
    </g>
    <Callout x={180} y={60} tx={240} ty={40} text="잉곳(결정 기둥)" at={B(1)} />
    <Tag x={240} y={90} at={B(1) + 0.5}>
      순도 거의 100%
    </Tag>
  </g>
)

// 잉곳을 얇게 썰기
const Slice = ({ B }) => (
  <g>
    <rect x="40" y="40" width="190" height="48" rx="8" className="m-si" />
    {Array.from({ length: 7 }, (_, i) => (
      <g key={i} style={anim('mv-slideout', 0.6 + i * 0.35, 0.8)}>
        <ellipse cx={240 + i * 9} cy="64" rx="4" ry="24" className="mv-wafer-edge" />
      </g>
    ))}
    <g style={loop('mv-press', 0.2, 0.7, 'ease-in-out')}>
      <rect x="226" y="14" width="6" height="36" className="mv-saw" />
    </g>
    <Tag x={229} y={10} anchor="middle" at={0.2} strong>
      다이아몬드 톱
    </Tag>
    <g style={anim('mv-fade', B(1), 0.6)}>
      {[
        [70, 128, 10, '150mm'],
        [150, 128, 14, '200mm'],
        [240, 128, 20, '300mm'],
      ].map(([x, y, r, t]) => (
        <g key={t}>
          <circle cx={x} cy={y - r + 6} r={r} className="mv-waferdisc" />
          <text x={x} y={y + 15} textAnchor="middle" className="mv-tag">
            {t}
          </text>
        </g>
      ))}
    </g>
  </g>
)

// 연마: 패드 아래에서 웨이퍼 표면이 매끈해짐
const Polish = ({ B }) => (
  <g>
    <g className="mv-box center" style={loop('mv-spin', 0, 3)}>
      <circle cx="160" cy="100" r="60" className="mv-waferdisc rough" />
    </g>
    <g style={anim('mv-fade', 0.8, 2)}>
      <circle cx="160" cy="100" r="60" className="mv-waferdisc mirror" />
    </g>
    <g style={anim('mv-fadeout', B(1), 0.8)}>
      <rect x="110" y="20" width="100" height="22" rx="6" className="mv-pad" style={loop('mv-sway', 0, 0.8, 'ease-in-out')} />
      <Tag x={160} y={34} anchor="middle" strong>
        연마 패드
      </Tag>
      <Rain x0={120} x1={200} y0={44} y1={70} n={6} at={0.2} dur={0.9} r={1.6} cls="mv-water" />
    </g>
    <Tag x={160} y={24} anchor="middle" at={B(1) + 0.4} strong>
      거울처럼 매끈한 베어 웨이퍼
    </Tag>
  </g>
)

// 웨이퍼 부위 이름
const Parts = ({ B }) => {
  const dies = []
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) {
      const x = 110 + c * 12.5
      const y = 40 + r * 12.5
      if ((x + 5.5 - 160) ** 2 + (y + 5.5 - 90) ** 2 < 50 ** 2) dies.push([x, y])
    }
  return (
    <g>
      <circle cx="160" cy="90" r="58" className="mv-waferdisc" />
      {dies.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="11" height="11" rx="1" className="mv-die" />
      ))}
      <path d="M154 147 q6 -6 12 0" className="mv-notch" />
      <Callout x={141} y={77} tx={60} ty={40} text="다이(칩 하나)" at={0.4} anchor="end" />
      <Callout x={159.5} y={100} tx={226} ty={112} text="스크라이브 라인(자를 틈)" at={1.2} />
      <Callout x={160} y={145} tx={226} ty={146} text="노치(방향 기준)" at={B(1)} />
      <Tag x={236} y={60} at={B(1) + 0.6}>
        한쪽을 평평하게 깎은 플랫존 대신
      </Tag>
      <Tag x={236} y={72} at={B(1) + 0.6}>
        노치를 쓰면 칩을 더 많이 얻습니다
      </Tag>
    </g>
  )
}

export default {
  id: 'wafer-make',
  scenes: {
    silicon: { beat: 3.6, draw: (B) => <Melt B={B} /> },
    ingot: { beat: 3.6, draw: (B) => <Ingot B={B} />, legend: ['si'] },
    slice: { beat: 3.8, draw: (B) => <Slice B={B} />, legend: ['si'] },
    polish: { beat: 3.6, draw: (B) => <Polish B={B} /> },
    parts: { beat: 3.8, draw: (B) => <Parts B={B} /> },
  },
}
