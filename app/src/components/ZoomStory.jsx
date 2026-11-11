import { useEffect, useRef, useState } from 'react'
import { zoomStories } from '../data/zoomStories/index.js'
import { zoomScenes } from './zoom/index.js'
import { Keys } from './zoom/kit.jsx'
import { prefersReducedMotion } from './Illustrations.jsx'

// "확대해서 보기": 장비 전체에서 시작해 한 부분씩 천천히 확대하며 원리를 설명합니다.
// 장면 설명(단계 이름·제목·설명 문장)은 data/zoomStories, 장면 그림은 components/zoom/에 같은 id로 있습니다.
// 장면 그림: { dur: 장면 길이(초), focus: [x, y, 너비, 높이] 다음 장면으로 확대할 곳(없으면 흐려지며 넘어감),
//             focusAt: 확대할 곳 표시가 나타나는 시각(초), draw: () => svg 내용 }
// 설명 문장(beats)은 장면 길이를 문장 수로 나눈 시각마다 하나씩 밝아집니다. 그림의 움직임도 그 시각에 맞춥니다.

const W = 200
const H = 120
const TICK = 0.1
const HOLD = 2.5 // 장면이 끝난 뒤 다음 장면으로 넘어가기 전 읽을 시간(초)

export const beatAt = (index, count, dur) => (index * dur) / count

const focusVars = ([x, y, w, h]) => ({
  '--ox': `${((x + w / 2) / W) * 100}%`,
  '--oy': `${((y + h / 2) / H) * 100}%`,
  '--k': Math.min(W / w, H / h),
})

// 확대할 곳 표시. 누르면 다음 장면으로 갑니다.
const FocusBox = ({ focus: [x, y, w, h], at, onClick }) => (
  <g className="zs-focus" opacity="0" onClick={onClick}>
    <Keys attr="opacity" keys={[[at, 0], [at + 0.6, 1]]} />
    <rect x={x} y={y} width={w} height={h} rx="1.5">
      <animate attributeName="stroke-dashoffset" values="0;-10" dur="1s" repeatCount="indefinite" />
    </rect>
    <text x={x + w / 2} y={y > 9 ? y - 2.5 : y + h + 7} textAnchor="middle" className="zs-note zs-focus-text">
      🔍 여기를 확대
    </text>
  </g>
)

export default function ZoomStory({ id }) {
  const story = zoomStories[id]
  const drawings = zoomScenes[id]
  if (!story || !drawings) return null
  return <Story story={story} drawings={drawings} />
}

function Story({ story, drawings }) {
  const { scenes } = story
  const last = scenes.length - 1
  const durOf = (i) => drawings[scenes[i].id].dur

  const [reduced] = useState(prefersReducedMotion)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(!reduced)
  const [elapsed, setElapsed] = useState(() => (reduced ? durOf(0) : 0))
  const [replay, setReplay] = useState(0)
  const [leaving, setLeaving] = useState(null) // { index, replay, dir }
  const svgRef = useRef(null)

  const scene = scenes[index]
  const drawing = drawings[scene.id]
  const end = drawing.dur + HOLD

  const go = (to) => {
    if (to === index || to < 0 || to > last) return
    setLeaving({ index, replay, dir: to > index ? 'fwd' : 'back' })
    setIndex(to)
    setElapsed(playing ? 0 : durOf(to))
  }

  const restartScene = () => {
    setLeaving(null)
    setReplay((n) => n + 1)
    setElapsed(0)
    setPlaying(true)
  }

  // 장면 시계
  useEffect(() => {
    if (!playing) return undefined
    const timer = setInterval(() => setElapsed((t) => Math.min(t + TICK, end)), TICK * 1000)
    return () => clearInterval(timer)
  }, [playing, end])

  // 장면이 끝나면 다음 장면으로
  useEffect(() => {
    if (playing && elapsed >= end && index < last) go(index + 1)
  })

  // 새 장면 svg의 움직임 시각을 장면 시계에 맞추고, 멈춤 상태면 멈춥니다.
  useEffect(() => {
    const svg = svgRef.current
    if (!svg?.setCurrentTime) return
    if (!playing) {
      svg.setCurrentTime(elapsed)
      svg.pauseAnimations()
    }
    // 장면이 바뀔 때만 맞춥니다.
  }, [index, replay]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const svg = svgRef.current
    if (!svg?.pauseAnimations) return
    if (playing) svg.unpauseAnimations()
    else svg.pauseAnimations()
  }, [playing])

  const togglePlay = () => {
    if (!playing && index === last && elapsed >= drawing.dur) {
      go(0)
      setElapsed(0)
    }
    setPlaying(!playing)
  }

  // 들어오고 나가는 장면의 확대·축소 방식
  let enterClass = 'zs-in-fade'
  let enterStyle
  let leaveClass = 'zs-out-fade'
  let leaveStyle
  if (leaving) {
    const leavingFocus = drawings[scenes[leaving.index].id].focus
    if (leaving.dir === 'fwd' && leavingFocus) {
      leaveClass = 'zs-out-zoom'
      leaveStyle = focusVars(leavingFocus)
      enterClass = 'zs-in-grow'
    } else if (leaving.dir === 'back' && drawing.focus) {
      leaveClass = 'zs-out-shrink'
      enterClass = 'zs-in-unzoom'
      enterStyle = focusVars(drawing.focus)
    }
  }

  const beats = scene.beats
  const shownBeats = beats.filter((_, i) => elapsed >= beatAt(i, beats.length, drawing.dur)).length
  const finished = index === last && elapsed >= drawing.dur

  const renderScene = (i, rep, props) => {
    const d = drawings[scenes[i].id]
    return (
      <svg
        key={`${i}-${rep}`}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={scenes[i].title}
        {...props}
      >
        {d.draw()}
        {d.focus && i < last && (
          <FocusBox focus={d.focus} at={d.focusAt ?? d.dur * 0.75} onClick={() => i === index && go(i + 1)} />
        )}
      </svg>
    )
  }

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') go(index + 1)
    else if (event.key === 'ArrowLeft') go(index - 1)
    else if (event.key === ' ') togglePlay()
    else return
    event.preventDefault()
  }

  return (
    <section className="zs" aria-label={`확대해서 보기: ${story.title}`}>
      <h4 className="zs-title">🔍 확대해서 보기 · {story.title}</h4>
      <ol className="zs-ladder">
        {scenes.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              className={`zs-rung${i === index ? ' active' : i < index ? ' done' : ''}`}
              aria-current={i === index ? 'step' : undefined}
              onClick={() => go(i)}
            >
              {s.level}
            </button>
          </li>
        ))}
      </ol>

      <div className="zs-stage" tabIndex={0} onKeyDown={onKeyDown} aria-label="← → 키로 장면 이동, 스페이스로 멈춤">
        {leaving &&
          renderScene(leaving.index, leaving.replay, {
            className: `zs-scene ${leaveClass}`,
            style: leaveStyle,
            'aria-hidden': true,
            onAnimationEnd: (event) => event.target === event.currentTarget && setLeaving(null),
          })}
        {renderScene(index, replay, { className: `zs-scene ${leaving ? enterClass : ''}`, style: enterStyle, ref: svgRef })}
        <span className="zs-level">
          {index + 1} / {scenes.length} · {scene.level}
        </span>
      </div>
      <div className="zs-progress" aria-hidden="true">
        <span style={{ width: `${Math.min(elapsed / drawing.dur, 1) * 100}%` }} />
      </div>

      <div className="zs-controls">
        <button type="button" onClick={() => go(index - 1)} disabled={index === 0}>
          ◀ 이전
        </button>
        <button type="button" className="primary" onClick={togglePlay}>
          {playing ? '⏸ 멈춤' : finished ? '↺ 처음부터' : '▶ 재생'}
        </button>
        <button type="button" onClick={restartScene}>
          ↺ 이 장면 다시
        </button>
        <button type="button" onClick={() => go(index + 1)} disabled={index === last}>
          다음 ▶
        </button>
      </div>

      <div className="zs-caption" aria-live="polite">
        <h5>{scene.title}</h5>
        <ol className="zs-beats">
          {beats.map((beat, i) => (
            <li key={beat} className={i < shownBeats ? (i === shownBeats - 1 ? 'shown current' : 'shown') : ''}>
              {beat}
            </li>
          ))}
        </ol>
      </div>
      <p className="muted zs-disclaimer">
        이해를 돕는 개념도입니다. 실제 크기 비율과 다르며, 설명은 검수 전 초안입니다.
      </p>
    </section>
  )
}
