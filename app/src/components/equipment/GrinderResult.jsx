import { has } from '../machines/parts.jsx'

// 백그라인더 결과물: 지금 조건으로 간 웨이퍼를 확대해 보여줍니다.
// 왼쪽: 단면(아래가 BG 테이프를 붙인 회로면, 위가 갈린 뒷면). 처음 두께에서 목표 두께까지 얇아지는 모습,
//       남은 손상층·거친 면·연삭 화상은 뒷면에, 크랙은 몸통에 표시합니다.
// 오른쪽: 가장자리 확대. 엣지 트리밍 없이 얇게 갈면 칼날처럼 날카로워집니다(DISCO thin grinding).
// 두께는 그림용 상대값이며 글자는 조작반의 예시 숫자입니다.

const THICK = [150, 104, 76, 44] // 목표 두께별 그림 두께(px). 두께가 상자 절반쯤 차도록 확대합니다.
const LABEL = ['300 µm', '150 µm', '100 µm', '50 µm'] // 조작반 예시 숫자
const START = 176

export default function GrinderResult({ values, result }) {
  const findings = result?.findings ?? []
  const stopped = result?.grade === 'alarm'
  const h = stopped ? START : THICK[values.target]
  const damage = has(findings, ['손상층', '손상 증가']) || values.relief === 0
  const rough = has(findings, ['거침'])
  const burned = has(findings, ['화상'])
  const cracked = has(findings, ['깨짐'])
  const chipped = has(findings, ['칩핑'])
  const sharp = values.edge === 0 && values.target >= 2
  const base = 214 // 회로면(아래) 위치
  const top = base - h

  return (
    <svg viewBox="0 0 400 240" className="eq-result" role="img" aria-label="백그라인딩 결과물 확대 그림">
      <text x="135" y="18" textAnchor="middle" className="eq-result-title">
        단면 확대 (위: 갈린 뒷면 · 아래: 회로면)
      </text>
      <rect x="20" y="26" width="230" height="208" rx="6" className="eq-zoombox" />
      {/* BG 테이프와 회로층 */}
      <rect x="24" y={base} width="222" height="8" className="eq-ba-bgtape" />
      <text x="135" y={base + 7} textAnchor="middle" className="eq-dim">
        BG 테이프
      </text>
      {/* 실리콘: 처음 두께에서 목표까지 얇아짐 */}
      <rect
        x="24"
        y={top}
        width="222"
        height={h}
        className={`eq-si${stopped ? '' : ' eq-ba-thin grow'}`}
        style={{ '--from': START / h }}
        key={`${h}-${values.feed}`}
      />
      <rect x="24" y={base - 5} width="222" height="5" className="eq-ba-circuit" />
      {stopped ? (
        <text x="135" y={top + h / 2} textAnchor="middle" className="eq-result-alarm">
          알람으로 멈춰 갈지 못했습니다
        </text>
      ) : (
        <>
          {damage && <rect x="24" y={top} width="222" height="6" className="eq-ba-damage" />}
          {rough && <polyline points={Array.from({ length: 23 }, (_, i) => `${24 + i * 10},${top + (i % 2 ? 3 : 0)}`).join(' ')} className="eq-ba-rough" />}
          {burned && [60, 120, 190].map((x) => <ellipse key={x} cx={x} cy={top + 3} rx="14" ry="3" className="eq-ba-burn" />)}
          {cracked && <polyline points={`150,${top} 158,${top + h * 0.35} 148,${top + h * 0.6} 160,${base - 5}`} className="eq-ba-crack" />}
          <line x1="252" y1={top} x2="252" y2={base} className="eq-ba-dimline" />
          <text x="135" y={top + h / 2 + 4} textAnchor="middle" className="eq-si-label">
            실리콘 {LABEL[values.target]} (예시)
          </text>
          <text x="135" y={top - 6} textAnchor="middle" className="eq-dim strong">
            {damage ? '손상층이 남은 뒷면' : '손상층을 걷어 낸 뒷면'}
            {rough ? ' · 거침' : ''}
            {burned ? ' · 화상' : ''}
          </text>
        </>
      )}

      {/* 가장자리 확대 */}
      <text x="335" y="18" textAnchor="middle" className="eq-result-title">
        가장자리 확대
      </text>
      <rect x="275" y="26" width="118" height="208" rx="6" className="eq-zoombox" />
      {(() => {
        const ey = 140
        const t = Math.max(14, h * 0.7)
        const y0 = ey - t / 2
        const y1 = ey + t / 2
        const shape = stopped ? 'round' : values.edge === 1 ? 'trim' : sharp ? 'sharp' : 'round'
        const d = {
          round: `M390 ${y0} H322 Q296 ${y0} 296 ${ey} Q296 ${y1} 322 ${y1} H390 Z`,
          sharp: `M390 ${y0} H300 L284 ${y1 - 2} L300 ${y1} H390 Z`,
          trim: `M390 ${y0} H312 V${y1 - t * 0.45} H300 Q292 ${y1} 304 ${y1} H390 Z`,
        }[shape]
        return (
          <g>
            <path d={d} className="eq-si" />
            {chipped && [0, 1, 2].map((i) => <polygon key={i} points={`${300 + i * 9},${y1} ${305 + i * 9},${y1 - 6} ${310 + i * 9},${y1}`} className="eq-ba-chip" />)}
            {cracked && <polyline points={`330,${y0} 336,${ey} 328,${y1}`} className="eq-ba-crack" />}
            <text x="334" y={y1 + 22} textAnchor="middle" className={`eq-dim strong${shape === 'sharp' ? ' bad' : ''}`}>
              {{ round: '둥근 가장자리', sharp: '칼날처럼 날카로움', trim: '엣지 트리밍됨' }[shape]}
            </text>
            {(chipped || cracked) && (
              <text x="334" y={y1 + 36} textAnchor="middle" className="eq-dim bad">
                {cracked ? '크랙' : '엣지 칩핑'}
              </text>
            )}
          </g>
        )
      })()}
    </svg>
  )
}
