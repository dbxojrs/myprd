// 반도체 기초 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/b-cmos.jsx (검수 전)
export default {
  id: 'b-cmos',
  title: 'CMOS: NMOS와 PMOS를 짝지어',
  reviewed: false,
  scenes: [
    {
      id: 'pair',
      title: '짝을 이룬 두 트랜지스터',
      beats: [
        { text: 'CMOS는 PMOS와 NMOS를 짝지어 서로 보완하도록 연결한 회로 방식입니다(상보형 MOS).', cite: ['samsung-term-cmos', 'mit-6012-l13'] },
        { text: '집적도가 높고 소비 전력이 매우 적어, 마이크로프로세서·SRAM 같은 디지털 회로에 널리 씁니다.', cite: ['samsung-term-cmos'] },
      ],
    },
    {
      id: 'invert',
      title: '입력에 따라 한쪽만 켜짐',
      beats: [
        { text: '입력이 1이면 NMOS가 켜지고 PMOS가 꺼져 출력이 0이 됩니다.', cite: ['mit-6012-l13'] },
        { text: '입력이 0이면 반대로 PMOS가 켜지고 NMOS가 꺼져 출력이 1이 됩니다.', cite: ['mit-6012-l13'] },
        { text: '어느 상태든 한쪽은 꺼져 있어 전원에서 접지로 이어지는 길이 없으므로, 가만히 있을 때는 전력을 거의 쓰지 않습니다.', cite: ['mit-6012-l13', 'ti-cmos-power'] },
      ],
    },
  ],
}
