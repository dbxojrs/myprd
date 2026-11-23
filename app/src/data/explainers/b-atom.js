// 반도체 기초: 원자와 전자 자세한 설명. 원문을 옮기지 않고 풀어 썼습니다. (검수 전)
export default {
  id: 'b-atom',
  reviewed: false,
  checked: '2026-11-23',
  analogy: { text: '원자를 태양계에 빗대어, 가운데 원자핵 주위를 전자들이 도는 모습으로 설명하기도 합니다.', cite: ['samsung-easy-2'] },
  easy: [
    { text: '원자는 원자핵과 그 주위의 전자로 이루어집니다.', cite: ['samsung-easy-2'] },
    { text: '실리콘은 가장 바깥 전자(최외각 전자)가 4개입니다.', cite: ['samsung-easy-3', 'samsung-transistor-principle'] },
    { text: '순수한 실리콘은 전자가 묶여 있어 전기가 잘 안 통합니다.', cite: ['samsung-easy-3', 'samsung-transistor-principle'] },
  ],
  sections: [
    {
      heading: '원자와 최외각 전자',
      points: [
        { text: '원자핵은 양성자와 중성자로 이루어지고, 그 주위를 전자가 돕니다.', cite: ['samsung-easy-2'] },
        { text: '가장 바깥 궤도의 전자를 최외각 전자라 하며, 원자는 최외각 전자 8개를 채워 안정해지려는 성질이 있습니다.', cite: ['samsung-easy-2', 'samsung-transistor-principle'] },
        { text: '실리콘과 저마늄(게르마늄)은 최외각 전자가 4개인 4족 원소입니다.', cite: ['samsung-easy-3', 'samsung-transistor-principle'] },
      ],
    },
    {
      heading: '공유 결합과 진성 반도체',
      points: [
        { text: '실리콘 원자들은 이웃과 전자를 나눠 갖는 공유 결합으로 규칙적인 결정을 이룹니다.', cite: ['samsung-easy-3', 'samsung-transistor-principle'] },
        { text: '순수한 실리콘(진성 반도체)에서는 전자가 원자핵에 묶여 움직이지 못해, 전압을 걸어도 전류가 거의 흐르지 않습니다.', cite: ['samsung-easy-3', 'samsung-transistor-principle', 'samsung-8-6'] },
        { text: '실리콘은 집적 회로에 가장 많이 쓰는 반도체 재료이며 모래에서 얻을 수 있습니다.', cite: ['samsung-easy-2'] },
      ],
    },
    {
      heading: '도체 · 절연체 · 반도체',
      points: [
        { text: '도체는 전기나 열이 잘 흐르는 물질(금·은·구리·알루미늄 등)이고, 부도체(절연체)는 잘 흐르지 않는 물질입니다.', cite: ['samsung-term-zip'] },
        { text: '반도체는 전기가 통하는 정도가 그 중간쯤인 물질입니다.', cite: ['samsung-term-zip', 'samsung-transistor-principle'] },
      ],
    },
    {
      heading: '다른 무료 출처로 더 알아보기',
      points: [
        { text: '실리콘 원자는 단단히 묶인 안쪽 전자 10개와 비교적 느슨한 바깥 전자 4개를 가지며, 결정은 다이아몬드 격자 구조입니다.', cite: ['mit-6012-l2'] },
        { text: '아주 차가운(0K) 실리콘에서는 모든 결합이 채워져 움직이는 전자가 없습니다.', cite: ['mit-6012-l2'] },
        { text: '온도가 오르면 일부 결합이 끊어져 움직이는 전자(−)와 빈 결합인 정공(+)이 함께 생깁니다. 상온의 순수 실리콘에는 1cm³에 약 10¹⁰개 있습니다.', cite: ['mit-6012-l2'] },
        { text: '14족 원소의 밴드갭은 탄소 5.4eV, 실리콘 1.1eV, 저마늄 0.72eV, 주석 0.08eV, 납 0eV로, 각각 절연체·반도체·금속으로 나뉩니다.', cite: ['mit-3091-bands'] },
      ],
    },
  ],
  gaps: [
    '밴드갭(전도띠·원자가띠)의 개념 설명은 숫자 표 위주의 자료만 확인해, 자세한 그림 설명은 하지 않았습니다.',
  ],
}
