// 고급 장비 시뮬레이터의 장비 그림. 조작반의 조건에 따라 모양과 움직임 속도가 바뀝니다.
// running이면 CSS 애니메이션으로 움직이고, 결과가 나오면 문제가 생긴 부위를 빨간색으로 표시합니다.

const has = (findings, words) => findings.some((f) => words.some((w) => f.title.includes(w)))

function SawView({ values, running, findings }) {
  const spin = ['1.2s', '0.7s', '0.5s', '0.25s'][values.spindle]
  const table = ['7s', '4.5s', '2.8s', '1.6s'][values.feed]
  const waferH = values.wafer === 1 ? 4 : 10
  const bladeR = values.blade === 2 ? 26 : 32
  const cutBottom = [104 - waferH + 2, 106, 110][values.depth]
  const chipped = has(findings, ['칩핑', '깨짐'])
  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="다이싱 장비 그림">
      <rect x="0" y="120" width="240" height="20" className="il-tool" />
      <Label x={30} y={133}>진공 척</Label>
      <g className={running ? 'ms-table run' : 'ms-table'} style={{ '--dur': table }}>
        <rect x="20" y="106" width="200" height="6" className="il-tape" />
        <rect x="30" y={106 - waferH} width="180" height={waferH} className="il-wafer" />
        {[60, 90, 150, 180].map((x) => (
          <line key={x} x1={x} y1={106 - waferH} x2={x} y2="107" className="zs-cut" />
        ))}
        {chipped &&
          [60, 90, 150, 180].map((x) => (
            <path key={x} d={`M${x - 3} ${106 - waferH} l1.5 2 l1.5 -1.5 l1.5 2.5 l1.5 -3`} className="ms-defect-line" />
          ))}
      </g>
      {/* 스핀들과 블레이드 */}
      <rect x="150" y="18" width="70" height="22" rx="3" className="il-tool" />
      <Label x={185} y={14}>스핀들</Label>
      <g transform={`translate(120 ${cutBottom - bladeR})`}>
        <g className={running ? 'ms-spin run' : 'ms-spin'} style={{ '--dur': spin }}>
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
      {/* 냉각수 */}
      <rect x="168" y="70" width="22" height="7" rx="2" className="il-tool" />
      <Label x={206} y={76}>냉각수</Label>
      {values.coolant > 0 &&
        Array.from({ length: values.coolant === 2 ? 3 : 1 }, (_, i) => (
          <line key={i} x1={170 + i * 3} y1={77} x2={142 + i * 3} y2={100} className={running ? 'il-water ms-flow run' : 'il-water ms-flow'} />
        ))}
      {running &&
        [0, 1, 2].map((i) => <circle key={i} cx="138" cy="100" r="1.1" className="il-dust ms-dust" style={{ animationDelay: `${i * 0.25}s` }} />)}
      {values.blade === 0 && <Label x={60} y={40}>새 날 (드레싱 전)</Label>}
      {values.blade === 2 && <Label x={60} y={40}>날이 닳아 지름이 줄었음</Label>}
      <Label x={60} y={52}>{values.wafer === 1 ? '얇은 웨이퍼' : '보통 두께 웨이퍼'}</Label>
    </svg>
  )
}

function BonderView({ values, running, findings }) {
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

const Label = ({ x, y, children }) => (
  <text x={x} y={y} textAnchor="middle" className="zs-note">
    {children}
  </text>
)

const VIEWS = { 'wafer-saw': SawView, 'wire-bond': BonderView }

export default function MachineView({ machine, values, running, findings }) {
  const View = VIEWS[machine.id]
  return View ? <View values={values} running={running} findings={findings} /> : null
}

// 경광등: 초록(가동·정상), 노랑(경고·대기), 빨강(알람·불량)
export function TowerLamp({ status }) {
  const lit = {
    idle: ['', 'on', ''],
    running: ['', '', 'on'],
    alarm: ['blink', '', ''],
    bad: ['on', '', ''],
    warn: ['', 'on', ''],
    good: ['', '', 'on'],
  }[status]
  return (
    <span className="ms-lamp" aria-hidden="true">
      <span className={`ms-lamp-red ${lit[0]}`} />
      <span className={`ms-lamp-yellow ${lit[1]}`} />
      <span className={`ms-lamp-green ${lit[2]}`} />
    </span>
  )
}
