import { Box, Cylinder, LotToken, P, Part, S, Tag } from './isoKit.jsx'

// 볼 본더 입체 그림. 출처(review/equipment-back.md 4장)로 확인한 구성요소만 부위로 그렸습니다:
// 본드 헤드·트랜스듀서, 캐필러리, EFO, 와이어 공급, 가열부, 스트립.
// 히트 블록·윈도 클램프·매거진 핸들러·인덱서 레일은 출처 미확인이라 그리지 않고 스트립 받침만 단순하게 그린 도식입니다.

// 스트립 위 다이와 리드 위치(장비 좌표)
const DIE = [4.6, 3.3]
const PADS = [3.0, 3.25, 3.5, 3.75]
const LEAD_Y = 4.3

export const ANCHORS = {
  bondhead: P(5.2, 1.1, 3.0),
  capillary: P(4.6, 3.3, 2.6),
  efo: P(5.4, 3.9, 1.9),
  spool: P(5.2, 1.1, 4.2),
  heat: P(7.6, 3.6, 0.9),
  strip: P(2.2, 3.6, 1.4),
}

const line = (pts) => pts.map((p) => p.join(',')).join(' ')

// 1st(패드) → 2nd(리드) 사이 루프 모양
function loopPath(y) {
  const a = P(DIE[0] + 0.25, y, 1.32)
  const top = P(DIE[0] + 0.5, y, 2.0)
  const b = P(DIE[0] + 1.6, y, 1.08)
  return `M${a[0]},${a[1]} Q${top[0]},${top[1] - 6} ${b[0]},${b[1]}`
}

export default function WireBonderIso({ focus = null, lot = null, step = null, onPick, tags = true }) {
  // 캐필러리 끝 위치: 패드 위(1st), 리드 위(2nd), 그 사이(루프)
  const capPos = step === 'stitch' || step === 'tail' ? 'lead' : step === 'loop' ? 'mid' : 'pad'
  const shift = { pad: 0, mid: 0.8, lead: 1.6 }[capPos]
  const [sx, sy] = [P(shift, 0)[0] - P(0, 0)[0], P(shift, 0)[1] - P(0, 0)[1]]
  const pressing = step === 'ball' || step === 'stitch'
  const bondedCount = { load: 0, efo: 0, ball: 0, loop: 1, stitch: 1, tail: 1, next: 2, test: 4 }[step] ?? 4
  const heating = step && step !== 'load'
  const [tipX, tipY] = P(DIE[0], DIE[1], 1.5)

  return (
    <svg viewBox="0 0 400 290" className="eq-iso" role="img" aria-label="와이어 본더 입체 그림">
      {/* 그림을 확대해 칸을 채웁니다(viewBox는 0 0 400 290 유지) */}
      <g transform="translate(-69 -99.3) scale(1.379)">
      <polygon points={line([P(-0.5, -0.5), P(9.5, -0.5), P(9.5, 6.5), P(-0.5, 6.5)])} className="eq-floor" />
      <Box x={0} y={0} w={9} d={6} h={5.2} glass />

      {/* 본드 헤드 · 트랜스듀서 */}
      <Part id="bondhead" focus={focus} onPick={onPick} label="본드 헤드와 트랜스듀서">
        <Box x={4.3} y={0.4} w={1.8} d={1.4} h={2.0} z={1.6} tone="gas" />
        <g className="eq-ba-cap" style={{ transform: `translate(${sx}px, ${sy}px)` }}>
          <g className={`eq-ba-press${pressing ? ' run' : ''}`}>
            <Box x={4.45} y={1.8} w={0.3} d={1.5} h={0.3} z={2.6} tone="metal" />
          </g>
        </g>
      </Part>

      {/* 와이어 공급 (헤드 위 스풀) */}
      <Part id="spool" focus={focus} onPick={onPick} label="와이어 공급">
        <Cylinder x={5.2} y={1.1} z={3.6} r={0.5} h={0.55} tone="foup" />
        <polyline points={line([P(5.2, 1.1, 3.6), P(4.6, 3.3, 2.9)])} className="eq-ba-wire" />
      </Part>

      {/* 가열부 + 스트립 */}
      <Part id="heat" focus={focus} onPick={onPick} label="가열부">
        <Box x={1.0} y={2.8} w={7.6} d={1.8} h={0.9} tone="heater" className={heating ? 'eq-ba-hot' : ''} />
      </Part>
      <Part id="strip" focus={focus} onPick={onPick} label="스트립">
        <Box x={1.2} y={2.9} w={7.2} d={1.6} h={0.1} z={0.9} tone="foup" />
        {[2.4, 4.6, 7.4].map((x) => (
          <Box key={x} x={x - 0.35} y={DIE[1] - 0.35} w={0.7} d={0.7} h={0.3} z={1.0} tone="gas" />
        ))}
        {PADS.map((y, i) => (
          <g key={y}>
            <polygon points={line([P(DIE[0] + 1.45, y - 0.08, 1.02), P(DIE[0] + 1.9, y - 0.08, 1.02), P(DIE[0] + 1.9, y + 0.08, 1.02), P(DIE[0] + 1.45, y + 0.08, 1.02)])} className="eq-ba-lead" />
            {i < bondedCount && <path d={loopPath(y)} className="eq-ba-loop" />}
          </g>
        ))}
        {step === 'loop' && <path d={loopPath(PADS[0])} className="eq-ba-loop draw" />}
      </Part>

      {/* 캐필러리: 단계에 따라 패드 → 루프 → 리드로 움직이고 눌러 붙입니다 */}
      <Part id="capillary" focus={focus} onPick={onPick} label="캐필러리">
        <g className="eq-ba-cap" style={{ transform: `translate(${sx}px, ${sy}px)` }}>
          <g className={`eq-ba-press${pressing ? ' run' : ''}`}>
            <Cylinder x={DIE[0]} y={DIE[1]} z={1.5} r={0.16} h={1.2} tone="rack" />
            {(step === 'efo' || step === 'load' || step === 'next') && <circle cx={tipX} cy={tipY + 2} r="2.4" className="eq-ba-fab" />}
          </g>
        </g>
      </Part>

      {/* EFO: 불꽃으로 볼을 만듭니다 */}
      <Part id="efo" focus={focus} onPick={onPick} label="EFO">
        <Box x={5.1} y={3.7} w={0.6} d={0.3} h={0.2} z={1.6} tone="metal" />
        {step === 'efo' && <polyline points={`${tipX + 10},${tipY + 4} ${tipX + 6},${tipY + 1} ${tipX + 7},${tipY + 5} ${tipX + 2},${tipY + 2}`} className="eq-ba-spark" />}
      </Part>

      {tags && (
        <g className="eq-tags">
          <Tag at={ANCHORS.bondhead} dx={-40} dy={-30} anchor="end">본드 헤드·트랜스듀서</Tag>
          <Tag at={ANCHORS.spool} dx={34} dy={-14} anchor="start">와이어 공급</Tag>
          <Tag at={ANCHORS.capillary} dx={-56} dy={-6} anchor="end">캐필러리</Tag>
          <Tag at={ANCHORS.efo} dx={44} dy={-22} anchor="start">EFO</Tag>
          <Tag at={ANCHORS.heat} dx={30} dy={30} anchor="start">가열부</Tag>
          <Tag at={ANCHORS.strip} dx={-36} dy={40} anchor="end">스트립(다이·리드)</Tag>
        </g>
      )}
      <LotToken at={lot ? ANCHORS[lot] : null} />
      </g>
    </svg>
  )
}
