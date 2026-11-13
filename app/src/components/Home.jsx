import { useState } from 'react'
import { wholeFlow } from '../data/packages.js'
import { ACTORS, findProcess, STAGE_ORDER, STAGES } from '../data/processes.js'
import { MENU_GROUPS } from './menu.js'
import { ProcessIllustration } from './Illustrations.jsx'
import { Term } from '../lib/terms.jsx'

// 첫 화면. 칩 설계부터 보드 실장까지 6단계를 크게 보여주고, 단계를 누르면 아래에 설명과 공정 목록이 펼쳐집니다.
// 그 아래에는 메뉴 묶음(배우기·실습·심화)을 카드로 보여줍니다. 설명 글은 모두 data/processes.js의 STAGES에서 가져옵니다.

// 단계 타일에 작게 그릴 대표 공정 그림
const STAGE_ICON = { design: 'physical-design', front: 'photo', link: 'wafer-map', mid: 'bumping', back: 'wire-bond', board: 'smt' }

export default function Home({ pkg, completed, onGo, onOpenProcess }) {
  const order = wholeFlow(pkg)
  const done = order.filter((id) => completed.includes(id)).length
  const nextId = order.find((id) => !completed.includes(id))
  const [openStage, setOpenStage] = useState(null)
  const stage = openStage && STAGES[openStage]
  const stageIds = openStage ? order.filter((id) => findProcess(id)?.stage === openStage) : []

  return (
    <section className="screen home">
      <div className="home-hero">
        <div className="home-hero-text">
          <p className="home-eyebrow">칩 설계 → 전공정 → 후공정 → 보드 실장</p>
          <h2>반도체가 만들어지는 전 과정을 움직이는 그림과 장비 실습으로</h2>
          <p className="muted">단계를 누르면 무엇을 하는지, 누가 하는지, 어떤 공정을 거치는지 펼쳐집니다.</p>
          <div className="home-progress" aria-label="전체 공정 학습 진도">
            <span>
              학습한 공정 <strong>{done}</strong> / {order.length}
            </span>
            <div className="home-progress-bar" aria-hidden="true">
              <span style={{ width: `${(done / order.length) * 100}%` }} />
            </div>
          </div>
          <div className="button-row">
            {nextId && (
              <button type="button" className="primary" onClick={() => onOpenProcess(nextId)}>
                {done === 0 ? '처음부터 학습' : '이어서 학습'}: <Term value={findProcess(nextId).name} compact /> →
              </button>
            )}
            <button type="button" onClick={() => onGo('machine')}>
              장비 시뮬레이터 열기
            </button>
          </div>
        </div>
      </div>

      <ol className="home-stages" aria-label="반도체 제조 6단계">
        {STAGE_ORDER.map((id, i) => {
          const s = STAGES[id]
          const isOpen = openStage === id
          return (
            <li key={id}>
              <button
                type="button"
                className={`home-stage${isOpen ? ' open' : ''}${s.optional ? ' optional' : ''}`}
                aria-expanded={isOpen}
                aria-controls="home-stage-panel"
                onClick={() => setOpenStage(isOpen ? null : id)}
              >
                <span className="home-stage-no">{i + 1}</span>
                <span className="home-stage-icon" aria-hidden="true">
                  <ProcessIllustration id={STAGE_ICON[id]} compact />
                </span>
                <strong>
                  <Term value={s.name} compact />
                </strong>
                <span className="home-stage-result">{s.result}</span>
              </button>
            </li>
          )
        })}
      </ol>

      {stage && (
        <article id="home-stage-panel" className="card home-stage-panel" aria-live="polite">
          <div className="home-stage-panel-head">
            <h3>
              <Term value={stage.name} />
            </h3>
            <button type="button" className="link" onClick={() => setOpenStage(null)} aria-label="설명 닫기">
              닫기 ✕
            </button>
          </div>
          <p>{stage.note}</p>
          <dl className="home-facts">
            <div>
              <dt>결과물</dt>
              <dd>{stage.result}</dd>
            </div>
            <div>
              <dt>누가 하나요?</dt>
              <dd>
                {stage.who.map((w) => (
                  <span key={w} className="home-actor" title={ACTORS[w].desc}>
                    {ACTORS[w].name}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
          {stage.hint && <p className="muted home-hint">{stage.hint}</p>}
          <p className="home-sub">이 단계의 공정 ({stageIds.length})</p>
          <div className="home-chips">
            {stageIds.map((id) => (
              <button
                key={id}
                type="button"
                className={completed.includes(id) ? 'home-chip done' : 'home-chip'}
                onClick={() => onOpenProcess(id)}
              >
                {completed.includes(id) && '✓ '}
                <Term value={findProcess(id).name} compact />
              </button>
            ))}
          </div>
        </article>
      )}

      <div className="home-groups">
        {MENU_GROUPS.map((group) => (
          <section key={group.id} className="home-group" aria-labelledby={`home-${group.id}`}>
            <h3 id={`home-${group.id}`}>
              <span aria-hidden="true">{group.icon}</span> {group.label}
            </h3>
            <p className="muted">{group.desc}</p>
            <div className="home-cards">
              {group.items.map((item) => (
                <button key={item.id} type="button" className="home-card" onClick={() => onGo(item.id)}>
                  <strong>{item.label}</strong>
                  <span>{item.desc}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}
