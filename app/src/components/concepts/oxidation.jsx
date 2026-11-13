import { Anim, StepCaption, Visible } from '../illustrationKit.jsx'

// 산화 개념 그림. viewBox 0 0 320 180. animate가 false면 다 끝난 모습만 그립니다.
// 삼성 뉴스룸 2탄의 그림을 따라 그리지 않고, 글 내용(산화막 역할, 건식·습식 비교)만으로 새로 그렸습니다.

const DUR = '9s'

// 산화막이 하는 일: 절연막 → 확산 방지막 → 식각 방지막을 차례로 보여줍니다.
export function OxideRoles({ animate = true }) {
  return (
    <svg viewBox="0 0 320 180" className="il cf" role="img" aria-label="산화막이 하는 세 가지 역할">
      {/* 실리콘 위 산화막 */}
      <rect x="30" y="110" width="260" height="40" className="cf-si" />
      <rect x="30" y="96" width="260" height="14" className="cf-oxide" />
      <text x="160" y="135" textAnchor="middle" className="cf-on-dark">실리콘(Si) 웨이퍼</text>
      <text x="296" y="106" className="cf-tag">SiO₂</text>
      {animate ? (
        <>
          {/* ① 절연막: 두 회로 사이 전류가 막힘 */}
          <Visible from={0} to={0.33} dur={DUR}>
            <rect x="60" y="78" width="40" height="18" className="cf-metal" />
            <rect x="220" y="78" width="40" height="18" className="cf-metal" />
            <path d="M100 87 H220" className="cf-current" />
            <text x="160" y="80" textAnchor="middle" className="cf-x">✕</text>
            <text x="160" y="60" textAnchor="middle" className="cf-title">① 절연막: 회로 사이 누설전류를 막음</text>
          </Visible>
          {/* ② 확산 방지막: 이온이 막에 막히고 열린 곳만 들어감 */}
          <Visible from={0.33} to={0.66} dur={DUR}>
            <rect x="140" y="96" width="40" height="14" className="cf-open" />
            {[70, 110, 160, 210, 250].map((x, i) => (
              <circle key={x} cx={x} cy="40" r="4" className="cf-ion">
                <Anim attr="cy" points={[[0.33, 40], [0.5, x === 160 ? 122 : 92], [0.66, x === 160 ? 122 : 92]]} dur={DUR} />
              </circle>
            ))}
            <text x="160" y="28" textAnchor="middle" className="cf-title">② 확산 방지막: 막이 있는 곳은 이온이 못 들어감</text>
          </Visible>
          {/* ③ 식각 방지막: 막이 없는 곳만 깎임 */}
          <Visible from={0.66} to={1} dur={DUR}>
            <rect x="140" y="110" width="40" height="0" className="cf-hole">
              <Anim attr="height" points={[[0.7, 0], [0.9, 26]]} dur={DUR} />
            </rect>
            <rect x="140" y="96" width="40" height="14" className="cf-open" />
            <text x="160" y="60" textAnchor="middle" className="cf-title">③ 식각 방지막: 필요한 곳만 깎이게 지킴</text>
          </Visible>
          <StepCaption
            dur={DUR}
            x={160}
            y={170}
            items={[
              [0, 0.33, '산화막은 전기가 통하지 않는 유리 같은 막'],
              [0.33, 0.66, '이온주입 때 가림막 역할'],
              [0.66, 1, '식각 때 보호막 역할'],
            ]}
          />
        </>
      ) : (
        <text x="160" y="60" textAnchor="middle" className="cf-title">절연막 · 확산 방지막 · 식각 방지막</text>
      )}
    </svg>
  )
}

// 건식 vs 습식: 같은 시간 동안 두 웨이퍼에서 막이 자라는 속도와 밀도를 비교합니다.
export function DryWet({ animate = true }) {
  const half = (x, label, gas, thick, wet) => (
    <g>
      <text x={x + 60} y="22" textAnchor="middle" className="cf-title">{label}</text>
      <text x={x + 60} y="38" textAnchor="middle" className="cf-sub">{gas}</text>
      {/* 기체 분자가 내려옴 */}
      {animate &&
        [0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <circle cx={x + 18 + i * 22} cy="50" r="3.2" className="cf-o2">
              <Anim attr="cy" points={[[i * 0.08, 50], [i * 0.08 + 0.25, 120]]} dur={DUR} />
              <Anim attr="opacity" points={[[i * 0.08, 1], [i * 0.08 + 0.25, 1], [i * 0.08 + 0.26, 0]]} dur={DUR} />
            </circle>
            {wet && (
              <circle cx={x + 29 + i * 22} cy="56" r="2.4" className="cf-h2o">
                <Anim attr="cy" points={[[i * 0.08, 56], [i * 0.08 + 0.2, 120]]} dur={DUR} />
                <Anim attr="opacity" points={[[i * 0.08, 1], [i * 0.08 + 0.2, 1], [i * 0.08 + 0.21, 0]]} dur={DUR} />
              </circle>
            )}
          </g>
        ))}
      <rect x={x} y="130" width="120" height="26" className="cf-si" />
      <rect x={x} y={130 - thick} width="120" height={thick} className={wet ? 'cf-oxide loose' : 'cf-oxide'}>
        {animate && (
          <>
            <Anim attr="height" points={[[0, 0], [0.75, thick], [1, thick]]} dur={DUR} />
            <Anim attr="y" points={[[0, 130], [0.75, 130 - thick], [1, 130 - thick]]} dur={DUR} />
          </>
        )}
      </rect>
      <text x={x + 60} y="172" textAnchor="middle" className="cf-sub">
        {wet ? '빠르고 두꺼움 · 밀도 낮음' : '느리고 얇음 · 치밀함'}
      </text>
    </g>
  )
  return (
    <svg viewBox="0 0 320 180" className="il cf" role="img" aria-label="건식 산화와 습식 산화 비교">
      {half(20, '건식 산화', 'O₂만', 6, false)}
      {half(180, '습식 산화', 'O₂ + H₂O', 42, true)}
      <line x1="160" y1="14" x2="160" y2="164" className="cf-divider" />
      {animate && (
        <text x="160" y="100" textAnchor="middle" className="cf-vs">
          같은 온도·시간
        </text>
      )}
    </svg>
  )
}
