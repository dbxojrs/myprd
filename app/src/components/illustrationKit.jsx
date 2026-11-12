// 공정 그림이 함께 쓰는 SMIL 도우미와 부품. 시각은 반복 한 번(dur)을 0–1로 나눈 비율입니다.

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
