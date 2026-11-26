import { useState } from 'react'
import { findProcess, processes, STAGES, STAGE_ORDER } from '../data/processes.js'
import { searchProcess } from '../lib/search.js'
import { recommendPrerequisites } from '../lib/prereq.js'
import { processAnalogies } from '../data/analogies.js'
import ReviewBadge, { SourceList } from './ReviewBadge.jsx'
import AnalogyButton from './AnalogyButton.jsx'
import PhotoExample from './PhotoExample.jsx'
import VideoLinks from './VideoLinks.jsx'
import ProcessDetails from './ProcessDetails.jsx'
import { ProcessIllustration } from './Illustrations.jsx'
import ZoomStory from './ZoomStory.jsx'
import ConceptFigures from './ConceptFigures.jsx'
import ProcessSequence, { ProcessBreadcrumb } from './ProcessSequence.jsx'
import { Term, useTerms } from '../lib/terms.jsx'
import Collapsible, { ExpandAll } from './ui/Collapsible.jsx'
import ProcessMovie from './movie/ProcessMovie.jsx'
import ProcessExplainer from './ProcessExplainer.jsx'
import { explainers } from '../data/explainers/index.js'
import { findLessonCourse } from '../data/courses.js'
import { fieldCasesFor } from '../data/fieldCases/index.js'

// 공정 상세의 접는 섹션. 열림 상태는 공정과 관계없이 섹션별로 기억합니다.
const SECTION_IDS = ['pq.explain', 'pq.video', 'pq.zoom', 'pq.io', 'pq.terms', 'pq.steps', 'pq.analogy', 'pq.sources', 'pq.prereq']

export default function ProcessQuery({ initialId, pkg, completed, onComplete, onOpenProcess, onOpenMap, onOpenCourse, onOpenField, onReport }) {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(() =>
    initialId ? { status: 'found', process: findProcess(initialId) } : null,
  )
  const [reported, setReported] = useState(false)
  const { list } = useTerms()

  const submit = (event) => {
    event.preventDefault()
    const found = searchProcess(query)
    setResult(found)
    setReported(false)
    if (found.status === 'found') onOpenProcess(found.process.id)
  }

  const open = (id) => {
    onOpenProcess(id)
    setResult({ status: 'found', process: findProcess(id) })
    setReported(false)
    setQuery('')
    window.scrollTo({ top: 0 })
  }

  const process = result?.status === 'found' ? result.process : null
  const prereqs = process ? recommendPrerequisites(process.id, completed) : []
  return (
    <section className="screen">
      <form className="search" onSubmit={submit}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="예: 쏘잉 알려줘"
          aria-label="공정 이름"
        />
        <button type="submit" className="primary">검색</button>
      </form>

      {result?.status === 'empty' && <p className="notice">공정 이름을 입력하세요.</p>}

      {/* 아직 아무 공정도 고르지 않았을 때: 빈 화면 대신 단계별 공정 목록을 바로 고를 수 있게 */}
      {!result && (
        <article className="card query-start">
          <h3>어떤 공정을 볼까요?</h3>
          <p className="muted">이름(한글·영문)으로 검색하거나, 아래에서 단계별로 고르세요.</p>
          {STAGE_ORDER.map((stage) => {
            const list = processes.filter((p) => p.stage === stage)
            if (!list.length) return null
            return (
              <div key={stage} className="query-stage">
                <span className="query-stage-name">{STAGES[stage].name.ko}</span>
                <div className="button-row">
                  {list.map((p) => (
                    <button key={p.id} type="button" className="chip small" onClick={() => open(p.id)}>
                      {p.name.ko}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </article>
      )}

      {result?.status === 'none' && (
        <p className="notice">검증된 자료에서 확인되지 않음. 공정 이름을 바꿔 다시 검색해 보세요.</p>
      )}

      {result?.status === 'ambiguous' && (
        <article className="card">
          <h3>어떤 {result.group}인가요?</h3>
          <div className="button-row">
            {result.options.map((option) => (
              <button key={option.id} type="button" className="chip" onClick={() => open(option.id)}>
                <Term value={option.name} />
              </button>
            ))}
          </div>
        </article>
      )}

      {process && (
        <article className="card">
          <ProcessBreadcrumb process={process} pkg={pkg} onOpenMap={onOpenMap} />
          <CourseBar id={process.id} onOpen={open} onOpenCourse={onOpenCourse} />
          <h3>
            <Term value={process.name} />
          </h3>
          <ProcessIllustration id={process.id} />
          <p>{process.summary}</p>
          <ReviewBadge reviewed={process.reviewed} sources={process.sources} sourceDate={process.sourceDate} />
          <ProcessMovie key={`movie-${process.id}`} id={process.id} onOpenProcess={open} />
          <ExpandAll ids={SECTION_IDS} label="공정 설명" />

          {explainers[process.id] && (
            <Collapsible id="pq.explain" title="자세한 설명 · 출처">
              <ProcessExplainer id={process.id} />
            </Collapsible>
          )}

          <Collapsible id="pq.io" title="입력 · 결과">
            <dl className="facts">
              <dt>입력</dt>
              <dd>{process.input}</dd>
              <dt>결과</dt>
              <dd>{process.output}</dd>
            </dl>
          </Collapsible>
          <Collapsible id="pq.steps" title="세부 단계 · 핵심 포인트">
            <ProcessDetails steps={process.steps} keyPoints={process.keyPoints} />
          </Collapsible>
          <Collapsible id="pq.zoom" title="확대해서 보기 · 개념도">
            <ZoomStory key={`zoom-${process.id}`} id={process.id} />
            <ConceptFigures processId={process.id} />
          </Collapsible>
          <Collapsible id="pq.terms" title="핵심 용어" defaultOpen={false} badge={`${process.terms.length}개`}>
            <p>{list(process.terms)}</p>
          </Collapsible>
          <Collapsible id="pq.analogy" title="비유로 쉽게 보기 · 사진" defaultOpen={false}>
            <AnalogyButton key={process.id} text={processAnalogies[process.id]} />
            <PhotoExample key={`photo-${process.id}`} photo={process.photo} />
          </Collapsible>
          {process.videos?.length > 0 && (
            <Collapsible id="pq.video" title="영상" defaultOpen={false} badge={`${process.videos.length}개`}>
              <VideoLinks videos={process.videos} />
            </Collapsible>
          )}
          {process.sources.length > 0 && (
            <Collapsible id="pq.sources" title="참고 자료" defaultOpen={false} badge={`${process.sources.length}개`}>
              <SourceList sources={process.sources} />
            </Collapsible>
          )}
          <Collapsible id="pq.prereq" title="먼저 볼 공정" defaultOpen={false} badge={prereqs.length ? `${prereqs.length}개` : undefined}>
            {prereqs.length === 0 ? (
              <p className="muted">앞 공정을 모두 학습했거나 첫 공정입니다.</p>
            ) : (
              <div className="button-row">
                {prereqs.map((item) => (
                  <button key={item.id} type="button" className="chip" onClick={() => open(item.id)}>
                    <Term value={item.name} compact />
                  </button>
                ))}
              </div>
            )}
          </Collapsible>

          {onOpenField && fieldCasesFor(process.id).length > 0 && (
            <div className="nb-callout c-purple field-link">
              <span className="nb-callout-icon">🛠️</span>
              <div>
                <strong>현장 실무 훈련으로 이어 가기</strong>
                <p className="muted">이 공정에서 생길 법한 문제를 엔지니어가 되어 풀어 봅니다(교육용 가상 사례).</p>
                <div className="button-row">
                  {fieldCasesFor(process.id).map((fc) => (
                    <button key={fc.id} type="button" onClick={() => onOpenField(fc.id, fc.category)}>
                      {fc.category} · {fc.id} · {fc.title} →
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <ProcessSequence process={process} pkg={pkg} completed={completed} onOpen={open} onComplete={onComplete} />

          <div className="screen-foot">
            <button
              type="button"
              className="primary"
              disabled={completed.includes(process.id)}
              onClick={() => onComplete(process.id)}
            >
              {completed.includes(process.id) ? '✓ 학습 완료' : '학습 완료'}
            </button>
            <button
              type="button"
              disabled={reported}
              onClick={() => {
                onReport(process.id)
                setReported(true)
              }}
            >
              {reported ? '신고를 저장했습니다' : '틀린 내용 신고'}
            </button>
          </div>
        </article>
      )}
    </section>
  )
}

// 이 공정이 영상 강의의 몇 번째 단원인지 보여 주고, 앞뒤 단원·강의 목차로 바로 갑니다.
// 앞뒤 단원이 공정이 아니면(예: 전체 모습과 재료) 강의가 있는 학습 화면에서 그 단원을 엽니다.
function CourseBar({ id, onOpen, onOpenCourse }) {
  const found = findLessonCourse(id)
  if (!found || !onOpenCourse) return null
  const { courseId, course, index, prev, next } = found
  const go = (lesson) => (findProcess(lesson.id) ? onOpen(lesson.id) : onOpenCourse(courseId, lesson.id))
  return (
    <nav className="course-bar" aria-label={`${course.title} 순서`}>
      <button type="button" className="link course-bar-title" onClick={() => onOpenCourse(courseId, id)}>
        🎬 {course.title} <strong>{index + 1}/{course.lessons.length}</strong>
      </button>
      <span className="course-bar-nav">
        {prev && (
          <button type="button" className="chip" onClick={() => go(prev)}>
            ← {prev.title}
          </button>
        )}
        {next && (
          <button type="button" className="chip" onClick={() => go(next)}>
            {next.title} →
          </button>
        )}
      </span>
    </nav>
  )
}
