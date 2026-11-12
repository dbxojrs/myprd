import { has, Label } from './parts.jsx'

// 백그라인더 그림: 왼쪽은 위에서 본 척·연삭 휠, 오른쪽은 웨이퍼 단면입니다.
export default function GrinderView({ values, running, findings }) {
  const chuckDur = ['1.6s', '2.4s', '3.4s'][values.feed]
  const wheelDur = values.wheel === 1 ? '1.4s' : '0.5s'
  const h = [14, 9, 6, 3][values.target]
  const top = 104 - h
  const broken = has(findings, ['깨짐'])
  const chipped = has(findings, ['칩핑'])
  const burned = has(findings, ['화상'])
  const sharp = values.edge === 0 && values.target >= 2
  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="백그라인더 그림">
      {/* 위에서 본 척과 웨이퍼: 척이 천천히 돕니다 */}
      <g transform="translate(62 70)">
        <g className={running ? 'ms-spin run' : 'ms-spin'} style={{ '--dur': chuckDur }}>
          <circle r="48" className="il-tool" />
          <circle r="42" className={burned ? 'il-wafer ms-bg-burn' : 'il-wafer'} />
          <line x1="0" y1="-42" x2="0" y2="-34" className="zs-spoke" />
        </g>
      </g>
      {/* 연삭 휠: 아랫면 가장자리의 날(세그먼트)이 웨이퍼 절반을 지나갑니다 */}
      <g transform="translate(86 52)">
        <g className={running ? 'ms-spin run' : 'ms-spin'} style={{ '--dur': wheelDur }}>
          <circle r="31" className="ms-bg-wheel" />
          {Array.from({ length: 18 }, (_, i) => {
            const a = (i / 18) * Math.PI * 2
            return (
              <rect
                key={i}
                x={27 * Math.cos(a) - 3}
                y={27 * Math.sin(a) - 2}
                width="6"
                height="4"
                transform={`rotate(${(a * 180) / Math.PI} ${27 * Math.cos(a)} ${27 * Math.sin(a)})`}
                className={values.wheel === 1 ? 'ms-bg-segment ms-bg-loaded' : 'ms-bg-segment'}
              />
            )
          })}
          <circle r="16" className="il-frame" />
        </g>
        <circle r="4" className="il-hole" />
      </g>
      {/* 연삭수 */}
      <rect x="6" y="14" width="18" height="6" rx="2" className="il-tool" />
      {Array.from({ length: values.water === 2 ? 3 : values.water }, (_, i) => (
        <line key={i} x1={12 + i * 3} y1="20" x2={46 + i * 3} y2="46" className={running ? 'il-water ms-flow run' : 'il-water ms-flow'} />
      ))}
      <Label x={15} y={10}>연삭수</Label>
      <Label x={62} y={132}>척(웨이퍼) · 위에서 본 모습</Label>
      <Label x={110} y={18}>연삭 휠</Label>

      {/* 오른쪽: 웨이퍼 단면 */}
      <Label x={184} y={14}>단면</Label>
      <line x1="134" y1="88" x2="232" y2="88" className="zs-original" />
      <Label x={232} y={85} anchor="end">처음 두께</Label>
      <rect x="140" y="104" width="86" height="6" className="il-tape" />
      {values.tape === 1 &&
        [152, 176, 204].map((x) => <ellipse key={x} cx={x} cy="107" rx="4" ry="2" className="il-void" />)}
      <rect x="140" y={top} width="80" height={h} className="il-wafer" />
      {sharp ? (
        <polygon points={`220,${top} 230,${top + h} 220,${top + h}`} className="il-wafer" />
      ) : values.edge === 1 ? (
        <rect x="220" y={top + h / 2} width="4" height={h / 2} className="il-wafer" />
      ) : (
        <path d={`M220 ${top} q6 ${h / 2} 0 ${h}`} className="il-wafer" />
      )}
      {values.relief === 0 && <line x1="140" y1={top + 0.6} x2="220" y2={top + 0.6} className="ms-bg-damage" />}
      <g className={running ? 'ms-shake run' : 'ms-shake'} style={{ '--amp': '2px' }}>
        <rect x="150" y={top - 12} width="46" height="10" className={values.wheel === 1 ? 'ms-bg-segment ms-bg-loaded' : 'ms-bg-segment'} />
      </g>
      <Label x={173} y={top - 15}>휠 날</Label>
      <Label x={184} y={122}>보호 테이프 (앞면 회로)</Label>
      {values.relief === 0 && <Label x={184} y={top + h + 10 > 102 ? 97 : top + h + 10}>손상층 남음</Label>}
      {sharp && (
        <>
          <line x1="228" y1={top + 1} x2="226" y2="64" className="zs-pointer" />
          <Label x={232} y={60} anchor="end">날카로운 가장자리</Label>
        </>
      )}
      {broken && <path d={`M160 ${top} l4 ${h / 2} l-3 ${h / 4} l4 ${h / 4}`} className="ms-defect-line" />}
      {chipped && <path d={`M214 ${top} l2 2 l2 -1.5 l2 2.5`} className="ms-defect-line" />}
    </svg>
  )
}
