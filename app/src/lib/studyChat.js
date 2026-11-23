import { client, contextFor } from './aiTutor.js'
import { getModel } from './aiModel.js'
import { processes } from '../data/processes.js'

// 공부 도우미 챗봇. 사용자의 API 키와 고른 모델로, 지금 보는 공정·장비의 앱 자료만 근거로 답합니다.
// 답은 화면에서 "AI 요약 · 출처 확인 권장"으로 표시합니다(PRD 5번). 판정은 하지 않습니다(CLAUDE.md).

const SYSTEM = `당신은 "반도체 공정 튜터" 앱 안에 있는 공부 도우미입니다.
사용자는 반도체 전공 학생이거나 FAB·OSAT 신입 엔지니어이며, 지금 앱에서 특정 공정이나 설비를 공부하고 있습니다.

[근거]
- 사실에 관한 말은 모두 이 대화에 들어 있는 APP DATA(그리고 사용자가 보낸 NOTES)만 근거로 합니다.
- APP DATA로 뒷받침되지 않는 내용은 추측하지 말고 "앱 자료에서 확인되지 않음"이라고 말합니다.
  일반적인 배경 지식을 덧붙일 때는 반드시 "(일반 지식 · 앱 자료 밖)"이라고 표시합니다.
- 숫자, 장비 회사 이름, 논문·출처를 APP DATA에 없는 것으로 지어내지 않습니다.
- 설비나 라인의 정상/불량 판정은 하지 않습니다. 판정은 앱의 설비 실습 화면에서 규칙표로 확인하도록 안내합니다.
- NOTES는 학생이 쓴 메모라 틀릴 수 있습니다. APP DATA와 다르면 정중하게 바로잡습니다.

[말투와 형식]
- 한국어 합니다체로 씁니다. (예: "이 공정은 웨이퍼를 개별 다이로 자르는 단계입니다.")
- 현장 용어를 쓰고, 처음 나올 때만 영어를 괄호로 붙입니다. 예: 식각(Etch), 다이 어태치(Die Attach).
- 답은 짧게 씁니다: 기본 3~6문장 또는 항목 5개 이하. 화면이 작은 창이므로 표와 제목(#)은 쓰지 않고, 목록은 "- "로 씁니다.
  강조는 **굵게**만 씁니다. 더 알고 싶으면 이어서 질문하도록 안내합니다.
- 공정을 설명할 때는 가능하면 "앞 공정의 결과 → 이 공정의 조건 → 다음 공정에 주는 영향" 흐름으로 잇습니다.
- 필요하면 답 끝에 한 줄로 "다음에 볼 것: ○○"을 제안합니다(APP DATA에 있는 공정·용어만).

[하지 않을 것]
- 앱의 공부 범위(반도체 공정·설비·패키징)와 관계없는 요청은 짧게 거절하고 공부 주제로 돌립니다.
- 시험 정답만 달라는 요청에도 이유를 함께 설명합니다.`

export const MODES = [
  { id: 'explain', label: '설명', rule: '[지금 모드: 설명] 질문에 바로 답합니다. 어려운 용어가 나오면 한 줄 풀이를 붙입니다.' },
  {
    id: 'analogy',
    label: '비유',
    rule: '[지금 모드: 비유] 먼저 일상 비유 하나로 감을 잡게 하고, 이어서 "실제로는"으로 정확한 설명을 합니다. 비유 때문에 잘못 이해할 수 있는 부분이 있으면 한 줄로 짚습니다.',
  },
  {
    id: 'coach',
    label: '코칭',
    rule: '[지금 모드: 코칭] 답을 바로 주지 않습니다. 학생이 스스로 떠올리도록 질문을 한 번에 하나만 합니다. 두 번 연속 막히면 힌트를 주고, 세 번째에는 답과 이유를 알려 줍니다.',
  },
  {
    id: 'quiz',
    label: '퀴즈',
    rule: '[지금 모드: 퀴즈] APP DATA로 한 번에 한 문제만 냅니다(4지선다 또는 단답). 용어 암기보다 "이 조건이면 무슨 일이 생기는가", "이 증상의 원인과 조치는 무엇인가" 같은 상황 판단 문제를 우선합니다. 학생이 답하면 정답 여부, 이유, 근거가 된 APP DATA 문장을 짧게 알려 주고 다음 문제를 낼지 묻습니다.',
  },
]

export const HISTORY_TURNS = 10

function appData(ref) {
  if (ref?.kind === 'process' || ref?.kind === 'machine') return contextFor(ref)
  // 특정 공정을 보고 있지 않으면 공정 이름 목록만 줍니다.
  return JSON.stringify({ note: '사용자가 특정 공정을 고르지 않았습니다. 아래는 앱에 있는 공정 이름 목록입니다.', processes: processes.map((p) => p.name.ko) })
}

// 글자가 나오는 대로 onText(지금까지의 전체 글)를 부르고, 끝나면 최종 글을 돌려줍니다.
export async function streamChat({ apiKey, mode, ref, history, notes, onText, signal }) {
  const rule = MODES.find((m) => m.id === mode)?.rule ?? MODES[0].rule
  const recent = history.slice(-HISTORY_TURNS * 2)
  const context = [
    `APP DATA (지금 보는 대상: ${ref?.label ?? '없음'}):\n${appData(ref)}`,
    notes ? `NOTES (학생이 쓴 메모):\n${notes}` : '',
  ]
    .filter(Boolean)
    .join('\n\n')

  // 첫 메시지 앞에 자료를 붙입니다. 시작이 assistant면 API 규칙상 user로 시작하도록 자료 메시지를 따로 둡니다.
  // 오류로 답이 빠진 경우 같은 역할이 이어질 수 있어 하나로 합칩니다.
  const messages = []
  for (const m of recent) {
    if (!m.text) continue
    const last = messages.at(-1)
    if (last?.role === m.role) last.content += `\n\n${m.text}`
    else messages.push({ role: m.role, content: m.text })
  }
  if (messages[0]?.role === 'user') messages[0] = { role: 'user', content: `${context}\n\n---\n${messages[0].content}` }
  else messages.unshift({ role: 'user', content: context }, { role: 'assistant', content: '자료를 확인했습니다. 질문해 주십시오.' })

  const stream = client(apiKey).messages.stream(
    { model: getModel(), max_tokens: 4096, system: `${SYSTEM}\n\n${rule}`, messages },
    { signal },
  )
  let text = ''
  stream.on('text', (delta) => {
    text += delta
    onText(text)
  })
  const final = await stream.finalMessage()
  if (final.stop_reason === 'refusal') throw new Error('AI가 이 요청에 답하지 않았습니다.')
  return text
}
