import { has } from '../machines/parts.jsx'

// 레이저 마킹 결과물: 지금 조건으로 새긴 패키지를 확대해 보여줍니다.
// 왼쪽: 패키지 윗면 — 글자가 하나씩 새겨짐(속도 조건이 빠를수록 빨리). 끊김·흐림·번짐을 표시
// 오른쪽: 단면 — 새긴 깊이(출력·반복 횟수)와 몰드 두께(패키지 두께), 칩 손상·강도 저하 표시
// 크기는 그림용 상대값이며 판정은 규칙표(data/machines/marking.js)의 결과(findings)를 따릅니다.

const TEXT = ['A', 'X', '2', '4', '0', '7']
const STEP_K = [0.16, 0.12, 0.07] // 속도(느림·적정·빠름)별 글자 하나 새기는 시간 비율(--grow 기준)

export default function MarkingResult({ values, result }) {
  const findings = result?.findings ?? []
  const noMark = result?.grade === 'alarm' && result.alarm?.at === 'power-check'
  const inspectFail = result?.grade === 'alarm' && result.alarm?.at === 'inspect'
  const broken = has(findings, ['끊김'])
  const faint = has(findings, ['흐림'])
  const blurred = has(findings, ['번짐'])
  const chipDamage = has(findings, ['칩 손상'])
  const weak = has(findings, ['강도 저하'])
  const deep = has(findings, ['깊게 파임', '깊어짐'])
  const stroke = [1.6, 2.6, 3.6][values.power] + (values.focus === 1 ? 0 : 1.6)
  const depth = ([8, 18, 30][values.power] + [0, 12, 22][values.passes]) * (values.lens === 1 ? 0.6 : 1) // 깊이를 크게 키워 보여줍니다(그림용)
  const moldTop = values.margin === 1 ? 104 : 62
  const chipTop = 156
  const k = STEP_K[values.speed]
  // 글자·홈이 생기는 시점: 장비 가동 중에는 가동 시간(--grow)에 맞춰, 아니면 2.2초 기준으로
  const at = (i) => `calc(var(--grow, 2.2s) * ${(i * k).toFixed(3)})`
  const markClass = `eq-bb-letter${broken ? ' broken' : ''}${faint ? ' faint' : ''}${blurred ? ' blur' : ''}`
  const key = `${values.power}-${values.speed}-${values.passes}-${values.focus}-${values.lens}-${values.margin}-${findings.map((f) => f.title).join()}`

  return (
    <svg viewBox="0 0 400 240" className="eq-result" role="img" aria-label="레이저 마킹 결과물 확대 그림" key={key}>
      <defs>
        <filter id="eq-bb-blur">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
      </defs>
      <text x="110" y="20" textAnchor="middle" className="eq-result-title">
        패키지 윗면 확대
      </text>
      <rect x="20" y="34" width="180" height="180" rx="8" className="eq-bb-pkgtop" />
      <circle cx="38" cy="52" r="5" className="eq-bb-pin1" />
      {noMark ? (
        <text x="110" y="128" textAnchor="middle" className="eq-result-alarm">
          출력 부족 알람으로 새기지 못했습니다
        </text>
      ) : (
        TEXT.map((ch, i) => (
          <text
            key={i}
            x={44 + (i % 3) * 52}
            y={i < 3 ? 116 : 176}
            className={markClass}
            style={{ animationDelay: at(i), strokeWidth: stroke, filter: blurred ? 'url(#eq-bb-blur)' : undefined }}
          >
            {ch}
          </text>
        ))
      )}
      {(broken || faint || blurred || inspectFail) && !noMark && (
        <text x="110" y="208" textAnchor="middle" className="eq-dim eq-bb-bad">
          {inspectFail ? '판독 검사 실패' : broken ? '글자 끊김' : blurred ? '글자 번짐' : '글자가 흐림'}
        </text>
      )}

      {/* 단면: 새긴 깊이 vs 칩 */}
      <text x="310" y="20" textAnchor="middle" className="eq-result-title">
        단면 (깊이 · 칩 위치)
      </text>
      <rect x="230" y={moldTop} width="160" height={200 - moldTop} className="eq-bb-moldx" />
      <rect x="262" y={chipTop} width="96" height="22" className={`eq-bb-die${chipDamage ? ' hurt' : ''}`} />
      <rect x="230" y="200" width="160" height="12" className="eq-bb-lf" />
      {!noMark &&
        [268, 298, 328].map((x, i) => (
          <rect key={x} x={x} y={moldTop} width="16" height={Math.min(depth, chipTop - moldTop + 6)} className="eq-bb-groove grow" style={{ animationDelay: at(i * 2) }} />
        ))}
      {chipDamage && (
        <>
          <circle cx="306" cy={chipTop + 4} r="14" className="eq-bb-ring" />
          <text x="306" y={chipTop + 38} textAnchor="middle" className="eq-dim eq-bb-bad">
            칩 손상 (레이저 투과)
          </text>
        </>
      )}
      {weak && <path d={`M244 ${moldTop + 8} l10 20 l-6 14 l10 18`} className="eq-bb-crack" />}
      <text x="386" y={moldTop - 6} textAnchor="end" className="eq-dim">
        {values.margin === 1 ? '얇은 패키지: 칩까지 여유 작음' : '보통 패키지'}
      </text>
      {deep && !chipDamage && (
        <text x="310" y={chipTop + 38} textAnchor="middle" className="eq-dim eq-bb-bad">
          깊게 파임
        </text>
      )}
      <text x="310" y="228" textAnchor="middle" className="eq-dim">
        출력 {['약함', '적정', '강함'][values.power]} · {values.passes + 1}회 · 초점 {['아래', '맞음', '위'][values.focus]}
      </text>
    </svg>
  )
}
