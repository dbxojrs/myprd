import { has, Label, stageTools } from './parts.jsx'
import { HeatWaves, PressureGauge } from './frontStage.jsx'

// PVD 스퍼터 그림. 위 금속 타깃을 아르곤 플라즈마가 때려 떨어진 금속 원자가 아래 웨이퍼에 쌓입니다.
// 타깃이 닳을수록 얇아지고(가운데 홈), 아르곤 압력이 높을수록 원자가 흩어지며, 깊은 비아 바닥은 얇게 덮입니다.
// 가동 중에는 단계(stage)마다 장면이 바뀝니다(단계 설명 글은 data/machines/metallization.js의 sequence.scene):
//   load 웨이퍼가 들어옴 → pump 압력계 바늘이 내려가고 아르곤이 들어옴 → heat 히터가 달아오름
//   → sputter 플라즈마가 켜지고 타깃에서 금속 원자가 떨어져 나옴 → deposit 금속막이 자람 → cool 식히고 웨이퍼가 나감
const ORDER = ['load', 'pump', 'heat', 'sputter', 'deposit', 'cool']

export default function PvdView({ values, running, findings, stage = null }) {
  const s = stageTools(stage, ORDER)
  const targetH = [12, 8, 3][values.target]
  const atoms = [3, 6, 8][values.power]
  const fall = ['2.4s', '1.4s', '0.8s'][values.power]
  const scatter = [0, 2, 8, 0][values.pressure]
  const argon = [3, 7, 14, 0][values.pressure]
  const film = [2, 4, 7][values.time]
  const heaterClass = ['ms-heater-low', 'ms-heater-mid', 'ms-heater-high'][values.temp]
  const via = values.pattern === 1
  const showResult = s.done('deposit')
  const bad = {
    resist: showResult && has(findings, ['저항', '얇아']),
    via: showResult && has(findings, ['비아 바닥']),
    heat: showResult && has(findings, ['손상', '과열']),
    contact: showResult && has(findings, ['접촉']),
  }
  const top = 104 - film
  const leak = values.pressure === 3

  // 단계별 상태
  const inside = s.idle || (s.done('load') && s.before('cool'))
  const wafer = s.at('load') ? 'ms-st-fe-in' : s.at('cool') ? 'ms-st-fe-out' : inside ? '' : 'ms-st-fe-gone'
  const pumped = inside
  const argonOn = s.idle || (!s.before('pump') && s.before('cool'))
  const hot = s.idle || (!s.before('heat') && s.before('cool'))
  const heater = bad.heat ? 'ms-heater-high' : hot || s.at('cool') ? heaterClass : 'ms-heater-low'
  const heaterAnim = s.at('heat') ? ' ms-st-fe-warm' : s.at('cool') ? ' ms-st-fe-chill' : ''
  const sputtering = s.at('sputter') || s.at('deposit')
  const plasmaOn = !leak && (running ? s.idle || sputtering : sputtering)
  const atomsOn = s.idle || sputtering
  const depositing = s.at('deposit')
  const filmOn = s.idle || depositing || s.done('deposit')
  const filmH = filmOn ? film : 0
  const filmTop = 104 - filmH

  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="PVD 스퍼터 장비 그림">
      <rect x="30" y="10" width="180" height="114" rx="6" className="ms-cvd-wall" />
      {!s.idle && (
        <PressureGauge
          x={18}
          y={60}
          level={leak ? 1 : pumped || s.at('pump') || s.at('cool') ? [0.12, 0.25, 0.5][values.pressure] : 1}
          pumping={s.at('pump') && !leak}
          venting={s.at('cool')}
        />
      )}
      {/* 자석과 타깃 */}
      <rect x="70" y="14" width="100" height="6" rx="1" className="il-frame" />
      <Label x={196} y={20} anchor="start">자석</Label>
      <path
        d={`M70 20 h100 v${targetH} h-25 q -25 ${values.target === 0 ? 0 : 3} -50 0 h-25 z`}
        className={`${values.target === 2 ? 'ms-pvd-target worn' : 'ms-pvd-target'}${s.at('sputter') ? ' ms-st-fe-glow' : ''}`}
      />
      <Label x={36} y={30} anchor="start">
        타깃
      </Label>
      <Label x={36} y={38} anchor="start">
        {['새 타깃', '정상', '침식 한계'][values.target]}
      </Label>
      {/* 아르곤과 플라즈마 */}
      {plasmaOn && (
        <g className={s.at('sputter') ? 'ms-st-fe-fade' : ''}>
          <ellipse cx="120" cy="44" rx="55" ry="7" className="ms-cvd-glow run" style={{ '--dur': '0.7s' }} />
        </g>
      )}
      {argonOn &&
        Array.from({ length: argon }, (_, i) => (
          <circle
            key={i}
            cx={45 + ((i * 37) % 150)}
            cy={52 + ((i * 13) % 30)}
            r="0.9"
            className={`ms-pvd-ar${s.at('pump') ? ' ms-st-fe-fade' : ''}`}
          />
        ))}
      {s.at('pump') && !leak && <Label x={120} y={58}>진공 배기 · 아르곤 들어옴</Label>}
      {leak && (
        <>
          <path d="M212 60 h-20" className="ms-defect-line" />
          <Label x={176} y={56}>공기 유입</Label>
        </>
      )}
      {/* 날아가는 금속 원자 */}
      {atomsOn &&
        Array.from({ length: atoms }, (_, i) => {
          const x = 80 + i * (80 / Math.max(atoms - 1, 1))
          return (
            <circle
              key={i}
              cx={x}
              cy={36}
              r="1.5"
              className={running ? 'ms-pvd-atom run' : 'ms-pvd-atom'}
              style={{ '--dur': fall, '--dx': `${(i % 2 ? 1 : -1) * scatter}px`, animationDelay: `${(i * 0.17).toFixed(2)}s` }}
            />
          )
        })}
      {/* 웨이퍼, 비아, 금속막: 로딩·언로딩 때 함께 움직입니다 */}
      <g className={wafer}>
        <rect x="50" y="104" width="140" height="10" className="il-wafer" />
        {values.surface === 1 && [62, 92, 150, 178].map((x) => <circle key={x} cx={x} cy={104} r="1.4" className="ms-dirt" />)}
        {filmOn && (
          <rect
            x="50"
            y={top}
            width="140"
            height={film}
            className={`${bad.resist || bad.contact ? 'ms-cvd-film bad' : 'ms-cvd-film'}${depositing ? ' ms-st-fe-grow' : ''}`}
          />
        )}
        {via &&
          [100, 132].map((x) => (
            <g key={x}>
              <rect x={x} y={filmTop} width="10" height={114 - filmTop} className="ms-cvd-hole" />
              {filmOn && (
                <g className={depositing ? 'ms-st-fe-fade' : ''}>
                  {!bad.via && <rect x={x} y={112} width="10" height="2" className="ms-cvd-film" />}
                  <rect x={x} y={top} width="1" height={114 - top} className="ms-cvd-film" />
                  <rect x={x + 9} y={top} width="1" height={114 - top} className="ms-cvd-film" />
                </g>
              )}
              {bad.via && <circle cx={x + 5} cy={110} r="6" className="il-warn-ring" />}
            </g>
          ))}
      </g>
      <rect x="45" y="114" width="150" height="7" rx="2" className={`${heater}${heaterAnim}`} />
      {s.at('heat') && <HeatWaves xs={[70, 120, 170]} y={100} />}
      <Label x={120} y={133}>
        {s.at('heat') ? '히터 · 기판 데우는 중' : depositing ? '금속막이 자라는 중' : `히터 · 기판 온도 · 아르곤 ${['낮음', '적정', '높음', '누설'][values.pressure]}`}
      </Label>
      {bad.contact && <Label x={120} y={98}>오염 위에 쌓인 금속</Label>}
    </svg>
  )
}
