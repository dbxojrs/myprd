import { Appear, Callout, Keys, Note, Path, Vanish } from './kit.jsx'
import { Arrow } from '../Illustrations.jsx'

// 마킹 확대 스토리의 장면 그림. 설명 문장은 data/zoomStories/marking.js에 있습니다.
// 장면 1(장비) → 2(레이저 점) → 3(새긴 깊이 단면) → 4(판독 검사)

// 패키지 위에 새긴 두 줄 글자(예시 글자)
const MarkText = ({ cx, y, top = 'PKG', bottom = 'L01' }) => (
  <>
    <text x={cx} y={y} textAnchor="middle" className="zs-engrave">{top}</text>
    <text x={cx} y={y + 9} textAnchor="middle" className="zs-engrave">{bottom}</text>
  </>
)

// ── 장면 1: 위에서 본 스트립. 카메라가 자리를 맞추고 레이저가 글자를 새깁니다. ──
const PKG_X = Array.from({ length: 6 }, (_, i) => 26 + 30 * i) // 패키지 가운데 x
const WRITING = 2 // 천천히 새기는 모습을 보여 줄 패키지

const machine = {
  dur: 12,
  focus: [70, 64.4, 32, 19.2],
  focusAt: 10.5,
  draw: () => (
    <>
      <defs>
        <clipPath id="zs-mk-writing">
          <rect x={PKG_X[WRITING] - 12} y="64" width="0" height="28">
            <Keys attr="width" keys={[[4.4, 0], [7.4, 24]]} />
          </rect>
        </clipPath>
      </defs>
      <rect x="8" y="58" width="184" height="40" className="il-frame" />
      {PKG_X.map((cx) => (
        <rect key={cx} x={cx - 12} y="64" width="24" height="28" rx="1" className="il-mold" />
      ))}
      <Note at={0.6} x={100} y={108}>몰딩이 끝난 스트립 (패키지가 이어져 있음)</Note>

      {/* 카메라가 패키지마다 새길 자리를 맞춥니다 */}
      <rect x="150" y="6" width="18" height="11" rx="2" className="il-tool" />
      <circle cx="159" cy="11.5" r="3" className="il-hole" />
      <Note x={159} y={25}>카메라</Note>
      <Appear at={0.6}>
        <Vanish at={4}>
          <g transform={`translate(${PKG_X[0]} 78)`}>
            <Path keys={PKG_X.flatMap((cx, i) => [[1 + i * 0.5, `${cx} 78`], [1.3 + i * 0.5, `${cx} 78`]])} />
            <circle r="5" className="zs-crosshair" />
            <line x1="-7" y1="0" x2="7" y2="0" className="zs-crosshair" />
            <line x1="0" y1="-7" x2="0" y2="7" className="zs-crosshair" />
          </g>
        </Vanish>
      </Appear>

      {/* 레이저 헤드와 빛 */}
      <rect x={PKG_X[WRITING] - 12} y="6" width="24" height="12" rx="2" className="il-tool" />
      <Callout at={0.6} from={[PKG_X[WRITING] + 12, 12]} to={[112, 12]}>레이저 헤드</Callout>
      <Appear at={4.2} fade={0.3}>
        <Vanish at={7.5} fade={0.3}>
          <line x1={PKG_X[WRITING]} y1="18" x2="76" y2="76" className="il-laser">
            <Keys attr="x2" keys={[[4.4, 76], [5, 96], [5.1, 76], [5.7, 96], [5.8, 76], [6.4, 96], [6.5, 76], [7.4, 96]]} />
            <Keys attr="y2" keys={[[4.4, 76], [5.05, 76], [5.1, 85], [5.75, 85], [5.8, 76], [6.45, 76], [6.5, 85], [7.4, 85]]} />
          </line>
        </Vanish>
      </Appear>
      <g clipPath="url(#zs-mk-writing)">
        <MarkText cx={PKG_X[WRITING]} y={78} />
      </g>
      {PKG_X.filter((_, i) => i !== WRITING).map((cx, k) => (
        <Appear key={cx} at={8.2 + k * 0.35}>
          <MarkText cx={cx} y={78} />
        </Appear>
      ))}
      <Callout at={8} from={[PKG_X[WRITING] + 6, 76]} to={[112, 42]}>제품 이름 · 로고 · 날짜 · 로트 번호</Callout>
    </>
  ),
}

// ── 장면 2: 레이저 점을 옆에서 확대. 수지 표면이 타서 홈이 되고, 레이저가 움직이며 홈이 이어집니다. ──
const SURFACE = 56
const spot = {
  dur: 12,
  focus: null,
  draw: () => (
    <>
      <rect x="0" y={SURFACE} width="200" height={120 - SURFACE} className="il-mold" />
      <rect x="54" y={SURFACE} width="12" height="0" className="il-groove">
        <Keys attr="height" keys={[[1.5, 0], [6, 6]]} />
        <Keys attr="width" keys={[[8, 12], [12, 102]]} />
      </rect>
      <Note at={0.6} x={40} y={100}>몰딩 수지(EMC) 표면</Note>

      <g>
        <Path keys={[[8, '0 0'], [12, '90 0']]} />
        <polygon points={`52,0 68,0 61,${SURFACE} 59,${SURFACE}`} className="zs-beam" />
        <line x1="60" y1="0" x2="60" y2={SURFACE} className="il-laser" />
        <Appear at={1}>
          <circle cx="60" cy={SURFACE + 1} r="5" className="zs-glow" />
        </Appear>
        <Appear at={4}>
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={58 + i * 1.5} cy={SURFACE - 2} r={1.6 + i * 0.3} className="zs-smoke" opacity="0">
              <Path loop keys={[[4 + i * 0.4, '0 0'], [5.6 + i * 0.4, `${-6 + i * 4} -26`]]} />
              <Keys loop attr="opacity" keys={[[4 + i * 0.4, 0.8], [5.6 + i * 0.4, 0]]} />
            </circle>
          ))}
        </Appear>
      </g>

      <Vanish at={7.6}>
        <Callout at={0.8} from={[60, 22]} to={[92, 18]}>레이저</Callout>
        <Callout at={2} from={[63, SURFACE + 1]} to={[100, 44]}>레이저가 비춘 곳</Callout>
        <Callout at={4} from={[62, SURFACE + 4]} to={[100, 72]}>수지가 타거나 녹아 없어짐</Callout>
      </Vanish>
      <Appear at={8}>
        <Arrow x1={100} y1={30} x2={140} y2={30} />
        <Note x={120} y={24}>레이저가 움직임</Note>
      </Appear>
      <Callout at={9.2} from={[90, SURFACE + 4]} to={[90, 84]} anchor="middle">이어진 홈 = 글자의 한 획</Callout>
    </>
  ),
}

// ── 장면 3: 패키지 단면 세 개로 새긴 깊이 비교 ──
const PANELS = [
  { ox: 4, title: '너무 얕음', depth: 1, keys: [[4.4, 0], [5.6, 1]], note: '글자가 잘 안 읽힘', noteAt: 5.8 },
  { ox: 70, title: '알맞음', depth: 3, keys: [[5.8, 0], [7.2, 3]], note: '표면만 얇게 새김', noteAt: 7.3 },
  { ox: 136, title: '너무 깊음', depth: 15, keys: [[8.4, 0], [10.4, 15]], note: '안쪽 와이어·칩 손상 위험', noteAt: 10.4 },
]

const depth = {
  dur: 12,
  focus: null,
  draw: () => (
    <>
      {PANELS.map((p) => (
        <g key={p.ox}>
          <Note at={0.4} x={p.ox + 30} y={20}>{p.title}</Note>
          <rect x={p.ox} y="30" width="60" height="46" rx="1.5" className="il-mold" />
          <rect x={p.ox + 18} y="66" width="24" height="10" className="il-die" />
          <path d={`M ${p.ox + 20} 66 Q ${p.ox + 8} 22 ${p.ox + 3} 76`} className="il-wire" />
          <path d={`M ${p.ox + 40} 66 Q ${p.ox + 52} 22 ${p.ox + 57} 76`} className="il-wire" />
          <rect x={p.ox} y="76" width="60" height="5" className="il-frame" />
          <rect x={p.ox + 24} y="30" width="12" height="0" className="il-groove">
            <Keys attr="height" keys={p.keys} />
          </rect>
          <Appear at={p.keys[0][0]} fade={0.2}>
            <Vanish at={p.keys[1][0]} fade={0.2}>
              <line x1={p.ox + 30} y1="2" x2={p.ox + 30} y2="30" className="il-laser" />
            </Vanish>
          </Appear>
          <Note at={p.noteAt} x={p.ox + 30} y={97} className={p.depth > 10 ? 'zs-note-hot' : ''}>{p.note}</Note>
        </g>
      ))}
      {/* 가운데 단면에 이름표 */}
      <Note at={0.8} x={100} y={44}>수지</Note>
      <Note at={1.4} x={100} y={74}>칩</Note>
      <Callout at={2} from={[78, 52]} to={[100, 56]} anchor="start">와이어</Callout>
      <Note at={2.6} x={100} y={86}>리드프레임</Note>
      <Appear at={10.4}>
        <circle cx={PANELS[2].ox + 30} cy="45" r="7" className="il-warn-ring" />
      </Appear>
      <Note at={10.6} x={100} y={110}>패키지가 얇을수록 얕게 새기는 기술이 중요</Note>
    </>
  ),
}

// ── 장면 4: 카메라가 글자를 읽어 확인합니다 ──
const INSPECT_X = Array.from({ length: 5 }, (_, i) => 27 + 37 * i)
const BAD = 3 // 글자가 빠진 패키지
const DONE_AT = [1.6, 3, 4.4, 5.8, 7.2]

const inspect = {
  dur: 12,
  focus: null,
  draw: () => (
    <>
      <rect x="6" y="40" width="188" height="46" className="il-frame" />
      {INSPECT_X.map((cx, i) => (
        <g key={cx}>
          <rect x={cx - 15} y="46" width="30" height="34" rx="1" className="il-mold" />
          <MarkText cx={cx} y={60} top={i === BAD ? 'P G' : 'PKG'} />
        </g>
      ))}

      <g transform={`translate(${INSPECT_X[0]} 0)`}>
        <Path
          keys={INSPECT_X.flatMap((cx, i) => [
            [0.8 + i * 1.4, `${cx} 0`],
            [1.6 + i * 1.4, `${cx} 0`],
          ])}
        />
        <polygon points="-3,19 3,19 15,46 -15,46" className="zs-beam" />
        <rect x="-9" y="8" width="18" height="11" rx="2" className="il-tool" />
        <circle cx="0" cy="13.5" r="3" className="il-hole" />
      </g>
      <Note at={0.4} x={100} y={26}>카메라가 글자를 하나씩 읽음</Note>

      {INSPECT_X.map((cx, i) =>
        i === BAD ? (
          <Appear key={cx} at={DONE_AT[i]}>
            <line x1={cx - 4} y1="90" x2={cx + 4} y2="98" className="zs-x" />
            <line x1={cx + 4} y1="90" x2={cx - 4} y2="98" className="zs-x" />
            <circle cx={cx} cy="60" r="9" className="il-warn-ring" />
            <Note x={cx} y={107} className="zs-note-hot">글자가 빠짐</Note>
          </Appear>
        ) : (
          <Appear key={cx} at={DONE_AT[i]}>
            <path d={`M ${cx - 5} 94 l 3 3 l 6 -6`} className="il-check" />
          </Appear>
        ),
      )}
      <Note at={4.2} x={100} y={35}>빠진 글자나 번진 곳이 없는지 확인</Note>
      <Appear at={8.4}>
        <Note x={104} y={117}>확인이 끝나면 다음 공정: 패키지 쏘잉</Note>
        <Arrow x1={156} y1={115} x2={190} y2={115} />
      </Appear>
    </>
  ),
}

export default { machine, spot, depth, inspect }
