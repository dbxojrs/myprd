// 장비 입체 그림(ISO)과 결과물 그림(RESULT). 키는 장비 id입니다.
//   ISO: { focus, lot, step, onPick, tags } → viewBox 0 0 400 290 svg. 부위 id는 data/equipment의 modules·operation과 같습니다.
//   RESULT: { values, result } → viewBox 0 0 400 240 svg. 지금 조건으로 만든 결과물을 확대해 보여줍니다.
import OxidationIso from './OxidationIso.jsx'
import OxidationResult from './OxidationResult.jsx'

export const ISO = {
  oxidation: OxidationIso,
}

export const RESULT = {
  oxidation: OxidationResult,
}
