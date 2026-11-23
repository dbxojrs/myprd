// 첨단 패키지 영상 자막. 문장마다 출처 키. 그림: components/movie/scenes/adv-3d.jsx (검수 전)
export default {
  id: 'adv-3d',
  title: '3D 적층과 HBM: 칩을 위로 쌓기',
  reviewed: false,
  scenes: [
    {
      id: 'stack',
      title: '쌓고 뚫어서 잇기',
      beats: [
        { text: 'HBM은 맨 아래 받침 칩 위에 DRAM 칩 여러 장을 쌓아 만듭니다.', cite: ['hynix-be-4', 'hynix-hbm-packaging'] },
        { text: '칩마다 뚫은 관통 전극(TSV)으로 위아래 칩을 바로 이어, 와이어로 쌓을 때보다 통로가 훨씬 많습니다.', cite: ['samsung-tsv-12h', 'hynix-be-4'] },
        { text: '예를 들어 HBM은 데이터 통로가 1,024개로, 와이어로 쌓은 칩(32개)보다 훨씬 넓습니다.', cite: ['hynix-be-4'] },
      ],
    },
    {
      id: 'fill',
      title: '칩 사이 메우기',
      beats: [
        { text: '쌓을 때마다 칩 사이에 필름(NCF)을 깔고 붙이거나, 다 쌓은 뒤 액체 보호재를 한 번에 넣어 굳히는 방식(MR-MUF)이 있습니다.', cite: ['hynix-be-10', 'hynix-hbm-packaging'] },
        { text: 'MR-MUF는 필름 방식보다 효율과 열 방출이 좋다고 소개됩니다.', cite: ['hynix-hbm-packaging'] },
      ],
    },
  ],
}
