// 확대 스토리 설명. 키는 공정 id입니다. 장면 그림은 components/zoom/에 같은 키로 있습니다.
import waferSaw from './waferSaw.js'

export const zoomStories = Object.fromEntries([waferSaw].map((story) => [story.id, story]))
