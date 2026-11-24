import { useState } from 'react'
import { D8_STEPS, FISH_CATS, addReport, blankReport, deleteReport, openReport, reportChecks, reportFromRun, reportMarkdown, updateReport, useReports } from '../../lib/reports.js'
import { FIELD_CASES } from '../../data/fieldCases/index.js'
import { fieldStore } from '../../lib/fieldSim.js'
import { useStore } from '../../lib/sharedStore.js'
import { addNote, openNotePage } from '../../lib/notes.js'
import { markActive } from '../../lib/activity.js'
import { Cites } from '../movie/ProcessMovie.jsx'

// 엔지니어 보고서: 8D · 5 Why · 피시본(특성 요인도).
// 현장 시나리오를 끝낸 기록으로 초안을 채우거나 빈 양식에서 씁니다. 점검표는 규칙 기반(채점 아님)입니다.

const TABS = [
  { id: 'd8', label: '8D 보고서' },
  { id: 'why', label: '5 Why' },
  { id: 'fish', label: '피시본' },
]

export default function EngineerReport({ onOpenField }) {
  const { list, open } = useReports()
  const field = useStore(fieldStore)
  const current = list.find((r) => r.id === open) ?? null
  const finished = FIELD_CASES.filter((c) => field[c.id]?.run?.done)

  return (
    <section className="screen report-page">
      <h2>엔지니어 보고서</h2>
      <p className="muted">
        현장 문제를 정리하는 세 가지 양식입니다. <b>8D</b>로 대응 전체를, <b>5 Why</b>로 원인을 깊게, <b>피시본</b>으로 원인 후보를 넓게 봅니다. 실무 시나리오를 끝냈다면 그 기록으로 초안을 바로 만들 수 있습니다.
      </p>
      <div className="report-layout">
        <aside className="report-list card" aria-label="내 보고서">
          <div className="button-row">
            <button type="button" className="primary" onClick={() => addReport(blankReport())}>
              ＋ 빈 보고서
            </button>
          </div>
          {finished.length > 0 && (
            <label className="report-from">
              끝낸 시나리오로 초안 만들기
              <select
                value=""
                onChange={(e) => {
                  const c = FIELD_CASES.find((x) => x.id === e.target.value)
                  if (c) addReport(reportFromRun(c, field[c.id].run))
                }}
              >
                <option value="">시나리오 고르기…</option>
                {finished.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} {c.title}
                  </option>
                ))}
              </select>
            </label>
          )}
          {list.length === 0 ? (
            <p className="muted">아직 보고서가 없습니다.</p>
          ) : (
            <ul>
              {list.map((r) => (
                <li key={r.id}>
                  <button type="button" className={r.id === open ? 'on' : ''} onClick={() => openReport(r.id)}>
                    <strong>{r.title}</strong>
                    <small className="muted">{new Date(r.updatedAt).toLocaleDateString('ko-KR')}</small>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>
        <div className="report-main">{current ? <ReportEditor key={current.id} r={current} onOpenField={onOpenField} /> : <ReportGuide />}</div>
      </div>
    </section>
  )
}

function ReportGuide() {
  return (
    <div className="card report-guide">
      <h3>어떤 양식을 언제 쓰나요?</h3>
      <dl>
        <dt>8D 보고서</dt>
        <dd>팀 구성부터 임시 조치, 근본 원인, 영구 대책, 검증, 재발 방지, 종결까지 대응 전체를 단계별로 남깁니다.</dd>
        <dt>5 Why</dt>
        <dd>
          "왜?"를 거듭 물어 근본 원인까지 내려갑니다. 답을 고쳤을 때 문제가 다시 생길 것 같다면 그 답은 근본 원인이 아니라 기여 요인이므로 계속 묻습니다. 보통 3~5번, 그 이상 걸리기도 합니다. <Cites keys={['cms-five-whys']} />
        </dd>
        <dt>피시본 (특성 요인도)</dt>
        <dd>
          물고기 머리에 문제(결과)를 쓰고, 뼈에 분류별 원인 후보를 붙입니다. 미처 생각하지 못한 원인까지 넓게 떠올리게 해 주고, 5 Why와 함께 쓰는 경우가 많습니다. <Cites keys={['cms-fishbone']} />
        </dd>
      </dl>
      <p className="muted">8D 단계 이름은 널리 쓰이는 양식을 따랐으며, 앱에서 원문 출처를 확인하지 못했습니다(검수 전).</p>
    </div>
  )
}

function ReportEditor({ r, onOpenField }) {
  const [tab, setTab] = useState('d8')
  const [copied, setCopied] = useState(false)
  const checks = reportChecks(r)
  const okCount = checks.filter((k) => k.ok).length
  const set = (patch) => updateReport(r.id, patch)

  const toNote = () => {
    const note = addNote({ title: `보고서: ${r.title}`, body: reportMarkdown(r), ref: null, tags: ['보고서'], style: { icon: '🧾', cover: 'night' } })
    markActive()
    openNotePage(note.id)
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(reportMarkdown(r))
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="report-editor">
      <div className="report-head card">
        <input className="report-title" value={r.title} onChange={(e) => set({ title: e.target.value })} aria-label="보고서 제목" />
        {r.caseId && (
          <p className="muted">
            <span className="scenario-tag">교육용 가상 사례</span> {r.caseId} 시나리오 기록으로 만든 초안입니다.{' '}
            {onOpenField && (
              <button type="button" className="link" onClick={() => onOpenField(r.caseId, r.caseId.slice(0, 3))}>
                시나리오 다시 보기 →
              </button>
            )}
          </p>
        )}
        <div className="tabs" role="tablist">
          {TABS.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={`tab${tab === t.id ? ' tab-active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'd8' && (
        <div className="d8-grid">
          {D8_STEPS.map((s) => (
            <label key={s.id} className="d8-step card">
              <strong>{s.label}</strong>
              <small className="muted">{s.hint}</small>
              <textarea rows={s.id === 'd1' || s.id === 'd8' ? 2 : 4} value={r.d8[s.id]} onChange={(e) => set((x) => ({ d8: { ...x.d8, [s.id]: e.target.value } }))} />
            </label>
          ))}
        </div>
      )}

      {tab === 'why' && <WhyEditor r={r} set={set} />}
      {tab === 'fish' && <FishEditor r={r} set={set} />}

      <div className="report-checks card">
        <h4>
          작성 점검 <span className={`status ${okCount === checks.length ? 'ok' : 'info'}`}>{okCount}/{checks.length}</span>
        </h4>
        <ul>
          {checks.map((k) => (
            <li key={k.q} className={k.ok ? 'ok' : ''}>
              {k.ok ? '✓' : '○'} {k.q}
            </li>
          ))}
        </ul>
        <p className="muted">점수가 아니라 빠진 곳을 찾는 규칙 기반 점검입니다.</p>
      </div>

      <div className="button-row">
        <button type="button" className="primary" onClick={toNote}>
          📝 내 노트로 보내기
        </button>
        <button type="button" onClick={copy}>
          {copied ? '✓ 복사됨' : '📋 Markdown 복사 (노션용)'}
        </button>
        <button
          type="button"
          className="link danger"
          onClick={() => {
            if (window.confirm('이 보고서를 지울까요?')) deleteReport(r.id)
          }}
        >
          삭제
        </button>
      </div>
    </div>
  )
}

function WhyEditor({ r, set }) {
  const w = r.why
  const patch = (p) => set((x) => ({ why: { ...x.why, ...p } }))
  return (
    <div className="why card">
      <label>
        <strong>문제 (한 문장)</strong>
        <input value={w.problem} onChange={(e) => patch({ problem: e.target.value })} placeholder="예: 3호기 생산분 X-ray 보이드 면적이 관리 기준을 넘음" />
      </label>
      <ol className="why-chain">
        {w.whys.map((v, i) => (
          <li key={i}>
            <span className="why-q">왜? {i + 1}</span>
            <input
              value={v}
              onChange={(e) => patch({ whys: w.whys.map((x, k) => (k === i ? e.target.value : x)) })}
              placeholder={i === 0 ? '문제가 왜 생겼나요?' : '바로 위 답은 왜 생겼나요?'}
            />
          </li>
        ))}
      </ol>
      <button type="button" className="link" onClick={() => patch({ whys: [...w.whys, ''] })}>
        ＋ 한 번 더 묻기
      </button>
      <label>
        <strong>근본 원인</strong>
        <textarea rows={2} value={w.roots} onChange={(e) => patch({ roots: e.target.value })} />
      </label>
      <label className="why-check">
        <input type="checkbox" checked={!!w.check} onChange={(e) => patch({ check: e.target.checked })} /> 이 근본 원인을 없애면 문제가 다시 생기지 않는다고 판단했다
      </label>
      <p className="muted">
        답을 고쳤을 때 문제가 다시 생길 것 같다면 그 답은 근본 원인이 아니라 기여 요인입니다. 근본 원인은 하나보다 많을 수 있습니다. <Cites keys={['cms-five-whys']} />
      </p>
    </div>
  )
}

function FishEditor({ r, set }) {
  const f = r.fish
  const [cat, setCat] = useState('machine')
  const [text, setText] = useState('')
  const patch = (p) => set((x) => ({ fish: { ...x.fish, ...p } }))
  const add = () => {
    if (!text.trim()) return
    patch({ items: [...f.items, { id: `f${Date.now().toString(36)}`, cat, text: text.trim(), root: false }] })
    setText('')
  }
  return (
    <div className="fish card">
      <label>
        <strong>문제 (결과 · 물고기 머리)</strong>
        <input value={f.effect} onChange={(e) => patch({ effect: e.target.value })} placeholder="해결책이 아니라 현상으로 적습니다" />
      </label>
      <FishboneSvg r={r} />
      <div className="fish-add">
        <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="분류">
          {FISH_CATS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label} ({c.en})
            </option>
          ))}
        </select>
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="원인 후보 (왜 이런 일이 생길까?)" />
        <button type="button" onClick={add}>
          추가
        </button>
      </div>
      <ul className="fish-items">
        {f.items.map((it) => (
          <li key={it.id}>
            <span className="fish-cat">{FISH_CATS.find((c) => c.id === it.cat)?.label}</span>
            <span className="fish-text">{it.text}</span>
            <label title="근본 원인으로 표시">
              <input type="checkbox" checked={it.root} onChange={(e) => patch({ items: f.items.map((x) => (x.id === it.id ? { ...x, root: e.target.checked } : x)) })} /> ★ 근본 원인
            </label>
            <button type="button" className="link" aria-label="지우기" onClick={() => patch({ items: f.items.filter((x) => x.id !== it.id) })}>
              ✕
            </button>
          </li>
        ))}
      </ul>
      <p className="muted">
        분류는 CMS 예시(장비·환경·절차·사람)를 공정에 맞게 넓힌 교육용 분류입니다. 한 원인이 여러 분류에 걸리면 여러 곳에 적어도 됩니다. <Cites keys={['cms-fishbone']} />
      </p>
    </div>
  )
}

// 피시본 그림: 위 3개·아래 3개 뼈, 각 뼈에 원인 최대 3개(넘치면 "+n")
function FishboneSvg({ r }) {
  const W = 720
  const H = 300
  const spineY = 150
  const head = 600
  const bones = FISH_CATS.map((c, i) => {
    const top = i < 3
    const x = 130 + (i % 3) * 160
    return { ...c, top, x, items: r.fish.items.filter((it) => it.cat === c.id && it.text.trim()) }
  })
  const clip = (s, n = 16) => (s.length > n ? `${s.slice(0, n)}…` : s)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="fishbone" role="img" aria-label={`피시본 그림. 문제: ${r.fish.effect || '미입력'}. ${bones.map((b) => `${b.label} ${b.items.length}개`).join(', ')}`}>
      <line x1="40" y1={spineY} x2={head} y2={spineY} className="fb-spine" />
      <path d={`M${head} ${spineY - 8} L${head + 10} ${spineY} L${head} ${spineY + 8} Z`} className="fb-arrow" />
      <foreignObject x={head + 12} y={spineY - 40} width={W - head - 16} height="80">
        <div className="fb-head">{r.fish.effect || '문제(결과)'}</div>
      </foreignObject>
      {bones.map((b) => {
        const y0 = b.top ? 30 : H - 30
        const x0 = b.x - 60
        return (
          <g key={b.id}>
            <line x1={x0} y1={y0} x2={b.x + 30} y2={spineY} className="fb-bone" />
            <text x={x0} y={b.top ? y0 - 10 : y0 + 20} className="fb-cat" textAnchor="middle">
              {b.label}
            </text>
            {b.items.slice(0, 3).map((it, k) => {
              const t = (k + 1) / 4
              const bx = x0 + (b.x + 30 - x0) * t
              const by = y0 + (spineY - y0) * t
              return (
                <g key={it.id}>
                  <line x1={bx} y1={by} x2={bx + 70} y2={by} className="fb-rib" />
                  <text x={bx + 4} y={by - 4} className={`fb-item${it.root ? ' root' : ''}`}>
                    {it.root ? '★ ' : ''}
                    {clip(it.text)}
                    <title>{it.text}</title>
                  </text>
                </g>
              )
            })}
            {b.items.length > 3 && (
              <text x={b.x + 40} y={b.top ? spineY - 12 : spineY + 22} className="fb-more">
                +{b.items.length - 3}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
