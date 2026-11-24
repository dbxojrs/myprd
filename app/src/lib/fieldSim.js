import { createStore, useStore } from './sharedStore.js'

// 현장 실무 훈련(분기형 시나리오) 엔진. 시나리오는 data/fieldCases/*.js 데이터로만 정의하고,
// 진행·채점은 이 파일의 정해진 규칙으로만 계산합니다(AI·무작위 없음). API 키 없이 동작합니다.
//
// 시나리오 노드(nodes) 종류
//   brief       상황 전달(보고·상태·표·사실) → next
//   choice      선택(multi: 여러 개 / 아니면 하나). 선택지 { id, text, score: {기준: 점수}, tone: good|warn|bad, log, feedback, next }
//               하나 고르기에서는 선택지의 next가 분기를 정합니다(없으면 노드의 next).
//   data        데이터 수집. items { id, label, group, cost(가상 분), score, key, result, note }, budget(가상 분)
//   hypothesis  가설 고르기 + 근거 데이터 고르기. options { id, text, correct, support[], refute[], feedback }, score { correct, retry, evidenceEach, evidenceMax }
//   quiz        객관식 점검. questions { id, prompt, choices, answer, points, explain } (틀리면 오답 노트로)
//   outcome     조치 결과(가상 데이터 표·교훈) → next
//   end         평가
// 점수: 기준(rubric)마다 선택지·데이터·가설·퀴즈 점수를 더한 뒤 0~배점으로 자릅니다.

export const fieldStore = createStore('tutor.field', {})
export const HINT_PENALTY = 2
export const useField = () => useStore(fieldStore)

// mode: 'practice'(연습: 힌트·피드백 바로) | 'exam'(평가: 결과 전 피드백 숨김, 힌트 감점), timed: 제한 시간 적용
export function newRun(c, { mode = 'practice', timed = false } = {}) {
  return {
    mode,
    timed,
    started: false, // 모드를 고르고 출동하면 true
    hypotheses: [], // 내 가설 목록 { id, text, for: [데이터 id], against: [데이터 id], status: 'open'|'supported'|'rejected', memo }
    node: c.start,
    path: [c.start],
    picks: {}, // { 노드 id: [선택지 id…] } (하나 고르기는 고른 순서대로 쌓임)
    viewed: [], // 확인한 데이터 id
    time: 0,
    hypo: { pick: null, tries: 0, evidence: [], solved: false },
    quiz: {}, // { 문제 id: 고른 번호 }
    essays: {},
    hints: {}, // { 노드 id: 본 힌트 단계 수 }
    log: [], // { t: 가상 분, text, tone }
    submitted: {}, // { 노드 id: true } 제출해 피드백을 본 노드
    startedAt: new Date().toISOString(),
  }
}

export function saveRun(caseId, run) {
  fieldStore.set((all) => ({ ...all, [caseId]: { ...(all[caseId] ?? {}), run } }))
}

export function finishRun(caseId, run, result) {
  fieldStore.set((all) => {
    const prev = all[caseId] ?? {}
    const attempt = { at: new Date().toISOString(), total: result.total, cats: Object.fromEntries(result.rows.map((r) => [r.id, r.score])), hints: result.hintCount }
    return { ...all, [caseId]: { ...prev, run: { ...run, done: true }, attempts: [attempt, ...(prev.attempts ?? [])].slice(0, 20), best: Math.max(prev.best ?? 0, result.total) } }
  })
}

export function resetRun(caseId) {
  fieldStore.set((all) => ({ ...all, [caseId]: { ...(all[caseId] ?? {}), run: null } }))
}

const add = (acc, score = {}) => {
  for (const [k, v] of Object.entries(score)) acc[k] = (acc[k] ?? 0) + v
}

// 규칙대로 점수 계산 + 평가에 쓸 판단 목록
export function evaluate(c, run) {
  const raw = {}
  const good = []
  const risky = []
  for (const [nodeId, ids] of Object.entries(run.picks)) {
    const node = c.nodes[nodeId]
    if (!node?.options) continue
    for (const id of ids) {
      const o = node.options.find((x) => x.id === id)
      if (!o) continue
      add(raw, o.score)
      const item = { node: node.title, text: o.text, feedback: o.feedback }
      if (o.tone === 'good') good.push(item)
      else if (o.tone === 'bad' || o.tone === 'warn') risky.push({ ...item, tone: o.tone })
    }
  }
  // 데이터 수집
  const dataNode = Object.values(c.nodes).find((n) => n.type === 'data')
  const missed = []
  if (dataNode) {
    for (const it of dataNode.items) {
      if (run.viewed.includes(it.id)) add(raw, it.score)
      else if (it.key) missed.push({ label: it.label, note: it.note })
    }
  }
  // 가설
  const hypoNode = Object.values(c.nodes).find((n) => n.type === 'hypothesis')
  if (hypoNode && run.hypo.solved) {
    const right = hypoNode.options.find((o) => o.correct)
    const s = hypoNode.score
    // 최종 고른 가설이 맞을 때만 점수(첫 시도 만점, 두 번째 절반). 평가 모드는 한 번만 제출합니다.
    const ok = run.hypo.pick === right.id
    raw.cause = (raw.cause ?? 0) + (!ok ? 0 : run.hypo.tries <= 1 ? s.correct : run.hypo.tries === 2 ? s.retry : 0)
    // 근거 점수는 맞는 가설을 골랐을 때만(틀린 원인을 뒷받침한 근거에는 주지 않음)
    const ev = ok ? run.hypo.evidence.filter((id) => right.support.includes(id)).length : 0
    raw.cause += Math.min(s.evidenceMax, ev * s.evidenceEach)
    if (!ok) risky.push({ node: hypoNode.title, text: `원인 가설이 맞지 않았습니다: ${hypoNode.options.find((o) => o.id === run.hypo.pick)?.text ?? '-'}`, feedback: right.feedback, tone: 'bad' })
    else if (run.hypo.tries > 1) risky.push({ node: hypoNode.title, text: `처음 고른 가설이 틀렸습니다(시도 ${run.hypo.tries}번)`, tone: 'warn' })
  }
  // 퀴즈
  for (const n of Object.values(c.nodes).filter((x) => x.type === 'quiz'))
    for (const q of n.questions) {
      const a = run.quiz[q.id]
      if (a === q.answer) raw.know = (raw.know ?? 0) + q.points
      else if (a !== undefined) risky.push({ node: n.title, text: `${q.prompt} → "${q.choices[a]}"`, feedback: q.explain, tone: 'warn' })
    }
  // 시간 규칙: 평가 모드 + 제한 시간을 켠 경우에만, 사건별 규칙대로 감점(실패 처리 아님)
  const overtime = run.mode === 'exam' && run.timed && c.timeLimit && run.time > c.timeLimit
  if (overtime && c.timeRule) {
    raw[c.timeRule.cat] = (raw[c.timeRule.cat] ?? 0) - c.timeRule.penalty
    risky.push({ node: '가상 시간', text: `제한 시간 초과 (${run.time}분 / ${c.timeLimit}분)`, feedback: c.timeRule.text, tone: 'warn' })
  }
  const rows = c.rubric.map((r) => ({ ...r, raw: raw[r.id] ?? 0, score: Math.max(0, Math.min(r.points, raw[r.id] ?? 0)) }))
  const hintCount = Object.values(run.hints).reduce((s, n) => s + n, 0)
  // 평가 모드에서 힌트를 쓰면 1단계마다 2점 감점(연습 모드는 기록만)
  const hintPenalty = run.mode === 'exam' ? hintCount * HINT_PENALTY : 0
  const sum = rows.reduce((s, r) => s + r.score, 0)
  const checks = (c.checks ?? []).map((k) => ({ q: k.q, ok: checkRule(k.rule, run) }))
  return { rows, subtotal: sum, hintPenalty, total: Math.max(0, sum - hintPenalty), good, risky, missed, hintCount, overtime, checks }
}

export const grade = (total) => (total >= 85 ? { label: '현장 투입 가능', tone: 'ok' } : total >= 65 ? { label: '보완 필요', tone: 'warn' } : { label: '다시 연습', tone: 'bad' })

// 오늘의 현장 실무 훈련 추천: 진행 중 → 이론을 끝낸 공정의 안 푼 시나리오 → 안 푼 시나리오 → 점수가 가장 낮은 시나리오
export function recommendCase(cases, field, completed = []) {
  if (!cases.length) return null
  const st = (c) => field[c.id]
  return (
    cases.find((c) => st(c)?.run && !st(c).run.done) ??
    cases.find((c) => st(c)?.best == null && completed.includes(c.process)) ??
    cases.find((c) => st(c)?.best == null) ??
    [...cases].sort((a, b) => (st(a)?.best ?? 0) - (st(b)?.best ?? 0))[0]
  )
}

// 판단 점검 규칙: picked/notPicked('노드.선택지'), viewedAny(데이터 id), evidenceMin(가설 근거 수)
export function checkRule(rule, run) {
  const has = (key) => {
    const [n, o] = key.split('.')
    return (run.picks[n] ?? []).includes(o)
  }
  if (rule.picked && !rule.picked.every(has)) return false
  if (rule.notPicked && rule.notPicked.some(has)) return false
  if (rule.viewedAny && !rule.viewedAny.some((id) => run.viewed.includes(id))) return false
  if (rule.evidenceMin && (run.hypo?.evidence?.length ?? 0) < rule.evidenceMin) return false
  return true
}
