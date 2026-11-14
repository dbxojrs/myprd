import { has, Label, stageTools } from './parts.jsx'

// 몰딩 프레스 그림: 위·아래 금형 사이 캐비티 3개, 왼쪽 포트의 플런저가 수지를 밀어 넣습니다.
// 대기 중에는 캐비티가 수지로 차오르는 모습을 되풀이하고, 런너 균형이 나쁘면 캐비티마다 차는 때가 다릅니다.
// 가동 중에는 단계(stage)마다 장면이 바뀝니다(단계 설명 글은 data/machines/molding.js의 sequence.scene):
//   load 위 금형이 내려와 닫힘 → preheat 금형이 달아오름 → melt 포트의 EMC 태블릿이 녹음
//   → transfer 플런저가 눌러 수지가 캐비티를 왼쪽부터 채움(속도·런너 균형대로) → cure 수지가 굳음
//   → open 위 금형이 올라가고 스트립을 꺼냄 → postcure 오븐에서 후경화
const ORDER = ['load', 'preheat', 'melt', 'transfer', 'cure', 'open', 'postcure']
const CAVITIES = [64, 124, 184]

export default function MoldView({ values, running, findings, stage = null }) {
  const s = stageTools(stage, ORDER)
  const fillDur = ['5s', '3s', '2s', '1.2s'][values.ram]
  const delays = [[0, 0.8, 1.6], [0, 0.3, 0.6], [0, 0, 0]][values.runner]
  // 가동 중 한 단계(--step) 안에서 채우는 시간과 캐비티별 늦음(비율)
  const pushK = [0.9, 0.65, 0.42, 0.25][values.ram]
  const lagK = [[0, 0.18, 0.36], [0, 0.07, 0.14], [0, 0, 0]][values.runner]
  const heaterClass = ['ms-heater-low', 'ms-heater-mid', 'ms-heater-high'][values.temp]
  const loop = values.wire === 1 ? 26 : 16
  const swept = has(findings, ['쓸림'])
  const voided = has(findings, ['보이드', '미충전'])
  const flash = has(findings, ['플래시'])
  const stuck = has(findings, ['안 빠짐'])

  // 단계별 상태
  const heater = s.idle || (s.done('load') && !s.at('postcure')) ? heaterClass : 'ms-heater-low'
  const topPos = s.at('load') ? 'closing' : s.at('open') && !stuck ? 'opening' : s.idle || (s.done('load') && s.before('open')) || (s.at('open') && stuck) ? 'shut' : 'up'
  const stripLift = s.at('open') && !stuck ? 'lifting' : s.done('open') ? 'lifted' : ''
  const tabletShown = s.idle || s.at('melt')
  const pushing = s.at('transfer')
  const filled = s.idle ? 'loop' : pushing ? 'filling' : s.done('transfer') ? 'full' : 'empty'
  const curing = s.at('cure')
  const cured = s.done('cure')
  const afterFill = s.idle || s.done('transfer')
  const oven = s.at('postcure')

  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="몰딩 프레스 그림">
      {/* 아래 금형 (후경화 때는 스트립만 오븐으로 옮겨 가므로 금형을 그리지 않음) */}
      {!oven && <rect x="34" y="96" width="200" height="30" className={`${heater}${s.at('preheat') ? ' ms-st-mp-warm' : ''}`} />}
      {!oven && <Label x={134} y={116}>아래 금형</Label>}

      {/* 캐비티와 스트립: 꺼낼 때는 스트립이 위로 들림 */}
      <g className={`ms-st-mp-strip ${stripLift}`}>
        {CAVITIES.map((cx, i) => (
          <g key={cx}>
            <rect x={cx - 26} y="46" width="52" height="50" className="ms-mp-cavity" />
            <rect
              x={cx - 26}
              y="46"
              width="52"
              height="50"
              className={`il-mold-flow ms-mp-fill${filled === 'loop' && running ? ' run' : ''}${filled === 'filling' ? ' ms-st-mp-filling' : ''}${filled === 'full' ? ' ms-st-mp-full' : ''}${curing ? ' ms-st-mp-curing' : ''}${cured ? ' ms-st-mp-cured' : ''}`}
              style={
                filled === 'loop'
                  ? { '--dur': fillDur, animationDelay: `${delays[i]}s` }
                  : { '--push': pushK, animationDelay: filled === 'filling' ? `calc(var(--step) * ${lagK[i]})` : undefined }
              }
            />
            <rect x={cx - 26} y="90" width="52" height="6" className="il-frame" />
            <rect x={cx - 9} y="83" width="18" height="7" className="il-die" />
            {[-1, 1].map((side) => {
              const d = `M${cx + side * 7} 83 Q${cx + side * 16} ${83 - loop} ${cx + side * 23} 90`
              const bent = `M${cx + side * 7} 83 Q${cx + side * 16 + 9} ${83 - loop + 4} ${cx + side * 23} 90`
              const show = swept && afterFill
              return <path key={side} d={show ? bent : d} className={show ? 'ms-defect-line' : 'il-wire'} />
            })}
            {voided && afterFill && <circle cx={cx + 14} cy="58" r="3" className="il-void" />}
            {curing && <path d={`M${cx - 6} 70 q3 -4 0 -8 q-3 -4 0 -8 M${cx + 6} 70 q3 -4 0 -8 q-3 -4 0 -8`} className="zs-cure-heat ms-st-mp-heat" />}
          </g>
        ))}
        {flash && afterFill && <rect x="34" y="45" width="200" height="1.5" className="ms-mp-flash" />}
      </g>

      {/* 위 금형: 닫히고 열림 */}
      {!oven && (
        <g className={`ms-st-mp-top ${topPos}${stuck && s.at('open') ? ' ms-shake run' : ''}`} style={{ '--amp': '1px' }}>
          <rect x="34" y="16" width="200" height="30" className={`${heater}${s.at('preheat') ? ' ms-st-mp-warm' : ''}`} />
          <Label x={134} y={34}>위 금형</Label>
          {values.mold === 1 && [60, 110, 170, 210].map((x) => <circle key={x} cx={x} cy="47.5" r="1.4" className="ms-dirt" />)}
        </g>
      )}

      {/* 포트·플런저·런너 */}
      <rect x="4" y="50" width="22" height="46" className="il-tool" />
      {tabletShown && (
        <rect x="8" y="78" width="14" height="14" className={`${values.emc === 2 ? 'il-mold ms-mp-old' : 'il-mold'}${s.at('melt') ? ' ms-st-mp-melt' : ''}`} />
      )}
      {s.at('melt') && <rect x="7" y="86" width="16" height="6" className="il-mold-flow ms-st-mp-pool" />}
      {values.emc === 1 && tabletShown && [10, 15, 20].map((x) => <circle key={x} cx={x} cy="75" r="1.1" className="il-water" />)}
      <g
        className={pushing ? 'ms-st-mp-push' : s.done('transfer') && !s.idle ? 'ms-st-mp-pushed' : running && s.idle ? 'ms-bond run' : 'ms-bond'}
        style={{ '--dur': fillDur, '--push': pushK }}
      >
        <rect x="9" y="56" width="12" height="20" className="il-frame" />
      </g>
      <line x1="26" y1="88" x2="38" y2="88" className={`${values.runner === 0 ? 'ms-mp-runner ms-mp-uneven' : 'ms-mp-runner'}${pushing ? ' ms-st-mp-runflow' : ''}`} />
      <Label x={15} y={44}>플런저</Label>
      <Label x={15} y={106}>EMC</Label>

      {flash && afterFill && <Label x={210} y={56}>플래시</Label>}
      {stuck && (s.idle || s.at('open')) && <Label x={134} y={10}>⚠ 패키지가 금형에 붙음</Label>}
      {s.at('preheat') && <Label x={134} y={10}>금형 가열 · {['낮음', '적정', '높음'][values.temp]}</Label>}
      {s.at('melt') && <Label x={34} y={74} anchor="start">태블릿이 녹는 중</Label>}
      {pushing && <Label x={134} y={10}>수지 밀어 넣는 중 · 속도 {['느림', '적정', '빠름', '매우 빠름'][values.ram]}</Label>}
      {curing && <Label x={134} y={10}>금형 안에서 굳는 중</Label>}
      {oven && (
        <g>
          <rect x="30" y="20" width="208" height="84" rx="6" className="ms-st-mp-oven" />
          <Label x={134} y={16}>오븐 · 후경화</Label>
        </g>
      )}
      <Label x={134} y={136}>캐비티 3개 · 런너 {values.runner === 2 ? '균형' : '불균형'}</Label>
    </svg>
  )
}
