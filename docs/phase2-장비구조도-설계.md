# Phase 2 설계: 시나리오 장비 구조도 (인터랙티브 2D)

> 상태: 설계 (구현 전) · 작성 2026-11-24 · 대상: 현장 실무 훈련(`components/field/FieldSim.jsx`)

## 1. 목표

실무 시나리오를 풀 때 "지금 확인하는 데이터가 장비의 어디와 관련되는지"를 그림으로 보여 줍니다.
- 시나리오 화면 오른쪽 패널에 **장비 구조** 탭을 추가합니다.
- 데이터 항목(예: Capillary 팁 관찰)을 확인하면 해당 부위가 강조되고, 확대 보기·역할·관찰 포인트가 함께 나옵니다.

## 2. 재사용할 기존 자산 (새로 그리지 않음)

| 자산 | 위치 | 이미 되는 것 |
|---|---|---|
| 장비 입체 도식 14종 | `components/equipment/*Iso.jsx` (레지스트리 `components/equipment/index.js`의 ISO) | `focus`(부위 강조), `onPick`(부위 클릭), `tags`(이름표), 부위 좌표 `ANCHORS` |
| 장비 결과물 그림 | `components/equipment/*Result.jsx` (RESULT) | 조건별 결과물 확대 그림 |
| 부위 설명·출처 | `data/equipment/*.js` 의 `modules: [{ id, name, desc, src }]`, `sources` | 출처로 확인한 부위만 들어 있음, 검수 전 표시 |
| 설비 실습 화면 | `components/MachineSim.jsx` | 같은 그림으로 조작 실습 |

와이어 본더 부위 id(그림 = 데이터 일치): `bondhead`(본드 헤드·트랜스듀서) · `capillary` · `efo` · `spool`(와이어 공급) · `heat`(가열부) · `strip`(스트립).
`WireBonderIso.jsx` 머리 주석대로, 출처로 확인 못 한 부위(히트 블록·윈도 클램프·매거진 핸들러 등)는 그리지 않은 **교육용 도식**입니다.

## 3. 데이터 구조 추가 (시나리오 쪽만, 기존 데이터 변경 없음)

```js
// data/fieldCases/pkg-001-wire-bond.js
equipment: {
  name: '와이어 본더 2호기',
  kind: 'wire-bond',            // components/equipment ISO 키 = data/equipment 키
  diagram: 'iso',               // 'iso'(기존 도식) | 'figure'(시나리오 전용 그림) | 'placeholder'
},
// 데이터 항목마다 관련 부위와 관찰 포인트
items: [
  { id: 'capscope', …, parts: ['capillary'],
    observe: { normal: '팁 구멍 주변이 깨끗하고 모서리가 고름', abnormal: '팁 끝 이물·마모' },  // 교육용 관찰 포인트(시나리오 가정)
  },
  { id: 'recipe', …, parts: ['bondhead', 'heat'] },   // 하중·초음파(헤드), 온도(가열부)
  { id: 'fracture', …, figure: 'shear-test' },          // 장비 그림에 없는 검사 → 별도 그림
]
```

- `parts`는 반드시 `data/equipment/<kind>.js`의 `modules[].id` 중 하나만 씁니다. `npm run check-content`에 검사를 추가합니다.
- `observe`는 시나리오의 교육용 가정입니다. 화면에 "시나리오 가정" 표시를 붙입니다.

### 시각 자료 메타데이터 (요청서 16장)

```js
// data/visuals.js (신규) — 장비 사진·검사 그림·도식 공통 목록
{ id: 'shear-test', title: 'Ball Shear 시험 원리', process: 'wire-bond',
  type: 'figure',                 // photo | figure | diagram
  origin: 'edu-diagram',          // real-photo | edu-diagram | ai-generated
  source: null, license: '자체 제작', reviewed: false, updated: '2026-11-24',
  component: 'ShearTestFigure' }
```

화면에는 `origin`에 따라 다음 배지를 붙입니다.
- 🧩 교육용 도식
- 📷 실제 사진 (출처·라이선스 표시)
- 🤖 AI 생성 개념도: "검증된 장비 구조와 다를 수 있음"

## 4. 화면 설계

오른쪽 패널 탭: **확보한 데이터 · 장비 구조 · 현재 가설 · 선임 엔지니어** (장비 구조와 현재 가설은 Phase 2·3에서 추가)

```
┌ 장비 구조 ───────────────────────────────┐
│ [와이어 본더 2호기]  🧩 교육용 도식 · 검수 전   │
│ ┌──────────── ISO 그림 ─────────────┐      │
│ │   ① 본드 헤드   ② 캐필러리(강조)     │ [+][−][↺]│
│ │   ③ EFO   ④ 와이어 공급  ⑤ 가열부   │      │
│ └───────────────────────────────────┘      │
│ ② 캐필러리 — 역할(출처 있는 modules.desc)       │
│   관찰 포인트(시나리오 가정): 정상 … / 이상 …    │
│   관련 데이터: [Capillary 팁 관찰 ✓]           │
└────────────────────────────────────────┘
```

- **번호 마커**: 그림의 `ANCHORS` 좌표에 ①②③ 버튼을 겹쳐 놓습니다. 키보드 Tab으로 이동하고 Enter로 고릅니다. `aria-label`은 부위 이름으로 합니다.
- **확대·축소**: SVG `viewBox`를 바꿔 처리합니다(버튼과 휠, 모바일은 두 손가락). 기존 페이지 스크롤·확대와 충돌하지 않게, 휠은 그림 위에서 Ctrl을 누를 때만 받습니다.
- **연동**
  - 데이터를 확인하면 `focus = item.parts[0]`으로 바꿉니다.
  - 그림 위 부위를 누르면 해당 데이터 항목 카드로 스크롤합니다(평가 모드에서는 결과를 미리 보여 주지 않음).
- **정상·이상 비교**: `observe.normal`·`observe.abnormal`를 두 칸으로 나란히 보여 줍니다. 같은 장비의 RESULT 그림이 있으면 함께 씁니다.
- **장비 그림에 없는 검사**(Shear 시험 원리, 파괴면): `figure` 컴포넌트를 따로 둡니다. 출처를 확인하기 전까지는 🧩 교육용 도식으로 표시하거나 플레이스홀더를 씁니다.
- **모바일**: 오른쪽 패널이 아래로 내려가고, 탭 안에서 그림의 높이를 화면의 50%로 제한합니다.

## 5. 정확성 원칙

1. 부위 설명은 `data/equipment` 의 출처가 있는 `modules.desc`만 씁니다. 시나리오 파일에 장비 설명을 새로 쓰지 않습니다.
2. 특정 제조사·모델 사진은 출처와 라이선스(CC 등)를 확인한 것만 씁니다. 확인 못 하면 플레이스홀더를 둡니다.
3. 관찰 포인트·검사 결과는 "시나리오 가정"으로 표시합니다.
4. Shear 시험기 구조처럼 출처가 아직 없는 그림은, 출처를 찾기 전까지 원리 수준의 단순 도식만 그립니다.

## 6. 구현 순서와 예상 파일

1. `components/field/EquipmentPanel.jsx`: ISO 레지스트리 + `data/equipment` modules + 마커·확대·설명
2. 시나리오 데이터에 `parts`·`observe` 추가(PKG-001부터), check-content 검사 추가
3. 데이터 확인과 `focus` 연동, 부위 클릭으로 데이터 카드 찾아가기
4. `data/visuals.js` 메타데이터와 배지 컴포넌트
5. `ShearTestFigure` (교육용 도식, 출처 조사 후 확정)
6. FAB 시나리오(Phase 4)에서는 `CvdIso`·`EtchIso`·`PhotoIso`를 같은 방식으로 연결

## 7. 테스트 기준

- 데이터를 확인하면 부위 강조가 바뀌는지
- 마커를 키보드로 조작할 수 있는지
- 확대·축소가 페이지 스크롤과 충돌하지 않는지
- 평가 모드에서 결과가 미리 노출되지 않는지
- 모든 `parts` id가 실제 부위 id와 맞는지(자동 검사)
- 그림의 대체 텍스트, 다크·라이트 모드 대비, 모바일 높이
