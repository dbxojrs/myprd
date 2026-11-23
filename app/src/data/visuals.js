// 시각 자료 메타데이터(장비 도식·검사 그림·사진). 화면에서 자료 종류 배지와 출처·라이선스를 보여 줄 때 씁니다.
// origin: 'real-photo'(실제 사진) | 'edu-diagram'(교육용 도식) | 'ai-generated'(AI 생성 개념도)
// 실제 장비 사진은 출처·라이선스를 확인한 것만 넣습니다. 확인 못 한 그림은 교육용 도식으로 표시합니다.

export const ORIGIN_LABEL = {
  'real-photo': { icon: '📷', label: '실제 사진', note: '출처·라이선스를 확인한 사진입니다.' },
  'edu-diagram': { icon: '🧩', label: '교육용 도식', note: '이해를 돕기 위해 단순하게 그린 그림입니다. 실제 장비 모양·배치와 다를 수 있습니다.' },
  'ai-generated': { icon: '🤖', label: 'AI 생성 개념도', note: 'AI로 만든 개념도입니다. 검증된 장비 구조와 다를 수 있습니다.' },
}

export const VISUALS = {
  // 설비 실습과 같은 장비 입체 도식(components/equipment/*Iso.jsx)
  'equipment-iso': {
    title: '장비 입체 도식',
    type: 'diagram',
    origin: 'edu-diagram',
    source: '근거 노트 review/equipment-front.md · review/equipment-back.md에서 출처로 확인한 부위만 그렸습니다. 부위 설명의 출처는 부위마다 표시합니다.',
    license: '자체 제작',
    reviewed: false,
    updated: '2026-11-24',
  },
  'shear-test': {
    title: 'Ball Shear 시험 원리',
    process: 'wire-bond',
    type: 'figure',
    origin: 'edu-diagram',
    source: '원리 수준 도식(시험기 구조 아님). 설명 문장의 출처는 그림 아래에 표시합니다.',
    license: '자체 제작',
    reviewed: false,
    updated: '2026-11-24',
    // 설명 문장(문장마다 출처)
    notes: [
      { text: 'Ball Shear 시험은 볼 접합부의 접합 강도(Shear 강도)를 재는 시험입니다.', cite: ['oa-capillary-2021'] },
      { text: '볼과 패드가 맞닿은 면적이 클수록 Shear 강도가 커집니다.', cite: ['oa-capillary-2021'] },
      { text: '캐필러리의 형상(치수)이 볼 모양과 Shear 강도에 영향을 줍니다.', cite: ['oa-capillary-2021'] },
    ],
  },
}
