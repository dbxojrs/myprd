import { Box, Cylinder, LotToken, P, Part, S, Tag } from './isoKit.jsx'

// 전자동 다이싱 소 입체 그림. 배치는 review/equipment-back.md 2장(DFD6362 페이지)을 따릅니다:
// 카세트 → 아래쪽 암 → 프리얼라인 스테이지 → 척 테이블(진공) · 마주 보는 두 스핀들(Z1·Z2)과 블레이드 → 위쪽 암 → 스피너,
// 그리고 현미경 화면과 조작 버튼이 같이 있는 화면(GUI). 카세트 엘리베이터 모양과 터치패널 여부는 출처 미확인이라 단순한 상자로 그렸습니다.

const CHUCK = [5.2, 3.4]
// 웨이퍼 위 스트리트(위에서 본 절단선) 오프셋
const STREETS = [-0.6, -0.2, 0.2, 0.6]

export const ANCHORS = {
  cassette: P(1.2, 1.5, 3.4),
  prealign: P(3.0, 1.2, 1.6),
  chuck: P(4.0, 4.8, 1.2), // 블레이드를 가리지 않도록 척 테이블 앞쪽에 로트 표시
  spindle: P(5.2, 3.4, 3.4),
  scope: P(8.2, 5.4, 5.4),
  spinner: P(8.0, 1.6, 1.6),
}

const line = (pts) => pts.map((p) => p.join(',')).join(' ')

export default function SawIso({ focus = null, lot = null, step = null, onPick, tags = true }) {
  const cutting = step === 'cut1' || step === 'rotate'
  const cut2 = step === 'rotate' || step === 'kerf' || step === 'clean'
  const cut1Done = cutting || cut2
  const [cx, cy] = CHUCK
  const z = 1.25 // 웨이퍼 윗면 높이
  return (
    <svg viewBox="0 0 400 290" className="eq-iso" role="img" aria-label="다이싱 소 입체 그림">
      {/* 그림을 확대해 칸을 채웁니다(viewBox는 0 0 400 290 유지) */}
      <g transform="translate(-67.6 -83.8) scale(1.351)">
      <polygon points={line([P(-0.5, -0.5), P(9.8, -0.5), P(9.8, 6.5), P(-0.5, 6.5)])} className="eq-floor" />
      <Box x={0} y={0} w={9.3} d={6} h={5.6} glass />

      {/* 스피너 테이블 */}
      <Part id="spinner" focus={focus} onPick={onPick} label="스피너 테이블">
        <Box x={7.0} y={0.6} w={2.0} d={2.0} h={0.8} tone="metal" />
        <Cylinder x={8.0} y={1.6} z={0.8} r={0.8} h={0.2} tone="glass" />
        <ellipse cx={P(8.0, 1.6, 1.0)[0]} cy={P(8.0, 1.6, 1.0)[1]} rx={0.8 * S} ry={0.4 * S} className={`eq-ba-spin${step === 'clean' ? ' run' : ''}`} />
      </Part>

      {/* 카세트 */}
      <Part id="cassette" focus={focus} onPick={onPick} label="카세트">
        <Box x={0.3} y={0.5} w={1.8} d={2.0} h={2.4} tone="metal" />
        <Box x={0.5} y={0.7} w={1.4} d={1.6} h={1.0} z={2.4} tone="foup" />
      </Part>

      {/* 프리얼라인 스테이지 */}
      <Part id="prealign" focus={focus} onPick={onPick} label="프리얼라인 스테이지">
        <Box x={2.6} y={0.7} w={1.0} d={1.0} h={0.9} tone="metal" />
        <Cylinder x={3.1} y={1.2} z={0.9} r={0.45} h={0.15} tone="glass" />
      </Part>

      {/* 척 테이블: 절삭 중에는 앞뒤로 움직이며 웨이퍼를 블레이드 밑으로 보냅니다 */}
      <Part id="chuck" focus={focus} onPick={onPick} label="척 테이블">
        <Box x={3.4} y={2.8} w={3.6} d={1.2} h={0.5} tone="rack" />
        <g className={`eq-ba-xtable${cutting ? ' run' : ''}`}>
          <Cylinder x={cx} y={cy} z={0.5} r={1.35} h={0.6} tone="metal" />
          <ellipse cx={P(cx, cy, z)[0]} cy={P(cx, cy, z)[1]} rx={1.3 * S} ry={0.65 * S} className="eq-ba-ring" />
          <ellipse cx={P(cx, cy, z)[0]} cy={P(cx, cy, z)[1]} rx={1.0 * S} ry={0.5 * S} className="eq-ba-wafer" />
          {/* 1방향(위에서 보면 x 방향) 절단선 */}
          {cut1Done &&
            STREETS.map((o, i) => (
              <polyline key={`a${o}`} points={line([P(cx - 0.85, cy + o, z), P(cx + 0.85, cy + o, z)])} className={`eq-ba-cut${step === 'cut1' ? ' draw' : ''}`} style={{ animationDelay: `${i * 0.5}s` }} />
            ))}
          {/* 2방향 절단선 */}
          {cut2 &&
            STREETS.map((o, i) => (
              <polyline key={`b${o}`} points={line([P(cx + o, cy - 0.85, z), P(cx + o, cy + 0.85, z)])} className={`eq-ba-cut${step === 'rotate' ? ' draw' : ''}`} style={{ animationDelay: `${i * 0.5}s` }} />
            ))}
        </g>
      </Part>

      {/* 마주 보는 듀얼 스핀들 · 블레이드 */}
      <Part id="spindle" focus={focus} onPick={onPick} label="듀얼 스핀들과 블레이드">
        <Box x={3.3} y={3.2} w={1.2} d={0.4} h={0.5} z={2.6} tone="gas" />
        <Box x={5.9} y={3.2} w={1.2} d={0.4} h={0.5} z={2.6} tone="gas" />
        {[4.75, 5.65].map((x, i) => {
          const [bx, by] = P(x, 3.4, 2.0)
          return (
            <g key={x} className={`eq-ba-blade${cutting || step === 'setup' ? ' down' : ''}`}>
              <ellipse cx={bx} cy={by} rx={0.36 * S} ry={0.9 * S} transform={`rotate(-30 ${bx} ${by})`} className={`eq-ba-bladedisc${cutting ? ' run' : ''}`} />
              <text x={bx} y={by - 0.95 * S} textAnchor="middle" className="eq-ba-axis">
                {i === 0 ? 'Z1' : 'Z2'}
              </text>
            </g>
          )
        })}
        {cutting &&
          [0, 1, 2].map((i) => (
            <circle key={i} cx={P(5.2, 3.4, 1.3)[0] + (i - 1) * 8} cy={P(5.2, 3.4, 1.3)[1] - 2} r="1.5" className="eq-ba-water" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
      </Part>

      {/* 현미경 · GUI */}
      <Part id="scope" focus={focus} onPick={onPick} label="현미경과 조작 화면">
        <Cylinder x={5.2} y={2.3} z={3.0} r={0.25} h={1.4} tone="metal" />
        <polyline points={line([P(5.2, 2.3, 3.0), P(5.2, 2.3, 4.6), P(8.1, 5.3, 4.6)])} className="eq-ba-cable" />
        <Box x={7.6} y={5.2} w={1.4} d={0.3} h={1.6} z={3.6} tone="metal" />
        <polygon points={line([P(7.7, 5.5, 3.75), P(8.9, 5.5, 3.75), P(8.9, 5.5, 5.05), P(7.7, 5.5, 5.05)])} className={`eq-ba-screen${step === 'align' || step === 'kerf' ? ' on' : ''}`} />
        {(step === 'align' || step === 'kerf') && (
          <polygon points={line([P(5.2, 2.3, 3.0), P(4.7, 3.4, z), P(5.7, 3.4, z)])} className="eq-ba-beam" />
        )}
      </Part>

      {tags && (
        <g className="eq-tags">
          <Tag at={ANCHORS.cassette} dx={-30} dy={-10} anchor="end">카세트</Tag>
          <Tag at={ANCHORS.prealign} dx={-46} dy={40} anchor="end">프리얼라인</Tag>
          <Tag at={ANCHORS.chuck} dx={-40} dy={56} anchor="end">척 테이블</Tag>
          <Tag at={ANCHORS.spindle} dx={40} dy={-62} anchor="start">스핀들·블레이드 Z1·Z2</Tag>
          <Tag at={ANCHORS.scope} dx={34} dy={-22} anchor="start">현미경 화면(GUI)</Tag>
          <Tag at={ANCHORS.spinner} dx={36} dy={-14} anchor="start">스피너</Tag>
        </g>
      )}
      <LotToken at={lot ? ANCHORS[lot] : null} />
      </g>
    </svg>
  )
}
