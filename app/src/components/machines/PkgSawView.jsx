import { has, Label, stageTools } from './parts.jsx'

// 패키지 쏘 그림. 몰드와 구리 리드프레임이 붙은 스트립을 블레이드가 함께 자릅니다.
// 왼쪽 위 작은 그림은 위에서 본 스트립으로, 1방향 절단 → 90° 회전 → 2방향 절단이 보입니다.
// 가동 중에는 단계(stage)마다 장면이 바뀝니다(단계 설명 글은 data/machines/packageSaw.js의 sequence.scene):
//   load 스트립이 내려와 진공으로 붙음 → spin 블레이드가 돌기 시작하고 냉각수가 나옴 → align 카메라가 절단 위치를 찾음
//   → cut1 테이블이 이송 속도대로 움직이며 한 줄씩 잘림 → rotate 스트립이 90° 돎 → cut2 나머지 방향 절단
//   → clean 물로 씻고 말림
const ORDER = ['load', 'spin', 'align', 'cut1', 'rotate', 'cut2', 'clean']
const CUTS = [62, 104, 146, 188]
const TOP_LINES = [16, 26, 36]

export default function PkgSawView({ values, running, findings, stage = null }) {
  const s = stageTools(stage, ORDER)
  const spin = ['0.7s', '0.5s', '0.3s'][values.spindle]
  const table = ['7s', '4s', '2s', '1.3s'][values.feed]
  const bladeClass = ['zs-blade-disc', 'zs-blade-disc ms-ps-sintered', 'zs-blade-disc ms-ps-electro'][values.bladeType]
  const kerf = values.blade === 1 ? 2 : 4
  const burr = has(findings, ['버'])
  const melt = has(findings, ['녹'])
  const chipped = has(findings, ['깨짐'])
  const dim = has(findings, ['치수'])

  // 단계별 상태
  const cutting = s.at('cut1') || s.at('cut2')
  const spinning = s.idle ? running : s.done('load') && s.before('clean')
  const coolantOn = values.coolant > 0 && (s.idle ? running : s.done('load') && s.before('clean'))
  const tableMove = s.idle ? running : cutting
  // 한 단계 동안 자르는 줄 수 비율: 이송이 빠를수록 줄이 빨리 생김
  const cutK = [0.9, 0.7, 0.5, 0.35][values.feed]
  const cut1Shown = s.idle || s.done('cut1')
  const cut2Shown = s.idle || s.done('cut2')
  const defects = s.idle || s.done('cut1')
  const turned = s.at('rotate') ? 'turning' : s.idle || s.done('rotate') ? 'turned' : ''

  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="패키지 쏘 그림">
      <rect x="0" y="118" width="240" height="22" className="il-tool" />
      <Label x={40} y={132}>지그 · 진공 고정</Label>
      {s.at('load') && [40, 80, 120, 160, 200].map((x) => <path key={x} d={`M${x} 114 v6 m-2 -2 l2 2 l2 -2`} className="ms-st-ps-vac" />)}

      <g className={`ms-st-ps-load${s.at('load') ? ' landing' : s.at('start') ? ' above' : ''}`}>
        <g className={tableMove ? 'ms-table run' : 'ms-table'} style={{ '--dur': table }}>
          <g transform={values.strip === 1 ? 'rotate(-2 120 104)' : undefined}>
            <rect x="20" y="104" width="200" height="8" className="ms-ps-copper" />
            <rect x="20" y="88" width="200" height="16" className="il-mold" />
            {CUTS.map((x, i) => (
              <rect
                key={x}
                x={x - kerf / 2}
                y="88"
                width={kerf}
                height="25"
                className={`ms-ps-kerf${cutting && !cut1Shown ? ' ms-st-ps-slot' : ''}`}
                style={cutting && !cut1Shown ? { animationDelay: `calc(var(--step) * ${(cutK * i) / CUTS.length})` } : { opacity: cut1Shown ? 1 : 0 }}
              />
            ))}
            {burr && defects && CUTS.map((x) => <path key={x} d={`M${x + kerf / 2} 112 l2 4 l1 -3`} className="ms-defect-line" />)}
            {chipped && defects && CUTS.map((x) => <path key={x} d={`M${x - kerf / 2 - 3} 88 l1.5 2.5 l1.5 -2`} className="ms-defect-line" />)}
            {melt && defects && CUTS.map((x) => <circle key={x} cx={x} cy="108" r="2.6" className="ms-ps-melt" />)}
          </g>
        </g>
      </g>
      <Label x={220} y={84} anchor="end">몰드 (단단함)</Label>
      <Label x={220} y={127} anchor="end">{values.plating === 1 ? '구리 리드 · 무광 주석 도금' : '구리 리드프레임 (무름)'}</Label>
      {values.strip === 1 && <Label x={4} y={64} anchor="start">스트립이 열로 늘어남</Label>}

      {/* 카메라 정렬: 십자선이 절단 위치를 하나씩 찾음 */}
      {s.at('align') && (
        <g className="ms-st-ps-cam">
          <circle cx={CUTS[0]} cy="96" r="5" className="ms-st-mk-cross" />
          <line x1={CUTS[0]} y1="86" x2={CUTS[0]} y2="114" className="ms-st-mk-cross" />
        </g>
      )}

      {/* 블레이드 */}
      <rect x="150" y="10" width="70" height="20" rx="3" className="il-tool" />
      <Label x={185} y={8}>스핀들 · {['낮음', '보통', '높음'][values.spindle]}</Label>
      <g transform="translate(110 74)">
        <g className={spinning ? 'ms-spin run' : 'ms-spin'} style={{ '--dur': s.at('spin') ? `calc(${spin} * 3)` : spin }}>
          <circle r="38" className={bladeClass} />
          <circle r="28" className="il-frame" />
          <line x1="0" y1="0" x2="27" y2="0" className="zs-spoke" />
          <line x1="0" y1="0" x2="-27" y2="0" className="zs-spoke" />
        </g>
        <circle r="4" className="il-hole" />
      </g>
      <line x1="150" y1="20" x2="114" y2="74" className="il-line" />
      <Label x={58} y={22} anchor="start">{['레진 블레이드', '금속 소결 블레이드', '전주 블레이드'][values.bladeType]}</Label>
      {values.blade === 1 && <Label x={58} y={31} anchor="start">옆면이 닳아 얇아짐</Label>}
      {/* 냉각수 */}
      <rect x="176" y="50" width="22" height="7" rx="2" className="il-tool" />
      <Label x={214} y={56}>{['냉각수 끔', '상온 물', '찬물'][values.coolant]}</Label>
      {coolantOn && (
        <line x1="178" y1="57" x2="144" y2="88" className="il-water ms-flow run" style={values.coolant === 2 ? { strokeWidth: 2.5 } : undefined} />
      )}
      {/* 세정: 위에서 물을 뿌리고 말림 */}
      {s.at('clean') &&
        [40, 75, 150, 185].map((x, i) => (
          <line key={x} x1={x} y1="62" x2={x} y2="86" className="il-water ms-st-ps-rinse" style={{ animationDelay: `${i * -0.15}s` }} />
        ))}
      {dim && defects && <circle cx="83" cy="96" r="12" className="il-warn-ring" />}

      {/* 위에서 본 스트립: 1방향 절단 → 90° 회전 → 2방향 절단 */}
      <Label x={26} y={7}>위에서 본 모습</Label>
      <g className={`ms-st-ps-top ${turned}`}>
        <rect x="6" y="10" width="40" height="40" className="il-mold" />
        {TOP_LINES.map((x, i) => (
          <line
            key={`a${x}`}
            x1={x}
            y1="10"
            x2={x}
            y2="50"
            className={`ms-st-ps-cutline${s.at('cut1') ? ' drawing' : ''}`}
            style={s.at('cut1') ? { animationDelay: `calc(var(--step) * ${(cutK * i) / 3})`, '--cut': `calc(var(--step) * ${cutK / 3})` } : { opacity: cut1Shown ? 1 : 0 }}
          />
        ))}
        {TOP_LINES.map((y, i) => (
          <line
            key={`b${y}`}
            x1="6"
            y1={y + 4}
            x2="46"
            y2={y + 4}
            className={`ms-st-ps-cutline${s.at('cut2') ? ' drawing' : ''}`}
            style={s.at('cut2') ? { animationDelay: `calc(var(--step) * ${(cutK * i) / 3})`, '--cut': `calc(var(--step) * ${cutK / 3})` } : { opacity: cut2Shown ? 1 : 0 }}
          />
        ))}
      </g>
      {s.at('rotate') && <Label x={26} y={58}>90° 회전</Label>}
    </svg>
  )
}
