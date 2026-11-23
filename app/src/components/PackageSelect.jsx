import { packages, findPackage } from '../data/packages.js'
import { packageAnalogies } from '../data/analogies.js'
import ReviewBadge from './ReviewBadge.jsx'
import AnalogyButton from './AnalogyButton.jsx'
import { PackageIllustration } from './Illustrations.jsx'
import { Term } from '../lib/terms.jsx'
import PackageGuide from './PackageGuide.jsx'

export default function PackageSelect({ packageId, onSelect, onStart, onOpenProcess }) {
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
          <PackageGuide id={pkg.id} onOpenProcess={onOpenProcess} />
          {pkg.flow ? (
            <button type="button" className="primary" onClick={onStart}>
              이 패키지로 흐름도·라인 시뮬레이션 시작
            </button>
          ) : (
            <p className="notice">
              위 후공정 순서에서 단계를 눌러 공정마다 자세히 볼 수 있습니다. PKG 공정 흐름도와 라인 시뮬레이션은 아직 QFN 기준으로만 만들어져 있습니다.
            </p>
          )}
        </article>
      )}
    </section>
  )
}
