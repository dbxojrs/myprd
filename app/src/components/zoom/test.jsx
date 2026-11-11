import { Appear, Callout, Keys, Note, Path, Spin, Vanish } from './kit.jsx'

// 최종 테스트 확대 스토리의 장면 그림. 설명 문장은 data/zoomStories/test.js에 있습니다.
// 장면 1(장비) → 2(소켓 안) → 3(신호 확인) → 4(분류·포장)

// 작은 패키지(위에서 봄). (cx, cy)가 가운데입니다.
const Pkg = ({ cx, cy, w = 14, h = 10 }) => <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx="1" className="il-mold" />

// ── 장면 1: 트레이 → 소켓(테스터 위) → 양품 칸. 핸들러가 레일을 따라 옮깁니다. ──
const TRAY = [[17, 75], [37, 75], [17, 91], [37, 91]]
// 핸들러 위치(노즐 끝 아래 패키지 가운데 기준 오프셋)
const HEAD = [
  [0, '17 0'],
  [0.6, '17 0'],
  [1.2, '17 40'],
  [1.5, '17 40'],
  [2, '17 0'],
  [3, '100 0'],
  [3.6, '100 44'],
  [8.4, '100 44'],
  [9, '100 0'],
  [10, '170 0'],
  [10.6, '170 22'],
  [11, '170 22'],
  [11.4, '170 0'],
]

const machine = {
  dur: 12,
  focus: [84, 72, 32, 19.2],
  focusAt: 11,
  draw: () => (
    <>
      <line x1="6" y1="14" x2="194" y2="14" className="zs-rail" />
      <Note at={0.4} x={100} y={9}>핸들러 (자동 운반 장비)</Note>

      <rect x="6" y="64" width="46" height="36" rx="1.5" className="zs-tray" />
      {TRAY.map(([x, y], i) =>
        i === 0 ? (
          <Vanish key={x + y} at={1.5} fade={0.05}>
            <Pkg cx={x} cy={y} />
          </Vanish>
        ) : (
          <Pkg key={x + y} cx={x} cy={y} />
        ),
      )}
      <Note at={0.6} x={29} y={110}>검사할 패키지</Note>

      <rect x="70" y="90" width="60" height="24" rx="2" className="il-tool" />
      <Note x={100} y={106}>테스터</Note>
      <rect x="86" y="78" width="28" height="12" rx="1" className="il-tool" />
      <rect x="92" y="78" width="16" height="6" className="zs-socket-cavity" />
      <Callout at={1} from={[86, 84]} to={[66, 58]} anchor="middle">테스트 소켓</Callout>

      <rect x="150" y="64" width="40" height="18" rx="1.5" className="zs-bin" />
      <Note x={170} y={89}>양품</Note>
      <rect x="150" y="94" width="40" height="18" rx="1.5" className="zs-bin-bad" />
      <Note x={170} y={119}>불량</Note>
      <Appear at={10.9} fade={0.2}>
        <Pkg cx={170} cy={74} />
      </Appear>

      <g transform="translate(17 0)">
        <Path keys={HEAD} />
        <rect x="-8" y="14" width="16" height="10" rx="1.5" className="il-tool" />
        <line x1="0" y1="24" x2="0" y2="30" className="zs-nozzle" />
        <g opacity="0">
          <Keys attr="opacity" keys={[[1.5, 0], [1.55, 1], [10.8, 1], [10.85, 0]]} />
          <Pkg cx={0} cy={35} />
        </g>
      </g>

      {/* 검사 중: 소켓 둘레가 깜빡이고, 통과 표시가 나옵니다 */}
      <Appear at={4.2}>
        <Vanish at={8.4}>
          <rect x="84" y="70" width="32" height="22" rx="3" className="zs-contact-ring">
            <animate attributeName="opacity" values="1;0.2;1" dur="0.8s" repeatCount="indefinite" />
          </rect>
          <Note x={146} y={44}>전원·신호를 넣어 검사 중</Note>
        </Vanish>
      </Appear>
      <Appear at={7}>
        <Vanish at={8.4}>
          <Note x={146} y={54} className="zs-note-good">✓ 규격대로 동작</Note>
        </Vanish>
      </Appear>
      <Note at={8.4} x={146} y={44}>결과에 맞는 칸으로 옮김</Note>
    </>
  ),
}

// ── 장면 2: 소켓 단면. 핸들러가 패키지를 눌러 단자와 핀이 맞닿습니다. ──
const PINS = [70, 90, 110, 130]
const UP = -18
const socket = {
  dur: 12,
  focus: [76, 41, 48, 28.8],
  focusAt: 10.5,
  draw: () => (
    <>
      <rect x="50" y="76" width="100" height="28" className="il-tool" />
      <rect x="50" y="56" width="8" height="20" className="il-tool" />
      <rect x="142" y="56" width="8" height="20" className="il-tool" />
      {PINS.map((x) => (
        <g key={x}>
          <line x1={x} y1="70" x2={x} y2="104" className="zs-pin" />
          <line x1={x} y1="104" x2={x} y2="112" className="zs-test-line" />
        </g>
      ))}
      <line x1="70" y1="112" x2="130" y2="112" className="zs-test-line" />
      <Note at={0.4} x={166} y={92}>소켓</Note>
      <Callout at={1} from={[130, 74]} to={[172, 66]} anchor="middle">소켓 핀</Callout>

      <g transform={`translate(0 ${UP})`}>
        <Path keys={[[4.4, `0 ${UP}`], [6, '0 0']]} />
        <rect x="64" y="26" width="72" height="18" rx="1.5" className="il-tool" />
        <rect x="60" y="44" width="80" height="22" rx="1.5" className="il-mold" />
        <rect x="82" y="52" width="36" height="8" className="il-die" />
        <path d="M 84 52 Q 74 46 70 66" className="il-wire" />
        <path d="M 116 52 Q 126 46 130 66" className="il-wire" />
        {PINS.map((x) => (
          <rect key={x} x={x - 5} y="66" width="10" height="4" className="il-cu" />
        ))}
      </g>
      <Vanish at={4.2}>
        <Callout at={0.8} from={[65, 50]} to={[30, 40]} anchor="middle">패키지 단자</Callout>
        <Note at={0.8} x={100} y={16}>핸들러가 누르는 부분</Note>
      </Vanish>
      <Note at={4.2} x={174} y={36}>핸들러가 누름 ↓</Note>

      <Appear at={6.2}>
        {PINS.map((x) => (
          <circle key={x} cx={x} cy="70" r="3" className="zs-contact">
            <animate attributeName="opacity" values="0.7;0.25;0.7" dur="1s" repeatCount="indefinite" />
          </circle>
        ))}
        <Note x={100} y={16}>단자와 핀이 맞닿음</Note>
      </Appear>

      {/* 왼쪽 두 핀은 들어가는 신호, 오른쪽 두 핀은 나오는 결과 */}
      <Appear at={8}>
        {PINS.map((x, i) => {
          const goingIn = i < 2
          return [0, 0.6].map((delay) => (
            <circle key={`${x}-${delay}`} cx={x} cy="0" r="1.6" className="il-signal" opacity="0">
              <Keys loop attr="cy" keys={goingIn ? [[8 + delay, 104], [9.2 + delay, 72]] : [[8 + delay, 72], [9.2 + delay, 104]]} />
              <Keys loop attr="opacity" keys={[[8 + delay, 1], [9.2 + delay, 1]]} />
            </circle>
          ))
        })}
        <Note x={48} y={98} anchor="end">전원·신호 들어감 ↑</Note>
        <Note x={170} y={110}>결과 나옴 ↓</Note>
        <Note x={100} y={119}>테스터와 연결</Note>
      </Appear>
    </>
  ),
}

// ── 장면 3: 패키지 안의 칩. 보낸 신호와 나온 결과를 규격과 비교합니다. ──
const square = (x0, x1, low, high, period = 8) => {
  let d = `M ${x0} ${low}`
  for (let x = x0; x < x1; x += period) d += ` L ${x} ${high} L ${x + period / 2} ${high} L ${x + period / 2} ${low} L ${x + period} ${low}`
  return d
}

const signal = {
  dur: 12,
  focus: null,
  draw: () => (
    <>
      <defs>
        <clipPath id="zs-ts-in">
          <rect x="38" y="38" width="40" height="20" />
        </clipPath>
        <clipPath id="zs-ts-out">
          <rect x="122" y="38" width="40" height="20" />
        </clipPath>
      </defs>
      <rect x="80" y="30" width="40" height="40" rx="1" className="il-die" />
      <Note x={100} y={52}>칩</Note>
      <Note at={0.4} x={100} y={24}>패키지 안의 칩</Note>

      <rect x="6" y="42" width="30" height="16" rx="2" className="il-tool" />
      <Note x={21} y={36}>테스터가 보냄</Note>
      <line x1="36" y1="50" x2="80" y2="50" className="zs-test-line" />
      <rect x="164" y="42" width="30" height="16" rx="2" className="il-tool" />
      <Note x={179} y={36}>테스터가 받음</Note>
      <line x1="120" y1="50" x2="164" y2="50" className="zs-test-line" />

      <Appear at={0.8}>
        <g clipPath="url(#zs-ts-in)">
          <g>
            <Path loop keys={[[0.8, '0 0'], [2.4, '16 0']]} />
            <path d={square(8, 96, 54, 44)} className="zs-wave" />
          </g>
        </g>
        <Note x={58} y={66}>신호</Note>
      </Appear>
      <Appear at={4.2}>
        <g clipPath="url(#zs-ts-out)">
          <g>
            <Path loop keys={[[4.2, '0 0'], [5.8, '16 0']]} />
            <path d={square(92, 180, 54, 44)} className="zs-wave" />
          </g>
        </g>
        <Note x={142} y={66}>결과</Note>
      </Appear>
      <Appear at={5}>
        <path d={square(122, 162, 84, 76)} className="zs-wave-expect" />
        <Note x={142} y={94}>규격(기대값)</Note>
      </Appear>
      <Note at={6.6} x={142} y={104} className="zs-note-good">같음 ✓ 규격대로 동작</Note>

      {/* 뜨거운 조건, 차가운 조건에서 다시 */}
      <rect x="0" y="0" width="200" height="120" className="zs-hot" opacity="0">
        <Keys attr="opacity" keys={[[8.2, 0], [8.8, 0.16], [9.9, 0.16], [10.2, 0]]} />
      </rect>
      <rect x="0" y="0" width="200" height="120" className="zs-cold" opacity="0">
        <Keys attr="opacity" keys={[[10.2, 0], [10.6, 0.16], [12, 0.16]]} />
      </rect>
      <Appear at={8.4}>
        <Vanish at={10}>
          <Note x={58} y={104} className="zs-note-hot">뜨거운 조건에서 다시 검사</Note>
        </Vanish>
      </Appear>
      <Note at={10.3} x={58} y={114} className="zs-note-cold">차가운 조건에서 다시 검사</Note>
    </>
  ),
}

// ── 장면 4: 분류 칸으로 나누고, 외관을 확인하고, 포장합니다. ──
const BINS = [
  { x: 20, label: '양품 · 등급 1', className: 'zs-bin' },
  { x: 75, label: '양품 · 등급 2', className: 'zs-bin' },
  { x: 140, label: '불량', className: 'zs-bin-bad' },
]
const DROPS = [0, 1, 0, 2, 1].map((bin, i, all) => {
  const nth = all.slice(0, i).filter((b) => b === bin).length
  return { at: 0.8 + i * 0.6, x: BINS[bin].x + 12 + nth * 16, y: 53 }
})

const sort = {
  dur: 12,
  focus: null,
  draw: () => (
    <>
      <polygon points="92,2 108,2 103,12 97,12" className="il-tool" />
      {BINS.map((b) => (
        <g key={b.x}>
          <rect x={b.x} y="44" width="50" height="18" rx="1.5" className={b.className} />
          <Note x={b.x + 25} y={70}>{b.label}</Note>
        </g>
      ))}
      {DROPS.map((d) => (
        <Appear key={d.at} at={d.at} fade={0.1}>
          <g transform="translate(100 8)">
            <Path keys={[[d.at, '100 8'], [d.at + 0.5, `${d.x} ${d.y}`]]} />
            <Pkg cx={0} cy={0} w={12} h={8} />
          </g>
        </Appear>
      ))}

      {/* 외관 검사: 단자 모양과 표시 */}
      <Appear at={4}>
        <rect x="20" y="80" width="40" height="30" rx="1.5" className="il-mold" />
        <text x="40" y="97" textAnchor="middle" className="zs-engrave">PKG</text>
        {[24, 32, 40, 48].map((x) => (
          <rect key={x} x={x} y="108" width="5" height="3" className="il-cu" />
        ))}
        <g transform="translate(-20 0)">
          <Path keys={[[4.2, '-20 0'], [5.4, '0 0'], [6.2, '0 14']]} />
          <circle cx="44" cy="92" r="10" className="zs-lens" />
        </g>
        <Note x={84} y={88} anchor="start">외관 검사</Note>
      </Appear>
      <Note at={5.6} x={84} y={96} anchor="start" className="zs-note-good">표시 ✓</Note>
      <Note at={6.4} x={84} y={104} anchor="start" className="zs-note-good">단자 모양 ✓</Note>

      {/* 포장: 트레이와 릴 테이프 */}
      <Appear at={8}>
        <rect x="124" y="82" width="34" height="26" rx="1.5" className="zs-tray" />
        {[0, 1, 2, 3].map((i) => (
          <Appear key={i} at={8.4 + i * 0.4} fade={0.2}>
            <Pkg cx={133 + (i % 2) * 16} cy={89 + Math.floor(i / 2) * 12} w={10} h={7} />
          </Appear>
        ))}
        <Note x={141} y={116}>트레이</Note>
        <Spin cx={180} cy={94} period={4} from={8}>
          <circle cx="180" cy="94" r="14" className="il-tool" />
          <circle cx="180" cy="94" r="4" className="il-hole" />
          <line x1="180" y1="82" x2="180" y2="88" className="zs-spoke" />
        </Spin>
        <Note x={180} y={116}>릴 테이프</Note>
      </Appear>
    </>
  ),
}

export default { machine, socket, signal, sort }
