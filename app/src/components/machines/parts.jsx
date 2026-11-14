// 장비 그림이 함께 쓰는 작은 부품

// 결과 중 제목에 words 중 하나가 들어간 것이 있으면 true. 문제가 생긴 부위를 빨간색으로 표시할 때 씁니다.
export const has = (findings, words) => findings.some((f) => words.some((w) => f.title.includes(w)))

export const Label = ({ x, y, children, anchor = 'middle' }) => (
  <text x={x} y={y} textAnchor={anchor} className="zs-note">
    {children}
  </text>
)

// 가동 단계 도우미. order는 그 장비 sequence의 id 순서입니다.
// stage가 null(대기)이면 미리보기로 "다 끝난 모습"을 보여주도록 done()이 true입니다.
//   at(id): 지금 그 단계  ·  done(id): 그 단계가 끝남  ·  before(id): 아직 그 단계 전
export function stageTools(stage, order) {
  const idle = stage === null
  const i = idle ? order.length : stage === 'start' ? -1 : stage === 'done' ? order.length : order.indexOf(stage)
  return {
    idle,
    at: (id) => stage === id,
    done: (id) => i > order.indexOf(id),
    before: (id) => !idle && i < order.indexOf(id),
  }
}

