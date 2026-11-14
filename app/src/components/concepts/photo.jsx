import { StepCaption } from '../illustrationKit.jsx'
import { A, M, Phase, T } from './kit.jsx'

// 포토 개념 그림. viewBox 0 0 320 180. animate가 false면 다 끝난 모습만 그립니다.
// 삼성 뉴스룸 4탄(A판, B판)의 그림을 따라 그리지 않고, 글 내용만으로 새로 그렸습니다.

const Cap = ({ animate, dur, items, still }) =>
  animate ? (
    <StepCaption dur={dur} x={160} y={174} items={items} />
  ) : (
    <T x={160} y={174} cls="cf-a-cap">
      {still}
    </T>
  )

// ── 포토마스크: 석영 기판 + 크롬 회로. 빛은 크롬이 없는 곳만 지나갑니다 ──
export function Photomask({ animate = true }) {
  const D = '9s'
  const chrome = [
    [70, 100],
    [118, 150],
    [172, 196],
    [214, 250],
  ]
  const gaps = [
    [100, 118],
    [150, 172],
    [196, 214],
  ]
  const rays = []
  for (let x = 76; x <= 244; x += 12) rays.push(x)
  return (
    <svg viewBox="0 0 320 180" className="il cf cf-a" role="img" aria-label="포토마스크를 지나는 빛">
      <rect x="110" y="6" width="100" height="10" rx="3" className="cf-a-lamp" />
      <T x={218} y={14} anchor="start">빛</T>
      {rays.map((x) => (
        <line key={x} x1={x} y1="18" x2={x} y2="56" className="cf-a-ray">
          <A animate={animate} attr="stroke-dashoffset" points={[[0, 0], [1, -60]]} dur={D} />
        </line>
      ))}
      <rect x="70" y="58" width="180" height="14" className="cf-a-quartz" />
      {chrome.map(([a, b]) => (
        <rect key={a} x={a} y="72" width={b - a} height="5" className="cf-a-chrome" />
      ))}
      <T x={64} y={68} anchor="end">석영(Quartz)</T>
      <T x={64} y={78} anchor="end">기판</T>
      <T x={256} y={80} anchor="start">크롬(Cr)</T>
      <T x={256} y={90} anchor="start">회로 무늬</T>
      {/* 투명한 곳만 빛이 지나감 */}
      <g opacity={animate ? 0 : 1}>
        {gaps.flatMap(([a, b]) =>
          [a + 4, (a + b) / 2, b - 4].map((x) => (
            <line key={`${a}-${x}`} x1={x} y1="78" x2={x} y2="130" className="cf-a-ray pass">
              <A animate={animate} attr="stroke-dashoffset" points={[[0, 0], [1, -60]]} dur={D} />
            </line>
          )),
        )}
        <A animate={animate} attr="opacity" points={[[0.3, 0], [0.38, 1]]} dur={D} />
      </g>
      {/* 웨이퍼: 실리콘 + 감광액 */}
      <rect x="70" y="140" width="180" height="16" className="cf-si" />
      <rect x="70" y="132" width="180" height="8" className="cf-a-pr" />
      {gaps.map(([a, b]) => (
        <rect key={a} x={a} y="132" width={b - a} height="8" className="cf-a-exposed" opacity={animate ? 0 : 1}>
          <A animate={animate} attr="opacity" points={[[0.45, 0], [0.65, 1]]} dur={D} />
        </rect>
      ))}
      <T x={256} y={138} anchor="start">감광액</T>
      <T x={256} y={152} anchor="start">웨이퍼</T>
      <Cap
        animate={animate}
        dur={D}
        still="투명한 곳으로만 빛이 지나가 무늬가 옮겨짐"
        items={[
          [0, 0.3, '마스크 = 회로가 담긴 사진 원판'],
          [0.3, 0.6, '크롬이 빛을 가리고 투명한 곳만 통과'],
          [0.6, 1, '마스크 무늬가 감광액에 옮겨짐'],
        ]}
      />
    </svg>
  )
}

// ── 감광액 도포: 산화막 위에 감광액(PR)을 떨어뜨리고 웨이퍼를 돌려 골고루 펴 바름 ──
export function PrCoat({ animate = true }) {
  const D = '9s'
  return (
    <svg viewBox="0 0 320 180" className="il cf cf-a" role="img" aria-label="감광액 도포">
      <rect x="150" y="10" width="20" height="22" rx="2" className="cf-a-nozzle" />
      <polygon points="154,32 166,32 160,40" className="cf-a-nozzle" />
      <T x={178} y={22} anchor="start">감광액(PR) 노즐</T>
      <Phase animate={animate} from={0} to={0.22} dur={D}>
        <circle cx="160" cy="42" r="6" className="cf-a-prdrop">
          <A animate={animate} attr="cy" points={[[0, 42], [0.2, 96]]} dur={D} />
        </circle>
      </Phase>
      {/* 웨이퍼 */}
      <rect x="152" y="126" width="16" height="26" className="cf-a-shaft" />
      <rect x="60" y="110" width="200" height="16" className="cf-si" />
      <rect x="60" y="104" width="200" height="6" className="cf-oxide" />
      <rect x={animate ? 154 : 60} y="96" width={animate ? 12 : 200} height="8" className="cf-a-pr">
        <A animate={animate} attr="x" points={[[0.2, 154], [0.6, 60]]} dur={D} />
        <A animate={animate} attr="width" points={[[0.2, 12], [0.6, 200]]} dur={D} />
      </rect>
      {/* 회전 표시 */}
      <Phase animate={animate} from={0.2} to={0.7} dur={D}>
        <path d="M120 150 A40 9 0 1 0 200 150" className="cf-a-spin" />
        <polygon points="200,150 192,145 193,154" className="cf-a-spin-head" />
        <T x={240} y={160}>회전</T>
        {[-1, 1].map((s) => (
          <circle key={s} cx={160 + s * 100} cy="98" r="2" className="cf-a-prdrop">
            <M animate={animate} points={[[0.4, '0,0'], [0.6, `${s * 24},-10`]]} dur={D} />
          </circle>
        ))}
      </Phase>
      <T x={54} y={102} anchor="end">감광액</T>
      <T x={54} y={110} anchor="end">산화막</T>
      <T x={54} y={122} anchor="end">실리콘</T>
      <Cap
        animate={animate}
        dur={D}
        still="빛에 민감한 감광액 막 = 웨이퍼를 인화지로"
        items={[
          [0, 0.22, '① 산화막 위에 감광액을 떨어뜨림'],
          [0.22, 0.65, '② 웨이퍼를 돌려 골고루 펴 바름'],
          [0.65, 1, '③ 웨이퍼가 빛에 반응하는 인화지가 됨'],
        ]}
      />
    </svg>
  )
}

// ── 노광: 큰 마스크를 렌즈로 줄여 비추고(먼지도 작아짐), 한 칩씩 찍고 옮겨 반복 ──
export function Exposure({ animate = true }) {
  const D = '12s'
  const wcx = 252
  const wcy = 96
  const wr = 54
  const fields = []
  for (let j = -2; j <= 2; j++) {
    for (let i = -2; i <= 2; i++) {
      const x = wcx + i * 20 - 9
      const y = wcy + j * 20 - 9
      const ok = [
        [x, y],
        [x + 18, y],
        [x, y + 18],
        [x + 18, y + 18],
      ].every(([px, py]) => (px - wcx) ** 2 + (py - wcy) ** 2 <= (wr - 1) ** 2)
      if (ok) fields.push({ x, y })
    }
  }
  const step = 0.5 / fields.length
  return (
    <svg viewBox="0 0 320 180" className="il cf cf-a" role="img" aria-label="축소 노광과 반복 촬영">
      {/* 축소 투영 (옆에서 본 모습) */}
      <rect x="50" y="6" width="80" height="8" rx="3" className="cf-a-lamp" />
      <T x={136} y={13} anchor="start">빛</T>
      <rect x="30" y="34" width="120" height="8" className="cf-a-quartz" />
      {[
        [30, 52],
        [70, 92],
        [112, 150],
      ].map(([a, b]) => (
        <rect key={a} x={a} y="42" width={b - a} height="4" className="cf-a-chrome" />
      ))}
      <circle cx="104" cy="38" r="3.5" className="cf-a-dust" />
      <T x={90} y={29}>마스크(크게)</T>
      <polygon points="30,46 150,46 140,74 40,74" className="cf-a-beam">
        <A animate={animate} attr="opacity" points={[[0, 0.25], [0.1, 0.7], [0.45, 0.7], [0.5, 0.35]]} dur={D} />
      </polygon>
      <ellipse cx="90" cy="76" rx="52" ry="6" className="cf-a-lens" />
      <T x={150} y={86} anchor="start">렌즈</T>
      <polygon points="40,78 140,78 112,128 68,128" className="cf-a-beam">
        <A animate={animate} attr="opacity" points={[[0, 0.25], [0.1, 0.7], [0.45, 0.7], [0.5, 0.35]]} dur={D} />
      </polygon>
      <rect x="20" y="128" width="140" height="8" className="cf-si" />
      <rect x="68" y="126" width="44" height="3" className="cf-a-exposed" />
      <circle cx="97" cy="127.5" r="1.3" className="cf-a-dust" />
      <Phase animate={animate} from={0.22} to={1} dur={D} final>
        <line x1="104" y1="40" x2="97" y2="126" className="cf-a-lead dust" />
        <T x={90} y={150}>먼지도 함께 작아짐</T>
      </Phase>

      {/* 스텝 앤 리피트 (위에서 본 웨이퍼) */}
      <T x={wcx} y={30} cls="cf-title">웨이퍼(위에서 봄)</T>
      <circle cx={wcx} cy={wcy} r={wr} className="cf-a-wafer" />
      {fields.map((f, i) => (
        <rect key={`${f.x},${f.y}`} x={f.x} y={f.y} width="18" height="18" className="cf-a-field" opacity={animate ? 0.15 : 1}>
          <A animate={animate} attr="opacity" points={[[0.45 + i * step, 0.15], [0.45 + i * step + 0.005, 1], [0.99, 1], [1, 0.15]]} dur={D} />
        </rect>
      ))}
      {animate && (
        <rect x={fields[0].x - 2} y={fields[0].y - 2} width="22" height="22" className="cf-a-shot" opacity="0">
          <A animate={animate} attr="opacity" points={[[0.45, 0], [0.451, 1], [0.95, 1], [0.96, 0]]} dur={D} />
          <A animate={animate} attr="x" points={fields.map((f, i) => [0.45 + i * step, f.x - 2])} dur={D} />
          <A animate={animate} attr="y" points={fields.map((f, i) => [0.45 + i * step, f.y - 2])} dur={D} />
        </rect>
      )}
      <Cap
        animate={animate}
        dur={D}
        still="한 칩씩 축소 촬영을 반복해 웨이퍼 전면을 찍음"
        items={[
          [0, 0.22, '① 큰 마스크의 회로를 렌즈로 줄여 비춤'],
          [0.22, 0.45, '② 마스크 위 먼지도 함께 작아짐'],
          [0.45, 1, '③ 한 칩씩 찍고 옮겨 반복 → 웨이퍼 전면'],
        ]}
      />
    </svg>
  )
}

// ── 현상: 양성 vs 음성 감광액. 같은 곳에 빛을 비춰도 남는 곳이 반대입니다 ──
export function DevelopPN({ animate = true }) {
  const D = '11s'
  const seg = 20
  const exposed = [1, 3, 5]
  const column = (x0, title, positive) => (
    <g>
      <T x={x0 + 70} y={18} cls="cf-title">{title}</T>
      {/* 마스크와 빛 */}
      <Phase animate={animate} from={0} to={0.32} dur={D}>
        <rect x={x0} y="34" width="140" height="6" className="cf-a-chrome" />
        {exposed.map((k) => (
          <g key={k}>
            <rect x={x0 + k * seg + 2} y="34" width={seg - 4} height="6" className="cf-a-quartz" />
            <rect x={x0 + k * seg + 3} y="40" width={seg - 6} height="62" className="cf-a-beam" opacity="0.6" />
          </g>
        ))}
      </Phase>
      {/* 현상액 */}
      <Phase animate={animate} from={0.32} to={0.7} dur={D}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} cx={x0 + 12 + i * 23} cy="44" r="2.4" className="cf-a-dev">
            <A animate={animate} attr="cy" points={[[0.32 + (i % 3) * 0.04, 44], [0.46 + (i % 3) * 0.04, 98]]} dur={D} />
          </circle>
        ))}
        <T x={x0 + 70} y={36}>현상액</T>
      </Phase>
      {/* 감광액 조각 */}
      {Array.from({ length: 7 }, (_, k) => {
        const isExposed = exposed.includes(k)
        const removed = positive ? isExposed : !isExposed
        if (!animate && removed) return null
        return (
          <g key={k}>
            <rect x={x0 + k * seg} y="104" width={seg} height="10" className="cf-a-pr">
              {removed && <A animate={animate} attr="opacity" points={[[0.4, 1], [0.66, 0], [0.99, 0], [1, 1]]} dur={D} />}
            </rect>
            {isExposed && (
              <rect x={x0 + k * seg} y="104" width={seg} height="10" className="cf-a-exposed" opacity={animate ? 0 : 1}>
                <A
                  animate={animate}
                  attr="opacity"
                  points={removed ? [[0.15, 0], [0.3, 1], [0.4, 1], [0.66, 0], [0.99, 0]] : [[0.15, 0], [0.3, 1], [0.99, 1], [1, 0]]}
                  dur={D}
                />
              </rect>
            )}
          </g>
        )
      })}
      <rect x={x0} y="114" width="140" height="6" className="cf-oxide" />
      <rect x={x0} y="120" width="140" height="16" className="cf-si" />
      <Phase animate={animate} from={0.7} to={1} dur={D} final>
        <T x={x0 + 70} y={150} cls="cf-a-result">{positive ? '빛 받은 곳이 제거됨' : '빛 받은 곳만 남음'}</T>
      </Phase>
    </g>
  )
  return (
    <svg viewBox="0 0 320 180" className="il cf cf-a" role="img" aria-label="양성 감광액과 음성 감광액의 현상 비교">
      {column(10, '양성(Positive) 감광액', true)}
      {column(170, '음성(Negative) 감광액', false)}
      <line x1="160" y1="10" x2="160" y2="160" className="cf-divider" />
      <Cap
        animate={animate}
        dur={D}
        still="같은 곳에 빛을 비춰도 남는 곳이 반대"
        items={[
          [0, 0.32, '① 마스크를 통해 같은 곳에 빛을 비춤'],
          [0.32, 0.7, '② 현상액이 한쪽 영역을 녹여 냄'],
          [0.7, 1, '③ 양성과 음성은 남는 곳이 반대'],
        ]}
      />
    </svg>
  )
}
