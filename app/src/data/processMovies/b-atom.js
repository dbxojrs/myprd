// 반도체 기초 애니메이션 자막. 문장마다 출처 키. 그림: components/movie/scenes/b-atom.jsx (검수 전)
export default {
  id: 'b-atom',
  title: '원자와 전자: 실리콘은 왜 반도체일까',
  reviewed: false,
  scenes: [
    {
      id: 'atom',
      title: '원자의 생김새',
      beats: [
        { text: '원자는 가운데의 원자핵과, 그 주위를 도는 전자로 이루어져 있습니다.', cite: ['samsung-easy-2'] },
        { text: '가장 바깥 궤도의 전자를 최외각 전자라고 합니다. 실리콘은 최외각 전자가 4개입니다.', cite: ['samsung-easy-2', 'samsung-easy-3', 'samsung-transistor-principle'] },
      ],
    },
    {
      id: 'bond',
      title: '공유 결합과 결정',
      beats: [
        { text: '원자는 최외각 전자 8개를 채워 안정해지려는 성질이 있습니다.', cite: ['samsung-easy-2', 'samsung-transistor-principle'] },
        { text: '그래서 실리콘 원자들은 이웃 원자와 전자를 나눠 갖는 공유 결합으로 규칙적인 결정을 만듭니다.', cite: ['samsung-easy-3', 'samsung-transistor-principle'] },
        { text: '순수한 실리콘에서는 전자가 묶여 움직이지 못해, 전압을 걸어도 전류가 거의 흐르지 않습니다.', cite: ['samsung-easy-3', 'samsung-transistor-principle', 'samsung-8-6'] },
      ],
    },
    {
      id: 'compare',
      title: '도체 · 반도체 · 절연체',
      beats: [
        { text: '도체는 전기가 잘 흐르는 물질(금·은·구리·알루미늄 등)이고, 절연체(부도체)는 잘 흐르지 않는 물질입니다.', cite: ['samsung-term-zip'] },
        { text: '반도체는 그 중간쯤으로, 불순물을 넣어 전기가 통하는 정도를 조절할 수 있습니다.', cite: ['samsung-term-zip', 'samsung-transistor-principle', 'samsung-easy-3'] },
      ],
    },
  ],
}
