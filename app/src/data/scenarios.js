// 실무 상황 대처 연습(현장 시뮬레이션) 문제. 모두 교육용 가상 사례이며 수치는 실제 업체 규격이 아닙니다(검수 전).
// 모범 답안의 핵심 포인트에는 근거를 붙입니다.
//   basis: 'rule:<장비 id>' → 앱의 장비 규칙표(data/machines)에 있는 원인·조치
//          'principle'      → 현장 대응 원칙(격리·재측정·변경 관리·재발 방지 같은 일반적인 품질 대응 순서)
// cat: 채점 기준 id (RUBRIC)

export const RUBRIC = [
  { id: 'contain', label: '긴급 조치 및 불량 확산 방지', points: 25 },
  { id: 'cause', label: '원인 분석의 논리성', points: 25 },
  { id: 'know', label: '공정 및 설비 지식', points: 20 },
  { id: 'fix', label: '개선 조치의 적절성', points: 15 },
  { id: 'verify', label: '재발 방지 및 검증', points: 15 },
]

export const BASIS_LABEL = { principle: '현장 대응 원칙', 'rule:wire-bond': '와이어 본더 규칙표', 'rule:die-attach': '다이 본더 규칙표', 'rule:molding': '몰딩 프레스 규칙표', 'rule:test': '테스트 핸들러 규칙표' }

export const SCENARIOS = [
  {
    id: 'wb-shear',
    no: 1,
    title: 'Wire Bonding 접합 강도 급락',
    process: 'wire-bond',
    machine: 'wire-bond',
    level: '중',
    roles: ['공정기술', '생산기술', '품질관리'],
    headline: '생산 중 갑자기 접합 강도가 떨어졌습니다.',
    story:
      '반도체 패키징 업체의 Wire Bonding 공정 엔지니어입니다. 오전 10시, 작업자에게서 연락이 왔습니다. "엔지니어님, 2번 와이어 본딩 설비에서 생산한 제품의 Ball Shear Test 결과가 갑자기 낮아졌습니다. 그런데 현미경으로 보면 Ball 모양은 정상입니다. 어떻게 해야 할까요?"',
    table: {
      cols: ['확인 항목', '정상 설비 1호기', '이상 설비 2호기'],
      rows: [
        ['Ball Shear 평균 강도', '27 gf', '16 gf'],
        ['사내 관리 하한', '18 gf', '18 gf'],
        ['Ball 직경', '100 μm', '101 μm'],
        ['육안 검사', '정상', '정상'],
        ['설비 알람', '없음', '없음'],
        ['사용 소재 · 본딩 Recipe', '동일', '동일'],
      ],
    },
    facts: [
      '2호기는 약 1시간 전 Capillary(본딩 툴)를 교체했습니다.',
      '교체 전에는 Ball Shear 강도가 정상 범위였습니다.',
      '같은 자재를 쓰는 1호기는 지금도 정상입니다.',
      '2호기는 이상이 확인된 뒤에도 제품을 계속 생산하고 있습니다.',
      '검사 장비의 측정 오류인지, 실제 본딩 불량인지는 아직 모릅니다.',
    ],
    questions: [
      {
        id: 'q1',
        q: '가장 먼저 어떤 조치를 취하시겠습니까?',
        hint: '제품 품질과 지금 생산 중인 물량을 함께 생각해 보세요.',
        points: [
          { text: '2호기 생산을 멈춥니다(불량이 계속 쌓이지 않게).', cat: 'contain', basis: 'principle' },
          { text: 'Capillary 교체 이후 2호기에서 만든 제품을 따로 보관(Hold)하고 다음 공정으로 넘기지 않습니다.', cat: 'contain', basis: 'principle' },
          { text: '정상인 1호기는 계속 생산해 전체 생산 차질을 줄입니다.', cat: 'contain', basis: 'principle' },
          { text: '이상을 처음 확인한 시각·Lot·교체 시각을 기록하고 품질 담당에게 알립니다.', cat: 'verify', basis: 'principle' },
        ],
      },
      {
        id: 'q2',
        q: 'Ball 모양은 정상인데 접합 강도가 낮은 원인은 무엇일까요? 가능한 원인을 2~3개 제시해 보세요.',
        hint: '"이상이 시작된 시점에 무엇이 바뀌었나"부터 생각해 보세요.',
        points: [
          { text: '새로 단 Capillary 자체의 문제: 닳았거나 더러운 Capillary는 볼을 고르게 누르고 문지르지 못해 접합이 약해집니다.', cat: 'cause', basis: 'rule:wire-bond' },
          { text: 'Capillary 교체 뒤 초음파가 볼에 충분히 전달되지 않는 상태: 초음파가 약하면 산화막을 깨지 못해 금속끼리 제대로 붙지 않습니다.', cat: 'know', basis: 'rule:wire-bond' },
          { text: '측정 쪽 문제: 시험 장비의 고정·측정 조건이 달라져 실제보다 낮게 측정됐을 가능성도 있습니다.', cat: 'cause', basis: 'principle' },
          { text: '자재·레시피가 1호기와 같고 1호기는 정상이므로, 자재(패드 오염 등)보다 2호기에서 바뀐 것을 먼저 의심합니다.', cat: 'cause', basis: 'principle' },
        ],
      },
      {
        id: 'q3',
        q: '원인을 찾기 위해 어떤 항목부터 확인하시겠습니까? 확인 순서와 그 이유까지 써 보세요.',
        hint: '가장 빨리, 가장 많은 원인을 가려낼 수 있는 확인부터.',
        points: [
          { text: '먼저 측정이 맞는지 확인합니다: 1호기 제품을 같은 시험 장비로 재거나 2호기 제품을 다른 장비로 재서 측정 오류를 가려냅니다.', cat: 'cause', basis: 'principle' },
          { text: '다음으로 교체한 Capillary의 품번·장착 상태·팁 상태를 확인합니다(유일하게 바뀐 것).', cat: 'know', basis: 'rule:wire-bond' },
          { text: '교체 전후 설비 파라미터 기록을 비교해 실제로 바뀐 값이 없는지 봅니다.', cat: 'cause', basis: 'principle' },
          { text: '쉽고 빠른 확인(측정·툴 상태)을 먼저 하고, 시간이 드는 분석은 뒤로 미룹니다.', cat: 'cause', basis: 'principle' },
        ],
      },
      {
        id: 'q4',
        q: "선임 엔지니어가 '초음파 출력을 높여 보자'고 제안했습니다. 바로 높여도 될까요?",
        hint: '좋아지는 점과 새로 생길 수 있는 불량을 함께 생각해 보세요.',
        points: [
          { text: '원인을 확인하기 전에 조건부터 바꾸면 진짜 원인(예: Capillary 문제)을 가린 채 넘어갈 수 있습니다.', cat: 'fix', basis: 'principle' },
          { text: '초음파 출력이 지나치면 패드 아래 층에 균열(크레이터링)이 생길 수 있습니다.', cat: 'know', basis: 'rule:wire-bond' },
          { text: '바꾸더라도 소량으로 시험해 강도와 패드 손상을 함께 확인하고, 변경 승인 절차를 거칩니다.', cat: 'fix', basis: 'principle' },
        ],
      },
      {
        id: 'q5',
        q: '문제를 해결했다고 판단하려면 어떤 데이터가 필요할까요? 한 번 정상으로 측정된 것만으로 충분할까요?',
        hint: '한 번의 결과가 우연일 수 있다는 점을 생각해 보세요.',
        points: [
          { text: '한 번이 아니라 여러 시간대·여러 Lot에서 충분한 수의 시료로 정상인지 확인합니다.', cat: 'verify', basis: 'principle' },
          { text: '평균뿐 아니라 가장 낮은 값도 관리 하한보다 여유 있게 높은지, 1호기와 비슷한지 봅니다.', cat: 'verify', basis: 'principle' },
          { text: '강도만이 아니라 패드 아래 손상 같은 새 불량이 없는지도 함께 확인합니다.', cat: 'know', basis: 'rule:wire-bond' },
          { text: '재발 방지: Capillary 교체 뒤 첫 제품의 Shear 강도를 확인하는 절차를 만듭니다.', cat: 'verify', basis: 'principle' },
          { text: 'Hold한 제품은 시료 검사 결과에 따라 출하·재작업·폐기를 정합니다.', cat: 'contain', basis: 'principle' },
        ],
      },
    ],
    followups: [
      {
        title: '추가 현장 데이터: 재측정과 Capillary 점검 결과',
        table: {
          cols: ['확인 내용', '결과'],
          rows: [
            ['1호기 제품을 2호기 쪽 시험 장비로 측정', '26 gf (정상)'],
            ['2호기 제품을 다른 시험 장비로 재측정', '15~17 gf (여전히 낮음)'],
            ['새 Capillary 품번', '기존과 동일'],
            ['새 Capillary 팁 현미경 관찰', '팁 끝에 이물 부착'],
          ],
        },
        q: '이 결과로 원인 후보 중 무엇을 지울 수 있고, 무엇이 남나요? 다음 조치는 무엇입니까?',
        points: [
          { text: '두 장비 모두 같은 경향이므로 측정 오류는 지웁니다.', cat: 'cause', basis: 'principle' },
          { text: '품번은 같지만 팁 이물이 있으므로 Capillary 오염이 가장 유력합니다.', cat: 'cause', basis: 'rule:wire-bond' },
          { text: 'Capillary를 새것으로 바꾸고 첫 제품 Shear를 확인한 뒤 생산을 다시 시작합니다(조건은 바꾸지 않음).', cat: 'fix', basis: 'rule:wire-bond' },
          { text: '같은 박스의 Capillary도 점검하고, 들어올 때 검사 항목에 팁 상태를 넣습니다.', cat: 'verify', basis: 'principle' },
        ],
      },
    ],
  },
  {
    id: 'da-void',
    no: 2,
    title: 'Die Attach 보이드 증가',
    process: 'die-attach',
    machine: 'die-attach',
    level: '중',
    roles: ['공정기술', '설비기술'],
    headline: 'X-ray 검사에서 다이 아래 빈 공간(보이드)이 크게 늘었습니다.',
    story:
      'Die Attach 공정 담당입니다. 정기 X-ray 검사에서 3번 다이 본더 제품의 보이드 면적이 평소보다 크게 나왔다는 보고가 왔습니다. 외관 검사와 다이 위치는 모두 정상이라 작업자는 계속 생산해도 되는지 묻고 있습니다.',
    table: {
      cols: ['확인 항목', '1번 본더', '3번 본더'],
      rows: [
        ['보이드 면적(평균)', '4 %', '17 %'],
        ['사내 관리 상한', '10 %', '10 %'],
        ['다이 위치·회전', '정상', '정상'],
        ['접착제', '같은 Lot', '같은 Lot'],
        ['설비 알람', '없음', '없음'],
      ],
    },
    facts: [
      '3번 본더는 어제 야간에 정기 점검(PM)을 했습니다.',
      'PM 때 본딩 헤드를 분해·조립했습니다.',
      '보이드는 다이 가장자리보다 가운데에 많이 몰려 있습니다.',
      '경화(Cure) 오븐은 두 본더 제품이 같은 오븐을 씁니다.',
    ],
    questions: [
      {
        id: 'q1',
        q: '가장 먼저 무엇을 하시겠습니까?',
        hint: '관리 상한을 넘었다는 점, 다음 공정으로 넘어가면 되돌리기 어렵다는 점을 생각해 보세요.',
        points: [
          { text: '3번 본더 생산을 멈추고, PM 이후 3번 본더 제품을 Hold합니다.', cat: 'contain', basis: 'principle' },
          { text: 'Hold한 제품이 와이어 본딩·몰딩으로 넘어가지 않게 막습니다(몰딩 뒤에는 고치기 어렵습니다).', cat: 'contain', basis: 'principle' },
          { text: '1번 본더는 정상이므로 계속 생산합니다.', cat: 'contain', basis: 'principle' },
        ],
      },
      {
        id: 'q2',
        q: '보이드가 늘어난 원인 후보를 2~3개 들고, 왜 그렇게 생각하는지 써 보세요.',
        hint: '같은 접착제·같은 오븐인데 3번만 나쁩니다. 3번에서만 달라진 것은?',
        points: [
          { text: 'PM 뒤 본딩 하중이 약해졌을 가능성: 누르는 힘이 약하면 접착제가 고르게 퍼지지 않고 공기가 갇혀 보이드가 생깁니다.', cat: 'know', basis: 'rule:die-attach' },
          { text: '접착제 도포량이 줄었을 가능성: 접착제가 모자라면 다이 아래에 빈 공간이 생깁니다.', cat: 'know', basis: 'rule:die-attach' },
          { text: '접착제·오븐은 1번과 같고 1번은 정상이므로, 재료나 경화보다 3번 본더에서 PM으로 바뀐 것을 먼저 의심합니다.', cat: 'cause', basis: 'principle' },
        ],
      },
      {
        id: 'q3',
        q: '원인을 가리기 위해 무엇을 어떤 순서로 확인하시겠습니까?',
        hint: '숫자로 바로 잴 수 있는 것부터.',
        points: [
          { text: '설정값이 아니라 실제로 누르는 힘을 측정해 설정과 같은지 확인합니다(PM 뒤 교정 상태 확인).', cat: 'cause', basis: 'principle' },
          { text: '도포량(무게나 도포 모양)을 재서 1번 본더와 비교합니다.', cat: 'cause', basis: 'principle' },
          { text: 'PM 점검표와 교체 부품, 파라미터 변경 기록을 확인합니다.', cat: 'cause', basis: 'principle' },
        ],
      },
      {
        id: 'q4',
        q: '"하중을 크게 올리면 보이드가 확실히 줄 것"이라는 의견이 있습니다. 어떻게 판단하시겠습니까?',
        points: [
          { text: '얇은 다이는 세게 누르면 깨질 수 있습니다.', cat: 'know', basis: 'rule:die-attach' },
          { text: '세게 누르면 접착제가 대부분 밀려 나가 접착층이 너무 얇아지고 넘칠 수 있습니다.', cat: 'know', basis: 'rule:die-attach' },
          { text: '원래 조건(적정 하중)으로 되돌리는 것이 먼저이고, 설정을 바꾸려면 소량 시험으로 확인합니다.', cat: 'fix', basis: 'principle' },
        ],
      },
      {
        id: 'q5',
        q: '해결됐다고 판단하는 기준과 재발 방지책은?',
        points: [
          { text: '조치 뒤 여러 시료의 X-ray 보이드가 관리 상한보다 충분히 낮고 1번 본더와 비슷한지 확인합니다.', cat: 'verify', basis: 'principle' },
          { text: 'PM 뒤 첫 제품 X-ray와 하중 측정을 필수 확인 항목으로 넣습니다.', cat: 'verify', basis: 'principle' },
          { text: 'Hold 제품은 보이드 검사 결과에 따라 처리 방법을 정합니다.', cat: 'contain', basis: 'principle' },
        ],
      },
    ],
    followups: [
      {
        title: '추가 현장 데이터: 하중과 도포량 측정',
        table: {
          cols: ['측정', '설정', '1번 본더 실제', '3번 본더 실제'],
          rows: [
            ['본딩 하중', '같음', '설정의 99 %', '설정의 58 %'],
            ['접착제 도포 무게', '같음', '기준 범위', '기준 범위'],
          ],
        },
        q: '이 데이터로 판단을 어떻게 바꾸시겠습니까? 조치와 확인 방법은?',
        points: [
          { text: '도포량은 정상이므로 도포량 원인은 지우고, 실제 하중 부족(PM 뒤 교정 문제)으로 좁힙니다.', cat: 'cause', basis: 'principle' },
          { text: '덜 눌리면 접착제가 고르게 퍼지지 않아 보이드가 생깁니다. 하중을 다시 교정해 적정으로 맞춥니다.', cat: 'fix', basis: 'rule:die-attach' },
          { text: '교정 뒤 첫 제품 X-ray로 보이드 감소를 확인하고, PM 절차에 하중 교정 확인을 넣습니다.', cat: 'verify', basis: 'principle' },
        ],
      },
    ],
  },
  {
    id: 'mold-void',
    no: 3,
    title: 'Molding 뒤 보이드·균열 증가',
    process: 'molding',
    machine: 'molding',
    level: '중상',
    roles: ['공정기술', '품질관리', '자재관리'],
    headline: '몰딩한 패키지 내부에 기포(보이드)가 늘고, 일부는 균열까지 보입니다.',
    story:
      'Molding 공정 엔지니어입니다. 오후 검사에서 몰딩 패키지 내부 보이드가 갑자기 늘었고, 신뢰성 시험 시료 몇 개에서 균열이 보였다는 연락을 받았습니다. 설비 두 대 모두에서 나오고 있습니다.',
    table: {
      cols: ['확인 항목', '오전', '오후'],
      rows: [
        ['보이드 불량률', '0.2 %', '3.5 %'],
        ['불량 발생 설비', '-', 'A·B 두 대 모두'],
        ['EMC Lot', 'Lot 1', 'Lot 2 (점심 때 투입)'],
        ['금형 온도·램 속도·압력', '기준', '기준 (변경 없음)'],
      ],
    },
    facts: [
      'Lot 2 EMC는 냉동 보관고에서 꺼낸 뒤 상온에 평소보다 훨씬 오래 놓여 있었다는 기록이 있습니다.',
      '두 설비 조건 기록은 오전과 같습니다.',
      '와이어 쓸림·미충전은 늘지 않았습니다.',
    ],
    questions: [
      {
        id: 'q1',
        q: '가장 먼저 할 조치는?',
        points: [
          { text: 'Lot 2 EMC 사용을 멈추고, Lot 2로 몰딩한 제품을 Hold합니다.', cat: 'contain', basis: 'principle' },
          { text: '설비 두 대 모두 나쁘므로 설비 하나의 문제보다 공통 요인(자재)부터 막습니다.', cat: 'cause', basis: 'principle' },
        ],
      },
      {
        id: 'q2',
        q: '설비 두 대에서 동시에, 점심 이후부터 보이드가 늘었습니다. 원인 후보와 근거는?',
        points: [
          { text: '두 설비 공통이고 시작 시점이 EMC Lot 교체와 같으므로 EMC가 가장 유력합니다.', cat: 'cause', basis: 'principle' },
          { text: '태블릿이 먹은 습기가 열에 기화해 수지 속에 기포를 만들고, 나중에 균열로 이어질 수 있습니다.', cat: 'know', basis: 'rule:molding' },
          { text: '조건(온도·속도·압력)은 바뀌지 않았고 쓸림·미충전도 그대로라 설비 조건 원인은 가능성이 낮습니다.', cat: 'cause', basis: 'principle' },
        ],
      },
      {
        id: 'q3',
        q: '바로 쓸 수 있는 조치와, 근본 대책을 나눠서 써 보세요.',
        points: [
          { text: '바로: 보관 기준을 지킨 다른 EMC Lot으로 바꾸거나 EMC를 건조한 뒤 작업합니다.', cat: 'fix', basis: 'rule:molding' },
          { text: '근본: EMC를 꺼낸 시각과 상온 노출 시간을 관리하고, 기준을 넘으면 쓰지 않는 규칙을 만듭니다.', cat: 'verify', basis: 'principle' },
        ],
      },
      {
        id: 'q4',
        q: '"압력을 올리면 보이드가 줄지 않을까?"라는 제안에 대한 의견은?',
        points: [
          { text: '원인이 습기라면 압력으로는 근본 해결이 안 됩니다.', cat: 'fix', basis: 'principle' },
          { text: '압력이 지나치면 금형 틈으로 수지가 새는 플래시가 생길 수 있습니다.', cat: 'know', basis: 'rule:molding' },
        ],
      },
      {
        id: 'q5',
        q: 'Hold한 제품은 어떻게 처리하고, 해결을 어떻게 확인하시겠습니까?',
        points: [
          { text: 'Hold 제품 시료로 내부 보이드·균열을 검사해 결과에 따라 처리합니다.', cat: 'contain', basis: 'principle' },
          { text: '새 Lot 투입 뒤 여러 시간대 보이드 불량률이 오전 수준으로 돌아왔는지 확인합니다.', cat: 'verify', basis: 'principle' },
        ],
      },
    ],
    followups: [
      {
        title: '추가 현장 데이터: 다른 Lot 투입 결과',
        table: {
          cols: ['조건', '보이드 불량률'],
          rows: [
            ['Lot 3 (보관 기준 지킴)', '0.3 %'],
            ['Lot 2를 건조 후 사용', '0.6 %'],
          ],
        },
        q: '이 결과로 무엇을 결론 내릴 수 있고, Lot 2의 남은 재고는 어떻게 하시겠습니까?',
        points: [
          { text: '다른 Lot과 건조 후 결과가 모두 좋아졌으므로 Lot 2의 습기가 원인이라는 판단이 강해집니다.', cat: 'cause', basis: 'rule:molding' },
          { text: 'Lot 2 남은 재고는 건조 뒤 시험해 기준을 만족할 때만 쓰거나, 자재 담당과 협의해 처리합니다.', cat: 'fix', basis: 'principle' },
          { text: '보관고 출고·노출 시간 기록을 확인할 수 있게 자재 관리 절차를 고칩니다.', cat: 'verify', basis: 'principle' },
        ],
      },
    ],
  },
  {
    id: 'ft-yield',
    no: 4,
    title: 'Final Test 수율 급락',
    process: 'test',
    machine: 'test',
    level: '상',
    roles: ['테스트기술', '품질관리'],
    headline: '최종 테스트 수율이 한 시간 만에 크게 떨어졌습니다.',
    story:
      '테스트 공정 엔지니어입니다. 4개 소켓(사이트)으로 동시에 검사하는 핸들러에서 수율이 98 %에서 92 %로 떨어졌다는 알림이 왔습니다. 생산 관리팀은 출하 일정 때문에 빨리 정상화해 달라고 합니다.',
    table: {
      cols: ['사이트', '수율', '불량 중 "접촉 불량" 비율', '재검사 시 통과율'],
      rows: [
        ['Site 1', '98.1 %', '10 %', '-'],
        ['Site 2', '97.9 %', '12 %', '-'],
        ['Site 3', '88.4 %', '85 %', '82 %'],
        ['Site 4', '98.0 %', '9 %', '-'],
      ],
    },
    facts: ['불량은 Site 3에 몰려 있습니다.', 'Site 3 불량품을 다른 사이트로 다시 검사하면 대부분 통과합니다.', '검사 프로그램과 판정 기준은 최근 바뀌지 않았습니다.'],
    questions: [
      {
        id: 'q1',
        q: '데이터를 보고 가장 먼저 무엇을 하시겠습니까?',
        points: [
          { text: 'Site 3만 멈추고(또는 해당 사이트를 빼고) 나머지 사이트로 검사를 계속해 생산을 이어 갑니다.', cat: 'contain', basis: 'principle' },
          { text: 'Site 3에서 불량 판정된 제품은 버리지 않고 따로 모아 재검사 대상으로 둡니다.', cat: 'contain', basis: 'principle' },
        ],
      },
      {
        id: 'q2',
        q: '칩이 진짜 나쁜 것일까요, 검사 쪽 문제일까요? 근거와 원인 후보를 써 보세요.',
        points: [
          { text: '한 사이트에만 몰리고 재검사 통과율이 높아, 칩보다 Site 3 접촉 문제일 가능성이 큽니다.', cat: 'cause', basis: 'principle' },
          { text: '소켓 핀이 더럽거나 닳으면 단자와 제대로 맞닿지 않아 접촉 확인에서 걸립니다.', cat: 'know', basis: 'rule:test' },
          { text: '누르는 힘이 약하면 일부 단자가 떠서 좋은 칩도 가끔 불량으로 나옵니다.', cat: 'know', basis: 'rule:test' },
        ],
      },
      {
        id: 'q3',
        q: '"판정 기준을 조금 느슨하게 하면 수율이 바로 오른다"는 제안이 나왔습니다. 어떻게 답하시겠습니까?',
        points: [
          { text: '판정 기준을 느슨하게 하면 규격을 벗어난 칩도 통과해 불량품이 출하될 위험이 있습니다.', cat: 'know', basis: 'rule:test' },
          { text: '수율 문제는 원인(접촉)을 고쳐서 풀어야 하며, 기준은 규격대로 유지합니다.', cat: 'fix', basis: 'principle' },
        ],
      },
      {
        id: 'q4',
        q: 'Site 3에 어떤 조치를 하시겠습니까?',
        points: [
          { text: '소켓을 청소한 뒤 다시 시작합니다.', cat: 'fix', basis: 'rule:test' },
          { text: '누르는 힘이 설정대로인지 확인하고 적정으로 맞춥니다(너무 세면 단자가 눌릴 수 있음).', cat: 'know', basis: 'rule:test' },
        ],
      },
      {
        id: 'q5',
        q: '해결 확인과 재발 방지는 어떻게 하시겠습니까?',
        points: [
          { text: '조치 뒤 Site 3 수율과 접촉 불량 비율이 다른 사이트와 비슷한지 일정 수량 이상에서 확인합니다.', cat: 'verify', basis: 'principle' },
          { text: '사이트별 수율을 실시간으로 비교해 한 사이트만 떨어지면 알림이 오게 합니다.', cat: 'verify', basis: 'principle' },
          { text: '모아 둔 Site 3 불량품을 정상 사이트로 재검사해 양품은 살립니다.', cat: 'contain', basis: 'principle' },
        ],
      },
    ],
    followups: [
      {
        title: '추가 현장 데이터: 소켓 청소 뒤 경과',
        table: {
          cols: ['시점', 'Site 3 수율'],
          rows: [
            ['청소 직후', '97.6 %'],
            ['2시간 뒤', '95.0 %'],
            ['4시간 뒤', '91.2 %'],
          ],
        },
        q: '청소하면 좋아졌다가 다시 떨어집니다. 판단을 어떻게 바꾸고, 무엇을 하시겠습니까?',
        points: [
          { text: '오염만이 아니라 핀이 닳아 접촉이 금방 나빠지는 것으로 봅니다(청소로 잠시만 회복).', cat: 'cause', basis: 'rule:test' },
          { text: '닳은 핀에 세게 누르면 단자 손상이 생길 수 있으므로 힘을 올려 버티지 말고 소켓(핀)을 교체합니다.', cat: 'fix', basis: 'rule:test' },
          { text: '검사 횟수 기준으로 소켓 청소·교체 주기를 정해 관리합니다.', cat: 'verify', basis: 'principle' },
        ],
      },
    ],
  },
  {
    id: 'claim-sweep',
    no: 5,
    title: '고객사 불량 클레임 (와이어 쇼트)',
    process: 'molding',
    machine: 'molding',
    level: '상',
    roles: ['품질관리', '공정기술', '고객 대응'],
    headline: '고객사에서 우리 패키지가 기판 실장 뒤 쇼트(단락) 불량이라고 연락했습니다.',
    story:
      '품질 엔지니어입니다. 고객사가 지난주 받은 특정 Lot에서 쇼트 불량이 평소보다 많이 나왔다며 원인과 대책을 요구했습니다. 돌려받은 시료를 X-ray로 보니 옆 와이어끼리 닿아 있는 것이 보입니다.',
    table: {
      cols: ['확인 항목', '내용'],
      rows: [
        ['고객 불량률', '평소의 약 8배 (교육용 가상 수치)'],
        ['반품 시료 X-ray', '와이어가 한쪽으로 기울어 옆 와이어와 닿음'],
        ['문제 Lot의 몰딩 설비', 'B 설비'],
        ['B 설비 변경 기록', '2주 전 생산성 향상을 위해 램(수지를 미는) 속도 상향'],
        ['같은 기간 A 설비 제품', '고객 불량 없음'],
      ],
    },
    facts: ['와이어 본딩 공정 기록에는 특이 사항이 없습니다.', '출하 전 테스트에서는 일부만 걸러졌습니다(닿을락 말락 한 경우는 통과).', '공장과 창고에 같은 기간 B 설비 제품 재고가 남아 있습니다.'],
    questions: [
      {
        id: 'q1',
        q: '고객 연락을 받은 직후 가장 먼저 할 일은?',
        points: [
          { text: '공장·창고에 있는 같은 기간 B 설비 제품의 출하를 멈추고 Hold합니다.', cat: 'contain', basis: 'principle' },
          { text: '고객에게 받은 사실을 알리고, 고객 쪽 남은 재고를 어떻게 선별할지 협의합니다.', cat: 'contain', basis: 'principle' },
          { text: '영향 범위(어느 설비·기간·Lot)를 기록으로 좁힙니다.', cat: 'cause', basis: 'principle' },
        ],
      },
      {
        id: 'q2',
        q: '원인으로 무엇을 의심하고, 그 근거는?',
        points: [
          { text: '수지가 너무 빠르게 흐르면 가는 와이어가 밀려 옆 와이어와 닿습니다(와이어 쓸림).', cat: 'know', basis: 'rule:molding' },
          { text: '불량 시작 시점·설비가 램 속도를 올린 B 설비와 맞고, A 설비는 정상이라 램 속도 변경이 유력합니다.', cat: 'cause', basis: 'principle' },
          { text: '와이어 본딩 기록은 정상이라 본딩 자체보다 몰딩 흐름 쪽을 먼저 봅니다.', cat: 'cause', basis: 'principle' },
        ],
      },
      {
        id: 'q3',
        q: '임시 대책과 근본 대책을 나눠서 써 보세요.',
        points: [
          { text: '임시: B 설비 램 속도를 적정으로 되돌리고, Hold 재고는 X-ray 등으로 선별합니다.', cat: 'fix', basis: 'rule:molding' },
          { text: '근본: 생산성 때문에 조건을 바꿀 때 품질 영향(와이어 쓸림)을 미리 검증하고 승인받는 변경 관리 절차를 지킵니다.', cat: 'verify', basis: 'principle' },
          { text: '긴 와이어 제품은 흐름에 더 쉽게 밀리므로 제품별 램 속도 한계를 정합니다.', cat: 'know', basis: 'rule:molding' },
        ],
      },
      {
        id: 'q4',
        q: '테스트에서 왜 다 걸러지지 않았을까요? 출하 검사를 어떻게 보완하시겠습니까?',
        points: [
          { text: '와이어가 아주 가깝지만 닿지 않은 경우는 전기 검사에서 통과했다가 나중에 닿을 수 있습니다.', cat: 'know', basis: 'principle' },
          { text: '원인을 고칠 때까지(그리고 확인 기간 동안) 와이어 쓸림 X-ray 시료 검사를 늘립니다.', cat: 'verify', basis: 'principle' },
        ],
      },
      {
        id: 'q5',
        q: '고객에게 보낼 보고에는 무엇이 들어가야 할까요?',
        points: [
          { text: '현상과 영향 범위, 확인한 원인과 그 근거 데이터를 씁니다.', cat: 'cause', basis: 'principle' },
          { text: '임시 대책(출하 중지·선별)과 근본 대책(조건 복원·변경 관리), 효과 확인 계획과 일정을 씁니다.', cat: 'verify', basis: 'principle' },
        ],
      },
    ],
    followups: [
      {
        title: '추가 현장 데이터: 램 속도 복원 뒤 확인',
        table: {
          cols: ['조건', '와이어 쓸림 X-ray 불량'],
          rows: [
            ['B 설비, 올린 램 속도', '시료 중 다수에서 쓸림 큼'],
            ['B 설비, 원래 램 속도', 'A 설비와 비슷한 수준'],
          ],
        },
        q: '생산팀이 "원래 속도로 돌리면 생산량이 줄어든다"고 합니다. 어떻게 조율하시겠습니까?',
        points: [
          { text: '품질이 우선이므로 원래 속도로 생산하고, 생산성 개선은 다른 방법으로 찾습니다.', cat: 'fix', basis: 'rule:molding' },
          { text: '속도를 올리고 싶다면 단계별 소량 시험으로 쓸림 한계를 확인한 뒤 승인받아 바꿉니다.', cat: 'verify', basis: 'principle' },
          { text: '런너 균형처럼 캐비티마다 채워지는 속도 차이를 줄이는 개선도 함께 검토합니다.', cat: 'know', basis: 'rule:molding' },
        ],
      },
    ],
  },
]

export const findScenario = (id) => SCENARIOS.find((s) => s.id === id)
