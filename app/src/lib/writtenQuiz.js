import { processes, findProcess, STAGES, STAGE_ORDER } from '../data/processes.js'
import { wholeFlow } from '../data/packages.js'

// 심화 주관식 문제. 객관식(lib/quiz.js)처럼 공정 데이터(processes.js)에 있는 내용만으로 만듭니다.
// 채점은 정해진 규칙으로만 합니다(AI·무작위 값 아님).
//  - 단답형: 띄어쓰기·대소문자·괄호를 무시하고, 정답 이름이나 다른 이름(aliases)과 같으면 정답
//  - 서술형: 모범 답안의 핵심어가 내 답에 몇 개 들어 있는지 세어 보여 주고, 최종 판정은 직접(또는 AI로) 합니다.

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

// 비교용으로 글을 다듬습니다: 소문자, 띄어쓰기·문장부호·괄호 제거
export const norm = (text = '') =>
  String(text)
    .toLowerCase()
    .replace(/[\s·・,.()[\]{}'"“”‘’\-_/~!?:;]/g, '')

// "1차 본딩 (볼 본드)" → ["1차 본딩 (볼 본드)", "1차 본딩", "볼 본드"]
function nameVariants(name) {
  const out = new Set([name])
  const m = name.match(/^(.*?)\s*\((.*)\)\s*$/)
  if (m) {
    out.add(m[1])
    for (const part of m[2].split(/[,/·]/)) out.add(part.trim())
  }
  return [...out].filter((v) => norm(v).length >= 2)
}

const processNames = (p) => [p.name.ko, p.name.en, ...(p.aliases ?? [])]
const both = (name) => (name.en && name.en !== name.ko ? `${name.ko} (${name.en})` : name.ko)
const mainProcesses = () => processes.filter((p) => STAGES[p.stage])

// 핵심 포인트 제목 중 "답으로 쓸 만한 이름"만 고릅니다(예: 캐필러리). "초음파의 역할" 같은 제목은 뺍니다.
const isNameLike = (title) => title.length <= 12 && !/(의\s|역할|이유|왜|방법|차이|관계|조건|중요|원리|교체|깊이|무엇|다른|재료|면$|[와과]\s)/.test(title)

function blank(text, words) {
  let out = text
  for (const w of words) if (norm(w).length >= 2) out = out.split(w).join('＿＿')
  return out
}

function questionsFor(p, flow) {
  const out = []
  const topic = p.stage
  const ref = { kind: 'process', id: p.id }
  const title = both(p.name)

  if (p.summary)
    out.push({
      id: `w-name-${p.id}`,
      kind: 'short',
      type: '공정 이름 쓰기',
      topic,
      prompt: `다음 설명에 해당하는 공정 이름을 쓰세요.\n“${blank(p.summary, processNames(p))}”`,
      accept: processNames(p),
      answerText: title,
      explain: p.summary,
      ref,
    })

  const at = flow.indexOf(p.id)
  if (at >= 0 && at < flow.length - 1) {
    const next = findProcess(flow[at + 1])
    out.push({
      id: `w-next-${p.id}`,
      kind: 'short',
      type: '다음 공정 쓰기',
      topic,
      prompt: `“${title}” 바로 다음에 하는 공정 이름을 쓰세요. (기본 패키지 흐름 기준)`,
      accept: processNames(next),
      answerText: both(next.name),
      explain: `${p.name.ko} → ${next.name.ko}. ${next.summary ?? ''}`,
      ref,
    })
  }

  ;(p.steps ?? []).forEach((s, i) => {
    if (!s.desc || nameVariants(s.name).length === 0) return
    out.push({
      id: `w-step-${p.id}-${i}`,
      kind: 'short',
      type: '세부 단계 쓰기',
      topic,
      prompt: `[${p.name.ko}] 다음 설명에 해당하는 세부 단계의 이름을 쓰세요.\n“${blank(s.desc, nameVariants(s.name))}”`,
      accept: nameVariants(s.name),
      answerText: s.name,
      explain: `${i + 1}단계 ${s.name}: ${s.desc}`,
      ref,
    })
  })

  ;(p.keyPoints ?? []).forEach((k, i) => {
    if (!k.title || !k.body || !isNameLike(k.title)) return
    const variants = nameVariants(k.title)
    out.push({
      id: `w-key-${p.id}-${i}`,
      kind: 'short',
      type: '핵심 개념 쓰기',
      topic,
      prompt: `[${p.name.ko}] 빈칸(＿＿)에 들어갈 말이자 아래 설명이 가리키는 것을 쓰세요.\n“${blank(k.body, variants)}”`,
      accept: variants,
      answerText: k.title,
      explain: `${k.title}: ${k.body}`,
      ref,
    })
  })

  // 서술형 1: 세부 단계를 순서대로 설명하기 (핵심어 = 단계 이름)
  if ((p.steps ?? []).length >= 3)
    out.push({
      id: `w-essay-steps-${p.id}`,
      kind: 'essay',
      type: '서술형 · 과정 설명',
      topic,
      prompt: `“${title}” 공정이 어떤 순서로 진행되는지 세부 단계를 차례대로 설명하세요. 무엇이 들어가 무엇이 나오는지도 함께 쓰세요.`,
      keywords: p.steps.map((s) => ({ label: s.name, variants: nameVariants(s.name) })),
      model: [
        p.input && p.output ? `${p.input} → ${p.output}` : null,
        ...p.steps.map((s, i) => `${i + 1}. ${s.name}: ${s.desc}`),
      ].filter(Boolean),
      explain: p.summary,
      ref,
    })

  // 서술형 2: 핵심 포인트를 자기 말로 설명하기 (핵심어 = 그 공정의 용어 중 본문에 나오는 것)
  ;(p.keyPoints ?? []).forEach((k, i) => {
    if (!k.title || !k.body || k.body.length < 40) return
    const terms = (p.terms ?? []).filter((t) => k.body.includes(t.ko) || (t.en && k.body.toLowerCase().includes(t.en.toLowerCase())))
    out.push({
      id: `w-essay-key-${p.id}-${i}`,
      kind: 'essay',
      type: '서술형 · 원리 설명',
      topic,
      prompt: `[${p.name.ko}] “${k.title}”에 대해 아는 대로 설명하세요. 왜 그런지(원리·이유)까지 쓰면 좋습니다.`,
      keywords: terms.map((t) => ({ label: t.ko, variants: [t.ko, t.en].filter(Boolean) })),
      model: [k.body],
      explain: `${k.title}: ${k.body}`,
      ref,
    })
  })
  return out
}

export const WRITTEN_SCOPES = [{ id: 'all', label: '공정 전체' }, ...STAGE_ORDER.map((s) => ({ id: s, label: STAGES[s].name.ko }))]

export const WRITTEN_KINDS = [
  { id: 'mix', label: '섞어서' },
  { id: 'short', label: '단답형만' },
  { id: 'essay', label: '서술형만' },
]

export function allWritten() {
  const flow = wholeFlow(null)
  return mainProcesses().flatMap((p) => questionsFor(p, flow))
}

export function makeWritten({ scope = 'all', kind = 'mix', count = 10, seed = 1 }) {
  const pool = allWritten().filter((q) => (scope === 'all' || q.topic === scope) && (kind === 'mix' || q.kind === kind))
  return shuffle(pool, rng(seed * 104729 + 3)).slice(0, count)
}

// 단답형 채점: 다듬은 글이 정답 후보 중 하나와 같으면 정답
export function gradeShort(q, answer) {
  const a = norm(answer)
  return a.length > 0 && q.accept.some((v) => norm(v) === a)
}

// 서술형 핵심어 검사: 각 핵심어(또는 다른 이름)가 답에 들어 있는지
export function checkKeywords(q, answer) {
  const a = norm(answer)
  return q.keywords.map((k) => ({ label: k.label, hit: k.variants.some((v) => norm(v).length >= 2 && a.includes(norm(v))) }))
}

export const writtenTopicLabel = (topic) => WRITTEN_SCOPES.find((s) => s.id === topic)?.label ?? topic
