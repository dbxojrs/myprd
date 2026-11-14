import { Anim, StepCaption, Visible } from '../illustrationKit.jsx'

// 증착·이온주입 개념 그림. viewBox 0 0 320 180. animate가 false면 다 끝난 모습만 그립니다.
// 삼성 뉴스룸 6탄의 그림을 따라 그리지 않고, 글 내용(박막·PVD/CVD·n형/p형)만으로 새로 그렸습니다.

const DUR = '10s'

// 동작 줄이기면 다 끝난 모습만, 아니면 정해진 시간에만 보이게
const Show = ({ animate, from, to = 1, children }) =>
  animate ? (
    <Visible from={from} to={to} dur={DUR}>
      {children}
    </Visible>
  ) : (
    children
  )

// 박막이 층층이 쌓임 → 운동장 비유
const LAYERS = [
  { kind: 'ins', label: '절연막' },
  { kind: 'metal', label: '금속막(전도)' },
  { kind: 'ins', label: '절연막' },
  { kind: 'metal', label: '금속막(전도)' },
  { kind: 'ins', label: '절연막' },
]

export function ThinFilmStack({ animate = true }) {
  const base = 146
  const h = 12
  return (
    <svg viewBox="0 0 320 180" className="il cf" role="img" aria-label="박막이 층층이 쌓이는 증착">
      <text x="140" y="18" textAnchor="middle" className="cf-title">
        박막 = 1μm 이하의 얇은 막
      </text>
      <rect x="40" y={base} width="200" height="18" className="cf-si" />
      <text x="140" y={base + 13} textAnchor="middle" className="cf-on-dark">
        웨이퍼
      </text>
      {LAYERS.map((l, i) => {
        const top = base - (i + 1) * h
        const t0 = 0.04 + i * 0.12
        return (
          <g key={i}>
            <rect x="40" y={top} width="200" height={h} className={l.kind === 'metal' ? 'cf-b-metal' : 'cf-b-ins'}>
              {animate && (
                <>
                  <Anim attr="height" points={[[t0, 0], [t0 + 0.1, h]]} dur={DUR} />
                  <Anim attr="y" points={[[t0, top + h], [t0 + 0.1, top]]} dur={DUR} />
                </>
              )}
            </rect>
            <Show animate={animate} from={t0 + 0.08}>
              <text x="248" y={top + 9} className="cf-sub">
                {l.label}
              </text>
            </Show>
          </g>
        )
      })}
      {/* 스케일 비유 (2012년판 6탄) */}
      <Show animate={animate} from={0.66}>
        <rect x="24" y="26" width="272" height="44" rx="6" className="cf-b-note" />
        <text x="160" y="42" textAnchor="middle" className="cf-sub strong">
          반경 100mm 웨이퍼에 1μm 막을 씌우는 것은
        </text>
        <text x="160" y="58" textAnchor="middle" className="cf-sub strong">
          반경 100m 운동장에 모래를 1mm 이하로 고르게 쌓는 수준
        </text>
      </Show>
      {animate && (
        <StepCaption
          dur={DUR}
          x={160}
          y={176}
          items={[
            [0, 0.64, '절연막과 금속막이 고층 빌딩처럼 층층이 쌓임'],
            [0.64, 1, '그만큼 얇고 고르게 입히는 기술'],
          ]}
        />
      )}
    </svg>
  )
}

// PVD vs CVD
export function PvdCvd({ animate = true }) {
  const film = (x, cls) =>
    animate ? (
      <rect x={x} y="140" width="120" height="0" className={cls}>
        <Anim attr="height" points={[[0.15, 0], [0.85, 12]]} dur={DUR} />
        <Anim attr="y" points={[[0.15, 140], [0.85, 128]]} dur={DUR} />
      </rect>
    ) : (
      <rect x={x} y="128" width="120" height="12" className={cls} />
    )
  return (
    <svg viewBox="0 0 320 180" className="il cf" role="img" aria-label="물리적 기상증착과 화학적 기상증착 비교">
      {/* PVD */}
      <text x="80" y="16" textAnchor="middle" className="cf-title">
        PVD (물리적)
      </text>
      <rect x="30" y="26" width="100" height="14" className="cf-b-target" />
      <text x="80" y="36" textAnchor="middle" className="cf-on-dark">
        금속
      </text>
      {animate &&
        [0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} cx={38 + i * 17} cy="44" r="2.6" className="cf-b-atom">
            <Anim attr="cy" points={[[(i % 3) * 0.1, 44], [(i % 3) * 0.1 + 0.28, 126]]} dur="3.4s" />
          </circle>
        ))}
      <rect x="20" y="140" width="120" height="16" className="cf-si" />
      {film(20, 'cf-b-metal')}
      <text x="80" y="170" textAnchor="middle" className="cf-sub">
        화학반응 없음 · 주로 금속 박막
      </text>

      <line x1="160" y1="10" x2="160" y2="164" className="cf-divider" />

      {/* CVD */}
      <text x="240" y="16" textAnchor="middle" className="cf-title">
        CVD (화학적)
      </text>
      <text x="196" y="36" textAnchor="middle" className="cf-sub">
        가스 A
      </text>
      <text x="284" y="36" textAnchor="middle" className="cf-sub">
        가스 B
      </text>
      {animate && (
        <>
          <circle cx="196" cy="48" r="3" className="cf-o2">
            <Anim attr="cx" points={[[0, 196], [0.35, 238]]} dur="3.4s" />
            <Anim attr="cy" points={[[0, 48], [0.35, 70]]} dur="3.4s" />
          </circle>
          <circle cx="284" cy="48" r="3" className="cf-h2o">
            <Anim attr="cx" points={[[0, 284], [0.35, 242]]} dur="3.4s" />
            <Anim attr="cy" points={[[0, 48], [0.35, 70]]} dur="3.4s" />
          </circle>
          <circle cx="240" cy="70" r="0" className="cf-b-spark">
            <Anim attr="r" points={[[0.34, 0], [0.4, 7], [0.46, 0]]} dur="3.4s" />
          </circle>
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={212 + i * 28} cy="72" r="2.8" className="cf-b-particle" opacity="0">
              <Anim attr="opacity" points={[[0.42, 0], [0.43, 1], [0.95, 1], [0.96, 0]]} dur="3.4s" />
              <Anim attr="cy" points={[[0.42, 72], [0.95, 126]]} dur="3.4s" />
            </circle>
          ))}
        </>
      )}
      <rect x="180" y="140" width="120" height="16" className="cf-si" />
      {film(180, 'cf-b-ins')}
      <text x="240" y="170" textAnchor="middle" className="cf-sub">
        가스 화학 반응 · 도체·부도체·반도체 모두
      </text>
    </svg>
  )
}

// 이온주입으로 n형·p형 만들기: 왼쪽 열린 곳에 15족, 오른쪽 열린 곳에 13족
export function NpDoping({ animate = true }) {
  const phase = (x0, from, to, cls, label, group) => (
    <g>
      {animate &&
        [0, 1, 2, 3].map((i) => (
          <circle key={i} cx={x0 + 8 + i * 14} cy="30" r="3" className={cls} opacity="0">
            <Anim attr="opacity" points={[[from + i * 0.03, 0], [from + i * 0.03 + 0.01, 1], [from + i * 0.03 + 0.18, 1], [from + i * 0.03 + 0.19, 0]]} dur={DUR} />
            <Anim attr="cy" points={[[from + i * 0.03, 30], [from + i * 0.03 + 0.18, 118]]} dur={DUR} />
          </circle>
        ))}
      <Show animate={animate} from={from}>
        <text x={x0 + 30} y="20" textAnchor="middle" className="cf-sub strong">
          {group}
        </text>
      </Show>
      <rect x={x0} y="104" width="60" height="22" rx="6" className={`${cls}-region`} opacity={animate ? 0 : 1}>
        {animate && <Anim attr="opacity" points={[[from + 0.1, 0], [to, 1]]} dur={DUR} />}
      </rect>
      <Show animate={animate} from={to - 0.02}>
        <text x={x0 + 30} y="119" textAnchor="middle" className="cf-b-type">
          {label}
        </text>
      </Show>
    </g>
  )
  return (
    <svg viewBox="0 0 320 180" className="il cf" role="img" aria-label="이온주입으로 n형과 p형 반도체 만들기">
      <rect x="20" y="100" width="280" height="56" className="cf-si" />
      <text x="160" y="148" textAnchor="middle" className="cf-on-dark">
        실리콘 웨이퍼
      </text>
      {/* 가림막(감광막): 열린 곳으로만 이온이 들어감 */}
      <rect x="20" y="88" width="50" height="12" className="cf-b-mask" />
      <rect x="130" y="88" width="60" height="12" className="cf-b-mask" />
      <rect x="250" y="88" width="50" height="12" className="cf-b-mask" />
      {phase(70, 0.05, 0.42, 'cf-b-n', 'n형', '15족 P·As')}
      {phase(190, 0.5, 0.87, 'cf-b-p', 'p형', '13족 B')}
      {animate && (
        <StepCaption
          dur={DUR}
          x={160}
          y={172}
          items={[
            [0, 0.48, '15족 원소(인·비소)를 주입하면 n형'],
            [0.48, 0.9, '13족 원소(붕소)를 주입하면 p형'],
            [0.9, 1, '원하는 깊이만큼 균일하게 주입'],
          ]}
        />
      )}
      {!animate && (
        <text x="160" y="172" textAnchor="middle" className="cf-sub">
          15족 → n형 · 13족 → p형
        </text>
      )}
    </svg>
  )
}
