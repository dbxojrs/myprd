// 세정 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/cleaning.jsx (검수 전)
export default {
  id: 'cleaning',
  title: '세정: 공정 사이사이 웨이퍼 씻기',
  reviewed: false,
  scenes: [
    {
      id: 'why',
      title: '왜 이렇게 자주 씻을까',
      beats: [
        { text: '아주 작은 먼지 하나도 칩의 전기적 특성을 망가뜨려 불량과 수율 저하로 이어질 수 있습니다.', cite: ['hynix-clean-cmp'] },
        { text: '없애야 할 불순물에는 입자, 금속, 유기물, 자연산화막이 있습니다.', cite: ['samsung-cleaning'] },
        { text: '그래서 여러 공정의 앞뒤마다 씻고, 세정은 다른 공정보다 2배 정도 자주 진행됩니다.', cite: ['hynix-clean-cmp', 'samsung-cleaning'] },
      ],
    },
    {
      id: 'rca',
      title: '약품마다 맡은 일 (RCA 세정)',
      beats: [
        { text: 'SC-1(수산화암모늄·과산화수소·초순수)은 표면을 얇게 산화시켜 입자를 떼어 냅니다.', cite: ['mks-wafer-cleaning'] },
        { text: 'SC-2(염산·과산화수소·초순수)는 금속 오염을 없앱니다.', cite: ['mks-wafer-cleaning'] },
        { text: '묽은 불산(HF)은 자연산화막을 없애고 깨끗한 실리콘 표면을 남깁니다.', cite: ['mks-wafer-cleaning'] },
      ],
    },
    {
      id: 'dry',
      title: '헹구고 말리기',
      beats: [
        { text: '남은 약품은 초순수(UPW)를 많이 뿌려 헹구고, 웨이퍼를 빠르게 돌려 말립니다.', cite: ['mks-wet-cleaning'] },
        { text: '3D 구조에서는 말리는 단계에서 가는 패턴이 쓰러지는(패턴 붕괴) 위험이 커집니다.', cite: ['semieng-cleaning-3d'] },
        { text: '액체의 표면장력이 결함을 만들기 때문에, 표면장력이 없는 초임계 유체로 씻는 방법도 씁니다.', cite: ['hynix-clean-cmp'] },
      ],
    },
    {
      id: 'type',
      title: '배치식과 매엽식',
      beats: [
        { text: '배치식은 약품을 채운 조에 여러 장을 한꺼번에 담가 씻습니다.', cite: ['samsung-cleaning', 'hynix-clean-cmp'] },
        { text: '매엽식은 챔버마다 한 장씩 씻습니다. 배치식은 섬세한 첨단 웨이퍼에는 알맞지 않고, 최근에는 매엽식 비중이 커지고 있습니다.', cite: ['hynix-clean-cmp', 'samsung-cleaning'] },
      ],
    },
  ],
}
