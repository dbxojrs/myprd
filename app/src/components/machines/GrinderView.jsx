import { has, Label, stageTools } from './parts.jsx'

// 백그라인더 그림: 왼쪽은 위에서 본 척·연삭 휠, 오른쪽은 웨이퍼 단면입니다.
// 가동 중에는 단계(stage)마다 장면이 바뀝니다(단계 설명 글은 data/machines/backgrind.js의 sequence.scene):
//   load 웨이퍼가 척에 놓임 → coarse 거친 휠이 내려와 빠르게 갈아 냄 → fine 고운 휠로 목표 두께까지
//   → measure 두께 측정 → relief 손상층을 걷어 냄 → clean 물로 씻고 돌려 말림 → transfer 다이싱 테이프·링 프레임으로 옮김
const ORDER = ['load', 'coarse', 'fine', 'measure', 'relief', 'clean', 'transfer']
const START_H = 16 // 처음 두께(그림용)

export default function GrinderView({ values, running, findings, stage = null }) {
  const s = stageTools(stage, ORDER)
  const chuckDur = ['1.6s', '2.4s', '3.4s'][values.feed]
  const wheelDur = values.wheel === 1 ? '1.4s' : '0.5s'
  const h = [14, 9, 6, 3][values.target]
  const fineOn = values.finish > 0
  // 거친 연마가 끝났을 때의 두께: 고운 연마를 하면 그 몫을 남겨 둡니다.
  const coarseH = fineOn ? Math.round(h + (START_H - h) * 0.35) : h
  const broken = has(findings, ['깨짐'])
  const chipped = has(findings, ['칩핑'])
  const burned = has(findings, ['화상'])
  const sharp = values.edge === 0 && values.target >= 2

  // 단계별 상태
  const grinding = s.at('coarse') || (s.at('fine') && fineOn)
  const chuckSpin = s.idle ? running : grinding || s.at('relief') || s.at('clean')
  const wheelSpin = s.idle ? running : grinding
  const wheelUp = !s.idle && !grinding
  const fineWheel = s.at('fine') && fineOn
  const waterOn = s.idle ? running : grinding || s.at('clean')
  const waferOn = !s.at('start')
  // 지금 단면 두께와, 이 단계에서 줄어드는 양(애니메이션 시작점)
  const curH = s.idle || s.done('fine') ? h : s.done('coarse') || s.at('fine') ? (s.at('fine') ? h : coarseH) : s.at('coarse') ? coarseH : START_H
  const fromH = s.at('coarse') ? START_H : s.at('fine') ? coarseH : curH
  const top = 104 - curH
  // 거친 연마 이송: 끝까지 빠르게면 금방, 마무리에서 감속이면 천천히 끝납니다.
  const grindDur = s.at('coarse') ? ['0.45', '0.7', '0.95'][values.feed] : '0.95'
  const thinning = (s.at('coarse') || (s.at('fine') && fineOn)) && fromH !== curH
  const ground = s.idle || s.done('coarse') // 갈린 뒤에 생기는 것들(날카로운 가장자리, 손상층)
  const damage = ground && (values.relief === 0 || s.before('relief')) && !s.at('relief')
  const showMarks = s.idle || s.done('fine')
  const transferred = s.at('transfer') || s.at('done')
  const segClass = fineWheel ? 'ms-bg-segment ms-st-bg-fine' : values.wheel === 1 ? 'ms-bg-segment ms-bg-loaded' : 'ms-bg-segment'

  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="백그라인더 그림">
      {/* 위에서 본 척과 웨이퍼: 척이 천천히 돕니다 */}
      <g transform="translate(62 70)">
        {transferred && <circle r="55" className={`ms-st-bg-ring${s.at('transfer') ? ' ms-st-bg-drop' : ''}`} />}
        <g className={chuckSpin ? 'ms-spin run' : 'ms-spin'} style={{ '--dur': s.at('clean') ? '0.4s' : chuckDur }}>
          <circle r="48" className="il-tool" />
          {waferOn && (
            <g className={s.at('load') ? 'ms-st-bg-drop' : undefined}>
              <circle r="42" className={burned && ground ? 'il-wafer ms-bg-burn' : 'il-wafer'} />
              <line x1="0" y1="-42" x2="0" y2="-34" className="zs-spoke" />
            </g>
          )}
        </g>
      </g>
      {/* 연삭 휠: 아랫면 가장자리의 날(세그먼트)이 웨이퍼 절반을 지나갑니다. 연삭이 아닐 때는 들어 올려 흐리게 */}
      <g className={wheelUp ? 'ms-st-bg-lift up' : 'ms-st-bg-lift'}>
        <g transform="translate(86 52)">
          <g className={wheelSpin ? 'ms-spin run' : 'ms-spin'} style={{ '--dur': fineWheel ? '0.9s' : wheelDur }}>
            <circle r="31" className="ms-bg-wheel" />
            {Array.from({ length: 18 }, (_, i) => {
              const a = (i / 18) * Math.PI * 2
              return (
                <rect
                  key={i}
                  x={27 * Math.cos(a) - 3}
                  y={27 * Math.sin(a) - 2}
                  width="6"
                  height="4"
                  transform={`rotate(${(a * 180) / Math.PI} ${27 * Math.cos(a)} ${27 * Math.sin(a)})`}
                  className={segClass}
                />
              )
            })}
            <circle r="16" className="il-frame" />
          </g>
          <circle r="4" className="il-hole" />
        </g>
      </g>
      {/* 연삭수 */}
      <rect x="6" y="14" width="18" height="6" rx="2" className="il-tool" />
      {Array.from({ length: s.at('clean') ? 3 : values.water === 2 ? 3 : values.water }, (_, i) => (
        <line key={i} x1={12 + i * 3} y1="20" x2={46 + i * 3} y2="46" className={waterOn ? 'il-water ms-flow run' : 'il-water ms-flow'} />
      ))}
      <Label x={15} y={10}>{s.at('clean') ? '세정수' : '연삭수'}</Label>
      <Label x={62} y={132}>{transferred ? '링 프레임에 붙인 웨이퍼' : '척(웨이퍼) · 위에서 본 모습'}</Label>
      <Label x={110} y={18}>
        {s.at('coarse') ? '거친 휠 연삭 중' : fineWheel ? (values.finish === 2 ? '레진 본드 휠 연삭 중' : '고운 휠 연삭 중') : s.at('fine') ? '고운 연마 없음' : '연삭 휠'}
      </Label>

      {/* 오른쪽: 웨이퍼 단면 */}
      <Label x={184} y={14}>단면</Label>
      <line x1="134" y1="88" x2="232" y2="88" className="zs-original" />
      <Label x={232} y={85} anchor="end">처음 두께</Label>
      <rect x="140" y="104" width="86" height="6" className={`il-tape${s.at('transfer') ? ' ms-st-bg-peel' : ''}`} style={transferred && !s.at('transfer') ? { opacity: 0 } : undefined} />
      {values.tape === 1 &&
        !transferred &&
        [152, 176, 204].map((x) => <ellipse key={x} cx={x} cy="107" rx="4" ry="2" className="il-void" />)}
      {waferOn && (
        <g className={s.at('load') ? 'ms-st-bg-drop' : undefined}>
          <rect
            x="140"
            y={top}
            width="80"
            height={curH}
            className={`il-wafer${thinning ? ' ms-st-bg-thin' : ''}`}
            style={thinning ? { '--from': fromH / curH, '--grind': grindDur } : undefined}
          />
          {ground && sharp ? (
            <polygon points={`220,${top} 230,${top + curH} 220,${top + curH}`} className="il-wafer" />
          ) : values.edge === 1 ? (
            <rect x="220" y={top + curH / 2} width="4" height={curH / 2} className="il-wafer" />
          ) : (
            <path d={`M220 ${top} q6 ${curH / 2} 0 ${curH}`} className="il-wafer" />
          )}
        </g>
      )}
      {(damage || s.at('relief')) && (
        <line
          x1="140"
          y1={top + 0.6}
          x2="220"
          y2={top + 0.6}
          className={`ms-bg-damage${s.at('relief') && values.relief > 0 ? ' ms-st-bg-fade' : ''}`}
        />
      )}
      {/* 손상층 제거: 패드가 표면을 오가며 걷어 냄 */}
      {s.at('relief') && values.relief > 0 && <rect x="146" y={top - 7} width="24" height="6" rx="2" className="il-tool ms-st-bg-polish" />}
      {/* 거친·고운 휠 날: 연삭 중에는 표면을 따라 내려갑니다 */}
      {(s.idle || grinding) && (
        <g
          className={thinning ? 'ms-st-bg-follow' : undefined}
          style={thinning ? { '--drop': `${curH - fromH}px`, '--grind': grindDur } : undefined}
        >
          <g className={running && (s.idle || grinding) ? 'ms-shake run' : 'ms-shake'} style={{ '--amp': fineWheel ? '1px' : '2px' }}>
            <rect x="150" y={top - 12} width="46" height="10" className={segClass} />
          </g>
        </g>
      )}
      {(s.idle || grinding) && <Label x={173} y={top - 15}>휠 날</Label>}
      {/* 두께 측정 */}
      {s.at('measure') && (
        <g>
          <line x1="180" y1="30" x2="180" y2={top - 1} className="ms-st-bg-probe" />
          <line x1="230" y1={top} x2="230" y2="104" className="ms-st-bg-probe" />
          <Label x={184} y={72} anchor="start">두께 측정 중</Label>
        </g>
      )}
      {s.at('relief') && <Label x={184} y={72} anchor="start">{values.relief === 0 ? '손상층 제거 생략' : '손상층 걷어 내는 중'}</Label>}
      {s.at('clean') && [158, 178, 198].map((x, i) => <line key={x} x1={x} y1="62" x2={x} y2={top - 2} className="il-water ms-flow run" style={{ animationDelay: `${i * -0.1}s` }} />)}
      {transferred && <rect x="138" y={top - 4} width="90" height="4" className={`il-tape${s.at('transfer') ? ' ms-st-bg-drop' : ''}`} />}
      <Label x={184} y={122}>{transferred ? '보호 테이프를 떼고 다이싱 테이프에 붙임' : '보호 테이프 (앞면 회로)'}</Label>
      {damage && !s.at('measure') && <Label x={184} y={top + curH + 10 > 102 ? 97 : top + curH + 10}>손상층 남음</Label>}
      {sharp && ground && !s.at('measure') && (
        <>
          <line x1="228" y1={top + 1} x2="226" y2="64" className="zs-pointer" />
          <Label x={232} y={60} anchor="end">날카로운 가장자리</Label>
        </>
      )}
      {broken && showMarks && <path d={`M160 ${top} l4 ${curH / 2} l-3 ${curH / 4} l4 ${curH / 4}`} className="ms-defect-line" />}
      {chipped && showMarks && <path d={`M214 ${top} l2 2 l2 -1.5 l2 2.5`} className="ms-defect-line" />}
    </svg>
  )
}
