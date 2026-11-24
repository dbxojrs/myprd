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

const { EQUIPMENT } = await import(pathToFileURL(path.join(root, 'data/equipment/index.js')).href)
const { VISUALS } = await import(pathToFileURL(path.join(root, 'data/visuals.js')).href)
for (const [id, v] of Object.entries(VISUALS)) {
  if (!['real-photo', 'edu-diagram', 'ai-generated'].includes(v.origin)) problems.push(`시각 자료 ${id}: origin이 이상함`)
  if (v.origin === 'real-photo' && (!v.source || !v.license)) problems.push(`시각 자료 ${id}: 실제 사진인데 출처·라이선스 없음`)
  ;(v.notes ?? []).forEach((n, i) => checkCites(`시각 자료 ${id}#${i + 1}`, n.cite))
}

// 현장 실무 훈련 시나리오: 출처 키, 분기 연결, 배점 합 100, 데이터 id
const fcDir = path.join(root, 'data/fieldCases')
for (const f of fs.readdirSync(fcDir).filter((f) => f.endsWith('.js') && f !== 'index.js')) {
  const fc = await load(path.join(fcDir, f))
  if (!fc) continue // 준비 중 목록(planned.js) 같은 보조 파일
  if (!['FAB', 'PKG'].includes(fc.category)) problems.push(`실무 시나리오 ${fc.id}: category는 FAB 또는 PKG`)
  const where = `실무 시나리오 ${fc.id}`
  for (const k of fc.sources ?? []) {
    used.add(k)
    if (!findSource(k)) problems.push(`${where}: 카탈로그에 없는 출처 키 "${k}"`)
  }
  const sum = fc.rubric.reduce((s, r) => s + r.points, 0)
  if (sum !== 100) problems.push(`${where}: 배점 합이 ${sum}점 (100이어야 함)`)
  const nodeIds = Object.keys(fc.nodes)
  if (!fc.nodes[fc.start]) problems.push(`${where}: 시작 노드 "${fc.start}" 없음`)
  const cats = new Set(fc.rubric.map((r) => r.id))
  for (const [id, n] of Object.entries(fc.nodes)) {
    if (n.next && !nodeIds.includes(n.next)) problems.push(`${where}/${id}: 없는 다음 노드 "${n.next}"`)
    for (const o of n.options ?? []) {
      if (o.next && !nodeIds.includes(o.next)) problems.push(`${where}/${id}.${o.id}: 없는 다음 노드 "${o.next}"`)
      for (const c of Object.keys(o.score ?? {})) if (!cats.has(c)) problems.push(`${where}/${id}.${o.id}: 없는 평가 기준 "${c}"`)
    }
    if (n.type !== 'end' && n.type !== 'outcome' && !n.next && !(n.options ?? []).every((o) => o.next)) problems.push(`${where}/${id}: 다음으로 갈 곳이 없음`)
  }
  if (!Object.values(fc.nodes).some((n) => n.type === 'end')) problems.push(`${where}: 평가(end) 노드 없음`)
  // 장비 구조 연동: parts는 data/equipment 부위 id, figure는 data/visuals id
  const eq = EQUIPMENT[fc.equipment?.kind]
  if (fc.equipment?.kind && !eq) problems.push(`${where}: 장비 데이터 없음 "${fc.equipment.kind}"`)
  for (const n of Object.values(fc.nodes).filter((x) => x.type === 'data'))
    for (const it of n.items) {
      for (const pt of it.parts ?? []) if (!eq?.modules.some((m) => m.id === pt)) problems.push(`${where}/${it.id}: 장비에 없는 부위 "${pt}"`)
      if (it.figure && !VISUALS[it.figure]) problems.push(`${where}/${it.id}: 시각 자료 목록에 없는 그림 "${it.figure}"`)
    }
  // 상황 개요·액션 카드 규칙: 그림 표시 조건(after)과 상호 배타 규칙은 실제 데이터·선택지 id여야 합니다.
  const itemIds = new Set(Object.values(fc.nodes).filter((x) => x.type === 'data').flatMap((n) => n.items.map((i) => i.id)))
  for (const f of fc.scene?.diagram?.flags ?? []) if (!itemIds.has(f.after)) problems.push(`${where}/scene: 없는 데이터 id "${f.after}"`)
  for (const m of fc.scene?.metrics?.rows ?? []) if (typeof m.value !== 'number') problems.push(`${where}/scene: 수치가 아닌 지표 "${m.label}"`)
  if (!fc.scene?.metrics?.rows?.length) problems.push(`${where}: 상황 개요 지표(scene.metrics) 없음`)
  if (!fc.scene?.location) problems.push(`${where}: 이상 발생 위치(scene.location) 없음`)
  for (const [nid, n] of Object.entries(fc.nodes)) {
    const titled = (n.options ?? []).filter((o) => o.title).length
    if (titled && titled !== n.options.length) problems.push(`${where}/${nid}: 액션 카드 이름(title)이 일부 선택지에만 있음`)
  }
  for (const [nid, n] of Object.entries(fc.nodes))
    for (const g of n.exclusive ?? []) for (const id of g) if (!n.options?.some((o) => o.id === id)) problems.push(`${where}/${nid}: 상호 배타 규칙의 없는 선택지 "${id}"`)
}

// 시나리오 미디어 등록부(data/media.js): 필수 필드, 부위 id, 공개 조건, 이미지 파일
const { MEDIA } = await import(pathToFileURL(path.join(root, 'data/media.js')).href)
const fieldCaseList = []
for (const f of fs.readdirSync(fcDir).filter((f) => /^(fab|pkg)-.*\.js$/.test(f))) fieldCaseList.push(await load(path.join(fcDir, f)))
for (const m of MEDIA) {
  const where = `media/${m.mediaId}`
  for (const k of ['mediaId', 'processCategory', 'process', 'stages', 'mediaType', 'title', 'description', 'alt', 'source', 'license', 'validationStatus']) if (m[k] == null) problems.push(`${where}: "${k}" 없음`)
  if (typeof m.isEducationalIllustration !== 'boolean') problems.push(`${where}: isEducationalIllustration(교육용 도식 여부) 없음`)
  const eq = EQUIPMENT[m.process]
  for (const h of m.hotspots ?? []) if (!eq?.modules.some((x) => x.id === h)) problems.push(`${where}: 장비에 없는 부위 "${h}"`)
  for (const h of Object.values(m.relatedDataIds ?? {}).flat()) if (!eq?.modules.some((x) => x.id === h)) problems.push(`${where}: 장비에 없는 강조 부위 "${h}"`)
  const cases = fieldCaseList.filter((c) => (m.scenarioId ? c.id === m.scenarioId : c.process === m.process))
  if (m.scenarioId && !cases.length) problems.push(`${where}: 없는 시나리오 "${m.scenarioId}"`)
  const caseItems = new Set(cases.flatMap((c) => Object.values(c.nodes).filter((x) => x.type === 'data').flatMap((n) => n.items.map((i) => i.id))))
  for (const id of [...(m.revealAfter ?? []), ...Object.keys(m.relatedDataIds ?? {})]) if (!caseItems.has(id)) problems.push(`${where}: 시나리오 데이터에 없는 id "${id}"`)
  if (m.assetPath && !fs.existsSync(path.join(root, '..', 'public', m.assetPath))) problems.push(`${where}: 이미지 파일 없음 "${m.assetPath}"`)
  for (const k of m.cite ?? []) checkCites(where, [k])
}
// 시나리오 단계별 공정 애니메이션 장면 id가 실제 영상에 있는지
const { MOVIE_STAGE_SCENES } = await import(pathToFileURL(path.join(root, 'data/media.js')).href)
for (const [pid, map] of Object.entries(MOVIE_STAGE_SCENES)) {
  const file = path.join(movieDir, `${pid}.js`)
  const movie = fs.existsSync(file) ? await load(file) : null
  for (const sid of Object.values(map)) if (!movie?.scenes.some((x) => x.id === sid)) problems.push(`media/movie-${pid}: 영상에 없는 장면 "${sid}"`)
}
for (const c of fieldCaseList) if (!MOVIE_STAGE_SCENES[c.process]) problems.push(`실무 시나리오 ${c.id}: 연결된 공정 애니메이션 없음(${c.process})`)
// 공정 설명의 사진(시나리오 상황 개요에도 씀): 파일과 출처·라이선스
for (const p of processes.filter((x) => x.photo?.src)) {
  if (!fs.existsSync(path.join(root, '..', 'public', p.photo.src))) problems.push(`process/${p.id}: 사진 파일 없음 "${p.photo.src}"`)
  if (!p.photo.license || !p.photo.url) problems.push(`process/${p.id}: 사진 출처·라이선스 없음`)
}

const unused = keys.filter((k) => !used.has(k))
console.log(`출처 ${SOURCE_CATALOG.length}개 중 설명·자막에서 쓰는 것 ${keys.length - unused.length}개 (나머지는 공정 데이터·장비 실습에서 씀)`)
if (problems.length) {
  console.log(`✗ 문제 ${problems.length}개`)
  for (const p of problems) console.log(' -', p)
  process.exit(1)
}
console.log('✓ 모든 설명·자막 문장에 출처가 있고, 장면 그림이 맞습니다')
