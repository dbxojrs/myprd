// 공정과 패키지를 설명하는 단순한 그림(SVG). 실제 장비·제품 사진이 아니라 개념도입니다.
// compact가 true이면 상단 흐름 막대용으로 글자 없이 작게 그립니다.
// 공정 그림 함수는 (compact, animate)를 받습니다. animate가 true일 때만 SVG 애니메이션(<animate>)을 넣고,
// false이면 공정이 끝난 모습을 멈춘 그림으로 그립니다.

import { useState } from 'react'

export const Arrow = ({ x1, y1, x2, y2 }) => (
  <g className="il-arrow">
    <line x1={x1} y1={y1} x2={x2} y2={y2} />
    <polygon
      points={(() => {
        const angle = Math.atan2(y2 - y1, x2 - x1)
        const s = 5
        const p1 = [x2 - s * Math.cos(angle - 0.5), y2 - s * Math.sin(angle - 0.5)]
        const p2 = [x2 - s * Math.cos(angle + 0.5), y2 - s * Math.sin(angle + 0.5)]
        return `${x2},${y2} ${p1.join(',')} ${p2.join(',')}`
      })()}
    />
  </g>
)

// ── 쏘잉 그림: 옆에서 본 모습(왼쪽)과 위에서 본 모습(오른쪽)을 같은 시간에 맞춰 움직입니다. ──
// 블레이드는 자르는 방향(왼쪽 → 오른쪽)으로 돌며 나아가고, 한 줄을 다 자르면 들어 올려 다음 줄로 옮깁니다.

// [시각(0–1), 값] 목록을 SMIL의 values·keyTimes로 바꿉니다. 같은 시각은 아주 조금씩 밀어 순서를 지킵니다.
function track(points) {
  const pts = [...points]
  if (pts[0][0] > 0) pts.unshift([0, pts[0][1]])
  if (pts[pts.length - 1][0] < 1) pts.push([1, pts[pts.length - 1][1]])
  const times = []
  pts.forEach(([t], i) => times.push(i > 0 && t <= times[i - 1] ? times[i - 1] + 0.0005 : t))
  return {
    values: pts.map(([, v]) => v).join(';'),
    keyTimes: times.map((t) => +Math.min(t, 1).toFixed(4)).join(';'),
  }
}

export const Anim = ({ attr, points, dur }) => (
  <animate attributeName={attr} {...track(points)} dur={dur} repeatCount="indefinite" />
)

export const Move = ({ points, dur }) => (
  <animateTransform attributeName="transform" type="translate" {...track(points)} dur={dur} repeatCount="indefinite" />
)

// 옆에서 본 블레이드: 원판 면이 보입니다. 회전을 보여주려고 살 두 개를 돌립니다.
const SideBlade = ({ cy, r, animate }) => (
  <g>
    <circle cx="0" cy={cy} r={r} className="il-tool" />
    <g className="il-blade-spokes">
      <line x1={-r + 2} y1={cy} x2={r - 2} y2={cy} />
      <line x1="0" y1={cy - r + 2} x2="0" y2={cy + r - 2} />
      {animate && (
        <animateTransform attributeName="transform" type="rotate" from={`0 0 ${cy}`} to={`360 0 ${cy}`} dur="0.5s" repeatCount="indefinite" />
      )}
    </g>
    <circle cx="0" cy={cy} r={r} className="il-blade-edge" />
  </g>
)

// 쏘잉 그림 공통 틀. side: 옆에서 본 층(위에서 아래 순서), top: 위에서 본 모양과 절단선 위치
function sawDrawing({ layers, cutBottom, topShape, streets, gridLines, cutClass = 'il-cut-top', caption }) {
  const SIDE_START = 5
  const SIDE_END = 115
  const MAT_START = 15
  const MAT_END = 105
  const BLADE_CY = 44
  const LIFT = -10
  const topX = (bx) => 16 + ((bx - SIDE_START) * 88) / (SIDE_END - SIDE_START)

  return (c, animate) => {
    const n = streets.length
    const hold = 0.1
    const seg = (1 - hold) / n
    const dur = `${(n * 1.8 + 0.8).toFixed(1)}s`
    const matTop = layers[0].y

    // 줄마다: 내려감(b) → 자르며 이동(e) → 들어 올림(f) → 다음 줄 시작점으로 복귀(g)
    const phases = streets.map((y, i) => {
      const a = i * seg
      const b = a + seg * 0.08
      const e = a + seg * 0.78
      const f = a + seg * 0.85
      const g = a + seg
      const at = (bx) => b + ((bx - SIDE_START) / (SIDE_END - SIDE_START)) * (e - b)
      return { y, a, b, e, f, g, at, next: streets[(i + 1) % n] }
    })

    const sideBlade = phases.flatMap((p) => [
      [p.a, `${SIDE_START} ${LIFT}`],
      [p.b, `${SIDE_START} 0`],
      [p.e, `${SIDE_END} 0`],
      [p.f, `${SIDE_END} ${LIFT}`],
      [p.g, `${SIDE_START} ${LIFT}`],
    ])
    const kerf = phases.flatMap((p) => [
      [p.a, 0],
      [p.at(MAT_START), 0],
      [p.at(MAT_END), MAT_END - MAT_START],
      [p.g - 0.001, MAT_END - MAT_START],
      [p.g, 0],
    ])
    const topBlade = phases.flatMap((p) => [
      [p.a, `${topX(SIDE_START)} ${p.y}`],
      [p.b, `${topX(SIDE_START)} ${p.y}`],
      [p.e, `${topX(SIDE_END)} ${p.y}`],
      [p.f, `${topX(SIDE_END)} ${p.y}`],
      [p.g, `${topX(SIDE_START)} ${p.next}`],
    ])

    // 멈춘 그림: 둘째 줄을 절반쯤 자르는 순간
    const stillX = 60
    const stillStreet = Math.min(1, n - 1)

    const side = (
      <>
        {layers.map((l) => (
          <rect key={l.cls} x={l.x ?? MAT_START} y={l.y} width={l.w ?? MAT_END - MAT_START} height={l.h} className={l.cls} />
        ))}
        <rect x={MAT_START} y={matTop} height={cutBottom - matTop} width={animate ? 0 : stillX - MAT_START} className="il-kerf">
          {animate && <Anim attr="width" points={kerf} dur={dur} />}
        </rect>
        <g transform={`translate(${stillX} 0)`}>
          <SideBlade cy={BLADE_CY} r={12} animate={animate} />
          {animate && <Move points={sideBlade} dur={dur} />}
        </g>
      </>
    )

    if (c) return side

    const clipId = `il-clip-${caption.id}`
    return (
      <>
        <Label x="60" y="9" compact={c}>옆에서 본 모습</Label>
        <Arrow x1="40" y1="17" x2="80" y2="17" />
        <Label x="60" y="25" compact={c}>자르는 방향</Label>
        {side}
        <Label x="60" y="70" compact={c}>{caption.side}</Label>

        <line x1="120" y1="4" x2="120" y2="76" className="il-divider" />

        <g transform="translate(120 0)">
          <Label x="60" y="9" compact={c}>위에서 본 모습</Label>
          <defs>
            <clipPath id={clipId}>{topShape}</clipPath>
          </defs>
          {topShape}
          {gridLines}
          <g clipPath={`url(#${clipId})`}>
            {phases.map((p, i) => (
              <line
                key={p.y}
                x1={topX(SIDE_START)}
                y1={p.y}
                x2={animate ? topX(SIDE_START) : i < stillStreet ? topX(SIDE_END) : i === stillStreet ? topX(stillX) : topX(SIDE_START)}
                y2={p.y}
                className={cutClass}
              >
                {animate && (
                  <Anim
                    attr="x2"
                    points={[
                      [p.b, topX(SIDE_START)],
                      [p.e, topX(SIDE_END)],
                    ]}
                    dur={dur}
                  />
                )}
              </line>
            ))}
          </g>
          <g transform={`translate(${topX(stillX)} ${streets[stillStreet]})`}>
            <rect x="-12" y="-1.5" width="24" height="3" rx="1" className="il-blade-top" />
            {animate && <Move points={topBlade} dur={dur} />}
          </g>
          <Label x="60" y="78" compact={c}>{caption.top}</Label>
        </g>
      </>
    )
  }
}

export const Label = ({ x, y, children, compact }) =>
  compact ? null : (
    <text x={x} y={y} className="il-label" textAnchor="middle">
      {children}
    </text>
  )

// 움직이는 동안 지금 어느 세부 단계인지 아래에 자막으로 보여줍니다. items: [시작, 끝, 글자] (0–1)
export const StepCaption = ({ items, dur, x = 60, y = 76 }) =>
  items.map(([from, to, text]) => (
    <text key={text} x={x} y={y} className="il-label il-step" textAnchor="middle" opacity="0">
      {text}
      <Anim
        attr="opacity"
        points={[
          [from, 0],
          [from + 0.005, 1],
          [to, 1],
          ...(to < 1 ? [[to + 0.005, 0]] : []),
        ]}
        dur={dur}
      />
    </text>
  ))

// 일정 시간 동안만 보이는 묶음
export const Visible = ({ from, to, dur, children }) => (
  <g opacity="0">
    {children}
    <Anim
      attr="opacity"
      points={[
        [from, 0],
        [from + 0.005, 1],
        [to, 1],
        ...(to < 1 ? [[to + 0.005, 0]] : []),
      ]}
      dur={dur}
    />
  </g>
)

const processDrawings = {
  'wafer-make': (c) => (
    <>
      <rect x="14" y="24" width="44" height="24" rx="12" className="il-tool" />
      <Arrow x1="64" y1="36" x2="78" y2="36" />
      {[84, 92, 100].map((x) => (
        <rect key={x} x={x} y="22" width="4" height="28" rx="2" className="il-wafer" />
      ))}
      <Label x="36" y="16" compact={c}>잉곳</Label>
      <Label x="60" y="72" compact={c}>잉곳을 얇게 잘라 웨이퍼로</Label>
    </>
  ),
  oxidation: (c) => (
    <>
      <rect x="20" y="40" width="80" height="12" className="il-wafer" />
      <rect x="20" y="35" width="80" height="5" className="il-oxide" />
      {[34, 60, 86].map((x) => (
        <Arrow key={x} x1={x} y1="12" x2={x} y2="30" />
      ))}
      <Label x="60" y="8" compact={c}>O₂ · 고온</Label>
      <Label x="60" y="70" compact={c}>표면에 얇은 산화막이 자람</Label>
    </>
  ),
  photo: (c) => (
    <>
      <rect x="20" y="50" width="80" height="8" className="il-wafer" />
      <rect x="20" y="45" width="80" height="5" className="il-resist" />
      <rect x="20" y="24" width="24" height="4" className="il-tool" />
      <rect x="54" y="24" width="12" height="4" className="il-tool" />
      <rect x="76" y="24" width="24" height="4" className="il-tool" />
      {[49, 71].map((x) => (
        <line key={x} x1={x} y1="6" x2={x} y2="44" className="il-laser" />
      ))}
      <Label x="60" y="20" compact={c}>마스크</Label>
      <Label x="60" y="72" compact={c}>빛으로 회로 무늬를 옮김</Label>
    </>
  ),
  etch: (c) => (
    <>
      <rect x="20" y="46" width="80" height="10" className="il-wafer" />
      {[20, 54, 82].map((x, i) => (
        <rect key={x} x={x} y="36" width={[26, 12, 18][i]} height="10" className="il-oxide" />
      ))}
      {[20, 54, 82].map((x, i) => (
        <rect key={`r${x}`} x={x} y="32" width={[26, 12, 18][i]} height="4" className="il-resist" />
      ))}
      {[50, 74].map((x) => (
        <Arrow key={x} x1={x} y1="12" x2={x} y2="40" />
      ))}
      <Label x="60" y="8" compact={c}>플라즈마</Label>
      <Label x="60" y="72" compact={c}>가려지지 않은 막을 깎아 냄</Label>
    </>
  ),
  deposition: (c) => (
    <>
      <rect x="20" y="46" width="80" height="10" className="il-wafer" />
      <rect x="20" y="40" width="80" height="6" className="il-oxide" />
      <rect x="20" y="35" width="80" height="5" className="il-substrate" />
      {[28, 44, 60, 76, 92].map((x) => (
        <circle key={x} cx={x} cy={x % 32 === 12 ? 18 : 24} r="2" className="il-bump" />
      ))}
      <Label x="60" y="10" compact={c}>기체 원료</Label>
      <Label x="60" y="72" compact={c}>얇은 막을 고르게 쌓음</Label>
    </>
  ),
  'ion-implant': (c) => (
    <>
      <rect x="20" y="40" width="80" height="16" className="il-wafer" />
      <rect x="20" y="34" width="28" height="6" className="il-resist" />
      <rect x="72" y="34" width="28" height="6" className="il-resist" />
      <rect x="48" y="40" width="24" height="6" className="il-substrate" />
      {[54, 66].map((x) => (
        <Arrow key={x} x1={x} y1="10" x2={x} y2="38" />
      ))}
      <Label x="60" y="8" compact={c}>불순물 이온</Label>
      <Label x="60" y="72" compact={c}>정해진 영역에 이온을 넣음</Label>
    </>
  ),
  metallization: (c) => (
    <>
      <rect x="20" y="46" width="80" height="10" className="il-wafer" />
      <rect x="20" y="28" width="80" height="18" className="il-oxide" />
      <rect x="30" y="36" width="60" height="4" className="il-cu" />
      {[34, 60, 86].map((x) => (
        <rect key={x} x={x - 2} y="40" width="4" height="6" className="il-cu" />
      ))}
      <rect x="58" y="28" width="4" height="8" className="il-cu" />
      <rect x="50" y="22" width="20" height="6" className="il-cu" />
      <Label x="60" y="16" compact={c}>패드</Label>
      <Label x="60" y="72" compact={c}>금속 선으로 소자를 연결</Label>
    </>
  ),
  eds: (c) => (
    <>
      <circle cx="60" cy="44" r="18" className="il-wafer" />
      {[
        [52, 36], [62, 36], [48, 46], [58, 46], [68, 46], [54, 54], [64, 54],
      ].map(([x, y], i) => (
        <rect key={i} x={x - 4} y={y - 4} width="8" height="8" className={i === 4 ? 'il-glue' : 'il-die'} />
      ))}
      <line x1="58" y1="8" x2="58" y2="42" className="il-probe" />
      <rect x="44" y="4" width="28" height="6" className="il-tool" />
      <Label x="60" y="76" compact={c}>칩마다 전기 검사 · 불량 표시</Label>
    </>
  ),
  backgrind: (c, animate) => {
    const dur = '5s'
    return (
      <>
        <rect x="15" y="60" width="90" height="6" className="il-tool" />
        <rect x="20" y="56" width="80" height="4" className="il-tape" />
        <rect x="20" y={animate ? 40 : 48} width="80" height={animate ? 16 : 8} className="il-wafer">
          {animate && (
            <>
              <Anim attr="y" points={[[0.1, 40], [0.45, 46], [0.75, 48], [0.97, 48], [0.98, 40]]} dur={dur} />
              <Anim attr="height" points={[[0.1, 16], [0.45, 10], [0.75, 8], [0.97, 8], [0.98, 16]]} dur={dur} />
            </>
          )}
        </rect>
        <g transform={animate ? undefined : 'translate(0 8)'}>
          <line x1="60" y1="10" x2="60" y2="22" className="il-probe" />
          <rect x="30" y="22" width="60" height="12" className="il-tool" />
          <line x1="30" y1="37" x2="90" y2="37" className="il-teeth">
            {animate && <Anim attr="stroke-dashoffset" points={[[0, 0], [1, 6]]} dur="0.3s" />}
          </line>
          {animate && <Move points={[[0.1, '0 0'], [0.45, '0 6'], [0.75, '0 8'], [0.85, '0 8'], [0.95, '0 0']]} dur={dur} />}
        </g>
        <Label x="60" y="7" compact={c}>연마 휠 (아랫면에 다이아몬드 날)</Label>
        {animate ? (
          <StepCaption
            dur={dur}
            items={[
              [0, 0.1, '① 휠을 웨이퍼 뒷면에 내림'],
              [0.1, 0.45, '② 거친 연마: 빠르게 많이 갈아냄'],
              [0.45, 0.75, '③ 미세 연마: 목표 두께에 맞춤'],
              [0.75, 1, '④ 휠을 올리고 두께 확인'],
            ]}
          />
        ) : (
          <Label x="60" y="76" compact={c}>연마 휠이 뒷면을 갈아 얇게 만듦</Label>
        )}
      </>
    )
  },
  'wafer-saw': sawDrawing({
    layers: [
      { cls: 'il-wafer', y: 42, h: 10 },
      { cls: 'il-tape', x: 10, y: 52, w: 100, h: 4 },
    ],
    cutBottom: 54,
    topShape: <circle cx="60" cy="44" r="30" className="il-wafer" />,
    streets: [32, 40, 48, 56],
    gridLines: [44, 52, 60, 68, 76].map((x) => <line key={x} x1={x} y1="16" x2={x} y2="72" className="il-street" />),
    caption: { id: 'wafer-saw', side: '블레이드가 돌며 오른쪽으로 나아감', top: '한 방향을 다 자르면 90° 돌려 자름' },
  }),
  'die-attach': (c, animate) => {
    const dur = '6s'
    return (
      <>
        <rect x="20" y="56" width="80" height="6" className="il-frame" />
        <rect x={animate ? 60 : 38} y="52" width={animate ? 0 : 44} height="4" className="il-glue">
          {animate && (
            <>
              <Anim attr="x" points={[[0.1, 60], [0.25, 52], [0.55, 52], [0.65, 38]]} dur={dur} />
              <Anim attr="width" points={[[0.1, 0], [0.25, 16], [0.55, 16], [0.65, 44]]} dur={dur} />
            </>
          )}
        </rect>
        {animate && (
          <Visible from={0.72} to={0.98} dur={dur}>
            <rect x="38" y="52" width="44" height="4" className="il-cured" />
          </Visible>
        )}
        <g>
          <rect x="40" y="42" width="40" height="10" rx="1" className="il-die" />
          {animate && <Move points={[[0, '0 -36'], [0.32, '0 -36'], [0.55, '0 0']]} dur={dur} />}
        </g>
        <g transform={animate ? undefined : 'translate(0 -36)'}>
          <line x1="60" y1="0" x2="60" y2="34" className="il-probe" />
          <rect x="50" y="34" width="20" height="8" className="il-tool" />
          {animate && <Move points={[[0, '0 -36'], [0.32, '0 -36'], [0.55, '0 0'], [0.62, '0 0'], [0.7, '0 -36']]} dur={dur} />}
        </g>
        {animate && (
          <g>
            <line x1="60" y1="-22" x2="60" y2="0" className="il-needle" />
            <Move points={[[0, '0 20'], [0.1, '0 50'], [0.25, '0 50'], [0.3, '0 20'], [0.32, '0 -30']]} dur={dur} />
          </g>
        )}
        {animate ? (
          <StepCaption
            dur={dur}
            items={[
              [0, 0.3, '① 패드에 접착제 바르기'],
              [0.3, 0.55, '②·③ 콜릿으로 다이를 집어 옮김'],
              [0.55, 0.7, '④ 눌러 붙이기 (접착제가 퍼짐)'],
              [0.7, 1, '⑤ 열로 접착제 굳히기'],
            ]}
          />
        ) : (
          <Label x="60" y="74" compact={c}>접착제 위에 다이를 눌러 붙임</Label>
        )}
      </>
    )
  },
  'wire-bond': (c, animate) => {
    const dur = '5s'
    return (
      <>
        <rect x="40" y="48" width="40" height="8" className="il-frame" />
        <rect x="44" y="36" width="32" height="12" className="il-die" />
        <rect x="10" y="48" width="18" height="8" className="il-frame" />
        <rect x="92" y="48" width="18" height="8" className="il-frame" />
        <path d="M48 36 Q34 14 20 48" className="il-wire" />
        <path
          d="M72 36 Q86 14 100 48"
          className="il-wire"
          strokeDasharray={animate ? 43 : undefined}
          strokeDashoffset={animate ? 43 : undefined}
        >
          {/* 43: 이 곡선의 길이. 점선 간격을 곡선 길이와 같게 두고 어긋남을 줄여 선이 그려지는 것처럼 보이게 합니다. */}
          {animate && <Anim attr="stroke-dashoffset" points={[[0.2, 43], [0.62, 0]]} dur={dur} />}
        </path>
        {animate && (
          <>
            <Visible from={0.12} to={1} dur={dur}>
              <circle cx="72" cy="35" r="2" className="il-ball" />
            </Visible>
            <Visible from={0.65} to={1} dur={dur}>
              <ellipse cx="100" cy="47.5" rx="3" ry="1.2" className="il-ball" />
            </Visible>
            <g>
              <polygon points="-3,-16 3,-16 1.2,0 -1.2,0" className="il-tool" />
              <circle cx="0" cy="1.5" r="1.8" className="il-ball" opacity="0">
                <Anim attr="opacity" points={[[0, 1], [0.12, 1], [0.125, 0], [0.86, 0], [0.865, 1]]} dur={dur} />
              </circle>
              <Move
                points={[
                  [0, '72 18'],
                  [0.12, '72 34'],
                  [0.2, '72 34'],
                  [0.35, '72 14'],
                  [0.55, '100 30'],
                  [0.65, '100 46'],
                  [0.72, '100 46'],
                  [0.8, '100 28'],
                  [0.95, '72 18'],
                ]}
                dur={dur}
              />
            </g>
          </>
        )}
        {animate ? (
          <StepCaption
            dur={dur}
            items={[
              [0, 0.12, '① 와이어 끝을 녹여 볼 만들기'],
              [0.12, 0.2, '② 패드에 볼 본드'],
              [0.2, 0.55, '③ 와이어를 풀며 루프 만들기'],
              [0.55, 0.72, '④ 리드에 스티치 본드'],
              [0.72, 1, '⑤ 와이어 끊고 다음 볼 준비'],
            ]}
          />
        ) : (
          <Label x="60" y="72" compact={c}>와이어로 다이와 리드를 연결</Label>
        )}
      </>
    )
  },
  molding: (c, animate) => {
    const dur = '6s'
    return (
      <>
        {animate && <rect x="8" y="58" width="104" height="8" className="il-tool" />}
        <rect x="14" y="20" width={animate ? 0 : 92} height="32" rx={animate ? 0 : 4} className="il-mold">
          {animate && <Anim attr="width" points={[[0.25, 0], [0.75, 92]]} dur={dur} />}
        </rect>
        <rect x="44" y="40" width="32" height="10" className="il-die il-ghost" />
        <path d="M48 40 Q34 24 22 52" className="il-wire il-ghost" />
        <path d="M72 40 Q86 24 98 52" className="il-wire il-ghost" />
        <rect x="14" y="52" width="92" height="6" className="il-frame" />
        {animate ? (
          <>
            <g>
              <rect x="8" y="6" width="104" height="14" className="il-tool" />
              <Move points={[[0, '0 -20'], [0.2, '0 0'], [0.8, '0 0'], [0.92, '0 -20']]} dur={dur} />
            </g>
            <Visible from={0.25} to={0.75} dur={dur}>
              <Arrow x1="1" y1="36" x2="12" y2="36" />
            </Visible>
            <StepCaption
              dur={dur}
              items={[
                [0, 0.22, '①·② 금형을 닫고 수지를 녹임'],
                [0.22, 0.75, '③ 녹은 수지를 빈 공간에 밀어 넣음'],
                [0.75, 0.85, '④ 금형 안에서 굳힘'],
                [0.85, 1, '⑤ 금형을 열고 꺼냄'],
              ]}
            />
          </>
        ) : (
          <>
            <Arrow x1="60" y1="6" x2="60" y2="18" />
            <Label x="60" y="72" compact={c}>수지로 다이와 와이어를 감쌈</Label>
          </>
        )}
      </>
    )
  },
  marking: (c, animate) => {
    const dur = '4.5s'
    return (
      <>
        <rect x="20" y="36" width="80" height="22" rx="3" className="il-mold" />
        {animate && (
          <defs>
            <clipPath id="il-clip-marking">
              <rect x="40" y="36" width="0" height="22">
                <Anim attr="width" points={[[0.1, 0], [0.7, 40]]} dur={dur} />
              </rect>
            </clipPath>
          </defs>
        )}
        <text x="60" y="51" textAnchor="middle" className="il-mark" clipPath={animate ? 'url(#il-clip-marking)' : undefined}>
          AX01
        </text>
        <g transform={animate ? undefined : 'translate(60 0)'}>
          <rect x="-8" y="2" width="16" height="8" className="il-tool" />
          {animate ? (
            <Visible from={0.1} to={0.7} dur={dur}>
              <line x1="0" y1="10" x2="0" y2="36" className="il-laser" />
            </Visible>
          ) : (
            <line x1="0" y1="10" x2="0" y2="36" className="il-laser" />
          )}
          {animate && <Move points={[[0, '40 0'], [0.1, '40 0'], [0.7, '80 0'], [0.85, '80 0'], [1, '40 0']]} dur={dur} />}
        </g>
        {animate ? (
          <StepCaption
            dur={dur}
            items={[
              [0, 0.1, '① 새길 위치 맞추기'],
              [0.1, 0.7, '② 레이저를 움직이며 글자 새기기'],
              [0.7, 1, '③ 글자가 잘 읽히는지 검사'],
            ]}
          />
        ) : (
          <Label x="60" y="72" compact={c}>레이저로 표면에 식별 정보를 새김</Label>
        )}
      </>
    )
  },
  'package-saw': sawDrawing({
    layers: [
      { cls: 'il-mold', y: 38, h: 12 },
      { cls: 'il-frame', y: 50, h: 4 },
      { cls: 'il-tape', x: 10, y: 54, w: 100, h: 3 },
    ],
    cutBottom: 55,
    topShape: <rect x="22" y="22" width="76" height="44" className="il-mold" />,
    streets: [36.7, 51.3],
    cutClass: 'il-cut-top il-cut-dark',
    gridLines: [41, 60, 79].map((x) => <line key={x} x1={x} y1="22" x2={x} y2="66" className="il-street" />),
    caption: { id: 'package-saw', side: '몰딩과 리드프레임을 함께 자름', top: '한 방향을 다 자르면 90° 돌려 자름' },
  }),
  test: (c, animate) => {
    const dur = '4.5s'
    const pins = [44, 54, 66, 76]
    return (
      <>
        {animate && <rect x="30" y="56" width="60" height="6" className="il-frame" />}
        <rect x="36" y="40" width="48" height="16" rx="2" className="il-mold" />
        <g>
          {pins.map((x) => (
            <line key={x} x1={x} y1="20" x2={x} y2="40" className="il-probe" />
          ))}
          <rect x="36" y="12" width="48" height="8" className="il-tool" />
          {animate && <Move points={[[0, '0 -10'], [0.15, '0 -10'], [0.3, '0 0'], [0.7, '0 0'], [0.85, '0 -10']]} dur={dur} />}
        </g>
        {animate && (
          <Visible from={0.3} to={0.6} dur={dur}>
            <g>
              {pins.map((x) => (
                <circle key={x} cx={x} cy="22" r="1.6" className="il-signal" />
              ))}
              <animateTransform attributeName="transform" type="translate" values="0 0;0 16" dur="0.5s" repeatCount="indefinite" />
            </g>
          </Visible>
        )}
        {animate ? (
          <>
            <Visible from={0.6} to={0.95} dur={dur}>
              <path d="M92 44 l6 6 l12 -14" className="il-check" />
            </Visible>
            <StepCaption
              dur={dur}
              items={[
                [0, 0.3, '① 패키지를 소켓에 넣고 누름'],
                [0.3, 0.6, '② 전기 신호를 보내 동작 검사'],
                [0.6, 0.85, '③ 결과에 따라 양품·불량 분류'],
                [0.85, 1, '④ 다음 패키지로'],
              ]}
            />
          </>
        ) : (
          <>
            <path d="M92 44 l6 6 l12 -14" className="il-check" />
            <Label x="60" y="72" compact={c}>전기·외관을 검사해 양품 판정</Label>
          </>
        )}
      </>
    )
  },
  'flipchip-bond': (c) => (
    <>
      <rect x="20" y="52" width="80" height="8" className="il-substrate" />
      <rect x="40" y="18" width="40" height="12" className="il-die" />
      {[46, 54, 62, 70].map((x) => (
        <circle key={x} cx={x + 2} cy="33" r="3" className="il-bump" />
      ))}
      <Arrow x1="60" y1="38" x2="60" y2="50" />
      <Label x="60" y="12" compact={c}>뒤집은 다이 + 범프</Label>
      <Label x="60" y="74" compact={c}>범프를 기판에 바로 붙임</Label>
    </>
  ),
  underfill: (c) => (
    <>
      <rect x="20" y="52" width="80" height="8" className="il-substrate" />
      <rect x="40" y="38" width="40" height="8" className="il-die" />
      <rect x="40" y="46" width="40" height="6" className="il-glue" />
      {[46, 54, 62, 70].map((x) => (
        <circle key={x} cx={x + 2} cy="49" r="2.5" className="il-bump" />
      ))}
      <path d="M96 20 L88 44" className="il-needle" />
      <Label x="60" y="74" compact={c}>다이와 기판 사이 틈을 수지로 채움</Label>
    </>
  ),

  // ── 전공정 사이사이 반복 공정 ──
  cleaning: (c) => (
    <>
      <rect x="20" y="44" width="80" height="10" className="il-wafer" />
      {[36, 60, 84].map((x) => (
        <g key={x}>
          <rect x={x - 5} y="10" width="10" height="5" className="il-tool" />
          <line x1={x} y1="16" x2={x} y2="40" className="il-water" />
        </g>
      ))}
      {[[30, 41], [52, 38], [74, 40], [92, 37]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="1.6" className="il-dust" />
      ))}
      <Label x="60" y="70" compact={c}>약품·초순수로 오염을 씻어 냄</Label>
    </>
  ),
  cmp: (c) => (
    <>
      <ellipse cx="60" cy="52" rx="46" ry="9" className="il-tool" />
      <ellipse cx="60" cy="52" rx="40" ry="6.5" className="il-oxide" />
      <rect x="50" y="22" width="20" height="18" className="il-frame" />
      <rect x="46" y="40" width="28" height="5" className="il-wafer" />
      <path d="M90 14 Q92 26 88 44" className="il-wire" />
      <Label x="94" y="10" compact={c}>슬러리</Label>
      <Label x="60" y="74" compact={c}>패드에 눌러 갈아 평평하게</Label>
    </>
  ),
  anneal: (c) => (
    <>
      <rect x="14" y="20" width="92" height="40" rx="6" className="il-tool" />
      <rect x="30" y="38" width="60" height="6" className="il-wafer" />
      {[34, 50, 66, 82].map((x) => (
        <path key={x} d={`M${x} 34 q 3 -4 0 -8 q -3 -4 0 -8`} className="il-wire" />
      ))}
      <Label x="60" y="74" compact={c}>고온으로 결정 회복·불순물 활성화</Label>
    </>
  ),
  ald: (c) => (
    <>
      <rect x="20" y="50" width="80" height="10" className="il-wafer" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x="20" y={47 - i * 3} width="80" height="2.4" className={i % 2 ? 'il-oxide' : 'il-resist'} />
      ))}
      <Arrow x1={36} y1={14} x2={36} y2={32} />
      <Arrow x1={84} y1={14} x2={84} y2={32} />
      <Label x="36" y="10" compact={c}>원료 A</Label>
      <Label x="84" y="10" compact={c}>원료 B</Label>
      <Label x="60" y="74" compact={c}>원자층을 한 층씩 번갈아 쌓음</Label>
    </>
  ),

  // ── 연결 단계 ──
  'wafer-map': (c) => (
    <>
      <circle cx="60" cy="38" r="26" className="il-wafer" />
      {Array.from({ length: 25 }, (_, i) => {
        const x = 40 + (i % 5) * 8
        const y = 18 + Math.floor(i / 5) * 8
        if (Math.hypot(x + 3 - 60, y + 3 - 38) > 22) return null
        return <rect key={i} x={x} y={y} width="6.5" height="6.5" className={[7, 13, 16].includes(i) ? 'il-glue' : 'il-die'} />
      })}
      <Label x="60" y="74" compact={c}>칩마다 양품·불량 위치를 기록</Label>
    </>
  ),
  'wafer-transport': (c) => (
    <>
      <rect x="30" y="14" width="60" height="44" rx="5" className="il-tool" />
      {[22, 28, 34, 40, 46].map((y) => (
        <line key={y} x1="36" y1={y} x2="84" y2={y} className="il-line" />
      ))}
      <rect x="44" y="8" width="32" height="6" rx="2" className="il-frame" />
      <Arrow x1={92} y1={36} x2={112} y2={36} />
      <Label x="60" y="72" compact={c}>밀폐 용기에 담아 옮기고 보관</Label>
    </>
  ),
  'incoming-inspection': (c) => (
    <>
      <circle cx="46" cy="38" r="22" className="il-wafer" />
      <circle cx="70" cy="30" r="12" className="il-hole" />
      <line x1="78" y1="39" x2="92" y2="54" className="il-needle" />
      <path d="M96 16 l4 4 l8 -9" className="il-check" />
      <Label x="60" y="74" compact={c}>수량·겉모습·맵이 맞는지 확인</Label>
    </>
  ),

  // ── 중간공정 ──
  tsv: (c) => (
    <>
      <rect x="20" y="20" width="80" height="34" className="il-wafer" />
      {[36, 60, 84].map((x) => (
        <rect key={x} x={x - 2.5} y="20" width="5" height="34" className="il-cu" />
      ))}
      <rect x="20" y="14" width="80" height="6" className="il-die" />
      <rect x="20" y="54" width="80" height="6" className="il-die" />
      <Label x="60" y="74" compact={c}>실리콘을 꿰뚫는 구리 기둥으로 위아래 연결</Label>
    </>
  ),
  rdl: (c) => (
    <>
      <rect x="22" y="12" width="76" height="48" className="il-die" />
      {[[26, 16], [26, 52], [90, 16], [90, 52]].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="5" height="5" className="il-frame" />
      ))}
      {[[28, 18, 46, 30], [28, 54, 46, 42], [92, 18, 74, 30], [92, 54, 74, 42]].map(([x1, y1, x2, y2]) => (
        <polyline key={`${x1}-${y1}`} points={`${x1},${y1} ${x2},${y1} ${x2},${y2}`} className="il-link" />
      ))}
      {[[46, 30], [46, 42], [74, 30], [74, 42]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3.4" className="il-bump" />
      ))}
      <Label x="60" y="74" compact={c}>가장자리 패드를 새 자리로 옮기는 배선</Label>
    </>
  ),
  bumping: (c) => (
    <>
      <rect x="18" y="44" width="84" height="12" className="il-wafer" />
      {[30, 46, 62, 78, 94].map((x) => (
        <g key={x}>
          <rect x={x - 5} y="41" width="10" height="3" className="il-frame" />
          <circle cx={x} cy="35" r="6" className="il-bump" />
        </g>
      ))}
      <Label x="60" y="72" compact={c}>패드 위에 작은 금속 돌기(범프)를 만듦</Label>
    </>
  ),
}

const packageDrawings = {
  qfn: () => (
    <>
      <rect x="30" y="20" width="100" height="30" rx="3" className="il-mold" />
      <rect x="62" y="30" width="36" height="10" className="il-die" />
      <rect x="58" y="44" width="44" height="6" className="il-frame" />
      <rect x="30" y="44" width="16" height="6" className="il-frame" />
      <rect x="114" y="44" width="16" height="6" className="il-frame" />
      <text x="80" y="66" textAnchor="middle" className="il-label">바닥에 리드와 노출 패드</text>
    </>
  ),
  bga: () => (
    <>
      <rect x="30" y="22" width="100" height="18" rx="3" className="il-mold" />
      <rect x="62" y="30" width="36" height="8" className="il-die" />
      <rect x="26" y="40" width="108" height="6" className="il-substrate" />
      {[34, 48, 62, 76, 90, 104, 118].map((x) => (
        <circle key={x} cx={x + 4} cy="50" r="4" className="il-bump" />
      ))}
      <text x="80" y="66" textAnchor="middle" className="il-label">기판 아래 솔더볼 배열</text>
    </>
  ),
  flipchip: () => (
    <>
      <rect x="56" y="24" width="48" height="10" className="il-die" />
      <rect x="56" y="34" width="48" height="5" className="il-glue" />
      {[62, 72, 82, 92].map((x) => (
        <circle key={x} cx={x + 3} cy="36.5" r="2.5" className="il-bump" />
      ))}
      <rect x="26" y="39" width="108" height="6" className="il-substrate" />
      {[36, 52, 68, 84, 100, 116].map((x) => (
        <circle key={x} cx={x + 4} cy="49" r="4" className="il-bump" />
      ))}
      <text x="80" y="66" textAnchor="middle" className="il-label">뒤집은 다이 + 언더필 + 기판</text>
    </>
  ),
  wlcsp: () => (
    <>
      <rect x="50" y="24" width="60" height="16" className="il-die" />
      {[56, 70, 84, 98].map((x) => (
        <circle key={x} cx={x + 3} cy="44" r="4" className="il-bump" />
      ))}
      <text x="80" y="66" textAnchor="middle" className="il-label">다이 바로 아래 솔더볼</text>
    </>
  ),
  fanout: () => (
    <>
      <rect x="30" y="20" width="100" height="20" rx="2" className="il-mold" />
      <rect x="62" y="26" width="36" height="12" className="il-die" />
      <rect x="30" y="40" width="100" height="4" className="il-rdl" />
      {[36, 54, 72, 90, 108, 122].map((x) => (
        <circle key={x} cx={x + 2} cy="48" r="4" className="il-bump" />
      ))}
      <text x="80" y="66" textAnchor="middle" className="il-label">재배선층으로 다이 바깥까지 단자</text>
    </>
  ),
}

const Bumps = ({ x, y, width, count, r = 1.6 }) =>
  Array.from({ length: count }, (_, i) => (
    <circle key={i} cx={x + ((i + 0.5) * width) / count} cy={y} r={r} className="il-bump" />
  ))

const advancedDrawings = {
  '2.5d': () => (
    <>
      <rect x="14" y="50" width="132" height="8" className="il-substrate" />
      <rect x="24" y="40" width="112" height="8" className="il-rdl il-interposer" />
      {[44, 64, 84, 104, 124].map((x) => (
        <line key={x} x1={x - 8} y1="40" x2={x - 8} y2="48" className="il-tsv" />
      ))}
      <Bumps x={24} y={49} width={112} count={10} r={1.3} />
      <rect x="30" y="20" width="22" height="18" className="il-die" />
      <rect x="58" y="22" width="44" height="16" className="il-die il-logic" />
      <rect x="108" y="20" width="22" height="18" className="il-die" />
      <Bumps x={30} y={39} width={100} count={14} r={1} />
      <text x="41" y="32" textAnchor="middle" className="il-tag">HBM</text>
      <text x="80" y="33" textAnchor="middle" className="il-tag">GPU</text>
      <text x="119" y="32" textAnchor="middle" className="il-tag">HBM</text>
      <text x="80" y="68" textAnchor="middle" className="il-label">인터포저 위에 칩을 나란히 놓고 촘촘히 연결</text>
    </>
  ),
  '3d': () => (
    <>
      <rect x="40" y="48" width="80" height="8" className="il-die il-logic" />
      {[38, 28, 18, 8].map((y) => (
        <g key={y}>
          <rect x="48" y={y} width="64" height="8" className="il-die" />
          <Bumps x={48} y={y + 9} width={64} count={6} r={1} />
        </g>
      ))}
      {[60, 80, 100].map((x) => (
        <line key={x} x1={x} y1="8" x2={x} y2="56" className="il-tsv" />
      ))}
      <text x="132" y="14" className="il-label">메모리 다이</text>
      <text x="124" y="54" className="il-label">로직 다이</text>
      <text x="80" y="68" textAnchor="middle" className="il-label">칩을 위로 쌓고 TSV(세로 통로)로 연결</text>
    </>
  ),
  hybrid: () => (
    <>
      <rect x="40" y="14" width="80" height="16" className="il-die" />
      <rect x="40" y="32" width="80" height="16" className="il-die il-logic" />
      {[48, 60, 72, 84, 96, 108].map((x) => (
        <g key={x}>
          <rect x={x} y="27" width="6" height="3" className="il-cu" />
          <rect x={x} y="32" width="6" height="3" className="il-cu" />
        </g>
      ))}
      <line x1="34" y1="31" x2="126" y2="31" className="il-line il-dashed" />
      <text x="132" y="34" className="il-label">범프 없음</text>
      <text x="80" y="64" textAnchor="middle" className="il-label">구리 패드끼리 직접 맞붙임</text>
    </>
  ),
  chiplet: () => (
    <>
      <rect x="14" y="48" width="132" height="8" className="il-substrate" />
      {[
        [24, 'CPU'],
        [56, 'CPU'],
        [88, 'I/O'],
        [120, 'AI'],
      ].map(([x, label]) => (
        <g key={x}>
          <rect x={x} y="28" width="24" height="18" className={label === 'I/O' ? 'il-die il-logic' : 'il-die'} />
          <Bumps x={x} y={47} width={24} count={4} r={1} />
          <text x={x + 12} y="40" textAnchor="middle" className="il-tag">{label}</text>
        </g>
      ))}
      {[48, 80, 112].map((x) => (
        <path key={x} d={`M${x} 36 h8`} className="il-link" />
      ))}
      <text x="80" y="68" textAnchor="middle" className="il-label">작은 칩(칩렛) 여러 개를 한 패키지로 묶음</text>
    </>
  ),
  'hd-fanout': () => (
    <>
      <rect x="20" y="16" width="120" height="24" rx="2" className="il-mold" />
      <rect x="34" y="24" width="36" height="14" className="il-die" />
      <rect x="90" y="24" width="36" height="14" className="il-die" />
      <rect x="20" y="40" width="120" height="6" className="il-rdl" />
      {[44, 56, 68, 80, 92, 104, 116].map((x) => (
        <line key={x} x1={x} y1="40.5" x2={x + 6} y2="45.5" className="il-cut" />
      ))}
      <Bumps x={20} y={50} width={120} count={9} r={3} />
      <text x="80" y="68" textAnchor="middle" className="il-label">몰딩 속 칩 아래에 촘촘한 재배선층</text>
    </>
  ),
  bridge: () => (
    <>
      <rect x="14" y="40" width="132" height="16" className="il-substrate" />
      <rect x="62" y="40" width="36" height="6" className="il-rdl il-interposer" />
      <rect x="28" y="20" width="44" height="18" className="il-die" />
      <rect x="88" y="20" width="44" height="18" className="il-die" />
      <Bumps x={28} y={39} width={44} count={6} r={1.2} />
      <Bumps x={88} y={39} width={44} count={6} r={1.2} />
      <text x="80" y="14" textAnchor="middle" className="il-label">실리콘 브리지</text>
      <line x1="80" y1="16" x2="80" y2="40" className="il-line il-dashed" />
      <text x="80" y="68" textAnchor="middle" className="il-label">두 칩이 만나는 곳에만 작은 다리를 넣음</text>
    </>
  ),
}

export function AdvancedIllustration({ id }) {
  const draw = advancedDrawings[id]
  if (!draw) return null
  return (
    <svg viewBox="0 0 160 72" className="il il-package" role="img" aria-label="첨단 패키지 개념도">
      {draw()}
    </svg>
  )
}

// 움직이는 개념도가 있는 공정
const ANIMATED = new Set(['backgrind', 'wafer-saw', 'die-attach', 'wire-bond', 'molding', 'marking', 'package-saw', 'test'])

// 옆·위 두 모습을 나란히 그리는 공정(작게 그릴 때는 옆에서 본 모습만)
const WIDE = new Set(['wafer-saw', 'package-saw'])

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

// 움직이는 그림에 ⏸/▶ 버튼을 붙입니다. 동작 줄이기 설정이면 멈춘 채로 시작합니다.
// render(playing)는 svg를 돌려줍니다. enabled가 false이면 버튼 없이 멈춘 그림만 그립니다.
export function Playable({ enabled, render }) {
  const [playing, setPlaying] = useState(() => !prefersReducedMotion())
  if (!enabled) return render(false)

  return (
    <div className="il-wrap">
      {render(playing)}
      <button type="button" className="il-play" aria-pressed={playing} onClick={() => setPlaying(!playing)}>
        {playing ? '⏸ 멈춤' : '▶ 움직임 보기'}
      </button>
    </div>
  )
}

// still이 true이면 버튼 없이 멈춘 그림만 그립니다(검수표 그림 내보내기용).
export function ProcessIllustration({ id, compact = false, still = false }) {
  const draw = processDrawings[id]
  if (!draw) return null

  return (
    <Playable
      enabled={!compact && !still && ANIMATED.has(id)}
      render={(animate) => (
        <svg
          viewBox={compact ? '0 0 120 66' : WIDE.has(id) ? '0 0 240 82' : '0 0 120 80'}
          className={compact ? 'il il-compact' : WIDE.has(id) ? 'il il-wide' : 'il'}
          role={compact ? undefined : 'img'}
          aria-hidden={compact ? 'true' : undefined}
          aria-label={compact ? undefined : '공정 개념도'}
        >
          {draw(compact, animate)}
        </svg>
      )}
    />
  )
}

export function PackageIllustration({ id }) {
  const draw = packageDrawings[id]
  if (!draw) return null
  return (
    <svg viewBox="0 0 160 72" className="il il-package" role="img" aria-label="패키지 단면 개념도">
      {draw()}
    </svg>
  )
}
