import { has } from '../machines/parts.jsx'

// 다이싱 소 결과물: 지금 조건으로 자른 웨이퍼를 확대해 보여줍니다.
// 왼쪽: 위에서 본 칩 네 개의 모서리. 블레이드가 지나간 커프(절단 폭)와 앞면 칩핑을 표시합니다(커프 체크 화면).
// 오른쪽: 단면. 절단 깊이(테이프 위에서 멈춤 / 테이프까지 / 테이프 깊이)와 뒷면 칩핑을 표시합니다.
// 크기는 그림용 상대값입니다.

export default function SawResult({ values, result }) {
  const findings = result?.findings ?? []
  const stopped = result?.grade === 'alarm'
  const uncut = has(findings, ['미절단'])
  const bigChip = has(findings, ['칩핑이 큼', '깨짐'])
  const chip = bigChip || has(findings, ['칩핑 증가'])
  const backChip = has(findings, ['뒷면'])
  const overcut = has(findings, ['과절단'])
  const kerf = 26 // 커프 폭(그림용, 칩 모서리를 크게 확대)
  const chipSize = bigChip ? 10 : chip ? 6 : 0
  // 단면 치수
  const thick = values.wafer === 1 ? 40 : 96
  const tapeTop = 180
  const waferTop = tapeTop - thick
  const cutBottom = [tapeTop - 10, tapeTop + 6, tapeTop + 18][values.depth]

  // 칩핑 톱니 (커프 가장자리를 따라)
  const chips = (x0, y0, horizontal, n) =>
    Array.from({ length: n }, (_, i) => {
      const p = 30 + i * 37 + (i % 2) * 9
      return horizontal
        ? `${x0 + p},${y0} ${x0 + p + chipSize},${y0 + (i % 2 ? chipSize : -chipSize)} ${x0 + p + chipSize * 2},${y0}`
        : `${x0},${y0 + p} ${x0 + (i % 2 ? chipSize : -chipSize)},${y0 + p + chipSize} ${x0},${y0 + p + chipSize * 2}`
    })

  return (
    <svg viewBox="0 0 400 240" className="eq-result" role="img" aria-label="다이싱 결과물 확대 그림">
      <text x="128" y="18" textAnchor="middle" className="eq-result-title">
        위에서 본 칩 모서리 (커프 체크)
      </text>
      <rect x="20" y="26" width="216" height="208" rx="6" className="eq-zoombox" />
      {/* 칩 네 개 */}
      {[
        [24, 30],
        [128 + kerf / 2, 30],
        [24, 130 + kerf / 2],
        [128 + kerf / 2, 130 + kerf / 2],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={104 - kerf / 2} height={100 - kerf / 2} className="eq-ba-chiptop" />
      ))}
      {!stopped && (
        <>
          <rect x="24" y={130 - kerf / 2} width="208" height={kerf} className="eq-ba-kerf grow grow-x" />
          <rect x={128 - kerf / 2} y="30" width={kerf} height="200" className="eq-ba-kerf grow grow-y" />
          {chipSize > 0 && (
            <g className="eq-ba-chips">
              {chips(24, 130 - kerf / 2, true, 5).map((p) => <polygon key={`a${p}`} points={p} className="eq-ba-chip" />)}
              {chips(128 - kerf / 2, 30, false, 5).map((p) => <polygon key={`b${p}`} points={p} className="eq-ba-chip" />)}
            </g>
          )}
          {uncut && <rect x="24" y={130 - kerf / 2} width="208" height={kerf} className="eq-ba-bridge" />}
        </>
      )}
      <text x="128" y="226" textAnchor="middle" className={`eq-dim strong${chip || uncut ? ' bad' : ''}`}>
        {stopped ? '알람으로 멈춰 자르지 못했습니다' : uncut ? '미절단 · 칩이 다 나뉘지 않음' : chip ? `커프 가장자리 칩핑${bigChip ? ' 큼' : ''}` : '커프가 깨끗함'}
      </text>

      {/* 단면 */}
      <text x="318" y="18" textAnchor="middle" className="eq-result-title">
        단면 (절단 깊이)
      </text>
      <rect x="246" y="26" width="146" height="208" rx="6" className="eq-zoombox" />
      <rect x="250" y={tapeTop} width="138" height="16" className="eq-ba-tape-sec" />
      <text x="319" y={tapeTop + 30} textAnchor="middle" className="eq-dim">
        다이싱 테이프
      </text>
      <rect x="250" y={waferTop} width="138" height={thick} className="eq-si" />
      <text x="319" y={waferTop - 6} textAnchor="middle" className="eq-dim">
        {values.wafer === 1 ? '얇은 웨이퍼' : '보통 두께 웨이퍼'}
      </text>
      {!stopped && (
        <>
          <rect x={319 - kerf / 2} y={waferTop - 1} width={kerf} height={cutBottom - waferTop + 1} className="eq-ba-groove grow" />
          {backChip && (
            <>
              <polygon points={`${319 - kerf / 2},${tapeTop} ${319 - kerf / 2 - 9},${tapeTop} ${319 - kerf / 2},${tapeTop - 8}`} className="eq-ba-chip" />
              <polygon points={`${319 + kerf / 2},${tapeTop} ${319 + kerf / 2 + 9},${tapeTop} ${319 + kerf / 2},${tapeTop - 8}`} className="eq-ba-chip" />
            </>
          )}
          <text x="319" y="222" textAnchor="middle" className={`eq-dim strong${uncut || overcut || backChip ? ' bad' : ''}`}>
            {uncut ? '바닥이 남음' : overcut ? '테이프 과절단' : backChip ? '뒷면 칩핑' : ['테이프 위에서 멈춤', '테이프까지 살짝', '테이프 깊이'][values.depth]}
          </text>
        </>
      )}
    </svg>
  )
}
