import { Box, Cylinder, LotToken, P, Part, S, Tag } from './isoKit.jsx'

// 백그라인더 입체 그림. 배치는 review/equipment-back.md 1장(DGP8761 페이지)의 설명을 따릅니다:
// 앞쪽 카세트 → 로봇·포지셔닝 테이블 → 척 테이블 4개가 연삭 축(Z1·Z2·Z3) 아래를 차례로 지남 → 스피너 → 옆에 인라인 마운터.
// 페이지에 턴테이블 언급이 없어 "척 테이블이 축 아래를 순환"하는 정도로만 그렸습니다. 사진을 따라 그리지 않은 도식입니다.

// 척 테이블 위치: 로딩(A) → Z1(B) → Z2(C) → Z3(D)
// 화면에서 겹치지 않도록 대각선(x-y가 같은 자리)을 피해 배치합니다.
const CHUCKS = { A: [5.6, 4.0], B: [6.4, 1.6], C: [8.8, 2.6], D: [8.0, 4.6] }
const SPINDLES = [
  { id: 'z1', at: CHUCKS.B, label: 'Z1' },
  { id: 'z2', at: CHUCKS.C, label: 'Z2' },
  { id: 'z3', at: CHUCKS.D, label: 'Z3' },
]

export const ANCHORS = {
  cassette: P(1.2, 5.0, 2.6),
  robot: P(3.0, 4.2, 1.6),
  chuck: P(5.6, 4.0, 1.4),
  wheels: P(6.4, 1.6, 6.4),
  spinner: P(3.0, 1.4, 1.6),
  mounter: P(10.4, 1.4, 3.2),
}

const line = (pts) => pts.map((p) => p.join(',')).join(' ')

export default function GrinderIso({ focus = null, lot = null, step = null, onPick, tags = true }) {
  const grindingId = ['z1', 'z2', 'z3'].includes(step) ? step : null
  return (
    <svg viewBox="0 0 400 290" className="eq-iso" role="img" aria-label="백그라인더 입체 그림">
      {/* 그림을 확대해 칸을 채웁니다(viewBox는 0 0 400 290 유지) */}
      <g transform="translate(-50 -50) scale(1.25)">
      <polygon points={line([P(-0.5, -0.5), P(11.8, -0.5), P(11.8, 3.5), P(9.5, 3.5), P(9.5, 6.5), P(-0.5, 6.5)])} className="eq-floor" />
      <Box x={0} y={0} w={9.4} d={6} h={7} glass />

      {/* 인라인 마운터 (옆에 붙은 장비) */}
      <Part id="mounter" focus={focus} onPick={onPick} label="인라인 마운터">
        <Box x={9.6} y={0.2} w={2.0} d={3.0} h={2.6} tone="metal" />
        <Cylinder x={10.6} y={1.2} z={2.6} r={0.55} h={0.5} tone="foup" className={step === 'mount' ? 'eq-ba-roll' : ''} />
        <ellipse cx={P(10.6, 2.4, 2.6)[0]} cy={P(10.6, 2.4, 2.6)[1]} rx={0.75 * S} ry={0.37 * S} className="eq-ba-frame" />
      </Part>

      {/* 스피너 테이블 */}
      <Part id="spinner" focus={focus} onPick={onPick} label="스피너 테이블">
        <Box x={2.0} y={0.4} w={2.0} d={2.0} h={0.8} tone="metal" />
        <Cylinder x={3.0} y={1.4} z={0.8} r={0.8} h={0.25} tone="glass" />
        <ellipse cx={P(3.0, 1.4, 1.05)[0]} cy={P(3.0, 1.4, 1.05)[1]} rx={0.8 * S} ry={0.4 * S} className={`eq-ba-spin${step === 'spin' ? ' run' : ''}`} />
      </Part>

      {/* 척 테이블 4개 (연삭 축 아래를 차례로 지남) */}
      <Part id="chuck" focus={focus} onPick={onPick} label="척 테이블">
        <Cylinder x={7.2} y={3.2} r={2.75} h={0.7} tone="metal" />
        {Object.entries(CHUCKS).map(([k, [x, y]]) => (
          <g key={k}>
            <Cylinder x={x} y={y} z={0.7} r={0.85} h={0.25} tone="rack" />
            <ellipse cx={P(x, y, 0.95)[0]} cy={P(x, y, 0.95)[1]} rx={0.72 * S} ry={0.36 * S} className="eq-ba-wafer" />
          </g>
        ))}
      </Part>

      {/* 연삭 축 Z1·Z2·Z3: 해당 단계에서 휠이 내려와 돕니다 */}
      <Part id="wheels" focus={focus} onPick={onPick} label="연삭 축 Z1 Z2 Z3">
        {SPINDLES.map((sp) => {
          const [x, y] = sp.at
          const down = grindingId === sp.id
          return (
            <g key={sp.id} className={`eq-ba-spindle${down ? ' down' : ''}`}>
              <Box x={x - 0.5} y={y - 0.5} w={1.0} d={1.0} h={3.0} z={2.6} tone="gas" />
              <Cylinder x={x} y={y} z={1.9} r={0.2} h={0.7} tone="metal" />
              <Cylinder x={x} y={y} z={1.5} r={0.8} h={0.4} tone={sp.id === 'z3' ? 'foup' : 'metal'} />
              <ellipse cx={P(x, y, 1.5)[0]} cy={P(x, y, 1.5)[1]} rx={0.8 * S} ry={0.4 * S} className={`eq-ba-spin${down ? ' run' : ''}`} />
              <text x={P(x, y, 5.9)[0]} y={P(x, y, 5.9)[1]} textAnchor="middle" className="eq-ba-axis">
                {sp.label}
              </text>
            </g>
          )
        })}
        {grindingId &&
          [0, 1, 2].map((i) => (
            <circle key={i} cx={P(...(SPINDLES.find((s) => s.id === grindingId).at), 1.2)[0] + (i - 1) * 9} cy={P(...(SPINDLES.find((s) => s.id === grindingId).at), 1.2)[1] + 4} r="1.6" className="eq-ba-water" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
      </Part>

      {/* 로봇 · 포지셔닝 테이블 */}
      <Part id="robot" focus={focus} onPick={onPick} label="로봇과 포지셔닝 테이블">
        <Cylinder x={3.0} y={4.2} r={0.5} h={1.0} tone="metal" />
        <g className={`eq-ox-arm${step === 'center' ? ' moving' : ''}`}>
          <Box x={3.0} y={3.9} w={1.6} d={0.45} h={0.22} z={1.0} tone="metal" />
        </g>
        <Cylinder x={4.6} y={5.2} r={0.55} h={0.6} tone="glass" />
      </Part>

      {/* 카세트 (로드 포트) */}
      <Part id="cassette" focus={focus} onPick={onPick} label="카세트">
        <Box x={0.3} y={4.4} w={1.8} d={1.4} h={1.0} tone="metal" />
        <Box x={0.6} y={4.6} w={1.2} d={1.0} h={1.1} z={1.0} tone="foup" />
      </Part>

      {tags && (
        <g className="eq-tags">
          <Tag at={ANCHORS.cassette} dx={-30} dy={26} anchor="end">카세트</Tag>
          <Tag at={ANCHORS.robot} dx={-34} dy={46} anchor="end">로봇·포지셔닝 테이블</Tag>
          <Tag at={ANCHORS.spinner} dx={-40} dy={-30} anchor="end">스피너</Tag>
          <Tag at={ANCHORS.chuck} dx={-6} dy={66}>척 테이블 ×4</Tag>
          <Tag at={ANCHORS.wheels} dx={-30} dy={-22} anchor="end">연삭 축 Z1·Z2·Z3</Tag>
          <Tag at={ANCHORS.mounter} dx={-4} dy={-46}>인라인 마운터</Tag>
        </g>
      )}
      <LotToken at={lot ? ANCHORS[lot] : null} />
      </g>
    </svg>
  )
}
