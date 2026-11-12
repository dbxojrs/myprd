import { has, Label, stageTools } from './parts.jsx'

// 다이싱 장비 그림: 옆에서 본 척·웨이퍼·블레이드, 왼쪽 위 작은 그림은 위에서 본 웨이퍼(절단 방향)입니다.
// 가동 중에는 단계(stage)마다 장면이 바뀝니다(단계 설명 글은 data/machines/waferSaw.js의 sequence.scene):
//   load 웨이퍼를 척에 올리고 진공으로 고정 → spin 블레이드가 올라간 채 회전 시작 → align 카메라가 스크라이브 라인을 찾음
//   → cut1 블레이드가 내려와 한 줄씩 자름 → rotate 웨이퍼 90° 회전 → cut2 나머지 방향 절단 → clean 물로 씻고 말림
const ORDER = ['load', 'spin', 'align', 'cut1', 'rotate', 'cut2', 'clean']
const LINES = [60, 90, 150, 180]
const TOP_LINES = [-9, -3, 3, 9]

export default function SawView({ values, running, findings, stage = null }) {
  const s = stageTools(stage, ORDER)
  const spin = ['1.2s', '0.7s', '0.5s', '0.25s'][values.spindle]
  const table = ['7s', '4.5s', '2.8s', '1.6s'][values.feed]
  const waferH = values.wafer === 1 ? 4 : 10
  const bladeR = values.blade === 2 ? 26 : 32
  const cutBottom = [104 - waferH + 2, 106, 110][values.depth]
  const chipped = has(findings, ['칩핑', '깨짐'])

  // 단계별 상태
  const cutting = s.at('cut1') || s.at('cut2')
  const bladeSpin = s.idle ? running : !s.at('start') && !s.at('load') && !s.done('clean')
  const bladeUp = !s.idle && !cutting
  const tableMove = s.idle ? running : cutting
  const coolOn = s.idle ? running : cutting
  const waferOn = !s.at('start')
  // 옆에서 본 절단 자국: 1방향 절단 중에는 한 줄씩 나타납니다.
  const cutsShown = s.idle || s.done('cut1') || s.at('cut1')
  const marks = chipped && (s.idle || s.done('cut1'))
  const topCut1 = s.idle || s.at('cut1') || s.done('cut1')
  const topCut2 = s.idle || s.at('cut2') || s.done('cut2')
  const turned = s.idle || s.at('rotate') || s.done('rotate')

  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="다이싱 장비 그림">
      <rect x="0" y="120" width="240" height="20" className="il-tool" />
      <Label x={30} y={133}>진공 척</Label>
      {s.at('load') && [50, 90, 130, 170, 210].map((x) => <line key={x} x1={x} y1="124" x2={x} y2="113" className="ms-st-sw-vac" />)}
      <g className={tableMove ? 'ms-table run' : 'ms-table'} style={{ '--dur': table }}>
        <rect x="20" y="106" width="200" height="6" className="il-tape" />
        {waferOn && (
          <g className={s.at('load') ? 'ms-st-sw-drop' : undefined}>
            <rect x="30" y={106 - waferH} width="180" height={waferH} className="il-wafer" />
            {cutsShown &&
              LINES.map((x, i) => (
                <line
                  key={x}
                  x1={x}
                  y1={106 - waferH}
                  x2={x}
                  y2="107"
                  className={s.at('cut1') ? 'zs-cut ms-st-sw-appear' : 'zs-cut'}
                  style={s.at('cut1') ? { animationDelay: `calc(var(--step) * ${i * 0.2 + 0.1})` } : undefined}
                />
              ))}
            {/* 정렬: 카메라가 찾은 스크라이브 라인 표시 */}
            {s.at('align') && LINES.map((x) => <line key={x} x1={x} y1={100 - waferH} x2={x} y2={110} className="zs-street-hi" />)}
          </g>
        )}
        {marks &&
          LINES.map((x) => (
            <path key={x} d={`M${x - 3} ${106 - waferH} l1.5 2 l1.5 -1.5 l1.5 2.5 l1.5 -3`} className="ms-defect-line" />
          ))}
      </g>
      {/* 정렬 카메라: 웨이퍼 위를 지나가며 라인을 찾습니다 */}
      {s.at('align') && (
        <g className="ms-st-sw-cam">
          <rect x="44" y="60" width="16" height="12" rx="2" className="il-tool" />
          <path d={`M52 72 L52 ${100 - waferH}`} className="ms-st-sw-beam" />
          <circle cx="52" cy={102 - waferH} r="4" className="zs-crosshair" />
          <Label x={52} y={57}>카메라</Label>
        </g>
      )}
      {/* 스핀들과 블레이드: 자를 때만 내려옵니다 */}
      <rect x="150" y="18" width="70" height="22" rx="3" className="il-tool" />
      <Label x={185} y={14}>
        {s.at('spin') ? `스핀들 회전 시작 · ${['낮음', '보통', '높음', '한계 초과'][values.spindle]}` : '스핀들'}
      </Label>
      <g className={`ms-st-sw-arm${bladeUp ? ' up' : ''}`}>
        <g transform={`translate(120 ${cutBottom - bladeR})`}>
          <g className={bladeSpin ? `ms-spin run${s.at('spin') ? ' ms-st-sw-spinup' : ''}` : 'ms-spin'} style={{ '--dur': spin }}>
            <circle r={bladeR} className={values.blade === 2 ? 'zs-blade-disc ms-worn' : 'zs-blade-disc'} />
            {Array.from({ length: 24 }, (_, i) => {
              const a = (i / 24) * Math.PI * 2
              return <circle key={i} cx={(bladeR - 1.5) * Math.cos(a)} cy={(bladeR - 1.5) * Math.sin(a)} r={values.grit === 1 ? 0.6 : 1.1} className="il-diamond" />
            })}
            <circle r={bladeR - 8} className="il-frame" />
            <line x1="0" y1="0" x2={bladeR - 9} y2="0" className="zs-spoke" />
            <line x1="0" y1="0" x2={-(bladeR - 9)} y2="0" className="zs-spoke" />
          </g>
          <circle r="4" className="il-hole" />
        </g>
        <line x1="150" y1="29" x2="124" y2={cutBottom - bladeR} className="il-line" />
      </g>
      {/* 냉각수 */}
      <rect x="168" y="70" width="22" height="7" rx="2" className="il-tool" />
      <Label x={206} y={76}>냉각수</Label>
      {values.coolant > 0 &&
        (s.idle || cutting) &&
        Array.from({ length: values.coolant === 2 ? 3 : 1 }, (_, i) => (
          <line key={i} x1={170 + i * 3} y1={77} x2={142 + i * 3} y2={100} className={coolOn ? 'il-water ms-flow run' : 'il-water ms-flow'} />
        ))}
      {/* 세정: 위에서 물을 뿌려 가루를 씻어 냄 */}
      {s.at('clean') && [40, 62, 172, 200].map((x, i) => <line key={x} x1={x} y1="84" x2={x - 4} y2={100 - waferH} className="il-water ms-flow run" style={{ animationDelay: `${i * -0.1}s` }} />)}
      {s.at('clean') && <Label x={50} y={78}>세정·건조</Label>}
      {/* 이송이 빠를수록 가루가 많이 튀고, 냉각수가 적을수록 절단부가 달아오릅니다. */}
      {tableMove &&
        Array.from({ length: [2, 3, 5, 8][values.feed] }, (_, i) => (
          <circle key={i} cx="138" cy="100" r={values.feed >= 2 ? 1.4 : 1.1} className="il-dust ms-dust" style={{ animationDelay: `${i * 0.12}s` }} />
        ))}
      {(s.idle || cutting) && <circle cx="122" cy={cutBottom - 6} r="9" className="ms-heat-glow" style={{ opacity: [0.75, 0.35, 0][values.coolant] }} />}
      {values.coolant === 0 && (s.idle || cutting) && <Label x={122} y={cutBottom - 18}>과열</Label>}

      {/* 위에서 본 웨이퍼: 자른 방향과 90° 회전 */}
      <g transform="translate(26 28)">
        <g className={s.at('rotate') ? 'ms-st-sw-turn' : undefined} style={turned && !s.at('rotate') ? { transform: 'rotate(90deg)' } : undefined}>
          <circle r="17" className={waferOn ? 'il-wafer' : 'il-tape'} />
          {topCut1 &&
            TOP_LINES.map((y, i) => (
              <line
                key={y}
                x1="-15"
                y1={y}
                x2="15"
                y2={y}
                className={s.at('cut1') ? 'zs-cut ms-st-sw-appear' : 'zs-cut'}
                style={s.at('cut1') ? { animationDelay: `calc(var(--step) * ${i * 0.2 + 0.1})` } : undefined}
              />
            ))}
        </g>
        {topCut2 &&
          TOP_LINES.map((y, i) => (
            <line
              key={y}
              x1="-15"
              y1={y}
              x2="15"
              y2={y}
              className={s.at('cut2') ? 'zs-cut ms-st-sw-appear' : 'zs-cut'}
              style={s.at('cut2') ? { animationDelay: `calc(var(--step) * ${i * 0.2 + 0.1})` } : undefined}
            />
          ))}
      </g>
      <Label x={26} y={54}>{s.at('rotate') ? '90° 회전' : '위에서 본 웨이퍼'}</Label>
      {values.blade === 0 && <Label x={208} y={52}>새 날 (드레싱 전)</Label>}
      {values.blade === 2 && <Label x={208} y={52}>날이 닳아 지름이 줄었음</Label>}
      <Label x={208} y={62}>{values.wafer === 1 ? '얇은 웨이퍼' : '보통 두께 웨이퍼'}</Label>
    </svg>
  )
}
