import { ARTICLES, CONCEPTS } from '../data/concepts.js'
import { CONCEPT_DRAWINGS } from './concepts/index.js'
import { prefersReducedMotion } from './Illustrations.jsx'

// 공정 상세 화면의 "개념 그림" 묶음. 삼성 뉴스룸 「반도체 8대 공정」 그림이 가르치는 개념을
// 글 내용만 보고 새로 그린 움직이는 그림으로 보여주고, 원본 그림은 링크로 엽니다.
export default function ConceptFigures({ processId }) {
  const list = (CONCEPTS[processId] ?? []).filter((c) => CONCEPT_DRAWINGS[c.id])
  if (list.length === 0) return null
  const animate = !prefersReducedMotion()
  return (
    <section className="cf-section" aria-label="개념 그림">
      <h4>
        개념 그림 <span className="muted">· 움직이는 그림으로 핵심만</span>
      </h4>
      <div className="cf-grid">
        {list.map((c) => {
          const Drawing = CONCEPT_DRAWINGS[c.id]
          const a = ARTICLES[c.article]
          return (
            <figure key={c.id} className="cf-card">
              <Drawing animate={animate} />
              <figcaption>
                <strong>{c.title}</strong>
                <p>{c.teach}</p>
                <ul>
                  {c.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                {a && (
                  <a href={a.url} target="_blank" rel="noreferrer" className="cf-origin">
                    원본 그림 보기 · 삼성전자 반도체 뉴스룸 「{a.title}」({a.date}) ↗
                  </a>
                )}
                <small className="muted">글 내용을 바탕으로 이 앱이 새로 그린 그림 · 설명 출처 · 검수 전</small>
              </figcaption>
            </figure>
          )
        })}
      </div>
    </section>
  )
}
