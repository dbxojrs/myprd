import { has } from '../machines/parts.jsx'

// CVD 결과물: 증착이 끝난 막을 단면으로 확대해 보여줍니다(그림용 상대값).
// 두께는 온도·가스·시간, 홈 안쪽 덮임(스텝 커버리지)·균일도·파티클·오염은 판정 결과(findings)를 따릅니다.

const trenchMax = (pattern) => (pattern === 1 ? 40 : 64)

export default function CvdResult({ values, result }) {
  const f = result?.findings ?? []
  const stopped = result?.grade === 'alarm'
  const trench = values.pattern === 1
  const rate = ([0.5, 1, 1.3][values.temp] ?? 1) * ([0, 0.6, 1, 1.3][values.gas] ?? 1)
  // 막 두께(그림용). 기본 조건에서 22px쯤 되게 키워 얇은 막도 잘 보이게 합니다.
  // 평평한 면에서는 홈과 비교할 필요가 없어 더 크게 확대합니다.
  const zoom = values.pattern === 1 ? 1 : 1.8
  const t = Math.max(7, Math.min(trenchMax(values.pattern), 22 * zoom * rate * ([0.55, 1, 1.8][values.time] ?? 1)))
  const poorCover = has(f, ['덜 덮임'])
  const uneven = has(f, ['불균일'])
  const particles = has(f, ['파티클', '입자'])
  const dirty = has(f, ['오염'])
  const thin = has(f, ['얇음', '미달'])
  const thick = has(f, ['두꺼움'])
  const stress = has(f, ['응력', '손상'])
  const cover = poorCover ? 0.3 : 0.92
  const y0 = 120
  const d = 64
  const tx = 160
  const tw = 80
  const surface = trench ? `M24 ${y0} H${tx} V${y0 + d} H${tx + tw} V${y0} H376 V220 H24 Z` : `M24 ${y0} H376 V220 H24 Z`
  const wave = uneven ? `M24 ${y0} Q110 ${y0 - t - 10} 200 ${y0 - t} T376 ${y0 - t + 8} V${y0} Z` : null
  const ts = t * cover
  const tb = t * (poorCover ? 0.35 : 0.95)

  return (
    <svg viewBox="0 0 400 240" className="eq-result" role="img" aria-label="CVD 결과물 단면 확대 그림">
      <text x="200" y="28" textAnchor="middle" className="eq-result-title">
        증착 뒤 단면 확대 {trench ? '(깊은 홈 패턴)' : '(평평한 면)'}
      </text>
      <rect x="20" y="40" width="360" height="186" rx="6" className="eq-zoombox" />
      <path d={surface} className="eq-si" />
      {stopped ? (
        <text x="200" y="90" textAnchor="middle" className="eq-result-alarm">
          알람으로 멈춰 막이 쌓이지 않았습니다
        </text>
      ) : (
        <g className={`eq-fe-depo${stress ? ' stressed' : ''}`}>
          {/* 홈이 있으면 홈 덮임을 먼저 보여 주고(불균일은 표시 문구로), 평평한 면에서만 물결 모양으로 불균일을 그립니다. */}
          {wave && !trench ? (
            <path d={wave} className="eq-fe-cvd eq-fe-rise" />
          ) : trench ? (
            <>
              <rect x="24" y={y0 - t} width={tx - 24} height={t} className="eq-fe-cvd eq-fe-rise" />
              <rect x={tx + tw} y={y0 - t} width={376 - tx - tw} height={t} className="eq-fe-cvd eq-fe-rise" />
              <rect x={tx} y={y0 - t} width={ts} height={d + t} className="eq-fe-cvd eq-fe-fadein" />
              <rect x={tx + tw - ts} y={y0 - t} width={ts} height={d + t} className="eq-fe-cvd eq-fe-fadein" />
              <rect x={tx} y={y0 + d - tb} width={tw} height={tb} className="eq-fe-cvd eq-fe-rise" />
              {poorCover && (
                <>
                  <ellipse cx={tx + 2} cy={y0 - t / 2} rx={t * 0.7} ry={t * 0.6} className="eq-fe-cvd" />
                  <ellipse cx={tx + tw - 2} cy={y0 - t / 2} rx={t * 0.7} ry={t * 0.6} className="eq-fe-cvd" />
                  <rect x={tx - 6} y={y0 - t - 4} width={tw + 12} height={d + t + 8} rx="4" className="eq-bad-ring" />
                </>
              )}
            </>
          ) : (
            <rect x="24" y={y0 - t} width="352" height={t} className="eq-fe-cvd eq-fe-rise" />
          )}
          {particles && [60, 120, 290, 340].map((x) => <circle key={x} cx={x} cy={y0 - t / 2} r="3" className="eq-dirt" />)}
          {dirty && [80, 200, 320].map((x) => <circle key={x} cx={x} cy={y0 - t / 2 + 2} r="2.4" className="eq-fe-contam" />)}
          {(thin || thick || uneven) && <rect x="22" y={y0 - t - 14} width="356" height={t + 18} rx="4" className="eq-bad-ring" />}
          <text x="200" y={Math.max(56, y0 - t - 18)} textAnchor="middle" className="eq-dim strong">
            {values.method === 1 ? 'PECVD' : 'LPCVD'} 막
            {thin ? ' · 목표보다 얇음' : thick ? ' · 목표보다 두꺼움' : uneven ? ' · 두께 불균일' : poorCover ? ' · 홈 안쪽이 덜 덮임' : particles ? ' · 파티클' : ''}
          </text>
        </g>
      )}
      <text x="200" y="210" textAnchor="middle" className="eq-si-label">
        웨이퍼
      </text>
    </svg>
  )
}
