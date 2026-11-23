// 와이어 본딩 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/wire-bond.jsx (검수 전)
export default {
  id: 'wire-bond',
  title: '와이어 본딩: 가는 금속선으로 칩과 바깥을 잇기',
  reviewed: false,
  scenes: [
    {
      id: 'ball',
      title: '볼 만들고 패드에 붙이기',
      beats: [
        { text: '와이어 본딩은 아주 가는 금속선으로 칩의 패드와 바깥 단자(리드)를 잇는 공정입니다.', cite: ['samsung-8-9'] },
        { text: '가는 관(캐필러리) 끝으로 나온 와이어 끝을 녹여 작은 공(볼)을 만듭니다.', cite: ['tpt-wire-bonding-basics'] },
        { text: '볼을 칩의 패드에 누르면서 열과 초음파 진동을 함께 주어 붙입니다(열초음파 본딩).', cite: ['tpt-wire-bonding-basics'] },
      ],
    },
    {
      id: 'loop',
      title: '고리 그리며 리드로',
      beats: [
        { text: '캐필러리가 와이어를 풀며 올라갔다가 리드 쪽으로 움직여 고리(루프) 모양을 만듭니다.', cite: ['tpt-wire-bonding-basics'] },
        { text: '리드 위에서는 볼 없이 와이어를 눌러 비벼 붙입니다(스티치 본드).', cite: ['tpt-wire-bonding-basics'] },
        { text: '와이어를 끊고 남은 끝으로 다음 볼을 만들어 같은 일을 되풀이합니다.', cite: ['tpt-wire-bonding-basics'] },
      ],
    },
    {
      id: 'many',
      title: '패드마다 한 가닥씩',
      beats: [
        { text: '칩 둘레의 패드마다 와이어를 하나씩 이어 칩과 바깥을 전기로 연결합니다.', cite: ['samsung-8-9'] },
        { text: '와이어 대신 칩에 작은 범프를 만들어 뒤집어 붙이는 플립칩 방식도 있습니다. 저항이 작고 빠르며 작게 만들 수 있습니다.', cite: ['samsung-8-9'] },
      ],
    },
  ],
}
