import { Ball, Callout, Heat, Tag, anim } from '../kit.jsx'

// 첨단 패키지 11: 하이브리드 본딩. 자막은 data/processMovies/adv-hybrid.js (직접 그린 단면도)

// 범프로 잇기 vs 구리끼리 바로 붙이기
const Compare = ({ B }) => (
  <g>
    {/* 왼쪽: 범프 */}
    <rect x="20" y="40" width="120" height="22" rx="2" className="m-si" />
    <rect x="20" y="96" width="120" height="22" rx="2" className="m-si" />
    {[36, 64, 92, 120].map((x) => (
      <Ball key={x} cx={x} cy={79} r={8} tone="silver" />
    ))}
    <text x="80" y="136" textAnchor="middle" className="mv-tag strong">
      범프로 잇기: 틈과 간격이 큼
    </text>
    {/* 오른쪽: 하이브리드 */}
    <g style={anim('mv-rise', B(1), 0.6)}>
      <rect x="180" y="56" width="120" height="22" rx="2" className="m-si" />
      <rect x="180" y="78" width="120" height="6" className="m-oxide" />
      <rect x="180" y="84" width="120" height="6" className="m-oxide" />
      <rect x="180" y="90" width="120" height="22" rx="2" className="m-si" />
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={186 + i * 11.5} y="78" width="6" height="12" className="m-metal" />
      ))}
      <text x="240" y="136" textAnchor="middle" className="mv-tag strong">
        하이브리드: 구리·절연막끼리 바로
      </text>
    </g>
    <Tag x={160} y={22} anchor="middle" at={B(1) + 0.6}>
      범프가 없으니 연결을 훨씬 촘촘하게
    </Tag>
  </g>
)

// 평평하게 → 맞대어 붙이기 → 열로 구리끼리 결합
const Process = ({ B }) => (
  <g>
    <rect x="70" y="110" width="180" height="24" rx="2" className="m-si" />
    <rect x="70" y="104" width="180" height="6" className="m-oxide" />
    {Array.from({ length: 8 }, (_, i) => (
      <rect key={i} x={82 + i * 21} y="104" width="8" height="6" className="m-metal" />
    ))}
    <g style={anim('mv-fadeout', 1.4, 0.6)}>
      <rect x="40" y="94" width="240" height="8" rx="4" className="mv-pad" />
      <Tag x={160} y={88} anchor="middle" strong>
        표면을 아주 평평하게(CMP)
      </Tag>
    </g>
    <g style={anim('mv-placedown', B(1), 1.2)}>
      <rect x="70" y="74" width="180" height="24" rx="2" className="m-si" />
      <rect x="70" y="98" width="180" height="6" className="m-oxide" />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={82 + i * 21} y="98" width="8" height="6" className="m-metal" />
      ))}
    </g>
    <Callout x={250} y={104} tx={306} ty={56} text="절연막끼리 먼저 붙음" at={B(1) + 1.2} anchor="end" />
    <Heat xs={[100, 160, 220]} y={36} at={B(2)} />
    <Tag x={160} y={152} anchor="middle" at={B(2) + 0.4} strong>
      열을 가하면 구리가 늘어나 서로 붙음
    </Tag>
  </g>
)

export default {
  id: 'adv-hybrid',
  scenes: {
    compare: { beat: 3.8, draw: (B) => <Compare B={B} /> },
    process: { beat: 3.8, draw: (B) => <Process B={B} /> },
  },
}
