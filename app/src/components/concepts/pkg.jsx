import { Anim, Move, StepCaption, Visible } from '../illustrationKit.jsx'

// 패키징 개념 그림. viewBox 0 0 320 180. animate가 false면 다 끝난 모습만 그립니다.
// 삼성 뉴스룸 9탄의 그림을 따라 그리지 않고, 글 내용(패키징 순서, 와이어본딩과 플립칩)만으로 새로 그렸습니다.

const DUR = '10s'

// 동작 줄이기면 마지막까지 남는 장면(to = 1)만 그립니다.
const Show = ({ animate, from, to = 1, children }) =>
  animate ? (
    <Visible from={from} to={to} dur={DUR}>
      {children}
    </Visible>
  ) : to === 1 ? (
    children
  ) : null

const FLOW = ['웨이퍼 절단', '칩 접착', '금선 연결', '성형', '패키지 테스트']
const SHORT = ['절단', '칩 접착', '금선 연결', '성형', '테스트']

// 패키징 순서: 위쪽 단계 표시줄 + 가운데 장면이 단계마다 바뀜
export function PkgFlow({ animate = true }) {
  const seg = 0.2
  return (
    <svg viewBox="0 0 320 180" className="il cf" role="img" aria-label="패키징 공정 순서">
      {FLOW.map((name, i) => {
        const x = 8 + i * 62
        return (
          <g key={name}>
            <rect x={x} y="8" width="58" height="20" rx="10" className="cf-b-step" />
            {animate && (
              <rect x={x} y="8" width="58" height="20" rx="10" className="cf-b-step on" opacity="0">
                <Anim attr="opacity" points={[[i * seg, 0], [i * seg + 0.01, 1], [(i + 1) * seg, 1], [(i + 1) * seg + 0.01, 0]]} dur={DUR} />
              </rect>
            )}
            <text x={x + 29} y="21" textAnchor="middle" className="cf-sub dark strong">
              {i + 1}. {SHORT[i]}
            </text>
          </g>
        )
      })}

      {/* ① 웨이퍼 절단: 스크라이브 라인을 따라 자름 */}
      <Show animate={animate} from={0} to={seg}>
        <circle cx="160" cy="92" r="48" className="cf-b-wafer" />
        {[-24, 0, 24].map((d) => (
          <line key={`v${d}`} x1={160 + d} y1="48" x2={160 + d} y2="136" className="cf-b-scribe" />
        ))}
        {[-24, 0, 24].map((d) => (
          <line key={`h${d}`} x1="116" y1={92 + d} x2="204" y2={92 + d} className="cf-b-scribe" />
        ))}
        {animate && (
          <circle cx="112" cy="92" r="9" className="cf-b-blade">
            <Anim attr="cx" points={[[0, 112], [seg, 208]]} dur={DUR} />
          </circle>
        )}
        <text x="160" y="152" textAnchor="middle" className="cf-sub">스크라이브 라인을 따라 다이아몬드 톱·레이저로</text>
      </Show>

      {/* ② 칩 접착: 다이를 리드프레임 위로 */}
      <Show animate={animate} from={seg} to={seg * 2}>
        <rect x="90" y="112" width="140" height="10" className="cf-b-lf" />
        <rect x="136" y="104" width="48" height="8" className="cf-b-lf" />
        <g>
          {animate && <Move points={[[seg, '0,-40'], [seg + 0.12, '0,0']]} dur={DUR} />}
          <rect x="140" y="88" width="40" height="16" rx="2" className="cf-b-chip" />
          <text x="160" y="99" textAnchor="middle" className="cf-on-dark">다이</text>
        </g>
        <text x="160" y="140" textAnchor="middle" className="cf-sub">리드프레임: 신호 전달·보호·지지 골격</text>
      </Show>

      {/* ③ 금선 연결 */}
      <Show animate={animate} from={seg * 2} to={seg * 3}>
        <rect x="90" y="112" width="40" height="10" className="cf-b-lf" />
        <rect x="190" y="112" width="40" height="10" className="cf-b-lf" />
        <rect x="136" y="104" width="48" height="8" className="cf-b-lf" />
        <rect x="140" y="88" width="40" height="16" rx="2" className="cf-b-chip" />
        {[
          'M146 88 Q126 62 112 112',
          'M174 88 Q194 62 208 112',
        ].map((d) => (
          <path key={d} d={d} className="cf-b-wire" strokeDasharray="90" strokeDashoffset="90">
            {animate && <Anim attr="stroke-dashoffset" points={[[seg * 2, 90], [seg * 2 + 0.12, 0]]} dur={DUR} />}
          </path>
        ))}
        <text x="160" y="140" textAnchor="middle" className="cf-sub">칩 접점과 기판 접점을 가는 금선으로</text>
      </Show>

      {/* ④ 성형: 화학 수지로 밀봉 */}
      <Show animate={animate} from={seg * 3} to={seg * 4}>
        <rect x="90" y="112" width="40" height="10" className="cf-b-lf" />
        <rect x="190" y="112" width="40" height="10" className="cf-b-lf" />
        <rect x="140" y="88" width="40" height="16" rx="2" className="cf-b-chip" />
        <path d="M146 88 Q126 62 112 112 M174 88 Q194 62 208 112" className="cf-b-wire" />
        <rect x="104" y={animate ? 122 : 60} width="112" height={animate ? 0 : 62} rx="4" className="cf-b-mold">
          {animate && (
            <>
              <Anim attr="height" points={[[seg * 3, 0], [seg * 3 + 0.14, 62]]} dur={DUR} />
              <Anim attr="y" points={[[seg * 3, 122], [seg * 3 + 0.14, 60]]} dur={DUR} />
            </>
          )}
        </rect>
        <text x="160" y="140" textAnchor="middle" className="cf-sub">화학 수지로 밀봉해 외부환경으로부터 보호</text>
      </Show>

      {/* ⑤ 패키지 테스트 */}
      <Show animate={animate} from={seg * 4} to={1}>
        <rect x="112" y="78" width="96" height="40" rx="4" className="cf-b-mold" />
        <rect x="100" y="118" width="120" height="10" className="cf-b-socket" />
        <text x="160" y="102" textAnchor="middle" className="cf-on-dark">완성된 패키지</text>
        <text x="236" y="96" className="cf-b-check">✓</text>
        <text x="160" y="146" textAnchor="middle" className="cf-sub">검사장비에서 전압·신호·온도·습도를 가해 측정</text>
      </Show>

      {animate && (
        <StepCaption
          dur={DUR}
          x={160}
          y={170}
          items={FLOW.map((name, i) => [i * seg, (i + 1) * seg, `${i + 1}. ${name}`])}
        />
      )}
      {!animate && (
        <text x="160" y="170" textAnchor="middle" className="cf-sub">
          절단 → 칩 접착 → 금선 연결 → 성형 → 패키지 테스트
        </text>
      )}
    </svg>
  )
}

// 와이어본딩 vs 플립칩
export function WbVsFlipchip({ animate = true }) {
  return (
    <svg viewBox="0 0 320 180" className="il cf" role="img" aria-label="와이어본딩과 플립칩 비교">
      {/* 와이어본딩 */}
      <text x="80" y="18" textAnchor="middle" className="cf-title">와이어본딩</text>
      <rect x="20" y="118" width="120" height="12" className="cf-b-lf" />
      <rect x="44" y="98" width="72" height="20" rx="2" className="cf-b-chip" />
      <text x="80" y="111" textAnchor="middle" className="cf-on-dark">칩 (회로면 ↑)</text>
      {['M48 98 Q34 66 26 118', 'M112 98 Q126 66 134 118'].map((d) => (
        <path key={d} d={d} className="cf-b-wire" strokeDasharray="100" strokeDashoffset={animate ? 100 : 0}>
          {animate && <Anim attr="stroke-dashoffset" points={[[0.05, 100], [0.4, 0]]} dur={DUR} />}
        </path>
      ))}
      <text x="80" y="148" textAnchor="middle" className="cf-sub">가는 금선으로 접점끼리 연결</text>

      <line x1="160" y1="10" x2="160" y2="160" className="cf-divider" />

      {/* 플립칩: 칩을 뒤집어 범프로 바로 붙임 */}
      <text x="240" y="18" textAnchor="middle" className="cf-title">플립칩</text>
      <rect x="180" y="118" width="120" height="12" className="cf-b-lf" />
      <g>
        {animate && <Move points={[[0.4, '0,-46'], [0.7, '0,0']]} dur={DUR} />}
        <rect x="204" y="92" width="72" height="20" rx="2" className="cf-b-chip" />
        <text x="240" y="105" textAnchor="middle" className="cf-on-dark">칩 (회로면 ↓)</text>
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={212 + i * 18.6} cy="115" r="3.4" className="cf-b-bump" />
        ))}
      </g>
      <Show animate={animate} from={0.7}>
        <line x1="270" y1="118" x2="284" y2="130" className="cf-b-lead" />
        <text x="286" y="138" className="cf-sub dark">범프</text>
      </Show>
      <text x="240" y="148" textAnchor="middle" className="cf-sub">범프(Au·솔더)로 직접 연결</text>
      <Show animate={animate} from={0.72}>
        <text x="240" y="162" textAnchor="middle" className="cf-sub strong">저항 작고 빠름 · 작은 폼팩터</text>
      </Show>
      {animate && (
        <StepCaption
          dur={DUR}
          x={160}
          y={176}
          items={[
            [0, 0.4, '와이어본딩: 금선이 칩과 기판을 잇는다'],
            [0.4, 0.72, '플립칩: 칩을 뒤집어 범프로 바로 붙인다'],
            [0.72, 1, '플립칩은 전기 저항이 작고 속도가 빠름'],
          ]}
        />
      )}
    </svg>
  )
}
