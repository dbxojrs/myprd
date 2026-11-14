import { Appear, Callout, Keys, Note, Path, Vanish, grain, seeded } from './kit.jsx'
import { Arrow } from '../Illustrations.jsx'

// 백그라인딩 확대 스토리의 장면 그림. 설명 문장은 data/zoomStories/backgrind.js에 있습니다.
// 장면 1(장비) → 2(휠의 날) → 3(뒷면 단면) → 4(너무 얇으면) → 5(테이프 옮겨 붙이기)

// ── 장면 1: 옆에서 본 연마 장비. 웨이퍼는 앞면(회로)이 아래, 뒷면이 위입니다. ──
// 휠 아래 날(세그먼트)이 옆으로 흘러가는 것으로 휠이 도는 모습을 나타냅니다.
const SEGMENTS = Array.from({ length: 14 }, (_, i) => 62 + i * 10)

const machine = {
  dur: 12,
  focus: [84, 70.4, 32, 19.2],
  focusAt: 10.6,
  draw: () => (
    <>
      <defs>
        <clipPath id="zs-bg-wheel">
          <rect x="70" y="60" width="100" height="20" />
        </clipPath>
      </defs>
      <rect x="30" y="92" width="140" height="12" className="il-tool" />
      <Note at={2.6} x={100} y={101}>척 (웨이퍼를 붙잡고 함께 돎)</Note>

      {/* 보호 테이프를 붙인 웨이퍼가 뒤집혀 척 위에 놓입니다 */}
      <g transform="translate(0 -24)">
        <Path keys={[[0.4, '0 -24'], [2, '0 0']]} />
        <rect x="40" y="88" width="120" height="4" className="il-tape" />
        <rect x="42" y="87" width="116" height="1" className="il-rdl" />
        <rect x="40" y="78" width="120" height="9" className="il-wafer">
          <Keys attr="y" keys={[[8, 78], [12, 82]]} />
          <Keys attr="height" keys={[[8, 9], [12, 5]]} />
        </rect>
      </g>
      <Callout at={1.2} from={[48, 90]} to={[6, 112]}>보호 테이프 (앞면 회로를 지킴)</Callout>
      <Callout at={2} from={[50, 80]} to={[6, 68]}>웨이퍼 뒷면 (갈아낼 면)</Callout>

      {/* 연마 휠 */}
      <g transform="translate(0 -26)">
        <Path keys={[[4, '0 -26'], [5.5, '0 0'], [8, '0 0'], [12, '0 4']]} />
        <rect x="112" y="0" width="16" height="44" className="il-tool" />
        <rect x="70" y="44" width="100" height="22" rx="2" className="il-frame" />
        <g clipPath="url(#zs-bg-wheel)">
          <g>
            <Path loop keys={[[6, '0 0'], [6.8, '-10 0']]} />
            {SEGMENTS.map((x) => (
              <g key={x}>
                <rect x={x} y="66" width="7" height="12" className="zs-bond" />
                <circle cx={x + 2} cy="70" r="0.9" className="il-diamond" />
                <circle cx={x + 5} cy="73" r="0.9" className="il-diamond" />
                <circle cx={x + 3} cy="76.5" r="0.9" className="il-diamond" />
              </g>
            ))}
          </g>
        </g>
        <Callout at={4.6} from={[76, 55]} to={[50, 46]} anchor="end">연마 휠</Callout>
        <Callout at={5.4} from={[166, 72]} to={[184, 52]} anchor="middle">세그먼트</Callout>
      </g>

      {/* 함께 돌며 갈아냄: 가루가 튀고 두께가 줄어듭니다 */}
      <Appear at={8}>
        <Note x={150} y={8}>↻ 휠이 돎</Note>
        <Note x={30} y={86} anchor="middle">↻ 척도 돎</Note>
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={74 + i * 26} cy="80" r="1" className="il-dust" opacity="0">
            <Path loop keys={[[8 + i * 0.25, '0 0'], [9 + i * 0.25, `${i % 2 ? 8 : -8} -12`]]} />
            <Keys loop attr="opacity" keys={[[8 + i * 0.25, 1], [9 + i * 0.25, 0]]} />
          </circle>
        ))}
        <line x1="164" y1="78" x2="164" y2="87" className="il-dim">
          <Keys attr="y1" keys={[[8, 78], [12, 82]]} />
        </line>
        <Note x={168} y={86} anchor="start">두께 ↓</Note>
      </Appear>
    </>
  ),
}

// ── 장면 2: 휠의 날을 확대. 날이 왼쪽으로 지나가며 뒷면을 갑니다. ──
// 거친 연마(굵은 입자, 빠르게) → 미세 연마(고운 입자, 천천히)
const coarseRand = seeded(31)
const COARSE = [
  { points: grain(coarseRand, 10, 54, 6, 6), dim: false },
  { points: grain(coarseRand, 30, 54, 6, 6), dim: false },
  { points: grain(coarseRand, 20, 34, 5, 6), dim: true },
]
const fineRand = seeded(37)
const FINE = Array.from({ length: 5 }, (_, i) => ({
  points: grain(fineRand, 4 + i * 8, i % 2 ? 56 : 42, 2.4, 5),
  dim: i % 2 === 0,
})).concat([{ points: grain(fineRand, 24, 56, 2.4, 5), dim: false }, { points: grain(fineRand, 36, 56, 2.4, 5), dim: false }, { points: grain(fineRand, 4, 56, 2.4, 5), dim: false }])
// 표면의 거칠기(울퉁불퉁한 띠). 거친 연마는 크게, 미세 연마는 작게.
const roughEdge = (amp, seed) => {
  const rand = seeded(seed)
  const pts = ['0,3']
  for (let x = 0; x <= 200; x += 4) pts.push(`${x},${(-rand() * amp).toFixed(1)}`)
  pts.push('200,3')
  return pts.join(' ')
}

const Segment = ({ grits, start, period, drop }) => (
  <g>
    <Path keys={drop} />
    <g>
      <Path loop keys={[[start, '0 0'], [start + period, '-40 0']]} />
      <rect x="-60" y="0" width="320" height="54" className="zs-bond" />
      {Array.from({ length: 7 }, (_, k) =>
        grits.map((g) => (
          <polygon key={`${k}-${g.points}`} points={g.points} transform={`translate(${k * 40 - 40} 0)`} className={g.dim ? 'zs-diamond zs-diamond-dim' : 'zs-diamond'} />
        )),
      )}
    </g>
  </g>
)

const segment = {
  dur: 12,
  focus: [110, 70.4, 40, 24],
  focusAt: 10.8,
  draw: () => (
    <>
      <rect x="0" y="60" width="200" height="60" className="il-wafer">
        <Keys attr="y" keys={[[4, 60], [8, 72], [12, 75]]} />
        <Keys attr="height" keys={[[4, 60], [8, 48], [12, 45]]} />
      </rect>
      {/* 거친 연마로 생긴 울퉁불퉁한 표면 → 미세 연마로 매끈해짐 */}
      <g transform="translate(0 60)">
        <Path keys={[[4, '0 60'], [8, '0 72'], [12, '0 75']]} />
        <Appear at={4.5}>
          <Vanish at={8.6} fade={1.2}>
            <polygon points={roughEdge(3.5, 3)} className="il-wafer" />
          </Vanish>
        </Appear>
        <Appear at={9}>
          <polygon points={roughEdge(0.6, 5)} className="il-wafer" />
        </Appear>
      </g>

      <Vanish at={8} fade={0.8}>
        <Segment grits={COARSE} start={4} period={1.2} drop={[[4, '0 0'], [8, '0 12']]} />
      </Vanish>
      <Appear at={8} fade={0.8}>
        <Segment grits={FINE} start={8} period={2.4} drop={[[8, '0 14'], [12, '0 17']]} />
      </Appear>

      <Appear at={4}>
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={60 + i * 22} cy="66" r="1.1" className="zs-debris" opacity="0">
            <Path loop keys={[[4 + i * 0.2, '0 0'], [5 + i * 0.2, '-20 -4']]} />
            <Keys loop attr="opacity" keys={[[4 + i * 0.2, 1], [5 + i * 0.2, 0]]} />
          </circle>
        ))}
        <line x1="0" y1="60" x2="200" y2="60" className="zs-original" />
        <Note x={196} y={58} anchor="end">원래 뒷면</Note>
      </Appear>

      <Note at={0.8} x={100} y={12}>다이아몬드 입자를 결합재로 굳힌 날</Note>
      <Note at={0.8} x={34} y={104}>웨이퍼 뒷면 (실리콘)</Note>
      <Appear at={4.2}>
        <Vanish at={8}>
          <Note x={100} y={24}>거친 연마 · 굵은 입자로 빠르게 많이</Note>
        </Vanish>
      </Appear>
      <Appear at={8.4}>
        <Note x={100} y={24}>미세 연마 · 고운 입자로 천천히, 매끄럽게</Note>
        <line x1="0" y1="75" x2="200" y2="75" className="il-dim" />
        <Note x={196} y={84} anchor="end">목표 두께</Note>
      </Appear>
    </>
  ),
}

// ── 장면 3: 갈아낸 뒷면의 단면. 표면 아래 손상층(작은 금)을 걷어냅니다. ──
const crackRand = seeded(41)
const CRACKS = Array.from({ length: 16 }, (_, i) => {
  const x = 8 + i * 12 + crackRand() * 6
  const y = 32 + crackRand() * 3
  const d = `M ${x.toFixed(1)} ${y.toFixed(1)} l ${(crackRand() * 4 - 2).toFixed(1)} ${(3 + crackRand() * 3).toFixed(1)} l ${(crackRand() * 4 - 2).toFixed(1)} ${(2 + crackRand() * 3).toFixed(1)}`
  return { d, at: 0.6 + (i % 8) * 0.3 }
})

const damage = {
  dur: 12,
  focus: null,
  draw: () => (
    <>
      <rect x="0" y="30" width="200" height="90" className="il-wafer" />
      <rect x="0" y="30" width="200" height="18" className="zs-damage" />
      {CRACKS.map((c) => (
        <Appear key={c.d} at={c.at}>
          <path d={c.d} className="il-crack" />
        </Appear>
      ))}
      <Appear at={2.6}>
        <Vanish at={7.6}>
          <Callout from={[150, 44]} to={[170, 64]} anchor="middle">미세한 손상층</Callout>
        </Vanish>
      </Appear>
      <Note at={0.8} x={40} y={100}>웨이퍼 (뒷면 쪽 단면)</Note>

      {/* 손상층을 위에서부터 걷어냅니다 */}
      <rect x="0" y="30" width="200" height="0" className="zs-removed">
        <Keys attr="height" keys={[[4.6, 0], [8, 18.5]]} />
      </rect>
      <Appear at={4}>
        <Vanish at={8.4}>
          <g transform="translate(0 0)">
            <Path keys={[[4.6, '0 0'], [8, '0 18.5']]} />
            <g>
              <Path loop keys={[[4, '-6 0'], [4.6, '6 0'], [5.2, '-6 0']]} />
              <rect x="40" y="20" width="120" height="9" rx="2" className="il-tool" />
            </g>
          </g>
          <Note x={100} y={14}>연마·식각 등으로 걷어냄</Note>
        </Vanish>
      </Appear>

      <Appear at={8.4}>
        <line x1="0" y1="30" x2="200" y2="30" className="zs-original" />
        <Note x={196} y={27} anchor="end">손상층이 있던 높이</Note>
        <path d="M 86 70 l 8 8 l 16 -16" className="il-check" />
        <Note x={100} y={92}>깨끗한 면 → 쉽게 깨지지 않음</Note>
      </Appear>
    </>
  ),
}

// ── 장면 4: 얇게 만드는 까닭과 너무 얇을 때 ──
const FLAT = 'M 30 80 Q 100 80 170 80 L 170 83 Q 100 83 30 83 Z'
const BENT = 'M 30 70 Q 100 96 170 70 L 170 73 Q 100 99 30 73 Z'

const thin = {
  dur: 12,
  focus: null,
  draw: () => (
    <>
      <Appear at={0.6}>
        <rect x="24" y="16" width="32" height="12" rx="1.5" className="il-mold" />
        <rect x="30" y="23" width="20" height="3" className="il-die" />
        <Note x={40} y={40}>패키지 두께 맞춤</Note>
      </Appear>
      <Appear at={1.6}>
        <rect x="86" y="24" width="28" height="4" className="il-die" />
        {[92, 100, 108].map((x) => (
          <Arrow key={x} x1={x} y1={22} x2={x} y2={10} />
        ))}
        <Note x={100} y={40}>칩의 열을 잘 뺌</Note>
      </Appear>
      <Appear at={2.6}>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={146 + i * 2} y={26 - i * 5} width="24" height="3.5" className="il-die" />
        ))}
        <Note x={160} y={40}>여러 칩을 쌓음</Note>
      </Appear>

      <Appear at={4}>
        <line x1="0" y1="50" x2="200" y2="50" className="il-divider" />
        <path d={FLAT} className="il-wafer">
          <Keys attr="d" keys={[[4.6, FLAT], [6.4, BENT]]} />
        </path>
        <Note x={100} y={62}>너무 얇은 웨이퍼</Note>
      </Appear>
      <Appear at={6.4}>
        <Note x={30} y={64}>휨 ↶</Note>
        <Note x={170} y={64}>↷ 휨</Note>
      </Appear>
      <Appear at={7}>
        <path d="M 100 84 l -2 4 l 3 3 l -2 5" className="il-crack" />
        <circle cx="100" cy="90" r="8" className="il-warn-ring" />
        <Note x={100} y={110}>심하면 금이 가거나 깨짐</Note>
      </Appear>
      <Appear at={8.4}>
        <Note x={100} y={118}>→ 얇을수록 손상층 제거와 조심스러운 운반이 중요</Note>
      </Appear>
    </>
  ),
}

// ── 장면 5: 다이싱 테이프로 옮겨 붙이고 보호 테이프를 뗍니다(이제 앞면이 위) ──
const mount = {
  dur: 10,
  focus: null,
  draw: () => (
    <>
      <rect x="14" y="80" width="18" height="8" className="il-frame" />
      <rect x="168" y="80" width="18" height="8" className="il-frame" />
      <rect x="14" y="88" width="172" height="3" className="il-tape" />
      <Callout at={0.6} from={[22, 84]} to={[22, 104]} anchor="middle">링 프레임</Callout>
      <Callout at={0.9} from={[60, 90]} to={[70, 104]} anchor="middle">다이싱 테이프</Callout>

      <g transform="translate(0 -40)">
        <Path keys={[[1, '0 -40'], [3.2, '0 0']]} />
        <rect x="40" y="83" width="120" height="5" className="il-wafer" />
        <Note x={150} y={98} at={3.4}>얇아진 웨이퍼</Note>
      </g>
      {/* 앞면 보호 테이프: 왼쪽 끝부터 들려 떨어집니다 */}
      <g transform="translate(0 -40)">
        <Path keys={[[1, '0 -40'], [3.2, '0 0'], [5.6, '0 0'], [7.6, '30 -44']]} />
        <Keys attr="opacity" keys={[[6.8, 1], [7.8, 0]]} />
        <rect x="40" y="80" width="120" height="3" className="il-tape" />
        <rect x="40" y="82.5" width="120" height="0.8" className="il-rdl" />
      </g>
      <Appear at={1.6}>
        <Vanish at={5.6}>
          <Note x={100} y={68}>보호 테이프가 붙은 채로 다이싱 테이프 위에 놓음</Note>
        </Vanish>
      </Appear>
      <Appear at={5.4}>
        <Note x={100} y={30}>앞면 보호 테이프를 뗌 ↗</Note>
      </Appear>
      <Appear at={8}>
        <Note x={100} y={116}>→ 다음 공정: 웨이퍼 쏘잉</Note>
      </Appear>
    </>
  ),
}

export default { machine, segment, damage, thin, mount }
