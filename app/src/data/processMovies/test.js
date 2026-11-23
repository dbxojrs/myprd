// 최종(패키지) 테스트 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/test.jsx (검수 전)
export default {
  id: 'test',
  title: '최종 테스트: 완성된 패키지 검사하기',
  reviewed: false,
  scenes: [
    {
      id: 'handler',
      title: '소켓에 넣고 검사',
      beats: [
        { text: '패키지가 된 뒤 다시 검사합니다. 웨이퍼 테스트(EDS)에 이은 두 번째 테스트로, 패키징 중 생긴 불량을 걸러 냅니다.', cite: ['samsung-8-8', 'hynix-be-1-test'] },
        { text: '패키지를 뒤집어 테스트 보드 위의 소켓에 넣으면, 패키지의 솔더볼이 소켓 핀에 닿아 테스터와 연결됩니다.', cite: ['hynix-be-1-test'] },
        { text: '전압과 신호를 걸어 칩의 특성과 속도를 재고, 규격대로 동작하는지 확인합니다.', cite: ['samsung-8-9', 'hynix-be-1-test'] },
      ],
    },
    {
      id: 'temp',
      title: '번인과 온도 시험',
      beats: [
        { text: '번인은 높은 온도와 전압으로 스트레스를 주어, 초기에 고장 날 약한 제품을 미리 골라냅니다. 패키지 상태로 번인하며 동시에 테스트하기도 합니다(TDBI).', cite: ['hynix-be-1-test', 'samsung-8-9-2013'] },
        { text: '높은 온도와 낮은 온도 같은 조건에서도 검사해, 실제 쓰는 환경에서 동작하는지 봅니다.', cite: ['samsung-8-9', 'hynix-be-1-test'] },
      ],
    },
    {
      id: 'sort',
      title: '나누고 알리기',
      beats: [
        { text: '결과에 따라 양품과 불량을 나눕니다.', cite: ['hynix-be-1-test'] },
        { text: '겉모습도 검사해 금, 마킹 불량, 눌리거나 빠진 솔더볼이 없는지 확인한 뒤 트레이에 담아 내보냅니다.', cite: ['hynix-be-1-test'] },
        { text: '테스트 결과는 제조 공정으로 되돌려 알려 품질을 높이는 데 씁니다.', cite: ['samsung-8-9'] },
      ],
    },
  ],
}
