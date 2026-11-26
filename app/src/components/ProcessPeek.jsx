import { useEffect, useRef, useState } from 'react'
import { findProcess, STAGES } from '../data/processes.js'
import { explainers } from '../data/explainers/index.js'
import { processMovies } from '../data/processMovies/index.js'
import { backPeek, closePeek, openPeek, usePeek } from '../lib/peek.js'
import { findMachine } from '../data/machineSim.js'
import { defaultValues, judge } from '../lib/machineJudge.js'
import EquipmentTour from './EquipmentTour.jsx'
import { useBackLayer } from '../lib/nav.js'
import { Term } from '../lib/terms.jsx'
import ProcessExplainer from './ProcessExplainer.jsx'
import ReviewBadge from './ReviewBadge.jsx'
import ProcessMovie from './movie/ProcessMovie.jsx'

// 설명 미리보기 창: 문제풀이·설비 실습처럼 진행 중인 화면에서 공정 설명을 화면 이동 없이 띄웁니다.
// 데스크톱은 오른쪽 패널, 휴대폰은 아래에서 올라오는 시트. 닫으면 하던 화면 그대로 이어집니다.
// 내용은 기존 데이터(processes·explainers·processMovies)와 컴포넌트를 그대로 씁니다(설명 글을 새로 쓰지 않음).
// onNavigate: "전체 설명 페이지로 이동"(화면을 옮김), onNavigateMachine: "설비 실습에서 가동해 보기". 진행 중 화면의 상태는 각 화면이 이 탭에 기억합니다.
// 'm:장비id'면 장비 둘러보기(부위·조작 순서·결과물·용어)를 띄웁니다.
export default function ProcessPeek({ onNavigate, onNavigateMachine }) {
  const { stack } = usePeek()
  const id = stack[stack.length - 1]
  const open = Boolean(id)
  useBackLayer(open, closePeek, 'peek', { transient: true })
  if (!open) return null
  return <PeekDialog key={id} id={id} canBack={stack.length > 1} prevId={stack[stack.length - 2]} onNavigate={onNavigate} onNavigateMachine={onNavigateMachine} />
}

function PeekDialog({ id, canBack, prevId, onNavigate, onNavigateMachine }) {
  const machineId = id.startsWith('m:') ? id.slice(2) : null
  const machine = machineId ? findMachine(machineId) : null
  const process = machineId ? null : findProcess(id)
  const boxRef = useRef(null)
  const titleRef = useRef(null)
  const [movie, setMovie] = useState(false)
  const [drag, setDrag] = useState(0)
  const dragStart = useRef(null)

  // 열리면 제목으로 포커스, Esc로 닫기, Tab이 창 안에서만 돌기
  useEffect(() => {
    titleRef.current?.focus()
  }, [id])
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closePeek()
      } else if (e.key === 'Tab' && boxRef.current) {
        const items = [...boxRef.current.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter((el) => !el.disabled && el.offsetParent !== null)
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // 휴대폰 시트: 손잡이를 아래로 끌면 닫힘
  const onDown = (e) => {
    dragStart.current = e.clientY
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onMove = (e) => {
    if (dragStart.current === null) return
    setDrag(Math.max(0, e.clientY - dragStart.current))
  }
  const onUp = () => {
    if (dragStart.current === null) return
    const moved = drag
    dragStart.current = null
    setDrag(0)
    if (moved > 90) closePeek()
  }

  const prev = prevId && (prevId.startsWith('m:') ? { name: { ko: findMachine(prevId.slice(2))?.name ?? '장비' } } : findProcess(prevId))
  const stage = process && STAGES[process.stage]
  const hasMovie = Boolean(processMovies[id])

  return (
    <>
      <div className="peek-scrim" onClick={closePeek} aria-hidden="true" />
      <aside
        ref={boxRef}
        className={machine ? 'peek wide' : 'peek'}
        role="dialog"
        aria-modal="true"
        aria-labelledby="peek-title"
        style={drag ? { transform: `translateY(${drag}px)`, transition: 'none' } : undefined}
      >
        <div className="peek-handle" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} aria-hidden="true">
          <span />
        </div>
        <header className="peek-head">
          {canBack && prev && (
            <button type="button" className="link peek-prev" onClick={backPeek}>
              ← {prev.name.ko}
            </button>
          )}
          <div className="peek-title-row">
            <h2 id="peek-title" ref={titleRef} tabIndex={-1}>
              {machine ? machine.name : process ? <Term value={process.name} /> : id}
            </h2>
            <button type="button" className="icon-btn peek-close" aria-label="설명 창 닫기" onClick={closePeek}>
              ✕
            </button>
          </div>
          {process && (
            <div className="peek-meta">
              {stage && <span className="quiz-tag soft">{stage.name.ko}</span>}
              <ReviewBadge reviewed={process.reviewed} sources={process.sources} sourceDate={process.sourceDate} />
            </div>
          )}
        </header>

        <div className="peek-body">
          {machine && <MachineBody machine={machine} />}
          {!process && !machine && <p className="muted">이 공정의 설명을 찾지 못했습니다.</p>}
          {process && (
            <>
              <p className="peek-summary">{process.summary}</p>
              {(process.input || process.output) && (
                <p className="peek-io">
                  <span className="muted">입력</span> {process.input} <span aria-hidden="true">→</span> <span className="muted">결과</span> {process.output}
                </p>
              )}
              {hasMovie && (
                <div className="peek-movie">
                  <button type="button" className={movie ? 'subtab active' : 'subtab'} aria-expanded={movie} onClick={() => setMovie((v) => !v)}>
                    {movie ? '▾ 애니메이션 접기' : '▶ 애니메이션 보기'}
                  </button>
                  {movie && <ProcessMovie id={id} compact onOpenProcess={openPeek} />}
                </div>
              )}
              {explainers[id] ? <ProcessExplainer id={id} /> : <p className="muted">자세한 설명은 아직 준비 중입니다. 전체 설명 페이지에서 세부 단계를 볼 수 있습니다.</p>}
              {process.prerequisites?.length > 0 && (
                <div className="peek-pre">
                  <p className="muted">먼저 볼 공정</p>
                  <div className="button-row">
                    {process.prerequisites.map((pid) => {
                      const p = findProcess(pid)
                      return p ? (
                        <button key={pid} type="button" className="chip" onClick={() => openPeek(pid)}>
                          {p.name.ko}
                        </button>
                      ) : null
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <footer className="peek-foot">
          {process && (
            <button
              type="button"
              className="primary"
              onClick={() => {
                closePeek()
                onNavigate(id)
              }}
            >
              전체 설명 페이지로 이동 →
            </button>
          )}
          {machine && (
            <button
              type="button"
              className="primary"
              onClick={() => {
                closePeek()
                onNavigateMachine(machine.id)
              }}
            >
              설비 실습에서 직접 가동해 보기 →
            </button>
          )}
          <button type="button" onClick={closePeek}>
            닫기
          </button>
          <small className="muted">하던 화면은 그대로 기억됩니다. 이동해도 "← 뒤로"로 돌아올 수 있어요.</small>
        </footer>
      </aside>
    </>
  )
}

// 장비 미리보기: 설비 실습과 같은 장비 둘러보기를 권장 조건 기준으로 보여 줍니다.
function MachineBody({ machine }) {
  const values = defaultValues(machine)
  return (
    <>
      <p className="peek-summary">권장 조건 기준으로 장비 부위·조작 순서·결과물을 봅니다. 조건을 바꿔 가동해 보려면 아래 "설비 실습"으로 가세요.</p>
      <EquipmentTour machineId={machine.id} values={values} result={judge(machine, values)} />
    </>
  )
}
