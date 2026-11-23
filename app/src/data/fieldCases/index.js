// 현장 실무 훈련 시나리오 목록. 이 폴더에 시나리오 파일(.js, export default)을 추가하면 자동으로 목록에 나옵니다.
// FAB/PKG는 같은 엔진(lib/fieldSim.js)과 같은 데이터 구조를 쓰고 category로만 나눕니다.
import { PLANNED_CASES } from './planned.js'

const modules = import.meta.glob('./*.js', { eager: true })
export const FIELD_CASES = Object.values(modules)
  .map((m) => m.default)
  .filter(Boolean)
  .sort((a, b) => a.id.localeCompare(b.id))

export { PLANNED_CASES }

// 공정 분류(필터용)
export const FIELD_PROCESSES = {
  FAB: ['Photolithography', 'Etching', 'CVD', 'PVD', 'Thermal Oxidation', 'Ion Implantation', 'CMP', 'Cleaning', 'Metrology'],
  PKG: ['Wafer Back Grinding', 'Wafer Dicing', 'Die Attach', 'Wire Bonding', 'Flip Chip Bonding', 'Molding', 'Singulation', 'Final Test', 'Reliability Test'],
}
export const DIFFICULTIES = ['초급', '중급', '고급']

// 예전 id(legacyIds)로도 찾습니다(저장된 기록·링크 호환).
export const findFieldCase = (id) => FIELD_CASES.find((c) => c.id === id || c.legacyIds?.includes(id))
export const fieldCasesFor = (processId) => FIELD_CASES.filter((c) => c.process === processId)
