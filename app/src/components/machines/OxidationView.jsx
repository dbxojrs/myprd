import { has, Label } from './parts.jsx'

// 산화로 그림. 왼쪽은 가로형 확산로(히터·석영 튜브·웨이퍼 보트), 오른쪽은 웨이퍼 단면의 산화막 두께입니다.
export default function OxidationView({ values, running, findings }) {
  const heater = ['ms-heater-low', 'ms-heater-mid', 'ms-heater-high'][values.temp]
  const wet = values.method === 1
  // 막 두께: 습식이 훨씬 빠르게 자라고, 시간·온도에 따라 늘어납니다(그림용 상대값).
  const grow = values.temp === 0 ? 0.3 : 1
  const oxide = Math.min(34, Math.max(1.5, [3, 6, 11][values.time] * (wet ? 3 : 1) * grow))
  const target = values.target === 0 ? 5 : 22
  const thin = has(findings, ['얇음', '모자람', '자라지'])
  const thick = has(findings, ['두꺼움'])
  const dirty = has(findings, ['오염'])
  const loose = has(findings, ['밀도'])
  const warped = has(findings, ['휨'])
  const surface = 110 - oxide
  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="산화로 그림">
      {/* 히터와 석영 튜브 */}
      <rect x="22" y="28" width="148" height="64" rx="6" className={heater} />
      {[34, 50, 66, 82, 98, 114, 130, 146].map((x) => (
        <line key={x} x1={x} y1="30" x2={x} y2="90" className="ms-ox-coil" />
      ))}
      <rect x="10" y="42" width="172" height="36" rx="12" className="ms-ox-tube" />
      {values.tube === 1 &&
        [30, 52, 78, 104, 128, 152].map((x, i) => <circle key={x} cx={x} cy={i % 2 ? 45 : 75} r="1.4" className="ms-dirt" />)}
      {/* 웨이퍼 보트 */}
      <rect x="52" y="72" width="92" height="3" className="il-frame" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={56 + i * 7.5} y="48" width="1.8" height="24" className={values.clean === 1 ? 'il-wafer ms-ox-dirty' : 'il-wafer'} />
      ))}
      {/* 가스 공급 */}
      <line x1="2" y1="60" x2="40" y2="60" className={running ? 'il-water ms-flow run' : 'il-water'} />
      {wet && [12, 22, 32].map((x) => <circle key={x} cx={x} cy="55" r="1.4" className="il-diamond" />)}
      <Label x={24} y={22}>{wet ? 'O₂ + H₂O (습식)' : 'O₂ (건식)'}</Label>
      <Label x={96} y={102}>석영 튜브 · 웨이퍼 보트</Label>
      <Label x={96} y={18}>히터 {['낮음', '적정', '상한 초과'][values.temp]}</Label>
      {values.tube === 1 && <Label x={96} y={116}>튜브 벽 오염</Label>}
      {values.ramp === 2 && <Label x={96} y={128}>급한 승온</Label>}

      {/* 웨이퍼 단면: 산화막 두께와 목표 */}
      <Label x={212} y={22}>웨이퍼 단면</Label>
      <path
        d={warped ? 'M190 112 Q212 104 234 112 L234 130 Q212 122 190 130 Z' : 'M190 110 H234 V130 H190 Z'}
        className="il-wafer"
      />
      <rect x="190" y={surface} width="44" height={oxide} className="il-oxide ms-ox-film" />
      {loose && <rect x="190" y={surface} width="44" height={oxide} className="ms-ox-loose" />}
      {dirty && [196, 208, 222].map((x) => <circle key={x} cx={x} cy={surface + oxide / 2} r="1.2" className="ms-dirt" />)}
      <line x1="186" y1={110 - target} x2="238" y2={110 - target} className="zs-original" />
      <Label x={212} y={106 - target}>목표</Label>
      {(thin || thick) && <rect x="188" y={surface - 2} width="48" height={oxide + 4} rx="2" className="ms-ox-ring" />}
      <Label x={238} y={138} anchor="end">위: 산화막 · 아래: 실리콘</Label>
    </svg>
  )
}
