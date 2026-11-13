import { has } from '../machines/parts.jsx'

// 노광 장비 + 트랙 결과물: 현상까지 끝난 감광액 무늬를 확대해 보여줍니다(그림용 상대값).
// 왼쪽: 단면 확대 — 감광액 두께는 회전 속도(spin), 무늬 모양은 판정 결과(findings)를 따릅니다.
// 오른쪽: 위에서 본 칩 배열 — 레티클 먼지면 모든 칩의 같은 자리에 결함이 반복됩니다.

export default function PhotoResult({ values, result }) {
  const f = result?.findings ?? []
  const stopped = result?.grade === 'alarm'
  // 감광액 두께(그림용). 적정 두께가 확대 상자 높이의 절반쯤 되게 합니다.
  const t = [88, 66, 34][values.spin] ?? 66
  const closed = has(f, ['덜 열림'])
  const narrow = has(f, ['선폭'])
  const scum = has(f, ['찌꺼기'])
  const eroded = has(f, ['깎임'])
  const collapsed = has(f, ['무너짐'])
  const blurred = has(f, ['흐려', '경계'])
  const thin = has(f, ['너무 얇음'])
  const repeat = has(f, ['결함 반복'])
  const top = 176
  const lines = [36, 106, 176]
  const w = narrow ? 30 : eroded ? 36 : 44
  const h = eroded ? t * 0.7 : t
  const bad = closed || narrow || scum || eroded || collapsed || blurred || thin

  return (
    <svg viewBox="0 0 400 240" className="eq-result" role="img" aria-label="포토 결과물 확대 그림">
      <text x="135" y="30" textAnchor="middle" className="eq-result-title">
        현상 뒤 단면 확대
      </text>
      <rect x="20" y="42" width="230" height="182" rx="6" className="eq-zoombox" />
      <rect x="24" y={top + 14} width="222" height="30" className="eq-si" />
      <rect x="24" y={top} width="222" height="14" className="eq-fe-film" />
      <text x="135" y={top + 30} textAnchor="middle" className="eq-si-label">
        깎을 막 · 실리콘
      </text>
      {stopped ? (
        <text x="135" y="120" textAnchor="middle" className="eq-result-alarm">
          알람으로 멈춰 무늬가 만들어지지 않았습니다
        </text>
      ) : (
        <>
          {lines.map((x, i) => {
            const cx = x + 22
            const skew = collapsed ? (i % 2 ? 10 : -10) : 0
            const d = eroded
              ? `M${cx - w / 2} ${top} L${cx - w / 2 + 2} ${top - h + 4} Q${cx} ${top - h - 4} ${cx + w / 2 - 2} ${top - h + 4} L${cx + w / 2} ${top} Z`
              : `M${cx - w / 2} ${top} L${cx - w / 2 + skew} ${top - h} L${cx + w / 2 + skew} ${top - h} L${cx + w / 2} ${top} Z`
            return <path key={x} d={d} className={`eq-fe-resist eq-fe-rise${blurred ? ' blur' : ''}`} style={{ animationDelay: `${i * 0.12}s` }} />
          })}
          {closed && [80, 150].map((x) => <rect key={x} x={x} y={top - h * 0.4} width="26" height={h * 0.4} className="eq-fe-resist residue" />)}
          {scum && [86, 98, 156, 168].map((x) => <circle key={x} cx={x} cy={top - 3} r="3" className="eq-fe-resist residue" />)}
          {bad && <rect x="30" y={top - h - 10} width="210" height={h + 14} rx="4" className="eq-bad-ring" />}
          <text x="150" y={Math.max(58, top - h - 22)} textAnchor="middle" className="eq-dim strong">
            감광액 무늬 · {['두껍게', '적정 두께', '얇게'][values.spin]}
            {closed ? ' · 덜 열림' : narrow ? ' · 선폭 변함' : scum ? ' · 찌꺼기' : eroded ? ' · 무늬 깎임' : collapsed ? ' · 무너짐' : ''}
          </text>
          <line x1={58 - w / 2} y1={top - h - 6} x2={58 + w / 2} y2={top - h - 6} className="eq-fe-cd" />
          <text x="58" y={top - h - 9} textAnchor="middle" className="eq-dim">
            CD
          </text>
        </>
      )}

      <text x="330" y="30" textAnchor="middle" className="eq-result-title">
        위에서 본 칩 배열
      </text>
      <circle cx="330" cy="120" r="66" className="eq-wafer-top done" />
      {Array.from({ length: 16 }, (_, i) => {
        const x = 294 + (i % 4) * 18
        const y = 84 + Math.floor(i / 4) * 18
        return (
          <g key={i}>
            <rect x={x} y={y} width="16" height="16" className={`eq-fe-die${stopped ? ' empty' : ''}`} />
            {!stopped && repeat && <circle cx={x + 11} cy={y + 5} r="2.2" className="eq-dirt bad" style={{ animationDelay: `${i * 0.05}s` }} />}
          </g>
        )
      })}
      <text x="330" y="206" textAnchor="middle" className="eq-dim">
        {repeat ? '모든 칩 같은 자리에 결함 반복 → 레티클 확인' : '칩마다 같은 무늬가 반복 노광됨'}
      </text>
    </svg>
  )
}
