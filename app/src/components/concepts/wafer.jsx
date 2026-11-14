import { StepCaption } from '../illustrationKit.jsx'
import { A, M, Phase, T } from './kit.jsx'

// 웨이퍼 개념 그림. viewBox 0 0 320 180. animate가 false면 다 끝난 모습만 그립니다.
// 삼성 뉴스룸 1탄(A판, B판)·3탄의 그림을 따라 그리지 않고, 글 내용만으로 새로 그렸습니다.

// ── 웨이퍼가 만들어지는 3단계: 잉곳(seed 끌어올리기) → 슬라이싱 → 연마 ──
export function WaferSteps({ animate = true }) {
  const D = '12s'
  return (
    <svg viewBox="0 0 320 180" className="il cf cf-a" role="img" aria-label="잉곳 성장, 슬라이싱, 연마 3단계">
      {/* ① 잉곳: 녹은 실리콘에 seed를 담갔다가 천천히 끌어올림 */}
      <Phase animate={animate} from={0} to={0.4} dur={D}>
        <T x={160} y={16} cls="cf-title">① 잉곳(Ingot) 만들기</T>
        <path d="M40 116 L40 150 Q90 164 140 150 L140 116" className="cf-a-crucible" />
        <rect x="43" y="122" width="94" height="30" className="cf-a-melt" />
        {[34, 146].map((x) => (
          <path key={x} d={`M${x} 124 q4 5 0 10 q-4 5 0 10`} className="cf-a-heat" />
        ))}
        <line x1="90" y1="6" x2="90" y2="30" className="cf-a-rod">
          <A animate={animate} attr="y2" points={[[0, 30], [0.08, 114], [0.38, 34]]} dur={D} />
        </line>
        <rect x="76" y="122" width="28" height="0" rx="3" className="cf-a-ingot">
          <A animate={animate} attr="y" points={[[0, 122], [0.08, 122], [0.38, 42]]} dur={D} />
          <A animate={animate} attr="height" points={[[0, 0], [0.08, 0], [0.38, 80]]} dur={D} />
        </rect>
        <rect x="86" y="30" width="8" height="8" className="cf-a-seed">
          <A animate={animate} attr="y" points={[[0, 30], [0.08, 114], [0.38, 34]]} dur={D} />
        </rect>
        <line x1="104" y1="36" x2="186" y2="36" className="cf-a-lead" />
        <T x={190} y={33} anchor="start">단결정 실리콘(seed)을</T>
        <T x={190} y={44} anchor="start">천천히 끌어올림</T>
        <line x1="137" y1="132" x2="186" y2="104" className="cf-a-lead" />
        <T x={190} y={102} anchor="start">녹인 고순도 실리콘</T>
        <line x1="104" y1="80" x2="186" y2="70" className="cf-a-lead" />
        <T x={190} y={72} anchor="start">자라는 실리콘 기둥 = 잉곳</T>
      </Phase>

      {/* ② 슬라이싱: 다이아몬드 톱으로 얇게 썰기 */}
      <Phase animate={animate} from={0.4} to={0.7} dur={D}>
        <T x={160} y={16} cls="cf-title">② 잉곳 자르기 (Wafer Slicing)</T>
        <rect x="30" y="64" width="150" height="44" rx="4" className="cf-a-ingot" />
        <ellipse cx="180" cy="86" rx="8" ry="22" className="cf-a-ingot-end" />
        <line x1="150" y1="64" x2="150" y2="64" className="cf-a-kerf">
          <A animate={animate} attr="y2" points={[[0.44, 64], [0.6, 108]]} dur={D} />
        </line>
        <circle cx="150" cy="34" r="22" className="cf-a-saw">
          <A animate={animate} attr="cy" points={[[0.4, 34], [0.44, 40], [0.6, 86], [0.66, 40]]} dur={D} />
          <A animate={animate} attr="stroke-dashoffset" points={[[0.4, 0], [0.7, -90]]} dur={D} />
        </circle>
        <T x={150} y={128}>다이아몬드 톱</T>
        {[0, 1, 2].map((i) => (
          <Phase key={i} animate={animate} from={0.5 + i * 0.05} to={0.7} dur={D}>
            <ellipse cx={226 + i * 26} cy="86" rx="6" ry="22" className="cf-a-slice" />
          </Phase>
        ))}
        <T x={252} y={124}>균일한 두께로 얇게</T>
        <T x={105} y={148}>잉곳 지름이 웨이퍼 크기를 결정</T>
      </Phase>

      {/* ③ 연마: 연마액과 연마 장비로 표면을 매끄럽게 */}
      <Phase animate={animate} from={0.7} to={1} dur={D} final>
        <T x={160} y={16} cls="cf-title">③ 표면 연마 (Lapping &amp; Polishing)</T>
        <ellipse cx="150" cy="122" rx="96" ry="22" className="cf-a-wafer" />
        <g className="cf-a-rough" opacity={animate ? 1 : 0}>
          {[90, 118, 146, 174, 202].map((x, i) => (
            <path key={x} d={`M${x} ${116 + (i % 2) * 8} l6 -3 l6 4 l6 -3`} />
          ))}
          <A animate={animate} attr="opacity" points={[[0.74, 1], [0.94, 0]]} dur={D} />
        </g>
        <g>
          <ellipse cx="150" cy="80" rx="48" ry="11" className="cf-a-pad" />
          <rect x="144" y="48" width="12" height="24" className="cf-a-shaft" />
          <M animate={animate} points={[[0.7, '0,0'], [0.76, '24,6'], [0.82, '-24,6'], [0.88, '24,6'], [0.94, '0,0']]} dur={D} />
        </g>
        <rect x="262" y="40" width="14" height="10" className="cf-a-shaft" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="269" cy="54" r="2.4" className="cf-a-slurry">
            <A animate={animate} attr="cy" points={[[0.7 + i * 0.07, 54], [0.78 + i * 0.07, 108]]} dur={D} />
          </circle>
        ))}
        <T x={269} y={36}>연마액</T>
        <T x={150} y={40}>연마 장비(패드)</T>
        <path d="M80 118 Q150 108 220 118" className="cf-a-shine" opacity={animate ? 0 : 1}>
          <A animate={animate} attr="opacity" points={[[0.9, 0], [0.96, 1]]} dur={D} />
        </path>
        <T x={150} y={158}>매끄러운 웨이퍼 = 베어 웨이퍼(Bare wafer)</T>
      </Phase>

      {animate && (
        <StepCaption
          dur={D}
          x={160}
          y={174}
          items={[
            [0, 0.4, '녹인 실리콘에 seed를 접촉시켜 결정을 키움'],
            [0.4, 0.7, '다이아몬드 톱으로 균일하게 얇게 썲'],
            [0.7, 1, '연마액과 연마 장비로 표면을 매끄럽게'],
          ]}
        />
      )}
    </svg>
  )
}

// 원 안에 들어가는 다이 위치를 계산합니다. flatY보다 아래(플랫존 밖)는 빼고, 노치 근처도 뺍니다.
function dieGrid(cx, cy, r, pitch, size, { flatY = Infinity, notch = false } = {}) {
  const out = []
  const n = Math.ceil(r / pitch) + 1
  for (let i = -n; i <= n; i++) {
    for (let j = -n; j <= n; j++) {
      const x = cx + i * pitch - size / 2
      const y = cy + j * pitch - size / 2
      const corners = [
        [x, y],
        [x + size, y],
        [x, y + size],
        [x + size, y + size],
      ]
      const inside = corners.every(([px, py]) => (px - cx) ** 2 + (py - cy) ** 2 <= (r - 2) ** 2)
      if (!inside) continue
      if (y + size > flatY - 2) continue
      if (notch && Math.abs(x + size / 2 - cx) < pitch && y + size > cy + r - 8) continue
      out.push({ x, y, key: `${i},${j}` })
    }
  }
  return out
}

function flatPath(cx, cy, r, flatY) {
  const w = Math.sqrt(r * r - (flatY - cy) ** 2)
  return `M${cx - w} ${flatY} A${r} ${r} 0 1 1 ${cx + w} ${flatY} Z`
}

// ── 웨이퍼 부위 이름: 다이 → 스크라이브 라인 → 플랫존 → 노치 → 노치 vs 플랫존 비교 ──
export function WaferParts({ animate = true }) {
  const D = '14s'
  const cx = 96
  const cy = 90
  const r = 66
  const pitch = 16
  const size = 13
  const flatY = cy + r - 10
  const flatDies = dieGrid(cx, cy, r, pitch, size, { flatY })
  const notchDies = dieGrid(cx, cy, r, pitch, size, { notch: true })
  const hl = flatDies.find((d) => Math.abs(d.x + size / 2 - cx) < 1 && Math.abs(d.y + size / 2 - (cy - pitch)) < 1) ?? flatDies[0]
  const grid = []
  for (let k = -5; k <= 5; k++) grid.push(cx + k * pitch - size / 2 - 1.5)
  const gridY = []
  for (let k = -5; k <= 5; k++) gridY.push(cy + k * pitch - size / 2 - 1.5)

  // 비교용 작은 웨이퍼
  const sr = 50
  const sp = 12
  const ss = 10
  const lcx = 82
  const rcx = 238
  const scy = 86
  const sFlatY = scy + sr - 8
  const smallFlat = dieGrid(lcx, scy, sr, sp, ss, { flatY: sFlatY })
  const smallNotch = dieGrid(rcx, scy, sr, sp, ss, { notch: true })
  const flatKeys = new Set(smallFlat.map((d) => d.key))

  const info = (title, line, from, to) => (
    <Phase animate={animate} from={from} to={to} dur={D}>
      <T x={250} y={70} cls="cf-title">{title}</T>
      <T x={250} y={86}>{line}</T>
    </Phase>
  )

  return (
    <svg viewBox="0 0 320 180" className="il cf cf-a" role="img" aria-label="웨이퍼 부위 이름: 다이, 스크라이브 라인, 플랫존, 노치">
      <defs>
        <clipPath id="cf-a-wafer-clip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      {/* 플랫존 웨이퍼 (다이 → 스크라이브 라인 → 플랫존) */}
      <Phase animate={animate} from={0} to={0.54} dur={D}>
        <path d={flatPath(cx, cy, r, flatY)} className="cf-a-wafer" />
        {flatDies.map((d) => (
          <rect key={d.key} x={d.x} y={d.y} width={size} height={size} className="cf-a-die" />
        ))}
        <Phase animate={animate} from={0} to={0.18} dur={D}>
          <rect x={hl.x - 1} y={hl.y - 1} width={size + 2} height={size + 2} className="cf-a-hl" />
        </Phase>
        <Phase animate={animate} from={0.18} to={0.36} dur={D}>
          <g clipPath="url(#cf-a-wafer-clip)" className="cf-a-scribe">
            {grid.map((x) => (
              <line key={`v${x}`} x1={x} y1={cy - r} x2={x} y2={flatY} />
            ))}
            {gridY.filter((y) => y < flatY).map((y) => (
              <line key={`h${y}`} x1={cx - r} y1={y} x2={cx + r} y2={y} />
            ))}
          </g>
        </Phase>
        <Phase animate={animate} from={0.36} to={0.54} dur={D}>
          <line x1={cx - Math.sqrt(r * r - (flatY - cy) ** 2)} y1={flatY} x2={cx + Math.sqrt(r * r - (flatY - cy) ** 2)} y2={flatY} className="cf-a-mark" />
        </Phase>
      </Phase>
      {/* 노치 웨이퍼 */}
      <Phase animate={animate} from={0.54} to={0.72} dur={D}>
        <circle cx={cx} cy={cy} r={r} className="cf-a-wafer" />
        <polygon points={`${cx - 5},${cy + r + 1} ${cx + 5},${cy + r + 1} ${cx},${cy + r - 6}`} className="cf-a-notchcut" />
        {notchDies.map((d) => (
          <rect key={d.key} x={d.x} y={d.y} width={size} height={size} className="cf-a-die" />
        ))}
        <circle cx={cx} cy={cy + r - 2} r="9" className="cf-a-ring" />
      </Phase>
      {info('② 다이(Die)', 'IC칩 하나하나', 0, 0.18)}
      {info('③ 스크라이브 라인', '다이를 잘라낼 수 있게 둔 폭', 0.18, 0.36)}
      {info('④ 플랫존(Flat Zone)', '웨이퍼 가공 시 기준선', 0.36, 0.54)}
      {info('⑤ 노치(Notch)', '플랫존 대신 작은 홈을 낸 웨이퍼', 0.54, 0.72)}

      {/* 비교: 플랫존 웨이퍼 vs 노치 웨이퍼 */}
      <Phase animate={animate} from={0.72} to={1} dur={D} final>
        <T x={lcx} y={24} cls="cf-title">플랫존 웨이퍼</T>
        <path d={flatPath(lcx, scy, sr, sFlatY)} className="cf-a-wafer" />
        {smallFlat.map((d) => (
          <rect key={d.key} x={d.x} y={d.y} width={ss} height={ss} className="cf-a-die" />
        ))}
        <T x={rcx} y={24} cls="cf-title">노치 웨이퍼</T>
        <circle cx={rcx} cy={scy} r={sr} className="cf-a-wafer" />
        <polygon points={`${rcx - 4},${scy + sr + 1} ${rcx + 4},${scy + sr + 1} ${rcx},${scy + sr - 5}`} className="cf-a-notchcut" />
        {smallNotch.map((d) => (
          <rect key={d.key} x={d.x} y={d.y} width={ss} height={ss} className={flatKeys.has(d.key) ? 'cf-a-die' : 'cf-a-die extra'} />
        ))}
        <T x={rcx} y={152}>
          <tspan className="cf-a-extra-text">■</tspan> 플랫존을 깎지 않아 더 생긴 다이
        </T>
      </Phase>

      {animate && (
        <StepCaption
          dur={D}
          x={160}
          y={172}
          items={[
            [0, 0.18, '사각형 하나하나가 회로가 들어간 IC칩'],
            [0.18, 0.36, '다이 사이 길을 따라 다이아몬드 톱으로 자름'],
            [0.36, 0.54, '한쪽을 평평하게 깎아 기준으로 씀'],
            [0.54, 0.72, '플랫존 대신 작은 홈(노치)만 냄'],
            [0.72, 1, '노치 웨이퍼가 다이를 더 많이 만들어 효율이 높음'],
          ]}
        />
      )}
      {!animate && (
        <T x={160} y={172} cls="cf-a-cap">
          노치 웨이퍼가 다이를 더 많이 만들어 효율이 높음
        </T>
      )}
    </svg>
  )
}

// ── 웨이퍼 → 다이 → 소자: 점점 확대해 들어가며 칩 안의 부품 4종을 봅니다 ──
export function WaferDieDevice({ animate = true }) {
  const D = '12s'
  const wcx = 78
  const wcy = 88
  const wr = 58
  const dies = dieGrid(wcx, wcy, wr, 14, 11, {})
  const pick = dies.find((d) => Math.abs(d.x + 5.5 - wcx - 14) < 1 && Math.abs(d.y + 5.5 - wcy + 14) < 1) ?? dies[0]
  const blocks = [
    [196, 40, 40, 30],
    [242, 40, 50, 18],
    [242, 62, 50, 8],
    [196, 76, 26, 52],
    [228, 76, 64, 24],
    [228, 106, 30, 22],
    [264, 106, 28, 22],
  ]
  return (
    <svg viewBox="0 0 320 180" className="il cf cf-a" role="img" aria-label="웨이퍼 안의 다이, 다이 안의 소자">
      {/* 1) 웨이퍼 → 다이 */}
      <Phase animate={animate} from={0} to={0.4} dur={D}>
        <T x={wcx} y={20} cls="cf-title">웨이퍼</T>
        <circle cx={wcx} cy={wcy} r={wr} className="cf-a-wafer" />
        {dies.map((d) => (
          <rect key={d.key} x={d.x} y={d.y} width="11" height="11" className="cf-a-die" />
        ))}
        <rect x={pick.x - 1.5} y={pick.y - 1.5} width="14" height="14" className="cf-a-hl" />
        <Phase animate={animate} from={0.12} to={0.4} dur={D}>
          <line x1={pick.x + 13} y1={pick.y} x2="190" y2="34" className="cf-a-zoom" />
          <line x1={pick.x + 13} y1={pick.y + 12} x2="190" y2="134" className="cf-a-zoom" />
          <rect x="190" y="34" width="108" height="100" className="cf-a-chip" />
          {blocks.map(([x, y, w, h]) => (
            <rect key={`${x},${y}`} x={x} y={y} width={w} height={h} className="cf-a-block" />
          ))}
          <T x={244} y={24} cls="cf-title">다이(IC칩) 하나</T>
        </Phase>
      </Phase>
      {/* 2) 다이 안의 소자 4종 */}
      <Phase animate={animate} from={0.4} to={1} dur={D} final>
        <T x={160} y={16} cls="cf-title">다이 안에는 수천~수백만 개 이상의 부품</T>
        {/* 트랜지스터: 스위치 */}
        <rect x="14" y="26" width="140" height="62" rx="6" className="cf-a-cell" />
        <line x1="34" y1="62" x2="56" y2="62" className="cf-a-wire" />
        <line x1="56" y1="62" x2="80" y2="50" className="cf-a-switch">
          <A animate={animate} attr="y2" points={[[0.45, 50], [0.55, 62], [0.65, 50], [0.75, 62], [0.85, 50]]} dur={D} />
        </line>
        <line x1="80" y1="62" x2="102" y2="62" className="cf-a-wire" />
        <circle cx="56" cy="62" r="2" className="cf-a-dot" />
        <circle cx="80" cy="62" r="2" className="cf-a-dot" />
        <T x={128} y={46} cls="cf-title">트랜지스터</T>
        <T x={128} y={60}>켜고 끄는</T>
        <T x={128} y={72}>스위치</T>
        {/* 캐패시터: 창고 */}
        <rect x="166" y="26" width="140" height="62" rx="6" className="cf-a-cell" />
        <line x1="184" y1="58" x2="202" y2="58" className="cf-a-wire" />
        <line x1="202" y1="42" x2="202" y2="74" className="cf-a-plate" />
        <line x1="212" y1="42" x2="212" y2="74" className="cf-a-plate" />
        <line x1="212" y1="58" x2="230" y2="58" className="cf-a-wire" />
        {[46, 54, 62, 70].map((y, i) => (
          <text key={y} x="196" y={y + 2} className="cf-a-charge" opacity={animate ? 0 : 1}>
            +
            <A animate={animate} attr="opacity" points={[[0.5 + i * 0.05, 0], [0.52 + i * 0.05, 1]]} dur={D} />
          </text>
        ))}
        <T x={270} y={46} cls="cf-title">캐패시터</T>
        <T x={270} y={60}>전하를 보관하는</T>
        <T x={270} y={72}>창고</T>
        {/* 저항: 조절 */}
        <rect x="14" y="96" width="140" height="62" rx="6" className="cf-a-cell" />
        <path d="M24 128 H40 l5 -8 l8 16 l8 -16 l8 16 l8 -16 l5 8 H100" className="cf-a-wire" />
        <circle cx="24" cy="128" r="2.4" className="cf-a-elec">
          <A animate={animate} attr="cx" points={[[0.4, 24], [0.7, 100], [0.71, 24], [1, 100]]} dur={D} />
        </circle>
        <T x={128} y={116} cls="cf-title">저항</T>
        <T x={128} y={130}>전류 흐름을</T>
        <T x={128} y={142}>조절</T>
        {/* 다이오드: 신호 전달 */}
        <rect x="166" y="96" width="140" height="62" rx="6" className="cf-a-cell" />
        <line x1="180" y1="128" x2="200" y2="128" className="cf-a-wire" />
        <polygon points="200,118 200,138 216,128" className="cf-a-diode" />
        <line x1="216" y1="118" x2="216" y2="138" className="cf-a-plate" />
        <line x1="216" y1="128" x2="234" y2="128" className="cf-a-wire" />
        <circle cx="180" cy="128" r="2.4" className="cf-a-elec">
          <A animate={animate} attr="cx" points={[[0.45, 180], [0.75, 234], [0.76, 180], [1, 234]]} dur={D} />
        </circle>
        <T x={270} y={116} cls="cf-title">다이오드</T>
        <T x={270} y={130}>신호를 고르게</T>
        <T x={270} y={142}>전함</T>
      </Phase>
      {animate ? (
        <StepCaption
          dur={D}
          x={160}
          y={174}
          items={[
            [0, 0.12, '웨이퍼 위 사각형 하나가 다이(IC칩)'],
            [0.12, 0.4, '다이 하나를 크게 확대하면'],
            [0.4, 1, '스위치·창고·조절·전달 역할의 부품이 모여 있음'],
          ]}
        />
      ) : (
        <T x={160} y={174} cls="cf-a-cap">
          웨이퍼 → 다이 → 소자
        </T>
      )}
    </svg>
  )
}
