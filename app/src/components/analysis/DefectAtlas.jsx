import { useMemo, useState } from 'react'
import machines from '../../data/machines/index.js'
import { FIELD_CASES } from '../../data/fieldCases/index.js'

// 불량 분석 도감: 설비 실습 규칙표(data/machines)의 알람·불량 규칙을 모아 공정별로 보여 줍니다.
// 새 설명을 지어내지 않고 규칙표의 원인·조치·근거를 그대로 씁니다. 근거 수준(출처 원문 / 앱 공정 데이터 / 교육용 가설)을 함께 표시합니다.
// 같은 공정의 현장 실무 시나리오 원인도 이어 줍니다(이론 → 설비 실습 → 현장 사례).

const SEVERITY = {
  alarm: { label: '장비 정지', tone: 'bad', order: 0 },
  bad: { label: '불량', tone: 'bad', order: 1 },
  warn: { label: '주의', tone: 'warn', order: 2 },
}

const BASIS = {
  source: { label: '출처 원문', tone: 'ok' },
  data: { label: '앱 공정 데이터', tone: 'info' },
  edu: { label: '교육용 가설 · 검수 전', tone: 'warn' },
}

function basisOf(rule) {
  if (rule.src) return 'source'
  if (/교육용 가설/.test(rule.basis ?? '')) return 'edu'
  return 'data'
}

// 규칙표 → 도감 항목(설비 안에서 같은 제목은 하나로)
function buildAtlas() {
  return machines.map((m) => {
    const seen = new Set()
    const items = []
    m.rules.forEach((r, i) => {
      if (seen.has(r.title)) return
      seen.add(r.title)
      items.push({ key: `${m.id}:${i}`, ...r, basisKind: basisOf(r), source: r.src ? m.sources?.[r.src] : null })
    })
    items.sort((a, b) => (SEVERITY[a.severity]?.order ?? 9) - (SEVERITY[b.severity]?.order ?? 9))
    const cases = FIELD_CASES.filter((c) => c.machine === m.id).map((c) => {
      const hypo = Object.values(c.nodes).find((n) => n.type === 'hypothesis')
      return { id: c.id, title: c.title, category: c.category, cause: hypo?.options.find((o) => o.correct)?.text }
    })
    return { m, cat: m.stage === 'front' ? 'FAB' : 'PKG', items, cases }
  })
}

export default function DefectAtlas({ onOpenMachine, onOpenProcess, onOpenField }) {
  const atlas = useMemo(buildAtlas, [])
  const [cat, setCat] = useState('ALL')
  const [sev, setSev] = useState('all')
  const [basis, setBasis] = useState('all')
  const [q, setQ] = useState('')
  const [only, setOnly] = useState('all')

  const query = q.trim().toLowerCase()
  const sections = atlas
    .filter((s) => (cat === 'ALL' || s.cat === cat) && (only === 'all' || s.m.id === only))
    .map((s) => ({
      ...s,
      shown: s.items.filter(
        (it) =>
          (sev === 'all' || it.severity === sev) &&
          (basis === 'all' || it.basisKind === basis) &&
          (!query || `${it.title} ${it.cause} ${it.fix}`.toLowerCase().includes(query)),
      ),
    }))
    .filter((s) => s.shown.length || (s.cases.length && !query && sev === 'all' && basis === 'all'))
  const total = sections.reduce((n, s) => n + s.shown.length, 0)
  const counts = { source: 0, data: 0, edu: 0 }
  atlas.forEach((s) => s.items.forEach((it) => (counts[it.basisKind] += 1)))

  return (
    <section className="screen atlas">
      <h2>불량 분석 도감</h2>
      <p className="muted">
        설비 실습의 판정 규칙표에 있는 알람·불량을 공정별로 모았습니다. 원인·조치 문장은 규칙표 그대로이고, 근거 수준을 함께 표시합니다: 출처 원문 {counts.source}개 · 앱 공정 데이터 {counts.data}개 · 교육용 가설 {counts.edu}개.
      </p>

      <div className="atlas-filters">
        <div className="seg" role="group" aria-label="공정 구분">
          {['ALL', 'FAB', 'PKG'].map((k) => (
            <button key={k} type="button" className={cat === k ? 'active' : ''} onClick={() => (setCat(k), setOnly('all'))}>
              {k === 'ALL' ? '전체' : k}
            </button>
          ))}
        </div>
        <select value={only} onChange={(e) => setOnly(e.target.value)} aria-label="설비">
          <option value="all">모든 설비</option>
          {atlas
            .filter((s) => cat === 'ALL' || s.cat === cat)
            .map((s) => (
              <option key={s.m.id} value={s.m.id}>
                {s.m.name}
              </option>
            ))}
        </select>
        <select value={sev} onChange={(e) => setSev(e.target.value)} aria-label="심각도">
          <option value="all">모든 심각도</option>
          {Object.entries(SEVERITY).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
        <select value={basis} onChange={(e) => setBasis(e.target.value)} aria-label="근거 수준">
          <option value="all">모든 근거</option>
          {Object.entries(BASIS).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="불량 이름·원인 검색 (예: 보이드)" aria-label="검색" />
      </div>
      <p className="muted atlas-count">{total}개 항목</p>

      {sections.map((s) => (
        <article key={s.m.id} className="atlas-section">
          <header className="atlas-head">
            <div>
              <span className={`cat ${s.cat === 'FAB' ? 'fab' : 'pkg'}`}>{s.cat}</span>
              <h3>{s.m.name}</h3>
            </div>
            <div className="button-row">
              <button type="button" className="link" onClick={() => onOpenProcess(s.m.processId)}>
                📘 공정 설명
              </button>
              <button type="button" className="link" onClick={() => onOpenMachine(s.m.id)}>
                🎛️ 설비 실습에서 재현
              </button>
            </div>
          </header>

          {s.cases.length > 0 && (
            <div className="atlas-cases">
              {s.cases.map((c) => (
                <button key={c.id} type="button" className="atlas-case" onClick={() => onOpenField(c.id, c.category)}>
                  <span className="scenario-tag">현장 사례 {c.id}</span>
                  <strong>{c.title}</strong>
                  {c.cause && <small className="muted">원인: {c.cause}</small>}
                </button>
              ))}
            </div>
          )}

          <div className="atlas-grid">
            {s.shown.map((it) => (
              <details key={it.key} className="atlas-item card">
                <summary>
                  <span className={`status ${SEVERITY[it.severity]?.tone ?? 'info'}`}>{SEVERITY[it.severity]?.label ?? it.severity}</span>
                  <strong>{it.title}</strong>
                  <span className={`atlas-basis ${it.basisKind}`}>{BASIS[it.basisKind].label}</span>
                </summary>
                <dl>
                  <dt>원인</dt>
                  <dd>{it.cause}</dd>
                  <dt>조치</dt>
                  <dd>{it.fix}</dd>
                  <dt>근거</dt>
                  <dd className="muted">
                    {it.source ? (
                      <>
                        <a href={it.source.url} target="_blank" rel="noreferrer">
                          {it.source.title}
                        </a>{' '}
                        · {it.source.publisher}
                        {it.cite && <q>{it.cite}</q>}
                      </>
                    ) : (
                      it.basis
                    )}
                  </dd>
                </dl>
              </details>
            ))}
          </div>
        </article>
      ))}
      {sections.length === 0 && <p className="muted">조건에 맞는 항목이 없습니다.</p>}
    </section>
  )
}
