// 장비 그림이 함께 쓰는 작은 부품

// 결과 중 제목에 words 중 하나가 들어간 것이 있으면 true. 문제가 생긴 부위를 빨간색으로 표시할 때 씁니다.
export const has = (findings, words) => findings.some((f) => words.some((w) => f.title.includes(w)))

export const Label = ({ x, y, children, anchor = 'middle' }) => (
  <text x={x} y={y} textAnchor={anchor} className="zs-note">
    {children}
  </text>
)
