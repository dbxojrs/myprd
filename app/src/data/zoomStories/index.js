// 확대 스토리 설명. 키는 공정 id입니다. 장면 그림은 components/zoom/에 같은 키로 있습니다.
import backgrind from './backgrind.js'
import waferSaw from './waferSaw.js'
import dieAttach from './dieAttach.js'
import wireBond from './wireBond.js'
import molding from './molding.js'
import marking from './marking.js'
import packageSaw from './packageSaw.js'
import test from './test.js'

export const zoomStories = Object.fromEntries(
  [backgrind, waferSaw, dieAttach, wireBond, molding, marking, packageSaw, test].map((story) => [story.id, story]),
)
