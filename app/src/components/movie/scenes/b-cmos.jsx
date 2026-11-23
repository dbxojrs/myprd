import { Block, Tag, anim, loop } from '../kit.jsx'

// 반도체 기초 6: CMOS. 자막은 data/processMovies/b-cmos.js (직접 그린 그림)

// 작은 트랜지스터 하나(게이트 + 양쪽 영역)
const Mini = ({ x, y, sub, well, on, at }) => (
  <g>
    <Block x={x} y={y + 20} w={100} h={26} tone={sub} />
    <Block x={x} y={y + 12} w={32} h={14} tone={well} />
    <Block x={x + 68} y={y + 12} w={32} h={14} tone={well} />
    <rect x={x + 32} y={y + 8} width="36" height="4" className="mv-block-ox" />
    <Block x={x + 32} y={y - 4} w={36} h={12} tone="gate" />
    {on !== undefined && (
      <g style={anim('mv-fade', at, 0.4)}>
        <rect x={x + 32} y={y + 13} width="36" height="4" className={on ? 'mv-chan-on' : 'mv-chan-off'} style={on ? loop('mv-pulse', at, 1) : undefined} />
      </g>
    )}
  </g>
)

const Pair = ({ B }) => (
  <g>
    <Mini x={30} y={60} sub="n" well="p" />
    <Mini x={190} y={60} sub="p" well="n" />
    <Tag x={80} y={40} anchor="middle" at={0.2} strong>
      PMOS
    </Tag>
    <Tag x={240} y={40} anchor="middle" at={0.2} strong>
      NMOS
    </Tag>
    <Tag x={160} y={134} anchor="middle" at={B(1)} strong>
      한 쌍으로 묶어 같은 신호를 함께 받음
    </Tag>
  </g>
)

// 입력 1 → NMOS 켜짐·PMOS 꺼짐, 입력 0 → 반대. 늘 한쪽만 켜져 전류가 계속 새지 않음
const Invert = ({ B }) => (
  <g>
    <Mini x={30} y={44} sub="n" well="p" on={false} at={0.4} />
    <Mini x={190} y={44} sub="p" well="n" on at={0.4} />
    <Tag x={160} y={18} anchor="middle" at={0.2} strong>
      입력 1: NMOS 켜짐 · PMOS 꺼짐
    </Tag>
    <g style={anim('mv-fade', B(1), 0.4)}>
      <Mini x={30} y={100} sub="n" well="p" on at={B(1)} />
      <Mini x={190} y={100} sub="p" well="n" on={false} at={B(1)} />
      <Tag x={160} y={98} anchor="middle" strong>
        입력 0: 반대로
      </Tag>
    </g>
    <Tag x={160} y={156} anchor="middle" at={B(2)} strong>
      늘 한쪽만 켜져 전력을 적게 씀
    </Tag>
  </g>
)

export default {
  id: 'b-cmos',
  scenes: {
    pair: { beat: 3.8, draw: (B) => <Pair B={B} /> },
    invert: { beat: 3.8, draw: (B) => <Invert B={B} /> },
  },
}
