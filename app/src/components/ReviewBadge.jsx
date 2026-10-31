// 검수 여부와 출처를 함께 보여줍니다. 출처가 없으면 지어내지 않고 "출처 미등록"으로 표시합니다.
export default function ReviewBadge({ reviewed, sources = [], sourceDate = null }) {
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
            <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
              [{i + 1}]
            </a>
          ))}
          {sourceDate && <span className="muted"> · {sourceDate}</span>}
        </span>
      )}
    </div>
  )
}
