import { has, Label, stageTools } from './parts.jsx'

// CMP 장비 그림(직접 그린 교육용 그림, 실제 장비 모양·치수 아님). 왼쪽 위는 연마된 막의 단면 확대입니다.
// 가동 단계(data/machines/cmp.js의 sequence): load → polish → over → clean → measure
const ORDER = ['load', 'polish', 'over', 'clean', 'measure']

export default function CmpView({ values, running, findings, stage = null }) {
  const s = stageTools(stage, ORDER)
  const spin = ['2.4s', '1.3s', '0.7s'][values.speed]
  const press = ['ms-cmp-press low', 'ms-cmp-press', 'ms-cmp-press high'][values.pressure]
  const polishing = s.at('polish') || s.at('over') || (s.idle && running)
  const slurryOn = values.flow === 1
  const copper = values.film === 1
  const dishing = has(findings, ['디싱'])
  const erosion = has(findings, ['이로전'])
  const scratch = has(findings, ['스크래치'])
  const residue = has(findings, ['잔류', '잔막'])
  const showResult = s.idle || s.done('over')

  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="CMP 장비 그림">
      {/* 회전하는 패드(위에서 비스듬히 본 모습) */}
      <ellipse cx="140" cy="108" rx="88" ry="20" className="il-tool" />
      <ellipse cx="140" cy="106" rx="80" ry="16" className="ms-cmp-pad" />
      <ellipse
        cx="140"
        cy="106"
        rx="56"
        ry="10"
        className={polishing ? 'ms-cmp-groove run' : 'ms-cmp-groove'}
        style={{ '--dur': spin }}
      />
      <Label x={140} y={136}>패드 · {['느림', '적정', '빠름'][values.speed]}</Label>

      {/* 헤드와 웨이퍼 */}
      <g className={polishing ? `${press} run` : press}>
        <rect x="150" y="56" width="50" height="22" rx="4" className="il-tool" />
        <rect x="153" y="78" width="44" height="5" className="il-wafer" />
      </g>
      <Label x={175} y={50}>헤드 · 압력 {['낮음', '적정', '높음'][values.pressure]}</Label>

      {/* 슬러리 노즐과 방울 */}
      <rect x="92" y="60" width="8" height="18" rx="2" className="il-tool" />
      {slurryOn && polishing && [0, 1, 2].map((i) => <circle key={i} cx="96" cy="82" r="2" className="il-md-slurry ms-cmp-drop" style={{ animationDelay: `${i * 0.3}s` }} />)}
      <Label x={96} y={54}>{slurryOn ? '슬러리' : '슬러리 끊김'}</Label>
      {values.slurry === 1 && <circle cx="104" cy="70" r="3" className="ms-dirt" />}

      {/* 세정: 브러시 */}
      {s.at('clean') && (
        <g>
          <rect x="40" y="88" width="24" height="10" rx="5" className="il-tool ms-cmp-brush" />
          <Label x={52} y={84}>브러시 세정</Label>
        </g>
      )}

      {/* 단면 확대: 결과(대기 중 미리보기·연마 뒤) */}
      {showResult && (
        <g>
          <rect x="6" y="8" width="70" height="40" rx="3" className="il-tool" />
          <rect x="10" y="26" width="62" height="18" className="il-oxide" />
          {copper &&
            [14, 34, 54].map((x, i) => (
              <g key={x}>
                <rect x={x} y="26" width="12" height="12" className="il-cu" />
                {dishing && i === 1 && <path d={`M${x} 26 Q${x + 6} 31 ${x + 12} 26`} className="il-crack" />}
              </g>
            ))}
          {erosion && <path d="M30 26 Q41 30 52 26" className="il-crack" />}
          {scratch && <path d="M16 25 L34 27 M44 24 L60 26" className="il-crack" />}
          {residue && [20, 40, 62].map((x) => <circle key={x} cx={x} cy="23" r="1.6" className="ms-dirt" />)}
          <Label x={41} y={18}>{copper ? '구리 배선 단면' : '절연막 단면'}</Label>
        </g>
      )}
    </svg>
  )
}
