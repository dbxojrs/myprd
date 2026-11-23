// TSV 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/tsv.jsx (검수 전)
export default {
  id: 'tsv',
  title: 'TSV: 칩을 뚫어 위아래로 잇기',
  reviewed: false,
  scenes: [
    {
      id: 'stack',
      title: '와이어 적층과 TSV 적층',
      beats: [
        { text: '칩을 여러 장 쌓을 때 예전에는 각 칩을 와이어로 기판에 이었습니다.', cite: ['hynix-be-4'] },
        { text: 'TSV는 칩에 아주 작은 구멍을 뚫고 전극을 채워, 위아래 칩을 수직으로 바로 연결합니다.', cite: ['samsung-tsv-12h', 'hynix-be-4'] },
        { text: '연결 통로가 훨씬 많아집니다. 예를 들어 HBM은 데이터 통로가 1,024개로, 와이어 적층(32개)보다 훨씬 넓습니다.', cite: ['hynix-be-4'] },
      ],
    },
    {
      id: 'via',
      title: 'TSV 만들기',
      beats: [
        { text: '실리콘에 깊은 구멍을 식각합니다.', cite: ['hynix-be-8'] },
        { text: '구멍 안에 절연막과 배리어 막을 입히고 구리를 도금해 채운 뒤, 표면을 평평하게 깎습니다(CMP).', cite: ['hynix-be-8'] },
        { text: '받침 웨이퍼에 붙여 뒷면을 얇게 갈아 구리 끝을 드러내고, 뒷면 범프를 만든 뒤 받침을 떼어 냅니다.', cite: ['hynix-be-8', 'samsung-pkg-engineer'] },
      ],
    },
  ],
}
