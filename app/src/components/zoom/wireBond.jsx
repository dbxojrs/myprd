import { Appear, Callout, Keys, Note, Path, Vanish } from './kit.jsx'
import { Arrow } from '../Illustrations.jsx'

// 와이어 본딩 확대 스토리의 장면 그림. 설명 문장은 data/zoomStories/wireBond.js에 있습니다.
// 장면 1(전체) → 2(캐필러리 끝, 볼 만들기) → 3(볼과 패드) → 4(붙는 면) → 5(루프·스티치, 흐려지며 넘어감)

// 3차 베지어 곡선 길이(잘게 나눠 더함). 캐필러리가 일정한 속도로 움직일 때 와이어가 그려지는 시각을 맞추는 데 씁니다.
function cubicLength(p0, p1, p2, p3) {
  let length = 0
  let prev = p0
  for (let i = 1; i <= 40; i++) {
    const t = i / 40
    const u = 1 - t
    const point = [0, 1].map((k) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k])
    length += Math.hypot(point[0] - prev[0], point[1] - prev[1])
    prev = point
  }
  return length
}

// 캐필러리: 끝(0, 0)이 기준점이고 위로 관이 이어집니다. 가운데 선은 관 속의 와이어입니다.
const Capillary = ({ scale = 1 }) => (
  <g transform={scale === 1 ? undefined : `scale(${scale})`}>
    <polygon points="-4,-30 4,-30 1.6,0 -1.6,0" className="il-tool" />
    <line x1="0" y1="-30" x2="0" y2="0" className="zs-wire-thin" />
  </g>
)

// 와이어가 그려지는 모습: pathLength를 100으로 두고 점선 간격을 줄여 나갑니다.
const DrawnWire = ({ d, from, to, className = 'il-wire' }) => (
  <path d={d} pathLength="100" strokeDasharray="100" strokeDashoffset="100" className={className}>
    <Keys attr="stroke-dashoffset" keys={[[from, 100], [to, 0]]} />
  </path>
)

// ── 장면 1: 옆에서 본 리드프레임 위의 다이. 캐필러리가 패드 → 리드로 루프를 그립니다. ──
const LOOP_L = 'M75 69 C75 44, 40 50, 34 86'
const LOOP_R = 'M125 69 C125 44, 160 50, 166 86'
const OVERALL_PATH = `M75 10 L75 69 C75 44, 40 50, 34 86 L34 40 L125 40 L125 69 C125 44, 160 50, 166 86 L166 40`
const overallTimes = (() => {
  const curve = cubicLength([75, 69], [75, 44], [40, 50], [34, 86])
  const segments = [59, curve, 46, 91, 29, curve, 46]
  const total = segments.reduce((a, b) => a + b, 0)
  const begin = 2.5
  const dur = 10
  const at = (n) => begin + (segments.slice(0, n).reduce((a, b) => a + b, 0) / total) * dur
  return { begin, dur, wire1: [at(1), at(2)], wire2: [at(5), at(6)], end: begin + dur }
})()

const overall = {
  dur: 13,
  focus: [150, 30.4, 32, 19.2],
  focusAt: 12.3,
  draw: () => (
    <>
      <rect x="60" y="86" width="80" height="6" className="il-frame" />
      <rect x="10" y="86" width="38" height="6" className="il-frame" />
      <rect x="152" y="86" width="38" height="6" className="il-frame" />
      <rect x="64" y="84" width="72" height="2" className="il-glue" />
      <rect x="68" y="70" width="64" height="14" className="il-die" />
      <rect x="71" y="68.6" width="8" height="1.6" className="zs-pad" />
      <rect x="121" y="68.6" width="8" height="1.6" className="zs-pad" />

      <DrawnWire d={LOOP_L} from={overallTimes.wire1[0]} to={overallTimes.wire1[1]} />
      <DrawnWire d={LOOP_R} from={overallTimes.wire2[0]} to={overallTimes.wire2[1]} />

      <Appear at={overallTimes.begin}>
        <g>
          <animateMotion path={OVERALL_PATH} begin={`${overallTimes.begin}s`} dur={`${overallTimes.dur}s`} fill="freeze" calcMode="paced" />
          <Capillary />
          <Appear at={overallTimes.end - 0.5}>
            <circle cx="0" cy="1.6" r="1.8" className="il-ball" />
          </Appear>
        </g>
      </Appear>

      <Note at={0.6} x={100} y={80}>다이 (칩)</Note>
      <Callout at={1.2} from={[77, 68.6]} to={[86, 58]}>패드</Callout>
      <Callout at={1.8} from={[28, 90]} to={[22, 104]} anchor="middle">리드</Callout>
      <Callout at={1.8} from={[110, 90]} to={[110, 104]} anchor="middle">리드프레임</Callout>
      <Note at={2.6} x={92} y={16} anchor="start">캐필러리 (가는 관)</Note>
      <Callout at={overallTimes.wire1[1]} from={[46, 58]} to={[30, 40]} anchor="end">와이어 루프</Callout>
      <Note at={8.7} x={100} y={116}>패드마다 되풀이해 리드와 하나씩 이음</Note>
    </>
  ),
}

// ── 장면 2: 캐필러리 끝. 전기 불꽃으로 와이어 끝을 녹여 볼을 만들고, 패드로 내려갑니다. ──
const ball = {
  dur: 12,
  focus: [84, 94.4, 32, 19.2],
  focusAt: 10.6,
  draw: () => (
    <>
      <rect x="0" y="116" width="200" height="4" className="il-die" />
      <rect x="62" y="110" width="76" height="6" className="zs-pad" />

      <g>
        <Path keys={[[8, '0 0'], [10.4, '0 36']]} />
        <path d="M76 -2 L124 -2 L124 28 L108 58 L92 58 L76 28 Z" className="il-tool" />
        <rect x="97.5" y="-2" width="5" height="60" className="il-hole" />
        <line x1="100" y1="-2" x2="100" y2="63" className="zs-wire-thick" />
        <Callout at={0.8} from={[82, 22]} to={[40, 30]} anchor="middle">캐필러리 (세라믹 관)</Callout>
        <Callout at={1.6} from={[100, 8]} to={[136, 8]}>와이어가 지나가는 구멍</Callout>
        <circle cx="100" cy="66" r="0" className="il-ball">
          <Keys attr="r" keys={[[4.6, 0], [5.8, 7]]} />
        </circle>
      </g>

      {/* 불꽃을 튀기는 막대: 들어왔다가 볼이 생기면 물러납니다 */}
      <g transform="translate(80 0)">
        <Path keys={[[4, '80 0'], [4.4, '0 0'], [6.4, '0 0'], [7, '80 0']]} />
        <rect x="128" y="63" width="50" height="5" rx="1" className="il-tool" />
      </g>
      <g opacity="0">
        <Keys attr="opacity" keys={[[4.4, 1], [4.5, 0.2], [4.6, 1], [4.7, 0.3], [4.8, 1], [4.9, 0], [5.6, 0]]} />
        <path d="M127 65.5 L120 62 L116 68 L110 63 L106 66" className="zs-spark" />
      </g>

      <Note at={2.4} x={162} y={24}>와이어 재료:</Note>
      <Note at={2.4} x={162} y={31}>금(Au) 또는 구리(Cu)</Note>
      <Note at={4.4} x={152} y={58}>전기 불꽃</Note>
      <Appear at={5.8}>
        <Vanish at={8}>
          <Callout from={[107, 66]} to={[140, 80]}>볼 (녹아서 둥글어짐)</Callout>
        </Vanish>
      </Appear>
      <Callout at={9} from={[136, 113]} to={[160, 100]}>칩의 패드</Callout>
    </>
  ),
}

// ── 장면 3: 볼과 패드. 누르고(하중), 데우고(열), 문지릅니다(초음파). ──
const SHAKE = { values: '0 0;1.8 0;-1.8 0;0 0', begin: '7s', dur: '0.14s', repeatDur: '3.5s' }
const press = {
  dur: 14,
  focus: [84, 66.4, 32, 19.2],
  focusAt: 11.6,
  draw: () => (
    <>
      <rect x="0" y="84" width="200" height="36" className="il-die" />
      <rect x="30" y="78" width="140" height="6" className="zs-pad" />
      <Appear at={7}>
        <rect x="30" y="76.8" width="140" height="1.2" className="il-oxide-film" />
      </Appear>

      {/* 열: 아래에서 올라오는 물결선 */}
      <Appear at={3.5}>
        {[44, 70, 130, 156].map((x) => (
          <path key={x} d={`M${x} 116 q 3 -4 0 -8 q -3 -4 0 -8 q 3 -4 0 -8`} className="zs-heat-line">
            <animateTransform attributeName="transform" type="translate" values="0 4;0 -2;0 4" dur="1.6s" repeatCount="indefinite" />
          </path>
        ))}
        <Note x={44} y={96}>열</Note>
      </Appear>

      <g>
        <animateTransform attributeName="transform" type="translate" {...SHAKE} />
        <ellipse cx="100" cy="66" rx="13" ry="11" className="il-ball">
          <Keys attr="rx" keys={[[2.8, 13], [10.5, 19]]} />
          <Keys attr="ry" keys={[[2.8, 11], [10.5, 6]]} />
          <Keys attr="cy" keys={[[2.8, 66], [10.5, 71]]} />
        </ellipse>
        <g transform="translate(0 -10)">
          <Path keys={[[0.6, '0 -10'], [2.8, '0 3'], [10.5, '0 13']]} />
          <path d="M70 -20 L130 -20 L130 20 L114 52 L86 52 L70 20 Z" className="il-tool" />
          <rect x="97.5" y="-20" width="5" height="72" className="il-hole" />
          <line x1="100" y1="-20" x2="100" y2="52" className="zs-wire-thick" />
        </g>
      </g>

      <Appear at={0.8}>
        <Arrow x1={152} y1={14} x2={152} y2={40} />
        <Note x={152} y={10}>하중 (누르는 힘)</Note>
      </Appear>
      <Callout at={1} from={[112, 66]} to={[150, 50]}>볼</Callout>
      <Callout at={1} from={[36, 81]} to={[22, 70]} anchor="middle">칩의 패드</Callout>
      <Appear at={7}>
        <Note x={44} y={50}>↔ 초음파 진동</Note>
        <Note x={44} y={58}>(아주 빠르게 떨림)</Note>
        <Callout from={[160, 77.4]} to={[176, 66]} anchor="middle">얇은 산화막</Callout>
      </Appear>
      <Note at={10.5} x={100} y={114}>볼이 눌리며 패드에 붙음</Note>
    </>
  ),
}

// ── 장면 4: 붙는 면. 위는 볼(와이어 금속), 아래는 패드 금속, 사이에 얇은 산화막. ──
const FILM = Array.from({ length: 10 }, (_, i) => {
  const x = i * 20
  const center = x + 10
  const side = center < 100 ? -1 : 1
  return { x, dx: side * (40 + Math.abs(center - 100) * 0.6), dy: i % 2 ? 2 : -2, at: 5.2 + Math.abs(center - 100) * 0.01 }
})

const interfaceScene = {
  dur: 12,
  focus: null,
  draw: () => (
    <>
      <rect x="0" y="62" width="200" height="58" className="zs-pad" />
      {['M20 62 L34 84 L28 120', 'M88 62 L80 96 L94 120', 'M150 62 L162 90 L150 120'].map((d) => (
        <path key={d} d={d} className="zs-grain" />
      ))}

      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;2 0;-2 0;0 0" begin="4s" dur="0.18s" repeatDur="4s" />
        <rect x="-10" y="0" width="220" height="58" className="zs-ball-metal" />
        {['M40 0 L52 30 L44 58', 'M110 0 L104 26 L118 58', 'M170 0 L178 34 L166 58'].map((d) => (
          <path key={d} d={d} className="zs-grain" />
        ))}
        <Appear at={7.6} fade={0.8}>
          <rect x="-10" y="57.5" width="220" height="4.6" className="zs-ball-fill" />
        </Appear>
      </g>

      {FILM.map((f) => (
        <g key={f.x}>
          <Path keys={[[f.at + 0.6, '0 0'], [7.6, `${f.dx} ${f.dy}`]]} />
          <Keys attr="opacity" keys={[[6.8, 1], [7.6, 0]]} />
          <rect x={f.x + 0.4} y="58" width="19.2" height="4" className="il-oxide-film" />
        </g>
      ))}
      <Appear at={5}>
        {FILM.slice(1).map((f) => (
          <path key={f.x} d={`M${f.x} 57.5 l -1 2 l 2 1 l -1 2`} className="il-crack">
            <Keys attr="opacity" keys={[[6.8, 1], [7.4, 0]]} />
          </path>
        ))}
      </Appear>
      <Appear at={8.4}>
        <line x1="0" y1="62" x2="200" y2="62" className="zs-bonded" />
      </Appear>

      <Note at={0.6} x={40} y={22}>볼 (와이어 금속)</Note>
      <Note at={0.6} x={40} y={104}>패드 금속</Note>
      <Appear at={1.2}>
        <Vanish at={6.8}>
          <Callout from={[150, 60]} to={[164, 80]}>얇은 산화막</Callout>
        </Vanish>
      </Appear>
      <Appear at={4}>
        <Vanish at={8.2}>
          <Note x={140} y={30}>↔ 초음파 진동이 문지름</Note>
          <Note x={140} y={38} className="zs-note-hot">산화막이 깨짐</Note>
        </Vanish>
      </Appear>
      <Appear at={8.4}>
        <Note x={140} y={30}>깨진 막이 밀려나고</Note>
        <Note x={140} y={80} className="zs-note-good">금속끼리 맞닿아 단단히 붙음</Note>
      </Appear>
    </>
  ),
}

// ── 장면 5: 루프와 스티치. 다시 넓게 본 모습입니다. ──
const LOOP = 'M45 63 C45 18, 140 18, 150 91'
const loop = {
  dur: 14,
  focus: null,
  draw: () => (
    <>
      <rect x="6" y="100" width="80" height="6" className="il-frame" />
      <rect x="116" y="92" width="80" height="8" className="il-frame" />
      <rect x="10" y="70" width="72" height="30" className="il-die" />
      <rect x="38" y="68.4" width="14" height="1.6" className="zs-pad" />
      <ellipse cx="45" cy="65.6" rx="6" ry="3" className="il-ball" />

      <DrawnWire d={LOOP} from={0.8} to={4.6} />
      <Appear at={4.8}>
        <polygon points="141,92 159,92 155,89 147,89" className="zs-wire-fill" />
      </Appear>
      <Appear at={7.8}>
        <path d="M158 86 l 3 -2 l -1 3 l 3 -1" className="il-crack" />
      </Appear>

      <Appear at={0.8} fade={0.3}>
        <g>
          <animateMotion path={LOOP} begin="0.8s" dur="3.8s" fill="freeze" calcMode="paced" />
          <animateMotion path="M150 91 L150 89 L150 91" begin="5s" dur="0.6s" repeatCount="2" fill="freeze" />
          <animateMotion path="M150 91 L150 58" begin="7s" dur="1.4s" fill="freeze" />
          <Capillary scale={1.3} />
          <Appear at={7}>
            <line x1="0" y1="0" x2="0" y2="3.5" className="zs-wire-thin" />
          </Appear>
          <Appear at={11}>
            <circle cx="0" cy="4.6" r="2.6" className="il-ball" />
          </Appear>
        </g>
      </Appear>
      <Appear at={10.5}>
        <g opacity="0">
          <Keys attr="opacity" keys={[[10.6, 1], [10.7, 0.2], [10.8, 1], [10.9, 0], [12, 0]]} />
          <path d="M170 62 L164 59 L162 64 L156 61 L153 63" className="zs-spark" />
        </g>
      </Appear>

      <Note at={0.4} x={46} y={88}>다이</Note>
      <Callout at={0.4} from={[40, 65]} to={[36, 46]} anchor="middle">1차 본딩 (볼 본드)</Callout>
      <Note at={3} x={96} y={20}>루프</Note>
      <Callout at={4.8} from={[146, 91]} to={[112, 108]} anchor="middle">2차 본딩 (스티치 본드)</Callout>
      <Note at={4.8} x={186} y={110}>리드</Note>
      <Callout at={7.8} from={[159, 86]} to={[178, 72]} anchor="middle">끊긴 자리</Callout>
      <Appear at={10.5}>
        <Note x={148} y={12}>남은 끝으로 다음 볼 → 다음 패드로</Note>
      </Appear>
    </>
  ),
}

export default { overall, ball, press, interface: interfaceScene, loop }
