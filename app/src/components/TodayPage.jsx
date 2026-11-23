import { wholeFlow } from '../data/packages.js'
import { findProcess } from '../data/processes.js'
import { useStoredState } from '../lib/storage.js'
import { schedule, usePlan } from '../lib/studyPlan.js'
import { ymd } from '../lib/activity.js'
import { UnitList } from './StudyPlan.jsx'
import FieldTodayCard from './field/FieldTodayCard.jsx'
import { Term } from '../lib/terms.jsx'

// 오늘의 학습: 오늘 일정 → 이어서 학습 → 오늘의 현장 실무 훈련 → 오답 복습 순서로 오늘 할 일만 모아 봅니다.
export default function TodayPage({ pkg, completed, onGo, onOpenProcess, onOpenUnit }) {
  const plan = usePlan()
  const [wrong] = useStoredState('tutor.wrong', [])
  const [wrongW] = useStoredState('tutor.wrongWritten', [])
  const today = new Date()
  const units = schedule(plan, completed, today)?.days[ymd(today)] ?? []
  const nextId = wholeFlow(pkg).find((id) => !completed.includes(id))
  return (
    <section className="screen today">
      <h2>오늘의 학습</h2>
      <p className="muted">오늘 할 일만 순서대로 모았습니다. 위에서부터 하나씩 끝내 보세요.</p>
      <div className="today-grid">
        <article className="card">
          <p className="home-eyebrow">1 · 오늘의 학습 일정</p>
          {plan.settings ? (
            units.length ? (
              <UnitList units={units} plan={plan} completed={completed} onOpenUnit={onOpenUnit} compact />
            ) : (
              <p className="muted">오늘은 쉬는 날입니다.</p>
            )
          ) : (
            <>
              <p className="muted">아직 일정이 없습니다. 목표일을 정하면 날짜별로 나눠 드립니다.</p>
              <button type="button" onClick={() => onGo('plan')}>
                📅 학습 일정 만들기
              </button>
            </>
          )}
        </article>
        <article className="card">
          <p className="home-eyebrow">2 · 이어서 학습하기</p>
          {nextId ? (
            <>
              <h3>
                <Term value={findProcess(nextId).name} />
              </h3>
              <p className="muted">{findProcess(nextId).summary}</p>
              <button type="button" className="primary" onClick={() => onOpenProcess(nextId)}>
                이어서 공부하기 →
              </button>
            </>
          ) : (
            <p className="muted">모든 공정을 학습했습니다 🎉</p>
          )}
        </article>
        <FieldTodayCard completed={completed} onGo={onGo} />
        <article className="card">
          <p className="home-eyebrow">4 · 오답 복습</p>
          <h3>{wrong.length + wrongW.length}문제</h3>
          <p className="muted">
            객관식 {wrong.length} · 주관식 {wrongW.length}
          </p>
          <div className="button-row">
            <button type="button" disabled={!wrong.length} onClick={() => onGo('wrong')}>
              객관식 오답 →
            </button>
            <button type="button" disabled={!wrongW.length} onClick={() => onGo('written')}>
              주관식 다시 풀기 →
            </button>
          </div>
        </article>
      </div>
    </section>
  )
}
