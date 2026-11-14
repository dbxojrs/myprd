import { has } from '../machines/parts.jsx'

// 패키지 쏘 결과물: 지금 조건으로 잘린 QFN 패키지를 확대해 보여줍니다.
// 왼쪽: 위에서 본 패키지 — 절단선이 지나간 뒤 가장자리 리드에 남은 구리 버·녹음·몰드 깨짐, 치수(목표 점선 vs 실제)
// 오른쪽: 가장자리 단면 — 버가 아래로 늘어난 정도와 규격선
// 크기는 그림용 상대값이며 판정은 규칙표(data/machines/packageSaw.js)의 결과(findings)를 따릅니다.

const CUT_K = [1, 0.7, 0.45, 0.3] // 이송 속도(느림~매우 빠름)별 절단선이 지나가는 시간 비율(--grow 기준)
const LEADS = [0, 1, 2, 3, 4]

export default function PkgSawResult({ values, result }) {
  const findings = result?.findings ?? []
  const stopped = result?.grade === 'alarm'
  const burrBig = has(findings, ['규격을 넘음'])
  const burr = burrBig || has(findings, ['버가 커짐', '버·몰드'])
  const melt = has(findings, ['녹'])
  const chipped = has(findings, ['깨짐'])
  const dim = has(findings, ['치수'])
  const spike = burrBig ? 16 : burr ? 9 : 0 // 버를 크게 키워 보여줍니다(그림용)
  // 절단 시간: 장비 가동 중에는 가동 시간(--grow)에 맞춰, 아니면 2.2초 기준으로
  const cut = `calc(var(--grow, 2.2s) * ${CUT_K[values.feed]})`
  // 치수 불량: 날 옆면이 닳아 한쪽이 더 깎임(그림용)
  const shrink = dim ? 8 : 0
  const x0 = 40
  const y0 = 50
  const size = 150
  const key = `${values.feed}-${values.blade}-${values.bladeType}-${values.coolant}-${findings.map((f) => f.title).join()}`

  return (
    <svg viewBox="0 0 400 240" className="eq-result" role="img" aria-label="패키지 쏘 결과물 확대 그림" key={key}>
      <text x="115" y="20" textAnchor="middle" className="eq-result-title">
        잘린 패키지 (위에서)
      </text>
      {stopped ? (
        <>
          <rect x={x0} y={y0} width={size} height={size} className="eq-bb-pkgtop uncut" />
          <text x="115" y="132" textAnchor="middle" className="eq-result-alarm">
            알람으로 멈춰 자르지 못했습니다
          </text>
        </>
      ) : (
        <>
          <rect x={x0 - 6} y={y0 - 6} width={size + 12} height={size + 12} className="eq-bb-targetbox" />
          <rect x={x0} y={y0} width={size - shrink} height={size} className="eq-bb-pkgtop cut" style={{ animationDelay: cut }} />
          {/* 네 변의 리드(구리 패드) */}
          {LEADS.map((i) => {
            const t = 18 + i * 28
            return (
              <g key={i}>
                <rect x={x0 + t} y={y0} width="12" height="14" className="eq-bb-pad" />
                <rect x={x0 + t} y={y0 + size - 14} width="12" height="14" className="eq-bb-pad" />
                <rect x={x0} y={y0 + t} width="14" height="12" className="eq-bb-pad" />
                <rect x={x0 + size - shrink - 14} y={y0 + t} width="14" height="12" className="eq-bb-pad" />
                {spike > 0 && (
                  <>
                    <path d={`M${x0 + t} ${y0} l6 ${-spike} l6 ${spike} Z`} className="eq-bb-burr" style={{ animationDelay: cut }} />
                    <path d={`M${x0 + size - shrink} ${y0 + t} l${spike} 6 l${-spike} 6 Z`} className="eq-bb-burr" style={{ animationDelay: cut }} />
                  </>
                )}
                {melt && i % 2 === 0 && <ellipse cx={x0 + t + 20} cy={y0 + size - 4} rx="10" ry="4" className="eq-bb-melt" />}
              </g>
            )
          })}
          <rect x={x0 + 40} y={y0 + 40} width={70 - shrink} height="70" className="eq-bb-epad" />
          {chipped && (
            <>
              <path d={`M${x0 + size - shrink} ${y0 + size} l-14 0 l6 -6 l-4 -8 Z`} className="eq-bb-chip" />
              <path d={`M${x0} ${y0 + size} l12 0 l-6 -9 Z`} className="eq-bb-chip" />
            </>
          )}
          {/* 절단선이 지나감 */}
          <line x1={x0 - 10} y1={y0} x2={x0 + size + 10} y2={y0} className="eq-bb-sweep grow" style={{ animationDuration: cut }} />
          <line x1={x0 + size - shrink} y1={y0 - 10} x2={x0 + size - shrink} y2={y0 + size + 10} className="eq-bb-sweep v grow" style={{ animationDuration: cut }} />
          <text x="115" y="222" textAnchor="middle" className={dim || burr || melt || chipped ? 'eq-dim eq-bb-bad' : 'eq-dim'}>
            {[dim && '치수 흔들림(점선=목표)', burr && '구리 버', melt && '리드 녹음', chipped && '몰드 깨짐'].filter(Boolean).join(' · ') || '점선=목표 치수 · 깨끗하게 잘림'}
          </text>
        </>
      )}

      {/* 가장자리 단면 */}
      <text x="320" y="20" textAnchor="middle" className="eq-result-title">
        가장자리 단면
      </text>
      <rect x="258" y="70" width="100" height="56" className="eq-bb-moldx" />
      <rect x="258" y="126" width="100" height="16" className="eq-bb-pad" />
      {!stopped && spike > 0 && <path d={`M342 142 L358 142 L356 ${142 + spike * 3} Z`} className="eq-bb-burr grow" />}
      {!stopped && chipped && <path d="M358 70 L344 70 L350 82 L358 86 Z" className="eq-bb-chip" />}
      <line x1="252" y1="150" x2="380" y2="150" className="eq-target" />
      <text x="250" y="154" textAnchor="end" className="eq-dim goal">
        규격선
      </text>
      <text x="318" y="102" textAnchor="middle" className="eq-bb-emc-label">
        몰드
      </text>
      <text x="300" y="138" textAnchor="middle" className="eq-dim eq-bb-light">
        구리 리드
      </text>
      <text x="320" y="200" textAnchor="middle" className="eq-dim">
        블레이드: {['레진', '금속 소결', '전주(일렉트로폼)'][values.bladeType]}
        {values.blade === 1 ? ' · 옆면 마모' : ''}
      </text>
      <text x="320" y="214" textAnchor="middle" className="eq-dim">
        냉각수 {['끔', '상온', '차갑게'][values.coolant]} · 이송 {['느림', '보통', '빠름', '매우 빠름'][values.feed]}
      </text>
    </svg>
  )
}
