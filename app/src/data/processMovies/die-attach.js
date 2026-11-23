// 다이 어태치 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/die-attach.jsx (검수 전)
export default {
  id: 'die-attach',
  title: '다이 어태치: 칩을 기판 위에 붙이기',
  reviewed: false,
  scenes: [
    {
      id: 'pick',
      title: '칩 집어 올리기',
      beats: [
        { text: '잘린 칩을 리드프레임이나 기판(PCB) 위에 붙이는 공정입니다.', cite: ['samsung-8-9'] },
        { text: '자외선을 쬐면 테이프의 접착력이 약해져 칩을 떼어 내기 쉬워집니다. 웨이퍼 테스트를 통과한 칩만 떼어 냅니다.', cite: ['hynix-be-6', 'hynix-be-9'] },
        { text: '테이프 아래에서 칩을 밀어 올리고, 위에서 하나씩 집어(pick) 붙일 자리로 옮깁니다.', cite: ['hynix-be-6'] },
      ],
    },
    {
      id: 'place',
      title: '접착제 위에 내려놓기',
      beats: [
        { text: '붙일 자리에 접착제(에폭시 페이스트)를 바르거나, 웨이퍼 뒷면에 미리 붙여 함께 잘린 접착 필름(DAF)을 씁니다.', cite: ['hynix-be-9', 'kmeps-2025-daf'] },
        { text: '액체 접착제는 주사기 같은 디스펜서로 짜거나 스텐실로 인쇄해 바르고, 그 위에 칩을 내려놓습니다.', cite: ['hynix-be-6'] },
        { text: '접착제는 잘 붙고, 습기를 덜 먹고, 고르게 퍼지며, 빈틈이 생기지 않아야 합니다.', cite: ['hynix-be-9'] },
      ],
    },
    {
      id: 'cure',
      title: '굳히기',
      beats: [
        { text: '열을 가해 접착제를 단단하게 굳힙니다.', cite: ['kmeps-2025-daf'] },
        { text: '접착층 속에 빈틈(보이드)이 생기면 열이 잘 빠지지 않고 붙는 힘이 약해집니다.', cite: ['kmeps-2025-daf'] },
      ],
    },
  ],
}
