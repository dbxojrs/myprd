import { Box, Cylinder, LotToken, P, Part, S, Tag } from './isoKit.jsx'

// 트랜스퍼 몰딩 프레스 입체 그림. 구성은 review/equipment-back.md 5장의 확인된 요소를 따릅니다:
// 프레스(상·하 구동), 플런저와 태블릿 공급, 이형 필름, 핸들러 로봇, 플런저 분진 수집. 배치는 이 앱이 정한 도식입니다.
// step: 조작 순서 단계 id(금형 닫힘·플런저·스트립 위치 표시)

export const ANCHORS = {
  handler: P(1.5, 4.6, 2.6),
  tablet: P(9.05, 2.7, 3.2),
  press: P(6, 3, 7.4),
  mold: P(6, 3, 3.4),
  film: P(3.85, 3, 2.9),
  dust: P(9.05, 4.9, 2.2),
}

const CLOSE = 1.6 * S // 위 금형이 내려오는 거리(px)

const pts = (list) => list.map((p) => p.join(',')).join(' ')

export default function MoldingIso({ focus = null, lot = null, step = null, onPick, tags = true }) {
  const closed = step === 'clamp' || step === 'transfer' || step === 'cure'
  const filmOn = step === null || ['film', 'clamp', 'transfer', 'cure'].includes(step)
  const inMold = ['load', 'film', 'clamp', 'transfer', 'cure'].includes(step)
  const pushing = step === 'transfer'
  const curing = step === 'cure'
  const armMoving = step === 'load' || step === 'unload'
  // 스트립: 핸들러 위(기본) ↔ 금형 안. 금형 쪽으로 옮기는 거리는 장비 좌표 x로 +3.6, y로 −1.6
  const [hx, hy] = P(0.6, 4.0, 1.2)
  const [mx, my] = P(4.2, 2.4, 2.2)
  return (
    <svg viewBox="0 0 400 290" className="eq-iso" role="img" aria-label="트랜스퍼 몰딩 프레스 입체 그림">
      <polygon points={pts([P(-0.5, -0.5), P(10.5, -0.5), P(10.5, 6.5), P(-0.5, 6.5)])} className="eq-floor" />
      <Box x={0} y={0} w={10} d={6} h={8.2} glass />

      {/* 태블릿 공급 */}
      <Part id="tablet" focus={focus} onPick={onPick} label="태블릿 공급과 플런저">
        <Box x={8.4} y={2} w={1.3} d={1.4} h={2.2} tone="gas" />
        {[0, 1, 2].map((i) => (
          <Cylinder key={i} x={8.75 + i * 0.3} y={2.6} z={2.2} r={0.13} h={0.35} tone="bb-emc" />
        ))}
        <polyline points={pts([P(8.4, 2.7, 1.2), P(6.2, 3.2, 1.2)])} className={`eq-bb-feed${pushing ? ' run' : ''}`} />
      </Part>

      {/* 분진 수집 */}
      <Part id="dust" focus={focus} onPick={onPick} label="플런저 분진 수집">
        <Box x={8.4} y={4.2} w={1.3} d={1.4} h={1.6} tone="rack" />
        <polyline points={pts([P(8.4, 4.9, 0.8), P(6.2, 3.6, 0.6)])} className="eq-bb-duct" />
      </Part>

      {/* 프레스: 기둥·아래판·윗판 */}
      <Part id="press" focus={focus} onPick={onPick} label="프레스">
        <Box x={3.9} y={1.4} w={4.3} d={3.2} h={1.2} tone="metal" />
        {[
          [3.9, 1.4],
          [7.8, 1.4],
          [3.9, 4.2],
          [7.8, 4.2],
        ].map(([x, y]) => (
          <Box key={`${x}-${y}`} x={x} y={y} w={0.4} d={0.4} h={6.6} tone="metal" />
        ))}
        <Box x={3.9} y={1.4} w={4.3} d={3.2} h={0.6} z={6.6} tone="metal" />
      </Part>

      {/* 금형: 아래 금형(고정) + 위 금형(닫힐 때 내려옴) + 플런저 */}
      <Part id="mold" focus={focus} onPick={onPick} label="금형과 캐비티">
        <Box x={4.3} y={1.8} w={3.5} d={2.4} h={1.0} z={1.2} tone="bb-mold" />
        <g className={`eq-bb-plunger${pushing ? ' push' : ''}`}>
          <Cylinder x={6.2} y={3.2} z={0.4} r={0.28} h={1.2} tone="metal" />
        </g>
        <g className={`eq-bb-upper${closed ? ' closed' : ''}`} style={{ '--close': `${CLOSE}px` }}>
          <Box x={4.3} y={1.8} w={3.5} d={2.4} h={1.0} z={4.0} tone="bb-mold" className={curing ? 'eq-bb-hot' : ''} />
        </g>
      </Part>

      {/* 이형 필름: 금형 양옆 롤과 금형 면 위의 필름 */}
      <Part id="film" focus={focus} onPick={onPick} label="이형 필름">
        <Box x={3.55} y={2.2} w={0.45} d={1.6} h={0.5} z={2.0} tone="bb-film" />
        {filmOn && <Box x={4.2} y={1.75} w={3.6} d={2.5} h={0.04} z={2.25} tone="bb-film" className="eq-bb-sheet" />}
      </Part>

      {/* 핸들러 로봇 */}
      <Part id="handler" focus={focus} onPick={onPick} label="핸들러 로봇">
        <Box x={0.3} y={3.5} w={2.4} d={2.2} h={1.2} tone="metal" />
        <g className={`eq-bb-arm${armMoving ? ' moving' : ''}`}>
          <Box x={2.5} y={4.1} w={1.6} d={0.4} h={0.3} z={1.6} tone="metal" />
        </g>
      </Part>

      {/* 스트립: 핸들러 위 ↔ 금형 안 */}
      <g
        className={`eq-bb-strip${pushing || curing ? ' molded' : ''}`}
        style={{ transform: inMold ? `translate(${mx - hx}px, ${my - hy}px)` : 'translate(0px, 0px)' }}
      >
        <Box x={0.6} y={4.0} w={1.8} d={1.2} h={0.15} z={1.2} tone="bb-strip" />
      </g>

      {pushing && (
        <g className="eq-bb-resin">
          {[0, 1, 2].map((i) => {
            const [x, y] = P(5 + i * 0.9, 3.0, 2.35)
            return <circle key={i} cx={x} cy={y} r="3" style={{ animationDelay: `${i * 0.25}s` }} />
          })}
        </g>
      )}

      {tags && (
        <g className="eq-tags">
          <Tag at={ANCHORS.handler} dx={-30} dy={34} anchor="end">핸들러 로봇</Tag>
          <Tag at={ANCHORS.film} dx={-46} dy={-34} anchor="end">이형 필름</Tag>
          <Tag at={ANCHORS.press} dx={-40} dy={-16} anchor="end">프레스</Tag>
          <Tag at={ANCHORS.mold} dx={30} dy={-84} anchor="start">금형·캐비티</Tag>
          <Tag at={ANCHORS.tablet} dx={40} dy={-24} anchor="start">태블릿·플런저</Tag>
          <Tag at={ANCHORS.dust} dx={36} dy={30} anchor="start">분진 수집</Tag>
        </g>
      )}
      <LotToken at={lot ? ANCHORS[lot] : null} />
    </svg>
  )
}
