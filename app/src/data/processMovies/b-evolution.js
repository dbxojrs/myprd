// 반도체 기초 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/b-evolution.jsx (검수 전)
export default {
  id: 'b-evolution',
  title: '트랜지스터의 진화: 평면형에서 GAA까지',
  reviewed: false,
  scenes: [
    {
      id: 'evo',
      title: '구조가 바뀌어 온 길',
      beats: [
        { text: '평면형 트랜지스터는 게이트가 채널의 한 면에만 닿는 구조입니다.', cite: ['samsung-gaa-2019', 'samsung-blog-scaling'] },
        { text: '핀펫(FinFET)은 지느러미처럼 세운 채널의 세 면을 게이트가 감싸, 성능을 높이고 누설 전류를 줄였습니다.', cite: ['samsung-term-finfet', 'samsung-gaa-2019'] },
        { text: 'GAA는 게이트가 채널의 네 면을 모두 감쌉니다. 삼성의 MBCFET은 채널을 얇고 넓은 나노시트로 만들어 여러 장 쌓았습니다.', cite: ['samsung-3nm-gaa', 'samsung-gaa-2019', 'samsung-blog-scaling'] },
      ],
    },
    {
      id: 'why',
      title: '왜 바꿨나',
      beats: [
        { text: '트랜지스터가 작아지면 소스와 드레인이 가까워져, 게이트가 전류를 제대로 막지 못하고 전류가 새는 단채널 현상이 생깁니다.', cite: ['samsung-gaa-ep6', 'samsung-gaa-2019', 'samsung-blog-scaling'] },
        { text: '게이트가 채널을 더 많이 감쌀수록 전류를 잘 조절할 수 있어, 평면형 → 핀펫 → GAA로 바뀌어 왔습니다.', cite: ['samsung-gaa-2019', 'samsung-blog-scaling', 'samsung-3nm-gaa'] },
      ],
    },
  ],
}
