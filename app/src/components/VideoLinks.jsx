// 공식 채널 영상 링크. 영상은 앱에 넣지 않고 원래 페이지(유튜브)로 연결합니다. PRD "이미지 정책" 참고.
export default function VideoLinks({ videos }) {
  if (!videos?.length) return null

  return (
    <div className="videos">
      <p className="videos-title">그림으로 이해가 안 되면 실제 영상으로 보기</p>
      <ul>
        {videos.map((video) => (
          <li key={video.url}>
            <a href={video.url} target="_blank" rel="noreferrer">
              ▶ {video.title} ↗
            </a>
            <span className="muted">
              {' '}
              · {video.channel} · {video.note}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
