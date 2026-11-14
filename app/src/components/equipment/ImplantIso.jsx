import { Box, Cylinder, LotToken, P, Part, S, Tag } from './isoKit.jsx'

// 이온 주입기 입체 그림. 배치는 review/equipment-front.md 5.2(Rubin & Poate 2003 그림 설명)를 따릅니다:
// 한쪽 끝 이온 소스(가스 박스·고전압 캐비닛) → 분석 자석 → 가속·감속 빔관 → 패러데이(빔 측정) → 엔드 스테이션(매엽 플래튼)
// → 로드락 → 앞쪽 FOUP 로드포트. 실제 장비 사진을 따라 그리지 않은, 이 앱이 직접 만든 도식입니다.

export const ANCHORS = {
  loadport: P(10.1, 5.4, 2.0),
  loadlock: P(10.1, 4.0, 1.6),
  endstation: P(10.1, 1.7, 2.9),
  source: P(1.1, 1.2, 3.3),
  magnet: P(3.5, 1.2, 1.9),
  beamline: P(6.5, 1.2, 1.8),
  faraday: P(8.7, 0.5, 2.1),
}

export default function ImplantIso({ focus = null, lot = null, step = null, onPick, tags = true }) {
  const beamOn = step === 'setup' || step === 'scan'
  const tilted = step === 'tilt' || step === 'scan'
  const scanning = step === 'scan'
  const beamPts = [P(2.2, 1.2, 1.3), P(3.5, 1.2, 1.3), P(8.99, 1.2, 1.3)].map((p) => p.join(',')).join(' ')
  const [px, py] = P(9.0, 1.6, 1.4)
  return (
    <svg viewBox="0 0 400 290" className="eq-iso" role="img" aria-label="이온 주입기 입체 그림">
      <g transform="translate(-58,-84) scale(1.2)">
        <polygon points={[P(-0.5, -0.4), P(11.6, -0.4), P(11.6, 6.2), P(-0.5, 6.2)].map((p) => p.join(',')).join(' ')} className="eq-floor" />

        {/* 이온 소스 */}
        <Part id="source" focus={focus} onPick={onPick} label="이온 소스">
          <Box x={0} y={0} w={2.2} d={2.4} h={3.2} tone="gas" className={step === 'recipe' || beamOn ? 'eq-fe-blink-soft' : ''} />
        </Part>

        {/* 패러데이 */}
        <Part id="faraday" focus={focus} onPick={onPick} label="패러데이 컵">
          <Box x={8.4} y={0.2} w={0.6} d={0.5} h={0.9} z={1.0} tone="foup" className={step === 'setup' ? 'eq-fe-blink' : ''} />
        </Part>

        {/* 엔드 스테이션 + 플래튼 */}
        <Part id="endstation" focus={focus} onPick={onPick} label="엔드 스테이션">
          <Box x={9.0} y={0.2} w={2.2} d={3.0} h={2.6} tone="metal" />
          <g className={`eq-fe-platen${tilted ? ' tilted' : ''}`}>
            <ellipse cx={px} cy={py} rx={0.45 * S} ry={0.9 * S} className="eq-wafer" />
            {scanning && <circle cx={px} cy={py} r="3.2" className="eq-fe-spot" />}
          </g>
        </Part>

        {/* 빔관(가속·감속) */}
        <Part id="beamline" focus={focus} onPick={onPick} label="가속·감속 빔관">
          <Box x={4.4} y={0.9} w={4.6} d={0.6} h={0.6} z={1.0} tone="glass" />
          {[5.2, 6.2, 7.2].map((x) => (
            <Box key={x} x={x} y={0.8} w={0.25} d={0.8} h={0.8} z={0.9} tone="metal" />
          ))}
        </Part>
        {beamOn && <polyline points={beamPts} className="eq-fe-beam" />}

        {/* 분석 자석 */}
        <Part id="magnet" focus={focus} onPick={onPick} label="분석 자석">
          <Box x={2.6} y={0.2} w={1.8} d={2.0} h={0.7} z={0.3} tone="hot" />
          <Box x={2.6} y={0.2} w={1.8} d={2.0} h={0.7} z={1.5} tone="hot" />
        </Part>

        {/* 로드락 + 로드포트 */}
        <Part id="loadlock" focus={focus} onPick={onPick} label="로드락">
          <Box x={9.4} y={3.4} w={1.4} d={1.2} h={1.4} tone="rack" className={step === 'loadlock' ? 'eq-fe-pumping' : ''} />
        </Part>
        <Part id="loadport" focus={focus} onPick={onPick} label="로드포트">
          {[9.1, 10.3].map((x) => (
            <g key={x}>
              <Box x={x} y={4.9} w={1.0} d={0.8} h={1.0} tone="metal" />
              <Box x={x + 0.1} y={4.9} w={0.8} d={0.8} h={0.8} z={1.0} tone="foup" />
            </g>
          ))}
        </Part>
        <Cylinder x={1.1} y={1.2} z={3.2} r={0.4} h={0.4} tone="metal" />

        {tags && (
          <g className="eq-tags">
            <Tag at={ANCHORS.source} dx={-36} dy={2} anchor="end">이온 소스</Tag>
            <Tag at={ANCHORS.magnet} dx={-30} dy={52} anchor="end">분석 자석</Tag>
            <Tag at={ANCHORS.beamline} dx={-10} dy={-44}>가속·감속 빔관</Tag>
            <Tag at={ANCHORS.faraday} dx={26} dy={-40} anchor="start">패러데이</Tag>
            <Tag at={ANCHORS.endstation} dx={22} dy={-4} anchor="start">엔드 스테이션</Tag>
            <Tag at={ANCHORS.loadlock} dx={52} dy={8} anchor="start">로드락</Tag>
            <Tag at={ANCHORS.loadport} dx={-40} dy={30} anchor="end">로드포트</Tag>
          </g>
        )}
        <LotToken at={lot ? ANCHORS[lot] : null} />
      </g>
    </svg>
  )
}
