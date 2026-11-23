import { createStore, useStore } from './sharedStore.js'

// 노트 페이지 템플릿. 기본 템플릿 + 내가 저장한 템플릿('tutor.noteTemplates').
// 템플릿: { id, name, icon, desc, title, body(Markdown), style }
export const BUILTIN_TEMPLATES = [
  { id: 'blank', name: '빈 페이지', icon: '📄', desc: '아무것도 없이 시작', title: '', body: '', style: {} },
  {
    id: 'process',
    name: '공정 정리',
    icon: '🏭',
    desc: '목적 · 순서 · 핵심 변수 · 불량',
    title: '공정 정리: ',
    style: { icon: '🏭', cover: 'ocean' },
    body: `> [!🎯|blue] 이 공정은 한 줄로:

## 왜 하나요

## 순서
1.
2.
3.

## 핵심 변수와 결과
| 변수 | 높으면 | 낮으면 |
| --- | --- | --- |
|  |  |  |

## 자주 나는 불량
-

<details><summary>헷갈렸던 점</summary>

</details>

- [ ] 영상 다시 보기
- [ ] 문제 풀기`,
  },
  {
    id: 'mistake',
    name: '오답 · 실수 정리',
    icon: '🔁',
    desc: '틀린 이유와 다음에 맞히는 법',
    title: '오답 정리 ',
    style: { icon: '🔁', cover: 'sunset' },
    body: `## 문제

## 내가 쓴 답

## 정답

> [!⚠️|red] 틀린 이유:

> [!✅|green] 다음엔 이렇게:

- [ ] 사흘 뒤 다시 풀기`,
  },
  {
    id: 'interview',
    name: '면접 대비 Q&A',
    icon: '🎤',
    desc: '질문 · 30초 답 · 꼬리 질문',
    title: '면접 대비: ',
    style: { icon: '🎤', cover: 'grape' },
    body: `## Q.

> [!🗣️|purple] 30초 답:

<details><summary>꼬리 질문 대비</summary>

-

</details>

## 꼭 넣을 키워드
- `,
  },
  {
    id: 'weekly',
    name: '주간 회고',
    icon: '🗓️',
    desc: '한 일 · 배운 것 · 다음 주',
    title: '주간 회고 ',
    style: { icon: '🗓️', cover: 'forest' },
    body: `## 이번 주 한 일
- [x]

## 새로 배운 것
-

## 아직 헷갈리는 것
-

> [!🚀|green] 다음 주 목표: `,
  },
]

export const templatesStore = createStore('tutor.noteTemplates', [])
export const useTemplates = () => useStore(templatesStore)

export function saveTemplate({ name, note }) {
  const t = { id: `t-${Date.now().toString(36)}`, name: name || note.title || '내 템플릿', icon: note.style?.icon || '⭐', desc: '내가 만든 템플릿', title: note.title, body: note.body, style: note.style ?? {} }
  templatesStore.set((list) => [t, ...list].slice(0, 30))
  return t
}
export const deleteTemplate = (id) => templatesStore.set((list) => list.filter((t) => t.id !== id))

// 페이지 꾸미기 선택지
export const COVERS = {
  none: null,
  ocean: 'linear-gradient(120deg, #2f80ed 0%, #56ccf2 100%)',
  sunset: 'linear-gradient(120deg, #f2994a 0%, #eb5757 100%)',
  grape: 'linear-gradient(120deg, #8e54e9 0%, #4776e6 100%)',
  forest: 'linear-gradient(120deg, #11998e 0%, #38ef7d 100%)',
  peach: 'linear-gradient(120deg, #ffecd2 0%, #fcb69f 100%)',
  night: 'linear-gradient(120deg, #232526 0%, #414345 100%)',
  wafer: 'radial-gradient(circle at 30% 40%, #c9d6ff 0%, #e2e2e2 45%, #9fa8c7 100%)',
  mint: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)',
}
export const COVER_LABEL = { none: '없음', ocean: '바다', sunset: '노을', grape: '포도', forest: '숲', peach: '복숭아', night: '밤', wafer: '웨이퍼', mint: '민트' }
export const ICONS = ['📄', '📒', '🏭', '🔬', '⚙️', '💡', '🎯', '🔁', '🎤', '🗓️', '🚀', '⭐', '🔥', '✅', '⚠️', '🧪', '🔌', '💾', '📦', '🧠', '📌', '🌱', '🏆', '😀']
export const FONTS = { sans: '기본', serif: '명조', mono: '고정폭' }
export const SIZES = { s: '작게', m: '보통', l: '크게' }
