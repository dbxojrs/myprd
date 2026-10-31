import { packages, findPackage } from '../data/packages.js'
import { packageAnalogies } from '../data/analogies.js'
import ReviewBadge from './ReviewBadge.jsx'
import AnalogyButton from './AnalogyButton.jsx'
import { PackageIllustration } from './Illustrations.jsx'
import { Term } from '../lib/terms.jsx'

export default function PackageSelect({ packageId, onSelect, onStart }) {
  const pkg = findPackage(packageId)

  return (
    <section className="screen">
      <h2>학습할 패키지를 고르세요</h2>
      <div className="button-row">
        {packages.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === packageId ? 'chip chip-active' : 'chip'}
            aria-pressed={item.id === packageId}
            onClick={() => onSelect(item.id)}
          >
            <Term value={item.name} compact />
          </button>
        ))}
      </div>

      {!pkg ? (
        <p className="placeholder">패키지를 누르면 설명이 보입니다.</p>
      ) : (
        <article className="card">
          <h3>
            <Term value={pkg.name} />{' '}
            <span className="muted">
              · <Term value={pkg.substrate} />
            </span>
          </h3>
          <PackageIllustration id={pkg.id} />
          <dl className="facts">
            <dt>장점</dt>
            <dd>{pkg.strengths.join(', ')}</dd>
            <dt>쓰이는 곳</dt>
            <dd>{pkg.uses.join(', ')}</dd>
            <dt>흐름의 특징</dt>
            <dd>{pkg.flowNote}</dd>
          </dl>
          <AnalogyButton key={pkg.id} text={packageAnalogies[pkg.id]} />
          <ReviewBadge reviewed={pkg.reviewed} sources={pkg.sources} />
          {pkg.flow ? (
            <button type="button" className="primary" onClick={onStart}>
              이 패키지로 학습 시작
            </button>
          ) : (
            <p className="notice">설명만 제공합니다. 공정 상세는 준비 중입니다.</p>
          )}
        </article>
      )}
    </section>
  )
}
