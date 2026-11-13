import { has } from '../machines/parts.jsx'

// 산화로 결과물: 지금 조건으로 만든 웨이퍼를 확대해 보여줍니다.
// 왼쪽: 단면 확대(산화막이 자라 조건대로의 두께에서 멈춤, 목표선과 비교, 문제는 빨간 표시)
// 오른쪽: 보트 위치별 웨이퍼. 양 끝의 더미 웨이퍼가 위치 차이를 받아 제품 웨이퍼는 고르게 나옵니다(SK hynix Ep.2).
// 두께는 그림용 상대값입니다(OxidationView와 같은 계산).

export default function OxidationResult({ values, result }) {
  const findings = result?.findings ?? []
  const wet = values.method === 1
  const grow = values.temp === 0 ? 0.3 : 1
  const oxide = Math.min(34, Math.max(1.5, [3, 6, 11][values.time] * (wet ? 3 : 1) * grow)) * 2.4
  const target = (values.target === 0 ? 5 : 22) * 2.4
  const thin = has(findings, ['얇음', '모자람', '자라지'])
  const thick = has(findings, ['두꺼움'])
  const dirty = has(findings, ['오염', '파티클'])
  const loose = has(findings, ['밀도'])
  const warped = has(findings, ['휨'])
  const stopped = result?.grade === 'alarm'
  const k = 2.5 // 확대 배율(그림용). 가장 두꺼운 막도 확대 상자 안에 들어가게 합니다.
  const film = (oxide / 2.4) * k
  const goal = (target / 2.4) * k
  const base = 186
  const top = base - film

  return (
    <svg viewBox="0 0 400 240" className="eq-result" role="img" aria-label="산화로 결과물 확대 그림">
      {/* 웨이퍼 전체 → 단면 확대 */}
      <ellipse cx="70" cy="34" rx="44" ry="14" className={stopped ? 'eq-wafer-top' : 'eq-wafer-top done'} />
      <rect x="92" y="28" width="12" height="9" className="eq-lens" />
      <polyline points="92,37 20,96" className="eq-zoomline" />
      <polyline points="104,37 250,96" className="eq-zoomline" />
      <text x="128" y="30" className="eq-result-title">
        웨이퍼 표면을 확대하면
      </text>
      <rect x="20" y="96" width="230" height="124" rx="6" className="eq-zoombox" />
      <path
        d={warped ? `M24 ${base + 6} Q135 ${base - 10} 246 ${base + 6} L246 216 L24 216 Z` : `M24 ${base} H246 V216 H24 Z`}
        className="eq-si"
      />
      {stopped ? (
        <text x="135" y={base - 30} textAnchor="middle" className="eq-result-alarm">
          알람으로 멈춰 산화막이 자라지 않았습니다
        </text>
      ) : (
        <>
          <rect x="24" y={top} width="222" height={film} className={`eq-oxide grow${loose ? ' loose' : ''}`} key={`${film}-${values.method}`} />
          {dirty && [60, 105, 150, 200].map((x) => <circle key={x} cx={x} cy={top + film / 2} r="3" className="eq-dirt" />)}
          {(thin || thick) && <rect x="22" y={top - 3} width="226" height={film + 6} rx="3" className="eq-bad-ring" />}
          <text x="135" y={Math.max(108, top - 6)} textAnchor="middle" className="eq-dim strong">
            산화막 SiO₂ {wet ? '(습식)' : '(건식)'}
            {thin ? ' · 목표보다 얇음' : thick ? ' · 목표보다 두꺼움' : ''}
          </text>
        </>
      )}
      <line x1="24" y1={base - goal} x2="246" y2={base - goal} className="eq-target" />
      <text x="244" y={base - goal - 3} textAnchor="end" className="eq-dim goal">
        목표
      </text>
      <text x="135" y="208" textAnchor="middle" className="eq-si-label">
        실리콘(Si) 기판
      </text>

      {/* 보트 위치별 웨이퍼 */}
      <text x="340" y="30" textAnchor="middle" className="eq-result-title">
        보트 위치별
      </text>
      {['더미', '제품', '제품', '제품', '더미'].map((kind, i) => {
        const y = 44 + i * 32
        const t = stopped ? 0 : (kind === '더미' ? 0.8 : 1) * Math.min(14, film * 0.25 + 2)
        return (
          <g key={i} className={kind === '더미' ? 'eq-boatpos dummy' : 'eq-boatpos'}>
            <rect x="300" y={y + 10} width="80" height="8" className="eq-si" />
            <rect x="300" y={y + 10 - t} width="80" height={t} className="eq-oxide grow" style={{ animationDelay: `${i * 0.08}s` }} />
            <text x="294" y={y + 18} textAnchor="end" className="eq-dim">
              {kind}
            </text>
          </g>
        )
      })}
      <text x="340" y="226" textAnchor="middle" className="eq-dim">
        양 끝 더미가 위치 차이를 받음
      </text>
    </svg>
  )
}
