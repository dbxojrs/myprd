// 장비 입체 그림(ISO)과 결과물 그림(RESULT). 키는 장비 id입니다.
//   ISO: { focus, lot, step, onPick, tags } → viewBox 0 0 400 290 svg. 부위 id는 data/equipment의 modules·operation과 같습니다.
//   RESULT: { values, result } → viewBox 0 0 400 240 svg. 지금 조건으로 만든 결과물을 확대해 보여줍니다.
import OxidationIso from './OxidationIso.jsx'
import OxidationResult from './OxidationResult.jsx'
import PhotoIso from './PhotoIso.jsx'
import PhotoResult from './PhotoResult.jsx'
import EtchIso from './EtchIso.jsx'
import EtchResult from './EtchResult.jsx'
import CvdIso from './CvdIso.jsx'
import CvdResult from './CvdResult.jsx'
import ImplantIso from './ImplantIso.jsx'
import ImplantResult from './ImplantResult.jsx'
import PvdIso from './PvdIso.jsx'
import PvdResult from './PvdResult.jsx'
import GrinderIso from './GrinderIso.jsx'
import GrinderResult from './GrinderResult.jsx'
import SawIso from './SawIso.jsx'
import SawResult from './SawResult.jsx'
import DieBonderIso from './DieBonderIso.jsx'
import DieBonderResult from './DieBonderResult.jsx'
import WireBonderIso from './WireBonderIso.jsx'
import WireBonderResult from './WireBonderResult.jsx'
import MoldingIso from './MoldingIso.jsx'
import MoldingResult from './MoldingResult.jsx'
import MarkerIso from './MarkerIso.jsx'
import MarkingResult from './MarkingResult.jsx'
import PkgSawIso from './PkgSawIso.jsx'
import PkgSawResult from './PkgSawResult.jsx'
import TestIso from './TestIso.jsx'
import TestResult from './TestResult.jsx'

export const ISO = {
  oxidation: OxidationIso,
  photo: PhotoIso,
  etch: EtchIso,
  deposition: CvdIso,
  'ion-implant': ImplantIso,
  metallization: PvdIso,
  backgrind: GrinderIso,
  'wafer-saw': SawIso,
  'die-attach': DieBonderIso,
  'wire-bond': WireBonderIso,
  molding: MoldingIso,
  marking: MarkerIso,
  'package-saw': PkgSawIso,
  test: TestIso,
}

export const RESULT = {
  oxidation: OxidationResult,
  photo: PhotoResult,
  etch: EtchResult,
  deposition: CvdResult,
  'ion-implant': ImplantResult,
  metallization: PvdResult,
  backgrind: GrinderResult,
  'wafer-saw': SawResult,
  'die-attach': DieBonderResult,
  'wire-bond': WireBonderResult,
  molding: MoldingResult,
  marking: MarkingResult,
  'package-saw': PkgSawResult,
  test: TestResult,
}
