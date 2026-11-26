import { anim, Callout, Rain, Slab, Substrate, Tag, loop, SI_TOP, W } from '../kit.jsx'

// CMP 애니메이션 그림(직접 그린 단면도). 자막은 data/processMovies/cmp.js
// 실제 장비 모양·치수가 아니라 원리를 보여 주는 교육용 그림입니다.

// 단차 위에 막을 쌓으면 울퉁불퉁 → 갈아서 평평하게
const Why = ({ B }) => {
  const steps = [40, 130, 220]
  const bumpy = `M0 104 ${steps.map((x) => `H${x - 8} Q${x - 4} 84 ${x + 6} 82 H${x + 54} Q${x + 64} 84 ${x + 68} 104`).join(' ')} H${W} V${SI_TOP} H0 Z`
  return (
    <>
      <Substrate />
      <g style={anim('mv-fadeout', B(2), 0.9)}>
        <path d={bumpy} className="m-film" />
      </g>
      <g style={anim('mv-fade', B(2) + 0.3, 0.9)}>
        <rect x="0" y="92" width={W} height={SI_TOP - 92} className="m-film" />
      </g>
      {steps.map((x) => (
        <rect key={x} x={x} y={SI_TOP - 26} width="60" height="26" className="m-metal" />
      ))}
      <Callout x={70} y={84} tx={20} ty={40} text="막을 쌓으면 표면이 울퉁불퉁" at={0.3} />
      <Tag x={160} y={70} anchor="middle" at={B(2) + 0.6} strong>
        갈아서 평평하게
      </Tag>
    </>
  )
}

// 장비: 회전하는 패드 + 웨이퍼를 누르는 헤드 + 슬러리
const Tool = ({ B }) => (
  <>
    {/* 패드(옆에서 본 모습)와 회전 표시 */}
    <rect x="20" y="118" width="280" height="14" rx="3" className="mv-pad" />
    <rect x="20" y="132" width="280" height="10" rx="2" className="mv-block-gray" />
    <path d="M40 150 H280" className="mv-route" style={loop('mv-flow', 0.2, 0.6)} />
    <Tag x={24} y={112} at={0.4}>
      패드가 회전
    </Tag>
    {/* 헤드가 웨이퍼를 뒤집어 잡고 누름 */}
    <g style={loop('mv-press', 0.6, 1.6, 'ease-in-out')}>
      <rect x="150" y="76" width="80" height="30" rx="4" className="mv-block-gray" />
      <rect x="156" y="106" width="68" height="8" className="m-si" />
      <rect x="156" y="113" width="68" height="4" className="m-film" />
    </g>
    <Callout x={200} y={78} tx={300} ty={42} text="헤드가 웨이퍼를 눌러 돌림" at={0.6} anchor="end" />
    {/* 슬러리 */}
    <rect x="66" y="40" width="10" height="20" rx="2" className="mv-block-gray" />
    <Rain x0={70} x1={74} y0={62} y1={116} n={4} at={B(1)} dur={0.9} r={2.2} cls="mv-water" />
    <Callout x={76} y={90} tx={86} ty={58} text="슬러리(연마 입자+약품)" at={B(1) + 0.3} />
    <Tag x={300} y={68} anchor="end" at={B(2)} strong>
      힘 × 속도 ↑ → 더 빨리 깎임
    </Tag>
  </>
)

// 다마신: 홈에 구리를 넘치게 채움 → 넘친 부분을 갈아 냄 → 디싱
const Damascene = ({ B }) => {
  const trenches = [60, 150, 240]
  return (
    <>
      <Substrate />
      <Slab x={0} y={84} h={SI_TOP - 84} mat="oxide" />
      {trenches.map((x) => (
        <rect key={x} x={x} y="84" width="34" height="30" className="m-metal" />
      ))}
      {/* 넘친 구리: 갈려 나감 */}
      <Slab x={0} y={70} h={14} mat="metal" exit="mv-erase" exitAt={B(1)} exitDur={1.4} origin="top" />
      <Callout x={160} y={76} tx={300} ty={52} text="홈을 넘치게 채운 구리" at={0.4} anchor="end" />
      <Tag x={20} y={40} at={B(1) + 1.2} strong>
        넘친 부분만 갈아 내면 배선이 남음
      </Tag>
      {/* 디싱: 넓은 배선 가운데가 오목 */}
      {/* 디싱: 가운데 배선 윗면이 접시처럼 패여 내려감 */}
      <g style={anim('mv-fade', B(2), 0.6)}>
        <path d="M150 84 Q167 100 184 84" className="mv-alert" strokeWidth="2.6" />
      </g>
      <Callout x={167} y={92} tx={20} ty={62} text="디싱: 접시처럼 오목하게 패임" at={B(2) + 0.2} />
    </>
  )
}

// CMP 후 세정: 남은 입자를 브러시로 씻어 냄
const After = ({ B }) => (
  <>
    <Substrate />
    <rect x="0" y="100" width={W} height={SI_TOP - 100} className="m-film" />
    <g style={anim('mv-fadeout', B(1) + 1, 0.6)}>
      {[40, 90, 150, 200, 260].map((x, i) => (
        <circle key={x} cx={x} cy={96 - (i % 2) * 2} r="3" className="mv-dust" />
      ))}
      <path d="M120 101 l30 -1 M210 100 l26 1" className="mv-alert" strokeWidth="1.2" />
    </g>
    <Callout x={90} y={96} tx={20} ty={50} text="남은 입자·긁힘" at={0.3} />
    <g style={anim('mv-scan', B(1), 1.6, { ease: 'linear' })}>
      <rect x="40" y="70" width="30" height="24" rx="12" className="mv-pad" />
      <path d="M44 94 V100 M50 94 V100 M56 94 V100 M62 94 V100 M66 94 V100" className="mv-wave" />
    </g>
    <Tag x={240} y={50} anchor="middle" at={B(1)} strong>
      브러시로 씻고 말리기
    </Tag>
  </>
)

export default {
  id: 'cmp',
  scenes: {
    why: { beat: 3.8, draw: (B) => <Why B={B} />, legend: ['si', 'film', 'metal'] },
    tool: { beat: 3.8, draw: (B) => <Tool B={B} />, legend: ['si', 'film'] },
    damascene: { beat: 3.8, draw: (B) => <Damascene B={B} />, legend: ['si', 'oxide', 'metal'] },
    after: { beat: 3.6, draw: (B) => <After B={B} />, legend: ['si', 'film'] },
  },
}
