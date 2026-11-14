import { Box, Cylinder, LotToken, P, Part, S, Tag } from './isoKit.jsx'

// 패키지 쏘(싱귤레이션) 입체 그림. 구성은 review/equipment-back.md 7장(DISCO 확인 요소)을 따릅니다:
// 진공 지그·척 테이블, 얼라인 카메라, 스핀들·블레이드, 높이 센서(옵션), 트레이 적재.
// 세척·건조·검사부는 언론 보도에만 있어 점선 상자로 그리고 "보도 기준"이라고 표시합니다.
// step: 조작 순서 단계 id(블레이드 회전·절단선·카메라 표시)

export const ANCHORS = {
  jig: P(4.5, 3.3, 1.6),
  camera: P(5.9, 1.3, 4.4),
  spindle: P(3.3, 1.1, 4.1),
  height: P(2.0, 2.0, 3.6),
  post: P(8.3, 1.6, 2.8),
  tray: P(8.3, 4.4, 1.2),
}

const pts = (list) => list.map((p) => p.join(',')).join(' ')
const LINES = [0.6, 1.1, 1.6, 2.1] // 스트립 위 절단선 위치(스트립 안 상대 좌표)

export default function PkgSawIso({ focus = null, lot = null, step = null, onPick, tags = true }) {
  const cutting = step === 'cut1' || step === 'cut2'
  const cut1 = step === null || ['cut1', 'cut2', 'post', 'tray', 'blade'].includes(step)
  const cut2 = step === null || ['cut2', 'post', 'tray', 'blade'].includes(step)
  const aligning = step === 'align'
  const measuring = step === 'height'
  const holding = step === 'hold'
  const sx = 3.3
  const sy = 2.4
  const [bcx, bcy] = P(3.3, 1.75, 2.15)
  return (
    <svg viewBox="0 0 400 290" className="eq-iso" role="img" aria-label="패키지 쏘 입체 그림">
      <polygon points={pts([P(-0.5, -0.5), P(10.5, -0.5), P(10.5, 6.5), P(-0.5, 6.5)])} className="eq-floor" />
      <Box x={0} y={0} w={10} d={6} h={6.6} glass />

      {/* 후처리부(보도 기준) */}
      <Part id="post" focus={focus} onPick={onPick} label="세척·건조·검사부 (보도 기준)">
        <Box x={7.1} y={0.5} w={2.5} d={2.2} h={2.4} tone="bb-dashed" />
      </Part>

      {/* 스핀들·블레이드 */}
      <Part id="spindle" focus={focus} onPick={onPick} label="스핀들과 블레이드">
        <Box x={2.7} y={0.4} w={1.2} d={1.0} h={1.2} z={2.4} tone="metal" />
        <g className={`eq-bb-blade${cutting ? ' spin' : ''}`} style={{ transformOrigin: `${bcx}px ${bcy}px` }}>
          <ellipse cx={bcx} cy={bcy} rx={0.55 * S} ry={0.75 * S} className="eq-bb-disc" />
          <line x1={bcx} y1={bcy - 0.75 * S} x2={bcx} y2={bcy + 0.75 * S} className="eq-bb-spoke" />
        </g>
        {cutting && (
          <g className="eq-bb-water">
            <polyline points={pts([P(3.6, 1.2, 2.8), P(3.5, 1.9, 1.5)])} />
          </g>
        )}
      </Part>

      {/* 얼라인 카메라 */}
      <Part id="camera" focus={focus} onPick={onPick} label="얼라인 카메라">
        <Box x={5.6} y={1.0} w={0.6} d={0.6} h={1.0} z={3.0} tone="gas" />
        {aligning && <polygon points={pts([P(5.9, 1.3, 3.0), P(4.6, 2.6, 1.4), P(6.0, 4.0, 1.4)])} className="eq-bb-view" />}
      </Part>

      {/* 높이 센서 */}
      <Part id="height" focus={focus} onPick={onPick} label="높이 센서 (옵션)">
        <Cylinder x={2.0} y={2.0} z={2.6} r={0.25} h={0.9} tone="gas" />
        {measuring && <polyline points={pts([P(2.0, 2.0, 2.6), P(3.6, 2.8, 1.4)])} className="eq-bb-laserline" />}
      </Part>

      {/* 지그·척 테이블 + 스트립 */}
      <Part id="jig" focus={focus} onPick={onPick} label="지그와 척 테이블">
        <Box x={2.8} y={1.9} w={3.6} d={3.0} h={1.0} tone="metal" />
        <Box x={3.0} y={2.1} w={3.2} d={2.6} h={0.25} z={1.0} tone="bb-jig" className={holding ? 'eq-bb-vac' : ''} />
        <Box x={sx} y={sy} w={2.6} d={2.0} h={0.14} z={1.25} tone="bb-strip" />
        {cut1 &&
          LINES.map((l, i) => (
            <polyline
              key={`a${l}`}
              points={pts([P(sx + l, sy, 1.4), P(sx + l, sy + 2.0, 1.4)])}
              className="eq-bb-cut"
              style={{ animationDelay: step === 'cut1' ? `${i * 0.35}s` : '0s' }}
            />
          ))}
        {cut2 &&
          [0.5, 1.0, 1.5].map((l, i) => (
            <polyline
              key={`b${l}`}
              points={pts([P(sx, sy + l, 1.4), P(sx + 2.6, sy + l, 1.4)])}
              className="eq-bb-cut"
              style={{ animationDelay: step === 'cut2' ? `${i * 0.35}s` : '0s' }}
            />
          ))}
      </Part>

      {/* 트레이 적재 */}
      <Part id="tray" focus={focus} onPick={onPick} label="트레이 적재">
        <Box x={7.1} y={3.4} w={2.5} d={2.0} h={0.8} tone="metal" />
        <Box x={7.3} y={3.6} w={2.1} d={1.6} h={0.12} z={0.8} tone="bb-tray" />
        {(step === 'tray' || step === 'blade' || step === null) &&
          [0, 1, 2].map((i) =>
            [0, 1].map((j) => (
              <Box key={`${i}${j}`} x={7.5 + i * 0.65} y={3.8 + j * 0.7} w={0.4} d={0.4} h={0.15} z={0.92} tone="bb-strip" className="eq-bb-drop" />
            )),
          )}
      </Part>

      {tags && (
        <g className="eq-tags">
          <Tag at={ANCHORS.spindle} dx={-40} dy={-30} anchor="end">스핀들·블레이드</Tag>
          <Tag at={ANCHORS.height} dx={-36} dy={14} anchor="end">높이 센서(옵션)</Tag>
          <Tag at={ANCHORS.camera} dx={10} dy={-44}>얼라인 카메라</Tag>
          <Tag at={ANCHORS.jig} dx={-30} dy={58} anchor="end">지그·척 테이블</Tag>
          <Tag at={ANCHORS.post} dx={40} dy={-26} anchor="start">세척·검사(보도 기준)</Tag>
          <Tag at={ANCHORS.tray} dx={36} dy={30} anchor="start">트레이 적재</Tag>
        </g>
      )}
      <LotToken at={lot ? ANCHORS[lot] : null} />
    </svg>
  )
}
