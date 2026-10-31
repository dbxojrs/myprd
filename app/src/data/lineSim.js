// 라인 시뮬레이션 규칙표. PRD "라인 시뮬레이션 데이터 초안" 기준입니다.
// 등급과 이유는 일반적으로 알려진 경향을 정리한 교육용 가설이며, 출처를 붙이고 검수해야 합니다.
// grade: 'good'(권장) | 'warn'(주의, 신뢰성 위험) | 'bad'(불량)
// 변수 name과 defect는 { en, ko } 용어 쌍입니다.
// effect: 이 선택이 완성된 패키지에 남기는 결과. 권장 선택은 빈 문자열입니다.

export const GRADE_LABEL = {
  good: '권장',
  warn: '주의',
  bad: '불량',
}

// 공정별 변수와 선택지. 테스트 공정은 최종 판정 단계로 대신합니다.
export const lineOptions = {
  backgrind: [
    {
      id: 'thickness',
      name: { en: 'Final Thickness', ko: '최종 두께' },
      choices: [
        {
          label: '너무 얇게',
          grade: 'warn',
          defect: { en: 'Warpage / Crack', ko: '휨·깨짐 위험' },
          reason: '얇은 웨이퍼는 다루는 동안 휘거나 깨지기 쉽습니다.',
          effect: '다이에 미세한 금이 남아 사용 중 깨질 수 있습니다.',
        },
        { label: '권장 두께', grade: 'good', defect: '', reason: '패키지 두께 규격과 웨이퍼 강도를 함께 만족합니다.', effect: '' },
        {
          label: '너무 두껍게',
          grade: 'bad',
          defect: { en: 'Over-Thickness', ko: '패키지 두께 초과' },
          reason: '다이가 두꺼우면 완성된 패키지가 두께 규격을 넘습니다.',
          effect: '패키지가 규격보다 두꺼워 제품 기판에 들어가지 않습니다.',
        },
      ],
    },
  ],
  'wafer-saw': [
    {
      id: 'feed',
      name: { en: 'Blade Feed Speed', ko: '블레이드 이송 속도' },
      choices: [
        { label: '느리게', grade: 'good', defect: '', reason: '품질에는 문제가 없지만 생산 속도가 떨어집니다.', effect: '' },
        { label: '권장 속도', grade: 'good', defect: '', reason: '절단 품질과 생산 속도의 균형이 맞습니다.', effect: '' },
        {
          label: '빠르게',
          grade: 'warn',
          defect: { en: 'Chipping', ko: '가장자리 깨짐' },
          reason: '빠르게 자르면 절단면에 힘이 몰려 다이 가장자리가 깨질 수 있습니다.',
          effect: '다이 모서리의 깨진 자국이 온도 변화를 겪으며 균열로 커질 수 있습니다.',
        },
      ],
    },
  ],
  'die-attach': [
    {
      id: 'amount',
      name: { en: 'Epoxy Amount', ko: '접착제 양' },
      choices: [
        {
          label: '부족',
          grade: 'warn',
          defect: { en: 'Void / Delamination', ko: '빈 공간·박리' },
          reason: '접착제가 모자라면 빈 공간(보이드)이 생겨 열과 응력에 약해집니다.',
          effect: '다이 아래 빈 공간 때문에 열이 잘 빠지지 않고, 온도 변화가 반복되면 다이가 들뜰 수 있습니다.',
        },
        { label: '권장', grade: 'good', defect: '', reason: '다이 아래가 고르게 채워집니다.', effect: '' },
        {
          label: '과다',
          grade: 'warn',
          defect: { en: 'Epoxy Bleed', ko: '접착제 넘침' },
          reason: '넘친 접착제가 다이 주변이나 패드를 오염시킬 수 있습니다.',
          effect: '넘친 접착제가 와이어 접합 자리를 덮어 연결이 약해질 수 있습니다.',
        },
      ],
    },
    {
      id: 'cure',
      name: { en: 'Cure Condition', ko: '경화 조건' },
      choices: [
        {
          label: '덜 경화',
          grade: 'bad',
          defect: { en: 'Delamination', ko: '접착력 부족·박리' },
          reason: '덜 굳은 접착제는 다이를 단단히 잡지 못합니다.',
          effect: '다이가 고정되지 않아 뒤 공정이나 사용 중 떨어져 기능을 잃습니다.',
        },
        { label: '권장', grade: 'good', defect: '', reason: '접착제가 충분히 굳어 다이를 고정합니다.', effect: '' },
        {
          label: '과경화',
          grade: 'warn',
          defect: { en: 'Embrittlement', ko: '접착층 취화·응력' },
          reason: '지나치게 경화하면 접착층이 딱딱해져 응력에 약해질 수 있습니다.',
          effect: '딱딱해진 접착층이 충격이나 온도 변화에 금이 갈 수 있습니다.',
        },
      ],
    },
  ],
  'wire-bond': [
    {
      id: 'energy',
      name: { en: 'Ultrasonic Power & Force', ko: '초음파 출력·하중' },
      choices: [
        {
          label: '약하게',
          grade: 'bad',
          defect: { en: 'Non-Stick on Pad', ko: '접합 안 됨' },
          reason: '접합 에너지가 부족해 와이어가 패드에 붙지 않습니다.',
          effect: '와이어가 떨어져 전기가 통하지 않습니다. 테스트에서 개방(open) 불량으로 걸립니다.',
        },
        { label: '권장', grade: 'good', defect: '', reason: '와이어가 패드에 안정적으로 접합됩니다.', effect: '' },
        {
          label: '강하게',
          grade: 'warn',
          defect: { en: 'Cratering', ko: '패드 아래 손상' },
          reason: '에너지가 지나치면 패드 아래 층에 균열이 생길 수 있습니다.',
          effect: '패드 아래 균열이 사용 중 커져 나중에 연결이 끊길 수 있습니다.',
        },
      ],
    },
  ],
  molding: [
    {
      id: 'speed',
      name: { en: 'Transfer Speed', ko: '주입 속도' },
      choices: [
        {
          label: '느리게',
          grade: 'warn',
          defect: { en: 'Incomplete Fill / Void', ko: '미충전·빈 공간' },
          reason: '수지가 다 차기 전에 굳기 시작하면 빈 곳이 남을 수 있습니다.',
          effect: '패키지 안 빈 공간에 습기가 모여, 제품 기판에 납땜할 때 터지거나 부식될 수 있습니다.',
        },
        { label: '권장', grade: 'good', defect: '', reason: '수지가 와이어를 밀지 않고 고르게 채워집니다.', effect: '' },
        {
          label: '빠르게',
          grade: 'bad',
          defect: { en: 'Wire Sweep', ko: '와이어 쓸림' },
          reason: '빠른 수지 흐름이 와이어를 밀어 서로 닿게(단락) 할 수 있습니다.',
          effect: '밀린 와이어끼리 닿아 단락이 생깁니다. 테스트에서 단락(short) 불량으로 걸립니다.',
        },
      ],
    },
  ],
  marking: [
    {
      id: 'laser',
      name: { en: 'Laser Power', ko: '레이저 출력' },
      choices: [
        {
          label: '약하게',
          grade: 'warn',
          defect: { en: 'Illegible Marking', ko: '식별 불가' },
          reason: '기능은 정상이지만 글자가 흐려 제품을 추적하기 어렵습니다.',
          effect: '기능은 정상이지만, 문제가 생겼을 때 어느 로트인지 추적하기 어렵습니다.',
        },
        { label: '권장', grade: 'good', defect: '', reason: '글자가 선명하고 몰딩 표면이 손상되지 않습니다.', effect: '' },
        {
          label: '강하게',
          grade: 'warn',
          defect: { en: 'Mold Damage', ko: '몰딩 표면 손상' },
          reason: '출력이 지나치면 몰딩을 깊게 파서 보호 두께가 줄어듭니다.',
          effect: '얇아진 몰딩 아래로 습기가 들어갈 위험이 커집니다.',
        },
      ],
    },
  ],
  'package-saw': [
    {
      id: 'blade',
      name: { en: 'Blade Condition & Speed', ko: '블레이드 상태·속도' },
      choices: [
        {
          label: '마모된 블레이드',
          grade: 'warn',
          defect: { en: 'Burr / Chipping', ko: '거스러미·깨짐' },
          reason: '무뎌진 블레이드는 절단면을 거칠게 만들어 리드에 버가 남습니다.',
          effect: '리드에 남은 버가 제품 기판에 납땜할 때 이웃 리드와 붙을 수 있습니다.',
        },
        { label: '권장', grade: 'good', defect: '', reason: '절단면이 깨끗하고 리드가 손상되지 않습니다.', effect: '' },
        {
          label: '너무 빠르게',
          grade: 'warn',
          defect: { en: 'Chipping / Lead Damage', ko: '깨짐·리드 손상' },
          reason: '빠른 절단은 패키지 모서리와 리드를 손상시킬 수 있습니다.',
          effect: '모서리가 깨져 외관 검사에서 걸리거나 리드 접촉이 나빠질 수 있습니다.',
        },
      ],
    },
  ],
}

// 앞 공정의 선택이 뒤 공정 선택지의 등급을 바꾸는 연결 규칙.
// when: 앞 공정 선택, target: 바뀌는 뒤 공정 선택(choice가 null이면 그 변수의 모든 선택지)
export const lineRules = [
  {
    when: { process: 'backgrind', variable: 'thickness', choice: 0 },
    target: { process: 'wafer-saw', variable: 'feed', choice: 2 },
    grade: 'bad',
    reason: '얇은 웨이퍼는 빠른 절단에서 칩핑이 크랙으로 커지기 쉽습니다.',
    effect: '다이를 가로지르는 균열이 생겨 테스트에서 기능 불량으로 걸립니다.',
  },
  {
    when: { process: 'die-attach', variable: 'amount', choice: 2 },
    target: { process: 'wire-bond', variable: 'energy', choice: 1 },
    grade: 'warn',
    reason: '넘친 접착제가 패드를 오염시키면 권장 조건에서도 접합이 약해질 수 있습니다.',
    effect: '와이어 접합이 약해 사용 중 진동이나 온도 변화로 끊길 수 있습니다.',
  },
  {
    when: { process: 'molding', variable: 'speed', choice: 0 },
    target: { process: 'package-saw', variable: 'blade', choice: 2 },
    grade: 'bad',
    reason: '몰딩 안에 보이드가 있으면 빠른 절단에서 모서리가 크게 깨질 수 있습니다.',
    effect: '깨진 모서리로 내부가 드러나 외관 검사와 신뢰성 검사에서 불량이 됩니다.',
  },
]

// 완성된 패키지 단면 그림에서 각 공정의 결과가 나타나는 부위.
export const PACKAGE_PARTS = {
  backgrind: 'die',
  'wafer-saw': 'die',
  'die-attach': 'attach',
  'wire-bond': 'wire',
  molding: 'mold',
  marking: 'mark',
  'package-saw': 'lead',
}

export const PART_LABEL = {
  die: { en: 'Die', ko: '다이' },
  attach: { en: 'Die Attach', ko: '접착층' },
  wire: { en: 'Wire', ko: '와이어' },
  mold: { en: 'Mold', ko: '몰딩' },
  mark: { en: 'Marking', ko: '마킹' },
  lead: { en: 'Lead', ko: '리드·모서리' },
}

export const lineSimReviewed = false
