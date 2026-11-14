import { Anim, Arrow, Label, Move, StepCaption, Visible } from '../illustrationKit.jsx'

// 움직이는 공정 그림: 전공정 사이사이 반복 공정, 팹 아웃·웨이퍼 출하/입고, 웨이퍼 레벨 패키징, 플립칩.
// 자막은 processes.js의 summary·steps·terms를 짧게 줄인 것입니다.
// 움직이지 않을 때(animate false)는 공정이 끝난 모습을 그립니다.

const DUR = '6s'

// 움직일 때는 from~to 동안만 보이고, 멈춘 그림에서는 끝까지 남는 것(to가 1)만 보입니다.
const Show = ({ animate, from, to = 1, children }) =>
  animate ? (
    <Visible from={from} to={to} dur={DUR}>
      {children}
    </Visible>
  ) : to === 1 ? (
    children
  ) : null

// 움직일 때는 단계 자막, 멈춘 그림에서는 한 줄 설명
const Caption = ({ c, animate, items, still }) =>
  animate ? <StepCaption dur={DUR} items={items} /> : <Label x="60" y="76" compact={c}>{still}</Label>

// 회전(rotate '각도 cx cy')을 반복 한 번 안의 시각표대로 바꿉니다.
const Rotate = ({ points }) => {
  const pts = [...points]
  if (pts[0][0] > 0) pts.unshift([0, pts[0][1]])
  if (pts[pts.length - 1][0] < 1) pts.push([1, pts[pts.length - 1][1]])
  return (
    <animateTransform
      attributeName="transform"
      type="rotate"
      values={pts.map(([, v]) => v).join(';')}
      keyTimes={pts.map(([t]) => t).join(';')}
      dur={DUR}
      repeatCount="indefinite"
    />
  )
}

export default {
  // ── 세정: 약품으로 떼어 내고, 초순수로 헹구고, 말립니다. ──
  cleaning: (c, animate) => (
    <>
      <rect x="20" y="50" width="80" height="8" className="il-wafer" />
      {[[30, 48], [46, 47.5], [62, 48], [78, 47.5], [92, 48]].map(([x, y], i) => (
        <circle key={x} cx={x} cy={y} r="1.6" className="il-dust" opacity={animate ? 1 : 0}>
          {animate && (
            <>
              <Move points={[[0.08 + i * 0.04, '0 0'], [0.3 + i * 0.02, '3 -22'], [0.97, '3 -22'], [0.98, '0 0']]} dur={DUR} />
              <Anim attr="opacity" points={[[0.08 + i * 0.04, 1], [0.3 + i * 0.02, 0], [0.97, 0], [0.98, 1]]} dur={DUR} />
            </>
          )}
        </circle>
      ))}
      {[36, 60, 84].map((x) => (
        <rect key={x} x={x - 5} y="10" width="10" height="5" className="il-tool" />
      ))}
      <Show animate={animate} from={0.02} to={0.4}>
        {[36, 60, 84].map((x) => (
          <line key={x} x1={x} y1="16" x2={x} y2="44" className="il-md-chem">
            <Anim attr="stroke-dashoffset" points={[[0, 0], [1, -60]]} dur={DUR} />
          </line>
        ))}
      </Show>
      <Show animate={animate} from={0.4} to={0.7}>
        {[36, 60, 84].map((x) => (
          <line key={x} x1={x} y1="16" x2={x} y2="44" className="il-water">
            <Anim attr="stroke-dashoffset" points={[[0, 0], [1, -60]]} dur={DUR} />
          </line>
        ))}
      </Show>
      <Show animate={animate} from={0.7} to={animate ? 1 : 0.99}>
        <path d="M30 40 Q60 30 90 40" className="il-md-dry" />
        <Arrow x1={86} y1={38} x2={92} y2={41} />
        {[22, 98].map((x) => (
          <circle key={x} cx={x} cy="48" r="1.2" className="il-md-drop">
            <Move points={[[0.7, '0 0'], [0.95, `${x < 60 ? -10 : 10} -4`]]} dur={DUR} />
          </circle>
        ))}
      </Show>
      <Caption
        c={c}
        animate={animate}
        items={[
          [0, 0.4, '① 약품으로 오염을 떼어 냄'],
          [0.4, 0.7, '② 초순수로 헹굼'],
          [0.7, 1, '③ 물 자국 없이 빠르게 말림'],
        ]}
        still="공정 사이마다 오염을 씻어 냄"
      />
    </>
  ),

  // ── CMP: 헤드가 웨이퍼를 돌아가는 패드에 누르고, 슬러리로 튀어나온 곳부터 갈아 냅니다. ──
  cmp: (c, animate) => (
    <>
      <ellipse cx="60" cy="56" rx="46" ry="9" className="il-tool" />
      <ellipse cx="60" cy="56" rx="40" ry="6.5" className="il-oxide" />
      <ellipse cx="60" cy="56" rx="30" ry="4.5" className="il-md-groove">
        {animate && <Anim attr="stroke-dashoffset" points={[[0, 0], [1, -40]]} dur="1.2s" />}
      </ellipse>
      <g transform={animate ? 'translate(0 -6)' : undefined}>
        {animate && <Move points={[[0, '0 -6'], [0.15, '0 0'], [0.85, '0 0'], [1, '0 -6']]} dur={DUR} />}
        <rect x="50" y="24" width="20" height="16" className="il-frame" />
        <rect x="46" y="40" width="28" height="4" className="il-wafer" />
        <rect x="46" y="44" width="28" height="1.6" className="il-oxide" />
        {[49, 57, 65].map((x) => (
          <rect key={x} x={x} y="45.6" width="6" height={animate ? 2.4 : 0} className="il-oxide">
            {animate && <Anim attr="height" points={[[0.35, 2.4], [0.75, 0], [0.97, 0], [0.98, 2.4]]} dur={DUR} />}
          </rect>
        ))}
      </g>
      <rect x="88" y="10" width="12" height="5" className="il-tool" />
      <Show animate={animate} from={0.15} to={animate ? 0.75 : 0.99}>
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="92" cy="17" r="1.4" className="il-md-slurry">
            <Move points={[[0, '0 0'], [1, '-12 32']]} dur={`${0.9 + i * 0.3}s`} />
          </circle>
        ))}
      </Show>
      <Label x="94" y="8" compact={c}>슬러리</Label>
      <Caption
        c={c}
        animate={animate}
        items={[
          [0, 0.15, '① 헤드가 웨이퍼를 패드에 누름'],
          [0.15, 0.35, '② 슬러리를 흘림'],
          [0.35, 0.75, '③ 튀어나온 곳부터 깎여 평평'],
          [0.75, 1, '④ 남은 슬러리를 씻어 냄'],
        ]}
        still="패드에 눌러 갈아 평평하게"
      />
    </>
  ),

  // ── 열처리: 높은 온도로 데워 흐트러진 결정을 되돌리고 불순물을 활성화합니다. ──
  anneal: (c, animate) => {
    const atoms = []
    for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) atoms.push({ x: 74 + k * 10, y: 22 + r * 10, dx: ((k * 7 + r * 5) % 9) - 4, dy: ((k * 5 + r * 3) % 7) - 3 })
    return (
      <>
        <rect x="6" y="18" width="52" height="34" rx="5" className="il-tool" />
        <rect x="14" y="36" width="36" height="5" className="il-wafer" />
        <Show animate={animate} from={0.2} to={animate ? 0.85 : 0.99}>
          {[20, 32, 44].map((x) => (
            <path key={x} d={`M${x} 34 q3 -4 0 -8 q-3 -4 0 -8`} className="il-md-heat" />
          ))}
        </Show>
        <rect x="66" y="14" width="48" height="40" rx="3" className="il-zoom" />
        <line x1="50" y1="38" x2="66" y2="34" className="il-callout" />
        {atoms.map((a, i) => {
          const dopant = i === 5 || i === 10
          return (
            <circle
              key={i}
              cx={a.x}
              cy={a.y}
              r="2.2"
              className={dopant ? 'il-md-dopant' : 'il-wafer'}
              transform={animate ? `translate(${a.dx} ${a.dy})` : undefined}
            >
              {animate && <Move points={[[0, `${a.dx} ${a.dy}`], [0.5, `${a.dx} ${a.dy}`], [0.75, '0 0'], [0.97, '0 0'], [0.98, `${a.dx} ${a.dy}`]]} dur={DUR} />}
            </circle>
          )
        })}
        <Show animate={animate} from={0.75}>
          {[[104, 32], [94, 42]].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="4" className="il-md-glow" />
          ))}
        </Show>
        <Label x="90" y="10" compact={c}>결정 확대</Label>
        <Caption
          c={c}
          animate={animate}
          items={[
            [0, 0.2, '① 이온 주입으로 흐트러진 결정'],
            [0.2, 0.5, '② 높은 온도로 데움'],
            [0.5, 0.75, '③ 결정이 제자리로 돌아옴'],
            [0.75, 1, '④ 불순물이 제 역할(활성화)'],
          ]}
          still="고온으로 결정 회복·불순물 활성화"
        />
      </>
    )
  },

  // ── ALD: 원료 A → 퍼지 → 원료 B → 퍼지를 되풀이해 원자층을 한 층씩 쌓습니다. ──
  ald: (c, animate) => {
    const xs = [26, 34, 42, 50, 58, 66, 74, 82, 90]
    return (
      <>
        <rect x="20" y="56" width="80" height="8" className="il-wafer" />
        <Show animate={animate} from={0.6}>
          <rect x="20" y="53" width="80" height="3" className="il-oxide" />
        </Show>
        <Show animate={animate} from={0.78}>
          <rect x="20" y="50" width="80" height="3" className="il-resist" />
        </Show>
        <Show animate={animate} from={0.92}>
          <rect x="20" y="47" width="80" height="3" className="il-oxide" />
        </Show>
        {!animate && (
          <>
            <rect x="20" y="53" width="80" height="3" className="il-oxide" />
            <rect x="20" y="50" width="80" height="3" className="il-resist" />
            <rect x="20" y="47" width="80" height="3" className="il-oxide" />
          </>
        )}
        {animate && (
          <>
            {/* 원료 A: 표면에 한 층만 붙고, 남은 기체는 퍼지에서 빠져나감 */}
            <Visible from={0.02} to={0.6} dur={DUR}>
              {xs.map((x) => (
                <circle key={x} cx={x} cy="54" r="2" className="il-md-a">
                  <Move points={[[0.02, '0 -36'], [0.18, '0 0']]} dur={DUR} />
                </circle>
              ))}
            </Visible>
            <Visible from={0.08} to={0.35} dur={DUR}>
              {[32, 54, 78].map((x) => (
                <circle key={x} cx={x} cy="30" r="2" className="il-md-a">
                  <Move points={[[0.2, '0 0'], [0.34, '40 -6']]} dur={DUR} />
                </circle>
              ))}
            </Visible>
            <Visible from={0.2} to={0.35} dur={DUR}>
              <Arrow x1={20} y1={34} x2={100} y2={34} />
            </Visible>
            {/* 원료 B: A 위에 붙어 반응 */}
            <Visible from={0.35} to={0.6} dur={DUR}>
              {xs.map((x) => (
                <circle key={x} cx={x} cy="50.5" r="1.6" className="il-md-b">
                  <Move points={[[0.35, '0 -30'], [0.5, '0 0']]} dur={DUR} />
                </circle>
              ))}
            </Visible>
          </>
        )}
        <Show animate={animate} from={0.02} to={0.2}>
          <Label x="40" y="10" compact={c}>원료 A ↓</Label>
        </Show>
        <Show animate={animate} from={0.2} to={0.35}>
          <Label x="60" y="30" compact={c}>퍼지 →</Label>
        </Show>
        <Show animate={animate} from={0.35} to={0.6}>
          <Label x="80" y="10" compact={c}>원료 B ↓</Label>
        </Show>
        <Caption
          c={c}
          animate={animate}
          items={[
            [0, 0.2, '① 원료 A가 표면에 한 층만 붙음'],
            [0.2, 0.35, '② 퍼지: 남은 기체를 불어 냄'],
            [0.35, 0.6, '③ 원료 B가 반응해 원자층 하나'],
            [0.6, 1, '④ 되풀이해 원하는 두께로'],
          ]}
          still="원자층을 한 층씩 번갈아 쌓음"
        />
      </>
    )
  },

  // ── 웨이퍼 맵: EDS가 칩마다 검사한 결과를 지도로 기록하고, 후공정은 양품만 집어 갑니다. ──
  'wafer-map': (c, animate) => {
    const cells = []
    for (let r = 0; r < 5; r++)
      for (let k = 0; k < 5; k++) {
        const x = 22 + k * 8
        const y = 18 + r * 8
        if (Math.hypot(x + 3.5 - 40, y + 3.5 - 38) <= 19) cells.push({ x, y, bad: [3, 8, 14].includes(cells.length) })
      }
    const t = (i) => 0.04 + (i / cells.length) * 0.54
    return (
      <>
        <circle cx="40" cy="38" r="24" className="il-wafer" />
        {cells.map((cell, i) => (
          <g key={`${cell.x}-${cell.y}`}>
            <rect x={cell.x} y={cell.y} width="7" height="7" className="il-die" />
            <Show animate={animate} from={t(i)}>
              <rect x={cell.x} y={cell.y} width="7" height="7" className={cell.bad ? 'il-md-bad' : 'il-md-good'} />
            </Show>
          </g>
        ))}
        {animate && (
          <g>
            <Move points={[[0, `${cells[0].x + 3.5} ${cells[0].y - 6}`], ...cells.map((cell, i) => [t(i), `${cell.x + 3.5} ${cell.y - 6}`]), [0.62, '40 -4'], [1, '40 -4']]} dur={DUR} />
            <line x1="0" y1="-8" x2="0" y2="5" className="il-probe" />
            <rect x="-6" y="-12" width="12" height="4" className="il-tool" />
          </g>
        )}
        <Show animate={animate} from={0.6}>
          <rect x="80" y="22" width="30" height="30" rx="2" className="il-die" />
          {cells.map((cell) => (
            <rect key={`m-${cell.x}-${cell.y}`} x={80 + (cell.x - 22) * 0.6 + 2} y={22 + (cell.y - 18) * 0.6 + 2} width="4" height="4" className={cell.bad ? 'il-md-bad' : 'il-md-good'} />
          ))}
          <Arrow x1={66} y1={38} x2={78} y2={38} />
          <Label x="95" y="18" compact={c}>웨이퍼 맵</Label>
        </Show>
        <Show animate={animate} from={0.8}>
          {cells
            .filter((cell) => !cell.bad)
            .slice(0, 4)
            .map((cell) => (
              <path key={`p-${cell.x}-${cell.y}`} d={`M${cell.x + 1.5} ${cell.y + 3.5} l1.5 1.5 l3 -3`} className="il-check" style={{ strokeWidth: 1.2 }} />
            ))}
        </Show>
        <Caption
          c={c}
          animate={animate}
          items={[
            [0, 0.6, '① EDS로 칩마다 검사'],
            [0.6, 0.8, '② 양품·불량 위치를 지도로 기록'],
            [0.8, 1, '③ 후공정은 양품 칩만 집어 감'],
          ]}
          still="칩마다 양품·불량 위치를 기록"
        />
      </>
    )
  },

  // ── 웨이퍼 운반·보관: 밀폐 용기에 담아 다른 공장(OSAT)으로 옮깁니다. ──
  'wafer-transport': (c, animate) => (
    <>
      <polygon points="6,56 6,36 18,28 30,36 30,56" className="il-tool" />
      <polygon points="90,56 90,36 102,28 114,36 114,56" className="il-tool" />
      <line x1="4" y1="56" x2="116" y2="56" className="il-line" />
      <Label x="18" y="64" compact={c}>팹</Label>
      <Label x="102" y="64" compact={c}>OSAT</Label>
      <g transform={animate ? undefined : 'translate(58 0)'}>
        {animate && <Move points={[[0, '0 0'], [0.4, '0 0'], [0.8, '58 0'], [1, '58 0']]} dur={DUR} />}
        <rect x="26" y="40" width="20" height="16" rx="2" className="il-frame" />
        {[44, 47, 50].map((y, i) =>
          animate ? (
            <line key={y} x1="29" y1={y} x2="43" y2={y} className="il-md-waferline">
              <Anim attr="x1" points={[[0, 2], [0.1 + i * 0.08, 2], [0.18 + i * 0.08, 29]]} dur={DUR} />
              <Anim attr="x2" points={[[0, 16], [0.1 + i * 0.08, 16], [0.18 + i * 0.08, 43]]} dur={DUR} />
            </line>
          ) : (
            <line key={y} x1="29" y1={y} x2="43" y2={y} className="il-md-waferline" />
          ),
        )}
        <Show animate={animate} from={0.34}>
          <rect x="26" y="40" width="20" height="16" rx="2" className="il-md-door" />
          <rect x="31" y="36" width="10" height="4" rx="1" className="il-frame" />
        </Show>
      </g>
      <Show animate={animate} from={0.82}>
        <path d="M100 18 l3 3 l6 -7" className="il-check" />
      </Show>
      <Caption
        c={c}
        animate={animate}
        items={[
          [0, 0.4, '① 웨이퍼를 밀폐 용기에 담음'],
          [0.4, 0.8, '② 오염·충격을 막으며 옮김'],
          [0.8, 1, '③ 후공정 공장(OSAT)에 도착'],
        ]}
        still="밀폐 용기에 담아 옮기고 보관"
      />
    </>
  ),

  // ── 입고 검사: 수량, 겉모습, 웨이퍼 맵을 확인한 뒤 다음 공정으로 보냅니다. ──
  'incoming-inspection': (c, animate) => (
    <>
      <circle cx="34" cy="36" r="20" className="il-wafer" />
      <g transform={animate ? undefined : 'translate(0 0)'}>
        {animate && <Move points={[[0, '-6 -8'], [0.3, '-6 -8'], [0.45, '8 6'], [0.6, '-4 10'], [0.62, '-6 -8']]} dur={DUR} />}
        <circle cx="38" cy="30" r="8" className="il-hole" />
        <line x1="44" y1="36" x2="52" y2="45" className="il-needle" />
      </g>
      {[
        ['수량', 0.25, 22],
        ['겉모습', 0.55, 36],
        ['맵', 0.82, 50],
      ].map(([text, at, y]) => (
        <g key={text}>
          <rect x="66" y={y - 6} width="44" height="10" rx="2" className="il-die" />
          <Label x="82" y={y + 1} compact={c}>{text}</Label>
          <Show animate={animate} from={at}>
            <path d={`M98 ${y - 1} l2.5 2.5 l5 -5`} className="il-check" style={{ strokeWidth: 2 }} />
          </Show>
        </g>
      ))}
      <Caption
        c={c}
        animate={animate}
        items={[
          [0, 0.3, '① 웨이퍼 수량 확인'],
          [0.3, 0.6, '② 깨짐·긁힘 겉모습 확인'],
          [0.6, 0.85, '③ 웨이퍼 맵이 맞는지 확인'],
          [0.85, 1, '④ 확인을 마치고 다음 공정으로'],
        ]}
        still="수량·겉모습·맵이 맞는지 확인"
      />
    </>
  ),

  // ── TSV: 깊은 구멍 → 절연막·장벽층 → 구리 채우기 → 평탄화 → 뒷면 노출 ──
  tsv: (c, animate) => (
    <>
      <rect x="20" y="16" width="80" height="30" className="il-wafer" />
      <rect x="20" y="46" width="80" height={animate ? 10 : 0} className="il-wafer">
        {animate && <Anim attr="height" points={[[0.8, 10], [0.97, 0], [0.99, 10]]} dur={DUR} />}
      </rect>
      {[40, 60, 80].map((x) => (
        <g key={x}>
          <rect x={x - 3} y="16" width="6" height={animate ? 0 : 30} className="il-md-hole">
            {animate && <Anim attr="height" points={[[0, 0], [0.18, 30], [0.98, 30], [0.99, 0]]} dur={DUR} />}
          </rect>
          <Show animate={animate} from={0.2}>
            <rect x={x - 3} y="16" width="6" height="30" className="il-md-liner" />
          </Show>
          <rect x={x - 2.2} y={animate ? 46 : 16} width="4.4" height={animate ? 0 : 30} className="il-cu">
            {animate && (
              <>
                <Anim attr="y" points={[[0.4, 46], [0.58, 16], [0.98, 16], [0.99, 46]]} dur={DUR} />
                <Anim attr="height" points={[[0.4, 0], [0.58, 30], [0.98, 30], [0.99, 0]]} dur={DUR} />
              </>
            )}
          </rect>
        </g>
      ))}
      {animate && (
        <rect x="20" y="13" width="80" height="3" className="il-cu" opacity="0">
          <Anim attr="opacity" points={[[0.5, 0], [0.52, 1], [0.6, 1], [0.75, 0]]} dur={DUR} />
          <Anim attr="height" points={[[0.6, 3], [0.75, 0], [0.98, 0], [0.99, 3]]} dur={DUR} />
        </rect>
      )}
      <Caption
        c={c}
        animate={animate}
        items={[
          [0, 0.2, '① 실리콘에 깊은 구멍을 팜'],
          [0.2, 0.4, '② 벽에 절연막·장벽층'],
          [0.4, 0.6, '③ 도금으로 구리를 채움'],
          [0.6, 0.78, '④ 넘친 구리를 CMP로 갈아 냄'],
          [0.78, 1, '⑤ 뒷면을 갈아 구리 끝 노출'],
        ]}
        still="실리콘을 꿰뚫는 구리 기둥"
      />
    </>
  ),

  // ── RDL: 절연층 → 구리 배선으로 가장자리 패드를 새 자리로 → 덮고 범프 자리만 엶 ──
  rdl: (c, animate) => {
    const routes = [
      [[26, 16], [44, 16], [44, 28]],
      [[26, 50], [44, 50], [44, 40]],
      [[92, 16], [76, 16], [76, 28]],
      [[92, 50], [76, 50], [76, 40]],
    ]
    return (
      <>
        <rect x="20" y="10" width="80" height="48" className="il-die" />
        <Show animate={animate} from={0.05}>
          <rect x="20" y="10" width="80" height="48" className="il-md-dielectric" />
        </Show>
        {routes.map((r) => (
          <rect key={`p-${r[0][0]}-${r[0][1]}`} x={r[0][0] - 3} y={r[0][1] - 3} width="6" height="6" className="il-frame" />
        ))}
        {routes.map((r) => (
          <polyline
            key={`r-${r[0][0]}-${r[0][1]}`}
            points={r.map((p) => p.join(',')).join(' ')}
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={animate ? 1 : 0}
            className="il-link"
          >
            {animate && <Anim attr="stroke-dashoffset" points={[[0.3, 1], [0.65, 0], [0.98, 0], [0.99, 1]]} dur={DUR} />}
          </polyline>
        ))}
        <Show animate={animate} from={0.7}>
          {routes.map((r) => {
            const [x, y] = r[r.length - 1]
            return <circle key={`b-${x}-${y}`} cx={x} cy={y} r="3.6" className="il-bump" />
          })}
        </Show>
        <Caption
          c={c}
          animate={animate}
          items={[
            [0, 0.3, '① 절연층을 바르고 패드만 엶'],
            [0.3, 0.7, '② 구리 배선으로 패드를 새 자리로'],
            [0.7, 1, '③ 덮고 범프 놓일 자리만 엶'],
          ]}
          still="가장자리 패드를 새 자리로 옮김"
        />
      </>
    )
  },

  // ── 범핑: UBM → 감광막으로 자리 열기 → 도금 → 정리 → 리플로우로 둥글게 ──
  bumping: (c, animate) => (
    <>
      <rect x="18" y="52" width="84" height="10" className="il-wafer" />
      <rect x="50" y="49" width="20" height="3" className="il-frame" />
      <Show animate={animate} from={0.05}>
        <rect x="48" y="47.5" width="24" height="1.5" className="il-rdl" />
      </Show>
      <Show animate={animate} from={0.2} to={0.6}>
        <rect x="20" y="30" width="30" height="17.5" className="il-resist" />
        <rect x="70" y="30" width="30" height="17.5" className="il-resist" />
      </Show>
      <Show animate={animate} from={0.4} to={0.75}>
        <rect x="51" y="32" width="18" height="15.5" className="il-ball">
          {animate && (
            <>
              <Anim attr="y" points={[[0.4, 47.5], [0.58, 32]]} dur={DUR} />
              <Anim attr="height" points={[[0.4, 0], [0.58, 15.5]]} dur={DUR} />
            </>
          )}
        </rect>
      </Show>
      <Show animate={animate} from={0.75}>
        <ellipse cx="60" cy="39" rx="10" ry="9" className="il-ball" />
      </Show>
      <Caption
        c={c}
        animate={animate}
        items={[
          [0, 0.2, '① 범프 아래 금속층(UBM)'],
          [0.2, 0.4, '② 감광막으로 범프 자리만 엶'],
          [0.4, 0.6, '③ 도금으로 금속을 쌓음'],
          [0.6, 0.75, '④ 감광막을 벗겨 냄'],
          [0.75, 1, '⑤ 리플로우로 둥근 범프'],
        ]}
        still="패드 위에 둥근 범프를 만듦"
      />
    </>
  ),

  // ── 플립칩 본딩: 범프 다이를 뒤집어 기판 패드에 맞추고 리플로우로 붙입니다. ──
  'flipchip-bond': (c, animate) => {
    const xs = [42, 52, 62, 72, 80]
    return (
      <>
        <rect x="15" y="60" width="90" height="8" className="il-substrate" />
        {xs.map((x) => (
          <rect key={x} x={x - 3} y="58" width="6" height="2" className="il-cu" />
        ))}
        <g transform={animate ? undefined : 'translate(0 24)'}>
          {animate && <Move points={[[0, '0 0'], [0.25, '0 0'], [0.55, '0 24'], [0.97, '0 24'], [0.98, '0 0']]} dur={DUR} />}
          <g>
            {animate && <Rotate points={[[0, '180 61 26'], [0.22, '0 61 26'], [0.97, '0 61 26'], [0.98, '180 61 26']]} />}
            <rect x="36" y="20" width="50" height="8" className="il-die" />
            {xs.map((x) => (
              <ellipse key={x} cx={x} cy="31" rx="3" ry="3" className="il-bump">
                {animate && <Anim attr="ry" points={[[0.6, 3], [0.75, 2.3], [0.97, 2.3], [0.98, 3]]} dur={DUR} />}
              </ellipse>
            ))}
          </g>
        </g>
        <Show animate={animate} from={0.25} to={0.55}>
          <Arrow x1={20} y1={40} x2={32} y2={40} />
          <Arrow x1={100} y1={40} x2={90} y2={40} />
        </Show>
        <Show animate={animate} from={0.55} to={0.8}>
          {[30, 92].map((x) => (
            <path key={x} d={`M${x} 58 q3 -4 0 -8 q-3 -4 0 -8`} className="il-md-heat" />
          ))}
        </Show>
        <Caption
          c={c}
          animate={animate}
          items={[
            [0, 0.25, '① 범프가 있는 다이를 뒤집음'],
            [0.25, 0.55, '② 기판 패드에 맞춰 정렬'],
            [0.55, 0.8, '③ 리플로우로 범프를 붙임'],
            [0.8, 1, '④ 와이어 대신 범프로 연결'],
          ]}
          still="뒤집은 다이를 범프로 기판에 연결"
        />
      </>
    )
  },

  // ── 언더필: 다이 옆에 바른 수지가 모세관 현상으로 틈에 스며듭니다. ──
  underfill: (c, animate) => {
    const xs = [40, 48, 56, 64, 72, 80]
    return (
      <>
        <rect x="20" y="56" width="80" height="8" className="il-substrate" />
        <rect x={animate ? 85 : 35} y="46" width={animate ? 0 : 50} height="10" className="il-glue">
          {animate && (
            <>
              <Anim attr="x" points={[[0.15, 85], [0.7, 35], [0.97, 35], [0.98, 85]]} dur={DUR} />
              <Anim attr="width" points={[[0.15, 0], [0.7, 50], [0.97, 50], [0.98, 0]]} dur={DUR} />
            </>
          )}
        </rect>
        <Show animate={animate} from={0.08}>
          <polygon points="85,46 85,56 92,56" className="il-glue" />
        </Show>
        {xs.map((x) => (
          <circle key={x} cx={x} cy="51" r="3" className="il-bump" />
        ))}
        <rect x="35" y="38" width="50" height="8" className="il-die" />
        <Show animate={animate} from={0} to={animate ? 0.75 : 0.99}>
          <path d="M100 18 L91 42" className="il-needle" />
        </Show>
        <Show animate={animate} from={0.15} to={0.7}>
          <Arrow x1={78} y1={34} x2={44} y2={34} />
          <Label x="60" y="30" compact={c}>모세관 현상</Label>
        </Show>
        <Caption
          c={c}
          animate={animate}
          items={[
            [0, 0.15, '① 다이 옆에 수지를 바름'],
            [0.15, 0.7, '② 모세관 현상으로 틈에 스며듦'],
            [0.7, 1, '③ 틈이 채워져 범프 접합부 보호'],
          ]}
          still="다이와 기판 사이 틈을 수지로 채움"
        />
      </>
    )
  },
}
