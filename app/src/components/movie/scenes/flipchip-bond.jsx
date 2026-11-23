import { anim, Callout, Heat, Tag } from '../kit.jsx'

// 플립칩 본딩 애니메이션 그림(직접 그린 옆모습). 자막은 data/processMovies/flipchip-bond.js
const BUMPS = [110, 135, 160, 185, 210]

// 범프가 달린 칩을 뒤집어 기판 위에 내려놓고 붙임
const Flip = ({ B }) => (
  <g>
    <rect x="40" y="128" width="240" height="14" rx="2" className="mv-subst" />
    {BUMPS.map((x) => (
      <rect key={x} x={x - 7} y="124" width="14" height="4" className="m-metal" />
    ))}
    <Tag x={300} y={150} anchor="end" at={0}>
      기판
    </Tag>
    {/* 칩: 처음엔 범프가 위 → 뒤집혀 아래로 내려옴 */}
    <g style={anim('mv-flipdown', 0.4, B(1) + 0.4)}>
      <g className="mv-box center" style={anim('mv-flip', 0.4, 1.2)}>
        {BUMPS.map((x) => (
          <circle key={x} cx={x} cy="36" r="5" className="mv-solder" />
        ))}
        <rect x="100" y="40" width="120" height="22" rx="2" className="m-si" />
      </g>
    </g>
    <Heat xs={[110, 160, 210]} y={70} at={B(2)} />
    <Tag x={160} y={24} anchor="middle" at={0.2} strong>
      칩을 뒤집어(flip) 범프로 바로 연결
    </Tag>
    <Callout x={210} y={118} tx={290} ty={96} text="열(리플로) 또는 열+압력" at={B(2) + 0.3} anchor="end" />
  </g>
)

// 와이어 본딩과 신호 길 비교
const Compare = ({ B }) => (
  <g>
    {/* 왼쪽: 와이어 */}
    <rect x="16" y="120" width="130" height="10" rx="2" className="mv-subst" />
    <rect x="46" y="100" width="70" height="20" className="m-si" />
    <path d="M50 100 C40 70 24 90 22 120 M112 100 C122 70 138 90 140 120" className="mv-wire" />
    <Tag x={81} y={148} anchor="middle" at={0}>
      와이어: 가장자리 패드만
    </Tag>
    {/* 오른쪽: 플립칩 */}
    <rect x="174" y="120" width="130" height="10" rx="2" className="mv-subst" />
    <rect x="204" y="96" width="70" height="18" className="m-si" />
    {[212, 226, 240, 254, 268].map((x) => (
      <circle key={x} cx={x} cy="117" r="3" className="mv-solder" />
    ))}
    <Tag x={239} y={148} anchor="middle" at={0}>
      플립칩: 칩 면 전체에 범프
    </Tag>
    <Tag x={160} y={40} anchor="middle" at={B(1)} strong>
      신호 길이 짧고 연결 수가 많음
    </Tag>
  </g>
)

export default {
  id: 'flipchip-bond',
  scenes: {
    flip: { beat: 3.8, draw: (B) => <Flip B={B} />, legend: ['si', 'metal'] },
    compare: { beat: 3.6, draw: (B) => <Compare B={B} />, legend: ['si'] },
  },
}
