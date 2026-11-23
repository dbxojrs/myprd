import Anthropic from '@anthropic-ai/sdk'
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod'
import { z } from 'zod'
import { findProcess, STAGES } from '../data/processes.js'
import { machines } from '../data/machineSim.js'
import { getModel } from './aiModel.js'

// 선택 기능: 사용자가 직접 넣은 Claude API 키로 (1) 문제 해설을 더 깊게 듣고 (2) 추가 문제를 만듭니다.
// 이 앱에는 서버가 없어서 브라우저가 Claude API를 직접 부릅니다(dangerouslyAllowBrowser).
// 키는 그 사람의 브라우저에만 있고, 이 앱의 데이터(공정 설명·장비 규칙표)만 근거로 쓰게 합니다.
// AI 답은 화면에서 "AI 요약 · 출처 확인 권장"으로 표시합니다(PRD 5번).

// 모델은 사용자가 고릅니다(lib/aiModel.js). 안전 분류기가 요청을 거절하면 서버가 알맞은 다른 모델로 다시 시도합니다.
const FALLBACK = { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' }

export function client(apiKey) {
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
}

// 고른 모델이 effort·fallback 같은 옵션을 지원하지 않아 400이 나면, 그 옵션을 빼고 한 번 더 시도합니다.
async function withPlainRetry(call) {
  try {
    return await call(true)
  } catch (error) {
    if (!(error instanceof Anthropic.BadRequestError)) throw error
    try {
      return await call(false)
    } catch (again) {
      if (again instanceof Anthropic.BadRequestError)
        throw new Error(`이 모델(${getModel()})에서는 이 기능을 쓸 수 없습니다. 다른 모델을 고르세요. (${again.message})`)
      throw again
    }
  }
}

const SYSTEM = [
  'You are a semiconductor process tutor inside a Korean study app for students and new fab/OSAT engineers.',
  'Answer in Korean. Use the real terms used in Korean fabs, writing the English term in parentheses the first time (e.g. 식각(Etch), 레시피(Recipe)).',
  'Ground every statement in the APP DATA given in the user message. If the data does not support something, say "앱 자료에서 확인되지 않음" instead of guessing.',
  'Never invent numbers, vendor names, or sources that are not in the APP DATA.',
].join('\n')

// 공정·장비 데이터를 AI에게 넘길 글로 만듭니다(필요한 부분만).
function processContext(id) {
  const p = findProcess(id)
  if (!p) return ''
  const pick = { name: p.name, stage: STAGES[p.stage]?.name?.ko, summary: p.summary, input: p.input, output: p.output, steps: p.steps, terms: p.terms, keyPoints: p.keyPoints }
  return JSON.stringify(pick)
}

function machineContext(id) {
  const m = machines.find((x) => x.id === id)
  if (!m) return ''
  const items = [...m.conditions, ...m.controls].map((c) => ({ id: c.id, name: c.name, levels: c.levels.map((l) => l.label) }))
  const rules = m.rules.map((r) => ({ when: r.when, severity: r.severity, title: r.title, cause: r.cause, fix: r.fix }))
  return JSON.stringify({ name: m.name, sequence: m.sequence.map((s) => s.text), conditions: items, rules })
}

export function contextFor(ref) {
  return ref.kind === 'process' ? processContext(ref.id) : machineContext(ref.id)
}

function textOf(message) {
  return message.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n')
}

// 오류를 화면에 보여줄 한국어 문장으로 바꿉니다.
export function aiErrorText(error) {
  if (error instanceof Anthropic.AuthenticationError) return 'API 키가 맞지 않습니다. 키를 다시 확인하세요.'
  if (error instanceof Anthropic.PermissionDeniedError) return '이 키로는 이 모델을 쓸 권한이 없습니다.'
  if (error instanceof Anthropic.RateLimitError) return '요청이 많아 잠시 막혔습니다. 조금 뒤 다시 시도하세요.'
  if (error instanceof Anthropic.APIConnectionError) return '인터넷 연결 또는 브라우저 차단으로 API에 닿지 못했습니다.'
  if (error instanceof Anthropic.APIError) return `API 오류(${error.status ?? '알 수 없음'}): ${error.message}`
  return error?.message ?? '알 수 없는 오류'
}

// (1) 문제 하나를 더 깊게 설명합니다.
export async function explainDeeper({ apiKey, question, picked }) {
  const message = await withPlainRetry((full) => client(apiKey).beta.messages.create({
    model: getModel(),
    max_tokens: 16000,
    ...(full ? { ...FALLBACK, output_config: { effort: 'medium' } } : {}),
    system: SYSTEM,
    messages: [
      {
        role: 'user',
        content: [
          `APP DATA:\n${contextFor(question.ref)}`,
          `QUESTION: ${question.prompt}`,
          `CHOICES: ${question.choices.map((c, i) => `${i + 1}. ${c}`).join(' / ')}`,
          `CORRECT: ${question.answer + 1}`,
          picked !== null && picked !== undefined ? `STUDENT PICKED: ${picked + 1}` : '',
          '',
          '다음 순서로 짧은 단락 3~4개로 설명하세요: 왜 정답인지, 학생이 고른 보기가 왜 틀렸는지(골랐다면), 현장에서 이 상황을 어떻게 알아채고 확인하는지, 함께 외워 둘 용어 2~3개.',
        ].join('\n'),
      },
    ],
  }))
  if (message.stop_reason === 'refusal') throw new Error('AI가 이 요청에 답하지 않았습니다.')
  return textOf(message)
}

const Generated = z.object({
  questions: z.array(
    z.object({
      prompt: z.string(),
      choices: z.array(z.string()),
      answer: z.number().int(),
      explain: z.string(),
      basis: z.string(),
    }),
  ),
})

// (2) 고른 공정·장비 자료만으로 객관식 문제를 새로 만듭니다.
export async function generateQuestions({ apiKey, refs, count = 5, level = '실무' }) {
  const data = refs.map((ref) => contextFor(ref)).join('\n')
  const response = await withPlainRetry((full) => client(apiKey).beta.messages.parse({
    model: getModel(),
    max_tokens: 16000,
    ...(full ? FALLBACK : {}),
    output_config: { ...(full ? { effort: 'medium' } : {}), format: betaZodOutputFormat(Generated) },
    system: SYSTEM,
    messages: [
      {
        role: 'user',
        content: [
          `APP DATA:\n${data}`,
          '',
          `위 자료만 근거로 ${level} 수준의 4지선다 문제 ${count}개를 만드세요.`,
          '- 용어 암기보다 "이 조건이면 무슨 일이 생기나", "이 증상의 원인·조치는" 같은 상황 판단 문제를 우선합니다.',
          '- choices는 정확히 4개, answer는 정답의 0부터 시작하는 번호입니다. 정답이 하나만 맞도록 하세요.',
          '- explain은 한국어 2~3문장, basis에는 근거가 된 자료 문장을 그대로 옮기세요.',
        ].join('\n'),
      },
    ],
  }))
  if (response.stop_reason === 'refusal') throw new Error('AI가 이 요청에 답하지 않았습니다.')
  const parsed = response.parsed_output
  if (!parsed) throw new Error('AI 답을 문제 형식으로 읽지 못했습니다. 다시 시도하세요.')
  // 형식이 어긋난 문제는 버립니다.
  return parsed.questions.filter((q) => q.choices.length === 4 && q.answer >= 0 && q.answer < 4 && new Set(q.choices).size === 4)
}

const Graded = z.object({
  verdict: z.enum(['correct', 'partial', 'wrong']),
  score: z.number().int(),
  good: z.string(),
  missing: z.string(),
  feedback: z.string(),
})

// (3) 심화 주관식 답을 앱 자료(모범 답안) 기준으로 채점합니다. 화면에는 "AI 채점 · 참고용"으로 보여 줍니다.
export async function gradeWritten({ apiKey, question, answer }) {
  const response = await withPlainRetry((full) => client(apiKey).beta.messages.parse({
    model: getModel(),
    max_tokens: 8000,
    ...(full ? FALLBACK : {}),
    output_config: { ...(full ? { effort: 'low' } : {}), format: betaZodOutputFormat(Graded) },
    system: SYSTEM,
    messages: [
      {
        role: 'user',
        content: [
          `APP DATA:\n${contextFor(question.ref)}`,
          `QUESTION: ${question.prompt}`,
          `MODEL ANSWER (app data): ${(question.model ?? [question.answerText]).join(' / ')}`,
          `STUDENT ANSWER: ${answer}`,
          '',
          '학생 답을 모범 답안과 APP DATA만 기준으로 채점하세요. 표현이 달라도 뜻이 맞으면 인정합니다.',
          '- verdict: correct(핵심을 거의 다 맞게 씀) / partial(일부만 맞음) / wrong(핵심이 틀리거나 없음)',
          '- score: 0~100',
          '- good: 잘 쓴 점 한 문장, missing: 빠졌거나 틀린 점 한두 문장(없으면 "없음")',
          '- feedback: 다음에 더 잘 쓰려면 어떻게 하면 좋은지 한두 문장. 모두 한국어 합니다체.',
          'APP DATA에 없는 내용을 학생이 썼다면 맞다 틀리다 단정하지 말고 "앱 자료에서 확인되지 않음"이라고 적으세요.',
        ].join('\n'),
      },
    ],
  }))
  if (response.stop_reason === 'refusal') throw new Error('AI가 이 요청에 답하지 않았습니다.')
  const parsed = response.parsed_output
  if (!parsed) throw new Error('AI 채점 결과를 읽지 못했습니다. 다시 시도하세요.')
  return { ...parsed, score: Math.max(0, Math.min(100, parsed.score)) }
}

const PlanAdjust = z.object({
  order: z.array(z.string()),
  skip: z.array(z.string()),
  minutesPerDay: z.number().int().nullable(),
  days: z.array(z.number().int()).nullable(),
  note: z.string(),
})

// (4) 공부 일정 조정. 남은 단원 목록과 약한 범위를 주고, 학생의 요청대로 순서·뺄 단원·시간을 다시 정하게 합니다.
// 날짜별 배치는 앱이 규칙으로 다시 계산합니다(AI는 순서와 설정만 정함).
export async function adjustPlan({ apiKey, request, units, settings, weak }) {
  const response = await withPlainRetry((full) => client(apiKey).beta.messages.parse({
    model: getModel(),
    max_tokens: 8000,
    ...(full ? FALLBACK : {}),
    output_config: { ...(full ? { effort: 'low' } : {}), format: betaZodOutputFormat(PlanAdjust) },
    system: SYSTEM,
    messages: [
      {
        role: 'user',
        content: [
          `UNITS (남은 단원, 지금 순서): ${JSON.stringify(units.map((u) => ({ id: u.id, title: u.title, min: u.min, stage: u.stage })))}`,
          `SETTINGS: ${JSON.stringify({ goal: settings.goal, days: settings.days, minutesPerDay: settings.minutes })} (days: 0=일요일 … 6=토요일)`,
          `WEAK (자주 틀린 범위와 횟수): ${JSON.stringify(weak)}`,
          `STUDENT REQUEST: ${request}`,
          '',
          '학생 요청에 맞게 공부 일정을 조정하세요.',
          '- order: UNITS의 id를 새 순서로 모두 나열합니다(뺄 단원은 skip에). 목록에 없는 id를 만들지 마세요.',
          '- 기초가 먼저, 앞 공정이 뒤 공정보다 먼저인 흐름은 특별한 요청이 없으면 지킵니다.',
          '- minutesPerDay, days는 바꿀 필요가 있을 때만 값을 넣고, 아니면 null.',
          '- note: 무엇을 왜 바꿨는지 한국어 합니다체 2~3문장.',
        ].join('\n'),
      },
    ],
  }))
  if (response.stop_reason === 'refusal') throw new Error('AI가 이 요청에 답하지 않았습니다.')
  const parsed = response.parsed_output
  if (!parsed) throw new Error('AI 답을 일정 형식으로 읽지 못했습니다. 다시 시도하세요.')
  return parsed
}
