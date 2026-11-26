import { has } from '../machines/parts.jsx'

// CMP 결과물: 지금 조건으로 연마한 막의 단면을 확대해 보여줍니다(교육용 그림, 실제 치수 아님).
// 왼쪽 넓은 배선(디싱), 오른쪽 촘촘한 배선(이로전), 위쪽 잔막·긁힘·잔류 입자. 판정은 규칙표(data/machines/cmp.js)의 결과를 따릅니다.
export default function CmpResult({ values, result }) {
  const findings = result?.findings ?? []
  const stopped = result?.grade === 'alarm'
  const copper = values.film === 1
  const dense = values.density === 1
  const dishing = has(findings, ['디싱'])
  const erosion = has(findings, ['이로전'])
  const residue = has(findings, ['잔막'])
  const scratch = has(findings, ['스크래치'])
  const particles = has(findings, ['잔류'])
  const step = has(findings, ['평탄화 부족'])
  const top = 110
  const ero = erosion ? 16 : 0
  const fine = dense ? [236, 262, 288, 314] : [244, 300]
  const fw = dense ? 16 : 30
  return (
    <svg viewBox="0 0 400 240" className="eq-result" role="img" aria-label="CMP 결과물 단면 확대 그림">
      <text x="200" y="22" textAnchor="middle" className="eq-result-title">
        연마한 막 단면 확대 {copper ? '(구리 다마신)' : '(절연막)'}
      </text>
      <rect x="20" y="190" width="360" height="34" className="ws-si" />
      {stopped ? (
        <text x="200" y="120" textAnchor="middle" className="eq-result-title">
          장비 정지 — 연마하지 못함
        </text>
      ) : (
        <g>
          <rect x="20" y={top} width="190" height={190 - top} className="ws-oxide" />
          <rect x="210" y={top + ero} width="170" height={190 - top - ero} className="ws-oxide" />
          {step && <path d={`M20 ${top} h50 l12 -14 h90 l12 14`} className="ws-oxide" />}
          {copper ? (
            <g>
              <path d={`M60 190 V${top} ${dishing ? `Q115 ${top + 26} 170 ${top}` : 'H170'} V190 Z`} className="ws-metal" />
              {fine.map((x) => (
                <rect key={x} x={x} y={top + ero} width={fw} height={190 - top - ero} className="ws-metal" />
              ))}
              {residue && <rect x="20" y={top - 8} width="360" height="8" className="ws-metal" opacity="0.75" />}
            </g>
          ) : (
            <rect x="20" y={top - 10} width="360" height="10" className="ws-oxide" />
          )}
          {scratch && <path d={`M70 ${top + 2} l60 3 M240 ${top + ero + 2} l70 -2`} className="ws-damage" />}
          {particles && [60, 120, 200, 280, 340].map((x) => <circle key={x} cx={x} cy={top - 12} r="3" className="ws-dirt" />)}
          <text x="115" y={top - 22} textAnchor="middle" className="ws-tag">
            {copper ? (dishing ? '넓은 배선: 디싱(오목)' : '넓은 배선') : '평탄화된 절연막'}
          </text>
          {copper && (
            <text x="295" y={top - 22} textAnchor="middle" className="ws-tag">
              {dense ? (erosion ? '촘촘한 영역: 이로전' : '촘촘한 영역') : '좁은 배선'}
            </text>
          )}
          {residue && (
            <text x="200" y={top - 36} textAnchor="middle" className="ws-tag">
              넘친 구리가 덜 걷힘(잔막)
            </text>
          )}
        </g>
      )}
    </svg>
  )
}
