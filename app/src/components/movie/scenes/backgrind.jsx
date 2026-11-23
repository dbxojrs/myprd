import { anim, Callout, Rain, Tag, loop } from '../kit.jsx'

// 백그라인딩 애니메이션 그림(직접 그린 옆모습). 자막은 data/processMovies/backgrind.js

// 앞면에 회로가 있는 두꺼운 웨이퍼 + 보호 테이프
const Tape = ({ B }) => (
  <g>
    <rect x="40" y="80" width="240" height="44" rx="3" className="m-si" />
    {Array.from({ length: 12 }, (_, i) => (
      <rect key={i} x={46 + i * 19.5} y="74" width="15" height="6" className="mv-circuit" />
    ))}
    <Callout x={100} y={77} tx={60} ty={50} text="앞면: 회로" at={0.3} anchor="end" />
    <g className="mv-box" style={anim('mv-drop', B(1) - 1, 1)}>
      <rect x="36" y="66" width="248" height="8" rx="2" className="mv-tape" />
    </g>
    <Callout x={250} y={70} tx={280} ty={44} text="보호 테이프" at={B(1)} anchor="end" />
    <Tag x={160} y={148} anchor="middle" at={B(1) + 0.6}>
      회로를 보호한 뒤 뒷면을 갈아냄
    </Tag>
  </g>
)

// 척 위의 웨이퍼를 숫돌 휠이 갈아 얇게
const Grind = ({ B }) => (
  <g>
    <rect x="20" y="136" width="280" height="12" rx="3" className="mv-chuck" />
    <Tag x={160} y={145} anchor="middle" at={0}>
      척 테이블(진공으로 고정)
    </Tag>
    <rect x="40" y="128" width="240" height="8" className="mv-tape" />
    <g className="mv-box" style={anim('mv-thin', 0.8, B(2) + 1.5)}>
      <rect x="40" y="88" width="240" height="40" className="m-si" />
    </g>
    {/* 숫돌 휠: 위에서 돌면서 내려옴 */}
    <g style={anim('mv-wheeldown', 0.2, B(2) + 2.1)}>
      <rect x="120" y="22" width="80" height="20" rx="4" className="mv-wheel-body" />
      <g style={loop('mv-sway', 0.2, 0.25, 'linear')}>
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={122 + i * 10} y="42" width="6" height="8" className="mv-wheel-teeth" />
        ))}
      </g>
      <path d="M160 6 V22" className="mv-line" />
    </g>
    <Rain x0={110} x1={210} y0={84} y1={110} n={8} at={1} dur={0.7} r={1.4} cls="mv-dust" />
    <Tag x={262} y={30} anchor="middle" at={B(1)} strong>
      거친 숫돌 → 고운 숫돌
    </Tag>
  </g>
)

// 얇아진 웨이퍼가 휨(스마일) → 마운팅 테이프와 링 프레임에 붙여 잡아 줌
const Polish = ({ B }) => (
  <g>
    <g style={anim('mv-fadeout', B(1), 0.6)}>
      <path d="M60 96 Q160 60 260 96" className="mv-thinwafer" style={anim('mv-fade', 0.3, 0.8)} />
      <Tag x={160} y={46} anchor="middle" at={0.6} strong>
        얇을수록 더 휨(스마일 모양)
      </Tag>
      <Callout x={160} y={78} tx={230} ty={130} text="갈아낸 면에 남은 응력" at={1.2} />
    </g>
    <g style={anim('mv-fade', B(1), 0.6)}>
      <rect x="30" y="104" width="260" height="8" className="mv-dtape" />
      <rect x="22" y="100" width="16" height="16" rx="3" className="mv-ringside" />
      <rect x="282" y="100" width="16" height="16" rx="3" className="mv-ringside" />
      <rect x="60" y="96" width="200" height="8" className="m-si" />
      <Callout x={40} y={108} tx={30} ty={140} text="링 프레임" at={0} />
      <Callout x={200} y={110} tx={250} ty={140} text="마운팅 테이프" at={0.3} />
      <Tag x={160} y={60} anchor="middle" at={0.6} strong>
        평평하게 잡아 다음 공정(쏘잉)으로
      </Tag>
    </g>
  </g>
)

export default {
  id: 'backgrind',
  scenes: {
    tape: { beat: 3.6, draw: (B) => <Tape B={B} />, legend: ['si'] },
    grind: { beat: 3.8, draw: (B) => <Grind B={B} />, legend: ['si'] },
    polish: { beat: 3.6, draw: (B) => <Polish B={B} />, legend: ['si'] },
  },
}
