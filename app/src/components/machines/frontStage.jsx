// 전공정 장비 그림이 함께 쓰는 단계 장면 부품.

// 압력계: level 0(진공 깊음)~1(대기압). pumping이면 대기압에서 목표 압력까지 바늘이 내려가고,
// venting이면 반대로 대기압까지 올라갑니다.
export function PressureGauge({ x, y, level, pumping = false, venting = false }) {
  const angle = (l) => `${-70 + l * 140}deg`
  const cls = pumping ? 'ms-st-fe-needle pumping' : venting ? 'ms-st-fe-needle venting' : 'ms-st-fe-needle'
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="7" className="ms-st-fe-gauge" />
      <g className={cls} style={{ '--from': angle(1), '--to': angle(level), transform: `rotate(${angle(venting ? 1 : level)})` }}>
        <line x1="0" y1="1" x2="0" y2="-5.5" />
      </g>
      <text y="13" textAnchor="middle" className="zs-note">
        압력
      </text>
    </g>
  )
}

// 데워지는 기판 위로 올라가는 열기
export const HeatWaves = ({ xs, y }) =>
  xs.map((x, i) => (
    <path key={x} d={`M${x} ${y} q 2 -3 0 -6 q -2 -3 0 -6`} className="ms-st-fe-heat" style={{ animationDelay: `${i * -0.3}s` }} />
  ))
