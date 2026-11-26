import { has, Label, stageTools } from './parts.jsx'

// 매엽식 습식 세정 장비 그림(직접 그린 교육용 그림, 실제 장비 모양 아님). 오른쪽 위는 웨이퍼 표면 확대입니다.
// 가동 단계(data/machines/cleaning.js의 sequence): load → chem → rinse → dry → inspect
const ORDER = ['load', 'chem', 'rinse', 'dry', 'inspect']
const CHEM = ['SC-1', 'SC-1 → SC-2', 'SC-1 → SC-2 → HF']

export default function CleanView({ values, running, findings, stage = null }) {
  const s = stageTools(stage, ORDER)
  const spraying = s.at('chem') || s.at('rinse') || (s.idle && running)
  const drying = s.at('dry')
  const tall = values.pattern === 1
  const collapse = has(findings, ['붕괴', '손상'])
  const left = has(findings, ['남음', '덜 떨어짐', '잔류'])
  const showResult = s.idle || s.done('dry')

  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="매엽식 세정 장비 그림">
      {/* 챔버와 회전 척 위의 웨이퍼 */}
      <rect x="20" y="34" width="140" height="96" rx="6" className="il-tool" />
      <rect x="40" y="100" width="100" height="6" className="il-wafer" />
      <rect x="84" y="106" width="12" height="16" className="il-tool" />
      <path d="M50 116 a40 6 0 0 0 80 0" className={spraying || drying ? 'ms-cmp-spinline run' : 'ms-cmp-spinline'} />
      <Label x={90} y={30}>매엽식 챔버 (한 장씩)</Label>

      {/* 노즐과 약품·초순수 */}
      <rect x="86" y="40" width="8" height="16" rx="2" className="il-tool" />
      {spraying && [0, 1, 2].map((i) => <circle key={i} cx="90" cy="60" r="2" className={`${s.at('rinse') ? 'ms-cl-water' : 'il-md-slurry'} ms-cmp-drop`} style={{ animationDelay: `${i * 0.25}s` }} />)}
      {spraying && <Label x={130} y={52} anchor="start">{s.at('rinse') ? '초순수' : CHEM[values.chem]}</Label>}
      {s.at('chem') && values.mega === 1 && <Label x={30} y={92} anchor="start">메가소닉 ~</Label>}
      {drying && <Label x={30} y={92} anchor="start">{values.dry === 1 ? 'IPA 건조' : '고속 스핀 건조'}</Label>}

      {/* 표면 확대 */}
      {showResult && (
        <g>
          <rect x="170" y="34" width="64" height="60" rx="3" className="il-tool" />
          <rect x="174" y="78" width="56" height="12" className="il-wafer" />
          {(tall ? [180, 192, 204, 216] : [182, 206]).map((x, i) => {
            const fallen = collapse && tall && i === 2
            return (
              <rect
                key={x}
                x={x}
                y={tall ? 48 : 70}
                width={tall ? 5 : 16}
                height={tall ? 30 : 8}
                className="il-oxide"
                transform={fallen ? `rotate(-22 ${x + 2.5} 78)` : undefined}
              />
            )
          })}
          {left && [186, 200, 222].map((x) => <circle key={x} cx={x} cy="75" r="1.8" className="ms-dirt" />)}
          <Label x={202} y={44}>표면 확대</Label>
        </g>
      )}
    </svg>
  )
}
