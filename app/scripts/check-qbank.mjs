// 문제은행 검사: node scripts/check-qbank.mjs [파일...]  (인자가 없으면 src/data/questionBank 전체)
// 문제마다 근거 문장(basis)이 해당 설명(data/explainers/<explainer>.js)에 글자 그대로 있고,
// 출처(cite)가 그 문장의 출처와 같은지 확인합니다. 출처를 새로 지어 붙일 수 없게 하는 장치입니다.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src')
const bankDir = path.join(root, 'data/questionBank')
const load = async (p) => (await import(pathToFileURL(p).href)).default
const { findSource } = await import(pathToFileURL(path.join(root, 'data/sourceCatalog.js')).href)

// 설명 파일의 모든 문장 → cite
async function sentencesOf(explainerId) {
  const file = path.join(root, 'data/explainers', `${explainerId}.js`)
  if (!fs.existsSync(file)) return null
  const ex = await load(file)
  const map = new Map()
  const add = (pt) => pt?.text && map.set(pt.text, pt.cite ?? [])
  for (const pt of ex.easy ?? []) add(pt)
  for (const sec of ex.sections ?? []) for (const pt of sec.points ?? []) add(pt)
  return map
}

export async function checkBank(files) {
  const problems = []
  const seen = new Set()
  let count = 0
  for (const file of files) {
    const name = path.basename(file)
    let bank
    try {
      bank = await load(file)
    } catch (e) {
      problems.push(`${name}: 불러오기 실패 ${e.message}`)
      continue
    }
    if (bank.reviewed !== false) problems.push(`${name}: reviewed는 false(검수 전)여야 함`)
    const sentences = await sentencesOf(bank.explainer)
    if (!sentences) {
      problems.push(`${name}: 설명 파일 data/explainers/${bank.explainer}.js가 없음`)
      continue
    }
    for (const q of bank.questions ?? []) {
      count += 1
      const where = `${name} ${q.id}`
      if (!q.id?.startsWith(`qb-${bank.explainer}-`)) problems.push(`${where}: id는 qb-${bank.explainer}-로 시작해야 함`)
      if (seen.has(q.id)) problems.push(`${where}: 같은 id가 두 번`)
      seen.add(q.id)
      if (!['choice', 'ox'].includes(q.kind)) problems.push(`${where}: kind는 choice 또는 ox`)
      if (!q.prompt?.trim()) problems.push(`${where}: 질문 없음`)
      if (q.kind === 'ox' && JSON.stringify(q.choices) !== JSON.stringify(['O', 'X'])) problems.push(`${where}: OX 보기는 ['O','X']`)
      if (q.kind === 'choice' && (!Array.isArray(q.choices) || q.choices.length !== 4)) problems.push(`${where}: 객관식 보기는 4개`)
      if (Array.isArray(q.choices) && new Set(q.choices).size !== q.choices.length) problems.push(`${where}: 같은 보기가 두 번`)
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= (q.choices?.length ?? 0)) problems.push(`${where}: 정답 번호가 보기 범위 밖`)
      if (!q.explain?.trim()) problems.push(`${where}: 해설 없음`)
      const basis = Array.isArray(q.basis) ? q.basis : [q.basis]
      const expected = new Set()
      for (const b of basis) {
        if (!sentences.has(b)) problems.push(`${where}: 근거 문장이 설명 파일에 그대로 없음 → "${String(b).slice(0, 40)}…"`)
        else for (const k of sentences.get(b)) expected.add(k)
      }
      const cite = q.cite ?? []
      for (const k of cite) {
        if (!findSource(k)) problems.push(`${where}: 카탈로그에 없는 출처 "${k}"`)
        if (!expected.has(k)) problems.push(`${where}: 근거 문장에 없는 출처 "${k}"`)
      }
      if (!cite.length) problems.push(`${where}: 출처 없음`)
    }
  }
  return { problems, count }
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
if (isMain) {
  const args = process.argv.slice(2)
  const files = args.length ? args.map((f) => path.resolve(f)) : fs.readdirSync(bankDir).filter((f) => f.endsWith('.js') && f !== 'index.js').map((f) => path.join(bankDir, f))
  const { problems, count } = await checkBank(files)
  if (problems.length) {
    console.log(problems.join('\n'))
    console.log(`✕ 문제은행 문제 ${problems.length}건 (문제 ${count}개)`)
    process.exit(1)
  }
  console.log(`✓ 문제은행 ${count}문제: 근거 문장·출처가 설명 파일과 일치`)
}
