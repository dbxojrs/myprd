// 장비 소개 데이터(장비 둘러보기 · 조작 순서 · 결과물 · 용어). 키는 data/machines의 장비 id입니다.
// 근거 노트: review/equipment-front.md, review/equipment-back.md. 장비사·뉴스룸 자료는 "설명 출처"이며
// 시뮬레이션 판정의 근거로 쓰지 않습니다. 모두 검수 전입니다.
//
// 형식
//   kind: { ko, en } 장비 종류 · summary: 한 단락 소개
//   vendors: [{ name, products, note, src }] 출처에서 확인한 대표 장비사 · vendorNote: 확인 못 한 것
//   modules: [{ id, name: { ko, en }, desc, src }] 장비 부위. id는 장비 그림의 부위 id
//   operation: [{ id, who, at, lot, title, desc, terms?, src }] 조작 순서. at = 강조할 부위, lot = 로트가 있는 부위
//   outputs: { product, metrics: [], notes: [{ text, src }] }
//   terms: [{ id, ko, en, short, deep, src }] 더 알아보기 용어
//   sources: { key: { title, publisher, url, status } } status: 읽음 · PDF 추출 · 검색 요약 등
import oxidation from './oxidation.js'
import molding from './molding.js'
import marking from './marking.js'
import packageSaw from './packageSaw.js'
import test from './test.js'

const list = [oxidation, molding, marking, packageSaw, test]

export const EQUIPMENT = Object.fromEntries(list.map((e) => [e.id, e]))
