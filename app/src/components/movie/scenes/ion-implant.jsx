import { anim, Callout, Rain, Slab, Substrate, Tag, loop, SI_TOP, W } from '../kit.jsx'

// 이온 주입 애니메이션 그림(직접 그린 단면도). 자막은 data/processMovies/ion-implant.js

// 실리콘 원자 격자(점)와 불순물 원자
const Lattice = ({ B }) => (
  <>
    <rect x="0" y="20" width={W} height="160" className="m-si" />
    {Array.from({ length: 9 }, (_, r) =>
      Array.from({ length: 16 }, (_, c) => <circle key={`${r}-${c}`} cx={12 + c * 19.5} cy={32 + r * 16} r="3.2" className="mv-siatom" />),
    )}
    <Tag x={160} y={14} anchor="middle" at={0} strong>
      순수한 실리콘: 전기가 잘 통하지 않음
    </Tag>
    {/* 15족(인·비소) → n형, 13족(붕소) → p형 */}
    {[
      [4, 3, 'n'],
      [9, 2, 'n'],
      [13, 5, 'n'],
    ].map(([c, r]) => (
      <circle key={`n${c}`} cx={12 + c * 19.5} cy={32 + r * 16} r="4.4" className="mv-dopant-n" style={anim('mv-fade', B(1), 0.6)} />
    ))}
    {[
      [2, 6, 'p'],
      [7, 5, 'p'],
      [11, 7, 'p'],
    ].map(([c, r]) => (
      <circle key={`p${c}`} cx={12 + c * 19.5} cy={32 + r * 16} r="4.4" className="mv-dopant-p" style={anim('mv-fade', B(1) + 0.8, 0.6)} />
    ))}
    <g style={anim('mv-fade', B(1), 0.5)}>
      <rect x="236" y="0" width="82" height="30" rx="6" className="mv-legendbox" />
      <circle cx="246" cy="9" r="4" className="mv-dopant-n" />
      <text x="254" y="12" className="mv-tag">
        인·비소 → n형
      </text>
      <circle cx="246" cy="21" r="4" className="mv-dopant-p" />
      <text x="254" y="24" className="mv-tag">
        붕소 → p형
      </text>
    </g>
  </>
)

// 이온 빔이 들어가고, 산화막이 덮인 곳은 막힘
const Beam = ({ B }) => (
  <>
    <Substrate />
    <Slab x={0} w={120} y={SI_TOP - 14} h={14} mat="oxide" />
    <Slab x={200} w={120} y={SI_TOP - 14} h={14} mat="oxide" />
    {/* 뚫린 곳은 실리콘 속까지, 덮인 곳은 덮개 위에서 멈춤 */}
    <Rain x0={124} x1={196} y0={20} y1={SI_TOP + 14} n={5} at={0.3} dur={0.9} r={2} cls="mv-ion" />
    <Rain x0={8} x1={116} y0={20} y1={SI_TOP - 16} n={6} at={0.3} dur={0.8} r={2} cls="mv-ion" />
    <Rain x0={204} x1={312} y0={20} y1={SI_TOP - 16} n={6} at={0.3} dur={0.8} r={2} cls="mv-ion" />
    <path d={`M0 ${SI_TOP - 15} H120 M200 ${SI_TOP - 15} H320`} className="mv-shield" style={anim('mv-fade', B(1), 0.5)} />
    <g className="mv-box top" style={anim('mv-grow', B(1) + 0.3, 2.4)}>
      <path d={`M122 ${SI_TOP} H198 V${SI_TOP + 18} Q160 ${SI_TOP + 30} 122 ${SI_TOP + 18} Z`} className="m-doped" />
    </g>
    <Tag x={160} y={14} anchor="middle" at={0} strong>
      이온 빔
    </Tag>
    <Callout x={60} y={SI_TOP - 8} tx={40} ty={70} text="산화막이 막음" at={B(1)} />
    <Callout x={160} y={SI_TOP + 12} tx={226} ty={150} text="불순물이 들어간 영역" at={B(2)} />
  </>
)

// 열처리(어닐링): 흐트러진 원자가 제자리로 돌아감
const Anneal = ({ B }) => {
  const cells = []
  for (let r = 0; r < 7; r++)
    for (let c = 0; c < 14; c++) {
      const x = 30 + c * 19
      const y = 50 + r * 16
      // 이온에 부딪혀 흐트러진 위치(가운데 위쪽이 더 많이)
      const hit = r < 4 && c > 3 && c < 11 && (r * 7 + c * 3) % 3 !== 0
      const dx = hit ? ((r * 5 + c * 11) % 9) - 4 : 0
      const dy = hit ? ((r * 13 + c * 7) % 9) - 4 : 0
      cells.push({ x, y, dx, dy, hit, dop: hit && (r + c) % 5 === 0, k: `${r}-${c}` })
    }
  return (
    <>
      <rect x="0" y="36" width="320" height="144" className="m-si" />
      {cells.map((a) => (
        <circle
          key={a.k}
          cx={a.x}
          cy={a.y}
          r={a.dop ? 4.2 : 3.2}
          className={a.dop ? 'mv-dopant-p' : 'mv-siatom'}
          style={a.hit ? { ...anim('mv-settle', B(1), 2.2), '--dx': `${a.dx}px`, '--dy': `${a.dy}px` } : undefined}
        />
      ))}
      <g style={anim('mv-fadeout', B(1), 0.4)}>
        <Tag x={160} y={26} anchor="middle" at={0} strong>
          이온에 부딪혀 결정이 흐트러짐
        </Tag>
      </g>
      <g style={anim('mv-fade', B(1), 0.6)}>
        <rect x="0" y="0" width="320" height="180" className="mv-heatwash" style={loop('mv-pulse', B(1), 1.6, 'ease-in-out')} />
      </g>
      <Tag x={160} y={26} anchor="middle" at={B(1) + 0.4} strong>
        열처리(예: 850℃ 이상) → 원자가 제자리로, 불순물 활성화
      </Tag>
    </>
  )
}

export default {
  id: 'ion-implant',
  scenes: {
    why: { beat: 3.8, draw: (B) => <Lattice B={B} />, legend: ['si'] },
    beam: { beat: 3.6, draw: (B) => <Beam B={B} />, legend: ['si', 'oxide', 'doped'] },
    anneal: { beat: 3.8, draw: (B) => <Anneal B={B} />, legend: ['si'] },
  },
}
