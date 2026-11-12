import { has, Label, stageTools } from './parts.jsx'

// 산화로 그림. 왼쪽은 가로형 확산로(히터·석영 튜브·웨이퍼 보트), 오른쪽은 웨이퍼 단면의 산화막 두께입니다.
// 가동 중에는 단계(stage)마다 장면이 바뀝니다(단계 설명 글은 data/machines/oxidation.js의 sequence.scene):
//   load 보트가 튜브 안으로 들어감 → purge 튜브 안 공기를 밀어냄 → ramp 히터가 조건 속도로 달아오름
//   → oxidize 기체가 흐르며 산화막이 자람 → cool 히터가 식고 보트가 나옴 → measure 막 두께를 재서 목표와 비교
const ORDER = ['load', 'purge', 'ramp', 'oxidize', 'cool', 'measure']

export default function OxidationView({ values, running, findings, stage = null }) {
  const s = stageTools(stage, ORDER)
  const heaterClass = ['ms-heater-low', 'ms-heater-mid', 'ms-heater-high'][values.temp]
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

  // 단계별 상태
  const hot = s.idle || s.at('ramp') || s.at('oxidize') // 히터가 목표 온도
  const heater = hot || s.at('cool') ? heaterClass : 'ms-heater-low'
  const heaterAnim = s.at('ramp') ? ` ms-ox-warm ms-ox-ramp-${values.ramp}` : s.at('cool') ? ' ms-ox-chill' : ''
  const boat = s.at('load') ? 'loading' : s.at('cool') ? 'unloading' : s.idle || (s.done('load') && s.before('cool')) ? 'in' : 'out'
  const doorOpen = s.at('load') || s.at('cool')
  const purging = s.at('purge')
  const oxidizing = s.at('oxidize')
  const gasOn = (s.idle && running) || oxidizing
  // 산화막: 산화 전에는 아주 얇은 자연 산화막만, 산화 중에는 자라는 중, 끝나면 조건대로.
  const film = s.before('oxidize') || s.at('start') ? 1.2 : oxide
  const surface = 110 - film
  const measuring = s.at('measure')
  const showResult = s.idle || s.done('oxidize')

  return (
    <svg viewBox="0 0 240 140" className="ms-view" role="img" aria-label="산화로 그림">
      {/* 히터와 석영 튜브 */}
      <rect x="22" y="28" width="148" height="64" rx="6" className={`${heater}${heaterAnim}`} />
      {[34, 50, 66, 82, 98, 114, 130, 146].map((x) => (
        <line key={x} x1={x} y1="30" x2={x} y2="90" className={`ms-ox-coil${hot ? ' hot' : ''}`} />
      ))}
      <rect x="10" y="42" width="172" height="36" rx="12" className="ms-ox-tube" />
      {values.tube === 1 &&
        [30, 52, 78, 104, 128, 152].map((x, i) => <circle key={x} cx={x} cy={i % 2 ? 45 : 75} r="1.4" className="ms-dirt" />)}

      {/* 웨이퍼 보트: 단계에 따라 튜브 안팎으로 움직입니다 */}
      <g className={`ms-ox-boat ${boat}`}>
        <line x1="-30" y1="73.5" x2="52" y2="73.5" className="ms-ox-paddle" />
        <rect x="52" y="72" width="92" height="3" className="il-frame" />
        {Array.from({ length: 12 }, (_, i) => (
          <rect
            key={i}
            x={56 + i * 7.5}
            y="48"
            width="1.8"
            height="24"
            className={`il-wafer${values.clean === 1 ? ' ms-ox-dirty' : ''}${oxidizing ? ' ms-ox-glow' : ''}`}
          />
        ))}
      </g>
      {/* 튜브 입구 마개: 로딩·언로딩 때 열림 */}
      <rect x="4" y="44" width="7" height="32" rx="2" className={`ms-ox-door${doorOpen ? ' open' : ''}`} />

      {/* 공기 치환: 깨끗한 기체가 흘러 들어가고 공기 입자가 튜브 끝으로 빠져나감 */}
      {purging && (
        <g>
          {[50, 60, 70].map((y) => (
            <line key={y} x1="14" y1={y} x2="178" y2={y} className="ms-ox-purge" />
          ))}
          {[30, 60, 90, 120, 150].map((x, i) => (
            <circle key={x} cx={x} cy={i % 2 ? 54 : 66} r="1.6" className="ms-ox-air" style={{ animationDelay: `${i * -0.25}s` }} />
          ))}
          <Label x={96} y={38}>공기를 밀어냄 →</Label>
        </g>
      )}

      {/* 산화: 산소(습식이면 수증기도)가 튜브를 따라 흐름 */}
      {oxidizing &&
        [0, 1, 2, 3, 4, 5].map((i) => (
          <circle
            key={i}
            cx="14"
            cy={50 + (i % 3) * 10}
            r="1.5"
            className={wet && i % 2 ? 'ms-ox-mol h2o' : 'ms-ox-mol'}
            style={{ animationDelay: `calc(var(--step) * ${-i / 6})` }}
          />
        ))}

      {/* 가스 공급 */}
      <line x1="2" y1="60" x2="40" y2="60" className={gasOn || purging ? 'il-water ms-flow run' : 'il-water'} />
      {wet && [12, 22, 32].map((x) => <circle key={x} cx={x} cy="55" r="1.4" className="il-diamond" />)}
      <Label x={24} y={22}>{purging ? '치환 기체' : wet ? 'O₂ + H₂O (습식)' : 'O₂ (건식)'}</Label>
      <Label x={96} y={102}>석영 튜브 · 웨이퍼 보트</Label>
      <Label x={96} y={18}>
        {s.at('ramp')
          ? `히터 올리는 중 · ${['천천히', '보통', '급하게'][values.ramp]}`
          : s.at('cool')
            ? '히터 식는 중'
            : hot
              ? `히터 ${['낮음', '적정', '상한 초과'][values.temp]}`
              : '히터 대기'}
      </Label>
      {values.tube === 1 && <Label x={60} y={114}>튜브 벽 오염</Label>}
      {values.ramp === 2 && (s.idle || s.at('ramp')) && <Label x={140} y={114}>급한 승온</Label>}

      {/* 웨이퍼 단면: 산화막 두께와 목표 */}
      <Label x={212} y={22}>웨이퍼 단면</Label>
      <path
        d={warped && showResult ? 'M190 112 Q212 104 234 112 L234 130 Q212 122 190 130 Z' : 'M190 110 H234 V130 H190 Z'}
        className="il-wafer"
      />
      <rect x="190" y={surface} width="44" height={film} className={`il-oxide ms-ox-film${oxidizing ? ' growing' : ''}`} />
      {loose && showResult && <rect x="190" y={surface} width="44" height={film} className="ms-ox-loose" />}
      {dirty && showResult && [196, 208, 222].map((x) => <circle key={x} cx={x} cy={surface + film / 2} r="1.2" className="ms-dirt" />)}
      <line x1="186" y1={110 - target} x2="238" y2={110 - target} className="zs-original" />
      <Label x={212} y={106 - target}>목표</Label>
      {oxidizing && <Label x={212} y={38}>막이 자라는 중 ↑</Label>}

      {/* 두께 측정: 측정 탐침이 막을 훑고, 목표와 비교 */}
      {measuring && (
        <g>
          <line x1="212" y1="44" x2="212" y2={surface - 2} className="ms-ox-probe" />
          <rect x="188" y={surface - 2} width="48" height={film + 4} rx="2" className="ms-ox-scan" />
          <Label x={212} y={38}>{thin ? '목표보다 얇음' : thick ? '목표보다 두꺼움' : '목표 두께 확인'}</Label>
        </g>
      )}
      {(thin || thick) && (measuring || s.at('done') || s.idle) && (
        <rect x="188" y={surface - 2} width="48" height={film + 4} rx="2" className="ms-ox-ring" />
      )}
      <Label x={238} y={138} anchor="end">위: 산화막 · 아래: 실리콘</Label>
    </svg>
  )
}
