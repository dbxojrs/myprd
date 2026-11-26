import { has } from '../machines/parts.jsx'

// 세정 결과물: 지금 조건으로 씻은 웨이퍼 표면을 확대해 보여줍니다(교육용 그림, 실제 치수 아님).
// 남은 입자·금속 오염·자연산화막과 패턴 붕괴를 판정 결과(data/machines/cleaning.js)대로 그립니다.
export default function CleanResult({ values, result }) {
  const findings = result?.findings ?? []
  const stopped = result?.grade === 'alarm'
  const tall = values.pattern === 1
  const metal = has(findings, ['금속 오염'])
  const oxide = has(findings, ['자연산화막'])
  const particles = has(findings, ['덜 떨어짐'])
  const residue = has(findings, ['약품 잔류'])
  const broken = has(findings, ['손상', '붕괴'])
  const lines = tall ? [70, 120, 170, 220, 270, 320] : [80, 200, 300]
  return (
    <svg viewBox="0 0 400 240" className="eq-result" role="img" aria-label="세정 결과 표면 확대 그림">
      <text x="200" y="22" textAnchor="middle" className="eq-result-title">
        씻은 웨이퍼 표면 확대 {tall ? '(가늘고 높은 3D 패턴)' : '(평평하거나 굵은 패턴)'}
      </text>
      <rect x="20" y="180" width="360" height="44" className="ws-si" />
      {stopped ? (
        <text x="200" y="120" textAnchor="middle" className="eq-result-title">
          장비 정지 — 세정하지 못함
        </text>
      ) : (
        <g>
          {oxide && <rect x="20" y="174" width="360" height="6" className="ws-oxide" />}
          {lines.map((x, i) => {
            const fallen = broken && tall && i === 3
            return (
              <rect
                key={x}
                x={x}
                y={tall ? 70 : 150}
                width={tall ? 14 : 50}
                height={tall ? 110 : 30}
                className="ws-oxide"
                transform={fallen ? `rotate(-24 ${x + 7} 180)` : undefined}
              />
            )
          })}
          {particles && [50, 150, 250, 350].map((x) => <circle key={x} cx={x} cy="172" r="4" className="ws-dirt" />)}
          {metal && [100, 190, 290].map((x) => <circle key={x} cx={x} cy="176" r="3" className="ws-dirt" opacity="0.6" />)}
          {residue && <rect x="20" y="168" width="360" height="5" className="ws-resist" opacity="0.7" />}
          <text x="200" y="52" textAnchor="middle" className="ws-tag">
            {broken ? '패턴이 쓰러지거나 손상됨' : metal ? '금속 오염이 남음' : oxide ? '자연산화막이 남음' : residue ? '약품이 남음' : particles ? '입자가 일부 남음' : '깨끗한 표면'}
          </text>
        </g>
      )}
    </svg>
  )
}
