// 설비 규칙표(data/machines/*.js)의 출처 등급. 규칙표 출처는 { title, publisher, url }만 있어 발행처로 등급을 정합니다.
// PRD "정보 정확성 정책": 1순위(근거 출처) = 논문(학회지·저널·arXiv), 정부·공공 연구기관 보고서 / 2순위(설명 출처) = 대학 공개 강의, 업체 공식 자료.
// 2순위만 있는 판정에는 "설명 출처"라고 표시합니다(PRD 예외 규정: 교육용 시나리오·설비 규칙).

const EVIDENCE = /학회지|학회 논문|학회|Journal|Micromachines|Nanoscale|arXiv|NASA|NIST|Proceedings|Transactions/i

export const sourceTier = (src) => (src && EVIDENCE.test(`${src.publisher ?? ''} ${src.title ?? ''}`) ? 'evidence' : 'explain')
export const TIER_LABEL = { evidence: '근거 출처', explain: '설명 출처' }
