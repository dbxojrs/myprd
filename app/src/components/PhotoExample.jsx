import { useState } from 'react'

// "실제 사진 보기" 버튼. PRD 이미지 정책에 따라 재사용이 허락된 사진(attach)만 앱에 보여주고,
// 허락받지 않은 사진(link)은 원래 페이지로 가는 링크만 둡니다.
export default function PhotoExample({ photo }) {
  const [open, setOpen] = useState(false)
  if (!photo) return null

  if (photo.kind === 'link') {
    return (
      <p className="photo">
        📷 실제 사진 예시:{' '}
        <a href={photo.url} target="_blank" rel="noreferrer">
          {photo.title} · 원본에서 보기 ↗
        </a>
      </p>
    )
  }

  return (
    <div className="photo">
      <button type="button" className="analogy-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        📷 {open ? '사진 닫기' : '실제 사진 보기'}
      </button>
      {open && (
        <figure className="photo-body">
          <img src={`${import.meta.env.BASE_URL}${photo.src}`} alt={photo.title} loading="lazy" />
          <figcaption className="muted">
            {photo.title} · {photo.author} ·{' '}
            <a href={photo.url} target="_blank" rel="noreferrer">
              {photo.license}
            </a>
          </figcaption>
        </figure>
      )}
    </div>
  )
}
