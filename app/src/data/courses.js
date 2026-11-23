// 영상 강의 묶음. 전체 모습 → 재료 → 순서 → 단계별 자세히 순서로 점점 깊이 들어갑니다.
// lessons의 id는 애니메이션 자막(data/processMovies)·그림(components/movie/scenes)·설명(data/explainers)의 id입니다.
// 공정 id(processes.js에 있는 것)는 공정 상세와 같은 애니메이션을 다시 씁니다.
import { BASICS } from './basics.js'

export const COURSES = {
  basics: {
    title: '반도체 기초',
    intro: '공정을 보기 전에, 반도체가 어떻게 전기를 다루는지 7개 단원으로 먼저 익힙니다.',
    lessons: BASICS,
    finish: { label: '이제 공정으로: 웨이퍼 제조 →', processId: 'wafer-make' },
  },
  pkg: {
    title: '후공정 영상 강의',
    screen: 'flow',
    intro: '먼저 완성된 패키지의 전체 모습과 재료를 보고, 웨이퍼가 패키지가 되기까지 8단계를 하나씩 자세히 봅니다.',
    lessons: [
      { id: 'pkg-overview', title: '전체 모습과 재료', short: '패키지는 무엇으로, 어떤 순서로 만드나', part: '전체 보기' },
      { id: 'backgrind', title: '백그라인딩', short: '웨이퍼 뒷면을 갈아 얇게', part: '단계별로 자세히' },
      { id: 'wafer-saw', title: '웨이퍼 쏘잉', short: '칩 하나하나로 자르기' },
      { id: 'die-attach', title: '다이 어태치', short: '칩을 기판 위에 붙이기' },
      { id: 'wire-bond', title: '와이어 본딩', short: '가는 금속선으로 잇기' },
      { id: 'molding', title: '몰딩', short: '수지로 감싸 보호하기' },
      { id: 'marking', title: '마킹', short: '패키지에 이름 새기기' },
      { id: 'package-saw', title: '패키지 쏘잉', short: '판을 낱개로 자르기' },
      { id: 'test', title: '최종 테스트', short: '완성품 검사하기' },
    ],
    finish: { label: '다음: 첨단 패키지 영상으로 →', screen: 'advanced' },
  },
  adv: {
    title: '첨단 패키지 영상 강의',
    screen: 'advanced',
    intro: '왜 첨단 패키지가 필요한지 전체 그림을 먼저 보고, 대표 구조(2.5D·3D·팬아웃·칩렛)를 본 뒤, 그 구조를 만드는 핵심 기술을 하나씩 자세히 봅니다.',
    lessons: [
      { id: 'adv-overview', title: '왜 첨단 패키지인가', short: '전체 그림과 종류', part: '전체 보기' },
      { id: 'adv-25d', title: '2.5D 패키지', short: '인터포저 위에 칩을 나란히', part: '대표 구조' },
      { id: 'adv-3d', title: '3D 적층과 HBM', short: '칩을 위로 쌓아 TSV로 잇기' },
      { id: 'adv-fanout', title: '팬아웃 패키지', short: '칩 바깥까지 배선을 넓히기' },
      { id: 'adv-chiplet', title: '칩렛', short: '큰 칩을 나눠 다시 잇기' },
      { id: 'bumping', title: '범핑', short: '칩 위에 금속 돌기 세우기', part: '핵심 기술 자세히' },
      { id: 'flipchip-bond', title: '플립칩 본딩', short: '뒤집어 범프로 붙이기' },
      { id: 'underfill', title: '언더필', short: '틈을 채워 접합 보호' },
      { id: 'rdl', title: 'RDL(재배선)', short: '패드 자리를 옮기는 금속 길' },
      { id: 'tsv', title: 'TSV', short: '칩을 뚫어 위아래로 잇기' },
      { id: 'adv-hybrid', title: '하이브리드 본딩', short: '범프 없이 구리끼리 바로' },
    ],
    finish: null,
  },
}

// 공정 상세에서 "강의 몇 번째 단원인지" 보여 줄 때 씁니다. 기초 강의는 공정이 아니라 빼고 찾습니다.
// screen: 이 강의가 들어 있는 학습 화면(후공정 = PKG 공정 흐름도, 첨단 = Advanced PKG)
export function findLessonCourse(id) {
  for (const [courseId, course] of Object.entries(COURSES)) {
    if (!course.screen) continue
    const index = course.lessons.findIndex((l) => l.id === id)
    if (index >= 0) return { courseId, course, index, prev: course.lessons[index - 1], next: course.lessons[index + 1] }
  }
  return null
}

export const courseStorageKey = (courseId) => `tutor.course.${courseId}`

export const courseLessonIds = () => Object.values(COURSES).flatMap((c) => c.lessons.map((l) => l.id))
