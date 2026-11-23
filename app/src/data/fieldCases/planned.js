// 설계 중인 시나리오(아직 진행할 수 없음). 목록에 "설계 샘플 · 준비 중"으로만 보여 줍니다.
// 수치와 원인 구조는 출처를 확인한 뒤 정의합니다. 같은 주제를 먼저 연습할 수 있는 서술형 사례(cases)가 있으면 이어 줍니다.
export const PLANNED_CASES = [
  { id: 'FAB-001', category: 'FAB', processLabel: 'CVD', process: 'deposition', title: 'CVD 증착막 두께 불균일', summary: '같은 조건인데 웨이퍼별 막 두께 편차가 커졌습니다. 챔버 상태·가스 유량·온도·압력을 조사하고 두께 데이터를 분석합니다.', difficulty: '중급' },
  { id: 'FAB-002', category: 'FAB', processLabel: 'Etching', process: 'etch', title: 'Etching 공정 잔류물 증가', summary: '식각 후 특정 위치에 잔류물이 늘었습니다. 공정 조건·챔버 상태·검사 데이터로 개선 방향을 판단합니다.', difficulty: '중급' },
  { id: 'FAB-003', category: 'FAB', processLabel: 'Photolithography', process: 'photo', title: 'Photolithography Overlay 불량', summary: '정렬 오차가 커졌습니다. 계측 결과와 장비 상태를 보고 재작업 가능성과 영향 범위를 판단합니다.', difficulty: '고급' },
  { id: 'PKG-002', category: 'PKG', processLabel: 'Die Attach', process: 'die-attach', title: 'Die Attach Void 증가', summary: 'Die Attach 뒤 보이드가 늘었습니다. 자재·공정 조건·검사 결과로 원인을 검증합니다.', difficulty: '중급', practice: 'da-void' },
  { id: 'PKG-003', category: 'PKG', processLabel: 'Molding', process: 'molding', title: 'Molding 공정 Delamination', summary: '패키지 계면 박리가 생겼습니다. 소재·수분·공정 조건·검사 결과를 비교해 원인과 개선 조치를 정합니다.', difficulty: '고급', practice: 'mold-void' },
  { id: 'PKG-004', category: 'PKG', processLabel: 'Final Test', process: 'test', title: 'Final Test 수율 급락', summary: '특정 LOT·장비에서 테스트 불량이 늘었습니다. 테스트 환경 문제와 제품 불량을 구분하고 영향 범위를 판단합니다.', difficulty: '고급', practice: 'ft-yield' },
]
