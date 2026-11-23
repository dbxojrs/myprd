// 공정 설명·애니메이션 자막 검사: npm run check-content
// 1) 모든 문장에 출처가 있고, 출처 키가 data/sourceCatalog.js에 있는지
// 2) 자막의 장면 id와 그림(components/movie/scenes)의 장면 id가 같은지
// 3) 공정 id가 processes.js에 있는지
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src')
const load = async (p) => (await import(pathToFileURL(p).href)).default
const { findSource, SOURCE_CATALOG } = await import(pathToFileURL(path.join(root, 'data/sourceCatalog.js')).href)
const { processes } = await import(pathToFileURL(path.join(root, 'data/processes.js')).href)
const { BASICS } = await import(pathToFileURL(path.join(root, 'data/basics.js')).href)
const { courseLessonIds } = await import(pathToFileURL(path.join(root, 'data/courses.js')).href)
const ids = new Set([...processes.map((p) => p.id), ...BASICS.map((b) => b.id), ...courseLessonIds()])
const problems = []
const used = new Set()

const checkCites = (where, cite) => {
  if (!Array.isArray(cite) || cite.length === 0) problems.push(`${where}: 출처 없음`)
  for (const key of cite ?? []) {
    used.add(key)
    if (!findSource(key)) problems.push(`${where}: 카탈로그에 없는 출처 키 "${key}"`)
  }
}

// 카탈로그 자체
const keys = SOURCE_CATALOG.map((s) => s.key)
if (new Set(keys).size !== keys.length) problems.push('카탈로그: 같은 키가 두 번 있음')
for (const s of SOURCE_CATALOG) {
  for (const f of ['key', 'short', 'title', 'publisher', 'url', 'tier', 'checked']) if (!s[f]) problems.push(`카탈로그 ${s.key}: ${f} 없음`)
  if (!['evidence', 'explain'].includes(s.tier)) problems.push(`카탈로그 ${s.key}: tier가 이상함`)
}

// 자막
const movieDir = path.join(root, 'data/processMovies')
const sceneSrc = (id) => fs.readFileSync(path.join(root, 'components/movie/scenes', `${id}.jsx`), 'utf8')
for (const f of fs.readdirSync(movieDir).filter((f) => f.endsWith('.js') && f !== 'index.js')) {
  const m = await load(path.join(movieDir, f))
  if (!ids.has(m.id)) problems.push(`자막 ${f}: 없는 공정 id "${m.id}"`)
  let src = ''
  try {
    src = sceneSrc(m.id)
  } catch {
    problems.push(`자막 ${m.id}: 그림 파일 components/movie/scenes/${m.id}.jsx 없음`)
  }
  for (const s of m.scenes) {
    if (src && !new RegExp(`\\b${s.id}\\s*:\\s*\\{`).test(src)) problems.push(`자막 ${m.id}/${s.id}: 그림에 같은 장면 id 없음`)
    s.beats.forEach((b, i) => checkCites(`자막 ${m.id}/${s.id}#${i + 1}`, b.cite))
  }
}

// 자세한 설명
const exDir = path.join(root, 'data/explainers')
for (const f of fs.readdirSync(exDir).filter((f) => f.endsWith('.js') && f !== 'index.js')) {
  const e = await load(path.join(exDir, f))
  if (!ids.has(e.id)) problems.push(`설명 ${f}: 없는 공정 id "${e.id}"`)
  if (e.analogy) checkCites(`설명 ${e.id}/비유`, e.analogy.cite)
  e.easy.forEach((l, i) => checkCites(`설명 ${e.id}/쉽게#${i + 1}`, l.cite))
  for (const sec of e.sections) sec.points.forEach((p, i) => checkCites(`설명 ${e.id}/${sec.heading}#${i + 1}`, p.cite))
}

// 패키지 타입 안내
const { packages } = await import(pathToFileURL(path.join(root, 'data/packages.js')).href)
const pkgDir = path.join(root, 'data/packageGuides')
for (const f of fs.readdirSync(pkgDir).filter((f) => f.endsWith('.js') && f !== 'index.js')) {
  const g = await load(path.join(pkgDir, f))
  if (!packages.some((p) => p.id === g.id)) problems.push(`패키지 안내 ${f}: 없는 패키지 id "${g.id}"`)
  g.structure.forEach((l, i) => checkCites(`패키지 ${g.id}/구조#${i + 1}`, l.cite))
  g.flow.forEach((s, i) => {
    if (s.id && !ids.has(s.id)) problems.push(`패키지 ${g.id}/순서#${i + 1}: 없는 공정 id "${s.id}"`)
    if (!s.id && !s.name) problems.push(`패키지 ${g.id}/순서#${i + 1}: 공정 id도 이름도 없음`)
    if (s.note) checkCites(`패키지 ${g.id}/순서#${i + 1}`, s.note.cite)
  })
  g.compare.forEach((l, i) => checkCites(`패키지 ${g.id}/비교#${i + 1}`, l.cite))
  for (const sec of g.sections ?? []) sec.points.forEach((p, i) => checkCites(`패키지 ${g.id}/${sec.heading}#${i + 1}`, p.cite))
}

const unused = keys.filter((k) => !used.has(k))
console.log(`출처 ${SOURCE_CATALOG.length}개 중 설명·자막에서 쓰는 것 ${keys.length - unused.length}개 (나머지는 공정 데이터·장비 실습에서 씀)`)
if (problems.length) {
  console.log(`✗ 문제 ${problems.length}개`)
  for (const p of problems) console.log(' -', p)
  process.exit(1)
}
console.log('✓ 모든 설명·자막 문장에 출처가 있고, 장면 그림이 맞습니다')
