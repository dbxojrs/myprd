import { has, Label } from './parts.jsx'

// 와이어 본더 그림
export default function BonderView({ values, running, findings }) {
  const cycle = ['0.9s', '1.5s', '2.6s'][values.time]
  const shake = ['0.5px', '1.5px', '3px'][values.power]
  const ballRx = [3, 5, 7.5][values.force]
  const ballRy = [3.5, 3, 2.4][values.force]
  const heater = ['ms-heater-low', 'ms-heater-mid', 'ms-heater-high'][values.temp]
  const crater = has(findings, ['크레이터링', '깨짐'])
  const noStick = has(findings, ['붙지 않음'])
  const padY = values.pad === 2 ? 83 : 82
  const padH = values.pad === 2 ? 1.5 : 3
  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="와이어 본더 그림">
      <rect x="20" y="100" width="200" height="16" rx="2" className={heater} />
      <Label x={120} y={130}>히터 블록 (본딩 온도)</Label>
      {values.temp === 2 &&
        [60, 120, 180].map((x) => <path key={x} d={`M${x} 98 q3 -4 0 -8 q-3 -4 0 -8`} className="zs-cure-heat" />)}
      <rect x="30" y="94" width="180" height="6" className="il-frame" />
      <rect x="70" y="85" width="60" height="9" className="il-die" />
      <rect x="92" y={padY} width="16" height={padH} className="zs-pad" />
      {values.pad === 1 &&
        [95, 100, 105].map((x) => <circle key={x} cx={x} cy={padY} r="1.2" className="ms-dirt" />)}
      {crater && <path d="M96 86 l3 4 l2 -3 l3 5" className="ms-defect-line" />}
      <rect x="160" y="88" width="30" height="6" className="il-frame" />
      <Label x={196} y={86}>리드</Label>
      <Label x={80} y={81}>패드 →</Label>
      {/* 와이어 루프 */}
      {!noStick && <path d="M100 82 C 104 50, 160 50, 172 88" className={values.wire === 1 ? 'ms-wire-cu' : 'il-wire'} />}
      {/* 캐필러리: 내려와 누르고 떨렸다가 올라갑니다 */}
      <g className={running ? 'ms-bond run' : 'ms-bond'} style={{ '--dur': cycle }}>
        <g className={running ? 'ms-shake run' : 'ms-shake'} style={{ '--amp': shake }}>
          <path d="M94 20 L106 20 L103 70 L97 70 Z" className={values.tool === 1 ? 'il-tool ms-worn' : 'il-tool'} />
          <line x1="100" y1="10" x2="100" y2="74" className={values.wire === 1 ? 'ms-wire-cu' : 'il-wire'} />
          <ellipse cx="100" cy={74 + ballRy} rx={ballRx} ry={ballRy} className={values.wire === 1 ? 'ms-ball-cu' : 'il-ball'} />
        </g>
      </g>
      <Label x={130} y={30}>캐필러리</Label>
      {values.tool === 1 && <Label x={130} y={40}>끝이 닳고 더러움</Label>}
      {values.pad === 1 && <Label x={60} y={70}>패드 오염</Label>}
      {values.pad === 2 && <Label x={60} y={70}>얇은 패드 금속층</Label>}
      <Label x={40} y={20}>{values.wire === 1 ? '구리(Cu) 와이어' : '금(Au) 와이어'}</Label>
    </svg>
  )
}
