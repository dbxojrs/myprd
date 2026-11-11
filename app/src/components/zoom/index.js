// 확대 스토리 장면 그림. 키는 공정 id, 값은 { 장면 id: 장면 그림 }입니다.
import backgrind from './backgrind.jsx'
import waferSaw from './waferSaw.jsx'
import dieAttach from './dieAttach.jsx'
import wireBond from './wireBond.jsx'
import molding from './molding.jsx'

export const zoomScenes = {
  backgrind,
  'wafer-saw': waferSaw,
  'die-attach': dieAttach,
  'wire-bond': wireBond,
  molding,
}
