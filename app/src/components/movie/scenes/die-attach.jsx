import { anim, Callout, Heat, Tag, loop } from '../kit.jsx'

// 다이 어태치 애니메이션 그림(직접 그린 옆모습). 자막은 data/processMovies/die-attach.js

// 테이프 위의 다이를 아래 핀이 밀어 올리고, 위의 콜릿이 진공으로 집어 올림
const Pick = ({ B }) => (
  <g>
    <rect x="20" y="120" width="280" height="8" className="mv-dtape" />
    {[40, 100, 220].map((x) => (
      <rect key={x} x={x} y="106" width="50" height="14" className="m-si" />
    ))}
    {/* 집어 올릴 다이 */}
    <g style={anim('mv-lift', B(1), 1.6)}>
      <rect x="160" y="106" width="50" height="14" className="m-si" />
    </g>
    {/* 아래 이젝터 핀 */}
    <g style={anim('mv-pinup', 0.6, 1)}>
      <rect x="182" y="128" width="6" height="30" className="mv-pin" />
    </g>
    {/* 위 콜릿 */}
    <g style={anim('mv-colletdown', 0.2, 1.2)}>
      <g style={anim('mv-lift', B(1), 1.6)}>
        <rect x="170" y="70" width="30" height="34" rx="3" className="mv-collet" />
        <path d="M185 40 V70" className="mv-line" />
        <Tag x={210} y={84}>
          집어 올림
        </Tag>
      </g>
    </g>
    <Callout x={185} y={142} tx={240} ty={150} text="아래에서 밀어 올림" at={0.8} />
    <Tag x={90} y={60} anchor="middle" at={B(2)} strong>
      다이 하나씩 집어 옮김
    </Tag>
  </g>
)

// 접착제(페이스트 또는 필름) 위에 다이를 내려놓음
const Place = ({ B }) => (
  <g>
    <rect x="30" y="122" width="260" height="14" rx="2" className="mv-frame" />
    <Tag x={160} y={133} anchor="middle" at={0}>
      리드프레임 / 기판
    </Tag>
    {/* 페이스트 점 */}
    {[130, 160, 190].map((x, i) => (
      <circle key={x} cx={x} cy="119" r="4" className="mv-epoxy" style={anim('mv-drop', 0.4 + i * 0.3, 0.6)} />
    ))}
    <g style={anim('mv-fade', 0.2, 0.4)}>
      <path d="M160 30 V60" className="mv-line" />
      <rect x="152" y="60" width="16" height="22" rx="2" className="mv-soft" />
      <Tag x={176} y={74}>
        디스펜서
      </Tag>
    </g>
    {/* 다이 내려옴 + 접착제 퍼짐 */}
    <g style={anim('mv-placedown', B(1), 1.4)}>
      <rect x="120" y="102" width="80" height="14" className="m-si" />
    </g>
    <g className="mv-box center" style={anim('mv-widen', B(1) + 1.2, 0.8)}>
      <rect x="116" y="116" width="88" height="6" className="mv-epoxy" />
    </g>
    <Callout x={204} y={119} tx={250} ty={96} text="접착제" at={B(2)} anchor="end" />
  </g>
)

// 열로 굳히기 + 보이드
const Cure = ({ B }) => (
  <g>
    <rect x="30" y="122" width="260" height="14" rx="2" className="mv-frame" />
    <rect x="116" y="116" width="88" height="6" className="mv-epoxy" />
    <rect x="120" y="102" width="80" height="14" className="m-si" />
    <Heat xs={[90, 140, 190, 240]} y={60} at={0.3} />
    <Tag x={160} y={40} anchor="middle" at={0.3} strong>
      열을 가해 접착제를 굳힘(경화)
    </Tag>
    <g style={anim('mv-fade', B(1), 0.5)}>
      <ellipse cx="150" cy="119" rx="6" ry="2" className="mv-void-bubble" style={loop('mv-pulse', B(1), 1.2)} />
    </g>
    <Callout x={150} y={119} tx={70} ty={150} text="빈틈(보이드): 열·접착 약화" at={B(1) + 0.2} />
  </g>
)

export default {
  id: 'die-attach',
  scenes: {
    pick: { beat: 3.6, draw: (B) => <Pick B={B} />, legend: ['si'] },
    place: { beat: 3.6, draw: (B) => <Place B={B} />, legend: ['si'] },
    cure: { beat: 3.6, draw: (B) => <Cure B={B} />, legend: ['si'] },
  },
}
