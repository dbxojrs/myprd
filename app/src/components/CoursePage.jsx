import { useEffect, useRef } from 'react'
import { COURSES, courseStorageKey } from '../data/courses.js'
import { findProcess } from '../data/processes.js'
import { processMovies } from '../data/processMovies/index.js'
import { explainers } from '../data/explainers/index.js'
import { useStoredState } from '../lib/storage.js'
import ProcessMovie from './movie/ProcessMovie.jsx'
import ProcessExplainer from './ProcessExplainer.jsx'

// 영상 강의(반도체 기초 · 후공정 · 첨단 패키지 공용).
// 목차에서 단원을 고르면 애니메이션과 설명을 함께 봅니다. 단원은 "전체 → 자세히" 순서입니다.
// embedded: 따로 된 화면이 아니라 학습 화면(PKG 공정 흐름도, Advanced PKG) 안에 넣을 때 씁니다.
export default function CoursePage({ courseId, onOpenProcess, onGo, embedded = false }) {
  const course = COURSES[courseId]
  const [lessonId, setLessonId] = useStoredState(courseStorageKey(courseId), course.lessons[0].id)
  const index = Math.max(0, course.lessons.findIndex((l) => l.id === lessonId))
  const lesson = course.lessons[index]
  const next = course.lessons[index + 1]
  const chapters = { title: course.title, ids: course.lessons.map((l) => l.id), names: Object.fromEntries(course.lessons.map((l) => [l.id, l.title])) }
  const boxRef = useRef(null)
  const shownRef = useRef(null)

  // 단원을 바꾸면 위로 올립니다. 학습 화면 안에 넣었을 때는 처음 열 때는 그대로 두고,
  // 단원을 실제로 바꿨을 때만 강의 상자 맨 위로 올립니다.
  useEffect(() => {
    const changed = shownRef.current !== null && shownRef.current !== lessonId
    shownRef.current = lessonId
    if (!embedded) window.scrollTo({ top: 0 })
    else if (changed) boxRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }, [lessonId, embedded])

  const finish = () => {
    if (course.finish?.processId) onOpenProcess(course.finish.processId)
    else if (course.finish?.screen) onGo(course.finish.screen)
  }

  const Wrap = embedded ? 'div' : 'section'
  return (
    <Wrap ref={boxRef} className={embedded ? 'basics course-embed' : 'screen basics'}>
      {!embedded && (
        <div className="basics-head">
          <h2>{course.title}</h2>
          <p className="muted">{course.intro} 모든 설명에 출처가 붙어 있습니다.</p>
        </div>
      )}
      {embedded && <p className="muted course-embed-intro">{course.intro} 모든 설명에 출처가 붙어 있습니다.</p>}
      <ol className="basics-lessons">
        {course.lessons.map((l, i) => (
          <li key={l.id} className={l.part ? 'has-part' : ''} data-part={l.part}>
            <button type="button" className={l.id === lesson.id ? 'on' : ''} aria-current={l.id === lesson.id ? 'step' : undefined} onClick={() => setLessonId(l.id)}>
              <span className="num">{i + 1}</span>
              <span>
                <strong>{l.title}</strong>
                <small>{l.short}</small>
              </span>
              {!processMovies[l.id] && <em className="muted">준비 중</em>}
            </button>
          </li>
        ))}
      </ol>

      <article className="card">
        <h3>
          {index + 1}. {lesson.title}
        </h3>
        <ProcessMovie key={lesson.id} id={lesson.id} chapters={chapters} onOpenProcess={setLessonId} />
        {explainers[lesson.id] && <ProcessExplainer id={lesson.id} />}
        {!processMovies[lesson.id] && <p className="notice">이 단원은 출처를 확인하는 중이라 곧 채워집니다.</p>}
        <div className="screen-foot">
          {next ? (
            <button type="button" className="primary" onClick={() => setLessonId(next.id)}>
              다음 단원: {next.title} →
            </button>
          ) : (
            course.finish && (
              <button type="button" className="primary" onClick={finish}>
                {course.finish.label}
              </button>
            )
          )}
          {embedded && findProcess(lesson.id) && (
            <button type="button" onClick={() => onOpenProcess(lesson.id)}>
              {lesson.title} 공정 상세 · 시뮬레이션 보기
            </button>
          )}
        </div>
      </article>
    </Wrap>
  )
}
