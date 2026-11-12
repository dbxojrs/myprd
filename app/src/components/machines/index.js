// 장비 그림. 키는 data/machines의 장비 id입니다.
// 그림 컴포넌트는 { values, running, findings }를 받아 viewBox 0 0 240 140 svg를 그립니다.
import SawView from './SawView.jsx'
import BonderView from './BonderView.jsx'

export const VIEWS = {
  'wafer-saw': SawView,
  'wire-bond': BonderView,
}
