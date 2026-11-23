import { anim, Callout, Heat, Rain, Slab, Tag } from '../kit.jsx'

// 범핑 애니메이션 그림(직접 그린 단면도). 자막은 data/processMovies/bumping.js
// 칩(실리콘) 윗면의 패드 위에 금속 범프를 세웁니다.
const SI = 120
const PADS = [70, 150, 230] // 패드 가운데 x

const Chip = () => (
  <>
    <rect x="0" y={SI} width="320" height="60" className="m-si" />
    <rect x="0" y={SI - 6} width="320" height="6" className="m-nitride" />
    {PADS.map((x) => (
      <rect key={x} x={x - 14} y={SI - 6} width="28" height="6" className="m-metal" />
    ))}
  </>
)

// 씨앗층 → 두꺼운 감광액 → 구멍 → 도금으로 금속이 자람 → 감광액·씨앗층 제거
const Plate = ({ B }) => (
  <g>
    <Chip />
    <Slab x={0} w={320} y={SI - 8} h={2} mat="barrier" enter="mv-fade" at={0.4} dur={0.6} exit="mv-fadeout" exitAt={B(2) + 0.6} exitDur={0.6} />
    {/* 두꺼운 감광액(구멍 뚫린) */}
    {[0, 1, 2, 3].map((i) => {
      const x0 = i === 0 ? 0 : PADS[i - 1] + 14
      const x1 = i === 3 ? 320 : PADS[i] - 14
      return <Slab key={i} x={x0} w={x1 - x0} y={SI - 48} h={40} mat="pr" enter="mv-grow" at={1.2} dur={0.8} exit="mv-fadeout" exitAt={B(2)} exitDur={0.6} />
    })}
    {/* 도금: 구멍 속에서 금속이 위로 자람 */}
    {PADS.map((x) => (
      <Slab key={x} x={x - 14} w={28} y={SI - 46} h={38} mat="metal" enter="mv-grow" at={B(1)} dur={2.6} />
    ))}
    <Rain x0={40} x1={280} y0={20} y1={SI - 50} n={8} at={B(1)} dur={1} r={1.6} cls="mv-water" until={B(2)} />
    <Callout x={30} y={SI - 7} tx={14} ty={148} text="씨앗층" at={0.6} />
    <Callout x={30} y={SI - 30} tx={14} ty={40} text="두꺼운 감광액" at={1.6} />
    <Tag x={200} y={30} anchor="middle" at={B(1)} strong>
      전기 도금으로 채움
    </Tag>
  </g>
)

// 리플로: 가열하면 범프가 둥글어짐
const Reflow = ({ B }) => (
  <g>
    <Chip />
    {PADS.map((x) => (
      <g key={x}>
        <g style={anim('mv-fadeout', 0.8, 1.2)}>
          <rect x={x - 14} y={SI - 44} width="28" height="38" className="m-metal" />
        </g>
        <circle cx={x} cy={SI - 22} r="18" className="mv-solder" style={anim('mv-fade', 0.8, 1.2)} />
      </g>
    ))}
    <Heat xs={[70, 150, 230]} y={30} at={0.2} />
    <Tag x={160} y={24} anchor="middle" at={0.2} strong>
      가열(리플로) → 둥근 범프
    </Tag>
    <Callout x={230} y={SI - 30} tx={300} ty={148} text="높이가 고르게, 표면 산화막 제거" at={B(1)} anchor="end" />
  </g>
)

export default {
  id: 'bumping',
  scenes: {
    plate: { beat: 3.8, draw: (B) => <Plate B={B} />, legend: ['si', 'metal', 'pr', 'barrier'] },
    reflow: { beat: 3.6, draw: (B) => <Reflow B={B} />, legend: ['si', 'metal'] },
  },
}
