// 개념 그림 모음. 키는 data/concepts.js의 그림 id입니다. 그림 컴포넌트는 { animate }를 받아 viewBox 0 0 320 180 svg를 그립니다.
import { DryWet, OxideRoles } from './oxidation.jsx'
import { NpDoping, PvdCvd, ThinFilmStack } from './depo.jsx'
import { AlBarrier, MetalConditions } from './metal.jsx'
import { EdsFlow, WaferMapYield } from './eds.jsx'
import { PkgFlow, WbVsFlipchip } from './pkg.jsx'

export const CONCEPT_DRAWINGS = {
  'oxide-roles': OxideRoles,
  'dry-wet': DryWet,
  'thin-film-stack': ThinFilmStack,
  'pvd-cvd': PvdCvd,
  'n-p-doping': NpDoping,
  'metal-conditions': MetalConditions,
  'al-barrier': AlBarrier,
  'eds-flow': EdsFlow,
  'wafer-map-yield': WaferMapYield,
  'pkg-flow': PkgFlow,
  'wb-vs-flipchip': WbVsFlipchip,
}
