import { has, Label, stageTools } from './parts.jsx'
import { PressureGauge } from './frontStage.jsx'

// 이온 주입기 그림. 위쪽은 빔라인(이온 소스 → 질량 분석 자석 → 가속관 → 웨이퍼), 아래쪽은 웨이퍼 단면입니다.
// 에너지가 클수록 가속관 고리가 늘고 주입 영역이 깊어지며, 빔 전류가 클수록 빔이 굵어집니다.
// 가동 중에는 단계(stage)마다 장면이 바뀝니다(단계 설명 글은 data/machines/ionImplant.js의 sequence.scene):
//   load 웨이퍼가 들어오고 진공 확인 → source 이온 소스가 켜짐 → beam 빔이 가속관을 지나 나감
//   → tilt 웨이퍼가 기울어짐 → scan 빔이 웨이퍼를 훑고 주입 영역이 깊어짐 → unload 빔이 꺼지고 웨이퍼가 나감
const ORDER = ['load', 'source', 'beam', 'tilt', 'scan', 'unload']

export default function ImplantView({ values, running, findings, stage = null }) {
  const s = stageTools(stage, ORDER)
  const rings = [1, 2, 4, 5][values.energy]
  const beamWidth = [0.8, 1.6, 2.8, 4][values.beam]
  // 주입 깊이: 에너지, 가벼운 붕소는 더 깊게, 기울기 0°는 채널링으로 더 깊게
  const depth = Math.min([6, 13, 26, 32][values.energy] + [5, 0, -2][values.dopant] + [6, 0, -1][values.tilt], 40)
  const maskH = values.mask === 1 ? 3 : 9
  const showResult = s.done('scan')
  const throughMask = showResult && has(findings, ['마스크를 뚫고'])
  const wrongDepth = showResult && has(findings, ['너무 깊음', '너무 얕음', '깊이 들어감'])
  const damaged = showResult && has(findings, ['손상', '비정질'])
  const targetY = values.target === 0 ? 82 + 12 : 82 + 28
  const dopantName = ['B', 'P', 'As'][values.dopant]

  // 단계별 상태
  const inside = s.idle || (s.done('load') && s.before('unload'))
  const wafer = s.at('load') ? 'ms-st-fe-inr' : s.at('unload') ? 'ms-st-fe-outr' : inside ? '' : 'ms-st-fe-gone'
  const sourceOn = s.idle || (s.done('load') && s.before('unload'))
  const beamOn = s.idle || s.at('beam') || s.at('tilt') || s.at('scan')
  const tilted = s.idle || s.done('beam')
  const angle = tilted ? [0, 12, 35][values.tilt] : 0
  const scanning = s.at('scan')
  const doped = s.idle || scanning || showResult

  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="이온 주입기 그림">
      {/* 빔라인 */}
      <rect x="8" y="14" width="30" height="22" rx="3" className={`il-tool${s.at('source') ? ' ms-st-fe-glow' : ''}`} />
      {sourceOn && [16, 23, 30].map((x) => <circle key={x} cx={x} cy="25" r="1.4" className="ms-imp-src" />)}
      <Label x={23} y={44}>
        이온 소스 ({dopantName}){s.at('source') ? ' 켜짐' : ''}
      </Label>
      <path d="M38 25 Q 62 25 66 40" className="ms-imp-magnet" />
      <Label x={62} y={12}>분석 자석</Label>
      <rect x="80" y="30" width="70" height="20" rx="3" className="il-frame" />
      {Array.from({ length: rings }, (_, i) => (
        <rect key={i} x={86 + i * 12} y="27" width="5" height="26" rx="1" className={`il-tool${s.at('beam') ? ' ms-st-fe-glow' : ''}`} />
      ))}
      <Label x={115} y={62}>가속관 · 에너지 {['낮음', '중간', '높음', '초과'][values.energy]}</Label>
      {beamOn && (
        <polyline
          points="38,25 62,27 66,40 80,40 150,40 196,40"
          className={`${running ? 'ms-imp-beam ms-flow run' : 'ms-imp-beam'}${s.at('beam') ? ' ms-st-fe-fade' : ''}`}
          style={{ strokeWidth: beamWidth }}
        />
      )}
      <g className={wafer}>
        <g className={s.at('tilt') ? 'ms-st-fe-tilt' : ''} style={{ transform: `rotate(${angle}deg)`, transformOrigin: '202px 40px', '--tilt': `${[0, 12, 35][values.tilt]}deg` }}>
          <g className={scanning ? 'ms-st-fe-scanmove' : ''}>
            <rect x="199" y="20" width="6" height="40" rx="1" className="il-wafer" />
          </g>
        </g>
      </g>
      <Label x={206} y={70}>웨이퍼</Label>
      <Label x={206} y={12}>
        {s.at('tilt') ? '기울이는 중' : `기울기 ${['0°', '약간', '크게'][values.tilt]}`}
      </Label>
      {!s.idle && <PressureGauge x={226} y={96} level={inside || s.at('load') ? 0.1 : 1} pumping={s.at('load')} venting={s.at('unload')} />}

      {/* 웨이퍼 단면 */}
      <rect x="30" y="82" width="180" height="48" className="il-wafer" />
      <rect x="30" y={82 - maskH} width="60" height={maskH} className="il-resist" />
      <rect x="150" y={82 - maskH} width="60" height={maskH} className="il-resist" />
      <Label x={60} y={78 - maskH}>감광막{values.mask === 1 ? ' (얇음)' : ''}</Label>
      {/* 주입된 영역: 주사 중에 깊어집니다 */}
      {doped && (
        <rect
          x="90"
          y="82"
          width="60"
          height={depth}
          rx="2"
          className={`${wrongDepth ? 'ms-imp-doped bad' : 'ms-imp-doped'}${scanning ? ' ms-st-fe-dig' : ''}`}
        />
      )}
      {throughMask && (
        <>
          <rect x="34" y="82" width="56" height={depth * 0.5} className="ms-imp-doped bad" />
          <rect x="150" y="82" width="56" height={depth * 0.5} className="ms-imp-doped bad" />
        </>
      )}
      {damaged &&
        [100, 112, 124, 136].map((x) => <path key={x} d={`M${x} ${82 + depth / 2 - 2} l4 4 m0 -4 l-4 4`} className="ms-defect-line" />)}
      {/* 들어오는 이온 */}
      {(s.idle || scanning) &&
        [100, 120, 140].map((x) => (
          <line key={x} x1={x - angle / 3} y1={64} x2={x} y2={80} className={running ? 'ms-imp-ion ms-flow run' : 'ms-imp-ion'} />
        ))}
      <line x1="86" y1={targetY} x2="154" y2={targetY} className="zs-original" />
      <Label x={176} y={targetY + 2}>목표 깊이</Label>
      <Label x={120} y={137}>
        {scanning ? '빔이 웨이퍼를 훑는 중 · ' : ''}
        {values.target === 0 ? '얕은 접합' : '깊은 웰'} · 도즈 {['적음', '적정', '많음'][values.dose]}
      </Label>
    </svg>
  )
}
