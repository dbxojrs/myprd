import { Appear, Callout, Keys, Note, Path, Spin, Vanish, grain, seeded } from './kit.jsx'
import { Arrow } from '../Illustrations.jsx'

// 웨이퍼 쏘잉 확대 스토리의 장면 그림. 설명 문장은 data/zoomStories/waferSaw.js에 있습니다.
// 장면 1(장비) → 2(블레이드 옆모습) → 3(날 끝) → 4(입자 하나) → 5(닳은 날)

// ── 장면 1: 위에서 본 웨이퍼와 링 프레임 ──
const C = { x: 62, y: 60 }
const R = 40
const PITCH = 10
const dieCells = Array.from({ length: 10 }, (_, i) => C.x + PITCH * (i - 5) + PITCH / 2 + 0.6)

const machine = {
  dur: 12,
  focus: [76, 55.4, 32, 19.2],
  focusAt: 11,
  draw: () => (
    <>
      <defs>
        <clipPath id="zs-ws-wafer">
          <circle cx={C.x} cy={C.y} r={R} />
        </clipPath>
      </defs>
      <circle cx={C.x} cy={C.y} r="50" className="zs-ring" />
      <circle cx={C.x} cy={C.y} r="47" className="il-tape" />
      <circle cx={C.x} cy={C.y} r={R} className="il-wafer" />
      <g clipPath="url(#zs-ws-wafer)">
        {dieCells.map((x) =>
          dieCells.map((y) => <rect key={`${x}-${y}`} x={x} y={y - C.x + C.y} width={PITCH - 1.2} height={PITCH - 1.2} className="zs-die-top" />),
        )}
        {/* 자른 줄: 블레이드가 지나간 만큼 늘어납니다 */}
        <line x1="14" y1="55" x2="14" y2="55" className="zs-cut">
          <Keys attr="x2" keys={[[8, 14], [9.3, 106]]} />
        </line>
        <line x1="14" y1="65" x2="14" y2="65" className="zs-cut">
          <Keys attr="x2" keys={[[9.4, 14], [10.7, 92]]} />
        </line>
      </g>

      <Callout at={0.8} from={[94.1, 21.7]} to={[122, 16]}>링 프레임</Callout>
      <Callout at={1.6} from={[101.9, 41.4]} to={[122, 30]}>다이싱 테이프</Callout>
      <Callout at={2.4} from={[91.5, 46]} to={[122, 44]}>웨이퍼 (칩이 바둑판처럼)</Callout>

      {/* 정렬 카메라: 십자선이 스크라이브 라인으로 가서 맞춥니다 */}
      <Appear at={4}>
        <rect x="142" y="88" width="16" height="10" rx="2" className="il-tool" />
        <circle cx="150" cy="93" r="3" className="il-hole" />
        <Note x={150} y={106}>정렬 카메라</Note>
        <g transform="translate(150 86)">
          <Path keys={[[4.4, '150 86'], [6.4, '45 55']]} />
          <circle r="4" className="zs-crosshair" />
          <line x1="-6" y1="0" x2="6" y2="0" className="zs-crosshair" />
          <line x1="0" y1="-6" x2="0" y2="6" className="zs-crosshair" />
        </g>
      </Appear>
      <Appear at={6.4}>
        <line x1="22" y1="55" x2="102" y2="55" className="zs-street-hi" />
        <Callout from={[98, 55]} to={[122, 60]}>스크라이브 라인 (칩 사이 빈 길)</Callout>
      </Appear>

      {/* 블레이드: 위에서 보면 얇은 선입니다 */}
      <Appear at={7.6}>
        <g transform="translate(-48 0)">
          <Path keys={[[8, '-48 0'], [9.3, '44 0'], [9.4, '-48 10'], [10.7, '30 10']]} />
          <rect x="52" y="54" width="20" height="2" rx="1" className="il-blade-top" />
        </g>
      </Appear>
      <Callout at={10.4} from={[103, 66]} to={[122, 76]}>블레이드 (위에서 보면 얇은 선)</Callout>
      <Note at={11} x={62} y={117}>한 방향을 다 자르면 90° 돌려 나머지 방향을 자름</Note>
    </>
  ),
}

// ── 장면 2: 옆에서 본 블레이드. 척이 웨이퍼를 날 아래로 지나가게 합니다. ──
const BLADE = { x: 100, y: 52, r: 44, hub: 32 }
const side = {
  dur: 12,
  focus: [94, 76.4, 32, 19.2],
  focusAt: 10.4,
  draw: () => (
    <>
      <g>
        <Path keys={[[6, '0 0'], [12, '-40 0']]} />
        <rect x="-60" y="100" width="320" height="20" className="il-tool" />
        <rect x="-60" y="94" width="320" height="6" className="il-tape" />
        <rect x="-60" y="82" width="320" height="12" className="il-wafer" />
        <rect x="100" y="82" width="0" height="13" className="zs-kerf">
          <Keys attr="width" keys={[[6, 0], [12, 40]]} />
        </rect>
      </g>

      <g transform="translate(0 -20)">
        <Path keys={[[4, '0 -20'], [6, '0 0']]} />
        <Spin cx={BLADE.x} cy={BLADE.y} period={1.6}>
          <circle cx={BLADE.x} cy={BLADE.y} r={BLADE.r} className="zs-blade-disc" />
          {Array.from({ length: 36 }, (_, i) => {
            const a = (i / 36) * Math.PI * 2
            return <circle key={i} cx={BLADE.x + 42.5 * Math.cos(a)} cy={BLADE.y + 42.5 * Math.sin(a)} r="0.9" className="il-diamond" />
          })}
          <circle cx={BLADE.x} cy={BLADE.y} r={BLADE.hub} className="il-frame" />
          {[0, 60, 120].map((deg) => (
            <line key={deg} x1={BLADE.x} y1={BLADE.y} x2={BLADE.x + 30 * Math.cos((deg * Math.PI) / 180)} y2={BLADE.y + 30 * Math.sin((deg * Math.PI) / 180)} className="zs-spoke" />
          ))}
          <circle cx={BLADE.x} cy={BLADE.y} r="6" className="il-hole" />
        </Spin>
        <Callout at={0.9} from={[82, 40]} to={[40, 24]} anchor="end">알루미늄 허브</Callout>
        <Callout at={1.8} from={[137, 70]} to={[150, 36]}>노출된 날</Callout>
      </g>

      <Callout at={4.3} from={[40, 88]} to={[20, 72]} anchor="middle">웨이퍼</Callout>
      <Note at={4.3} x={30} y={113}>진공 척</Note>
      <Callout at={5.2} from={[160, 97]} to={[172, 112]} anchor="middle">다이싱 테이프까지 살짝</Callout>
      <Appear at={6.2}>
        <Arrow x1={190} y1={76} x2={162} y2={76} />
        <Note x={176} y={72}>척이 움직임</Note>
      </Appear>
      <Callout at={8.6} from={[75, 88]} to={[52, 70]} anchor="middle">자른 홈 (커프)</Callout>

      {/* 냉각수와 가루 */}
      <Appear at={8}>
        <rect x="164" y="58" width="20" height="7" rx="1.5" className="il-tool" />
        <Note x={174} y={55}>냉각수</Note>
        <line x1="166" y1="64" x2="128" y2="80" className="il-water">
          <animate attributeName="stroke-dashoffset" values="0;-12" dur="0.4s" repeatCount="indefinite" />
        </line>
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx="110" cy="82" r="1" className="il-dust" opacity="0">
            <Path loop keys={[[8 + i * 0.18, '0 0'], [8.9 + i * 0.18, `${-30 - i * 4} ${-6 - i * 2}`]]} />
            <Keys loop attr="opacity" keys={[[8 + i * 0.18, 1], [8.9 + i * 0.18, 0]]} />
          </circle>
        ))}
      </Appear>
    </>
  ),
}

// ── 장면 3: 날 끝 확대. 날 면을 정면으로 본 모습입니다. ──
// 아래로 볼록한 큰 원호가 날 끝입니다. 오른쪽 아래는 아직 안 자른 실리콘, 왼쪽 아래는 이미 갈려 나간 홈입니다.
const EDGE = { x: 100, y: -85, r: 200, hub: 145 }
const edgeGrits = (() => {
  const rand = seeded(11)
  const out = []
  for (let deg = -34; deg <= 40; deg += 1.6) {
    const r = EDGE.r - 2 - rand() * 3
    const a = ((90 - deg) * Math.PI) / 180
    out.push(grain(rand, EDGE.x + r * Math.cos(a), EDGE.y + r * Math.sin(a), 2 + rand() * 1.3))
  }
  return out
})()
const innerGrits = (() => {
  const rand = seeded(23)
  return Array.from({ length: 70 }, () => {
    const deg = -34 + rand() * 74
    const r = EDGE.hub + 6 + rand() * (EDGE.r - EDGE.hub - 14)
    const a = ((90 - deg) * Math.PI) / 180
    return grain(rand, EDGE.x + r * Math.cos(a), EDGE.y + r * Math.sin(a), 1.2 + rand() * 1)
  })
})()

const edge = {
  dur: 12,
  focus: [144, 94.4, 32, 19.2],
  focusAt: 10,
  draw: () => (
    <>
      <rect x="0" y="40" width="100" height="72" className="zs-kerf" />
      <rect x="100" y="40" width="100" height="72" className="il-wafer" />
      <rect x="0" y="112" width="200" height="8" className="il-tape" />

      <g>
        {/* 장면 2와 같은 방향(시계 방향)으로 천천히 돕니다. 입자 무늬가 이어지게 조금만 돌리고 되풀이합니다. */}
        <animateTransform attributeName="transform" type="rotate" from={`0 ${EDGE.x} ${EDGE.y}`} to={`3.2 ${EDGE.x} ${EDGE.y}`} begin="4s" dur="2.4s" repeatCount="indefinite" />
        <circle cx={EDGE.x} cy={EDGE.y} r={EDGE.r} className="zs-bond" />
        {innerGrits.map((points) => (
          <polygon key={points} points={points} className="zs-diamond zs-diamond-dim" />
        ))}
        {edgeGrits.map((points) => (
          <polygon key={points} points={points} className="zs-diamond" />
        ))}
        <circle cx={EDGE.x} cy={EDGE.y} r={EDGE.hub} className="il-frame" />
      </g>

      <Note at={0.8} x={100} y={46}>허브</Note>
      <Callout at={1.4} from={[60, 80]} to={[24, 58]} anchor="middle">니켈 결합재</Callout>
      <Callout at={2.2} from={[60, 107]} to={[60, 90]} anchor="middle">다이아몬드 입자</Callout>
      <Note at={2.8} x={172} y={84}>실리콘</Note>
      <Note at={2.8} x={40} y={118}>← 이미 갈려 나간 홈</Note>

      <Appear at={4}>
        <Arrow x1={116} y1={100} x2={90} y2={101} />
        <Note x={104} y={95}>입자가 이쪽으로 지나감</Note>
      </Appear>

      {/* 실리콘과 맞닿는 곳에서 가루가 떨어져 나옵니다 */}
      <Appear at={8}>
        {[[176, 96], [162, 104], [146, 109], [130, 112]].map(([x, y], i) => (
          <circle key={x} cx={x} cy={y} r="1.1" className="zs-debris" opacity="0">
            <Path loop keys={[[8 + i * 0.3, '0 0'], [9.4 + i * 0.3, '-34 2']]} />
            <Keys loop attr="opacity" keys={[[8 + i * 0.3, 1], [9.4 + i * 0.3, 0]]} />
          </circle>
        ))}
        <Note x={130} y={118}>조금씩 갈려 나오는 실리콘 가루</Note>
      </Appear>
    </>
  ),
}

// ── 장면 4: 다이아몬드 입자 하나 ──
// 결합재·입자·아직 안 깎인 층이 함께 왼쪽으로 지나갑니다(4초마다 한 번). 입자 왼쪽은 아직 안 깎인 층입니다.
const PASS = 4
const chipRand = seeded(5)
const chips = [160, 130, 100, 70, 40].map((x) => ({
  x,
  // 입자 끝이 x를 지나는 시각. 입자 끝 위치 = 220 - 60 × (t - 0.8). 두 번째로 지날 때부터 가루가 나옵니다.
  t: 0.8 + (220 - x) / (240 / PASS) + PASS,
  points: grain(chipRand, 0, 0, 1.6 + chipRand() * 1.2, 4),
}))
const GRIT = '84,30 116,28 122,44 112,62 100,67 90,60 80,44'

const grit = {
  dur: 14,
  focus: null,
  draw: () => (
    <>
      <g>
        <Path keys={[[10.5, '0 0'], [14, '0 6']]} />
        <rect x="0" y="66" width="200" height="54" className="il-wafer" />
        <g transform="translate(120 0)">
          <Path loop keys={[[0.8, '120 0'], [0.8 + PASS, '-120 0']]} />
          <rect x="-400" y="62" width="500" height="4.4" className="il-wafer" />
          <path d="M -400 0 L 600 0 L 600 50 Q 450 53 300 50 Q 200 47 120 51 Q 100 52 80 51 Q 0 48 -100 51 Q -250 54 -400 50 Z" className="zs-bond" />
          {[-140, -60, 160, 260, 340].map((x) => (
            <polygon key={x} points={grain(seeded(x + 500), x, 26, 8, 6)} className="zs-diamond zs-diamond-dim" />
          ))}
          <polygon points={GRIT} className="zs-diamond zs-grit-main" />
          <Appear at={3.5}>
            <circle cx="100" cy="64" r="6" className="zs-heat">
              <Keys attr="opacity" keys={[[7, 1], [7.8, 0.3]]} />
            </circle>
            <path d="M 100 66 l -4 5 m 4 -5 l 3 6 m -3 -6 l -1 7" className="il-crack" />
          </Appear>
          <Appear at={10.5}>
            {[80, 160].map((dx) => (
              <polygon key={dx} points={GRIT} transform={`translate(${dx} 4) scale(0.8)`} className="zs-diamond" style={{ transformOrigin: '100px 50px' }} />
            ))}
          </Appear>
          <Note at={0.4} x={101} y={47}>다이아몬드</Note>
        </g>

        <Appear at={3.5}>
          {chips.map((c) => (
            <polygon key={c.x} points={c.points} transform={`translate(${c.x} 63)`} className="zs-debris" opacity="0">
              <Path loop keys={[[c.t, `${c.x} 63`], [c.t + 1.4, `${c.x - 24} 46`], [c.t + PASS, `${c.x - 24} 46`]]} />
              <Keys loop attr="opacity" keys={[[c.t, 1], [c.t + 1.4, 0], [c.t + PASS, 0]]} />
            </polygon>
          ))}
        </Appear>
      </g>

      <Note at={0.8} x={30} y={14}>니켈 결합재</Note>
      <Note at={0.8} x={30} y={100}>실리콘</Note>
      <Note at={4.5} x={160} y={14}>떨어져 나오는 실리콘 조각</Note>
      <Note at={4.5} x={160} y={22} className="zs-note-hot">문지르는 곳에서 열이 남</Note>

      <Appear at={7}>
        {[55, 58.5].map((y, i) => (
          <line key={y} x1="0" y1={y} x2="200" y2={y} className="il-water">
            <animate attributeName="stroke-dashoffset" values="0;12" dur={`${0.5 + i * 0.2}s`} repeatCount="indefinite" />
          </line>
        ))}
        <Note x={160} y={32}>물이 가루와 열을 씻어 냄 ←</Note>
      </Appear>

      <Appear at={10.5}>
        <line x1="0" y1="62" x2="200" y2="62" className="zs-original" />
        <Note x={186} y={60} anchor="end">원래 표면</Note>
        <Note x={100} y={112}>수많은 입자가 빠르게 되풀이 → 홈이 깊어짐</Note>
      </Appear>
    </>
  ),
}

// ── 장면 5: 날이 닳으면 ──
// 결합재 아래쪽(웨이퍼에 닿는 면)이 닳아 올라가면서 무뎌진 입자는 빠지고 묻혀 있던 입자가 드러납니다.
const SHARP_A = '50,64 66,62 70,72 60,82 52,74'
const DULL_A = '50,64 66,62 69,70 62,76 52,72'
const SHARP_C = '132,66 148,64 151,74 142,82 134,74'
const DULL_C = '132,66 148,64 150,72 143,76 134,72'

const wear = {
  dur: 12,
  focus: null,
  draw: () => (
    <>
      <Note x={100} y={9}>날 가장자리 단면 (아래쪽이 웨이퍼에 닿는 면)</Note>
      <rect x="10" y="14" width="180" height="60" className="zs-bond">
        <Keys attr="height" keys={[[0.8, 60], [4, 58], [8, 52], [11, 46]]} />
      </rect>
      {/* 묻혀 있다가 드러나는 입자 */}
      <polygon points="92,52 108,50 112,60 102,68 94,62" className="zs-diamond" />
      <polygon points="160,40 174,38 178,48 168,56 160,50" className="zs-diamond" />
      <polygon points="24,30 36,28 40,38 30,44 24,40" className="zs-diamond zs-diamond-dim" />
      <polygon points="120,24 132,22 135,32 126,38 120,34" className="zs-diamond zs-diamond-dim" />

      {/* 날카롭던 입자가 무뎌지고, 빠져나갑니다 */}
      <g>
        <Path keys={[[5, '0 0'], [6.5, '-6 30']]} />
        <Keys attr="opacity" keys={[[5.6, 1], [6.5, 0]]} />
        <Vanish at={2.4} fade={1.2}>
          <polygon points={SHARP_A} className="zs-diamond" />
        </Vanish>
        <Appear at={2.4} fade={1.2}>
          <polygon points={DULL_A} className="zs-diamond zs-dull" />
        </Appear>
      </g>
      <g>
        <Path keys={[[9, '0 0'], [10.5, '6 30']]} />
        <Keys attr="opacity" keys={[[9.6, 1], [10.5, 0]]} />
        <Vanish at={2.8} fade={1.2}>
          <polygon points={SHARP_C} className="zs-diamond" />
        </Vanish>
        <Appear at={2.8} fade={1.2}>
          <polygon points={DULL_C} className="zs-diamond zs-dull" />
        </Appear>
      </g>
      <Appear at={2.8}>
        <Vanish at={5.4}>
          <Note x={60} y={92}>무뎌짐</Note>
          <Note x={142} y={92}>무뎌짐</Note>
        </Vanish>
      </Appear>
      <Appear at={5.4}>
        <Vanish at={8}>
          <Note x={56} y={104}>빠져나감 ↓</Note>
        </Vanish>
      </Appear>
      <Callout at={6.6} from={[102, 66]} to={[102, 92]} anchor="middle">새 입자가 드러남</Callout>

      {/* 드레싱 보드 */}
      <Appear at={8}>
        <g transform="translate(60 0)">
          <Path loop keys={[[8, '60 0'], [10, '-60 0']]} />
          <rect x="0" y="100" width="200" height="12" className="zs-dress" />
        </g>
        <Note x={186} y={118} anchor="end">드레싱 보드를 잘라 새 입자를 세움</Note>
      </Appear>
      <Appear at={10.5}>
        <Callout from={[176, 50]} to={[176, 92]} anchor="middle">새 입자</Callout>
      </Appear>
    </>
  ),
}

export default { machine, side, edge, grit, wear }
