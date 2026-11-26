import { useState } from 'react'
import { allUnits, applyAdjust, isDone, orderedUnits, resetOrder, resetPlan, saveSettings, schedule, STAGE_LABEL, toggleDone, usePlan } from '../lib/studyPlan.js'
import { markActive, useActivity, ymd } from '../lib/activity.js'
import { useStoredState } from '../lib/storage.js'
import { useApiKey } from '../lib/apiKey.js'
import { AiKeyBox } from './AiTutor.jsx'

// 공부 일정(캘린더). 목표일·공부 요일·하루 시간을 정하면 단원을 날짜별로 나눠 줍니다(lib/studyPlan.js).
// 날짜를 누르면 그날 할 단원이 보이고, 단원을 열거나 체크할 수 있습니다. API 키가 있으면 AI로 순서를 조정합니다.

const WEEK = ['일', '월', '화', '수', '목', '금', '토']
const MINUTES = [30, 45, 60, 90, 120, 180]
const loadAi = () => import('../lib/aiTutor.js')

const addDays = (date, n) => {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}
export const dday = (goal, today = new Date()) => {
  const [y, m, d] = goal.split('-').map(Number)
  const t = new Date(today)
  return Math.round((new Date(y, m - 1, d) - new Date(t.getFullYear(), t.getMonth(), t.getDate())) / 86400000)
}

export default function StudyPlan({ completed, onOpenUnit }) {
  const plan = usePlan()
  if (!plan.settings) return <PlanSetup />
  return <PlanCalendar plan={plan} completed={completed} onOpenUnit={onOpenUnit} />
}

// 오늘부터 goal까지(포함) 공부 요일이 며칠인지
const studyDaysUntil = (today, goalYmd, days) => {
  let n = 0
  for (let d = new Date(today); ymd(d) <= goalYmd; d = addDays(d, 1)) if (days.includes(d.getDay())) n += 1
  return n
}
// 하루 minutes분씩 공부 요일에만 할 때 total분을 마치는 날
const finishDate = (today, total, minutes, days) => {
  if (!days.length) return null
  let left = total
  let d = new Date(today)
  for (let guard = 0; guard < 3660; guard += 1, d = addDays(d, 1)) {
    if (days.includes(d.getDay())) left -= minutes
    if (left <= 0) return ymd(d)
  }
  return null
}

// 목표일 정하는 방법: 내 속도로(공부 시간으로 계산) / 기간으로 / 면접·시험 날짜
const GOAL_MODES = [
  { id: 'pace', label: '내 속도로', hint: '공부 요일·시간으로 끝나는 날을 계산해요' },
  { id: 'weeks', label: '기간으로', hint: '몇 주 안에 끝낼지 골라요' },
  { id: 'date', label: '면접·시험 날짜가 있어요', hint: '그 날짜에 맞춰 나눠요' },
]
const WEEK_CHOICES = [2, 4, 8, 12]

function PlanSetup({ initial, onDone }) {
  const today = new Date()
  const [title, setTitle] = useState(initial?.title ?? '반도체 공정 공부 끝내기')
  const [mode, setMode] = useState(initial ? 'date' : 'pace')
  const [weeks, setWeeks] = useState(null)
  const [pickedDate, setPickedDate] = useState(initial?.goal ?? '')
  const [days, setDays] = useState(initial?.days ?? [1, 2, 3, 4, 5])
  const [minutes, setMinutes] = useState(initial?.minutes ?? 60)
  const total = allUnits().reduce((s, u) => s + u.min, 0)
  const toggle = (d) => setDays((list) => (list.includes(d) ? list.filter((x) => x !== d) : [...list, d].sort()))
  const paceGoal = finishDate(today, total, minutes, days)
  const goal = mode === 'pace' ? paceGoal : mode === 'weeks' ? (weeks ? ymd(addDays(today, weeks * 7)) : '') : pickedDate
  const valid = !!goal && goal >= ymd(today) && days.length > 0
  // 고른 날짜까지 끝내려면 하루에 몇 분이 필요한지
  const studyDays = valid ? studyDaysUntil(today, goal, days) : 0
  const needPerDay = studyDays ? Math.ceil(total / studyDays) : null

  return (
    <section className="screen plan">
      <h2>{initial ? '일정 설정 바꾸기' : '공부 일정 만들기'}</h2>
      <p className="muted">
        목표 날짜와 공부할 요일, 하루 공부 시간을 정하면 반도체 기초부터 FAB·후공정·첨단 패키징·시험까지 {allUnits().length}개 단원(약 {Math.round(total / 60)}시간)을 날짜별로 나눠 드립니다. 하루를
        빠지면 남은 단원이 자동으로 뒤로 밀립니다.
      </p>
      <form
        className="card plan-setup"
        onSubmit={(e) => {
          e.preventDefault()
          if (!valid) return
          saveSettings({ title: title.trim() || '공부 목표', start: initial?.start ?? ymd(today), goal, days, minutes })
          onDone?.()
        }}
      >
        <label className="quiz-field">
          <span>목표 이름</span>
          <input className="wq-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 삼성 패키징 직무 면접" />
        </label>
        <div className="quiz-field">
          <span>언제까지 끝낼까요?</span>
          <div className="button-row" role="radiogroup" aria-label="목표일 정하는 방법">
            {GOAL_MODES.map((m) => (
              <button key={m.id} type="button" role="radio" aria-checked={mode === m.id} className={mode === m.id ? 'subtab active' : 'subtab'} onClick={() => setMode(m.id)}>
                {m.label}
              </button>
            ))}
          </div>
          <small className="muted">{GOAL_MODES.find((m) => m.id === mode).hint}</small>
          {mode === 'weeks' && (
            <div className="button-row" role="radiogroup" aria-label="기간">
              {WEEK_CHOICES.map((w) => (
                <button key={w} type="button" role="radio" aria-checked={weeks === w} className={weeks === w ? 'subtab active' : 'subtab'} onClick={() => setWeeks(w)}>
                  {w}주
                </button>
              ))}
            </div>
          )}
          {mode === 'date' && (
            <input className="wq-input" type="date" value={pickedDate} min={ymd(today)} aria-label="면접·시험 날짜" onChange={(e) => setPickedDate(e.target.value)} />
          )}
        </div>
        <div className="quiz-field">
          <span>공부하는 요일</span>
          <div className="button-row" role="group" aria-label="공부하는 요일">
            {WEEK.map((w, d) => (
              <button key={w} type="button" aria-pressed={days.includes(d)} className={days.includes(d) ? 'subtab active' : 'subtab'} onClick={() => toggle(d)}>
                {w}
              </button>
            ))}
          </div>
        </div>
        <div className="quiz-field">
          <span>하루 공부 시간</span>
          <div className="button-row" role="radiogroup" aria-label="하루 공부 시간">
            {MINUTES.map((m) => (
              <button key={m} type="button" role="radio" aria-checked={minutes === m} className={minutes === m ? 'subtab active' : 'subtab'} onClick={() => setMinutes(m)}>
                {m < 60 ? `${m}분` : `${m / 60}시간`}
              </button>
            ))}
          </div>
        </div>
        <p className={`plan-preview${valid && needPerDay > minutes ? ' warn' : ''}`} role="status">
          {!days.length
            ? '공부할 요일을 하루 이상 골라 주세요.'
            : !valid
              ? mode === 'weeks'
                ? '기간을 골라 주세요.'
                : '날짜를 골라 주세요.'
              : needPerDay > minutes
                ? `${goal}까지 끝내려면 공부하는 날마다 약 ${needPerDay}분이 필요해요. 지금 정한 ${minutes}분으로는 부족하니 시간·요일을 늘리거나 날짜를 미뤄 보세요.`
                : `목표일 ${goal} (D-${dday(goal, today)}) · 공부하는 날 ${studyDays}일 · 하루 약 ${needPerDay}분이면 ${allUnits().length}개 단원을 끝낼 수 있어요.`}
        </p>
        <div className="button-row">
          <button type="submit" className="primary" disabled={!valid}>
            {initial ? '저장하고 다시 나누기' : '일정 만들기'}
          </button>
          {onDone && (
            <button type="button" onClick={onDone}>
              취소
            </button>
          )}
        </div>
      </form>
    </section>
  )
}

function PlanCalendar({ plan, completed, onOpenUnit }) {
  const today = new Date()
  const todayKey = ymd(today)
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [picked, setPicked] = useState(todayKey)
  const [editing, setEditing] = useState(false)
  const activity = useActivity()
  const result = schedule(plan, completed, today)
  const { settings } = plan
  const left = dday(settings.goal, today)
  const doneCount = result.total - result.left

  if (editing) return <PlanSetup initial={settings} onDone={() => setEditing(false)} />

  // 달력 칸: 그 달 1일이 있는 주의 일요일부터 6주
  const first = new Date(month)
  const startCell = addDays(first, -first.getDay())
  const cells = Array.from({ length: 42 }, (_, i) => addDays(startCell, i))
  const pickedUnits = result.days[picked] ?? []
  // 지나간 날: 그날 체크한 단원
  const pastDone = picked < todayKey ? orderedUnits(plan).filter((u) => plan.done[u.id] === picked) : []

  return (
    <section className="screen plan">
      <div className="plan-head">
        <div>
          <p className="home-eyebrow">{settings.title}</p>
          <h2>
            {left > 0 ? `D-${left}` : left === 0 ? 'D-DAY' : `목표일 ${-left}일 지남`} <small className="muted">· {settings.goal}</small>
          </h2>
          <div className="home-progress-bar" aria-hidden="true">
            <span style={{ width: `${(doneCount / result.total) * 100}%` }} />
          </div>
          <p className="muted">
            단원 {doneCount} / {result.total} 끝냄 · 남은 공부 약 {Math.round(result.remainingMinutes / 60)}시간 · {settings.days.map((d) => WEEK[d]).join('')} · 하루{' '}
            {settings.minutes}분
          </p>
        </div>
        <div className="button-row">
          <button type="button" onClick={() => setEditing(true)}>
            ⚙ 설정 바꾸기
          </button>
          <button type="button" className="link" onClick={() => window.confirm('일정과 체크 기록을 모두 지울까요?') && resetPlan()}>
            일정 지우기
          </button>
        </div>
      </div>

      {result.overflow.length > 0 && (
        <p className="notice">
          지금 설정으로는 목표일까지 {result.overflow.length}개 단원이 남습니다. 하루 {result.needMinutes}분 이상으로 늘리거나, 공부 요일을 늘리거나, 목표일을 미뤄 보세요.
        </p>
      )}
      {plan.note && <p className="plan-note">🤖 {plan.note}</p>}

      <div className="plan-body">
        <article className="card plan-cal">
          <div className="plan-cal-head">
            <button type="button" className="link" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="이전 달">
              ‹
            </button>
            <strong>
              {month.getFullYear()}년 {month.getMonth() + 1}월
            </strong>
            <button type="button" className="link" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="다음 달">
              ›
            </button>
          </div>
          <div className="plan-grid" role="grid">
            {WEEK.map((w) => (
              <span key={w} className="plan-dow">
                {w}
              </span>
            ))}
            {cells.map((d) => {
              const key = ymd(d)
              const units = result.days[key] ?? []
              const out = d.getMonth() !== month.getMonth()
              const mins = units.reduce((s, u) => s + u.min, 0)
              const cls = ['plan-day', out && 'out', key === todayKey && 'today', key === picked && 'picked', key === settings.goal && 'goal', activity[key] && 'active', key < todayKey && 'past'].filter(Boolean).join(' ')
              return (
                <button key={key} type="button" className={cls} onClick={() => setPicked(key)} aria-label={`${key} ${units.length}개 단원`}>
                  <span className="plan-date">{d.getDate()}</span>
                  {key === settings.goal && <span className="plan-goal">🎯</span>}
                  {units.length > 0 && key >= todayKey && (
                    <span className="plan-load">
                      {units[0].id === 'review' ? '복습' : `${units.length}개`}
                      <small>{mins}분</small>
                    </span>
                  )}
                  {activity[key] && <span className="plan-dot" aria-hidden="true" />}
                </button>
              )
            })}
          </div>
          <p className="muted plan-legend">
            <span className="plan-dot inline" /> 공부한 날 · 🎯 목표일 · 숫자는 그날 할 단원 수
          </p>
        </article>

        <article className="card plan-day-panel">
          <h3>
            {picked === todayKey ? '오늘' : picked.slice(5).replace('-', '월 ') + '일'} 할 공부
          </h3>
          {picked < todayKey ? (
            pastDone.length ? (
              <UnitList units={pastDone} plan={plan} completed={completed} onOpenUnit={onOpenUnit} />
            ) : (
              <p className="muted">{activity[picked] ? '이날 공부한 기록이 있습니다.' : '이날은 기록이 없습니다.'} 지나간 날의 할 일은 남은 날로 자동으로 옮겨졌습니다.</p>
            )
          ) : pickedUnits.length ? (
            <UnitList units={pickedUnits} plan={plan} completed={completed} onOpenUnit={onOpenUnit} />
          ) : (
            <p className="muted">{picked > settings.goal ? '목표일 뒤입니다.' : '공부 요일이 아닙니다. 쉬는 날!'}</p>
          )}
        </article>
      </div>

      <PlanAi plan={plan} completed={completed} />
    </section>
  )
}

export function UnitList({ units, plan, completed, onOpenUnit, compact = false }) {
  return (
    <ul className={`plan-units${compact ? ' compact' : ''}`}>
      {units.map((u) => {
        const done = isDone(u, plan, completed)
        const auto = u.go.kind === 'process' && completed.includes(u.go.id) && !plan.done[u.id]
        return (
          <li key={u.id} className={done ? 'done' : ''}>
            <input
              type="checkbox"
              checked={done}
              disabled={auto || u.id === 'review'}
              title={auto ? '공정 상세에서 학습 완료한 단원입니다' : '끝냈으면 체크'}
              onChange={() => {
                if (!plan.done[u.id]) markActive()
                toggleDone(u.id)
              }}
              aria-label={`${u.title} 끝냄`}
            />
            <button type="button" className="plan-unit-open" onClick={() => onOpenUnit(u)}>
              <span>{u.title}</span>
              <small className="muted">
                {STAGE_LABEL[u.stage] ?? ''} · {u.min}분
              </small>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function PlanAi({ plan, completed }) {
  const { apiKey } = useApiKey()
  const [wrong] = useStoredState('tutor.wrong', [])
  const [wrongW] = useStoredState('tutor.wrongWritten', [])
  const [request, setRequest] = useState('')
  const [state, setState] = useState({ status: 'idle' })

  const weak = {}
  for (const w of [...wrong, ...wrongW]) weak[STAGE_LABEL[w.q.topic] ?? w.q.topic] = (weak[STAGE_LABEL[w.q.topic] ?? w.q.topic] ?? 0) + w.misses

  const ask = async () => {
    setState({ status: 'loading' })
    const ai = await loadAi()
    try {
      const units = orderedUnits(plan).filter((u) => !isDone(u, plan, completed))
      const result = await ai.adjustPlan({ apiKey, request, units, settings: plan.settings, weak })
      setState({ status: 'done', result })
    } catch (error) {
      setState({ status: 'error', text: ai.aiErrorText(error) })
    }
  }

  return (
    <details className="card ai-optional plan-ai">
      <summary>🤖 AI로 일정 조정하기 (선택 · 내 API 키 필요)</summary>
      <p className="muted">예: “자주 틀린 후공정을 앞으로 당겨 줘”, “주말에도 1시간씩 할게”, “설계 단원은 빼 줘”. 날짜 배치는 앱이 다시 계산하고, AI는 순서와 설정만 바꿉니다.</p>
      {!apiKey ? (
        <AiKeyBox compact />
      ) : (
        <>
          <textarea className="wq-input" rows={3} value={request} onChange={(e) => setRequest(e.target.value)} placeholder="어떻게 바꾸고 싶은지 써 주세요" />
          <div className="button-row">
            <button type="button" className="primary" disabled={!request.trim() || state.status === 'loading'} onClick={ask}>
              {state.status === 'loading' ? 'AI가 일정을 다시 짜는 중…' : '조정안 받기'}
            </button>
            {(plan.order || plan.skip.length > 0) && (
              <button type="button" onClick={resetOrder}>
                기본 순서로 되돌리기
              </button>
            )}
          </div>
          {state.status === 'error' && <p className="ai-error">{state.text}</p>}
          {state.status === 'done' && (
            <div className="ai-answer">
              <span className="ai-badge">AI 조정안 · 확인 후 적용</span>
              <p>{state.result.note}</p>
              <p className="muted">
                뺄 단원 {state.result.skip.length}개{state.result.minutesPerDay ? ` · 하루 ${state.result.minutesPerDay}분` : ''}
                {state.result.days ? ` · 요일 ${state.result.days.map((d) => WEEK[d]).join('')}` : ''}
              </p>
              <div className="button-row">
                <button
                  type="button"
                  className="primary"
                  onClick={() => {
                    applyAdjust(state.result)
                    setState({ status: 'idle' })
                    setRequest('')
                  }}
                >
                  이대로 적용
                </button>
                <button type="button" onClick={() => setState({ status: 'idle' })}>
                  취소
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </details>
  )
}
