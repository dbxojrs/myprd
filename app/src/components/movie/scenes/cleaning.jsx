import { anim, Block, Callout, Rain, Substrate, Tag, loop, SI_TOP, W } from '../kit.jsx'

// 세정 애니메이션 그림(직접 그린 그림). 자막은 data/processMovies/cleaning.js
// 실제 장비 모양·약품 농도가 아니라 원리를 보여 주는 교육용 그림입니다.

// 웨이퍼 위의 오염: 입자·금속·유기물·자연산화막 → 씻겨 나감
const Why = ({ B }) => {
  const dirt = [
    { x: 50, cls: 'mv-dust', r: 4 },
    { x: 110, cls: 'mv-ball', r: 3 },
    { x: 180, cls: 'mv-dust', r: 5 },
    { x: 240, cls: 'mv-ball', r: 3 },
    { x: 280, cls: 'mv-dust', r: 3.5 },
  ]
  return (
    <>
      <Substrate />
      <g style={anim('mv-fadeout', B(2) + 1.2, 0.6)}>
        <rect x="0" y={SI_TOP - 3} width={W} height="3" className="m-oxide" />
      </g>
      <g style={anim('mv-lift', B(2) + 0.6, 1.2)}>
        <g style={anim('mv-fadeout', B(2) + 1, 0.8)}>
          {dirt.map((d) => (
            <circle key={d.x} cx={d.x} cy={SI_TOP - 3 - d.r} r={d.r} className={d.cls} />
          ))}
        </g>
      </g>
      <Callout x={180} y={SI_TOP - 10} tx={210} ty={50} text="작은 입자 하나도 불량의 원인" at={0.3} />
      <Tag x={20} y={44} at={B(1)}>
        입자 · 금속 · 유기물 · 자연산화막
      </Tag>
      <Tag x={160} y={90} anchor="middle" at={B(2) + 1.4} strong>
        깨끗한 표면
      </Tag>
    </>
  )
}

// RCA 세정: 약품 세 가지가 차례로 하는 일
const Rca = ({ B }) => (
  <>
    <Block x={20} y={40} w={84} h={40} tone="p" label="SC-1" style={anim('mv-rise', 0.2, 0.6)} />
    <Tag x={62} y={100} anchor="middle" at={0.5}>
      입자 떼어 내기
    </Tag>
    <Block x={118} y={40} w={84} h={40} tone="n" label="SC-2" style={anim('mv-rise', B(1), 0.6)} />
    <Tag x={160} y={100} anchor="middle" at={B(1) + 0.3}>
      금속 오염 없애기
    </Tag>
    <Block x={216} y={40} w={84} h={40} tone="gray" label="묽은 HF" style={anim('mv-rise', B(2), 0.6)} />
    <Tag x={258} y={100} anchor="middle" at={B(2) + 0.3}>
      자연산화막 없애기
    </Tag>
    <rect x="20" y="130" width="280" height="30" className="m-si" />
    <Tag x={160} y={150} anchor="middle" at={0}>
      웨이퍼
    </Tag>
  </>
)

// 헹굼·건조와 패턴 붕괴
const Dry = ({ B }) => {
  const lines = [70, 100, 130, 160, 190, 220]
  return (
    <>
      <Substrate />
      <Rain x0={40} x1={280} y0={10} y1={60} n={10} at={0.2} dur={1} r={2} cls="mv-water" until={B(1)} />
      {lines.map((x, i) => (
        <g key={x} className={i === 3 ? 'mv-box' : undefined} style={i === 3 ? anim('mv-sweep', B(1) + 0.4, 1.2) : undefined}>
          <rect x={x} y="64" width="10" height={SI_TOP - 64} className="m-oxide" />
        </g>
      ))}
      <Callout x={165} y={70} tx={300} ty={56} text="말릴 때 가는 패턴이 쓰러짐" at={B(1) + 0.8} anchor="end" />
      <Tag x={160} y={38} anchor="middle" at={B(2)} strong>
        표면장력 없는 초임계 유체로 씻기도 함
      </Tag>
    </>
  )
}

// 배치식(여러 장을 한 조에) vs 매엽식(한 장씩)
const Type = ({ B }) => (
  <>
    <rect x="20" y="70" width="120" height="80" rx="4" className="mv-block-gray" />
    <rect x="24" y="84" width="112" height="62" className="mv-water" opacity="0.55" />
    {[40, 60, 80, 100, 120].map((x) => (
      <rect key={x} x={x} y="60" width="4" height="80" className="m-si" />
    ))}
    <Tag x={80} y={50} anchor="middle" at={0.2} strong>
      배치식: 여러 장을 한꺼번에
    </Tag>
    <g style={anim('mv-fade', B(1), 0.6)}>
      <rect x="180" y="70" width="120" height="80" rx="4" className="mv-block-gray" />
      <g style={loop('mv-spinx', B(1), 0.8)}>
        <rect x="200" y="120" width="80" height="6" className="m-si" />
      </g>
      <rect x="236" y="76" width="8" height="14" className="mv-pad" />
    </g>
    <Rain x0={238} x1={242} y0={92} y1={118} n={3} at={B(1) + 0.3} dur={0.7} r={1.8} cls="mv-water" />
    <Tag x={240} y={50} anchor="middle" at={B(1)} strong>
      매엽식: 한 장씩
    </Tag>
  </>
)

export default {
  id: 'cleaning',
  scenes: {
    why: { beat: 3.6, draw: (B) => <Why B={B} />, legend: ['si', 'oxide'] },
    rca: { beat: 3.6, draw: (B) => <Rca B={B} />, legend: ['si'] },
    dry: { beat: 3.8, draw: (B) => <Dry B={B} />, legend: ['si', 'oxide'] },
    type: { beat: 3.8, draw: (B) => <Type B={B} />, legend: ['si'] },
  },
}
