import { has } from '../machines/parts.jsx'

// PVD 결과물: 금속막을 단면으로 확대해 보여줍니다(그림용 상대값).
// 두께는 전력·시간, 비아 바닥·벽 덮임·접촉 저항·막 성김·손상은 판정 결과(findings)를 따릅니다.

export default function PvdResult({ values, result }) {
  const f = result?.findings ?? []
  const stopped = result?.grade === 'alarm'
  const via = values.pattern === 1
  // 금속막 두께(그림용). 기본 조건에서 20px쯤 되게 키워 얇은 막도 잘 보이게 합니다.
  // 평평한 면에서는 비아와 비교할 필요가 없어 더 크게 확대합니다.
  const zoom = values.pattern === 1 ? 1 : 1.8
  const t = Math.max(6, Math.min(values.pattern === 1 ? 38 : 62, 20 * zoom * ([0.5, 1, 1.6][values.power] ?? 1) * ([0.45, 1, 2][values.time] ?? 1)))
  const noBottom = has(f, ['바닥이 덮이지'])
  const thinWall = has(f, ['벽이 얇게'])
  const contact = has(f, ['접촉 저항', '표면 오염'])
  const porous = has(f, ['성김', '성기'])
  const damage = has(f, ['아래층 손상'])
  const thinLine = has(f, ['얇아'])
  const thick = has(f, ['두꺼움'])
  const hot = has(f, ['과열', '온도가 높음'])
  const y0 = 120
  const d = 66
  const vx = 170
  const vw = 60
  const side = thinWall ? t * 0.15 : t * 0.4
  const bottom = noBottom ? 0 : t * 0.55
  const bad = noBottom || thinWall || contact || porous || damage || thinLine || thick || hot
  const metal = `eq-fe-metal${porous ? ' porous' : ''}`

  return (
    <svg viewBox="0 0 400 240" className="eq-result" role="img" aria-label="금속 배선 결과물 단면 확대 그림">
      <text x="200" y="28" textAnchor="middle" className="eq-result-title">
        증착 뒤 단면 확대 {via ? '(깊은 비아)' : '(평평한 면)'}
      </text>
      <rect x="20" y="40" width="360" height="186" rx="6" className="eq-zoombox" />
      <path d={via ? `M24 ${y0} H${vx} V${y0 + d} H${vx + vw} V${y0} H376 V220 H24 Z` : `M24 ${y0} H376 V220 H24 Z`} className="eq-fe-ild" />
      <text x="60" y={y0 + 40} className="eq-dim">
        절연막
      </text>
      {stopped ? (
        <text x="200" y="90" textAnchor="middle" className="eq-result-alarm">
          알람으로 멈춰 금속막이 쌓이지 않았습니다
        </text>
      ) : (
        <g>
          <rect x="24" y={y0 - t} width={via ? vx - 24 : 352} height={t} className={`${metal} eq-fe-rise`} />
          {via && (
            <>
              <rect x={vx + vw} y={y0 - t} width={376 - vx - vw} height={t} className={`${metal} eq-fe-rise`} />
              <rect x={vx} y={y0} width={side} height={d} className={`${metal} eq-fe-fadein`} />
              <rect x={vx + vw - side} y={y0} width={side} height={d} className={`${metal} eq-fe-fadein`} />
              {bottom > 0 && <rect x={vx} y={y0 + d - bottom} width={vw} height={bottom} className={`${metal} eq-fe-rise`} />}
              <ellipse cx={vx} cy={y0 - t / 2} rx={t * 0.5} ry={t * 0.55} className={metal} />
              <ellipse cx={vx + vw} cy={y0 - t / 2} rx={t * 0.5} ry={t * 0.55} className={metal} />
            </>
          )}
          {contact && <line x1="24" y1={y0 + 1} x2={via ? vx : 376} y2={y0 + 1} className="eq-fe-damage" />}
          {damage && <polyline points={`40,${y0 + 4} 52,${y0 + 9} 64,${y0 + 4} 76,${y0 + 9} 88,${y0 + 4} 100,${y0 + 9}`} className="eq-fe-damage" />}
          {bad && <rect x="22" y={y0 - t - 6} width="356" height={(via ? d : 0) + t + 12} rx="4" className="eq-bad-ring" />}
          <text x="200" y={Math.max(56, y0 - t - 12)} textAnchor="middle" className="eq-dim strong">
            금속막
            {noBottom ? ' · 비아 바닥이 안 덮임' : thinWall ? ' · 비아 벽이 얇음' : contact ? ' · 접촉 저항 증가' : porous ? ' · 막이 성김' : thinLine ? ' · 너무 얇음' : thick ? ' · 너무 두꺼움' : hot ? ' · 과열·응력' : ''}
          </text>
        </g>
      )}
    </svg>
  )
}
