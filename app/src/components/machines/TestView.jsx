import { has, Label, stageTools } from './parts.jsx'

// 테스트 핸들러 + 테스터 그림. 핸들러가 패키지를 소켓에 눌러 넣고, 테스터가 신호를 보내 검사한 뒤 분류합니다.
// 가동 중에는 단계(stage)마다 장면이 바뀝니다(단계 설명 글은 data/machines/test.js의 sequence.scene):
//   pick 핸들러가 내려와 패키지를 집음 → insert 소켓까지 내려가 누름(힘 조건대로) → contact 핀 접촉 확인
//   → test 테스터 신호가 오감 → temp 챔버가 데워지거나 식음 → sort 패키지가 양품·불량 통으로 감 → pack 릴 테이프에 담김
const ORDER = ['pick', 'insert', 'contact', 'test', 'temp', 'sort', 'pack']

export default function TestView({ values, running, findings, stage = null }) {
  const s = stageTools(stage, ORDER)
  const cycle = ['1.2s', '1.8s', '2.8s'][values.items]
  const press = [2, 0, -3][values.force]
  const chamberClass = ['ms-heater-low', 'ms-heater-mid', 'ms-heater-high'][values.temp]
  const lead = has(findings, ['단자', '휜'])
  const escape = has(findings, ['출하될', '유출'])
  const loss = has(findings, ['수율', '재검사'])
  const contactFail = has(findings, ['접촉'])
  const anyBad = findings.some((f) => f.severity === 'bad' || f.severity === 'alarm')

  // 단계별 상태
  const arm = s.idle
    ? running
      ? 'ms-bond run'
      : 'ms-bond'
    : s.at('pick')
      ? 'ms-st-tt-arm picking'
      : s.at('insert')
        ? 'ms-st-tt-arm pressing'
        : s.at('sort')
          ? 'ms-st-tt-arm lifting'
          : s.done('insert') && s.before('sort')
            ? 'ms-st-tt-arm down'
            : 'ms-st-tt-arm up'
  const holding = s.idle || (!s.at('start') && s.before('sort')) || s.at('pick')
  const pickReveal = s.at('pick')
  const chamber = s.idle || s.done('test') ? chamberClass : 'ms-heater-low'
  const signalOn = s.idle ? running : s.at('test') || s.at('temp')
  const sorting = s.at('sort')
  const sorted = s.idle || s.done('sort')
  const toBad = anyBad && !escape
  const contacting = s.at('contact')

  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="테스트 핸들러와 테스터 그림">
      {/* 온도 챔버와 소켓 */}
      <rect x="20" y="58" width="120" height="58" rx="4" className={`${chamber}${s.at('temp') && values.temp > 0 ? ' ms-st-tt-warm' : ''}`} />
      <Label x={80} y={128}>{['상온 검사', '상온·고온 검사', '상온·고온·저온 검사'][values.temp]}</Label>
      {values.temp >= 1 && (s.idle || s.at('temp')) && [32, 128].map((x) => <path key={x} d={`M${x} 110 q3 -4 0 -8 q-3 -4 0 -8`} className={`zs-cure-heat${s.at('temp') ? ' ms-st-tt-rise' : ''}`} />)}
      {values.temp === 2 && (s.idle || s.at('temp')) && <Label x={128} y={70}>❄</Label>}
      {s.at('temp') && <Label x={193} y={70}>{values.temp === 0 ? '상온만 검사 · 온도 그대로' : '챔버 온도를 바꿔 다시 검사'}</Label>}
      <rect x="50" y="88" width="60" height="18" rx="2" className="il-tool" />
      <Label x={80} y={114}>소켓</Label>
      {[60, 70, 80, 90, 100].map((x) => (
        <g key={x}>
          <line
            x1={x}
            y1="79"
            x2={x}
            y2="88"
            className={`${values.socket === 1 ? 'ms-tt-pin dirty' : 'ms-tt-pin'}${contacting ? (contactFail ? ' ms-st-tt-fail' : ' ms-st-tt-ok') : ''}`}
          />
          {values.socket === 1 && <circle cx={x} cy="79.5" r="1.2" className="ms-dirt" />}
        </g>
      ))}
      {contacting && <Label x={193} y={70}>{contactFail ? '접촉 불량 · 핀 확인' : '접촉 확인 · 모든 핀 연결'}</Label>}

      {/* 핸들러 팔: 단계에 따라 내려가 집고, 눌러 넣고, 들어 올림 */}
      <g className={arm} style={{ '--dur': cycle }}>
        <rect x="70" y="10" width="20" height={56 + press} className="il-tool" />
        {holding && (
          <g className={pickReveal ? 'ms-st-tt-grab' : undefined}>
            <rect x="62" y={66 + press} width="36" height="10" rx="1" className="il-mold" />
            {[64, 74, 84, 94].map((x, i) => (
              <rect
                key={x}
                x={x}
                y={76 + press}
                width="2"
                height={values.lot === 1 && i === 2 ? 2 : 3}
                transform={values.lot === 1 && i === 2 ? `rotate(35 ${x} ${76 + press})` : undefined}
                className="ms-ps-copper"
              />
            ))}
          </g>
        )}
      </g>
      <Label x={102} y={18} anchor="start">핸들러 · 누르는 힘 {['약함', '적정', '강함'][values.force]}</Label>
      {values.lot === 1 && <Label x={30} y={50}>단자 휜 패키지 섞임</Label>}
      {lead && (s.idle || s.done('insert')) && <circle cx="80" cy="78" r="12" className="il-warn-ring" />}

      {/* 테스터와 신호 */}
      <rect x="160" y="16" width="64" height="34" rx="3" className="il-tool" />
      <Label x={192} y={30}>테스터</Label>
      <Label x={192} y={42}>{['일부 항목', '전체 항목', '전체+반복'][values.items]}</Label>
      <path d="M160 40 H130 V97 H110" className={signalOn ? 'ms-tt-signal ms-flow run' : 'ms-tt-signal'} style={signalOn && !s.idle ? { animationDuration: `calc(${cycle} / 4)` } : undefined} />
      {(s.at('test') || s.at('temp')) &&
        [0, 1, 2, 3].map((i) => (
          <rect key={i} x={168 + i * 12} y="20" width="6" height="4" className="ms-st-tt-pulse" style={{ animationDuration: cycle, animationDelay: `calc(${cycle} * ${-i / 4})` }} />
        ))}

      {/* 분류 통 */}
      <rect x="160" y="88" width="30" height="22" rx="2" className={escape && sorted ? 'ms-tt-bin warn' : 'ms-tt-bin'} />
      <rect x="196" y="88" width="30" height="22" rx="2" className={loss && sorted ? 'ms-tt-bin warn' : 'ms-tt-bin'} />
      <Label x={175} y={102}>양품</Label>
      <Label x={211} y={102}>불량</Label>
      {/* 분류: 패키지가 소켓에서 통으로 옮겨짐 */}
      {(sorting || (sorted && !s.idle)) && (
        <rect
          x="72"
          y="70"
          width="16"
          height="6"
          rx="1"
          className={`il-mold${sorting ? ` ms-st-tt-sort ${toBad ? 'bad' : 'good'}` : ''}`}
          transform={sorting ? undefined : `translate(${toBad ? 131 : 95} 34)`}
          style={{ opacity: s.at('pack') ? 0 : 1 }}
        />
      )}
      {sorting && <Label x={193} y={84}>{toBad ? '불량 통으로' : '양품 통으로'}</Label>}
      <Label x={193} y={122}>{s.at('pack') ? '릴 테이프 포장' : `판정 기준 ${['느슨함', '규격대로', '빡빡함'][values.limit]}`}</Label>

      {/* 포장: 릴 테이프 칸에 담겨 흘러감 */}
      {s.at('pack') && (
        <g>
          <rect x="150" y="127" width="88" height="9" className="il-frame" />
          <line x1="152" y1="131.5" x2="236" y2="131.5" className="ms-st-tt-tape" />
        </g>
      )}
    </svg>
  )
}
