import { Box, LotToken, P, Part, Tag } from './isoKit.jsx'

// 스트립 레이저 마커 입체 그림. 구성은 review/equipment-back.md 6장(EO Technics 문구)을 따릅니다:
// 양 끝 매거진 로더·언로더, 가운데 셔틀·레일 인덱서, 위쪽 레이저 헤드(스캐너)와 얼라인 비전 카메라.
// step: 조작 순서 단계 id(스트립 위치·빔·카메라 표시)

export const ANCHORS = {
  magIn: P(1.05, 3, 4.4),
  indexer: P(5, 3.4, 1.3),
  vision: P(3.2, 2.6, 6.2),
  laser: P(5.2, 2.6, 6.6),
  inspect: P(7, 2.6, 6.2),
  magOut: P(9.05, 3, 4.4),
}

const pts = (list) => list.map((p) => p.join(',')).join(' ')

// 스트립이 레일 위에서 놓이는 x 위치(장비 좌표)
const STRIP_X = { recipe: 0.5, index: 2.4, align: 2.4, mark: 4.4, inspect: 6.2, unload: 8.4, next: 8.4 }

export default function MarkerIso({ focus = null, lot = null, step = null, onPick, tags = true }) {
  const sx = STRIP_X[step] ?? 4.4
  const [ox, oy] = P(0, 0)
  const [ux, uy] = P(sx, 0)
  const marking = step === 'mark'
  const aligning = step === 'align'
  const inspecting = step === 'inspect'
  const [lx, ly] = P(5.2, 3.0, 4.6)
  const [bx, by] = P(5.2, 3.0, 1.3)
  return (
    <svg viewBox="0 0 400 290" className="eq-iso" role="img" aria-label="스트립 레이저 마커 입체 그림">
      <polygon points={pts([P(-0.5, -0.5), P(10.5, -0.5), P(10.5, 6.5), P(-0.5, 6.5)])} className="eq-floor" />
      <Box x={0} y={0} w={10} d={6} h={7.4} glass />

      {/* 레일·셔틀 */}
      <Part id="indexer" focus={focus} onPick={onPick} label="셔틀과 레일 인덱서">
        <Box x={1.8} y={2.5} w={6.4} d={1.0} h={1.0} tone="metal" />
        {[2.6, 3.4].map((y) => (
          <polyline key={y} points={pts([P(1.8, y, 1.02), P(8.2, y, 1.02)])} className="eq-bb-rail" />
        ))}
      </Part>

      {/* 갠트리: 카메라·레이저 헤드를 매다는 보 */}
      <Box x={2.5} y={1.7} w={5.4} d={0.5} h={0.5} z={6.2} tone="metal" />
      <Box x={2.5} y={1.7} w={0.4} d={0.5} h={6.2} tone="metal" />
      <Box x={7.5} y={1.7} w={0.4} d={0.5} h={6.2} tone="metal" />

      {/* 얼라인 비전 */}
      <Part id="vision" focus={focus} onPick={onPick} label="얼라인 비전 카메라">
        <Box x={2.9} y={2.3} w={0.7} d={0.7} h={1.2} z={4.6} tone="gas" />
        {aligning && <polygon points={pts([P(3.25, 2.65, 4.6), P(2.4, 2.6, 1.15), P(3.4, 3.4, 1.15)])} className="eq-bb-view" />}
      </Part>

      {/* 레이저 헤드·스캐너 */}
      <Part id="laser" focus={focus} onPick={onPick} label="레이저 헤드와 스캐너">
        <Box x={4.7} y={2.3} w={1.0} d={1.2} h={1.6} z={4.6} tone="bb-laser" />
        {marking && (
          <g className="eq-bb-beam">
            <line x1={lx} y1={ly} x2={bx} y2={by} />
            <circle cx={bx} cy={by} r="4" className="eq-bb-spark" />
          </g>
        )}
      </Part>

      {/* 마킹 검사 카메라 */}
      <Part id="inspect" focus={focus} onPick={onPick} label="마킹 검사 카메라">
        <Box x={6.7} y={2.3} w={0.7} d={0.7} h={1.2} z={4.6} tone="gas" />
        {inspecting && <polygon points={pts([P(7.05, 2.65, 4.6), P(6.2, 2.6, 1.15), P(7.2, 3.4, 1.15)])} className="eq-bb-view" />}
      </Part>

      {/* 매거진 로더·언로더 */}
      <Part id="magIn" focus={focus} onPick={onPick} label="매거진 로더">
        <Box x={0.3} y={2.2} w={1.5} d={1.6} h={3.4} tone="rack" />
        {[0.8, 1.6, 2.4].map((z) => (
          <polyline key={z} points={pts([P(0.3, 3.8, z), P(1.8, 3.8, z)])} className="eq-bb-slot" />
        ))}
      </Part>
      <Part id="magOut" focus={focus} onPick={onPick} label="매거진 언로더">
        <Box x={8.3} y={2.2} w={1.5} d={1.6} h={3.4} tone="rack" />
        {[0.8, 1.6, 2.4].map((z) => (
          <polyline key={z} points={pts([P(8.3, 3.8, z), P(9.8, 3.8, z)])} className="eq-bb-slot" />
        ))}
      </Part>

      {/* 스트립: 레일을 따라 단계별 위치로 이동 */}
      <g className="eq-bb-strip" style={{ transform: `translate(${ux - ox}px, ${uy - oy}px)` }}>
        <Box x={0} y={2.6} w={1.7} d={0.8} h={0.12} z={1.0} tone="bb-strip" />
        {[0.3, 0.75, 1.2].map((x) => {
          const [cx, cy] = P(x + 0.1, 3.0, 1.13)
          return <rect key={x} x={cx - 3} y={cy - 2} width="6" height="3" className={`eq-bb-pkgmark${step && ['inspect', 'unload', 'next'].includes(step) ? ' on' : ''}`} />
        })}
      </g>

      {tags && (
        <g className="eq-tags">
          <Tag at={ANCHORS.magIn} dx={-26} dy={-20} anchor="end">매거진 로더</Tag>
          <Tag at={ANCHORS.vision} dx={-34} dy={-30} anchor="end">얼라인 비전</Tag>
          <Tag at={ANCHORS.laser} dx={0} dy={-40}>레이저 헤드</Tag>
          <Tag at={ANCHORS.inspect} dx={40} dy={-30} anchor="start">마킹 검사</Tag>
          <Tag at={ANCHORS.magOut} dx={34} dy={-6} anchor="start">매거진 언로더</Tag>
          <Tag at={ANCHORS.indexer} dx={-20} dy={56} anchor="end">셔틀·레일 인덱서</Tag>
        </g>
      )}
      <LotToken at={lot ? ANCHORS[lot] : null} />
    </svg>
  )
}
