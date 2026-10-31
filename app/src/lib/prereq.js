import { findProcess } from '../data/processes.js'

// 앞 공정을 가까운 순서로 거슬러 찾고, 학습하지 않은 공정만 학습 순서(먼 공정 먼저)로 돌려줍니다.
export function recommendPrerequisites(processId, completed, limit = 3) {
  const found = []
  const queue = [...(findProcess(processId)?.prerequisites ?? [])]
  while (queue.length) {
    const id = queue.shift()
    if (found.includes(id)) continue
    found.push(id)
    queue.push(...(findProcess(id)?.prerequisites ?? []))
  }
  return found
    .filter((id) => !completed.includes(id))
    .slice(0, limit)
    .reverse()
    .map(findProcess)
}
