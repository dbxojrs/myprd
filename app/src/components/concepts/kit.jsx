import { Anim, Move, Visible } from '../illustrationKit.jsx'

// 개념 그림 도우미. animate가 false면 SMIL 없이 "다 끝난 모습"만 그립니다.
//   Phase: from~to 동안만 보이는 묶음. 멈춘 그림에서는 final이 붙은 묶음만 보입니다.
//   A: animate일 때만 <Anim>을 넣습니다. M: animate일 때만 <Move>를 넣습니다.
export const Phase = ({ animate, from, to, dur, final = false, children }) =>
  animate ? (
    <Visible from={from} to={to} dur={dur}>
      {children}
    </Visible>
  ) : final ? (
    <g>{children}</g>
  ) : null

export const A = ({ animate, ...props }) => (animate ? <Anim {...props} /> : null)
export const M = ({ animate, ...props }) => (animate ? <Move {...props} /> : null)

export const T = ({ x, y, children, cls = 'cf-a-label', anchor = 'middle' }) => (
  <text x={x} y={y} textAnchor={anchor} className={cls}>
    {children}
  </text>
)
