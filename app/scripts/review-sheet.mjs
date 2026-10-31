// 공정 데이터(app/src/data)로 전문가 검수표(review/review-sheet.md)를 만듭니다.
// 데이터를 고친 뒤 `npm run review-sheet`로 다시 만들면 검수표도 같은 내용으로 바뀝니다.
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { findPackage, fullFlow } from '../src/data/packages.js'
import { findProcess } from '../src/data/processes.js'
import { processAnalogies } from '../src/data/analogies.js'
import { lineOptions, lineRules, GRADE_LABEL } from '../src/data/lineSim.js'

const PACKAGE_ID = 'qfn'
const OUT_DIR = fileURLToPath(new URL('../../review/', import.meta.url))
const OUT = `${OUT_DIR}review-sheet.md`
const CHECK = '☐ 맞음 ☐ 고칠 곳 ☐ 모름'

const term = (value) => (typeof value === 'string' ? value : value.en === value.ko ? value.en : `${value.ko} (${value.en})`)
const cell = (text) => String(text || '-').replace(/\|/g, '/')
const row = (label, content) => `| ${label} | ${cell(content)} | ${CHECK} | |`

function processSection(id, index) {
  const p = findProcess(id)
  const prereqs = p.prerequisites.map((pid) => term(findProcess(pid).name)).join(', ') || '없음 (첫 공정)'
  const lines = [
    `### ${index + 1}. ${term(p.name)} · ${p.stage === 'front' ? '전공정' : '후공정'}`,
    '',
    '| 항목 | 앱에 보이는 내용 | 판단 | 고칠 곳·의견 |',
    '|---|---|---|---|',
    row('설명', p.summary),
    row('입력', p.input),
    row('결과', p.output),
    row('핵심 용어', p.terms.map(term).join(', ')),
    row('바로 앞에 알아야 할 공정', prereqs),
    row('비유 (단순화 설명)', processAnalogies[p.id]),
    row('개념도', `아래 그림`),
    '',
    `![${term(p.name)} 개념도](images/${p.id}.svg)`,
  ]

  if (p.steps?.length) {
    lines.push(
      '',
      '**세부 단계**',
      '',
      '| 순서 | 단계 | 설명 | 판단 | 고칠 곳·의견 |',
      '|---|---|---|---|---|',
      ...p.steps.map((step, i) => `| ${i + 1} | ${cell(step.name)} | ${cell(step.desc)} | ${CHECK} | |`),
    )
  }

  if (p.keyPoints?.length) {
    lines.push('', '**알아둘 점**', '', '| 주제 | 설명 | 판단 | 고칠 곳·의견 |', '|---|---|---|---|')
    for (const point of p.keyPoints) {
      const figures = point.figures ?? (point.figure ? [point.figure] : [])
      lines.push(`| ${cell(point.title)} | ${cell(point.body)}${figures.length ? ' (아래 그림)' : ''} | ${CHECK} | |`)
    }
    for (const point of p.keyPoints) {
      for (const figure of point.figures ?? (point.figure ? [point.figure] : [])) {
        lines.push('', `![${point.title}](images/detail-${figure}.svg)`)
      }
      for (const photo of point.photos ?? []) {
        lines.push('', `- 사진(${point.title}): [${photo.title}](${photo.url})${photo.license ? ` · ${photo.author} · ${photo.license}` : ' · 원본 링크'}`)
      }
    }
  }

  for (const variable of lineOptions[id] ?? []) {
    lines.push(
      '',
      `**라인 실습 변수: ${term(variable.name)}**`,
      '',
      '| 선택지 | 등급 | 대표 불량 | 이유 | 판단 | 고칠 곳·의견 |',
      '|---|---|---|---|---|---|',
      ...variable.choices.map(
        (c) => `| ${cell(c.label)} | ${GRADE_LABEL[c.grade]} | ${cell(c.defect && term(c.defect))} | ${cell(c.reason)} | ${CHECK} | |`,
      ),
    )
  }

  if (p.sources.length) {
    lines.push(
      '',
      '**등록된 출처** (내용과 맞는지 봐 주세요)',
      '',
      ...p.sources.map((s) => `- [${s.title}](${s.url}) · ${s.publisher} · ${s.tier === 'explain' ? '설명 출처' : '근거 출처'}`),
    )
  }
  lines.push('', '**이 공정의 근거로 추천할 자료**(교재, 논문, 표준 등): ', '', '---', '')
  return lines.join('\n')
}

function choiceLabel({ process, variable, choice }) {
  const v = lineOptions[process].find((item) => item.id === variable)
  const c = choice === null ? '모든 선택지' : v.choices[choice].label
  return `${term(findProcess(process).name)} · ${term(v.name)} "${c}"`
}

// 앱의 개념도를 그림 파일로 저장합니다. 앱의 밝은 테마 색과 .il- 스타일을 그림 안에 넣습니다.
async function exportIllustrations(ids) {
  const css = readFileSync(fileURLToPath(new URL('../src/App.css', import.meta.url)), 'utf8')
  const tokens = css.match(/^:root \{[^}]*\}/m)[0]
  const rules = [...css.matchAll(/^\.il-(?!compact|package)[^{]*\{[^}]*\}/gm)].map((m) => m[0]).join('\n')
  const style = `<style>${tokens.replace(':root', 'svg')}\nsvg { background: #ffffff; font-family: sans-serif; }\n${rules}</style>`

  const vite = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom', logLevel: 'error' })
  try {
    const { ProcessIllustration } = await vite.ssrLoadModule('/src/components/Illustrations.jsx')
    const { DetailIllustration } = await vite.ssrLoadModule('/src/components/DetailIllustration.jsx')
    mkdirSync(`${OUT_DIR}images`, { recursive: true })
    const figuresOf = (point) => point.figures ?? (point.figure ? [point.figure] : [])
    const figures = ids.flatMap((id) => (findProcess(id).keyPoints ?? []).flatMap(figuresOf))
    const items = [
      ...ids.map((id) => [id, createElement(ProcessIllustration, { id, still: true })]),
      ...figures.map((figure) => [`detail-${figure}`, createElement(DetailIllustration, { id: figure, still: true })]),
    ]
    for (const [name, element] of items) {
      const svg = renderToStaticMarkup(element)
        .replace(/<svg ([^>]*)viewBox="0 0 (\d+) (\d+)"/, (_, rest, w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w * 3}" height="${h * 3}" ${rest}viewBox="0 0 ${w} ${h}"`)
        .replace(/(<svg[^>]*>)/, `$1${style}`)
      writeFileSync(`${OUT_DIR}images/${name}.svg`, svg)
    }
  } finally {
    await vite.close()
  }
}

const pkg = findPackage(PACKAGE_ID)
const flow = fullFlow(pkg)

const sheet = [
  `# 반도체 패키징 공정 튜터 · 전문가 검수표 (${term(pkg.name)})`,
  '',
  `만든 날짜: ${new Date().toISOString().slice(0, 10)} · 공정 데이터에서 자동으로 만든 문서입니다.`,
  '',
  '## 부탁드리는 내용',
  '',
  '반도체 패키징을 처음 배우는 대학생(전자·재료·기계공학 3–4학년)을 위한 학습 앱을 만들고 있습니다.',
  '앱에 들어갈 공정 설명이 맞는지 확인해 주시면, 검수 결과를 앱에 "검수됨"으로 표시하겠습니다.',
  '',
  '- 항목마다 **맞음 / 고칠 곳 / 모름** 중 하나에 표시해 주세요. 잘 모르는 항목은 "모름"으로 두셔도 됩니다.',
  '- 학생용이라 일부러 단순하게 썼습니다. 단순화는 괜찮지만 **틀린 내용**이 있으면 알려 주세요.',
  '- 라인 실습의 등급(권장/주의/불량)은 실제 수치가 아니라 경향을 보여주는 교육용 규칙입니다. 경향이 맞는지만 봐 주세요.',
  `- 공정은 ${flow.length}개(전공정 ${flow.length - pkg.flow.length}개, 후공정 ${pkg.flow.length}개)입니다. 일부 공정만 보셔도 됩니다.`,
  '',
  '## 검수자 정보',
  '',
  '| 항목 | 내용 |',
  '|---|---|',
  '| 성함 | |',
  '| 소속·경력 | |',
  '| 검수 날짜 | |',
  '| 앱에 표시할 이름 | ☐ 실명 ☐ 소속·경력만 (예: 현직 패키징 엔지니어 1인) ☐ 표시하지 않음 |',
  '',
  '## 공정별 검수',
  '',
  ...flow.map(processSection),
  '## 공정 사이 연결 규칙 (라인 실습)',
  '',
  '앞 공정의 선택이 뒤 공정의 결과를 바꾸는 규칙입니다.',
  '',
  '| 앞 공정 선택 | 바뀌는 뒤 공정 선택 | 바뀐 등급 | 이유 | 판단 | 고칠 곳·의견 |',
  '|---|---|---|---|---|---|',
  ...lineRules.map(
    (r) => `| ${choiceLabel(r.when)} | ${choiceLabel(r.target)} | ${GRADE_LABEL[r.grade]} | ${cell(r.reason)} | ${CHECK} | |`,
  ),
  '',
  '## 전체 의견',
  '',
  '빠진 공정, 순서가 틀린 곳, 학생에게 꼭 알려 주고 싶은 내용이 있으면 적어 주세요.',
  '',
]

mkdirSync(OUT_DIR, { recursive: true })
await exportIllustrations(flow)
writeFileSync(OUT, sheet.join('\n'))
console.log(`검수표를 만들었습니다: ${OUT}`)
