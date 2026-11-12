// 장비 그림. 키는 data/machines의 장비 id입니다.
// 그림 컴포넌트는 { values, running, findings }를 받아 viewBox 0 0 240 140 svg를 그립니다.
import GrinderView from './GrinderView.jsx'
import SawView from './SawView.jsx'
import DieBonderView from './DieBonderView.jsx'
import BonderView from './BonderView.jsx'
import MoldView from './MoldView.jsx'

export const VIEWS = {
  'backgrind': GrinderView,
  'wafer-saw': SawView,
  'die-attach': DieBonderView,
  'wire-bond': BonderView,
  'molding': MoldView,
}
