import { VIEWS } from './machines/index.js'

// 고급 장비 시뮬레이터의 장비 그림 자리. 장비별 그림은 components/machines/에 있습니다.
// 그림은 조작반의 조건에 따라 모양과 움직임 속도가 바뀝니다.
// running이면 CSS 애니메이션으로 움직이고, 결과가 나오면 문제가 생긴 부위를 빨간색으로 표시합니다.

export default function MachineView({ machine, values, running, findings }) {
  const View = VIEWS[machine.id]
  return View ? <View values={values} running={running} findings={findings} /> : null
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
