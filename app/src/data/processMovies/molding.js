// 몰딩 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/molding.jsx (검수 전)
export default {
  id: 'molding',
  title: '몰딩: 칩을 수지로 감싸 보호하기',
  reviewed: false,
  scenes: [
    {
      id: 'load',
      title: '금형에 넣기',
      beats: [
        { text: '몰딩은 칩과 와이어를 수지로 감싸 열·습기·충격 같은 바깥 환경으로부터 지키고, 패키지 모양을 만드는 공정입니다.', cite: ['samsung-8-9'] },
        { text: '와이어 본딩이 끝난 스트립과 수지 덩어리(EMC 태블릿)를 금형 사이에 넣고 닫습니다.', cite: ['hynix-be-6'] },
      ],
    },
    {
      id: 'fill',
      title: '녹은 수지 밀어 넣기',
      beats: [
        { text: '열과 압력을 가하면 녹은 수지(EMC)가 흘러 금형 속 빈 공간을 채웁니다(트랜스퍼 몰딩).', cite: ['hynix-be-6', 'samsung-8-9-2013'] },
        { text: '수지가 흐르는 힘에 가는 와이어가 밀려 휘는 현상을 와이어 스윕이라고 합니다.', cite: ['kspe-1996-wire-sweep'] },
        { text: '흐르는 길(런너)의 균형과 밀어 넣는 속도를 조절하면 와이어 스윕을 줄일 수 있습니다.', cite: ['kspe-1996-wire-sweep'] },
      ],
    },
    {
      id: 'cure',
      title: '굳히고 꺼내기',
      beats: [
        { text: '수지가 금형 안에서 굳으면 꺼냅니다. 칩은 이제 검은 수지 속에 들어 있습니다.', cite: ['samsung-8-9'] },
        { text: 'EMC는 에폭시 수지에 실리카 가루를 섞은 재료로, 열을 받으면 단단한 그물 구조로 굳습니다.', cite: ['hynix-be-9', 'hynix-be-6'] },
      ],
    },
  ],
}
