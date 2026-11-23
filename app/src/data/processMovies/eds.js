// EDS(웨이퍼 테스트) 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/eds.jsx (검수 전)
export default {
  id: 'eds',
  title: 'EDS: 웨이퍼 위의 칩을 하나하나 검사하기',
  reviewed: false,
  scenes: [
    {
      id: 'where',
      title: '언제 하는 검사인가',
      beats: [
        { text: 'EDS는 FAB 공정을 마친 뒤, 패키징 전에 웨이퍼 상태에서 칩 하나하나를 전기적으로 검사하는 단계입니다.', cite: ['samsung-8-8', 'hynix-be-1-test'] },
        { text: '칩이 출하되기까지 거치는 세 번의 테스트(웨이퍼·패키지·출하 전 품질) 중 첫 번째입니다.', cite: ['samsung-8-8'] },
      ],
    },
    {
      id: 'probe',
      title: '프로브 카드로 전기 신호 넣기',
      beats: [
        { text: '프로브 카드의 가는 바늘이 칩의 패드에 닿아, 테스터와 칩을 전기로 연결합니다.', cite: ['samsung-8-8', 'hynix-be-1-test'] },
        { text: '높은 온도와 낮은 온도에서도 검사합니다. 고온은 사양 최고 온도보다 10% 이상 높게, 상온은 보통 25℃에서 합니다.', cite: ['samsung-8-8', 'hynix-be-1-test'] },
        { text: '번인은 온도와 전압으로 스트레스를 주어, 초기에 고장 날 약한 칩을 미리 드러냅니다.', cite: ['samsung-8-8', 'hynix-be-1-test'] },
      ],
    },
    {
      id: 'repair',
      title: '고칠 수 있는 칩은 고치기',
      beats: [
        { text: '메모리 칩은 불량 셀을 미리 만들어 둔 예비 셀로 바꿔 살릴 수 있습니다.', cite: ['hynix-be-1-test'] },
        { text: '예를 들어 256비트 중 1비트가 불량이면, 남은 255비트에 예비 셀 하나를 더해 256비트를 채웁니다.', cite: ['hynix-be-1-test'] },
      ],
    },
    {
      id: 'sort',
      title: '불량 표시와 수율',
      beats: [
        { text: '검사 결과로 양품과 불량 칩을 가려 표시합니다. 예전에는 잉크를 찍었지만 지금은 데이터로 기록합니다.', cite: ['samsung-8-8'] },
        { text: '불량으로 표시된 칩은 조립하지 않아 재료와 시간을 아낍니다.', cite: ['samsung-8-8'] },
        { text: '웨이퍼 한 장에서 나올 수 있는 칩 중 양품의 비율을 수율이라고 합니다.', cite: ['samsung-8-8'] },
      ],
    },
  ],
}
