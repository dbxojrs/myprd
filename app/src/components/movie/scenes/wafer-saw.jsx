import { anim, Callout, Rain, Tag, loop } from '../kit.jsx'

// 웨이퍼 쏘잉(다이싱) 애니메이션 그림(직접 그린 그림). 자막은 data/processMovies/wafer-saw.js

// 위에서 본 웨이퍼 + 다이싱 테이프 + 링 프레임
const DIES = []
for (let r = 0; r < 8; r++)
  for (let c = 0; c < 8; c++) {
    const x = 110 + c * 12.5
    const y = 40 + r * 12.5
    if ((x + 5.5 - 160) ** 2 + (y + 5.5 - 90) ** 2 < 48 ** 2) DIES.push({ x, y, r, c })
  }

const Mount = ({ B }) => (
  <g>
    <circle cx="160" cy="90" r="78" className="mv-ring" style={anim('mv-fade', 0, 0.6)} />
    <circle cx="160" cy="90" r="72" className="mv-dtape" style={anim('mv-fade', 0.4, 0.6)} />
    <circle cx="160" cy="90" r="56" className="mv-waferdisc" style={anim('mv-drop', B(1) - 1.2, 1)} />
    {DIES.map((d) => (
      <rect key={`${d.r}-${d.c}`} x={d.x} y={d.y} width="11" height="11" rx="1" className="mv-die" style={anim('mv-fade', B(1) - 0.4, 0.5)} />
    ))}
    <Callout x={232} y={60} tx={290} ty={30} text="링 프레임" at={0.3} anchor="end" />
    <Callout x={222} y={110} tx={300} ty={140} text="다이싱 테이프" at={0.8} anchor="end" />
    <Callout x={140} y={62} tx={40} ty={30} text="웨이퍼" at={B(1)} />
  </g>
)

// 옆에서 본 블레이드 절단
const Blade = ({ B }) => (
  <g>
    <rect x="20" y="132" width="280" height="10" className="mv-dtape" />
    <rect x="20" y="112" width="280" height="20" className="m-si" />
    {[60, 110, 160, 210, 260].map((x, i) => (
      <g key={x} className="mv-box top" style={anim('mv-grow', 0.8 + i * ((B(2) + 1.5) / 5), 0.5)}>
        <rect x={x - 2} y="112" width="4" height="24" className="mv-void" />
      </g>
    ))}
    {/* 블레이드가 오른쪽으로 지나감 */}
    <g style={anim('mv-travel', 0.6, B(2) + 1.8, { ease: 'linear' })}>
      <g className="mv-box center" style={loop('mv-spin', 0, 0.4)}>
        <circle cx="60" cy="82" r="34" className="mv-blade" />
        <path d="M60 50 V114 M28 82 H92" className="mv-blade-mark" />
      </g>
      <circle cx="60" cy="82" r="12" className="mv-hub" />
      <Rain x0={86} x1={100} y0={60} y1={112} n={4} at={0.6} dur={0.6} r={1.6} cls="mv-water" />
    </g>
    <Callout x={60} y={136} tx={30} ty={150} text="테이프는 끝까지 자르지 않음" at={B(1)} />
    <Tag x={240} y={28} anchor="middle" at={0.4} strong>
      빠르게 도는 얇은 날 + 냉각수
    </Tag>
  </g>
)

// 레이저(스텔스) 다이싱 → 테이프를 늘려 분리
const Laser = ({ B }) => (
  <g>
    <rect x="20" y="132" width="280" height="10" className="mv-dtape" style={anim('mv-stretch', B(1), 1.6)} />
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x={24 + i * 56} y="112" width="52" height="20" className="m-si" style={{ ...anim('mv-spread', B(1), 1.6), '--sx': `${(i - 2) * 6}px` }} />
    ))}
    {[78, 134, 190, 246].map((x, i) => (
      <g key={x}>
        <path d={`M${x} 10 L${x} 120`} className="mv-laser" style={anim('mv-fade', 0.3 + i * 0.5, 0.3)} />
        <g style={anim('mv-fadeout', B(1), 0.4)}>
          <path d={`M${x} 115 V129`} className="mv-modlayer" style={anim('mv-fade', 0.5 + i * 0.5, 0.4)} />
        </g>
      </g>
    ))}
    <Callout x={78} y={122} tx={40} ty={80} text="안쪽에 금(개질층)" at={1.2} />
    <Tag x={220} y={80} anchor="middle" at={B(1) + 0.4} strong>
      테이프를 늘려 떼어 냄
    </Tag>
  </g>
)

// 위에서 본 결과: 떨어진 칩들, 칩핑 표시
const Result = ({ B }) => (
  <g>
    <circle cx="160" cy="90" r="72" className="mv-dtape" />
    {DIES.map((d) => (
      <rect key={`${d.r}-${d.c}`} x={d.x + (d.c - 3.5) * 1.6} y={d.y + (d.r - 3.5) * 1.6} width="11" height="11" rx="1" className="mv-die" />
    ))}
    <g style={anim('mv-fade', B(1), 0.5)}>
      <circle cx="141" cy="69" r="7" className="mv-alert" style={loop('mv-pulse', B(1), 1.2)} />
    </g>
    <Callout x={141} y={69} tx={40} ty={40} text="모서리 깨짐(칩핑)" at={B(1) + 0.3} />
    <Tag x={260} y={60} anchor="middle" at={0.3}>
      칩 하나하나로
    </Tag>
  </g>
)

export default {
  id: 'wafer-saw',
  scenes: {
    mount: { beat: 3.6, draw: (B) => <Mount B={B} /> },
    blade: { beat: 3.8, draw: (B) => <Blade B={B} />, legend: ['si'] },
    laser: { beat: 3.8, draw: (B) => <Laser B={B} />, legend: ['si'] },
    result: { beat: 3.6, draw: (B) => <Result B={B} /> },
  },
}
