import { Box, Cylinder, LotToken, P, Part, Tag } from './isoKit.jsx'

// CMP 장비 입체 그림(교육용 개념 그림, 실제 장비 배치·치수 아님).
// 구성은 data/equipment/cmp.js의 부위(연마부: 플래튼·헤드·슬러리·컨디셔너·종점 제어 / 세정부 / 로딩부·반송)를 따릅니다.
// step: 조작 순서 단계 id(연마 중에는 헤드가 패드 위에서 돌고 슬러리가 떨어짐)

export const ANCHORS = {
  load: P(1.0, 4.9, 1.8),
  transfer: P(2.6, 3.0, 1.4),
  platen: P(5.0, 2.4, 0.7),
  head: P(5.3, 2.6, 2.0),
  slurry: P(3.9, 1.3, 1.4),
  conditioner: P(6.3, 1.2, 1.1),
  endpoint: P(3.6, 3.8, 0.8),
  cleaner: P(8.5, 2.6, 2.4),
}

const pts = (list) => list.map((p) => p.join(',')).join(' ')

export default function CmpIso({ focus = null, lot = null, step = null, onPick, tags = true }) {
  const polishing = step === 'polish' || step === 'condition' || step === 'endpoint'
  const cleaning = step === 'clean'
  const [sx, sy] = P(3.95, 1.35, 1.15)
  const [dx, dy] = P(4.6, 2.2, 0.72)
  return (
    <svg viewBox="0 0 400 290" className="eq-iso" role="img" aria-label="CMP 장비 입체 그림">
      <polygon points={pts([P(-0.5, -0.5), P(10.5, -0.5), P(10.5, 6.5), P(-0.5, 6.5)])} className="eq-floor" />
      <Box x={0} y={0} w={10} d={6} h={4.2} glass />

      {/* 로딩부: 카세트 */}
      <Part id="load" focus={focus} onPick={onPick} label="카세트·로딩부">
        <Box x={0.3} y={4.2} w={1.4} d={1.4} h={1.6} tone="foup" />
        <Box x={0.3} y={2.6} w={1.4} d={1.4} h={1.6} tone="foup" />
      </Part>

      {/* 반송 기구 */}
      <Part id="transfer" focus={focus} onPick={onPick} label="웨이퍼 반송 기구">
        <Box x={2.2} y={2.6} w={0.8} d={0.8} h={1.0} tone="metal" />
        <polyline points={pts([P(2.6, 3.0, 1.0), P(3.6, 2.6, 1.0)])} className="eq-bb-rail" />
      </Part>

      {/* 종점 제어 센서(플래튼 옆 제어부로 단순화) */}
      <Part id="endpoint" focus={focus} onPick={onPick} label="실시간 종점·프로파일 제어">
        <Box x={3.3} y={3.5} w={0.6} d={0.6} h={0.8} tone="gas" />
      </Part>

      {/* 플래튼·패드 (1차·2차) */}
      <Part id="platen" focus={focus} onPick={onPick} label="플래튼과 연마 패드">
        <Cylinder x={5.0} y={2.4} r={1.5} h={0.55} tone="metal" />
        <Cylinder x={5.0} y={2.4} z={0.55} r={1.45} h={0.1} tone="bb-film" />
        <Cylinder x={5.4} y={4.9} r={1.0} h={0.55} tone="metal" />
        <Cylinder x={5.4} y={4.9} z={0.55} r={0.95} h={0.1} tone="bb-film" />
      </Part>

      {/* 슬러리 공급 팔 */}
      <Part id="slurry" focus={focus} onPick={onPick} label="슬러리 공급부">
        <Box x={3.2} y={1.2} w={1.4} d={0.2} h={0.2} z={1.1} tone="gas" />
        {polishing && (
          <g className="eq-cmp-slurry">
            <line x1={sx} y1={sy} x2={dx} y2={dy} />
            <circle cx={dx} cy={dy} r="3" />
          </g>
        )}
      </Part>

      {/* 패드 컨디셔너 */}
      <Part id="conditioner" focus={focus} onPick={onPick} label="패드 컨디셔너">
        <Box x={6.0} y={0.6} w={0.3} d={0.3} h={1.2} tone="metal" />
        <Box x={5.8} y={0.8} w={0.7} d={0.7} h={0.3} z={0.66} tone="heater" />
      </Part>

      {/* 연마 헤드 */}
      <Part id="head" focus={focus} onPick={onPick} label="연마 헤드와 리테이닝 링">
        <Box x={5.15} y={2.45} w={0.3} d={0.3} h={2.4} z={1.3} tone="metal" />
        <g className={polishing ? 'eq-cmp-head run' : 'eq-cmp-head'}>
          <Cylinder x={5.3} y={2.6} z={0.66} r={0.7} h={0.65} tone="heater" />
        </g>
      </Part>

      {/* 세정부: 브러시 2개 + 건조 */}
      <Part id="cleaner" focus={focus} onPick={onPick} label="세정부(브러시·건조)">
        <Box x={7.4} y={0.5} w={2.3} d={1.4} h={2.2} tone="rack" />
        <Box x={7.4} y={2.2} w={2.3} d={1.4} h={2.2} tone="rack" />
        <Box x={7.4} y={3.9} w={2.3} d={1.4} h={2.2} tone="gas" />
        {cleaning && <polyline points={pts([P(7.6, 2.9, 2.25), P(9.5, 2.9, 2.25)])} className="eq-cmp-brush" />}
      </Part>

      {tags && (
        <g className="eq-tags">
          <Tag at={ANCHORS.load} dx={-22} dy={-24} anchor="end">카세트</Tag>
          <Tag at={ANCHORS.transfer} dx={-30} dy={-34} anchor="end">반송</Tag>
          <Tag at={ANCHORS.slurry} dx={-34} dy={-30} anchor="end">슬러리</Tag>
          <Tag at={ANCHORS.head} dx={8} dy={-70} anchor="start">연마 헤드</Tag>
          <Tag at={ANCHORS.conditioner} dx={40} dy={-56} anchor="start">컨디셔너</Tag>
          <Tag at={ANCHORS.platen} dx={-6} dy={56} anchor="end">플래튼·패드</Tag>
          <Tag at={ANCHORS.endpoint} dx={-34} dy={30} anchor="end">종점 제어</Tag>
          <Tag at={ANCHORS.cleaner} dx={44} dy={-20} anchor="start">세정·건조</Tag>
        </g>
      )}
      <LotToken at={lot ? ANCHORS[lot] : null} />
    </svg>
  )
}
