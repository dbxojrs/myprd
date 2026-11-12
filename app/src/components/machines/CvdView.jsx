import { has, Label, stageTools } from './parts.jsx'
import { HeatWaves, PressureGauge } from './frontStage.jsx'

// CVD 증착 장비 그림. 위 샤워헤드에서 원료 가스가 내려오고(PECVD는 플라즈마가 켜짐), 데워진 웨이퍼 위에 막이 쌓입니다.
// 압력이 높으면 깊은 홈 안쪽 막이 얇아지고, 다른 막이 쌓인 벽은 주황 점선으로 보입니다.
// 가동 중에는 단계(stage)마다 장면이 바뀝니다(단계 설명 글은 data/machines/deposition.js의 sequence.scene):
//   load 웨이퍼가 들어옴 → pump 압력계 바늘이 내려감 → heat 히터가 달아오름 → gas 샤워헤드에서 가스가 내려옴
//   → plasma (PECVD) 플라즈마가 켜짐 → deposit 막이 자람 → purge 가스가 꺼지고 식으며 웨이퍼가 나감
const ORDER = ['load', 'pump', 'heat', 'gas', 'plasma', 'deposit', 'purge']

export default function CvdView({ values, running, findings, stage = null }) {
  const s = stageTools(stage, ORDER)
  const pecvd = values.method === 1
  const gasLines = [0, 2, 3, 5][values.gas]
  const film = [2, 4, 7][values.time]
  const heaterClass = ['ms-heater-low', 'ms-heater-mid', 'ms-heater-high'][values.temp]
  const trench = values.pattern === 1
  const poorCoverage = values.pressure === 2
  const showResult = s.done('deposit')
  const bad = {
    uneven: showResult && has(findings, ['불균일']),
    coverage: showResult && has(findings, ['덜 덮임']),
    thin: showResult && has(findings, ['얇음', '미달']),
    particle: showResult && has(findings, ['입자', '파티클', '오염']),
  }
  const noIgnite = has(findings, ['점화 실패'])
  const top = 96 - film
  const filmClass = bad.thin || bad.uneven ? 'ms-cvd-film bad' : 'ms-cvd-film'
  // 홈 두 개: x 95~115, 135~155, 깊이 14
  const trenches = trench ? [95, 135] : []

  // 단계별 상태
  const inside = s.idle || (s.done('load') && s.before('purge'))
  const wafer = s.at('load') ? 'ms-st-fe-in' : s.at('purge') ? 'ms-st-fe-out' : inside ? '' : 'ms-st-fe-gone'
  const pumped = inside
  const hot = s.idle || (s.done('heat') && s.before('purge')) || s.at('heat')
  const heater = hot || s.at('purge') ? heaterClass : 'ms-heater-low'
  const heaterAnim = s.at('heat') ? ' ms-st-fe-warm' : s.at('purge') ? ' ms-st-fe-chill' : ''
  const gasOn = (s.idle && running) || s.at('gas') || s.at('plasma') || s.at('deposit')
  const plasmaOn = pecvd && values.rf > 0 && !noIgnite && (s.idle || s.at('plasma') || s.at('deposit'))
  const depositing = s.at('deposit')
  const filmOn = s.idle || depositing || s.done('deposit')

  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="CVD 증착 장비 그림">
      <rect x="30" y="14" width="180" height="106" rx="6" className={values.chamber === 1 ? 'ms-cvd-wall dirty' : 'ms-cvd-wall'} />
      <Label x={120} y={11}>{pecvd ? 'PECVD 챔버' : 'LPCVD 챔버 (고온벽)'}</Label>
      {!s.idle && (
        <PressureGauge
          x={18}
          y={40}
          level={pumped || s.at('pump') || s.at('purge') ? [0.1, 0.25, 0.95][values.pressure] : 1}
          pumping={s.at('pump')}
          venting={s.at('purge')}
        />
      )}
      {/* 샤워헤드와 가스 */}
      <rect x="60" y="22" width="120" height="8" rx="2" className="il-tool" />
      <Label x={196} y={28} anchor="start">가스</Label>
      {gasOn &&
        Array.from({ length: gasLines }, (_, i) => {
          const x = 70 + i * (100 / Math.max(gasLines - 1, 1))
          return <line key={i} x1={x} y1={31} x2={x} y2={56} className={running ? 'il-water ms-flow run' : 'il-water ms-flow'} />
        })}
      {values.gas === 0 && (s.idle || s.at('gas')) && <Label x={120} y={46}>가스 없음</Label>}
      {/* 플라즈마 */}
      {plasmaOn && (
        <g className={s.at('plasma') ? 'ms-st-fe-fade' : ''}>
          <ellipse
            cx="120"
            cy="64"
            rx="70"
            ry={values.rf === 2 ? 12 : 8}
            className={running ? 'ms-cvd-glow run' : 'ms-cvd-glow'}
            style={{ '--dur': values.rf === 2 ? '0.4s' : '0.8s' }}
          />
          <Label x={120} y={66}>플라즈마</Label>
        </g>
      )}
      {s.at('plasma') && !plasmaOn && <Label x={120} y={66}>{noIgnite ? '플라즈마가 켜지지 않음' : 'RF 끔 · 플라즈마 없음'}</Label>}
      {/* 웨이퍼와 막: 로딩·언로딩 때 함께 움직입니다 */}
      <g className={wafer}>
        <rect x="50" y="96" width="140" height="10" className="il-wafer" />
        {trenches.map((x) => (
          <rect key={x} x={x} y={96} width="20" height="10" className="ms-cvd-hole" />
        ))}
        {filmOn && <rect x="50" y={top} width="140" height={film} className={`${filmClass}${depositing ? ' ms-st-fe-grow' : ''}`} />}
        {trenches.map((x) => (
          <g key={x}>
            <rect x={x} y={96} width="20" height="10" className="ms-cvd-hole" />
            {/* 홈 벽과 바닥의 막: 압력이 높으면 얇음 */}
            {filmOn && (
              <g className={depositing ? 'ms-st-fe-fade' : ''}>
                <rect x={x} y={106 - (poorCoverage ? 1 : film)} width="20" height={poorCoverage ? 1 : film} className={filmClass} />
                <rect x={x} y={96} width={poorCoverage ? 1 : film * 0.8} height="10" className={filmClass} />
                <rect x={x + 20 - (poorCoverage ? 1 : film * 0.8)} y={96} width={poorCoverage ? 1 : film * 0.8} height="10" className={filmClass} />
              </g>
            )}
            {bad.coverage && <circle cx={x + 10} cy={103} r="7" className="il-warn-ring" />}
          </g>
        ))}
        {bad.uneven && <path d={`M50 ${top} q 17 -4 35 0 t 35 0 t 35 0 t 35 0`} className="ms-defect-line" />}
        {bad.particle && [70, 112, 160].map((x) => <circle key={x} cx={x} cy={top - 2} r="1.6" className="ms-dirt" />)}
      </g>
      <rect x="45" y="106" width="150" height="8" rx="2" className={`${heater}${heaterAnim}`} />
      {s.at('heat') && <HeatWaves xs={[70, 120, 170]} y={92} />}
      <Label x={120} y={130}>
        {s.at('heat') ? '히터 · 기판 데우는 중' : s.at('purge') ? '히터 · 식는 중' : '히터 · 기판 온도'}
      </Label>
      <Label x={40} y={88} anchor="start">
        {depositing ? '막이 자라는 중' : ['막 얇음', '막 보통', '막 두꺼움'][values.time]}
      </Label>
      <Label x={200} y={88} anchor="end">압력 {['낮음', '저압', '대기압'][values.pressure]}</Label>
      {values.chamber === 1 && <Label x={120} y={82}>벽에 다른 막이 쌓임</Label>}
    </svg>
  )
}
