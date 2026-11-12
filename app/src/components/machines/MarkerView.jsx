import { has, Label } from './parts.jsx'

// 레이저 마커 그림. 왼쪽은 장비 옆모습, 오른쪽은 새긴 자리 단면입니다.
export default function MarkerView({ values, running, findings }) {
  const scan = ['3s', '1.8s', '0.9s'][values.speed]
  const beamW = [1, 2, 3][values.power]
  const spot = values.focus === 1 ? 2 : 6
  const depth = [2, 5, 9][values.power] + [0, 4, 7][values.passes]
  const moldTop = values.margin === 1 ? 64 : 52
  const chipTop = 82
  const chipDamage = has(findings, ['칩 손상'])
  const broken = has(findings, ['끊김', '흐림', '번짐'])
  const weak = has(findings, ['강도 저하', '깊게 파임', '깊어짐'])
  const markClass = broken ? 'ms-mk-mark faint' : 'ms-mk-mark'
  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="레이저 마커 그림">
      {/* 레이저 헤드와 렌즈 */}
      <rect x="40" y="10" width="54" height="22" rx="3" className="il-tool" />
      <Label x={67} y={8}>레이저 헤드</Label>
      <rect x="54" y="32" width="26" height="5" rx="2" className="il-oxide" />
      {values.lens === 1 && [58, 64, 71, 76].map((x) => <circle key={x} cx={x} cy="34.5" r="1.2" className="ms-dirt" />)}
      <Label x={100} y={38} anchor="start">{values.lens === 1 ? '렌즈 오염' : '렌즈'}</Label>
      {/* 빔: 가공 중에만 켜지고, 좌우로 훑습니다 */}
      <g className={running ? 'ms-table run' : 'ms-table'} style={{ '--dur': scan }}>
        {running && <line x1="67" y1="37" x2="67" y2={94 - spot} className="il-laser" style={{ strokeWidth: beamW }} />}
        {running && <ellipse cx="67" cy="94" rx={spot} ry="1.6" className="ms-mk-spot" />}
      </g>
      {/* 스트립과 패키지 */}
      <rect x="10" y="100" width="130" height="8" className="il-frame" />
      {[14, 46, 78, 110].map((x) => (
        <g key={x}>
          <rect x={x} y="94" width="28" height="6" className="il-mold" />
          <text x={x + 14} y="98.8" textAnchor="middle" className={markClass}>
            {broken ? 'P K' : 'PKG'}
          </text>
        </g>
      ))}
      <Label x={75} y={120}>몰딩된 스트립 · 초점 {values.focus === 1 ? '맞음' : '어긋남'}</Label>

      {/* 단면: 몰드, 칩, 새긴 홈 */}
      <Label x={196} y={40}>새긴 자리 단면</Label>
      <rect x="156" y={moldTop} width="80" height={100 - moldTop} className="il-mold" />
      <rect x="168" y={chipTop} width="56" height="10" className="il-die" />
      <path d="M 176 92 C 180 70, 214 70, 218 92" className="il-wire" />
      <rect x="184" y={moldTop} width="24" height={depth} className={weak ? 'ms-mk-groove deep' : 'ms-mk-groove'} />
      <line x1="230" y1={moldTop} x2="230" y2={chipTop} className="il-dim" />
      <Label x={233} y={moldTop - 3} anchor="end">{values.margin === 1 ? '얇은 몰드' : '몰드 여유'}</Label>
      <rect x="156" y="100" width="80" height="6" className="il-frame" />
      {chipDamage && <path d="M190 82 l3 4 l3 -3 l3 5 l3 -4" className="ms-defect-line" />}
      {chipDamage && <circle cx="196" cy="84" r="8" className="il-warn-ring" />}
      {weak && !chipDamage && <circle cx="196" cy={moldTop + depth / 2} r="10" className="il-warn-ring" />}
    </svg>
  )
}
