import { has } from '../machines/parts.jsx'

// 건식 식각기 결과물: 식각이 끝난 홈의 단면을 확대해 보여줍니다(그림용 상대값).
// 넓은 무늬와 좁은 무늬를 함께 그려 마이크로 로딩을 보이고, 깊이·벽 모양·손상·감광액 깎임은 판정 결과(findings)를 따릅니다.

export default function EtchResult({ values, result }) {
  const f = result?.findings ?? []
  const stopped = result?.grade === 'alarm'
  const under = has(f, ['덜 식각'])
  const over = has(f, ['과식각'])
  const undercut = has(f, ['언더컷'])
  const sloped = has(f, ['비스듬'])
  const damage = has(f, ['손상'])
  const lowSel = has(f, ['선택비'])
  const loading = has(f, ['로딩'])
  const slow = has(f, ['속도 저하'])
  const resTop = 92
  const resH = lowSel ? 6 : 14
  const filmTop = 106
  const filmH = 44
  const depth = stopped ? 0 : under || slow ? 26 : over ? filmH + 22 : filmH
  const narrowDepth = loading ? depth * 0.55 : depth
  const timeLabel = ['짧게', '적정', '길게'][values.time]

  const trench = (x, w, d) => {
    if (d <= 0) return ''
    const y0 = filmTop
    if (undercut) return `M${x} ${y0} Q${x - 12} ${y0 + d * 0.5} ${x + 2} ${y0 + d} H${x + w - 2} Q${x + w + 12} ${y0 + d * 0.5} ${x + w} ${y0} Z`
    if (sloped) return `M${x} ${y0} L${x + 8} ${y0 + d} H${x + w - 8} L${x + w} ${y0} Z`
    return `M${x} ${y0} V${y0 + d} H${x + w} V${y0} Z`
  }

  return (
    <svg viewBox="0 0 400 240" className="eq-result" role="img" aria-label="식각 결과물 단면 확대 그림">
      <text x="200" y="28" textAnchor="middle" className="eq-result-title">
        식각 뒤 단면 확대
      </text>
      <rect x="16" y="40" width="368" height="186" rx="6" className="eq-zoombox" />
      <rect x="20" y={filmTop + filmH} width="360" height="70" className="eq-si" />
      <rect x="20" y={filmTop} width="360" height={filmH} className="eq-fe-film" />
      {/* 감광액 마스크(넓은 구멍 · 좁은 구멍) */}
      {[
        [20, 80],
        [160, 90],
        [270, 110],
      ].map(([x, w]) => (
        <rect key={x} x={x} y={filmTop - resH} width={w} height={resH} rx={lowSel ? 3 : 0} className="eq-fe-resist" />
      ))}
      {stopped ? (
        <text x="200" y="76" textAnchor="middle" className="eq-result-alarm">
          알람으로 멈춰 식각되지 않았습니다
        </text>
      ) : (
        <>
          <path d={trench(100, 60, depth)} className="eq-fe-void eq-fe-dig" />
          <path d={trench(250, 20, narrowDepth)} className="eq-fe-void eq-fe-dig" />
          {damage && (
            <polyline
              points={`100,${filmTop + depth + 3} 108,${filmTop + depth + 8} 116,${filmTop + depth + 3} 124,${filmTop + depth + 8} 132,${filmTop + depth + 3} 140,${filmTop + depth + 8} 148,${filmTop + depth + 3} 160,${filmTop + depth + 8}`}
              className="eq-fe-damage"
            />
          )}
          {(under || over || undercut || sloped || lowSel || loading) && <rect x="92" y={filmTop - 20} width="186" height={Math.max(depth, narrowDepth) + 28} rx="4" className="eq-bad-ring" />}
          <text x="130" y={filmTop - resH - 8} textAnchor="middle" className="eq-dim strong">
            넓은 무늬
          </text>
          <text x="260" y={filmTop - resH - 8} textAnchor="middle" className="eq-dim strong">
            좁은 무늬
          </text>
          <text x="200" y="62" textAnchor="middle" className="eq-dim strong">
            {under ? '덜 식각: 막이 남음' : over ? '과식각: 아래까지 깎임' : undercut ? '언더컷: 옆으로 파임' : sloped ? '벽이 비스듬함' : loading ? '마이크로 로딩: 좁은 무늬가 덜 깎임' : lowSel ? '선택비 저하: 감광액도 깎임' : `식각 시간 ${timeLabel} · 막 바닥까지 깎임`}
          </text>
        </>
      )}
      <line x1="20" y1={filmTop + filmH} x2="380" y2={filmTop + filmH} className="eq-target" />
      <text x="378" y={filmTop + filmH - 3} textAnchor="end" className="eq-dim goal">
        목표 깊이(막 바닥)
      </text>
      <text x="40" y={filmTop + 26} className="eq-dim">
        막
      </text>
      <text x="200" y={filmTop + filmH + 50} textAnchor="middle" className="eq-si-label">
        아래층(실리콘)
      </text>
    </svg>
  )
}
