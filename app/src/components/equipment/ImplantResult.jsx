import { has } from '../machines/parts.jsx'

// 이온 주입 결과물: 불순물이 들어간 영역을 단면으로 확대하고, 오른쪽에 깊이별 농도 곡선을 그립니다(그림용 상대값).
// 깊이는 에너지·이온종, 진하기는 도즈, 채널링·그림자·손상·마스크 뚫림은 판정 결과(findings)를 따릅니다.

export default function ImplantResult({ values, result }) {
  const f = result?.findings ?? []
  const stopped = result?.grade === 'alarm'
  const light = [1.25, 1, 0.8][values.dopant] ?? 1 // 붕소가 가볍게 더 깊이
  // 주입 깊이(그림용). 기본(중간 에너지)에서 상자 높이의 절반쯤 되게 합니다.
  const rp = ([24, 46, 70, 80][values.energy] ?? 46) * light
  const conc = [0.3, 0.6, 0.9][values.dose] ?? 0.6
  const channel = has(f, ['채널링'])
  const shadow = has(f, ['그림자'])
  const damage = has(f, ['손상', '비정질'])
  const punch = has(f, ['뚫고'])
  const deep = has(f, ['너무 깊음', '깊이 들어감'])
  const shallow = has(f, ['얕음'])
  const lowConc = has(f, ['농도 부족'])
  const maskH = values.mask === 1 ? 8 : 18
  const top = 96
  const nType = values.dopant !== 0
  const tone = nType ? 'n' : 'p'
  const finger = Math.max(0, Math.min(rp * 0.6, 220 - top - rp))
  const bad = channel || shadow || damage || punch || deep || shallow || lowConc

  // 깊이별 농도 곡선(가우스 모양, 그림용)
  const curve = Array.from({ length: 25 }, (_, i) => {
    const depth = i * 5
    const c = Math.exp(-((depth - rp * 0.7) ** 2) / (2 * (rp * 0.35 + 4) ** 2)) * conc
    const tail = channel ? Math.exp(-depth / 40) * 0.25 * conc : 0
    return [300 + Math.min(1, c + tail) * 80, top + depth]
  })

  return (
    <svg viewBox="0 0 400 240" className="eq-result" role="img" aria-label="이온 주입 결과물 확대 그림">
      <text x="140" y="28" textAnchor="middle" className="eq-result-title">
        주입 뒤 단면 확대
      </text>
      <rect x="16" y="40" width="250" height="186" rx="6" className="eq-zoombox" />
      <rect x="20" y={top} width="242" height="126" className="eq-si" />
      {/* 감광막 마스크 */}
      <rect x="20" y={top - maskH} width="90" height={maskH} className="eq-fe-resist" />
      <text x="65" y={top - maskH - 4} textAnchor="middle" className="eq-dim">
        감광막(마스크)
      </text>
      {stopped ? (
        <text x="140" y="70" textAnchor="middle" className="eq-result-alarm">
          알람으로 멈춰 주입되지 않았습니다
        </text>
      ) : (
        <>
          <rect x={shadow ? 126 : 110} y={top} width={shadow ? 136 : 152} height={rp} className={`eq-fe-dope ${tone} eq-fe-rise-down`} style={{ opacity: 0.35 + conc * 0.6 }} />
          {shadow && <rect x="110" y={top} width="16" height={rp * 0.4} className={`eq-fe-dope ${tone}`} style={{ opacity: 0.25 }} />}
          {channel && [140, 180, 220].map((x) => <rect key={x} x={x} y={top + rp - 2} width="6" height={finger} rx="3" className={`eq-fe-dope ${tone} eq-fe-rise-down`} />)}
          {punch && <rect x="20" y={top} width="90" height={rp * 0.5} className={`eq-fe-dope ${tone}`} style={{ opacity: 0.35 }} />}
          {damage && <rect x="110" y={top} width="152" height={Math.min(rp * 0.6, 22)} className="eq-fe-amorph" />}
          {bad && <rect x="20" y={top - 4} width="242" height={Math.min(rp + (channel ? finger : 0) + 8, 226 - top)} rx="4" className="eq-bad-ring" />}
          <text x="186" y={top - 12} textAnchor="middle" className="eq-dim strong">
            {nType ? 'n형' : 'p형'} 도핑 영역
            {deep ? ' · 너무 깊음' : shallow ? ' · 너무 얕음' : channel ? ' · 채널링' : shadow ? ' · 그림자' : punch ? ' · 마스크 뚫림' : lowConc ? ' · 농도 부족' : ''}
          </text>
        </>
      )}

      <text x="340" y="28" textAnchor="middle" className="eq-result-title">
        깊이별 농도
      </text>
      <line x1="300" y1={top} x2="300" y2={top + 122} className="eq-fe-axis" />
      <line x1="300" y1={top} x2="386" y2={top} className="eq-fe-axis" />
      {!stopped && <polyline points={curve.map((p) => p.join(',')).join(' ')} className={`eq-fe-curve ${tone}`} />}
      <text x="296" y={top + 4} textAnchor="end" className="eq-dim">
        표면
      </text>
      <text x="296" y={top + 122} textAnchor="end" className="eq-dim">
        깊이
      </text>
      <text x="386" y={top - 4} textAnchor="end" className="eq-dim">
        농도 →
      </text>
    </svg>
  )
}
