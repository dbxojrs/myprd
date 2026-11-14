import { Box, Cylinder, LotToken, P, Part, S, Tag } from './isoKit.jsx'

// 에폭시 다이 본더 입체 그림. 출처(review/equipment-back.md 3장)로 확인한 구성요소만 그렸습니다:
// 매거진 입력, 웨이퍼(프레임) 테이블, 다이 이젝터, 픽앤플레이스 본드 헤드·콜릿, 에폭시 디스펜서, 기판 핸들링 레일, 비전 카메라.
// 장비 안의 배치(웨이퍼 테이블 위치, 레일 방향)는 출처 미확인이라 일반적인 구성으로 그린 도식입니다.

const WAFER = [6.0, 1.7]
const PLACE = [6.0, 4.6] // 레일 위 본딩 자리
const PAD_X = [2.6, 3.8, 5.0, 6.0, 7.2]

export const ANCHORS = {
  magazine: P(0.9, 4.6, 3.6),
  wafer: P(WAFER[0], WAFER[1], 1.4),
  ejector: P(WAFER[0], WAFER[1], 0.4),
  bondhead: P(6.0, 3.2, 5.0),
  dispenser: P(3.8, 4.6, 4.4),
  vision: P(4.9, 4.6, 5.0),
  rail: P(7.6, 4.6, 1.4),
}

const line = (pts) => pts.map((p) => p.join(',')).join(' ')

export default function DieBonderIso({ focus = null, lot = null, step = null, onPick, tags = true }) {
  // 본드 헤드 위치: 집을 때는 웨이퍼 위, 놓을 때는 레일 위
  const headAt = step === 'pick' || step === 'eject' ? 'wafer' : step === 'bond' || step === 'align' || step === 'inspect' ? 'rail' : 'mid'
  const headShift = { wafer: -1.45, mid: 0, rail: 1.4 }[headAt]
  const [dx, dy] = [P(0, headShift)[0] - P(0, 0)[0], P(0, headShift)[1] - P(0, 0)[1]]
  const headDown = step === 'pick' || step === 'bond'
  const glued = !['load', 'index'].includes(step)
  const placed = ['bond', 'inspect', 'cure'].includes(step)
  const dies = []
  for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) if (Math.abs(i) + Math.abs(j) <= 3) dies.push([i * 0.36, j * 0.36])
  return (
    <svg viewBox="0 0 400 290" className="eq-iso" role="img" aria-label="다이 본더 입체 그림">
      {/* 그림을 확대해 칸을 채웁니다(viewBox는 0 0 400 290 유지) */}
      <g transform="translate(-64 -80) scale(1.333)">
      <polygon points={line([P(-0.5, -0.5), P(9.5, -0.5), P(9.5, 6.5), P(-0.5, 6.5)])} className="eq-floor" />
      <Box x={0} y={0} w={9} d={6} h={5.6} glass />

      {/* 웨이퍼 테이블 + 이젝터 */}
      <Part id="ejector" focus={focus} onPick={onPick} label="다이 이젝터">
        <Cylinder x={WAFER[0]} y={WAFER[1]} r={0.3} h={0.9} tone="foup" className={step === 'eject' ? 'eq-ba-pin up' : 'eq-ba-pin'} />
      </Part>
      <Part id="wafer" focus={focus} onPick={onPick} label="웨이퍼 테이블">
        <Box x={4.2} y={0.2} w={3.6} d={3.0} h={0.6} tone="rack" />
        <ellipse cx={P(WAFER[0], WAFER[1], 0.95)[0]} cy={P(WAFER[0], WAFER[1], 0.95)[1]} rx={1.55 * S} ry={0.78 * S} className="eq-ba-ring" />
        <ellipse cx={P(WAFER[0], WAFER[1], 0.95)[0]} cy={P(WAFER[0], WAFER[1], 0.95)[1]} rx={1.2 * S} ry={0.6 * S} className="eq-ba-tape" />
        {dies.map(([i, j]) => {
          const picked = (i === 0 && j === 0 && glued && step !== 'dispense' && step !== 'eject') || (i === 0.36 && j === 0)
          const lifted = i === 0 && j === 0 && step === 'eject'
          return picked ? null : (
            <polygon
              key={`${i},${j}`}
              points={line([P(WAFER[0] + i - 0.15, WAFER[1] + j - 0.15, 0.97), P(WAFER[0] + i + 0.15, WAFER[1] + j - 0.15, 0.97), P(WAFER[0] + i + 0.15, WAFER[1] + j + 0.15, 0.97), P(WAFER[0] + i - 0.15, WAFER[1] + j + 0.15, 0.97)])}
              className={`eq-ba-die${lifted ? ' lifted' : ''}`}
            />
          )
        })}
      </Part>

      {/* 기판 핸들링 레일 + 리드프레임 스트립 */}
      <Part id="rail" focus={focus} onPick={onPick} label="기판 핸들링 레일">
        <Box x={1.6} y={4.2} w={7.0} d={0.8} h={0.9} tone="metal" />
        <g className={`eq-ba-strip${step === 'index' ? ' run' : ''}`}>
          <Box x={1.8} y={4.25} w={6.6} d={0.7} h={0.08} z={0.9} tone="foup" />
          {PAD_X.map((x) => (
            <g key={x}>
              {glued && x <= PLACE[0] && <ellipse cx={P(x, 4.6, 1.0)[0]} cy={P(x, 4.6, 1.0)[1]} rx={0.22 * S} ry={0.11 * S} className="eq-ba-epoxy" />}
              {(x < PLACE[0] || (x === PLACE[0] && placed)) && <Box x={x - 0.2} y={4.4} w={0.4} d={0.4} h={0.18} z={1.0} tone="gas" />}
            </g>
          ))}
        </g>
      </Part>

      {/* 매거진 입력 */}
      <Part id="magazine" focus={focus} onPick={onPick} label="매거진 입력">
        <Box x={0.3} y={3.8} w={1.2} d={1.6} h={2.6} tone="rack" />
        {[0.4, 1.0, 1.6, 2.2].map((z) => (
          <Box key={z} x={0.4} y={4.25} w={1.0} d={0.7} h={0.08} z={z} tone="foup" />
        ))}
      </Part>

      {/* 에폭시 디스펜서 */}
      <Part id="dispenser" focus={focus} onPick={onPick} label="에폭시 디스펜서">
        <Box x={3.4} y={4.4} w={0.4} d={0.4} h={0.2} z={4.2} tone="metal" />
        <g className={`eq-ba-syringe${step === 'dispense' ? ' run' : ''}`}>
          <Cylinder x={3.8} y={4.6} z={2.0} r={0.22} h={2.2} tone="glass" />
          <Cylinder x={3.8} y={4.6} z={1.4} r={0.06} h={0.6} tone="metal" />
        </g>
      </Part>

      {/* 비전 카메라 (아래를 내려다봄) */}
      <Part id="vision" focus={focus} onPick={onPick} label="비전 카메라">
        <Box x={4.6} y={4.3} w={0.6} d={0.6} h={0.9} z={4.1} tone="gas" />
        <Cylinder x={4.9} y={4.6} z={3.7} r={0.18} h={0.4} tone="metal" />
        {(step === 'align' || step === 'inspect') && <polygon points={line([P(4.9, 4.6, 3.7), P(5.6, 4.2, 1.05), P(6.4, 5.0, 1.05)])} className="eq-ba-beam" />}
      </Part>

      {/* 본드 헤드 · 콜릿: 웨이퍼와 레일 사이를 오갑니다 */}
      <Part id="bondhead" focus={focus} onPick={onPick} label="본드 헤드와 콜릿">
        <Box x={5.7} y={0.6} w={0.6} d={4.8} h={0.4} z={4.4} tone="metal" />
        <g className="eq-ba-head" style={{ transform: `translate(${dx}px, ${dy}px)` }}>
          <g className={`eq-ba-collet${headDown ? ' down' : ''}`}>
            <Box x={5.75} y={2.95} w={0.5} d={0.5} h={1.4} z={3.0} tone="gas" />
            <Cylinder x={6.0} y={3.2} z={2.0} r={0.12} h={1.0} tone="metal" />
            {(step === 'pick' || step === 'align') && <Box x={5.8} y={3.0} w={0.4} d={0.4} h={0.12} z={1.85} tone="gas" />}
          </g>
        </g>
      </Part>

      {tags && (
        <g className="eq-tags">
          <Tag at={ANCHORS.magazine} dx={-30} dy={-30} anchor="end">매거진 입력</Tag>
          <Tag at={ANCHORS.wafer} dx={40} dy={-46} anchor="start">웨이퍼 테이블</Tag>
          <Tag at={ANCHORS.ejector} dx={56} dy={8} anchor="start">이젝터</Tag>
          <Tag at={ANCHORS.bondhead} dx={46} dy={-36} anchor="start">본드 헤드·콜릿</Tag>
          <Tag at={ANCHORS.dispenser} dx={-40} dy={-26} anchor="end">디스펜서</Tag>
          <Tag at={ANCHORS.vision} dx={-10} dy={-50} anchor="end">비전</Tag>
          <Tag at={ANCHORS.rail} dx={30} dy={36} anchor="start">레일·리드프레임</Tag>
        </g>
      )}
      <LotToken at={lot ? ANCHORS[lot] : null} />
      </g>
    </svg>
  )
}
