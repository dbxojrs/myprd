import { useState } from 'react'
import { findProcess } from '../data/processes.js'
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
import ProcessSequence, { ProcessBreadcrumb } from './ProcessSequence.jsx'
import { Term, useTerms } from '../lib/terms.jsx'

export default function ProcessQuery({ initialId, pkg, completed, onComplete, onOpenProcess, onOpenMap, onReport }) {
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
          <h3>
            <Term value={process.name} />
          </h3>
          <ProcessIllustration id={process.id} />
          <VideoLinks videos={process.videos} />
          <p>{process.summary}</p>
          <ZoomStory key={`zoom-${process.id}`} id={process.id} />
          <dl className="facts">
            <dt>입력</dt>
            <dd>{process.input}</dd>
            <dt>결과</dt>
            <dd>{process.output}</dd>
            <dt>핵심 용어</dt>
            <dd>{list(process.terms)}</dd>
          </dl>
          <ProcessDetails steps={process.steps} keyPoints={process.keyPoints} />
          <AnalogyButton key={process.id} text={processAnalogies[process.id]} />
          <PhotoExample key={`photo-${process.id}`} photo={process.photo} />
          <ReviewBadge reviewed={process.reviewed} sources={process.sources} sourceDate={process.sourceDate} />
          {process.sources.length > 0 && (
            <details className="sources-detail">
              <summary>참고 자료 {process.sources.length}개</summary>
              <SourceList sources={process.sources} />
            </details>
          )}

          <h4>먼저 볼 공정</h4>
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
