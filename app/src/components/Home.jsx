import { useState } from 'react'
import { wholeFlow } from '../data/packages.js'
import { ACTORS, findProcess, STAGE_ORDER, STAGES } from '../data/processes.js'
import { ProcessIllustration } from './Illustrations.jsx'
import { Term } from '../lib/terms.jsx'
import { useStoredState } from '../lib/storage.js'
import { schedule, usePlan } from '../lib/studyPlan.js'
import { streakOf, useActivity, ymd } from '../lib/activity.js'
import { useNotes } from '../lib/notes.js'
import { dday, UnitList } from './StudyPlan.jsx'

// 첫 화면: 오늘의 공부 대시보드.
// ① 오늘 할 공부(공부 일정에서) + 이어서 하기 ② 숫자 카드(진도·연속 공부일·다시 볼 문제·D-day) ③ 6단계 진도 줄.
// 메뉴는 왼쪽 메뉴에만 둡니다(같은 카드를 홈에 또 늘어놓지 않음). 단계 설명 글은 data/processes.js의 STAGES에서 가져옵니다.

const STAGE_ICON = { design: 'physical-design', front: 'photo', link: 'wafer-map', mid: 'bumping', back: 'wire-bond', board: 'smt' }
const WEEK = ['일', '월', '화', '수', '목', '금', '토']

function Ring({ value }) {
  const r = 22
  const c = 2 * Math.PI * r
  return (
    <svg className="home-ring" viewBox="0 0 56 56" aria-hidden="true">
      <circle cx="28" cy="28" r={r} className="home-ring-bg" />
      <circle cx="28" cy="28" r={r} className="home-ring-fg" strokeDasharray={c} strokeDashoffset={c * (1 - value)} transform="rotate(-90 28 28)" />
    </svg>
  )
}

export default function Home({ pkg, completed, onGo, onOpenProcess, onOpenUnit }) {
  const order = wholeFlow(pkg)
  const done = order.filter((id) => completed.includes(id)).length
  const nextId = order.find((id) => !completed.includes(id))
  const [openStage, setOpenStage] = useState(null)
  const plan = usePlan()
  const activity = useActivity()
  const notes = useNotes()
  const [wrong] = useStoredState('tutor.wrong', [])
  const [wrongW] = useStoredState('tutor.wrongWritten', [])

  const today = new Date()
  const result = schedule(plan, completed, today)
  const todayUnits = result?.days[ymd(today)] ?? []
  const nextUnit = result && Object.entries(result.days).find(([d]) => d >= ymd(today))?.[1]?.[0]
  const streak = streakOf(activity, today)
  const left = plan.settings ? dday(plan.settings.goal, today) : null
  const stage = openStage && STAGES[openStage]
  const stageIds = openStage ? order.filter((id) => findProcess(id)?.stage === openStage) : []
  const dateText = `${today.getMonth() + 1}월 ${today.getDate()}일 ${WEEK[today.getDay()]}요일`

  return (
    <section className="screen home dash">
      <div className="dash-top">
        <article className="card dash-today">
          <p className="home-eyebrow">{dateText}</p>
          {plan.settings ? (
            <>
              <h2>오늘 할 공부 {todayUnits.length > 0 && <small className="muted">· {todayUnits.reduce((s, u) => s + u.min, 0)}분</small>}</h2>
              {todayUnits.length ? (
                <UnitList units={todayUnits} plan={plan} completed={completed} onOpenUnit={onOpenUnit} compact />
              ) : (
                <p className="muted">오늘은 쉬는 날입니다. {nextUnit && `다음 공부: ${nextUnit.title}`}</p>
              )}
              <div className="button-row">
                {todayUnits.find((u) => u.id !== 'review') && (
                  <button type="button" className="primary" onClick={() => onOpenUnit(todayUnits.find((u) => u.id !== 'review'))}>
                    ▶ 시작하기
                  </button>
                )}
                <button type="button" onClick={() => onGo('plan')}>
                  📅 캘린더 보기
                </button>
              </div>
            </>
          ) : (
            <>
              <h2>무엇부터 공부할까요?</h2>
              <p className="muted">목표 날짜와 하루 공부 시간을 정하면 기초부터 첨단 패키징·시험까지 날짜별로 나눠 드립니다. 매일 여기서 오늘 할 공부를 확인하세요.</p>
              <div className="button-row">
                <button type="button" className="primary" onClick={() => onGo('plan')}>
                  📅 공부 일정 만들기
                </button>
                {nextId && (
                  <button type="button" onClick={() => onOpenProcess(nextId)}>
                    {done === 0 ? '바로 시작' : '이어서'}: <Term value={findProcess(nextId).name} compact /> →
                  </button>
                )}
              </div>
            </>
          )}
        </article>

        <div className="dash-stats">
          <button type="button" className="card dash-stat" onClick={() => onGo('map')}>
            <Ring value={order.length ? done / order.length : 0} />
            <span>
              <strong>{order.length ? Math.round((done / order.length) * 100) : 0}%</strong>
              <small>공정 진도 {done}/{order.length}</small>
            </span>
          </button>
          <div className="card dash-stat">
            <span className="dash-emoji" aria-hidden="true">
              🔥
            </span>
            <span>
              <strong>{streak}일</strong>
              <small>연속 공부</small>
            </span>
          </div>
          <button type="button" className="card dash-stat" onClick={() => onGo('wrong')}>
            <span className="dash-emoji" aria-hidden="true">
              🔁
            </span>
            <span>
              <strong>{wrong.length + wrongW.length}문제</strong>
              <small>다시 볼 문제</small>
            </span>
          </button>
          <button type="button" className="card dash-stat" onClick={() => onGo(plan.settings ? 'plan' : 'notes')}>
            <span className="dash-emoji" aria-hidden="true">
              {plan.settings ? '🎯' : '📒'}
            </span>
            <span>
              <strong>{plan.settings ? (left > 0 ? `D-${left}` : left === 0 ? 'D-DAY' : '목표일 지남') : `${notes.length}개`}</strong>
              <small>{plan.settings ? plan.settings.title : '내 노트'}</small>
            </span>
          </button>
        </div>
      </div>

      <h3 className="dash-h">반도체가 만들어지는 6단계</h3>
      <ol className="dash-stages" aria-label="반도체 제조 6단계">
        {STAGE_ORDER.map((id, i) => {
          const s = STAGES[id]
          const ids = order.filter((x) => findProcess(x)?.stage === id)
          const n = ids.filter((x) => completed.includes(x)).length
          const isOpen = openStage === id
          return (
            <li key={id}>
              <button type="button" className={`dash-stage${isOpen ? ' open' : ''}${ids.length && n === ids.length ? ' done' : ''}`} aria-expanded={isOpen} aria-controls="home-stage-panel" onClick={() => setOpenStage(isOpen ? null : id)}>
                <span className="dash-stage-icon" aria-hidden="true">
                  <ProcessIllustration id={STAGE_ICON[id]} compact />
                </span>
                <span className="dash-stage-text">
                  <small>{i + 1}단계</small>
                  <strong>{s.name.ko}</strong>
                  <span className="dash-stage-bar" aria-label={`${n}/${ids.length} 학습`}>
                    <span style={{ width: `${ids.length ? (n / ids.length) * 100 : 0}%` }} />
                  </span>
                </span>
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
              <button key={id} type="button" className={completed.includes(id) ? 'home-chip done' : 'home-chip'} onClick={() => onOpenProcess(id)}>
                {completed.includes(id) && '✓ '}
                <Term value={findProcess(id).name} compact />
              </button>
            ))}
          </div>
        </article>
      )}
    </section>
  )
}
