// 화면 메뉴. 위쪽 탭(영역)과 그 아래 세부 화면 버튼, 홈 화면의 카드가 함께 씁니다.
// 영역마다 화면을 따로 두어 전체 흐름·전공정·후공정 공부가 섞이지 않게 합니다. 버튼 이름은 현장 용어를 씁니다.
// stages: 공정 상세 화면(query)에서 이 영역 탭을 켤 공정 단계
export const MENU_GROUPS = [
  {
    id: 'overview',
    label: '전체 공정',
    en: 'Overview',
    icon: '🗺️',
    desc: '칩 설계부터 FAB, PKG·TEST, 보드 실장까지 반도체가 만들어지는 전체 흐름을 봅니다.',
    stages: ['design', 'link', 'board'],
    items: [
      { id: 'map', label: '전체 공정 흐름도', desc: '칩 설계 → 전공정(FAB) → 팹 아웃 → WLP → 후공정(PKG·TEST) → 보드 실장 순서를 한눈에 보고 단계별로 들어갑니다.' },
      { id: 'query', label: '공정 검색', desc: '공정 이름(한글·영문)으로 찾아 설명, 확대 그림, 선행 공정을 봅니다.' },
    ],
  },
  {
    id: 'fab',
    label: '전공정 (FAB)',
    en: 'Front-End',
    icon: '🏭',
    desc: '웨이퍼 위에 회로를 만드는 FAB 8대 공정과 FAB 설비를 공부합니다.',
    stages: ['front'],
    items: [
      { id: 'front', label: 'FAB 8대 공정', desc: '웨이퍼 제조 → 산화 → 포토 → 식각 → 증착·이온주입 → 금속 배선 → EDS를 차례로 봅니다.' },
      { id: 'machine-fab', label: 'FAB 설비 실습 (EQ)', desc: '확산로·스캐너·식각기·CVD·이온 주입기·PVD를 둘러보고, 레시피를 정해 가동해 알람·불량을 판정받습니다.' },
    ],
  },
  {
    id: 'pkg',
    label: '후공정 (PKG·TEST)',
    en: 'Back-End',
    icon: '📦',
    desc: '웨이퍼를 잘라 패키지로 만들고 테스트하는 PKG·TEST 공정과 설비를 공부합니다.',
    stages: ['mid', 'back'],
    items: [
      { id: 'package', label: '패키지 타입', desc: 'QFN·BGA·플립칩 등 패키지 타입별 구조와 쓰임을 보고 학습할 타입을 고릅니다.' },
      { id: 'flow', label: 'PKG 공정 흐름도', desc: '고른 패키지 타입의 후공정 순서를 봅니다.' },
      { id: 'sim', label: '단위 공정 시뮬레이션', desc: '단위 공정 하나의 조건을 바꿔 결과와 불량을 봅니다.' },
      { id: 'line', label: 'PKG 라인 시뮬레이션', desc: '첫 공정부터 끝까지 조건을 골라 완성된 패키지를 판정받습니다.' },
      { id: 'machine-pkg', label: 'PKG 설비 실습 (EQ)', desc: '그라인더·쏘·다이 본더·와이어 본더·몰드·마커·테스트 핸들러를 둘러보고 가동해 봅니다.' },
    ],
  },
  {
    id: 'exam',
    label: '시험',
    en: 'Quiz',
    icon: '📝',
    desc: '배운 내용을 문제로 확인하고 틀린 문제를 다시 풉니다.',
    stages: [],
    items: [
      { id: 'quiz', label: '문제 풀기', desc: '공정·설비 범위를 골라 연습하거나 시험을 봅니다. 해설과 관련 화면으로 바로 갑니다.' },
      { id: 'wrong', label: '오답 노트', desc: '틀린 문제만 모아 다시 풉니다. 맞히면 목록에서 빠집니다.' },
      { id: 'ai', label: 'AI 문제 만들기', desc: '내 Claude API 키로 고른 범위의 앱 자료에서 새 문제를 만들고, 문제마다 AI 해설을 듣습니다(선택).' },
    ],
  },
  {
    id: 'deep',
    label: '첨단 패키징',
    en: 'Advanced PKG',
    icon: '🚀',
    desc: '2.5D·3D·칩렛 같은 첨단 패키지와 앞으로의 기술을 봅니다.',
    stages: [],
    items: [{ id: 'advanced', label: 'Advanced PKG', desc: '2.5D, 3D, 칩렛 같은 첨단 패키지의 핵심 공정과 미래 기술을 봅니다.' }],
  },
]
