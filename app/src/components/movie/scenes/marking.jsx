import { anim, Callout, Rain, Tag, loop } from '../kit.jsx'

// 마킹 애니메이션 그림(직접 그린 그림). 자막은 data/processMovies/marking.js

// 위에서 본 패키지: 레이저가 지나가며 글자가 새겨짐
const Laser = ({ B }) => (
  <g>
    <rect x="70" y="50" width="180" height="100" rx="6" className="mv-emc" />
    <clipPath id="mk-reveal">
      <rect x="80" y="60" width="160" height="80" className="mv-box left" style={anim('mv-widenx', 0.6, B(1) + 1.8, { ease: 'linear' })} />
    </clipPath>
    <g clipPath="url(#mk-reveal)">
      <text x="160" y="94" textAnchor="middle" className="mv-mark big">
        TUTOR
      </text>
      <text x="160" y="122" textAnchor="middle" className="mv-mark">
        LOT 0001
      </text>
    </g>
    <g style={anim('mv-scan', 0.6, B(1) + 1.8, { ease: 'linear' })}>
      <path d="M84 4 V84" className="mv-laser" />
      <circle cx="84" cy="86" r="3" className="mv-ball" style={loop('mv-pulse', 0, 0.2)} />
    </g>
    <Rain x0={90} x1={230} y0={80} y1={40} n={5} at={0.8} dur={0.9} r={1.3} cls="mv-dust" />
    <Callout x={250} y={100} tx={300} ty={150} text="몰딩된 패키지 윗면" at={0.3} anchor="end" />
    <Tag x={40} y={40} at={B(2)} strong>
      제품 이름·로트 번호
    </Tag>
  </g>
)

// 옆에서 본 홈의 깊이
const Depth = ({ B }) => (
  <g>
    <path d="M20 80 H120 L126 92 H154 L160 80 H200 L210 122 H230 L240 80 H300 V150 H20 Z" className="mv-emc" />
    <rect x="20" y="132" width="280" height="10" className="m-si" />
    <Callout x={140} y={92} tx={110} ty={40} text="얕은 홈: 읽기 충분" at={0.3} anchor="end" />
    <Callout x={220} y={122} tx={312} ty={40} text="너무 깊으면 안쪽 칩까지 위험" at={B(1)} anchor="end" />
    <Tag x={60} y={146} at={0}>
      칩
    </Tag>
  </g>
)

export default {
  id: 'marking',
  scenes: {
    laser: { beat: 3.6, draw: (B) => <Laser B={B} /> },
    depth: { beat: 3.6, draw: (B) => <Depth B={B} />, legend: ['si'] },
  },
}
