// 포토 공정 애니메이션 자막. 문장마다 출처 키(data/sourceCatalog.js). 그림: components/movie/scenes/photo.jsx (검수 전)
export default {
  id: 'photo',
  title: '포토 공정: 빛으로 회로 무늬를 옮겨 그리기',
  reviewed: false,
  scenes: [
    {
      id: 'coat',
      title: '감광액 바르기',
      beats: [
        { text: '포토 공정은 웨이퍼 위에 회로 모양을 빛으로 그려 넣는 공정입니다. 먼저 산화막이 덮인 웨이퍼를 준비합니다.', cite: ['samsung-8-4'] },
        { text: '웨이퍼를 빠르게 돌리면서 빛에 반응하는 감광액(PR)을 얇고 고르게 바릅니다.', cite: ['samsung-8-4', 'hynix-fe-3'] },
        { text: '가장자리에 남은 감광액을 걷어 내고, 살짝 구워 막을 단단하게 만듭니다.', cite: ['hynix-fe-3'] },
      ],
    },
    {
      id: 'expose',
      title: '마스크를 대고 빛 쬐기 (노광)',
      beats: [
        { text: '회로 무늬가 그려진 마스크를 웨이퍼 위에 맞춥니다. 마스크는 석영 판 위에 크롬으로 회로를 그린 것입니다.', cite: ['samsung-8-4'] },
        { text: '노광 장비가 마스크를 통해 빛을 비추면, 마스크의 뚫린 곳을 지난 빛만 감광액에 닿습니다.', cite: ['samsung-8-4', 'hynix-fe-3'] },
        { text: '빛을 받은 감광액은 성질이 바뀝니다. 장비는 칩 크기만큼 찍고 옆으로 옮겨 가며 웨이퍼 전체를 찍습니다.', cite: ['hynix-fe-3'] },
      ],
    },
    {
      id: 'develop',
      title: '현상: 무늬 드러내기',
      beats: [
        { text: '현상액을 뿌리면 감광액에서 성질이 바뀐 부분이 녹아 나갑니다.', cite: ['samsung-8-4', 'hynix-fe-3'] },
        { text: '양성(포지티브) 감광액은 빛 받은 부분이 없어지고, 음성(네거티브) 감광액은 반대로 빛 받은 부분이 남습니다.', cite: ['samsung-8-4', 'hynix-fe-3'] },
        { text: '남은 감광액이 회로 무늬입니다. 검사 장비로 무늬가 제대로 그려졌는지 확인하고, 통과한 웨이퍼만 다음 공정으로 보냅니다.', cite: ['samsung-8-4'] },
      ],
    },
    {
      id: 'result',
      title: '다음 공정으로',
      beats: [
        { text: '남은 감광액은 다음 식각 공정에서 아래 막을 지키는 덮개가 됩니다.', cite: ['samsung-8-5', 'hynix-fe-4'] },
        { text: '덮이지 않은 곳만 깎여 나가면서, 감광액의 무늬가 아래 막으로 옮겨집니다.', cite: ['samsung-8-5', 'hynix-fe-4'] },
      ],
    },
  ],
}
