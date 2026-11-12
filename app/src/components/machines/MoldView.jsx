import { has, Label } from './parts.jsx'

// 몰딩 프레스 그림: 위·아래 금형 사이 캐비티 3개, 왼쪽 포트의 플런저가 수지를 밀어 넣습니다.
// 가동 중에는 캐비티가 수지로 차오르고, 런너 균형이 나쁘면 캐비티마다 차는 때가 다릅니다.
const CAVITIES = [64, 124, 184]

export default function MoldView({ values, running, findings }) {
  const fillDur = ['5s', '3s', '2s', '1.2s'][values.ram]
  const delays = [[0, 0.8, 1.6], [0, 0.3, 0.6], [0, 0, 0]][values.runner]
  const heater = ['ms-heater-low', 'ms-heater-mid', 'ms-heater-high'][values.temp]
  const loop = values.wire === 1 ? 26 : 16
  const swept = has(findings, ['쓸림'])
  const voided = has(findings, ['보이드', '미충전'])
  const flash = has(findings, ['플래시'])
  const stuck = has(findings, ['안 빠짐'])
  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="몰딩 프레스 그림">
      <rect x="34" y="16" width="200" height="30" className={heater} />
      <rect x="34" y="96" width="200" height="30" className={heater} />
      <Label x={134} y={34}>위 금형</Label>
      <Label x={134} y={116}>아래 금형</Label>
      {values.mold === 1 && [60, 110, 170, 210].map((x) => <circle key={x} cx={x} cy="47.5" r="1.4" className="ms-dirt" />)}

      {/* 캐비티와 스트립 */}
      {CAVITIES.map((cx, i) => (
        <g key={cx}>
          <rect x={cx - 26} y="46" width="52" height="50" className="ms-mp-cavity" />
          <rect x={cx - 26} y="46" width="52" height="50" className={running ? 'il-mold-flow ms-mp-fill run' : 'il-mold-flow ms-mp-fill'} style={{ '--dur': fillDur, animationDelay: `${delays[i]}s` }} />
          <rect x={cx - 26} y="90" width="52" height="6" className="il-frame" />
          <rect x={cx - 9} y="83" width="18" height="7" className="il-die" />
          {[-1, 1].map((side) => {
            const d = `M${cx + side * 7} 83 Q${cx + side * 16} ${83 - loop} ${cx + side * 23} 90`
            const bent = `M${cx + side * 7} 83 Q${cx + side * 16 + 9} ${83 - loop + 4} ${cx + side * 23} 90`
            return <path key={side} d={swept ? bent : d} className={swept ? 'ms-defect-line' : 'il-wire'} />
          })}
          {voided && <circle cx={cx + 14} cy="58" r="3" className="il-void" />}
        </g>
      ))}

      {/* 포트·플런저·런너 */}
      <rect x="4" y="50" width="22" height="46" className="il-tool" />
      <rect x="8" y="78" width="14" height="14" className={values.emc === 2 ? 'il-mold ms-mp-old' : 'il-mold'} />
      {values.emc === 1 && [10, 15, 20].map((x) => <circle key={x} cx={x} cy="75" r="1.1" className="il-water" />)}
      <g className={running ? 'ms-bond run' : 'ms-bond'} style={{ '--dur': fillDur }}>
        <rect x="9" y="56" width="12" height="20" className="il-frame" />
      </g>
      <line x1="26" y1="88" x2="38" y2="88" className={values.runner === 0 ? 'ms-mp-runner ms-mp-uneven' : 'ms-mp-runner'} />
      <Label x={15} y={44}>플런저</Label>
      <Label x={15} y={106}>EMC</Label>

      {flash && <rect x="34" y="45" width="200" height="1.5" className="ms-mp-flash" />}
      {flash && <Label x={210} y={56}>플래시</Label>}
      {stuck && <Label x={134} y={10}>⚠ 패키지가 금형에 붙음</Label>}
      <Label x={134} y={136}>캐비티 3개 · 런너 {values.runner === 2 ? '균형' : '불균형'}</Label>
    </svg>
  )
}
