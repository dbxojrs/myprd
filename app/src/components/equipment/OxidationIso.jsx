import { Box, Cylinder, LotToken, P, Part, S, Tag } from './isoKit.jsx'

// 수직형 배치 확산로 입체 그림. 배치는 review/equipment-front.md 1.2의 작도용 설명을 따릅니다:
// 위쪽에 반응관과 히터, 아래에 보트 엘리베이터, 앞쪽에 로드포트와 FOUP 스토커, 그 사이에 이송 로봇, 옆에 가스 박스.
// 실제 장비 사진을 따라 그리지 않은, 이 앱이 직접 만든 도식입니다.
//
// focus: 강조할 부위 id · lot: 로트가 있는 부위 id · step: 조작 순서 단계 id(보트 위치·가열 표시) · onPick: 부위 클릭

export const ANCHORS = {
  loadport: P(1.5, 5.6, 2.7),
  stocker: P(1.5, 2, 6.6),
  robot: P(4.2, 3.6, 2),
  boat: P(6.2, 3.2, 2.6),
  tube: P(6.2, 3.2, 9.8),
  gas: P(9.1, 1.3, 5.6),
}

const BOAT_RISE = 4.2 * S

export default function OxidationIso({ focus = null, lot = null, step = null, onPick, tags = true }) {
  const boatUp = step === 'boatin' || step === 'process'
  const hot = step === 'process'
  const cooling = step === 'cool'
  const wafers = Array.from({ length: 9 }, (_, i) => i)
  const [bx, by] = P(6.2, 3.2, 0.7)
  return (
    <svg viewBox="0 0 400 290" className="eq-iso" role="img" aria-label="수직형 배치 확산로 입체 그림">
      {/* 바닥 그림자와 장비 외곽 */}
      <polygon points={[P(-0.5, -0.5), P(10.5, -0.5), P(10.5, 6.5), P(-0.5, 6.5)].map((p) => p.join(',')).join(' ')} className="eq-floor" />
      <Box x={0} y={0} w={10} d={6} h={10} glass />

      {/* 가스 박스·배기 */}
      <Part id="gas" focus={focus} onPick={onPick} label="가스 박스">
        <Box x={8.4} y={0.4} w={1.4} d={1.8} h={5} tone="gas" />
        <polyline points={[P(9.1, 1.3, 5), P(9.1, 1.3, 9.6), P(6.2, 3.2, 9.6)].map((p) => p.join(',')).join(' ')} className={`eq-pipe${hot ? ' flow' : ''}`} />
      </Part>

      {/* FOUP 스토커 */}
      <Part id="stocker" focus={focus} onPick={onPick} label="FOUP 스토커">
        <Box x={0.3} y={0.5} w={2.4} d={3} h={6.2} tone="rack" />
        {[1, 3, 5].map((z) => (
          <Box key={z} x={0.7} y={2.6} w={1.4} d={0.9} h={0.9} z={z} tone="foup" />
        ))}
      </Part>

      {/* 웨이퍼 이송 로봇 */}
      <Part id="robot" focus={focus} onPick={onPick} label="웨이퍼 이송 로봇">
        <Cylinder x={4.2} y={3.6} r={0.6} h={1.1} tone="metal" />
        <g className={`eq-ox-arm${step === 'charge' ? ' moving' : ''}`}>
          <Box x={4.2} y={3.3} w={1.7} d={0.5} h={0.25} z={1.1} tone="metal" />
        </g>
      </Part>

      {/* 보트·엘리베이터: 보트가 반응관 안으로 올라갑니다 */}
      <Part id="boat" focus={focus} onPick={onPick} label="보트와 보트 엘리베이터">
        <Box x={7.7} y={2.9} w={0.4} d={0.4} h={4.4} tone="metal" />
        <g className={`eq-ox-boat${boatUp ? ' up' : ''}`} style={{ '--rise': `${-BOAT_RISE}px` }}>
          <Box x={5.3} y={2.3} w={1.8} d={1.8} h={0.3} tone="metal" />
          {wafers.map((i) => (
            <ellipse
              key={i}
              cx={bx}
              cy={by - i * 0.36 * S}
              rx={0.95 * S}
              ry={0.47 * S}
              className={`eq-wafer${i === 0 || i === wafers.length - 1 ? ' dummy' : ''}${hot ? ' hot' : ''}${cooling ? ' cooling' : ''}`}
            />
          ))}
        </g>
      </Part>

      {/* 반응관·히터 */}
      <Part id="tube" focus={focus} onPick={onPick} label="반응관과 히터">
        <Cylinder x={6.2} y={3.2} z={4.2} r={1.55} h={5.2} tone="heater" className={hot ? 'hot' : cooling ? 'cooling' : ''} />
        <Cylinder x={6.2} y={3.2} z={4.2} r={1.1} h={5.0} tone="glass" />
      </Part>

      {/* 로드포트 + FOUP */}
      <Part id="loadport" focus={focus} onPick={onPick} label="로드포트">
        <Box x={0.3} y={5.1} w={2.4} d={0.9} h={1.3} tone="metal" />
        <Box x={0.8} y={4.9} w={1.4} d={1.1} h={1.0} z={1.3} tone="foup" />
      </Part>

      {tags && (
        <g className="eq-tags">
          <Tag at={ANCHORS.loadport} dx={-34} dy={30} anchor="end">로드포트</Tag>
          <Tag at={ANCHORS.stocker} dx={-26} dy={14} anchor="end">FOUP 스토커</Tag>
          <Tag at={ANCHORS.robot} dx={-8} dy={52}>이송 로봇</Tag>
          <Tag at={ANCHORS.boat} dx={44} dy={44} anchor="start">보트·엘리베이터</Tag>
          <Tag at={ANCHORS.tube} dx={50} dy={-18} anchor="start">반응관·히터</Tag>
          <Tag at={ANCHORS.gas} dx={30} dy={-12} anchor="start">가스 박스</Tag>
        </g>
      )}
      <LotToken at={lot ? ANCHORS[lot] : null} />
    </svg>
  )
}
