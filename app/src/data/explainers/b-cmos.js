// 반도체 기초: CMOS 자세한 설명. 원문을 옮기지 않고 풀어 썼습니다. (검수 전)
export default {
  id: 'b-cmos',
  reviewed: false,
  checked: '2026-11-23',
  analogy: null,
  easy: [
    { text: 'CMOS는 PMOS와 NMOS를 한 쌍으로 묶은 회로 방식입니다.', cite: ['samsung-term-cmos'] },
    { text: '입력에 따라 둘 중 하나만 켜집니다.', cite: ['mit-6012-l13'] },
    { text: '그래서 가만히 있을 때 전력을 거의 쓰지 않습니다.', cite: ['mit-6012-l13', 'ti-cmos-power'] },
  ],
  sections: [
    {
      heading: '무엇인가',
      points: [
        { text: '상보형 금속 산화 반도체(Complementary MOS)의 줄임말로, P채널과 N채널 MOSFET을 짝지어 서로 보완하게 연결합니다.', cite: ['samsung-term-cmos', 'samsung-term-zip'] },
        { text: '집적도가 높고 소비 전력이 매우 적어 마이크로프로세서·SRAM 같은 디지털 회로에 쓰이며, 계산기·전자시계 등에도 쓰입니다.', cite: ['samsung-term-cmos'] },
      ],
    },
    {
      heading: '인버터(NOT 회로)로 보는 동작',
      points: [
        { text: '입력 0: NMOS 꺼짐, PMOS 켜짐 → 출력은 전원 전압(1).', cite: ['mit-6012-l13'] },
        { text: '입력 1: NMOS 켜짐, PMOS 꺼짐 → 출력 0.', cite: ['mit-6012-l13'] },
        { text: '어느 논리 상태에서든 하나는 꺼져 있어, 쉬고 있을 때는 전력을 거의 쓰지 않습니다.', cite: ['mit-6012-l13'] },
      ],
    },
    {
      heading: '전력은 언제 쓰나',
      points: [
        { text: '게이트로 전류가 흐르지 않고 전원에서 접지로 이어지는 직류 길이 없어, 이론상 정적 전력은 0입니다.', cite: ['ti-cmos-power'] },
        { text: '실제로는 역방향 접합의 누설 전류 때문에 작은 정적 전력이 있습니다.', cite: ['ti-cmos-power'] },
        { text: '전력은 주로 켜고 끄며 상태를 바꿀 때 쓰이며, 바뀌는 순간에는 두 트랜지스터가 잠깐 함께 켜져 전류가 지나가기도 합니다.', cite: ['mit-6012-l13', 'ti-cmos-power'] },
      ],
    },
    {
      heading: '역사',
      points: [
        { text: '1963년 사(Sah)와 완라스(Wanlass)가 p채널·n채널 MOS를 짝지은 회로가 대기 상태에서 거의 0에 가까운 전력을 쓴다는 것을 보였고, 완라스가 특허를 냈습니다.', cite: ['chm-cmos-1963'] },
        { text: '처음 대량으로 쓰인 곳은 디지털 시계 같은 배터리 제품이었습니다.', cite: ['chm-cmos-1963'] },
      ],
    },
  ],
  gaps: [
  ],
}
