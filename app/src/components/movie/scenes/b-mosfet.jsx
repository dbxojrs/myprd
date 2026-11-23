import { Ball, Block, Callout, Tag, anim, loop } from '../kit.jsx'

// 반도체 기초 5: MOSFET. 자막은 data/processMovies/b-mosfet.js (직접 그린 그림)

// 단면: P형 바탕 + 양쪽 N형(소스·드레인) + 가운데 위 절연층과 게이트
const Device = ({ sub = 'p', well = 'n', labels = true, at = 0 }) => (
  <g>
    <Block x={40} y={92} w={240} h={52} tone={sub} style={anim('mv-rise', at, 0.6)} />
    <Block x={40} y={78} w={82} h={24} tone={well} style={anim('mv-rise', at + 0.3, 0.6)} />
    <Block x={198} y={78} w={82} h={24} tone={well} style={anim('mv-rise', at + 0.3, 0.6)} />
    <g style={anim('mv-drop', at + 0.6, 0.6)}>
      <rect x="122" y="72" width="76" height="6" className="mv-block-ox" />
      <Block x={122} y={50} w={76} h={22} tone="gate" />
    </g>
    {labels && (
      <>
        <text x="81" y="94" textAnchor="middle" className="mv-block-label">
          {well.toUpperCase()}형
        </text>
        <text x="239" y="94" textAnchor="middle" className="mv-block-label">
          {well.toUpperCase()}형
        </text>
        <text x="160" y="126" textAnchor="middle" className="mv-block-label">
          {sub.toUpperCase()}형
        </text>
      </>
    )}
  </g>
)

const Structure = ({ B }) => (
  <g>
    <Device />
    <Callout x={160} y={52} tx={250} ty={24} text="게이트" at={B(1)} />
    <Callout x={124} y={75} tx={20} ty={40} text="절연층(산화막)" at={B(1) + 0.4} />
    <Callout x={70} y={86} tx={14} ty={150} text="소스" at={B(2)} />
    <Callout x={250} y={86} tx={306} ty={150} text="드레인" at={B(2) + 0.3} anchor="end" />
  </g>
)

// 게이트에 +전압 → 게이트 아래로 전자가 모여 길(채널)이 생김 → 소스에서 드레인으로 흐름
const Channel = ({ B }) => (
  <g>
    <Device labels={false} />
    <g style={anim('mv-fade', 0.4, 0.4)}>
      <path d="M160 50 V22" className="mv-vline plus" />
      <text x="160" y="18" textAnchor="middle" className="mv-tag strong">
        +
      </text>
    </g>
    {Array.from({ length: 9 }, (_, i) => (
      <Ball key={i} cx={128 + i * 8} cy={84} r={3.6} tone="orange" style={{ ...anim('mv-gather', 0.8 + i * 0.08, 1.2), '--gy': `${30 + (i % 3) * 8}px` }} />
    ))}
    <Callout x={160} y={84} tx={20} ty={30} text="게이트 아래 전자의 길(채널)" at={1.8} />
    {/* 채널이 생기면 소스 → 드레인으로 전자가 흐름 */}
    <g style={anim('mv-fade', B(1), 0.4)}>
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i} style={{ ...loop('mv-slide-r', B(1) + i * 0.3, 1.8), '--sx': '150px' }}>
          <Ball cx={70} cy={86} r={3.2} tone="orange" />
        </g>
      ))}
    </g>
    <Tag x={160} y={152} anchor="middle" at={B(2)} strong>
      전압을 빼면 길이 사라져 꺼짐 → 스위치
    </Tag>
  </g>
)

// NMOS와 PMOS 비교
const Pair = ({ B }) => (
  <g>
    <g transform="translate(-10 0) scale(0.55) translate(0 40)">
      <Device sub="p" well="n" />
    </g>
    <g transform="translate(150 0) scale(0.55) translate(0 40)">
      <Device sub="n" well="p" at={0.4} />
    </g>
    <Tag x={78} y={30} anchor="middle" at={0.3} strong>
      NMOS: 전자가 길을 만듦
    </Tag>
    <Tag x={238} y={30} anchor="middle" at={0.7} strong>
      PMOS: 정공이 길을 만듦
    </Tag>
    <Tag x={160} y={150} anchor="middle" at={B(1)}>
      N과 P의 자리를 바꾸면 반대로 동작
    </Tag>
  </g>
)

export default {
  id: 'b-mosfet',
  scenes: {
    structure: { beat: 3.8, draw: (B) => <Structure B={B} /> },
    channel: { beat: 3.8, draw: (B) => <Channel B={B} /> },
    pair: { beat: 3.8, draw: (B) => <Pair B={B} /> },
  },
}
