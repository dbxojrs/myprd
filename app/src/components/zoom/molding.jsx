import { Appear, Callout, Keys, Note, Path, Vanish, seeded } from './kit.jsx'
import { Arrow } from '../Illustrations.jsx'

// 몰딩 확대 스토리의 장면 그림. 설명 문장은 data/zoomStories/molding.js에 있습니다.
// 장면 1(금형 전체) → 2(캐비티 하나) → 3(EMC 속) → 4(꺼내기·후경화, 흐려지며 넘어감)

// 열을 나타내는 물결선
const Heat = ({ x, y, period = 1.6 }) => (
  <path d={`M${x} ${y} q 3 -3 0 -6 q -3 -3 0 -6 q 3 -3 0 -6`} className="zs-heat-line">
    <animateTransform attributeName="transform" type="translate" values="0 3;0 -2;0 3" dur={`${period}s`} repeatCount="indefinite" />
  </path>
)

// ── 장면 1: 옆에서 자른 금형. 윗금형이 닫히고, 태블릿이 녹고, 플런저가 수지를 밀어 넣습니다. ──
const CAVITIES = [52, 102, 152]
// 윗금형은 빈 공간(포트·런너·캐비티)을 뺀 덩어리들로 그립니다.
const TOP_BLOCKS = [
  [4, 6, 10, 68],
  [30, 6, 22, 60],
  [52, 6, 40, 50],
  [92, 6, 10, 60],
  [102, 6, 40, 50],
  [142, 6, 10, 60],
  [152, 6, 40, 50],
  [192, 6, 4, 68],
]
const FILL = [
  [8.2, 9.8],
  [9, 10.6],
  [9.8, 11.4],
]

const press = {
  dur: 14,
  focus: [98, 52.6, 48, 28.8],
  focusAt: 12.4,
  draw: () => (
    <>
      <rect x="4" y="78" width="192" height="34" className="il-tool" />
      <Appear at={0.8}>
        {[30, 70, 110, 150, 180].map((x) => (
          <Heat key={x} x={x} y={108} />
        ))}
      </Appear>
      <rect x="4" y="74" width="192" height="4" className="il-frame" />
      {CAVITIES.map((x) => (
        <g key={x}>
          <rect x={x + 8} y="67" width="24" height="7" className="il-die" />
          <path d={`M${x + 12} 67 C${x + 12} 61, ${x + 5} 61, ${x + 3} 74`} className="zs-wire-thin" />
          <path d={`M${x + 28} 67 C${x + 28} 61, ${x + 35} 61, ${x + 37} 74`} className="zs-wire-thin" />
        </g>
      ))}

      {/* 녹은 수지: 런너를 따라가며 캐비티를 차례로 채웁니다 */}
      <rect x="14" y="66" width="0" height="8" className="zs-resin">
        <Keys attr="width" keys={[[7.2, 0], [9.4, 182]]} />
      </rect>
      {CAVITIES.map((x, i) => (
        <rect key={x} x={x} y="56" width="0" height="18" className="zs-resin">
          <Keys attr="width" keys={[[FILL[i][0], 0], [FILL[i][1], 40]]} />
        </rect>
      ))}
      <Appear at={12}>
        {CAVITIES.map((x) => (
          <rect key={x} x={x} y="56" width="40" height="18" className="zs-resin-cured" />
        ))}
      </Appear>

      {/* 태블릿: 포트에 떨어져 녹고, 플런저에 밀려 나갑니다 */}
      <Appear at={3.5} fade={0.3}>
        <g transform="translate(0 -30)">
          <Path keys={[[3.5, '0 -30'], [4.3, '0 0']]} />
          <Vanish at={4.8} fade={1}>
            <rect x="16" y="46" width="12" height="18" rx="1" className="il-mold" />
          </Vanish>
        </g>
      </Appear>
      <Appear at={4.8} fade={1}>
        <rect x="14" y="50" width="16" height="16" className="zs-resin">
          <Keys attr="height" keys={[[7, 16], [9.4, 0]]} />
          <Keys attr="y" keys={[[7, 50], [9.4, 66]]} />
        </rect>
      </Appear>
      <Appear at={6.4}>
        <g>
          <Path keys={[[7, '0 0'], [9.4, '0 16']]} />
          <rect x="16" y="-6" width="12" height="56" className="zs-plunger" />
        </g>
      </Appear>

      <g transform="translate(0 -18)">
        <Path keys={[[0.8, '0 -18'], [2.6, '0 0']]} />
        {TOP_BLOCKS.map(([x, y, w, h]) => (
          <rect key={x} x={x} y={y} width={w} height={h} className="il-tool" />
        ))}
        <Note at={0.4} x={122} y={30}>윗금형</Note>
      </g>

      <Note at={0.4} x={110} y={98}>아랫금형 (데워져 있음)</Note>
      <Callout at={1.2} from={[44, 76]} to={[44, 90]} anchor="middle">스트립</Callout>
      <Appear at={3.8}>
        <Vanish at={7.2}>
          <Callout from={[28, 56]} to={[36, 30]} anchor="start">EMC 태블릿</Callout>
        </Vanish>
      </Appear>
      <Callout at={6.8} from={[22, 10]} to={[40, 14]} anchor="start">플런저</Callout>
      <Callout at={8} from={[96, 70]} to={[96, 88]} anchor="middle">런너 (통로)</Callout>
      <Appear at={9.2}>
        <Note x={72} y={51}>캐비티</Note>
        <Note x={172} y={51}>캐비티</Note>
      </Appear>
      <Note at={12.2} x={100} y={118}>금형 안에서 잠시 기다리면 열로 굳음</Note>
    </>
  ),
}

// ── 장면 2: 캐비티 하나를 옆에서 본 모습. 수지가 왼쪽에서 흘러 들어옵니다. ──
const WIRE_L = 'M78 78 C78 40, 40 45, 32 100'
const WIRE_R = 'M122 78 C122 40, 160 45, 168 100'
const cavity = {
  dur: 14,
  focus: [84, 40.4, 32, 19.2],
  focusAt: 12.4,
  draw: () => (
    <>
      <rect x="0" y="0" width="200" height="20" className="il-tool" />
      <rect x="0" y="20" width="10" height="90" className="il-tool" />
      <rect x="190" y="20" width="10" height="90" className="il-tool" />
      <rect x="0" y="110" width="200" height="10" className="il-tool" />
      <rect x="10" y="20" width="180" height="80" className="zs-cavity" />
      <rect x="10" y="100" width="180" height="10" className="il-frame" />
      <rect x="70" y="78" width="60" height="22" className="il-die" />
      <path d={WIRE_L} className="il-wire" />
      <path d={WIRE_R} className="il-wire" />

      <rect x="10" y="20" width="0" height="80" className="zs-resin">
        <Keys attr="width" keys={[[0.8, 0], [12, 180]]} />
      </rect>
      <g transform="translate(10 0)">
        <Path keys={[[0.8, '10 0'], [12, '190 0']]} />
        <Vanish at={12}>
          <path d="M0 22 q 4 10 0 20 q -4 10 0 20 q 4 10 0 18 q -4 8 0 18" className="zs-front" />
        </Vanish>
      </g>
      <Appear at={0.8}>
        <Vanish at={4}>
          <Arrow x1={20} y1={30} x2={44} y2={30} />
          <Note x={32} y={26}>수지 흐름</Note>
        </Vanish>
      </Appear>

      {/* 만약 너무 빠르면 / 너무 느리면 */}
      <Appear at={3.5}>
        <Vanish at={10.5}>
          <path d="M78 78 C96 42, 64 40, 32 100" className="zs-bad-wire" />
          <circle cx="62" cy="52" r="9" className="il-warn-ring" />
          <Note x={44} y={36} className="zs-note-hot">빠르면: 와이어가 밀림</Note>
        </Vanish>
      </Appear>
      <Appear at={7}>
        <Vanish at={10.5}>
          <ellipse cx="172" cy="32" rx="12" ry="7" className="il-void-area" />
          <Note x={150} y={56} className="zs-note-hot">느리면: 빈 곳이 남음</Note>
        </Vanish>
      </Appear>
      <Appear at={10.5}>
        <Note x={100} y={70} className="zs-note-good">알맞게 흐르면 빈 곳 없이 감쌈</Note>
      </Appear>

      <Note at={0.4} x={100} y={92}>다이</Note>
      <Callout at={0.4} from={[150, 56]} to={[176, 70]} anchor="middle">와이어</Callout>
      <Note at={0.4} x={100} y={12}>금형</Note>
      <Note at={0.4} x={100} y={108}>리드프레임</Note>
    </>
  ),
}

// ── 장면 3: EMC 속. 에폭시 수지 속을 실리카 필러가 떠다니다가, 열을 받으면 굳어 멈춥니다. ──
const fillers = (() => {
  const rand = seeded(31)
  const out = []
  while (out.length < 46) {
    const x = -10 + rand() * 240
    const y = 6 + rand() * 108
    const r = 2.5 + rand() * 6
    if (out.some((p) => Math.hypot(p.x - x, p.y - y) < p.r + r + 2)) continue
    out.push({ x, y, r })
  }
  return out
})()
const links = fillers.flatMap((a, i) =>
  fillers.slice(i + 1).filter((b) => Math.hypot(a.x - b.x, a.y - b.y) < a.r + b.r + 14).map((b) => [a, b]),
)

const emc = {
  dur: 12,
  focus: null,
  draw: () => (
    <>
      <rect x="0" y="0" width="200" height="120" className="zs-epoxy" />
      <Appear at={8.6} fade={1.4}>
        <rect x="0" y="0" width="200" height="120" className="zs-epoxy-cured" />
      </Appear>
      <g>
        <Path keys={[[0.5, '0 0'], [8.4, '-18 0']]} />
        <Appear at={8.8} fade={1.4}>
          {links.map(([a, b]) => (
            <line key={`${a.x}-${b.x}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="zs-link" />
          ))}
        </Appear>
        {fillers.map((p) => (
          <circle key={`${p.x}-${p.y}`} cx={p.x} cy={p.y} r={p.r} className="zs-filler" />
        ))}
      </g>
      <Appear at={8}>
        {[20, 60, 100, 140, 180].map((x) => (
          <Heat key={x} x={x} y={120} />
        ))}
      </Appear>

      <Note at={0.6} x={40} y={14}>에폭시 수지</Note>
      <Note at={1.4} x={150} y={14}>동그란 알갱이 = 실리카 가루 (필러)</Note>
      <Appear at={4}>
        <Note x={100} y={60}>필러 → 열팽창을 줄이고 단단하게</Note>
      </Appear>
      <Appear at={8}>
        <Note x={100} y={108} className="zs-note-hot">금형의 열</Note>
      </Appear>
      <Appear at={9.4}>
        <Note x={100} y={72} className="zs-note-good">수지가 굳어 단단해짐</Note>
      </Appear>
    </>
  ),
}

// ── 장면 4: 금형을 열고 스트립을 꺼내 오븐에서 후경화합니다. ──
const PACKAGES = [24, 46, 68]
const cure = {
  dur: 12,
  focus: null,
  draw: () => (
    <>
      <rect x="10" y="80" width="90" height="22" className="il-tool" />
      <g>
        <Path keys={[[0.8, '0 0'], [2.6, '0 -30']]} />
        <rect x="10" y="44" width="90" height="20" className="il-tool" />
      </g>

      <rect x="112" y="34" width="86" height="72" rx="3" className="zs-oven" />
      <rect x="118" y="40" width="74" height="54" rx="2" className="zs-oven-window" />
      <g>
        <Path keys={[[4, '0 0'], [4.8, '0 -8'], [6.6, '100 -8'], [7.2, '100 0']]} />
        <rect x="18" y="76" width="74" height="4" className="il-frame" />
        {PACKAGES.map((x) => (
          <rect key={x} x={x} y="66" width="18" height="10" rx="1" className="zs-resin-cured" />
        ))}
      </g>

      <Appear at={8}>
        {[132, 152, 172].map((x) => (
          <Heat key={x} x={x} y={62} period={1.2} />
        ))}
      </Appear>

      <Note at={0.4} x={55} y={110}>금형</Note>
      <Note at={0.8} x={55} y={30}>① 금형을 엶</Note>
      <Note at={4} x={55} y={58}>② 수지로 감싼 스트립을 꺼냄</Note>
      <Note at={4} x={155} y={28}>오븐 (후경화)</Note>
      <Appear at={8}>
        <Note x={150} y={114}>③ 몇 시간 더 데워 완전히 굳힘</Note>
      </Appear>
    </>
  ),
}

export default { press, cavity, emc, cure }
