import { processes, findProcess, STAGES, STAGE_ORDER } from '../data/processes.js'
import { wholeFlow } from '../data/packages.js'
import { machines, SEVERITY } from '../data/machineSim.js'
import { QUESTION_BANK } from '../data/questionBank/index.js'

// 시험 문제 만들기. 공정 데이터(processes.js)와 장비 규칙표(data/machines)에 있는 내용만으로 문제를 만듭니다.
// 섞는 순서는 seed로 정해지는 의사 난수라서, 같은 seed면 언제나 같은 시험지가 나옵니다(AI·무작위 값 아님).

function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle(list, rand) {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

const ko = (name) => name.ko
const both = (name) => (name.en && name.en !== name.ko ? `${name.ko} (${name.en})` : name.ko)

// 정답 하나와 오답 후보에서 보기 4개를 만듭니다. 같은 글은 한 번만 씁니다.
function choicesOf(answer, pool, rand, n = 4) {
  const wrong = shuffle([...new Set(pool.filter((x) => x && x !== answer))], rand).slice(0, n - 1)
  if (wrong.length < 1) return null
  const choices = shuffle([answer, ...wrong], rand)
  return { choices, answer: choices.indexOf(answer) }
}

const mainProcesses = () => processes.filter((p) => STAGES[p.stage])

// 공정 문제
function processQuestions(rand) {
  const list = mainProcesses()
  const out = []
  const flow = wholeFlow(null)
  for (const p of list) {
    const sameStage = list.filter((q) => q.stage === p.stage && q.id !== p.id)
    const near = sameStage.length >= 3 ? sameStage : list.filter((q) => q.id !== p.id)
    const ref = { kind: 'process', id: p.id }
    const topic = p.stage

    if (p.summary) {
      const c = choicesOf(both(p.name), near.map((q) => both(q.name)), rand)
      if (c) out.push({ id: `sum-${p.id}`, type: '설명 → 공정', topic, prompt: `다음 설명에 해당하는 공정은?\n“${p.summary}”`, ...c, explain: p.summary, ref })
    }
    if (p.output) {
      const c = choicesOf(both(p.name), near.filter((q) => q.output && q.output !== p.output).map((q) => both(q.name)), rand)
      if (c) out.push({ id: `out-${p.id}`, type: '결과물', topic, prompt: `결과물이 “${p.output}”인 공정은?`, ...c, explain: `${ko(p.name)}: ${p.input ?? ''} → ${p.output}`, ref })
    }
    const c = choicesOf(ko(STAGES[p.stage].name), STAGE_ORDER.map((s) => ko(STAGES[s].name)), rand)
    if (c) out.push({ id: `stage-${p.id}`, type: '공정 단계', topic, prompt: `“${both(p.name)}”은(는) 어느 단계의 공정인가요?`, ...c, explain: `${ko(p.name)}은(는) ${ko(STAGES[p.stage].name)} 단계입니다. ${STAGES[p.stage].note}`, ref })

    const at = flow.indexOf(p.id)
    if (at >= 0 && at < flow.length - 1) {
      const next = findProcess(flow[at + 1])
      const c2 = choicesOf(both(next.name), flow.filter((id) => id !== next.id && id !== p.id).map((id) => both(findProcess(id).name)), rand)
      if (c2) out.push({ id: `next-${p.id}`, type: '공정 순서', topic, prompt: `“${both(p.name)}” 바로 다음 공정은? (기본 패키지 흐름 기준)`, ...c2, explain: `${ko(p.name)} → ${ko(next.name)}`, ref })
    }
    for (const term of p.terms ?? []) {
      const c3 = choicesOf(both(p.name), near.map((q) => both(q.name)), rand)
      if (c3) out.push({ id: `term-${p.id}-${term.en}`, type: '용어', topic, prompt: `“${both(term)}”은(는) 어느 공정에서 쓰는 용어인가요?`, ...c3, explain: `${both(term)} — ${ko(p.name)} 공정의 용어입니다.`, ref })
    }
  }
  return out
}

function conditionText(machine, when) {
  return Object.entries(when)
    .map(([key, levels]) => {
      const item = [...machine.conditions, ...machine.controls].find((c) => c.id === key)
      return `${item.name?.ko ?? item.label ?? key}: ${levels.map((l) => item.levels[l].label).join('/')}`
    })
    .join(' + ')
}

// 장비 상황 문제
function machineQuestions(rand) {
  const out = []
  for (const m of machines) {
    const ref = { kind: 'machine', id: m.id }
    const topic = `machine:${m.id}`
    m.rules.forEach((r, i) => {
      // 이 조건에서 함께 나타나는 다른 결과는 오답 보기로 쓰지 않습니다(정답이 둘이 되지 않게).
      const alsoTrue = (o) => Object.entries(o.when).every(([k, lv]) => r.when[k] && r.when[k].every((x) => lv.includes(x)))
      const c = choicesOf(r.title, m.rules.filter((o) => !alsoTrue(o)).map((o) => o.title), rand)
      if (c)
        out.push({
          id: `rule-${m.id}-${i}`,
          type: '조건 → 결과',
          topic,
          prompt: `[${m.name}] 조건이 “${conditionText(m, r.when)}”일 때 나타나는 결과는?`,
          ...c,
          explain: `${SEVERITY[r.severity].label} · ${r.title}\n원인: ${r.cause}`,
          ref,
        })
      if (r.cause) {
        const c2 = choicesOf(r.cause, m.rules.map((x) => x.cause), rand)
        if (c2) out.push({ id: `cause-${m.id}-${i}`, type: '원인 찾기', topic, prompt: `[${m.name}] “${r.title}”의 원인은?`, ...c2, explain: r.cause, ref })
      }
      if (r.fix) {
        const c3 = choicesOf(r.fix, m.rules.map((x) => x.fix), rand)
        if (c3) out.push({ id: `fix-${m.id}-${i}`, type: '조치', topic, prompt: `[${m.name}] “${r.title}”이(가) 나오면 어떻게 조치하나요?`, ...c3, explain: r.fix, ref })
      }
    })
  }
  return out
}

// 문제은행(직접 작성한 원리·이유 문제). 주제는 공정이면 그 공정의 단계, 기초(b-)·첨단 패키징(adv-)은 따로 묶습니다.
const bankTopic = (explainer) => findProcess(explainer)?.stage ?? (explainer.startsWith('b-') ? 'basics' : explainer.startsWith('adv-') ? 'adv' : 'back')
function bankQuestions(rand) {
  const out = []
  for (const bank of QUESTION_BANK) {
    const topic = bankTopic(bank.explainer)
    const ref = findProcess(bank.explainer) ? { kind: 'process', id: bank.explainer } : { kind: 'none' }
    for (const q of bank.questions) {
      // 객관식은 보기 순서를 섞고(같은 seed면 같은 순서), OX는 O·X 순서 그대로 둡니다.
      const choices = q.kind === 'ox' ? q.choices : shuffle(q.choices, rand)
      out.push({
        id: q.id,
        type: q.kind === 'ox' ? 'OX · 원리' : '원리 · 이유',
        topic,
        bank: true,
        prompt: q.prompt,
        choices,
        answer: choices.indexOf(q.choices[q.answer]),
        explain: q.explain,
        cite: q.cite,
        ref,
      })
    }
  }
  return out
}

// 시험 범위: 'all' | 'process' | 'machine' | 단계 id(front 등) | 'machine:<id>'
export const QUIZ_SCOPES = [
  { id: 'all', label: '전체' },
  { id: 'bank', label: '원리·이유 문제(문제은행)' },
  { id: 'process', label: '공정 전체' },
  { id: 'basics', label: '반도체 기초' },
  ...STAGE_ORDER.map((s) => ({ id: s, label: ko(STAGES[s].name) })),
  { id: 'adv', label: '첨단 패키징' },
  { id: 'machine', label: '장비 상황 전체' },
  ...machines.map((m) => ({ id: `machine:${m.id}`, label: m.name })),
]

export function allQuestions(seed = 1) {
  const rand = rng(seed)
  return [...processQuestions(rand), ...machineQuestions(rand), ...bankQuestions(rand)]
}

export function makeQuiz({ scope = 'all', count = 10, seed = 1 }) {
  const pool = allQuestions(seed).filter((q) => {
    if (scope === 'all') return true
    if (scope === 'bank') return q.bank
    if (scope === 'process') return !q.topic.startsWith('machine:')
    if (scope === 'machine') return q.topic.startsWith('machine:')
    return q.topic === scope
  })
  return shuffle(pool, rng(seed * 7919 + 1)).slice(0, count)
}

export function findQuestion(id, seed) {
  return allQuestions(seed).find((q) => q.id === id)
}

export function topicLabel(topic) {
  return QUIZ_SCOPES.find((s) => s.id === topic)?.label ?? topic
}
