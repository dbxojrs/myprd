import { Ball, Callout, Tag, anim } from '../kit.jsx'

// 첨단 패키지 4: 팬아웃 패키지. 자막은 data/processMovies/adv-fanout.js (직접 그린 단면도)
const DIES = [50, 140, 230]

// 받침 위에 칩을 띄엄띄엄 → 몰딩으로 덮어 "다시 만든 웨이퍼" → 받침 떼기
const Reconstitute = ({ B }) => (
  <g>
    <g style={anim('mv-fadeout', B(2), 0.8)}>
      <rect x="20" y="118" width="280" height="12" rx="2" className="mv-carrier" />
      <text x="160" y="127" textAnchor="middle" className="mv-tag">
        받침(캐리어)
      </text>
    </g>
    {DIES.map((x, i) => (
      <rect key={x} x={x} y="100" width="40" height="18" className="m-si" style={anim('mv-drop', 0.3 + i * 0.3, 0.6)} />
    ))}
    <g className="mv-box" style={anim('mv-grow', B(1), 1.4)}>
      <rect x="20" y="80" width="280" height="38" rx="2" className="mv-emc" opacity="0.92" />
    </g>
    {DIES.map((x) => (
      <rect key={`s${x}`} x={x} y="100" width="40" height="18" className="m-si" style={anim('mv-fade', B(1) + 1.2, 0.4)} />
    ))}
    <Callout x={70} y={110} tx={14} ty={50} text="칩을 띄엄띄엄 배치" at={0.8} />
    <Callout x={250} y={86} tx={306} ty={50} text="몰딩으로 덮음" at={B(1) + 0.6} anchor="end" />
    <Tag x={160} y={150} anchor="middle" at={B(2) + 0.4} strong>
      받침을 떼면 칩이 박힌 새 웨이퍼(재구성 웨이퍼)
    </Tag>
  </g>
)

// 칩 아래에 배선층(RDL)을 칩 바깥까지 넓혀 단자를 많이 둠
const Rdl = ({ B }) => (
  <g>
    <rect x="60" y="50" width="200" height="40" rx="2" className="mv-emc" />
    <rect x="120" y="58" width="80" height="30" className="m-si" />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <path key={i} d={`M${130 + i * 12} 90 V${96 + (i % 2) * 4} H${70 + i * 36} V104`} className="mv-rdl" pathLength="1" style={anim('mv-draw', 0.4 + i * 0.25, 0.6)} />
    ))}
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <Ball key={i} cx={70 + i * 36} cy={110} r={5.5} tone="silver" style={anim('mv-drop', 2 + i * 0.12, 0.4)} />
    ))}
    <Callout x={70} y={100} tx={10} ty={140} text="칩 바깥까지 넓힌 배선(RDL)" at={B(1)} />
    <Tag x={160} y={30} anchor="middle" at={B(1) + 0.4} strong>
      칩보다 넓은 면에 단자를 둘 수 있음(팬아웃)
    </Tag>
  </g>
)

export default {
  id: 'adv-fanout',
  scenes: {
    reconstitute: { beat: 3.8, draw: (B) => <Reconstitute B={B} /> },
    rdl: { beat: 3.8, draw: (B) => <Rdl B={B} /> },
  },
}
