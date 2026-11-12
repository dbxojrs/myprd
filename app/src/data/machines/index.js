// 고급 장비 시뮬레이터에 넣을 장비. 순서는 전체 공정 순서(전공정 → 후공정)입니다.
import backgrind from './backgrind.js'
import waferSaw from './waferSaw.js'
import dieAttach from './dieAttach.js'
import wireBond from './wireBond.js'
import molding from './molding.js'

export default [backgrind, waferSaw, dieAttach, wireBond, molding]
