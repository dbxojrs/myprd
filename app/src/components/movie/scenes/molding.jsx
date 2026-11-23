import { anim, Callout, Heat, Tag } from '../kit.jsx'

// 몰딩 애니메이션 그림(직접 그린 옆모습). 자막은 data/processMovies/molding.js

// 와이어까지 연결된 다이 (몰드 안)
const Unit = ({ x, sweepAt = null }) => (
  <g>
    <rect x={x} y="112" width="50" height="14" className="m-si" />
    <g className="mv-box" style={sweepAt !== null ? anim('mv-sweep', sweepAt, 1.6) : undefined}>
      <path d={`M${x + 8} 112 C${x + 4} 92 ${x - 18} 96 ${x - 22} 124`} className="mv-wire" />
      <path d={`M${x + 42} 112 C${x + 46} 92 ${x + 68} 96 ${x + 72} 124`} className="mv-wire" />
    </g>
  </g>
)

const Mold = ({ open = 0 }) => (
  <g>
    <g style={anim('mv-moldclose', 0, open)}>
      <rect x="10" y="40" width="300" height="36" rx="3" className="mv-mold" />
      <Tag x={160} y={62} anchor="middle">
        윗 금형
      </Tag>
    </g>
    <rect x="10" y="132" width="300" height="30" rx="3" className="mv-mold" />
    <rect x="20" y="126" width="280" height="6" className="mv-frame" />
  </g>
)

const Load = ({ B }) => (
  <g>
    <Mold open={1.6} />
    <Unit x={60} />
    <Unit x={190} />
    <Tag x={160} y={28} anchor="middle" at={0.2} strong>
      와이어 본딩까지 끝난 스트립을 금형에 넣음
    </Tag>
    <Callout x={68} y={100} tx={40} ty={96} text="와이어" at={B(1)} anchor="end" />
  </g>
)

const Fill = ({ B }) => (
  <g>
    <rect x="10" y="40" width="300" height="36" rx="3" className="mv-mold" />
    <rect x="10" y="132" width="300" height="30" rx="3" className="mv-mold" />
    <rect x="20" y="126" width="280" height="6" className="mv-frame" />
    {/* 수지가 왼쪽에서 흘러 들어와 빈 곳을 채움 */}
    <g className="mv-box left" style={anim('mv-widenx', 0.6, B(2) + 1.2, { ease: 'linear' })}>
      <rect x="20" y="76" width="280" height="50" className="mv-emc" />
    </g>
    <Unit x={60} sweepAt={0.9} />
    <Unit x={190} sweepAt={B(1) + 0.6} />
    {/* 플런저와 수지 덩어리 */}
    <g style={anim('mv-fade', 0, 0.4)}>
      <rect x="0" y="90" width="16" height="24" className="mv-emc" />
      <g style={anim('mv-push', 0.3, B(2) + 1.4)}>
        <rect x="-14" y="92" width="12" height="20" className="mv-pin" />
      </g>
    </g>
    <Callout x={22} y={100} tx={26} ty={28} text="녹은 수지(EMC)를 밀어 넣음" at={0.4} />
    <Callout x={44} y={110} tx={120} ty={148} text="흐름에 와이어가 밀릴 수 있음(와이어 스윕)" at={B(1)} />
  </g>
)

const Cure = ({ B }) => (
  <g>
    <rect x="20" y="126" width="280" height="6" className="mv-frame" />
    <rect x="20" y="86" width="280" height="40" rx="2" className="mv-emc" style={anim('mv-rise', 0.2, 0.8)} />
    <Heat xs={[80, 160, 240]} y={40} at={B(1)} />
    <Tag x={160} y={30} anchor="middle" at={0.3} strong>
      꺼내면 칩이 검은 수지 속에
    </Tag>
    <Tag x={160} y={148} anchor="middle" at={B(1) + 0.3}>
      열을 받아 단단하게 굳음
    </Tag>
  </g>
)

export default {
  id: 'molding',
  scenes: {
    load: { beat: 3.6, draw: (B) => <Load B={B} />, legend: ['si'] },
    fill: { beat: 3.8, draw: (B) => <Fill B={B} />, legend: ['si'] },
    cure: { beat: 3.6, draw: (B) => <Cure B={B} /> },
  },
}
