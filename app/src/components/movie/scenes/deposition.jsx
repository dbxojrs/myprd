import { anim, Callout, Rain, Slab, Substrate, Tag, loop, SI_TOP, W } from '../kit.jsx'

// 증착 공정 애니메이션 그림(직접 그린 단면도). 자막은 data/processMovies/deposition.js

// 막이 한 층씩 쌓여 고층 건물처럼 되는 모습
const Layers = ({ B }) => {
  const mats = ['oxide', 'film', 'metal', 'oxide', 'nitride', 'metal']
  return (
    <>
      <Substrate />
      {mats.map((m, i) => (
        <Slab key={i} x={40} w={240} y={SI_TOP - (i + 1) * 9} h={9} mat={m} enter="mv-grow" at={0.3 + i * ((B(1) + 2.5) / mats.length)} dur={0.8} />
      ))}
      <Callout x={280} y={SI_TOP - 5} tx={300} ty={90} text="1μm 이하의 얇은 막" at={0.6} anchor="end" />
      <Tag x={160} y={40} anchor="middle" at={B(1)} strong>
        막 입히기 → 그리기 → 깎기를 반복해 층층이
      </Tag>
    </>
  )
}

// CVD: 가스가 표면에서 반응해 막이 자람
const Cvd = ({ B }) => (
  <>
    <Substrate />
    <Rain x0={20} x1={300} y0={22} y1={SI_TOP - 4} n={16} at={0.2} dur={1.5} cls="mv-gas" />
    <Rain x0={30} x1={290} y0={22} y1={SI_TOP - 4} n={10} at={0.9} dur={1.7} r={1.6} cls="mv-ion" />
    <Slab x={0} w={W} y={SI_TOP - 14} h={14} mat="film" enter="mv-grow" at={0.8} dur={B(2) + 2.5} />
    <Tag x={160} y={16} anchor="middle" at={0.2} strong>
      반응 가스
    </Tag>
    <g style={anim('mv-fade', B(1), 0.6)}>
      <rect x="10" y="36" width="300" height="30" rx="8" className="mv-plasma" style={loop('mv-pulse', B(1), 1.8, 'ease-in-out')} />
      <Tag x={160} y={55} anchor="middle" strong>
        플라즈마로 낮은 온도에서도 반응
      </Tag>
    </g>
  </>
)

// PVD(스퍼터링): 이온이 금속 타깃을 때려 원자를 떼어 내고, 그 원자가 웨이퍼에 쌓임
const Pvd = ({ B }) => (
  <>
    <Substrate />
    <rect x="40" y="8" width="240" height="16" rx="3" className="m-metal" />
    <Tag x={160} y={19} anchor="middle" at={0}>
      금속 타깃
    </Tag>
    {/* 이온이 위로 날아가 타깃에 부딪힘 */}
    <g>
      {[70, 120, 170, 220, 260].map((x, i) => (
        <circle key={x} cx={x} cy={90} r="2.2" className="mv-ion" style={{ ...loop('mv-fall', 0.2 + i * 0.25, 1.1, 'ease-in'), '--fall': '-62px' }} />
      ))}
    </g>
    {/* 떨어져 나온 금속 원자가 아래로 */}
    <Rain x0={50} x1={270} y0={28} y1={SI_TOP - 4} n={12} at={0.7} dur={1.4} r={2.2} cls="mv-atom" />
    <Slab x={0} w={W} y={SI_TOP - 10} h={10} mat="metal" enter="mv-grow" at={1} dur={B(1) + 2.5} />
    <Callout x={70} y={88} tx={30} ty={60} text="이온이 때림" at={0.4} />
    <Callout x={200} y={SI_TOP - 6} tx={250} ty={150} text="금속막" at={B(1)} />
  </>
)

// ALD: 홈이 있는 표면에 한 층씩 고르게(단차 피복)
const Ald = ({ B }) => {
  const trench = (d) => `M0 ${SI_TOP - d} H${130 - d} V${70 - d} H${190 + d} V${SI_TOP - d} H${W}`
  return (
    <>
      <path d={`M0 ${SI_TOP} H130 V70 H190 V${SI_TOP} H${W} V180 H0 Z`} className="m-si" />
      {[1, 2, 3, 4].map((n) => (
        <path key={n} d={trench(n * 3)} className="mv-ald" style={anim('mv-fade', 0.4 + (n - 1) * ((B(1) + 2) / 4), 0.6)} />
      ))}
      <Rain x0={20} x1={300} y0={14} y1={60} n={10} at={0.2} dur={1.2} cls="mv-gas" until={B(1) + 2.5} />
      <Tag x={160} y={14} anchor="middle" at={0.2} strong>
        재료 A → 재료 B를 번갈아: 원자 한 층씩
      </Tag>
      <Callout x={128} y={100} tx={70} ty={60} text="옆벽" at={B(2)} anchor="end" />
      <Callout x={160} y={SI_TOP - 2} tx={230} ty={150} text="바닥까지 같은 두께" at={B(2) + 0.4} />
    </>
  )
}

export default {
  id: 'deposition',
  scenes: {
    layers: { beat: 3.6, draw: (B) => <Layers B={B} />, legend: ['si', 'oxide', 'film', 'metal', 'nitride'] },
    cvd: { beat: 3.6, draw: (B) => <Cvd B={B} />, legend: ['si', 'film'] },
    pvd: { beat: 3.6, draw: (B) => <Pvd B={B} />, legend: ['si', 'metal'] },
    ald: { beat: 3.8, draw: (B) => <Ald B={B} />, legend: ['si'] },
  },
}
