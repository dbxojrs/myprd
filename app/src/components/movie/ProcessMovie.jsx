import { Component, memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CHAPTERS, processMovies } from '../../data/processMovies/index.js'
import { findProcess } from '../../data/processes.js'
import { findBasic } from '../../data/basics.js'
import { findSource } from '../../data/sourceCatalog.js'
import { movieArt } from './scenes/index.js'
import { Defs, H, MAT, W } from './kit.jsx'
import { prefersReducedMotion } from '../Illustrations.jsx'

// 공정 애니메이션: 영상처럼 장면이 차례로 넘어가며, 아래 자막이 한 문장씩 설명합니다.
// 자막 글과 출처는 data/processMovies, 그림은 components/movie/scenes에 같은 id로 있습니다.
// 그림의 움직임(CSS 애니메이션)은 Web Animations API로 멈추고, 빠르게 하고, 원하는 문장으로 되감습니다.

const HOLD = 1.2 // 장면 끝에서 다음 장면으로 넘어가기 전 잠깐 멈추는 시간(초)
const SPEEDS = [0.75, 1, 1.25, 1.5]

// startScene: 처음 열 장면 id(현장 시나리오 단계별 장면). 없으면 첫 장면이고, 지난번 본 장면이 있으면 "이어 보기"를 보여 줍니다.
export default function ProcessMovie({ id, onOpenProcess, chapters, startScene, compact = false }) {
  const movie = processMovies[id]
  const art = movieArt[id]
  if (!movie || !art) return null
  return (
    <MovieBoundary>
      <Movie key={`${id}-${startScene ?? ''}`} movie={movie} art={art} id={id} onOpenProcess={onOpenProcess} chapters={chapters} startScene={startScene} compact={compact} />
    </MovieBoundary>
  )
}

// 재생 위치 저장: localStorage 'tutor.moviePos' = { 영상 id: 마지막으로 본 장면 번호 }
const POS_KEY = 'tutor.moviePos'
const readPos = (id) => {
  try {
    return JSON.parse(localStorage.getItem(POS_KEY) ?? '{}')[id] ?? 0
  } catch {
    return 0
  }
}
const writePos = (id, si) => {
  try {
    const all = JSON.parse(localStorage.getItem(POS_KEY) ?? '{}')
    all[id] = si
    localStorage.setItem(POS_KEY, JSON.stringify(all))
  } catch {
    // 저장 실패는 재생에 영향 없음
  }
}

// 공정 목차: 지금 공정이 들어 있는 묶음을 번호와 함께 보여 주고, 누르면 그 공정으로 갑니다.
function Chapters({ id, onOpenProcess, chapters }) {
  const group = chapters ?? CHAPTERS.find((c) => c.ids.includes(id))
  if (!group) return null
  return (
    <ol className="movie-chapters" aria-label={group.title}>
      <li className="chap-title">{group.title}</li>
      {group.ids.map((pid, i) => {
        const name = group.names?.[pid] ?? findProcess(pid)?.name.ko ?? findBasic(pid)?.title ?? pid
        return (
          <li key={pid}>
            <button
              type="button"
              className={pid === id ? 'now' : ''}
              aria-current={pid === id ? 'step' : undefined}
              disabled={!onOpenProcess || pid === id}
              onClick={() => onOpenProcess?.(pid)}
            >
              {i + 1}. {name}
            </button>
          </li>
        )
      })}
    </ol>
  )
}

function Movie({ movie, art, id, onOpenProcess, chapters, startScene, compact }) {
  const scenes = movie.scenes
  const last = scenes.length - 1
  const [reduced] = useState(prefersReducedMotion)
  const beatOf = (i) => art[scenes[i].id].beat ?? 3.4
  // 멈춘 상태로 장면을 열 때 보여줄 모습: 첫 문장의 그림이 다 그려진 때(동작 줄이기면 장면 끝)
  const posterAt = (i) => (reduced ? beatOf(i) * scenes[i].beats.length : beatOf(i) - 0.05)
  const startAt = Math.max(0, scenes.findIndex((x) => x.id === startScene))
  const [si, setSi] = useState(startAt)
  const [resume] = useState(() => (startScene ? 0 : readPos(id))) // 지난번 본 장면(처음 장면이면 0)
  const [loop, setLoop] = useState(false) // 지금 장면 구간 반복
  const [cc, setCc] = useState(true) // 화면 자막 켜기
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [elapsed, setElapsed] = useState(() => posterAt(startAt))
  const [take, setTake] = useState(0) // 같은 장면을 다시 그릴 때 바꾸는 값
  const [ended, setEnded] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const stage = useRef(null)
  const wrap = useRef(null)

  const scene = scenes[si]
  const drawing = art[scene.id]
  const beatLen = beatOf(si)
  const beatCount = scene.beats.length
  const sceneLen = beatCount * beatLen
  const beat = Math.min(beatCount - 1, Math.floor(elapsed / beatLen))

  // 그림 속 모든 움직임에 한꺼번에 명령합니다.
  const animations = useCallback(() => stage.current?.getAnimations?.({ subtree: true }) ?? [], [])
  const seek = useCallback(
    (t) => {
      for (const a of animations()) a.currentTime = t * 1000
    },
    [animations],
  )

  // 새 장면이 그려지면: 속도·멈춤 상태를 맞추고, 시작 위치로 감습니다.
  useLayoutEffect(() => {
    const list = animations()
    for (const a of list) {
      a.playbackRate = speed
      a.currentTime = elapsed * 1000
      if (playing) a.play()
      else a.pause()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [si, take])

  useEffect(() => {
    for (const a of animations()) {
      a.playbackRate = speed
      if (playing) a.play()
      else a.pause()
    }
  }, [playing, speed, animations])

  // 장면 시계: 화면 갱신은 1초에 10번만 합니다(그림의 움직임은 CSS 애니메이션이 부드럽게 처리).
  // 매 프레임 다시 그리면 느린 컴퓨터에서 탭이 멈추거나 꺼질 수 있습니다.
  useEffect(() => {
    if (!playing) return undefined
    let prev = performance.now()
    const timer = setInterval(() => {
      const now = performance.now()
      const dt = ((now - prev) / 1000) * speed
      prev = now
      setElapsed((t) => t + dt)
    }, 100)
    return () => clearInterval(timer)
  }, [playing, speed])

  // 장면이 끝나면 다음 장면으로
  useEffect(() => {
    if (elapsed < sceneLen + HOLD) return
    if (loop) {
      setElapsed(0)
      setTake((n) => n + 1)
      return
    }
    if (si < last) {
      setSi(si + 1)
      setElapsed(0)
      setTake((n) => n + 1)
    } else {
      setPlaying(false)
      setEnded(true)
      setElapsed(sceneLen)
    }
  }, [elapsed, sceneLen, si, last, loop])

  // 재생을 시작한 뒤 본 장면을 기억합니다(다음에 "이어 보기").
  useEffect(() => {
    if (started) writePos(id, ended ? 0 : si)
  }, [id, si, started, ended])

  const goScene = (to, { play = playing } = {}) => {
    if (to < 0 || to > last) return
    setEnded(false)
    setSi(to)
    setElapsed(play ? 0 : posterAt(to))
    setTake((n) => n + 1)
  }
  const goBeat = (i) => {
    const t = i * beatLen + 0.01
    setElapsed(t)
    seek(t)
    setEnded(false)
  }
  const toggle = () => {
    if (ended) {
      setStarted(true)
      setEnded(false)
      setPlaying(true)
      goScene(0, { play: true })
      return
    }
    if (!started) {
      // 처음 재생: 미리보기 모습에서 장면 처음으로 되감고 시작
      setStarted(true)
      setElapsed(0)
      seek(0)
      setPlaying(true)
      return
    }
    setPlaying((p) => !p)
  }
  const fullscreen = () => {
    const el = wrap.current
    if (!el) return
    if (document.fullscreenElement) document.exitFullscreen?.()
    else el.requestFullscreen?.()
  }

  // 키보드: 스페이스 재생/멈춤, ← → 문장 이동
  const onKey = (e) => {
    if (e.target.closest('button, select')) return
    if (e.key === ' ') {
      e.preventDefault()
      toggle()
    } else if (e.key === 'ArrowRight') {
      if (beat < beatCount - 1) goBeat(beat + 1)
      else goScene(si + 1)
    } else if (e.key === 'ArrowLeft') {
      if (beat > 0) goBeat(beat - 1)
      else goScene(si - 1)
    }
  }

  const current = scene.beats[beat]
  const legend = drawing.legend ?? []
  const total = scenes.reduce((n, s) => n + s.beats.length, 0)
  const doneBefore = scenes.slice(0, si).reduce((n, s) => n + s.beats.length, 0)

  return (
    <section className="movie" ref={wrap} tabIndex={0} onKeyDown={onKey} aria-label={`${movie.title} 애니메이션`}>
      <header className="movie-head">
        <div>
          <span className="movie-kicker">🎬 공정 애니메이션</span>
          <h4>{movie.title}</h4>
        </div>
        <span className={`badge ${movie.reviewed ? 'badge-ok' : 'badge-pending'}`}>{movie.reviewed ? '검수됨' : '검수 전'}</span>
      </header>

      <div className="movie-stage">
        <svg ref={stage} viewBox={`0 0 ${W} ${H}`} className={`movie-svg${playing ? '' : ' paused'}`} role="img" aria-label={`${scene.title}: ${current.text}`}>
          <Defs />
          <SceneArt key={`${si}-${take}`} drawing={drawing} beatLen={beatLen} />
        </svg>
        <div className="movie-step">
          {si + 1} / {scenes.length} · {scene.title}
        </div>
        {!started && (
          <button type="button" className="movie-bigplay" onClick={toggle} aria-label="애니메이션 재생">
            <span aria-hidden="true">▶</span>
            <small>재생 · 약 {Math.round(scenes.reduce((n, s) => n + s.beats.length * (art[s.id].beat ?? 3.4) + HOLD, 0))}초</small>
          </button>
        )}
        {cc && (
          <p className="movie-caption" aria-live="polite" key={`${si}-${beat}`}>
            {current.text}
            <Cites keys={current.cite} />
          </p>
        )}
        {!started && resume > 0 && resume <= last && resume !== si && (
          <button type="button" className="movie-resume" onClick={() => goScene(resume)}>
            ↺ 지난번 본 {resume + 1}. {scenes[resume].title}부터 이어 보기
          </button>
        )}
      </div>

      <div className="movie-bar" role="group" aria-label="장면">
        {scenes.map((s, i) => {
          const len = s.beats.length * (art[s.id].beat ?? 3.4)
          const fill = i < si ? 1 : i > si ? 0 : Math.min(1, elapsed / len)
          return (
            <button key={s.id} type="button" className={`movie-seg${i === si ? ' on' : ''}`} style={{ flexGrow: s.beats.length }} onClick={() => goScene(i)} title={`${i + 1}. ${s.title}`}>
              <span style={{ transform: `scaleX(${fill})` }} />
            </button>
          )
        })}
      </div>

      {!compact && <Chapters id={id} onOpenProcess={onOpenProcess} chapters={chapters} />}

      <div className="movie-controls">
        <button type="button" onClick={() => (beat > 0 ? goBeat(0) : goScene(si - 1))} aria-label="이전 장면" title="이전 장면 (←)">
          ⏮
        </button>
        <button type="button" className="primary movie-play" onClick={toggle} aria-label={ended ? '처음부터' : playing ? '일시정지' : '재생'} title="재생/일시정지 (스페이스)">
          {ended ? '↻' : playing ? '⏸' : '▶'}
        </button>
        <button type="button" onClick={() => goScene(si + 1)} aria-label="다음 장면" title="다음 장면 (→)" disabled={si === last}>
          ⏭
        </button>
        <span className="movie-count muted">
          문장 {doneBefore + beat + 1}/{total}
        </span>
        <span className="movie-spacer" />
        <label className="movie-speed">
          <span className="muted">속도</span>
          <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
            {SPEEDS.map((s) => (
              <option key={s} value={s}>
                {s}×
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={() => setLoop((v) => !v)} aria-pressed={loop} className={loop ? 'on' : ''} title="지금 장면만 반복 (구간 반복)">
          🔁 장면 반복
        </button>
        <button type="button" onClick={() => setCc((v) => !v)} aria-pressed={cc} className={cc ? 'on' : ''} title="화면 자막 켜기/끄기">
          CC
        </button>
        <button type="button" onClick={() => setShowAll((v) => !v)} aria-pressed={showAll} title="자막 전체 보기">
          ☰ 자막
        </button>
        <button type="button" onClick={fullscreen} aria-label="전체 화면" title="전체 화면">
          ⛶
        </button>
      </div>

      {legend.length > 0 && (
        <ul className="movie-legend" aria-label="그림 색 설명">
          {legend.map((m) => (
            <li key={m}>
              <svg viewBox="0 0 12 12" aria-hidden="true">
                <rect width="12" height="12" rx="2" className={MAT[m].cls} />
              </svg>
              {MAT[m].label}
            </li>
          ))}
        </ul>
      )}

      {showAll && (
        <ol className="movie-script">
          {scenes.map((s, i) => (
            <li key={s.id}>
              <button type="button" className="link" onClick={() => goScene(i)}>
                <strong>
                  {i + 1}. {s.title}
                </strong>
              </button>
              <ul>
                {s.beats.map((b, j) => (
                  <li key={j} className={i === si && j === beat ? 'now' : ''}>
                    {b.text}
                    <Cites keys={b.cite} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
      <p className="movie-note muted">그림은 이 앱에서 직접 그린 교육용 그림입니다(실제 크기·비율과 다를 수 있음). 자막의 출처 이름을 누르면 원문이 열립니다.</p>
    </section>
  )
}

// 장면 그림. 장면이 바뀔 때만 다시 그립니다(재생 중 시계가 돌 때는 그대로 둠).
const SceneArt = memo(function SceneArt({ drawing, beatLen }) {
  return <g className="movie-scene">{drawing.draw((i) => i * beatLen)}</g>
})

// 그림에서 오류가 나도 페이지 전체가 꺼지지 않고 이 상자 안에만 안내를 보여 줍니다.
export class MovieBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error) {
    console.error('공정 애니메이션 오류:', error)
  }
  render() {
    if (this.state.error)
      return (
        <p className="notice movie-error">
          애니메이션을 보여 주다가 문제가 생겼습니다. 아래 설명은 그대로 볼 수 있습니다.{' '}
          <button type="button" className="link" onClick={() => this.setState({ error: null })}>
            다시 시도
          </button>
        </p>
      )
    return this.props.children
  }
}

// 문장 끝의 출처 표시: 출처 이름(짧게)을 누르면 원문이 열립니다.
export function Cites({ keys = [] }) {
  if (!keys.length) return <span className="cite none">출처 확인 중</span>
  return (
    <span className="cites">
      {keys.map((key) => {
        const s = findSource(key)
        if (!s) return null
        return (
          <a key={key} className={`cite ${s.tier}`} href={s.url} target="_blank" rel="noreferrer" title={`${s.title} · ${s.publisher}${s.tier === 'explain' ? ' · 설명 출처' : ' · 근거 출처'}`}>
            {s.short}
          </a>
        )
      })}
    </span>
  )
}
