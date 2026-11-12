import { useState } from 'react'
import {
  ACTORS,
  boardFlow,
  designFlow,
  findProcess,
  frontFlow,
  frontSupport,
  linkFlow,
  midFlow,
  MAP_INTRO,
  STAGE_ORDER,
  STAGES,
} from '../data/processes.js'
import { backFlowPackage, findPackage } from '../data/packages.js'
import { findAdvanced } from '../data/advanced.js'
import { zoomStories } from '../data/zoomStories/index.js'
import { ProcessIllustration } from './Illustrations.jsx'
import { Term } from '../lib/terms.jsx'

// 전체 공정 지도. 큰 단계(설계 → 전공정 → 연결 → 중간공정 → 후공정 → 보드 실장)를 순서대로 보여주고,
// 단계를 누르면 그 안의 공정이 순서대로 펼쳐지며, 공정을 누르면 공정 설명 화면이 열립니다.
// 후공정은 고른 패키지의 흐름을 쓰고, 흐름이 있는 패키지를 고르지 않았으면 기본 패키지(QFN) 흐름을 보여줍니다.

// 단계 카드에 그릴 대표 공정 그림
const STAGE_ICON = { design: 'physical-design', front: 'metallization', link: 'wafer-map', mid: 'bumping', back: 'molding', board: 'smt' }

const usedByName = (id) => findPackage(id)?.name ?? findAdvanced(id)?.name ?? id

function Step({ id, index, completed, currentId, onOpenProcess, children }) {
  const process = findProcess(id)
  const isDone = completed.includes(id)
  const isCurrent = id === currentId
  return (
    <li className="map-step-item">
      <button
        type="button"
        className={`map-step${isDone ? ' done' : ''}${isCurrent ? ' current' : ''}`}
        onClick={() => onOpenProcess(id)}
      >
        <span className="map-step-index">{index + 1}</span>
        <ProcessIllustration id={id} compact />
        <span className="map-step-name">
          <Term value={process.name} compact />
        </span>
        <span className="map-step-badges">
          {zoomStories[id] && <span title="확대해서 보기 있음">🔍</span>}
          {isDone && <span title="학습 완료">✓</span>}
          {isCurrent && <span title="현재 공정">●</span>}
        </span>
      </button>
      {children}
    </li>
  )
}

export default function ProcessMap({ pkg, completed, currentId, onOpenProcess, onChoosePackage }) {
  const backPkg = backFlowPackage(pkg)
  const flows = { design: designFlow, front: frontFlow, link: linkFlow, mid: midFlow, back: backPkg.flow, board: boardFlow }
  const [open, setOpen] = useState(() => findProcess(currentId)?.stage ?? STAGE_ORDER[0])

  const order = STAGE_ORDER.flatMap((stage) => flows[stage])
  const nextId = order.find((id) => !completed.includes(id))
  const stage = STAGES[open]

  return (
    <section className="screen">
      <div className="screen-head">
        <h2>전체 공정 지도</h2>
        {nextId && (
          <button type="button" className="primary" onClick={() => onOpenProcess(nextId)}>
            이어서 학습: <Term value={findProcess(nextId).name} compact /> →
          </button>
        )}
      </div>
      <p className="muted">{MAP_INTRO}</p>

      <ol className="map-stages">
        {STAGE_ORDER.map((key, i) => {
          const ids = flows[key]
          const done = ids.filter((id) => completed.includes(id)).length
          const s = STAGES[key]
          return (
            <li key={key}>
              <button
                type="button"
                className={`map-stage${open === key ? ' open' : ''}${s.optional ? ' optional' : ''}`}
                aria-expanded={open === key}
                onClick={() => setOpen(key)}
              >
                <span className="map-stage-no">{i + 1}단계</span>
                <strong>
                  <Term value={s.name} compact />
                </strong>
                <ProcessIllustration id={STAGE_ICON[key]} compact />
                <span className="map-stage-result">→ {s.result}</span>
                <span className="map-stage-count">
                  공정 {ids.length}개 · 학습 {done}/{ids.length}
                </span>
                <span className="map-stage-who">{s.who.map((w) => ACTORS[w].name).join(' · ')}</span>
                {s.optional && <span className="map-stage-tag">일부 패키지만</span>}
              </button>
            </li>
          )
        })}
      </ol>

      <article className="card map-detail" aria-live="polite">
        <div className="screen-head">
          <h3>
            <Term value={stage.name} />
          </h3>
          {open === 'back' && (
            <button type="button" onClick={onChoosePackage}>
              패키지 바꾸기
            </button>
          )}
        </div>
        <p className="muted">
          {stage.note}
          {open === 'back' && (
            <>
              {' '}
              지금은 <Term value={backPkg.name} /> 흐름입니다.
            </>
          )}
        </p>

        <ol className="map-chain">
          {flows[open].map((id, i) => {
            const support = open === 'front' ? frontSupport.filter((p) => p.repeatsAfter.includes(id)) : []
            const usedBy = findProcess(id).usedBy ?? []
            return (
              <Step key={id} id={id} index={i} completed={completed} currentId={currentId} onOpenProcess={onOpenProcess}>
                {support.length > 0 && (
                  <div className="map-support" aria-label="이 공정 뒤에 반복되는 공정">
                    {support.map((p) => (
                      <button key={p.id} type="button" className="chip map-support-chip" onClick={() => onOpenProcess(p.id)}>
                        ↻ <Term value={p.name} compact />
                      </button>
                    ))}
                  </div>
                )}
                {usedBy.length > 0 && (
                  <p className="map-usedby">
                    {usedBy.map((u) => (
                      <span key={u} className="map-usedby-tag">
                        <Term value={usedByName(u)} compact />
                      </span>
                    ))}
                  </p>
                )}
              </Step>
            )
          })}
        </ol>
        {stage.hint && <p className="muted map-hint">{stage.hint}</p>}
        <p className="map-who">
          <strong>누가 하나요?</strong>{' '}
          {stage.who.map((w) => (
            <span key={w} className="map-who-item">
              <b>{ACTORS[w].name}</b> {ACTORS[w].desc}
            </span>
          ))}
        </p>
      </article>
    </section>
  )
}
