import { Anim, StepCaption, Visible } from '../illustrationKit.jsx'

// 금속 배선 개념 그림. viewBox 0 0 320 180. animate가 false면 다 끝난 모습만 그립니다.
// 삼성 뉴스룸 7탄(2018)·7탄(2012)의 그림을 따라 그리지 않고, 글 내용(금속 조건, 알루미늄·베리어 메탈·텅스텐)만으로 새로 그렸습니다.

const DUR = '10s'

const Show = ({ animate, from, to = 1, children }) =>
  animate ? (
    <Visible from={from} to={to} dur={DUR}>
      {children}
    </Visible>
  ) : (
    children
  )

const CONDITIONS = ['웨이퍼와의 부착성', '낮은 전기저항', '열적·화학적 안정성', '패턴 형성의 용이성', '높은 신뢰성', '제조 가격']

export function MetalConditions({ animate = true }) {
  return (
    <svg viewBox="0 0 320 180" className="il cf" role="img" aria-label="배선 금속이 갖춰야 할 여섯 가지 조건">
      {/* 금속선이 두 소자를 잇는 작은 그림 */}
      <rect x="18" y="96" width="34" height="26" rx="3" className="cf-b-device" />
      <rect x="78" y="96" width="34" height="26" rx="3" className="cf-b-device" />
      <text x="35" y="113" textAnchor="middle" className="cf-sub">소자</text>
      <text x="95" y="113" textAnchor="middle" className="cf-sub">소자</text>
      <path d="M35 96 V78 H95 V96" className="cf-b-line" strokeDasharray="110" strokeDashoffset={animate ? 110 : 0}>
        {animate && <Anim attr="stroke-dashoffset" points={[[0, 110], [0.12, 0]]} dur={DUR} />}
      </path>
      <text x="65" y="70" textAnchor="middle" className="cf-sub strong">금속선</text>
      <text x="65" y="142" textAnchor="middle" className="cf-sub">Al · Ti · W</text>

      <text x="212" y="22" textAnchor="middle" className="cf-title">
        배선 금속의 조건
      </text>
      {CONDITIONS.map((c, i) => {
        const y = 42 + i * 19
        const t = 0.14 + i * 0.12
        return (
          <g key={c}>
            <rect x="130" y={y - 11} width="168" height="16" rx="4" className="cf-b-row" />
            <text x="152" y={y} className="cf-sub dark">
              {i + 1}) {c}
            </text>
            <Show animate={animate} from={t}>
              <text x="140" y={y} textAnchor="middle" className="cf-b-check">
                ✓
              </text>
            </Show>
          </g>
        )
      })}
      {animate && (
        <StepCaption
          dur={DUR}
          x={160}
          y={174}
          items={[
            [0, 0.14, '회로 패턴을 따라 금속선을 이어 줌'],
            [0.14, 0.86, '배선 금속은 여섯 가지 조건을 갖춰야 함'],
            [0.86, 1, '대표 금속: 알루미늄·티타늄·텅스텐'],
          ]}
        />
      )}
    </svg>
  )
}

// 알루미늄 배선 + 베리어 메탈 + 텅스텐 플러그
export function AlBarrier({ animate = true }) {
  const hx = 150
  const hw = 22
  return (
    <svg viewBox="0 0 320 180" className="il cf" role="img" aria-label="알루미늄 배선과 베리어 메탈, 텅스텐 접점">
      {/* 실리콘과 산화막(접점 구멍) */}
      <rect x="40" y="128" width="200" height="26" className="cf-si" />
      <text x="140" y="146" textAnchor="middle" className="cf-on-dark">실리콘(Si)</text>
      <path d={`M40 92 H${hx} V128 H${hx + hw} V92 H240 V128 H40 Z`} className="cf-oxide" />

      {/* ① 베리어 메탈: 구멍 안쪽과 윗면을 얇게 덮음 */}
      <Show animate={animate} from={0.05}>
        <path d={`M40 92 H${hx} V128 H${hx + hw} V92 H240`} className="cf-b-barrier" />
      </Show>
      {/* ② 텅스텐(W): 좁은 구멍을 CVD로 채움 */}
      <rect x={hx + 2} y={animate ? 128 : 94} width={hw - 4} height={animate ? 0 : 34} className="cf-b-w">
        {animate && (
          <>
            <Anim attr="height" points={[[0.33, 0], [0.55, 34]]} dur={DUR} />
            <Anim attr="y" points={[[0.33, 128], [0.55, 94]]} dur={DUR} />
          </>
        )}
      </rect>
      {/* ③ 알루미늄 배선 */}
      <rect x="40" y={animate ? 92 : 76} width="200" height={animate ? 0 : 16} className="cf-b-al">
        {animate && (
          <>
            <Anim attr="height" points={[[0.62, 0], [0.8, 16]]} dur={DUR} />
            <Anim attr="y" points={[[0.62, 92], [0.8, 76]]} dur={DUR} />
          </>
        )}
      </rect>

      {/* 이름표 */}
      <Show animate={animate} from={0.8}>
        <line x1="240" y1="84" x2="252" y2="84" className="cf-b-lead" />
        <text x="254" y="87" className="cf-sub dark">알루미늄 배선</text>
      </Show>
      <Show animate={animate} from={0.08}>
        <line x1="240" y1="92" x2="252" y2="100" className="cf-b-lead" />
        <text x="254" y="103" className="cf-sub dark">베리어 메탈</text>
      </Show>
      <Show animate={animate} from={0.55}>
        <line x1={hx + hw / 2} y1="112" x2="110" y2="112" className="cf-b-lead" />
        <text x="108" y="115" textAnchor="end" className="cf-sub dark">텅스텐(W)</text>
      </Show>
      <text x="254" y="122" className="cf-sub">산화막</text>
      <text x="160" y="20" textAnchor="middle" className="cf-title">
        알루미늄은 실리콘과 섞이려 함 → 사이에 장벽
      </text>
      {animate && (
        <StepCaption
          dur={DUR}
          x={160}
          y={172}
          items={[
            [0, 0.3, '① 베리어 메탈을 먼저 얇게 증착'],
            [0.3, 0.6, '② 좁은 접점 구멍은 텅스텐을 CVD로 채움'],
            [0.6, 1, '③ 알루미늄으로 배선을 깜'],
          ]}
        />
      )}
      {!animate && (
        <text x="160" y="172" textAnchor="middle" className="cf-sub">
          베리어 메탈 → 텅스텐 접점 → 알루미늄 배선
        </text>
      )}
    </svg>
  )
}
