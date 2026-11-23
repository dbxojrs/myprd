// 패키징 영상 강의 1: 전체 모습과 재료. 문장마다 출처 키. 그림: components/movie/scenes/pkg-overview.jsx (검수 전)
export default {
  id: 'pkg-overview',
  title: '패키징 한눈에 보기: 무엇으로, 어떤 순서로',
  reviewed: false,
  scenes: [
    {
      id: 'whole',
      title: '완성된 패키지 들여다보기',
      beats: [
        { text: '패키지는 칩이 바깥과 전기 신호를 주고받게 하고, 열·습기·충격 같은 바깥 환경으로부터 칩을 보호합니다.', cite: ['samsung-8-9'] },
        { text: '속을 열어 보면 칩, 칩과 바깥을 잇는 가는 금속선, 칩을 받치는 기판, 전체를 감싼 수지(EMC), 바깥 단자인 솔더볼이 있습니다.', cite: ['samsung-8-9', 'hynix-be-9', 'hynix-be-6'] },
        { text: '패키지가 하는 일은 기계적 보호, 전기적 연결, 기계적 연결, 열 방출 네 가지로 정리됩니다.', cite: ['hynix-be-2'] },
      ],
    },
    {
      id: 'materials',
      title: '무엇으로 만드나',
      beats: [
        { text: '와이어는 주로 금을 쓰며, 값이 싼 구리나 팔라듐을 입힌 구리도 씁니다.', cite: ['hynix-be-9', 'samsung-8-9'] },
        { text: '칩은 에폭시 접착제나 접착 필름(DAF)으로 붙이고, 에폭시에 실리카를 섞은 EMC로 감쌉니다.', cite: ['hynix-be-9', 'hynix-be-6'] },
        { text: '칩을 받치는 바탕은 리드프레임이나 기판이며, 기판형 패키지(BGA)는 무연 솔더볼을 바깥 단자로 씁니다.', cite: ['hynix-be-9', 'hynix-be-3', 'samsung-8-9'] },
      ],
    },
    {
      id: 'flow',
      title: '어떤 순서로',
      beats: [
        { text: '웨이퍼 테스트를 마친 웨이퍼는 백그라인딩 → 쏘잉 → 다이 어태치 → 와이어 본딩 → 몰딩 → 마킹 → (볼 붙이기) → 패키지 쏘잉 순서로 조립됩니다.', cite: ['hynix-be-6'] },
        { text: '조립이 끝나면 패키지 테스트로 최종 불량을 걸러 냅니다. 다음 단원부터 한 단계씩 자세히 봅니다.', cite: ['samsung-8-9', 'hynix-be-1-test'] },
      ],
    },
  ],
}
