import { wholeFlow } from '../data/packages.js'
import { findProcess } from '../data/processes.js'
import { MENU_GROUPS } from './menu.js'
import { Term } from '../lib/terms.jsx'

// 홈 화면. 카테고리(배우기·실습·심화)별로 화면을 고르고, 전체 학습 진도와 이어서 볼 공정을 보여줍니다.
export default function Home({ pkg, completed, onGo, onOpenProcess }) {
  const order = wholeFlow(pkg)
  const done = order.filter((id) => completed.includes(id)).length
  const nextId = order.find((id) => !completed.includes(id))

  return (
    <section className="screen">
      <article className="card home-hero">
        <h2>무엇부터 볼까요?</h2>
        <p className="muted">
          카테고리를 골라 시작하세요. 처음이라면 <strong>전체 지도</strong>에서 큰 순서를 먼저 보고, 공정 설명 아래의 "다음 공정"
          버튼을 따라가면 처음부터 끝까지 차례로 배울 수 있습니다.
        </p>
        <div className="home-progress">
          <span>
            전체 공정 학습 {done} / {order.length}
          </span>
          <div className="home-progress-bar" aria-hidden="true">
            <span style={{ width: `${(done / order.length) * 100}%` }} />
          </div>
        </div>
        <div className="button-row">
          {nextId && (
            <button type="button" className="primary" onClick={() => onOpenProcess(nextId)}>
              {done === 0 ? '처음부터 학습' : '이어서 학습'}: <Term value={findProcess(nextId).name} compact /> →
            </button>
          )}
          <button type="button" onClick={() => onGo('map')}>
            전체 지도 보기
          </button>
        </div>
      </article>

      {MENU_GROUPS.map((group) => (
        <section key={group.id} className="home-group" aria-labelledby={`home-${group.id}`}>
          <h3 id={`home-${group.id}`}>
            <span aria-hidden="true">{group.icon}</span> {group.label}
          </h3>
          <p className="muted">{group.desc}</p>
          <div className="home-cards">
            {group.items.map((item) => (
              <button key={item.id} type="button" className="home-card" onClick={() => onGo(item.id)}>
                <strong>{item.label} →</strong>
                <span>{item.desc}</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </section>
  )
}
