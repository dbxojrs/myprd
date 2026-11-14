import { Box, LotToken, P, Part, S, Tag } from './isoKit.jsx'

// 테스트 핸들러 + ATE 입체 그림. 구성은 review/equipment-back.md 8장의 확인된 요소를 따릅니다:
// 입력부(트레이·튜브), 온도 안정화 챔버, 픽앤플레이스·분류 암, 소켓·컨택터, 테스트 헤드, ATE 본체, 분류·T&R.
// 테스트 헤드가 핸들러에 붙는 정확한 배치는 출처로 확인하지 못해 이 앱이 정한 도식으로 그립니다.
// step: 조작 순서 단계 id(암 위치·챔버 온도·신호 표시)

export const ANCHORS = {
  input: P(1.3, 4.7, 2.0),
  soak: P(1.5, 1.9, 3.4),
  arm: P(4.4, 2.75, 5.0),
  socket: P(4.4, 2.8, 2.2),
  head: P(4.4, 2.8, 0.9),
  ate: P(8.7, 1.6, 5.6),
  sort: P(5.7, 4.7, 1.4),
}

const pts = (list) => list.map((p) => p.join(',')).join(' ')
// 암(흡착 헤드)이 머무는 x 위치(장비 좌표)
const ARM_X = { lot: 1.3, program: 4.4, burnin: 1.5, soak: 1.5, insert: 4.4, test: 4.4, sort: 5.7, pack: 5.7 }

export default function TestIso({ focus = null, lot = null, step = null, onPick, tags = true }) {
  const ax = ARM_X[step] ?? 4.4
  const [ox, oy] = P(4.4, 2.75)
  const [nx, ny] = P(ax, 2.75)
  const down = step === 'insert' || step === 'test'
  const heating = step === 'soak' || step === 'burnin'
  const signal = step === 'test'
  const sorting = step === 'sort' || step === 'pack'
  return (
    <svg viewBox="0 0 400 290" className="eq-iso" role="img" aria-label="테스트 핸들러와 ATE 입체 그림">
      <polygon points={pts([P(-0.5, -0.5), P(10.5, -0.5), P(10.5, 6.5), P(-0.5, 6.5)])} className="eq-floor" />
      <Box x={0} y={0} w={7} d={6} h={5.6} glass />

      {/* ATE 본체와 케이블 */}
      <Part id="ate" focus={focus} onPick={onPick} label="ATE 테스터 본체">
        <Box x={7.6} y={0.4} w={2.2} d={2.4} h={5.0} tone="rack" />
        {[1.2, 2.2, 3.2, 4.2].map((z) => (
          <polyline key={z} points={pts([P(7.6, 2.8, z), P(9.8, 2.8, z)])} className={`eq-bb-slot${signal ? ' lit' : ''}`} />
        ))}
        <polyline points={pts([P(7.6, 2.0, 0.6), P(5.4, 2.6, 0.6)])} className={`eq-bb-cable${signal ? ' run' : ''}`} />
      </Part>

      {/* 테스트 헤드 */}
      <Part id="head" focus={focus} onPick={onPick} label="테스트 헤드">
        <Box x={3.4} y={1.8} w={2.0} d={2.0} h={1.4} tone="metal" />
      </Part>

      {/* 소켓·컨택터 */}
      <Part id="socket" focus={focus} onPick={onPick} label="소켓과 컨택터">
        <Box x={3.8} y={2.2} w={1.2} d={1.2} h={0.4} z={1.4} tone="bb-jig" className={signal ? 'eq-bb-pulse' : ''} />
      </Part>

      {/* 온도 안정화 챔버 */}
      <Part id="soak" focus={focus} onPick={onPick} label="온도 안정화 챔버">
        <Box x={0.4} y={0.6} w={2.2} d={2.6} h={2.8} tone="heater" className={heating ? 'eq-bb-hot' : ''} />
      </Part>

      {/* 입력부 */}
      <Part id="input" focus={focus} onPick={onPick} label="입력부 트레이">
        <Box x={0.4} y={3.8} w={1.8} d={1.8} h={1.2} tone="metal" />
        {[0, 1, 2].map((i) => (
          <Box key={i} x={0.55} y={3.95} w={1.5} d={1.5} h={0.1} z={1.2 + i * 0.15} tone="bb-tray" />
        ))}
      </Part>

      {/* 분류 빈·T&R */}
      <Part id="sort" focus={focus} onPick={onPick} label="분류와 테이프 앤 릴">
        <Box x={4.6} y={4.0} w={1.0} d={1.5} h={0.8} tone="bb-good" />
        <Box x={5.8} y={4.0} w={1.0} d={1.5} h={0.8} tone="bb-bad" />
        {(() => {
          const [rx, ry] = P(3.4, 5.2, 0.9)
          return <ellipse cx={rx} cy={ry} rx={0.9 * S} ry={0.9 * S} className={`eq-bb-reel${step === 'pack' ? ' spin' : ''}`} />
        })()}
      </Part>

      {/* 픽앤플레이스 암: 레일 위를 이동, 소켓 위에서 내려감 */}
      <Part id="arm" focus={focus} onPick={onPick} label="픽앤플레이스 암">
        <Box x={0.6} y={2.6} w={6.0} d={0.3} h={0.3} z={4.6} tone="metal" />
        <g className="eq-bb-head" style={{ transform: `translate(${nx - ox}px, ${ny - oy}px)` }}>
          <g className={`eq-bb-nozzle${down ? ' down' : ''}`} style={{ '--down': `${2.2 * S}px` }}>
            <Box x={4.1} y={2.45} w={0.6} d={0.6} h={0.9} z={3.7} tone="gas" />
            <Box x={4.2} y={2.55} w={0.4} d={0.4} h={0.12} z={3.58} tone={sorting ? 'bb-good' : 'bb-strip'} />
          </g>
        </g>
      </Part>

      {tags && (
        <g className="eq-tags">
          <Tag at={ANCHORS.input} dx={-30} dy={30} anchor="end">입력 트레이</Tag>
          <Tag at={ANCHORS.soak} dx={-30} dy={-20} anchor="end">온도 안정화 챔버</Tag>
          <Tag at={ANCHORS.arm} dx={-10} dy={-40}>픽앤플레이스 암</Tag>
          <Tag at={ANCHORS.socket} dx={0} dy={72}>소켓·컨택터</Tag>
          <Tag at={ANCHORS.head} dx={-62} dy={40} anchor="end">테스트 헤드</Tag>
          <Tag at={ANCHORS.ate} dx={20} dy={-36} anchor="start">ATE 테스터</Tag>
          <Tag at={ANCHORS.sort} dx={62} dy={22} anchor="start">분류·T&amp;R</Tag>
        </g>
      )}
      <LotToken at={lot ? ANCHORS[lot] : null} />
    </svg>
  )
}
