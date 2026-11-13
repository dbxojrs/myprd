import { useEffect, useState } from 'react'
import { EQUIPMENT } from '../data/equipment/index.js'
import { SEVERITY } from '../data/machineSim.js'
import { ISO, RESULT } from './equipment/index.js'

// 장비 알아보기: 고급 장비 시뮬레이터 위에 붙는 카드입니다.
// ① 장비 둘러보기(부위를 차례로 강조) ② 조작 순서(로트가 장비 안을 따라 움직임) ③ 결과물(지금 조건으로 만든 결과 확대)
// ④ 용어·더 알아보기. 글은 모두 data/equipment에서 가져옵니다.

const TABS = [
  { id: 'tour', label: '① 장비 둘러보기' },
  { id: 'operate', label: '② 조작 순서' },
  { id: 'result', label: '③ 결과물' },
  { id: 'terms', label: '④ 용어·더 알아보기' },
]
const TOUR_MS = 2600
const OPERATE_MS = 3000

function Source({ eq, id }) {
  const s = eq.sources[id]
  if (!s) return null
  const text = `${s.publisher} · ${s.title} (${s.status})`
  return s.url ? (
    <a className="eq-src" href={s.url} target="_blank" rel="noreferrer">
      출처: {text}
    </a>
  ) : (
    <span className="eq-src">출처: {text}</span>
  )
}

// 일정 간격으로 index를 넘기는 자동 재생. 끝에 가면 처음으로 돌아갑니다.
function useAutoPlay(length, ms, playing) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (!playing) return undefined
    const timer = setTimeout(() => setIndex((i) => (i + 1) % length), ms)
    return () => clearTimeout(timer)
  }, [index, length, ms, playing])
  return [index, setIndex]
}

export default function EquipmentTour({ machineId, values, result }) {
  const eq = EQUIPMENT[machineId]
  const Iso = ISO[machineId]
  const Result = RESULT[machineId]
  const [tab, setTab] = useState('tour')
  const [playing, setPlaying] = useState(true)
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const auto = playing && !reduce
  const [mod, setMod] = useAutoPlay(eq?.modules.length ?? 1, TOUR_MS, auto && tab === 'tour')
  const [op, setOp] = useAutoPlay(eq?.operation.length ?? 1, OPERATE_MS, auto && tab === 'operate')
  const [openTerm, setOpenTerm] = useState(null)

  if (!eq || !Iso) return null

  const module = eq.modules[mod]
  const step = eq.operation[op]
  const pickModule = (id) => {
    setMod(eq.modules.findIndex((m) => m.id === id))
    setPlaying(false)
    setTab('tour')
  }
  const termById = (id) => eq.terms.find((t) => t.id === id)

  return (
    <article className="card eq-tour">
      <header className="eq-head">
        <div>
          <p className="home-eyebrow">
            {eq.kind.ko} · {eq.kind.en}
          </p>
          <p className="eq-summary">{eq.summary}</p>
        </div>
        <span className="eq-badge">설명 출처 · 검수 전</span>
      </header>

      <nav className="eq-tabs" role="tablist" aria-label="장비 알아보기">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'subtab active' : 'subtab'} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>

      {(tab === 'tour' || tab === 'operate') && (
        <div className="eq-stage">
          <div className="eq-drawing">
            {tab === 'tour' ? (
              <Iso focus={module.id} onPick={pickModule} />
            ) : (
              <Iso focus={step.at} lot={step.lot} step={step.id} onPick={pickModule} />
            )}
            <div className="eq-play">
              <button type="button" onClick={() => (tab === 'tour' ? setMod((mod - 1 + eq.modules.length) % eq.modules.length) : setOp((op - 1 + eq.operation.length) % eq.operation.length))} aria-label="이전">
                ◀
              </button>
              <button type="button" onClick={() => setPlaying(!playing)} aria-label={playing ? '멈춤' : '재생'}>
                {playing ? '❚❚ 멈춤' : '▶ 재생'}
              </button>
              <button type="button" onClick={() => (tab === 'tour' ? setMod((mod + 1) % eq.modules.length) : setOp((op + 1) % eq.operation.length))} aria-label="다음">
                ▶
              </button>
            </div>
          </div>

          {tab === 'tour' ? (
            <div className="eq-side">
              <ol className="eq-list">
                {eq.modules.map((m, i) => (
                  <li key={m.id}>
                    <button type="button" className={i === mod ? 'active' : ''} onClick={() => pickModule(m.id)}>
                      <strong>{m.name.ko}</strong> <span className="muted">{m.name.en}</span>
                    </button>
                  </li>
                ))}
              </ol>
              <div className="eq-explain" key={module.id}>
                <h4>
                  {module.name.ko} <span className="muted">({module.name.en})</span>
                </h4>
                <p>{module.desc}</p>
                <Source eq={eq} id={module.src} />
              </div>
            </div>
          ) : (
            <div className="eq-side">
              <ol className="eq-list eq-ops">
                {eq.operation.map((o, i) => (
                  <li key={o.id} className={i < op ? 'done' : ''}>
                    <button type="button" className={i === op ? 'active' : ''} onClick={() => { setOp(i); setPlaying(false) }}>
                      <span className="eq-no">{i + 1}</span>
                      <span className={`eq-who who-${o.who}`}>{o.who}</span> {o.title}
                    </button>
                  </li>
                ))}
              </ol>
              <div className="eq-explain" key={step.id}>
                <h4>
                  {op + 1}. {step.title}
                </h4>
                <p>{step.desc}</p>
                {step.terms?.length > 0 && (
                  <div className="eq-chips">
                    {step.terms.map((id) => {
                      const t = termById(id)
                      return t ? (
                        <button key={id} type="button" className="home-chip" onClick={() => { setOpenTerm(id); setTab('terms') }} title={t.short}>
                          {t.ko} 더 알아보기 →
                        </button>
                      ) : null
                    })}
                  </div>
                )}
                <Source eq={eq} id={step.src} />
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'result' && (
        <div className="eq-stage">
          <div className="eq-drawing">{Result ? <Result values={values} result={result} /> : <p className="placeholder">결과물 그림을 준비 중입니다.</p>}</div>
          <div className="eq-side">
            <div className={`eq-verdict ${result?.grade ?? 'good'}`}>
              <strong>지금 조건으로 만들면: {SEVERITY[result?.grade ?? 'good']?.label ?? '정상'}</strong>
              {result?.findings?.length ? (
                <ul>
                  {result.findings.map((f) => (
                    <li key={f.title}>{f.title}</li>
                  ))}
                </ul>
              ) : (
                <p>문제 없이 만들어집니다.</p>
              )}
              <p className="muted">아래 조작반에서 조건을 바꾸면 결과물 그림이 바로 바뀝니다.</p>
            </div>
            <h4>결과물</h4>
            <p>{eq.outputs.product}</p>
            <h4>확인하는 값(계측)</h4>
            <ul>
              {eq.outputs.metrics.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
            {eq.outputs.notes.map((n) => (
              <p key={n.text} className="eq-note">
                {n.text} <Source eq={eq} id={n.src} />
              </p>
            ))}
          </div>
        </div>
      )}

      {tab === 'terms' && (
        <ul className="eq-terms">
          {eq.terms.map((t) => (
            <li key={t.id} className={openTerm === t.id ? 'open' : ''}>
              <button type="button" aria-expanded={openTerm === t.id} onClick={() => setOpenTerm(openTerm === t.id ? null : t.id)}>
                <strong>{t.ko}</strong> <span className="muted">{t.en}</span>
                <span className="eq-term-short">{t.short}</span>
                <span className="eq-more">{openTerm === t.id ? '접기 ▲' : '더 알아보기 ▼'}</span>
              </button>
              {openTerm === t.id && (
                <div className="eq-deep">
                  <p>{t.deep}</p>
                  <Source eq={eq} id={t.src} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <footer className="eq-foot">
        <details>
          <summary>이 장비를 만드는 회사 (공식 자료에서 확인한 것)</summary>
          <ul>
            {eq.vendors.map((v) => (
              <li key={v.name}>
                <strong>{v.name}</strong> — {v.products}. {v.note} <Source eq={eq} id={v.src} />
              </li>
            ))}
          </ul>
          <p className="muted">{eq.vendorNote}</p>
        </details>
      </footer>
    </article>
  )
}
