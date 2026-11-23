import { anim, Callout, Tag, loop } from '../kit.jsx'

// 최종(패키지) 테스트 애니메이션 그림(직접 그린 그림). 자막은 data/processMovies/test.js

// 핸들러가 패키지를 소켓에 넣고 테스터가 검사
const Handler = ({ B }) => (
  <g>
    <rect x="30" y="134" width="260" height="16" rx="3" className="mv-card" />
    <Tag x={160} y={146} anchor="middle" at={0}>
      테스트 보드 · 테스터와 연결
    </Tag>
    <rect x="130" y="112" width="60" height="22" rx="3" className="mv-socket" />
    {Array.from({ length: 6 }, (_, i) => (
      <rect key={i} x={140 + i * 8} y="108" width="2" height="6" className="mv-needle-r" />
    ))}
    <g style={anim('mv-handler', 0.4, B(1) + 1)}>
      <path d="M160 0 V60" className="mv-line" />
      <rect x="146" y="60" width="28" height="22" rx="3" className="mv-collet" />
      <rect x="140" y="82" width="40" height="14" rx="2" className="mv-emc" />
    </g>
    <Callout x={186} y={120} tx={240} ty={96} text="소켓(핀이 패키지 단자와 닿음)" at={0.6} anchor="end" />
    <Tag x={60} y={40} anchor="middle" at={B(1)} strong>
      패키지를 뒤집어 소켓에 넣음
    </Tag>
    <g style={anim('mv-fade', B(2), 0.4)}>
      <path d="M190 140 C230 140 240 100 240 66" className="mv-signal" style={loop('mv-flow', B(2), 0.5)} />
      <Tag x={240} y={60} anchor="middle" at={0}>
        전기 신호로 기능·속도 검사
      </Tag>
    </g>
  </g>
)

// 온도 조건과 번인 보드
const Temp = ({ B }) => (
  <g>
    <rect x="40" y="40" width="240" height="100" rx="8" className="mv-oven" />
    {Array.from({ length: 3 }, (_, r) =>
      Array.from({ length: 8 }, (_, c) => <rect key={`${r}-${c}`} x={56 + c * 27} y={56 + r * 26} width="18" height="14" rx="2" className="mv-emc" />),
    )}
    <g style={anim('mv-fade', 0.3, 0.6)}>
      <rect x="40" y="40" width="240" height="100" rx="8" className="mv-heatwash" style={loop('mv-pulse', 0.3, 1.6, 'ease-in-out')} />
    </g>
    <Tag x={160} y={30} anchor="middle" at={0.2} strong>
      번인: 높은 온도·전압으로 약한 칩을 걸러 냄
    </Tag>
    <Tag x={160} y={152} anchor="middle" at={B(1)}>
      높은 온도·낮은 온도에서도 동작을 확인
    </Tag>
  </g>
)

// 결과에 따라 나누기
const Sort = ({ B }) => (
  <g>
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const bad = i === 2 || i === 5
      return (
        <g key={i} style={{ ...anim(bad ? 'mv-tobad' : 'mv-togood', 0.4 + i * 0.4, 1), '--tx': `${bad ? 90 : -90}px` }}>
          <rect x={146} y={30} width="28" height="16" rx="2" className="mv-emc" />
          <rect x={146} y={30} width="28" height="16" rx="2" className={bad ? 'mv-die-bad' : 'mv-die-good'} opacity="0.5" />
        </g>
      )
    })}
    <rect x="30" y="110" width="80" height="34" rx="4" className="mv-bin good" />
    <rect x="210" y="110" width="80" height="34" rx="4" className="mv-bin bad" />
    <Tag x={70} y={132} anchor="middle" at={0}>
      양품
    </Tag>
    <Tag x={250} y={132} anchor="middle" at={0}>
      불량
    </Tag>
    <g style={anim('mv-fade', B(1), 0.5)}>
      <circle cx="160" cy="90" r="10" className="mv-soft" />
      <circle cx="160" cy="90" r="4" className="mv-ball" />
      <Tag x={160} y={108} anchor="middle">
        외관 검사(카메라)
      </Tag>
    </g>
    <Tag x={160} y={70} anchor="middle" at={B(2)} strong>
      결과는 앞 공정으로 되돌려 알림
    </Tag>
  </g>
)

export default {
  id: 'test',
  scenes: {
    handler: { beat: 3.6, draw: (B) => <Handler B={B} /> },
    temp: { beat: 3.6, draw: (B) => <Temp B={B} /> },
    sort: { beat: 3.6, draw: (B) => <Sort B={B} /> },
  },
}
