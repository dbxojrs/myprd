import { has, Label } from './parts.jsx'

// 패키지 쏘 그림. 몰드와 구리 리드프레임이 붙은 스트립을 블레이드가 함께 자릅니다.
export default function PkgSawView({ values, running, findings }) {
  const spin = ['0.7s', '0.5s', '0.3s'][values.spindle]
  const table = ['7s', '4s', '2s', '1.3s'][values.feed]
  const bladeClass = ['zs-blade-disc', 'zs-blade-disc ms-ps-sintered', 'zs-blade-disc ms-ps-electro'][values.bladeType]
  const kerf = values.blade === 1 ? 2 : 4
  const burr = has(findings, ['버'])
  const melt = has(findings, ['녹'])
  const chipped = has(findings, ['깨짐'])
  const dim = has(findings, ['치수'])
  const cuts = [62, 104, 146, 188]
  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="패키지 쏘 그림">
      <rect x="0" y="118" width="240" height="22" className="il-tool" />
      <Label x={40} y={132}>지그 · 진공 고정</Label>
      <g className={running ? 'ms-table run' : 'ms-table'} style={{ '--dur': table }}>
        <g transform={values.strip === 1 ? 'rotate(-2 120 104)' : undefined}>
          <rect x="20" y="104" width="200" height="8" className="ms-ps-copper" />
          <rect x="20" y="88" width="200" height="16" className="il-mold" />
          {cuts.map((x) => (
            <rect key={x} x={x - kerf / 2} y="88" width={kerf} height="25" className="ms-ps-kerf" />
          ))}
          {burr &&
            cuts.map((x) => <path key={x} d={`M${x + kerf / 2} 112 l2 4 l1 -3`} className="ms-defect-line" />)}
          {chipped && cuts.map((x) => <path key={x} d={`M${x - kerf / 2 - 3} 88 l1.5 2.5 l1.5 -2`} className="ms-defect-line" />)}
          {melt && cuts.map((x) => <circle key={x} cx={x} cy="108" r="2.6" className="ms-ps-melt" />)}
        </g>
      </g>
      <Label x={220} y={84} anchor="end">몰드 (단단함)</Label>
      <Label x={220} y={127} anchor="end">{values.plating === 1 ? '구리 리드 · 무광 주석 도금' : '구리 리드프레임 (무름)'}</Label>
      {values.strip === 1 && <Label x={22} y={62} anchor="start">스트립이 열로 늘어남</Label>}
      {/* 블레이드 */}
      <rect x="150" y="10" width="70" height="20" rx="3" className="il-tool" />
      <Label x={185} y={8}>스핀들</Label>
      <g transform="translate(110 74)">
        <g className={running ? 'ms-spin run' : 'ms-spin'} style={{ '--dur': spin }}>
          <circle r="38" className={bladeClass} />
          <circle r="28" className="il-frame" />
          <line x1="0" y1="0" x2="27" y2="0" className="zs-spoke" />
          <line x1="0" y1="0" x2="-27" y2="0" className="zs-spoke" />
        </g>
        <circle r="4" className="il-hole" />
      </g>
      <line x1="150" y1="20" x2="114" y2="74" className="il-line" />
      <Label x={60} y={30}>{['레진 블레이드', '금속 소결 블레이드', '전주 블레이드'][values.bladeType]}</Label>
      {values.blade === 1 && <Label x={60} y={40}>옆면이 닳아 얇아짐</Label>}
      {/* 냉각수 */}
      <rect x="176" y="50" width="22" height="7" rx="2" className="il-tool" />
      <Label x={214} y={56}>{['냉각수 끔', '상온 물', '찬물'][values.coolant]}</Label>
      {values.coolant > 0 && (
        <line x1="178" y1="57" x2="144" y2="88" className={running ? 'il-water ms-flow run' : 'il-water ms-flow'} style={values.coolant === 2 ? { strokeWidth: 2.5 } : undefined} />
      )}
      {dim && <circle cx="83" cy="96" r="12" className="il-warn-ring" />}
    </svg>
  )
}
