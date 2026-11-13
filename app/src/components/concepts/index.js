// 개념 그림 모음. 키는 data/concepts.js의 그림 id입니다. 그림 컴포넌트는 { animate }를 받아 viewBox 0 0 320 180 svg를 그립니다.
import { DryWet, OxideRoles } from './oxidation.jsx'

export const CONCEPT_DRAWINGS = {
  'oxide-roles': OxideRoles,
  'dry-wet': DryWet,
}
