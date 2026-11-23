import { Ball, Callout, Tag, anim } from '../kit.jsx'

// 패키징 영상 강의 1: 전체 모습과 재료. 자막은 data/processMovies/pkg-overview.js (직접 그린 그림)

// 옆에서 본 BGA 패키지 단면: 기판 + 칩 + 와이어 + 수지 + 솔더볼
const Package = ({ openAt, B }) => (
  <g>
    {/* 기판과 솔더볼 */}
    <rect x="60" y="112" width="200" height="12" rx="2" className="mv-subst" />
    {Array.from({ length: 9 }, (_, i) => (
      <Ball key={i} cx={76 + i * 21} cy={130} r={5.5} tone="silver" />
    ))}
    {/* 칩과 접착제, 와이어 */}
    <rect x="116" y="108" width="88" height="4" className="mv-epoxy" />
    <rect x="118" y="92" width="84" height="16" className="m-si" />
    <path d="M124 92 C116 70 92 76 84 112 M196 92 C204 70 228 76 236 112" className="mv-wire" />
    {/* 수지(EMC): 처음엔 덮고 있다가 반쯤 투명해지며 속이 보임 */}
    <g style={anim('mv-emc-open', openAt, 1.4)}>
      <rect x="60" y="58" width="200" height="54" rx="3" className="mv-emc" />
    </g>
    <g style={anim('mv-fade', openAt + 1.2, 0.6)}>
      <rect x="60" y="58" width="200" height="54" rx="3" className="mv-emc-outline" />
    </g>
    <Callout x={160} y={100} tx={10} ty={34} text="칩(실리콘)" at={B(1)} />
    <Callout x={92} y={86} tx={10} ty={150} text="와이어" at={B(1) + 0.4} />
    <Callout x={240} y={64} tx={310} ty={34} text="수지(EMC)" at={B(1) + 0.8} anchor="end" />
    <Callout x={250} y={118} tx={310} ty={150} text="기판" at={B(1) + 1.2} anchor="end" />
    <Callout x={180} y={134} tx={160} ty={152} text="솔더볼(바깥 단자)" at={B(1) + 1.6} />
  </g>
)

const Whole = ({ B }) => (
  <g>
    <Package openAt={B(1) - 1.2} B={B} />
    <g style={anim('mv-fadeout', B(2), 0.3)}>
      <Tag x={160} y={22} anchor="middle" at={0.2} strong>
        완성된 패키지: 칩을 지키고 바깥과 이어 주는 집
      </Tag>
    </g>
    <g style={anim('mv-fade', B(2), 0.5)}>
      {['보호', '전기 연결', '기계적 연결', '열 방출'].map((t, i) => (
        <g key={t}>
          <rect x={30 + i * 68} y={4} width="60" height="16" rx="8" className="mv-pill" />
          <text x={60 + i * 68} y={15.5} textAnchor="middle" className="mv-tag strong">
            {t}
          </text>
        </g>
      ))}
    </g>
  </g>
)

// 재료 카드
const MATERIALS = [
  { t: '와이어', s: '금 · 구리', draw: (x, y) => <path d={`M${x - 14} ${y + 6} C${x - 8} ${y - 14} ${x + 8} ${y - 14} ${x + 14} ${y + 6}`} className="mv-wire" /> },
  { t: '접착제', s: '에폭시 · DAF', draw: (x, y) => <rect x={x - 16} y={y - 2} width="32" height="7" rx="2" className="mv-epoxy" /> },
  { t: 'EMC', s: '에폭시 + 실리카', draw: (x, y) => <rect x={x - 16} y={y - 10} width="32" height="18" rx="3" className="mv-emc" /> },
  { t: '기판', s: '리드프레임 · PCB', draw: (x, y) => <rect x={x - 18} y={y - 3} width="36" height="8" rx="2" className="mv-subst" /> },
  { t: '솔더볼', s: '무연 솔더', draw: (x, y) => <Ball cx={x} cy={y} r={7} tone="silver" /> },
]
const Materials = ({ B }) => (
  <g>
    {MATERIALS.map((m, i) => {
      const x = 36 + i * 62
      const at = i < 1 ? 0.3 : i < 3 ? B(1) : B(2)
      return (
        <g key={m.t} style={anim('mv-rise', at + (i % 2) * 0.3, 0.6)}>
          <rect x={x - 28} y={46} width="56" height="84" rx="8" className="mv-legendbox" />
          {m.draw(x, 76)}
          <text x={x} y={108} textAnchor="middle" className="mv-tag strong">
            {m.t}
          </text>
          <text x={x} y={121} textAnchor="middle" className="mv-tag">
            {m.s}
          </text>
        </g>
      )
    })}
    <Tag x={160} y={28} anchor="middle" at={0.1} strong>
      패키지를 이루는 재료
    </Tag>
  </g>
)

// 8단계 흐름
const STEPS = ['백그라인딩', '쏘잉', '다이 어태치', '와이어 본딩', '몰딩', '마킹', '패키지 쏘잉', '테스트']
const Flow = ({ B }) => (
  <g>
    {STEPS.map((t, i) => {
      const x = 22 + (i % 4) * 76
      const y = i < 4 ? 50 : 104
      return (
        <g key={t} style={anim('mv-rise', 0.3 + i * 0.35, 0.5)}>
          <rect x={x} y={y} width="64" height="34" rx="8" className="mv-step" />
          <text x={x + 32} y={y + 14} textAnchor="middle" className="mv-tag">
            {i + 1}
          </text>
          <text x={x + 32} y={y + 27} textAnchor="middle" className="mv-tag strong">
            {t}
          </text>
          {i % 4 !== 3 && <path d={`M${x + 66} ${y + 17} h7`} className="mv-arrow" markerEnd="url(#mv-head)" />}
          {i === 3 && <path d={`M${x + 32} ${y + 36} V${y + 44} H54 V${y + 52}`} className="mv-arrow" markerEnd="url(#mv-head)" fill="none" />}
        </g>
      )
    })}
    <Tag x={160} y={28} anchor="middle" at={0.1} strong>
      웨이퍼 → 패키지: 8단계
    </Tag>
    <Tag x={160} y={152} anchor="middle" at={B(1)}>
      다음 단원부터 한 단계씩 자세히 봅니다
    </Tag>
  </g>
)

export default {
  id: 'pkg-overview',
  scenes: {
    whole: { beat: 3.8, draw: (B) => <Whole B={B} /> },
    materials: { beat: 3.8, draw: (B) => <Materials B={B} /> },
    flow: { beat: 3.8, draw: (B) => <Flow B={B} /> },
  },
}
