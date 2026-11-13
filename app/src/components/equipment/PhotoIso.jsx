import { Box, Cylinder, LotToken, P, Part, S, Tag } from './isoKit.jsx'

// 노광 장비 + 트랙 입체 그림. 배치는 review/equipment-front.md 2.2를 따릅니다:
// 왼쪽 트랙(캐리어 블록·로드포트 → 코터/디벨로퍼 컵·베이크 플레이트) → 가운데 인터페이스 블록 → 오른쪽 스캐너 본체
// (광원·투영 광학계, 레티클 스테이지, 웨이퍼 스테이지). 트랙과 스캐너가 인라인으로 붙은 한 덩어리입니다.
// 실제 장비 사진을 따라 그리지 않은, 이 앱이 직접 만든 도식입니다.

export const ANCHORS = {
  loadport: P(0.8, 5.2, 2.0),
  coater: P(3.2, 3.4, 1.0),
  bake: P(3.3, 1.2, 3.6),
  developer: P(3.2, 3.4, 2.5),
  interface: P(5.6, 2.5, 2.6),
  source: P(10.1, 1.3, 4.0),
  stage: P(8.1, 2.9, 1.4),
}

export default function PhotoIso({ focus = null, lot = null, step = null, onPick, tags = true }) {
  const coating = step === 'coat'
  const baking = step === 'softbake' || step === 'peb'
  const aligning = step === 'align'
  const exposing = step === 'expose'
  const developing = step === 'develop'
  const [wx, wy] = P(8.1, 2.9, 1.15)
  const [ox, oy] = P(8.1, 2.9, 2.3)
  return (
    <svg viewBox="0 0 400 290" className="eq-iso" role="img" aria-label="노광 장비와 트랙 입체 그림">
      <g transform="translate(-69,-90) scale(1.25)">
        <polygon points={[P(-0.5, 0), P(11.4, 0), P(11.4, 5.8), P(-0.5, 5.8)].map((p) => p.join(',')).join(' ')} className="eq-floor" />

        {/* 스캐너 본체: 광원·광학계 */}
        <Part id="source" focus={focus} onPick={onPick} label="광원·투영 광학계">
          <Box x={9.4} y={0.5} w={1.5} d={1.6} h={4.0} tone="gas" />
          <Cylinder x={8.1} y={2.9} z={2.3} r={0.75} h={1.7} tone="glass" />
          {exposing && <polygon points={`${ox - 6},${oy} ${ox + 6},${oy} ${wx + 2},${wy} ${wx - 2},${wy}`} className="eq-fe-light" />}
        </Part>
        <Box x={6.4} y={0.4} w={4.8} d={4.4} h={4.4} glass />

        {/* 레티클·웨이퍼 스테이지 */}
        <Part id="stage" focus={focus} onPick={onPick} label="레티클·웨이퍼 스테이지">
          <Box x={7.4} y={2.3} w={1.4} d={1.2} h={0.25} z={4.0} tone="foup" className={aligning ? 'eq-fe-blink' : ''} />
          <g className={exposing ? 'eq-fe-scanstage' : ''}>
            <Box x={7.0} y={2.0} w={2.2} d={1.8} h={0.5} z={0.6} tone="metal" />
            <ellipse cx={wx} cy={wy} rx={0.7 * S} ry={0.35 * S} className={`eq-wafer${exposing ? ' eq-fe-exposed' : ''}`} />
          </g>
        </Part>

        {/* 인터페이스 블록 */}
        <Part id="interface" focus={focus} onPick={onPick} label="인터페이스 블록">
          <Box x={5.0} y={1.0} w={1.2} d={3.0} h={2.4} tone="rack" />
        </Part>

        {/* 트랙: 베이크 플레이트 타워 */}
        <Part id="bake" focus={focus} onPick={onPick} label="베이크 플레이트">
          <Box x={2.0} y={0.6} w={2.6} d={1.2} h={3.2} tone="hot" className={baking ? 'eq-fe-hot' : ''} />
        </Part>
        <Box x={1.8} y={0.5} w={3.0} d={4.2} h={3.4} glass />

        {/* 트랙: 코터(아래 층)·디벨로퍼(위 층) 컵 */}
        <Part id="coater" focus={focus} onPick={onPick} label="코터">
          {[2.6, 3.9].map((x) => (
            <g key={x}>
              <Cylinder x={x} y={3.4} z={0.4} r={0.5} h={0.4} tone="metal" />
              {coating && (() => {
                const [cx, cy] = P(x, 3.4, 0.8)
                return <ellipse cx={cx} cy={cy} rx={0.4 * S} ry={0.2 * S} className="eq-fe-spin" />
              })()}
            </g>
          ))}
        </Part>
        <Part id="developer" focus={focus} onPick={onPick} label="디벨로퍼">
          <Box x={2.0} y={2.8} w={2.6} d={1.2} h={0.12} z={1.6} tone="rack" />
          {[2.6, 3.9].map((x) => (
            <g key={x}>
              <Cylinder x={x} y={3.4} z={1.75} r={0.5} h={0.4} tone="gas" />
              {developing && (() => {
                const [cx, cy] = P(x, 3.4, 2.5)
                return <line x1={cx} y1={cy - 8} x2={cx} y2={cy + 4} className="eq-fe-spray" />
              })()}
            </g>
          ))}
        </Part>

        {/* 캐리어 블록 + 로드포트 */}
        <Part id="loadport" focus={focus} onPick={onPick} label="캐리어 블록·로드포트">
          <Box x={0} y={0.5} w={1.6} d={4.2} h={2.4} tone="rack" />
          {[0.6, 2.3].map((y) => (
            <g key={y}>
              <Box x={-0.1} y={y + 2.2} w={0.9} d={0.9} h={1.0} tone="metal" />
              <Box x={0} y={y + 2.3} w={0.7} d={0.7} h={0.7} z={1.0} tone="foup" />
            </g>
          ))}
        </Part>

        {tags && (
          <g className="eq-tags">
            <Tag at={ANCHORS.loadport} dx={4} dy={52}>캐리어 블록</Tag>
            <Tag at={ANCHORS.bake} dx={-40} dy={-18} anchor="end">베이크 플레이트</Tag>
            <Tag at={ANCHORS.developer} dx={-62} dy={-4} anchor="end">디벨로퍼</Tag>
            <Tag at={ANCHORS.coater} dx={-30} dy={52} anchor="end">코터</Tag>
            <Tag at={ANCHORS.interface} dx={6} dy={66}>인터페이스</Tag>
            <Tag at={ANCHORS.source} dx={30} dy={-22} anchor="start">광원·광학계</Tag>
            <Tag at={ANCHORS.stage} dx={52} dy={58} anchor="start">스테이지</Tag>
          </g>
        )}
        <LotToken at={lot ? ANCHORS[lot] : null} />
      </g>
    </svg>
  )
}
