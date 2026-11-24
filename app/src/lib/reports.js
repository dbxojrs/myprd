import { createStore, useStore } from './sharedStore.js'

// 엔지니어 보고서(8D · 5 Why · 피시본) 저장소. localStorage 'tutor.reports' = { list: [보고서…], open: 열린 보고서 id }
// 현장 시나리오를 끝내면 그 기록으로 초안을 채울 수 있습니다(reportFromRun). 채점·AI 없이 사람이 고쳐 씁니다.

export const reportsStore = createStore('tutor.reports', { list: [], open: null })
export const useReports = () => useStore(reportsStore)

// 8D 단계 이름은 널리 쓰이는 문제 해결 양식을 따른 것으로, 앱에서 출처를 확인하지 못했습니다(검수 전).
export const D8_STEPS = [
  { id: 'd1', label: 'D1 팀 구성', hint: '누가 함께 푸는가 (공정·설비·품질·생산 등 역할)' },
  { id: 'd2', label: 'D2 문제 기술', hint: '무엇이·어디서·언제·얼마나 — 해결책이 아니라 현상으로 적기' },
  { id: 'd3', label: 'D3 임시 조치(봉쇄)', hint: '원인 확인 전 확산을 막은 조치 (설비 중단, LOT Hold 등)' },
  { id: 'd4', label: 'D4 근본 원인', hint: '원인과 그것을 뒷받침·반증한 데이터' },
  { id: 'd5', label: 'D5 영구 대책 선정', hint: '원인을 직접 없애는 대책과 고른 이유' },
  { id: 'd6', label: 'D6 대책 실행·검증', hint: '실행 결과와 정상 복귀를 판단한 데이터' },
  { id: 'd7', label: 'D7 재발 방지', hint: '표준·절차·경고 등 시스템으로 막는 방법' },
  { id: 'd8', label: 'D8 종결·공유', hint: '배운 점, 공유 대상, 종결 판단' },
]

// 피시본 분류: CMS 예시 분류(장비·환경·절차·사람)를 공정용으로 넓힌 교육용 분류입니다.
export const FISH_CATS = [
  { id: 'machine', label: '설비', en: 'Machine' },
  { id: 'material', label: '자재', en: 'Material' },
  { id: 'method', label: '방법·조건', en: 'Method' },
  { id: 'measure', label: '측정·검사', en: 'Measurement' },
  { id: 'env', label: '환경', en: 'Environment' },
  { id: 'man', label: '사람·절차', en: 'Man' },
]

const GROUP_CAT = [
  [/설비|장비/, 'machine'],
  [/자재|재료/, 'material'],
  [/Recipe|흐름|공정/, 'method'],
  [/검사|측정|테스트|시험|계측/, 'measure'],
  [/환경|품질 데이터|온습도/, 'env'],
  [/작업|교대|사람/, 'man'],
]
export const catOfGroup = (group = '') => GROUP_CAT.find(([re]) => re.test(group))?.[1] ?? 'method'

const uid = () => `r${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

export function blankReport(title = '새 보고서') {
  const now = new Date().toISOString()
  return {
    id: uid(),
    title,
    caseId: null,
    createdAt: now,
    updatedAt: now,
    d8: Object.fromEntries(D8_STEPS.map((s) => [s.id, ''])),
    why: { problem: '', whys: ['', '', '', '', ''], roots: '', check: false },
    fish: { effect: '', items: [] }, // items: { id, cat, text, root: bool }
  }
}

export function addReport(r) {
  reportsStore.set((s) => ({ list: [r, ...s.list].slice(0, 50), open: r.id }))
  return r
}
export function updateReport(id, patch) {
  reportsStore.set((s) => ({ ...s, list: s.list.map((r) => (r.id === id ? { ...r, ...(typeof patch === 'function' ? patch(r) : patch), updatedAt: new Date().toISOString() } : r)) }))
}
export function deleteReport(id) {
  reportsStore.set((s) => ({ list: s.list.filter((r) => r.id !== id), open: s.open === id ? null : s.open }))
}
export const openReport = (id) => reportsStore.set((s) => ({ ...s, open: id }))

// 현장 시나리오 진행 기록 → 보고서 초안
export function reportFromRun(c, run) {
  const r = blankReport(`${c.id} ${c.title}`)
  const data = Object.values(c.nodes).find((n) => n.type === 'data')
  const hypoNode = Object.values(c.nodes).find((n) => n.type === 'hypothesis')
  const pickText = (nodeId) => (run.picks[nodeId] ?? []).map((id) => c.nodes[nodeId]?.options.find((o) => o.id === id)?.text).filter(Boolean)
  const label = (id) => data?.items.find((i) => i.id === id)?.label ?? id
  const pick = hypoNode?.options.find((o) => o.id === run.hypo?.pick)
  const goodOutcome = Object.values(c.nodes).find((n) => n.type === 'outcome' && n.tone === 'ok')
  r.caseId = c.id
  r.d8 = {
    d1: (c.roles ?? []).join(', '),
    d2: `${c.subtitle}\n${c.nodes.brief?.report ?? ''}`.trim(),
    d3: pickText('contain').map((t) => `- ${t}`).join('\n'),
    d4: [pick ? `원인: ${pick.text}` : '', ...(run.hypo?.evidence ?? []).map((id) => `- 근거: ${label(id)}`)].filter(Boolean).join('\n'),
    d5: [...pickText('action'), ...pickText('recover')].map((t) => `- ${t}`).join('\n'),
    d6: run.path?.some((n) => c.nodes[n]?.type === 'outcome' && c.nodes[n]?.tone === 'ok') && goodOutcome ? goodOutcome.text : '',
    d7: pickText('verify').map((t) => `- ${t}`).join('\n'),
    d8: '',
  }
  r.why.problem = c.subtitle
  r.fish.effect = c.title
  // 시나리오에 나온 원인 후보를 분류에 넣습니다(고른 가설은 근본 원인 표시).
  r.fish.items = (hypoNode?.options ?? []).map((o, k) => {
    const ref = o.refute?.[0] ?? o.support?.[0]
    const item = data?.items.find((i) => i.id === ref)
    return { id: `f${k}`, cat: catOfGroup(item?.group), text: o.text, root: o.id === run.hypo?.pick }
  })
  return r
}

export function reportMarkdown(r) {
  const lines = [`# ${r.title}`, '', r.caseId ? `> [!🧪|orange] ${r.caseId} 현장 시나리오(교육용 가상 사례)에서 만든 보고서` : '', '', '## 8D']
  for (const s of D8_STEPS) lines.push(`### ${s.label}`, r.d8[s.id]?.trim() || '-', '')
  lines.push('## 5 Why', `- 문제: ${r.why.problem || '-'}`)
  r.why.whys.forEach((w, i) => w.trim() && lines.push(`${i + 1}. 왜? ${w}`))
  lines.push(`- 근본 원인: ${r.why.roots || '-'}`, '', '## 피시본(특성 요인도)', `- 문제(결과): ${r.fish.effect || '-'}`)
  for (const cat of FISH_CATS) {
    const items = r.fish.items.filter((i) => i.cat === cat.id && i.text.trim())
    if (items.length) lines.push(`- **${cat.label}**`, ...items.map((i) => `  - ${i.root ? '★ ' : ''}${i.text}`))
  }
  return lines.filter((x, i, a) => !(x === '' && a[i - 1] === '')).join('\n')
}

// 작성 점검(규칙 기반, 채점 아님)
export function reportChecks(r) {
  const filled = (s) => (s ?? '').trim().length > 0
  const whyCount = r.why.whys.filter(filled).length
  return [
    { q: 'D2 문제 기술을 현상(무엇·어디서·언제·얼마나)으로 적었는가', ok: filled(r.d8.d2) && /\d/.test(r.d8.d2) },
    { q: 'D3 임시 조치(확산 방지)를 적었는가', ok: filled(r.d8.d3) },
    { q: 'D4 근본 원인과 근거 데이터를 함께 적었는가', ok: filled(r.d8.d4) && /근거|데이터|확인/.test(r.d8.d4) },
    { q: 'D6에 검증 결과(데이터)를 적었는가', ok: filled(r.d8.d6) },
    { q: 'D7 재발 방지를 시스템(표준·절차·경고)으로 적었는가', ok: /표준|절차|경고|기준|잠금|주기/.test(r.d8.d7 ?? '') },
    { q: '5 Why를 세 번 이상 물었는가', ok: whyCount >= 3 },
    { q: '"이 원인을 없애면 다시 생기지 않는가?"를 확인했는가', ok: !!r.why.check },
    { q: '피시본에 두 분류 이상 원인 후보를 적었는가', ok: new Set(r.fish.items.filter((i) => filled(i.text)).map((i) => i.cat)).size >= 2 },
  ]
}
