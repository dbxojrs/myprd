import { DetailIllustration } from './DetailIllustration.jsx'
import PhotoExample from './PhotoExample.jsx'

// 공정의 세부 단계와 알아둘 점. 내용은 processes.js의 steps·keyPoints에서 가져옵니다.
export default function ProcessDetails({ steps, keyPoints }) {
  if (!steps?.length && !keyPoints?.length) return null

  return (
    <section className="details">
      {steps?.length > 0 && (
        <>
          <h4>세부 단계</h4>
          <ol className="steps">
            {steps.map((step) => (
              <li key={step.name}>
                <strong>{step.name}</strong>
                <span>{step.desc}</span>
              </li>
            ))}
          </ol>
        </>
      )}
      {keyPoints?.length > 0 && (
        <>
          <h4>알아둘 점</h4>
          <div className="key-points">
            {keyPoints.map((point) => {
              const figures = point.figures ?? (point.figure ? [point.figure] : [])
              return (
              <details key={point.title} className="key-point">
                <summary>
                  {point.title}
                  {figures.length > 0 && <span className="muted"> · 그림</span>}
                  {point.photos?.length > 0 && <span className="muted"> · 사진</span>}
                </summary>
                {figures.map((figure) => (
                  <DetailIllustration key={figure} id={figure} />
                ))}
                <p>{point.body}</p>
                {point.photos?.map((photo) => (
                  <PhotoExample key={photo.url} photo={photo} />
                ))}
              </details>
              )
            })}
          </div>
        </>
      )}
      <p className="muted details-note">세부 단계와 알아둘 점은 출처 등록 전 초안입니다. 검수 후 출처를 붙입니다.</p>
    </section>
  )
}
