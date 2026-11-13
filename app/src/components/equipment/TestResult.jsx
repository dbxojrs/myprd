import { has } from '../machines/parts.jsx'

// 테스트 결과물: 지금 조건으로 시험한 로트 40개의 결과를 보여줍니다.
// 왼쪽: 패키지 40개가 하나씩 판정됨(검사 항목이 많을수록 느리게). 놓친 불량·잘못 버린 양품·재검사·단자 손상 표시
// 오른쪽: 시험한 온도와 분류 결과(양품·불량·재검사 수)
// 어떤 칸이 진짜 불량인지는 고정된 예시 배치이며(무작위 아님), 어떤 표시를 할지는 규칙표의 결과(findings)를 따릅니다.

const TRUE_BAD = [3, 17, 26, 33] // 실제로 불량인 칸(예시 배치)
const TEMP_BAD = 33 // 고온·저온에서만 드러나는 불량(예시)
const WRONG_SCRAP = [8, 21, 30]
const RETEST = [5, 12, 19, 28, 36]
const LEAD_HURT = [10, 24]
const CYCLE_K = [0.012, 0.018, 0.024] // 검사 항목(일부·전체·전체+반복)별 칸 하나 판정 시간 비율(--grow 기준)

export default function TestResult({ values, result }) {
  const findings = result?.findings ?? []
  const stopped = result?.grade === 'alarm'
  const escape = has(findings, ['출하될', '유출'])
  const tempMiss = has(findings, ['사용 온도'])
  const loss = has(findings, ['수율'])
  const retest = has(findings, ['재검사'])
  const lead = has(findings, ['단자', '휜'])
  // 칸이 판정되는 시점: 장비 가동 중에는 가동 시간(--grow)에 맞춰, 아니면 2.2초 기준으로
  const at = (i) => `calc(var(--grow, 2.2s) * ${(i * CYCLE_K[values.items]).toFixed(3)})`
  const missed = new Set([...(escape ? [3, 26] : []), ...(tempMiss || escape ? [TEMP_BAD] : [])])
  const key = `${values.items}-${values.temp}-${values.limit}-${findings.map((f) => f.title).join()}`

  const cells = Array.from({ length: 40 }, (_, i) => {
    if (TRUE_BAD.includes(i)) return missed.has(i) ? 'missed' : 'bad'
    if (loss && WRONG_SCRAP.includes(i)) return 'scrap'
    if (retest && RETEST.includes(i)) return 'retest'
    return 'good'
  })
  const count = (kinds) => cells.filter((c) => kinds.includes(c)).length
  const good = count(['good', 'missed'])
  const fail = count(['bad', 'scrap'])
  const re = count(['retest'])

  return (
    <svg viewBox="0 0 400 240" className="eq-result" role="img" aria-label="테스트 결과 분류 그림" key={key}>
      <text x="120" y="20" textAnchor="middle" className="eq-result-title">
        로트 40개 판정
      </text>
      {stopped ? (
        <text x="120" y="120" textAnchor="middle" className="eq-result-alarm">
          알람으로 멈춰 시험하지 못했습니다
        </text>
      ) : (
        cells.map((c, i) => {
          const x = 24 + (i % 8) * 25
          const y = 34 + Math.floor(i / 8) * 30
          return (
            <g key={i} className="eq-bb-cellg" style={{ animationDelay: at(i) }}>
              <rect x={x} y={y} width="20" height="22" rx="3" className={`eq-bb-cell ${c}`} />
              {lead && LEAD_HURT.includes(i) && <path d={`M${x + 3} ${y + 22} l3 4 l3 -4`} className="eq-bb-leadhurt" />}
            </g>
          )
        })
      )}
      {!stopped && (
        <g className="eq-bb-legend">
          {[
            ['good', '양품'],
            ['bad', '불량'],
            ['retest', '재검사'],
            ['missed', '놓친 불량'],
            ['scrap', '잘못 버린 양품'],
          ].map(([c, label], i) => {
            // 범례 두 줄: 위 3개, 아래 2개
            const x = i < 3 ? 24 + i * 58 : 24 + (i - 3) * 76
            const y = i < 3 ? 192 : 208
            return (
              <g key={c}>
                <rect x={x} y={y} width="10" height="10" rx="2" className={`eq-bb-cell ${c}`} />
                <text x={x + 13} y={y + 9} className="eq-dim">
                  {label}
                </text>
              </g>
            )
          })}
          {lead && (
            <text x="24" y="232" className="eq-dim eq-bb-bad">
              ∨ 표시: 단자 눌림·휨
            </text>
          )}
        </g>
      )}

      {/* 시험 온도 */}
      <text x="320" y="20" textAnchor="middle" className="eq-result-title">
        시험 온도
      </text>
      {[
        ['Room', 0],
        ['Hot', 1],
        ['Cold', 2],
      ].map(([t, need], i) => {
        const done = values.temp >= need
        return (
          <g key={t}>
            <rect x={258 + i * 42} y="32" width="38" height="20" rx="10" className={done ? 'eq-bb-temp on' : 'eq-bb-temp'} />
            <text x={277 + i * 42} y="46" textAnchor="middle" className={done ? 'eq-bb-temp-t on' : 'eq-bb-temp-t'}>
              {t}
            </text>
          </g>
        )
      })}
      {tempMiss && (
        <text x="320" y="68" textAnchor="middle" className="eq-dim eq-bb-bad">
          안 한 온도의 불량을 놓칠 수 있음
        </text>
      )}

      {/* 분류 결과 막대 */}
      <text x="320" y="92" textAnchor="middle" className="eq-result-title">
        분류 결과
      </text>
      {!stopped &&
        [
          ['양품', good, 'good'],
          ['불량', fail, 'bad'],
          ['재검사', re, 'retest'],
        ].map(([label, n, c], i) => (
          <g key={label}>
            <text x="270" y={116 + i * 26} textAnchor="end" className="eq-dim">
              {label}
            </text>
            <rect x="276" y={106 + i * 26} width={Math.max(2, n * 2.6)} height="14" rx="3" className={`eq-bb-cell ${c} eq-bb-bar grow`} />
            <text x={282 + n * 2.6} y={117 + i * 26} className="eq-dim">
              {n}
            </text>
          </g>
        ))}
      <text x="320" y="200" textAnchor="middle" className="eq-dim">
        기준 {['느슨함', '규격대로', '너무 빡빡함'][values.limit]} · 항목 {['일부', '전체', '전체+반복'][values.items]}
      </text>
    </svg>
  )
}
