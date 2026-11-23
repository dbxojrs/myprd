// 패키징 영상 강의 1: 전체 모습과 재료 자세한 설명. 원문을 옮기지 않고 풀어 썼습니다. (검수 전)
export default {
  id: 'pkg-overview',
  reviewed: false,
  checked: '2026-11-23',
  analogy: null,
  easy: [
    { text: '패키지는 칩을 감싸 지키고 바깥과 이어 주는 집입니다.', cite: ['samsung-8-9'] },
    { text: '칩·와이어·접착제·수지(EMC)·기판·솔더볼로 이루어집니다.', cite: ['samsung-8-9', 'hynix-be-9'] },
    { text: '자르고, 붙이고, 잇고, 감싸고, 검사하는 순서로 만듭니다.', cite: ['samsung-8-9', 'hynix-be-6'] },
  ],
  sections: [
    {
      heading: '패키지가 하는 일',
      points: [
        { text: '기계적 보호: 칩을 열·습기·화학 약품·진동·충격으로부터 지킵니다.', cite: ['hynix-be-2', 'samsung-8-9'] },
        { text: '전기적 연결: 칩이 바깥과 전기 신호를 주고받게 합니다.', cite: ['hynix-be-2', 'samsung-8-9'] },
        { text: '기계적 연결: 칩을 제품의 기판에 단단히 고정합니다.', cite: ['hynix-be-2'] },
        { text: '열 방출: 칩에서 나는 열을 밖으로 빼냅니다.', cite: ['hynix-be-2'] },
      ],
    },
    {
      heading: '재료',
      points: [
        { text: '와이어: 금은 잘 늘어나고 산화에 강하지만 비싸서, 구리·은 합금·팔라듐을 입힌 구리도 씁니다.', cite: ['hynix-be-9'] },
        { text: '접착제: 에폭시 같은 액체형과 DAF 같은 필름형이 있습니다.', cite: ['hynix-be-9'] },
        { text: 'EMC: 열로 굳는 에폭시 수지에 실리카를 섞은 재료로, 태블릿·가루·액체·필름 형태가 있습니다.', cite: ['hynix-be-9', 'hynix-be-6'] },
        { text: '솔더볼: 크기 30~760μm의 무연 솔더를 주로 씁니다.', cite: ['hynix-be-9'] },
        { text: '완성품은 테이프앤릴이나 트레이에 담아 보냅니다.', cite: ['hynix-be-9'] },
      ],
    },
    {
      heading: '패키지 종류',
      points: [
        { text: '리드프레임형(TSOP·QFP 등)과 기판형이 있고, 기판형 중 가장 흔한 것이 BGA입니다.', cite: ['hynix-be-3'] },
        { text: '웨이퍼를 자르기 전에 패키징하는 웨이퍼 레벨 패키지(WLCSP)도 있습니다.', cite: ['hynix-be-3', 'hynix-be-7'] },
      ],
    },
    {
      heading: '조립 순서',
      points: [
        { text: 'SK하이닉스는 기존 패키지 조립을 백그라인딩 → 웨이퍼 쏘잉 → 다이 어태치 → 와이어 본딩 → 몰딩 → 마킹 → 솔더볼 붙이기 → 싱귤레이션의 8단계로 설명합니다.', cite: ['hynix-be-6'] },
        { text: '패키지 테스트는 웨이퍼 테스트에 이은 두 번째 테스트로, 결과를 제조 공정에 되돌려 품질을 높입니다.', cite: ['samsung-8-9', 'hynix-be-1-test'] },
      ],
    },
  ],
  gaps: [
    '회사·제품마다 단계 순서(예: 마킹 위치)가 조금씩 다를 수 있습니다.',
  ],
}
