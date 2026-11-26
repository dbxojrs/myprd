import { Box, Cylinder, LotToken, P, Part, Tag } from './isoKit.jsx'

// 매엽식 세정 장비 입체 그림(교육용 개념 그림, 실제 장비 배치·치수 아님).
// 왼쪽 FOUP 입구 → 가운데 반송 로봇 길 → 뒤쪽에 층층이 쌓인 공정 챔버, 앞 오른쪽은 챔버 하나를 잘라 속(스핀 척·컵·노즐·메가소닉)을 보여 줍니다.
// step: 조작 순서 단계 id

export const ANCHORS = {
  loadport: P(0.9, 3.6, 1.8),
  robot: P(4.0, 3.0, 1.4),
  chamber: P(4.0, 1.0, 5.2),
  chuck: P(7.5, 4.6, 1.1),
  nozzle: P(7.0, 4.0, 2.3),
  megasonic: P(8.4, 4.2, 1.9),
  dry: P(7.9, 3.9, 2.8),
  chem: P(9.4, 1.6, 3.2),
  exhaust: P(5.0, 0.6, 6.4),
}

const pts = (list) => list.map((p) => p.join(',')).join(' ')

export default function CleanIso({ focus = null, lot = null, step = null, onPick, tags = true }) {
  const spraying = step === 'clean'
  const drying = step === 'dry'
  const spinning = spraying || drying || step === 'chuck'
  const [nx, ny] = P(7.3, 4.3, 2.0)
  const [wx, wy] = P(7.5, 4.6, 1.25)
  return (
    <svg viewBox="0 0 400 290" className="eq-iso" role="img" aria-label="매엽식 세정 장비 입체 그림">
      <polygon points={pts([P(-0.5, -0.5), P(10.5, -0.5), P(10.5, 6.5), P(-0.5, 6.5)])} className="eq-floor" />
      <Box x={0} y={0} w={10} d={6} h={6.2} glass />

      {/* FOUP 입구 */}
      <Part id="loadport" focus={focus} onPick={onPick} label="FOUP 인터페이스">
        {[1.2, 2.8, 4.4].map((y) => (
          <Box key={y} x={0.3} y={y} w={1.2} d={1.2} h={1.4} tone="foup" />
        ))}
      </Part>

      {/* 반송 로봇과 길 */}
      <Part id="robot" focus={focus} onPick={onPick} label="반송 로봇">
        <Box x={2.0} y={2.7} w={6.0} d={0.6} h={0.3} tone="metal" />
        <Box x={3.7} y={2.7} w={0.6} d={0.6} h={1.1} z={0.3} tone="metal" />
      </Part>

      {/* 뒤쪽 공정 챔버(층층이) */}
      <Part id="chamber" focus={focus} onPick={onPick} label="공정 챔버">
        {[2.0, 4.0, 6.0].map((x) => (
          <g key={x}>
            <Box x={x} y={0.4} w={1.8} d={1.8} h={4.8} tone="rack" />
            {[1.6, 3.2].map((z) => (
              <polyline key={z} points={pts([P(x, 2.2, z), P(x + 1.8, 2.2, z)])} className="eq-bb-slot" />
            ))}
          </g>
        ))}
      </Part>

      {/* 배기 덕트 */}
      <Part id="exhaust" focus={focus} onPick={onPick} label="배기">
        <Box x={2.0} y={0.4} w={5.8} d={0.4} h={0.4} z={5.6} tone="metal" />
      </Part>

      {/* 약액 공급부 */}
      <Part id="chem" focus={focus} onPick={onPick} label="약액 공급부">
        <Box x={8.6} y={0.4} w={1.2} d={2.8} h={3.0} tone="gas" />
      </Part>

      {/* 잘라 본 챔버 하나: 스핀 척·컵 */}
      <Box x={6.3} y={3.5} w={2.6} d={2.3} h={3.0} glass />
      <Part id="chuck" focus={focus} onPick={onPick} label="스핀 척과 처리 컵">
        <Cylinder x={7.5} y={4.6} r={1.0} h={0.9} tone="metal" className="eq-cl-cup" />
        <g className={spinning ? 'eq-cl-wafer run' : 'eq-cl-wafer'}>
          <Cylinder x={7.5} y={4.6} z={0.9} r={0.75} h={0.08} tone="bb-film" />
        </g>
      </Part>
      <Part id="nozzle" focus={focus} onPick={onPick} label="약액·초순수 노즐">
        <Box x={6.5} y={3.8} w={1.0} d={0.15} h={0.15} z={2.1} tone="gas" />
        {spraying && (
          <g className="eq-cmp-slurry">
            <line x1={nx} y1={ny} x2={wx} y2={wy} />
            <circle cx={wx} cy={wy} r="3" />
          </g>
        )}
      </Part>
      <Part id="megasonic" focus={focus} onPick={onPick} label="메가소닉 진동자">
        <Box x={8.2} y={4.0} w={0.5} d={0.4} h={0.25} z={1.4} tone="heater" />
      </Part>
      <Part id="dry" focus={focus} onPick={onPick} label="건조(IPA 노즐)">
        <Box x={7.7} y={3.7} w={0.25} d={0.25} h={0.9} z={2.0} tone="metal" />
        {drying && <circle cx={wx} cy={wy} r="7" className="eq-cl-dry" />}
      </Part>

      {tags && (
        <g className="eq-tags">
          <Tag at={ANCHORS.loadport} dx={-24} dy={-24} anchor="end">FOUP</Tag>
          <Tag at={ANCHORS.robot} dx={-34} dy={36} anchor="end">반송 로봇</Tag>
          <Tag at={ANCHORS.chamber} dx={-30} dy={-22} anchor="end">공정 챔버(층층이)</Tag>
          <Tag at={ANCHORS.exhaust} dx={20} dy={-22} anchor="start">배기</Tag>
          <Tag at={ANCHORS.chem} dx={30} dy={-34} anchor="start">약액 공급</Tag>
          <Tag at={ANCHORS.nozzle} dx={-26} dy={70} anchor="end">노즐</Tag>
          <Tag at={ANCHORS.dry} dx={30} dy={-46} anchor="start">건조</Tag>
          <Tag at={ANCHORS.megasonic} dx={50} dy={-4} anchor="start">메가소닉</Tag>
          <Tag at={ANCHORS.chuck} dx={34} dy={40} anchor="start">스핀 척·컵</Tag>
        </g>
      )}
      <LotToken at={lot ? ANCHORS[lot] : null} />
    </svg>
  )
}
