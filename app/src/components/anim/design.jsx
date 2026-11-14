import { Anim, Arrow, Label, Move, StepCaption, Visible } from '../illustrationKit.jsx'

// 칩 설계 7개 공정과 보드 실장의 움직이는 그림. 자막은 processes.js의 summary·steps·terms에서 가져왔습니다.
// animate가 false이면 마지막 단계까지 끝난 모습을 그립니다.

// 움직일 때는 from 이후에만 보이고, 멈춘 그림에서는 그대로 보입니다.
const Show = ({ animate, from, to = 1, dur, children }) =>
  animate ? (
    <Visible from={from} to={to} dur={dur}>
      {children}
    </Visible>
  ) : (
    children
  )

const Caption = ({ animate, dur, items, still, c }) =>
  animate ? <StepCaption dur={dur} items={items} /> : <Label x="60" y="76" compact={c}>{still}</Label>

const Check = ({ x, y }) => <path d={`M${x} ${y} l2.5 2.5 l5 -6`} className="il-check" />

export default {
  spec: (c, animate) => {
    const dur = '6s'
    const items = ['기능', '성능', '전력', '크기']
    return (
      <>
        <rect x="30" y="6" width="60" height="58" rx="2" className="il-die" />
        <Label x="60" y="14" compact={c}>칩 사양서</Label>
        {items.map((name, i) => {
          const y = 24 + i * 10
          return (
            <g key={name}>
              <rect x="36" y={y - 5} width="7" height="7" className="il-tool" />
              <Show animate={animate} from={0.15 + i * 0.18} dur={dur}>
                <Check x={36.5} y={y - 1} />
                {!c && (
                  <text x="48" y={y + 1} className="il-label il-ds-item">
                    {name}
                  </text>
                )}
              </Show>
              {c && <line x1="48" y1={y - 1.5} x2={i % 2 ? 76 : 82} y2={y - 1.5} className="il-line" />}
            </g>
          )
        })}
        <Caption
          c={c}
          animate={animate}
          dur={dur}
          items={[
            [0, 0.15, '① 어디에 쓰일 칩인지 정함'],
            [0.15, 0.87, '② 기능·성능·전력·크기 목표를 채움'],
            [0.87, 1, '③ 칩 사양서 완성 → 설계 목표'],
          ]}
          still="기능·성능·전력·크기 목표를 정한 사양서"
        />
      </>
    )
  },

  rtl: (c, animate) => {
    const dur = '6s'
    const code = ['module chip', ' always @(clk)', '  q <= a+b;', 'endmodule']
    return (
      <>
        <rect x="6" y="8" width="62" height="54" rx="3" className="il-tool" />
        {code.map((line, i) => (
          <g key={line}>
            {!c && (
              <text x="10" y={20 + i * 11} className="il-code">
                {line}
              </text>
            )}
            {c && <line x1="12" y1={18 + i * 11} x2={i % 2 ? 50 : 60} y2={18 + i * 11} className="il-line" />}
            {/* 한 줄씩 타이핑되는 것처럼 왼쪽부터 드러냅니다. */}
            {animate && (
              <rect x="9" y={13 + i * 11} width="58" height="9" className="il-ds-cover">
                <Anim attr="x" points={[[0.05 + i * 0.12, 9], [0.15 + i * 0.12, 67], [0.98, 67], [0.99, 9]]} dur={dur} />
                <Anim attr="width" points={[[0.05 + i * 0.12, 58], [0.15 + i * 0.12, 0], [0.98, 0], [0.99, 58]]} dur={dur} />
              </rect>
            )}
          </g>
        ))}
        <Show animate={animate} from={0.55} dur={dur}>
          <Arrow x1={70} y1={35} x2={78} y2={35} />
          <rect x="80" y="14" width="16" height="12" className="il-oxide" />
          <rect x="80" y="44" width="16" height="12" className="il-oxide" />
          <rect x="100" y="28" width="16" height="14" className="il-resist" />
          <line x1="96" y1="20" x2="100" y2="32" className="il-line" />
          <line x1="96" y1="50" x2="100" y2="38" className="il-line" />
          <Label x="98" y="10" compact={c}>블록 구성</Label>
        </Show>
        <Caption
          c={c}
          animate={animate}
          dur={dur}
          items={[
            [0, 0.55, '① 하드웨어 기술 언어로 동작을 작성'],
            [0.55, 1, '② 코드가 칩의 블록 구성이 됨 (RTL)'],
          ]}
          still="칩의 동작을 코드(RTL)로 설계"
        />
      </>
    )
  },

  verification: (c, animate) => {
    const dur = '6s'
    // 기대 파형(위)과 설계 파형(아래). 처음에는 한 칸이 다르고, 고친 뒤에는 같아집니다.
    const wave = (y, bad) =>
      Array.from({ length: 8 }, (_, k) => {
        const high = bad && k === 4 ? false : k % 2 === 0
        const yy = high ? y : y + 8
        return `${18 + k * 11},${yy} ${29 + k * 11},${yy}`
      }).join(' ')
    return (
      <>
        <Label x="8" y="22" compact={c}>기대</Label>
        <Label x="8" y="44" compact={c}>설계</Label>
        <polyline points={wave(16, false)} className="il-link" />
        {/* 고치기 전 파형: 다른 칸이 빨간 원으로 표시됩니다. */}
        {animate && (
          <Visible from={0} to={0.55} dur={dur}>
            <polyline points={wave(38, true)} className="il-link" />
            <Visible from={0.25} to={0.55} dur={dur}>
              <circle cx="67.5" cy="42" r="7" className="il-warn-ring" />
              <Label x="63" y="58" compact={c}>다름! 오류 발견</Label>
            </Visible>
          </Visible>
        )}
        <Show animate={animate} from={0.55} dur={dur}>
          <polyline points={wave(38, false)} className="il-ds-pass" />
          <Check x={106} y={58} />
          <Label x="80" y="58" compact={c}>사양과 일치</Label>
        </Show>
        {animate && (
          <line x1="18" y1="10" x2="18" y2="50" className="il-dim">
            <Anim attr="x1" points={[[0, 18], [0.5, 106], [0.55, 18], [1, 106]]} dur={dur} />
            <Anim attr="x2" points={[[0, 18], [0.5, 106], [0.55, 18], [1, 106]]} dur={dur} />
          </line>
        )}
        <Caption
          c={c}
          animate={animate}
          dur={dur}
          items={[
            [0, 0.25, '① 시뮬레이션으로 수많은 경우를 시험'],
            [0.25, 0.55, '② 사양과 다른 곳(오류)을 찾음'],
            [0.55, 1, '③ 고친 뒤 다시 돌려 통과'],
          ]}
          still="시뮬레이션으로 오류를 찾아 고침"
        />
      </>
    )
  },

  synthesis: (c, animate) => {
    const dur = '6s'
    const gates = [
      [62, 12],
      [62, 40],
      [92, 26],
    ]
    return (
      <>
        <rect x="6" y="14" width="34" height="34" rx="2" className="il-tool" />
        {!c && (
          <>
            <text x="9" y="26" className="il-code">
              q&lt;=a+b;
            </text>
            <text x="9" y="38" className="il-code">
              y&lt;=q&amp;c;
            </text>
          </>
        )}
        {c && [24, 34].map((y) => <line key={y} x1="10" y1={y} x2="36" y2={y} className="il-line" />)}
        <Label x="23" y="9" compact={c}>RTL</Label>
        <Show animate={animate} from={0.2} dur={dur}>
          <Arrow x1={42} y1={31} x2={54} y2={31} />
        </Show>
        {gates.map(([x, y], i) => (
          <Show key={`${x}-${y}`} animate={animate} from={0.3 + i * 0.12} dur={dur}>
            <path d={`M${x} ${y} h8 a8 8 0 0 1 0 16 h-8 z`} className="il-die" />
          </Show>
        ))}
        <Show animate={animate} from={0.7} dur={dur}>
          <polyline points="78,20 85,20 85,30 92,30" className="il-link" />
          <polyline points="78,48 85,48 85,38 92,38" className="il-link" />
          <line x1="108" y1="34" x2="116" y2="34" className="il-link" />
          <Label x="88" y="66" compact={c}>넷리스트</Label>
        </Show>
        <Caption
          c={c}
          animate={animate}
          dur={dur}
          items={[
            [0, 0.3, '① 검증을 통과한 RTL 코드'],
            [0.3, 0.7, '② 표준 셀(게이트)로 바꿈'],
            [0.7, 1, '③ 셀 연결도 = 넷리스트'],
          ]}
          still="RTL을 표준 셀 연결도(넷리스트)로 바꿈"
        />
      </>
    )
  },

  'physical-design': (c, animate) => {
    const dur = '7s'
    const blocks = [
      [16, 8, 28, 22],
      [76, 8, 28, 22],
      [16, 40, 28, 20],
    ]
    const cells = Array.from({ length: 9 }, (_, i) => [52 + (i % 3) * 7, 36 + Math.floor(i / 3) * 7])
    return (
      <>
        <rect x="10" y="4" width="100" height="62" className="il-die" />
        {blocks.map(([x, y, w, h], i) => (
          <Show key={`${x}-${y}`} animate={animate} from={0.05 + i * 0.06} dur={dur}>
            <rect x={x} y={y} width={w} height={h} className="il-oxide" />
          </Show>
        ))}
        {cells.map(([x, y], i) => (
          <Show key={`${x}-${y}`} animate={animate} from={0.3 + i * 0.03} dur={dur}>
            <rect x={x} y={y} width="5" height="5" className="il-resist" />
          </Show>
        ))}
        <Show animate={animate} from={0.62} dur={dur}>
          <polyline points="44,19 76,19" className="il-link" />
          <polyline points="30,30 30,35 52,35" className="il-link" />
          <polyline points="68,44 90,44 90,30" className="il-link" />
          <polyline points="44,50 52,50" className="il-link" />
        </Show>
        <Show animate={animate} from={0.84} dur={dur}>
          <Check x={96} y={56} />
        </Show>
        <Caption
          c={c}
          animate={animate}
          dur={dur}
          items={[
            [0, 0.3, '① 플로어플랜: 큰 블록 자리 정하기'],
            [0.3, 0.62, '② 배치: 표준 셀을 칩 위에 놓기'],
            [0.62, 0.84, '③ 배선: 셀 사이를 금속선으로 잇기'],
            [0.84, 1, '④ 타이밍·전력 확인 → 레이아웃 완성'],
          ]}
          still="셀을 배치하고 배선으로 이어 레이아웃 완성"
        />
      </>
    )
  },

  tapeout: (c, animate) => {
    const dur = '6s'
    return (
      <>
        <rect x="8" y="12" width="40" height="40" className="il-die" />
        <rect x="14" y="18" width="12" height="10" className="il-oxide" />
        <rect x="32" y="34" width="10" height="12" className="il-oxide" />
        <line x1="26" y1="23" x2="37" y2="34" className="il-link" />
        {[
          ['DRC', 0.12],
          ['LVS', 0.35],
        ].map(([name, at], i) => (
          <g key={name}>
            <Show animate={animate} from={at} dur={dur}>
              {!c && (
                <text x={54} y={22 + i * 12} className="il-label il-ds-item">
                  {name}
                </text>
              )}
              <Check x={c ? 54 : 78} y={20 + i * 12} />
            </Show>
          </g>
        ))}
        <Show animate={animate} from={0.58} dur={dur}>
          <g>
            <rect x="56" y="42" width="16" height="12" rx="1" className="il-resist" />
            <Label x="64" y="50" compact={c}>GDS</Label>
            {animate && <Move points={[[0.58, '0 0'], [0.85, '20 0']]} dur={dur} />}
          </g>
        </Show>
        <path d="M94 56 V36 l7 -5 v5 l7 -5 v5 l7 -5 V56 z" className="il-tool" />
        <Label x="104" y="64" compact={c}>파운드리</Label>
        <Caption
          c={c}
          animate={animate}
          dur={dur}
          items={[
            [0, 0.35, '① DRC: 제조 규칙에 맞는지 검사'],
            [0.35, 0.58, '② LVS: 레이아웃과 회로가 같은지 검사'],
            [0.58, 1, '③ 설계 데이터(GDS)를 파운드리로'],
          ]}
          still="규칙 검사 통과 → GDS를 파운드리로"
        />
      </>
    )
  },

  mask: (c, animate) => {
    const dur = '6s'
    const patterns = [
      [30, 16, 18, 10],
      [56, 16, 30, 6],
      [30, 34, 10, 18],
      [48, 30, 38, 8],
      [48, 44, 24, 8],
    ]
    return (
      <>
        <rect x="22" y="8" width="76" height="52" rx="2" className="il-oxide" />
        {patterns.map(([x, y, w, h], i) => (
          <Show key={`${x}-${y}`} animate={animate} from={0.12 + i * 0.13} dur={dur}>
            <rect x={x} y={y} width={w} height={h} className="il-frame" />
          </Show>
        ))}
        {/* 쓰는 빔: 무늬를 하나씩 따라가며 새깁니다. */}
        {animate && (
          <g>
            <line x1="0" y1="-14" x2="0" y2="0" className="il-laser" />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="39 21;71 19;35 43;67 34;60 48;60 48"
              keyTimes="0;0.25;0.38;0.51;0.64;1"
              dur={dur}
              repeatCount="indefinite"
            />
          </g>
        )}
        <Caption
          c={c}
          animate={animate}
          dur={dur}
          items={[
            [0, 0.12, '① 설계 데이터(GDS)의 한 층을 읽음'],
            [0.12, 0.8, '② 회로 무늬를 유리판에 새김'],
            [0.8, 1, '③ 층마다 한 장 → 포토마스크 세트'],
          ]}
          still="층마다 회로 무늬를 유리판(마스크)에 새김"
        />
      </>
    )
  },

  smt: (c, animate) => {
    const dur = '7s'
    const pads = [40, 52, 68, 80]
    return (
      <>
        <rect x="10" y="50" width="100" height="8" className="il-substrate" />
        <Label x="22" y="66" compact={c}>PCB</Label>
        {pads.map((x) => (
          <rect key={x} x={x - 3} y="48" width="6" height="2" className="il-cu" />
        ))}
        {/* ① 솔더 페이스트 */}
        {pads.map((x, i) => (
          <Show key={x} animate={animate} from={0.08 + i * 0.04} dur={dur}>
            {animate ? (
              <>
                <Visible from={0} to={0.72} dur={dur}>
                  <rect x={x - 2.5} y="45" width="5" height="3" rx="1" className="il-ds-paste" />
                </Visible>
                <Visible from={0.72} to={1} dur={dur}>
                  <path d={`M${x - 3} 48 q3 -4 6 0 z`} className="il-ds-solder" />
                </Visible>
              </>
            ) : (
              <path d={`M${x - 3} 48 q3 -4 6 0 z`} className="il-ds-solder" />
            )}
          </Show>
        ))}
        {/* ② 패키지 올리기 */}
        <Show animate={animate} from={0.35} dur={dur}>
          <g>
            <rect x="36" y="34" width="48" height="11" rx="1" className="il-mold" />
            {animate && <Move points={[[0.35, '0 -24'], [0.55, '0 0']]} dur={dur} />}
          </g>
        </Show>
        {/* ③ 리플로우: 데워서 솔더를 녹임 */}
        <Show animate={animate} from={0.62} to={0.85} dur={dur}>
          {[30, 60, 90].map((x) => (
            <path key={x} d={`M${x} 30 q2.5 -3.5 0 -7 q-2.5 -3.5 0 -7`} className="il-ds-heat" />
          ))}
        </Show>
        <Show animate={animate} from={0.86} dur={dur}>
          <Check x={92} y={36} />
        </Show>
        <Caption
          c={c}
          animate={animate}
          dur={dur}
          items={[
            [0, 0.35, '① 기판 패드에 솔더 페이스트 인쇄'],
            [0.35, 0.62, '② 장비가 패키지를 집어 올림'],
            [0.62, 0.86, '③ 리플로우: 데워서 솔더를 녹여 붙임'],
            [0.86, 1, '④ 붙은 상태를 검사'],
          ]}
          still="솔더를 녹여 패키지를 기판에 붙임"
        />
      </>
    )
  },
}
