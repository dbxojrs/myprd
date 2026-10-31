import { useState } from 'react'
import { advancedPackages, findAdvanced, futureTech, whyAdvanced } from '../data/advanced.js'
import { findProcess } from '../data/processes.js'
import { findPackage } from '../data/packages.js'
import { advancedAnalogies } from '../data/analogies.js'
import ReviewBadge from './ReviewBadge.jsx'
import AnalogyButton from './AnalogyButton.jsx'
import { AdvancedIllustration } from './Illustrations.jsx'
import { Term } from '../lib/terms.jsx'

const TABS = [
  { id: 'processes', label: '핵심 공정' },
  { id: 'why', label: '왜 중요한가' },
  { id: 'uses', label: '쓰이는 곳' },
  { id: 'future', label: '미래 기술' },
]

// 출처 날짜가 6개월 넘게 지났으면 검토가 필요합니다.
function isStale(sourceDate) {
  if (!sourceDate) return false
  const limit = new Date()
  limit.setMonth(limit.getMonth() - 6)
  return new Date(sourceDate) < limit
}

function basicName(basic) {
  if (basic.type === 'process') return findProcess(basic.id)?.name
  if (basic.type === 'package') return findPackage(basic.id)?.name
  return findAdvanced(basic.id)?.name
}

export default function AdvancedPackage({ onOpenProcess, onOpenPackage }) {
  const [selectedId, setSelectedId] = useState(null)
  const [tab, setTab] = useState('processes')
  const item = findAdvanced(selectedId)

  const openBasic = (basic) => {
    if (basic.type === 'process') onOpenProcess(basic.id)
    else if (basic.type === 'package') onOpenPackage(basic.id)
    else {
      setSelectedId(basic.id)
      setTab('processes')
    }
  }

  return (
    <section className="screen">
      <h2>Advanced Package</h2>
      <div className="button-row">
        {advancedPackages.map((pkg) => (
          <button
            key={pkg.id}
            type="button"
            className={pkg.id === selectedId ? 'chip chip-active' : 'chip'}
            aria-pressed={pkg.id === selectedId}
            onClick={() => {
              setSelectedId(pkg.id)
              setTab('processes')
            }}
          >
            <Term value={pkg.name} compact />
          </button>
        ))}
      </div>

      {!item ? (
        <article className="card">
          <h3>왜 첨단 패키지가 중요할까요?</h3>
          <ul>
            {whyAdvanced.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="muted">카드를 누르면 패키지별 핵심 공정과 미래 기술을 볼 수 있습니다.</p>
        </article>
      ) : (
        <article className="card">
          <h3>
            <Term value={item.name} />
          </h3>
          <AdvancedIllustration id={item.id} />
          <div className="tabs" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={tab === t.id ? 'tab tab-active' : 'tab'}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="tab-body" role="tabpanel">
            {tab === 'processes' && (
              <ul>
                {item.processes.map((p) => (
                  <li key={p.en}>
                    <Term value={p} />
                  </li>
                ))}
              </ul>
            )}
            {tab === 'why' && <p>{item.why}</p>}
            {tab === 'uses' && <p>{item.uses.join(', ')}</p>}
            {tab === 'future' && (
              <ul>
                {futureTech
                  .filter((tech) => item.future.includes(tech.id))
                  .map((tech) => (
                    <li key={tech.id}>
                      <strong>
                        <Term value={tech.name} />
                      </strong> · 해결하려는 문제: {tech.problem}. {tech.point}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <AnalogyButton key={item.id} text={advancedAnalogies[item.id]} />
          <ReviewBadge reviewed={item.reviewed} sources={item.sources} sourceDate={item.sourceDate} />
          {isStale(item.sourceDate) && <p className="notice">출처 날짜가 6개월 넘게 지났습니다. 검토 필요.</p>}

          <h4>먼저 볼 기본 공정</h4>
          <div className="button-row">
            {item.basics.map((basic) => (
              <button key={`${basic.type}-${basic.id}`} type="button" className="chip" onClick={() => openBasic(basic)}>
                <Term value={basicName(basic)} compact />
              </button>
            ))}
          </div>
        </article>
      )}
    </section>
  )
}
