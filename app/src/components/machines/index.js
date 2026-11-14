// 장비 그림. 키는 data/machines의 장비 id입니다.
// 그림 컴포넌트는 { values, running, findings }를 받아 viewBox 0 0 240 140 svg를 그립니다.
import OxidationView from './OxidationView.jsx'
import PhotoView from './PhotoView.jsx'
import EtchView from './EtchView.jsx'
import CvdView from './CvdView.jsx'
import ImplantView from './ImplantView.jsx'
import PvdView from './PvdView.jsx'
import GrinderView from './GrinderView.jsx'
import SawView from './SawView.jsx'
import DieBonderView from './DieBonderView.jsx'
import BonderView from './BonderView.jsx'
import MoldView from './MoldView.jsx'
import MarkerView from './MarkerView.jsx'
import PkgSawView from './PkgSawView.jsx'
import TestView from './TestView.jsx'

export const VIEWS = {
  'oxidation': OxidationView,
  'photo': PhotoView,
  'etch': EtchView,
  'deposition': CvdView,
  'ion-implant': ImplantView,
  'metallization': PvdView,
  'backgrind': GrinderView,
  'wafer-saw': SawView,
  'die-attach': DieBonderView,
  'wire-bond': BonderView,
  'molding': MoldView,
  'marking': MarkerView,
  'package-saw': PkgSawView,
  'test': TestView,
}
