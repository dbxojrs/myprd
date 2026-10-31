import { Anim, Arrow, Label, Move, Playable, StepCaption, Visible } from './Illustrations.jsx'

// 알아둘 점에 붙는 상세 그림. 키는 processes.js keyPoints의 figure입니다.
// 그림 함수는 animate를 받습니다. false이면 현상이 끝난 모습을 멈춘 그림으로 그립니다.
// 두 칸 그림은 왼쪽이 알맞은 경우, 오른쪽이 문제가 생기는 경우입니다.

const DUR = '4.5s'

// 두 칸 그림의 칸 제목과 가운데 구분선
const Panels = ({ left, right }) => (
  <>
    <Label x="50" y="9">{left}</Label>
    <Label x="150" y="9">{right}</Label>
    <line x1="100" y1="4" x2="100" y2="80" className="il-divider" />
  </>
)

// 움직일 때는 단계 자막, 멈춘 그림에서는 한 줄 설명
const Caption = ({ animate, items, still }) =>
  animate ? <StepCaption items={items} dur={DUR} x={100} y={89} /> : <Label x="100" y="89">{still}</Label>

// 문제가 생긴 곳을 표시하는 빨간 원. 움직일 때는 from 이후에 나타납니다.
const Warn = ({ animate, from, cx, cy, r = 7 }) => {
  const ring = <circle cx={cx} cy={cy} r={r} className="il-warn-ring" />
  return animate ? (
    <Visible from={from} to={1} dur={DUR}>
      {ring}
    </Visible>
  ) : (
    ring
  )
}

// 움직일 때만 from 이후에 보이고, 멈춘 그림에서는 그대로 보입니다.
const Later = ({ animate, from, to = 1, children }) =>
  animate ? (
    <Visible from={from} to={to} dur={DUR}>
      {children}
    </Visible>
  ) : (
    children
  )

const detailDrawings = {
  // ── 다이 어태치 ──
  'die-fillet': (animate) => (
    <>
      <Panels left="알맞은 양" right="너무 많음" />
      {[
        { ox: 0, h: 7, spread: 4, note: '가장자리에 작은 필렛' },
        { ox: 100, h: 14, spread: 18, note: '넘친 접착제가 주변을 더럽힘' },
      ].map((p) => (
        <g key={p.ox} transform={`translate(${p.ox} 0)`}>
          <rect x="6" y="62" width="88" height="6" className="il-frame" />
          <rect x={animate ? 40 : 30} y="58" width={animate ? 20 : 40} height="4" className="il-glue">
            {animate && (
              <>
                <Anim attr="x" points={[[0.3, 40], [0.45, 30]]} dur={DUR} />
                <Anim attr="width" points={[[0.3, 20], [0.45, 40]]} dur={DUR} />
              </>
            )}
          </rect>
          <Later animate={animate} from={0.45}>
            <polygon points={`30,62 30,${62 - p.h} ${24 - p.spread},62`} className="il-glue" />
            <polygon points={`70,62 70,${62 - p.h} ${76 + p.spread},62`} className="il-glue" />
          </Later>
          <g>
            <rect x="30" y="46" width="40" height="12" rx="1" className="il-die" />
            {animate && <Move points={[[0, '0 -24'], [0.15, '0 -24'], [0.45, '0 0']]} dur={DUR} />}
          </g>
          <Later animate={animate} from={0.6}>
            <Label x="50" y="78">{p.note}</Label>
          </Later>
        </g>
      ))}
      <Warn animate={animate} from={0.6} cx={110} cy={60} r={8} />
      <Caption
        animate={animate}
        items={[
          [0, 0.45, '① 접착제 위에 다이를 내려 누름'],
          [0.45, 1, '② 밀려 나온 접착제가 다이 옆을 감쌈 = 필렛'],
        ]}
        still="밀려 나온 접착제가 다이 옆을 감싼 모양 = 필렛"
      />
    </>
  ),

  'die-void': (animate) => (
    <>
      <Panels left="고르게 퍼짐" right="공기가 갇힘" />
      <defs>
        {[0, 100].map((ox) => (
          <clipPath key={ox} id={`il-clip-void-${ox}`}>
            <rect x={25 + ox} y="16" width="50" height="50" />
          </clipPath>
        ))}
      </defs>
      {/* 왼쪽: 가운데에서 바깥으로 고르게 퍼짐 */}
      <rect x="25" y="16" width="50" height="50" className="il-die" />
      <g clipPath="url(#il-clip-void-0)">
        <rect x={animate ? 45 : 23} y={animate ? 36 : 14} width={animate ? 10 : 54} height={animate ? 10 : 54} className="il-glue">
          {animate && (
            <>
              <Anim attr="x" points={[[0.1, 45], [0.7, 23]]} dur={DUR} />
              <Anim attr="y" points={[[0.1, 36], [0.7, 14]]} dur={DUR} />
              <Anim attr="width" points={[[0.1, 10], [0.7, 54]]} dur={DUR} />
              <Anim attr="height" points={[[0.1, 10], [0.7, 54]]} dur={DUR} />
            </>
          )}
        </rect>
      </g>
      <rect x="25" y="16" width="50" height="50" className="il-outline" />
      {/* 오른쪽: 점 네 개가 퍼져 만나지만 사이에 공기가 남음 */}
      <rect x="125" y="16" width="50" height="50" className="il-die" />
      <g clipPath="url(#il-clip-void-100)">
        {[
          [137.5, 28.5],
          [162.5, 28.5],
          [137.5, 53.5],
          [162.5, 53.5],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={animate ? 2 : 12.5} className="il-glue">
            {animate && <Anim attr="r" points={[[0.1, 2], [0.7, 12.5]]} dur={DUR} />}
          </circle>
        ))}
      </g>
      <rect x="125" y="16" width="50" height="50" className="il-outline" />
      <Warn animate={animate} from={0.75} cx={150} cy={41} r={6} />
      <Later animate={animate} from={0.75}>
        <Label x="50" y="76">빈 곳 없음</Label>
        <Label x="150" y="76">가운데에 빈 곳(보이드)</Label>
      </Later>
      <Caption
        animate={animate}
        items={[
          [0, 0.75, '위에서 본 접착층: 다이를 누르면 접착제가 퍼짐'],
          [0.75, 1, '퍼진 접착제 사이에 공기가 갇히면 보이드'],
        ]}
        still="위에서 본 접착층: 퍼진 접착제 사이에 갇힌 공기 = 보이드"
      />
    </>
  ),

  daf: (animate) => {
    const pieces = [20, 40, 60, 80]
    return (
      <>
        {animate && (
          <g>
            <circle cx="0" cy="50" r="4" className="il-tool" />
            <Move points={[[0, '15 0'], [0.25, '105 0'], [0.27, '105 -60']]} dur={DUR} />
          </g>
        )}
        <rect x="125" y="60" width="60" height="6" className="il-substrate" />
        <Label x="155" y="75">기판</Label>
        {pieces.map((x, i) => {
          const moving = x === 60
          const piece = (
            <>
              <rect x={x} y="34" width="20" height="8" className="il-wafer" />
              <Later animate={animate} from={0.03 + i * 0.05}>
                <rect x={x} y="42" width="20" height="3" className="il-daf" />
              </Later>
            </>
          )
          if (!moving) return <g key={x}>{piece}</g>
          return (
            <g key={x} transform={animate ? undefined : 'translate(85 15)'}>
              {piece}
              {animate && (
                <Visible from={0.45} to={0.8} dur={DUR}>
                  <line x1="70" y1="0" x2="70" y2="26" className="il-probe" />
                  <rect x="64" y="26" width="12" height="8" className="il-tool" />
                </Visible>
              )}
              <Later animate={animate} from={0.82}>
                <rect x="60" y="42" width="20" height="3" className="il-cured" />
              </Later>
              {animate && <Move points={[[0.45, '0 0'], [0.55, '0 -18'], [0.7, '85 -18'], [0.78, '85 15']]} dur={DUR} />}
            </g>
          )
        })}
        {[40, 60, 80].map((x, i) => (
          <Later key={x} animate={animate} from={0.3 + i * 0.05}>
            <line x1={x} y1="34" x2={x} y2="45" className="il-cut" />
          </Later>
        ))}
        <Label x="60" y="56">웨이퍼 + 뒷면의 필름(DAF)</Label>
        <Caption
          animate={animate}
          items={[
            [0, 0.27, '① 웨이퍼 뒷면에 접착 필름(DAF)을 붙임'],
            [0.27, 0.45, '② 웨이퍼와 필름을 함께 자름'],
            [0.45, 0.8, '③ 필름이 붙은 다이를 그대로 옮김'],
            [0.8, 1, '④ 열과 압력으로 붙임 (넘치지 않음)'],
          ]}
          still="필름이 붙은 다이를 그대로 옮겨 붙여 접착제가 넘치지 않음"
        />
      </>
    )
  },

  // ── 웨이퍼 쏘잉 ──
  'saw-cut': (animate) => {
    const grits = Array.from({ length: 40 }, (_, i) => (i / 40) * Math.PI * 2)
    return (
      <>
        <rect x="0" y="44" width="200" height="14" className="il-wafer" />
        <rect x="0" y="58" width="200" height="4" className="il-tape" />
        <circle cx="100" cy="-10" r="62" className="il-tool" />
        <g>
          {grits.map((a) => {
            const x = 100 + 60 * Math.cos(a)
            const y = -10 + 60 * Math.sin(a)
            return <rect key={a} x={x - 1.5} y={y - 1.5} width="3" height="3" className="il-diamond" transform={`rotate(45 ${x} ${y})`} />
          })}
          {animate && (
            <animateTransform attributeName="transform" type="rotate" from="0 100 -10" to="360 100 -10" dur="3s" repeatCount="indefinite" />
          )}
        </g>
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx="114" cy="48" r="1.2" className="il-dust" opacity={animate ? 0 : 1 - i * 0.18} transform={animate ? undefined : `translate(${i * 7} ${-i * 3})`}>
            {animate && (
              <>
                <animateTransform attributeName="transform" type="translate" values="0 0;32 -14" dur="0.8s" begin={`${i * 0.16}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0" dur="0.8s" begin={`${i * 0.16}s`} repeatCount="indefinite" />
              </>
            )}
          </circle>
        ))}
        <rect x="150" y="14" width="18" height="6" className="il-tool" />
        <line x1="152" y1="20" x2="116" y2="46" className="il-water">
          {animate && <animate attributeName="stroke-dashoffset" values="0;-12" dur="0.4s" repeatCount="indefinite" />}
        </line>
        <Label x="34" y="40">다이아몬드 입자</Label>
        <Label x="182" y="12">냉각수</Label>
        <Label x="160" y="40">실리콘 가루</Label>
        <Label x="100" y="70">블레이드 아래쪽이 웨이퍼를 갈아 홈(커프)을 만듦</Label>
        <Caption
          animate={animate}
          items={[
            [0, 0.5, '돌아가는 다이아몬드 입자가 실리콘을 조금씩 갈아냄'],
            [0.5, 1, '물을 뿌려 열을 식히고 가루를 씻어 냄'],
          ]}
          still="다이아몬드 입자가 돌며 갈아내고, 물이 열과 가루를 씻어 냄"
        />
      </>
    )
  },

  // ── 와이어 본딩 ──
  ultrasonic: (animate) => {
    const shake = [[0, '0 -12'], [0.3, '0 0']]
    for (let t = 0.32, k = 0; t < 0.66; t += 0.02, k++) shake.push([+t.toFixed(3), `${k % 2 ? 1.6 : -1.6} 0`])
    shake.push([0.68, '0 0'])
    return (
      <>
        <rect x="30" y="66" width="140" height="10" className="il-die" />
        <rect x="40" y="58" width="120" height="8" className="il-frame" />
        {[50, 60, 70, 120, 130, 140].map((x) => (
          <rect key={x} x={x} y="55.5" width="9" height="2.5" className="il-oxide-film" />
        ))}
        {[80, 90, 100, 110].map((x, i) => (
          <rect key={x} x={x} y="55.5" width="9" height="2.5" className="il-oxide-film" opacity={animate ? 1 : 0}>
            {animate && <Anim attr="opacity" points={[[0.35 + i * 0.07, 1], [0.4 + i * 0.07, 0]]} dur={DUR} />}
          </rect>
        ))}
        <rect x={animate ? 100 : 82} y="56.5" width={animate ? 0 : 36} height="1.5" className="il-imc">
          {animate && (
            <>
              <Anim attr="x" points={[[0.6, 100], [0.85, 82]]} dur={DUR} />
              <Anim attr="width" points={[[0.6, 0], [0.85, 36]]} dur={DUR} />
            </>
          )}
        </rect>
        <g>
          <line x1="100" y1="0" x2="100" y2="38" className="il-wire" />
          <polygon points="86,0 114,0 108,32 92,32" className="il-tool" />
          <ellipse cx="100" cy="47" rx="18" ry="9" className="il-ball" />
          {animate && <Move points={shake} dur={DUR} />}
        </g>
        <Label x="160" y="22">↓ 누르는 힘</Label>
        <Label x="160" y="32">↔ 초음파 진동</Label>
        <Label x="48" y="50">산화막</Label>
        <Label x="180" y="64">패드</Label>
        <Label x="182" y="74">칩</Label>
        <Caption
          animate={animate}
          items={[
            [0, 0.3, '① 볼을 패드에 누름'],
            [0.3, 0.65, '② 초음파로 문질러 표면의 산화막을 깸'],
            [0.65, 1, '③ 금속끼리 맞닿아 단단히 붙음'],
          ]}
          still="초음파로 산화막을 깨고 금속끼리 맞닿게 해 붙임"
        />
      </>
    )
  },

  // ── 몰딩 ──
  'wire-sweep': (animate) => {
    const starts = [44, 48, 52, 56]
    const ends = [34, 44, 56, 66]
    const wire = (i, k) => `M${starts[i]} 40 Q${(starts[i] + ends[i]) / 2 + k} 29 ${ends[i]} 18`
    return (
      <>
        <Panels left="알맞은 주입 속도" right="너무 빠름" />
        {[
          { ox: 0, bend: [2, 1.5, 1, 0.5], fill: [[0.1, 0], [0.8, 92]], note: '와이어가 조금만 밀림' },
          { ox: 100, bend: [14, 9, 4, 1], fill: [[0.1, 0], [0.4, 92]], note: '와이어끼리 닿을 수 있음' },
        ].map((p) => (
          <g key={p.ox} transform={`translate(${p.ox} 0)`}>
            <rect x="4" y="14" width={animate ? 0 : 92} height="58" className="il-mold-flow">
              {animate && <Anim attr="width" points={p.fill} dur={DUR} />}
            </rect>
            {ends.map((x) => (
              <rect key={x} x={x - 2} y="12" width="4" height="6" className="il-frame" />
            ))}
            <rect x="40" y="40" width="20" height="18" className="il-die" />
            {starts.map((_, i) => (
              <path key={i} d={wire(i, animate ? 0 : p.bend[i])} className="il-wire">
                {animate && (
                  <animate
                    attributeName="d"
                    values={`${wire(i, 0)};${wire(i, 0)};${wire(i, p.bend[i])};${wire(i, p.bend[i])}`}
                    keyTimes={`0;${p.fill[0][0]};${p.fill[1][0]};1`}
                    dur={DUR}
                    repeatCount="indefinite"
                  />
                )}
              </path>
            ))}
            {animate && (
              <Visible from={p.fill[0][0]} to={p.fill[1][0]} dur={DUR}>
                <Arrow x1="4" y1="64" x2="16" y2="64" />
              </Visible>
            )}
            <Later animate={animate} from={0.8}>
              <Label x="50" y="79">{p.note}</Label>
            </Later>
          </g>
        ))}
        <Warn animate={animate} from={0.45} cx={153} cy={30} r={6} />
        <Caption
          animate={animate}
          items={[
            [0, 0.45, '위에서 본 모습: 녹은 수지가 왼쪽에서 흘러 들어옴'],
            [0.45, 1, '흐름이 빠를수록 와이어가 많이 밀려 옆 와이어와 가까워짐'],
          ]}
          still="흐름이 빠를수록 와이어가 많이 밀려 옆 와이어와 닿을 수 있음"
        />
      </>
    )
  },

  'mold-void': (animate) => (
    <>
      <Panels left="알맞은 속도" right="너무 느림" />
      {[
        { ox: 0, fill: [[0.1, 0], [0.7, 88]], end: 88, note: '빈 곳 없이 채움' },
        { ox: 100, fill: [[0.1, 0], [0.5, 52], [0.85, 64]], end: 64, note: '다 차기 전에 굳음' },
      ].map((p) => (
        <g key={p.ox} transform={`translate(${p.ox} 0)`}>
          <rect x="6" y="16" width={animate ? 0 : p.end} height="38" className="il-mold">
            {animate && <Anim attr="width" points={p.fill} dur={DUR} />}
          </rect>
          <rect x="40" y="44" width="20" height="10" className="il-die il-ghost" />
          <path d="M43 44 Q32 30 20 54" className="il-wire il-ghost" />
          <path d="M57 44 Q68 30 80 54" className="il-wire il-ghost" />
          <rect x="6" y="10" width="88" height="6" className="il-tool" />
          <rect x="6" y="54" width="88" height="4" className="il-frame" />
          <rect x="6" y="58" width="88" height="6" className="il-tool" />
          <Later animate={animate} from={0.85}>
            <Label x="50" y="74">{p.note}</Label>
          </Later>
        </g>
      ))}
      <Later animate={animate} from={0.85}>
        <rect x="170" y="16" width="24" height="38" className="il-void-area" />
      </Later>
      <Later animate={animate} from={0.5}>
        <circle cx="128" cy="26" r="3" className="il-void" />
      </Later>
      <Warn animate={animate} from={0.85} cx={182} cy={35} r={14} />
      <Caption
        animate={animate}
        items={[
          [0, 0.85, '옆에서 본 금형: 녹은 수지가 빈 공간을 채워 나감'],
          [0.85, 1, '너무 느리면 굳어 버려 빈 곳(미충전)과 기포가 남음'],
        ]}
        still="너무 느리면 다 차기 전에 굳어 빈 곳(미충전)과 기포가 남음"
      />
    </>
  ),

  // ── 마킹 ──
  'mark-depth': (animate) => (
    <>
      <Panels left="알맞은 깊이" right="너무 깊음" />
      {[
        { ox: 0, depth: 2, note: '표면만 얇게 새김' },
        { ox: 100, depth: 17, note: '안쪽 와이어·칩 손상 위험' },
      ].map((p) => (
        <g key={p.ox} transform={`translate(${p.ox} 0)`}>
          <rect x="10" y="20" width="80" height="40" rx="2" className="il-mold" />
          <rect x="32" y="46" width="36" height="10" className="il-die" />
          <path d="M36 46 Q24 32 14 60" className="il-wire" />
          <path d="M64 46 Q76 32 86 60" className="il-wire" />
          <rect x="10" y="60" width="80" height="4" className="il-frame" />
          <rect x="44" y="20" width="12" height={animate ? 0 : p.depth} className="il-groove">
            {animate && <Anim attr="height" points={[[0.1, 0], [0.7, p.depth]]} dur={DUR} />}
          </rect>
          {animate && (
            <Visible from={0.1} to={0.7} dur={DUR}>
              <line x1="50" y1="2" x2="50" y2="20" className="il-laser" />
            </Visible>
          )}
          <Later animate={animate} from={0.7}>
            <Label x="50" y="74">{p.note}</Label>
          </Later>
        </g>
      ))}
      <Warn animate={animate} from={0.7} cx={150} cy={40} r={9} />
      <Caption
        animate={animate}
        items={[
          [0, 0.7, '레이저가 표면의 수지를 태워 홈을 만듦'],
          [0.7, 1, '너무 깊으면 수지가 얇아져 안쪽 와이어·칩이 상함'],
        ]}
        still="너무 깊게 새기면 수지가 얇아져 안쪽 와이어·칩이 상함"
      />
    </>
  ),

  // ── 패키지 쏘잉 ──
  'qfn-burr': (animate) => (
    <>
      <Panels left="날카로운 날" right="무딘 날" />
      {[
        { ox: 0, burr: false, note: '절단면이 깨끗함' },
        { ox: 100, burr: true, note: '구리 거스러미(버)가 남음' },
      ].map((p) => (
        <g key={p.ox} transform={`translate(${p.ox} 0)`}>
          <rect x="10" y="26" width="80" height="20" className="il-mold" />
          <rect x="10" y="46" width="80" height="6" className="il-cu" />
          <rect x="10" y="52" width="80" height="4" className="il-tape" />
          <rect x="48" y="26" width="4" height={animate ? 0 : 26} className="il-kerf-gap">
            {animate && <Anim attr="height" points={[[0.18, 0], [0.5, 26]]} dur={DUR} />}
          </rect>
          {p.burr && (
            <Later animate={animate} from={0.55}>
              <polygon points="45,52 48,52 48,57" className="il-cu" />
              <polygon points="52,52 55,52 52,57" className="il-cu" />
            </Later>
          )}
          {animate && (
            <g>
              <rect x="48" y="-30" width="4" height="40" className="il-tool" />
              <Move points={[[0, '0 0'], [0.5, '0 44'], [0.6, '0 44'], [0.75, '0 0']]} dur={DUR} />
            </g>
          )}
          <Later animate={animate} from={0.6}>
            <Label x="50" y="70">{p.note}</Label>
          </Later>
        </g>
      ))}
      <Label x="100" y="22">수지</Label>
      <Label x="100" y="51">구리</Label>
      <Warn animate={animate} from={0.6} cx={150} cy={54} r={7} />
      <Caption
        animate={animate}
        items={[
          [0, 0.55, '블레이드가 수지와 구리 리드를 함께 자름'],
          [0.55, 1, '날이 무디면 구리가 늘어나 거스러미(버)가 생김'],
        ]}
        still="날이 무디면 구리가 늘어나 거스러미(버)가 생김"
      />
    </>
  ),

  // ── 백그라인딩 ──
  'thin-wafer': (animate) => {
    const thick = 'M20 30 Q100 30 180 30 L180 50 Q100 50 20 50 Z'
    const thin = 'M20 42 Q100 42 180 42 L180 50 Q100 50 20 50 Z'
    const bowed = 'M20 36 Q100 58 180 36 L180 42 Q100 64 20 42 Z'
    return (
      <>
        <Label x="100" y="14">옆에서 본 웨이퍼</Label>
        <path d={animate ? thick : bowed} className="il-wafer">
          {animate && (
            <animate
              attributeName="d"
              values={`${thick};${thick};${thin};${bowed};${bowed}`}
              keyTimes="0;0.05;0.5;0.75;1"
              dur={DUR}
              repeatCount="indefinite"
            />
          )}
        </path>
        <Later animate={animate} from={0.8}>
          <path d="M100 47 l-2 2 l3 2 l-2 2" className="il-crack" />
        </Later>
        <Warn animate={animate} from={0.8} cx={100} cy={50} r={8} />
        <Caption
          animate={animate}
          items={[
            [0, 0.5, '① 뒷면을 갈아 얇게 만듦'],
            [0.5, 0.8, '② 얇아지면 힘을 견디지 못하고 휨'],
            [0.8, 1, '③ 심하면 금이 가거나 깨짐'],
          ]}
          still="너무 얇으면 휘고, 심하면 금이 가거나 깨짐"
        />
      </>
    )
  },

  // ── 블레이드 구조(멈춘 그림) ──
  'saw-blade': () => (
    <>
      <circle cx="50" cy="44" r="32" className="il-tool" />
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2
        return <circle key={i} cx={50 + 29.5 * Math.cos(a)} cy={44 + 29.5 * Math.sin(a)} r="1" className="il-diamond" />
      })}
      <circle cx="50" cy="44" r="26" className="il-frame" />
      <circle cx="50" cy="44" r="7" className="il-hole" />
      <line x1="76" y1="26" x2="128" y2="20" className="il-callout" />
      <line x1="80" y1="44" x2="128" y2="66" className="il-callout" />
      <circle cx="78" cy="34" r="6" className="il-callout-ring" />
      <rect x="128" y="14" width="64" height="58" rx="4" className="il-zoom" />
      <rect x="128" y="14" width="64" height="40" className="il-bond" />
      {[
        [136, 22], [150, 18], [166, 24], [182, 19], [142, 34], [158, 32], [174, 36], [186, 30], [134, 46], [152, 44], [168, 48], [184, 45],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x - 2} y={y - 2} width="4" height="4" className="il-diamond" transform={`rotate(45 ${x} ${y})`} />
      ))}
      <Label x="160" y="64">니켈 속 다이아몬드 입자</Label>
      <Label x="50" y="83">안쪽: 허브(알루미늄)</Label>
      <Label x="50" y="91">바깥 테두리: 다이아몬드 날</Label>
      <Label x="160" y="86">확대: 날 가장자리</Label>
    </>
  ),
  'saw-blade-wear': () => (
    <>
      {[
        { x: 50, tip: 66, title: '새 블레이드', note: '날 노출 충분' },
        { x: 150, tip: 54, title: '마모된 블레이드', note: '날이 짧아지고 무뎌짐' },
      ].map((b) => (
        <g key={b.x}>
          <Label x={b.x} y="8">{b.title}</Label>
          <rect x={b.x - 22} y="14" width="44" height="20" className="il-frame" />
          <rect x={b.x - 2} y="34" width="4" height={b.tip - 34} rx={b.tip < 66 ? 2 : 0} className="il-tool" />
          {b.tip < 66 && <rect x={b.x - 2} y={b.tip} width="4" height={66 - b.tip} className="il-worn" />}
          <line x1={b.x + 10} y1="34" x2={b.x + 10} y2={b.tip} className="il-dim" />
          <line x1={b.x + 6} y1={b.tip} x2={b.x + 14} y2={b.tip} className="il-dim" />
          <line x1={b.x + 6} y1="34" x2={b.x + 14} y2="34" className="il-dim" />
          <Label x={b.x} y="76">{b.note}</Label>
        </g>
      ))}
      <Label x="100" y="88">줄어든 만큼 더 내려 보정하고, 한계가 되면 교체</Label>
    </>
  ),

}

// 움직이는 상세 그림
const ANIMATED = new Set(['die-fillet', 'die-void', 'daf', 'saw-cut', 'ultrasonic', 'wire-sweep', 'mold-void', 'mark-depth', 'qfn-burr', 'thin-wafer'])

export function DetailIllustration({ id, still = false }) {
  const draw = detailDrawings[id]
  if (!draw) return null

  return (
    <Playable
      enabled={!still && ANIMATED.has(id)}
      render={(animate) => (
        <svg viewBox="0 0 200 92" className="il il-detail" role="img" aria-label="상세 그림">
          {draw(animate)}
        </svg>
      )}
    />
  )
}
