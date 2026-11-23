import { useState } from 'react'
import { explainers } from '../data/explainers/index.js'
import { findSource } from '../data/sourceCatalog.js'
import { Cites } from './movie/ProcessMovie.jsx'

// 공정 설명: "쉽게 보기"(비유·핵심 몇 줄)와 "자세히 보기"(주제별 설명). 문장마다 출처 이름이 붙고,
// 아래에 이 설명에 쓴 출처 목록과 "출처에서 확인하지 못한 것"을 함께 보여줍니다.
export default function ProcessExplainer({ id }) {
  const data = explainers[id]
  const [mode, setMode] = useState('easy')
  if (!data) return null
  const all = [...(data.analogy?.cite ?? []), ...data.easy.flatMap((l) => l.cite ?? []), ...data.sections.flatMap((s) => s.points.flatMap((p) => p.cite ?? []))]
  const used = [...new Set(all)].map(findSource).filter(Boolean)

  return (
    <div className="explainer">
      <div className="seg" role="tablist" aria-label="설명 수준">
        <button type="button" role="tab" aria-selected={mode === 'easy'} className={mode === 'easy' ? 'active' : ''} onClick={() => setMode('easy')}>
          🌱 쉽게 보기
        </button>
        <button type="button" role="tab" aria-selected={mode === 'detail'} className={mode === 'detail' ? 'active' : ''} onClick={() => setMode('detail')}>
          🔬 자세히 보기
        </button>
      </div>

      {mode === 'easy' ? (
        <div className="explainer-easy">
          {data.analogy && (
            <p className="explainer-analogy">
              <span aria-hidden="true">💡</span> {data.analogy.text}
              <Cites keys={data.analogy.cite} />
            </p>
          )}
          <ol>
            {data.easy.map((line, i) => (
              <li key={i}>
                {line.text}
                <Cites keys={line.cite} />
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div className="explainer-detail">
          {data.sections.map((sec) => (
            <section key={sec.heading}>
              <h5>{sec.heading}</h5>
              <ul>
                {sec.points.map((p, i) => (
                  <li key={i}>
                    {p.text}
                    <Cites keys={p.cite} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {data.gaps?.length > 0 && (
        <details className="explainer-gaps">
          <summary>출처에서 확인하지 못한 것 {data.gaps.length}개</summary>
          <ul>
            {data.gaps.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </details>
      )}
      <div className="explainer-sources">
        <strong>이 설명의 출처</strong> <span className="muted">· 확인한 날 {data.checked}</span>
        <ol>
          {used.map((s) => (
            <li key={s.key}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.title}
              </a>{' '}
              <span className="muted">
                · {s.publisher} · <span className={`tier ${s.tier}`}>{s.tier === 'explain' ? '설명 출처' : '근거 출처'}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
