import { useState } from 'react'
import { FIELD_CASES } from '../../data/fieldCases/index.js'
import { fieldStore } from '../../lib/fieldSim.js'
import { useStore } from '../../lib/sharedStore.js'
import { useStoredState } from '../../lib/storage.js'
import { useActivity, ymd, streakOf } from '../../lib/activity.js'
import { useReports } from '../../lib/reports.js'

// 학습 분석: 이 기기(로그인하면 동기화된) 학습 기록만으로 계산합니다. 추천도 정해진 규칙으로만 고릅니다(AI 없음).

// 역량(채점 기준 id)별 추천: 가장 약한 역량에 맞는 다음 학습
const ADVICE = {
  contain: { text: '이상을 보면 원인보다 먼저 "설비 중단 · 영향 LOT 격리 · 공유"를 고르는 연습이 필요합니다.', go: 'field', label: '실무 시나리오 다시 풀기' },
  know: { text: '조건을 바꾸면 생기는 새 불량과 검사 원리를 더 익혀 보세요.', go: 'defects', label: '불량 분석 도감 보기' },
  data: { text: '시간 대비 원인을 많이 가르는 데이터를 고르는 연습이 필요합니다. 관리도·Pareto로 "언제부터·무엇이" 를 보는 연습을 해 보세요.', go: 'datalab', label: '공정 데이터 분석 실습' },
  cause: { text: '가설을 데이터로 지우고 남은 원인을 고르는 연습이 필요합니다. 5 Why·피시본으로 원인 후보를 넓게, 깊게 정리해 보세요.', go: 'report', label: '엔지니어 보고서 쓰기' },
  fix: { text: '결과만 맞추는 조치(조건 변경)와 원인을 없애는 조치를 구분하는 연습이 필요합니다.', go: 'defects', label: '불량 분석 도감 보기' },
  verify: { text: '한 번의 정상 결과가 아니라 여러 LOT·시간대로 확인하는 연습이 필요합니다. 관리도로 정상 복귀를 판단해 보세요.', go: 'datalab', label: '관리도 실습' },
}

export default function LearningAnalytics({ completed = [], onGo, onOpenField }) {
  const field = useStore(fieldStore)
  const activity = useActivity()
  const { list: reports } = useReports()
  const [history] = useStoredState('tutor.quizHistory', [])
  const [wrong] = useStoredState('tutor.wrong', [])
  const [wrongWritten] = useStoredState('tutor.wrongWritten', [])

  // 시나리오별 최근 시도
  const played = FIELD_CASES.map((c) => ({ c, st: field[c.id] })).filter((x) => x.st?.attempts?.length)
  const rubric = FIELD_CASES[0]?.rubric ?? []
  const comp = rubric.map((r) => {
    const vals = played
      .map(({ c, st }) => {
        const pts = c.rubric.find((x) => x.id === r.id)?.points
        const got = st.attempts[0].cats?.[r.id]
        return pts && got != null ? got / pts : null
      })
      .filter((v) => v != null)
    return { ...r, n: vals.length, pct: vals.length ? Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 100) : null }
  })
  const scored = comp.filter((x) => x.pct != null)
  const weakest = scored.length ? [...scored].sort((a, b) => a.pct - b.pct)[0] : null
  const unplayed = FIELD_CASES.filter((c) => !field[c.id]?.attempts?.length)

  const quiz = history.slice(0, 10).reverse()
  const quizAvg = history.length ? Math.round((history.reduce((s, h) => s + h.score / Math.max(1, h.total), 0) / history.length) * 100) : null

  const wrongBy = {}
  for (const w of wrong) {
    const k = w.q?.type ?? '기타'
    wrongBy[k] = (wrongBy[k] ?? 0) + 1
  }
  const wrongRows = Object.entries(wrongBy).sort((a, b) => b[1] - a[1])
  const wrongTop = wrongRows[0]?.[1] ?? 1

  const days = Object.keys(activity).length
  const streak = streakOf(activity)

  return (
    <section className="screen analytics">
      <h2>학습 분석</h2>
      <p className="muted">내 학습 기록으로 강점과 약점을 보고, 다음에 할 공부를 정해진 규칙으로 추천합니다. 기록은 이 브라우저(로그인하면 계정)에 저장된 것만 씁니다.</p>

      <div className="an-tiles">
        <Tile label="이론 학습 완료 공정" value={completed.length} unit="개" />
        <Tile label="풀어 본 실무 시나리오" value={`${played.length}/${FIELD_CASES.length}`} />
        <Tile label="문제풀이 평균 정답률" value={quizAvg == null ? '—' : quizAvg} unit={quizAvg == null ? '' : '%'} />
        <Tile label="공부한 날 · 연속" value={`${days}일`} sub={`연속 ${streak}일`} />
        <Tile label="남은 오답" value={wrong.length + wrongWritten.length} unit="문제" />
        <Tile label="작성한 보고서" value={reports.length} unit="개" />
      </div>

      <div className="an-grid">
        <article className="card an-comp">
          <h3>현장 실무 역량</h3>
          {scored.length === 0 ? (
            <p className="muted">실무 시나리오를 하나 끝내면 역량 6가지를 보여 줍니다.</p>
          ) : (
            <>
              <p className="muted">시나리오별 가장 최근 시도의 기준별 득점률 평균입니다 ({played.length}개 시나리오).</p>
              <ul className="an-bars" aria-label="역량별 득점률">
                {comp.map((r) => (
                  <li key={r.id} className={weakest?.id === r.id ? 'weak' : ''}>
                    <span className="an-label">{r.label}</span>
                    <span className="an-track" title={r.pct == null ? '기록 없음' : `${r.label} ${r.pct}%`}>
                      <i style={{ width: `${r.pct ?? 0}%` }} />
                    </span>
                    <span className="an-val">{r.pct == null ? '—' : `${r.pct}%`}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </article>

        <article className="card an-next">
          <h3>다음에 할 공부 (규칙 추천)</h3>
          <ol>
            {weakest && (
              <li>
                <span className="status warn">약한 역량: {weakest.label} {weakest.pct}%</span>
                <p>{ADVICE[weakest.id]?.text}</p>
                <button type="button" className="link" onClick={() => onGo(ADVICE[weakest.id]?.go ?? 'field')}>
                  {ADVICE[weakest.id]?.label} →
                </button>
              </li>
            )}
            {unplayed.length > 0 && (
              <li>
                <span className="status info">아직 안 푼 시나리오 {unplayed.length}개</span>
                <p>
                  {unplayed[0].id} {unplayed[0].title}
                </p>
                <button type="button" className="link" onClick={() => onOpenField(unplayed[0].id, unplayed[0].category)}>
                  풀어 보기 →
                </button>
              </li>
            )}
            {wrong.length + wrongWritten.length > 0 && (
              <li>
                <span className="status info">오답 {wrong.length + wrongWritten.length}문제</span>
                <p>틀린 문제를 다시 맞히면 목록에서 빠집니다.</p>
                <button type="button" className="link" onClick={() => onGo('wrong')}>
                  오답 노트 →
                </button>
              </li>
            )}
            {!weakest && unplayed.length === 0 && wrong.length === 0 && <li className="muted">추천할 항목이 없습니다. 잘하고 있어요!</li>}
          </ol>
        </article>

        <article className="card">
          <h3>시나리오 기록</h3>
          <div className="table-scroll">
            <table className="an-table">
              <thead>
                <tr>
                  <th>시나리오</th>
                  <th>최고</th>
                  <th>최근</th>
                  <th>시도</th>
                </tr>
              </thead>
              <tbody>
                {FIELD_CASES.map((c) => {
                  const st = field[c.id]
                  return (
                    <tr key={c.id}>
                      <td>
                        <button type="button" className="link" onClick={() => onOpenField(c.id, c.category)}>
                          <span className={`cat ${c.category === 'FAB' ? 'fab' : 'pkg'}`}>{c.category}</span> {c.id} {c.title}
                        </button>
                      </td>
                      <td>{st?.best ?? '—'}</td>
                      <td>{st?.attempts?.[0]?.total ?? '—'}</td>
                      <td>{st?.attempts?.length ?? 0}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </article>

        <article className="card">
          <h3>최근 문제풀이 정답률</h3>
          {quiz.length === 0 ? (
            <p className="muted">문제풀이 기록이 없습니다.</p>
          ) : (
            <ul className="an-bars" aria-label="최근 문제풀이 정답률(오래된 것부터)">
              {quiz.map((h, i) => {
                const pct = Math.round((h.score / Math.max(1, h.total)) * 100)
                return (
                  <li key={`${h.at}${i}`}>
                    <span className="an-label">
                      {new Date(h.at).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })} <small className="muted">{h.scope}</small>
                    </span>
                    <span className="an-track" title={`${h.score}/${h.total}`}>
                      <i style={{ width: `${pct}%` }} />
                    </span>
                    <span className="an-val">{pct}%</span>
                  </li>
                )
              })}
            </ul>
          )}
        </article>

        <article className="card">
          <h3>오답 종류</h3>
          {wrongRows.length === 0 ? (
            <p className="muted">객관식 오답이 없습니다.</p>
          ) : (
            <ul className="an-bars" aria-label="오답 종류별 개수">
              {wrongRows.map(([k, n]) => (
                <li key={k}>
                  <span className="an-label">{k}</span>
                  <span className="an-track">
                    <i style={{ width: `${(n / wrongTop) * 100}%` }} />
                  </span>
                  <span className="an-val">{n}</span>
                </li>
              ))}
            </ul>
          )}
          {wrongWritten.length > 0 && <p className="muted">심화 주관식 오답 {wrongWritten.length}문제는 별도로 모여 있습니다.</p>}
        </article>

        <article className="card an-heat-card">
          <h3>최근 12주 공부한 날</h3>
          <Heatmap activity={activity} />
        </article>
      </div>
    </section>
  )
}

function Tile({ label, value, unit, sub }) {
  return (
    <div className="an-tile card">
      <span className="muted">{label}</span>
      <strong>
        {value}
        {unit ? <small> {unit}</small> : null}
      </strong>
      {sub && <small className="muted">{sub}</small>}
    </div>
  )
}

// 요일(행) × 주(열) 달력. 진할수록 그날 활동이 많습니다(한 가지 색의 밝기만 씀).
function Heatmap({ activity }) {
  const [hover, setHover] = useState(null)
  const today = new Date()
  const start = new Date(today)
  start.setDate(start.getDate() - (7 * 12 - 1) - start.getDay())
  const cells = []
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    const key = ymd(d)
    cells.push({ key, n: activity[key] ?? 0, dow: d.getDay() })
  }
  const max = Math.max(1, ...cells.map((c) => c.n))
  const level = (n) => (n === 0 ? 0 : Math.min(4, Math.ceil((n / max) * 4)))
  return (
    <div className="an-heat-wrap">
      <div className="an-heat" role="img" aria-label={`최근 12주 동안 공부한 날 ${cells.filter((c) => c.n).length}일`}>
        {cells.map((c) => (
          <i key={c.key} className={`lv${level(c.n)}`} style={{ gridRow: c.dow + 1 }} onMouseEnter={() => setHover(c)} onMouseLeave={() => setHover(null)} />
        ))}
      </div>
      <div className="an-heat-legend muted">
        <span>{hover ? `${hover.key}: 활동 ${hover.n}회` : '칸에 마우스를 올리면 날짜와 활동 수가 보입니다.'}</span>
        <span className="an-heat-scale">
          적음 <i className="lv0" />
          <i className="lv1" />
          <i className="lv2" />
          <i className="lv3" />
          <i className="lv4" /> 많음
        </span>
      </div>
    </div>
  )
}
