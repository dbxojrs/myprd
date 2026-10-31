// 검수 여부와 출처를 함께 보여줍니다. 출처가 없으면 지어내지 않고 "출처 미등록"으로 표시합니다.
// source.tier가 'explain'(설명 출처)이면 근거 출처와 구분해 표시합니다. PRD "정보 정확성 정책" 참고.
export default function ReviewBadge({ reviewed, sources = [], sourceDate = null }) {
  const explainOnly = sources.length > 0 && sources.every((source) => source.tier === 'explain')

  return (
    <div className="review">
      <span className={reviewed ? 'badge badge-ok' : 'badge badge-pending'}>
        {reviewed ? '검수됨' : '검수 전'}
      </span>
      {sources.length === 0 ? (
        <span className="muted">출처 미등록 · 검수 필요</span>
      ) : (
        <span className="sources">
          출처{' '}
          {sources.map((source, i) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              title={[source.title, source.publisher, source.tier === 'explain' ? '설명 출처' : '근거 출처']
                .filter(Boolean)
                .join(' · ')}
            >
              [{i + 1}]
            </a>
          ))}
          {explainOnly && <span className="muted"> · 설명 출처</span>}
          {sourceDate && <span className="muted"> · {sourceDate}</span>}
        </span>
      )}
    </div>
  )
}

// 출처 제목을 목록으로 보여줍니다. 공정 설명 아래의 "참고 자료"에 씁니다.
export function SourceList({ sources = [] }) {
  if (sources.length === 0) return null
  return (
    <ol className="source-list">
      {sources.map((source) => (
        <li key={source.url}>
          <a href={source.url} target="_blank" rel="noreferrer">
            {source.title}
          </a>
          <span className="muted">
            {' '}
            · {source.publisher} · {source.tier === 'explain' ? '설명 출처' : '근거 출처'}
          </span>
        </li>
      ))}
    </ol>
  )
}
