import { has, Label } from './parts.jsx'

// 다이싱 장비 그림
export default function SawView({ values, running, findings }) {
  const spin = ['1.2s', '0.7s', '0.5s', '0.25s'][values.spindle]
  const table = ['7s', '4.5s', '2.8s', '1.6s'][values.feed]
  const waferH = values.wafer === 1 ? 4 : 10
  const bladeR = values.blade === 2 ? 26 : 32
  const cutBottom = [104 - waferH + 2, 106, 110][values.depth]
  const chipped = has(findings, ['칩핑', '깨짐'])
  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="다이싱 장비 그림">
      <rect x="0" y="120" width="240" height="20" className="il-tool" />
      <Label x={30} y={133}>진공 척</Label>
      <g className={running ? 'ms-table run' : 'ms-table'} style={{ '--dur': table }}>
        <rect x="20" y="106" width="200" height="6" className="il-tape" />
        <rect x="30" y={106 - waferH} width="180" height={waferH} className="il-wafer" />
        {[60, 90, 150, 180].map((x) => (
          <line key={x} x1={x} y1={106 - waferH} x2={x} y2="107" className="zs-cut" />
        ))}
        {chipped &&
          [60, 90, 150, 180].map((x) => (
            <path key={x} d={`M${x - 3} ${106 - waferH} l1.5 2 l1.5 -1.5 l1.5 2.5 l1.5 -3`} className="ms-defect-line" />
          ))}
      </g>
      {/* 스핀들과 블레이드 */}
      <rect x="150" y="18" width="70" height="22" rx="3" className="il-tool" />
      <Label x={185} y={14}>스핀들</Label>
      <g transform={`translate(120 ${cutBottom - bladeR})`}>
        <g className={running ? 'ms-spin run' : 'ms-spin'} style={{ '--dur': spin }}>
          <circle r={bladeR} className={values.blade === 2 ? 'zs-blade-disc ms-worn' : 'zs-blade-disc'} />
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i / 24) * Math.PI * 2
            return <circle key={i} cx={(bladeR - 1.5) * Math.cos(a)} cy={(bladeR - 1.5) * Math.sin(a)} r={values.grit === 1 ? 0.6 : 1.1} className="il-diamond" />
          })}
          <circle r={bladeR - 8} className="il-frame" />
          <line x1="0" y1="0" x2={bladeR - 9} y2="0" className="zs-spoke" />
          <line x1="0" y1="0" x2={-(bladeR - 9)} y2="0" className="zs-spoke" />
        </g>
        <circle r="4" className="il-hole" />
      </g>
      <line x1="150" y1="29" x2="124" y2={cutBottom - bladeR} className="il-line" />
      {/* 냉각수 */}
      <rect x="168" y="70" width="22" height="7" rx="2" className="il-tool" />
      <Label x={206} y={76}>냉각수</Label>
      {values.coolant > 0 &&
        Array.from({ length: values.coolant === 2 ? 3 : 1 }, (_, i) => (
          <line key={i} x1={170 + i * 3} y1={77} x2={142 + i * 3} y2={100} className={running ? 'il-water ms-flow run' : 'il-water ms-flow'} />
        ))}
      {/* 이송이 빠를수록 가루가 많이 튀고, 냉각수가 적을수록 절단부가 달아오릅니다. */}
      {running &&
        Array.from({ length: [2, 3, 5, 8][values.feed] }, (_, i) => (
          <circle key={i} cx="138" cy="100" r={values.feed >= 2 ? 1.4 : 1.1} className="il-dust ms-dust" style={{ animationDelay: `${i * 0.12}s` }} />
        ))}
      <circle cx="122" cy={cutBottom - 6} r="9" className="ms-heat-glow" style={{ opacity: [0.75, 0.35, 0][values.coolant] }} />
      {values.coolant === 0 && <Label x={122} y={cutBottom - 18}>과열</Label>}
      {values.blade === 0 && <Label x={60} y={40}>새 날 (드레싱 전)</Label>}
      {values.blade === 2 && <Label x={60} y={40}>날이 닳아 지름이 줄었음</Label>}
      <Label x={60} y={52}>{values.wafer === 1 ? '얇은 웨이퍼' : '보통 두께 웨이퍼'}</Label>
    </svg>
  )
}
