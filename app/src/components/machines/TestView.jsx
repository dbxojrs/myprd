import { has, Label } from './parts.jsx'

// 테스트 핸들러 + 테스터 그림. 핸들러가 패키지를 소켓에 눌러 넣고, 테스터가 신호를 보내 검사한 뒤 분류합니다.
export default function TestView({ values, running, findings }) {
  const cycle = ['1.2s', '1.8s', '2.8s'][values.items]
  const press = [2, 0, -3][values.force]
  const chamber = ['ms-heater-low', 'ms-heater-mid', 'ms-heater-high'][values.temp]
  const lead = has(findings, ['단자', '휜'])
  const escape = has(findings, ['출하될', '유출'])
  const loss = has(findings, ['수율', '재검사'])
  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="테스트 핸들러와 테스터 그림">
      {/* 온도 챔버와 소켓 */}
      <rect x="20" y="58" width="120" height="58" rx="4" className={chamber} />
      <Label x={80} y={128}>{['상온 검사', '상온·고온 검사', '상온·고온·저온 검사'][values.temp]}</Label>
      {values.temp >= 1 && [32, 128].map((x) => <path key={x} d={`M${x} 110 q3 -4 0 -8 q-3 -4 0 -8`} className="zs-cure-heat" />)}
      {values.temp === 2 && <Label x={128} y={70}>❄</Label>}
      <rect x="50" y="88" width="60" height="18" rx="2" className="il-tool" />
      <Label x={80} y={114}>소켓</Label>
      {[60, 70, 80, 90, 100].map((x) => (
        <g key={x}>
          <line x1={x} y1="79" x2={x} y2="88" className={values.socket === 1 ? 'ms-tt-pin dirty' : 'ms-tt-pin'} />
          {values.socket === 1 && <circle cx={x} cy="79.5" r="1.2" className="ms-dirt" />}
        </g>
      ))}
      {/* 핸들러 팔: 내려와 누르고 올라갑니다 */}
      <g className={running ? 'ms-bond run' : 'ms-bond'} style={{ '--dur': cycle }}>
        <rect x="70" y="10" width="20" height={56 + press} className="il-tool" />
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
      <Label x={102} y={18} anchor="start">핸들러 · 누르는 힘 {['약함', '적정', '강함'][values.force]}</Label>
      {values.lot === 1 && <Label x={30} y={50}>단자 휜 패키지 섞임</Label>}
      {lead && <circle cx="80" cy="78" r="12" className="il-warn-ring" />}
      {/* 테스터와 신호 */}
      <rect x="160" y="16" width="64" height="34" rx="3" className="il-tool" />
      <Label x={192} y={30}>테스터</Label>
      <Label x={192} y={42}>{['일부 항목', '전체 항목', '전체+반복'][values.items]}</Label>
      <path d="M160 40 H130 V97 H110" className={running ? 'ms-tt-signal ms-flow run' : 'ms-tt-signal'} />
      {/* 분류 통 */}
      <rect x="160" y="88" width="30" height="22" rx="2" className={escape ? 'ms-tt-bin warn' : 'ms-tt-bin'} />
      <rect x="196" y="88" width="30" height="22" rx="2" className={loss ? 'ms-tt-bin warn' : 'ms-tt-bin'} />
      <Label x={175} y={102}>양품</Label>
      <Label x={211} y={102}>불량</Label>
      <Label x={193} y={122}>판정 기준 {['느슨함', '규격대로', '빡빡함'][values.limit]}</Label>
    </svg>
  )
}
