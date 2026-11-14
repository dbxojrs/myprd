// 움직이는 공정 그림(전공정·설계·연결·WLP·보드 실장 등). 키는 processes.js의 공정 id입니다.
// 그림 함수는 Illustrations.jsx의 공정 그림과 같은 모양 (compact, animate) => svg 내용 이고, viewBox는 0 0 120 80입니다.
// 여기 있는 그림이 Illustrations.jsx의 멈춘 그림보다 먼저 쓰입니다.

import front from './front.jsx'
import design from './design.jsx'
import middle from './middle.jsx'

const groups = [front, design, middle]

export const animDrawings = Object.assign({}, ...groups)
export const ANIM_IDS = Object.keys(animDrawings)
