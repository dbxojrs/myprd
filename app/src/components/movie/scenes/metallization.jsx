import { anim, Callout, Slab, Substrate, Tag, loop, SI_TOP, W } from '../kit.jsx'

// 금속 배선 애니메이션 그림(직접 그린 단면도). 자막은 data/processMovies/metallization.js

// 트랜지스터(간단히: 게이트 2개) 위를 선으로 잇는 그림
const Why = ({ B }) => (
  <>
    <Substrate />
    {[70, 170, 250].map((x) => (
      <g key={x}>
        <Slab x={x} w={30} y={SI_TOP - 4} h={4} mat="oxide" />
        <Slab x={x} w={30} y={SI_TOP - 18} h={14} mat="film" />
      </g>
    ))}
    <Tag x={160} y={70} anchor="middle" at={0.2} strong>
      소자(트랜지스터)만으로는 신호가 오가지 못합니다
    </Tag>
    <g style={anim('mv-fade', B(1), 0.6)}>
      <path d={`M85 ${SI_TOP - 18} V90 H185 V${SI_TOP - 18} M185 90 H265 V${SI_TOP - 18}`} className="mv-route" style={loop('mv-flow', B(1), 0.8)} />
    </g>
    <Tag x={225} y={84} anchor="middle" at={B(1) + 0.4}>
      금속선으로 연결
    </Tag>
  </>
)

// 콘택: 절연막에 구멍 → 방지막 → 텅스텐으로 채움
const Contact = ({ B }) => {
  const hx = 140
  const hw = 40
  return (
    <>
      <Substrate />
      <Slab x={0} w={hx} y={70} h={SI_TOP - 70} mat="oxide" />
      <Slab x={hx + hw} w={W - hx - hw} y={70} h={SI_TOP - 70} mat="oxide" />
      {/* 방지막: 구멍 안쪽을 얇게 덮음 */}
      <g style={anim('mv-fade', B(1), 0.8)}>
        <path d={`M${hx} 70 V${SI_TOP} H${hx + hw} V70 h-4 V${SI_TOP - 4} H${hx + 4} V70 Z`} className="m-barrier" />
      </g>
      {/* 텅스텐 채우기 */}
      <Slab x={hx + 4} w={hw - 8} y={70} h={SI_TOP - 74} mat="metal" enter="mv-grow" at={0.6} dur={B(1) - 0.8} className="m-tungsten" />
      <Callout x={hx + hw / 2} y={100} tx={230} ty={56} text="텅스텐(W)으로 채운 콘택" at={0.8} />
      <Callout x={hx + 2} y={110} tx={70} ty={56} text="방지막" at={B(1) + 0.4} anchor="end" />
      <g style={anim('mv-fade', B(2), 0.6)}>
        <rect x={hx - 6} y={SI_TOP} width={hw + 12} height="6" className="mv-silicide" />
      </g>
      <Callout x={hx + hw + 4} y={SI_TOP + 3} tx={312} ty={150} text="실리사이드: 접촉 저항을 낮춤" at={B(2) + 0.3} anchor="end" />
    </>
  )
}

// 알루미늄 배선: 금속막 → 무늬 → 식각 → 사이를 절연막으로
const Aluminum = ({ B }) => (
  <>
    <Substrate />
    <Slab y={SI_TOP - 14} h={14} mat="oxide" />
    <Slab y={SI_TOP - 34} h={20} mat="metal" enter="mv-grow" at={0.3} dur={1.2} />
    {[
      [0, 60],
      [100, 40],
      [180, 40],
      [260, 60],
    ].map(([x, w]) => (
      <Slab key={x} x={x} w={w} y={SI_TOP - 44} h={10} mat="pr" enter="mv-fade" at={1.6} dur={0.5} exit="mv-fadeout" exitAt={B(1) + 0.8} exitDur={0.6} />
    ))}
    {[
      [60, 40],
      [140, 40],
      [220, 40],
    ].map(([x, w]) => (
      <g key={x}>
        <Slab x={x} w={w} y={SI_TOP - 34} h={20} mat="metal" exit="mv-erase" exitAt={2.2} exitDur={1.2} />
        <Slab x={x} w={w} y={SI_TOP - 34} h={20} mat="oxide" enter="mv-grow" at={B(1) + 1} dur={1.2} />
      </g>
    ))}
    <Tag x={160} y={40} anchor="middle" at={0.3} strong>
      알루미늄: 금속막 → 무늬 → 깎기 → 사이 채우기
    </Tag>
    <Callout x={30} y={SI_TOP - 24} tx={30} ty={66} text="알루미늄 선" at={B(1) + 1.8} />
  </>
)

// 구리 배선(다마신): 절연막에 홈 → 방지막 → 구리 도금으로 넘치게 → 위를 갈아냄(CMP)
const Copper = ({ B }) => {
  const trenches = [60, 140, 220]
  const top = SI_TOP - 40
  return (
    <>
      <Substrate />
      <Slab y={SI_TOP - 10} h={10} mat="oxide" />
      <Slab x={0} w={60} y={top} h={30} mat="oxide" />
      {trenches.map((x, i) => (
        <Slab key={x} x={x + 40} w={i === 2 ? 60 : 40} y={top} h={30} mat="oxide" />
      ))}
      {trenches.map((x) => (
        <g key={x}>
          <g style={anim('mv-fade', 0.6, 0.6)}>
            <path d={`M${x} ${top} V${top + 30} H${x + 40} V${top} h-3 V${top + 27} H${x + 3} V${top} Z`} className="m-barrier" />
          </g>
          <Slab x={x + 3} w={34} y={top} h={27} mat="metal" enter="mv-grow" at={1.2} dur={B(1) - 1} />
        </g>
      ))}
      {/* 넘친 구리 → CMP로 깎음 */}
      <Slab y={top - 12} h={12} mat="metal" enter="mv-grow" at={B(1) - 0.6} dur={1} exit="mv-erase" exitAt={B(1) + 1} exitDur={2} />
      <g style={{ ...anim('mv-fade', B(1) + 0.6, 0.4) }}>
        <g style={anim('mv-fadeout', B(2), 0.5)}>
          <rect x="-20" y={top - 26} width="360" height="12" rx="4" className="mv-pad" style={loop('mv-sway', B(1) + 0.6, 0.6, 'ease-in-out')} />
          <Tag x={160} y={top - 30} anchor="middle" strong>
            CMP: 높은 곳부터 갈아내 평평하게
          </Tag>
        </g>
      </g>
      <Tag x={160} y={34} anchor="middle" at={0.2} strong>
        구리(다마신): 홈 파기 → 채우기 → 갈아내기
      </Tag>
      <Callout x={63} y={top + 15} tx={30} ty={150} text="방지막(탄탈럼)" at={B(2)} />
    </>
  )
}

// 여러 층 배선: 위로 갈수록 굵게
const Multi = ({ B }) => (
  <>
    <Substrate />
    {[0, 1, 2, 3].map((lv) => {
      const h = 6 + lv * 3
      const y = SI_TOP - 14 - lv * 26 - h
      const n = 8 - lv * 2
      const w = (W - 40) / n
      return (
        <g key={lv} style={anim('mv-rise', 0.3 + lv * 0.6, 0.8)}>
          <rect x="10" y={y - 6} width={W - 20} height={h + 12} className="m-oxide" opacity="0.5" />
          {Array.from({ length: n }, (_, i) => (
            <rect key={i} x={20 + i * w + w * 0.2} y={y} width={w * 0.6} height={h} className="m-metal" />
          ))}
          {lv > 0 && <rect x={20 + w * 0.45} y={y + h} width="4" height="20" className="m-metal" />}
        </g>
      )
    })}
    <Callout x={300} y={40} tx={300} ty={20} text="위층일수록 굵은 배선" at={B(0) + 2.5} anchor="end" />
  </>
)

export default {
  id: 'metallization',
  scenes: {
    why: { beat: 3.6, draw: (B) => <Why B={B} />, legend: ['si', 'oxide', 'film'] },
    contact: { beat: 3.8, draw: (B) => <Contact B={B} />, legend: ['si', 'oxide', 'barrier', 'metal'] },
    aluminum: { beat: 3.8, draw: (B) => <Aluminum B={B} />, legend: ['si', 'oxide', 'metal', 'pr'] },
    copper: { beat: 3.8, draw: (B) => <Copper B={B} />, legend: ['si', 'oxide', 'barrier', 'metal'] },
    multi: { beat: 4.2, draw: (B) => <Multi B={B} />, legend: ['oxide', 'metal'] },
  },
}
