// 마킹 자세한 설명. 원문을 옮기지 않고 풀어 썼습니다. (검수 전)
export default {
  id: 'marking',
  reviewed: false,
  checked: '2026-11-23',
  analogy: null,
  easy: [
    { text: '패키지 윗면에 제품 정보를 새깁니다.', cite: ['hynix-be-6'] },
    { text: '주로 레이저로 검은 수지 표면을 태워 새깁니다.', cite: ['hynix-be-6'] },
    { text: '나중에 불량이 나면 이 정보로 추적합니다.', cite: ['hynix-be-6'] },
  ],
  sections: [
    {
      heading: '무엇을, 어떻게',
      points: [
        { text: '제품 종류, 만든 회사, 고객이 원하는 문자·기호, 만든 날, 일련번호 등을 새깁니다.', cite: ['hynix-be-6', 'samsung-8-9-2013'] },
        { text: '레이저로 EMC를 태워 새기거나 잉크로 찍습니다. 검은 EMC는 어두운 바탕이라 레이저 글자가 잘 보입니다.', cite: ['hynix-be-6'] },
        { text: '레이저 마킹으로 테스트 결과를 패키지에 기록하기도 합니다.', cite: ['hynix-be-1-test'] },
      ],
    },
    {
      heading: '깊이',
      points: [
        { text: '패키지가 얇아질수록 새기는 깊이가 중요합니다. 너무 깊으면 수지가 얇아져 안쪽 칩이 손상될 수 있어, 레이저 특성을 조절해 얕게 새기는 방법이 연구되고 있습니다.', cite: ['kmeps-2022-laser-marking'] },
      ],
    },
    {
      heading: '순서는 회사마다 다를 수 있음',
      points: [
        { text: 'SK하이닉스는 마킹을 몰딩 바로 뒤에 설명하고, 삼성 2013년판은 패키지 테스트를 마친 뒤 새긴다고 설명합니다.', cite: ['hynix-be-6', 'samsung-8-9-2013'] },
      ],
    },
  ],
  gaps: [
    '레이저 종류·출력 숫자는 위 출처에서 확인하지 못했습니다.',
  ],
}
