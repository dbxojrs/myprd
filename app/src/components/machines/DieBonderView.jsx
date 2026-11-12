import { has, Label, stageTools } from './parts.jsx'

// 다이 본더 그림: 왼쪽은 테이프에서 다이를 떼는 곳, 오른쪽은 리드프레임에 붙이는 곳과 경화 오븐입니다.
// 가동 중에는 단계(stage)마다 장면이 바뀝니다(단계 설명 글은 data/machines/dieAttach.js의 sequence.scene):
//   load 리드프레임이 들어옴 → dispense 바늘이 접착제를 찍음 → eject 핀이 다이를 밀어 올림 → pick 콜릿이 내려와 집어 올림
//   → place 다이를 내려 누르면 접착제가 퍼짐 → inspect 카메라가 위치·필렛 검사 → cure 오븐에서 굳힘
const ORDER = ['load', 'dispense', 'eject', 'pick', 'place', 'inspect', 'cure']

export default function DieBonderView({ values, running, findings, stage = null }) {
  const s = stageTools(stage, ORDER)
  const dieH = values.die === 1 ? 3 : 7
  const pinUp = [1, 4, 9][values.pin]
  const glueW = [18, 30, 46][values.amount]
  const fillet = [1, 3, 7][values.amount]
  const press = ['0.5px', '1.5px', '3px'][values.force]
  const oven = ['ms-heater-low', 'ms-heater-high', 'ms-heater-mid', 'ms-heater-high'][values.cure]
  const cracked = has(findings, ['깨짐'])
  const voided = has(findings, ['보이드', '빈 공간'])
  const spilled = has(findings, ['넘침'])
  const dieTop = 100 - dieH

  // 단계별 상태
  const frameIn = !s.at('start')
  const glueOn = s.idle || s.at('dispense') || s.done('dispense')
  const lift = s.idle || s.done('eject') ? pinUp : s.at('eject') ? pinUp : 0
  const leftDie = s.idle || !s.done('pick') // 집어 간 뒤에는 왼쪽 가운데 다이가 비어 있음
  const placed = s.idle || s.at('place') || s.done('place')
  const pressing = s.idle ? running : s.at('place')
  const ovenHot = s.idle || s.at('cure')
  const showMarks = s.idle || s.done('place')
  const showPinMark = s.idle || s.done('eject')
  const colletLeft = !s.at('place')

  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="다이 본더 그림">
      {/* 왼쪽: 다이싱 테이프 위 다이와 이젝터 핀 */}
      <rect x="6" y="100" width="92" height="4" className="il-tape" />
      {[10, 58].map((x) => (
        <rect key={x} x={x} y={dieTop} width="30" height={dieH} className="il-die" />
      ))}
      {leftDie && (
        <g className={s.at('eject') ? 'ms-st-db-lift' : s.at('pick') ? 'ms-st-db-pick' : undefined} style={{ '--lift': `${-pinUp}px` }}>
          <rect
            x="40"
            y={dieTop - (s.at('eject') || s.at('pick') ? 0 : lift)}
            width="16"
            height={dieH}
            className={cracked && values.pin === 2 && showPinMark ? 'il-die ms-db-hot' : 'il-die'}
          />
        </g>
      )}
      <g className={s.at('eject') ? 'ms-st-db-lift' : undefined} style={{ '--lift': `${-pinUp}px` }}>
        <rect x="46" y={104 - (s.at('eject') ? 0 : lift)} width="4" height={pinUp + 12} className="ms-db-pin" />
      </g>
      <Label x={48} y={128}>이젝터 핀</Label>
      <Label x={52} y={116}>다이싱 테이프</Label>
      {/* 콜릿: 내려와 다이를 빨아들였다 올라갑니다 */}
      {colletLeft && (
        <g className={s.idle ? (running ? 'ms-bond run' : 'ms-bond') : s.at('pick') ? 'ms-st-db-pickcol' : 'ms-st-db-park'} style={{ '--dur': '1.6s' }}>
          <rect x="41" y={dieTop - pinUp - 34} width="14" height="30" className={values.collet === 1 ? 'il-tool ms-worn' : 'il-tool'} />
          <rect x="44" y={dieTop - pinUp - 6} width="8" height="4" className="il-frame" />
          {values.collet === 0 && (s.idle || s.at('pick')) && <path d={`M48 ${dieTop - pinUp - 8} v-18`} className="ms-db-vacuum ms-flow run" />}
        </g>
      )}
      {colletLeft && <Label x={20} y={dieTop - pinUp - 20}>콜릿</Label>}
      {values.collet === 1 && <Label x={78} y={dieTop - pinUp - 30}>진공 샘</Label>}

      {/* 오른쪽: 리드프레임 패드 위 접착제와 다이 */}
      <g className={s.at('load') ? 'ms-st-db-slide' : undefined} style={frameIn ? undefined : { opacity: 0.25 }}>
        <rect x="116" y="100" width="118" height="6" className="il-frame" />
        {glueOn &&
          (values.adhesive === 0 ? (
            <g className={s.at('dispense') ? 'ms-st-db-grow' : undefined}>
              <rect x={175 - glueW / 2} y="96" width={glueW} height="4" className={spilled && showMarks ? 'il-glue ms-db-spill' : 'il-glue'} />
              {placed && (
                <g className={s.at('place') ? 'ms-st-db-spread' : undefined}>
                  <polygon points={`155,96 155,${96 - fillet} ${155 - fillet - 2},96`} className="il-glue" />
                  <polygon points={`195,96 195,${96 - fillet} ${195 + fillet + 2},96`} className="il-glue" />
                </g>
              )}
            </g>
          ) : (
            <rect x="155" y="96" width="40" height="3" className={`il-daf${s.at('dispense') ? ' ms-st-db-grow' : ''}`} />
          ))}
      </g>
      <Label x={175} y={118}>리드프레임 다이 패드</Label>
      {/* 바늘: 접착제를 찍어 바름 */}
      {s.at('dispense') && values.adhesive === 0 && (
        <g className="ms-st-db-needle">
          <path d="M175 60 L175 88" className="il-line" />
          <path d="M171 54 h8 v6 h-8 Z" className="il-tool" />
        </g>
      )}
      {s.at('dispense') && <Label x={206} y={64}>{['접착제 부족', '접착제 권장량', '접착제 과다'][values.amount]}</Label>}
      {voided && showMarks && [164, 182].map((x) => <circle key={x} cx={x} cy="97.6" r="1.6" className="il-void" />)}
      {placed && (
        <g className={s.at('place') ? 'ms-st-db-place' : undefined}>
          <g className={pressing ? 'ms-shake run' : 'ms-shake'} style={{ '--amp': press }}>
            <rect x="155" y={96 - dieH} width="40" height={dieH} className="il-die" />
          </g>
          {/* 내려 누를 때 콜릿이 다이를 잡고 있음 */}
          {s.at('place') && <rect x="168" y={96 - dieH - 30} width="14" height="30" className={values.collet === 1 ? 'il-tool ms-worn' : 'il-tool'} />}
        </g>
      )}
      {cracked && showMarks && <path d={`M168 ${96 - dieH} l3 ${dieH / 2} l-2 ${dieH / 4} l3 ${dieH / 4}`} className="ms-defect-line" />}
      {(s.idle || s.at('place')) && (
        <>
          <path d={`M175 ${70 - values.force * 6} v${10 + values.force * 6}`} className="ms-db-force" transform={s.at('place') ? 'translate(28 -6)' : undefined} />
          <polygon points="171,80 179,80 175,85" className="ms-db-force-head" transform={s.at('place') ? 'translate(28 -6)' : undefined} />
          <Label x={s.at('place') ? 214 : 206} y={74}>하중</Label>
        </>
      )}
      <Label x={130} y={90}>{values.adhesive === 0 ? '에폭시' : 'DAF'}</Label>
      {/* 검사 카메라 */}
      {s.at('inspect') && (
        <g>
          <rect x="167" y="56" width="16" height="10" rx="2" className="il-tool" />
          <path d="M175 66 L150 94 M175 66 L200 94" className="ms-st-db-scan" />
          <Label x={210} y={62}>위치·필렛 검사</Label>
        </g>
      )}

      {/* 경화 오븐 */}
      <rect x="150" y="14" width="80" height="30" rx="3" className={ovenHot ? `${oven}${s.at('cure') ? ' ms-ox-warm' : ''}` : 'ms-heater-low'} />
      {s.at('cure') && [158, 222].map((x) => <path key={x} d={`M${x} 42 q3 -4 0 -8 q-3 -4 0 -8`} className="zs-cure-heat ms-st-db-rise" />)}
      <Label x={190} y={32}>{s.at('cure') ? `경화 중 · ${['덜 경화', '빠른 경화', '권장', '과경화'][values.cure]}` : '경화 오븐'}</Label>
    </svg>
  )
}
