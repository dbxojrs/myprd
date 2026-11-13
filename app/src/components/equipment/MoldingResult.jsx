import { has } from '../machines/parts.jsx'

// 몰딩 결과물: 지금 조건으로 만든 패키지를 확대해 보여줍니다.
// 왼쪽: 패키지 단면 확대 — EMC가 게이트 쪽(왼쪽)부터 차오르며(속도는 플런저 속도 조건), 와이어 쓸림·보이드·미충전·플래시·덜 굳음을 표시
// 오른쪽: 위에서 본 캐비티 3개 — 런너 균형 조건에 따라 채워지는 순서가 달라짐
// 모든 크기와 시간은 그림용 상대값이며 판정은 규칙표(data/machines/molding.js)의 결과(findings)를 따릅니다.

const FILL_K = [1, 0.75, 0.5, 0.35] // 플런저 속도(느림~매우 빠름)별 차오르는 시간 비율(--grow 기준)
const LAG = [
  [0, 0.3, 0.6],
  [0, 0.12, 0.24],
  [0, 0, 0],
] // 런너 불균형·일부 보정·균형별 캐비티 도착 지연 비율(--grow 기준)

export default function MoldingResult({ values, result }) {
  const findings = result?.findings ?? []
  // 플런저 알람(transfer)은 수지가 안 들어간 상태, 이형 알람(open)은 채워졌지만 꺼내지 못한 상태입니다.
  const stopped = result?.grade === 'alarm' && result.alarm?.at === 'transfer'
  const stuck = result?.grade === 'alarm' && result.alarm?.at === 'open'
  const swept = has(findings, ['쓸림'])
  const voided = has(findings, ['보이드', '균열'])
  const short = has(findings, ['미충전', '흐르는 도중', '덜 녹아'])
  const flash = has(findings, ['플래시'])
  const soft = has(findings, ['덜 굳음'])
  const loop = values.wire === 1 ? 46 : 30
  // 차오르는 시간: 장비 가동 중에는 가동 시간(--grow)에 맞춰, 아니면 2.2초 기준으로
  const fill = `calc(var(--grow, 2.2s) * ${FILL_K[values.ram]})`
  const lag = LAG[values.runner]
  // 미충전이면 오른쪽 끝(게이트 반대쪽)이 비어 있습니다.
  const fillW = short ? 168 : 216
  const key = `${values.ram}-${values.wire}-${values.runner}-${findings.map((f) => f.title).join()}`

  return (
    <svg viewBox="0 0 400 240" className="eq-result" role="img" aria-label="몰딩 결과물 확대 그림" key={key}>
      <text x="130" y="20" textAnchor="middle" className="eq-result-title">
        패키지 단면 확대
      </text>
      {/* 리드프레임·다이·와이어 */}
      <rect x="20" y="186" width="220" height="12" className="eq-bb-lf" />
      <rect x="20" y="186" width="34" height="12" className="eq-bb-lead" />
      <rect x="206" y="186" width="34" height="12" className="eq-bb-lead" />
      <rect x="92" y="166" width="76" height="20" className="eq-bb-die" />
      {[0, 1].map((i) => {
        const side = i === 0 ? -1 : 1
        const x0 = 130 + side * 32
        const x1 = 130 + side * 92
        const peak = 166 - loop
        const d = swept
          ? `M${x0} 166 Q${(x0 + x1) / 2 + 22} ${peak + 8} ${x1} 186`
          : `M${x0} 166 Q${(x0 + x1) / 2} ${peak} ${x1} 186`
        return <path key={i} d={d} className={swept ? 'eq-bb-wire swept' : 'eq-bb-wire'} />
      })}
      {swept && <circle cx="150" cy={166 - loop * 0.55} r="12" className="eq-bb-ring" />}

      {stopped ? (
        <text x="130" y="90" textAnchor="middle" className="eq-result-alarm">
          알람으로 멈춰 수지가 채워지지 않았습니다
        </text>
      ) : (
        <>
          {/* EMC 몸체: 게이트(왼쪽)부터 차오름 */}
          <rect x="22" y="70" width={fillW} height="116" className={`eq-bb-emc grow${soft ? ' soft' : ''}`} style={{ animationDuration: fill }} />
          {short && (
            <>
              <rect x="190" y="70" width="48" height="116" className="eq-bb-empty" />
              <text x="214" y="64" textAnchor="middle" className="eq-dim eq-bb-bad">
                미충전
              </text>
            </>
          )}
          {voided && [70, 118, 176].map((x, i) => <circle key={x} cx={x} cy={96 + (i % 2) * 22} r={5 - i} className="eq-bb-void" style={{ animationDelay: fill }} />)}
          {flash && <path d="M238 186 L262 190 L262 194 L238 192 Z" className="eq-bb-flash" />}
          {stuck && (
            <text x="130" y="60" textAnchor="middle" className="eq-result-alarm">
              금형에서 안 빠져 장비가 멈췄습니다
            </text>
          )}
          <text x="24" y="82" className="eq-dim">
            ← 게이트(수지 들어옴)
          </text>
          <text x="130" y="128" textAnchor="middle" className="eq-bb-emc-label">
            EMC{soft ? ' (덜 굳음)' : ''}
          </text>
        </>
      )}
      <text x="130" y="214" textAnchor="middle" className="eq-dim">
        다이 · 와이어 · 리드프레임 {values.wire === 1 ? '(길고 가는 루프)' : '(짧은 루프)'}
      </text>
      {flash && !stopped && (
        <text x="262" y="206" textAnchor="end" className="eq-dim eq-bb-bad">
          플래시
        </text>
      )}

      {/* 위에서 본 캐비티 3개 */}
      <text x="335" y="20" textAnchor="middle" className="eq-result-title">
        캐비티 채움 순서
      </text>
      {[0, 1, 2].map((i) => {
        const y = 40 + i * 56
        return (
          <g key={i}>
            <rect x="296" y={y} width="78" height="40" rx="3" className="eq-bb-cav" />
            {!stopped && (
              <rect
                x="296"
                y={y}
                width={short && i === 2 ? 50 : 78}
                height="40"
                rx="3"
                className="eq-bb-emc grow"
                style={{ animationDuration: `calc(var(--grow, 2.2s) * ${FILL_K[values.ram] * 0.6})`, animationDelay: `calc(var(--grow, 2.2s) * ${lag[i]})` }}
              />
            )}
            <text x="290" y={y + 24} textAnchor="end" className="eq-dim">
              {i + 1}
            </text>
          </g>
        )
      })}
      <text x="335" y="222" textAnchor="middle" className="eq-dim">
        {['런너 불균형: 도착 시간 차이 큼', '일부 보정: 차이 작음', '균형: 동시에 채워짐'][values.runner]}
      </text>
    </svg>
  )
}
