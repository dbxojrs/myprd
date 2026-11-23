// 패키지 쏘잉(싱귤레이션) 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/package-saw.jsx (검수 전)
export default {
  id: 'package-saw',
  title: '패키지 쏘잉: 판을 잘라 패키지 하나하나로',
  reviewed: false,
  scenes: [
    {
      id: 'strip',
      title: '여러 패키지가 한 판에',
      beats: [
        { text: 'QFN 같은 패키지는 여러 개를 한 판(스트립)에서 함께 만들고, 몰딩이 끝나면 잘라서 나눕니다.', cite: ['adt-qfn-singulation', 'disco-qfn'] },
        { text: '이렇게 하나씩 떼어 내는 일을 싱귤레이션이라고 합니다.', cite: ['adt-qfn-singulation'] },
      ],
    },
    {
      id: 'cut',
      title: '블레이드로 자르기',
      beats: [
        { text: '공정이 끝난 스트립을 블레이드로 패키지 사이의 길을 따라 한 줄씩 자릅니다.', cite: ['hynix-be-6', 'disco-qfn'] },
        { text: '실리콘만 자르는 웨이퍼 쏘잉과 달리, 단단한 몰딩 수지와 무른 구리 리드를 함께 잘라야 합니다.', cite: ['adt-qfn-singulation', 'disco-qfn'] },
        { text: '나뉜 패키지는 트레이에 담겨 테스트로 넘어갑니다.', cite: ['hynix-be-6'] },
      ],
    },
    {
      id: 'burr',
      title: '자른 면의 버',
      beats: [
        { text: '구리 리드를 자를 때 금속이 늘어나 거스러미(버)가 남을 수 있습니다.', cite: ['disco-qfn', 'adt-qfn-singulation'] },
        { text: '버가 크면 기판에 붙일 때 옆 단자와 닿을 수 있어, 블레이드 종류와 자르는 조건을 맞춥니다.', cite: ['adt-qfn-singulation'] },
      ],
    },
  ],
}
