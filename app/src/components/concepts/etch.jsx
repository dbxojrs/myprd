import { StepCaption } from '../illustrationKit.jsx'
import { A, M, Phase, T } from './kit.jsx'

// 식각 개념 그림. viewBox 0 0 320 180. animate가 false면 다 끝난 모습만 그립니다.
// 삼성 뉴스룸 5탄(A판)의 그림을 따라 그리지 않고, 글 내용만으로 새로 그렸습니다.

const Cap = ({ animate, dur, items, still }) =>
  animate ? (
    <StepCaption dur={dur} x={160} y={174} items={items} />
  ) : (
    <T x={160} y={174} cls="cf-a-cap">
      {still}
    </T>
  )

// 감광액 무늬와 그 사이 열린 곳
const PR = [
  [30, 80],
  [110, 150],
  [180, 220],
  [250, 290],
]
const OPEN = [
  [80, 110],
  [150, 180],
  [220, 250],
]

// ── 식각 원리: 감광액이 덮은 곳만 남기고 부식액으로 벗겨 낸 뒤 감광액 제거 ──
export function EtchPrinciple({ animate = true }) {
  const D = '11s'
  const drops = [44, 64, 92, 124, 140, 164, 196, 232, 268]
  return (
    <svg viewBox="0 0 320 180" className="il cf cf-a" role="img" aria-label="감광액이 덮은 곳만 남기는 식각 원리">
      <Phase animate={animate} from={0.15} to={0.58} dur={D}>
        <T x={160} y={20} cls="cf-title">부식액(etchant)</T>
        {drops.map((x, i) => {
          const open = OPEN.some(([a, b]) => x > a && x < b)
          return (
            <circle key={x} cx={x} cy="30" r="3" className="cf-a-etchant">
              <A animate={animate} attr="cy" points={[[0.15 + (i % 3) * 0.05, 30], [0.3 + (i % 3) * 0.05, open ? 112 : 90], [0.58, open ? 112 : 90]]} dur={D} />
            </circle>
          )
        })}
      </Phase>
      <rect x="30" y="128" width="260" height="22" className="cf-si" />
      <T x={160} y={143} cls="cf-on-dark">실리콘 웨이퍼</T>
      <rect x="30" y="104" width="260" height="24" className="cf-oxide" />
      {OPEN.map(([a, b]) => (
        <rect key={a} x={a} y="104" width={b - a} height={animate ? 0 : 24} className="cf-a-hole">
          <A animate={animate} attr="height" points={[[0.2, 0], [0.55, 24]]} dur={D} />
        </rect>
      ))}
      <T x={55} y={120}>막</T>
      {PR.map(([a, b]) =>
        animate ? (
          <rect key={a} x={a} y="94" width={b - a} height="10" className="cf-a-pr">
            <A animate={animate} attr="opacity" points={[[0.6, 1], [0.76, 0], [0.99, 0], [1, 1]]} dur={D} />
          </rect>
        ) : null,
      )}
      <Phase animate={animate} from={0} to={0.6} dur={D}>
        <T x={30} y={80} anchor="start">감광액(PR)</T>
      </Phase>
      <Phase animate={animate} from={0.78} to={1} dur={D} final>
        <T x={160} y={60} cls="cf-a-result">막에 회로 패턴이 남음</T>
      </Phase>
      <Cap
        animate={animate}
        dur={D}
        still="감광액이 덮였던 곳만 남아 회로 패턴이 됨"
        items={[
          [0, 0.15, '포토공정에서 남긴 감광액이 막을 덮고 있음'],
          [0.15, 0.58, '부식액이 덮이지 않은 곳만 벗겨 냄'],
          [0.58, 0.78, '식각이 끝나면 감광액도 제거'],
          [0.78, 1, '막에 회로 패턴 완성'],
        ]}
      />
    </svg>
  )
}

// 작은 웨이퍼 단면(막 + 감광액, 열린 곳이 깎임)
function MiniStack({ x0, y0, animate, dur, from, to }) {
  const pr = [
    [0, 30],
    [50, 80],
    [100, 130],
  ]
  const open = [
    [30, 50],
    [80, 100],
  ]
  return (
    <g>
      <rect x={x0} y={y0 + 22} width="130" height="14" className="cf-si" />
      <rect x={x0} y={y0 + 8} width="130" height="14" className="cf-oxide" />
      {open.map(([a, b]) => (
        <rect key={a} x={x0 + a} y={y0 + 8} width={b - a} height={animate ? 0 : 14} className="cf-a-hole">
          <A animate={animate} attr="height" points={[[from, 0], [to, 14]]} dur={dur} />
        </rect>
      ))}
      {pr.map(([a, b]) => (
        <rect key={a} x={x0 + a} y={y0} width={b - a} height="8" className="cf-a-pr" />
      ))}
    </g>
  )
}

// ── 습식 vs 건식: 용액의 화학 반응 vs 반응성 기체·이온 ──
export function WetDry({ animate = true }) {
  const D = '10s'
  return (
    <svg viewBox="0 0 320 180" className="il cf cf-a" role="img" aria-label="습식 식각과 건식 식각 비교">
      {/* 습식 */}
      <T x={80} y={18} cls="cf-title">습식 식각 (Wet)</T>
      <path d="M12 40 L12 146 L148 146 L148 40" className="cf-a-tank" />
      <rect x="13" y="58" width="134" height="87" className="cf-a-liquid" />
      <T x={80} y={52}>용액(부식액)</T>
      <MiniStack x0={15} y0={96} animate={animate} dur={D} from={0.1} to={0.6} />
      {[30, 60, 95, 125].map((x, i) => (
        <circle key={x} cx={x} cy="92" r="2" className="cf-a-bubble" opacity={animate ? 1 : 0}>
          <M animate={animate} points={[[0.1 + i * 0.1, '0,0'], [0.3 + i * 0.1, '0,-28']]} dur={D} />
          <A animate={animate} attr="opacity" points={[[0.1 + i * 0.1, 1], [0.3 + i * 0.1, 0], [0.31 + i * 0.1, 0]]} dur={D} />
        </circle>
      ))}
      <T x={80} y={158}>화학 반응으로 깎음</T>

      <line x1="160" y1="10" x2="160" y2="160" className="cf-divider" />

      {/* 건식 */}
      <T x={240} y={18} cls="cf-title">건식 식각 (Dry)</T>
      <rect x="172" y="34" width="136" height="112" rx="6" className="cf-a-chamber" />
      <T x={240} y={50}>반응성 기체·이온</T>
      {[186, 206, 226, 246, 266, 286].map((x, i) => (
        <circle key={x} cx={x} cy="62" r="2.6" className={i % 2 ? 'cf-a-ion' : 'cf-a-radical'}>
          <A animate={animate} attr="cy" points={[[(i % 3) * 0.08, 60], [0.25 + (i % 3) * 0.08, 98]]} dur={D} />
        </circle>
      ))}
      <MiniStack x0={175} y0={100} animate={animate} dur={D} from={0.15} to={0.65} />
      <T x={240} y={158}>비싸고 까다롭지만 확대되는 추세</T>
      <Cap
        animate={animate}
        dur={D}
        still="습식 = 용액 · 건식 = 반응성 기체·이온"
        items={[
          [0, 0.5, '습식: 용액의 화학 반응으로 깎음'],
          [0.5, 1, '건식: 반응성 기체·이온으로 특정 부위를 제거'],
        ]}
      />
    </svg>
  )
}

// ── 플라즈마 생성: 진공 챔버 + 가스 + 전기 에너지 → 충돌·이온화 → 연쇄 반응 → 라디칼이 막과 반응 ──
export function PlasmaGen({ animate = true }) {
  const D = '13s'
  const gas = [
    [70, 70],
    [120, 92],
    [170, 66],
    [220, 94],
    [262, 70],
    [100, 60],
  ]
  const chain = [
    [150, 78, 0.5],
    [196, 84, 0.54],
    [88, 88, 0.58],
    [238, 76, 0.62],
    [128, 68, 0.66],
  ]
  return (
    <svg viewBox="0 0 320 180" className="il cf cf-a" role="img" aria-label="플라즈마가 생기는 과정">
      <rect x="20" y="22" width="280" height="128" rx="8" className="cf-a-chamber" />
      <T x={24} y={16} anchor="start">진공 챔버 (대기압보다 낮은 압력)</T>
      <rect x="50" y="30" width="220" height="6" className="cf-a-electrode" />
      <rect x="50" y="30" width="220" height="6" className="cf-a-glow" opacity={animate ? 0 : 1}>
        <A animate={animate} attr="opacity" points={[[0.18, 0], [0.22, 1]]} dur={D} />
      </rect>
      <T x={296} y={16} anchor="end">전기 에너지</T>
      {/* 웨이퍼 */}
      <rect x="50" y="132" width="220" height="8" className="cf-a-electrode" />
      <rect x="80" y="124" width="160" height="8" className="cf-si" />
      <rect x="80" y="119" width="160" height="5" className="cf-oxide" />
      {/* 가스 주입 */}
      <line x1="2" y1="60" x2="20" y2="60" className="cf-a-inlet" />
      <polygon points="20,60 13,56 13,64" className="cf-a-inlet-head" />
      <T x={10} y={52}>가스</T>
      {gas.map(([x, y], i) => (
        <g key={i} opacity={animate ? 0 : 1}>
          <circle cx={x} cy={y} r="4" className="cf-a-gas" />
          <circle cx={x + 6} cy={y} r="4" className="cf-a-gas" />
          <A animate={animate} attr="opacity" points={[[i * 0.03, 0], [i * 0.03 + 0.04, 1]]} dur={D} />
        </g>
      ))}
      {/* 자유전자 충돌 → 이온화 */}
      <Phase animate={animate} from={0.28} to={1} dur={D}>
        <circle cx="40" cy="92" r="2.2" className="cf-a-elec">
          <A animate={animate} attr="cx" points={[[0.28, 40], [0.38, 116]]} dur={D} />
        </circle>
        <Phase animate={animate} from={0.38} to={1} dur={D}>
          <text x="123" y="96" textAnchor="middle" className="cf-a-plus">⊕</text>
          <circle cx="132" cy="102" r="2.2" className="cf-a-elec">
            <M animate={animate} points={[[0.38, '0,0'], [0.48, '30,-12']]} dur={D} />
          </circle>
        </Phase>
      </Phase>
      {/* 연쇄 반응 */}
      {chain.map(([x, y, t]) => (
        <Phase key={`${x}`} animate={animate} from={t} to={1} dur={D} final>
          <text x={x} y={y} textAnchor="middle" className="cf-a-plus">⊕</text>
          <circle cx={x + 9} cy={y + 4} r="2.2" className="cf-a-elec" />
        </Phase>
      ))}
      <ellipse cx="160" cy="80" rx="118" ry="34" className="cf-a-plasma" opacity={animate ? 0 : 0.5}>
        <A animate={animate} attr="opacity" points={[[0.5, 0], [0.7, 0.5]]} dur={D} />
      </ellipse>
      {/* 라디칼이 막과 반응해 떨어져 나감 */}
      <Phase animate={animate} from={0.7} to={1} dur={D} final>
        {[110, 160, 210].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy="96" r="3.2" className="cf-a-radical">
              <A animate={animate} attr="cy" points={[[0.7 + i * 0.03, 96], [0.82 + i * 0.03, 116]]} dur={D} />
            </circle>
            <circle cx={x + 8} cy="117" r="2.6" className="cf-a-film-atom" opacity={animate ? 0 : 1}>
              <A animate={animate} attr="opacity" points={[[0.84 + i * 0.03, 0], [0.85 + i * 0.03, 1], [0.98, 0.2]]} dur={D} />
              <A animate={animate} attr="cy" points={[[0.85 + i * 0.03, 117], [0.98, 96]]} dur={D} />
            </circle>
          </g>
        ))}
        <T x={160} y={147}>막 원자가 휘발되어 떨어져 나감 ↑</T>
      </Phase>
      <T x={160} y={161}>
        <tspan className="cf-a-k-elec">●</tspan> 전자 <tspan className="cf-a-k-ion">⊕</tspan> 이온 <tspan className="cf-a-k-rad">●</tspan> 라디칼 <tspan className="cf-a-k-gas">●</tspan> 가스
      </T>
      <Cap
        animate={animate}
        dur={D}
        still="라디칼이 막 원자와 만나 휘발되어 떨어져 나감"
        items={[
          [0, 0.18, '① 진공 챔버에 가스를 주입'],
          [0.18, 0.28, '② 전기 에너지를 공급'],
          [0.28, 0.48, '③ 자유전자가 충돌해 이온화'],
          [0.48, 0.7, '④ 연쇄 반응(Avalanche) → 플라즈마'],
          [0.7, 1, '⑤ 라디칼이 막과 만나 휘발되어 떨어짐'],
        ]}
      />
    </svg>
  )
}
