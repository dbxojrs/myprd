import { VIEWS } from './machines/index.js'

// 고급 장비 시뮬레이터의 장비 그림 자리. 장비별 그림은 components/machines/에 있습니다.
// 그림은 조작반의 조건에 따라 모양과 움직임 속도가 바뀝니다.
// running이면 CSS 애니메이션으로 움직이고, 결과가 나오면 문제가 생긴 부위를 빨간색으로 표시합니다.
// stage: 지금 가동 단계(sequence id, 'start', 'done' 또는 대기 중 null). 그림은 단계마다 그 장면을 보여줍니다.
// 단계가 바뀔 때마다 그림을 다시 그려 CSS 애니메이션이 처음부터 시작되게 합니다(key).

export default function MachineView({ machine, values, running, findings, stage = null, stepMs = 1700 }) {
  const View = VIEWS[machine.id]
  if (!View) return null
  // 단계 설명 글은 장비 데이터(sequence.scene)에서 가져옵니다.
  const scene = stage && machine.sequence.find((step) => step.id === stage)?.scene
  return (
    <div
      className={`ms-stage-wrap${!running && stage && stage !== 'done' ? ' halt' : ''}`}
      style={{ '--step': `${stepMs}ms` }}
      data-stage={stage ?? 'idle'}
    >
      <View values={values} running={running} findings={findings} stage={stage} />
      {scene && <p className="ms-scene" aria-live="polite">{scene}</p>}
    </div>
  )
}

// 경광등: 초록(가동·정상), 노랑(경고·대기), 빨강(알람·불량)
export function TowerLamp({ status }) {
  const lit = {
    idle: ['', 'on', ''],
    running: ['', '', 'on'],
    alarm: ['blink', '', ''],
    bad: ['on', '', ''],
    warn: ['', 'on', ''],
    good: ['', '', 'on'],
  }[status]
  return (
    <span className="ms-lamp" aria-hidden="true">
      <span className={`ms-lamp-red ${lit[0]}`} />
      <span className={`ms-lamp-yellow ${lit[1]}`} />
      <span className={`ms-lamp-green ${lit[2]}`} />
    </span>
  )
}
