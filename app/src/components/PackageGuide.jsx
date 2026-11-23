import { packageGuides } from '../data/packageGuides/index.js'
import { findProcess } from '../data/processes.js'
import { findSource } from '../data/sourceCatalog.js'
import { Cites } from './movie/ProcessMovie.jsx'
import Collapsible from './ui/Collapsible.jsx'

// 패키지 타입 안내: 무엇으로 되어 있나 → 후공정 순서(단계마다 설명) → 다른 타입과 비교 → 더 자세히.
// 문장마다 출처가 붙고(data/packageGuides), 공정 페이지가 있는 단계는 눌러서 공정 상세로 갑니다.
export default function PackageGuide({ id, onOpenProcess }) {
  const g = packageGuides[id]
  if (!g) return null
  const cites = [
    ...g.structure,
    ...g.flow.map((s) => s.note).filter(Boolean),
    ...g.compare,
    ...(g.sections ?? []).flatMap((s) => s.points),
  ].flatMap((l) => l.cite ?? [])
  const used = [...new Set(cites)].map(findSource).filter(Boolean)

  return (
    <div className="pkg-guide explainer">
      <section>
        <h4>무엇으로 되어 있나</h4>
        <ul>
          {g.structure.map((l, i) => (
            <li key={i}>
              {l.text}
              <Cites keys={l.cite} />
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h4>후공정 순서</h4>
        <ol className="pkg-guide-flow">
          {g.flow.map((step, i) => {
            const p = step.id ? findProcess(step.id) : null
            return (
              <li key={i}>
                <span className="num">{i + 1}</span>
                <div>
                  {p ? (
                    <button type="button" className="link pkg-guide-step" onClick={() => onOpenProcess(p.id)} title="공정 상세 보기">
                      {p.name.ko} →
                    </button>
                  ) : (
                    <strong className="pkg-guide-step">
                      {step.name} <small className="muted">(공정 페이지 준비 중)</small>
                    </strong>
                  )}
                  {step.note && (
                    <p>
                      {step.note.text}
                      <Cites keys={step.note.cite} />
                    </p>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      <section>
        <h4>다른 타입과 다른 점</h4>
        <ul>
          {g.compare.map((l, i) => (
            <li key={i}>
              {l.text}
              <Cites keys={l.cite} />
            </li>
          ))}
        </ul>
      </section>

      {g.sections?.length > 0 && (
        <Collapsible id={`pkgguide.more`} title="더 자세히" defaultOpen={false}>
          <div className="explainer-detail">
            {g.sections.map((sec) => (
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
        </Collapsible>
      )}

      {g.gaps?.length > 0 && (
        <details className="explainer-gaps">
          <summary>출처에서 확인하지 못한 것 {g.gaps.length}개</summary>
          <ul>
            {g.gaps.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </details>
      )}
      <div className="explainer-sources">
        <strong>이 설명의 출처</strong> <span className="muted">· 확인한 날 {g.checked} · 검수 전</span>
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
