import { has } from '../machines/parts.jsx'

// 다이 본더 결과물: 지금 조건으로 붙인 다이를 옆에서 잘라 본 확대 단면입니다.
// 리드프레임 패드 위 접착층(BLT) → 다이. 누르는 힘에 따라 접착층 두께가, 접착제 양에 따라 필렛 크기가 달라지고,
// 보이드·크랙·핀 자국·박리·넘침은 판정 결과(findings)에 따라 표시합니다. 크기는 그림용 상대값입니다.

export default function DieBonderResult({ values, result }) {
  const findings = result?.findings ?? []
  const stopped = result?.grade === 'alarm'
  const daf = values.adhesive === 1
  // 접착층(BLT)이 핵심이라 크게 확대해서 그립니다.
  const dieH = values.die === 1 ? 26 : 52
  const blt = daf ? 20 : [36, 22, 9][values.force]
  const fillet = daf ? 0 : [6, 14, 24][values.amount]
  const voided = has(findings, ['보이드', '빈 공간'])
  const cracked = has(findings, ['깨짐'])
  const pinMark = has(findings, ['핀 자국'])
  const spilled = has(findings, ['넘침'])
  const peeled = has(findings, ['박리'])
  const brittle = has(findings, ['취화', '응력'])
  const under = has(findings, ['덜 경화'])
  const padTop = 190
  const glueTop = padTop - blt
  const dieTop = glueTop - dieH
  const x0 = 80
  const x1 = 250

  return (
    <svg viewBox="0 0 400 240" className="eq-result" role="img" aria-label="다이 어태치 결과물 확대 단면">
      <text x="200" y="18" textAnchor="middle" className="eq-result-title">
        옆에서 잘라 본 단면 확대
      </text>
      <rect x="20" y="26" width="360" height="208" rx="6" className="eq-zoombox" />
      {/* 리드프레임 패드 */}
      <rect x="40" y={padTop} width="320" height="24" className="eq-ba-leadframe" />
      <text x="200" y={padTop + 16} textAnchor="middle" className="eq-si-label">
        리드프레임 다이 패드
      </text>
      {stopped ? (
        <text x="200" y="120" textAnchor="middle" className="eq-result-alarm">
          알람으로 멈춰 다이를 붙이지 못했습니다
        </text>
      ) : (
        <>
          {/* 접착층 + 필렛 */}
          <g className="eq-ba-squeeze grow">
            <rect x={x0} y={glueTop} width={x1 - x0} height={blt} className={`eq-ba-glue${daf ? ' daf' : ''}${under ? ' soft' : ''}`} />
            {fillet > 0 && (
              <>
                <path d={`M${x0} ${glueTop - (spilled ? dieH + 2 : fillet * 0.8)} Q${x0 - fillet * 0.4} ${padTop - 2} ${x0 - fillet * 1.6} ${padTop} L${x0} ${padTop} Z`} className="eq-ba-glue" />
                <path d={`M${x1} ${glueTop - (spilled ? dieH + 2 : fillet * 0.8)} Q${x1 + fillet * 0.4} ${padTop - 2} ${x1 + fillet * 1.6} ${padTop} L${x1} ${padTop} Z`} className="eq-ba-glue" />
              </>
            )}
            {spilled && <rect x={x0 + 4} y={dieTop - 4} width="40" height="5" rx="2" className="eq-ba-glue" />}
            {voided && [110, 150, 205].map((x) => <ellipse key={x} cx={x} cy={glueTop + blt / 2} rx={Math.max(3, blt * 0.6)} ry={Math.max(1.6, blt * 0.35)} className="eq-ba-void" />)}
            {brittle && <polyline points={`${x0 + 30},${glueTop + 1} ${x0 + 36},${padTop - 1} ${x0 + 44},${glueTop + 1}`} className="eq-ba-crack" />}
          </g>
          {/* 다이: 위에서 내려와 놓입니다 */}
          <g className="eq-ba-drop grow">
            <rect x={x0} y={dieTop - (peeled ? 4 : 0)} width={x1 - x0} height={dieH} className="eq-ba-diesec" />
            <rect x={x0} y={dieTop - (peeled ? 4 : 0)} width={x1 - x0} height="4" className="eq-ba-circuit" />
            {pinMark && [140, 165, 190].map((x) => <circle key={x} cx={x} cy={glueTop - 2 - (peeled ? 4 : 0)} r="1.8" className="eq-dirt" />)}
            {cracked && <polyline points={`168,${dieTop} 176,${dieTop + dieH * 0.5} 166,${glueTop}`} className="eq-ba-crack" />}
            <text x={(x0 + x1) / 2} y={dieTop + dieH / 2 + 4} textAnchor="middle" className="eq-si-label">
              {values.die === 1 ? '얇은 다이' : '다이'}
            </text>
          </g>
          {peeled && <line x1={x0} y1={glueTop - 2} x2={x1} y2={glueTop - 2} className="eq-ba-gap" />}
          {/* BLT 치수 */}
          <line x1="270" y1={glueTop} x2="270" y2={padTop} className="eq-ba-dimline" />
          <text x="276" y={glueTop + blt / 2 + 3} className="eq-dim strong">
            BLT {['두꺼움', '보통', '얇음'][daf ? 1 : values.force]}
          </text>
          <text x="200" y="44" textAnchor="middle" className={`eq-dim strong${findings.length ? ' bad' : ''}`}>
            {daf ? '접착 필름(DAF)' : `액체 에폭시 · 필렛 ${['작음', '보통', '큼'][values.amount]}`}
            {voided ? ' · 보이드' : ''}
            {spilled ? ' · 넘침' : ''}
            {peeled ? ' · 박리' : ''}
            {cracked ? ' · 다이 크랙' : ''}
          </text>
        </>
      )}
    </svg>
  )
}
